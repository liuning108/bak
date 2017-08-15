define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(GNode,echarts) {

  var TextNode = GNode.extend({
    createGNode:function(){
      var self =this;
      this.myChart ={resize:function(){}}
      var $divContext=this.gcanvas.find('.dashCanvas');

      $divContext.append('<div class="textnode" contenteditable="true"></div>')

      var textNode =$divContext.find(".textnode");
      textNode.off('blur').on("blur",function() {
         self.gcanvas.draggable( 'enable' )
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
