define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/GraphsTabsView.html",
], function(RootView, util,tpl) {
  var evetMap = [
  ]
  var GraphsTabsView = RootView.extend({
    initProp: function() {
      this.tpl=fish.compile(tpl);
      this.evetMap = evetMap;
    },
    loadPage: function() {
      this.$el.html(this.tpl());
    },
    afterRender: function() {
      this.tabs=this.$el.find('.gtabs').tabs();
      this.addTabs("hostPage","监控项",true);
      this.addTabs("propPage","显示属性");


    },
    addTabs:function(page,label,active){
      var id = "kdo-g-tabs-"+page;
      this.tabs.tabs("add",{id:id,"active":active,'label':label});
      this.$el.find("#"+id).append("jquery load ...");
    }
  })
  return GraphsTabsView;
});
