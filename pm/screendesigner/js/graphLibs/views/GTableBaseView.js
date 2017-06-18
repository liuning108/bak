define(["text!oss_core/pm/screendesigner/js/graphLibs/views/GTableBaseConfig.html",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"

], function(tpl) {

    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function(gText) {
            this.gText = gText;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },



        afterRender: function() {

            var self = this;
            $("#tabs").tabs(); //Tab页
            var $parent =$("#tabs");
            $parent.find('.gtext_title').val(this.gText.getTitle());
            $parent.find('.gtext_title').on('change',function(){
                   var titles=$(this).val().split(",");
                   self.gText.setTitle(titles);
            })

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

            return this;
        }


    })
});
