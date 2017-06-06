define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GArcProcessView"
], function(GRoot, View) {

    var GArcProcess = GRoot.extend({
        initElement: function() {
            var self = this;
            var paper=this.paper;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#01b1f1';

            var x=0;
            var y=0;
            var r=100;
            var val_rate=fish.random(10, 100);

            self.createArcProcessAttrs();

             this.doms['bgArc'] = paper.path().attr({
                "stroke": "#e9e9e9",
                "stroke-width": 20,
                'opacity':0.5,
                arc_process: [x, y, 0, 100, r]
            });

            this.doms['bgArc'] .rotate(210, 100, 100).attr({
                arc_process: [x, y, 100, 100, r]
            });


            this.doms['valueArc'] = paper.path().attr({
               "stroke": titleColor,
               "stroke-width": 20,
               arc_process: [x, y, 0, 100, r]
           });

           this.doms['valueArc'] .rotate(210, 100, 100).animate({
               arc_process: [x, y, val_rate, 100, r]
           },1900);

             var center_x=x+r*1.4;
             var center_y=y+r*3.55;

            this.doms['title'] = this.paper.text(center_x, center_y, title).attr({
                'fill': titleColor,
                'font-size': 22,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

            var nums_y=y+r*2.4;
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': center_x,
                'y': nums_y,
                'value': val_rate,
                'showLabel':'%',
                attrs: {
                    'fill': titleColor,
                    'font-size': r/2.5,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });


            this.doms['config'] = this.paper.text(center_x-60, center_y+40, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(center_x, center_y+40, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            self.setTitle(title);
            self.setTitleColor(titleColor);

        },

        createArcProcessAttrs:function(){
            var paper=this.paper;
            paper.customAttributes.arc_process = function(xloc, yloc, value, total, R) {
                var alpha = 300 / total * value,
                    a = (90 - alpha) * Math.PI / 180,
                    x = xloc + R * Math.cos(a),
                    y = yloc - R * Math.sin(a),
                    path;
                if (total == value) {
                    path = [
                        ["M", xloc, yloc - R],
                        ["A", R, R, 0, +(alpha > 180), 1, x, y]
                        ];
                } else {
                    path = [
                        ["M", xloc, yloc - R],
                        ["A", R, R, 0, +(alpha > 180), 1, x, y]
                        ];
                }
                return {
                    path: path
                };
            };
        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        setTitle: function(text) {
            this.doms['title'].attr({
                'text': text
            });
            this.attrs.title = text;
        },
        setTitleColor: function(color) {
            this.doms['title'].attr({
                'fill': "" + color
            });
            this.doms['valueArc'].attr({
                'stroke': "" + color
            })
            this.doms['nums'].attr({
                'fill': "" + color
            })
            this.attrs.titleColor = "" + color;
        },

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },

        addEvent: function() {
            if(!this.doms['config'])return;
            var self = this;
            // TODO:配置属性(node)
            this.doms['config'].click(function(e) {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                e.stopImmediatePropagation();
            });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GArcProcess;


})