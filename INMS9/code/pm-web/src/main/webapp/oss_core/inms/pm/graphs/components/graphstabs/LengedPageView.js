
define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js", "text!oss_core/inms/pm/graphs/components/graphstabs/LengedPageView.html"
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
    var self =this;


    this.$el.find('.ad-legend-direction-btn').off('click')
            .on("click",function(){
                self.$el.find('.ad-legend-direction-btn.active')
                        .removeClass('active');
                $(this).addClass('active');
            })
    var lengedPageConfig =this.option.state.config||{};
    var  config =lengedPageConfig.lengedPage||{};
    var lengedFlag = config.lengedFlag||'o';
    var dir = config.direction||'T';
    if(lengedFlag=='o'){
     this.$el.find('.lengedFlag').attr('checked',true);
    }else{
     this.$el.find('.lengedFlag').attr('checked',false);
    }
    this.$el.find('.ad-legend-direction-btn[data-dir="'+dir+'"]')
            .addClass("active");
    this.initPage();
  },
    AixsPageView.prototype.getJSON=function(){
      var json = {};
      json.lengedFlag = this.$el.find('.lengedFlag').is(':checked')?"o":"c"
      json.direction =this.$el.find('.ad-legend-direction-btn.active').data('dir');
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
