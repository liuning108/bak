define([
  "oss_core/pm/dashboard/js/DCanvas",
], function(DCanvas) {
  var Dcharts = {};
  Dcharts.version = 1.0;
  Dcharts.init = function(option) {
    return new DCanvas(option);
  }

  return Dcharts;
});
