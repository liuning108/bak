define([
  "oss_core/pm/screendesigner/js/graphLibs/mapBase/MapBase",
   "oss_core/pm/screendesigner/js/graphLibs/mapBase/GMapSplashesView",
   "oss_core/pm/screendesigner/actions/BScreenMgrAction"
], function(MapBase, View, action) {
   var MapSplashes  = MapBase.extend({

     initAttrs: function() {
       var self = this;
       this.attrs.mapId = this.attrs.mapId || 'NONE';
       this.attrs.fcolor = this.attrs.fcolor || '#42a6f9'
       this.attrs.scolor = this.attrs.scolor || '#0b7abb'
       this.attrs.mapLineColor=this.attrs.mapLineColor || "#ffffff";
       this.attrs.pointFcolor=this.attrs.pointFcolor||"#dec62d";
       this.attrs.pointScolor=this.attrs.pointScolor||"#fbf937";
       this.attrs.pointSize=this.attrs.pointSize||0;
       this.attrs.gtype = this.attrs.gtype || 'createPoint';
       this.attrs.MaxValue = this.attrs.MaxValue || 100;
       this.attrs.MinValue = this.attrs.MinValue || 0;
       this.attrs.showTitle = this.attrs.showTitle || false;
       this.attrs.showGradient = this.attrs.showGradient || false;
       this.attrs.showGradientValue = this.attrs.showGradientValue || 5;
       this.attrs.position = this.attrs.position || 'left';
       this.attrs.angle = this.attrs.angle || 0;
       this.attrs.offsetX = this.attrs.offsetX || 0;
       this.attrs.offsetH = this.attrs.offsetH || 0;
       this.attrs.isGlow =this.attrs.isGlow||false;
       this.attrs.showValue = (typeof(this.attrs.showValue) === 'undefined')
         ? true
         : this.attrs.showValue;
       this.attrs.colorReversal = this.attrs.colorReversal || false;
       this.attrs.dbServer = this.attrs.dbServer || {
         'serverName': 'NetworkOverviewDemoQryService',
         'islocal': true,
         'xAxis': ['filed_map'],
         'yAxis': ['field_2'],
         'xNums': 1,
         'yNums': 1,
         'xMinNums': 1,
         'yMinNums': 1
       }


     },
     areaEffect:function(mapBox, result){
       var self  =this;
       var r =this.attrs.pointSize;
       var fcolor=this.attrs.pointFcolor;
       var scolor=this.attrs.pointScolor;

       var fclr = Raphael.color(fcolor);
       var sclr = Raphael.color(scolor);

       var max =fish.max(self.attrs.mapDatas,function(data){
         return data[1]
       })[1];
       var showTitle = this.attrs.showTitle;
       var showValue = this.attrs.showValue;
       for (var i = 0; i < self.attrs.mapDatas.length; i++){
         var data = {
           'id': self.attrs.mapDatas[i][0],
           'value': self.attrs.mapDatas[i][1]
         };
         if(!self.doms["map_" + data.id])return;
         self[self.attrs.gtype](data,sclr,fclr,max,r,i);
         if (showTitle) {
           var bbox = self.doms["map_" + data.id].getBBox();
           var x = bbox.x + bbox.width / 2;
           var y = bbox.y + bbox.height / 2;
           var title = self.doms["map_" + data.id].title || data.id;
           self.doms["map_" + data.id + "_text"] = this.paper.text(x, y, title).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
         }
         if (showValue) {
           var bbox = self.doms["map_" + data.id].getBBox();
           var x = bbox.x + bbox.width / 2;
           var y = bbox.y + bbox.height / 2;
           if (showTitle) {
             y = y + 20;
           }
           self.doms["map_" + data.id + "_value"] = this.paper.text(x, y, data.value).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'}).toFront()
         }

       } //end of for
     },
      createlightRing :function(data,sclr,fclr,max,r,i){
       var self =this;
       var bbox = self.doms["map_" + data.id].getBBox();
       var x = bbox.x + bbox.width / 2;
       var y = bbox.y + bbox.height / 2;
       var title = self.doms["map_" + data.id].title || data.id;
       var per = data.value/max;
       var dyR= r * per;
       var color = self.pickHex(sclr, fclr, per)
       self.doms['map_circle_pointe'+data.id]=self.paper.circle(x,y,3).attr({'fill':color,'stroke-width':0,'opacity':1});

       self.doms['map_circle'+data.id]=self.paper.circle(x,y,dyR/1.6).attr({'fill':color,'stroke-width':0,'opacity':0});
       self.doms['map_circle_glow'+data.id]= self.doms['map_circle'+data.id].glow({
         'color':color,
          width:dyR,
       })
       var aniam = Raphael.animation({opacity: "0.2",'r':dyR/2}, 2500+(i*20)).repeat(Infinity);

        self.doms['map_circle_pointe'+data.id].animate(aniam)
        //self.doms['map_circle_glow'+data.id].animate(aniam2)
     },
     createPoint:function(data,sclr,fclr,max,r){

       var self =this;
       var bbox = self.doms["map_" + data.id].getBBox();
       var x = bbox.x + bbox.width / 2;
       var y = bbox.y + bbox.height / 2;
       var title = self.doms["map_" + data.id].title || data.id;
       var per = data.value/max;
       var dyR= r * per;
       var color = self.pickHex(sclr, fclr, per)
       self.doms['map_circle'+data.id]=self.paper.circle(x,y,dyR).attr({'fill':color,'stroke-width':0,'opacity':0.9});
       self.doms['map_circle_glow'+data.id]= self.doms['map_circle'+data.id].glow({
         'color':color,
       })
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

   });
   return MapSplashes
});
