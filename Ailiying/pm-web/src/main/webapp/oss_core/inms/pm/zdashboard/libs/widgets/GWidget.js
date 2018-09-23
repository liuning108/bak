define([
  "text!oss_core/inms/pm/zdashboard/libs/widgets/time.html",
  "oss_core/inms/pm/graphs/components/gLibs/GCharts.js",
  "oss_core/inms/pm/graphs/utils/util.js",
  "oss_core/inms/pm/graphs/utils/DBUtil.js",
  "oss_core/inms/pm/graphs/actions/GraphsAction.js",
  "text!oss_core/inms/pm/zdashboard/libs/widgets/GWidget.html"

], function(timeTpl,GCharts,util,DBUtil,action,tpl) {
  return portal.BaseView.extend({
    template:fish.compile(tpl),
    timeTpl:fish.compile(timeTpl),
    refresh:function(){
      console.log('GWidget refresh')
      this.loadDatas(this.timeRangeObj);
    },
    initialize:function(opt){
      this.w=opt.w;
      this.h=opt.h;
      this.props=opt;
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    loadConfig:function(tid){
      var self =this;
      action.getGraphsById(tid).then(function(data) {
        self.initPage(data.result);
      })
    },

    afterRender: function() {
      var self =this;
      var tid  = this.props.data.gid;
      this.loadConfig(tid)
      var el = this.$el.find('.graphsShow');
      el.height(this.h-29);
    },
    initPage:function(config){
      this.option={};
      this.option.config=config;
      this.initTitle(config);
      this.loadDatas();
    },
    loadDatas:function(timeRangeObj){
      var self =this;
      var el = this.$el.find('.graphsShow');
      self.timeRangeObj=timeRangeObj;
      DBUtil.getLoadDatas(this.option.config,timeRangeObj, function(config) {
        if (config.error) {
          el.text(config.error)
        } else {
          self.initTimeCompenont(
                 config,
                 config.paramvalues.result,
                 config.USE_GRANU_MODES
           );
          self.g = GCharts.init(el, config);

          self.g.render();
        }
      });
    },
    initTimeCompenont:function(config, timeParams, GRANU_MODE){
      var self = this;
      if(self.initTimeFlag)return;
      self.initTimeFlag=true;
      console.log('initTimeCompenont', config);
      //显示图标
      var $gtime=this.$el.parent().find('.gtime');
      $gtime.show();
      var $timeText =this.$el.parent().find('.timeRangeTxt')
      //显示当前显示的粒度
      var timePage = config.tabsConfig.timePage;
      var curTimeRange = timePage.timeRange + timePage.granus;
      var curName = util.getTimeName(timeParams, timePage);
      var curG =  timePage.granus;
      $timeText.text(curName);
      var granULs =util.getGranus(GRANU_MODE, timeParams);
      console.log('granULs222',granULs);
      var $timeTpl = $(this.timeTpl({'uls':granULs}));

      var sTime = $timeTpl.find('.s_datetime').datetimepicker();
      var eTime = $timeTpl.find('.e_datetime').datetimepicker();

      $timeTpl.find('.gTimeOK').on('click', function() {
        sDate = sTime.datetimepicker('value');
        eDate = eTime.datetimepicker('value');
        if (sDate.length <= 0 || eDate.length <= 0) {
          $timePop.popover('hide');
        } else {
          curTimeRange = "CUS";
          curName = sDate + " to " + eDate
          var timeRangeObj = {s:sDate,e:eDate,g:curG};
          self.loadDatas(timeRangeObj);
          $timeText.text("自定义");
          $timeText.attr("title",curName)
        }

        $timePop.popover('hide');
      })

      $timeTpl.find('.graphsCancel').on('click',function(){
          $timePop.popover('hide');
      });

      $timeTpl.find('.btnli').off('click').on('click',function() {
        curTimeRange = $(this).data('id');
        curName = $(this).data('name');
        $timeText.text(curName);
        // sTime.datetimepicker('value', '');
        // eTime.datetimepicker('value', '');
        //alert(curTimeRange);
        var curTimeRangeObj= util.getTimeRange(curTimeRange);
        if(curTimeRangeObj){
          curG =curTimeRangeObj.g;
          self.loadDatas(curTimeRangeObj);
          self.timeActiveAction($timeTpl,curTimeRange)
        }
        $timePop.popover("hide");
      })

      $timeTpl.find('.title').off('click').on('click',function(){
              var granu =$(this).data('granu');
              $timeTpl.find('.item').hide();
              if(granu=='C'){
                $timeTpl.find('.citem').show();
              }else{
                $timeTpl.find('.item'+granu).show();
              }
      })
      //弹出
      var $timePop = this.$el.parent().find('.timeBtn').popover({
        html: true,
        placement: 'bottom-right',
        template: '<div class="popover gTimeWidgetPopover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        trigger: 'click',
        content: $timeTpl,
        beforeHide: function() {
          return true;
        }
      }).on("popover:show", function() {
          self.timeActiveAction($timeTpl,curTimeRange)
      })


    },
    timeActiveAction:function($timeTpl,curTimeRange){

      $timeTpl.find('.active').removeClass('active')
      if(curTimeRange=='CUS'){
        $timeTpl.find('.item').hide();
        $timeTpl.find('.citem').show();
      }else{
        $timeTpl.find('.' + curTimeRange).addClass('active');
        var granu ="_"+curTimeRange.split("_")[1];
        $timeTpl.find('.item').hide();
        $timeTpl.find('.item'+granu).show();
      }

    },
    initTitle:function(config){
        var $title =this.$el.parent().find('.grid-title');
        $title.text(config.title);
        $title.css('text-align', util.titlePos(config.position));

    },
     widgetResize: function(w, h) {
       this.w=w;
       this.h=h;
       var el = this.$el.find('.graphsShow');
       el.height(this.h-20);
       this.g.resize(w,h);
    }
  });
})
