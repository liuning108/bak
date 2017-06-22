define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GBarView.html",
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
            $parent.tabs(); //Tab页
            self.jsonEditor($parent);
            var $g_x=$parent.find('.g_x');
            var $g_x_sure=$parent.find('.g_x_sure');
            $g_x.val(this.g.getXAxisNams().join(','));
            $g_x_sure.off('click');
            $g_x_sure.on('click',function(){
                  var names=$g_x.val().split(",");
                  self.g.setXAxisNams(names);
                  return false;
            })
          //Title
            var $title =$parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change',function(){
                  self.g.setTitle($(this).val());
            })



        }


    })
});
