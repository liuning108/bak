/**
 * 指标筛选弹出窗
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/DrillCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-btn-ok" : "fnOK",
                "click #ad-btn-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.$("#tabs").tabs();
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                this.trigger("okEvent", {});
            },

            resize: function() {
                return this;
            }
        });
    });