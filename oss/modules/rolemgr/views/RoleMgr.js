/**
 * Title: RoleMgr.js
 * Description: Role Management View
 * Author: wu.yangjin
 * Created Date: 15-5-19 上午11:01
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!modules/rolemgr/templates/RoleMgr.html',
	'modules/rolemgr/actions/RoleMgrAction',
	'modules/rolemgr/models/RoleItem',
	'i18n!modules/rolemgr/i18n/rolemgr',
    'webroot',
    "css!modules/rolemgr/css/role"
], function(roleMgrTpl, RoleMgrAction, RoleItem,i18nRoleMgr,webroot) {
	return portal.BaseView.extend({
		template: fish.compile(roleMgrTpl),

		events: {
			"click .js-role-new": 'newRole',
			"click .js-role-edit": 'editRole',
			"click .js-role-ok": 'ok',
			"click .js-role-cancel": 'cancel',
			"click .js-role-grid .js-grant-data-priv": 'grantData'
		},

		initialize: function() {
			this.colModel = [{
				name: 'roleId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'roleName',
				label: i18nRoleMgr.ROLEMGR_ROLE_NAME,
				width: "30%",
				editable: true,
				search: true
			}, {
				name: 'roleCode',
				label: i18nRoleMgr.ROLEMGR_ROLE_CODE,
				width: "30%",
				search: true
			}, {
				name: 'isLockedStr',
				label: i18nRoleMgr.COMMON_LOCKED,
				width: "25%"
			}, {
				name: 'operate',
				label: '',
				formatter: 'actions',
				sortable: false,
				width: "15%",
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];

			this.roleItem = new RoleItem();

			this.listenTo(this.roleItem, "change", this.roleItemUpdated);
			this.on("delrow", this.delRowConfirm);
		},

		render: function() {
			this.$el.html(this.template(i18nRoleMgr));
			return this;
		},

		afterRender: function() {
			var $grid = this.$(".js-role-grid").grid({
				colModel: this.colModel,
				searchbar: true,
				gridComplete: function() {
					var $grid = this.$(".js-role-grid");
					$grid.find("span[data-action='del']").tooltip({
						placement: 'bottom'
					});
				}.bind(this),
				onSelectRow: this.rowSelectCallback.bind(this),
				beforeDeleteRow: function(e, rowid, data) {
					fish.confirm(i18nRoleMgr.ROLEMGR_DEL_ROLE_CONFIRM,function() {
							this.trigger("delrow", data);
						}.bind(this), $.noop);
					return false;
				}.bind(this),
			});

			// $grid.grid("navButtonAdd",{
			// 	cssprop:"js-grant-data-priv",
   //              caption: i18nRoleMgr.ROLEMGR_GRANT_DATA_PRIV
   //          });

			this.loadGrid($grid);

			this.$(".js-role-detail").form();

			this.$(".js-role-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id'),
						$grid = this.$("#" + id + " .grid"),
						oid = ui.oldPanel.attr('id');
					switch (id) {
					case "tabs-portal":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RolePortal",
							selector: "#tabs-portal",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					case "tabs-menu":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RoleMenu",
							selector: "#tabs-menu",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					case "tabs-component":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RoleComp",
							selector: "#tabs-component",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					case "tabs-user":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RoleUser",
							selector: "#tabs-user",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					case "tabs-portlet":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RolePortlet",
							selector: "#tabs-portlet",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					case "tabs-service":
						this.requireView({
							url: webroot+"modules/rolemgr/views/grant/RoleService",
							selector: "#tabs-service",
							viewOption: {
								model: this.roleItem
							},
							callback: function() {
								this.roleItem.trigger('change');
							}.bind(this)
						});
						break;
					default:
						break;
					}
				}.bind(this)
			});
		},

		getBoolStr: function(bool) {
			if (bool === 'Y') {
				return i18nRoleMgr.COMMON_YES;
			} else if (bool === 'N') {
				return i18nRoleMgr.COMMON_NO;
			} else {
				return '';
			}
		},

		loadGrid: function($grid) {
			RoleMgrAction.qryRoleList(function(data) {
				var roleList = data || [];
				fish.forEach(roleList, function(role) {
					role.isLockedStr = this.getBoolStr(role.isLocked);
				}, this);
				$grid.grid("reloadData", roleList);
				if (roleList.length > 0) {
					$grid.grid("setSelection", roleList[0]);
				}
			}.bind(this));
		},

		rowSelectCallback: function(e, rowid, state) {
			var $grid = this.$(".js-role-grid"),
				rowdata = $grid.grid('getRowData', rowid);
			this.roleItem.clear({silent: true});
			this.roleItem.set(rowdata);
		},

		delRowConfirm: function(msg) {
			var rowdata = msg,
				$grid = this.$(".js-role-grid");
			RoleMgrAction.delRole(rowdata.roleId, function(data) {
				var nextrow = $grid.grid("getNextSelection", rowdata),
					prevrow = $grid.grid("getPrevSelection", rowdata);
				if (nextrow) {
					$grid.grid('setSelection', nextrow);
				} else if (prevrow) {
					$grid.grid('setSelection', prevrow);
				}
				$grid.grid('delRowData', rowdata, {trigger: false});
				fish.success(i18nRoleMgr.ROLEMGR_DEL_ROLE_SUCCESS);
			}.bind(this));
		},

		roleItemUpdated: function() {
			var $form = this.$(".js-role-detail");
			$form.form("clear").form("value", this.roleItem.toJSON());
			$form.form("disable");
			this.$(".js-role-cancel").parent().hide();
			this.$(".js-role-cancel").parent().prev().show();
		},

		newRole: function() {
			this.$(".js-role-new").parent().hide();
			this.$(".js-role-new").parent().next().show();
			this.$(".js-role-detail").form('enable');
			this.$(".js-role-detail").form('clear');
			this.$(".js-role-ok").data("type", "new");
		},

		editRole: function() {
			this.$(".js-role-edit").parent().hide();
			this.$(".js-role-edit").parent().next().show();
			this.$(".js-role-detail").form('enable');
			this.$(".js-role-ok").data("type", "edit");
		},

		ok: function() {
			var $grid = this.$(".js-role-grid"),
				$ok = this.$(".js-role-ok"),
				$form = this.$(".js-role-detail");
			switch ($ok.data("type")) {
				case "new":
					if ($form.isValid()) {
						var inputRole = new RoleItem($form.form("value"));
						RoleMgrAction.addRole(inputRole.toJSON(), function(data) {
							this.roleItem.clear({silent: true});
							this.roleItem.set(fish.extend(inputRole.toJSON(), {
								roleId: data.roleId,
								isLockedStr: this.getBoolStr('N')
							}));
							this.roleItem.trigger("new");
							$grid.grid("addRowData", this.roleItem.toJSON(), 'last');
							$grid.grid("setSelection", this.roleItem.toJSON());
							fish.success(i18nRoleMgr.ROLEMGR_ADD_ROLE_SUCCESS);
						}.bind(this));
					}
					break;
				case "edit":
					if ($form.isValid()) {
						var inputRole = new RoleItem(fish.extend($form.form("value"), {
							roleId: this.roleItem.id
						}));
						RoleMgrAction.modRole(inputRole.toJSON(), function(data) {
							this.roleItem.clear({silent: true});
							this.roleItem.set(inputRole.toJSON());
							this.roleItem.trigger("edit");
							$grid.grid("setRowData", this.roleItem.toJSON());
							fish.success(i18nRoleMgr.ROLEMGR_MOD_ROLE_SUCCESS);
						}.bind(this));
					}
					break;
				default:
					break;
			}
		},

		cancel: function() {
			this.$(".js-role-cancel").parent().hide();
			this.$(".js-role-cancel").parent().prev().show();
			this.$(".js-role-detail").form('disable');
			this.$(".js-role-detail").resetValid();
			this.roleItem.trigger("change", this.roleItem);
		},

		grantData: function() {
			fish.popupView({
				url: 'modules/rolemgr/views/grant/RoleData',
				viewOption: {
					model: this.roleItem
				},
				callback: function(popup, view) {
					this.roleItem.trigger('change');
				}.bind(this)
			});
		},

		resize: function(delta) {
			//计算左边高度
			portal.utils.gridIncHeight(this.$(".js-role-grid"), delta);
			//设定.js-role-tab的tabspanel的高度;先计算左边高度则用左边高度为参照
			this.$(".js-role-tab").outerHeight(this.$(".js-layout-left").height());
			var subHeight = this.$(".js-role-tab").height() - this.$(".js-role-tab > .ui-tabs-nav").outerHeight();
			this.$(".js-role-tab > .ui-tabs-panel").outerHeight(subHeight);			
		}
	});
});
