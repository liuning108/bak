define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/GraphsTabsView.html",
  "oss_core/itnms/graphs/components/graphstabs/HostPageView.js",
  "oss_core/itnms/graphs/components/graphstabs/ShowPageView.js",
  "oss_core/itnms/graphs/components/graphstabs/AixsPageView.js",
  "oss_core/itnms/graphs/components/graphstabs/PropPageView.js"
], function(RootView, util,tpl,HostPageView,ShowPageView,AixsPageView,PropPageView) {
  var evetMap = [
  ]
  var pageMap ={
    "HostPage":HostPageView,
    "ShowPage":ShowPageView,
    "AixsPage":AixsPageView,
    "PropPage":PropPageView,
  }
  var GraphsTabsView = function(option){
    RootView.call(this, option)
  };
  GraphsTabsView.prototype = Object.create(RootView.prototype);
  GraphsTabsView.prototype.constructor = GraphsTabsView;
  GraphsTabsView.prototype.initProp=function() {
       this.tpl=fish.compile(tpl);
      this.evetMap = evetMap;
    };
  GraphsTabsView.prototype.loadPage=function() {
      this.$el.html(this.tpl());
    };
  GraphsTabsView.prototype.afterRender=function() {
      this.tabs=this.$el.find('.gtabs').tabs();

      this.addTabs("HostPage","监控项",true);
      this.addTabs("PropPage","显示属性");
      this.addTabs("AixsPage","坐标轴");
      this.addTabs("ShowPage","显示");

    };
  GraphsTabsView.prototype.addTabs=function(page,label,active){
      var ViewPage = pageMap[page]
      if(!ViewPage)return;
      var id = "kdo-g-tabs-"+page;
      this.tabs.tabs("add",{id:id,"active":active,'label':label});
      var el=$("<div class='"+id+"-page'></div>")
             .appendTo(this.$el.find("#"+id));
      var viewPage =new ViewPage({
        'el':el,
      });
      viewPage.render();
    }
  return GraphsTabsView;
});
