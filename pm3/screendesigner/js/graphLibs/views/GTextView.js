define([
  "oss_core/pm/screendesigner/views/ServerTimeView",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
"text!oss_core/pm/screendesigner/js/graphLibs/views/GTextConfig.html",
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
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.gText}).render().afterRender()
        //    self.jsonEditor($parent);
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

            $parent.find('.isBackground').prop('checked', this.gText.attrs.isBackground === true).off('click').on('click', function() {
              self.gText.attrs.isBackground = $(this).is(':checked');
              self.gText.redraw();
            })

            $parent.find('.backW')
                   .val(this.gText.attrs.backW)
                   .off('change')
                   .on('change',function(){
                     var value = $(this).val();
                     if(value.length<=0) value=0;
                     value = Number(value);
                     if(isNaN(value))value=0;
                     $(this).val(value);
                     self.gText.attrs.backW=value;
                     self.gText.redraw();
                   })
            $parent.find('.backH')
                    .val(this.gText.attrs.backH)
                    .off('change')
                    .on('change',function(){
                      var value = $(this).val();
                      if(value.length<=0) value=0;
                      value = Number(value);
                      if(isNaN(value))value=0;
                      $(this).val(value);
                      self.gText.attrs.backH=value;
                      self.gText.redraw();
                    })
                    $parent.find('.backH')
                            .val(this.gText.attrs.backH)
                            .off('change')
                            .on('change',function(){
                              var value = $(this).val();
                              if(value.length<=0) value=0;
                              value = Number(value);
                              if(isNaN(value))value=0;
                              $(this).val(value);
                              self.gText.attrs.backH=value;
                              self.gText.redraw();
                            })
                    $parent.find('.offsetX')
                            .val(this.gText.attrs.offsetX)
                            .off('change')
                            .on('change',function(){
                            var value = $(this).val();
                            if(value.length<=0) value=0;
                            value = Number(value);
                            if(isNaN(value))value=0;
                            $(this).val(value);
                            self.gText.attrs.offsetX=value;
                            self.gText.redraw();
                            })
                     $parent.find('.offsetY')
                            .val(this.gText.attrs.offsetY)
                            .off('change')
                            .on('change',function(){
                             var value = $(this).val();
                             if(value.length<=0) value=0;
                             value = Number(value);
                             if(isNaN(value))value=0;
                              $(this).val(value);
                              self.gText.attrs.offsetY=value;
                              self.gText.redraw();
                            })

                            var title_colorpicker = $parent.find(".fcolor").colorpicker();
                            title_colorpicker.colorpicker("set", this.gText.attrs.fcolor);
                            title_colorpicker.on("move.colorpicker", function(e, color) {
                              self.gText.attrs.fcolor = "" + color;
                              self.gText.redraw();
                            })
                            var num_colorpicker = $parent.find(".scolor").colorpicker();
                            num_colorpicker.colorpicker("set", this.gText.attrs.scolor);
                            num_colorpicker.on("move.colorpicker", function(e, color) {
                              self.gText.attrs.scolor = "" + color;
                              self.gText.redraw();
                            })




            var stView=new STView({"el":$("#bg_stView"),'g':this.gText,'isNeedSwitch':true}).render();

            return this;
        }


    })
});
