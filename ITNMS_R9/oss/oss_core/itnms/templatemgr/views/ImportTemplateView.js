define(
	[
		'text!oss_core/itnms/templatemgr/templates/ImportTemplateMain.html',
		'oss_core/itnms/templatemgr/actions/TemplateMgrAction',
		'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
		'i18n!oss_core/itnms/templatemgr/i18n/templatemgr',
		'frm/fish-desktop/third-party/fileupload/fish.fileupload',
		'css!frm/fish-desktop/third-party/fileupload/fileupload.css'
	], function(importTemplateMain, templateAction, kdoDSelect, i18nData, fileupload) {
		return fish.View.extend({
			resource: fish.extend({}, i18nData),
			template: fish.compile(importTemplateMain),

			events : {
				"click #tm-import-cancel-btn" : "importCancel"
			},

			initialize: function(inParam) {
				this.$el = inParam.el;
				this.checkItemList = [
					{
						name: "Groups", id: "groups", "createMissing": true
					},
					{
						name: "Hosts", id: "hosts", "updateExisting": false, "createMissing": false
					},
					{
						name: "Templates", id: "templates", "updateExisting": true, "createMissing": true
					},
					{
						name: "Template screens", id: "templateScreens", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},
					{
						name: "Template linkage", id: "templateLinkage", "createMissing": true
					},
					{
						name: "Applications", id: "applications", "createMissing": true, "deleteMissing": false
					},
					{
						name: "Items", id: "items", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},
					{
						name: "Discovery rules", id: "discoveryRules", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},
					{
						name: "Triggers", id: "triggers", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},
					{
						name: "Graphs", id: "graphs", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},
					/*{
						name: "Web scenarios", id: "webScenarios", "updateExisting": true, "createMissing": true, "deleteMissing": false
					},*/
					{
						name: "Screens", id: "screens", "updateExisting": false, "createMissing": false
					},
					{
						name: "Maps", id: "maps", "updateExisting": false, "createMissing": false
					},
					{
						name: "Images", id: "images", "updateExisting": false, "createMissing": false
					},
					{
						name: "Value mappings", id: "valueMaps", "updateExisting": false, "createMissing": true
					}
				];
			},

			render: function() {
				this.$el.html(this.template(this.resource));
				this.contentReady();
				return this;
			},

			contentReady: function() {
				var self = this;
				self.initFileUpload();
				self.initRuleTable();
			},

			initRuleTable: function() {
				var self = this;
				fish.forEach(self.checkItemList, function (item){
					//name: "Groups", id: "groups", "updateExisting": null, "createMissing": true, "deleteMissing": null
					var itemId = item.id;
					var updateHtml = "";
					if(item.hasOwnProperty("updateExisting")){
						updateHtml = "<input class='updateExisting' name='" + itemId + "' " + (item.updateExisting?"checked":"") + " type='checkbox'>";
					}
					var createHtml = "";
					if(item.hasOwnProperty("createMissing")){
						createHtml = "<input class='createMissing' name='" + itemId + "' " + (item.createMissing?"checked":"") + " type='checkbox'>";
					}
					var deleteHtml = "";
					if(item.hasOwnProperty("deleteMissing")){
						deleteHtml = "<input class='deleteMissing' name='" + itemId + "' " + (item.deleteMissing?"checked":"") + " type='checkbox'>";
					}
					var trHtml = "<tr>" +
						"<td class='tm-td-name'> " + item.name + " </td>" +
						"<td class='tm-td-check'>" + updateHtml + "</td>" +
						"<td class='tm-td-check'>" + createHtml + "</td>" +
						"<td class='tm-td-check'>" + deleteHtml + "</td>" +
						"</tr>";
					self.$('#tm-rule-table').append(trHtml);
				});
			},

			/**
			 * ZSMART_HOME\etc\portalConfig.properties app.security.excludeUrl配置/file.*
			 */
			initFileUpload: function () {
				var self = this;
				self.$('.js-fileupload').fileupload({
					url:'file/upload?moduleName=itnms_templatemgr&date=true&temporary=true',
					dataType: 'json',
					acceptFileTypes: /(\.|\/)(xml|json)$/i,
					add: function(e, data) {
						var fileName = data.files[0].name;
						self.$('input[name="FILE_PATH"]').val(fileName);
						self.$("#tm-import-ok-btn").off('click').on('click', function(e) {
							var fileType = fileName.substring(fileName.indexOf("."));
							if(fileType!=".xml"){
								fish.error({message:"选择的文件类型不符，只能上传xml类型文件", modal:true});
							}else {
								data.submit();
							}
						});
					},
					done: function (e, data) {
						var fileName = data.result.fileName;
						var filePath = data.result.filePath;
						self.$('input[name="FILE_PATH"]').val(fileName);
						self.uploadTemplate(filePath, fileName);
					},
					fail: function (e, data) {
						self.$('input[name="FILE_PATH"]').val('');
						console.log("upload failed");
					},
					processfail: function (e, data) {
						var index = data.index,
							file = data.files[index];
						if (file.error && file.error === "File type not allowed" ) {

							return;
						}
					}
				});
			},

			uploadTemplate: function(filePath, fileName) {
				var self = this;
				var importParams = [];
				//updateExisting": null, "createMissing": true, "deleteMissing"
				fish.forEach(this.checkItemList, function(item){
					var itemId = item.id;
					var updateExistingBtn = self.$('[class=updateExisting][name='+itemId+']');
					var createMissingBtn = self.$('[class=createMissing][name='+itemId+']');
					var deleteMissingBtn = self.$('[class=deleteMissing][name='+itemId+']');
					//
					var updateExisting = updateExistingBtn.length==0?null:updateExistingBtn[0].checked;
					var createMissing = createMissingBtn.length==0?null:createMissingBtn[0].checked;
					var deleteMissing = deleteMissingBtn.length==0?null:deleteMissingBtn[0].checked;
					var paramObj = new Object();
					if(updateExisting){
						paramObj["updateExisting"] = updateExisting;
					}
					if(createMissing){
						paramObj["createMissing"] = createMissing;
					}
					if(deleteMissing){
						paramObj["deleteMissing"] = deleteMissing;
					}
					paramObj["paramId"] = itemId;
					importParams[importParams.length] = paramObj;
				});
				templateAction.uploadTemplate({
					filePath: filePath,
					fileName: fileName,
					importParams: importParams
				},function(data){
					if(data.error){
						fish.toast('warn', data.error.message+" : "+data.error.data);
					}else {
						fish.toast('info', "upload success");
					}
				});
			},

			importCancel: function() {
				this.$('input[name="FILE_PATH"]').val('');
				this.trigger('cancelEvent');
			},

			resize: function() {
				return this;
			}
		});
	}
);