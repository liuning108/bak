define([], function() {
  var util = {
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
      if(h==0){
        h=null;
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
      var tableH = (docH - 48 - 35 - 70) * 0.92;
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
