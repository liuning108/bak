define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/AixsPageView.html"
], function(RootView, util, tpl) {
  var evetMap = []
  var AixsPageView = function(option) {
    RootView.call(this, option)
  };
  AixsPageView.prototype = Object.create(RootView.prototype);
  AixsPageView.prototype.constructor = AixsPageView;
  AixsPageView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  AixsPageView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  AixsPageView.prototype.afterRender = function() {
    var aixsPageConfig =this.option.state.config||{};
    var config = aixsPageConfig.aixsPage||{};
    var y1 = config.y1||'c';
    var y2 = config.y2||'c';
    var y1Name = config.y1Name || '';
    var y1Min  = config.y1Min || '';
    var y1Max= config.y1Max||'';
    var y2Name = config.y2Name || '';
    var y2Min  = config.y2Min || '';
    var y2Max= config.y2Max||'';


    if(y1=='o'){
     this.$el.find('.yAxis1').attr('checked',true);
    }else{
     this.$el.find('.yAxis1').attr('checked',false);
    }
    if(y2=='o'){
     this.$el.find('.yAxis2').attr('checked',true);
    }else{
      this.$el.find('.yAxis2').attr('checked',false);
    }
    this.$el.find('.yAxis1Name').val(y1Name);
    this.$el.find('.yAxis1Min').val(y1Min);
    this.$el.find('.yAxis1Max').val(y1Max);
    this.$el.find('.yAxis2Name').val(y2Name);
    this.$el.find('.yAxis2Min').val(y2Min);
    this.$el.find('.yAxis2Max').val(y2Max);
    this.initPage();
  },
    AixsPageView.prototype.getJSON=function(){
      var json = {};
      json.y1 = this.$el.find('.yAxis1').is(':checked')?"o":"c"
      json.y2=  this.$el.find('.yAxis2').is(':checked')?"o":"c"
      json.y1Name = this.$el.find('.yAxis1Name').val();
      json.y1Min = this.$el.find('.yAxis1Min').val();
      json.y1Max= this.$el.find('.yAxis1Max').val();
      json.y2Name = this.$el.find('.yAxis2Name').val();
      json.y2Min = this.$el.find('.yAxis2Min').val();
      json.y2Max= this.$el.find('.yAxis2Max').val();
      return json
    }
  AixsPageView.prototype.initPage = function() {
    var self = this;
    this.$el.find('.axisSwitch').off('change').on("change", function() {
      self.switchGrid($(this));
    })
    fish.each(this.$el.find('.axisSwitch'), function(dom) {
      self.switchGrid($(dom));
    })

  },
  AixsPageView.prototype.switchGrid = function(target) {
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
  return AixsPageView;
});
