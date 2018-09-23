define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/utils/util.js", "oss_core/inms/pm/graphs/utils/DBUtil.js"
], function(echarts, util, DBUtil) {
  var GError = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
  }
  GError.prototype.render = function() {
    this.remove();
    this.afterRender();
  }
  GError.prototype.remove = function() {
    this.$el.html("");
  }
  GError.prototype.resize=function(){

  }

  GError.prototype.afterRender = function() {
    var config = this.option.config;
    this.$el.html("Create Chart Error: Type Error "+ config.gtype)
  }
  return GError
});
