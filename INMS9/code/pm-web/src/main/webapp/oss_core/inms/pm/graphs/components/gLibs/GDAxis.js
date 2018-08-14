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

  GLine.prototype.getMaxMin2 = function(config) {
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
    console.log("axisPage axisPage", axisPage);
    var y2 = axisPage.y2 || 'c';
    var y2Name = axisPage.y2Name || '';
    var y2Min = axisPage.y2Min || 'a';
    var y2Max = axisPage.y2Max || 'a';
    if (y2 == 'o') {
      MaxMin.name = y2Name;
      var min = Number(y2Min);
      var max = Number(y2Max);
      if (!fish.isNaN(min)) {
        MaxMin.min = min;
      }
      if (!fish.isNaN(max)) {
        MaxMin.max = max;
      }
    }
    return MaxMin;
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
    result.yAxisData = config.xAxis
    if (config.xAxisFlag == 'P') {
      result.series = fish.map(selItems, function(d) {
        var result = {
          name: d.name + "(" + d.type + ")",
          type: 'bar',
          data: []
        }
        var yType = d.yType || 0;
        if (yType == 1) {
          result.type = "line";
          result.yAxisIndex = 1;
        }
        result.data = fish.pluck(config.data, d.value + "_" + d.type);
        return result
      })
    } else {
      result.yAxisData = [""]
      result.series = fish.map(selItems, function(d, i) {
        var result = {
          name: d.name + "(" + d.type + ")",
          type: 'bar',
          data: []
        }
        var yType = d.yType || 0;
        if (yType == 1) {
          result.type = "line";
          result.yAxisIndex = 1;
        }
        result.data = [fish.random(10, 20)];
        return result
      })

    }

    console.log("find result", result);
    return result;
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
    result.yAxisData = fish.map(fish.pluck(config.data, "xName"), function(d) {
      return util.timetrans(Number(d));
    });
    var yAxisData = result.yAxisData;
    result.series = fish.map(selItems, function(d, i) {
      console.log("yAxisData", d);
      var result = {
        name: d.name + "(" + d.type + ")",
        type: 'bar',
        data: []
      }
      var yType = d.yType || 0;
      if (yType == 1) {
        result.type = "line";
        result.yAxisIndex = 1;
      }
      if (d.type == 'all') {
        result.name = d.name;
        result.data = fish.map(config.data, function(item) {
          return item[d.value]
        })
      } else {
        var value = config.aggr[d.value][d.type];
        result.data = fish.map(yAxisData, function() {
          return value
        })
      }
      result.color = d.color
      return result
    })
    return result;
  }
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var MaxMin = this.getMaxMin(config);
    var MaxMin2 = this.getMaxMin2(config);
    var lengedConfig = config.lengedPage || {};
    var legnedConfig = util.getLegned(lengedConfig);
    if (legnedConfig.open) {
      legnedConfig.data = result.legend
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
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: legnedConfig,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      yAxis: [
        {
          type: 'value',
          name: MaxMin.name,
          min: MaxMin.min,
          max: MaxMin.max
        }, {
          type: 'value',
          name: MaxMin2.name,
          min: MaxMin2.min,
          max: MaxMin2.max
        }
      ],
      xAxis: {
        type: 'category',
        data: result.yAxisData
      },
      series: seriersResult
    };

    myChart.setOption(option);
  }
  return GLine
});
