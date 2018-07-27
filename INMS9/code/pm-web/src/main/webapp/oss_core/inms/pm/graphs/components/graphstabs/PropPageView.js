define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/graphstabs/PropPageView.html",
], function(RootView, util,tpl) {
  var evetMap = [
  ]

  var PropPageView = function(option){
     RootView.call(this, option)
   };
   PropPageView.prototype = Object.create(RootView.prototype);
   PropPageView.prototype.constructor = PropPageView;
    PropPageView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    PropPageView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    PropPageView.prototype.afterRender= function() {
      this.initPage();
    },
    PropPageView.prototype.initPage=function(){
      var self =this;

    }
  return PropPageView;
});
