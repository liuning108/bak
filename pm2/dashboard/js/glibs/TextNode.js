define([
  "oss_core/pm/dashboard/js/glibs/views/TextNodeConfig",
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(ConfigView,GNode,echarts) {

  var TextNode = GNode.extend({


    setPageConfig:function(){
        var configView = new ConfigView(this);
        configView.render();
        $(".dashBoardConfigPanel").html(configView.$el);
        configView.afterRender();
    },

    getFontFamily:function() {
        return  this.attrs.fontFamily
    },

    getTitleColor:function() {
        return this.attrs.color;
    },
    setTitleColor:function(val) {
        this.attrs.color=""+val;
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.find('.textnode').css({
             "color": this.attrs.color
        })
    },



    setFontFamily:function(val) {
        this.attrs.fontFamily=val;
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.find('.textnode').css({
             "font-family": this.attrs.fontFamily
        })

    },


    getFontSize:function() {
        return this.attrs.fontSize;
    },

    setFontSize:function(val) {
        this.attrs.fontSize=val;
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.find('.textnode').css({
             "font-size": this.attrs.fontSize+"px"
        })

    },
    createGNode:function(){
      var self =this;
      this.myChart ={resize:function(){}}
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.text=this.attrs.text||"";
      this.attrs.fontSize =this.attrs.fontSize||12
      this.attrs.fontFamily=this.attrs.fontFamily||'Microsoft YaHei'
      this.attrs.color=this.attrs.color||'#5b5b5b'
      $divContext.append('<div class="textnode" contenteditable='+(!this.options.perview)+'>'+this.attrs.text+'</div>')
      this.setFontSize(this.attrs.fontSize);
      this.setFontFamily(this.attrs.fontFamily);
      this.setTitleColor(this.attrs.color)
     if(this.options.perview){return}
      var textNode =$divContext.find(".textnode");
      textNode.off('blur').on("blur",function() {
         self.gcanvas.draggable( 'enable' )
         self.attrs.text=$(textNode).text();
      })

      this.gcanvas.dblclick(function(){
        self.gcanvas.draggable( 'disable' )
        textNode.trigger('focus');
        var range = document.createRange();
          var sel = window.getSelection();
          range.setStart(textNode[0], 1);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
      })

      self.gcanvas.draggable( 'disable' )





    }

  });

  return TextNode
})
