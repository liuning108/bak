define([
    "oss_core/pm/screendesigner/js/raphael-min",
    "oss_core/pm/screendesigner/js/raphael.free_transform",
    "oss_core/pm/screendesigner/js/class",
], function() {

    var TypeMapping = {
        'rect': "oss_core/pm/screendesigner/js/graphLibs/GRect"
    };
    var uuid = function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "";
        var uuid = s.join("");
        return uuid;
    }
    var ZChartCanvas = Class.extend({
        init: function(option) {
            var self = this;
            self.w = option.w;
            self.h = option.h;
            self.dom = option.dom;
            self.paper = Raphael(self.dom);
            self.paper.setViewBox(0, 0, self.w, self.h, true);
            self.paper.setSize('100%', '100%');
            if(option.bk_attrs){
            	self.setBK(option.bk_attrs)
            }
            self.nodes = {};
            fish.each(option.nodes, function(node_config) {
                self.addNode(node_config, function() {})
            })

        },
        setBK: function(attrs) {
            var self = this;
            self.bk_attrs=attrs;
            $(self.dom).css(attrs)
        },
        setViewBox(w, h) {
            var self = this;
            self.w = w;
            self.h = h;
            self.paper.setViewBox(0, 0, self.w, self.h, true);
        },
        addNode: function(node_config, fun) {
            var self = this;
            var type = TypeMapping[node_config.attrs.type];
            require([type], function(Node) {
                var node = new Node({ 'paper': self.paper, 'attrs': node_config.attrs, 'canvas': self });
                node.id = uuid();
                node.show();
                self.nodes[node.id] = node;
                if (fun) fun();

            })

        },
        json: function() {
            var self = this;
            var json = {};
            json.w = self.w;
            json.h = self.h;
            json.bk_attrs= self.bk_attrs;
            json.nodes = [];
            fish.each(self.nodes, function(node) {
                json.nodes.push(node.json());
            })
            return json;

        }

    })
    return ZChartCanvas;
})
