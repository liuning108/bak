define([

], function() {

    return {
        changeText:function($text,g,name,fun) {
            var check=fun||function(){return true};
            $text.val(g.attrs[name])
                 .off('change')
                 .on('change',function() {
                    if (check()){
                         g.attrs[name] = $(this).val();
                         g.redraw();
                    }
                 })
        },
        changeColor:function($colorpicker,g,name) {
            var colorpicker =$colorpicker.colorpicker();
            colorpicker.colorpicker("set", g.attrs[name]);
            colorpicker.off("move.colorpicker");
            colorpicker.on("move.colorpicker", function(e, color) {
                g.attrs[name]=""+color;
                g.redraw();
            })
        },
        avg:function(array) {
          var sum=0;
          for (var i = 0; i < array.length; i++) {
               var num=array[i]
               sum+=num;
          }
         return sum/array.length;
        },
        // TODO: 自定义Slider(done)
        sliderTooltip: function(id, init_value, min, max, step, fun) {

            var tooltip = $('<div class="sliderTooltip" />').css({position: 'absolute', top: -25, left: -18}).hide();
            tooltip.text(init_value);
            fun(init_value);
            var $slider = $(id).slider({
                value: init_value,
                'min': min,
                'max': max,
                'step': step,
                slide: function(e, ui) {
                    tooltip.text(ui.value);
                    fun(ui.value);
                }
            })

            $slider.find(".ui-slider-handle").append(tooltip).hover(function() {
                var len = tooltip.text().length
                if (len <= 0) {
                    tooltip.hide();
                } else {
                    tooltip.show()
                }
            }, function() {
                tooltip.hide()
            }); //显示提示信息

        }, // end of sliderTooltip
    }
});
