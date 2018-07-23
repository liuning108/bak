define([
    "text!oss_core/itnms/trigger/templates/triggerView.html",
    "oss_core/itnms/trigger/components/views/triggerListView.js"
], function(tpl, TriggerListView) {
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
            self.triggerListViewInit();
        },
        triggerListViewInit: function() {
            var self = this;
            self.triggerListView = new TriggerListView({
                'el': self.$el.find('.kdo_cotent')
            })
            self.triggerListView.render();
        }
    });
});
