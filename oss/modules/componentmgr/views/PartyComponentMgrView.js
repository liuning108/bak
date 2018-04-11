define([
	'text!modules/componentmgr/templates/PartyComponentMgrTemplate.html',
	'i18n!modules/componentmgr/i18n/componentmgr',
	'modules/componentmgr/actions/ComponentAction',
	'text!modules/common/templates/GridCellEditAndDeleteTemplate.html'
], function(partyCompnentMgrTemplate, i18nComponentMgr, componentAction, gridCellEditAndDeleteTemplate) {
	var PartyComponentMgr = portal.BaseView.extend({
		//className:"container_right panel panel-default",
		template: fish.compile(partyCompnentMgrTemplate),
		gridCellTemplate: fish.compile(gridCellEditAndDeleteTemplate),
		componentGrid: null,
		party: null,
		initialize: function() {
			this.colModel = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: i18nComponentMgr.COMPONENT_NAME,
				width: "30%",
				sortable: false,
				editable: true,
				editrules: i18nComponentMgr.COMPONENT_NAME + ":required;length[1~60, true]"
			}, {
				name: "objId",
				label: i18nComponentMgr.COMPONENT_ID,
				width: "35%",
				sortable: false		
			}, {
				name: "comments",
				label: i18nComponentMgr.COMMON_REMARKS,
				width: "25%",
				sortable: false,
				editable: true,
				editrules: "length[1~120, true]"
			}, {
				name: 'operate',
				label: '',
				formatter: 'actions',
				width: "10%",
				formatoptions: {
					delbutton: true,
					editbutton: true
				}
			}];
			this.on("partyChange", this.partyChange);
		},
		render: function() {
			this.$el.html(this.template(i18nComponentMgr));
			this.gridCellEditHtml = this.gridCellTemplate(i18nComponentMgr);
		},
		afterRender: function() {
			this.componentGrid = this.$(".js-grid-component").grid({
				autowidth: true,
				// height: contentHeight - 21,
				colModel: this.colModel,
				beforeDeleteRow: function(e, rowid, rowdata) {
					var componentData = rowdata;
					fish.confirm(i18nComponentMgr.COMPONENT_SURE_TO_DELETE,function() {
							componentAction.delComponent(componentData.privId, function() {
								fish.success(i18nComponentMgr.COMPONENT_DEL_SUCCESS);
								this.componentGrid.grid("delRowData", rowid);
							}.bind(this));
						}.bind(this), $.noop);
					return false;
				}.bind(this),
				beforeSaveRow: function(e, rowid, rowdata, option) {
					var compInfo = fish.extend({},
						this.componentGrid.grid('getRowData', rowid), rowdata);
					componentAction.modComponentPrivInfo(compInfo, function(status) {
						this.componentGrid.grid('saveRow', rowid, {trigger: false});
						fish.success(i18nComponentMgr.COMPONENT_MOD_SUCCESS);
					}.bind(this));
					return false;
				}.bind(this),
				onChangeRow: function(e, rowid, oldrowid) {
					this.componentGrid.grid("restoreRow", oldrowid);
				}.bind(this)
			});
			return this;
		},
		partyChange: function(party) {
			this.party = party;
			if (this.componentGrid) {
				if (party.type == 0) {
					this.componentGrid.grid("clearGridData");
				} else if (party.type == 1) {
					componentAction.qryActiveComponentInMenu(party.partyId, function(data) {
						var components = null;
						if (data) {
							var components = data;
							this.componentGrid.grid("reloadData", components);
						}
					}.bind(this));
				}
			}
		}
	});
	return PartyComponentMgr;
});
