define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/GTableBaseConfig.html",
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
                    data: self.gText.getTitle()
                },
                series: {
                    data: self.gText.getDatas()
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
                        self.gText.setTitle(json.xAxis.data);
                        self.gText.setDatas(json.series.data);
                        self.gText.redraw();
                     }
                   });

        },

        addCondifmt:function() {
            var self =this;
            var json = self.gText.Data2Json();
            var kpiList =fish.map(json.yAxis,function(yAxis){
                return {
                    'KPI_CODE':yAxis.name,
                    'KPI_INDEX':yAxis.label,
                    'KPI_NAME':yAxis.label,
                }
            })
            console.log(kpiList);
            // var kpiList =[
            //     {KPI_CODE: "PB9ANQAC00018", KPI_NAME: "2G RAN-Call Setup Success rate(%) ", KPI_INDEX: "KPI_3"},
            //     {KPI_CODE: "PB9ANQAC00026", KPI_NAME: "2G RAN-Speech Drop Rate (%) ", KPI_INDEX: "KPI_4"}
            // ]
            portal.require([
                'oss_core/pm/adhocdesigner/views/CondiFmt'
            ], this.wrap(function (Dialog) {
                var sData = {
                    kpiList: kpiList,
                    condiFmtItemList: JSON.parse(self.gText.attrs.condiFmtItemList||'[]')
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 720,
                    height: 300
                };
                this.condiFmtView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                    self.gText.attrs.condiFmtItemList=JSON.stringify(data.condiFmtItemList);
                    this.condiFmtView.close();
                }));
                this.listenTo(dialog, 'cancelEvent', this.wrap(function (data) {
                    this.condiFmtView.close();
                }));
            }));
        },



        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.gText}).render().afterRender()
            //self.jsonEditor($parent);
            //TODO:表头色
            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", this.gText.getTitleColor());
            title_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setTitleColor(color)
            })

            //TODO: 分隔线色
            var divide_colorpicker = $parent.find(".divide_colorpicker").colorpicker();

            divide_colorpicker.colorpicker("set", this.gText.getDivideColor());
            divide_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setDivideColor(color)
            })

            //

            var value_colorpicker = $parent.find(".value_colorpicker").colorpicker();

            value_colorpicker.colorpicker("set", this.gText.attrs.valueColor);
            value_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.attrs.valueColor=""+color;
                self.gText.redraw();
            });

            //TODO Seq's Postions
            $parent.find('.seq_select')
                   .val(this.gText.getSeqPos())
                   .off("change")
                   .on("change",function(){
                       self.gText.setSeqPos($(this).val());
                   });
            //TODO Seq Color
            var seq_colorpicker = $parent.find(".seq_colorpicker").colorpicker();
            seq_colorpicker.colorpicker("set", this.gText.getSeqColor());
            seq_colorpicker.on("move.colorpicker", function(e, color) {
                self.gText.setSeqColor(color)
            })
            //TODO Seq name
            $parent.find('.seqName')
                   .val(this.gText.getSeqName())
                   .off("change")
                   .on("change",function(){
                       self.gText.setSeqName($(this).val());
                   });

            //TODO SEQ ON/off
            var $scp=$parent.find('.seq_config_palne');
            if(this.gText.getSeqShow()=='off'){
                $scp.hide();
            }
            $parent.find('.seq_switch')
                   .attr({"checked":this.gText.getSeqShow()=='on'?true:false})
                   .off("change")
                   .on("change",function(e){
                       var flag = $(this).is(':checked');
                       if(flag){
                           $scp.show();
                       }else{
                           $scp.hide();
                       };
                       self.gText.setSeqShow(flag?'on':'off');
                   })


            $parent.find('#dashboard-condifmt-btn')
                   .on('click',function(){
                        self.addCondifmt();
                   })

                return this;
        }


    })
});
