define([
        'text!oss_core/inms/pm/adhocdesigner/templates/DashBoardDemo.html',
        "oss_core/inms/pm/adhocdesigner/views/AdhocFactory"
    ],
    function(mainTpl, adhocFactory) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {
            'click .ad-dashboard-add-btn': "addComponent",
            'click .ad-dashboard-edit-btn': "editComponent"
        },

        initialize: function (opt) {

        },

        render: function () {
            this.$el.html(this.reportMainTemplate());
            return this;
        },

        afterRender: function () {
            //this.showAdhoc('PMS-20170831-TP10351162');
        },

        addComponent: function () {
            var self = this;
            var view = adhocFactory.adhocConfigForDashBoard(600);
            this.$("#adhocCfgContainer").show();
            this.$("#adhocCfgContainer").html(view.$el);
            this.listenTo(view, 'AdhocCancelEvent', function () {
                self.$('#adhocCfgContainer').hide();
            });
            this.listenTo(view, 'AdhocSaveEvent', function (data) {
                self.$('#adhocCfgContainer').hide();
                self.showAdhoc(data.adhocNo);
            });
        },

        showAdhoc: function (adhocNo) {
            var view = adhocFactory.adhocForDashBoard(adhocNo);
            this.$("#adhocDisplayContainer").show();
            this.$("#adhocDisplayContainer").html(view.$el);
        },

        editComponent: function () {
            var view = adhocFactory.adhocConfigForDashBoard(600, 'PMS-20170831-TP10351162');
            this.$("#adhocCfgContainer").show();
            this.$("#adhocCfgContainer").html(view.$el);
            this.listenTo(view, 'AdhocCancelEvent', function () {
                self.$('#adhocCfgContainer').hide();
            });
            this.listenTo(view, 'AdhocSaveEvent', function (data) {
                self.$('#adhocCfgContainer').hide();
                self.showAdhoc(data.adhocNo);
            });
        },

        resize: function () {

        }

    })
});
