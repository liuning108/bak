define([
  "text!oss_core/itnms/maintenance/components/views/PeriodsView.html",
  "oss_core/itnms/maintenance/components/views/NewTaskDialog",
],function(tpl,NewTaskDialog){
   var PeriodsInfoView  = function(option){
     this.option=option;
     this.$el =$(this.option.el);
     this.tpl=fish.compile(tpl);
   }
   PeriodsInfoView.prototype.render=function(){
     this.remove();
     this.$el.html(this.tpl())
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
        self.showNewTask();
      })
   }

   PeriodsInfoView.prototype.showNewTask =function() {
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
     var props={};
     newTaskDialog.popup(options,props, function(param) {
     });

   }
   PeriodsInfoView.prototype.initListGrid =function() {
     var mydata = [];
     var opt = {
       data: mydata,
       height: 240,
       multiselect: false,
       colModel: [
         {
           name: 'name',
           label: '周期类型',
           align: 'center'
         }, {
           name: 'maintenance_type',
           label: '计划',
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
             var value = cellval + "";
             if (value == "0") {
               return "with data collection"
             } else {
               return "without data collection"
             }
           }
         }, {
           name: 'active_since',
           label: '周期',
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
             return self.timetrans(Number(cellval));
           }
         },{
           name: 'active_since',
           label: '',
           align: 'center',
           formatter: function(cellval, opts, rwdat, _act) {
             return ""
           }
         }
       ]
     };
     this.$gird = this.$el.find('.periodsListGrid').grid(opt);
     this.$gird.grid("setGridWidth", this.option.tableW-40);//等比例设置宽度
   },
   PeriodsInfoView.prototype.getInfo=function(){
     return this.$el.find('.testInfo').val();
   }
   return PeriodsInfoView;
});
