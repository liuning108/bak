/**
 *
 */
define([
        'text!oss_core/pm/report/health/templates/TimeChooseWin.html',
        'frm/fish-desktop/third-party/sliderpips/fish.sliderpips',
        'css!frm/fish-desktop/third-party/sliderpips/sliderpips.css'
    ],
    function(ShareTopicCfgView, sliderpips) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}),
            //加载模板
            template: fish.compile(ShareTopicCfgView),

            events : {
                "click [name='ad-sharetopic-sharetype-chx']" : "changeShareType",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.dayList = ["1D", "3D", "5D", "7D", "14D", "30D"];
                this.hourList = ["1H", "6H", "12H", "24H", "36H", "48H", "72H"];
                this.leftPosition = inParam.leftPosition;
                this.topPosition = inParam.topPosition;
                if(inParam.granularity=="_H"){//true-小时 false-天
                    this.switchBtnState = true;
                    for(var i=0;i<this.hourList.length;i++){
                        if(inParam.granularityValue+"H" == this.hourList[i]){
                            this.slideValue = i;
                            break;
                        }
                    }
                }else{
                    this.switchBtnState = false;
                    for(var i=0;i<this.dayList.length;i++){
                        if(inParam.granularityValue+"D" == this.dayList[i]){
                            this.slideValue = i;
                            break;
                        }
                    }
                }
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                this.$el.css("left", this.leftPosition+"px");
                this.$el.css("top", this.topPosition+"px");
                this.$switch = this.$('.switch-btn').switchbutton();
                this.$switch.switchbutton('option','state',this.switchBtnState);
                if(this.switchBtnState){
                    self.switchToHourSlide();
                }else{
                    self.switchToDaySlide();
                }
                this.$switch.on("switchbutton:change", function(e,state){
                    //true-小时 false-天
                    self.switchBtnState = state;
                    if(state){
                        self.switchToHourSlide(this.slideValue);
                    }else{
                        self.switchToDaySlide(this.slideValue);
                    }
                });
                //
                var activeMonth = new Date().getMonth();
                this.$("#nhc-tc-dayslider")
                    .sliderpips({
                        min: 0,
                        max: this.dayList.length-1,
                        value: this.slideValue,
                        slide: function (e, ui) {
                            self.slideValue = ui.value;
                        }
                    })
                    .sliderpips("pips", {
                        rest: "label",
                        labels: this.dayList
                    });
                this.$("#nhc-tc-hourslider")
                    .sliderpips({
                        min: 0,
                        max: this.hourList.length-1,
                        value: this.slideValue,
                        slide: function (e, ui) {
                            self.slideValue = ui.value;
                        }
                    })
                    .sliderpips("pips", {
                        rest: "label",
                        labels: this.hourList
                    });
            },

            switchToHourSlide: function (activeHour) {
                this.$("#nhc-tc-dayslider").hide();
                this.$("#nhc-tc-hourslider").show();
            },

            switchToDaySlide: function (activeDay) {
                this.$("#nhc-tc-dayslider").show();
                this.$("#nhc-tc-hourslider").hide();
            },

            fnOK: function() {
                var granularity;
                var granularityValue;
                if(this.switchBtnState){
                    granularity = "_H";
                    granularityValue = this.hourList[this.slideValue];
                    granularityValue = granularityValue.substring(0,granularityValue.length-1);
                }else{
                    granularity = "_D";
                    if(this.slideValue>=this.dayList.length){
                        this.slideValue = this.dayList.length-1;
                    }
                    granularityValue = this.dayList[this.slideValue];
                    granularityValue = granularityValue.substring(0,granularityValue.length-1);
                }
                this.trigger("okEvent", {
                    granularity: granularity,
                    granularityValue: granularityValue
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    }
);