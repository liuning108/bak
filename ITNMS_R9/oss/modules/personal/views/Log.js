define(['text!modules/personal/templates/LogView.html',
	'i18n!modules/personal/i18n/person',
	'modules/personal/actions/PersonalAction'
], function(tpl, i18nPersonal, personalAction) {
	return portal.BaseView.extend({
		template: fish.compile(tpl),
		initialize: function() {
			this.colModel = [{
				name: 'serverIp',
				label: i18nPersonal.LOG_SRC_IP,
				width: "33%",
				sortable: false
			}, {
				name: 'logDate',
				label: i18nPersonal.LOG_LOG_DATE,
				width: "33%",
				sortable: false
			}, {
				name: 'comments',
				label: i18nPersonal.COMMON_REMARKS,
				width: "34%",
				sortable: false
			}];
		},
		render: function() {
			this.$el.html(this.template(i18nPersonal));		
//			return this;
		},
		afterRender: function() {
//			var parent = this.$el.parents(".js-personal-tab");
//			this.$(".js-log-grid").height(parent.height()-parent.find(".ui-tabs-nav").outerHeight());
			this.$logGrid = this.$(".js-log-grid").grid({
				colModel: this.colModel,
				pager: true,
				datatype: 'json',
				pageData: function(page) {this.loadGrid(false);}.bind(this),
				pginput: false,
				pgRecText: false,
				displayNum: 3
			});
			this.qryLog();
			
			return this;
		},
		qryLog: function() {
			var data = {};
			var endDate = new Date();
			var beginDate = fish.dateutil.addMonths(endDate,-1);
			data.beginDate = fish.dateutil.format(beginDate,fish.config.get("dateParseFormat.datetime"));
			data.endDate = fish.dateutil.format(endDate,fish.config.get("dateParseFormat.datetime"));
			data.partyCode = portal.appGlobal.get("userCode");

			this.qryCond = data;
			this.loadGrid(true);
		},
		loadGrid: function(reset) {
				var	pageLength = this.$logGrid.grid("getGridParam", "rowNum"),
					pageIndex = reset ? 1 : this.$logGrid.grid("getGridParam", "page");
				personalAction.qryLoginLogList({
					pageIndex: pageIndex-1,
					pageLen: pageLength
				}, function(status) {
						var logList = status.list;
						this.$logGrid.grid("reloadData", {
							'rows': logList,
							'page': pageIndex,
							'records': status.total
						});
						if (logList && logList.length == 0) {							
							fish.info(i18nPersonal.HINT_SEARCH_MATCH_NULL);
						}
					}.bind(this)
				);
		},
		resize: function(delta) {
			portal.utils.gridIncHeight(this.$logGrid,delta);
		}
	});
	
})