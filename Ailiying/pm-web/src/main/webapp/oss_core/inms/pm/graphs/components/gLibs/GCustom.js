define([
 "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(util, DBUtil) {
 var GCustom = function(option) {
   this.option = option;
   this.$el = $(this.option.el);
 }
 GCustom.prototype.render = function() {
   this.remove();
   this.afterRender();
 }
 GCustom.prototype.remove = function() {
   this.$el.html("");
 }

 GCustom.prototype.resize=function(w,h){
    var self =this;
    self.v.resize(w,h);
 }
 GCustom.prototype.afterRender = function() {
   console.log("GCustom",this.option);
   var self =this;
   var hostPage = this.option.config.tabsConfig.hostPage;
   var url =hostPage.url || ''
   if(url.length<=0) {
     this.$el.find('URL is NULL');
     return ;
   }
   //指标信息
   var topInfo  =hostPage.selItems;
   //维度信息
   var xAxis  = hostPage.xAxisData;
   //数据
   var datas  = this.option.config.kpiDatas.result || [];

   require([url], function(Widget) {

        var v = new Widget({
           $el: self.$el,
           userId:portal.appGlobal.attributes.userId,
           userName:portal.appGlobal.attributes.userName,
           'topInfo':topInfo,
           'xAxis':xAxis,
           'datas':datas,
        })
        v.render();
        self.v = v;
     });
 }
 return GCustom
});
