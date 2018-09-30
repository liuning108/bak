/**
 * 指标筛选弹出窗
 */
define([
      'text!oss_core/pm/util/templates/TestMgr.html',
      'oss_core/pm/util/views/Util',
      //"oss_core/pm/util/js/raphael-min"
    ],
    function(tpl,util) {
        return portal.BaseView.extend({ 
            //加载模板
            template: fish.compile(tpl),
            events:{
            'click .demo1':'demo1',
            'click .demo2':'demo2',
            'click .demo3':'demo3',
             },

            initialize: function() {

            },

            render: function() {
                this.$el.html(this.template());
                return this;
            },
            
            afterRender: function(data) {

                return this;
            },
            demo3:function(){
                require(['oss_core/pm/counter/views/CounterQry.js'],function(View){
                     var view = new View({kpiCode:'P______00001'});
                    $('.demo_content3').html(view.render().$el);
                    
                    view.doComplete();
                });
            },
            demo2:function(){
               var $tab=util.tab('#tabs-pill2',{});

              var flags =[false,false,false];
               $('#c1').click(function(){
                 flags[0]=!flags[0];
                 $tab.checked(0,flags[0]);
               })

               $('#c2').click(function(){
                  flags[1]=!flags[1];
                 $tab.checked(1,flags[1]);
               })

               $('#c3').click(function(){
                 flags[2]=!flags[2];
                 $tab.checked(2,flags[2]);
               })

            },
             demo1:function(){
       require(['oss_core/pm/util/views/ScheduleView'],function(View){
                var view = new View();
                $('.demo_content').html(view.render().$el);
                 //设置日期
                view.afterRender({
                     'datefromt':'yyyy/mm/dd',
                     'visible': {'type':'show','tabs':[0,1,2,3]}
                     });
            
                $('#demo_get').on('click',function(){
                   console.log(view.getAll())
                })
                $('#getChecked').on('click',function(){
                  view.getChecked();
                })


                $('#demo_set_once').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'0',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "",
                    'SCHDULE_TYPE': "",
                    'CRON':''
                   })
                })

                $('#demo_set_minute').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'1',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "30",
                    'SCHDULE_TYPE': "",
                    'CRON':'',
                    'WM':[15,30,35]
                   })
                })

                 $('#demo_set_hour').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'2',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "1",
                    'SCHDULE_TYPE': "",
                    'CRON':'',
                    'WM':[1,2,3]
                   })
                })

                $('#demo_set_day').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'3',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE':   "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "1",
                    'SCHDULE_TYPE': "",
                    'CRON':'',
                    'WM':[]
                   })
                })

                $('#demo_set_week').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'4',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "4",
                    'SCHDULE_TYPE': "",
                    'CRON':'',
                    'WM':[1,2,3]
                   })
                })

                $('#demo_set_month').on('click',function(){
                   view.set({
                    'CYCLE_SCHDULE_TYPE':'5',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "L",
                    'SCHDULE_TYPE': "",
                    'CRON':'',
                    'WM':[3,4,5,6]
                   })
                })

                $('#demo_set_custom').on('click',function(){
                   view.set({
                   'CYCLE_SCHDULE_TYPE':'6',
                    'RUNTIME_SETING_FLAG':true,
                    'TRIGGER_DATE': "2017-04-25",
                    'TRIGGER_TIME': "23:23",
                    'EFF_EXP_FLAG':true,
                    'EFF_DATE': "2017-04-24",
                    'EXP_DATE': "2017-04-25",
                    'INTERVAL_PERIOD': "L",
                    'SCHDULE_TYPE': "",
                    'CRON':'fjsdhfhkshffkshk',
                    'WM':[3,4,5,6]
                   })
                })

                $('#demo_setall').on('click',function(){

                    var array=[
                        {
                        'CYCLE_SCHDULE_TYPE':'4',
                        'RUNTIME_SETING_FLAG':true,
                        'TRIGGER_DATE': "2017-04-25",
                        'TRIGGER_TIME': "23:23",
                        'EFF_EXP_FLAG':true,
                        'EFF_DATE': "2017-04-24",
                        'EXP_DATE': "2017-04-25",
                        'INTERVAL_PERIOD': "4",
                        'SCHDULE_TYPE': "",
                        'CRON':'',
                        'WM':[1,2,3]
                       },
                           {
                        'CYCLE_SCHDULE_TYPE':'3',
                        'RUNTIME_SETING_FLAG':true,
                        'TRIGGER_DATE': "2017-04-25",
                        'TRIGGER_TIME': "23:23",
                        'EFF_EXP_FLAG':true,
                        'EFF_DATE':   "2017-04-24",
                        'EXP_DATE': "2017-04-25",
                        'INTERVAL_PERIOD': "1",
                        'SCHDULE_TYPE': "",
                        'CRON':'',
                        'WM':[]
                       }
                    ]
                    view.setAll(array)

                })

       })} //end of demo
          

       
        
        });
    });