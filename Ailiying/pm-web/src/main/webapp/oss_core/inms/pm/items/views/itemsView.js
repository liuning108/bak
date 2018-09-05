define([
    "text!oss_core/inms/pm/items/templates/ItemsView.html",
    "oss_core/inms/pm/items/components/views/ItemListView.js"
], function(tpl, ItemListView) {
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
            self.ItemListViewInit();
            self.$el.find('.allHostShow').off('click').on('click',function(){
                self.ItemListViewInit();
            })
        },
        ItemListViewInit: function() {
            var self = this;
            self.itemListView = new ItemListView({
                'el': self.$el.find('.kdo_cotent')
            })
            self.itemListView.render();
        }
    });
});
