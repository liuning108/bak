define([
	'modules/grant/models/OrgItem',
	'modules/grant/models/StaffItem',
	'modules/grant/collections/GrantItems',
	'modules/grant/views/Grant3View',
	'stafforg/modules/stafforg/actions/StaffOrgAction',
	'i18n!stafforg/modules/stafforg/i18n/stafforg'
], function(OrgItem, StaffItem, GrantItems, Grant3View,
	StaffOrgAction, i18nStaffOrg) {
	var StaffItems = GrantItems.extend({
		model: StaffItem
	}),
		OrgItems = GrantItems.extend({
		model: OrgItem
	});

	return Grant3View.extend({
		i18nData: fish.extend({
			header: true,
			footer: true,
			PRIV_TYPE: 'S',
			GRANT_HEADER_TITLE: i18nStaffOrg.STAFFORG_SUPERIORS_SEL
		}, i18nStaffOrg),

		initialize: function(options) {
			var that = this;

			this._staff = options.STAFF;
			this._superiors = options.SUPERIORS;

			this.tabItemInfo = {
				name: 'byPortal',
				label: '',
				colModel: [{
					name: 'orgId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: this.i18nData.STAFFORG_ORG_NAME,
					search: true
				}, {
					name: "orgCode",
					label: this.i18nData.STAFFORG_ORG_CODE,
					search: true
				}],
				grantItems: new OrgItems(),
				loadGrid: function() {
					StaffOrgAction.qryAllOrgList(function(status) {
						var orgListRaw = [];
						if (status.z_d_r != undefined){
							orgListRaw = status.z_d_r;
						}
						else
						{
							orgListRaw = status;
						}
						fish.forEach(orgListRaw, function(org) {
							org.orgInfo = org.orgName + "(" + org.orgCode + ")";
						});
						var orgList = portal.utils.getTree(orgListRaw, "orgId",
							"parentOrgId", null);
						var $grid = that.getActiveTabGrid();
						$grid.grid("reloadData", orgList);
						if (orgList.length > 0) {
							$grid.grid("setSelection", orgList[0]);
						}
					});
				},
				rowExpandCallback: function(ee, rowdata) {
				},
				rowSelectCallback: function(ee, rowid, state) {
					var orgId = rowid;
					StaffOrgAction.qryStaffUserInfoByOrgId(orgId, function(status) {
						var staffList = status || [];
						var list = [];
						fish.forEach(staffList, function(result) {
							var dto = fish.extend({}, result, {_chkd_: false});							
							list.push(dto);
						});
						fish.forEach(list, function(staffInOrg) {
							if (staffInOrg.staffId == that._staff.staffId) {
								staffInOrg._chkd_ = true;
							}
							fish.forEach(that._superiors, function(supStaff) {
								if (staffInOrg.staffId == supStaff.staffId) {
									staffInOrg._chkd_ = true;
								}
							});
						});
						that.grantItemsU.reset(list);
					});
				}
			};

			this.grantItemsU = new StaffItems();
			this.grantItemsD = new StaffItems();

			this.colModelU = [{
				name: 'staffId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'staffName',
				label: this.i18nData.STAFFORG_STAFF_NAME,
			}, {
				name: 'staffCode',
				label: this.i18nData.STAFFORG_STAFF_CODE
			}];

			this.colModelD = [{
				name: 'staffId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'staffName',
				label: this.i18nData.STAFFORG_STAFF_NAME,
			}, {
				name: 'staffCode',
				label: this.i18nData.STAFFORG_STAFF_CODE
			}];

			return Grant3View.prototype.initialize.call(this);
		},

		afterRender: function() {
			Grant3View.prototype.afterRender.call(this);
			this.reload();
		},

		reload: function() {
			Grant3View.prototype.reload.call(this);
			if (this._superiors.length > 0) {
				fish.forEach(this._superiors, function(sup) {
					sup._disa_ = true;
				});
				this.grantItemsD.reset(this._superiors);
			}
		},

		grantConfirm: function(selrows, success) {
			var selIds = fish.pluck(selrows, "staffId").join(),
				that = this;
			StaffOrgAction.qryCurrentStaffDescendants({
				staffId: this._staff.staffId,
				staffIdsInList: selIds
			}, function(status) {
				var usedStaffs = status || [];
				if (usedStaffs.length > 0) {
					var staffNames = fish.pluck(usedStaffs, "staffName").join();
					fish.warn(fish.compile(that.i18nData.STAFFORG_STAFF_HAS_DESC_TO_BE_SUPER)({
						_0: staffNames
					}));
				} else {
					success(selrows);
				}
			});
		},

		degrantConfirm: function(selrows, success) {
			var availSups = fish.reject(selrows, function(sup) {
				return sup._disa_;
			});
			selrows.length = 0;
			$.each(availSups, function(idx, row) {
				selrows.push(row);
			});
			success();
		},

		confirm: function() {
			var selsups = fish.map(this.grantItemsD.filter(function(item) {
				return item.get('_disa_') ? false : true;
			}), function(m) {return m.toJSON()});
			if (selsups.length > 0) {
				this.popup.close(selsups);
			} else {
				fish.info(this.i18nData.STAFFORG_PLS_SEL_SUP_STAFF);
			}
		}
	});
});