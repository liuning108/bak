define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GGauge = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GGauge.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GGauge.prototype.remove = function() {
    this.$el.html("");
  }
  GGauge.prototype.getNotTimeResult = function(config) {
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
      result.data=[{
        name:"",
        value:0,
      }]
      return result;
    } else {

      if(config.data.length>0){
        var first = config.data[0]
        result.data=[{
          name: first.xName,
          value: first[first.type],
        }]
      }else{
        result.data=[{
          name:"",
          value:0,
        }]
      }
      return result;
    }

    console.log("find result", result);
    return result;
  }
  GGauge.prototype.createResult = function(config) {
    var result = {};
    if (config.xAxisFlag != "T") {
      return this.getNotTimeResult(config);
    }
    var selItems = config.selItems
    var selItems = fish.filter(config.selItems, function(d) {
      return d.type != 'all';
    });
    if(selItems.length>0){
      var first = selItems[0]
      result.data=[{
        name: first.name+"("+first.type+")",
        value:config.aggr[first.value][first.type],
      }]
    }else{
      result.data=[{
        name:"",
        value:0,
      }]
    }
    return result;
  }
  GGauge.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);

    var option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}"
      },
      series: [
        {
          name: '',
          type: 'gauge',
          detail: {
            formatter: '{value}'
          },
          data: result.data
        }
      ]
    };
    myChart.setOption(option);
  }
  return GGauge
});
