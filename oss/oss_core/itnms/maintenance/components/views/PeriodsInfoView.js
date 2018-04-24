define([
  "text!oss_core/itnms/maintenance/components/views/BaseInfoView.html",
],function(tpl){
   var PeriodsInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);
   }
   PeriodsInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl())
     this.afterRender();
   }
   PeriodsInfoView.prototype.remove=function(){
    this.$el.html("");
   }
   PeriodsInfoView.prototype.afterRender=function(){

   }
   PeriodsInfoView.prototype.getInfo=function(){
     return this.$el.find('.testInfo').val();
   }
   return PeriodsInfoView;
});
