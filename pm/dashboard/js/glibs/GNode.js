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
    resizableStop:function(event, ui) {
      this.options.w=ui.size.width;
      this.options.h=ui.size.height;
       this.myChart.resize();
    },
    draggableStop:function(event, ui) {
      this.options.x=ui.position.left;
      this.options.y=ui.position.top;
    },
    creaetGCanvas: function() {
      var self =this;
      var canvasDom = this.options.canvas
      this.gcanvas = $(this.tplFun()).appendTo(canvasDom);
      this.gcanvas.width(this.options.w);
      this.gcanvas.height(this.options.h);
      this.gcanvas.css({"left":this.options.x+"px"});
      this.gcanvas.css({"top":this.options.y+"px"});



      this.gcanvas.draggable({
        containment: canvasDom,
        scroll: false,
        stop:function(event, ui){
          self.draggableStop(event, ui);
        }
      });
      this.gcanvas.resizable({
        autoHide:true,
        containment: canvasDom,
        stop: function(event, ui) {
          self.resizableStop(event, ui);
        }
      });


    }, //end of creaetGCanvas();

    getJson:function() {
      var json={}
      console.log(this.options);
      json.type= this.options.type;

      json.w= this.options.w;
      json.h= this.options.h;
      json.x= this.options.x;
      json.y= this.options.y;


      return  json
    },

  });
  return GNode
})
