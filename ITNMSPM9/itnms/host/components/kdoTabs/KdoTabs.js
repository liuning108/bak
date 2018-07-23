define(["text!oss_core/itnms/host/components/kdoTabs/kdoTabs.html"], function(tpl) {
  var KdoTabs = function(option) {
              this.option = option;
              this.$el = $(this.option.el);
                  this.tpl = fish.compile(tpl);

  }
  KdoTabs.prototype.render = function() {
    this.remove();
    var self = this;
    self.$el.html(this.tpl({'data': self.option.data, isMore: self.option.isMore, moreData: self.option.moreData, title: self.option.moreTitle}));
    self.clickTabEvent();
    self.active(this.option.startPage)

  }
  KdoTabs.prototype.remove = function() {
    this.$el.html("");
  }
  KdoTabs.prototype.clickTabEvent = function() {
    var self = this;
    this.$el.find('.kdo-tab').off('click').on('click', function() {
      var page = $(this).data('page');
      self.active(page);
    }) //end of click event;

    this.$el.find('.tab-more-tab').off('click').on('click', function() {
      var page = $(this).data('page');

      self.more_active(page);
    })
  }
  KdoTabs.prototype.active = function(page) {
    var self = this;
    self.$el.find('.MoreTitle').text(this.option.moreTitle);
    self.$el.find('.kdo-tabs-active').removeClass("kdo-tabs-active");
    self.$el.find('.kdo-tab[data-page=' + page + ']').addClass('kdo-tabs-active');
    self.$el.find('.kdo-tabl-context').find('.kdoTabPage').hide();
    var context = self.$el.find('.kdo-tabl-context').find('.kdo-tab-' + page);
    context.show();
    var data = fish.find(self.option.data, function(d) {
      return d.id == page
    })
    data.view(context);
  }
  KdoTabs.prototype.more_active = function(page) {
    var self = this;
    self.$el.find('.kdo-tabs-active').removeClass("kdo-tabs-active");
    self.$el.find('.kdo-more').addClass('kdo-tabs-active');
    self.$el.find('.kdo-tabl-context').find('.kdoTabPage').hide();
    var context = self.$el.find('.kdo-tabl-context').find('.kdo-tab-' + page);
    context.show();
    var data = fish.find(self.option.moreData, function(d) {
      return d.id == page
    })
    self.$el.find('.MoreTitle').text(data.name);
    data.view(context);
  }

  return KdoTabs;

})
