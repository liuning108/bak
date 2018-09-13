define([
 "oss_core/inms/pm/graphs/components/kdoPickColor/PickColorViewDialog.js",
 "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/HostPageItemView.html"
], function(PickColorViewDialog,RootView, util, tpl) {
  var evetMap = []
  var HostPageItem = function(option) {
    RootView.call(this, option)
  };
  HostPageItem.prototype = Object.create(RootView.prototype);
  HostPageItem.prototype.constructor = HostPageItem;
  HostPageItem.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;

  };
  HostPageItem.prototype.removeItem = function() {
    this.item.remove();
    var parent  = this.option.parent;
    var id =  this.option.id;
    parent.delItem(id);
  };
  HostPageItem.prototype.remove = function() {
    //重写父类，删除不由RootVie来管理
  };
  HostPageItem.prototype.loadPage = function() {
    this.item = $(this.tpl());
    this.item.appendTo(this.$el);
  };
  HostPageItem.prototype.afterRender = function() {
    this.initPage();
  };
  HostPageItem.prototype.initPage = function() {
    var self = this;
    var d=this.option.d;
    this.item.find('.glyphicon-minus').off('click').on('click', function() {
      self.removeItem();
     
    })

    var funDataSource = [
      {
        "name":util.prop.NONE,
        value: util.prop.NONE
      },
      {
        "name": util.prop.MIN,
         value: util.prop.MIN
      },
       {
        "name": util.prop.MAX,
        value: util.prop.MAX
      },
      {
        "name": util.prop.AVG,
        value: util.prop.AVG
      },
      {
        "name": util.prop.SUM,
        value: util.prop.SUM,
      },
    ]
    this.itemsDatas = fish.map(this.option.items,function(d){
        return {
           "name":d.NAME,
           "value":d.ID,
           "unit":d.UNIT,
        }
    })
    var topDataSource = this.itemsDatas
    console.log("itemsDatas",this.itemsDatas);
    var alignDataSource = [
      {
        "name": "Y轴1",
        value: 0
      }, {
        "name": 'Y轴2',
        value: 1
      }
    ]
    this.funCombox = util.combobox(this.item.find('.itemFun'), funDataSource);
    this.funCombox.combobox('value', funDataSource[0].value);
    this.topCombox = util.combobox(this.item.find('.topComBox'), topDataSource);
    this.topCombox.combobox('value', this.itemsDatas[0].value);
    var parent  = this.option.parent;
    this.topCombox.on('combobox:change',function(){
        parent.itemChange();
    })
    this.alignCombox = util.combobox(this.item.find('.alignCombox'), alignDataSource);
    this.alignCombox.combobox('value', 0);
    this.item.find('.itemColor').css('backgroundColor',"red");
    this.item.find('.itemColor').off('click').on('click',function() {
       self.pickColor($(this));
    })
    if(d){
      this.topCombox.combobox('value',d.value);
      var type = d.type||'';
      if(type.length<=0){
        type =funDataSource[0].value;
      }
      this.funCombox.combobox('value',type);
      var yType =d.yType||0;
      this.alignCombox.combobox('value', yType);
      var color =d.color||"red"
      this.item.find('.itemColor').css('backgroundColor',color);
      self.color = color;
    }

    // this.colorItem = $(this.item.find('.itemColor')).colorpicker();
    // this.colorItem.colorpicker('set', 'red');

  };
  HostPageItem.prototype.getJson=function(){
     var self = this;
     var value=this.topCombox.combobox('value');
     var type = this.funCombox.combobox('value');
     var yType = this.alignCombox.combobox('value');
     var item =fish.find(this.itemsDatas,function(d){
        return ""+d.value == ""+value;
     });
     var json = {};
     json =  { value: item.value,
              "name":item.name,
              "unit":"",
              "type":type,
              'color':self.color,
              'yType':yType
            }
     return json;
  }
  HostPageItem.prototype.pickColor=function($colorEL){

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
       self.color= color;
     });

  }
  return HostPageItem;
});
