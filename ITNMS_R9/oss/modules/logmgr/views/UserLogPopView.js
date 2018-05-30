define([
	'text!modules/logmgr/templates/UserLogPopTemplate.html',
	'i18n!modules/logmgr/i18n/logmgr',
	'modules/logmgr/actions/LogAction'
], function(template, i18LogMgr, logAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		events: {
			"click .js-query": "qryClick"
		},
		initialize: function(options) {
			this.colModel = [{
				name: 'logId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'partyName',
				label: i18LogMgr.COMMON_USER_NAME,
				width: 40
			}, {
				name: 'partyCode',
				label: i18LogMgr.COMMON_USER_CODE,
				width: 40
			}, {
				name: 'eventSrc',
				label: i18LogMgr.LOG_EVENT_SOURCE,
				width: 40
			}, {
				name: 'eventType',
				label: i18LogMgr.LOG_EVENT_TYPE,
				width: 40
			}, {
				name: 'eventCode',
				label: i18LogMgr.LOG_EVENT_CODE,
				width: 60
			}, {
				name: 'srcIp',
				label: i18LogMgr.LOG_SRC_IP,
				width: 60
			}, {
				name: 'logDate',
				label: i18LogMgr.LOG_LOG_DATE,
				width: 60
			}, {
				name: 'comments',
				label: i18LogMgr.COMMON_REMARKS,
				width: 80
			}];
			this._ = {};
			this._.userCode = options.userCode;
		},

		render: function() {
			this.setElement(this.template(i18LogMgr));
		},

		afterRender: function() {
			this.$qryForm = this.$(".js-user-log-query").form();
			this.$(".js-log-date-begin").datetimepicker();
			this.$(".js-log-date-end").datetimepicker();

			this.userLogGrid = this.$(".js-grid-user-log").grid({
				autowidth: true,
				colModel: this.colModel,
				pager: true,
				datatype: 'json',
				pageData: function(page) {this.loadGrid(false);}.bind(this)
			});
			this.qryClick();
		},

		qryClick: function(reset) {
			var param = this.$qryForm.form("value");
			param.partyCode = this._.userCode;
			param.partyType = "Z";
			this._qryCond = param;
			this.loadGrid(true);
		},

		loadGrid: function(reset) {
			var param = this._qryCond;
				var pageLength = this.userLogGrid.grid("getGridParam", "rowNum"),
					pageIndex = reset ? 1 : this.userLogGrid.grid("getGridParam", "page"),
					sortname = this.userLogGrid.grid("getGridParam", "sortname"),
					sortorder = this.userLogGrid.grid("getGridParam", "sortorder");
	
				var filter = {
					pageIndex: pageIndex-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				logAction.qryLoginLogList(param, filter, function(status) {
					var logList = status.list;
					this.userLogGrid.grid("reloadData", {
						'rows': logList,
						'page': pageIndex,
						'records': status.total
					});
					if (logList.length > 0) {
						this.userLogGrid.grid("setSelection", logList[0]);
					// } else {
					// 	fish.info(i18LogMgr.HINT_SEARCH_MATCH_NULL);
					}
			}.bind(this));
		}
	})
});
