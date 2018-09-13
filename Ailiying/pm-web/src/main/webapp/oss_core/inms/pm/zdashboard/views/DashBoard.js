define([
    "text!oss_core/inms/pm/zdashboard/templates/DashBoard.html",
    "oss_core/inms/pm/zdashboard/libs/WidgetEngine",
    'oss_core/inms/pm/zdashboard/libs/html2canvas',
     'oss_core/inms/pm/zdashboard/libs/gridstack',
    'css!oss_core/inms/pm/zdashboard/libs/gridstack.css',
    "css!oss_core/inms/pm/zdashboard/css/zdashboard.css"
], function(tpl,WidgetEngine,html2canvas) {

    return portal.BaseView.extend({

        template: fish.compile(tpl),
        events: {
            'click .btn-add': 'addWidgetEvent',
            'click .btn-save': 'saveDashBoard',
            'click .btn-saveimg': 'saveAsImg',
            'click .btn-cancel': 'cancel'


        },
        initialize: function(option) {
          this.callback=option.callback||function(){};
        },
        saveDashBoard:function(){
          var json=this.engine.getJson();
          fish.store.set('zdjson',json);
          // alert(JSON.stringify(json));
          // console.log(JSON.stringify(json));
           fish.toast('success', '操作成功')
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        addWidgetEvent:function(){
          var config={
             'url':'oss_core/inms/pm/zdashboard/libs/widgets/CanvasWidget.js'
          }
          this.engine.addWidget(config)
        },

        afterRender: function() {
          this.$el.parent().css("background","#FFFFFF") //seting main background color
          this.engine =new WidgetEngine(this.$el.find('.grid-stack'));
          var json=fish.store.get('zdjson');
            //alert(JSON.stringify(json));
          this.engine.load(json);


        },
        cancel:function(){
          this.callback();
        },

        saveAsImg: function() {

            html2canvas($('.grid-stack')[1], {
                allowTaint: true,
                taintTest: false,
                onrendered: function (canvas) {
                    canvas.id = "mycanvas";
                    //document.body.appendChild(canvas);
                    //生成base64图片数据
                    var dataUrl = canvas.toDataURL();

                    var newImg = document.createElement("img");
                    newImg.src = dataUrl;
                    document.body.appendChild(newImg);
                }
            });

        }


    });
});
