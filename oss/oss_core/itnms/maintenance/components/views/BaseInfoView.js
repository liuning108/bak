define([
  "text!oss_core/itnms/maintenance/components/views/BaseInfoView.html",
],function(tpl){
   var BaseInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);

   }
   BaseInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl())
     this.afterRender();
   }
   BaseInfoView.prototype.remove=function(){
    this.$el.html("");
   }
   BaseInfoView.prototype.afterRender=function(){

   }
   BaseInfoView.prototype.getInfo=function(){
     return this.$el.find('.testInfo').val();
   }
   return BaseInfoView;
});
