define([
  "oss_core/inms/pm/graphs/utils/echarts.js",
  "oss_core/inms/pm/graphs/components/views/RootView.js",
  "oss_core/inms/pm/graphs/components/gLibs/GCharts.js",
  "oss_core/inms/pm/graphs/utils/util.js",
  "oss_core/inms/pm/graphs/utils/DBUtil.js",
  "text!oss_core/inms/pm/graphs/components/views/PerviewGrpahView.html",
  "text!oss_core/inms/pm/graphs/components/views/timeRange.html"
], function(echarts, RootView, GCharts, util, DBUtil, tpl, timeRangeTpl) {
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
    this.timeTpl = fish.compile(timeRangeTpl);
    this.timeUL = fish.compile('<ul class="timeRangeUL"></ul>');
    this.evetMap = evetMap;
  },
  PerviewGrpahView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  PerviewGrpahView.prototype.initTitle = function() {
    var $title = this.$el.find('.graphs-title');
    var config = this.option.config;
    if (!config)
      return;
    $title.text(config.title);
    $title.css('text-align', util.titlePos(config.position));
  }
  PerviewGrpahView.prototype.afterRender = function() {
    var self = this;
    this.initTitle()
    this.loadDatas();

  }
  PerviewGrpahView.prototype.loadDatas = function(timeRangeObj) {
    var self =this;
    var el = this.$el.find('.graphsShow');
    console.log("noDataConfig", this.option.config,timeRangeObj);
    DBUtil.getLoadDatas(this.option.config,timeRangeObj, function(config) {

      console.log("getLoadDatas", config);
      if (config.error) {
        el.text(config.error)
      } else {
        self.initTimeCompenont(
               config,
               config.paramvalues.result,
               config.USE_GRANU_MODES
         );
        var g = GCharts.init(el, config);
        g.render();

      }
    });
  }
  PerviewGrpahView.prototype.initTimeCompenont = function(config, timeParams, GRANU_MODE) {
    var self = this;
    if(self.initTimeFlag)return;
    self.initTimeFlag=true;
    console.log('initTimeCompenont', config);
    var $timePop = null;
    var timePage = config.tabsConfig.timePage;
    var curTimeRange = timePage.timeRange + timePage.granus;
    var curName = util.getTimeName(timeParams, timePage);
    var granULs = util.getGranus(GRANU_MODE, timeParams);
    var $elTime = $(this.timeTpl());
    var sTime = $elTime.find('.s_datetime').datetimepicker();
    var eTime = $elTime.find('.e_datetime').datetimepicker();
    var sDate = null;
    var eDate = null;
    var curG =  timePage.granus;
    $elTime.find('.gTimeOK').on('click', function() {
      sDate = sTime.datetimepicker('value');
      eDate = eTime.datetimepicker('value');
      if (sDate.length <= 0 || eDate.length <= 0) {
        $timePop.popover('hide');
      } else {
        curTimeRange = "CUS";
        curName = sDate + " to " + eDate
        var timeRangeObj = {s:sDate,e:eDate,g:curG};
        self.loadDatas(timeRangeObj);
        self.$el.find('.timeRangeTxt').text(curName);
      }

      $timePop.popover('hide');
    })
    $elTime.find('.gTimeCancel').on('click', function() {
      $timePop.popover('hide');
    })
    var $timeRangeBody = $elTime.find('.timeRangeBody')
    fish.each(granULs, function(d) {
      var $ul = $(self.timeUL()).append("<li class='title"+d.granu+"'>" + d.title + "</li>");
      fish.each(d.items, function(item) {
        var classFlag = item.VALUE + d.granu;
        $ul.append("<li class='" + " btnli " + classFlag + "' data-id='" + classFlag + "' data-name='" + item.NAME + "'>" + item.NAME + "<i class='glyphicon glyphicon-ok'></i></li>")
      })
      $ul.find('.btnli').off('click').on('click', function() {
        curTimeRange = $(this).data('id');
        curName = $(this).data('name');
        self.$el.find('.timeRangeTxt').text(curName);
        sTime.datetimepicker('value', '');
        eTime.datetimepicker('value', '');
        //alert(curTimeRange);
        var curTimeRangeObj= util.getTimeRange(curTimeRange);
        if(curTimeRangeObj){
          curG =curTimeRangeObj.g;
          self.loadDatas(curTimeRangeObj);
          $timeRangeBody.find(".granTitlelBlue").removeClass('granTitlelBlue');
          $timeRangeBody.find(".title"+curG).addClass("granTitlelBlue")
        }
        $timePop.popover("hide");
      })
      $timeRangeBody.append($ul)
      $timeRangeBody.find(".granTitlelBlue").removeClass('granTitlelBlue');
      $timeRangeBody.find(".title"+curG).addClass("granTitlelBlue")

    })

    this.$el.find('.timeRangeTxt').text(curName);
    $timePop = this.$el.find('.timeRangeTool').popover({
      html: true,
      placement: 'bottom-right',
      template: '<div class="popover gTimePopover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
      trigger: 'click',
      content: $elTime,
      beforeHide: function() {
        return true;
      }
    }).on("popover:show", function() {
      $timeRangeBody.find('.active').removeClass('active')
      $timeRangeBody.find('.' + curTimeRange).addClass('active');
    })
  }
  PerviewGrpahView.prototype.callback = function() {
    util.doNotNull(this.option.callback);
  }

  return PerviewGrpahView;
});
