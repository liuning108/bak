define([], function() {
    var GRoot = Class.extend({
        init: function(option) {
            this.id = option.id;
            this.canvas = option.canvas;
            this.paper = option.paper;
            this.attrs = option.attrs;
            this.domsSet = this.paper.set();
            this.doms = {};
            this.ft = null;

            this.initAll();
        },
        initAll: function() {
            this.initElement();
            this.merge();
            this.createFt();
            this.hide();
            this.addEvent();
            this.getData();

        },
        getData:function(){
           console.log('GROOT getData ');
        },
        createFt: function() {
            this.ft = this.paper.freeTransform(this.domsSet, { keepRatio: true, 'rotate': false,attrs:{'fill':'#36b0c8','stroke':'#36b0c8'},scale:[ 'bboxCorners', 'bboxSides' ],draw:['bbox']}, function(subject, events) {});
            if (this.attrs.ft_attrs) {
                this.attrs.ft_attrs.center.x=this.ft.attrs.center.x
                this.attrs.ft_attrs.center.y=this.ft.attrs.center.y
                this.attrs.ft_attrs.size.x=this.ft.attrs.size.x
                this.attrs.ft_attrs.size.y=this.ft.attrs.size.y
                this.ft.attrs = this.attrs.ft_attrs;
            } else {
                this.initLocation();
            }
            this.ft.apply();


        },
        initLocation: function() {},
        merge: function() {
            var self = this;
            fish.each(this.doms, function(dom) {
                self.domsSet.push(dom)
            })
        },
        show: function() {

            this.domsSet.show();

        },
        hide: function() {

            this.domsSet.hide();

        },
        remove: function() {
            this.domsSet.remove();
            this.ft.unplug();
            delete this.canvas.nodes[this.id];
        },
        json: function() {
            var json = {}
            json.id = this.id;
            json.attrs = this.attrs;
            json.attrs.ft_attrs = this.ft.attrs;
            return json;
        }
    })
    return GRoot;
})
