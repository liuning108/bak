define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/ShowPageView.html",
  "oss_core/itnms/graphs/components/graphstabs/ShowPageItem.js",
], function(RootView, util,tpl,Item) {
  var evetMap = [
    {'el': '.addItem','type': 'click','handel': 'add'},
  ]
  var ShowPageView = function(option){
    RootView.call(this, option)
  };
  ShowPageView.prototype = Object.create(RootView.prototype);
  ShowPageView.prototype.constructor = ShowPageView;
    ShowPageView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    ShowPageView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    ShowPageView.prototype.afterRender=function() {
      this.initPage();
    },
    ShowPageView.prototype.initPage=function(){
       this.add()
    },
    ShowPageView.prototype.add=function(){
      var item =  new Item({
        el:this.$el.find('.itemBody')
      });
      item.render();
    }
  return ShowPageView;
});
