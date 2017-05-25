define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/raphael-areaLineBar",
    "oss_core/pm/screendesigner/js/graphLibs/views/GBarView"
], function(GRoot, tpl,View) {

    var GBar = GRoot.extend({
        initElement: function() {
            var self = this;
            var x=100;
            var y=100;
            var paper=this.paper;
            this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x-25,y-140,532,377);
            this.xAxisNames = this.attrs.xAxisNames||['南京' ,'无锡' ,'徐州' ,'常州' ,'苏州' ,'南通'  ,'淮安' ,'盐城' ,'扬州' ,'镇江' ,'泰州' ,'宿迁','连云港'];
           this.attrs.title=this.attrs.title||'C网超3分钟未峻工量';
            this.doms['title'] =this.paper.text(x+240,y-140,this.attrs.title).attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
            this.top = this.paper.areaLineBar({
                'keys': this.xAxisNames,
                'x': x,
                'y': y,
                'waring': [40, 70, 90]
            });
            this.doms['rect'] = this.top.allItem;
            this.doms['nums'] = paper.chartsNumbser({'x':x+235,'y':y-92,'value':794,
                                  attrs: {'fill':'#ffffff','font-size':36,'font-family': '微软雅黑','font-weight':'bold'}
                                 });

         this.doms['label_1']=paper.text(x+184,y+195,'正常').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
         this.doms['label_1_rect']=paper.rect(x+140,y+185,20,20).attr({'fill':'#ffffff',opacity:'0.4'});

         this.doms['label_2']=paper.text(x+184+65,y+195,'紧急').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
         this.doms['label_2_rect']=paper.rect(x+140+65,y+185,20,20).attr({'fill':'#ffcc00',opacity:'0.4'});

         this.doms['label_3']=paper.text(x+184+65+65,y+195,'危险').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
         this.doms['label_3_rect']=paper.rect(x+140+65+65,y+185,20,20).attr({'fill':'#ff3600',opacity:'0.4'});

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
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },

        getData: function() {
            var self=this;
            var  datas=[];
            for (var i = 0; i < this.xAxisNames.length; i++) {

                datas.push({
                    name: this.xAxisNames[i],
                    value: fish.random(10, 100)
                })
            }
            this.top.inputData(datas)
            setTimeout(function() {
                 self.getData();
            }, 5000);
        },
        //TODO  获得X轴的名称
        getXAxisNams:function(){
            return this.xAxisNames;
        },
        setXAxisNams:function(names){
              this.attrs.xAxisNames=names;
              this.redraw();
        },
        redraw:function(){
            var option={};
            option.id = this.id;
            option.canvas = this.canvas;
            option.paper = this.paper;
            option.attrs=this.attrs;
            option.attrs.ft_attrs=this.ft.attrs;
            this.remove();
            this.init(option);
            this.show();

        },
        addEvent: function() {
            var self =this;
            // TODO:配置属性(node)
            this.doms['config'].click(function() {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
            });
           // TODO:配置删除(node)
           this.doms['remove'].click(function() {
               fish.confirm('确认是否删除该组件').result.then(function() {
                   self.remove();
               });
           })//end of remove
        }

    })

    return GBar;


})
