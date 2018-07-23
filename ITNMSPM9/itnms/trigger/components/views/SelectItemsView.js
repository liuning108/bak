define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/selectItemsView.html",
    'i18n!oss_core/itnms/trigger/i18n/trigger'
], function(action,tpl,i18nData) {
    var AddTriggeView = function() {
        this.tpl = fish.compile(tpl);
        this.SearchItem = {
            "output":"extend",
            "selectHosts":["host","hostid","status"],
            "selectTriggers":["description","expression","status","priority"],
            "search":{},
            "filter":{}
        };
        this.selectItems = {};
    }

    AddTriggeView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddTriggeView.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        this.selectItems = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddTriggeView.prototype.afterPopup = function() {
        var self = this;
        action.itemTypes('ITEM_TYPE,ITEM_VALUE_TYPE').then(function(datas){
            self.valueTypes = datas.ITEM_VALUE_TYPE;
            self.itemTypes = datas.ITEM_TYPE;
            self.readerGird()
        })
    }

    AddTriggeView.prototype.readerCom = function() {
        var self = this;
        action.getHostGroupParams({"with_items":true}).then(function(datas){
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
                delete self.SearchItem.hostids;
                delete self.SearchItem.templateids;
                if(d){
                    self.selectItems.host = d.host;
                    self.selectItems.name = d.name;
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
            },
            onSelectRow: function (e, rowid, state, checked) {
                var selrow = self.$TriggerListGrid.grid("getSelection");
                self.selectItems.selrow = selrow
                self.callback(self.selectItems)
                self.$popup.hide();
            },
            colModel: [{
                name: 'itemid',
                label: '',
                align: 'center',
                key:true,
                search: false,
                hidden: true
            }, {
                name: 'name',
                label: '名称',
                align: 'center'
            }, {
                name: 'keys',
                label: '键值',
                align: 'center'
            }, {
                name: 'value_type',
                label: '值类型',
                align: 'center',
                formatter(cellval, opts, rwdat, _act){
                    return ''+self.valueTypes[cellval].paraName+'';
                }
            }, {
                name: 'types',
                label: '类型',
                align: 'center',
                formatter(cellval, opts, rwdat, _act){
                    return ''+self.itemTypes[cellval].paraName+'';
                }
            }, {
                name: 'status',
                label: '状态',
                width: 70,
                'title': false,
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return (cellval === 1 && 'disabled') || 'enabale';
                }
            }]
        };
        this.$TriggerListGrid = this.$el.find('.TriggerListGrid').grid(optDep);
    }

    AddTriggeView.prototype.loadDepdata = function() {
        var self = this;
        action.itemGet(self.SearchItem).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    itemid:d.itemid,
                    name: d.name,
                    keys: d.key_,
                    types: d.type,
                    value_type: Number(d.value_type),
                    status:Number(d.status)
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
            if(filterGroupId[0].hosts.length>0){
                fish.map(filterGroupId[0].hosts,function(d, elem) {
                    hostTemList.push({"name":d.name,"host":d.host,"hostid":d.hostid,"status":d.status,"filedid":d.hostid})
                })
            }
            if(filterGroupId[0].templates.length>0){
                fish.map(filterGroupId[0].templates,function(d, elem) {
                    hostTemList.push({"name":d.name,"host":d.host,"templateid":d.templateid,"status":d.status,"filedid":d.templateid})
                })
            }
            if(hostTemList && hostTemList.length>0){
                self.$comboboxhost.combobox({dataTextField: 'name', dataValueField: 'filedid', dataSource: hostTemList});
                self.selectItems.host = hostTemList[0].host;
                self.selectItems.name = hostTemList[0].name;
                if(hostTemList[0].hostid){
                    self.SearchItem.hostids = hostTemList[0].hostid
                }else{
                    self.SearchItem.templateids = hostTemList[0].templateid
                }
                self.$comboboxhost.combobox('value',hostTemList[0].filedid);
                self.$comboboxhost.combobox('enable');
            }else{
                self.$comboboxhost.combobox({dataSource:''})
                self.$comboboxhost.combobox('disable')
            }
        }
    }

    return AddTriggeView;
})