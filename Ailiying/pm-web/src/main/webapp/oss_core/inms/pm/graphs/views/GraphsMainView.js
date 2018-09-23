define([
  "text!oss_core/inms/pm/graphs/templates/GraphsMainView.html",
  "oss_core/inms/pm/graphs/components/views/GraphsListView",
  "css!oss_core/inms/pm/graphs/css/kdo.css",
  "css!oss_core/inms/pm/graphs/css/graphs.css",
], function(tpl,GraphsListView) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    render: function() {
     this.$el.html(this.template());
    },
    initCss: function() {
      //oss_core/inms/pm/adhocdesigner/views/AdhocDesignerMain
      this.$el.parent().css({'padding': '0px'})
    },
    afterRender: function() {
      this.initCss();
      var self = this;
      var docH = $(document).height();
      var tableH = (docH - 48 - 35 - 30-20);
      this.graphsListView = new GraphsListView({
           el: self.$el,
          'id': "T00001",//'T00001',   //"PMS_20180906204217_TP00002846",
          'code': 'PMPS_PIMSERVER_BM', //'PMPS_ERICA2PBM',
           tableH: tableH,
           callback:function() {
             self.render();
           }
        })
     this.graphsListView.render();
    }
  }); //end of BaseView
});
