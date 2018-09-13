define([], function() {
  var util = {
    prop:{
       "BYGRANU":"BYGRANU",
       "NONE":"NONE",
       "MIN":"MIN",
       "MAX":"MAX",
       "AVG":"AVG",
       "SUM":"SUM",
    },
    mulChose:function(el,dataSource,callback,useRange){
      el.empty()
      fish.each(dataSource,function(d){
         el.append('<li data-value="'+d.value+'" data-name="'+d.name+'"><i class="glyphicon glyphicon-ok"></i>'+d.name+'</li>')
      })
      fish.each(useRange,function(d){
        el.find('li[data-value="'+d.value+'"]').addClass('active');
      })
      el.find('li').off('click').on('click',function(){
          var target = $(this);
          if(target.hasClass('active')){
            target.removeClass('active');
          }else{
            target.addClass('active');
          }
          var activeData=fish.map(el.find('li.active'),function(d){
             return {
                     'value':$(d).data('value'),
                     'name':$(d).data('name')
                    }
          });
          callback(activeData)
      });

    },
    switchChecked:function($el,$parent){
        $el.off('change').on("change", function() {
           var $target = $(this)
           var el = $target.data('el');
           var flag = $target.is(':checked');
           var $context =$parent.find(el);
           if (flag) {
             $context.show();
           } else {
             $context.hide();
           }
        })
    },
    comboboxChange:function($comboxEl,callback){
      $comboxEl.on('combobox:change',function () {
         var item =$comboxEl.combobox('getSelectedItem')
         if(item){
           callback(item);
         }
      });
    },
    getDateFromatList:function(config){
      var filterData=fish.filter(config,function(d){
          return d.ID=='GRANU_FORMAT2'

      })
      var resultData=[{
        'name':util.prop.NONE,
        'value':util.prop.NONE
      }]
      var fresultData =fish.map(filterData,function(d){
          return {
            'name':d.NAME,
            'value':d.VALUE
          }
      })
      fresultData.push({
        'name':'按查询粒度',
        'value':util.prop.BYGRANU
      })
      return resultData.concat(fresultData)
    },
    curMFLD:function(date){
      var y =Number(fish.dateutil.format(date, 'yyyy'));
      var m =Number(fish.dateutil.format(date, 'mm'));
      var firstDay = new Date(y, m - 1, 1);
      var lastDay = new Date(y, m, 0);
      return {f:firstDay,l:lastDay}
    },
    curYFLD:function(date){
      var y =Number(fish.dateutil.format(date, 'yyyy'));
      var firstDay = new Date(y,0, 1);
      var lastDay = new Date(y+1, 0, 1);
      return {f:firstDay,l:lastDay}
    },
    getTimeRange:function(timeRange){
       var now = new Date();
       var time={};
       time.g ="_"+timeRange.split("_")[1]
       switch (timeRange) {
         case "03_15":  //6小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-6);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_15";
           return time;
         case "01_15":  //1小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-1);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_15";
           return time;
         case "02_15":  //3小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-3);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_15";
           return time;
         case "04_15":  //12小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-12);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_15";
           return time;
         case "05_15":  //24小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-24);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_15";
           return time;
         case "06_15":  //今天
           time.s =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var endStart=fish.dateutil.addDays(now,1);
           time.e = fish.dateutil.format(endStart, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_15";
           return time;
         case "07_15":  //昨天
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-1);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_15";
           return time;
         case "03_H": //6小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-6);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_H";
           return time;
         case "02_H": //3小时
           time.e=fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-3);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_H";
           return time;
         case "04_H":// 12小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-12);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_H";
           return time;
         case "05_H":// 24小时
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd hh:ii:ss');
           var startDate=fish.dateutil.addHours(now,-24);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd hh:ii:ss');
           time.g ="_H";
           return time;
         case "06_H":// 今天
           time.s =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var endStart=fish.dateutil.addDays(now,1);
           time.e = fish.dateutil.format(endStart, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_H";
           return time;
         case "07_H":// 昨天
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-1);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_H";
           return time;
         case "01_D": //7天
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-7);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_D";
           return time;
         case "02_D": //30天
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-30);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_D";
           return time;
         case "03_D": //90天
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-90);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_D";
           return time;
         case "04_D": //本月
            var m =util.curMFLD(now);
            time.s = fish.dateutil.format(m.f, 'yyyy-mm-dd')+" 00:00:00 ";
            time.e = fish.dateutil.format(m.l, 'yyyy-mm-dd')+" 00:00:00 ";
            time.g ="_D";
            return time;
         case "05_D": //上月
           var upNow =fish.dateutil.addMonths(now,-1);
           var m =util.curMFLD(upNow);
           time.s = fish.dateutil.format(m.f, 'yyyy-mm-dd')+" 00:00:00 ";
           time.e = fish.dateutil.format(m.l, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_D";
           return time;
         case "01_W": //本月
           var m =util.curMFLD(now);
           time.s = fish.dateutil.format(m.f, 'yyyy-mm-dd')+" 00:00:00 ";
           time.e = fish.dateutil.format(m.l, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_W";
           return time;
         case "02_W": //上月
           var upNow =fish.dateutil.addMonths(now,-1);
           var m =util.curMFLD(upNow);
           time.s = fish.dateutil.format(m.f, 'yyyy-mm-dd')+" 00:00:00 ";
           time.e = fish.dateutil.format(m.l, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_W";
           return time;
         case "03_W": //6周
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-(6*7));
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_W";
           return time;
         case "04_W": //12周
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addDays(now,-(12*7));
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_W";
           return time;
         case "01_M": //最近6个月
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addMonths(now,-6);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_M";
           return time;
         case  "02_M": //最近12个月
           time.e =fish.dateutil.format(now, 'yyyy-mm-dd')+" 00:00:00 ";
           var startDate=fish.dateutil.addMonths(now,-12);
           time.s = fish.dateutil.format(startDate, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_M";
           return time;
         case  "03_M": //今年
           var y =util.curYFLD(now);
           time.s = fish.dateutil.format(y.f, 'yyyy-mm-dd')+" 00:00:00 ";
           time.e = fish.dateutil.format(y.l, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_M";
           return time;
         case  "04_M": //去年
           var upNow =fish.dateutil.addMonths(now,-12);
           var y =util.curYFLD(upNow);
           time.s = fish.dateutil.format(y.f, 'yyyy-mm-dd')+" 00:00:00 ";
           time.e = fish.dateutil.format(y.l, 'yyyy-mm-dd')+" 00:00:00 ";
           time.g ="_M";
           return time;
         default:
           return null

       }
    },
    getGranus: function(GRANU_MODE, timeParams) {
      var timeMap = {
        '_15': "15分钟",
        '_H': "小时",
        '_D': "天",
        '_W': "周",
        '_M': "月"
      }
      var result = fish.map(GRANU_MODE, function(d) {
        var tag = "TGRANU" + d.GRANU
        var items = fish.filter(timeParams, function(d) {
          return d.ID == tag
        })
        return {
          "granu": d.GRANU,
          "items": items,
          "title": timeMap[d.GRANU]
        }

      })
      console.log("getGranus", result);
      return result;
    },
    getTimeName: function(timeParams, timePage) {
      console.log("getTimeName", timeParams, timePage);
      var tag = "TGRANU" + timePage.granus;
      var value = "" + timePage.timeRange;
      var filterData = fish.filter(timeParams, function(d) {
        return (d.ID == tag && d.VALUE == value)
      })
      if (filterData.length > 0) {
        return filterData[0].NAME;
      }
      return "";
    },
    makeLine: function(series, config) {
      console.log("makeLine makeLine", config);
      var showPageConfig = config.showPage || {};
      if (!showPageConfig.markLines)
        return series;
      if (showPageConfig.markLines.length <= 0)
        return series;
      var markGroup = fish.partition(showPageConfig.markLines, function(d) {
        return d.type == 1;
      })

      //固定值
      var serie = series[0];
      if (serie) {
        var datas = [];
        fish.each(markGroup[0], function(d) {
          var value = Number(d.topTextBox);
          if (fish.isNumber(value)) {
            if ("" + config.gtype == "5") {
              datas.push({
                name: '',
                xAxis: value,
                itemStyle: {
                  normal: {
                    color: d.color || 'red'
                  }
                }
              })
            } else {

              datas.push({
                name: '',
                yAxis: value,
                itemStyle: {
                  normal: {
                    color: d.color || 'red'
                  }
                }
              })

            }

          }
        });
        if (datas.length > 0) {
          serie.markLine = {
            symbol: [
              null, null
            ],
            data: datas
          }
        }
      }
      //计算值
      // 找到ALL指标的

      var allSeries = [];
      fish.filter(series, function(d) {
        allSeries.push(d);
      })

      fish.each(allSeries, function(s) {
        var config = s.mydata
        var markLines = fish.filter(markGroup[1], function(d) {
          return s.value == d.value;
        })
        var datas = [];
        fish.each(markLines, function(d) {

          var type2 = d.topType;
          if (type2 == 'avg')
            type2 = 'average';
          datas.push({
            name: '',
            type: type2,
            itemStyle: {
              normal: {
                color: d.color || 'red'
              }
            }
          })
        })
        if (datas.length > 0) {
          if (s.markLine) {
            s.markLine.data.concat(datas)
          } else {
            s.markLine = {
              symbol: [
                null, null
              ],
              data: datas
            }
          }

        }
      })

      // fish.each(markGroup[1],function(d){
      //    console.log("sdjjfksdhjfhsdj",d);
      //
      // })

      //
      // fish.each(series[0],function(s){
      //     s.markLine=markLineConfig;
      // })
      console.log("makeLine", allSeries, config, markGroup);
      return series
    },
    getAxisLabel: function(config) {
      var propConfig = config.propPage || {};
      var i = Number(propConfig.i) || 0;
      var h = Number(propConfig.h) || 0;
      var r = Number(propConfig.r) || 0;
      if (!fish.isNumber(i)) {
        i = null;
      }
      if (!fish.isNumber(h)) {
        h = null;
      }
      if (h == 0) {
        h = null;
      }
      if (!fish.isNumber(r)) {
        r = 0;
      }
      var result = {};
      result.i = i;
      result.h = h;
      result.r = r;
      return result;
    },
    getPropPage: function(c) {
      var config = c || {};
      var result = {};
      var showscale = config.showscale || 'c';
      var showlable = config.showlable || 'o';
      if (showscale == 'c') {
        result.dataZoom = null;
      } else {
        result.dataZoom = [
          {
            show: true
          }
        ];
      }
      result.showlable = showlable;
      return result;
    },
    getLegned: function(c) {
      var config = c || {};
      var result = {};
      result.orient = "horizontal"; //vertical ,horizontal
      result.x = "center";
      result.y = "top";
      result.open = true;
      var lengedFlag = config.lengedFlag || 'o';
      var dir = config.direction || 'T';
      if (lengedFlag == 'c') {
        result.open = false;
      } else {
        if (dir == 'L') {
          result.orient = "vertical"
          result.x = "left";
          result.y = "top";
        }
        if (dir == 'R') {
          result.orient = "vertical"
          result.x = "right";
          result.y = "top";
        }
        if (dir == 'T') {
          result.x = "center";
          result.y = "top";
        }
        if (dir == 'B') {
          result.x = "center";
          result.y = "bottom";
        }

      }
      console.log("result result ", result);
      return result;
    },
    timetrans: function(tt) {
      var date = new Date(tt); //php time为10位需要乘1000
      var Y = '';
      var M = (
        date.getMonth() + 1 < 10
        ? '0' + (
        date.getMonth() + 1)
        : date.getMonth() + 1) + '/';
      var D = (
        date.getDate() < 10
        ? '0' + (
        date.getDate())
        : date.getDate()) + ' ';
      var h = (
        date.getHours() < 10
        ? '0' + date.getHours()
        : date.getHours()) + ':';
      var m = (
        date.getMinutes() < 10
        ? '0' + date.getMinutes()
        : date.getMinutes()) + ':';
      var s = (
        date.getSeconds() < 10
        ? '0' + date.getSeconds()
        : date.getSeconds());
      return M + D + h + m + s;
    },
    resizeH: function(el) {
      var docH = $(document).height();
      var tableH = (docH - 48 - 15 - 70);
      el.slimscroll({'height': tableH, width: "100%"});
    },
    combobox: function(el, dataSource) {
      return el.combobox({editable: false, dataTextField: 'name', dataValueField: 'value', dataSource: dataSource});
    },
    doNotNull: function(obj, arg) {
      if (obj) {
        return obj(arg);
      }
      return null;
    },
    kdoinputStyle: function(el) {
      el.off('click').on('click', function() {
        $(this).find(".textInput").focus();
      })
    },
    titlePos: function(value) {
      switch (value) {
        case "L":
          return "left"
        case "R":
          return "right"
        case "C":
          return "center"
        default:
          return "left"
      }
    }
  };
  return util;
})
