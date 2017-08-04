define([
  "oss_core/pm/dashboard/js/class",
], function() {

  var defaultOption = {};
  var TypeMapping = {
    'bar': "oss_core/pm/dashboard/js/glibs/GNode",
  }

  var DCanvas = Class.extend({
    init: function(options) {
      this.options = $.extend(true, {}, options, defaultOption);
      this.nodes = [];
      this.initCanvas();
      this.initNodes();
    },
    initNodes: function() {
      var self = this;
      fish.each(this.options.nodes, function(node_config) {
        self.addNode(node_config)
      })

    },
    initCanvas: function() {
      this.$canvasDom = $(this.options.containment);
      this.$canvasDom.width(this.options.size.w);
      this.$canvasDom.height(this.options.size.h);
      this.factor = Number(this.options.factor);
    },

    addNode: function(node_config) {
      var self = this;
      var type = TypeMapping[node_config.type];
      require([type], function(Node) {
        var node = new Node({
          'canvas': self.$canvasDom,
          'w': Number(node_config.w) * self.factor,
          'h': Number(node_config.h) * self.factor,
          'type': node_config.type,
           x:node_config.x*self.factor,
           y:node_config.y*self.factor
        })
        node.id =fish.getUUID();
        self.nodes[node.id] = node;
      });
    },
    getJson: function() {
      var self = this;
      json = {};
      json.attrs = {};
      json.size = this.options.size;
      json.radio=this.options.radio;
      json.attrs.nodes = [];
      var nodes = [];
      for (var i in self.nodes) {
        var node_confg = self.nodes[i].getJson()
        json.attrs.nodes.push(node_confg);
      }
      return json;

    }, //end of getJson

  });

  return DCanvas

});
