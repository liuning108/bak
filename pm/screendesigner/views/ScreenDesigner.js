/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesigner.html",
        "oss_core/pm/screendesigner/views/ScreenDesignerEdit",
        "oss_core/pm/screendesigner/views/ScreenDesignerIndex",

    ],
    function(tpl, EditView, IndexView) {

        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function() {
                var self = this;
                // self.childViews = [new IndexView({'parentView': self}), new EditView({'parentView': self })];
                // this.setViews({
                //     '#new_context':  self.childViews
                // })

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
