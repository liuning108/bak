define([
    'text!oss_core/pm/wrokspace/templates/Workspace.html',
    "i18n!oss_core/pm/wrokspace/i18n/workspace",
    'css!oss_core/pm/util/css/ad-component.css',
    'css!oss_core/pm/util/css/ad-block.css',
    'css!oss_core/pm/wrokspace/assets/workspace.css'
], function(tpl,i18nData) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        initialize: function(param) {
            var self = this;
            this.param=param;
        },
        render: function() {
            this.$el.html(this.template(fish.extend({},i18nData)));
            return this;

        },

        afterRender: function(data) {


        },

        showDesigner: function(param) {
            this.index(param);
        }

    });
});
