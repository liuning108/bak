define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/views/GBarBaseView"
], function(GRoot, View) {

    var GBarBase = GRoot.extend({
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            var titleColor = this.attrs.titleColor || '#ddff00';
            var paper =this.paper;

            var n=6;
            var items=[];
            var x=0;
            var y=0;
            var w=15;
            var h=140;
            var space_w=20;
            var r=5;


            this.doms['y_axis']=paper.rect(x+w+2,y,1,h).rotate(180,x,y).attr({'stroke':'#11bde8','stroke-width':2});
            var max=6000;
            var box_w=this.getBox(max).width;
            var step=5;
            var step_num=Math.floor(max/(step-1));
            var step_h=h/(step-1);
            for(var i=0;i<step;i++){
               var step_y=-(step_h*i);
               var num=step_num*i
               this.doms['y_axis_num'+i]=paper.text(x,step_y,num).attr({
                   'fill': '#fff',
                   'font-size': 12,
                   'font-family': '微软雅黑',
               });;
               var box=this.doms['y_axis_num'+i].getBBox();
               this.doms['y_axis_num'+i].attr({'x':x-box_w-w});
            }

            this.doms['x_axis']=paper.rect(x-w,y,(w+space_w)*n,1).attr({'stroke':'#11bde8','stroke-width':2});

            var year=1;
            for(var i=0;i<n;i++){
              var per=fish.random(10,90)/100;

              var item  = this.createPointItem(i,x,y,w,h,space_w,r,per,(year+i)+"月");
              items.push(item);
              this.doms['item'+i]=item.set;
            }
            // var firstItem = items[0];
            // var lastItem=items[items.length-1];
            // var curve_path=['M',firstItem.x,firstItem.y];
            // var bg_path=['M',x,y];
            //
            // curve_path.push('L');
            // bg_path.push('L');
            // bg_path.push(firstItem.x);
            // bg_path.push(firstItem.y);
            // for (var i=1;i<items.length;i++){
            //     var item=items[i];
            //     curve_path.push(item.x);
            //     curve_path.push(item.y);
            //     bg_path.push(item.x);
            //     bg_path.push(item.y);
            //
            // }
            // bg_path.push(lastItem.x);
            // bg_path.push(y);
            // bg_path.push('z');
            //
            // var curve=paper.path(curve_path).attr({'stroke':'#11bde8','stroke-width':1});
            // var bgPath=paper.path(bg_path).attr({'fill':'#164e62','stroke-width':0,'opacity':0.3});
            // this.doms['curve']=curve;
            // this.doms['bgPath']=bgPath;






            // this.doms['title'] = this.paper.text(0, 0, title).attr({
            //     'fill': titleColor,
            //     'font-size': 30,
            //     'font-family': '微软雅黑',
            //     'font-weight': 'bold'
            // });;
            // self.setTitle(title);
            // self.setTitleColor(titleColor);


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
        createPointItem:function(i,x,y,w,h,space_w,r,per,name){
          var self=this;
          var paper=this.paper;
          var item={};
          item.set=paper.set();
          item.x=x+(i*(w+space_w));
          item.y=y;
          item.circle= paper.rect(item.x,item.y,w,h*per).rotate(180,item.x,item.y).attr({"stroke-width":0,'fill':"#11bde8"});

          item.name=paper.text(item.x-w/2,y+15,name).attr({
              'fill': '#fff',
              'font-size': 12,
              'font-family': '微软雅黑',
          });
          item.set.push(item.name);
          item.set.push(item.circle);
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

    return GBarBase;


})
