define([
    "oss_core/pm/dashboard/actions/DashBoardAction",
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
    "text!oss_core/pm/dashboard/js/downloadPlug/donwloadList.html",
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
            var opt = {
                colModel: [
                    {
                        label: i18nData.FTaskName,
                        name:   'EXPORT_FILENAME'
                    }, {
                        label: i18nData.FCommitTime,
                        name: "SPEC_EXPORT_DATE",
                        width: 200
                    }, {
                        label: i18nData.FState,
                        name: "STATE"
                    }, {
                        width: 50,
                        name: '',
                        formatter: function(cellval, opts, rwdat, _act) {
                            console.log("formatter")
                            console.log(cellval);
                            console.log(opts);
                            console.log(rwdat);
                            console.log(_act);
                            return '<div class="btn-group">' + '<i class="glyphicon glyphicon-download-alt donload-list-cel" data-taskid='+rwdat.TASK_ID+' data-state='+rwdat.STATE+' data-file='+rwdat.EXPORT_PATH+'></i> ' + '</div>'
                        }
                    }

                ]
            }
            var $grid = $('#tasklistgrid').grid(opt);
            $grid.on('click','.donload-list-cel',function(){
                var taskId =$(this).data('taskid');
                var state =$(this).data('state');
                var file =$(this).data('file');
                if(state=='DONE'){

                    action.moveFTPFile(file,function(data){
                          var fileName = data.filename;
                        try {
                           var url = portal.appGlobal.attributes.webroot + "/download?delete=true&filePath=" + fileName;
                           var elemIF = document.createElement("iframe");
                           elemIF.src = url;
                           elemIF.style.display = "none";
                           document.body.appendChild(elemIF);
                       } catch(e) {

                       }//end of try
                   }) //end of moveFTPFile

                }else{
                    fish.toast('info', 'The task does not have to download');
                }

            })
            $grid.grid("setGridHeight", 300); //设置高度
            var STATES = {
                '00': 'TODO',
                '01': 'DONE',
                '02': 'ERROR',
                '03': 'Downloaded'
            }

            action.getExportTaskListByUserId(function(data) {
                var result = data.result;
                var datas = fish.map(result.taskList, function(data) {
                    data.STATE = STATES[data.STATE];
                    return data;
                })
                $grid.grid("reloadData", result.taskList);
            })

            this.$el.find('.serachTaskBtn').click(function() {
                var filter = self.$el.find('.serachTaskInput').val();
                if (filter.length <= 0) {
                    action.getExportTaskListByUserId(function(data) {
                        var result = data.result;
                        var datas = fish.map(result.taskList, function(data) {
                            data.STATE = STATES[data.STATE];
                            return data;
                        })
                        $grid.grid("reloadData", result.taskList);
                    })
                } else {
                    action.getExportTaskListByUserIdAndFilter(filter, function(data) {
                        var result = data.result;
                        var datas = fish.map(result.taskList, function(data) {
                            data.STATE = STATES[data.STATE];
                            return data;
                        })
                        $grid.grid("reloadData", result.taskList);
                    })
                }

            })

        }
    })

})
