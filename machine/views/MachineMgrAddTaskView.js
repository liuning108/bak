/**
 * 指标筛选弹出窗
 */
define([
      "text!oss_core/pm/config/machine/templates/MachineMgrAddTaskPopup.html",
      'oss_core/pm/config/machine/actions/machineMgrAction',
      "i18n!oss_core/pm/config/machine/i18n/machineMgr"
    ],
    function(addTaskPopupTpl,machineMgrAction,i18nData) {
        return portal.CommonView.extend({ 
            //加载模板
            template: fish.compile(addTaskPopupTpl),
            resource : fish.extend({}, i18nData),
            events : {
                "click #machineAddTask" : "machineAddTask",
                "click #machineRemoveTask" : "machineRemoveTask",
                "click #setRemain" : "setRemain",
                "click #cancelRemain" : "cancelRemain",
            },

            initialize: function() {
              console.log(i18nData)
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                return this;
            },
            getTasks:function(){
                var datas=$("#grid2").grid("getRowData");
                return fish.map(datas, function(data){return data.TASK_NO });
            },
            afterRender: function(data) {
               this.check(data);
               this.renderGrid1(data);
               this.renderGrid2(data);
                return this;
            },
            check:function(data){
              this.parentData=data;
              if(data.REMAIN==1){
                $("#cancelRemain").show();
                $("#machineAddTask").hide();
              }else{
                $("#setRemain").show();
              }
            },
            renderGrid1:function(data){
                  

            var opt = {
                height:250,
                multiselect:true,
                colModel: [{
                    name: 'TASK_NO',
                    index: 'TASK_NO',
                    label: i18nData.COLLECTION_MACHINE_TASK_NO
                }, {
                  name: 'TASK_NAME',
                  label: i18nData.COLLECTION_MACHINE_TASK_NAME,
                  index: 'TASK_NAME',
                  width: 100,
                  search: true
                }
                ]
            };

            $grid33 = $("#grid1").grid(opt);
            machineMgrAction.queryUndistbutedTask({},function(result){
                $grid33.grid('reloadData', result.undistbutedTaskList);
                $('#searchbar1').searchbar({target: $grid33});
            })
            
            
        },

        renderGrid2:function(data){
        

        var opt = {
            height:250,
            multiselect:true,
            colModel: [{
                name: 'TASK_NO',
                index: 'TASK_NO',
                label: i18nData.COLLECTION_MACHINE_TASK_NO
            }, {
              name: 'TASK_NAME',
              label: i18nData.COLLECTION_MACHINE_TASK_NAME,
              index: 'TASK_NAME',
              width: 100,
              search: true
            }
            ]
        };

        $grid44 = $("#grid2").grid(opt);
        machineMgrAction.queryCollectMachineTasks(data.MACHINE_NO,function(result){
                $grid44.grid('reloadData', result.collectMachineTaskList);
                $('#searchbar2').searchbar({target: $grid44});
            })


            },
            machineAddTask: function() {
               var selarrrow = $("#grid1").grid("getCheckRows");
               fish.each(selarrrow,function(newData,i){
                 $("#grid1").grid("delRowData", newData);
                  newData.id=$.jgrid.randId();
                 $("#grid2").grid("addRowData", newData);
               })
               
            },

            machineRemoveTask: function() {
                var selarrrow = $("#grid2").grid("getCheckRows");
               fish.each(selarrrow,function(newData,i){
                 $("#grid2").grid("delRowData", newData);
                  newData.id=$.jgrid.randId();
                 $("#grid1").grid("addRowData", newData);
               })
            },

            setRemain:function(){
             var self =this;
             var data=self.parentData;
             machineMgrAction.isExistDisposeMachine(data.MACHINE_NO,function(result){
                    console.log(result.isExistDisposeMechine)
                    if(!result.isExistDisposeMechine){
                        $("#machineAddTask").hide();
                       $("#grid2").grid("setAllCheckRows",true);
                       self.machineRemoveTask();
                       $("#setRemain").hide();
                       $("#grid2").grid("setAllCheckRows",false);
                       $("#cancelRemain").show();
                       self.trigger('setRemain', 1); 
                    }else{
                        fish.toast('info', i18nData.COLLECTION_MACHINE_MESSAGE_EXISTHANDLE);
                    }
             });
                
            },
            cancelRemain:function(){
                $("#cancelRemain").hide();
                $("#setRemain").show();
                $("#machineAddTask").show();
               this.trigger('setRemain', 0);
            }
        });
    });