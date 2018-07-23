define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addScriptView.html",
    'i18n!oss_core/itnms/action/i18n/action'
], function(action,tpl,i18nData) {
    var AddScriptView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddScriptView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddScriptView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddScriptView.prototype.afterPopup = function() {
        var self = this;
        self.readerGird()
        self.loadDepdata()
    }

    AddScriptView.prototype.readerGird = function() {
        var self = this;
        var optDep = {
            data: [],
            height: 250,
            onSelectRow: function (e, rowid, state, checked) {
                var selrow = self.$ScriptListGrid.grid("getSelection");
                self.callback(selrow)
                self.$popup.hide();
            },
            colModel: [{
                name: 'scriptid',
                label: '',
                key:true,
                search: false,
                hidden: true
            },{
                name: 'name',
                label: '名称',
                align: 'center'
            },{
                name: 'execute_on',
                label: '执行位置',
                align: 'center',
                formatter: function(cellval, opts, rwdat, _act) {
                    return (cellval === 0 && 'run on Zabbix agent') || (cellval === 1 && 'run on Zabbix server') || (cellval === 2 && '(default) run on Zabbix server (proxy)')
                }
            },{
                name: 'command',
                label: '命令',
                align: 'center'
            }]
        };
        this.$ScriptListGrid = this.$el.find('.ScriptListGrid').grid(optDep);
    }

    AddScriptView.prototype.loadDepdata = function() {
        var self = this;
        action.getScripts({}).then(function(data) {
            var result = fish.map(data.result, function(d) {
                return {
                    scriptid:d.scriptid,
                    name: d.name,
                    execute_on: Number(d.execute_on),
                    command: d.command
                }
            })
            self.$ScriptListGrid.grid("reloadData", result);
        })
    }

    return AddScriptView;
})