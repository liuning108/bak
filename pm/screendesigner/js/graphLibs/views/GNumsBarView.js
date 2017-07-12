define([
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GNumsBarConfig.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(DBConfigTreeView,tpl,JSONEditor) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function(gText) {
            this.gText = gText;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        jsonEditor:function($parent){
            var self =this;
            var $editor_content = $parent.find("#json-editor");
            $editor_content.css({
                'height': "600px"
            });
            self.editor = new JSONEditor($editor_content[0], {
                'mode': 'code'
            });
            var json = {
                series: {
                    data: [self.gText.getVal()]
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if(json.series.data){
                        self.gText.setVal(json.series.data[0]||0);
                        self.gText.redraw();
                     }
                   });

        },

        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.gText}).render().afterRender()
          //  self.jsonEditor($parent);
            //位数
            $('#digit_nums_input').val(self.gText.getDigits());
            self.sliderTooltip('#digit_nums', self.gText.getDigits(), 1, 20, 1, function(value) {
                $('#digit_nums_input').val(value);
                self.gText.setDigits(value);
            });
            //数值Color
            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.getTitleColor());
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setTitleColor(color)
            })
            //面板
            var panel_colorpicker = $parent.find(".panel_colorpicker").colorpicker();
            panel_colorpicker.colorpicker("set", this.gText.getPanelColor());
            panel_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setPanelColor(color)
            })
            //单位
            $parent.find('.unit_title').val(this.gText.getUnit());
            $parent.find('.unit_title').on('change',function(){
                   self.gText.setUnit($(this).val());
            })


            return this;
        },
        // TODO: 自定义Slider(done)
        sliderTooltip: function(id, init_value, min, max, step, fun) {

            var tooltip = $('<div class="sliderTooltip" />').css({
                position: 'absolute',
                top: -25,
                left: -18
            }).hide();
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

        }


    })
});
