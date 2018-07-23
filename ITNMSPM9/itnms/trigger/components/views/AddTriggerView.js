define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/addTriggerView.html",
    'i18n!oss_core/itnms/trigger/i18n/trigger'
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
        action.getHostGroupParams({"with_triggers":true}).then(function(datas){
            var groupData = fish.map(datas.result, function(d) {
                self.groupFilterList = datas.result;
                return {
                    'groupid': d.groupid,
                    'name': d.name
                }
            })
            self.$comboboxGroups = self.$el.find('.comboboxGroups').combobox({editable: false, dataTextField: 'name', dataValueField: 'groupid', dataSource: groupData});
            self.$comboboxhost = self.$el.find('.comboboxhost').combobox('setEditable', false);
            self.$comboboxGroups.combobox('value',groupData[0].groupid);
            self.comboboxGroupsChange()
            self.loadDepdata();
            self.$comboboxGroups.on('combobox:change', function() {
                var d = self.$comboboxGroups.combobox('getSelectedItem');
                self.comboboxGroupsChange();
            });
            self.$comboboxhost.on('combobox:change', function() {
                var d = self.$comboboxhost.combobox('getSelectedItem');
                if(d){
                    delete self.SearchItem.hostids;
                    delete self.SearchItem.templateids;
                    if(d.status === '3'){
                        self.SearchItem.templateids = d.templateid;
                    }else{
                        self.SearchItem.hostids = d.hostid;
                    }
                    self.loadDepdata()
                }
            });
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
                name: 'triggerid',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'wizard',
                label: '',
                search: false,
                hidden: true
            },{
                name: 'name',
                label: '名称',
                align: 'center'
            }, {
                name: 'priority',
                label: '告警级别',
                align: 'center',
                width: 50,
                formatter(cellval, opts, rwdat, _act){
                    switch(cellval){
                        case '1':
                            tdClass = 'lv1';
                            tdInfo = 'Information';
                        break;
                        case '2':
                            tdClass = 'lv2';
                            tdInfo = 'warning';
                        break;
                        case '3':
                            tdClass = 'lv3';
                            tdInfo = 'Average';
                        break;
                        case '4':
                            tdClass = 'lv4';
                            tdInfo = 'high';
                        break;
                        case '5':
                            tdClass = 'lv5';
                            tdInfo = 'disaster';
                        break;
                        default:
                            tdClass = 'lv0';
                            tdInfo = 'Not classified';
                        break;
                    }
                    return '<div class="'+tdClass+'">'+tdInfo+'</div>';
                }
            }, {
                name: 'state',
                label: '状态',
                width: 70,
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return (cellval === 1 && 'disabled') || 'enabale';
                }
            }],
            multiselect:true
        };
        this.$TriggerListGrid = this.$el.find('.TriggerListGrid').grid(optDep);
    }

    AddTriggeView.prototype.loadDepdata = function() {
        var self = this;
        action.triggerGet(self.SearchItem).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    triggerid:d.triggerid,
                    wizard: d.hosts,
                    name: d.description,
                    priority: d.priority,
                    status:Number(d.status),
                }
            })
            self.$TriggerListGrid.grid("reloadData", result);
        })
    }

    AddTriggeView.prototype.comboboxGroupsChange = function (groupid) {
        var self = this;
        var hostTemList = [];
        var groupid = this.$comboboxGroups.combobox('value');
        var filterGroupId = self.groupFilterList.filter(function (e) {
            return e.groupid == groupid;
        })
        if(filterGroupId.length){
            delete self.SearchItem.hostids;
            delete self.SearchItem.templateids;
            if(filterGroupId[0].hosts.length>0){
                fish.map(filterGroupId[0].hosts,function(d, elem) {
                    hostTemList.push({"name":d.host,"hostid":d.hostid,"status":d.status,"filedid":d.hostid})
                })
            }
            if(filterGroupId[0].templates.length>0){
                fish.map(filterGroupId[0].templates,function(d, elem) {
                    hostTemList.push({"name":d.name,"templateid":d.templateid,"status":d.status,"filedid":d.templateid})
                })
            }
            if(hostTemList && hostTemList.length >= 1){
                self.$comboboxhost.combobox({dataTextField: 'name', dataValueField: 'filedid', dataSource: hostTemList});
                self.$comboboxhost.combobox('value',hostTemList[0].filedid);
                if(hostTemList[0].hostid){
                    self.SearchItem.hostids = hostTemList[0].hostid
                }else{
                    self.SearchItem.templateids = hostTemList[0].templateid
                }
                self.$comboboxhost.combobox('enable');
            }else{
                self.$comboboxhost.combobox({dataSource:''})
                self.$comboboxhost.combobox('disable')
            }
        }
    }

    return AddTriggeView;
})