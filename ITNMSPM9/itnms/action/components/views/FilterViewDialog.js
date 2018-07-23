define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/filterItemView.html"
], function(action,tpl) {
    var FilterViewDialog = function() {
        this.tpl = fish.compile(tpl);
    }

    FilterViewDialog.prototype.content = function(datas) {
        this.$el = $(this.tpl(datas))
        return this.$el;
    }

    FilterViewDialog.prototype.remove = function() {
        this.$el.html("")
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
        var name = self.props.search.name ? self.props.search.name : '';
        name = name.substr(0,name.length-1);
        name = name.substr(1,name.length-1);
        this.$el.find('.filterName').val(name);
        self.sCombobox();
        this.$el.find('.reset').off('click').on('click', function() {
            delete self.props.filter.status;
            delete self.props.search.name;
            self.callback(self.props);
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.filter.status = (self.$status.combobox('value') !== '-1') ? self.$status.combobox('value') : ''
            self.props.search.name = "*"+self.$el.find('.filterName').val()+"*"
            self.callback(self.props)
            self.$popup.hide();
        });

    }

    FilterViewDialog.prototype.sCombobox = function() {
        var self = this;
        action.itemTypes('ITEM_STATUS').then(function(datas){
            self.$status = self.$el.find('.filterstatus').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ITEM_STATUS
            });
            self.$status.combobox('value',(self.props.filter && self.props.filter.status) ? self.props.filter.status : datas.ITEM_STATUS[0].paraValue)
        })
    }

    return FilterViewDialog;
})