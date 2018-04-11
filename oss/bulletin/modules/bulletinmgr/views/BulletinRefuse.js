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
			"click .js-release": "releaseBulletin",
			// "click .js-edit": "editBulletin"
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
				pager: true,
				datatype: 'json',
				pageData: function() {this.pageData(false);},
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent,
						rowdata = that.$grid.grid("getRowData", rowid);					
					if (e && e.target) {
						switch ($(e.target).attr('action')) {
						case 'delete':
							that.deleteBulletin(rowid, rowdata);
							break;						
						case 'record':
							this.showDetail(rowdata);
							break;
						default:
							break;
						}
					}
				}.bind(this)
			
			});			
			this.$grid.grid("navButtonAdd",[{
                caption: i18nBulletin.BULLETIN_RELEASE_AGAIN,
                cssprop: "js-release"           
			}]);	
			this.$(".js-release").prop("disabled",false);
			this.pageData(true);
		},
		releaseBulletin: function(){
			var that = this;
			var selrow = that.$grid.grid('getSelection');		
			selrow.state = 'C';
			fish.confirm(i18nBulletin.BULLETIN_RELEASE_CONFIRM,function() {
				bulletinAction.modBulletin(selrow, function() {
					// var selrow = that.$grid.grid("getRowData",rowid);
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
					}else{
                        that.$(".js-release").prop("disabled",true);
                    }
					fish.success(i18nBulletin.BULLETIN_RELEASE_AGAIN_SUCCESS);
				});
			}, $.noop);
		},
		
		deleteBulletin: function(rowid, rowdata) {
			var that = this;
			fish.confirm(i18nBulletin.BULLETIN_DEL_CONFIRM,function() {
				bulletinAction.delBulletin(rowdata.bulletinId, function() {
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
					}else{
                        that.$(".js-release").prop("disabled",true);
                    }
					fish.success(i18nBulletin.BULLETIN_DEL_SUCCESS);
				});
			}, $.noop);
			return false;
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
				}
			});
		},		

		query: function() {			
			this.pageData(true);
		},

		pageData: function(reset) {
			var that = this;
			var qryCondition = that.$queryForm.form('value');
			// qryCondition.staffId = portal.appGlobal.get("staffId");
			qryCondition.state = 'N';
			// bulletinAction.qryBulletinListCount(qryCondition, function(data) {
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
				bulletinAction.qryBulletinListByPageInfo(qryCondition, filter,
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
                                that.$(".js-release").prop("disabled",false);
                                that.$grid.grid("setSelection", bulletinList[0]);
							} else {
								// that.$detailForm.form('clear');
								// that.$detailForm.form('disable');
								that.$(".js-release").prop("disabled",true);
							// 	fish.info(I18N.HINT_SEARCH_MATCH_NULL);
							}
						}
					}
						
				);
			// });
		},

		resize: function(delta) {

			this.$(".js-bulletin-grid").grid("setGridHeight", this.$(".js-bulletin-grid").parent().parent().parent().parent().parent().parent().height() - this.$(".js-bulletin-grid").parent().parent().parent().outerHeight(true) + this.$(".js-bulletin-grid").height());
			
		}
	})
});
