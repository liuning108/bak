define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addProxysView.html",
    'i18n!oss_core/itnms/action/i18n/action'
], function(action,tpl,i18nData) {
    var AddTriggeView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddTriggeView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddTriggeView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddTriggeView.prototype.afterPopup = function() {
        var self = this;
        self.readerGird()
        self.loadDepdata()
    }

    AddTriggeView.prototype.readerGird = function() {
        var self = this;
        var optDep = {
            data: [],
            height: 250,
            gridComplete: function() {
                self.$el.find('.isSure').off('click').on('click', function() {
                    var selarrrow = self.$TriggerListGrid.grid("getCheckRows");
                    self.callback(selarrrow)
                    self.$popup.hide();
                });
            },
            colModel: [{
                name: 'proxy_hostid',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'name',
                label: '名称',
                align: 'center'
            }],
            multiselect:true
        };
        this.$TriggerListGrid = this.$el.find('.TriggerListGrid').grid(optDep);
    }

    AddTriggeView.prototype.loadDepdata = function() {
        var self = this;
        action.getProxys({}).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    proxy_hostid:d.proxy_hostid,
                    name: d.name
                }
            })
            self.$TriggerListGrid.grid("reloadData", result);
        })
    }

    return AddTriggeView;
})