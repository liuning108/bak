define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GBarBaseView"
], function(GRoot, View) {

    var GBarBase = GRoot.extend({
        initAttrs: function() {
            this.attrs.titleColor = this.attrs.titleColor || '#fff';
            this.attrs.axisColor=this.attrs.axisColor||'#11bde8';
            this.attrs.barColor=this.attrs.barColor||"#11bde8";
            this.attrs.names=this.attrs.names||['1月','2月','3月','4月','5月','6月'];
            this.attrs.datas=this.attrs.datas||this.createRandom(this.attrs.names,10,90);
            this.attrs.dbServer = this.attrs.dbServer||{
                                                            'serverName':'NetworkOverviewDemoQryService',
                                                            'islocal':true,
                                                            'xAxis':['field_1'],
                                                            'yAxis':['field_2'],
                                                            'xNums':1,
                                                            'yNums':1,
                                                            'xMinNums':1,
                                                            'yMinNums':1
                                                        }
             this.attrs.dbServer.yNums=99;
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var paper =this.paper;
            this.attrs.unit =this.attrs.unit || "";
            this.attrs.unitx=  this.attrs.unitx||"";
            this.attrs.labelStyle=this.attrs.labelStyle||1;
            this.attrs.labelStyle2=this.attrs.labelStyle2||1;
            this.Data2Graph();
            var max=fish.max(fish.flatten(this.attrs.datas));
            var smax =""+max
            if (smax.length>1){
            var twonums =Number(smax[smax.length-2]+smax[smax.length-1])
              max =max+(100-twonums);
            }else{
              max =10;
            }
            var n=this.attrs.names.length;
            var items=[];
            var x=0;
            var y=0;
            var w=15;
            var h=140;
            var space_w=20;
            var r=5;


            this.doms['y_axis']=paper.rect(x+w+2,y,1,h).rotate(180,x,y).attr({'stroke':this.attrs.axisColor,'stroke-width':2});

            var box_w=this.getBox(max+this.attrs.unit).width;

            var step = 5;
            var step_num = max/step;
            var step_h = h / (step);
            for(var i=0;i<=step;i++){
               var step_y=-(step_h*i);
               var num=step_num*i
               this.doms['y_axis_num'+i]=paper.text(x,step_y,num+this.attrs.unit).attr({
                   'fill': this.attrs.titleColor,
                   'font-size': 12,
                   'font-family': '微软雅黑',
               });;
               var box=this.doms['y_axis_num'+i].getBBox();
               this.doms['y_axis_num'+i].attr({'x':x-box_w-w});
            }
            space_w=this.getBox(this.getMaxLength(this.attrs.names)).width;
            var space_item_w=this.attrs.datas.length*w;
            if(space_w>space_item_w){
              space_item_w=space_w
            }
            this.doms['x_axis']=paper.rect(x-w,y,(w+space_item_w)*n,1).attr({'stroke':this.attrs.axisColor,'stroke-width':2});
            var colors=["#11bde8",'#1790cf','#12CC94','#9EF4E6','#359768'];
            if(this.attrs.labelStyle2==1){
              var xAxisW=this.doms['x_axis'].getBBox().width;
              for(var i =0;i<this.attrs.xAxisLabels.length;i++){
                  var color=colors[i%colors.length];
                 var label = this.attrs.xAxisLabels[i];
                 var label_x=x+xAxisW+5
                 var label_y = (y-h)+(i*12)+20;
                 this.doms['x_label'+i] = paper.rect(x+label_x,label_y, 15, 6).attr({'fill': color, 'stroke-width': 0});
                 var bbox =this.doms['x_label'+i].getBBox();
                 this.doms['x_label_name'+i] = paper.text(x+label_x+bbox.width+10, label_y+3,label).attr({'fill': this.attrs.titleColor, 'font-size': 12, 'font-family': '微软雅黑','text-anchor':'start'});
              }
            }



            for(var i=0;i<n;i++){
              var bboxSet =paper.set();
              var name =this.attrs.names[i];
             for (var j = 0 ;j<this.attrs.datas.length;j++){
              var color=colors[j%colors.length];
              var vvalue =this.attrs.datas[j][i];
              var per=vvalue/max;
              var item_x=x+(j*(w+0.5))
              var item  = this.createPointItem(i,item_x,y,w,h,space_item_w,r,per,this.attrs.names[i],vvalue,color);
              items.push(item);
              bboxSet.push(item.set);
              this.doms['item'+j+"_"+i]=item.set;
             }
             var bbox=bboxSet.getBBox();
             console.log(bbox);
             var Itemname =paper.text(bbox.x+bbox.width/2,bbox.y+bbox.height+15,name).attr({
                 'fill':this.attrs.titleColor ,
                 'font-size': 12,
                 'font-family': '微软雅黑',
             });
             this.doms['itemName_'+i]=Itemname
            }



            this.doms['config'] = this.paper.text(100, -30, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;
            this.doms['remove'] = this.paper.text(160, -30, 'X').attr({
                'fill': 'red',
                'font-size': 20,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        getMaxLength:function(names) {
              var   len = 0;
              var  result = "";
             for (var i=0;i<names.length;i++){
                 var name =""+names[i];
                 if(name.length>len){
                    len =name.length;
                    result= name;
                 }
             }
             return result;
        },
        getXAxisNames:function() {
            return this.attrs.names;
        },
        setXAxisNames:function(datas) {
            this.attrs.names=datas;
        },
        getXAxisDatas:function () {
            return this.attrs.datas;
        },
        setXAxisDatas:function(datas) {
             this.attrs.datas=datas;
        },
        getBox:function(val){

          var text=this.paper.text(0,0,val).attr({
              'fill': '#fff',
              'font-size': 12,
              'font-family': '微软雅黑',
          })
          var box=text.getBBox();
          text.remove();
          return box;
        },

        createPointItem:function(i,x,y,w,h,space_w,r,per,name,vvalue,color){
          var self=this;
          var paper=this.paper;
          var item={};
          item.set=paper.set();

            item.x=x+(i*(w+space_w));
          item.y=y;
          item.circle= paper.rect(item.x,item.y,w,h*per).rotate(180,item.x,item.y).attr({"stroke-width":0,'fill':color});
          var bbox =item.circle.getBBox();
          // item.name=paper.text(item.x-w/2,y+15,name).attr({
          //     'fill':this.attrs.titleColor ,
          //     'font-size': 12,
          //     'font-family': '微软雅黑',
          // });
          if(  this.attrs.labelStyle==1){
            item.value=paper.text(item.x-w/2,item.y-bbox.height-15,vvalue+self.attrs.unitx).attr({
                'fill':this.attrs.titleColor ,
                'font-size': 10,
                'font-family': '微软雅黑',
            });
            item.set.push(item.value);
          }
          //item.set.push(item.name);
          item.set.push(item.circle);
          return item;
        },
        toGraph:function(choiceTreeJson) {
          try {
            console.log("GBarBase");
            console.log(choiceTreeJson);
            var json={};
            json.xAxis={};
            json.xAxis.data=choiceTreeJson.xAxis[0].data;
            json.series={};
            json.series.data=fish.pluck(choiceTreeJson.yAxis,'data');
            json.series.labels =fish.pluck(choiceTreeJson.yAxis, 'label');
            this.setXAxisNames(json.xAxis.data)
            this.setXAxisDatas(json.series.data)
            this.setXAxisLabels(json.series.labels)
          }catch(e){
            console.log("GBarBase ToGraph");
            console.log(choiceTreeJson);
          }

        },
        setXAxisLabels:function(labels) {
            this.attrs.xAxisLabels = labels;
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

    return GBarBase;


})
