define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(GNode,echarts) {

  var GImageNode = GNode.extend({
    createGNode:function(){
        var self =this;
        this.myChart ={resize:function(){}}
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.append('<div class="GImage"></div>')
        var url='url('+self.attrs.src+')'
        $divContext.find(".GImage").css({
            'background-image': url
        })
    }

  });

  return GImageNode
})
