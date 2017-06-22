define(["text!oss_core/pm/screendesigner/js/graphLibs/views/GTextConfig.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(tpl,JSONEditor) {

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
                    data: [self.gText.getValue()]
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if(json.series.data){
                        //set datas
                        self.gText.setValue(json.series.data[0]);
                        self.gText.redraw();
                     }
                   });

    },
        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            self.jsonEditor($parent);
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
