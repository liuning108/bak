define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GNodesView.html",
], function(tpl) {

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

        afterRender: function() {
            var self = this;
            var $parent =$("#tabs");
            $parent.tabs(); //Tab页
            var $g_x=$parent.find('.g_x');
            var $g_x_sure=$parent.find('.g_x_sure');
            $g_x.val(this.g.getNames().join(','));
            $g_x_sure.off('click');
            $g_x_sure.on('click',function(){
                  var names=$g_x.val().split(",");
                  self.g.setNames(names);
                  return false;
            })
            //ON /OFF
            $parent.find('.switchGrid').on('change',function(){
                var checked=$(this).is(':checked');
                self.g.setSwitchWarring(checked);
            })

        },


    })
});
