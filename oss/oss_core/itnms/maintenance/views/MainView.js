define([
  "oss_core/itnms/maintenance/actions/MainAction", "text!oss_core/itnms/maintenance/templates/MainView.html", "oss_core/itnms/host/components/kdoTree/kdoTree",
  "oss_core/itnms/maintenance/components/views/MainListView",
  "css!oss_core/itnms/host/css/kdo.css",
  "css!oss_core/itnms/host/css/host.css"
], function(action, tpl, kdoTree,MainListView) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    render: function() {
      this.$el.html(this.template());
    },
    initialize: function(options) {},
    initCss: function() {
      this.$el.parent().css({'padding': '0px'})
    },
    afterRender: function() {
      var self = this;
      this.initCss();
      this.loadData();

    },
    loadData: function() {
      var self = this;
      action.getCategoryTree().then(function(data) {
        self.LeftTree(data)
      })

      this.initView();
      self.$el.find('.allMainShow').off('click').on('click',function(){
         self.initView();
      })

    },
    initView: function() {
      var self = this;
      var docH = $(document).height();
      var tableH = (docH - 48 - 35 - 30 - 40 - 40) * 0.92;
      action.getAllGroup().then(function(data) {
        var groups = fish.map(data.result, function(d) {
          return {'groupid': d.groupid, 'name': d.name}
        })

        if (self.mainListView)
          self.mainListView.remove();
        self.mainListView = new MainListView(
          {
           el: self.$el.find('.kdo_cotent'),
          'tableH': tableH,
          'groups': groups
         }
        );
        self.mainListView.render();

      });
    },
    LeftTree: function(data) {

      var self = this;
      var kTree = new kdoTree({
        'el': self.$el.find('.tree-content'),
        'data': data,
        'rootId': 'R',
        'callback': function(id) {
          self.loadMainByCateoryId(id);
        }
      });
      kTree.render();
    },
    loadMainByCateoryId: function(id) {
      var self = this;
      var docH = $(document).height();
      var tableH = (docH - 48 - 35 - 30 - 40 - 40) * 0.92;
      action.getGroupidsBySubNo(id).then(function(datas) {

        var groups = fish.map(datas.result, function(d) {
          return {'groupid': d.groupid, 'name': d.name}
        }) //end of maps
        if (self.mainListView) {
          self.mainListView.remove();
        }
        self.mainListView = new MainListView({el: self.$el.find('.kdo_cotent'), 'tableH': tableH, 'groups': groups, 'bisId': id})
        self.mainListView.render();
      })

    },
    resize: function() {}
  }); //end of BaseView
});
