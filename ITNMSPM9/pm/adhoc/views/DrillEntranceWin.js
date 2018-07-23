/**
 *
 */
define([
        'text!oss_core/pm/adhoc/templates/DrillEntranceWin.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(ShareTopicCfgView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog normal-background",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(ShareTopicCfgView),

            events : {
                'click #ad-drill-entrance-btn': "viewExtensionClick"
            },

            initialize: function(inParam) {
                this.inParam = inParam;
                this.leftPosition = inParam.leftPosition;
                this.topPosition = inParam.topPosition;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                this.$el.css("left", this.leftPosition+"px");
                this.$el.css("top", this.topPosition+"px");
            },

            viewExtensionClick: function() {
                this.trigger('viewExtension',this.inParam);
            },

            resize: function() {
                return this;
            }
        });
    }
);