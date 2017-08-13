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
      this.name = this.options.name|| 'DashBoardName';
    },
    initNodes: function() {
      var self = this;
      fish.each(this.options.nodes, function(node_config) {
        self.addNode(node_config)
      })

    },
    canvasResizableStop:function(event, ui) {
        this.options.size.h = ui.size.height;

    },
    initCanvas: function() {
      var self = this;
      this.$canvasDom = $(this.options.containment);
      this.$canvasDom.width(this.options.size.w);
      this.$canvasDom.height(this.options.size.h);
      this.factor = Number(this.options.factor);
      this.$canvasDom.resizable({
          handles : 's',
          stop:function(event, ui){
            self.canvasResizableStop(event, ui)
          }
      });
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
      json.id = this.options.id;
      json.name=this.name
      json.classNo = this.options.classNo
      json.userId = portal.appGlobal.get("userId")
      json.isShare= 0;
      json.state=0
      json.canvasAttrs={};
      json.attrs = {};
      json.size = this.options.size;
      json.ratio=this.options.ratio;

      json.canvasAttrs.size =this.options.size;
      json.canvasAttrs.ratio=this.options.ratio;

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
