define([
  'i18n!oss_core/itnms/maintenance/i18n/maintenance',
  "text!oss_core/itnms/maintenance/components/views/PeriodsView.html",
  "text!oss_core/itnms/maintenance/components/views/periodsOp.html",
  "oss_core/itnms/maintenance/components/views/NewTaskDialog",
  "oss_core/itnms/maintenance/actions/Util.js"
],function(i18nData,tpl,periodsOpTpl,NewTaskDialog,Util){
   var PeriodsInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);
     this.periodsOp=fish.compile(periodsOpTpl);
   }
   PeriodsInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl(i18nData))
     this.afterRender();
   }
   PeriodsInfoView.prototype.remove=function(){
    this.$el.html("");
   }
   PeriodsInfoView.prototype.afterRender=function(){
        var self =this;
        self.initListGrid()
        self.initEvent();
   }
   PeriodsInfoView.prototype.initEvent=function(){
      var self =this;
      this.$el.find('.newPeriodsTask').off('click').on('click',function() {
        self.showTask({
          "day":"0",
          "dayofweek":"0",
          "every" : "1",
          "month":"0",
          "period":"3600",
          "start_date":(new Date()).getTime()/1000,
          "start_time":"43200",
          "timeperiod_type":"0",
          "timeperiodid":null
        },function(param){
           self.$gird.grid("addRowData", param);
        });
      })
   }
   PeriodsInfoView.prototype.showTask =function(periodObj,callback) {
     var $el =this.option.positionEL;
     var options = {
       height: $el.height(),
       width: $el.width(),
       modal: false,
       draggable: false,
       autoResizable: false,
       position: {
         'of': $el,
         'my': "top",
         'at': "right" + " " + "top",
         collision: "fit"
       }
     };
     var newTaskDialog = new NewTaskDialog();
     var props={
       sp:this.option.sp
     };
     props.periodObj=periodObj;
     newTaskDialog.popup(options,props, function(param) {
       if(callback){
         callback(param);
       }
     });

   }
   PeriodsInfoView.prototype.initListGrid =function() {
     var self =this;
     var mydata = Util.process(this.option.timeperiods,this.option.sp);
     console.log(mydata);
     var opt = {
       data: mydata,
       height: 240,
       multiselect: false,
       colModel: [
         {
           name: 'timeperiod_type',
           label: i18nData.PERIOD_TYPE,
           align: 'center',
           formatter:function(cellval, opts, rwdat, _act){
             return Util.timeperiodTypeName(cellval);
           },
         }, {
           name: 'schedule',
           label: i18nData.SCHEDULE,
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
            return cellval
           }
         }, {
           name: 'period',
           label: i18nData.PERIOD,
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
             return Util.secToTime(cellval);
           }
         },{
           name: 'timeperiodid',
           label: '',
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
             return self.periodsOp({id:cellval});
           }
         }
       ]
     };
     this.$gird = this.$el.find('.periodsListGrid').grid(opt);
     this.$gird.on('click', '.removePeriods', function() {
       var selrow = self.$gird.grid("getSelection");
       var id = selrow.timeperiodid;
       self.$gird.grid("delRowData", selrow);
     });

     this.$gird.on('click', '.updatePeriods', function() {
       var selrow = self.$gird.grid("getSelection");
       self.showTask(selrow,function(param){
         console.log("updatePeriodsupdatePeriodsupdatePeriodsupdatePeriods22");
         console.log(param);
         self.$gird.grid("setRowData", param);
       });
     });

     this.$gird.grid("setGridWidth", this.option.tableW-40);//等比例设置宽度

   },
   PeriodsInfoView.prototype.getInfo=function(){
     return fish.map(this.$gird.grid("getRowData"),function(d){
         return {
           "day":d.day,
           "dayofweek":d.dayofweek,
           "every" : d.every,
           "month":d.month,
           "period":d.period,
           "start_date":d.start_date,
           "start_time":d.start_time,
           "timeperiod_type":d.timeperiod_type,
           "timeperiodid":d.timeperiodid
         }
     })
   }
   return PeriodsInfoView;
});
