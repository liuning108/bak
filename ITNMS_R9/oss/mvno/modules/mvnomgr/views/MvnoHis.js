define([
	'mvno/modules/mvnomgr/actions/MvnoAction',
	'text!mvno/modules/mvnomgr/templates/MvnoHis.html',
	'i18n!mvno/modules/mvnomgr/i18n/mvnomgr'
], function(MvnoAction, mvnoHisTpl, i18n) {
	return portal.BaseView.extend({
		template: fish.compile(mvnoHisTpl),

		events: {
			"click .js-query": 'qryMvnoHis'
		},

		initialize: function(options) {
			this.root = fish.clone(options);
		},

		render: function() {
			this.setElement(this.template(i18n));
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
					name: "spName",
					label: i18n.MVNOMGR_MVNO_NAME,
					width: '10%'
				}, {
					name: "stdCode",
					label: i18n.MVNOMGR_MVNO_CODE,
					width: '10%'
				}, {
					name: "state",
					label: i18n.COMMON_STATE,
					width: '10%'				
				}, {
					name: "recUserName",
					label: i18n.MVNOMGR_OPER_USER_NAME,
					width: '10%'
				}, {
					name: "recUserCode",
					label: i18n.MVNOMGR_OPER_USER_CODE,
					width: '15%'
				}, {
					name: "ipAddress",
					label: i18n.MVNOMGR_OPER_IP_ADDRESS,
					width: '15%'
				}, {
					name: "comments",
					label: i18n.MVNOMGR_OPER_EVENT,
					width: '15%'
				}, {
					name: "recCreateDate",
					label: i18n.MVNOMGR_OPER_DATE,
					width: '15%'
				}],
				pager: true,
				datatype: 'json',
				forceFit: true,
				pageData: function(page) {this.loadGrid(false);}.bind(this)
			});

			this.qryMvnoHis();
		},

		qryMvnoHis: function() {
			if (this.$("form").isValid()) {
				var obj = {};
				obj.spId = this.root.spId;
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
			case 'A':
				return i18n.COMMON_ACTIVE;
			case 'X':
				return i18n.COMMON_INACTIVE;
			default:
				return "";
			}
		},

		loadGrid: function(reset) {
				var	pageLength = this.$(".grid").grid("getGridParam", "rowNum"),
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
				MvnoAction.qryMvnoHis(fish.clone(this.root), filter,
					function(status) {
						var mvnoHis = status.list;
						fish.forEach(mvnoHis, function(his) {
							his.state = this.getValueStr(his.state);							
						}, this);
						this.$(".grid").grid("reloadData", {
							'rows': mvnoHis,
							'page': page,
							'records': status.total
						});
						if (mvnoHis.length > 0) {
							this.$(".grid").grid("setSelection", mvnoHis[0]);
						} else {
							// this.$(".js-user-detail").form('clear');
						// 	fish.info(i18nUserHis.HINT_SEARCH_MATCH_NULL);
						}
					}.bind(this)
				);
		// },

		// handleErrMsg: function(e) {
		// 	if (!$(e.target).hasClass("js-query")) {
		// 		this.$("form").resetValid();
		// 	}
		}
	});
});
