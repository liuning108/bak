define([
    "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dbConfigTree.html",
    "css!oss_core/pm/screendesigner/css/dbconfigtree.css",


], function(tpl) {

    return portal.CommonView.extend({
        template: fish.compile(tpl),
        initialize: function(config) {
            this.config = config;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },


        afterRender: function() {
            var self =this;
            var $parent = $(".db_panel_side");
            var bodyOutH=$('body').outerHeight();
            var outH=bodyOutH*(0.9/2);
            $parent.find('.g_field_context').slimscroll({
                height:outH,
                axis:'y'
            });


        }


    })
});
