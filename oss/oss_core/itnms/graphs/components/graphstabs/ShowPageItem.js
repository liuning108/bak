define([
  "oss_core/itnms/host/components/views/RootView.js", "oss_core/itnms/graphs/utils/util.js",
  "text!oss_core/itnms/graphs/components/graphstabs/ShowPageItemView.html",
], function(RootView, util,tpl) {
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
    },
  ShowPageItem.prototype.remove=function(){
      //重写父类，删除不由RootVie来管理
    },
  ShowPageItem.prototype.loadPage= function() {
       this.item=$(this.tpl());
       this.item.appendTo(this.$el);
    },
  ShowPageItem.prototype.afterRender=function() {
      this.initPage();
    },
  ShowPageItem.prototype.initPage=function(){
      var self =this;
      this.item.find('.glyphicon-minus')
               .off('click')
               .on('click',function(){
                 self.removeItem();
               })
       var funDataSource = [
         {"name":'min',value:"2"},
         {"name":'avg',value:"3"},
         {"name":'max',value:"4"},
       ]
       var funDataSource2 = [
         {"name":'CPU利用率',value:1},
         {"name":'内存利用率',value:2},
       ]
       var topDataSource = [
         {"name":'固定值',value:1},
         {"name":'计算值',value:2},
       ]
       var alignDataSource = [
         {"name":'Left',value:1},
         {"name":'right',value:2},
       ]
      this.funCombox =util.combobox(this.item.find('.itemFun'),funDataSource);
      this.funCombox2 =util.combobox(this.item.find('.itemFun2'),funDataSource2);

      this.funCombox.combobox('value',3);
      this.funCombox2.combobox('value',1);
      this.topCombox =util.combobox(this.item.find('.topComBox'),topDataSource);

      this.topCombox.on('combobox:change',function() {
             var value = self.topCombox.combobox('value');
             self.topComboxValue(value);
      })
      this.topCombox.combobox('value',2);
      this.topComboxValue(2);
      this.alignCombox =util.combobox(this.item.find('.alignCombox'),alignDataSource);
      this.alignCombox.combobox('value',1);
      this.colorItem= $(this.item.find('.itemColor')).colorpicker();
      this.colorItem.colorpicker('set','red');




    },
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
