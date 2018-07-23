define([
    "oss_core/itnms/items/actions/ItemAction",
    "oss_core/itnms/items/components/views/ItemPageView.js",
    "text!oss_core/itnms/items/components/views/createItemView.html"
], function(action,ItemPageView,tpl) {
    var CreateItemView = function(option) {
        this.option = option;
        this.dataList = [];
        this.itemObj = this.option.itemObj;
        this.upObj = this.option.upObj;
        this.tpl = fish.compile(tpl);
    }
    CreateItemView.prototype.render = function() {
        this.remove();
        var $el = $(this.option.el);
        $el.html(this.tpl())
        this.afterRender()
    }
    CreateItemView.prototype.remove = function() {
        $(this.option.el).html("");
    }
    CreateItemView.prototype.afterRender = function() {
        var self = this;
        var $el = $(this.option.el);
        self.ItemPage($el)
    }

    CreateItemView.prototype.ItemPage = function($el) {
        if (this.ItemPageView) return;
        var self = this;
        self.renderItemPage();
    }

    CreateItemView.prototype.renderItemPage = function(pageItemData, $el) {
        var self = this;
        var $el = $(this.option.el);
        var interfaces = '';
        action.getInterfase({
                "hostids": self.itemObj.hostids ? [self.itemObj.hostids] : []
            }).then(function(data){
            interfaces = data.result
        }).then(function(){
            action.itemTypes('ITEM_TYPE,ITEM_VALUE_TYPE,ITEM_VALUE_MAP,ITEM_INVENTORY_LINK,ITEM_PROCESSING_TYPE,ITEM_SNMP_SECURIYT_LEVEL,ITEM_SSH_AUTH_TYPE').then(function(datas){
                if(self.itemObj.hostids){
                    datas.hostids = self.itemObj.hostids
                }
                datas.interfaces = interfaces
                self.dataList = datas;
                self.itemPageView = new ItemPageView({
                    el: $el.find('.kdo-right-page-cotent'),
                    'dataList': self.dataList,
                    "itemObj":self.itemObj,
                    "upObj":self.upObj,
                    'parent': self
                })
                //console.log(self.dataList)
                self.itemPageView.render();
            })
        })
    }

    CreateItemView.prototype.done = function() {
        var self = this;
        var baseInfo = self.itemPageView.getInfo();
        console.log(baseInfo)
        if(self.upObj && self.upObj !== 'undefined'){
            action.itemPut([baseInfo]).then(function(data){
                if (data.error) {
                    fish.toast('warn', data.error.message + " : " + data.error.data);
                } else {
                    fish.toast('info', 'update succeed');
                    self.option.parent.newRender();
                }
            })
        }else{
            action.itemCreat(baseInfo).then(function(data) {
                if (data.error) {
                    fish.toast('warn', data.error.message + " : " + data.error.data);
                } else {
                    fish.toast('info', 'creat succeed');
                    self.option.parent.newRender();
                }
            })
        }
    }

    CreateItemView.prototype.cancel = function() {
        var self = this;
        self.option.parent.render();
    }
    return CreateItemView;

})