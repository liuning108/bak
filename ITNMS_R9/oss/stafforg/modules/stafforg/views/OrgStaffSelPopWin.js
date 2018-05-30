define([
	"text!stafforg/modules/stafforg/templates/OrgStaffSelPopWin.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
], function(template, staffOrgAction, i18nStaff) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		resource: fish.extend({}, i18nStaff),
		events: {
			"click .js-ok": "okClick"
		},

		initialize: function(options) {			
			this.onlyOne = options.onlyOne;
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			this.orgTree = this.$(".js-org-grid").grid({
				//height:320,
				colModel: [{
					name: 'orgId',
					key: true,
					hidden: true
				}, {
					name: 'orgName',
					label: i18nStaff.STAFFORG_ORG_NAME,
					sortable: false,
					search: true,
					width: "50%",
				}, {
					name: "orgCode",
					label: i18nStaff.STAFFORG_ORG_CODE,
					sortable: false,
					search: true,
					width: "50%",	
				}],
				treeGrid: true,
				/*treeIcons: {
				    plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: "orgName",
				searchbar: true,
				onSelectRow: this.onChangeRow.bind(this),
				onChangeRow: this.onChangeRow.bind(this),
				//onRowExpand: this.expandRowCommon.bind(this)
				onRowExpand: function(e, rowdata, target) {
				    this.expandRowCommon(rowdata);
				}.bind(this)
            });

            this.staffGrid = this.$(".js-staff-grid").grid({
				//height:320,
				searchbar: true,
				colModel: [{
					name: 'staffId',
					key: true,
					hidden: true
				}, {
					name: 'staffName',
					label: i18nStaff.STAFFORG_STAFF_NAME,
					width: "15%",
					sortable: false,
					search: true
				}, {
					name: "userCode",
					label: i18nStaff.COMMON_USER_CODE,
					width: "15%",
					sortable: false,
					search: true						
				}],
				// toolbar: [true, 'bottom'],
				multiselect: true			
			});
            staffOrgAction.qryRootOrgListByStaffId(function(data) {				
				if (data.length > 0) {
					fish.forEach(data, function(org) {
                        org.children = []; 
                    }.bind(this));
                }
				this.orgTree.jqGrid("reloadData", data);
				this.orgTree.jqGrid("setSelection", data[0]);
			}.bind(this));

		},
		expandRowCommon: function(rowdata) {
			//var rowdata = this.orgTree.grid('getSelection');
			var that = this;
		    that.orgTree.grid("setSelection", rowdata);
            if (!rowdata.loaded) { 
            	if(!isNaN(rowdata.orgId)) 
				{ 
            		staffOrgAction.queryOrgListByParentId(rowdata.orgId, function(data) {
	                    var orgList = data || [];
	                    var rows = [];
	                    if (orgList.length > 0) {
	                        fish.forEach(orgList, function(org) {
	                        	org.children = []; 
	                            rows[rows.length] = org;
	                        }.bind(that));
	                        this.orgTree.grid("addChildNodes", rows, rowdata); 
	                    }
	                }.bind(that));
	                rowdata.loaded = true;
				}
				else
				{
					fish.info(resource.STAFFORG_ORG_NEW_ERROR);
				}                
            }
		},
		onChangeRow: function() {
			var that = this;
			that.org = that.orgTree.grid('getSelection');
			if (that.org) {				
				staffOrgAction.queryStaffByOrgId(that.org.orgId, function(data) {
					that.qryCallBack(data);
				});
			}
		},
		qryCallBack: function(data) {
			var staffs = null;
			if (data && data.length > 0) {
				staffs = data;
			} else {
				staffs = [];
			}
			this.staffGrid.grid("reloadData", staffs);
			if (staffs.length > 0) {
				this.staffGrid.grid("setSelection", staffs[0]); //选择第一条记录
			} 
		},
		okClick: function() {
			var selectedData = this.staffGrid.grid("getCheckRows");
			if (this.onlyOne == undefined){
				if (selectedData.length > 0) {
					this.popup.close(selectedData);
				} else {
					fish.warn(this.resource.STAFFORG_STAFF_SEL_IS_EMPTY);
				}
			}
			if (this.onlyOne){
				if (selectedData.length == 1) {
					this.popup.close(selectedData);
				}
				else if (selectedData.length == 0) {
					fish.warn(this.resource.STAFFORG_STAFF_SEL_IS_EMPTY);
				}
				else{
					fish.warn(this.resource.STAFFORG_STAFF_SEL_ONLY_ONE);
				}
			}
		}
	});
});