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

    getFontDirection:function() {
           return this.attrs.fd;
    },

    setFontSize:function(val) {
        this.attrs.fontSize=val;
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.find('.textnode').css({
             "font-size": this.attrs.fontSize+"px"
        })

    },

    setFontDirection:function(val) {
      this.attrs.fd=val;
      var $divContext=this.gcanvas.find('.dashCanvas');
      $divContext.find('.textnode').css({
           "writing-mode": this.attrs.fd
      })
    },
    getUnderLine:function() {
      return this.attrs.fontUnderLine;
    },
    setUnderLine:function(val) {
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.fontUnderLine=val;
      if(this.attrs.fontUnderLine){
        $divContext.find('.textnode').css({
            "text-decoration":"underline"
        })
      }else{
        $divContext.find('.textnode').css({
            "text-decoration": "none"
        })
      }
    },
    getItalic:function() {
      return this.attrs.fontItalic;
    },
    setItalic:function(val) {
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.fontItalic=val;
      if(this.attrs.fontItalic){
        $divContext.find('.textnode').css({
            "font-style":"italic"
        })
      }else{
        $divContext.find('.textnode').css({
           "font-style": "normal"
        })
      }
    },

    getBold:function() {
      return this.attrs.fontBold
    },
    setBold:function(val) {
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.fontBold=val;
      if(this.attrs.fontBold){
        $divContext.find('.textnode').css({
           "font-weight": "bold"
        })
      }else{
        $divContext.find('.textnode').css({
           "font-weight": "normal"
        })
      }
    },



    createGNode:function(){
      var self =this;
      this.myChart ={resize:function(){}}
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.text=this.attrs.text||"";
      this.attrs.fontSize =this.attrs.fontSize||12
      this.attrs.fontFamily=this.attrs.fontFamily||'Microsoft YaHei'
      this.attrs.color=this.attrs.color||'#5b5b5b'
      this.attrs.fd=this.attrs.fd||'horizontal-tb'
      this.attrs.fontBold=this.attrs.fontBold||false;
      this.attrs.fontItalic=this.attrs.fontItalic||false;
      this.attrs.fontUnderLine=this.attrs.fontUnderLine||false;
      $divContext.append('<div class="textnode" contenteditable='+(!this.options.perview)+'>'+this.attrs.text+'</div>')
      this.setFontSize(this.attrs.fontSize);
      this.setFontFamily(this.attrs.fontFamily);
      this.setTitleColor(this.attrs.color)
      this.setFontDirection(this.attrs.fd)
      this.setBold(this.attrs.fontBold)
      this.setItalic(this.attrs.fontItalic);
      this.setUnderLine(this.attrs.fontUnderLine);

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
