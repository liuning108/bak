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
    this.item.find('.glyphicon-minus').off('click').on('click', function() {
      self.removeItem();
    })
    var funDataSource = [
      {
        "name": 'all',
        value: "1"
      }, {
        "name": 'min',
        value: "2"
      }, {
        "name": 'avg',
        value: "3"
      }, {
        "name": 'max',
        value: "4"
      }
    ]
    var topDataSource = [
      {
        "name": 'CPU利用率',
        value: 1
      }, {
        "name": '内存利用率',
        value: 2
      }
    ]
    var alignDataSource = [
      {
        "name": 'Left',
        value: 1
      }, {
        "name": 'right',
        value: 2
      }
    ]
    this.funCombox = util.combobox(this.item.find('.itemFun'), funDataSource);
    this.funCombox.combobox('value', 3);
    this.topCombox = util.combobox(this.item.find('.topComBox'), topDataSource);
    this.topCombox.combobox('value', 2);

    this.alignCombox = util.combobox(this.item.find('.alignCombox'), alignDataSource);
    this.alignCombox.combobox('value', 1);
    this.item.find('.itemColor').css('backgroundColor',"red");
    this.item.find('.itemColor').off('click').on('click',function() {
       self.pickColor($(this));
    })

    // this.colorItem = $(this.item.find('.itemColor')).colorpicker();
    // this.colorItem.colorpicker('set', 'red');

  };
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
     pickColorView.popup(options, {"color":"#F35352"}, function(color) {
       $colorEL.css('backgroundColor',color);
     });

  }
  return HostPageItem;
});
