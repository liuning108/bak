define([
    "oss_core/inms/pm/items/actions/ItemAction",
    'i18n!oss_core/inms/pm/items/i18n/items',
    "text!oss_core/inms/pm/items/components/views/createItemView.html",
    "oss_core/inms/pm/items/components/views/ItemPageView.js"
], function(action,i18nData,tpl,ItemPageView) {
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
        $el.html(this.tpl(i18nData))
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
         action.getParamvalueInfo('ITEM_VALUE_TYPE,ITEM_VALUE_MAP,ITEM_DIRECTION,ITEM_PROCESSING_TYPE').then(function(datas){
            self.itemPageView = new ItemPageView({
                el: $el.find('.kdo-right-page-cotent'),
                'dataList': datas,
                "itemObj":self.itemObj,
                "upObj":self.upObj,
                'parent': self
            })
            //console.log(self.dataList)
            self.itemPageView.render();
        })
    }

    CreateItemView.prototype.done = function() {
        var self = this;
        var baseInfo = self.itemPageView.getInfo();
        console.log(baseInfo)
        if(self.upObj && self.upObj !== 'undefined'){
            action.updateItemsInfo(baseInfo).then(function(data){
                if (data.ReturnCode === '0') {
                    fish.toast('info', 'Update succeed');
                    self.option.parent.newRender();
                } else {
                    fish.toast('warn', 'Update Error');
                }
            })
        }else{
            action.addItemsInfo(baseInfo).then(function(data) {
                console.log(data,111)
                if (data.ReturnCode === '0') {
                    fish.toast('info', 'creat succeed');
                    self.option.parent.newRender();
                } else {
                    fish.toast('warn', 'Creat Error');
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