define([
  "oss_core/itnms/graphs/components/graphstabs/GraphsTabsView.js",
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/ShowPageView.html",
  "oss_core/itnms/graphs/components/graphstabs/ShowPageItem.js",
], function(GraphsTabsView,RootView, util,tpl,Item) {
  var evetMap = [
    {'el': '.addItem','type': 'click','handel': 'add'},
  ]
  var ShowPageView = RootView.extend({
    initProp: function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    loadPage: function() {
      this.$el.html(this.tpl());
    },
    afterRender: function() {
      this.initPage();
    },
    initPage:function(){
       this.add()
    },
    add:function(){
      var item =  new Item({
        el:this.$el.find('.itemBody')
      });
      item.render();
    }


  })
  return ShowPageView;
});
