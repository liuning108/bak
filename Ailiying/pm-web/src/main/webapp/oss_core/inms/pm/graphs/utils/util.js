define([], function() {
  var util = {
    makeLine: function(series, config) {
      console.log("makeLine makeLine",config);
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
            if(""+config.gtype=="5"){
              datas.push({
                name: '',
                xAxis: value,
                itemStyle: {
                  normal: {
                    color: d.color || 'red'
                  }
                }
              })
            }else{

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
        var markLines=fish.filter(markGroup[1],function(d){
             return s.value==d.value;
        })
        var datas = [];
        fish.each(markLines,function(d){

          var type2 =d.topType;
          if(type2=='avg')type2='average';
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
          if(s.markLine){
             s.markLine.data.concat(datas)
          }else{
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
