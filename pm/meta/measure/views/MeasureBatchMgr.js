portal.define([
	'text!oss_core/pm/meta/measure/templates/MeasureBatchMgr.html',
],function(measureBatchAddTpl){
	return portal.BaseView.extend({
		template: fish.compile(measureBatchAddTpl),
		events: {
			"click .js-ok": 'ok'
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.measureAction = options.measureAction;
			this.pmUtil = options.pmUtil;
			this.data = options.data;
			this.dateFormat = this.pmUtil.parameter("dateFormat").val();
			this.batchModel = [{
				name: 'FIELD_NAME',
				label: this.i18nData.FIELD_NAME,
				width: "150",
				editable: true,
			 	edittype:"textarea"
			}, {
				name: "FIELD_CODE",
				label: this.i18nData.FIELD_CODE,
				width: "150",
				editable: true,
				edittype:"textarea"
			}, {
				name: 'EFF_TIME',
				label: this.i18nData.EFF_DATE,
				width: "100",
				editable: true,
				formatter: "date",
                formatoptions: {
                    newformat: this.dateFormat, //格式化后的数据格式
                },
                default:this.pmUtil.sysdate('date'),
			}, {
				name: 'FIELD_TYPE',
				label: this.i18nData.FIELD_TYPE,
				width: "100",
				editable: true,
				formatter: "select",
                edittype: "select",
                editoptions: this.pmUtil.paraToGridSel(this.pmUtil.paravalue("FIELD_TYPE")),
			}, {
				name: "DATA_TYPE",
				label: this.i18nData.DATA_TYPE,
				width: "100",
				editable: true,
				formatter: "select",
                edittype: "select",
                editoptions: this.pmUtil.paraToGridSel(this.pmUtil.paravalue("DATA_TYPE")),
			}, {
				name: "VAFIELD",
				label: this.i18nData.VAFIELD,
				width: "200",
				editable: true,
				edittype:"textarea"
			}, {
				name: "__batch__",
				label: "",
				width: "0",
				key:true,
				hidden:true
			}];
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			var that = this;
			var $grid = this.$(".js-measure-batch-grid");
			this.batchGrid = $grid.jqGrid({
				colModel: this.batchModel,
				height:335,
				width:1000,
				afterEditRow: function (e, rowid, data, option) {
					
					$("#" + rowid+"_EFF_TIME", ".js-measure-batch-grid").datetimepicker({
		                buttonIcon: '',
		                viewType: 'date',
		                format	: that.dateFormat,
		            });
		            
		            /*
		            $("#" + rowid+"_"+"EXP_TIME", ".js-measure-batch-grid").datetimepicker({
		                buttonIcon: '',
		                viewType: 'date',
		                format	: that.pmUtil.params.dateFormat,
		            });
		            */
		            //$("#" + rowid+"_" + "FIELD_CODE").attr("maxLength","32")
		        	$("#" + rowid+"_" + "FIELD_CODE").keyup(function(){
		        		var val = $("#" + rowid+"_" + "FIELD_CODE").val();
							val = val.replace(/[^\w\r\n]/g, "").replace(/^\-/g, "");
							$("#" + rowid+"_" + "FIELD_CODE").val(val);
		        	});
		        },
			});
			
			var addRowData = {};
			if(that.data && that.data.length > 0){
				fish.forEach(that.data, function(row,index) {
					fish.forEach(that.batchModel, function(col) {
						if(col){
							if(index==0 || col["edittype"]!="textarea"){
								addRowData[col.name] = row[col.name]?row[col.name]:"";
							}else{
								addRowData[col.name] += "\n" + (row[col.name]?row[col.name]:"");
							}
						}
					});
				});
			}else{
				fish.forEach(that.batchModel, function(col) {
					if(col && col.default){
						addRowData[col.name] = col.default;
					}
				});
			}
			//alert(JSON.stringify(addRowData));
			that.batchGrid.jqGrid("addRow", {initdata:addRowData});
			$(".js-measure-batch-form textarea").css("height","300");
			$(".js-measure-batch-form textarea").attr("wrap","off");
			$(".js-measure-batch-form textarea").addClass("form-control");
			
			this.retField = $('#RETRUN_FIELD').multiselect('option',{
				dataTextField:'label',dataValueField:'name',dataSource:this.batchModel
			});
			this.mulSel = [];
			fish.forEach(this.batchModel, function(col) {
				if(col && !col["hidden"]){
					that.mulSel.push(col.name);
				}
			});
			
			this.retField.multiselect('value', this.mulSel);
			this.retField.on('multiselect:change', function(e, params) {
			    that.returnField();
			}).on('multiselect:maxselected', function() {
			    that.returnField();
			}).on('multiselect:showingdropdown', function() {
			    that.returnField();
			}).on('multiselect:hidingdropdown', function() {
			    that.returnField();
			}).on('multiselect:noresult', function() {
			    that.returnField();
			}).on('multiselect:createitem', function(e, item) {
			    that.returnField();
			})

		},
		returnField:function(){
			this.batchGrid.jqGrid("hideCol", this.mulSel);
			this.batchGrid.jqGrid("showCol", this.retField.multiselect('value'));
		},
		ok: function(){
			var that = this;
			var rowid = this.batchGrid.jqGrid("getGridParam","selrow");
    		this.batchGrid.jqGrid("saveRow",rowid);
			var rowdata = this.batchGrid.jqGrid('getSelection');
					
			var retData = [];
			fish.forEach(this.batchModel, function(col) {
				if(col && ($.inArray(col.name, that.retField.multiselect('value'))>=0) && col["edittype"]=="textarea"){
					if(rowdata[col.name]){
						var colStr = (rowdata[col.name]).replace(/\n+$/g, "");
						if(colStr){
							fish.forEach(colStr.split("\n"), function(row,index) {
								if(retData[index]){
									retData[index][col.name] = row?row:"";
								}else{
									var obj = {};
									obj[col.name] = row?row:"";
									retData.push(obj);
								}
							});
						}
					}
				}
			});
			fish.forEach(this.batchModel, function(col) {
				if(col && ($.inArray(col.name, that.retField.multiselect('value'))>=0) && col["edittype"]!="textarea"){
					fish.forEach(retData, function(row) {
						if(row){
							row[col.name] = rowdata[col.name]?rowdata[col.name]:"";
						}
					});
				}
			});
			
			//alert(JSON.stringify(retData));
			this.popup.close(retData);
		}
	});
});