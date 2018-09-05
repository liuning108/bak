define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/TimePageView.html"
], function(RootView, util, tpl) {
  var evetMap = []
  var timeMap={
    '_15':"15分钟",
    '_H':"小时",
    '_D':"天",
    '_W':"周",
    '_M':"月",
  }
  var TimePageView = function(option) {
    RootView.call(this, option)
  };
  TimePageView.prototype = Object.create(RootView.prototype);
  TimePageView.prototype.constructor = TimePageView;
  TimePageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  TimePageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  TimePageView.prototype.afterRender = function() {
    //oss_core/inms/pm/adhocdesigner/views/AdhocDesignerMain
      this.initPage();
  },
  TimePageView.prototype.getJSON = function() {
     var json = {}
     json.granus = this.timeCom.combobox('value');
     json.timeRange = this.timeRangeCom.combobox('value');
     return json
  }
  TimePageView.prototype.initPage = function() {
    var self =this;
    var timeSource=this.getTimeSource();
    console.log("timeSource",timeSource);
    this.timeRangeCom = util.combobox(this.$el.find('.timeRangeCom'), []);
    this.timeCom = util.combobox(this.$el.find('.timeSource'), timeSource);
    this.timeCom.on('combobox:change', function () {
        var val = self.timeCom.combobox('value');
        if(!val)return;
        var timeRange =self.getTimeRange(val)
        self.timeRangeCom.combobox({
          'dataSource':timeRange
        })
        self.timeRangeCom.combobox('value',timeRange[0].value);
        var timeComValue = self.timeCom.combobox('value');

         var config  = self.option.state.config||{}
         if(config.timePage){
            if(timeComValue==config.timePage.granus){
              var timeRange= config.timePage.timeRange||timeRange[0].value
              self.timeRangeCom.combobox('value',timeRange);
            }
         }

    });
    this.timeCom.combobox('value',timeSource[0].value);
    var config  = this.option.state.config||{}
    if(config.timePage){
       var granus = config.timePage.granus||timeSource[0].value;
       this.timeCom.combobox('value',granus);

    }


  },
  TimePageView.prototype.getTimeRange=function(val){

      var granus = "TGRANU"+val;
      var  timeConfig = this.option.state.granusConfig.timeConfig;
      console.log("getTimeRange ",timeConfig)
      var  timeFilter = fish.filter(timeConfig,function(d){
        console.log("getTimeRange ",d.ID,granus)
         return d.ID==granus
      })
      return fish.map(timeFilter,function(d){
        return {
          'name':d.NAME,
          'value':d.VALUE
        }
      });

  }
  TimePageView.prototype.getTimeSource=function(){
    var  granus = this.option.state.granusConfig.granus
    console.log("TimeSource",this.option.state.granusConfig.granus);
    var granusDataSource = fish.map(granus,function(d){
       return {
         "value":d,
         'name':timeMap[d]
       }
    })
    return granusDataSource
  }
  TimePageView.prototype.switchGrid = function(target) {
    var $target = target;
    var el = $target.data('el');
    var flag = $target.is(':checked');
    var $context = this.$el.find(el);
    if (flag) {
      $context.show();
    } else {
      $context.hide();
    }
  }
  return TimePageView;

})
