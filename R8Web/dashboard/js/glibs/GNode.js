define([
  "oss_core/pm/dashboard/js/echarts-all-3",
  "text!oss_core/pm/dashboard/js/glibs/gnode.html",
], function(echarts,tpl) {
  var GNode = Class.extend({
    init: function(options) {
      this.options = $.extend(true, {}, options);
      this.attrs=this.options.attrs;
      this.tplFun = fish.compile(tpl),
      this.creaetGCanvas();
      this.createGNode();
    },
    autoSave:function() {
       try {
       var self =this;
       self.options.parent.options.parent.saveButton();
       }catch(e){

       }
    },
    bounceIn:function() {
      var self =this;
      self.gcanvas.addClass("bounceIn animated");
      setTimeout(function(){
         self.gcanvas.removeClass("bounceIn animated");
      },1000);
    },
    createGNode:function(){
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
    removeNode:function() {
      delete  this.options.parent.nodes[this.id]
      this.gcanvas.remove();
    },
    creaetGCanvas: function() {
      var self =this;
      var canvasDom = this.options.canvas
      this.gcanvas = $(this.tplFun()).appendTo(canvasDom);
      this.gcanvas.width(this.options.w);
      this.gcanvas.height(this.options.h);
      this.gcanvas.css({"left":this.options.x+"px"});
      this.gcanvas.css({"top":this.options.y+"px"});
      var text =parseInt(this.options.w)+"x"+parseInt(this.options.h)
      this.gcanvas.find('.dashNodeTip').text(text);

      if(!this.options.perview){
        this.editPattern();
      }


    }, //end of creaetGCanvas();

    setPageConfig:function() {
      console.log("rewrite  setPageConfig method");
    },

    setSelected:function() {
         $('.selectedNode').removeClass("selectedNode");
         this.gcanvas.addClass("selectedNode")
         this.setPageConfig();
    },

    editPattern:function() {
      var self =this;
      var canvasDom = this.options.canvas
        this.gcanvas.addClass("editPattern");

      this.gcanvas.off('click').on('click',function(e) {
           self.setSelected();
           e.stopPropagation();
      });
      this.gcanvas.find(".removeNode").off("clcik").on("click",function() {
             self.removeNode();
      })

      this.gcanvas.find(".editNode").off("clcik").on("click",function(e) {
             self.editNode();
             e.stopPropagation();
      })

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
        },
        resize:function(event, ui) {
          self.resizableResize(event, ui);
        },
      });

    },
    resizableResize:function(event, ui) {
      var w=ui.size.width;
      var h=ui.size.height;
      var text =w+"x"+h
      this.gcanvas.find('.dashNodeTip').text(text);
    },
    editNode:function() {
    console.log("editNode");
    },

    getJson:function() {
      var json={}
      console.log(this.options);
      json.type= this.options.type;
      json.w= this.options.w;
      json.h= this.options.h;
      json.x= this.options.x;
      json.y= this.options.y;
      json.attrs=this.options.attrs;


      return  json
    },

  });
  return GNode
})
