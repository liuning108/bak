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
     this.init();
   }
   BaseInfoView.prototype.init=function(){
     var self =this;
     this.$el.find('.mainName').val(this.option.data.name)
     this.$el.find('.mainDesc').val(this.option.data.description);
     var maintenance_type =this.option.data.maintenance_type;
     this.$el.find('input[name="mainType"][value="'+maintenance_type+'"]')
             .attr("checked","checked");
     this.startTime=this.$el.find('.startTime')
                        .datetimepicker({"format":"yyyy-mm-dd hh:ii"});
     this.endTime =this.$el.find('.endTime')
                        .datetimepicker({"format":"yyyy-mm-dd hh:ii"});
     var active_since=this.option.data.active_since;
     var active_till=this.option.data.active_till;
     this.startTime.datetimepicker("value",self.getDate(active_since));
     this.endTime.datetimepicker("value",self.getDate(active_till));
   }
   BaseInfoView.prototype.getInfo=function(){
     var self =this;
     var info = {};
     info.name=this.$el.find('.mainName').val();
     info.description=this.$el.find('.mainDesc').val();
     info.maintenance_type=this.$el.find("input[name='mainType']:checked").val()
     info.active_since=self.getTime(this.startTime.datetimepicker("getDate"));
     info.active_till=self.getTime(this.endTime.datetimepicker("getDate"));
     return info;

   }
   BaseInfoView.prototype.getTime=function(date){
       return parseInt(date.getTime()/1000);
   }
   BaseInfoView.prototype.getDate=function(value){
       return new Date(value*1000);;
   }
   return BaseInfoView;
});
