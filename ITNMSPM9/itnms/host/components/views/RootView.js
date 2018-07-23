define([
  'frm/fish-desktop/third-party/colorpicker/fish.colorpicker', 'css!frm/fish-desktop/third-party/colorpicker/colorpicker.css'
], function() {
  var RootView = function(option) {
      this.init(option);
    }
    RootView.prototype.init = function(option) {
      this.option = option;
      this.$el = $(option.el);
      this.evetMap = [];
      this.initProp()
    },
    RootView.prototype.initProp = function() {};
    RootView.prototype.render = function() {
      this.remove();
      this.loadPage();
      this.initEvent();
      this.afterRender();
    };
    RootView.prototype.initEvent = function() {
      var self = this;
      fish.each(this.evetMap, function(d) {
        self.$el.find(d.el).off(d.type).on(d.type, function(evt) {
          self[d.handel]($(this), evt);
        })
      })
    },
    RootView.prototype.afterRender = function() {
      alert("afterRender");
    };
    RootView.prototype.loadPage = function() {
      this.$el.html("Hello World");
    },
    RootView.prototype.remove = function() {
      this.$el.html("");
    }
    return RootView

  });
