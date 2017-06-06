define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GMoveBarView"
], function(GRoot, View) {

    var GMoveBar = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var x=0;
            var y=0;
            var index=12;
            var space=13;
            var w=20;
            var sum=0;
            for (var i=0;i<index;i++){
                var per=fish.random(10,90);
                sum+=per;
                var bar = this.createBar(i,x,y,space,w,per);
                this.doms['bar'+i]=bar.set;
            }
            var width=x+(index*(w+space));
            var nums_x=width/2;
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': nums_x,
                'y': y-50,
                'value': sum,
                attrs: {
                    'fill': '#01b4f8',
                    'font-size': 42,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

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
            // this.doms['config'] = this.paper.text(x, y-30, '配置').attr({
            //     'fill': 'red',
            //     'font-size': 18,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            this.doms['remove'] = this.paper.text(x+40, y-30, '删除').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        createBar:function(index,x,y,space,w,per){
              var paper =this.paper;
              var h=140;
              var item={};
              item.set=paper.set();
              item.x=x+(index*(w+space));
              item.y=y;
              var bg=paper.rect(item.x,item.y,w,h).attr({
                                             'fill':'#efefef',
                                             'stroke-width':0
                                         });
              var  color="#01b4f8";
              if(per>60){
                color='#ffa500';
              }

              item.process=paper.rect(item.x,item.y+h,w,0).attr({
                                              'fill':color,
                                              'stroke-width':0
                                          }).rotate(180);

              item.process.animate({'height':h*per/100},1900);
              item.set.push(bg);
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

            var self = this;
            // TODO:配置属性(node)
            // this.doms['config'].click(function(e) {
            //     var view = new View(self);
            //     view.render();
            //     var $panel = $('.configPanel');
            //     $panel.html(view.$el.html());
            //     view.afterRender();
            //     e.stopImmediatePropagation();
            // });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GMoveBar;


})
