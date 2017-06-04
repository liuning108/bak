define(["text!oss_core/pm/screendesigner/js/graphLibs/views/GTextConfig.html",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(tpl) {

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

        gtext_title: function(target) {
            this.gText.setTitle(target.val());
        },


        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            $parent.find('.gtext_title').on('change',function(){
                   self.gtext_title($(this));
            })
            $parent.find('.gtext_title').val(this.gText.getTitle());
            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.getTitleColor());
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setTitleColor(color)
            })
            var num_colorpicker=$parent.find(".gtext_num_colorpicker").colorpicker();
            num_colorpicker.colorpicker("set", this.gText.getNumColor());
            num_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setNumColor(color);
            })
            return this;
        }


    })
});
