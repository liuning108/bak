define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addHostView.html",
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
    }

    AddTriggeView.prototype.readerCom = function() {
        var self = this;
        action.getHostGroupParams({}).then(function(datas){
            var groupData = fish.map(datas.result, function(d) {
                self.groupFilterList = datas.result;
                return {
                    'groupid': d.groupid,
                    'name': d.name
                }
            })
            self.$comboboxGroups = self.$el.find('.comboboxGroups').combobox({editable: false, dataTextField: 'name', dataValueField: 'groupid', dataSource: groupData});
            self.loadDepdata();
            self.$comboboxGroups.on('combobox:change', function() {

                var d = self.$comboboxGroups.combobox('getSelectedItem');
                 console.log(d)
                self.loadDepdata(d.groupid);
            });
            self.$comboboxGroups.combobox('value',groupData[0].groupid);
        })
    }

    AddTriggeView.prototype.readerGird = function() {
        var self = this;
        this.readerCom();
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
                name: 'hostid',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'name',
                label: '监控点名称',
                align: 'center'
            }],
            multiselect:true
        };
        this.$TriggerListGrid = this.$el.find('.TriggerListGrid').grid(optDep);
    }

    AddTriggeView.prototype.loadDepdata = function(id) {
        var self = this;
        action.getAllHostsByGroupids(
            {'ids': [id],"search": {
            name: '',
            ip: '',
            dns: '',
            port: ''
        }}).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    hostid:d.hostid,
                    name: d.name
                }
            })
            self.$TriggerListGrid.grid("reloadData", result);
        })
    }

    return AddTriggeView;
})