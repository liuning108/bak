define([
  "oss_core/pm/dashboard/views/DashBoardPerView",
    "oss_core/pm/dashboard/actions/DashBoardAction",
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

], function(DashBoardPerView,action,tpl,IndexView, EditView) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        initialize: function(param) {
            var self = this;
            this.param=param;
        },
        render: function() {
            this.$el.html(this.template());
            return this;

        },

        resize: function(h) {},
        cleaupView: function(view) {
            var self = this;
            if (view) {
                view.remove();
                self.$el.find('#DashBoardparentView').find("#new_context_dashBoard").remove();
                self.$el.find('#DashBoardparentView').html("<div id='new_context_dashBoard'></div>")
            }
        },

        fullScreen:function(params) {
          var self = this;
          self.cleaupView(self.view);
          self.EditView = new EditView({'el': self.$el.find('#new_context_dashBoard'), 'parentView': self, 'params': params,'fullScreen':true}).render();
        },
        index: function(params) {
            var self = this;
            self.cleaupView(self.view);
            self.view = new IndexView({'el': self.$el.find('#new_context_dashBoard'), 'parentView': self,'params': params}).render();
            // this.edit({});
        },

        edit: function(params) {
            var self = this;
            self.cleaupView(self.view);
            self.EditView = new EditView({'el': self.$el.find('#new_context_dashBoard'), 'parentView': self, 'params': params}).render();

        },
        afterRender: function(data) {
          if(this.param.topicNo){
            this.perview({'id':this.param.topicNo})
          }else{
            this.index({});

          }
            return this;

        },
        perview:function(param) {
         var  self =this;
         var id =param.id;
          action.queryDashBoardById(id,function(data){
            console.log(data);
              var topicJson= data.result.topicJson;
              self.detailView = new DashBoardPerView({
                  'el': self.$el.find("#new_context_dashBoard"),
                  'parentView': self,
                  model: {
                       h:680,
                      'json':topicJson,
                  }
              }).render();
          })
        },
        showDesigner: function(param) {
            this.index(param);
        }

    });
});
