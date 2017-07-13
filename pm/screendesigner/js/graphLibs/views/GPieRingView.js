define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
   "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/DBConfigTreeView",
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GPieRingView.html",
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
                    data: self.g.getXAxisNames()
                },
                series: {
                    data: self.g.getSeriesData()
                }
            }
            self.editor.set(json);
            $editor_content.find(".jsoneditor-menu").remove();
            $parent.find(".btn-sure")
                   .off('click')
                   .on('click', function() {
                     var json = self.editor.get();
                     if(json.xAxis.data && json.series.data){
                         self.g.setXAxisNames(json.xAxis.data);
                         self.g.setSeriesData(json.series.data);
                         self.g.redraw();
                     }
                   });

        },


        afterRender: function() {
            var self = this;
            var $parent =$("#tabs");
            $parent.tabs(); //Tab页
            var dbCofnfigTreeView = new DBConfigTreeView({'el': '.dbCofnfigTree','g': self.g}).render().afterRender()

          //  self.jsonEditor($parent);
            $parent.find('.labelSelect').off('change')
                   .val(self.g.attrs.labelStyle)
                   .on('change',function() {
                       var val =$(this).val();
                       self.g.attrs.labelStyle=val;
                       self.g.redraw();
                   })
            var $title =$parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change',function(){
                  self.g.setTitle($(this).val());
            })

        }


    })
});
