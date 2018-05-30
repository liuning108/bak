define(['i18n!oss_core/itnms/maintenance/i18n/maintenance'], function(
  i18nData,
) {
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
    process: function(timeperiods,sp) {
      return fish.map(timeperiods, function(d) {
        return util.schedule(d,sp)
      });
    },
    schedule: function(d,sp) {
      d.schedule = "";
      var ssp =sp|| {};


      if (d.timeperiod_type == "0") {
        d.schedule = util.timetrans(d.start_date);
      }
      if(d.timeperiod_type=='2'){
        console.log("schedulescheduleschedu2222le");
        console.log(ssp);
         var  p=ssp.daily||{};
        //daily
        var pattern=p.paraValue||"At {start_time} on every {every} days"
        //"在每隔 {every} 天的 {start_time} "
        pattern=pattern.replace(/{every}/g,d.every)
        var timeArray =util.secToTimeDay(d.start_time);
        var time =util.replenishZero(timeArray[1]+"",2)
             +":"+util.replenishZero(timeArray[2]+"",2);
      	pattern=pattern.replace(/{start_time}/g,time);
        d.schedule=pattern;
      }
      if(d.timeperiod_type=='3'){
        //weekly
          var  p=ssp.weekly||{};
          var pattern=p.paraValue||"At {start_time} on every {dayofweek} of every {every}    weeks"
          //"每隔 {every} 周的 {dayofweek} {start_time}"
             pattern=pattern.replace(/{every}/g,d.every)
             var timeArray =util.secToTimeDay(d.start_time);
             var time =util.replenishZero(timeArray[1]+"",2)
                  +":"+util.replenishZero(timeArray[2]+"",2);
              pattern=pattern.replace(/{start_time}/g,time)
              var binarry=util.replenish(d.dayofweek,7);
              pattern=pattern.replace(/{dayofweek}/g,util.binToWeek(binarry));
                d.schedule=pattern;
      }
      if(d.timeperiod_type=='4'){
        if(d.day!='0'){
          //monthly_day
           var  p=ssp.monthly_day||{};
          var pattern=p.paraValue||"At {start_time} on day {day} of every {month}";
             pattern=pattern.replace(/{day}/g,d.day)
           var timeArray =util.secToTimeDay(d.start_time);
           var time =util.replenishZero(timeArray[1]+"",2)
                +":"+util.replenishZero(timeArray[2]+"",2);
            pattern=pattern.replace(/{start_time}/g,time)
            var binarry=util.replenish(d.month,12);
            pattern=pattern.replace(/{month}/g,util.binToMonth(binarry));
          d.schedule=pattern;
        }else{
           var  p=ssp.monthly_week||{};
          var pattern=p.paraValue||"At {start_time} on {every} {dayofweek} of every {month}	";
          var timeArray =util.secToTimeDay(d.start_time);
          var time =util.replenishZero(timeArray[1]+"",2)
               +":"+util.replenishZero(timeArray[2]+"",2);
           pattern=pattern.replace(/{start_time}/g,time)
           var binarry=util.replenish(d.month,12);
           pattern=pattern.replace(/{month}/g,util.binToMonth(binarry));
           var binarry=util.replenish(d.dayofweek,7);
           pattern=pattern.replace(/{dayofweek}/g,util.binToWeek(binarry));
           pattern=pattern.replace(/{every}/g,util.everyToOrder(d.every));
           d.schedule=pattern
        }
      }
      return d
    },
    everyToOrder:function(every){
      var data=["","First","Second","Third","Fourth","Last"];
      return data[every];
    },
    binToMonth:function(binarry){
      var month =[
       i18nData.JANUARY,
       i18nData.FEBRUARY,
       i18nData.MARCH,
       i18nData.APRIL,
       i18nData.MAY,
       i18nData.JUNE,
       i18nData.JULY,
       i18nData.AUGUST,
       i18nData.SEPTEMBER,
       i18nData.OCTOBER,
       i18nData.NOVEMBER,
       i18nData.DECEMBER];
       var data =[];
       binarry =binarry.split("").reverse().join("")
       for (var i=0;i<binarry.length;i++){
         var v = binarry[i];
         if(v=='1'){
            data.push(month[i]);
         }
       }
       return data.join(',');
    },
    binToWeek:function(binarry){
      var week=[
         i18nData.MONDAY,
         i18nData.TUESDAY,
         i18nData.WEDNESDAY,
         i18nData.THURSDAY,
         i18nData.FRIDAY,
         i18nData.SATURDAY,
         i18nData.SUNDAY
       ];
      var data =[];
      binarry =binarry.split("").reverse().join("")
      for (var i=0;i<binarry.length;i++){
        var v = binarry[i];
        if(v=='1'){
           data.push(week[i]);
        }
      }
      return data.join(',');
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
      target=Number(target).toString(2);
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
    },
    replenishZero: function(target, len) {
      var tlen = target.length;
      var data = "";
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
