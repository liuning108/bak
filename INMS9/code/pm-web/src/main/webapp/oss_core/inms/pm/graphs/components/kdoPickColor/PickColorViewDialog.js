define([
 "text!oss_core/inms/pm/graphs/components/kdoPickColor/pickColorViewDialog.html", 'frm/fish-desktop/third-party/colorpicker/fish.colorpicker', 'css!frm/fish-desktop/third-party/colorpicker/colorpicker.css'
], function(tpl) {
  var PickColorViewDialog = function() {
    this.tpl = fish.compile(tpl);
  };
  PickColorViewDialog.prototype.content = function() {
    this.$el = $(this.tpl())
    return this.$el;
  }
  PickColorViewDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  PickColorViewDialog.prototype.afterPopup = function() {
    var self = this;
    self.initColorEvent()
    this.$el.find('.color-thumb').off('click').on('click',function(){
       self.choseColor($(this))
    })
    this.$el.find('.reset').off('click').on('click', function() {
      self.$popup.hide();
    });

    this.$el.find('.OK').off('click').on('click', function() {
      self.callback(self.colorPick.val())
      self.$popup.hide();
    });

  }
  PickColorViewDialog.prototype.choseColor=function($colorEl) {
     this.$el.find('.checked').removeClass('checked');
     var color =$colorEl.css("backgroundColor")
     $colorEl.addClass('checked');
     this.setColor(color)
  }
  PickColorViewDialog.prototype.initColorEvent=function() {
      var currColor =this.props.color;
      this.colorPick=this.$el.find('.colorPick').colorpicker();
      var colorEL=this.findELByColor(currColor);
      if(colorEL){
        this.choseColor(colorEL);
      }
      this.setColor(currColor)
  }
  PickColorViewDialog.prototype.setColor=function(color) {
    this.colorPick.colorpicker("set",color);
  }
  PickColorViewDialog.prototype.findELByColor=function(currColor){
    var cur =(""+currColor).toUpperCase();
    var colorEL =fish.find(this.$el.find('.color-thumb'),function(d){
          var d_color =(""+$(d).data('color')).toUpperCase();
          if(d_color==cur){
            return true;
          }
    })
    return $(colorEL);
  }

  return PickColorViewDialog;
})
