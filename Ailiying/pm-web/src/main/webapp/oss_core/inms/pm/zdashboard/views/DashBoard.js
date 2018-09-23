define([
    "oss_core/inms/pm/zdashboard/actions/DashAction.js",
    "oss_core/inms/pm/zdashboard/libs/addwidget/AddWidViewDialog",
    "text!oss_core/inms/pm/zdashboard/templates/DashBoard.html",
    "oss_core/inms/pm/zdashboard/libs/WidgetEngine",
    'oss_core/inms/pm/zdashboard/libs/html2canvas',
    'oss_core/inms/pm/zdashboard/libs/gridstack',
    'css!oss_core/inms/pm/zdashboard/libs/gridstack.css',
    "css!oss_core/inms/pm/zdashboard/css/zdashboard.css",
    "css!oss_core/inms/pm/graphs/css/kdo.css",
    "css!oss_core/inms/pm/graphs/css/graphs.css",
], function(action,AddWidViewDialog,tpl,WidgetEngine,html2canvas) {

    return portal.BaseView.extend({
        template: fish.compile(tpl),
        events: {
            'click .btn-add': 'addWidgetEvent',
            'click .btn-save': 'saveDashBoard',
            'click .btn-saveimg': 'saveAsImg',
            'click .btn-cancel': 'cancel',
            'click .zrefresh': 'zrefresh',

        },
        zrefresh:function(){
          var items =this.engine.getItems();
          fish.each(fish.values(items),function(item){
             item.refresh();
          })
          fish.toast('success', '刷新成功')
        },
        initialize: function(option) {
          this.callback=option.callback||function(){};
          this.tid =option.id || 'T00001'
        },
        saveDashBoard:function(){

          var json=this.engine.getJson();
          json.tid = this.tid;
          console.log('zdjson',json);
          fish.store.set('zdjson',json);
          action.saveOrUpdateDash(json).then(function(data){
              fish.toast('success', '保存成功')
          })

          // alert(JSON.stringify(json));
          // console.log(JSON.stringify(json));

        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        addWidgetEvent:function(){
           var self = this;
           var options = {
             height: 560,
             width: 900,
             modal: true,
             draggable: false,
             autoResizable: false,
           };
           var addWidViewDialog = new AddWidViewDialog();
           addWidViewDialog.popup(options, {'tid':self.tid}, function(datas) {
             self.addWidgetToScreen(datas);
           });
        },
        addWidgetToScreen:function(datas){
          console.log("addWidgetToScreen",datas);
          var self = this;

          fish.each(datas,function(data){
            var config={
               'url':'oss_core/inms/pm/zdashboard/libs/widgets/GWidget.js',
               'data':data
            }
            self.engine.addWidget(config)
          })

        },
        afterRender: function() {
          var self =this;
          this.$el.parent().css("background","#FFFFFF") //seting main background color
          this.engine =new WidgetEngine(this.$el.find('.grid-stack'));
          action.getDash(self.tid).then(function(data){
             console.log('getDash',data);
             if(data.result){
               self.engine.load(data.result);
             }
            //
          })
          //var json=fish.store.get('zdjson');
            //alert(JSON.stringify(json));
          //this.engine.load(json);


        },
        cancel:function(){
          this.callback();
        },

        saveAsImg: function() {
          alert(22);

          window.location.href="download?fileName=nohup.out"
            // html2canvas($('.grid-stack')[1], {
            //     allowTaint: true,
            //     taintTest: false,
            //     onrendered: function (canvas) {
            //         canvas.id = "mycanvas";
            //         //document.body.appendChild(canvas);
            //         //生成base64图片数据
            //         var dataUrl = canvas.toDataURL();
            //
            //         var newImg = document.createElement("img");
            //         newImg.src = dataUrl;
            //         document.body.appendChild(newImg);
            //     }
            // });

        }


    });
});
