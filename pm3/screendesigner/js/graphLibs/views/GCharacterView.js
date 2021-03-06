define([
    "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GCharacterConfig.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(i18nData,tpl,JSONEditor) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
          resource : fish.extend({}, i18nData),
        initialize: function(gText) {
            this.gText = gText;
        },
        render: function() {
            this.$el.html(this.template(this.resource));
            return this;
        },

        gtext_title: function(target) {
            this.gText.setTitle(target.val());
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
                xAxis: {
                    data: [1,2,3]
                },
                series: {
                    data: [1,2,3]
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if(json.xAxis.data && json.series.data){
                        //set datas
                     }
                   });


        },


        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
          //  self.jsonEditor($parent);
            $parent.find('.gtext_title').on('change',function(){
                   self.gtext_title($(this));
                   self.gText.redraw();
            })
            $parent.find('.gtext_title').val(this.gText.getTitle());
            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.getTitleColor());
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setTitleColor(color)
                self.gText.redraw();
            })
            $parent.find('#gtext_direction').val(self.gText.attrs.direction)
                   .off('change')
                   .on('change',function() {
                       var val=   $(this).val();
                       self.gText.attrs.direction=val;
                       self.gText.redraw();
                   })


            return this;
        }


    })
});
