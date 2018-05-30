define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinCreate.html",
	'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
	'bulletin/modules/bulletinmgr/actions/BulletinAction',
	'text!bulletin/modules/bulletinmgr/templates/BulletinGrid.html'
], function(bulletinTpl, i18nBulletin, bulletinAction, gridRowEdit) {
	return portal.BaseView.extend({
		template: fish.compile(bulletinTpl),
		rowEditTemplate: fish.compile(gridRowEdit),	
		events: {
			"click .js-query": "query",
			// "click .js-add": "addBulletin",
			// "click .js-edit": "editBulletin"
		},

		initialize: function(option) {
			// this.
		},

		render: function() {
			i18nBulletin.STATE = 'N';
			i18nBulletin.BULLETIN_GRID_READ_RECORD = i18nBulletin.COMMON_DETAIL;
			this.gridCellDelHtml = this.rowEditTemplate(i18nBulletin);
			this.$el.html(this.template(i18nBulletin));
		},

		afterRender: function() {
			var that = this;
			that.$queryForm = that.$(".js-bulletin-query");
			// that.$detailForm = that.$(".js-bulletin-detail");
			// that.$detailForm.form("disable");
			that.$queryForm.find("[name='startDate']").datetimepicker();
			that.$queryForm.find("[name='endDate']").datetimepicker();
			that.$grid = that.$(".js-bulletin-grid").grid({
				colModel: [{
					name: 'bulletinId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'title',
					label: i18nBulletin.BULLETIN_TITLE,
					width: '45%'
				}, {
					name: 'typeName',
					label: i18nBulletin.BULLETIN_TYPE_NAME,
					width: "15%"	
				}, {
					name: 'levelName',
					label: i18nBulletin.BULLETIN_LEVEL_NAME,
					width: "15%"	
				}, {
					name: 'createdDate',
					label: i18nBulletin.BULLETIN_CREATE_DATE,
					width: "15%"				
				}, {
					name: 'operate',
					label: '',
					sortable: false,		
					width: "10%",
					formatter: function(cellValue, rowId, rowData) {
						return that.gridCellDelHtml;
					}
				}],				
				data: [],			
				pager: true,
				datatype: 'json',
				pageData: function() {this.pageData(false);},
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent,
						rowdata = that.$grid.grid("getRowData", rowid);					
					if (e && e.target) {
						switch ($(e.target).attr('action')) {									
						case 'record':
							this.showDetail(rowdata);
							break;
						default:
							break;
						}
					}
				}.bind(this)
			
			});			

			this.pageData(true);
		},
		
		showDetail: function(rowdata){
			fish.popupView({
				url: "bulletin/modules/bulletinmgr/views/BulletinDetailPopWin",
				viewOption: {
					title: rowdata.title,
					content: rowdata.content,
					typeName: rowdata.typeName,
					levelName: rowdata.levelName,
					stateDate: rowdata.stateDate
				},
				height: 500
			});
		},		

		query: function() {			
			this.pageData(true);
		},

		pageData: function(reset) {
			var that = this;
			var qryCondition = that.$queryForm.form('value');
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
			bulletinAction.queryBulletinByStaffId(qryCondition, filter, function(data) {			
				if(data){
					var bulletinList = data.list || [];						
					that.$grid.grid("reloadData", {
						'rows': bulletinList,
						'page': page,
						'records': data.total
					});
				
					if (bulletinList.length > 0) {
						that.$grid.grid("setSelection", bulletinList[0]);
					}
				}
			});			
				
			// });
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$(".js-bulletin-grid"),	delta);
			// this.$(".js-bulletin-grid").grid("setGridHeight", this.$(".js-bulletin-grid").parent().parent().parent().parent().parent().parent().height() - this.$(".js-bulletin-grid").parent().parent().parent().outerHeight(true) + this.$(".js-bulletin-grid").height());
			
		}
	})
});
