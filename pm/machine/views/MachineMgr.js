define(["text!oss_core/pm/config/machine/templates/machineMgr.html",
		"i18n!oss_core/pm/config/machine/i18n/machineMgr",
		'oss_core/pm/config/machine/actions/machineMgrAction',
		'oss_core/pm/config/machine/views/MachineMgrAddTaskView',
		'oss_core/pm/util/views/Util',
	   ], 
	function(tplMachineMgr, i18nData, machineMgrAction,AddTaskView) {

	 return portal.BaseView.extend({
		template : fish.compile(tplMachineMgr),
     	resource : fish.extend({}, i18nData),
     	ViewMapping:{
     		'MachineMgrAddTaskView':"oss_core/pm/config/machine/views/MachineMgrAddTaskView"
     	},

      	initialize : function() {
		},

		render : function() {
		    this.$el.html(this.template(this.resource));
			return this;
		},
        resize:function(){
              var height=$('body').height()-200;
              $("#gridId").grid("setGridHeight", height);
        },

		afterRender : function() {
            var self=this;
     
    			var addTaskView=null;
            
    //参数配置
    var opt = {
        colModel: [{
        	name: 'MACHINE_NO',
            label: i18nData.COLLECTION_MACHINE_NO,
            key:true
        },{
        	name: 'MACHINE_NAME',
            label: i18nData.COLLECTION_MACHINE_NAME,
            editable: true,
            editrules:"required;",
            key:true
        }, {
            name: 'MACHINE_IP',
            label: i18nData.COLLECTION_MACHINE_IP,
            width: 100,
            editable: true,
            editrules:"required;ip",
            title: false //内容没有提示
        },{
        	name: 'MACHINE_USER',
            label: i18nData.COLLECTION_MACHINE_USER_NAME,
            editable: true,
            editrules:"required;",
            key:true
        },{
        	name: 'REMAIN',
            label: i18nData.COLLECTION_MACHINE_DEFAULT,
            align: "center",
            width:50,
            key:true,
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
            label: i18nData.COLLECTION_MACHINE_DESCRIPTION,
            edittype:"textarea",
            align: "left",
            editable: true,
         }
         ,{
                name: '',
                width:30,
                formatter: 'actions',
                formatoptions: {
                    editbutton: true, //默认开启编辑功能
                    delbutton: true,  //默认开启删除功能	
                }
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
                    {name: "TASK_NO", label: i18nData.COLLECTION_MACHINE_TASK_NO, width: 80, key: true},
                    {name: "TASK_NAME", label: i18nData.COLLECTION_MACHINE_TASK_NAME, width: 130},
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
        		fish.toast('info', i18nData.COLLECTION_MACHINE_MESSAGE_COMPLETE);
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
	        			fish.toast('info', i18nData.COLLECTION_MACHINE_MESSAGE_USERIP);
	        		 	return;
	        		}
	        		 if(result.result_dis){
	        		 	fish.toast('info', i18nData.COLLECTION_MACHINE_MESSAGE_EXISTHANDLE);
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
                $grid.grid('expandSubGridRow', rowid);

        		return true;
        	}
        	
        },
        beforeDeleteRow: function (e, rowid, data, option) {

         fish.confirm(i18nData.COLLECTION_MACHINE_MESSAGE_DELETE).result.then(function() {
            machineMgrAction.deleteCollectMachine(data.MACHINE_NO,function(){
            	$grid.grid('collapseSubGridRow', rowid);
            	$grid.grid("delRowData", rowid);
            })
            
         });
        
         return false
           
        },
        afterRestoreRow:function(e, rowid, data, option){
	        	$("#"+rowid).data("editflag",true);
	        	$grid.grid('collapseSubGridRow', rowid);
	        	$grid.data("editGird",false);
                $grid.grid('expandSubGridRow', rowid);

        }

    };
    //加载grid
    $grid = $("#gridId").grid(opt);
    $grid.grid("hideCol", 'MACHINE_NO');
    $grid.grid("navButtonAdd", [
    {
        title: i18nData.COLLECTION_MACHINE_NEW,
        caption:i18nData.COLLECTION_MACHINE_NEW,
        id: "grid01_addIcon",
        buttonicon: "",
        navpos: "bottombar",
        onClick: function () {
        	if($grid.data("editGird")){
        		fish.toast('info', i18nData.COLLECTION_MACHINE_MESSAGE_COMPLETE);
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
    	$grid.grid('reloadData', data.collectMachineList);
        var data = $grid.grid("getDataIDs");
        fish.each(data,function(rowid,i){
    	  $("#"+rowid).data("editflag",true);
        })
	 }) //end of qryCollectMachines
	},

	cleanup: function() {

		}


	});

});