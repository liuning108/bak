define([
	'modules/rolemgr/actions/RoleMgrAction',
	'text!modules/rolemgr/templates/RoleService.html',
	'i18n!modules/rolemgr/i18n/rolemgr'
], function(RoleMgrAction, tpl, i18n) {
	return portal.BaseView.extend({

		events: {
			"click .js-new-service": "newService",
			"click .js-refresh-cache": "refreshCache"
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.reload);
		},

		render: function() {
			this.$el.html(fish.compile(tpl)());
		},

		afterRender: function() {
			var that = this ;

			this.$serviceGrid = this.$(".js-role-service").grid({
				colModel: [{
					name: 'privId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'privName',
					label: i18n.ROLEMGR_PRIV_POINT,
					width: "30%",
					editable: true
				}, {
					name: 'url',
					label: i18n.ROLEMGR_PRIV_PATTERN,
					width: '50%',
					editable: true
				}, {
					name: 'operate',
					label: '',
					align: 'center',
					formatter: 'actions',
					width: "20%"
				}],
				pagebar: true,
				beforeDeleteRow: function(e, rowid) {
					fish.confirm(i18n.ROLEMGR_PRIV_DEL_CONFIRM,function() {
						var roleId = that.model.get("roleId");
						RoleMgrAction.delServicePriv(roleId, rowid, function(status) {
							that.$serviceGrid.grid("delRow", rowid, {trigger: false});
						})
					});
					return false;
				},
				beforeSaveRow: function(e, rowid, rowdata, options) {
					switch (options.oper) {
						case 'edit':
							if(rowdata.privName == "") {
								fish.warn(i18n.ROLEMGR_PRIV_NAME_NON_EMPTY);
								return;
							}
							RoleMgrAction.modServicePriv(rowdata, function(status) {
								that.$serviceGrid.grid("saveRow", rowid, {trigger: false});
							});
							break;
						case 'add':
							if(rowdata.privName == "") {
								fish.warn(i18n.ROLEMGR_PRIV_NAME_NON_EMPTY);
								return;
							}
							var roleId = that.model.get("roleId");
							rowdata.privId = $.jgrid.guid++; //避免long的类型错误
							RoleMgrAction.addServicePriv(roleId, rowdata, function(status) {
								var priv = status;
								that.$serviceGrid.grid('saveRow', rowid, {trigger: false});
								that.$serviceGrid.grid('delRow', rowid, {trigger: false});
								that.$serviceGrid.grid('addRowData', priv);
								that.$serviceGrid.grid('setSelection', priv);
							});
							break;
						default:
							break;
					}
					return false;
				}
			});
			this.$serviceGrid.grid("navButtonAdd",[{
                caption: i18n.ROLEMGR_PRIV_ADD,
                cssprop: "js-new-service"
            },{	
                caption: i18n.ROLEMGR_PRIV_REFRESH,
                cssprop: "js-refresh-cache"
            }]);
		},
		reload: function() {
			var roleId = this.model.get("roleId");
			RoleMgrAction.qryServiceListByRoleId(roleId,function(data) {
				this.$serviceGrid.grid("reloadData", data);
			}.bind(this));
		},
		resize: function(delta) {
			portal.utils.gridIncHeight(this.$serviceGrid, delta);
		},
		newService:function(){
			this.$serviceGrid.grid("addRow");
		},
		refreshCache:function(){
			RoleMgrAction.refreshCache(function() {
				fish.success(i18n.ROLEMGR_PRIV_REFRESH_SUCCESS);
			}.bind(this));
		}
	});
});
