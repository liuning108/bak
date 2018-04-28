define([], function() {
  var util = {
    secToTime: function(InSecond) {
      var years = 0;
      var Days = 0;
      var Hours = 0;
      var Minutes = 0;
      var Seconds = 0;
      if (InSecond >= 31556926) {
        years = parseInt(InSecond / 31556926);
        InSecond = (InSecond % 31556926);
      }
      if (InSecond >= 86400) {
        Days = parseInt(InSecond / 86400);
        InSecond = (InSecond % 86400);
      }
      if (InSecond >= 3600) {
        Hours = parseInt(InSecond / 3600);
        InSecond = (InSecond % 3600);
      }
      if (InSecond >= 60) {
        Minutes = parseInt(InSecond / 60);
        InSecond = (InSecond % 60);
      }
      Seconds = InSecond;
      if (years > 0) {
        if (Days > 0) {
          return years + " " + "y" + " " + Days + " " + "d";
        } else {
          return years + " " + "y";
        }
      } else if (Days > 0) {
        if (Hours > 0) {
          return Days + " " + "d" + " " + Hours + " " + "h";
        } else {
          return Days + " " + "d";
        }
      } else if (Hours > 0) {
        if (Minutes > 0) {
          return Hours + " " + "h" + " " + Minutes + " " + "m";
        } else {
          return Hours + " " + "h";
        }
      } else if (Minutes > 0) {
        return Minutes + " " + "m";
      } else {
        return "now";
      }
    },
    secToTimeDay: function(InSecond) {
      var years = 0;
      var Days = 0;
      var Hours = 0;
      var Minutes = 0;
      var Seconds = 0;

      if (InSecond >= 86400) {
        Days = parseInt(InSecond / 86400);
        InSecond = (InSecond % 86400);
      }
      if (InSecond >= 3600) {
        Hours = parseInt(InSecond / 3600);
        InSecond = (InSecond % 3600);
      }
      if (InSecond >= 60) {
        Minutes = parseInt(InSecond / 60);
        InSecond = (InSecond % 60);
      }
      Seconds = InSecond;
      if (Days > 0) {
        return [Days, Hours, Minutes];
      } else if (Hours > 0) {
        return [0, Hours, Minutes];
      } else if (Minutes > 0) {
        return [0, 0, Minutes];
      } else {
        return [0, 0, 0];
      }
    },
    process: function(timeperiods) {
      return fish.map(timeperiods, function(d) {
        return util.schedule(d)
      });
    },
    schedule: function(d) {
      d.schedule = "";
      if (d.timeperiod_type == "0") {
        d.schedule = util.timetrans(d.start_date);
      }
      return d
    },
    timetrans: function(tt) {
      var date = new Date(tt * 1000); //php time为10位需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (
        date.getMonth() + 1 < 10
        ? '0' + (
        date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
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
      return Y + M + D + h + m + s;
    },
    timeperiodTypeName: function(type) {
      if (type == "0") {
        return "one time only"
      } else if (type == "2") {
        return "daily"
      } else if (type == "3") {
        return "weekly"
      } else if (type == "4") {
        return "monthly"
      } else {
        return "error"
      }
    },
    getDate: function(value) {
      return new Date(Number(value) * 1000);
    },
    getTime: function(date) {
      return parseInt(date.getTime() / 1000);
    },
    getSecTime: function(d, h, m) {
      return Number(d) * 86400 + Number(h) * 3600 + Number(m) * 60;
    },
    replenish: function(target, len) {
      var tlen = target.length;
      var data = "";
      console.log(tlen < len)
      if (tlen < len) {
        for (var i = 0; i < len - tlen; i++) {
          data = "0" + data;
        }
        data += target
      } else {
        data = target;
      }
      return data;
    }
  }
  return util;
})
