define([
    'i18n!oss_core/inms/pm/items/i18n/items',
    "text!oss_core/inms/pm/items/components/views/filterItemView.html"
], function(i18nData,tpl) {
    var FilterViewDialog = function() {
        this.tpl = fish.compile(tpl);
    }

    FilterViewDialog.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    FilterViewDialog.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    FilterViewDialog.prototype.afterPopup = function() {
        var self = this;
        this.$el.find('.reset').off('click').on('click', function() {
            self.callback({});
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.itemName = self.$el.find('.item_name').val();
            self.props.metricKey = self.$el.find('.metric_key').val();
            self.callback(self.props)
            self.$popup.hide();
        });

    }
    return FilterViewDialog;
})