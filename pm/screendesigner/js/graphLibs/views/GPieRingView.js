define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/GPieRingView.html",
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
            var $title =$parent.find('.g_titile');
            $title.val(this.g.attrs.title);
            $title.off('change');
            $title.on('change',function(){
                  self.g.setTitle($(this).val());
            })

        }


    })
});
