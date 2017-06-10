define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GTextView"
], function(GRoot, View) {

    var GText = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '指标名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var numColor = this.attrs.numColor || '#ffffff';
            this.doms['title'] = this.paper.text(0, 0, title).attr({
                'fill': titleColor,
                'font-size': 30,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            self.setTitle(title);
            self.setTitleColor(titleColor);
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': 0,
                'y': 0 + 40,
                'value': 0,
                attrs: {
                    'fill': numColor,
                    'font-size': 30,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

            self.setNumColor(numColor);

            this.doms['config'] = this.paper.text(100, -20, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(100, 10, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },

        getData: function() {

            var self = this;
            var intervalTime=1000*60*5;
            self.doms['nums'].setValue(fish.random(99, 999));
            setTimeout(function() {
                self.getData();
            }, intervalTime);
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
            console.log("" + color)
            this.attrs.titleColor = "" + color;
        },
        setNumColor: function(color) {
            this.doms['nums'].attr({
                'fill': "" + color
            });
            this.attrs.numColor = "" + color;
        },
        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },
        getNumColor: function() {

            return this.attrs.numColor;
        },
        addEvent: function() {
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

    return GText;


})
