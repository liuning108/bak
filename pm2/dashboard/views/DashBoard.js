define([

    "text!oss_core/pm/dashboard/templates/DashBoard.html",
    "oss_core/pm/dashboard/views/DashBoardIndex",
    "oss_core/pm/dashboard/views/DashBoardEdit",
    "css!oss_core/pm/dashboard/css/dashboard.css",
    "css!oss_core/pm/dashboard/css/dcmegamenu2.css",
    "css!oss_core/pm/dashboard/css/icomoon.css",
    "css!oss_core/pm/dashboard/js/colorpicker/colorpicker.css",
    "oss_core/pm/dashboard/js/raphael-min",
    "oss_core/pm/dashboard/js/jquery.dcmegamenu.1.3.3",
    "oss_core/pm/dashboard/js/jquery.hoverIntent.minified",

], function(tpl,IndexView, EditView) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        initialize: function() {
            var self = this;
        },
        render: function() {
            this.$el.html(this.template());
            return this;

        },

        resize: function(h) {},
        cleaupView: function(view) {
            if (view) {
                view.remove();
                $('#DashBoardparentView').find("#new_context_dashBoard").remove();
                $('#DashBoardparentView').html("<div id='new_context_dashBoard'></div>")
            }
        },
        index: function(params) {


            var self = this;
            self.cleaupView(self.view);
            self.view = new IndexView({'el': $('#new_context_dashBoard'), 'parentView': self,'params': params}).render();
            // this.edit({});
        },

        edit: function(params) {
            var self = this;
            self.cleaupView(self.view);
            self.EditView = new EditView({'el': $('#new_context_dashBoard'), 'parentView': self, 'params': params}).render();

        },
        afterRender: function(data) {
            this.index({});
            return this;
        },
        showDesigner: function(param) {
            this.index(param);
        }

    });
});
