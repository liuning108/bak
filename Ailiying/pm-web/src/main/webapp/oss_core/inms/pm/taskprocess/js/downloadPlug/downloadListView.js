define([
  "text!oss_core/inms/pm/taskprocess/js/downloadPlug/donwloadList.html", "oss_core/inms/pm/taskprocess/actions/TaskProcessAction.js", "css!oss_core/inms/pm/taskprocess/js/downloadPlug/style.css"
], function(tpl, action) {
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
    search: function(filter) {
      var self = this;
      var STATES = {
        '00': 'TODO',
        '01': 'DONE',
        '02': 'ERROR',
        '03': 'Downloaded'
      }
      action.exportTasklist(filter).then(function(data) {
        console.log('exportTasklist', data);
        var datas = fish.map(data.taskList, function(data) {
          data.STATE = STATES[data.STATE];
          return data;
        })
        self.$grid.grid("reloadData", datas);
      });
    },
    download: function(url) {
      var elemIF = document.createElement("iframe");
      alert(url)
      elemIF.src =  url
      elemIF.style.display = "none";
      document.body.appendChild(elemIF);
    },
    afterRender: function() {
      var self = this;
      var opt = {
        colModel: [
          {
            label: '任务名',
            name: 'EXPORT_FILENAME'
          }, {
            label: '创建时间',
            name: "SPEC_EXPORT_DATE",
            width: 200
          }, {
            label: '状态',
            name: "STATE"
          }, {
            width: 50,
            name: '',
            formatter: function(cellval, opts, rwdat, _act) {
              return '<div class="btn-group">' + '<i class="glyphicon glyphicon-download-alt donload-list-cel" data-taskid=' + rwdat.TASK_ID + ' data-state=' + rwdat.STATE + ' data-file=' + rwdat.EXPORT_PATH + '></i> ' + '</div>'
            }
          }

        ]
      }
      var $grid = $('#tasklistgrid').grid(opt);
      self.$grid = $grid;
      $grid.on('click', '.donload-list-cel', function() {
        var taskId = $(this).data('taskid');
        var state = $(this).data('state');
        var file = $(this).data('file');
        if (state == 'DONE') {
          action.moveFTPFile(file).then(function(data){
             var fileName = data.filename;
             var url ="download?delete=true&fileName="+fileName;
             self.download(url);
          })

        } else {
          fish.toast('info', '这个任务并不能下载');
        }

      })
      $grid.grid("setGridHeight", 300); //设置高度
      self.search("")
      this.$el.find('.serachTaskBtn').click(function() {
        var filter = self.$el.find('.serachTaskInput').val();
        self.search(filter)
      })

    }
  })

})
