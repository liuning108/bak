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
    result.yAxisData = config.xAxis
    if(config.xAxisFlag=='P'){
       result.series = fish.map(selItems, function(d) {
          var result = {
            name: d.name + "(" + d.type + ")",
            type: 'bar',
            data: []
          }
          result.data = fish.pluck(config.data, d.type);
          return result
        })
    }else{
      result.yAxisData=[""]
      result.series = fish.map(config.data, function(d,i) {
         var result = {
           name: d.xName,
           type: 'bar',
           data: []
         }
          result.data=[d[d.type]];
         return result
       })

    }

     console.log("find result",result);
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
    result.yAxisData = fish.map(fish.pluck(config.data,"xName"),function(d){
       return util.timetrans(Number(d));
    });
    var yAxisData=result.yAxisData;
    result.series = fish.map(selItems, function(d) {
      var result = {
        name: d.name + "(" + d.type + ")",
        type: 'bar',
        data: []
      }
      if (d.type == 'all') {
        result.name = d.name;
        result.data = fish.map(config.data, function(item) {
          return item[d.value]
        })
      } else {
        var value = config.aggr[d.value][d.type];
        result.data =fish.map(yAxisData,function(){
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
    var option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: result.legend
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: result.yAxisData
      },
      series: result.series
    };

    myChart.setOption(option);
  }
  return GLine
});
