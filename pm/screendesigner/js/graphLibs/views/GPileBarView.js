define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GPileBarView.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
], function(tpl,JSONEditor) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function(g) {
            this.g = g;
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
                xAxis: {
                    data: self.g.getXAxisNames()
                },
                series: {
                    labels:self.g.getLabels(),
                    data: self.g.getXAxisDatas()
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if(json.xAxis.data && json.series.data && json.series.labels){
                        //set datas
                        self.g.setXAxisNames(json.xAxis.data);
                        self.g.setXAxisDatas(json.series.data);
                        self.g.setLabels(json.series.labels)
                        self.g.redraw()
                    }
                   });

        },


        afterRender: function() {
            var self = this;
            var $parent =$("#tabs");

            $parent.tabs(); //Tab页
                self.jsonEditor($parent);
            var $title =$parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change',function(){
                  self.g.setTitle($(this).val());
            })

            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.g.attrs.titleColor);
            title_colorpicker.on("move.colorpicker", function(e, color) {
               self.g.attrs.titleColor=""+color
               self.g.redraw();
            })

            var chart_colorpicker = $parent.find(".chart_colorpicker").colorpicker();
            chart_colorpicker.colorpicker("set", this.g.attrs.chartColor);
            chart_colorpicker.on("move.colorpicker", function(e, color) {
               self.g.attrs.chartColor=""+color
               self.g.redraw();
            })


            var value_colorpicker = $parent.find(".value_colorpicker").colorpicker();
            value_colorpicker.colorpicker("set", self.g.attrs.valueColor);
            value_colorpicker.on("move.colorpicker", function(e, color) {
               self.g.attrs.valueColor=""+color
               self.g.redraw();
            })


            var c1_colorpicker = $parent.find(".c1_colorpicker").colorpicker();
            c1_colorpicker.colorpicker("set", self.g.attrs.c1Color);
            c1_colorpicker.on("move.colorpicker", function(e, color) {
               self.g.attrs.c1Color=""+color
               self.g.redraw();
            })

            var c2_colorpicker = $parent.find(".c2_colorpicker").colorpicker();
            c2_colorpicker.colorpicker("set", self.g.attrs.c2Color);
            c2_colorpicker.on("move.colorpicker", function(e, color) {
               self.g.attrs.c2Color=""+color
               self.g.redraw();
            })








            $parent.find('.labelSelect').val(self.g.attrs.labelStyle)
                  .off('change')
                  .on('change',function() {
                      var val =$(this).val();
                      self.g.attrs.labelStyle=val;
                      self.g.redraw();
                  })




        }


    })
});
