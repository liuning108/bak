define([
   "text!oss_core/pm/zdashboard/templates/dashWidget.html",
   "oss_core/pm/zdashboard/libs/Widget.js",

],function(tpl,Widget) {
  	var WidgetEngine = function (context) {
          this.opt = {
              cellHeight: 60,
              verticalMargin: 10,
              resizable:{autoHide: true, handles: 'se'},
              draggable: {
                  handle: '.header',
              },
          };
         this.items={};
         this.template=fish.compile(tpl);
         this.context=context;
    }
    WidgetEngine.prototype={
       load:function(opt){
           var self =this;
          this.context.gridstack(this.opt);
          this.grid = this.context.data('gridstack');
          this.initMonitor();
          if(!opt){
            return;
          }else{
            if(opt.datas){
              fish.each(opt.datas,function(data) {
                self.loadWidget({
                    url:data.url,
                    x:data.x,
                    y:data.y,
                    w:data.w,
                    h:data.h,
                })
              })
            }
          }
       },
       initMonitor:function(){
         var self =this;
         this.context.on('gsresizestop', function(event, elem) {
            self.gsresizestop(event, $(elem));
          });

       },
       gsresizestop:function(event, elem){
           var newHeight = elem.innerHeight()
          var newWidth = elem.innerWidth()
          var uuid =elem.attr('id');
          var hh= elem.find('.header').innerHeight()*1.1;
          var widget=this.items[uuid];
          widget.resize(newWidth,(newHeight-hh))
          // elem.data('gsOldHeight', parseInt(elem.attr('data-gs-height')));
       },
       addWidget:function(config){
          var el =$(this.template());
          this.grid.addWidget(el, 0, 0, 3, 4, true);
          var widget =new Widget(el,this);
          var uuid =widget.init(config);
          this.items[uuid]=widget;
       },
       loadWidget:function(config){
          var el =$(this.template());
          this.grid.addWidget(el, config.x, config.y, config.w, config.h);
          var widget =new Widget(el,this);
          var uuid =widget.init(config);
          this.items[uuid]=widget;
       },
       removeWidget:function(el,uuid) {

         this.grid.removeWidget(el);
         this.items[uuid]=null;
         delete this.items[uuid];
       },
       getJson:function() {
          var self=this;
         json={}

         var items= this.context.find('.grid-stack-item:visible')
         var datas=fish.map(items,function(el) {
            el = $(el);
            var node =el.data('_gridstack_node');
            var uuid= el.attr('id')
            var widget=self.items[uuid];
            return     {
                            x: node.x,
                            y: node.y,
                            w: node.width,
                            h: node.height,
                            url:widget.config.url
                        };
         });
         json.datas=datas
        return json;
       },


    }

    return WidgetEngine;



})
