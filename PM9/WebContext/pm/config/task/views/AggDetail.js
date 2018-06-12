portal.define([
	'text!oss_core/pm/config/task/templates/agg/AggDetail.html',
	'oss_core/pm/meta/model/phy/actions/ModelPhyAction',
],function(aggTpl, modelPhyAction){
	return portal.BaseView.extend({
		template: fish.compile(aggTpl),
		
		events: {
			'click .js-agg-model-add': 'modelAdd',
			'click .js-agg-model-del': 'modelDel',
			'click .js-agg-model-add-all': 'modelAddAll',
			'click .js-agg-model-del-all': 'modelDelAll',
			'keyup .js-agg-model-seling-search': 'searchSeling',
			'keyup .js-agg-model-seled-search': 'searchSeled',
		},
		initialize: function(options) {
			this.bpId = options.bpId;
			this.operType = options.operType;
			this.i18nData =	options.i18nData;
			this.taskAction = options.taskAction;
			this.pmUtil = options.pmUtil;
			this.EMS_CODE = options.EMS_CODE;
			this.EMS_TYPE_REL_ID =	options.EMS_TYPE_REL_ID;
			this.EMS_VER_CODE	=	options.EMS_VER_CODE;
			this.datas = options.datas;
			this.seq = 0;
			this._L8 = "";
			for(var i=0;i<8;i++){
				this._L8 += "_";
			}
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.pmUtil.extContains();  
		},
		domComplete: function(){
			this.modelList = [];
			if(this.EMS_TYPE_REL_ID && this.EMS_VER_CODE){
				var param = {"EMS_TYPE_REL_ID":this.EMS_TYPE_REL_ID} ;//,"EMS_VER_CODE":this.EMS_VER_CODE
				this.getModelPhy(param);
			}
			
		},
		getModelPhy:function(param){
			param["MODEL_TYPE"] = '1'; //Statistical model
			modelPhyAction.qryModel(param, function(data) {
				
				if (data && data.modelList){
					this.modelList = data.modelList;
					if(this.datas){
						this.loadModelSeled();
					}else{
						this.loadModelSeling();
					}
				}
			}.bind(this));
		},
		loadModelSeling:function(){
			this.$(".js-agg-model-seling-ul").empty();
			fish.forEach(this.modelList,function(mo_field){
				var isSeled = mo_field['isSeled'];
				if(!isSeled){
					var code = mo_field['MODEL_PHY_CODE'];
					var name = mo_field['MODEL_PHY_NAME'];
					var title = mo_field['MODEL_PHY_NAME']+'['+mo_field['MODEL_PHY_CODE']+']';
					var granu = mo_field['GRANU_MODE'];
					this.modelSelingAppend(code,name,title,granu);
				}
			}.bind(this));
		},
		loadModelSeled:function(){
			this.taskAction.qryDetail({"TASK_NO":this.datas.TASK_NO, 'TYPE':'param'}, function(data) {
				if (data){
					var stepParamList = data.stepParamList ;
					fish.forEach(data.stepList, function(stepObj,index) {
						if(stepObj['STEP_NO']=='1'){
							
							var groupObj = {};
							fish.forEach(stepParamList, function(stepParam) {
								if(stepObj["TASK_STEP_ID"] == stepParam["TASK_STEP_ID"]
									&& stepObj["STEP_NO"] == stepParam["STEP_NO"] ){
										var groupNo = stepParam["GROUP_NO"];
										var code = stepParam["PARAM_CODE"];
										var value = (stepParam["PARAM_VALUE"]?stepParam["PARAM_VALUE"]:"")
												+ (stepParam["PARAM_VALUE1"]?stepParam["PARAM_VALUE1"]:"")
												+ (stepParam["PARAM_VALUE2"]?stepParam["PARAM_VALUE2"]:"")
												+ (stepParam["PARAM_VALUE3"]?stepParam["PARAM_VALUE3"]:"")
												+ (stepParam["PARAM_VALUE4"]?stepParam["PARAM_VALUE4"]:"")
												+ (stepParam["PARAM_VALUE5"]?stepParam["PARAM_VALUE5"]:"") ;
										if(groupNo==0) groupNo = "0";
										if(groupNo){
											if(!groupObj[groupNo]) groupObj[groupNo] = {};
											groupObj[groupNo][code] = value; 
										}
									}
							}.bind(this));
							
							$.each(groupObj, function(no, obj) {  
								if(typeof obj === 'object'){
									var isExist = false;
									fish.forEach(this.modelList,function(mo_field){
										if(mo_field['MODEL_PHY_CODE']==obj['MODEL_CODE']){
											isExist = true;
											var name = mo_field['MODEL_PHY_NAME'];
											var title = mo_field['MODEL_PHY_NAME']+'['+mo_field['MODEL_PHY_CODE']+']';
											var granu = mo_field['GRANU_MODE'];
											mo_field['isSeled'] = true;
											this.modelSeledAppend(obj['MODEL_CODE'],name,title,granu,obj['GRANU']);
											return false;
										}
									}.bind(this));
									if(!isExist){
										this.modelSeledAppend(obj['MODEL_CODE'],obj['MODEL_CODE'],'[]',obj['GRANU']);
									}
								}
							}.bind(this));
							
							this.loadModelSeling();
						}
					}.bind(this));
				}
			}.bind(this));
		},
		
		ok: function(){
			var isValid = true;
			
			var stepObj = {'stepList':[],'stepParamList':[]};
			fish.forEach($(".js-agg-detail-div div[step_no]"), function(div,index) {
				var form = $(div).find('form') ;
				if ($(form).isValid()) {
					var step = {'TASK_STEP_ID':this._L8+index+this._L8,'STEP_NO':$(div).attr("step_no") ,'TASK_STEP_NAME':$(div).attr("step_name") };
					stepObj["stepList"].push(fish.extend({},step,{'STEP_SEQ':stepObj["stepList"].length,'TASK_STEP_SEQ':stepObj["stepList"].length }));
					fish.forEach(this.$(".js-agg-model-seled-ul .js-agg-model-del"), function(item,seq) {
						var granu = $(item).parent().find(".js-agg-model-granu").combobox('value');
						
						stepObj["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':1,'PARAM_CODE':'MODEL_CODE', 'PARAM_VALUE':$(item).attr("code")}) );
						stepObj["stepParamList"].push( fish.extend({},step,{'GROUP_NO':seq,'GROUP_SEQ':2,'PARAM_CODE':'GRANU', 'PARAM_VALUE':granu }) );
					}.bind(this));
				}else{
					isValid = false;
				}
			}.bind(this));
			
			if(stepObj["stepParamList"].length <= 0){
				fish.info(this.i18nData.TASK_DETAIL_NULL);
				return false;
			}
			
			
			if(isValid){
				return stepObj;
			}else{
				fish.toast('info', this.i18nData.TIP_INFO);
				return false;
			}
			//alert(JSON.stringify(stepObj));
			
		},
		modelAdd:function(event){
			var $target = $(event.target) ;
			$target.parent().remove();
			this.modelSeledAppend($target.attr('code'),$target.attr('name'),$target.attr('tt'),$target.attr('granu'));
		},
		modelDel:function(event){
			var $target = $(event.target) ;
			$target.parent().remove();
			this.modelSelingAppend($target.attr('code'),$target.attr('name'),$target.attr('tt'),$target.attr('granu'));
		},
		modelAddAll:function(){
			fish.forEach(this.$(".js-agg-model-seling-ul .js-agg-model-add"), function(item,index) {
				this.modelSeledAppend($(item).attr("code"),$(item).attr("name"),$(item).attr("tt"),$(item).attr('granu'));
			}.bind(this));
			this.$(".js-agg-model-seling-ul").empty();
		},
		modelDelAll:function(){
			fish.forEach(this.$(".js-agg-model-seled-ul .js-agg-model-del"), function(item,index) {
				this.modelSelingAppend($(item).attr("code"),$(item).attr("name"),$(item).attr("tt"),$(item).attr('granu'));
			}.bind(this));
			this.$(".js-agg-model-seled-ul").empty();
		},
		modelSelingAppend:function(code,name,title,granu){
			this.$(".js-agg-model-seling-ul").append("<li class='ui-sortable-handle  js-agg-model-seling-li' title='"+title+"'>"
				+"<span style='width:240px;overflow:hidden; text-overflow:ellipsis; white-space:nowrap; word-break:keep-all;'>"+name+"</span>"
				+"<a href=\"#\" class=\"js-agg-model-add\" code='"+code+"' name='"+name+"' tt='"+title+"' granu='"+granu+"'>"+this.i18nData.COMMON_ADD+"</a>"
				+"</li>");
		},
		modelSeledAppend:function(code,name,title,granu,granu_value){
			var granuArr = [];
			if(granu){
				try{
					granuArr = JSON.parse(granu);
				} catch(error) {
					
				}
			}
			
			fish.forEach(granuArr, function(granuObj,index) {
				var isExist = false;
				fish.forEach(this.pmUtil.paravalue("GRANU"), function(para) {
					if(para[this.pmUtil.parakey.val] == granuObj['GRANU']){
						granuObj['GRANU_NAME'] = para[this.pmUtil.parakey.name];
						isExist = true;
						return false;
					}
				}.bind(this));
				if(!isExist){
					granuObj['GRANU_NAME'] = granuObj['GRANU'];
				}
			}.bind(this));
			
			this.$(".js-agg-model-seled-ul").append("<li class='ui-sortable-handle js-agg-model-seled-li' title='"+title+"'>"
				+"<div style='width:350px;'>"
				+"	<span style='width:240px;overflow:hidden; text-overflow:ellipsis; white-space:nowrap; word-break:keep-all;'>"+name+"</span>"
				+"	<div style='width:100px;float:right;' class='input-group'>"
				+"		<input class='form-control js-agg-model-granu' data-rule='"+this.i18nData.GRANU+":required;'/>"
				+"	</div>"
				+"</div>"
				+"<a href=\"#\" class=\"js-agg-model-del\" code='"+code+"' name='"+name+"' tt='"+title+"' granu='"+granu+"'>"+this.i18nData.COMMON_DELETE+"</a>"
				+"</li>");
			$(".js-agg-model-granu:last").combobox({
				dataTextField: "GRANU_NAME",
		        dataValueField: "GRANU",
		        dataSource:  granuArr,
			});
			if(granu_value){
				$(".js-agg-model-granu:last").combobox('value',granu_value);
			}else{
				$(".js-agg-model-granu:last").combobox('value',(granuArr.length > 0)?granuArr[0]['GRANU']:'');
			}
		},
		searchSeling: function(event){
			var val = $(event.target).val();
			if(val){
				this.$(".js-agg-model-seling-li").hide();
				fish.forEach(this.$(".js-agg-model-seling-li span").filter(":contains('"+val+"')"), function(item,index) {
					$(item).parent().show() ;
				}.bind(this));
			}else{
				this.$(".js-agg-model-seling-li").show();
			}		
			
		},
		searchSeled: function(event){
			var val = $(event.target).val();
			if(val){
				this.$(".js-agg-model-seled-li").hide();
				fish.forEach(this.$(".js-agg-model-seled-li div").filter(":contains('"+val+"')"), function(item,index) {
					$(item).parent().show() ;
				}.bind(this));
			}else{
				this.$(".js-agg-model-seled-li").show();
			}		
			
		},
		
	});
});