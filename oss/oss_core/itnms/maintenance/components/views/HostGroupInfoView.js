define([
  "text!oss_core/itnms/maintenance/components/views/HostGroupInfoView.html",
],function(tpl){
   var HostGroupInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);
   }
   HostGroupInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl())
     this.afterRender();
   }
   HostGroupInfoView.prototype.remove=function(){
    this.$el.html("");
   }
   HostGroupInfoView.prototype.afterRender=function(){

   }
   HostGroupInfoView.prototype.getInfo=function(){
     return this.$el.find('.testInfo').val();
   }
   return HostGroupInfoView;
});
