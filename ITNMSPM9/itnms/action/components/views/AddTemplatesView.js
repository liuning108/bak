define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addTemplatesView.html",
    'i18n!oss_core/itnms/action/i18n/action',
    "oss_core/itnms/action/components/views/AddTemView.js"
], function(action,tpl,i18nData,AddTemView) {
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
        this.$el.find('.addTem').off('click').on('click', function() {
            var options = {
                height: 400,
                width: self.$el.width(),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var addTemView = new AddTemView();
            addTemView.popup(options,self.SearchItem,function(param) {
                console.log(param)
                self.appendTem(param)
            });
        });
    }

    RemoteCommondView.prototype.appendTem = function(param) {
        var self = this;
        var html = ''
        fish.map(param, function(d) {
            html+='<li data-id="'+d.templateid+'">'+d.name+'</li>'
        })
        this.$el.find('.temList').append(html)
    }

    return RemoteCommondView;
})