define([
  "oss_core/pm/screendesigner/views/ServerTimeView",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GStripLineConfig.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(STView,i18nData,DBConfigTreeView,tpl,JSONEditor) {

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
                    data: self.gText.getXAxisName()
                },
                series: {
                    data: self.gText.getXAxisDatas()
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
                        self.gText.setXAxisName(json.xAxis.data);
                        self.gText.setXAxisDatas(json.series.data)
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
            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.attrs.titleColor);
            title_colorpicker.on("move.colorpicker", function(e, color) {
               self.gText.attrs.titleColor=""+color
               self.gText.redraw();
            })

            var line_colorpicker = $parent.find(".line_colorpicker").colorpicker();
            line_colorpicker.colorpicker("set", this.gText.attrs.lineColor);
            line_colorpicker.on("move.colorpicker", function(e, color) {
               self.gText.attrs.lineColor=""+color
               self.gText.redraw();
            })

            var dot_colorpicker = $parent.find(".dot_colorpicker").colorpicker();
            dot_colorpicker.colorpicker("set", this.gText.attrs.dotColor);
            dot_colorpicker.on("move.colorpicker", function(e, color) {
               self.gText.attrs.dotColor=""+color
               self.gText.redraw();
            })

            var label_colorpicker = $parent.find(".label_colorpicker").colorpicker();
            label_colorpicker.colorpicker("set", this.gText.attrs.labelColor);
            label_colorpicker.on("move.colorpicker", function(e, color) {
               self.gText.attrs.labelColor=""+color
               self.gText.redraw();
            })

            $parent.find('.labelSelect').val(self.gText.attrs.labelStyle)
                   .off('change')
                   .on('change',function() {
                        var val= $(this).val();
                        self.gText.attrs.labelStyle=val;
                        self.gText.redraw();
                   });
            var stView=new STView({"el":$("#bg_stView"),'g':this.gText,'isNeedSwitch':true}).render();


            return this;
        }


    })
});
