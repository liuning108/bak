define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/graphstabs/GraphsTabsView.html",
  "oss_core/inms/pm/graphs/components/graphstabs/HostPageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/ShowPageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/AixsPageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/PropPageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/LengedPageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/TimePageView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/CGPageView.js"
], function(RootView, util,tpl,HostPageView,ShowPageView,AixsPageView,PropPageView,LengedPageView,TimePageView,CGPageView) {
  var evetMap = [
  ]
  var pageMap ={
    "HostPage":HostPageView,
    "LengedPage":LengedPageView,
    "AixsPage":AixsPageView,
    "PropPage":PropPageView,
    "ShowPage":ShowPageView,
    "TimePage":TimePageView,
    "CustomG":CGPageView,
  }
  var GraphsTabsView = function(option){
    RootView.call(this, option)
  };
  GraphsTabsView.prototype = Object.create(RootView.prototype);
  GraphsTabsView.prototype.constructor = GraphsTabsView;
  GraphsTabsView.prototype.initProp=function() {
       this.tpl=fish.compile(tpl);
       this.evetMap = evetMap;
       this.state = {
         "items":this.option.items,
         "dims":this.option.dims,
         "config":this.option.config,
         'granusConfig':this.option.granusConfig
       }
       this.pages={};
    };
  GraphsTabsView.prototype.loadPage=function() {
      this.$el.html(this.tpl());
    };
  GraphsTabsView.prototype.afterRender=function() {
      this.tabs=this.$el.find('.gtabs').tabs({
         paging: {"selectOnAdd":true}//,"cycle":true
        }
      );
      var name ='监控项';
      if(""+this.option.type=="11"){
          name ='基本属性';
      }

      this.addTabs("HostPage",name,true);
      this.addTabs("TimePage","时间范围");
      this.addTabs("PropPage","显示属性");
      this.addTabs("AixsPage","坐标轴");
      this.addTabs("LengedPage","图例");
      this.addTabs("ShowPage","辅助线");
      if(""+this.option.type=="11"){
            this.tabs.tabs("hideTab",2);
            this.tabs.tabs("hideTab",3);
            this.tabs.tabs("hideTab",4);
            this.tabs.tabs("hideTab",5);
      }
  };
  GraphsTabsView.prototype.addTabs=function(page,label,active){
      var ViewPage = pageMap[page]
      var state = this.state;
      if(!ViewPage)return;
      var id = "kdo-g-tabs-"+page;
      this.tabs.tabs("add",{id:id,"active":active,'label':label});
      var el=$("<div class='"+id+"-page'></div>")
             .appendTo(this.$el.find("#"+id));
      console.log("GraphsTabsView State",state);
      var viewPage =new ViewPage({
        'el':el,
        'state':state,
        'type':this.option.type
      });
      viewPage.render();
      this.pages[page]=viewPage;
    }
    GraphsTabsView.prototype.getJSON=function(){
         var json = {};
         json.hostPage=this.pages["HostPage"].getJson();
         json.aixsPage=this.pages["AixsPage"].getJSON();
         json.lengedPage=this.pages["LengedPage"].getJSON();
         json.propPage=this.pages["PropPage"].getJSON();
         json.showPage=this.pages["ShowPage"].getJSON();
         json.timePage =this.pages['TimePage'].getJSON();
         console.log('GJSON',json)
         return json;
    }
  return GraphsTabsView;
});
