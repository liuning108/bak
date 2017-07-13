define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GNodesView.html",
     "oss_core/pm/screendesigner/jsoneditor/jsoneditor.min",
], function(i18nData,DBConfigTreeView,tpl,JSONEditor) {

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
                    data: self.g.getNames()
                },
                series: {
                    data: self.g.getSeriesDatas()
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
                        self.g.setNames(json.xAxis.data);
                        self.g.setSeriesDatas(json.series.data);
                        self.g.redraw();
                     }
                   });

        },

        afterRender: function() {
            var self = this;
            var $parent =$("#tabs");
            $parent.tabs(); //Tab页
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.g}).render().afterRender()
            //self.jsonEditor($parent);
            //ON /OFF
            var $switchGrid=$parent.find('.switchGrid');
            var falg =self.g.getSwitchWarring()=='on'?true:false;


            $switchGrid.attr("checked" ,falg);
            self.levelConfig($parent,falg);
            $switchGrid.on('change',function(){
                var checked=$(this).is(':checked');
                self.levelConfig($parent,checked);
                self.g.setSwitchWarring(checked);

            })



            var font_colorpicker = $parent.find(".font_text_colorpicker").colorpicker();
            font_colorpicker.colorpicker("set",  self.g.getFontColors());
            font_colorpicker.on("move.colorpicker", function(e, color) {
                  self.g.setFontColors(color)
            });

            var bg_colorpicker = $parent.find(".bg_colorpicker").colorpicker();
            bg_colorpicker.colorpicker("set",self.g.getColors(0));
            bg_colorpicker.on("move.colorpicker", function(e, color) {

              var color=""+color
              self.g.attrs.colors=[color,color,color];
              self.g.setColors(0,color);
            });


             var $tableInputfrom=$parent.find('.table-input-form');
            var default_font_color="#4c4c4c";
            //正常
            $('.normal_text').val(self.g.getNormalText());
            $('.normal_text').off("change");
            $('.normal_text').on("change",function(){
               self.g.setNormalText($(this).val());
            })

            $('.normal_value').val(self.g.getValues()[0]);
            $('.normal_value').off("change");
            $('.normal_value').on("change",function(){
                $(this).css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                   if($(this).attr('data-inputstatus')=='error'){
                      $(this).css('color','red')
                    }
                    return;
                };
               self.g.setValues(0,$(this).val());
            })

            var title_colorpicker = $parent.find(".gtext_colorpicker").colorpicker();
            title_colorpicker.colorpicker("set", self.g.getColors(0));
            title_colorpicker.on("move.colorpicker", function(e, color) {
              self.g.setColors(0,color)
            });

            //urgency
            $('.urgency_text').val(self.g.getUrgencyText());
            $('.urgency_text').off("change");
            $('.urgency_text').on("change",function(){
               self.g.setUrgencyText($(this).val());
            })

            $('.urgency_value').val(self.g.getValues()[1]);
            $('.urgency_value').off("change");
            $('.urgency_value').on("change",function(){
                $(this).css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                   if($(this).attr('data-inputstatus')=='error'){
                       $(this).css('color','red')
                    }
                    return;
                };
               self.g.setValues(1,$(this).val());
            })



            var title_colorpicker2 = $parent.find(".gtext_colorpicker2").colorpicker();

            title_colorpicker2.colorpicker("set", self.g.getColors(1));
            title_colorpicker2.on("move.colorpicker", function(e, color) {
                    self.g.setColors(1,color);
            });
            //risk
            $('.risk_text').val(self.g.getRiskText());
            $('.risk_text').off("change");
            $('.risk_text').on("change",function(){
               self.g.setRiskText($(this).val());
            })
            $('.risk_value').val(self.g.getValues()[2]);
            $('.risk_value').off("change");
            $('.risk_value').on("change",function(){
                $(this).css('color','#4c4c4c');
                if(!$tableInputfrom.isValid()){
                   if($(this).attr('data-inputstatus')=='error'){
                        $(this).css('color','red')
                    }
                    return;
                };
               self.g.setValues(2,$(this).val());
            })
            var title_colorpicker3 = $parent.find(".gtext_colorpicker3").colorpicker();

            title_colorpicker3.colorpicker("set", self.g.getColors(2));
            title_colorpicker3.on("move.colorpicker", function(e, color) {
                  self.g.setColors(2,color);
            });

        },
        levelConfig:function($parent,flag){
          var $levelconfg=$parent.find('.levelConfig')
          var $bgColorPickerDiv=$parent.find('.bgColorPickerDiv')
          if (flag){
           $levelconfg.show();
           this.g.attrs.colors=this.g.getDefaultWaringColor();
           $bgColorPickerDiv.hide();
          }else{
            var color =this.g.getColors(0);
            this.g.attrs.colors=[color,color,color];
           $levelconfg.hide();
           $bgColorPickerDiv.show();
          }
        },


    })
});
