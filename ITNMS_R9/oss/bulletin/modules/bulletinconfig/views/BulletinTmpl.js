define([
	"text!bulletin/modules/bulletinconfig/templates/BulletinTmpl.html",
	'i18n!bulletin/modules/bulletinconfig/i18n/bulletinconfig',
	'bulletin/modules/bulletinconfig/actions/BulletinConfigAction',
	"frm/fish-desktop/third-party/ueditor/ueditor.config",
	"frm/fish-desktop/third-party/ueditor/ueditor.all"
], function(bulletinTmplTpl, i18nBulletinConfig, bulletinConfigAction) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinTmplTpl),

		events: {
			"click .js-tmpl-new": "addTmpl",
			"click .js-tmpl-edit": "editTmpl"
		},

		initialize: function() {
		
		},

		render: function() {
			this.$el.html(this.template(i18nBulletinConfig));
		},

		afterRender: function() {
			var that = this;
			that.$tmplGrid = that.$(".js-tmpl-grid").grid({
				colModel: [{
					name: 'templateId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'templateName',
					label: i18nBulletinConfig.BULLETIN_CONFIG_TMPL_NAME,
					width: '45%'
				}, {
					name: 'comments',
					label: i18nBulletinConfig.BULLETIN_CONFIG_TMPL_DESC,
					width: "45%"				
				}, {
					name: 'operate',
					label: '',
					sortable: false,					
					formatter: 'actions',
					width: "10%",
					formatoptions: {						
						delbutton: true,
						editbutton: false				
					}
				}],
				// pager: true,
				// datatype: 'json',
				// pageData: function() {this.pageData(false);},
				onSelectRow: this.rowSelectCallback.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(i18nBulletinConfig.BULLETIN_CONFIG_DEL_TMPL,function() {
						bulletinConfigAction.delBulletinTmpl(rowdata.templateId, function() {
							var selrow = that.$tmplGrid.grid("getRowData",rowid);
							var nextrow = that.$tmplGrid.grid("getNextSelection", selrow); //获取下一条数据
							if (nextrow == null) {
								nextrow = that.$tmplGrid.grid("getPrevSelection", selrow); //获取上一条同级数据
							}
							if (nextrow == null) {
								nextrow = that.$tmplGrid.grid("getNodeParent", selrow);
							}
							that.$tmplGrid.grid("delTreeNode", selrow);
							if (nextrow != null) {
								that.$tmplGrid.grid("setSelection", nextrow);
							}
							fish.success(i18nBulletinConfig.BULLETIN_CONFIG_DEL_TMPL_SUCCESS);
						});
					}, $.noop);
					return false;
				}.bind(this)
			});
			// that.reload();
			this.$form = this.$(".js-tmpl-detail").form();
			this.$form.form("disable");

			bulletinConfigAction.qryBulletinTmpl(function(result){
				if (result){
					that.$tmplGrid.grid('reloadData', result);
					if (result.length > 0) {
						that.$tmplGrid.grid('setSelection', result[0]);
					}
				}
			});
		},
		
		rowSelectCallback: function(ee, rowid, state) {
			var that = this;
			var e = ee && ee.originalEvent || (void 0);
			var rowdata = that.$tmplGrid.grid('getSelection');			
			that.$form.form("value", rowdata);	
		},
		addTmpl: function () {
			this.operate("add");
		},

		operate: function(option){
			var that = this;
			fish.popupView({
				url: "bulletin/modules/bulletinconfig/views/BulletinTmplPopWin",
				viewOption: {
					type: option,
					data: that.$tmplGrid.grid("getSelection")
				},
				close: function(msg) {
					if (option == 'add'){
						//grid新增一条数据，并选中
						bulletinConfigAction.addBulletinTmpl(msg,function(result){
							that.$tmplGrid.grid("addRowData", result, 'last');
							that.$tmplGrid.grid("setSelection", result);
							fish.success(i18nBulletinConfig.BULLETIN_CONFIG_ADD_TMPL);
						});		
					}							
					if (option == 'edit'){
						//设置选中行的值
						bulletinConfigAction.modBulletinTmpl(msg,function(data){
							if (data){
								that.$tmplGrid.grid("setRowData", msg);
								that.$form.form("value", msg);	
								fish.success(i18nBulletinConfig.BULLETIN_CONFIG_EDIT_TMPL);
							}
						});
					}
					UE.delEditor("content");
				},
				dismiss: function() {
					UE.delEditor("content");
				}
			});
		},

		editTmpl: function () {
			this.operate("edit");			
		},

		resize: function(delta) {

			this.$(".js-tmpl-grid").grid("setGridHeight", this.$(".js-tmpl-grid").parent().parent().parent().parent().parent().parent().height() - this.$(".js-tmpl-grid").parent().parent().parent().outerHeight(true) + this.$(".js-tmpl-grid").height());
			
		}
	})
});
