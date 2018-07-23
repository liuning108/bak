define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/notifyView.html",
    'i18n!oss_core/itnms/action/i18n/action'
], function(action,tpl,i18nData) {
    var SendMessageView = function() {
        this.tpl = fish.compile(tpl);
    }

    SendMessageView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    SendMessageView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();
    }

    SendMessageView.prototype.afterPopup = function() {
        var self = this;
        this.$el.find('.cancle').off('click').on('click', function() {
            self.callback();
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.callback()
            self.$popup.hide();
        });

        self.$el.find('#defualt_msg').change(function() {
        　　if($(this).is(':checked')){
                self.$el.find(".subject").prop('disabled',true);
                self.$el.find(".message").prop('disabled',true);
            }else{
                self.$el.find(".subject").prop('disabled',false);
                self.$el.find(".message").prop('disabled',false);
            }
        });
        self.rendCombox()
    }

    SendMessageView.prototype.rendCombox = function() {
        var self = this;
        action.itemTypes('ACTION_EVENT_ACKNOWLEDGED_VALUE').then(function(datas){
            console.log(datas)
            self.$opconditions = self.$el.find('.opconditions').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_EVENT_ACKNOWLEDGED_VALUE
            });
            self.$opconditions.combobox('value',datas.ACTION_EVENT_ACKNOWLEDGED_VALUE[0].paraValue)
        })
    }

    return SendMessageView;
})