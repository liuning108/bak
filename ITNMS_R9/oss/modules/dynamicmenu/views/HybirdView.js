define([
    'modules/dynamicmenu/views/DynamicView',
    'text!modules/dynamicmenu/templates/Hybird.html'
], function (DynamicView,template) {

    return DynamicView.extend({
        template: fish.compile(template), //主模板

        initialize: function() {
            console.log("this framework hybird menu!");
        },

        loadTemplate: function (data) {
            this.$('.grid-stack-left').gridStack({acceptWidgets: '.grid-stack-item', float: true});
            this.gridstack = this.$('.grid-stack-right').gridStack({acceptWidgets: '.grid-stack-item'});
            this.$(".designer-header").show().draggable();

            this.loadMenuLayout(this.gridstack);
        }
    });
});
