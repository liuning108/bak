define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addOpinventoryView.html",
    'i18n!oss_core/itnms/action/i18n/action'
], function(action,tpl,i18nData) {
    var RemoteCommondView = function() {
        this.tpl = fish.compile(tpl);
    }

    RemoteCommondView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    RemoteCommondView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();
    }

    RemoteCommondView.prototype.afterPopup = function() {
        var self = this;
        this.$el.find('.cancle').off('click').on('click', function() {
            self.callback();
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.callback()
            self.$popup.hide();
        });
    }
    return RemoteCommondView;
})