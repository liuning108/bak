define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(GNode,echarts) {

  var TextNode = GNode.extend({
    createGNode:function(){
      var self =this;
      this.myChart ={resize:function(){}}
      var $divContext=this.gcanvas.find('.dashCanvas');
      this.attrs.text=this.attrs.text||"";
      $divContext.append('<div class="textnode" contenteditable="true">'+this.attrs.text+'</div>')
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
