define([
"text!oss_core/inms/pm/resMgr/libs/kdoDSelect/kdoSelectDialog.html",
     "oss_core/inms/pm/resMgr/libs/kdoDSelect/KdoDSelect",
], function(tpl,KdoDSelect) {
  var kdoSelectDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  kdoSelectDialog.prototype.content = function() {
    this.$el = $(this.tpl())
    return this.$el;
  }
  kdoSelectDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  kdoSelectDialog.prototype.afterPopup = function() {
    var self = this;
    this.$el.find('.modal-title').html(this.props.title);
    this.kdoDSelect =  new KdoDSelect({
         el:self.$el.find('.kdo-reslect-block'),
         L:self.props.L,
         R:self.props.R,
     });
    this.kdoDSelect.render()
    this.$el.find('.color-thumb').off('click').on('click',function(){
       self.choseColor($(this))
    })
    this.$el.find('.reset').off('click').on('click', function() {
      self.$popup.hide();
    });

    this.$el.find('.OK').off('click').on('click', function() {
      self.$popup.hide();
      self.callback(self.kdoDSelect.val())

    });

  }
  kdoSelectDialog.prototype.choseColor=function($colorEl) {
     this.$el.find('.checked').removeClass('checked');
     var color =$colorEl.css("backgroundColor")
     $colorEl.addClass('checked');
     this.setColor(color)
  }


  return kdoSelectDialog;
})
