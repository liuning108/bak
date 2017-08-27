/**
 * 指标筛选弹出窗
 */
define([
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
    "text!oss_core/pm/dashboard/js/glibs/views/TextNodeConfig.html",
    "oss_core/pm/dashboard/js/colorpicker/fish.colorpicker",
], function(i18nData,tpl) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
        resource : fish.extend({}, i18nData),
        initialize: function(g) {
            this.g = g;
        },
        events: {

        },
        render: function() {
            this.$el.html(this.template(this.resource));
            return this;
        },
        afterRender: function(data) {
            this.RenderHTML();
            return this;
        },
        RenderHTML: function() {
            var self = this;
             $("#textNodetabs").tabs(); //Tab页

             $('.FontSizeSel').val(self.g.getFontSize());
             $('.FontSizeSel').on('change',function(){
                 var val = $(this).val();
                 self.g.setFontSize(val);
             })
             $('.FontFamilySel').val(self.g.getFontFamily());
             $('.FontFamilySel').on('change',function(){
                 var val = $(this).val();
                 self.g.setFontFamily(val);
             })

             var title_colorpicker = $(".textNode_colorpicker").colorpicker();
             title_colorpicker.colorpicker("set", this.g.getTitleColor());
             title_colorpicker.on("move.colorpicker", function(e, color) {
                 self.g.setTitleColor(color)
             })




        }, //end of RenderHTML




    });
});
