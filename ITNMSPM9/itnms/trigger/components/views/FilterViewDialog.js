define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/filterItemView.html"
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
        self.sCombobox();
        this.$el.find('.reset').off('click').on('click', function() {
            delete self.props.filter;
            self.callback(self.props);
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.filter = {
                'state':(self.$state.combobox('value') !== '-1') ? self.$state.combobox('value') : '',
                'priority':(self.$priority.combobox('value') !== '-1') ? self.$priority.combobox('value') : '',
                'status':(self.$status.combobox('value') !== '-1') ? self.$status.combobox('value') : ''
            }
            self.callback(self.props)
            self.$popup.hide();
        });

    }

    FilterViewDialog.prototype.sCombobox = function() {
        var self = this;
        action.itemTypes('TRIGGER_SEVERITY_LEVEL,TRIGGER_STATE,TRIGGER_STATUS').then(function(datas){
            self.$priority = self.$el.find('.priority').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TRIGGER_SEVERITY_LEVEL
            });
            self.$priority.on('combobox:change', function(state) {
                var pVal = $(this).combobox('value');
                $(this).prev().prop('class','combobox-readonly  form-control '+'lv' + pVal);
                //$(this).prev().addClass('lv' + pVal);
            });
            self.$priority.combobox('value',(self.props.filter && self.props.filter.priority) ? self.props.filter.priority : datas.TRIGGER_SEVERITY_LEVEL[0].paraValue)
            self.$state = self.$el.find('.filterstate').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TRIGGER_STATE
            });
            self.$state.combobox('value',(self.props.filter && self.props.filter.state) ? self.props.filter.state : datas.TRIGGER_STATE[0].paraValue)
            self.$status = self.$el.find('.filterstatus').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TRIGGER_STATUS
            });
            self.$status.combobox('value',(self.props.filter && self.props.filter.status) ? self.props.filter.status : datas.TRIGGER_STATUS[0].paraValue)
        })
    }

    return FilterViewDialog;
})