define([
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	'text!stafforg/modules/stafforg/templates/StaffRelaMgrPopWin.html',
	'i18n!stafforg/modules/stafforg/i18n/stafforg'
], function(StaffOrgAction, staffRelaMgrPWTpl, i18nStaffOrg) {
	return portal.BaseView.extend({
		template: fish.compile(staffRelaMgrPWTpl),

		events: {
			"click .js-add-sups": 'addSuperiors',
			"click .js-rem-sups": 'remSuperiors',
			"click .js-set-curr-sub,.js-set-curr": "setCurrent"
		},

		initialize: function(options) {
			this._staff = options.STAFF;
		},

		render: function() {
			this.setElement(this.template(i18nStaffOrg));
		},

		afterRender: function() {
            var that = this,
            	$btnsup = this.$(".js-grid-sup").next().children("ul"),
            	$btnsub = this.$(".js-grid-sub").next().children("ul"),
            	$supgrid = this.$(".js-grid-sup").grid({
            		caption:i18nStaffOrg.STAFFORG_SUPERIORS,
            	colModel: [{
            		name: "staffId",
            		label: "",
            		key: true,
            		hidden: true
            	}, {
            		name: "staffName",
            		label: i18nStaffOrg.STAFFORG_STAFF_NAME
            	}, {
            		name: "staffCode",
            		label: i18nStaffOrg.STAFFORG_STAFF_CODE
            	}],
            	multiselect: true,
            	pagebar: true,
            	onSelectRow: function(ee, rowid, state, checked) {
            		that.updateBtn();
            	},
//            	create: function() {
//            		var $grid = that.$(".js-grid-sup");
//            		var grid_id = $grid.attr("id");
//            		var $td = $grid.find("#tb_" + grid_id);
//            		$td.append($btnsup);
//            		var $rembtn = $grid.find(".js-rem-sups");
//            		$rembtn.attr("disabled", "disabled");
//            		$rembtn.prop("disabled", true);
//            	}
            }),
            $subgrid = this.$(".js-grid-sub").grid({
            	caption:i18nStaffOrg.STAFFORG_SUBORDINATES,
            	colModel: [{
            		name: "staffId",
            		label: "",
            		key: true,
            		hidden: true
            	}, {
            		name: "staffName",
            		label: i18nStaffOrg.STAFFORG_STAFF_NAME
            	}, {
            		name: "staffCode",
            		label: i18nStaffOrg.STAFFORG_STAFF_CODE
            	}],
            	multiselect: true,
            	pagebar: true,
            	//height: 320,
            	//toolbar: [true, 'bottom'],
            	treeGrid: true,
            	expandColumn: "staffName",
            	onSelectRow: function(ee, rowid, state, checked) {
            		var rowdata = $subgrid.grid("getRowData", rowid);
            		if (!rowdata.childrenLoaded) {
                		StaffOrgAction.qryStaffRelaJoinStaff1InfoList({
                			rela: "1",
                			staff2: rowdata.staffId,
                			state: 'A'
                		}, function(status) {
                			var subStaffList = status || [];
                			rowdata.childrenLoaded = true;
                			if (subStaffList.length > 0) {
                   				$subgrid.grid("addChildNodes", subStaffList, rowdata);
                			}
                		});
            		}
            		var $setcurrbtn = $btnsub.find(".js-set-curr");
            		$setcurrbtn.removeAttr("disabled");
					$setcurrbtn.prop("disabled", false);
            	// },
	           	// create: function() {
	           	// 	var $grid = that.$(".js-grid-sub");
	           	// 	var grid_id = $grid.attr("id");
	           	// 	var $td = $grid.find("#" + grid_id + "_pager_left");
	           	// 	$td.append($btnsub);
	           	}
            });
            this.$("form").form();
            this.$("form").form('disable');

            $subgrid.grid("navButtonAdd",[{
            	caption: i18nStaffOrg.STAFFORG_SET_CURR,
            	cssprop: "js-set-curr-sub"
            }]);
            $supgrid.grid("navButtonAdd", [{
            	caption: i18nStaffOrg.STAFFORG_ADD_SUPS,
            	cssprop: "js-add-sups"
            }, {
            	caption: i18nStaffOrg.STAFFORG_REM_SUPS,
            	cssprop: "js-rem-sups"
            }, {
            	caption: i18nStaffOrg.STAFFORG_SET_CURR,
            	cssprop: "js-set-curr"
            }]);

            this.initByStaff(this._staff);
		},

		initByStaff: function(staff) {
			var $supgrid = this.$(".js-grid-sup"),
				$subgrid = this.$(".js-grid-sub"),
				that = this;

            this.$("form").form('value', this._staff);

            StaffOrgAction.qryStaffRelaJoinStaff2InfoList({
				rela: "1",
				staff1: staff.staffId,
				state: "A"
			}, function(status) {
				var superiorList = status || [];
				$supgrid.grid("reloadData", superiorList);
				if (superiorList.length > 0) {
					$supgrid.grid("setSelection", superiorList[0]);
				}
				that.updateBtn();
			});
            $subgrid.grid("reloadData", [staff]);
            $subgrid.grid("setSelection", staff);
		},

		addSuperiors: function() {
			var that = this,
				$supgrid = this.$(".js-grid-sup"),
				allsups = $supgrid.grid("getRowData");
			fish.popupView({
				url: "stafforg/modules/stafforg/views/SelStaffInAllOrgPopWin",
				viewOption: {
					STAFF: that._staff,
					SUPERIORS: allsups
				},
				close: function(msg) {
					var staffList = msg;
					var staffRelaList = [];
					fish.forEach(staffList, function(staff) {
						staffRelaList.push({
							staff1: that._staff.staffId,
							staff2: staff.staffId,
							rela: 1
						});
					});
					StaffOrgAction.addStaffRela(staffRelaList, function(status) {
						var $supgrid = that.$(".js-grid-sup");
						fish.forEach(staffList, function(staff) {
							staff.staff1 = that._staff.staffId;
							staff.staff2 = staff.staffId;
							rela: 1;
						});
						$supgrid.grid("addRowData", staffList, 'last');
					});
				}
			});
		},

		updateBtn: function() {
			var $supgrid = this.$(".js-grid-sup"),
				$rembtn = $supgrid.find(".js-rem-sups"),
				$setcurrbtn = $supgrid.find(".js-set-curr");
			if ($supgrid.grid("getCheckRows").length > 0) {
    			$rembtn.removeAttr("disabled");
    			$rembtn.prop("disabled", false);
    		} else {
    			$rembtn.attr("disabled", "disabled");
    			$rembtn.prop("disabled", true);
    		}
			if ($supgrid.grid("getRowData").length > 0) {
				$setcurrbtn.removeAttr("disabled");
				$setcurrbtn.prop("disabled", false);
			} else {
				$setcurrbtn.attr("disabled", "disabled");
				$setcurrbtn.prop("disabled", true);
			}
		},

		remSuperiors: function() {
			var $supgrid = this.$(".js-grid-sup"),
				selrows = $supgrid.grid("getCheckRows"),
				that = this;
			fish.confirm(i18nStaffOrg.STAFFORG_REM_SUPS_CONFIRM,function() {
					// var pickedSelrows = []
					// fish.forEach(selrows, function(sel){
					// 	var pickedSel = fish.pick(sel, "rela","spId","staff1","staff2","state","staffName");
					// 	pickedSelrows.push(pickedSel);
					// });
					StaffOrgAction.delStaffReal(selrows, function(result) {
						fish.forEach(selrows, function(row) {
							$supgrid.grid("delRowData", row);
							fish.success(i18nStaffOrg.STAFFORG_REM_SUPS_SUCCESS);
							that.updateBtn();
						});
					});
				}, $.noop);
		},

		setCurrent: function(event) {
			var setType = $(event.target)[0].className.indexOf('js-set-curr-sub');
			if (setType > 0) {
				this._staff = this.$(".js-grid-sub").grid("getSelection");
			}
			else
			{
				this._staff = this.$(".js-grid-sup").grid("getSelection");
			}
			if(this._staff.childrenLoaded){
				this._staff.childrenLoaded = false;
			}
			this._staff.isLeaf = false;
			delete this._staff.parent;
			this.initByStaff(this._staff);
		}
	});
});