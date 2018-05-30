define([
    'modules/grant/models/PortalGrantItem',
    'modules/grant/collections/GrantItems',
   	'modules/grant/views/Grant2View',
   	'modules/usermgr/actions/UserMgrAction',
   	'text!modules/usermgr/templates/PortalFooter.html',
	'i18n!modules/usermgr/i18n/usermgr',
	'i18n!modules/portalmgr/i18n/portalmgr'
], function(PortalGrantItem, GrantItems, Grant2View, UserMgrAction,
	footerTpl, i18nUserMgr, i18nPortalMgr) {
	var PortalGrantItems = GrantItems.extend({
		model: PortalGrantItem
	});

	return Grant2View.extend({
		templateBottom: fish.compile(footerTpl),

		i18nData: fish.extend({
			header: true,
			footer: true,
			multisel: true,
			GRANT_DOWN_TITLE: i18nUserMgr.USERMGR_PORTAL_OF_USER,
			GRANT_UP_TITLE: i18nUserMgr.USERMGR_PORTAL,
			GRANT_HEADER_TITLE: i18nUserMgr.USERMGR_PORTAL_MGR
		}, i18nUserMgr, i18nPortalMgr),

		initialize: function() {
			this.grantItemsD = new PortalGrantItems();
			this.grantItemsU = new PortalGrantItems();

			this.colModelD = [{
				name: 'keyId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portalName',
				label: this.i18nData.PORTAL_NAME,
				search: true
			}, {
				name: 'url',
				label: this.i18nData.PORTAL_URL,
				search: true
			}, {
				name: 'portalType',
				label: this.i18nData.PORTAL_TYPE,
			}];

			this.colModelU = [{
				name: 'keyId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'portalName',
				label: this.i18nData.PORTAL_NAME,
				search: true
			}, {
				name: 'url',
				label: this.i18nData.PORTAL_URL,
				search: true
			}, {
				name: 'portalType',
				label: this.i18nData.PORTAL_TYPE
			}];

			this.listenTo(this.model, 'change', this.reload);
			this.listenTo(this.grantItemsD, 'all', function() {
				var arr = fish.uniq(this.grantItemsD.toJSON()), 
					$combobox = this.$(":input[name='portalId']");
				if ($combobox.parent().children(".ui-combobox").length > 0) {
					$combobox.combobox('option', 'dataSource', arr);
				} else {// for initialization
					$combobox.combobox({
						dataTextField: 'portalName',
						dataValueField: 'portalId',
						dataSource: arr
					});
				}
			    if (this.model.get("portalId")) {
			    	$combobox.combobox('value', this.model.get("portalId"));
				}
			});

			Grant2View.prototype.initialize.call(this);
		},

		reload: function() {
			UserMgrAction.qryPortalList(function(data) {
			    var userId = this.model.get("userId"),
					portalList = data || [];
				UserMgrAction.qryRolePortalListByUserId(userId, function(data) {
					var rolePortals = data || [];
					this.grantItemsD.reset([], {silent: true});
					this.grantItemsD.add(rolePortals, {silent: true});
					UserMgrAction.qryUserPortalListByUserId(userId, function(data) {
						var userPortals = data || [];
						this.grantItemsD.add(userPortals, {silent: true});
						this.grantItemsD.trigger('reset');
						this.grantItemsU.reset(fish.filter(portalList, function(portal) {
							return fish.where(userPortals, {
								portalId: Number(portal.portalId)
							}).length === 0;
						}));
					}.bind(this));
				}.bind(this));
			}.bind(this));
		},

		postResetD: function() {
			// deal with role portal data
			this.$gridD.grid("setCheckDisabled", _
				.chain(this.$gridD.grid("getRowData"))
				.filter(function(row) {
					return row.roleId ? true : false;
				})
				.map(function(row) {
					return this.$gridD.grid("getRowid", row);
				}, this).value(), true);	
		},

		grantConfirm: function(selrows, success) {
			var rolePortals = fish.where(this.grantItemsD.toJSON(), {_rowd_: true}),
				existedInRole = "";
			fish.forEach(selrows, function(row) {
				var hits = fish.where(rolePortals, {portalId: Number(row.portalId)});
				if (hits.length > 0) {
					existedInRole += hits[0].portalName + ",";
				}
			});
			existedInRole = existedInRole.substr(0, existedInRole.length-1);
			if (existedInRole) {
				var template = fish.compile(this.i18nData.USERMGR_EXISTED_IN_ROLE_PORTAL);
				fish.confirm(template({
					_0: existedInRole
				}),success, $.noop);
			} else {
				success();
			}
		},

		degrantConfirm: function(selrows, success) {
			success();
		},

		ok: function() {
		    var userId = this.model.get("userId"),
				userPortals = fish.filter(this.grantItemsD.toJSON(), function(portal) {
					return portal.roleId ? false : true;
				}),
				$combobox = this.$(":input[name='portalId']"),
				defaultPortalId = $combobox.combobox('value'),
				length = this.$gridD.grid("getGridParam", "records");
			if (length > 0){
				if (!this.$(":input[name='portalId']").isValid()) {
					return;
				}
				if (!defaultPortalId) {
				    fish.info(this.i18nData.USERMGR_PLS_SEL_PORTAL);
					return;
				}
			}
			UserMgrAction.grantPortal2User(userId, defaultPortalId, fish.pluck(userPortals,"portalId"),
				function(data) {
					this.popup.close($combobox.combobox('text'));
					fish.success(this.i18nData.USERMGR_GRANT_PORTAL_SUCCESS);
				}.bind(this)
			);
		}
	});
});