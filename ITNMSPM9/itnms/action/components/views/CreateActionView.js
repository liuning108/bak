define([
    "oss_core/itnms/action/actions/actionAction",
    "oss_core/itnms/action/components/views/ActionPageView.js",
    "text!oss_core/itnms/action/components/views/createActionView.html"
], function(action,ActionPageView,tpl) {
    var CreateActionView = function(option) {
        this.option = option;
        this.dataList = [];
        this.itemObj = this.option.itemObj;
        this.upObj = this.option.upObj;
        console.log(this.upObj)
        this.cType = this.option.cType
        this.tpl = fish.compile(tpl);
    }
    CreateActionView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl())
        this.afterRender()
    }
    CreateActionView.prototype.remove = function() {
        $(this.option.el).html("");
    }
    CreateActionView.prototype.afterRender = function() {
        var self = this;
        var $el = $(this.option.el);
        self.ItemPage($el)
    }

    CreateActionView.prototype.ItemPage = function($el) {
        if (this.ActionPageView) return;
        var self = this;
        self.renderItemPage();
    }
    CreateActionView.prototype.renderItemPage = function(pageItemData, $el) {
        var self = this;
        var $el = $(this.option.el);
        var interfaces = '';
            action.itemTypes('ACTION_CONDITION_EVALTYPE,ACTION_OPERATION_TYPE_0,ACTION_OPERATION_TYPE_0_r,ACTION_OPERATION_TYPE_0_ack,ACTION_OPERATION_TYPE_1,ACTION_OPERATION_TYPE_2,ACTION_OPERATION_TYPE_3,ACTION_OPERATION_TYPE_3_r').then(function(datas){
                if(self.itemObj.hostids){
                    datas.hostids = self.itemObj.hostids
                }
                self.dataList = datas;
                self.actionPageView = new ActionPageView({
                    el: $el.find('.kdo-right-page-cotent'),
                    'dataList': self.dataList,
                    "itemObj":self.itemObj,
                    "upObj":self.upObj,
                    'parent': self,
                    "cType":self.cType
                })
                //console.log(self.dataList)
                self.actionPageView.render();
            })
    }

    CreateActionView.prototype.done = function() {
        var self = this;
        var baseInfo = self.actionPageView.getInfo();
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

    CreateActionView.prototype.cancel = function() {
        var self = this;
        self.option.parent.render();
    }
    return CreateActionView;

})