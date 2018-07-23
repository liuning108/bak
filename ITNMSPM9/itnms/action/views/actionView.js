define([
    "text!oss_core/itnms/action/templates/actionView.html",
    "oss_core/itnms/action/components/views/actionListView.js"
], function(tpl, ActionListView) {
    return fish.View.extend({
        template: fish.compile(tpl),
        render: function() {
            this.$el.html(this.template());
        },
        initialize: function(options) {},
        initCss: function() {
            this.$el.parent().css({'padding': '0px'})
        },
        afterRender: function() {
            var self = this;
            this.initCss();
            this.loadData();
        },
        loadData: function() {
            var self = this;
            self.actionListViewInit();
        },
        actionListViewInit: function() {
            var self = this;
            self.actionListView = new ActionListView({
                'el': self.$el.find('.kdo_cotent')
            })
            self.actionListView.render();
        }
    });
});
