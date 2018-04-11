define([
	"datapriv/modules/dataprivmgr/actions/DataPrivMgrAction",
	"datapriv/modules/dataprivmgr/models/UserQryCond",
	"datapriv/modules/dataprivmgr/views/DataPrivMgrView",
	"text!datapriv/modules/dataprivmgr/templates/UserDataPriv.html",
	"i18n!modules/usermgr/i18n/usermgr",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	'datapriv/modules/dataprivmgr/views/PrivValueEditorView',
	'text!datapriv/modules/dataprivmgr/templates/UserId.html'
], function(DataPrivMgrAction, UserQryCond, DataPrivMgr, userDataPrivTpl, 
	i18nUserMgr, i18nStaffOrg, PrivValueEditor, userIdTpl) {
	var I18N = DataPrivMgr.prototype.i18nData,
		UserAddPriv = PrivValueEditor.extend({
			templateId: fish.compile(userIdTpl),
			i18nData: fish.extend({
				PRIV_VALUE_EDITOR: I18N.ADD_USER_DATA_PRIV
			}, PrivValueEditor.prototype.i18nData, i18nUserMgr)
		}),
		UserEditPriv = PrivValueEditor.extend({
			templateId: fish.compile(userIdTpl),
			i18nData: fish.extend({
				PRIV_VALUE_EDITOR: I18N.EDIT_USER_DATA_PRIV
			}, PrivValueEditor.prototype.i18nData, i18nUserMgr)
		});

	return portal.BaseView.extend({

		template: fish.compile(userDataPrivTpl),

		i18nData: fish.extend({}, I18N, i18nUserMgr, i18nStaffOrg),

		events: {
			"click .js-query": 'qryInfo',
			"click .js-add-priv": 'addPriv',
			"click .js-edit-priv": 'editPriv',
			"click .js-rm-priv": 'rmPriv',
			"click .js-btn-reset": 'resetQry'
		},

		initialize: function(options) {
			this.dataPriv = fish.clone(options.dataPriv);
			this.qryCond = new UserQryCond();
			this.listenTo(this.qryCond, 'change', function() {this.pageData(true);});
		},

		render: function() {
			this.setElement(this.template(this.i18nData));
		},

		afterRender: function() {
			var $qryForm = this.$(".js-qry-cond"),
				$detailForm = this.$(".js-detail");			
			this.$(".userDataBody").css("overflow-y","auto");
			this.$(".grid").grid({
//				height: 200,
				colModel: [{
					name: "userId",
					label: "",
					key: true,
					hidden: true
				}, {
					name: "userName",
					label: this.i18nData.USERMGR_USER_NAME
				}, {
					name: "userCode",
					label: this.i18nData.USERMGR_USER_CODE
				}, {
					name: "privValue",
					label: this.i18nData.DATA_PRIV_VALUE
				// }, {
				// 	name: "ownedTypeStr",
				// 	label: this.i18nData.DATAPRIVMGR_OWNED_TYPE,
				// 	sortable: false
				}],
				pager: true,
				datatype: 'json',
				pageData: function() {this.pageData(false);}.bind(this),
				onSelectRow: function(e, rowid, state) {
					var rowdata = this.$(".grid").grid("getRowData", rowid),
						$form = this.$(".js-detail");
					this.userDataPriv = fish.extend({
						privValue: null,
						ownedType: null
					}, rowdata);
					$form.form('value', fish.extend({}, this.dataPriv, this.userDataPriv));
					if (this.userDataPriv.privValue) {
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

			DataPrivMgrAction.qryRoleList(function(data) {
				var roleList = data || [],
					$combobox = $qryForm.find(":input[name='roleId']");
				$combobox.combobox({
					dataTextField: 'roleName',
					dataValueField: 'roleId',
					dataSource: roleList
				});
				this.qryInfo();
				//this.queryUserInfo();
			}.bind(this));
			$qryForm.find(":input[name='state']").combobox();
			$qryForm.find(":input[name='ownedDataPriv']").combobox().on("combobox:change", function(e) {
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
			$qryForm.find(":input[name='ownedType']").combobox();
			$qryForm.find(":input[name='ownedType']").combobox('disable');
			// $detailForm.find(":input[name='ownedType']").combobox();
			$detailForm.find(":input[name='dataType']").combobox();
			$detailForm.form('disable');
			this.$orgPopEdit = $qryForm.find(":input[name='orgId']").popedit({
				open: function() {
					var orgIdSel = this.$orgPopEdit.popedit("getValue");
					fish.popupView({
		            	url:'datapriv/modules/dataprivmgr/views/OrgPopWin',
		            	viewOption: {
							orgId: orgIdSel ? orgIdSel.Value : null
						},
						close: function(msg){
							this.$orgPopEdit.popedit("setValue", {
								Value: msg.orgId,
								Text: msg.orgName
							});
							this.$staffPopEdit.popedit('enable');
						}.bind(this)            	
		            });					
				}.bind(this),
				dataTextField: "Text",
				dataValueField: "Value",
				change: function() {
					var orgId = $qryForm.form('value').orgId;
					if ($.trim(orgId) === '') {
						$qryForm.form('value', {
							staffIds: ''
						});
						//this.$staffPopEdit.popedit("clear");
						this.$staffPopEdit.popedit("disable");
					}
				}.bind(this)
			});
			this.$staffPopEdit = $qryForm.find(":input[name='staffIds']").popedit({
				open: function() {
					fish.popupView({
						url: "datapriv/modules/dataprivmgr/views/StaffPopWin",
						viewOption: {
							orgId: $qryForm.form('value').orgId,
							staffIds: $qryForm.form('value').staffIds
						},
						close: function(msg){
							this.$staffPopEdit.popedit("setValue", {
								Value: fish.pluck(msg, 'staffId').join(),
								Text: fish.pluck(msg, 'staffName').join()
							});
						}.bind(this)
					});					
				}.bind(this),
				dataTextField: "Text",
				dataValueField: "Value"
			});
			this.$staffPopEdit.popedit("disable");
		},

		pageData: function(reset) {
			var cond = fish.extend({
				dataPrivId: this.dataPriv.dataPrivId
			}, this.qryCond.toJSON());
			DataPrivMgrAction.qryUserListLeftUserDataPrivCount(cond,
				function(status) {
				var count = status,
					pageLength = this.$(".grid").grid("getGridParam", "rowNum"),
					page = reset ? 1 : this.$(".grid").grid("getGridParam", "page"),
					sortname = this.$(".grid").grid("getGridParam", "sortname"),
					sortorder = this.$(".grid").grid("getGridParam", "sortorder");
	
				var filter = {
					pageIndex: page-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.OrderFields = sortname + " " + sortorder;
				}
				DataPrivMgrAction.qryUserListLeftUserDataPriv(cond, filter, function(status) {
					var userDataPrivList = status || [];
					// fish.forEach(userDataPrivList, function(userDataPriv) {
					// 	switch (userDataPriv.ownedType) {
					// 	case 'I':
					// 		userDataPriv.ownedTypeStr = this.i18nData.COMMON_INCLUDE;
					// 		break;
					// 	case 'N':
					// 		userDataPriv.ownedTypeStr = this.i18nData.COMMON_EXCLUDE;
					// 		break;
					// 	default:
					// 		userDataPriv.ownedTypeStr = null;
					// 		break;
					// 	}
					// }, this);
					this.$(".grid").grid("reloadData", {
						'rows': userDataPrivList,
						'page': page,
						'records': count
					});
					if (count > 0) {
						this.$(".grid").grid("setSelection", userDataPrivList[0]);
					}
					else {
						this.$(".js-detail").form("clear");
						this.$(".js-add-priv").prop("disabled", true);
						this.$(".js-edit-priv").prop("disabled", true);
						this.$(".js-rm-priv").prop("disabled", true);
					}
				}.bind(this));
			}.bind(this));
		},

		qryInfo: function() {
			var $form = this.$(".js-qry-cond"),
				value = $form.form('value');
			this.qryCond.clear({silent: true});
			this.qryCond.set(new UserQryCond(value).toJSON(), {silent: true});
			this.qryCond.trigger('change');
		},

		addPriv: function() {
			var that = this;
			var options = {
				dataType: that.dataPriv.dataType,
				userName: that.userDataPriv.userName,
				userCode: that.userDataPriv.userCode,
				dataPrivName: that.dataPriv.dataPrivName,
				valueList: that.dataPriv.valueList
			};
			fish.popupView({
            	url: UserAddPriv,
            	viewOption: options,
            	close: function(msg){
            		DataPrivMgrAction.addDataPrivToUser(fish.extend({
						dataPrivId: that.dataPriv.dataPrivId,
						userId: that.userDataPriv.userId
					}, msg), function(status) {
						var $form = that.$(".js-detail");
						fish.extend(that.userDataPriv, msg);
						that.$(".grid").grid("setRowData", that.userDataPriv);
						that.$(".grid").grid("setSelection", that.userDataPriv);
						$form.form('value', fish.extend({}, that.dataPriv, that.userDataPriv));
						fish.success(that.i18nData.USER_ADD_DATA_PRIV_SUCCESS);
					});
            	}            	
            });	
		},

		editPriv: function() {
			var that = this;
			var options = {
				dataType: that.dataPriv.dataType,
				userName: that.userDataPriv.userName,
				userCode: that.userDataPriv.userCode,
				dataPrivName: that.dataPriv.dataPrivName,
				valueList: that.dataPriv.valueList,
				privValue: that.userDataPriv.privValue,
				ownedType: that.userDataPriv.ownedType
			};
			fish.popupView({
            	url: UserEditPriv,
            	viewOption: options,
            	close: function(msg){
            		DataPrivMgrAction.editDataPrivOfUser(fish.extend({
						dataPrivId: that.dataPriv.dataPrivId,
						userId: that.userDataPriv.userId
					}, msg), function(status) {
						var $form = that.$(".js-detail");
						fish.extend(that.userDataPriv, msg);
						that.$(".grid").grid("setRowData", that.userDataPriv);
						that.$(".grid").grid("setSelection", that.userDataPriv);
						$form.form('value', fish.extend({}, that.dataPriv, that.userDataPriv));
						fish.success(that.i18nData.USER_EDIT_DATA_PRIV_SUCCESS);
					});
            	}            	
            });				
		},

		rmPriv: function() {
			fish.confirm(this.i18nData.USER_RM_DATA_PRIV_CONFIRM,function() {
					var dataPrivId = this.dataPriv.dataPrivId,
						userId = this.userDataPriv.userId;
					DataPrivMgrAction.delDataPrivFromUser(dataPrivId, userId,
						function(status) {
							var $form = this.$(".js-detail");
							this.userDataPriv.privValue = null;
							this.userDataPriv.ownedType = null;
							this.userDataPriv.ownedTypeStr = null;
							this.$(".grid").grid("setRowData", this.userDataPriv);
							this.$(".grid").grid("setSelection", this.userDataPriv);
							$form.form('value', fish.extend({}, this.dataPriv, this.userDataPriv));
							fish.success(this.i18nData.USER_RM_DATA_PRIV_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		},
		resetQry: function(){
			this.$(".js-qry-cond").find(":input[name='ownedType']").combobox('disable');
		}
	});
});