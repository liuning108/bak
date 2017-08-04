define([
  "oss_core/pm/dashboard/js/echarts-all-3",
  "text!oss_core/pm/dashboard/js/glibs/gnode.html",
], function(echarts,tpl) {
  var GNode = Class.extend({
    init: function(options) {
      this.options = $.extend(true, {}, options);
      this.tplFun = fish.compile(tpl),
      this.creaetGCanvas();
      this.createGNode();
    },
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


    },
    resizableStop:function() {
      this.myChart.resize();
    },
    creaetGCanvas: function() {
      var self =this;
      var canvasDom = this.options.canvas
      this.gcanvas = $(this.tplFun()).appendTo(canvasDom);
      this.gcanvas.draggable({
        containment: canvasDom,
        scroll: false
      });
      this.gcanvas.resizable({
        containment: canvasDom,
        stop: function() {
          self.resizableStop();
        }
      });


    } //end of creaetGCanvas();

  });
  return GNode
})
