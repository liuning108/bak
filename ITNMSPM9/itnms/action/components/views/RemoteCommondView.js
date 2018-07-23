define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/remoteCommondView.html",
    'i18n!oss_core/itnms/action/i18n/action',
    "oss_core/itnms/action/components/views/AddGroupView.js",
    "oss_core/itnms/action/components/views/AddHostView.js",
    "oss_core/itnms/action/components/views/AddScriptView.js"
], function(action,tpl,i18nData,AddGroupView,AddHostView,AddScriptView) {
    var RemoteCommondView = function() {
        this.tpl = fish.compile(tpl);
    }

    RemoteCommondView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    RemoteCommondView.prototype.popup = function(options, props,callback) {
        var self = this;
        this.SearchItem = {};
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.callback = callback;
        self.afterPopup();
    }

    RemoteCommondView.prototype.afterPopup = function() {
        var self = this;
        this.$el.find('.cancle').off('click').on('click', function() {
            self.callback();
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.callback()
            self.$popup.hide();
        });
        self.rendCombox()
        this.$el.find('.addGroup').off('click').on('click', function() {
            console.log(1)
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addGroupView = new AddGroupView();
            addGroupView.popup(options,self.SearchItem,function(param) {
                console.log(param)
                self.appendGroup(param)
            });
        });
        this.$el.find('.addHoust').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addHostView = new AddHostView();
            addHostView.popup(options,self.SearchItem,function(param) {
                self.appendHost(param)
                console.log(param)
            });
        });
        this.$el.find('.addScript').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addScriptView = new AddScriptView();
            addScriptView.popup(options,self.SearchItem,function(param) {
                self.appendScript(param)
                console.log(param)
            });
        });
        self.rradioChange()
    }

    RemoteCommondView.prototype.appendScript = function(param) {
        this.$el.find('.scriptid input').val(param.name)
    }

    RemoteCommondView.prototype.appendGroup = function(param) {
        var self = this;
        var html = ''
        fish.map(param, function(d) {
            html+='<li data-id="'+d.groupid+'">'+d.name+'</li>'
        })
        this.$el.find('.groupList').append(html)
    }

    RemoteCommondView.prototype.appendHost = function(param) {
        var self = this;
        var html = ''
        fish.map(param, function(d) {
            html+='<li data-id="'+d.hostid+'">'+d.name+'</li>'
        })
        this.$el.find('.hostList').append(html)
    }

    RemoteCommondView.prototype.rendCombox = function() {
        var self = this;
        action.itemTypes('ACTION_EVENT_ACKNOWLEDGED_VALUE,ACTION_COMMAND_TYPE,ACTION_COMMAND_EXE_LOC').then(function(datas){
            console.log(datas)
            self.$opconditions = self.$el.find('.opconditions').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_EVENT_ACKNOWLEDGED_VALUE
            });
            self.$opconditions.combobox('value',datas.ACTION_EVENT_ACKNOWLEDGED_VALUE[0].paraValue)
            self.$type = self.$el.find('.type').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_COMMAND_TYPE
            });
            console.log(datas.ACTION_COMMAND_TYPE)
            self.$type.on('combobox:change', function(state) {
                var pVal = $(this).combobox('value');
                self.typeChange(pVal)
            });
            self.$type.combobox('value',datas.ACTION_COMMAND_TYPE[0].paraValue)
            self.$execute_on = self.$el.find('.execute_on').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.ACTION_COMMAND_EXE_LOC
            });
            self.$execute_on.combobox('value',datas.ACTION_COMMAND_EXE_LOC[0].paraValue)
        })
    }

    RemoteCommondView.prototype.typeChange = function(pVal) {
        var self = this
        this.$el.find('.aShow').hide();
        this.$el.find('.aShow'+pVal).show();
    }

    RemoteCommondView.prototype.rradioChange = function() {
        var self = this
        self.$el.find('.radioItem').change(function(){
            var $selectedvalue = $("input[name='check_rad']:checked").val();
            if($selectedvalue === '1'){
                 self.$el.find('.rradio').show()
            }else{
                 self.$el.find('.rradio').hide()
            }
        });
    }

    return RemoteCommondView;
})