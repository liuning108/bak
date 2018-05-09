define([
  'i18n!oss_core/itnms/maintenance/i18n/maintenance',
  "text!oss_core/itnms/maintenance/components/views/NewTaskDialog.html", "oss_core/itnms/maintenance/actions/Util.js"
], function(i18nData,tpl, Util) {
  var NewTaskDialog = function() {
    this.tpl = fish.compile(tpl);
    this.state = {
      data: [
        '.Step1', ".Step2", ".Step3"
      ],
      curIndex: 0
    }
  };
  NewTaskDialog.prototype.content = function() {
    this.$el = $(this.tpl(i18nData))
    return this.$el;
  }
  NewTaskDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.popOption = options;
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  NewTaskDialog.prototype.afterPopup = function() {
    var self = this;
    self.initPage();
    this.$el.find('.mainPageCancel').off("click").on('click', function() {
      self.$popup.hide();
    })
    this.$el.find('.mainPageOk').off("click").on('click', function() {
      var periodObj = self.getInfo();
      if (periodObj == null)
        return;
      self.callback(periodObj);
      self.$popup.hide();
    })
    self.processPeriodObj();
  }
  NewTaskDialog.prototype.getInfo = function() {
    var self = this;
    var type = self.periodsType.combobox("value");
    var period = self.getNewPeriodLength();
    if (period == 0)
      return null;
    var cPeriodObj = fish.clone(this.props.periodObj);
    cPeriodObj.period = period
    cPeriodObj.timeperiod_type = type;
    if (type == "0") {
      return self.getOneTimeOnlyInfo(cPeriodObj);
    }
    if (type == "2") {
      return self.getDailyInfo(cPeriodObj)
    }
    if(type=="3"){
      return self.getWeeklyInfo(cPeriodObj);
    }
    if(type=="4"){
      return self.getMonthlyInfo(cPeriodObj)
    }
    return null;
  }
  NewTaskDialog.prototype.getOneTimeOnlyInfo = function(cPeriodObj) {
    var start_date = Util.getTime(this.onetimeonlyDate.datetimepicker("getDate"))
    cPeriodObj.start_date = start_date;
    return Util.schedule(cPeriodObj,this.props.sp);
  },
  NewTaskDialog.prototype.getDailyInfo = function(cPeriodObj) {
    cPeriodObj.every = this.$el.find('.daliyEvery').val();
    var h = this.dailyH.combobox('value');
    var m = this.dailyM.combobox('value');
    cPeriodObj.start_date = "0";
    cPeriodObj.start_time = Util.getSecTime(0, h, m);
    return Util.schedule(cPeriodObj,this.props.sp);
  }
  NewTaskDialog.prototype.getWeeklyInfo=function(cPeriodObj) {
    cPeriodObj.every = this.$el.find('.weeklyEvery').val();
    var h = this.weeklyH.combobox('value');
    var m = this.weeklyM.combobox('value');
    cPeriodObj.start_date = "0";
    cPeriodObj.start_time = Util.getSecTime(0, h, m);
    cPeriodObj.dayofweek=this.getFlag('.week',7);
    return Util.schedule(cPeriodObj,this.props.sp);
  }
  NewTaskDialog.prototype.getNewPeriodLength = function() {
    var self = this;
    var d = self.$el.find('.periodDay').val();
    var h = self.mplH.combobox('value');
    var m = self.mplM.combobox('value');
    return Util.getSecTime(d, h, m);

  },
  NewTaskDialog.prototype.processPeriodObj = function() {
    var self = this;
    var periodObj = this.props.periodObj;
    self.periodsType.combobox("value", periodObj.timeperiod_type);
    var daysPeriod = Util.secToTimeDay(periodObj.period)
    self.$el.find('.periodDay').val(daysPeriod[0]);
    self.mplH.combobox("value", daysPeriod[1]);
    self.mplM.combobox("value", daysPeriod[2]);
    if (periodObj.timeperiod_type == '0') {
      self.loadOnetimeOnly(periodObj)
    }
    if (periodObj.timeperiod_type == '2') {
      self.loadDaily(periodObj)
    }
    if (periodObj.timeperiod_type == '3') {
      self.loadWeekly(periodObj)
    }
    if (periodObj.timeperiod_type == '4') {
      self.loadMonthly(periodObj)
    }
  }
  NewTaskDialog.prototype.loadMonthly=function(periodObj){
    var self =this;
    var binarry=Util.replenish(periodObj.month,12);
    self.setFalg('.month', 12, binarry);
    if(periodObj.day!=0){
      //day
      self.monthlyDayTypeAction("0");
      this.MonthlyDM.combobox('value',periodObj.day);
      var hourMin = Util.secToTimeDay(periodObj.start_time)
      this.monthlyH.combobox('value', hourMin[1]);
      this.monthlyM.combobox('value', hourMin[2]);
    }else{
      // dayofweek;
      self.monthlyDayTypeAction("1");
      var binarry=Util.replenish(periodObj.dayofweek,7);
      self.setFalg('.mweek', 7, binarry);
      this.dayofweekEvery.combobox("value", periodObj.every);
    }
  }
  NewTaskDialog.prototype.getMonthlyInfo=function(cPeriodObj) {
    var self =this;
    var binarry=self.getFlag('.month', 12, binarry);
    cPeriodObj.month=binarry;
    var typeFlag =self.$el.find('.monthly-dayType-active').data('value');
    cPeriodObj.start_date = "0";
    if(typeFlag=="0"){
      //day;
      cPeriodObj.dayofweek="0";
      cPeriodObj.day=this.MonthlyDM.combobox('value');
      var h = this.monthlyH.combobox('value');
      var m = this.monthlyM.combobox('value');
      cPeriodObj.start_time = Util.getSecTime(0, h, m);
    }else{
        cPeriodObj.day="0";
        cPeriodObj.every= this.dayofweekEvery.combobox("value");
        cPeriodObj.dayofweek=this.getFlag('.mweek',7);
    }
    return Util.schedule(cPeriodObj,this.props.sp);
  }
  NewTaskDialog.prototype.loadWeekly = function(periodObj) {
    var self =this;
    this.$el.find('.weeklyEvery').val(periodObj.every);
    var hourMin = Util.secToTimeDay(periodObj.start_time)
    this.weeklyH.combobox('value', hourMin[1]);
    this.weeklyM.combobox('value', hourMin[2]);
    var binarry=Util.replenish(periodObj.dayofweek,7);
    self.setFalg('.week', 7, binarry);
  }
  NewTaskDialog.prototype.setFalg = function(prefix, n, binarry) {
    binarry =binarry.split("").reverse().join("")
    for (var i = 1; i <= n; i++) {
      var selector = prefix + i
      var flag = binarry[i - 1];
      if (flag == '1') {
        this.$el.find(selector).attr('checked', "checked").prop("checked", true)
      } else {
        this.$el.find(selector).removeAttr('checked').prop("checked", false)
      }
    }
  }
  NewTaskDialog.prototype.getFlag = function(prefix, n) {
    var binarry="";
    for (var i = 1; i <= n; i++) {
      var selector = prefix + i
      if (this.$el.find(selector).is(":checked")) {
        binarry+="1";
      } else {
        binarry+="0";
      }
    }
    binarry =binarry.split("").reverse().join("")
    return parseInt(binarry, 2);
  }
  NewTaskDialog.prototype.loadDaily = function(periodObj) {
    this.$el.find('.daliyEvery').val(periodObj.every);
    var hourMin = Util.secToTimeDay(periodObj.start_time)
    this.dailyH.combobox('value', hourMin[1]);
    this.dailyM.combobox('value', hourMin[2]);
  }
  NewTaskDialog.prototype.loadOnetimeOnly = function(periodObj) {
    this.onetimeonlyDate.datetimepicker("value", Util.getDate(periodObj.start_date));
  }
  NewTaskDialog.prototype.initPage = function() {
    var self = this;
    this.periodsType = this.$el.find('.periodsType').combobox({
      dataTextField: 'name',
      dataValueField: 'value',
      editable: false,
      dataSource: [
        {
          name: 'One time only',
          value: "0"
        }, {
          name: 'Daily',
          value: "2"
        }, {
          name: 'Weekly',
          value: "3"
        }, {
          name: 'Monthly',
          value: "4"
        }
      ]
    });
    this.periodsType.combobox("value", "0");
    this.periodsType.on('combobox:change', function() {
      var value = self.periodsType.combobox("value");
      self.showTypePage(value);
    });
    this.showTypePage("0");
    var dataH = fish.map(fish.range(24), function(d) {
      return {'name': d, 'value': d}
    });
    var dataM = fish.map(fish.range(60), function(d) {
      return {'name': d, 'value': d}
    });
    var dataDayofMonth= fish.map(fish.range(30), function(d) {
      return {'name': d+1, 'value': d+1}
    });


    this.mplH = this.$el.find('.mpl_Hours').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.mplH.combobox("value", "1");

    this.mplM = this.$el.find('.mpl_Minutes').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.mplM.combobox("value", "0");

    this.dailyH = this.$el.find('.DailyH').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.dailyM = this.$el.find('.DailyM').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.dailyH.combobox("value", "12");
    this.dailyM.combobox("value", "0");

    this.weeklyH = this.$el.find('.weeklyH').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.weeklyM = this.$el.find('.weeklyM').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.weeklyH.combobox("value", "12");
    this.weeklyM.combobox("value", "0");

    this.MonthlyDM = this.$el.find('.monthly-day-month').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataDayofMonth});
    this.MonthlyDM.combobox("value", "1");

    this.monthlyH = this.$el.find('.monthlyH').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.monthlyM = this.$el.find('.monthlyM').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.monthlyM.combobox("value", "0");
    this.monthlyH.combobox("value", "12");

    var dfeData =[
      {'name':"first", value:'1'},
      {'name':"second", value:'2'},
      {'name':"third", value:'3'},
      {'name':"fourth", value:'4'},
      {'name':"last", value:'5'},
    ]
    this.dayofweekEvery = this.$el.find('.dayofweekEvery').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dfeData});
    this.dayofweekEvery.combobox("value", "1");
    self.oneTimeOnly();
    self.monthly();
  }
  NewTaskDialog.prototype.oneTimeOnly = function() {
    this.onetimeonlyDate = this.$el.find('.onetimeonlyDate').datetimepicker({"format": "yyyy-mm-dd hh:ii"});
  }
  NewTaskDialog.prototype.monthly = function() {
    var self = this;
    this.$el.find('.monthly_dayType').off('click').on('click', function() {
      var value = $(this).data('value');
      self.monthlyDayTypeAction(value);
    })
    self.monthlyDayTypeAction("0");
  }
  NewTaskDialog.prototype.monthlyDayTypeAction = function(value) {
    var self = this;
    self.$el.find('.monthly-dayType-active').removeClass("monthly-dayType-active");
    self.$el.find('.monthly_dayType' + value).addClass("monthly-dayType-active");
    self.$el.find('.MonthlyDateType').hide();
    self.$el.find('.MonthlyDateType' + value).show();
  }
  NewTaskDialog.prototype.showTypePage = function(value) {
    var self = this;
    self.$el.find('.mainTypPage').hide();
    self.$el.find('.type' + value).show();
  }
  return NewTaskDialog;
})
