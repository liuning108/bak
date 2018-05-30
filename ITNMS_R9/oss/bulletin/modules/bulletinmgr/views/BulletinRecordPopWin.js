define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinRecordPopWin.html",
	"bulletin/modules/bulletinmgr/actions/BulletinAction",
	"i18n!bulletin/modules/bulletinmgr/i18n/bulletin",
	"i18n!stafforg/modules/stafforg/i18n/stafforg",
	'text!bulletin/modules/bulletinmgr/templates/BulletinGrid.html'
], function(template, bulletinAction, i18nBulletin, i18nStaffOrg, gridRowEdit) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		resource: fish.extend({}, i18nStaffOrg, i18nBulletin),
		rowEditTemplate: fish.compile(gridRowEdit),
		events: {
			// "click .js-ok": "okClick"
		},

		initialize: function(options) {			
			this.bulletin = options.data;			
		},

		render: function() {			
			i18nBulletin.STATE = 'N';
			this.gridCellDelHtml = this.rowEditTemplate(i18nBulletin);
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {	
			var that = this;			
			that.recordGrid = that.$(".js-record-grid").grid({
				colModel: [{			
					name: 'orgId',					
					hidden: true
				}, {		
					name: 'orgName',
					label: that.resource.STAFFORG_ORG_CODE,
					width: "30%"					
				}, {
					name: "unreadCount",
					label: that.resource.BULLETIN_UNREAD_COUNT,
					width: "30%"
						
				}, {
					name: "readCount",
					label: that.resource.BULLETIN_READ_COUNT,
					width: "30%"						
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					align: 'center',
					formatter: function(cellValue, rowId, rowData) {
						return that.gridCellDelHtml;
					},
					width: "10%"
				}],
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent,
						rowdata = that.recordGrid.grid("getRowData", rowid);	
					// that.$detailForm.form("value", rowdata);					
					if (e && e.target) {
						switch ($(e.target).attr('action')) {										
						case 'record':
							this.showReadRecord(rowdata);
							break;
						default:
							break;
						}
					}
				}.bind(this)
			});
			that.$(".delete").hide();
			// that.recipientGrid.grid("reloadData", this.selected);
			bulletinAction.qryReadRecord(that.bulletin.bulletinId, function(result){
				if(result){
					that.recordGrid.grid("reloadData", result);
				}
			});
		},
		showReadRecord: function(rowdata){
			var that = this;
			fish.popupView({
				url: "bulletin/modules/bulletinmgr/views/BulletinRecordDetailPopWin",
				viewOption: {
					data: rowdata
				}
			});
		}
	});
});