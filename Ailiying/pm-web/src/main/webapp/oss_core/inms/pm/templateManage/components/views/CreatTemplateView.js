define([
    "oss_core/inms/pm/templateManage/actions/template",
    'i18n!oss_core/inms/pm/templateManage/i18n/template',
    "text!oss_core/inms/pm/templateManage/components/views/CreatTemplateView.html",
    "oss_core/inms/pm/templateManage/components/views/TemTabsView.js"
], function(action,i18nData,tpl,TemTabsView) {
    var CreatTemplateView = function() {
        this.tpl = fish.compile(tpl);
    }

    CreatTemplateView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    CreatTemplateView.prototype.popup = function(options, props,type,pEl,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.type = type;
        this.pEl = pEl;
        self.callback = callback;
        self.afterPopup();

    }

    CreatTemplateView.prototype.afterPopup = function() {
        var self = this;
        this.temTabsView = new TemTabsView({
            el:this.$el.find('.template-tabs'),
            upObj:this.props,
            type:this.type,
            pEl:this.pEl
        })
        this.temTabsView.render();
        this.$el.find('.reset').off('click').on('click', function() {
            self.callback();
            self.$popup.hide();
        });
        this.$el.find('.OK').off('click').on('click', function() {
            console.log(self.temTabsView.getInfo())
            if(self.props && self.props.length > 0){
                if(self.type === 'copy'){
                    action.pmtemplateConfigInfoadd(self.temTabsView.getInfo()).then(function(datas){
                        self.callback(self.temTabsView.getInfo())
                        fish.toast('success','success');
                        self.$popup.hide();
                    })
                }else{
                    action.pmtemplateConfigInfoupdate(self.temTabsView.getInfo()).then(function(datas){
                        self.callback(self.temTabsView.getInfo())
                        fish.toast('success','success');
                        self.$popup.hide();
                    })
                }
            }else{
                action.pmtemplateConfigInfoadd(self.temTabsView.getInfo()).then(function(datas){
                    self.callback(self.temTabsView.getInfo())
                    fish.toast('success','success');
                    self.$popup.hide();
                })
            }
        });

    }

    return CreatTemplateView;
})