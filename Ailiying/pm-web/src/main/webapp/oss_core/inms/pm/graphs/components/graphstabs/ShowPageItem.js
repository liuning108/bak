                    define([
  "oss_core/inms/pm/graphs/components/kdoPickColor/PickColorViewDialog.js",
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/graphstabs/ShowPageItemView.html",
], function(PickColorViewDialog,RootView, util,tpl) {
  var evetMap = [
  ]
  var ShowPageItem = function(option){
   RootView.call(this,option)
  }
  ShowPageItem.prototype = Object.create(RootView.prototype);
  ShowPageItem.prototype.constructor = ShowPageItem;
  ShowPageItem.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;

    },
  ShowPageItem.prototype.removeItem=function(){
      this.item.remove();
      var parent  = this.option.parent;
      var id =  this.option.id;
      parent.delItem(id);
    },
  ShowPageItem.prototype.remove=function(){
      //重写父类，删除不由RootVie来管理
    },
  ShowPageItem.prototype.loadPage= function() {
       this.item=$(this.tpl());
       this.item.appendTo(this.$el);
    },
  ShowPageItem.prototype.getJson =function(){
     var self =this;
     json = {}
     json.type = this.topCombox.combobox('value');
     json.topName = this.funCombox2.combobox("value");
     json.topType  =this.funCombox.combobox('value');
     json.topTextBox = this.item.find('.topTextBox').val();
     json.color =self.color||"#F35352";
     return json;
  }
  ShowPageItem.prototype.afterRender=function() {
      this.initPage();
      this.LoadDatas();
    },

  ShowPageItem.prototype.LoadDatas=function(){
      var self =this;
      var d=this.option.d;
      console.log('LoadDatasLoadDatas LoadDatas',d);
      if(d){
        this.item.find('.topTextBox').val(d.topTextBox);
        this.topCombox.combobox('value',d.type);
        this.funCombox2.combobox('value',d.topName);
        this.funCombox.combobox('value',d.topType);
        var color =d.color;
        this.item.find('.itemColor').css('backgroundColor',color);
        self.color = color;
      }

  }
  ShowPageItem.prototype.initPage=function(){
      var self =this;
      this.item.find('.glyphicon-minus')
               .off('click')
               .on('click',function(){
                 self.removeItem();
               })
       var funDataSource = [
         {"name":'min',value:"min"},
         {"name":'avg',value:"avg"},
         {"name":'max',value:"max"},
       ]

       this.itemsDatas = fish.map(this.option.items,function(d){
           return {
              "name":d.NAME,
              "value":d.ID,
              "unit":d.UNIT,
           }
       })
       var funDataSource2 = this.itemsDatas
       var topDataSource = [
         {"name":'固定值',value:"1"},
         {"name":'计算值',value:"2"},
       ]
      this.funCombox =util.combobox(this.item.find('.itemFun'),funDataSource);
      this.funCombox2=util.combobox(this.item.find('.itemFun2'),funDataSource2);
      this.funCombox.combobox('value',funDataSource[0].value);
      this.funCombox2.combobox('value',funDataSource2[0].value);
      this.topCombox =util.combobox(this.item.find('.topComBox'),topDataSource);

      this.topCombox.on('combobox:change',function() {
             var value = self.topCombox.combobox('value');
             self.topComboxValue(value);
      })
      this.topCombox.combobox('value',topDataSource[0].value);
      this.topComboxValue(topDataSource[0].value);

      // this.colorItem= $(this.item.find('.itemColor')).colorpicker();
      // this.colorItem.colorpicker('set','red');
      this.item.find('.itemColor').css('backgroundColor',"red");
      this.item.find('.itemColor').off('click').on('click',function() {
         self.pickColor($(this));
      })
    }
  ShowPageItem.prototype.pickColor=function($colorEL){

      var self = this;
       var options = {
         height: 300,
         width: 230,
         modal: true,
         draggable: false,
         autoResizable: false,
       };
       var pickColorView = new PickColorViewDialog();
       pickColorView.popup(options, {"color":self.color||"#F35352"}, function(color) {
         $colorEL.css('backgroundColor',color);
         self.color = color;
       });

    }
  ShowPageItem.prototype.topComboxValue=function(value) {
      var self =this;
      if(value==1){
        self.item.find('.topTextBox').show();
        self.item.find('.itemFunContext').hide();
      }else{
        self.item.find('.topTextBox').hide();
        self.item.find('.itemFunContext').show();
      }
    };
  return ShowPageItem;
});
