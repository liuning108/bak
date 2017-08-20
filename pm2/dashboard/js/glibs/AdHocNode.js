define([
  "oss_core/pm/dashboard/js/glibs/GNode",
  "oss_core/pm/dashboard/js/echarts-all-3",
], function(GNode,echarts) {

  var AdHocNode = GNode.extend({
    createGNode:function(){
        var self =this;
        this.myChart ={resize:function(){}}
        var $divContext=this.gcanvas.find('.dashCanvas');
        $divContext.append('<div class="adhocImage"></div>')

    }

  });

  return AdHocNode
})
