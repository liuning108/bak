define([
	"text!bulletin/modules/bulletinmgr/templates/RecipientStaff.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
], function(template, staffOrgAction, i18nStaff) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		resource: fish.extend({}, i18nStaff),
		
		render: function() {
			this.$el.html(this.template(this.resource));
		},

		afterRender: function() {			
			var that = this;
            that.staffGrid = that.$(".js-staff-grid").grid({
				// height:307,
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
                    name: "partyCode",
                    label: "",
                    hidden: true
                }, {
					name: "type",
					label: "",
					hidden: true	
				}, {
					name: "orgId",
					label: "",
					hidden: true							
				}],
				// toolbar: [true, 'bottom'],
				multiselect: true,				
				onSelectAll: function(ee, checked){		
					
					if (checked){
						var selrows = that.staffGrid.grid("getCheckRows");
						fish.trigger("rowChecked", selrows, 2);
					}
					else{
						var selrows = that.staffGrid.grid("getRowData");
						fish.trigger("rowUnChecked", selrows, 2);
					}
				}			
			});
			that.$(".js-staff-grid thead [type=checkbox]").hide();
			that.$(".js-staff-grid").grid("setGridHeight", $("#tabs-staff").height() + 100);			

            staffOrgAction.qryAllOrgList(function(status) {
				var orgListRaw = [];
				if (status.z_d_r != undefined){
					orgListRaw = status.z_d_r;
				}
				else
				{
					orgListRaw = status;
				}		
				
				var orgList = fish.nest(orgListRaw, "orgId",
					"parentOrgId", 'children');
				that.$("[name='org']").combotree({
					placeholder: that.resource.COMMON_PLS_SEL,
					data: {
						key: {
							children: 'children',
							name: 'orgName'
						}
					},
					fNodes: orgList
				});
				that.$("[name='org']").on('combotree:change', function(e) {
					var id = that.$("[name='org']").combotree("value").orgId;
					staffOrgAction.queryStaffByOrgId(id, function(data) {
						if (data){
							fish.forEach(data, function(staff){
								staff.partyCode = staff.userCode;
								staff.type = 0;
								staff.orgId = id;
							});
							that.staffGrid.grid("reloadData", data);	
							if (data.length > 0){
								that.staffGrid.grid("setSelection", data[0]);
							}
							that.$(".js-staff-grid tbody .jqgrow [type='checkbox']").on("click",function(){
								$(this.parentElement.parentElement).click();
								var selrow = that.staffGrid.grid("getSelection");
								if (this.checked){
									fish.trigger("rowChecked", selrow, 2);
								}
								else{
									fish.trigger("rowUnChecked", selrow, 2);
								}
							});						
						}
					}.bind(this));
				})
			});
		}			
		
	});
});