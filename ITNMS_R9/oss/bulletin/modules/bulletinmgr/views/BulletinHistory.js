define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinHistory.html",
	'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
	'bulletin/modules/bulletinmgr/actions/BulletinAction',
	'text!bulletin/modules/bulletinmgr/templates/BulletinGrid.html'
], function(bulletinTpl, i18nBulletin, bulletinAction, gridRowEdit) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinTpl),
		rowEditTemplate: fish.compile(gridRowEdit),
		events: {
			"click .js-query": "query",
			"click .js-add": "addBulletin",
			"click .js-edit": "editBulletin"
		},

		initialize: function() {
		
		},

		render: function() {
			i18nBulletin.STATE = 'Y';
			this.gridCellDelHtml = this.rowEditTemplate(i18nBulletin);
			this.$el.html(this.template(i18nBulletin));
		},

		afterRender: function() {
			var that = this;
			that.$queryForm = that.$(".js-bulletin-query");	
			that.$detailForm = that.$(".js-bulletin-detail");		
			that.$detailForm.form('disable');
			that.$queryForm.find("[name='startDate']").datetimepicker();
			that.$queryForm.find("[name='endDate']").datetimepicker();
			that.$queryForm.find("[name='effStartDate']").datetimepicker();
			that.$queryForm.find("[name='effEndDate']").datetimepicker();
			that.$queryForm.find("[name='expStartDate']").datetimepicker();
			that.$queryForm.find("[name='expEndDate']").datetimepicker();
			that.$queryForm.find("[name='state']").combobox();
			bulletinAction.qryAllType(function(data){
				var allType = [];
				if (data && data.length > 0){
					allType = fish.nest(data, 'typeId', 'parentTypeId', 'children');
				}
				that.$("[name='typeId']").combotree({
					placeholder: i18nBulletin.COMMON_PLS_SEL,
					data: {
						key: {
							children: 'children',
							name: 'typeName',

						}
					},
					dataValueField: "typeId",
					fNodes: allType
				});				
			});
			bulletinAction.qryBulletinLevel(function(data){
				that.$("[name='levelId']").combobox({			
					placeholder: i18nBulletin.COMMON_PLS_SEL,
					dataTextField: 'levelName',
					dataValueField: 'levelId',
					dataSource: data
				});				
			});
			that.auditStaffPop = that.$("[name='auditStaffId']").popedit({
				dataTextField: "Text",
				dataValueField: "Value",
				open: function() {
					fish.popupView({
						url: "stafforg/modules/stafforg/views/OrgStaffSelPopWin",
						viewOption: {
							// resource: this.jobResource,
							onlyOne: true
						},
						close: function(msg) {
							that.auditStaffPop.popedit("setValue", {
								Value: msg[0].staffId,
								Text: msg[0].staffName
							});
						}.bind(this)
					});
				},
			});
			that.staffPop = that.$("[name='staffId']").popedit({
				dataTextField: "Text",
				dataValueField: "Value",
				open: function() {
					fish.popupView({
						url: "stafforg/modules/stafforg/views/OrgStaffSelPopWin",
						viewOption: {
							// resource: this.jobResource,
							onlyOne: true
						},
						close: function(msg) {
							that.auditStaffPop.popedit("setValue", {
								Value: msg[0].staffId,
								Text: msg[0].staffName
							});
						}.bind(this)
					});
				},
			});
			that.$grid = that.$(".js-history-grid").grid({
				colModel: [{
					name: 'bulletinId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'title',
					label: i18nBulletin.BULLETIN_TITLE,
					width: '10%'
				}, {
					name: 'typeName',
					label: i18nBulletin.BULLETIN_TYPE_NAME,
					width: "10%"	
				}, {
					name: 'levelName',
					label: i18nBulletin.BULLETIN_LEVEL_NAME,
					width: "10%"
				}, {
					name: 'state',
					label: i18nBulletin.BULLETIN_STATE,
					width: "10%",
					formatter : "select",
					formatoptions : {
						value : {
							'A' : i18nBulletin.BULLETIN_STATE_PUBLISH,
							'C' : i18nBulletin.BULLETIN_STATE_AUDIT,
							'S' : i18nBulletin.BULLETIN_STATE_DRAFT,
							'N' : i18nBulletin.BULLETIN_STATE_DISAPPROVE,
							'X' : i18nBulletin.BULLETIN_STATE_DELETE,
							'R' : i18nBulletin.BULLETIN_STATE_RETRIEVED
						}
					}					
				}, {
					name: 'createdDate',
					label: i18nBulletin.BULLETIN_CREATE_DATE,
					width: "10%"
				}, {
					name: 'effDate',
					label: i18nBulletin.BULLETIN_EFFDATE,
					width: "10%"				
				}, {
					name: 'expDate',
					label: i18nBulletin.BULLETIN_EXPDATE,
					width: "10%"	
				}, {
					name: 'auditStaffName',
					label: i18nBulletin.BULLETIN_AUDIT_STAFF,
					width: "10%"	
				}, {
					name: 'contentText',
					label: i18nBulletin.BULLETIN_CONTENT,
					width: "10%"			
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
				pager: true,
				datatype: 'json',
				pageData: function() {that.pageData(false);},
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent,
						rowdata = that.$grid.grid("getRowData", rowid);	
					that.$detailForm.form("value", rowdata);					
					if (e && e.target) {
						switch ($(e.target).attr('action')) {
						case 'delete':
							that.deleteBulletin(rowid, rowdata);
							break;						
						case 'record':
							this.showReadRecord(rowdata);
							break;
						default:
							break;
						}
					}
				}.bind(this)
				
			});
			
			this.pageData(true);
		},
		
		deleteBulletin: function(rowid, rowdata) {
			//删除表数据
			var that = this;
			fish.confirm(i18nBulletin.BULLETIN_DEL_CONFIRM,function() {
				bulletinAction.delPhysicalBulletin(rowdata.bulletinId, function() {
					var selrow = that.$grid.grid("getRowData",rowid);
					var nextrow = that.$grid.grid("getNextSelection", selrow); //获取下一条数据
					if (nextrow == null) {
						nextrow = that.$grid.grid("getPrevSelection", selrow); //获取上一条同级数据
					}
					if (nextrow == null) {
						nextrow = that.$grid.grid("getNodeParent", selrow);
					}
					that.$grid.grid("delTreeNode", selrow);
					if (nextrow != null) {
						that.$grid.grid("setSelection", nextrow);
					}
					fish.success(i18nBulletin.BULLETIN_DEL_SUCCESS);
				});
			}, $.noop);
			return false;
		},
		showReadRecord: function(rowdata){
			var that = this;
			fish.popupView({
				url: "bulletin/modules/bulletinmgr/views/BulletinRecordPopWin",
				viewOption: {
					data: rowdata
				}
			});
		},

		query: function() {			
			this.pageData(true);
		},

		pageData: function(reset) {
			var that = this;
			var param = that.$(".js-bulletin-query").form('value');
			
			// bulletinAction.qryBulletinListCount(param, function(data) {
				// var count = Number(data);
				var pageLength = that.$grid.grid("getGridParam", "rowNum"),
				    page = reset ? 1 : that.$grid.grid("getGridParam", "page"),
					sortname = that.$grid.grid("getGridParam", "sortname"),
					sortorder = that.$grid.grid("getGridParam", "sortorder");
				var filter = {
					pageIndex: page-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				bulletinAction.qryBulletinListByPageInfo(param, filter,
					function(data) {
						if(data){
							var bulletinList = data.list || [];
							// fish.forEach(bulletinList, function(user) {
							// 	that.normalizeDate(user);
							// }, this);
							that.$grid.grid("reloadData", {
								'rows': bulletinList,
								'page': page,
								'records': data.total
							});
						
							if (bulletinList.length > 0) {
								that.$grid.grid("setSelection", bulletinList[0]);
							// } else {
							// 	that.$detailForm.form('clear');
							// 	that.$detailForm.form('disable');
							// 	that.$(".js-edit").prop("disabled", true);
							// 	fish.info(I18N.HINT_SEARCH_MATCH_NULL);
							}
						}
					}
						
				);
			// });
		},

		resize : function(delta) {
			portal.utils.gridIncHeight(this.$(".js-history-grid"),	delta);
		}
	})
});
