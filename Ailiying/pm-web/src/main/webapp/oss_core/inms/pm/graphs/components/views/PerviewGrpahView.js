define([
  "oss_core/inms/pm/graphs/utils/echarts.js", "oss_core/inms/pm/graphs/components/views/RootView.js",
  "oss_core/inms/pm/graphs/components/gLibs/GCharts.js", "oss_core/inms/pm/graphs/utils/util.js",
  "oss_core/inms/pm/graphs/utils/DBUtil.js",
   "text!oss_core/inms/pm/graphs/components/views/PerviewGrpahView.html"
], function(echarts, RootView,GCharts, util,DBUtil, tpl) {
  var evetMap = [
    {
      'el': '.callback',
      'type': 'click',
      'handel': 'callback'
    }
  ]
  var PerviewGrpahView = function(option) {
    RootView.call(this, option)
  }
  PerviewGrpahView.prototype = Object.create(RootView.prototype);
  PerviewGrpahView.prototype.constructor = PerviewGrpahView;
  PerviewGrpahView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  PerviewGrpahView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  PerviewGrpahView.prototype.initTitle=function(){
    var $title = this.$el.find('.graphs-title');
    var config = this.option.config;
    if(!config)return;
    $title.text(config.title);
    $title.css('text-align',util.titlePos(config.position));
  }
  PerviewGrpahView.prototype.afterRender = function() {
     var el  =this.$el.find('.graphsShow');
     this.initTitle()
     DBUtil.getLoadDatas(this.option.config,function(config){
       console.log("getLoadDatas",config);
       if(config.error){
           el.text(config.error)
       }else{
         var g  =  GCharts.init(el,config);
          g.render();
       }
     });

    //
    //  var g  =  GCharts.init(el,config);
    //  g.render();
  }
  PerviewGrpahView.prototype.callback = function() {
    util.doNotNull(this.option.callback);
  }

  return PerviewGrpahView;
});
