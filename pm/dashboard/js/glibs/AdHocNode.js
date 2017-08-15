define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(GNode,echarts) {

  var AdHocNode = GNode.extend({
    createGNode:function(){
      this.myChart = echarts.init( this.gcanvas.find('.dashCanvas')[0]);
      var option = {
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };
      this.myChart.setOption(option);
    }

  });

  return AdHocNode
})
