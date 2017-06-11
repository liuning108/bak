define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GTableBaseView"
], function(GRoot, View) {

    var GTableBase = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var paper=this.paper;
            var x=0;
            var y=0;
            var space=100;
            this.names=['地区','3G','4G','排名'];

            var datas=[
               ['长沙',fish.random(800,999),fish.random(800,999),1],
               ['株洲',fish.random(700,800),fish.random(700,800),2],
               ['湘潭',fish.random(600,700),fish.random(600,700),3],
               ['邵阳',fish.random(500,600),fish.random(500,600),4],
               ['岳阳',fish.random(400,500),fish.random(400,999),5],
               ['常德',fish.random(300,400),fish.random(300,400),6],
               ['益阳',fish.random(200,300),fish.random(200,300),7],
               ['娄底',fish.random(100,200),fish.random(100,200),8],
               ['郴州',fish.random(90,100),fish.random(90,100),9],
               ['衡阳',fish.random(80,90),fish.random(80,90),10],
            ]

            var set= paper.set();
            var item_box;
            for (var i = 0 ; i <this.names.length;i++){
                var name=this.names[i];
                var item_x=x+(i*space);
                this.doms['header'+i]=paper.text(item_x,y,name).attr({
                      'fill': '#fff',
                      'font-size': 18,
                      'font-family': '微软雅黑',
                      'font-weight': 'bold'
                })
                item_box=this.doms['header'+i].getBBox();
                set.push(this.doms['header'+i])
            }
            var box =set.getBBox();
            this.doms['headerLine']=paper.rect(x-item_box.width,y+box.height,box.width+item_box.width,1).attr({'stroke':'#006598','stroke-width':1});

           var data_x=x;
           var data_y=y+box.height+box.height;
            for (var i=0;i<datas.length;i++){
              var data=datas[i];
              var item_x=data_x;
              var item_y=data_y+(box.height*i);
              for(var j=0;j<data.length;j++){
                var j_x=data_x+(j*space);
                var color='#fff';
                if(j==data.length-1)color='#beb148';
                this.doms['data'+i+'_'+j]=paper.text(j_x,item_y,data[j]).attr({
                      'fill': color,
                      'font-size': 18,
                      'font-family': '微软雅黑',
                      'font-weight': 'bold'
                })

              }

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

    return GTableBase;


})
