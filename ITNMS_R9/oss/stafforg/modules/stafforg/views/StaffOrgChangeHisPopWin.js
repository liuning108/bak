define([
	'text!stafforg/modules/stafforg/templates/StaffOrgChangeHisPopWin.html',
	'i18n!stafforg/modules/stafforg/i18n/stafforg',
	'stafforg/modules/stafforg/actions/StaffOrgAction'
], function(template, i18StaffOrg, StaffOrgAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		userCode: null,

		events: {
			"click .js-query": "qryOrgChangeHis"
		},

		initialize: function(options) {
			this.root = {};
			this.stateString = {
				"A": i18StaffOrg.STAFFORG_STAFF_JOIN_ORG,
				"X": i18StaffOrg.STAFFORG_QUIT_FORM_ORG
			};
			this.colModel = [{
				name: 'staffName',
				label: i18StaffOrg.STAFFORG_STAFF_NAME
			}, {
				name: 'orgName',
				label: i18StaffOrg.STAFFORG_ORG_NAME
			}, {
				name: 'state',
				label: i18StaffOrg.COMMON_STATE,
				formatter: function(cellValue, id, rowdata) {
					if (cellValue) {
						return this.stateString[cellValue];
					}
					return "";
				}.bind(this)
			}, {
				name: 'stateDate',
				label: i18StaffOrg.COMMON_OPERATE_DATE
			}];
			this.options = options;
			this.staffId = this.options.staffId;
		},

		render: function() {
			this.setElement(this.template(i18StaffOrg));
		},

		afterRender: function() {
			this.$("form").form();
			this.$("form").find("[name='startDate']").datetimepicker();
			this.$("form").find("[name='endDate']").datetimepicker();

			this.$(".grid").grid({
				autowidth: true,
				colModel: this.colModel,
				pager: true,
				datatype: 'json',
				pageData: function(page) {this.loadGrid(false,{"staffId":this.staffId});}.bind(this)
			});
			this.$(".js-query").focus();

			this.qryOrgChangeHis();
		},

		qryOrgChangeHis: function() {
			var param = this.$("form").form("value");
			param.staffId = this.staffId;
			this.loadGrid(true,param);
		},

		loadGrid: function(reset,param) {
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
				
				StaffOrgAction.qryOrgChangeHis(param, filter,
					function(status) {
						var orgChangeHis = status.list;
						this.$(".grid").grid("reloadData", {
							'rows': orgChangeHis,
							'page': page,
							'records': status.total
						});
						if (orgChangeHis.length > 0) {
							this.$(".grid").grid("setSelection", orgChangeHis[0]);
						} else {
						//  this.$("form").form('clear');
						// 	fish.info(i18StaffOrg.HINT_SEARCH_MATCH_NULL);
						}
					}.bind(this));
		}
	})
});
