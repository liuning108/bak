/**
 * 指标筛选弹出窗
 */
define(["text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LookDBSource.html"], function(tpl) {
  return portal.BaseView.extend({
    className: "ui-dialog dialog SDdialog LookDBSourceDialog",
    template: fish.compile(tpl),
    initialize: function(config) {
        this.config=config
    },
    events:{
      'click .lookDBSourceClose':'close'
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },


    createColModel:function(datas) {
        var keys = fish.keys(datas[0]);
        return fish.map(keys,function(id){
            var item={};
            item.name=id;
            return item
        })
    },

    afterRender: function() {
        var self =this;
        var  mydata =[];
             mydata = this.config.db.datas;
        var colModels=this.config.db.colModels;
          var opt = {
           data: mydata,
           height:540,
           width:1020,
           colModel: colModels
          };
       $grid = this.$el.find("#lookDbSourceGird").grid(opt);
      return this;
    },
    close: function() {
      this.trigger('close')
    }

  });
});
