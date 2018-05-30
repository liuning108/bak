define([
	"text!bulletin/modules/bulletinmgr/templates/BulletinCreate.html",
	'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
	'bulletin/modules/bulletinmgr/actions/BulletinAction',
	'text!bulletin/modules/bulletinmgr/templates/BulletinGrid.html',
	"frm/fish-desktop/third-party/ueditor/ueditor.config",
	"frm/fish-desktop/third-party/ueditor/ueditor.all"
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
                caption: i18nBulletin.COMMON_NEW,
                cssprop: "js-add"
            },{
				caption: i18nBulletin.COMMON_EDIT,
				cssprop: "js-edit"
			}]);

			that.$(".js-edit").prop("disabled", false);

			this.pageData(true);
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
                        that.$(".js-edit").prop("disabled", true);
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

		addBulletin: function () {
			this.operate("add");
		},

		operate: function(option){
			var that = this;
			fish.popupView({
				url: "bulletin/modules/bulletinmgr/views/BulletinCreatePopWin",
				viewOption: {
					type: option,
					data: that.$grid.grid("getSelection")
				},
				close: function(msg) {
					if (option == 'add'){
						//grid新增一条数据，并选中
						msg.staffId = portal.appGlobal.get("staffId");
						bulletinAction.addBulletin(msg,function(result){
							that.$grid.grid("addRowData", result, 'last');
							that.$grid.grid("setSelection", result);
							fish.success(i18nBulletin.BULLETIN_ADD_SUCCESS);
						});		
					}							
					if (option == 'edit'){
						//设置选中行的值
						bulletinAction.modBulletin(msg,function(data){
							if (data){
								that.$grid.grid("setRowData", msg);
								fish.success(i18nBulletin.BULLETIN_EDIT_SUCCESS);
							}
						});
					}
					UE.delEditor("content");
				},
				dismiss: function() {
					UE.delEditor("content");
				}
			});
		},

		editBulletin: function () {
			this.operate("edit");			
		},

		query: function() {			
			this.pageData(true);
		},

		pageData: function(reset) {
			var that = this;
			var qryCondition = that.$queryForm.form('value');
			qryCondition.staffId = portal.appGlobal.get("staffId");
			qryCondition.state = 'create';
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
								that.$grid.grid("setSelection", bulletinList[0]);
                                that.$(".js-edit").prop("disabled", false);
                            } else {
								// that.$detailForm.form('clear');
								// that.$detailForm.form('disable');
								that.$(".js-edit").prop("disabled", true);
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
