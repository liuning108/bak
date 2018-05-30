define([
	'modules/userhis/actions/UserHisAction',
	'text!modules/userhis/templates/UserHis.html',
	'i18n!modules/userhis/i18n/userhis'
], function(UserHisAction, userHisTpl, i18nUserHis) {
	return portal.BaseView.extend({
		template: fish.compile(userHisTpl),

		events: {
			"click .js-query": 'qryUserHis',
			"click": 'handleErrMsg'
		},

		initialize: function(options) {
			this.root = fish.clone(options);
		},

		render: function() {
			this.setElement(this.template(i18nUserHis));
		},

		afterRender: function() {
			this.$("form").find(":input[name='startDate']").datetimepicker();
			this.$("form").find(":input[name='endDate']").datetimepicker();

			this.$(".grid").grid({
				colModel: [{
					name: "recId",
					label: "",
					key: true,
					hidden: true
				}, {
					name: "userName",
					label: i18nUserHis.USERHIS_USER_NAME,
					width: 100
				}, {
					name: "userCode",
					label: i18nUserHis.USERHIS_USER_CODE,
					width: 100
				}, {
					name: "state",
					label: i18nUserHis.COMMON_STATE,
					width: 80
				}, {
					name: "isLocked",
					label: i18nUserHis.COMMON_LOCKED,
					width: 100
				}, {
					name: "recUserName",
					label: i18nUserHis.USERHIS_OPER_USER_NAME,
					width: 120
				}, {
					name: "recUserCode",
					label: i18nUserHis.USERHIS_OPER_USER_CODE,
					width: 120
				}, {
					name: "ipAddress",
					label: i18nUserHis.USERHIS_OPER_IP_ADDRESS,
					width: 120
				}, {
					name: "comments",
					label: i18nUserHis.USERHIS_OPER_EVENT,
				}, {
					name: "recCreateDate",
					label: i18nUserHis.USERHIS_OPER_DATE,
					width: 120
				}],
				pager: true,
				datatype: 'json',
				forceFit: true,
				pageData: function(page) {this.loadGrid(false);}.bind(this)
			});

			this.qryUserHis();
		},

		qryUserHis: function() {
			if (this.$("form").isValid()) {
				var obj = {};
				obj.userId = this.root.userId;
				var formData = this.$("form").form('value');
				if(formData.startDate){
					obj.startDate = formData.startDate;
				}
				if(formData.endDate){
					obj.endDate = formData.endDate;
				}
				this.root = obj;
				this.loadGrid(true);
			}
		},

		getValueStr: function(val) {
			switch (val) {
			case 'Y':
				return i18nUserHis.COMMON_YES;
			case 'N':
				return i18nUserHis.COMMON_NO;
			case 'A':
				return i18nUserHis.COMMON_ACTIVE;
			case 'X':
				return i18nUserHis.COMMON_INACTIVE;
			default:
				return "";
			}
		},

		loadGrid: function(reset) {
				var pageLength = this.$(".grid").grid("getGridParam", "rowNum"),
					page = reset ? 1 : this.$(".grid").grid("getGridParam", "page"),
					sortname = this.$(".grid").grid("getGridParam", "sortname"),
					sortorder = this.$(".grid").grid("getGridParam", "sortorder");
	
				var filter = {
					pageIndex: page-1,
					pageLen: pageLength
				};
				if(sortname){
					filter.orderFields = sortname + " " + sortorder;
				}
				UserHisAction.qryUserHis(fish.clone(this.root), filter,
					function(status) {
						var userHis = status.list;
						fish.forEach(userHis, function(his) {
							his.state = this.getValueStr(his.state);
							his.isLocked = this.getValueStr(his.isLocked);
						}, this);
						this.$(".grid").grid("reloadData", {
							'rows': userHis,
							'page': page,
							'records': status.total
						});
						if (userHis && userHis.length == 0) {							
							this.$(".js-user-detail").form('clear');
						// 	fish.info(i18nUserHis.HINT_SEARCH_MATCH_NULL);
						}
					}.bind(this)
				);
		},

		handleErrMsg: function(e) {
			if (!$(e.target).hasClass("js-query")) {
				this.$("form").resetValid();
			}
		}
	});
});
