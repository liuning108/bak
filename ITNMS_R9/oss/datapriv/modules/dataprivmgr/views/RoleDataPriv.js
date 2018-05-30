define([
	"datapriv/modules/dataprivmgr/actions/DataPrivMgrAction",
	"datapriv/modules/dataprivmgr/models/RoleQryCond",
	"datapriv/modules/dataprivmgr/views/DataPrivMgrView",
	"text!datapriv/modules/dataprivmgr/templates/RoleDataPriv.html",
	"i18n!modules/rolemgr/i18n/rolemgr",
	'datapriv/modules/dataprivmgr/views/PrivValueEditorView',
	'text!datapriv/modules/dataprivmgr/templates/RoleId.html'
], function(DataPrivMgrAction, RoleQryCond, DataPrivMgr, roleDataPrivTpl, 
	i18nRoleMgr, PrivValueEditor, roleIdTpl) {
	var I18N = DataPrivMgr.prototype.i18nData,
		RoleAddPriv = PrivValueEditor.extend({
			templateId: fish.compile(roleIdTpl),
			i18nData: fish.extend({
				PRIV_VALUE_EDITOR: I18N.ADD_ROLE_DATA_PRIV
			}, PrivValueEditor.prototype.i18nData, i18nRoleMgr)
		}),
		RoleEditPriv = PrivValueEditor.extend({
			templateId: fish.compile(roleIdTpl),
			i18nData: fish.extend({
				PRIV_VALUE_EDITOR: I18N.EDIT_ROLE_DATA_PRIV
			}, PrivValueEditor.prototype.i18nData, i18nRoleMgr)
		});

	return portal.BaseView.extend({
//		className: "ui-dialog dialog",

		template: fish.compile(roleDataPrivTpl),

		i18nData: fish.extend({}, I18N, i18nRoleMgr),

		events: {
			"click .js-query": 'qryInfo',
			"click .js-add-priv": 'addPriv',
			"click .js-edit-priv": 'editPriv',
			"click .js-rm-priv": 'rmPriv',
			"click .js-btn-reset": 'resetQry'
		},

		initialize: function(options) {
			this.dataPriv = fish.clone(options.dataPriv);
			this.qryCond = new RoleQryCond();
			this.listenTo(this.qryCond, 'change', this.loadGrid);
			return this.render();
		},

		render: function() {
			this.setElement(this.template(this.i18nData));
		},

		afterRender: function() {
			var $qryForm = this.$(".js-qry-cond"),
				$detailForm = this.$(".js-detail");
			this.$(".grid").grid({
//				height: 180,
				colModel: [{
					name: "roleId",
					label: "",
					key: true,
					hidden: true
				}, {
					name: "roleName",
					label: this.i18nData.ROLEMGR_ROLE_NAME
				}, {
					name: "roleCode",
					label: this.i18nData.ROLEMGR_ROLE_CODE
				}, {
					name: "privValue",
					label: this.i18nData.DATA_PRIV_VALUE
				// }, {
				// 	name: "ownedTypeStr",
				// 	label: this.i18nData.DATAPRIVMGR_OWNED_TYPE
				}],
				pagebar: true,
				onSelectRow: function(e, rowid, state) {
					var rowdata = this.$(".grid").grid("getRowData", rowid),
						$form = this.$(".js-detail");
					this.roleDataPriv = fish.extend({
						privValue: null,
						ownedType: null,
					}, rowdata);
					$form.form('value', fish.extend({}, this.dataPriv, this.roleDataPriv));
					if (this.roleDataPriv.privValue) {
						this.$(".js-add-priv").attr("disabled", "disabled");
						this.$(".js-add-priv").prop("disabled", true);
						this.$(".js-edit-priv").removeAttr("disabled");
						this.$(".js-edit-priv").prop("disabled", false);
						this.$(".js-rm-priv").removeAttr("disabled");
						this.$(".js-rm-priv").prop("disabled", false);
					} else {
						this.$(".js-add-priv").removeAttr("disabled");
						this.$(".js-add-priv").prop("disabled", false);
						this.$(".js-edit-priv").attr("disabled", "disabled");
						this.$(".js-edit-priv").prop("disabled", true);
						this.$(".js-rm-priv").attr("disabled", "disabled");
						this.$(".js-rm-priv").prop("disabled", true);
					}			
				}.bind(this)
			});
			this.$(".grid").grid("navButtonAdd",[{
                caption: this.i18nData.DATAPRIVMGR_ADD_PRIV,
                cssprop: "js-add-priv"
            },{	
                caption: this.i18nData.DATAPRIVMGR_EDIT_PRIV,
                cssprop: "js-edit-priv"
            },{	
                caption: this.i18nData.DATAPRIVMGR_RM_PRIV,
                cssprop: "js-rm-priv"
            }]);
			this.$("form").form();

			$qryForm.find(":input[name='ownedDataPriv']")
				.combobox()
				.on("combobox:change", function(e) {
					var flag = $qryForm.form('value').ownedDataPriv,
						$cbb = $qryForm.find(":input[name='ownedType']");
					switch (flag) {
					case 'Y':
						$cbb.combobox("clear").combobox("enable");
						break;
					case 'N':
						$cbb.combobox("clear").combobox("disable");
						break;
					default:
						$cbb.combobox("clear").combobox("disable");
						break;
					}
				});
			$qryForm.find(":input[name='ownedType']")
				.combobox()
				.combobox("disable");

			// $detailForm.find(":input[name='ownedType']").combobox();
			$detailForm.find(":input[name='dataType']").combobox();
			$detailForm.form('disable');

			this.qryInfo();
		},

		loadGrid: function() {
			var cond = fish.extend({
				dataPrivId: this.dataPriv.dataPrivId
			}, this.qryCond.toJSON());
			DataPrivMgrAction.qryRoleListLeftRoleDataPriv(cond,
			function(status) {
				var roleDataPrivList = status || [];
				// fish.forEach(roleDataPrivList, function(roleDataPriv) {
				// 	switch (roleDataPriv.ownedType) {
				// 	case 'I':
				// 		roleDataPriv.ownedTypeStr = this.i18nData.COMMON_INCLUDE;
				// 		break;
				// 	case 'N':
				// 		roleDataPriv.ownedTypeStr = this.i18nData.COMMON_EXCLUDE;
				// 		break;
				// 	default:
				// 		roleDataPriv.ownedTypeStr = null;
				// 		break;
				// 	}
				// }, this);
				this.$(".grid").grid("reloadData", roleDataPrivList);
				if (roleDataPrivList.length > 0) {
					this.$(".grid").grid("setSelection", roleDataPrivList[0]);
				}
				else {
					this.$(".js-detail").form("clear");
					this.$(".js-add-priv").prop("disabled", true);
					this.$(".js-edit-priv").prop("disabled", true);
					this.$(".js-rm-priv").prop("disabled", true);
				}
			}.bind(this));
		},

		qryInfo: function() {
			var $form = this.$(".js-qry-cond"),
				value = $form.form('value');
			this.qryCond.clear({silent: true});
			this.qryCond.set(value, {silent: true});
			this.qryCond.trigger('change');
		},

		addPriv: function() {
			var that = this;
			var options = {
				dataType: that.dataPriv.dataType,
				roleName: that.roleDataPriv.roleName,
				roleCode: that.roleDataPriv.roleCode,
				dataPrivName: that.dataPriv.dataPrivName,
				valueList: that.dataPriv.valueList
			};
			fish.popupView({
            	url: RoleAddPriv,
            	viewOption: options,
            	close: function(msg){
            		DataPrivMgrAction.addDataPrivToRole(fish.extend({
						dataPrivId: that.dataPriv.dataPrivId,
						roleId: that.roleDataPriv.roleId
					}, msg), function(status) {
						var $form = that.$(".js-detail");
						fish.extend(that.roleDataPriv, msg);
						that.$(".grid").grid("setRowData", that.roleDataPriv);
						that.$(".grid").grid("setSelection", that.roleDataPriv);
						$form.form('value', fish.extend({}, that.dataPriv, that.roleDataPriv));
						fish.success(that.i18nData.ROLE_ADD_DATA_PRIV_SUCCESS);
					});
            	}            	
            });				
		},

		editPriv: function() {
			var that = this;
			var options = {
				dataType: that.dataPriv.dataType,
				roleName: that.roleDataPriv.roleName,
				roleCode: that.roleDataPriv.roleCode,
				dataPrivName: that.dataPriv.dataPrivName,
				valueList: that.dataPriv.valueList,
				privValue: that.roleDataPriv.privValue,
				ownedType: that.roleDataPriv.ownedType
			};
			fish.popupView({
            	url: RoleEditPriv,
            	viewOption: options,
            	close: function(msg){
            		DataPrivMgrAction.editDataPrivOfRole(fish.extend({
						dataPrivId: that.dataPriv.dataPrivId,
						roleId: that.roleDataPriv.roleId
					}, msg), function(status) {
						var $form = that.$(".js-detail");
						fish.extend(that.roleDataPriv, msg);
						that.$(".grid").grid("setRowData", that.roleDataPriv);
						that.$(".grid").grid("setSelection", that.roleDataPriv);
						$form.form('value', fish.extend({}, that.dataPriv, that.roleDataPriv));
						fish.success(that.i18nData.ROLE_EDIT_DATA_PRIV_SUCCESS);
					}.bind(that));
            	}            	
            });				
		},

		rmPriv: function() {
			fish.confirm(this.i18nData.ROLE_RM_DATA_PRIV_CONFIRM,function() {
					var dataPrivId = this.dataPriv.dataPrivId,
						roleId = this.roleDataPriv.roleId;
					DataPrivMgrAction.delDataPrivFromRole(dataPrivId, roleId,
						function(status) {
							var $form = this.$(".js-detail");
							this.roleDataPriv.privValue = null;
							this.roleDataPriv.ownedType = null;
							this.roleDataPriv.ownedTypeStr = null;
							this.$(".grid").grid("setRowData", this.roleDataPriv);
							$form.form('value', fish.extend({}, this.dataPriv, this.roleDataPriv));
							fish.success(this.i18nData.ROLE_RM_DATA_PRIV_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},
		resetQry: function(){
			this.$(".js-qry-cond").find(":input[name='ownedType']").combobox('disable');
		}
	});
});