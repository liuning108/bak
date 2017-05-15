/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerIndex.html",

    ],
    function(tpl) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(options) {
                this.parentView=options.parentView;
            },
            events: {
                'click #new43243': 'new'
            },

            render: function() {
                this.$el.html(this.template());
                return this;

            },

            resize: function(h) {

            },

            new: function() {
              this.parentView.edit();
            },
            afterRender: function() {

                return this;
            },


        });
    });
