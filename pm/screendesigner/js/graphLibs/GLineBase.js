define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GLineBaseView"
], function(GRoot, View) {

    var GLineBase = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var x = 0;
            var y = 0;
            var w = 260;
            var h = 15;
            var space_h = 10;
            var n = 10;
            var paper = this.paper;

            var names = ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '益阳', '娄底', '郴州']
            var items = [];
            for (var i = 0; i < n; i++) {
                var per = (n - i) * 10 / 100;
                var item = this.createItme(i, x, y, w, h, space_h, per, names[i]);
                items.push(item);
                this.doms['item' + i] = item.set;
            }
            var lastItem = items[items.length - 1];
            var max = 6000;
            var step = 4;
            var step_num = Math.floor(max / (step));
            var step_len = w / (step);
            var x_nums = {};
            x_nums.x = lastItem.x + lastItem.box.width;
            x_nums.y = (lastItem.y + h + space_h) - lastItem.box.height / 2
            for (var i = 0; i <= step; i++) {
                var num = step_num * i;
                var len = step_len * i;
                x_nums.rect = paper.text(x_nums.x + len, x_nums.y, num).attr({
                    'fill': '#fff',
                    'font-size': 12,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                });
                this.doms['x_nums' + i] = x_nums.rect;
            }







            // this.doms['title'] = this.paper.text(0, 0, title).attr({
            //     'fill': titleColor,
            //     'font-size': 30,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            // self.setTitle(title);
            // self.setTitleColor(titleColor);
            //
            //
            // this.doms['config'] = this.paper.text(100, -30, '配置').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            // this.doms['remove'] = this.paper.text(160, -30, '删除').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;

        },
        createItme: function(i, x, y, w, h, space_h, per, name) {

            var paper = this.paper;
            var item = {};
            item.set = paper.set();
            item.x = x;
            item.y = y + (i * (h + space_h));
            item.text = paper.text(item.x, item.y, name).attr({
                'fill': '#fff',
                'font-size': 12,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
            item.box = item.text.getBBox();

            item.rect = paper.rect(item.x + item.box.width, item.y - item.box.height / 2, w, h).attr({
                'stroke': '#005e88',
                'stroke-width': 1
            });
            item.process = paper.rect(item.x + item.box.width, item.y - item.box.height / 2, w * per, h).attr({
                'fill': '#4cd5f4',
                'stroke-width': 0
            });
            item.set.push(item.text);
            item.set.push(item.rect);
            item.set.push(item.process);

            return item;

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

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },

        addEvent: function() {
            if (!this.doms['config']) return;
            var self = this;
            // TODO:配置属性(node)
            this.doms['config'].click(function(e) {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
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

    return GLineBase;


})
