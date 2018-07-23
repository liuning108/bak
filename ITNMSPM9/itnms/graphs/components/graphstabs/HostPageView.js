define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/HostPageView.html",
  "oss_core/itnms/graphs/components/graphstabs/HostPageItem.js",
], function(RootView, util,tpl,Item) {
  var evetMap = [
    {'el': '.addItem','type': 'click','handel': 'add'},
  ]

  var HostPageView = function(option) {
    RootView.call(this, option)
  };
  HostPageView.prototype = Object.create(RootView.prototype);
  HostPageView.prototype.constructor = HostPageView;
  HostPageView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
  HostPageView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
  HostPageView.prototype.afterRender= function() {
      this.initPage();
    },
  HostPageView.prototype.initPage=function(){
       this.add()
    },
  HostPageView.prototype.add=function(){
      var item =  new Item({
        el:this.$el.find('.itemBody')
      });
      item.render();
    }
  return HostPageView;
});
