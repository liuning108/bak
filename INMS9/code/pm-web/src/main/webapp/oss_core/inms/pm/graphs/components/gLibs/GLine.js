define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GLine = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GLine.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GLine.prototype.remove = function() {
    this.$el.html("");
  }
  GLine.prototype.getNotTimeResult = function(config) {
    var result = {}
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });
    result.legend = fish.map(selItems, function(d) {
      if (d.type == 'all') {
        return {"name": d.name};
      } else {
        return {
          name: d.name + "(" + d.type + ")"
        }
      }
    })
    result.xAxis = [
      {
        type: 'category',
        data: config.xAxis
      }
    ]
    console.log("Line config data", config.data)
    if (config.xAxisFlag == "C") {

      result.series = fish.map(config.data, function(d, i) {
        var res = {
          name: d.xName,
          type: 'line',
          data: []
        }
        res.data = fish.range(config.data.length, 0);
        res.data[i] = d[d.type];
        return res;
      })
    } else {
      result.series = fish.map(selItems, function(d) {
        var res = {
          name: d.name + "(" + d.type + ")",
          type: 'line',
          data: []
        }
        res.data = fish.pluck(config.data, d.value + "_" + d.type);
        return res;
      })
    }
    console.log("Line result ", result);
    return result
  }
  GLine.prototype.createResult = function(config) {
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    result.legend = fish.map(selItems, function(d) {
      if (d.type == 'all') {
        return {"name": d.name};
      } else {
        return {
          name: d.name + "(" + d.type + ")"
        }
      }
    })
    var startMin = fish.min(fish.pluck(config.data, 'xName'));
    var endMax = fish.max(fish.pluck(config.data, 'xName'));
    var axisLabel = util.getAxisLabel(config);
    result.xAxis = [
      {
        type: 'value',
        "min": startMin,
        "max": endMax,
        splitNumber: 10,
        axisPointer: {
          label: {
            formatter: function(params) {
              return util.timetrans(Number(params.value));
            }
          }
        },

        axisLabel: {
          fontSize: 10,
          interval: axisLabel.i,
          margin: 10,
          rotate: axisLabel.r,
          formatter: function(params) {
            return util.timetrans(Number(params));
          }
        }
      }
    ],
    result.series = fish.map(selItems, function(d) {
      var result = {
        name: d.name + "(" + d.type + ")",
        type: 'line',
        data: []
      }
      if (d.type == 'all') {
        result.name = d.name;
        result.data = fish.map(config.data, function(item) {
          return [
            item.xName,
            item[d.value]
          ]
        })
      } else {
        var value = config.aggr[d.value][d.type];
        result.data = [
          [
            startMin, value
          ],
          [
            (startMin + endMax) / 2,
            value
          ],
          [
            endMax, value
          ]
        ];
      }
      result.color = d.color
      return result
    })
    return result;
  }
  GLine.prototype.getMaxMin = function(config) {
    console.log("getMaxMin", config);
    var MaxMin = {
      name: '',
      min: function(value) {
        if (value.min == 0) {
          return 0;
        }
        var min = parseInt(value.min - (value.min * 0.1));
        if (min > 0 || min == 0) {
          return min;
        } else {
          return value.min;
        }
      },
      max: null
    }
    var axisPage = config.axisPage || {};
    var y1 = axisPage.y1 || 'c';
    var y1Name = axisPage.y1Name || '';
    var y1Min = axisPage.y1Min || 'a';
    var y1Max = axisPage.y1Max || 'a';
    if (y1 == 'o') {
      MaxMin.name = y1Name;
      var min = Number(y1Min);
      var max = Number(y1Max);
      if (!fish.isNaN(min)) {
        MaxMin.min = min;
      }
      if (!fish.isNaN(max)) {
        MaxMin.max = max;
      }
    }
    return MaxMin;
  }
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var MaxMin = this.getMaxMin(config);
    var lengedConfig = config.lengedPage || {};
    legnedConfig = util.getLegned(lengedConfig);
    if (legnedConfig.open) {
      legnedConfig.data = result.legend
    } else {
      legnedConfig = null;
    }
    var propPageConfig = config.propPage || {};
    propPageConfig = util.getPropPage(propPageConfig)
    seriersResult=result.series
    if(propPageConfig.showlable=='o'){
      var seriersResult = fish.map(result.series, function(d) {
        d.itemStyle = {
          normal: {
            label: {
              show: true
            }
          }
        };
        return d;
      });
    }
    var axisLabel = util.getAxisLabel(config);
    var gridConfig =null;
    if(axisLabel.h){
       gridConfig={
          y2:axisLabel.h
       }
    }
    option = {
      grid:gridConfig,
      dataZoom: propPageConfig.dataZoom,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        },
        // formatter : function (params) {
        //   console.log(params)
        //     return "hehe"
        // }
      },
      legend: legnedConfig,
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataZoom: {
      //       show: true
      //     },
      //     restore: {
      //       show: true
      //     },
      //     saveAsImage: {
      //       show: false
      //     }
      //   }
      // },
      //calculable: true,
      xAxis: result.xAxis,
      yAxis: [
        {
          type: 'value',
          name: MaxMin.name,
          min: MaxMin.min,
          max: MaxMin.max
          // min:88,
          // max:100
        }
      ],
      series: seriersResult
    };
    console.log("result.xAxisresult.xAxisresult.xAxisresult.xAxis",result.xAxis);
    myChart.setOption(option);
  }
  return GLine
});
