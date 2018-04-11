define([
	'text!modules/sysparam/templates/SystemParametersMgrTemplate.html',
	'i18n!modules/sysparam/i18n/systemparametersmgr',
	'modules/sysparam/actions/SystemParametersAction',
	"css!modules/sysparam/css/system"
], function(template, i18n_systemparametersmgr, systemParametersAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		events: {
			"click #btnClearCache": 'clearCache',
			"click #btnSecurityManager": 'securityDialogShow'
		},

		initialize: function() {
			this.colModel = [{
				name: 'param',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'paramName',
				label: i18n_systemparametersmgr.PARAM_NAME,
				width: 200,
				editable: true,
				editrules: i18n_systemparametersmgr.PARAM_NAME + ":required;length[1~60]",
				search: true
			}, {
				name: "mask",
				label: i18n_systemparametersmgr.PARAM_MASK,
				width: 200,
				search: true
			}, {
				name: "currentValue",
				label: i18n_systemparametersmgr.PARAM_CURRENT_VALUE,
				width: 200,
				editable: true,
				editrules: "length[~4000]",
				search: true
			}, {
				name: "comments",
				label: i18n_systemparametersmgr.COMMON_REMARKS,
				width: 350,
				editable: true,
				edittype: "textarea",
				editrules: "length[~4000]"
			}, {
				width: 90,
				label:"",
				name: "actions",
				sortable: false,
				formatter: 'actions',
				formatoptions: {
					editbutton: true, //默认开启编辑功能
					delbutton: false
				}
			}];
		},

		render: function() {
			this.$el.html(this.template(i18n_systemparametersmgr));
		},

		afterRender: function() {
			this.parametersGrid = this.$(".js-grid-parameters").grid({
				colModel: this.colModel,
				searchbar: true,
				pagebar: true,
				beforeSaveRow: function(e, rowid, data, option) {
					if (this.once === true) {
						this.once = false;
						return true;
					}

					var selData = this.parametersGrid.grid("getRowData", rowid);
					selData = $.extend(selData, data);
					systemParametersAction.editParam(selData, function(data1) {
						this.once = true;
						this.parametersGrid.grid("saveRow", rowid);
						fish.success(i18n_systemparametersmgr.PARAM_EDIT_SUCCESS);
					}.bind(this));

					return false; //取消默认的界面保存行为
				}.bind(this),
				onChangeRow: function(e, rowid, oldrowid) {
					this.parametersGrid.grid("restoreRow", oldrowid)
				}.bind(this)
			});
			this.parametersGrid.grid("navButtonAdd",[{
                caption: i18n_systemparametersmgr.PARAM_CLEAR_CACHE,
                id: "btnClearCache"
            },{
                caption: i18n_systemparametersmgr.PARAM_SECURITY_MGR,
                id: "btnSecurityManager"
            }]);
			this.reloadGrid();
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.parametersGrid, delta);
		},

		clearCache: function() {
			fish.confirm(i18n_systemparametersmgr.PARAM_SURE_TO_CLEAR_CACHE,function() {
					systemParametersAction.clearCache(function() {
						this.reloadGrid();
						fish.success(i18n_systemparametersmgr.PARAM_CLEAR_CACHE_SUCCESS);
					}.bind(this));
				}.bind(this), $.noop);
		},

		securityDialogShow: function() {
			fish.popupView('modules/sysparam/views/SecurityRulePopWin');
		},

		reloadGrid: function() {
			systemParametersAction.qrySystemParamList(function(data) {
				var params = data;
				this.parametersGrid.grid("reloadData", params);
				
			}.bind(this));
		}
	});
});
