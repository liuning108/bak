define([
	'text!modules/logmgr/templates/AuditLogTemplate.html',
	'i18n!modules/logmgr/i18n/logmgr',
	'modules/logmgr/actions/LogAction'
], function(template, i18nLogMgr, logAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		events: {
			"click .js-query": "qryLog"
		},
		initialize: function(option) {
			this.colModel = [{
				name: 'logId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'partyName',
				label: i18nLogMgr.COMMON_USER_NAME,
				width: 40
			}, {
				name: 'partyCode',
				label: i18nLogMgr.COMMON_USER_CODE,
				width: 40
			}, {
				name: 'eventSrc',
				label: i18nLogMgr.LOG_EVENT_SOURCE,
				width: 40
			}, {
				name: 'eventType',
				label: i18nLogMgr.LOG_EVENT_TYPE,
				width: 40
			}, {
				name: 'eventCode',
				label: i18nLogMgr.LOG_EVENT_CODE,
				width: 60
			}, {
				name: 'srcIp',
				label: i18nLogMgr.LOG_SRC_IP,
				width: 60
			}, {
				name: 'logDate',
				label: i18nLogMgr.LOG_LOG_DATE,
				width: 60
			}, {
				name: 'comments',
				label: i18nLogMgr.COMMON_REMARKS,
				width: 80
			}];
		},
		render: function() {
			this.$el.html(this.template(i18nLogMgr));
		},
		afterRender: function() {
			var eventCodes = [{
				text: i18nLogMgr.LOG_URL_AUDIT_FAIL,
				value: "URL_AUDIT_FAIL"
			}, {
				text: i18nLogMgr.LOG_LOGIN_TRY,
				value: "LOGIN_TRY"
			}, {
				text: i18nLogMgr.LOG_MODIFY_SYSTEM_PARAM,
				value: "PARAM_MODIFY"
			}];
			this.$('.js-event-codes').combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: eventCodes
			});

			this.logBeginDate = this.$(".js-begin-login-date").datetimepicker();
			this.logEndDate = this.$(".js-end-login-date").datetimepicker();
			var endDate = new Date();
			this.logEndDate.datetimepicker("setDate", endDate);
			var t = endDate.getTime() - 1000 * 60 * 60 * 24;
			var beginDate = new Date(t);
			this.logBeginDate.datetimepicker("setDate", beginDate);

			this.$logGrid = this.$(".js-login-log-grid").grid({
				autowidth: true,
				colModel: this.colModel,
				pager: true,
				exportFeature: function(){
					return {
						serviceName:"QryBFMLogList",
            		    serviceParam:this.qryCond
					}
				}.bind(this),
				datatype: 'json',
				pageData: function(page) {this.loadGrid(false);}.bind(this)
			});

			this.$qryForm = this.$(".js-form").form();

			this.qryLog();

			this.$userPopEdit = this.$qryForm.find("[name='partyCode']").popedit({
				open: function() {
					var popEditValue = this.$userPopEdit.popedit("getValue");
					fish.popupView({
						url: "modules/usermgr/views/UserPopWin",
						viewOption: {
							userName: popEditValue ? popEditValue.text : ""
						},
						close: function(msg) {
							this.$userPopEdit.popedit("setValue", {
								value: msg.userId,
								text: msg.userName
							});
						}.bind(this)
					});
				}.bind(this),
				dataTextField: "text",
				dataValueField: "value"
			});
		},

		qryLog: function() {
			if (!this.$qryForm.isValid()) {
				return;
			}
			var data = this.$qryForm.form("value");

			this.qryCond = data;
			this.loadGrid(true);
		},

		loadGrid: function(reset) {
			this.$el.blockUI({message:""});
			
				var pageLength = this.$logGrid.grid("getGridParam", "rowNum"),
					pageIndex = reset ? 1 : this.$logGrid.grid("getGridParam", "page"),
					sortname = this.$logGrid.grid("getGridParam", "sortname"),
					sortorder = this.$logGrid.grid("getGridParam", "sortorder");
	
				var filter = {
					pageIndex: pageIndex-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				
				logAction.qryAuditLogList(this.qryCond, filter, function(status) {
					var logList = status.list;
					this.$logGrid.grid("reloadData", {
						'rows': logList,
						'page': pageIndex,
						'records': status.total
					});
				
					this.$el.unblockUI();
				}.bind(this));
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$logGrid,delta);
		}
	});
});
