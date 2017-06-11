define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot",
  "oss_core/pm/screendesigner/js/graphLibs/views/GPieBaseView"
], function(GRoot, View) {

  var GPieBase = GRoot.extend({
    initElement: function() {
      var self = this;
      var title = this.attrs.title || '文字名称';
      var titleColor = this.attrs.titleColor || '#ddff00';
      var paper=this.paper;
      var x=0;
      var y=0;
      var r=100;
      var colors=['#1c7099','#1790cf','#1bb2d8','#99d2dd','#88b0bb'];
      var hn_area=['长沙', '株洲', '湘潭', '衡阳','邵阳','岳阳','常德','张家界','益阳','娄底','郴州','永州','怀化','湘西'];
      var datas=[];
      var sum =0;
      for (var i=0;i<hn_area.length;i++){
          var item={};
          item.name=hn_area[i];

          item.value=fish.random(200,999);
          sum=sum+item.value;
          datas.push(item);
      }
      this.createPireBaseAttr();

       var start=0;
       var end=0;
      for(var i=0;i<datas.length;i++){
           var data_item=datas[i];
           var per=data_item.value/sum;
           start=0+end;

           end=start+(359.99*per);
           var color=colors[i%colors.length];
           item=paper.path();
           item.data('id','item'+i)
           item.data('color',color);
           item.data('name',data_item.name);
           item.data('val',Math.floor(per*100)+"%");
           if(this.canvas.perview){
               item.attr({
                  'stroke-width':0,
                  'fill':colors[i%colors.length],
                  'PieBase':[x,y,r,0,0]
              })

              item.animate({
                 'stroke-width':0,
                 'fill':colors[i%colors.length],
                 'PieBase':[x,y,r,start,end]
             },1900)

           }else{
               item.attr({
                  'stroke-width':0,
                  'fill':colors[i%colors.length],
                  'PieBase':[x,y,r,start,end]
              })
           }


          this.doms['item'+i]=item;

      }
      // this.createPireBaseAttr();
      //
      // var pie_sector=paper.path().attr({
      //    'fill':'red',
      //    'stroke-width':0,
      //    'PieBase':[0,0,150,1,30]
      // })
      //
      // this.doms['pie']=pie_sector;
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
    createPireBaseAttr: function() {
      var self = this;
      var paper = this.paper;
      paper.customAttributes.PieBase = function(cx, cy, r, startAngle, endAngle) {
        var rad = Math.PI / 180;

        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        var fontSize=18;
        var space_font=fontSize+10;

          var center_endAngle = endAngle - (endAngle - startAngle) / 2;

          var c_outerX1 = cx + (r+space_font) * Math.cos((-center_endAngle) * rad);
          var c_outerY1 = cy + (r+space_font) * Math.sin((-center_endAngle) * rad);

          if(!this.text){
           this.text=paper.text(c_outerX1,c_outerY1,this.data('name')).attr({
                        'font-size':fontSize,
                        'fill': this.data('color'),
                        'font-family': '微软雅黑',
                        'font-weight': 'bold'
                    });
           self.doms['text'+this.data('id')]=this.text;
         }else{
           this.text.attr({'x':c_outerX1,'y':c_outerY1});
         }

            var path =["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"];
            return {
                    path: path
                };
      }//end


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

  return GPieBase;


})
