define([
	'text!modules/usermgr/templates/UserPopWin.html',
	'modules/usermgr/models/UserQryCondition',
	'modules/usermgr/actions/UserMgrAction',
	'modules/common/actions/CommonAction',
	'i18n!modules/usermgr/i18n/usermgr'
], function(userPopWinTpl, UserQryCondition, UserMgrAction,
	commonAction, i18nUserMgr) {
	return portal.BaseView.extend({
		template: fish.compile(userPopWinTpl),
		events: {
			"click .js-query": 'queryUserInfo',
			"click .js-reset": 'resetUserInfo',
			"click .js-ok": 'ok'
		},

		initialize: function(options) {
			this._ = {
				initUserName: options.userName,
				user: {}
			};
			this.$userGrid = null;
			this.userQryCondition = new UserQryCondition();

			this.listenTo(this.userQryCondition, 'change', function() {this.loadGrid(true);});
		},

		render: function() {
			this.setElement(this.template(i18nUserMgr));
		},

		afterRender: function() {
			var $userQueryForm = this.$(".js-user-query");

			$userQueryForm.form();
			$userQueryForm.find("[name='state']").combobox();
			$userQueryForm.find("[name='isLocked']").combobox();

			if (this._.initUserName) {
				$userQueryForm.form('value', {
					USER_NAME: this._.initUserName
				});
			}

			this.$userGrid = this.$(".js-user-grid").grid({
				colModel: [{
					name: 'userId',
					label: '',
					hidden: true,
					key: true
				}, {
					name: 'userName',
					label: i18nUserMgr.USERMGR_USER_NAME,
					width: '20%'
				}, {
					name: 'userCode',
					label: i18nUserMgr.USERMGR_USER_CODE,
					width: "20%"
				}, {
					name: 'loginFail',
					label: i18nUserMgr.USERMGR_LOGIN_FAIL,
					width: "10%"
				}, {
					name: 'state',
					label: i18nUserMgr.COMMON_STATE,
					width: "10%",
					formatter: "select",
					formatoptions:{
						value: {'A':i18nUserMgr.COMMON_ACTIVE,'X':i18nUserMgr.COMMON_INACTIVE}
					}
				}, {
					name: 'isLocked',
					label: i18nUserMgr.USERMGR_IS_LOCKED,
					width: "10%",
					formatter: "select",
					formatoptions:{
						value: {'Y':i18nUserMgr.COMMON_YES,'N':i18nUserMgr.COMMON_NO}
					}
				}, {
					name: 'portalName',
					label: i18nUserMgr.USERMGR_DEFAULT_PORTAL,
					width: "30%"
				}],
				pager: true,
				datatype: 'json',
				pageData: function(page) {this.loadGrid(false);}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this._.user = this.$userGrid.grid('getRowData', rowid);
				}.bind(this)
			});

			UserMgrAction.qryPortalList(function(portalList) {
				$userQueryForm.find("[name='portalId']").combobox({
					dataTextField: 'portalName',
					dataValueField: 'portalId',
					dataSource: portalList
				});
				this.queryUserInfo();
			}.bind(this));
		},

		loadGrid: function(reset) {
			var qryCondition = this.userQryCondition.toJSON();
			// UserMgrAction.qryUserListCount(qryCondition, function(status) {
				// count = Number(status),
				var pageLength = this.$userGrid.grid("getGridParam", "rowNum"),
					page = reset ? 1 : this.$userGrid.grid("getGridParam", "page"),
					sortname = this.$userGrid.grid("getGridParam", "sortname"),
					sortorder = this.$userGrid.grid("getGridParam", "sortorder");

				var filter = {
					pageIndex: page-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				UserMgrAction.qryUserListByPageInfo(qryCondition, filter, function(status) {
					var userList = status.list || [];
					fish.forEach(userList, function(user) {
						var effDate = user.USER_EFF_DATE;
						if (effDate) {
							user.USER_EFF_DATE = effDate.split(" ")[0];
						}
					});
					this.$userGrid.grid("reloadData", {
						'rows': userList,
						'page': page,
						'records': status.total
					});
					if (userList.length > 0) {
						this.$userGrid.grid("setSelection", userList[0]);
					} else {
						this.$(".js-user-detail").form('clear');
						this.$(".js-user-detail").form('disable');
					// 	fish.info(i18nUserMgr.HINT_SEARCH_MATCH_NULL);
					}
				}.bind(this));
			// }.bind(this));
		},

		queryUserInfo: function() {
			var $form = this.$(".js-user-query"),
				value = $form.form('value');
			this.userQryCondition.clear({silent: true});
			this.userQryCondition.set(new UserQryCondition(value).toJSON(), {silent: true});
			this.userQryCondition.trigger('change');
		},

		resetUserInfo: function() {
			this.$el.children("form").form('clear');
			this.userQryCondition.clear();
			this.userQryCondition.trigger('change');
		},

		ok: function() {
			this.popup.close(this._.user);
		}
	});
});
