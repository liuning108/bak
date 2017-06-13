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
            this.addBoxEvent();

            // TODO: 优化SVN
            if (this.canvas.perview) {
                this.getData(); //在预览情况下，才有动画和通过间隔来获取数据
                this.perview();
            }


        },
        addBoxEvent: function() {
            var self = this;
            if (this.doms['config']) this.doms['config'].toFront();
            if (this.doms['remove']) this.doms['remove'].toFront();
            this.gbox.hover(function() {
                this.attr({
                    'fill-opacity': 0.1
                })
            }, function() {
                this.attr({
                    'fill-opacity': 0
                })
            })
            this.gbox.click(function(e) {
                if (self.doms['config']) {
                    self.doms['config'].trigger('click', e);

                }
                e.stopImmediatePropagation();
            })
        },
        getData: function() {
            console.log('GROOT getData ');
        },
        perview: function() {
            if (this.canvas.perview) {
                this.ft.unplug();
                if (this.doms['config']) this.doms['config'].remove();
                if (this.doms['remove']) this.doms['remove'].remove();

            }
        },
        move: function() {

        },
        ftcallBack:function(subject,events){
            var self =this;
         var eve= events.join(', ').trim();
          if ('drag start'==eve){

          }
          if('drag end'==eve){

          }
        },
        createFt: function() {
            var self = this;


            var gbbox = this.domsSet.getBBox(true);
            this.gbox = this.paper.rect(gbbox.x, gbbox.y, gbbox.width, gbbox.height).attr({
                'fill': '#36b0c8',
                'fill-opacity': 0,
                'stroke-width':0
            })
            this.domsSet.push(this.gbox);

                this.ft = this.paper.freeTransform(this.domsSet, {
                    keepRatio: true,
                    'rotate': false,
                    attrs: {
                        'fill': '#1dd7fc',
                        'stroke': '#1dd7fc'
                    },
                    scale: ['bboxCorners', 'bboxSides'],
                    draw: ['bbox']
                }, function(subject, events) {
                   self.ftcallBack(subject,events)
               });

            if (this.attrs.ft_attrs) {
                this.attrs.ft_attrs.center.x = this.ft.attrs.center.x
                this.attrs.ft_attrs.center.y = this.ft.attrs.center.y
                this.attrs.ft_attrs.size.x = this.ft.attrs.size.x
                this.attrs.ft_attrs.size.y = this.ft.attrs.size.y
                this.ft.attrs = this.attrs.ft_attrs;
            } else {
                this.initLocation();
            }
            this.ft.apply();


        },
        initLocation: function() {},
        merge: function() {
            var self = this;
            fish.each(this.doms, function(dom,index) {
                self.domsSet.push(dom)
            })
        },
        show: function() {

            this.domsSet.show();

        },
        hide: function() {

            this.domsSet.hide();

        },
        redarw:function(){
          this.domsSet.remove();
          this.doms = {};
          this.domsSet=this.paper.set();
          this.ft.unplug();
          this.ft=null;
          this.initAll();
          this.show();
        },
        remove: function() {
            this.domsSet.remove();
            this.ft.unplug();
            delete this.canvas.nodes[this.id];
        },
        setTitle: function(value) {
            if (!this.doms['title']) return;
            this.attrs.title = value;
            this.doms['title'].attr("text", value)
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
