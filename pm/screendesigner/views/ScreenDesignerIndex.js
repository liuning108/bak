/**
 * 指标筛选弹出窗
 */
define([
        "text!oss_core/pm/screendesigner/templates/ScreenDesignerIndex.html",
        "oss_core/pm/screendesigner/views/SDCreateByExist",

    ],
    function(tpl,SDCreateByExist) {
        return portal.BaseView.extend({
            template: fish.compile(tpl),
            initialize: function(options) {
                this.parentView=options.parentView;
            },
            events: {
                'click .add_dashboard': 'add_dashboard',
                'click .add_dashboardFromExist':'add_dashboardFromExist'
            },

            render: function() {
                this.$el.html(this.template());
                return this;

            },

            add_dashboardFromExist:function(){
                var view =new SDCreateByExist().render();
                var options = {
                       height: 610,
                       width:1060,
                       modal: false,
                       draggable: false,
                       content: view.$el,
                       autoResizable: true,
                       modal: true
                };
                   var popup = fish.popup(options);
                   this.listenTo(view,'cancel',function(){
                       popup.close();
                   })
            },

            resize: function(h) {
                var height = $('body').height()-80;
                $('#SDIndex').height(height);
            },

            add_dashboard: function() {
              this.parentView.edit();
            },
            afterRender: function() {

                return this;
            },


        });
    });
