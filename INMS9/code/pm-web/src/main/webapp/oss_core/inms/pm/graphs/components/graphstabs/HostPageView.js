define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/HostPageView.html", "oss_core/inms/pm/graphs/components/graphstabs/HostPageItem.js"
], function(RootView, util, tpl, Item) {
  var evetMap = [
    {
      'el': '.addItem',
      'type': 'click',
      'handel': 'add'
    }
  ]
  var HostPageView = function(option) {
    RootView.call(this, option)
  };
  HostPageView.prototype = Object.create(RootView.prototype);
  HostPageView.prototype.constructor = HostPageView;
  HostPageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
    this.items={};
  },
  HostPageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  HostPageView.prototype.afterRender = function() {
    this.initPage();
  },
  HostPageView.prototype.initPage = function() {
  //  this.add()
  var xAxisDataSource = [
    {
     "name": '时间',
      value: 'T'
    }, {
      "name": '监测点',
      value: 'P'
    },
    {
      "name": '指标',
      value: 'C'
    }
  ]
  this.xAxis = util.combobox(this.$el.find('.xAxis'), xAxisDataSource);
  this.xAxis.combobox('value',xAxisDataSource[0].value)
  this.xAxis.combobox('option', 'equalWidth', true);
  this.loadDatas();

  }
  HostPageView.prototype.loadDatas=function(){
    var self =this;
    var config  = this.option.state.config||{}
    if(config.hostPage){
      var hostPageConfig = config.hostPage;
      if(hostPageConfig.selItems.length>0){
        fish.each(hostPageConfig.selItems,function(d){
           self.addItem(d);
        })
      }
      if(hostPageConfig.xAxis){
       self.xAxis.combobox('value',hostPageConfig.xAxis);
      }
    }
  }
  HostPageView.prototype.getJson=function(){
    var json = {};
    json.selItems=[];
    fish.each(this.items,function(d){
       json.selItems.push(d.getJson())
    })
    json.xAxis =this.xAxis.combobox('value');
    return json;
  }
  HostPageView.prototype.addItem=function(d){
    var self =this;
    var items  = this.option.state.items;
    var id = fish.getUUID();
    var item = new Item({
      el: this.$el.find('.itemBody'),
      "items":items,
      "d":d,
      'id':id,
      'parent':self
    });
    item.render();
    this.items[id]=item;
    console.log("ITEMS ITEMS:",this.items)

  }
  HostPageView.prototype.add = function() {
     this.addItem();
  }
  HostPageView.prototype.delItem=function(id){
     delete this.items[id]
    console.log("ITEMS ITEMS:",this.items)
  }
  return HostPageView;
});
