define([
    "text!oss_core/itnms/zdashboard/templates/DashBoard.html",
    "oss_core/itnms/zdashboard/libs/WidgetEngine.js",
     'oss_core/itnms/zdashboard/libs/gridstack.js',

    'css!oss_core/itnms/zdashboard/libs/gridstack.css',
    "css!oss_core/itnms/zdashboard/css/zdashboard.css",
], function(tpl,WidgetEngine) {

    return portal.BaseView.extend({

        template: fish.compile(tpl),
        events: {
            'click .btn-add': 'addWidgetEvent',
             'click .btn-save': 'saveDashBoard',

        },
        initialize: function() {

        },
        saveDashBoard:function(){
          var json=this.engine.getJson();
          fish.store.set('zdjson',json);
          alert(JSON.stringify(json));
          console.log(JSON.stringify(json));
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        addWidgetEvent:function(){
          var config={
             'url':'oss_core/itnms/zdashboard/libs/widgets/CanvasWidget.js'
          }
          this.engine.addWidget(config)
        },
        afterRender: function() {
          this.$el.parent().css("background","#EBEEF0") //seting main background color
          this.engine =new WidgetEngine(this.$el.find('.grid-stack'));
          var json=fish.store.get('zdjson');
          this.engine.load(json);


        },


    });
});
