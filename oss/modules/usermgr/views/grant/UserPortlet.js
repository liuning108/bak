define([
	'modules/grant/models/PortletGrantItem',
	'modules/grant/models/PortletNavItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'modules/usermgr/actions/UserMgrAction',
	'text!modules/common/templates/GridCellEdit.html',
	'i18n!modules/usermgr/i18n/usermgr'
], function(PortletGrantItem, PortletNavItem, GrantItems, Grant3View, UserMgrAction,
	embedEditTpl, i18nUserMgr) {
	var PortletGrantItems = GrantItems.extend({
		model: PortletGrantItem
	}),
		PortletNavItems = GrantItems.extend({
		model: PortletNavItem
	});

	return Grant3View.extend({
		templateEmbedEdit: fish.compile(embedEditTpl),

		i18nData: fish.extend({
			header: true,
			PRIV_TYPE: 'M',
			GRANT_HEADER_TITLE: i18nUserMgr.USERMGR_PORTLET_PRIV_MGR
		}, i18nUserMgr),

		initialize: function() {
			this.tabItemInfo = [{
				name: 'byPortal',
				label: this.i18nData.USERMGR_BY_PORTAL,
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'partyName',
					label: this.i18nData.USERMGR_PORTAL_DIR_NAME
				}],
				/*treeIcons:{plus: 'glyphicon glyphicon-list',
                    minus: 'glyphicon glyphicon-list',
                    leaf: 'glyphicon glyphicon-list'},*/
				grantItems: new PortletNavItems(),
				loadGrid: function() {
				    var userId = this.model.get("userId");
				    UserMgrAction.qryPortalListByUserId(userId, function(status) {
						var portalList = status;
						fish.forEach(portalList, function(portal) {
							portal.keyId = portal.portalId + "p";
							portal.children = [];
						});
						this.tabItemInfo[0].grantItems.reset(portalList);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					return;
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
						portalId: rowdata.portalId,
						userId: this.model.get("userId")
					};
					UserMgrAction.qryPortletListByPortalIdLeftJoinUserOwnedInfo(qryOpts,
						function(status) {
							var portletList = status || [];
                            var that = this;
							fish.forEach(portletList, function(portlet) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(portlet.privId)}))) {
                                    portlet._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(portletList);
						}.bind(this)
					);
				}
			}, {
				name: 'byType',
				label: this.i18nData.USERMGR_BY_TYPE,
				colModel: [{
					name: 'keyId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'typeName',
					label: this.i18nData.USERMGR_TYPE_NAME
				}],
				/*treeIcons:{plus: 'glyphicon glyphicon-list',
                    minus: 'glyphicon glyphicon-list',
                    leaf: 'glyphicon glyphicon-list'},*/
				grantItems: new PortletNavItems(),
				loadGrid: function() {
					UserMgrAction.qryAllPortletType(function(status) {
						var typeList = status || [];
						fish.forEach(typeList, function(type) {
							type.keyId = type.typeId + "p";
							type.children = [];
						});
						this.tabItemInfo[1].grantItems.reset(typeList);
					}.bind(this));
				},
				rowExpandCallback: function(e, rowdata) {
					return;
				},
				rowSelectCallback: function(e, rowid, state) {
					var $grid = this.getActiveTabGrid(),
						rowdata = $grid.grid("getRowData", rowid),
						qryOpts = {
						userId: this.model.get("userId"),
						typeId: rowdata.typeId
					};
					UserMgrAction.qryPortletListByTypeIdLeftJoinUserOwnedInfo(qryOpts,
						function(status) {
							var portletList = status || [];
                            var that = this;
							fish.forEach(portletList, function(portlet) {
                                if(!fish.isEmpty(that.grantItemsD.where({privId: String(portlet.privId)}))) {
                                    portlet._chkd_ = true;
                                }
							});
							this.grantItemsU.reset(portletList);
						}.bind(this)
					);
				}
			}];

			this.grantItemsU = new PortletGrantItems();
			this.grantItemsD = new PortletGrantItems();

			this.colModelU = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.USERMGR_PORTLET_NAME,
				width: "35%"
			}, {
				name: 'url',
				label: this.i18nData.USERMGR_URL,
				width: "65%"
			}];

			this.colModelD = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portletName',
				label: this.i18nData.USERMGR_PORTLET_NAME,
				width: "45%"
			}, {
				name: 'url',
				label: this.i18nData.USERMGR_URL,
				width: "55%"			
			// }, {
			// 	name: 'operate',
			// 	label: '',
			// 	formatter: 'actions',
			// 	width: "20%",
			// 	formatoptions: {
			// 		delbutton: false,
			// 		editbutton: true
			// 	}
			}];

			this.listenTo(this.model, 'change', this.reload);

			return Grant3View.prototype.initialize.call(this);
		},

		reload: function() {
			Grant3View.prototype.reload.call(this);
		    UserMgrAction.qryUserOwnedPortletList(this.model.get("userId"), function(status) {
		    	var portletList = status || [];
				this.grantItemsD.reset(portletList);
			}.bind(this));
		},

		grantConfirm: function(selrows, success) {
            var userId = this.model.get('userId');
            UserMgrAction.grantPrivToUser(userId, selrows, function (data) {
                success(selrows);
                fish.success(this.i18nData.USERMGR_ADD_PORTLET_PRIV_SUCCESS);
            }.bind(this));
		},

		degrantConfirm: function(selrows, success) {
		    var userId = this.model.get('userId');
			fish.confirm(this.i18nData.USERMGR_RM_PORTLET_PRIV_CONFIRM,function() {
					UserMgrAction.degrantPrivFromUser(userId, fish.pluck(selrows, "privId"),
						function(data) {
							success();
							fish.success(this.i18nData.USERMGR_RM_PORTLET_PRIV_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
		}
	});
});
