define([
  "text!oss_core/itnms/maintenance/components/views/NewTaskDialog.html", "oss_core/itnms/maintenance/actions/Util.js"
], function(tpl, Util) {
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
    this.$el = $(this.tpl())
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
      var periodObj =self.getInfo();
      if(periodObj==null)return ;
       self.callback(periodObj);
       self.$popup.hide();
    })
    self.processPeriodObj();
  }
  NewTaskDialog.prototype.getInfo=function() {
      var self =this;
      var type = self.periodsType.combobox("value");
      var period = self.getNewPeriodLength();
      if(period==0) return null;
      var cPeriodObj= fish.clone(this.props.periodObj);
      cPeriodObj.period=period
      cPeriodObj.timeperiod_type=type;
      if(type=="0"){
        return self.getOneTimeOnlyInfo(cPeriodObj);
      }
      if(type=="2"){
        return self.getDailyInfo(cPeriodObj)
      }
      return null;
  }
  NewTaskDialog.prototype.getOneTimeOnlyInfo=function(cPeriodObj) {
     var start_date =Util.getTime(this.onetimeonlyDate.datetimepicker("getDate"))
     cPeriodObj.start_date=start_date;
     return Util.schedule(cPeriodObj);
  },
  NewTaskDialog.prototype.getDailyInfo=function(cPeriodObj){
    cPeriodObj.every = this.$el.find('.daliyEvery').val();
    var h =this.dailyH.combobox('value');
    var m=this.dailyM.combobox('value');
    cPeriodObj.start_date="0";
    cPeriodObj.start_time = Util.getSecTime(0,h,m);
    return Util.schedule(cPeriodObj);
  }
  NewTaskDialog.prototype.getNewPeriodLength=function() {
    var self =this;
    var d =self.$el.find('.periodDay').val();
    var h =self.mplH.combobox('value');
    var m =self.mplM.combobox('value');
    return Util.getSecTime(d,h,m);

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
    if(periodObj.timeperiod_type == '2'){
      self.loadDaily(periodObj)
    }
  }
  NewTaskDialog.prototype.loadDaily=function(periodObj){
     this.$el.find('.daliyEvery').val(periodObj.every);
     var hourMin =Util.secToTimeDay(periodObj.start_time)
     this.dailyH.combobox('value',hourMin[1]);
     this.dailyM.combobox('value',hourMin[2]);
  }
  NewTaskDialog.prototype.loadOnetimeOnly = function(periodObj) {
    this.onetimeonlyDate
        .datetimepicker("value", Util.getDate(periodObj.start_date));
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
    this.mplH = this.$el.find('.mpl_Hours').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.mplH.combobox("value", "1");

    this.mplM = this.$el.find('.mpl_Minutes').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.mplM.combobox("value", "0");

    this.dailyH=this.$el.find('.DailyH').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataH});
    this.dailyM=this.$el.find('.DailyM').combobox({dataTextField: 'name', dataValueField: 'value', editable: false, dataSource: dataM});
    this.dailyH.combobox("value", "0");
    this.dailyM.combobox("value", "0");

    self.oneTimeOnly();
    self.monthly();
  }
  NewTaskDialog.prototype.oneTimeOnly = function() {
    this.onetimeonlyDate = this.$el.find('.onetimeonlyDate')
                          .datetimepicker({"format":"yyyy-mm-dd hh:ii"});
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
    self.$el.find('.monthly-dayType-active')
            .removeClass("monthly-dayType-active");
    self.$el.find('.monthly_dayType' +value)
            .addClass("monthly-dayType-active");
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
