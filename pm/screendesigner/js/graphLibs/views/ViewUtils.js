define([

], function() {

    return {
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
