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
                    data: [1,2,3]
                },
                series: {
                    data: [1,2,3]
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
                     }
                   });

        },


        afterRender: function() {
            var self = this;
            var $parent =$("#tabs");
            self.jsonEditor($parent);
            $parent.tabs(); //Tab页
            var $title =$parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change',function(){
                  self.g.setTitle($(this).val());
            })

        }


    })
});
