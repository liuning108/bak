define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GMoveBarConfig.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(i18nData,DBConfigTreeView,tpl,JSONEditor) {

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

                series: {
                    data:  self.gText.getXAxisDatas()
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if( json.series.data){
                        //set datas
                        self.gText.setXAxisDatas(json.series.data);
                        self.gText.redraw();
                     }
                   });

        },


        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.gText}).render().afterRender()
            //self.jsonEditor($parent);

            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.attrs.titleColor);
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.attrs.titleColor=""+color;
                self.gText.redraw();
            })


            var avg_colorpicker = $parent.find(".avg_colorpicker").colorpicker();
            avg_colorpicker.colorpicker("set", this.gText.attrs.avgColor);
            avg_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.attrs.avgColor=""+color;
                self.gText.redraw();
            })




            return this;
        }


    })
});