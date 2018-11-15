define([
		"text!oss_core/inms/pm/meta/datalifetime/templates/DataLifeTimePopWin.html",
		"i18n!oss_core/inms/pm/meta/datalifetime/i18n/datalifetime",
		'oss_core/inms/pm/meta/datalifetime/actions/DataLifeTimeAction'
	],
	function(DataLifeTimePopWinView, i18nMain, action) {
	return portal.BaseView.extend({
		className : "ui-dialog dialog",
		resource: fish.extend({}, i18nMain),
		//加载模板
		template: fish.compile(DataLifeTimePopWinView),

		events : {
			"click #dlt-parampopwin-ok" : "fnOK",
			"click #dlt-parampopwin-cancel" : "fnCancel"
		},

		initialize: function(inParam) {
			this.dataTypeList = inParam.dataTypeList;
			this.granuList = inParam.granuList;
			this.gridDataList = inParam.gridDataList;
			this.rowData = inParam.rowData;
			this.act = inParam.act;
			this.inParam = inParam;
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.resource));
			this.$el.appendTo('body');
			return this;
		},

		contentReady: function() {
			var self = this;
			this.$selDataType = this.$("#dlt-datatype-select").combobox({
				dataSource: self.dataTypeList,
				value: self.dataTypeList.length>0?self.dataTypeList[0].value:""
			});
			this.$selDataType.on('combobox:change', function () {
				self.dataTypeChange();
			});
			self.dataTypeChange();
			this.$txtLifeTime = this.$("#dlt-lifetime-txt");
			this.$txtDesc = this.$("#dlt-desc-txt");
			this.checkForm = this.$("#form-dlt-popup-form").form();
			if (this.act == "M"){
				this.$selDataType.combobox("value", self.rowData.DATA_TYPE);
				this.$selGranu.combobox("value", self.rowData.GRANU);
				this.$txtLifeTime.val(self.rowData.LIFE_TIME);
				this.$txtDesc.val(self.rowData.COMMENTS);
				this.$("#dlt-parampopwin-title").text("Edit");
			} else {
				this.$("#dlt-parampopwin-title").text("Add");
			}
		},

		dataTypeChange: function () {
			var self = this;
			var selectableGranuList = [];
			var dataType = self.$selDataType.combobox("value");
			fish.forEach(self.granuList, function(granu){
				var exist = false;
				fish.forEach(self.gridDataList, function(gridData){
					if(gridData.DATA_TYPE == dataType && gridData.GRANU == granu.value){
						exist = true;
					}
				})
				if(!exist || (self.act == "M" && self.rowData.GRANU == granu.value)){
					selectableGranuList[selectableGranuList.length] = granu;
				}
			})
			this.$selGranu = this.$("#dlt-granu-select").combobox({
				dataSource: selectableGranuList,
				value: selectableGranuList.length>0?selectableGranuList[0].value:""
			});
		},

		fnCancel: function() {
			this.trigger("cancelEvent");
		},

		fnOK: function() {
			var self = this;
			var paramObj = {
				DATA_TYPE: self.$selDataType.combobox("value"),
				GRANU: self.$selGranu.combobox("value"),
				LIFE_TIME: self.$txtLifeTime.val(),
				COMMENTS: self.$txtDesc.val()
			};
			if (this.checkForm.isValid()) {
				if(this.act != "M"){
					action.saveDataLifeTime(paramObj, function(ret){
						if(ret){
							self.trigger("okEvent", paramObj);
						}
					});
				}else {
					paramObj.DATA_TYPE_OLD = self.rowData.DATA_TYPE;
					paramObj.GRANU_OLD = self.rowData.GRANU;
					action.updateDataLifeTime(paramObj, function(ret){
						if(ret){
							self.trigger("okEvent", paramObj);
						}
					});
				}
			}
		},

		resize: function() {
			return this;
		}

	});
});
