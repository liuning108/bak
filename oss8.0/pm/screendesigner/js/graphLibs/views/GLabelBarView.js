define([
  "oss_core/pm/screendesigner/views/ServerTimeView",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
    "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GLabelBarConfig.html",
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
                    data: self.gText.getXAxisNames()
                },
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
                     if(json.xAxis.data && json.series.data){
                        //set datas
                        self.gText.setXAxisNames(json.xAxis.data);
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
            $parent.find('.lableSelect').val(self.gText.attrs.labelStyle)
                   .off('change')
                   .on('change',function() {
                       var val = $(this).val();
                       self.gText.attrs.labelStyle=val;
                       self.gText.redraw();
                   })

            $parent.find('.gcolors').val(self.gText.attrs.colors.join(','))
                          .off('change')
                          .on('change',function() {
                              var val = $(this).val();
                              if(val.length<=0){
                                  var defaulfColos=['#5a9bd5', '#01d15e', '#ffc101', '#e97870'].join(',');
                                  $(this).val(defaulfColos)
                                  val =defaulfColos;
                              }
                              self.gText.attrs.colors=val.split(',');
                              self.gText.redraw();
                          })



                   var stView=new STView({"el":$("#bg_stView"),'g':this.gText,'isNeedSwitch':true}).render();

            return this;
        }


    })
});
