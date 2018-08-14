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
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });

    if (config.xAxisFlag == "P") {
      var firstItem = selItems[0];
      var result = {}
      result.legend = config.xAxis;
      result.datas = fish.map(config.data, function(d) {
        return {
          name: d.xName || "",
          value: d[firstItem.value+"_"+firstItem.type] || "",
        }
      })
    } else {
      var result = {}
      result.legend = config.xAxis;
      console.log("result.legend 33",  result.legend);
      result.datas = fish.map(config.data, function(d) {
        return {
          name: d.xName || "",
          value: d[d.type] || "",
        }
      })
      result.color=fish.pluck(selItems,'color');
      console.log("result.legend  selItems 222",result.legend);
    }

    return result;
  }
  GLine.prototype.createResult = function(config) {
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    var firstItem = selItems[0];
    if (firstItem.type == 'all') {
      console.log("firstItem.type", config.data)
      result.legend = fish.map(fish.pluck(config.data, "xName"), function(d, i) {
        return "" + util.timetrans(Number(d));
      });
      console.log("result.legend", result.legend);
      result.datas = fish.map(config.data, function(d, i) {
        return {
          "name": "" + util.timetrans(Number(d.xName)),
          "value": d[firstItem.value]
        }
      })
    } else {
      var maxTime = fish.max(fish.pluck(config.data, "xName"));
      var legendName = util.timetrans(Number(maxTime));
      result.legend = [legendName];
      result.datas = [
        {
          value: config.aggr[firstItem.value][firstItem.type] || 0,
          name: legendName
        }
      ]
    }

    return result;
  }
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var lengedConfig =config.lengedPage||{};
    var legnedConfig  = util.getLegned(lengedConfig);
    if(legnedConfig.open){
      legnedConfig.data=result.legend
    }else{
      legnedConfig=null;
    }
    var option = {
      tooltip: {
        trigger: 'item'
      },
      legend: legnedConfig,
      series: [
        {
          color:result.color,
          type: 'pie',
          radius: '70%',
          center: [
            '50%', '50%'
          ],
          selectedMode: 'single',
          data: result.datas,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
  return GLine
});
