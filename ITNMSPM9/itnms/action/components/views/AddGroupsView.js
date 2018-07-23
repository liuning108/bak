define([
    "oss_core/itnms/action/actions/actionAction",
    "text!oss_core/itnms/action/components/views/addGroupsView.html",
    'i18n!oss_core/itnms/action/i18n/action',
    "oss_core/itnms/action/components/views/AddGroupView.js"
], function(action,tpl,i18nData,AddGroupView) {
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
        this.$el.find('.addGroup').off('click').on('click', function() {
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
    }

    RemoteCommondView.prototype.appendGroup = function(param) {
        var self = this;
        var html = ''
        fish.map(param, function(d) {
            html+='<li data-id="'+d.groupid+'">'+d.name+'</li>'
        })
        this.$el.find('.groupList').append(html)
    }

    return RemoteCommondView;
})