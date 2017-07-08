define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GPileBarView.html",
    "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
    "oss_core/pm/screendesigner/js/graphLibs/views/ViewUtils",
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "oss_core/pm/screendesigner/js/dbHelper/DBHelper"

], function(tpl, JSONEditor, ViewUtils, DBConfigTreeView,dbHelper) {

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

        jsonEditor: function($parent) {

            var self = this;
            var $editor_content = $parent.find("#json-editor");
            $editor_content.css({'height': "600px"});
            self.editor = new JSONEditor($editor_content[0], {'mode': 'code'});
            var json = {
                xAxis: {
                    data: self.g.getXAxisNames()
                },
                series: {
                    labels: self.g.getLabels(),
                    data: self.g.getXAxisDatas()
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure").off('click').on('click', function() {
                var json = self.editor.get();
                if (json.xAxis.data && json.series.data && json.series.labels) {
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
            var $parent = $("#tabs");

            $parent.tabs(); //Tab页

            self.g.attrs.dbServer = {
                'serverName':'新装量预览服务',
                'islocal':true,
                'xAxis':['field_1'],
                'yAxis':['field_2','field_3'],
                'xNums':1,
                'yNums':2
            }
            //
            var dbTreeJson = dbHelper.getJson(self.g);
            console.log(dbTreeJson);
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree', 'db': dbTreeJson}).render();
            dbCofnfigTreeView.afterRender();

            self.jsonEditor($parent);
            var $title = $parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change', function() {
                self.g.setTitle($(this).val());
            })

            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.g.attrs.titleColor);
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.g.attrs.titleColor = "" + color
                self.g.redraw();
            })

            var chart_colorpicker = $parent.find(".chart_colorpicker").colorpicker();
            chart_colorpicker.colorpicker("set", this.g.attrs.chartColor);
            chart_colorpicker.on("move.colorpicker", function(e, color) {
                self.g.attrs.chartColor = "" + color
                self.g.redraw();
            })

            var value_colorpicker = $parent.find(".value_colorpicker").colorpicker();
            value_colorpicker.colorpicker("set", self.g.attrs.valueColor);
            value_colorpicker.on("move.colorpicker", function(e, color) {
                self.g.attrs.valueColor = "" + color
                self.g.redraw();
            })

            var c1_colorpicker = $parent.find(".c1_colorpicker").colorpicker();
            c1_colorpicker.colorpicker("set", self.g.attrs.c1Color);
            c1_colorpicker.on("move.colorpicker", function(e, color) {
                self.g.attrs.c1Color = "" + color
                self.g.redraw();
            })

            var c2_colorpicker = $parent.find(".c2_colorpicker").colorpicker();
            c2_colorpicker.colorpicker("set", self.g.attrs.c2Color);
            c2_colorpicker.on("move.colorpicker", function(e, color) {
                self.g.attrs.c2Color = "" + color
                self.g.redraw();
            })

            $parent.find('.switchGrid').attr('checked', self.g.attrs.bgShow).off('change').on('change', function() {
                var checked = $(this).is(':checked')
                self.g.attrs.bgShow = checked;
                self.g.redraw();
            })

            var gtext_colorpicker_label = $parent.find(".gtext_colorpicker_label").colorpicker();
            gtext_colorpicker_label.colorpicker("set", self.g.attrs.bgColor);
            gtext_colorpicker_label.on("move.colorpicker", function(e, color) {
                self.g.attrs.bgColor = "" + color
                self.g.redraw();
            })

            ViewUtils.sliderTooltip('#slider2', self.g.attrs.ww, 532, 1080, 1, function(value) {
                $('#slider2_input').val(value);
                if (self.g.attrs.ww == value)
                    return;
                self.g.attrs.ww = value;
                self.g.redraw();
            });
            ViewUtils.sliderTooltip('#slider3', self.g.attrs.hh, 377, 1080, 1, function(value) {
                $('#slider3_input').val(value);
                if (self.g.attrs.hh == value)
                    return;
                self.g.attrs.hh = value;
                self.g.redraw();
            });

        }

    })
});
