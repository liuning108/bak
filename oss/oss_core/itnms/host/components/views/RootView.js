define(["oss_core/itnms/host/utils/stools.js"], function(stools) {
    var Class =stools.getClass();
    var RootView = Class.extend({
      init:function(option){
         this.lo=stools.getLo();
         this.option=option;
         this.$el=$(option.el);
         this.evetMap=[];
         this.initProp()
      },
      initProp:function(){},
      render:function(){
        this.remove();
        this.loadPage();
        this.initEvent();
        this.afterRender();
      },
      initEvent:function() {
        var self =this;
        fish.each(this.evetMap,function(d) {
          self.$el.find(d.el).off(d.type)
             .on(d.type,function(evt){
               self[d.handel]($(this),evt);
             })
      })},
      afterRender:function(){
        alert("afterRender");
      },
      loadPage:function(){
         this.$el.html("Hello World");
      },
      remove:function(){
        this.$el.html("");
      }
    })
    return RootView

});
