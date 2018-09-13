define([
   "text!oss_core/inms/pm/graphs/components/views/addClassViewDialog.html"
],
  function(tpl){
    AddClassDialog =function(){
        this.tpl = fish.compile(tpl);
    }
    AddClassDialog.prototype.content = function() {
      this.$el = $(this.tpl())
      return this.$el;
    }
    AddClassDialog.prototype.popup = function(options, props, callback) {
      options.content = this.content(),
      this.$popup = fish.popup(options);
      this.props = props;
      this.callback = callback;
      this.afterPopup();
    }

    AddClassDialog.prototype.afterPopup = function() {
      var self = this;
      this.$el.find('.reset').off('click').on('click', function() {
        self.$popup.hide();
      });

      this.$el.find('.OK').off('click').on('click', function() {
        var name =self.$el.find('.newClassName').val();
        if(name.trim().length>0){
          self.callback(name)
          self.$popup.hide();
        }
      });

    }

    return AddClassDialog;
})
