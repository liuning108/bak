/**
 * [Portal编辑相关的View]
 * @author [wang.hui]
 */
define(["text!modules/portalmgr/templates/PortalEditTemplate.html",
	"modules/portalmgr/actions/PortalAction",
	"i18n!modules/portalmgr/i18n/portalmgr",
	"text!modules/common/templates/GridCellDeleteTemplate.html"
], function(portalEditTemplate, portalAction, i18nData, gridCellDeleteTemplate) {
	var PortalEditView = portal.BaseView.extend({
		events: {
			"click .js-new": 'btnNewPortalClick',
			"click .js-edit": 'btnEditPortalClick',
			"click .js-ok": 'btnOKClick',
			"click .js-cancel": 'btnCancleClick',
		},
		//className: "container_left panel panel-default",
		template: fish.compile(portalEditTemplate),
		gridCellDelTemplate: fish.compile(gridCellDeleteTemplate),
		gridCellDelHtml: "",
		portalGrid: null,
		portalDetailForm: null,
		editAction: null,

		render: function() {
			this.$el.html(this.template(i18nData));
			this.gridCellDelHtml = this.gridCellDelTemplate(i18nData);
			return this;
		},

		afterRender: function() {
			var _this = this;

			this.$(".js-ok").hide();
			this.$(".js-cancel").hide();

			this.portalDetailForm = this.$("#portalDetaiForm").form().form('disable');
			// this.$("#selPortalIndex").combobox({
			// 	dataTextField: 'url',
			// 	dataValueField: 'indexId',
			// 	dataSource: []
			// });
//			this.$("#selChannel").combobox({
//				dataTextField: 'CONTACT_CHANNEL_NAME',
//				dataValueField: 'CONTACT_CHANNEL_ID',
//				dataSource: []
//			});
			this.portalGrid = this.$("#portalList").grid({
				colModel: [{
					name: 'portalId',
					label: i18nData.PORTAL_ID,
					hidden: false,
					key: true,
					width:80,
				}, {
					name: 'portalName',
					label: i18nData.PORTAL_NAME,
					search: true
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					width: 50,
					formatter: function() {
						return _this.gridCellDelHtml;
					}
				}],
				searchbar: true,
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent;
					var portalData = _this.portalGrid.grid('getRowData', rowid);
					_this.editAction = null;
					_this.editActionChange();
					if (e && e.target) {
						var action = $(e.target).attr("action");
						if (action && action == "delete") {
							fish.confirm(i18nData.PORTAL_SURE_TO_DELETE,function() {
									portalAction.delPortal(portalData.portalId, function() {
										fish.success(i18nData.PORTAl_DEL_SUCCESS);
										var selrow = _this.portalGrid.grid("getSelection");
										_this.seekBeforeRemRow(_this.portalGrid, selrow);
										_this.portalGrid.grid("delRowData", selrow);
									});
								}, $.noop);
						}
					}
				},
				onChangeRow: function(e, rowid) {
					_this.onChangeRow();
					var portalData = _this.portalGrid.grid('getSelection');
					_this.trigger("portalChange", portalData);
				}
			});
			// this.portalGrid.prev().children('div').searchbar({
			// 	target: this.portalGrid
			// });

			// portalAction.qryPortalIndexList(function(data) { //查询PortalIndex列表
			// 	if (data) {
			// 		this.$("#selPortalIndex").combobox("option", "dataSource", data);
			// 	}

//				portalAction.qryContactChannelList(function(data) {
//					if (data) {
//						_this.$("#selChannel").combobox("option", "dataSource", data);
//					}

					portalAction.qryPortalList(function(data) {
						if (data) {
							_this.portalGrid.grid("reloadData", data);

							if (data.length > 0) {
								_this.portalGrid.grid("setSelection", data[0]);
							}
						}
					});
//				});
			// });
		},

		seekBeforeRemRow: function($grid, rowdata) {
		    var nextrow = $grid.grid("getNextSelection", rowdata),
                prevrow = $grid.grid("getPrevSelection", rowdata);
		    if (nextrow) {
		        $grid.grid("setSelection", nextrow);
		    } else if (prevrow) {
		        $grid.grid("setSelection", prevrow);
		    }
		},

		btnNewPortalClick: function(event) {
			this.editAction = "NEW";
			this.editActionChange();
		},
		btnEditPortalClick: function(event) {
			this.editAction = "EDIT";
			this.editActionChange();
		},
		btnOKClick: function(event) {
			var _this = this;
			if (this.portalDetailForm.isValid()) { //校验成功
				var portalData = this.portalDetailForm.form('getValue',false);
				if (this.editAction == "NEW") {
					portalAction.addPortal(portalData, function(data) {
						if (data && data.portalId) {
							_this.portalGrid.grid("addRowData", data);
							_this.portalGrid.grid("setSelection", data);
							_this.editAction = null;
							_this.editActionChange();
							fish.success(i18nData.PORTAL_ADD_SUCCESS); //弹出新增portal成功信息
						}
					});
				} else if (this.editAction == "EDIT") {
					var selData = _this.portalGrid.grid("getSelection");
					portalData.portalId = selData.portalId;
					portalAction.editPortal(portalData, function(data) {
						if(data){
							selData.portalName = portalData.portalName;
							selData.indexId = portalData.indexId;
							selData.extraUrl = portalData.extraUrl;
	//						selData.CONTACT_CHANNEL_ID = data.CONTACT_CHANNEL_ID;
							_this.portalGrid.grid("setRowData", selData); //更新DOM
							_this.portalGrid.grid("setSelection", data);
							_this.editAction = null;
							_this.editActionChange(); //执行rowChange事件
							fish.success(i18nData.PORTAL_EDIT_SUCCESS);
						}						
					});
				}
			}
		},
		btnCancleClick: function(event) {
			this.portalDetailForm.resetValid();
			this.editAction = null;
			this.editActionChange();
		},

		onChangeRow: function() {
			var portalData = this.portalGrid.grid('getSelection');
			if(!portalData.extraUrl){
				portalData.extraUrl = "";
			}
			this.portalDetailForm.form('value', portalData).form("disable");
		},

		editActionChange: function() {
			var editShow = true;
			if (this.editAction && this.editAction == "NEW") {
				editShow = false;
				this.portalDetailForm.form('clear').form("enable");
			} else if (this.editAction && this.editAction == "EDIT") {
				editShow = false;
				this.portalDetailForm.form("enable");
			} else {
				editShow = true;
				this.portalDetailForm.form('disable');
				this.onChangeRow();
			}
			if (editShow) {
				this.$(".js-new").show();
				this.$(".js-edit").show();
				this.$(".js-ok").hide();
				this.$(".js-cancel").hide();
			} else {
				this.$(".js-new").hide();
				this.$(".js-edit").hide();
				this.$(".js-ok").show();
				this.$(".js-cancel").show();
			}
		}
	});
	return PortalEditView;
});
