define(["text!oss_core/pm/screendesigner/js/graphLibs/views/GProgressBarConfig.html",
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



            var label_colorpicker=$parent.find(".gprocess_colorpicker").colorpicker();
            label_colorpicker.colorpicker("set", this.gText.getProcessColor());
            label_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setProcessColor(color)
            })
            //分子标题
           $parent.find('.member_title').val(this.gText.getMemberTitle());
           $parent.find('.member_title').on('change',function(){
                  self.gText.setMemberTitle($(this).val());
           });
           //分母标题
           $parent.find('.denominator_title').val(this.gText.getDenominatorTitle());
           $parent.find('.denominator_title').on('change',function(){
                  self.gText.setDenominatorTitle($(this).val());
           });
            return this;
        }


    })
});
