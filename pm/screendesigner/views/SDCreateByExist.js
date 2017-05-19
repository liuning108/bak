/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/SDCreateByExist.html",

    ],
    function(tpl) { 
        return portal.BaseView.extend({
            className : "ui-dialog dialog SDdialog",
            template: fish.compile(tpl),
            initialize: function() {},
            events: {
                'click .sd_byexist_cancel':'sd_byexist_cancel'
            },
            sd_byexist_cancel: function() {
                this.trigger('cancel')
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            },

            resize: function(h) {

            },

            afterRender: function() {
                return this;
            },


        });
    });
