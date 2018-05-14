define([
    "text!oss_core/pm/screendesigner/templates/ScreenDesigner.html",
    "text!oss_core/pm/screendesigner/templates/ScreenDesigner2.html",
    "oss_core/pm/screendesigner/views/ScreenDesignerEdit",
    "oss_core/pm/screendesigner/views/ScreenDesignerIndex",
    "css!oss_core/pm/screendesigner/css/screendesigner.css",
    "css!oss_core/pm/screendesigner/css/dcmegamenu.css",
    "css!oss_core/pm/screendesigner/css/icomoon.css",
    "css!oss_core/pm/screendesigner/js/colorpicker/colorpicker.css",
    "oss_core/pm/screendesigner/js/raphael-min",
    "oss_core/pm/screendesigner/js/raphael.free_transform",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-workflowPie",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsListLineBar",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsPie",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-workflowPie",
    "oss_core/pm/screendesigner/js/jquery.dcmegamenu.1.3.3",
    "oss_core/pm/screendesigner/js/jquery.hoverIntent.minified",
    "oss_core/pm/screendesigner/js/TweenMax.min",
    "oss_core/pm/screendesigner/js/colorpicker/fish.colorpicker"
], function(tpl,tpl2, EditView, IndexView) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        template2: fish.compile(tpl2),

        initialize: function(param) {
            var self = this;
            this.param=param;

        },
        render: function() {
            if(this.param.param){
                if(this.param.param==1){
                    this.$el.html(this.template2());
                }else{
                    this.$el.html(this.template());
                }
            }else{
              this.$el.html(this.template());
            }

            return this;

        },

        resize: function(h) {},
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
            var flag =false;
            if(this.param.param){
                if(this.param.param==1){
                    flag =true;
                }
            }
            if (flag){
              self.view = new IndexView({'el': $('#new_context2'), 'parentView': self,perviewMode:true}).render();
            }else{
              self.view = new IndexView({'el': $('#new_context'), 'parentView': self,perviewMode:false}).render();
            }
        },

        edit: function(params) {
            var self = this;
            self.cleaupView(self.view);
            self.EditView = new EditView({'el': $('#new_context'), 'parentView': self, 'params': params}).render();

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
