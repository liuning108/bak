define([
  "oss_core/pm/screendesigner/js/ZChartCanvas",
], function(ZChartCanvas) {
  var Zcharts = {};
  Zcharts.version = 1.0;
  Zcharts.init = function(option) {
    return new ZChartCanvas(option);
  }

  return Zcharts;
});
