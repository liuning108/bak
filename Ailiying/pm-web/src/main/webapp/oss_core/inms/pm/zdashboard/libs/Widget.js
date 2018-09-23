define([],function(){
   var Widget  =function(el,engine) {
     this.$el=$(el);
     this.engine =engine;
   }
   Widget.prototype={
     refresh:function(){
       var self = this;
       if(self.view){
         if(self.view.refresh){
           self.view.refresh();
         }else{
            console.log('Widget View refresh NONE');
         }
       }else{
         console.log('Widget refresh');
       }

     },
     init:function(config){
       this.config=config;
       this.initEvent(this.$el)
       this.uuid= fish.uniqueId("widget_")
       this.$el.attr('id',this.uuid);
       this.load();
       return this.uuid;
     },
     initEvent:function(){
       var self =this;
       this.$el.find('.glyphicon-trash').off('click').on('click',function(){
         self.remove();
       })
     },
     remove:function(){
        this.engine.removeWidget(this.$el,this.uuid);
     },
     resize:function(w,h){
       if(this.view){
         this.view.widgetResize(w,h);
       }

     },
     load:function(){
       var self =this;
       if(this.config.url){
         require([this.config.url], function(Widget) {
             var $el =self.$el.find('.content')
             var w=self.$el.innerWidth();
             var h=self.$el.innerHeight()-(self.$el.find('.header').innerHeight()*1.1);
             var data = self.config.data;
             var view =new Widget({el:$el,'w':w,'h':h,'data':data}).render();
             self.view= view;
         })

       }


     }
   }


   return Widget
})
