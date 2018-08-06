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
  GLine.prototype.getNotTimeResult=function(config){
    var result = {}
    var selItems=fish.filter(config.selItems,function(d){
       return d.type !='all';
    });
    result.legend  = fish.map(selItems,function(d){
       if(d.type=='all'){
        return {"name":d.name};
        }else{
        return { name:d.name+"("+d.type+")"}
      }
    })
   result.xAxis=[
    {
      type:'category',
      data: config.xAxis
    }
   ]
   result.series=fish.map(selItems,function(d){
       var result ={
        name:d.name+"("+d.type+")",
        type:'line',
        data:[]
      }
      result.data =fish.pluck(config.data,d.type);
      return result
   })
    return result;
  }
  GLine.prototype.createResult = function(config) {
    var result={};
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
    result.xAxis = [
      {
        type: 'value',
        "min": startMin,
        "max": endMax,
        splitNumber: 10,
        grid: {
          y2: 140
        },
        axisPointer: {
          label: {
            formatter: function(params) {
              return util.timetrans(Number(params.value));
            }
          }
        },
        axisLabel: {
          fontSize: 10,
          interval: 0,
          lineHeight: 300,
          margin: 10,
          rotate: -30,
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
  GLine.prototype.afterRender = function() {
    var config = this.option.config;
    var result = this.createResult(config);
    var myChart = echarts.init(this.$el[0]);
    var tom = new Date();
    tom.setTime(tom.getTime() + 24 * 60 * 60 * 1000);
    var active_since = (new Date().getTime() / 1000);
    var active_till = (tom.getTime() / 1000);
    var spaceTime = (active_till - active_since) / 15
    option = {
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
      legend: {
        data: result.legend
      },
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
      calculable: true,
      xAxis: result.xAxis,
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: result.series
    };

    myChart.setOption(option);
  }
  return GLine
});
