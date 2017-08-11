
define([
      "text!oss_core/pm/public/templates/scheduleComponentView.html",
      "css!oss_core/pm/public/assets/css/scheduleComponentView.css"
    ],
    function(viewTpl) {
        return portal.CommonView.extend({ 
            //加载模板
            template: fish.compile(viewTpl),
          
            initialize: function() {
            },

            render: function() {
                this.$el.html(this.template());
                return this;
            },
            
            afterRender: function(data){
                var self=this;
                $(".tabs-pill").tabs();
                $('.toggle-switch-tab').on('change',function(){
                    var flag = $(this).is(':checked');
                    var tab = $(this).data('tab');
                    var row= $(this).data('row');
                    if (flag){
                        $(tab).addClass("li-checked")
                        $(row).show();
                    }else{
                        $(tab).removeClass("li-checked")
                         $(row).hide();
                    }
                })
                
                $('.toggle-switch-row').on('change',function(){
                    var flag = $(this).is(':checked');
                    var row = $(this).data('tab');
                    if (flag){
                      $(row).show();
                    }else{
                      $(row).hide();
                        
                    }
                })

               //初始化
                self.initOnce();
                self.initMinute();
                self.initHour();
                self.initDay();
                self.initWeek();
                self.initMonth();
                self.initCustom();
                return self;
            },
            initTime:function(title){
                var $obj ={};
                $obj.EFF_DATE=$("."+title+"-datetime-begin").datetimepicker({buttonIcon: ''})
                $obj.EXP_DATE=$("."+title+"-datetime-end").datetimepicker({buttonIcon: ''})
                $obj.EFF_EXP_VAIL=$("."+title+"-datetime-from").validator({});//添加验证
                return $obj;
            },
            initOnce:function(){
                var self=this;
                self.$once=self.initTime("once");
                self.$once.EFF_EXP_FLAG=$('#once-checkbox-row');
                self.$once.RUNTIME_SETING_FLAG=$('#once-checkbox');
                self.$once.TRIGGER_DATE=$('.once-setting-runtime').datetimepicker({buttonIcon: '', viewType: "date",todayBtn: true});
                self.$once.TRIGGER_TIME_M=$('#once-rigger_time_m');
                self.$once.TRIGGER_TIME_S=$('#once-rigger_time_s');
                self.$once.RUNTIME_SETING_VAIL=$(".once-setting-from").validator({});  
            },
            initMinute:function(){
                var self=this;
                self.$minute=self.initTime("minute");
                self.$minute.EFF_EXP_FLAG=$('#minute-checkbox-row');
                self.$minute.RUNTIME_SETING_FLAG=$('#minute-checkbox');
                self.$minute.TRIGGER_DATE=$('.minute-setting-runtime').datetimepicker({buttonIcon: '', viewType: "date",todayBtn: true});
                self.$minute.TRIGGER_TIME_M=$('#minute-rigger_time_m');
                self.$minute.TRIGGER_TIME_S=$('#minute-rigger_time_s');
                self.$minute.RUNTIME_SETING_VAIL=$(".minute-setting-from").validator({});
                self.$minute.INTERVAL_PERIOD=$("#minute-interval");
            },
            initHour:function(){
                 var self=this;
                self.$hour=self.initTime("hour");
                self.$hour.EFF_EXP_FLAG=$('#hour-checkbox-row');
                self.$hour.RUNTIME_SETING_FLAG=$('#hour-checkbox');
                self.$hour.TRIGGER_DATE=$('.hour-setting-runtime').datetimepicker({buttonIcon: '', viewType: "date",todayBtn: true});
                self.$hour.TRIGGER_TIME_M=$('#hour-rigger_time_m');
                self.$hour.TRIGGER_TIME_S=$('#hour-rigger_time_s');
                self.$hour.RUNTIME_SETING_VAIL=$(".hour-setting-from").validator({});
                self.$hour.INTERVAL_PERIOD=$("#hour-interval");
            },
            initDay:function(){
                 var self=this;
                 self.$day=self.initTime("day");
                 self.$day.EFF_EXP_FLAG=$('#day-checkbox-row');
                 self.$day.RUNTIME_SETING_FLAG=$('#day-checkbox');
                 self.$day.TRIGGER_DATE=$('.day-setting-runtime').datetimepicker({buttonIcon: '', viewType: "date",todayBtn: true});
                 self.$day.TRIGGER_TIME_M=$('#day-rigger_time_m');
                 self.$day.TRIGGER_TIME_S=$('#day-rigger_time_s');
                 self.$day.RUNTIME_SETING_VAIL=$(".day-setting-from").validator({});
                 self.$day.INTERVAL_PERIOD=$("#day-interval");
                 
            },
            initWeek:function(){

                 var self=this;
                self.$week=self.initTime("week");
                self.$week.EFF_EXP_FLAG=$('#week-checkbox-row');
                self.$week.RUNTIME_SETING_FLAG=$('#week-checkbox');
                self.$week.TRIGGER_TIME_M=$('#week-rigger_time_m');
                self.$week.TRIGGER_TIME_S=$('#week-rigger_time_s');
                self.$week.RUNTIME_SETING_VAIL=$(".week-setting-from").validator({});
                self.$week.week_value=function(){
                               result =[];
                               for(var i =1;i<=7;i++){
                                 var $input=$('.week-checkbox-input-'+i);
                                    if($input.is(':checked')){
                                        result.push($input.val());
                                    }
                                } 
                           return result;
                   };//end of week_value;
                   
                self.$week.setWM=function(array){
                   $('.week-checkbox-all').attr('checked',false);
                   $('.week-checkbox-all').prop('checked',false);   
                    for (var i=0;i<array.length;i++){
                        var item=array[i];
                        var $input=$('.week-checkbox-input-'+item);
                        $input.attr('checked',true);
                        $input.prop('checked',true);
                    }
                }

            },
            initCustom:function(){
                 var self=this;
                self.$custom=self.initTime("custom");
                self.$custom.EFF_EXP_FLAG=$('#custom-checkbox-row');
                self.$custom.RUNTIME_SETING_FLAG=$('#custom-checkbox');      
                self.$custom.RUNTIME_SETING_VAIL=$(".custom-setting-from").validator({});
                self.$custom.CRON=$('#custom-cron');
            },
            initMonth:function(){
                var self=this;
                self.$month=self.initTime("month");
                self.$month.EFF_EXP_FLAG=$('#month-checkbox-row');
                self.$month.RUNTIME_SETING_FLAG=$('#month-checkbox');
                self.$month.TRIGGER_TIME_M=$('#month-rigger_time_m');
                self.$month.TRIGGER_TIME_S=$('#month-rigger_time_s');
                self.$month.RUNTIME_SETING_VAIL=$(".month-setting-from").validator({});
                self.$month.month_value=function(){
                               result =[];
                               for(var i =1;i<=12;i++){
                                 var $input=$('.month-checkbox-input-'+i);
                                    if($input.is(':checked')){
                                        result.push($input.val());
                                    }
                                } 
                           return result;
                   };//end of week_value

                self.$month.setWM=function(array){
                   $('.month-checkbox-all').attr('checked',false);
                   $('.month-checkbox-all').prop('checked',false);   
                    for (var i=0;i<array.length;i++){
                        var item=array[i];
                        var $input=$('.month-checkbox-input-'+item);
                        $input.attr('checked',true);
                        $input.prop('checked',true);
                    }
                }

                self.$month.INTERVAL_PERIOD=$('.month-select');
                //初始值
                self.$month.INTERVAL_PERIOD.empty();
                fish.each(fish.range(1,32),function(n){
                    var child= $('<option value='+n+'>'+n+'</option>')
                    self.$month.INTERVAL_PERIOD.append(child);
                })
                var Lchild= $('<option value=L>L</option>');
                self.$month.INTERVAL_PERIOD.append(Lchild);

                  
            },
            getAll:function(){
                var self=this;
                var result={};
                result.once=self.getOnce();
                result.minute=self.getMinute();
                result.hour=self.getHour();
                result.day=self.getDay();
                result.week=self.getWeek(); 
                result.month=self.getMonth();
                result.custom=self.getCustom();
                return result;
            },
            getOnce:function(){
                var self=this;
                var $obj=self.$once;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='once';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                

                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE=$obj.TRIGGER_DATE.datetimepicker("value");//触发日期;
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }


                model.INTERVAL_PERIOD='';//间隔时长
                model.CRON='';//CRON表达式
                model.MW=[];
                return model
            },
           getMinute:function(){
                var self=this;
                var $obj=self.$minute;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='minute';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                

                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE=$obj.TRIGGER_DATE.datetimepicker("value");//触发日期;
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }
        

                model.INTERVAL_PERIOD=$obj.INTERVAL_PERIOD.val();//间隔时长
                model.CRON='';//CRON表达式
                model.MW=[];
                return model

           },
           getHour:function(){
            var self=this;
                var $obj=self.$hour;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='hour';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE=$obj.TRIGGER_DATE.datetimepicker("value");//触发日期;
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }


                model.INTERVAL_PERIOD=$obj.INTERVAL_PERIOD.val();//间隔时长
                model.CRON='';//CRON表达式
                model.MW=[];
                return model
           },
          getDay:function(){
                var self=this;
                var $obj=self.$day;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='day';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE=$obj.TRIGGER_DATE.datetimepicker("value");//触发日期;
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }


                model.INTERVAL_PERIOD=$obj.INTERVAL_PERIOD.val();//间隔时长
                model.CRON='';//CRON表达式
                model.MW=[];
                return model

          },
          getWeek:function(){
                var self=this;
                var $obj=self.$week;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='week';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }
                model.MW=$obj.week_value();

                model.INTERVAL_PERIOD='';//间隔时长
                model.CRON='';//CRON表达式
               
                return model

          },
          getMonth:function(){
                 var self=this;
                var $obj=self.$month;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='month';//CYCLE_SCHDULE_TYPE
    
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME=$obj.TRIGGER_TIME_M.val()+":"+$obj.TRIGGER_TIME_S.val();//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }
                model.MW=$obj.month_value();

                model.INTERVAL_PERIOD=$obj.INTERVAL_PERIOD.val();//间隔时长
                model.CRON='';//CRON表达式
               
                return model
          },
          getCustom:function(){
             var self=this;
                var $obj=self.$custom;
                var model={};
                model.SCHDULE_TYPE=''; //调度类型
                model.CYCLE_SCHDULE_TYPE='custom';//CYCLE_SCHDULE_TYPE
                model.EFF_EXP_FLAG=$obj.EFF_EXP_FLAG.is(':checked'); //生效范围的标志
                model.EFF_DATE=$obj.EFF_DATE.datetimepicker("value");//生效时间;
                model.EXP_DATE=$obj.EXP_DATE.datetimepicker("value");//失效时间;
                if(model.EFF_EXP_FLAG){
                    model.EFF_EXP_VAIL=$obj.EFF_EXP_VAIL.isValid();
                }else{
                    model.EFF_EXP_VAIL=true;
                }
                model.RUNTIME_SETING_FLAG=$obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME='';//触发时间
                if(model.RUNTIME_SETING_FLAG){
                  model.RUNTIME_SETING_VAIL=$obj.RUNTIME_SETING_VAIL.isValid();
                }else{
                  model.RUNTIME_SETING_VAIL=true
                }
                model.MW=''
                model.INTERVAL_PERIOD='';//间隔时长
                model.CRON=$obj.CRON.val();//CRON表达式
               
                return model

          },
          set:function(option){
            var self=this;
            if(!option.CYCLE_SCHDULE_TYPE)return;
            var method='set'+option.CYCLE_SCHDULE_TYPE.replace(/^(\w)(\w+)/, function (v,v1,v2){ return  v1.toUpperCase()+v2.toLowerCase( )} )
            if (self[method]){
                self[method](option)
            }
          },
          setOnce:function(option){
            var self=this;
            var $obj =self.$once;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            

          },
          setMinute:function(option){
            var self=this;
            var $obj =self.$minute;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
          },
          setHour:function(option){
            var self=this;
            var $obj =self.$hour;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
          },
          setDay:function(option){
            var self=this;
            var $obj =self.$day;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
          },
          setWeek:function(option){
            var self=this;
            var $obj =self.$week;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.setWM(option.WM);
            
          },
          setMonth:function(option){
            var self=this;
            var $obj =self.$month;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            var array=(""+option.TRIGGER_TIME).split(":");
            $obj.TRIGGER_TIME_M.val(array[0]);
            $obj.TRIGGER_TIME_S.val(array[1]);
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD)
            $obj.setWM(option.WM);
          },
          setCustom:function(option){
            var self=this;
            var $obj =self.$custom;
            $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
            $obj.RUNTIME_SETING_FLAG.trigger('change');
            $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
            $obj.EFF_EXP_FLAG.trigger('change');
            $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
            $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
            $obj.CRON.val(option.CRON);
          }


      });
    });