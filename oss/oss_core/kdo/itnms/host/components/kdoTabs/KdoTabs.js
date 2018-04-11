define(["text!oss_core/kdo/itnms/host/components/kdoTabs/kdoTabs.html"], function(tpl) {
  var KdoTabs = function(option) {
    this.option = option;
    this.$el = $(this.option.el);
    this.tpl = fish.compile(tpl);
  }
  KdoTabs.prototype.render = function() {
    this.remove();
    var self = this;
    self.$el.html(this.tpl({'data': self.option.data, isMore: self.option.isMore, more: self.option.more}));
    self.clickTabEvent();
    self.active(0)

  }
  KdoTabs.prototype.remove = function() {
    this.$el.html("");
  }
  KdoTabs.prototype.clickTabEvent = function() {
    var self = this;
    this.$el.find('.kdo-tab').off('click').on('click', function() {
      var index = Number($(this).data('index'));
      self.active(index);
    }) //end of click event;
  }
  KdoTabs.prototype.active = function(index) {
    var self = this;
    self.$el.find('.kdo-tabs-active').removeClass("kdo-tabs-active");
    self.$el.find('.kdo-tab[data-index='+index+']').addClass('kdo-tabs-active');
    var context = self.$el.find('.kdo-tabl-context');
    self.option.data[index].view(context)
  }

  return KdoTabs;

})
