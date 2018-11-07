
define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/CGPageView.html"
], function(RootView, util, tpl) {
  var evetMap = []
  var CGPageView = function(option) {
    RootView.call(this, option)
  };
  CGPageView.prototype = Object.create(RootView.prototype);
  CGPageView.prototype.constructor = CGPageView;
  CGPageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  CGPageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  CGPageView.prototype.afterRender = function() {
    var self =this;

    this.initPage();

  },
  CGPageView.prototype.getJSON=function(){
      var json = {};
      json.value=this.$el.find('.cg_address').val();
      return json
    }
  CGPageView.prototype.initPage = function() {
    var config = this.option.state.config||{};
    var cgPageConfig =config.cgPage||{value:""}
    this.$el.find('.cg_address').val(cgPageConfig.value)
    console.log('CGPageView config',config);
    var self = this;
  }

  return CGPageView;
});
