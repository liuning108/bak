define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GScatter = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GScatter.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GScatter.prototype.remove = function() {
    this.$el.html("");
  }
  GScatter.prototype.getNotTimeResult = function(config) {
    var self = this;
    var result = {}
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });
    if (config.xAxisFlag == 'P') {
      var datas = config.data;
      result.legendDatas = fish.pluck(datas, "xName");
      result.series = fish.map(datas, function(d) {
        console.log("999999999", selItems, datas)
        var f = selItems[0];
        var s = selItems[1];
        var f_id = self.getItemId(f);
        console.log(f_id, d)
        var f_value = d[f_id];
        var s_value = f_value
        if (s) {

          var s_id = self.getItemId(s);

          s_value = d[s_id];

        }
        return {
          symbolSize: 10,
          type: 'scatter',
          name: d.xName,
          data: [
            [f_value, s_value]
          ]
        }
      });

    } else {
      var datas = config.data;
      result.legendDatas = fish.pluck(datas, "xName");
      result.series = fish.map(datas, function(d) {

        var value = d[d.type];
        return {
          symbolSize: 10,
          type: 'scatter',
          name: d.xName,
          data: [
            [value, value]
          ]
        }
      });
    }

    console.log("find result", result);
    return result;
  }
  GScatter.prototype.getMaxMin = function(config) {
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
  GScatter.prototype.createResult = function(config) {
    var self = this;
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    var aggItems = fish.filter(selItems, function(d) {
      return d.type != 'all'
    })
    var datas = fish.map(config.data, function(d) {
      d.xName = util.timetrans(Number(d.xName));
      fish.each(aggItems, function(dd) {
        d[dd.value + "_" + dd.type] = config.aggr[dd.value][dd.type];
      })
      return d;
    })
    console.log("createResultcreateResult", datas);
    result.legendDatas = fish.pluck(datas, "xName");
    console.log("result.legendDatas", result.legendDatas);
    console.log('Top selItems', selItems)
    result.series = fish.map(datas, function(d) {
      var f = selItems[0];
      var s = selItems[1];

      var f_id = self.getItemId(f);
      console.log(f_id, d)
      var f_value = d[f_id];
      var s_value = f_value
      if (s) {
        var s_id = self.getItemId(f);
        s_value = d[s_id];
      }

      return {
        symbolSize: 10,
        type: 'scatter',
        name: d.xName,
        data: [
          [f_value, s_value]
        ]
      }
    });
    console.log('Top series', result.series)
    return result;
  }
  GScatter.prototype.getItemId = function(f) {
    var id = f.value;
    if (f.type != 'all') {
      id = id + "_" + f.type
    }
    return id;
  }
  GScatter.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var MaxMin = this.getMaxMin(config);
    var lengedConfig = config.lengedPage || {};
    var legnedConfig = util.getLegned(lengedConfig);
    if (legnedConfig.open) {
      legnedConfig.data = result.legendDatas
    } else {
      legnedConfig = null;
    }
    var propPageConfig = config.propPage || {};
    propPageConfig = util.getPropPage(propPageConfig)

    seriersResult = result.series
    if (propPageConfig.showlable == 'o') {
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

    var option = {
      dataZoom: propPageConfig.dataZoom,
      tooltip: {
        trigger: 'axis',
        showDelay: 0,
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1
          }
        }
      },
      xAxis: {},
      yAxis: {
        name: MaxMin.name,
        min: MaxMin.min,
        max: MaxMin.max
      },
      legend: legnedConfig,
      series: seriersResult
    };

    myChart.setOption(option);
  }
  return GScatter;
});
