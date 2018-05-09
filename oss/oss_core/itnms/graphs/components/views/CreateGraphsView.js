define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/views/CreateGraphsView.html"
], function(RootView, util,tpl) {
  var evetMap = [
    {'el': '.graphsCancel','type': 'click','handel': 'cancel'},
    {'el': '.graphsOK','type': 'click','handel': 'ok'},

  ]
  var CreateGraphsView = RootView.extend({
    initProp: function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    loadPage: function() {
      this.$el.html(this.tpl());
    },
    afterRender: function() {

    },
    cancel: function() {
      util.doNotNull(this.option.cancel);
    },
    ok:function() {
     util.doNotNull(this.option.ok);
    },
  })
  return CreateGraphsView;
});
