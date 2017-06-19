define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GCircleNumView"
], function(GRoot, View) {

    var GCircleNum = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';

            var x=0;
            var y=0;
            var r=100;
            this.attrs.unit=this.attrs.unit||'';
            this.attrs.val=this.attrs.val||fish.random(300,999);

            this.doms['circle']=this.paper.circle(x,y,r).attr({
                'fill':titleColor,
                'stroke-width': 0,
            });

            this.doms['title'] = this.paper.text(x, y+r+30, title).attr({
                'fill': titleColor,
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            self.setTitle(title);
            self.setTitleColor(titleColor);
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': x,
                'y': y,
                'value': this.attrs.val,
                'showLabel':this.attrs.unit,
                attrs: {
                    'fill': '#ffffff',
                    'font-size': r/3,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });


            this.doms['config'] = this.paper.text(0, -r, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(60, -r, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
       

        },

        getData: function() {


            // var self = this;
            // var intervalTime=1000*60*5;
            // self.doms['nums'].setValue(fish.random(99, 666));
            // setTimeout(function() {
            //     self.getData();
            // }, intervalTime);
        },
        setUnit:function(unit){
            this.doms['nums'].setUnit(unit);
            this.attrs.unit=unit;
        },
        getUnit:function(){
          return this.attrs.unit;
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },

        setValue:function(val){
         this.doms['nums'].setValue(val);
         this.attrs.val=val;
        },
        getValue:function(){
         return this.attrs.val;
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
            this.doms['circle'].attr({
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

    return GCircleNum;


})
