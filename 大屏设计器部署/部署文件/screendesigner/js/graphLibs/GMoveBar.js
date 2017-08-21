define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GMoveBarView",
    "oss_core/pm/screendesigner/js/graphLibs/views/ViewUtils"
], function(GRoot, View,ViewUtils) {

    var GMoveBar = GRoot.extend({
        initAttrs: function() {
            this.attrs.dbServer = this.attrs.dbServer||{
                                                            'serverName':'NetworkOverviewDemoQryService',
                                                            'islocal':true,
                                                            'xAxis':[],
                                                            'yAxis':['field_2'],
                                                            'xNums':0,
                                                            'yNums':1,
                                                            'xMinNums':0,
                                                            'yMinNums':1
                                                        }
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            this.attrs.titleColor = this.attrs.titleColor || '#ddff00';
            this.attrs.avgColor=this.attrs.avgColor||'#01b4f8';
            this.attrs.datas=this.attrs.datas||this.createRandom(this.createSeqNums(1,12),10,90);

            this.Data2Graph();


            var x=0;
            var y=0;
            var index=this.attrs.datas.length;
            var last_data=this.attrs.datas[this.attrs.datas.length-1];
            var max=Math.floor(1.1*fish.max(this.attrs.datas));
            this.avg = ViewUtils.avg(this.attrs.datas);

            var space=13;
            var w=20;
            for (var i=0;i<index;i++){
                var per=(this.attrs.datas[i]/max)*100;
                var bar = this.createBar(i,x,y,space,w,per,this.attrs.datas[i]);
                this.doms['bar'+i]=bar.set;
            }
            var width=x+(index*(w+space));
            var nums_x=width/2;
            var color=this.attrs.avgColor;
            if(last_data>this.avg){
                color=this.attrs.titleColor;
            }
            this.doms['nums'] = this.paper.chartsNumbser({
                'x': nums_x,
                'y': y-50,
                'value': last_data,
                attrs: {
                    'fill': color,
                    'font-size': 42,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });
            this.doms['config'] = this.paper.text(x, y-30, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(x+40, y-30, 'X').attr({
                'fill': 'red',
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        createBar:function(index,x,y,space,w,per,value){
              var paper =this.paper;
              var h=140;
              var item={};
              item.set=paper.set();
              item.x=x+(index*(w+space));
              item.y=y;
            //   var bg=paper.rect(item.x,item.y,w,h).attr({
            //                                  'fill':'#efefef',
            //                                  'stroke-width':0
            //                              });
              var  color=this.attrs.avgColor;
              if(value>this.avg){
                color=this.attrs.titleColor;
              }

              item.process=paper.rect(item.x,item.y+h,w,0).attr({
                                              'fill':color,
                                              'stroke-width':0
                                          }).rotate(180);

              item.process.animate({'height':h*per/100},1900);
             // item.set.push(bg);
              item.set.push(item.process);

              return item;

        },

        setXAxisDatas:function (datas) {
           this.attrs.datas=datas;
        },
        getXAxisDatas:function() {
            return this.attrs.datas;
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
        toGraph:function(choiceTreeJson) {
            var json={};
            // json.xAxis={};
            // json.xAxis.data=choiceTreeJson.xAxis[0].data;
            json.series={};
            json.series.data=fish.pluck(choiceTreeJson.yAxis,'data')[0];
            this.setXAxisDatas(json.series.data)

        },
        addEvent: function() {

            var self = this;
            // TODO:配置属性(node)
              var view = new View(self);
            this.doms['config'].click(function(e) {
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
                e.stopImmediatePropagation();
            });
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm(view.resource.ISDEL).result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })

        }

    })

    return GMoveBar;


})
