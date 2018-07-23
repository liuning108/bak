define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot",
  "oss_core/pm/screendesigner/js/graphLibs/views/GPieBaseView"
], function(GRoot, View) {

  var GPieBase = GRoot.extend({
    initAttrs: function() {
       this.attrs.colors=this.attrs.colors||['#1c7099','#1790cf','#1bb2d8','#99d2dd','#88b0bb']
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
    },
    sortByMaxMin:function(datas){
        // datas.push({
        //     'name':'my',
        //     'value':20
        // })
        var arr =fish.sortBy(datas,function(data){
            return -data.value;
        })
        console.log("sortByMaxMin"+arr.length);

        var helf =arr.length/2;
        var a1=fish.initial(arr,helf);
        var a2=fish.sortBy(fish.last(arr,helf),function(data){
            return data.value
        });
        console.log(a1);
        console.log(a2);
        var p1=0;
        var p2=0;
        var result=[];
        while(p1<a1.length && p2<a2.length){
            result.push(a1[p1]);
            result.push(a2[p2]);
            p1++
            p2++
        }
        while(p1<a1.length){
            result.push(a1[p1]);
            p1++;
        }
        while(p2<a2.length){
            result.push(a2[p2]);
            p2++;
        }

       //  var p1=0;
       //  var p2=0;
       //  var result =[];
       //  for (var i =0 ;i<arr.length;i++){
       //      if((i+1)%2==0 ){
       //          result.push(a2[p2]);
       //          p2++;
       //      }else{
       //          result.push(a1[p1]);
       //          p1++;
       //
       //      }
       //  }
       //  console.log("p1="+p1);
       //  console.log("p2="+p2);
       //
       //  console.log(arr);
       // console.log(result);
        return result;
    },
    initElement: function() {
      var self = this;
      var title = this.attrs.title || '文字名称';
      var titleColor = this.attrs.titleColor || '#ddff00';
      this.attrs.labelColor= this.attrs.labelColor||"#fff";
      var paper=this.paper;
      var x=0;
      var y=0;
      var r=100;
      var colors=this.attrs.colors;
      this.attrs.xAxisData=this.attrs.xAxisData||['长沙', '株洲', '湘潭', '衡阳','邵阳','岳阳','常德','张家界','益阳','娄底','郴州','永州','怀化','湘西'];
      this.attrs.SeriesData=this.attrs.SeriesData||self.createRandom(this.attrs.xAxisData,200,999);

      this.Data2Graph();

      var datas=[];
      var sum =0;
      this.attrs.labelStyle=this.attrs.labelStyle||1;
      for (var i=0;i<this.attrs.xAxisData.length;i++){
          var item={};
          item.name=this.attrs.xAxisData[i];
          item.value=this.attrs.SeriesData[i]||0;
          item.color=colors[i%colors.length];
          sum=sum+item.value;
          datas.push(item);  
      }
      this.createPireBaseAttr();
      var datas =this.sortByMaxMin(datas);
       var start=0;
       var end=0;
       var nnn=100;
      for(var i=0;i<datas.length;i++){
           var data_item=datas[i];
           var per=data_item.value/sum;
           if(per==0)per=0.01;
           start=0+end;

           end=start+(359.99*per);

           var color=data_item.color;

           item=paper.path();
           item.data('id','item'+i)
           item.data('color',color);
           item.data('name',data_item.name);
           var val=""
           if(this.attrs.labelStyle==2){
            val=data_item.value;
            }else if (this.attrs.labelStyle==3) {
                   if (i==datas.length-1){
                        val=nnn+"%";
                   }else{
                          var pper = Math.round(per*100)
                              nnn =nnn-pper;
                             val=pper+"%";
                   }
           }else {
               val="";

           }



           item.data('val',val);
           if(this.canvas.perview){
               item.attr({
                  'stroke-width':0,
                  'fill':color,
                  'PieBase':[x,y,r,0,0]
              })

              item.animate({
                 'stroke-width':0,
                 'fill':color,
                 'PieBase':[x,y,r,start,end]
             },1900)

           }else{
               item.attr({
                  'stroke-width':0,
                  'fill':color,
                  'PieBase':[x,y,r,start,end]
              })
           }


          this.doms['item'+i]=item;

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


    getXAxisData:function(){
        return this.attrs.xAxisData;
    },
    getSeriesData:function(){
        return this.attrs.SeriesData;
    },
    setXAxisData:function(data){
      this.attrs.xAxisData=data;
    },
    setSeriesData:function(data){
         this.attrs.SeriesData=data;
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
            var t =this.data('name')+"\n"+this.data("val");
           this.text=paper.text(c_outerX1,c_outerY1,t).attr({
                        'font-size':fontSize,
                        'fill': self.attrs.labelColor,//this.data('color'),
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

    toGraph:function(choiceTreeJson) {
      try {
        var json={};
        json.xAxis={};
        console.log(choiceTreeJson);
        json.xAxis.data=choiceTreeJson.xAxis[0].data;
        json.series={};
        json.series.data=fish.pluck(choiceTreeJson.yAxis,'data')[0];
        this.setXAxisData(json.xAxis.data);
        this.setSeriesData(json.series.data);
      }catch(e){
        console.log("GPieBase ToGraph");
        console.log(choiceTreeJson);
      }

    },

    addEvent: function() {
      if (!this.doms['config']) return;
      var self = this;
      // TODO:配置属性(node)、
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

  return GPieBase;


})
