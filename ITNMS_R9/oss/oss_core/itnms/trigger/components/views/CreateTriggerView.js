define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "oss_core/itnms/trigger/components/views/TriggerPageView.js",
    "text!oss_core/itnms/trigger/components/views/createTriggerView.html"
], function(action,TriggerPageView,tpl) {
    var CreateTriggerView = function(option) {
        this.option = option;
        this.dataList = [];
        this.itemObj = this.option.itemObj;
        this.upObj = this.option.upObj;
        console.log(this.upObj)
        this.tpl = fish.compile(tpl);
    }
    CreateTriggerView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl())
        this.afterRender()
    }
    CreateTriggerView.prototype.remove = function() {
        $(this.option.el).html("");
    }
    CreateTriggerView.prototype.afterRender = function() {
        var self = this;
        var $el = $(this.option.el);
        self.ItemPage($el)
    }

    CreateTriggerView.prototype.ItemPage = function($el) {
        if (this.TriggerPageView) return;
        var self = this;
        self.renderItemPage();
    }
    CreateTriggerView.prototype.renderItemPage = function(pageItemData, $el) {
        var self = this;
        var $el = $(this.option.el);
        var interfaces = '';
            action.itemTypes('TRIGGER_SEVERITY_LEVEL,TRIGGER_CORRELATION_MODE,TRIGGER_EVENT_GENERAL_TYPE,TRIGGER_RECOVERY_MODE').then(function(datas){
                if(self.itemObj.hostids){
                    datas.hostids = self.itemObj.hostids
                }
                self.dataList = datas;
                self.triggerPageView = new TriggerPageView({
                    el: $el.find('.kdo-right-page-cotent'),
                    'dataList': self.dataList,
                    "itemObj":self.itemObj,
                    "upObj":self.upObj,
                    'parent': self
                })
                //console.log(self.dataList)
                self.triggerPageView.render();
            })
    }

    CreateTriggerView.prototype.done = function() {
        var self = this;
        var baseInfo = self.triggerPageView.getInfo();
        console.log(baseInfo)
        if(self.upObj && self.upObj !== 'undefined'){
            action.triggerPut([baseInfo]).then(function(data){
                if (data.error) {
                    fish.toast('warn', data.error.message + " : " + data.error.data);
                } else {
                    console.log(data,11)
                    fish.toast('info', 'update succeed');
                    self.option.parent.newRender();
                }
            })
        }else{
            action.triggerCreat([baseInfo]).then(function(data) {
                if (data.error) {
                    fish.toast('warn', data.error.message + " : " + data.error.data);
                } else {
                    fish.toast('info', 'creat succeed');
                    self.option.parent.newRender();
                }
            })
        }
    }

    CreateTriggerView.prototype.cancel = function() {
        var self = this;
        self.option.parent.render();
    }
    return CreateTriggerView;

})