define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/graphstabs/ShowPageView.html",
  "oss_core/inms/pm/graphs/components/graphstabs/ShowPageItem.js",
], function(RootView, util,tpl,Item) {
  var evetMap = [
    {'el': '.addItem','type': 'click','handel': 'add'},
  ]
  var ShowPageView = function(option){
    RootView.call(this, option)
  };
  ShowPageView.prototype = Object.create(RootView.prototype);
  ShowPageView.prototype.constructor = ShowPageView;
  ShowPageView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
      this.items={};
    },
    ShowPageView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    ShowPageView.prototype.afterRender=function() {
      this.initPage();
      this.loadDatas();
    },
    ShowPageView.prototype.loadDatas=function(){
       var self =this;
      var config  = this.option.state.config||{}
      console.log("ShowPageView loadDatas",config);
      if(config.showPage){
        var showPageConfig = config.showPage;
        if(showPageConfig.markLines.length>0){
          fish.each(showPageConfig.markLines,function(d){
            self.add(d);
          })
        }
      }
    }
    ShowPageView.prototype.initPage=function(){
      // this.add()
    },
    ShowPageView.prototype.getJSON=function(){
      var json = {};
      json.markLines=[];
      fish.each(this.items,function(d){
         json.markLines.push(d.getJson())
      })
      return json;
    },
    ShowPageView.prototype.add=function(d){
      var self =this;
      var items  = this.option.state.items;
      console.log("ShowPageView items:",items);
      var id = fish.getUUID();
      var item =  new Item({
        "id":id,
        "el":this.$el.find('.itemBody'),
        "d":d,
        "items":items,
        'parent':self
      });
      item.render();
      this.items[id]=item;
      console.log("ShowPageView ITEMS:",this.getJSON())

    }

    ShowPageView.prototype.delItem=function(id){
       delete this.items[id]
      console.log("ITEMS ITEMS:",this.items)
    }
  return ShowPageView;
});
