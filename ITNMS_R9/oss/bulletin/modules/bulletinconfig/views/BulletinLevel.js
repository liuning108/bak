define([
	"text!bulletin/modules/bulletinconfig/templates/BulletinLevel.html",
	'i18n!bulletin/modules/bulletinconfig/i18n/bulletinconfig',
	'bulletin/modules/bulletinconfig/actions/BulletinConfigAction',
	'frm/fish-desktop/third-party/colorpicker/fish.colorpicker',
	'css!frm/fish-desktop/third-party/colorpicker/colorpicker'
], function(bulletinTmplTpl, i18nBulletinConfig, bulletinConfigAction) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinTmplTpl),

		events: {
			"click .js-level-new": "addLevel",
			"click .js-level-edit": "editLevel",
			"click .js-level-ok": "ok",
			"click .js-level-cancel": "cancel"
		},

		initialize: function() {
		
		},

		render: function() {
			this.$el.html(this.template(i18nBulletinConfig));
		},

		afterRender: function() {
			var that = this;
			that.$levelGrid = that.$(".js-level-grid").grid({
				colModel: [{
					name: 'levelId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'levelName',
					label: i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_NAME,
					width: '30%'
				}, {
					name: 'recordColor',
					label: i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_COLOR,
					width: "20%"	
				}, {
					name: 'iconUrl',
					label: i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_ICON,
					width: "20%",
					formatter: "select",
					formatoptions:{
						value: {'level1':i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_HIGH,'level2':i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_NORMAL,'level3':i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_LOW}
					}		
				}, {
					name: 'forceView',
					label: i18nBulletinConfig.BULLETIN_CONFIG_LEVEL_FORCE,
					width: "20%",
					formatter: "select",
					formatoptions:{
						value: {'Y':i18nBulletinConfig.COMMON_YES,'N':i18nBulletinConfig.COMMON_NO}
					}			
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
					fish.confirm(i18nBulletinConfig.BULLETIN_CONFIG_DEL_LEVEL,function() {
						bulletinConfigAction.delBulletinLevel(rowdata.levelId, function() {
							var selrow = that.$levelGrid.grid("getRowData",rowid);
							var nextrow = that.$levelGrid.grid("getNextSelection", selrow); //获取下一条数据
							if (nextrow == null) {
								nextrow = that.$levelGrid.grid("getPrevSelection", selrow); //获取上一条同级数据
							}
							if (nextrow == null) {
								nextrow = that.$levelGrid.grid("getNodeParent", selrow);
							}
							that.$levelGrid.grid("delTreeNode", selrow);
							if (nextrow != null) {
								that.$levelGrid.grid("setSelection", nextrow);
							}
							fish.success(i18nBulletinConfig.BULLETIN_CONFIG_DEL_LEVEL_SUCCESS);
						});
					}, $.noop);
					return false;
				}.bind(this)
			});
			// that.reload();
			that.$form = that.$(".js-level-detail");
			that.$("#event").colorpicker();
			that.$form.find(":input[name='iconUrl']").combobox();
			that.$form.find(":input[name='forceView']").combobox();
			that.$form.form("disable");

			$("#event").on("hide.colorpicker", function(e, color) {
				that.$form.find(":input[name='recordColor']").val(color);
			});

			bulletinConfigAction.qryBulletinLevel(function(result){
				if (result){
					that.$levelGrid.grid('reloadData', result);
					if (result.length > 0) {
						that.$levelGrid.grid('setSelection', result[0]);
					}
				}
			});
		},
		
		rowSelectCallback: function(ee, rowid, state) {
			var that = this;
			var e = ee && ee.originalEvent || (void 0);
			var rowdata = that.$levelGrid.grid('getSelection');			
			that.$form.form("value", rowdata);	
		},
		addLevel: function () {
			var that = this;
			that.$form.form("clear");
			that.$form.form("enable");
			that.$form.find(":input[name='recordColor']").prop("disabled", true);
			that.$form.find(":input[name='forceView']").combobox("value",'Y');
			that.$form.find(":input[name='iconUrl']").combobox("value",'level1');
			that.$(".js-level-ok").data("type", "new");
			that.$(".js-level-new").parent().hide();
			that.$(".js-level-new").parent().next().show();
		},

		editLevel: function () {
			var that = this;
			that.$form.form("enable");
			that.$(".js-level-ok").data("type", "edit");
			that.$form.find(":input[name='recordColor']").prop("disabled", true);
			that.$(".js-level-new").parent().hide();
			that.$(".js-level-new").parent().next().show();
		},

		ok: function (){
			var that = this,
				$grid = this.$(".js-level-grid"),
				$ok = this.$(".js-level-ok"),				
				$form = this.$(".js-level-detail");
			switch ($ok.data("type")) {
			case "new":
				if ($form.isValid()) {
					var detail = $form.form('value');
					bulletinConfigAction.addBulletinLevel(detail, function(result) {
						if (result){
							$grid.grid("addRowData", result, 'last');
							$grid.grid("setSelection", result);
							fish.success(i18nBulletinConfig.BULLETIN_CONFIG_ADD_LEVEL);
							that.cancel();
						}						
					}.bind(this));
				}
				break;
			case "edit":
				if ($form.isValid()) {
					var detail = fish.extend($grid.grid("getSelection"), $form.form('value'));
					bulletinConfigAction.modBulletinLevel(detail, function(result) {
						if (result){
							$grid.grid("setRowData", detail);
							fish.success(i18nBulletinConfig.BULLETIN_CONFIG_EDIT_LEVEL);
							that.cancel();
						}						
					}.bind(this));
				}
				break;
			default:
				break;
			}
		},
		cancel: function(){
			this.$(".js-level-cancel").parent().hide();
			this.$(".js-level-cancel").parent().prev().show();
			this.$(".js-level-detail").form('disable');
			this.$(".js-level-detail").resetValid();
			this.rowSelectCallback();
		},

		resize: function(delta) {
			this.$(".js-level-grid").grid("setGridHeight", this.$(".js-level-grid").parent().parent().parent().parent().parent().parent().height() - this.$(".js-level-grid").parent().parent().parent().outerHeight(true) + this.$(".js-level-grid").height());
			
		}
	})
});
