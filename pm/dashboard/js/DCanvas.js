define([
  "oss_core/pm/dashboard/js/class",
], function() {

  var defaultOption = {};
  var TypeMapping = {
    'bar': "oss_core/pm/dashboard/js/glibs/GNode",
  }

  var DCanvas = Class.extend({
    init: function(options) {
      this.options = $.extend(true,{}, options, defaultOption);
      this.nodes = [];
      this.initCanvas();
    },
    initCanvas: function() {
      this.$canvasDom = $(this.options.containment);
      this.$canvasDom.width(this.options.tSize.w);
      this.$canvasDom.height(this.options.tSize.h);
      this.factor = this.options.oSize.w / this.options.tSize.w;
    },

    addNode: function(node_config) {
      var self = this;
      var type = TypeMapping[node_config.type];
      require([type], function(Node) {
        var node = new Node({
          'canvas': self.$canvasDom
        })
        node.id = fish.getUUID();
        self.nodes[node.id] = node;
        console.log(self.nodes);
      });
    }

  });

  return DCanvas

});
