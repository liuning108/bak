/**
 *
 */
define([
        'text!oss_core/pm/dashboard/templates/AddDashBoardWin.html',
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({
            className : "ui-dialog dialog",
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
              'click #btn-slm-dashboard-ok':'fnOK',
              'click #btn-slm-dashboard-cancel':'fnCancel'
            },

            initialize: function(inParam) {

            },

            render: function() {
                this.$el.html(this.template(this.resource));
                return this;
            },

            contentReady: function() {

            },



            fnOK: function() {
                this.trigger("okEvent", {
                   id: '74837972',
                   classNo:'PSMdhfsh'
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            }
        });
    }
);
