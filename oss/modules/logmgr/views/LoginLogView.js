define([
	'text!modules/logmgr/templates/LoginLogTemplate.html',
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
		afterRender: function(a) {
			var eventCodes = [{
				text: i18nLogMgr.LOG_LOGIN_SUCCESS,
				value: "LOGIN_SUCCESS"
			}, {
				text: i18nLogMgr.LOG_LOGIN_EXECPTION,
				value: "LOGIN_EXCEPTION"
			}, {
				text: i18nLogMgr.LOG_LOGIN_TRY,
				value: "LOGIN_TRY"
			}, {
				text: i18nLogMgr.LOGOUT_NORMAL,
				value: "LOGOUT_NORMAL"
			}, {
				text: i18nLogMgr.LOG_LOGOUT_TIMEOUT,
				value: "LOGOUT_TIMEOUT"
			}, {
				text: i18nLogMgr.LOG_LOGOUT_FORCE,
				value: "LOGOUT_FORCE"
			}];
			this.$('.js-event-codes').combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: eventCodes
			});

			var eventTyps = [{
				text: i18nLogMgr.LOG_LOGIN,
				value: "login"
			}, {
				text: i18nLogMgr.LOG_LOGOUT,
				value: "logout"
			}];
			this.$(".js-event-types").combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: eventTyps
			});

			this.logBeginDate = this.$(".js-begin-login-date").datetimepicker();
			this.logEndDate = this.$(".js-end-login-date").datetimepicker();
			var endDate = new Date();
			this.logEndDate.datetimepicker("setDate", endDate);
			var t = endDate.getTime() - 1000 * 60 * 60 * 24;
			var beginDate = new Date(t);
			this.logBeginDate.datetimepicker("setDate", beginDate);

			this.$qryForm = this.$(".js-form").form();

			this.$logGrid = this.$(".js-login-log-grid").grid({
//				showColumnsFeature:true,
//				cached: true,
//				exportFeature: function(){
//					return {
//						serviceName:"QryLoginLogList",
//            		    serviceParam:this.qryCond
//					}
//				}.bind(this),
				colModel: this.colModel,
				pager: true,
				datatype: 'json',
				pageData: function(page,rowNum,sortname,sortorder) {
					this.loadGrid(page,rowNum,sortname,sortorder);
				}.bind(this)
			});

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
								value: msg.userCode,
								text: msg.userName
							});
						}.bind(this)
					});
				}.bind(this),
				dataTextField: "text",
				dataValueField: "value"
			});

			this.qryLog();
		},

		qryLog: function() {
			if (!this.$qryForm.isValid()) {
				return;
			}

			var data = this.$qryForm.form("value");

			this.qryCond = data;
			this.loadGrid();
		},

		loadGrid: function(page,rowNum,sortname,sortorder) {
			this.$el.blockUI({message:""});
//			logAction.qryLoginLogCount(this.qryCond, function(status) {
//				var count = Number(status),
				var orderField = "";
				if(!page) page=1; 
				if(!rowNum) rowNum=this.$logGrid.grid("getGridParam", "rowNum"); 
				var filter = {
					pageIndex: page-1,
					pageLen: rowNum
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				logAction.qryLoginLogList(this.qryCond, filter,
					function(status) {
						var logList = status.list;
						this.$logGrid.grid("reloadData", {
							'rows': logList,
							'page': page,
							'records': status.total
						});
						
						this.$el.unblockUI();
					}.bind(this)
				);
//			}.bind(this));
		},

		resize: function(delta) {
			portal.utils.gridIncHeight(this.$logGrid,delta);
		}
	});
});
