define([
	"text!datapriv/modules/dataprivmgr/templates/DataPriv.html",
	"datapriv/modules/dataprivmgr/actions/DataPrivMgrAction",
	"i18n!datapriv/modules/dataprivmgr/i18n/dataprivmgr"
], function(tpl,DataPrivMgrAction, i18nDataPrivMgr) {
	return portal.BaseView.extend({

		events: {
			"click .js-grant-to-user": 'grant2User',
			"click .js-grant-to-role": 'grant2Role'
		},

		i18nData: fish.extend({},i18nDataPrivMgr),

		initialize: function() {
		},

		render: function() {
			this.$el.html(tpl);
		},

		afterRender: function() {
			this.$(".grid").grid({
				colModel: [{
					name: "dataPrivId",
					label: i18nDataPrivMgr.DATA_PRIV_ID,
					hidden: true,
					key: true
				}, {
					name: "dataPrivName",
					label: i18nDataPrivMgr.DATA_PRIV_NAME,
					width: "20%"
				}, {
					name: "dataPrivCode",
					label: i18nDataPrivMgr.DATA_PRIV_CODE,
					width: "10%"
				}, {
					name: "dataTypeStr",
					label: i18nDataPrivMgr.DATA_TYPE,
					width: "10%"
				}, {
					name: "dataSrc",
					label: i18nDataPrivMgr.DATA_SRC,
					width: "30%"
				}, {
					name: "comments",
					label: i18nDataPrivMgr.COMMON_REMARKS,
					width: "30%"
				}],
				pagebar: true,
				onSelectRow: function(e, rowid, state) {
					var rowdata = this.$(".grid").grid("getRowData", rowid);
					this.dataPriv = rowdata;
					if (this.dataPriv.dataType === 'L') {
						DataPrivMgrAction.qryDataPrivValueListByDataSrc(
						this.dataPriv.dataSrc, function(status) {
							this.dataPriv.valueList = status;
						}.bind(this));
					}				
				}.bind(this)
			});
			this.$(".grid").grid("navButtonAdd",[{
                caption: i18nDataPrivMgr.DATAPRIVMGR_GRANT_TO_USER,
                cssprop: "js-grant-to-user"
            },{	
                caption: i18nDataPrivMgr.DATAPRIVMGR_GRANT_TO_ROLE,
                cssprop: "js-grant-to-role"
            }]);	
			this.loadGrid();
		},

		loadGrid: function() {
			DataPrivMgrAction.qryDataPrivList(function(status) {
				var dataPrivList = status || [];
				fish.forEach(dataPrivList, function(dataPriv) {
					switch(dataPriv.dataType) {
					case 'L':
						dataPriv.dataTypeStr = i18nDataPrivMgr.DATAPRIVMGR_LIST;
						break;
					case 'T':
						dataPriv.dataTypeStr = i18nDataPrivMgr.DATAPRIVMGR_TEXT;
						break;
					default:
						// console.warn("Unknown data priv type");
					}
				}, this);
				this.$(".grid").grid("reloadData", dataPrivList);
				if (dataPrivList.length > 0) {
					this.$(".grid").grid("setSelection", dataPrivList[0]);
				} else {
					this.$(".js-grant-to-user").attr("disabled", "disabled");
					this.$(".js-grant-to-user").prop("disabled", true);
					this.$(".js-grant-to-role").attr("disabled", "disabled");
					this.$(".js-grant-to-role").prop("disabled", true);
				}
			}.bind(this));
		},

		grant2User: function() {
			fish.popupView({
            	url:'datapriv/modules/dataprivmgr/views/UserDataPriv',
            	viewOption: {dataPriv: this.dataPriv}            	
            });			
		},

		grant2Role: function() {
			fish.popupView({
            	url:'datapriv/modules/dataprivmgr/views/RoleDataPriv',
            	viewOption: {dataPriv: this.dataPriv}            	
            });	
		},

		resize: function(delta) {
			var hgrid = this.$(".grid").height() + delta;
			this.$(".grid").grid('setGridHeight', hgrid);
			return this;
		}
	});
});