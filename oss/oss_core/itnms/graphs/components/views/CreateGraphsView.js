define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/views/CreateGraphsView.html"
], function(RootView, util,tpl) {
  var evetMap = [
    {'el': '.graphsCancel','type': 'click','handel': 'cancel'},
    {'el': '.graphsOK','type': 'click','handel': 'ok'},

  ]
  var CreateGraphsView = RootView.extend({
    initProp: function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    loadPage: function() {
      this.$el.html(this.tpl());
    },
    afterRender: function() {
      this.initPage();

    },
    initPage:function(){
      this.titlePosition = this.$el.find('.titlePosition').combobox({
         editable: false,
         dataTextField: 'name',
         dataValueField: 'value',
         dataSource: [
              {name: 'Center', value: '1'},
              {name: 'Left', value: '2'},
              {name: 'Right', value: '3'},
         ],
      });
      this.titlePosition.combobox('value',"1");
      util.kdoinputStyle(this.$el.find('.kdo-input-style'));
    },
    cancel: function() {
      util.doNotNull(this.option.cancel);
    },
    ok:function() {
     util.doNotNull(this.option.ok);
    },
  })
  return CreateGraphsView;
});
