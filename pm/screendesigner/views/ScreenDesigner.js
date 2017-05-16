/**
 * 指标筛选弹出窗
 */
define([

        "text!oss_core/pm/screendesigner/templates/ScreenDesigner.html",
        "oss_core/pm/screendesigner/views/ScreenDesignerEdit",
        "oss_core/pm/screendesigner/views/ScreenDesignerIndex",
        "css!oss_core/pm/screendesigner/css/screendesigner.css",
        "css!oss_core/pm/screendesigner/css/dcmegamenu.css",
        "css!oss_core/pm/screendesigner/css/icomoon.css",
        "oss_core/pm/screendesigner/js/raphael-min",
        "oss_core/pm/screendesigner/js/raphael.free_transform",
        "oss_core/pm/screendesigner/js/jquery.dcmegamenu.1.3.3",
        "oss_core/pm/screendesigner/js/jquery.hoverIntent.minified"
    ],
    function(tpl, EditView, IndexView) {

        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function() {
                var self = this;
            },
            render: function() {
                this.$el.html(this.template());
                return this;

            },

            resize: function(h) {

            },
            cleaupView: function(view) {
                if (view) {
                    view.remove();
                    $('#SDparentView').find("#new_context").remove();
                    $('#SDparentView').html("<div id='new_context'></div>")
                }
            },
            index: function() {
                var self = this;
                self.cleaupView(self.view);
                self.view = new IndexView({
                    'el': $('#new_context'),
                    'parentView': self
                }).render();
            },
            edit: function() {
                  var self = this;
                self.cleaupView(self.view);
                self.EditView = new EditView({
                    'el': $('#new_context'),
                    'parentView': self
                }).render();


            },
            afterRender: function(data) {
                this.index();

                return this;
            },
            showDesigner: function() {
                this.index();
            }




        });
    });
