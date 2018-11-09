define([
    "oss_core/pm/dashboard/actions/DashBoardAction",
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
     "text!oss_core/pm/dashboard/js/downloadPlug/donwloadConfig.html",
     "css!oss_core/pm/dashboard/js/emailPlug/style.css"
], function(action,i18nData, tpl) {
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
            self.$el.find('#download-subject-name').val(self.param.topicName);
            self.eventRender();

        },

        eventRender: function() {
            var self = this;
            $('#download-startTime').datetimepicker();
            $('#btn-download-ok').click(function() {
                var flag = $('#downloadPlugConfigfrom').isValid();
                var datetime = $("#download-startTime").datetimepicker("value");
                if(datetime.length<=0){
                    datetime="-1";
                };

                if(flag){
                    action.addExportTask({
                        topicNo:self.param.topicNo,
                        filename:self.$el.find('#download-subject-name').val(),
                        exportDate:datetime,
                        jsonParam:JSON.stringify(self.param.param),
                        type:'01'
                    },function(){
                        fish.toast('success', i18nData.EXPORT_TIP)
                        self.trigger('close')
                    })
                } // END OF IF
            })
            $('#btn-download-cancel').click(function(){
               self.trigger('close')
            })

        }
    })

})
