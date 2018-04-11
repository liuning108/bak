define([
	"text!bulletin/modules/bulletinmgr/templates/RecipientSelPopWin.html",
	"stafforg/modules/stafforg/actions/StaffOrgAction",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	"i18n!bulletin/modules/bulletinmgr/i18n/bulletin",
], function(template, staffOrgAction, i18nStaff, i18nBulletin) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		resource: fish.extend({}, i18nStaff, i18nBulletin),
		events: {
			"click .js-ok": "okClick"
		},

		initialize: function(options) {			
			this.selected = options.selected;
			fish.on("rowChecked", this.rowChecked.bind(this));
			fish.on("rowUnChecked", this.rowUnChecked.bind(this));
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {	
			var that = this;
			that.$(".js-stafforg").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
					case "tabs-org":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/RecipientOrg.js",
							selector: "#tabs-org"							
						});
						break;
					case "tabs-staff":
						that.requireView({
							url: "bulletin/modules/bulletinmgr/views/RecipientStaff.js",
							selector: "#tabs-staff"							
						});
						break;					
					default:
						break;
					}
				}
			});		
			that.recipientGrid = that.$(".js-recipient-grid").grid({
				colModel: [{			
					name: '_id_',					
					hidden: true
				}, {		
					name: 'type',
					label: that.resource.BULLETIN_TYPE_NAME,
					width: "45%",
					formatter : "select",
					formatoptions : {
						value : {
							'0' : that.resource.STAFFORG_STAFF,
							'1' : that.resource.STAFFORG_ORG
						}
					}
				}, {
					name: "partyCode",
					label: that.resource.BULLETIN_PARTY_CODE,
					width: "45%",
					sortable: false,
					search: true		
				}, {
					name: 'operate',
					label: '',
					sortable: false,					
					formatter: 'actions',
					width: "10%",
					formatoptions: {						
						delbutton: true,
						editbutton: false				
					}				
				}],
				caption: that.resource.BULLETIN_RECIPIENT_LIST,
				beforeDeleteRow: function(e, rowid, rowdata) {					
					var selrow = that.recipientGrid.grid("getRowData",rowid);
					var nextrow = that.recipientGrid.grid("getNextSelection", selrow); //获取下一条数据
					if (nextrow == null) {
						nextrow = that.recipientGrid.grid("getPrevSelection", selrow); //获取上一条同级数据
					}
					if (nextrow == null) {
						nextrow = that.recipientGrid.grid("getNodeParent", selrow);
					}
					that.recipientGrid.grid("delRowData", selrow);
					if (nextrow != null) {
						that.recipientGrid.grid("setSelection", nextrow);
					}					
				
					return false;
				}
			});
			if (this.selected){
				that.recipientGrid.grid("reloadData", this.selected);
			}
		},
		rowChecked: function(rowData, type){
			var that = this;
			var allData = that.recipientGrid.grid("getRowData");
			if (rowData instanceof Array){
				//如果是全选，需要先把之前勾选的数据清掉
				// var allData = that.recipientGrid.grid("getRowData");
				for (var i in allData){
					if (allData[i].type == 1){
						that.recipientGrid.grid("delRowData", allData[i]);
					}
				}
				that.recipientGrid.grid("addRowData", rowData, 'last');
			}
			else {
				var has = false;
				for(var i in allData){
					if(allData[i].partyCode == rowData.partyCode && allData[i].type == rowData.type+''){
						has = true;
						break;
					}
				}
				if (!has){
					that.recipientGrid.grid("addRowData", rowData, 'last');
				}				
			}			
		},
		rowUnChecked: function(rowData, type){
			var that = this;
			if (rowData instanceof Array){
				//如果是全选，需要先把之前勾选的数据清掉
				var allData = that.recipientGrid.grid("getRowData");
				for (var i in allData){
					if (allData[i].type == 1){
						that.recipientGrid.grid("delRowData", allData[i]);
					}
				}
				for(var idx in rowData){
					that.recipientGrid.grid("delRowData", rowData[idx]);
				}
			}
			else{
				
				that.recipientGrid.grid("delRowData", rowData);
			}			
		},
		okClick: function() {
			var selectedData = this.recipientGrid.grid("getRowData");
			this.popup.close(selectedData);			
		},
		cleanup: function(){
			fish.off("rowChecked");    
			fish.off("rowUnChecked");            
        }
	});
});