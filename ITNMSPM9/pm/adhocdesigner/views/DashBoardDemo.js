define([
        'text!oss_core/pm/adhocdesigner/templates/DashBoardDemo.html',
        "oss_core/pm/adhocdesigner/views/AdhocFactory"
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
            var view = adhocFactory.adhocConfigForDashBoard(600);
            this.$("#adhocCfgContainer").show();
            this.$("#adhocCfgContainer").html(view.$el);
            this.listenTo(view, 'AdhocCancelEvent', this.wrap(function () {
                this.$('#adhocCfgContainer').hide();
            }));
            this.listenTo(view, 'AdhocSaveEvent', this.wrap(function (data) {
                this.$('#adhocCfgContainer').hide();
                this.showAdhoc(data.adhocNo);
            }));
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
            this.listenTo(view, 'AdhocCancelEvent', this.wrap(function () {
                this.$('#adhocCfgContainer').hide();
            }));
            this.listenTo(view, 'AdhocSaveEvent', this.wrap(function (data) {
                this.$('#adhocCfgContainer').hide();
                this.showAdhoc(data.adhocNo);
            }));
        },

        resize: function () {

        }

    })
});
