define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GBarView.html", "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min", "oss_core/pm/screendesigner/js/graphLibs/views/ViewUtils"
], function(i18nData,DBConfigTreeView,tpl, JSONEditor, ViewUtils) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
          resource : fish.extend({}, i18nData),
        initialize: function(g) {
            this.g = g;
        },
        render: function() {
            this.$el.html(this.template(this.resource));
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
                    data: self.g.getXAxisDatas()
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure").off('click').on('click', function() {
                var json = self.editor.get();
                if (json.xAxis.data && json.series.data) {
                    //set datas
                    self.g.setXAxisNames(json.xAxis.data)
                    self.g.setXAxisDatas(json.series.data)
                    self.g.redraw();
                }
            });

        },

        levelConfig: function($parent) {
            var self = this;
            var $levelConfig = $parent.find('.levelConfig')
            var $bar_colorpickerDiv=$parent.find('.bar_colorpickerDiv');
            if (self.g.attrs.switch) {
                $levelConfig.show();
                $bar_colorpickerDiv.hide();
                ViewUtils.changeColor($parent.find('.gtext_colorpicker'), self.g, "normalColor")
            } else {
                $levelConfig.hide();
                $bar_colorpickerDiv.show();
                ViewUtils.changeColor($parent.find('.bar_colorpicker'), self.g, "normalColor")

            }
        },

        afterRender: function() {

            var self = this;
            var $parent = $("#tabs");
            $parent.tabs(); //Tab页
            $('.m_u_box').slimscroll({
                height: '700px',
            });
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.g}).render().afterRender()
            //self.jsonEditor($parent);
            //Title
            var $title = $parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change', function() {
                self.g.setTitle($(this).val());
            })

            $parent.find('.switchGrid').attr('checked', self.g.attrs.switch).off('change').on('change', function() {
                self.g.attrs.switch = $(this).is(":checked");
                self.g.redraw();
                self.levelConfig($parent);
            });

            ViewUtils.changeColor($parent.find('.title_colorpicker'), self.g, "titleColor");
            ViewUtils.changeColor($parent.find('.label_colorpicker'), self.g, "labelColor");
            ViewUtils.changeColor($parent.find('.value_colorpicker'), self.g, "valueColor");
            ViewUtils.changeColor($parent.find('.line_colorpicker'), self.g, "LineColor");


            var $tableInputfrom=$parent.find('.table-input-form');
            self.levelConfig($parent);
            ViewUtils.changeText($parent.find('.normal_text'), self.g, "normalText");
            ViewUtils.changeText($parent.find('.urgency_text'), self.g, "urgencyText");
            ViewUtils.changeText($parent.find('.risk_text'), self.g, "riskText");

            ViewUtils.changeColor($parent.find('.gtext_colorpicker2'), self.g, "urgencyColor")
            ViewUtils.changeColor($parent.find('.gtext_colorpicker3'), self.g, "riskColor")

            ViewUtils.changeText($parent.find('.normal_value'), self.g, "normalValue",function(){
                 $parent.find('.v').css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                    $parent.find('input[data-inputstatus="error"]').css('color','red')
                    return false;
                };

                return true;
            });

            ViewUtils.changeText($parent.find('.urgency_value'), self.g, "urgencyValue",function(){
                $parent.find('.v').css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                    $parent.find('input[data-inputstatus="error"]').css('color','red')
                    return false;
                };
                return true;
            });

            ViewUtils.changeText($parent.find('.risk_value'), self.g, "riskValue",function(){
                $parent.find('.v').css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                    $parent.find('input[data-inputstatus="error"]').css('color','red')
                    return false;
                };
                return true;
            });


            $parent.find('.switchGrid2').attr('checked', self.g.attrs.bgShow).off('change').on('change', function() {
                self.g.attrs.bgShow = $(this).is(":checked");
                self.g.redraw();
            });

            ViewUtils.changeColor($parent.find('.gtext_colorpicker_label'), self.g, "bgColor")

            ViewUtils.sliderTooltip('#slider2', self.g.attrs.ww, 532, 1080, 1, function(value) {
                $('#slider2_input').val(value);
                if(self.g.attrs.ww==value) return;
                self.g.attrs.ww=value;
                self.g.redraw();
            });
            ViewUtils.sliderTooltip('#slider3', self.g.attrs.hh, 377, 1080, 1, function(value) {
                $('#slider3_input').val(value);
                if(self.g.attrs.hh==value) return;
                self.g.attrs.hh=value;
                self.g.redraw();
            });



        } //end of afterRender

    })
});
