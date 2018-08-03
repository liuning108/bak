define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/AixsPageView.html"
], function(RootView, util, tpl) {
  var evetMap = []
  var AixsPageView = function(option) {
    RootView.call(this, option)
  };
  AixsPageView.prototype = Object.create(RootView.prototype);
  AixsPageView.prototype.constructor = AixsPageView;
  AixsPageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  AixsPageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  AixsPageView.prototype.afterRender = function() {
    this.initPage();

  },
  AixsPageView.prototype.initPage = function() {
    var self = this;
    this.$el.find('.axisSwitch').off('change').on("change", function() {
      self.switchGrid($(this));
    })
    fish.each(this.$el.find('.axisSwitch'), function(dom) {
      self.switchGrid($(dom));
    })

  },
  AixsPageView.prototype.switchGrid = function(target) {
    var $target = target;
    var el = $target.data('el');
    var flag = $target.is(':checked');
    var $context = this.$el.find(el);
    if (flag) {
      $context.show();
    } else {
      $context.hide();
    }
  }
  return AixsPageView;
});
