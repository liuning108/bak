define([
   "text!oss_core/inms/pm/taskprocess/js/downloadPlug/donwloadConfig.html",
   "oss_core/inms/pm/taskprocess/actions/TaskProcessAction.js",
 ], function(tpl,action) {
  return fish.View.extend({
    className: "ui-dialog dialog",
    template: fish.compile(tpl),
    initialize: function(param) {
      this.param = param;
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    afterRender: function() {
      var self = this;
      self.$el.find('#download-subject-name').val(self.param.topicName);
      self.eventRender();

    },

    eventRender: function() {
      var self = this;
      self.$el.find('#download-startTime').datetimepicker();
      self.$el.find('#btn-download-ok').off('click').on('click', function() {
        var flag = self.$el.find('#downloadPlugConfigfrom').isValid();
        var datetime = self.$el.find("#download-startTime").datetimepicker("value");
        if (datetime.length <= 0) {
          datetime = "-1";
        };
        if (flag) {
          //self.trigger('close')
          var param = {
            'topicNo': self.param.topicNo,
            'exportFileName': self.$el.find('#download-subject-name').val(),
            'exportDate': datetime,
            'jsonParam': JSON.stringify(self.param.param),
            'type':'01'
          }
          action.addExportTask(param).then(function(data){
            console.log("addExportTask Param", data);
            fish.toast('success', "导出报表数据是异步任务,请5分钟后到任务列表中下载.")
            self.trigger('close')
          })
        } // END OF IF
      })
      $('#btn-download-cancel').click(function() {
        self.trigger('close')
      })

    }
  })

})
