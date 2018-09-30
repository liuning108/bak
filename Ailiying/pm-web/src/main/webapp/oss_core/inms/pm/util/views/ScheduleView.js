define([
        "text!oss_core/inms/pm/util/templates/scheduleView.html",
        'oss_core/inms/pm/util/views/Util',
    ],
    function(viewTpl, pmUtil) {
        return portal.BaseView.extend({
            //加载模板
            template: fish.compile(viewTpl),
            i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon),
            initialize: function() {},
            MethodMapping: {
                '0': 'once',
                '1': 'minute',
                '2': 'hour',
                '3': 'day',
                '4': 'week',
                '5': 'month',
                '6': 'custom'
            },
            tabs:[0,1,2,3,4,5],
            model: {
                'RUNTIME_SETING_FLAG': false,
                'TRIGGER_DATE': "",
                'TRIGGER_TIME': "",
                'EFF_EXP_FLAG': false,
                'EFF_DATE': "",
                'EXP_DATE': "",
                'INTERVAL_PERIOD': "",
                'SCHDULE_TYPE': "",
                'CRON': '',
                'MW': []
            },
            render: function() {
                this.$el.html(this.template(this.i18nData));
                return this;
            },

            afterRender: function(option) {
                var self = this;
                var defult_option = {
                    'datefromt': 'yyyy/mm/dd',
                    'visible': {'type':'show','tabs':self.tabs},
                    'mode':'single',//模式{'single':单选,'multiple':多选}
                }

                self.setting = fish.extend({}, defult_option, option);

                var $tabs = $(".tabs-pill-schedule").tabs();
                $('.toggle-switch-tab').on('change', function() {

						if(self.setting.mode == 'single'){
							var operCheckbox = $(this);
	                		fish.forEach($('.toggle-switch-tab:checked'), function(checkbox) {
	                			if($(checkbox).attr('data-tab') != $(operCheckbox).attr('data-tab')){
		                			$(checkbox).attr('checked', false);
		                			$(checkbox).prop('checked', false);
									$($(checkbox).data('tab')).hide();
		                        	$($(checkbox).data('row')).hide();
		                        	$($(checkbox).data('sub')).hide();
		                        }
							}.bind(this));
                		}

                        var flag = $(this).is(':checked');
                        var tab = $(this).data('tab');
                        var row = $(this).data('row');
                        var sub = $(this).data('sub')
                        if (flag) {
                            $(tab).show();
                            $(row).show();
                            $(sub).show();
                        } else {
                            $(row).hide();
                            $(tab).hide();
                            $(sub).hide();
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

                if (fish.isString(self.setting.visible.type) && fish.isArray(self.setting.visible.tabs) ){
                    var type=self.setting.visible.type.toLowerCase();
                    var others =fish.difference(self.tabs,self.setting.visible.tabs)
                    if(type=='show'){
                      self.setting.hideTabs=others;
                    }else{
                      self.setting.hideTabs=self.setting.visible.tabs
                    }
                    fish.each(self.setting.hideTabs,function(val){
                       $tabs.tabs("hideTab", val);
                    })
                }
                return self;
            },
            initTime: function(title) {
                var self = this;
                var $obj = {};
                var today = fish.dateutil.format(new Date(), 'yyyy-mm-dd');
                $obj.EFF_DATE = $("." + title + "-datetime-begin").datetimepicker({ viewType: 'date', 'format': self.setting.datefromt, 'startDate': today })
                $obj.EXP_DATE = $("." + title + "-datetime-end").datetimepicker({ viewType: 'date', 'format': self.setting.datefromt })
                $obj.EFF_EXP_VAIL = $("." + title + "-datetime-from").validator({}); //添加验证
                return $obj;
            },
            initOnce: function() {
                var self = this;
                self.$once = self.initTime("once");
                self.$once.index = 0;
                self.$once.EFF_EXP_FLAG = $('#once-checkbox-row');
                self.$once.RUNTIME_SETING_FLAG = $('#once-checkbox');
                var today = fish.dateutil.format(new Date(), 'yyyy-mm-dd');
                self.$once.TRIGGER_DATE = $('.once-setting-runtime').datetimepicker({ viewType: "date", todayBtn: true, 'format': self.setting.datefromt, 'startDate': today });
                self.$once.TRIGGER_TIME_M = $('#once-rigger_time_m');
                self.$once.TRIGGER_TIME_S = $('#once-rigger_time_s');
                self.$once.RUNTIME_SETING_VAIL = $(".once-setting-from").validator({});
            },
            initMinute: function() {
                var self = this;
                self.$minute = self.initTime("minute");
                self.$minute.index = 1;
                self.$minute.EFF_EXP_FLAG = $('#minute-checkbox-row');
                self.$minute.RUNTIME_SETING_FLAG = $('#minute-checkbox');
                self.$minute.TRIGGER_DATE = $('.minute-setting-runtime').datetimepicker({ buttonIcon: '', viewType: "date", todayBtn: true, 'format': self.setting.datefromt });
                self.$minute.TRIGGER_TIME_M = $('#minute-rigger_time_m');
                self.$minute.TRIGGER_TIME_S = $('#minute-rigger_time_s');
                self.$minute.RUNTIME_SETING_VAIL = $(".minute-setting-from").validator({});
                self.$minute.INTERVAL_PERIOD = $('.minute-select');
                self.$minute.setMW = function(array) {
                    if (!fish.isArray(array)) return;
                    if (array.length <= 0) return;
                    self.$minute.INTERVAL_PERIOD.empty();
                    fish.each(array, function(value) {
                        var domStr = "<option value=" + value + ">" + value + "</option>"
                        self.$minute.INTERVAL_PERIOD.append(domStr);
                    })
                    self.$minute.INTERVAL_PERIOD.prop('selectedIndex', 0);
                }
            },
            initHour: function() {
                var self = this;
                self.$hour = self.initTime("hour");
                self.$hour.index = 2;
                self.$hour.EFF_EXP_FLAG = $('#hour-checkbox-row');
                self.$hour.RUNTIME_SETING_FLAG = $('#hour-checkbox');
                self.$hour.TRIGGER_DATE = $('.hour-setting-runtime').datetimepicker({ viewType: "date", todayBtn: true, 'format': self.setting.datefromt });
                self.$hour.TRIGGER_TIME_M = $('#hour-rigger_time_m');
                self.$hour.TRIGGER_TIME_S = $('#hour-rigger_time_s');
                self.$hour.RUNTIME_SETING_VAIL = $(".hour-setting-from").validator({});
                self.$hour.INTERVAL_PERIOD = $(".hour-select");

                self.$hour.setMW = function(array) {

                    if (!fish.isArray(array)) return;
                    if (array.length <= 0) return;
                    self.$hour.INTERVAL_PERIOD.empty();
                    fish.each(array, function(value) {
                        var domStr = "<option value=" + value + ">" + value + "</option>"
                        self.$hour.INTERVAL_PERIOD.append(domStr);
                    })
                    self.$hour.INTERVAL_PERIOD.prop('selectedIndex', 0);
                }
            },
            initDay: function() {
                var self = this;
                self.$day = self.initTime("day");
                self.$day.index = 3;
                self.$day.EFF_EXP_FLAG = $('#day-checkbox-row');
                self.$day.RUNTIME_SETING_FLAG = $('#day-checkbox');
                self.$day.TRIGGER_DATE = $('.day-setting-runtime').datetimepicker({ todayBtn: true, 'format': self.setting.datefromt });
                self.$day.TRIGGER_TIME_M = $('#day-rigger_time_m');
                self.$day.TRIGGER_TIME_S = $('#day-rigger_time_s');
                self.$day.RUNTIME_SETING_VAIL = $(".day-setting-from").validator({});
                self.$day.INTERVAL_PERIOD = $(".day-select");
                self.$day.setMW = function(array) {
                    if (!fish.isArray(array)) return;
                    if (array.length <= 0) return;
                    self.$day.INTERVAL_PERIOD.empty();
                    fish.each(array, function(value) {
                        var domStr = "<option value=" + value + ">" + value + "</option>"
                        self.$day.INTERVAL_PERIOD.append(domStr);
                    })

                }

            },
            initWeek: function() {

                var self = this;
                self.$week = self.initTime("week");
                self.$week.index = 4;
                self.$week.EFF_EXP_FLAG = $('#week-checkbox-row');
                self.$week.RUNTIME_SETING_FLAG = $('#week-checkbox');
                self.$week.TRIGGER_TIME_M = $('#week-rigger_time_m');
                self.$week.TRIGGER_TIME_S = $('#week-rigger_time_s');
                self.$week.RUNTIME_SETING_VAIL = $(".week-setting-from").validator({});
                self.$week.week_value = function() {
                    var mw = "";
                    for (var i = 1; i <= 7; i++) {
                        var $input = $('.week-checkbox-input-' + i);
                        if ($input.is(':checked')) {
                            if(mw){
                        		mw += ","+$input.val();
                        	}else{
                        		mw = $input.val();
                        	}
                        }
                    }
                    return mw;
                }; //end of week_value;

                self.$week.setMW = function(mw) {
                	if(!mw) return ;
                	var array = mw.split(",");
                    $('.week-checkbox-all').attr('checked', false);
                    $('.week-checkbox-all').prop('checked', false);
                    for (var i = 0; i < array.length; i++) {
                        var item = array[i];
                        var $input = $('.week-checkbox-input-' + item);
                        $input.attr('checked', true);
                        $input.prop('checked', true);
                    }
                }

            },
            initCustom: function() {
                var self = this;
                self.$custom = self.initTime("custom");
                self.$custom.index = 6;
                self.$custom.EFF_EXP_FLAG = $('#custom-checkbox-row');
                self.$custom.RUNTIME_SETING_FLAG = $('#custom-checkbox');
                self.$custom.RUNTIME_SETING_VAIL = $(".custom-setting-from").validator({});
                self.$custom.CRON = $('#custom-cron');
            },
            initMonth: function() {
                var self = this;
                self.$month = self.initTime("month");
                self.$month.index = 5;
                self.$month.EFF_EXP_FLAG = $('#month-checkbox-row');
                self.$month.RUNTIME_SETING_FLAG = $('#month-checkbox');
                self.$month.TRIGGER_TIME_M = $('#month-rigger_time_m');
                self.$month.TRIGGER_TIME_S = $('#month-rigger_time_s');
                self.$month.RUNTIME_SETING_VAIL = $(".month-setting-from").validator({});
                self.$month.month_value = function() {
                    var mw = "";
                    for (var i = 1; i <= 12; i++) {
                        var $input = $('.month-checkbox-input-' + i);
                        if ($input.is(':checked')) {
                        	if(mw){
                        		mw += ","+$input.val();
                        	}else{
                        		mw = $input.val();
                        	}
                            //result.push($input.val());
                        }
                    }
                    return mw;
                }; //end of month_value

                self.$month.setMW = function(mw) {
                	if(!mw) return ;
                	var array = mw.split(",");
                    $('.month-checkbox-all').attr('checked', false);
                    $('.month-checkbox-all').prop('checked', false);
                    for (var i = 0; i < array.length; i++) {
                        var item = array[i];
                        var $input = $('.month-checkbox-input-' + item);
                        $input.attr('checked', true);
                        $input.prop('checked', true);
                    }
                }

                self.$month.INTERVAL_PERIOD = $('.month-select');
                //初始值
                self.$month.INTERVAL_PERIOD.empty();
                fish.each(fish.range(1, 32), function(n) {
                    var child = $('<option value=' + n + '>' + n + '</option>')
                    self.$month.INTERVAL_PERIOD.append(child);
                })
                var Lchild = $("<option value='-1'>L</option>");
                self.$month.INTERVAL_PERIOD.append(Lchild);


            },
            getAll: function() {
                var self = this;
                var result = {};
                result.once = self.getOnce();
                result.minute = self.getMinute();
                result.hour = self.getHour();
                result.day = self.getDay();
                result.week = self.getWeek();
                result.month = self.getMonth();
                result.custom = self.getCustom();
                return result;
            },
            getOnce: function() {
                var self = this;
                var $obj = self.$once;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '0'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'once';
                model.EFF_DATE = ""; //生效时间;
                model.EXP_DATE = "" //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE = $obj.TRIGGER_DATE.datetimepicker("value"); //触发日期;
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间
                if (model.RUNTIME_SETING_FLAG) {
                    model.RUNTIME_SETING_VAIL = $obj.RUNTIME_SETING_VAIL.isValid()
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }


                model.INTERVAL_PERIOD = ''; //间隔时长
                model.CRON = ''; //CRON表达式
                model.MW = [];
                return model
            },
            getMinute: function() {
                var self = this;
                var $obj = self.$minute;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '1'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'minute';
                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;


                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE = ""//触发日期;
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间
                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }


                model.INTERVAL_PERIOD = $obj.INTERVAL_PERIOD.val(); //间隔时长
                model.CRON = ''; //CRON表达式
                model.MW = [];
                return model

            },
            getHour: function() {
                var self = this;
                var $obj = self.$hour;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '2'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'hour';

                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE = ""; //触发日期;
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间
                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }


                model.INTERVAL_PERIOD = $obj.INTERVAL_PERIOD.val(); //间隔时长
                model.CRON = ''; //CRON表达式
                model.MW = [];
                return model
            },
            getDay: function() {
                var self = this;
                var $obj = self.$day;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '3'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'day';
                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_DATE =""; //触发日期;
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间

                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }


                model.INTERVAL_PERIOD = $obj.INTERVAL_PERIOD.val(); //间隔时长
                model.CRON = ''; //CRON表达式
                model.MW = [];
                return model

            },
            getWeek: function() {
                var self = this;
                var $obj = self.$week;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '4'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'week';
                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间

                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }

                model.MW = $obj.week_value();

                model.INTERVAL_PERIOD = $obj.week_value(); //间隔时长
                model.CRON = ''; //CRON表达式

                return model

            },
            getMonth: function() {
                var self = this;
                var $obj = self.$month;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '5'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'month';
                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME = $obj.TRIGGER_TIME_M.val() + ":" + $obj.TRIGGER_TIME_S.val(); //触发时间

                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }
                model.MW = $obj.month_value();

                model.INTERVAL_PERIOD = $obj.INTERVAL_PERIOD.val(); //间隔时长
                model.CRON = ''; //CRON表达式

                return model
            },
            getCustom: function() {
                var self = this;
                var $obj = self.$custom;
                var model = {};
                model.tabindex = $obj.index;
                model.SCHDULE_TYPE = ''; //调度类型
                model.CYCLE_SCHDULE_TYPE = '6'; //CYCLE_SCHDULE_TYPE
                model.NAME = 'custom';
                model.EFF_DATE = $obj.EFF_DATE.datetimepicker("value"); //生效时间;
                model.EXP_DATE = $obj.EXP_DATE.datetimepicker("value"); //失效时间;

                model.RUNTIME_SETING_FLAG = $obj.RUNTIME_SETING_FLAG.is(':checked'); //启用标志
                model.TRIGGER_TIME = ''; //触发时间

                if (model.RUNTIME_SETING_FLAG) {
                    if ($obj.RUNTIME_SETING_VAIL.isValid() && $obj.EFF_EXP_VAIL.isValid()) {
                        model.RUNTIME_SETING_VAIL = true;
                    } else {
                        model.RUNTIME_SETING_VAIL = false;
                    }
                } else {
                    model.RUNTIME_SETING_VAIL = true
                }
                model.MW = ''
                model.INTERVAL_PERIOD = ''; //间隔时长
                model.CRON = $obj.CRON.val(); //CRON表达式

                return model

            },
            set: function(option, flag) {
                var self = this;
                if (!option.CYCLE_SCHDULE_TYPE) return;
                var key = "" + option.CYCLE_SCHDULE_TYPE;
                var methodName = self.MethodMapping[key];
                var method = 'set' + methodName.replace(/^(\w)(\w+)/, function(v, v1, v2) {
                    return v1.toUpperCase() + v2.toLowerCase()
                })
                if (self[method]) {
                    var setoption = fish.extend({}, self.model, option);
                    var $obj = self[method](setoption);
                    if(!$obj) return false;
                    if (flag) return $obj; //转来多个值，不立即显示。交给setALL方法
                    if (!setoption.RUNTIME_SETING_FLAG) return $obj; //没有设置
                    self.$el.find(".tabs-pill").tabs("showTab", $obj.index, true);
                    return $obj;
                }

            },
            setAll: function(array) {
                var self = this;
                if (!fish.isArray(array)) return;
                var $objs = fish.map(array, function(value) {
                    return self.set(value, true);
                });
                var runtime_arr=fish.filter($objs,function(obj){
                    return obj.RUNTIME_SETING_FLAG
                })

                if (runtime_arr.length>0){
                    var sort_arr=fish.sortBy(runtime_arr,'index')
                    var index=sort_arr[0].index
                    self.$el.find(".tabs-pill").tabs("showTab", index, true);
                }

            },
            setOnce: function(option) {
                var self = this;
                var $obj = self.$once;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                $obj.TRIGGER_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.EFF_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                return $obj;

            },
            setMinute: function(option) {
                var self = this;
                var $obj = self.$minute;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.EFF_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.setMW(option.MW);
                $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
                return $obj;
            },
            setHour: function(option) {
                var self = this;
                var $obj = self.$hour;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.setMW(option.MW);
                $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
                return $obj;
            },
            setDay: function(option) {
                var self = this;
                var $obj = self.$day;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                $obj.TRIGGER_DATE.datetimepicker("value", option.TRIGGER_DATE);
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.setMW(option.MW);
                $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD);
                return $obj;
            },
            setWeek: function(option) {
                var self = this;
                var $obj = self.$week;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.setMW(option.MW);
                return $obj;

            },
            setMonth: function(option) {
                var self = this;
                var $obj = self.$month;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                var array = ("" + option.TRIGGER_TIME).split(":");
                $obj.TRIGGER_TIME_M.val(array[0]);
                $obj.TRIGGER_TIME_S.val(array[1]);
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.INTERVAL_PERIOD.val(option.INTERVAL_PERIOD)
                $obj.setMW(option.MW);
                return $obj;
            },
            setCustom: function(option) {
                var self = this;
                var $obj = self.$custom;
                if (fish.contains(self.setting.hideTabs, $obj.index)) return; //如果设为隐藏窗口
                $obj.RUNTIME_SETING_FLAG.attr("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.prop("checked", option.RUNTIME_SETING_FLAG);
                $obj.RUNTIME_SETING_FLAG.trigger('change');
                $obj.EFF_EXP_FLAG.attr("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.prop("checked", option.EFF_EXP_FLAG);
                $obj.EFF_EXP_FLAG.trigger('change');
                $obj.EFF_DATE.datetimepicker('setStartDate', option.TRIGGER_DATE);
                $obj.EFF_DATE.datetimepicker("value", option.EFF_DATE);
                $obj.EXP_DATE.datetimepicker("value", option.EXP_DATE);
                $obj.CRON.val(option.CRON);
                return $obj;
            },
            getChecked: function() {
                var self = this;
                var all_result = self.getAll();
                var setting_result = fish.filter(all_result, function(value, key) {
                    if (value.RUNTIME_SETING_FLAG) {
                        return value;
                    }
                });
                if (setting_result.length <= 0) return setting_result; //没有设置时，为空，返回空数组
                var fail_result = fish.filter(setting_result, function(value) {
                        if (value.RUNTIME_SETING_VAIL == false) {
                            return value
                        }

                    })
                    //检查有问题的
                if (fail_result.length > 0) {
                    var sort_arr=fish.sortBy(fail_result, 'index');
                    var tabindex = sort_arr[0].tabindex;
                    self.$el.find(".tabs-pill").tabs("showTab", tabindex, true);
                    return false;
                }

                //全部通过
                return fish.sortBy(setting_result, 'index');




            }


        });
    });
