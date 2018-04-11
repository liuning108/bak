define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinRecordPopWin.html",
	"bulletin/modules/bulletinmgr/actions/BulletinAction",
	"i18n!bulletin/modules/bulletinmgr/i18n/bulletin",
	"i18n!stafforg/modules/stafforg/i18n/stafforg"
], function(template, bulletinAction, i18nBulletin, i18nStaffOrg) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		resource: fish.extend({}, i18nStaffOrg, i18nBulletin),
		events: {
			// "click .js-ok": "okClick"
		},

		initialize: function(options) {			
			this.orgRecord = options.data;			
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {	
			var that = this;			
			that.recordGrid = that.$(".js-record-grid").grid({
				colModel: [{			
					name: 'staffId',					
					hidden: true
				}, {		
					name: 'state',
					label: that.resource.BULLETIN_READ_STATE,
					width: "30%",
					formatter : "select",
					formatoptions : {
						value : {
							'Y' : that.resource.BULLETIN_READ_STATE_Y,
							'N' : that.resource.BULLETIN_READ_STATE_N							
						}
					}		
				}, {		
					name: 'staffName',
					label: that.resource.STAFFORG_STAFF_NAME,
					width: "35%"					
				}, {
					name: "viewDuration",
					label: that.resource.BULLETIN_VIEW_DURATION,
					width: "35%"						
				}]
			
			});			
			// that.recipientGrid.grid("reloadData", this.selected);
			bulletinAction.qryReadRecordDetail(that.orgRecord.bulletinId, that.orgRecord.orgId, function(result){
				if(result){
					that.recordGrid.grid("reloadData", result);
				}
			});
		}
		
	});
});