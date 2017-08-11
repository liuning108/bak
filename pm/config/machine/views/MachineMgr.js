define(["text!oss_core/pm/config/machine/templates/machineMgr.html",
		"i18n!oss_core/pm/config/machine/i18n/machineMgr",
		'oss_core/pm/config/machine/actions/machineMgrAction',
		'oss_core/pm/config/machine/views/MachineMgrAddTaskView',
		'oss_core/pm/util/views/Util',
	   ], 
	function(tplMachineMgr, i18nMachine, machineMgrAction,AddTaskView, pmUtil) {
	 return portal.BaseView.extend({
		template : fish.compile(tplMachineMgr),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nMachine),
     	ViewMapping:{
     		'MachineMgrAddTaskView':"oss_core/pm/config/machine/views/MachineMgrAddTaskView"
     	},

      	initialize : function() {
			console.log("initialize");
		},

		render : function() {
		    this.$el.html(this.template(this.i18nData));
			return this;
		},

		afterRender : function() {
			var self =this;
			var addTaskView=null;
		    //参数配置
		    var opt = {
		        height: 'auto',
		        colModel: [{
		        	name: 'MACHINE_NO',
		            label: this.i18nData.MACHINE_NO,
		            width: 100,
		            key:true
		        },{
		        	name: 'MACHINE_NAME',
		            label: this.i18nData.MACHINE_NAME,
		            editable: true,
		            editrules:"required;",
		            width: 200,
		            key:true
		        }, {
		            name: 'MACHINE_IP',
		            label: this.i18nData.MACHINE_IP,
		            width: 100,
		            editable: true,
		            editrules:"required;ip",
		            title: false //内容没有提示
		        },{
		        	name: 'MACHINE_USER',
		            label: this.i18nData.MACHINE_USER,
		            editable: true,
		            editrules:"required;",
		            width: 100,
		            key:true
		        },{
		        	name: 'REMAIN',
		            label: this.i18nData.DEFAULT_REMAIN,
		            key:true,
		            width: 100,
		            formatter:function(cellval){
		            	if (cellval>0){
		            		return 'Y'
		            	}else{
		            		return 'N'
		            	}
		            	
		            }
		        },
		        {
		            name: 'NOTES',
		            label: this.i18nData.COMMON_REMARK,
		            edittype:"textarea",
		            editable: true,
		            width: 250,
		         }
		         ,{
		                name: '',
		                formatter: 'actions',
		                formatoptions: {
		                    editbutton: true, //默认开启编辑功能
		                    delbutton: true,  //默认开启删除功能	
		                },
		                width: 50,
		            }],
		         subGrid: true,
		         toolbar: [true, "bottom"],
		         subGridOptions: {
		            //第二次展开时不重新渲染,这些参数按需添加
		            reloadOnExpand: true,
		            plusIcon:"glyphicon glyphicon-triangle-right",
		            minusIcon:"glyphicon glyphicon-triangle-bottom",
		            //selectOnExpand: false,
		            //selectOnCollapse: false
		        },
		       		
		        subGridRowExpanded: function (e, subGridId, parentRowId) {
		        	var subgrid_table_id = subGridId + '_t';
		        	var eidtFlag=$("#"+parentRowId).data("editflag");
		        	var data = $grid.grid("getRowData",parentRowId);
		        	
		        	if(!eidtFlag){
		        	  //$("#" + subGridId).html("<div>左右切换</div>");
		        	     	addTaskView =new AddTaskView();
		        	     	$("#" + subGridId).append(addTaskView.render().$el);
					     	addTaskView.afterRender(data);
					     	self.listenTo(addTaskView, 'setRemain', function(data){
		                           $grid.grid("setRowData", parentRowId,{
								        "REMAIN": data,
								    });
		                    });
					     	
					}else{
		        	var subgrid_table_id = subGridId + '_t';
		            $("#" + subGridId).html("<table id='" + subgrid_table_id + "'></table>");
		            var $subGrid = $("#" + subgrid_table_id).grid({
		                colModel: [
		                    {name: "TASK_NO", label: this.i18nData.TASK_NO, width: 80, key: true},
		                    {name: "TASK_NAME", label: this.i18nData.TASK_NAME, width: 130},
		                ],
		                rowNum: 20,
		                height: 'auto',
		              
		                });
		           
		            machineMgrAction.queryCollectMachineTasks(data.MACHINE_NO,function(result){
			               $subGrid.grid('reloadData', result.collectMachineTaskList);
		             })
		            
		        	}
		           
		        },
		        afterEditRow:function(e, rowid, data, option){
		          	$grid.grid('expandSubGridRow', rowid);
		        },
		        beforeEditRow: function (e,rowid, data, option) {
		        	if($grid.data("editGird")){
		        		fish.toast('info', this.i18nData.NEED_CONTINUE_OPER);
		        		return false;
		        	}
		        	$grid.data("editGird",true);
		        	$("#"+rowid).data("editflag",false);
		        	$grid.grid('collapseSubGridRow', rowid);
		        },
		        beforeSaveRow: function (e, rowid, data, option) {
		
		        	if (!$("#"+rowid).data("saveRow")){
		 	        	var tasklist=addTaskView.getTasks();
			        	machineMgrAction.saveOrUpdate({'meachineData':data,'tasks':tasklist},function(result){
			        		if (result.result_userip){
			        			fish.toast('info', this.i18nData.MACHINE_USER_IP_EXIST);
			        		 	return;
			        		}
			        		 if(result.result_dis){
			        		 	fish.toast('info', this.i18nData.DEFAULT_REMAIN_EXIST);
			        		 	return;
			        		 }
			        		 if(result.state){
			                 }else{
			                 	$grid.grid("setRowData", rowid,{
			                 		"MACHINE_NO":result.result
			                 	})
			                 }
			                $("#"+rowid).data("saveRow",true);
			                $grid.grid("saveRow",rowid);//再次调用
			           })
			        	return false;
		        	}else{
		        		$("#"+rowid).data("saveRow",false)
		        		$("#"+rowid).data("editflag",true); 
		        		$grid.grid('collapseSubGridRow', rowid);
		        	    $grid.data("editGird",false);
		        		return true;
		        	}
		        	
		        },
		        beforeDeleteRow: function (e, rowid, data, option) {
		
		         fish.confirm(this.i18nData.CONFIRM_DELETE).result.then(function() {
		            machineMgrAction.deleteCollectMachine(data.MACHINE_NO,function(){
		            	$grid.grid('collapseSubGridRow', rowid);
		            	$grid.grid("delRowData", rowid);
		            })
		            
		         });
		        
		         return false
		           
		        },
		        afterRestoreRow:function(e, rowid, data, option){
			        	$("#"+rowid).data("editflag",false);
			        	$grid.grid('collapseSubGridRow', rowid);
			        	$grid.data("editGird",false);
		
		        }
		
		    };
		    //加载grid
		    $grid = $("#gridId").grid(opt);
		    $grid.grid("hideCol", 'MACHINE_NO');
		    $grid.grid("navButtonAdd", [
			    {
			        title: this.i18nData.COMMON_NEW,
			        caption:this.i18nData.COMMON_NEW,
			        id: "grid01_addIcon",
			        buttonicon: "",
			        navpos: "bottombar",
			        onClick: function () {
			        	if($grid.data("editGird")){
			        		fish.toast('info', this.i18nData.NEED_CONTINUE_OPER);
			        		return false;
			        	}
			            $grid.grid('addRow', {
			                initdata: {
			                    id: $.jgrid.randId(),
			                    REMAIN:'0'
			                }
			            });
			        }
			    }
		    ]);
   

	        machineMgrAction.qryCollectMachines(function(data){
				console.log(data.collectMachineList);
				$grid.grid('reloadData', data.collectMachineList);
				var data = $grid.grid("getDataIDs");
				fish.each(data,function(rowid,i){
					$("#"+rowid).data("editflag",true);
				});
			}); //end of qryCollectMachines
		},

		cleanup: function() {

		},


	});

});