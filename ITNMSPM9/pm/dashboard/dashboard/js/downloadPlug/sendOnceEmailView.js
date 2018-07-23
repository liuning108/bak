define([
    "oss_core/pm/dashboard/actions/DashBoardAction",
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
     "text!oss_core/pm/dashboard/js/downloadPlug/sendOnceEmailView.html",
     "css!oss_core/pm/dashboard/js/downloadPlug/style.css"
], function(action,i18nData,tpl) {
    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function(param) {
            this.param = param;
        },
        render: function() {
            this.$el.html(this.template(i18nData));
            return this;
        },
        afterRender: function() {
            var self = this;
            self.$el.find('#oncesend-subject-name').val(self.param.topicName);
            self.eventRender();

        },

        eventRender: function() {
            var self = this;
            $('#btn-once-send').click(function() {
                var flag = $('#downloadPlugOncefrom').isValid();


                if(flag){
                    action.addExportTask({
                        topicNo:self.param.topicNo,
                        filename:self.$el.find('#oncesend-subject-name').val(),
                        exportDate:"-1",
                        jsonParam:JSON.stringify({
                            'param':self.param.param,
                            'emailAddress':self.$el.find('#oncesend-subject-email').val()
                        }),
                        type:"02"
                    },function(data){
                      console.log(data);
                        fish.toast('success', i18nData.SEND_ASYN_TIP)
                        self.trigger('close')
                    })
                } // END OF IF
            })
            $('#btn-once-cancel').click(function(){
               self.trigger('close')
            })

        }
    })

})
