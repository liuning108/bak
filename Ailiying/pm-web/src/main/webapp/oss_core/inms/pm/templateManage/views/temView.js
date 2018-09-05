define([
    "text!oss_core/inms/pm/templateManage/templates/temView.html",
    "oss_core/inms/pm/templateManage/components/views/temListView.js"
], function(tpl,temListView) {
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
            self.TemListViewInit();
        },
        TemListViewInit: function() {
            var self = this;
            self.TemListView = new temListView({
                'el': self.$el.find('.kdo_cotent')
            })
            self.TemListView.render();
        }
    });
});
