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


             $('.FontDirection').val(self.g.getFontDirection());
             $('.FontDirection').on('change',function(){
                 var val = $(this).val();
                 self.g.setFontDirection(val);
             })


             $('.font_bold').addClass(self.g.getBold()?"fontstyleSel":"");
             $('.font_bold').on('click',function(){
                  if($(this).hasClass("fontstyleSel")){
                     $(this).removeClass("fontstyleSel");
                     self.g.setBold(false);
                  }else{
                     $(this).addClass("fontstyleSel");
                     self.g.setBold(true);
                  }
             })


             $('.font_italic').addClass(self.g.getItalic()?"fontstyleSel":"");
             $('.font_italic').on('click',function(){
                  if($(this).hasClass("fontstyleSel")){
                     $(this).removeClass("fontstyleSel");
                     self.g.setItalic(false);
                  }else{
                     $(this).addClass("fontstyleSel");
                     self.g.setItalic(true);
                  }
             })


             $('.font_underline').addClass(self.g.getUnderLine()?"fontstyleSel":"");
             $('.font_underline').on('click',function(){
                  if($(this).hasClass("fontstyleSel")){
                     $(this).removeClass("fontstyleSel");
                     self.g.setUnderLine(false);
                  }else{
                     $(this).addClass("fontstyleSel");
                     self.g.setUnderLine(true);
                  }
             })

             var title_colorpicker = $(".textNode_colorpicker").colorpicker();
             title_colorpicker.colorpicker("set", this.g.getTitleColor());
             title_colorpicker.on("move.colorpicker", function(e, color) {
                 self.g.setTitleColor(color)
             })
        }, //end of RenderHTML




    });
});
