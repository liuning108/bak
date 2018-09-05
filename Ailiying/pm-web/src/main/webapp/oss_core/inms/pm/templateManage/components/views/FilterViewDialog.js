define([
    "oss_core/inms/pm/templateManage/actions/template",
    'i18n!oss_core/inms/pm/templateManage/i18n/template',
    "text!oss_core/inms/pm/templateManage/components/views/FilterViewDialog.html"
], function(action,i18nData,tpl) {
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
        self.sCombobox();
        this.$el.find('.reset').off('click').on('click', function() {
            self.callback({});
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.catagory = self.$catagory.combobox('value');
            self.callback(self.props)
            self.$popup.hide();
        });

    }

    FilterViewDialog.prototype.sCombobox = function() {
        var self = this;
        action.getParamvalueInfo('TEMPLATE_CATAGORY').then(function(datas){
            self.$catagory = self.$el.find('.catagory').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TEMPLATE_CATAGORY
            });
            self.$catagory.combobox('value',datas.TEMPLATE_CATAGORY[0].paraValue)
        })
    }

    return FilterViewDialog;
})