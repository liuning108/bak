define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/addHongView.html",
    'i18n!oss_core/itnms/trigger/i18n/trigger'
], function(action,tpl,i18nData) {
    var AddHongView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddHongView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddHongView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddHongView.prototype.afterPopup = function() {
        var self = this;
        self.readerGird()
        self.gHong()
    }

    AddHongView.prototype.readerCom = function() {
        var self = this;
        action.getHostGroupParams({"with_hosts_and_templates":true}).then(function(datas){
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

    AddHongView.prototype.readerGird = function() {
        var self = this;
        this.readerCom();
        var optDep = {
            data: [],
            height: 250,
            gridComplete: function() {
            },
            onSelectRow: function (e, rowid, state, checked) {
                var selrow = self.$TriggerListGrid.grid("getSelection");
                self.callback(selrow)
                self.$popup.hide();
            },
            colModel: [{
                name: 'hostmacroid',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'macro',
                label: '宏',
                align: 'center'
            }, {
                name: 'value',
                label: '值',
                align: 'center',
                width: 350
            }]
        };
        this.$TriggerListGrid = this.$el.find('.HongListGrid').grid(optDep);
    }

    AddHongView.prototype.gHong = function() {
        var self = this;
        self.$el.find('#gHong').change(function() {
        　　if($(this).is(':checked')){
                self.SearchItem.globalmacro = true;
                self.$comboboxGroups.combobox('disable');
                self.$comboboxhost.combobox('disable');
            }else{
                delete self.SearchItem.globalmacro;
                self.$comboboxGroups.combobox('enable');
                self.$comboboxhost.combobox('enable');
            }
            self.loadDepdata()
        });
    }

    AddHongView.prototype.loadDepdata = function() {
        var self = this;
        action.macroGet(self.SearchItem).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    "hostmacroid":d.hostmacroid,
                    "macro": d.macro,
                    "value": d.value
                }
            })
            self.$TriggerListGrid.grid("reloadData", result);
        })
    }

    AddHongView.prototype.comboboxGroupsChange = function (groupid) {
        var self = this;
        var hostTemList = [];
        var groupid = this.$comboboxGroups.combobox('value');
        var filterGroupId = self.groupFilterList.filter(function (e) {
            return e.groupid == groupid;
        })
        if(filterGroupId.length){
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

    return AddHongView;
})