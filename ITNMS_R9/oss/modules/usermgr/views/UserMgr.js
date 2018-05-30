/**
 * Title: UserMgr.js Description: User Management View Author: wu.yangjin
 * Created Date: 15-4-3 上午11:01 Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(
		[ 'modules/usermgr/models/UserQryCondition',
				'modules/usermgr/models/UserDetail',
				'modules/usermgr/actions/UserMgrAction',
				'modules/common/actions/CommonAction',
				'text!modules/usermgr/templates/UserMgr.html',
				'text!modules/usermgr/templates/EmbedEdit.html',
				'i18n!modules/usermgr/i18n/usermgr',
				"css!modules/usermgr/css/user" ],
		function(UserQryCondition, UserDetail, UserMgrAction, commonAction,
				UserMgrTpl, EmbedEditTpl, I18N) {
			return fish.View
					.extend({
						template : fish.compile(UserMgrTpl),

						templateEmbed : fish.compile(EmbedEditTpl),

						events : {
							"click .js-query" : 'queryUserInfo',
							"click .js-reset" : 'resetUserInfo',

							"click .js-user-detail .js-user-new" : 'newUser',
							"click .js-user-detail .js-user-edit" : 'editUser',
							"click .js-user-detail .js-user-ok" : 'ok',
							"click .js-user-detail .js-user-cancel" : 'cancel',

							"click .js-grant-role" : 'grantRole',
							"click .js-grant-portal" : 'grantPortal',
							"click .js-grant-menu" : 'grantMenu',
							"click .js-grant-component" : 'grantComp',
							"click .js-grant-portlet" : 'grantPortlet',
							"click .js-grant-data" : 'grantData',
							"click .js-show-his" : 'showHis',
							"click .js-export" : 'exportData',

							"click .js-eff-check :checkbox" : 'effCheck'
						},

						initialize : function() {
							this.$userGrid = null;
							this.userQryCondition = new UserQryCondition();
							this.userDetail = new UserDetail();

							this.listenTo(this.userQryCondition, 'change',
									function() {
										this.pageData(true);
									});
							this.listenTo(this.userDetail, 'change',
									this.userDetailUpdated);
							this.listenTo(this.userDetail, 'new',
									this.newUserConfirm);

							this._security = {
								userCodeComposition : false,
								userCodeMinLength : 0,
								userCodeMaxLength : 60
							};
						},

						render : function() {
							this.$el.html(this.template(I18N));
						},

						afterRender : function() {
							var $userQueryForm = this.$(".js-user-query"), $userDetailForm = this
									.$(".js-user-detail"), gridButtonCaption = [
									I18N.COMMON_GRANT + I18N.COMMON_ROLE,
									I18N.COMMON_GRANT + I18N.COMMON_PORTAL,
									I18N.COMMON_GRANT + I18N.COMMON_MENU,
									I18N.COMMON_GRANT + I18N.COMMON_COMPONENT,
									I18N.COMMON_GRANT + I18N.COMMON_PORTLET,
									I18N.USERMGR_SHOW_HIST, I18N.USERMGR_EXPORT ], gridButtonCssprop = [
									'js-grant-role', 'js-grant-portal',
									'js-grant-menu', 'js-grant-component',
									'js-grant-portlet', 'js-show-his' ], // ,'js-export'
							gridButtonGroup = [];

							$userQueryForm.form();
							$userQueryForm.find("[name='state']").combobox();
							$userQueryForm.find("[name='isLocked']").combobox();

							$userDetailForm.form();
							$userDetailForm.find("[name='userEffDate']")
									.datetimepicker({
										viewType : 'date'
									});
							$userDetailForm.find("[name='userExpDate']")
									.datetimepicker({
										viewType : 'date'
									});

							this.$userGrid = this.$(".js-user-grid").grid({
								colModel : [ {
									name : 'userId',
									label : '',
									hidden : true,
									key : true
								}, {
									name : 'userName',
									label : I18N.USERMGR_USER_NAME,
									width : '15%'
								}, {
									name : 'userCode',
									label : I18N.USERMGR_USER_CODE,
									width : "15%"
								}, {
									name : 'loginFail',
									label : I18N.USERMGR_LOGIN_FAIL,
									width : "10%"
								}, {
									name : 'state',
									label : I18N.COMMON_STATE,
									width : "10%",
									formatter : "select",
									formatoptions : {
										value : {
											'A' : I18N.COMMON_ACTIVE,
											'X' : I18N.COMMON_INACTIVE
										}
									}
								}, {
									name : 'isLocked',
									label : I18N.USERMGR_IS_LOCKED,
									width : "10%",
									formatter : "select",
									formatoptions : {
										value : {
											'Y' : I18N.COMMON_YES,
											'N' : I18N.COMMON_NO
										}
									}
								}, {
									name : 'portalName',
									label : I18N.USERMGR_DEFAULT_PORTAL,
									width : "30%"
								}, {
									name : 'operate',
									label : '',
									align : 'center',
									exportable : false,
									formatter : function(cell, opts, rowdata) {
										return this.templateEmbed(fish.extend({
											state : rowdata.state,
											isLocked : rowdata.isLocked
										}, I18N));
									}.bind(this),
									width : "10%"
								} ],
								pager : true,
								datatype : 'json',
								showColumnsFeature:true,
								cached: true,
								pageData : function() {
									this.pageData(false);
								}.bind(this),
								onSelectRow : this.rowSelectCallback.bind(this)
							});

							this.$userGrid.grid("navButtonAdd", [
									{
										caption : I18N.COMMON_GRANT
												+ I18N.COMMON_ROLE,
										cssprop : "js-grant-role"
									},
									{
										caption : I18N.COMMON_GRANT
												+ I18N.COMMON_PORTAL,
										cssprop : "js-grant-portal"
									},
									{
										caption : I18N.COMMON_GRANT
												+ I18N.COMMON_MENU,
										cssprop : "js-grant-menu"
									},
									{
										caption : I18N.COMMON_GRANT
												+ I18N.COMMON_COMPONENT,
										cssprop : "js-grant-component"
									},
									{ // 需更名为widget
										caption : I18N.COMMON_GRANT
												+ I18N.COMMON_PORTLET,
										cssprop : "js-grant-portlet"
									// },{
									// caption:
									// I18N.COMMON_GRANT+I18N.COMMON_DATA,
									// cssprop: "js-grant-data"
									}, {
										caption : I18N.USERMGR_SHOW_HIST,
										cssprop : "js-show-his"
									}, {
										caption : I18N.USERMGR_EXPORT,
										cssprop : "js-export"
									} ]);

							/* $userDetailForm.find(".js-icheck").icheck(); */

							UserMgrAction.qryPortalList(function(portalList) {
								this.$(".js-user-query").find(
										":input[name='portalId']").combobox({
									dataTextField : 'portalName',
									dataValueField : 'portalId',
									dataSource : portalList
								});
								this.queryUserInfo();
							}.bind(this));

							// user detail form validation
							$userDetailForm
									.validator({
										rules : {
											userCode : function(element, param,
													field) {
												var hasUpperCase = /[A-Z]/
														.test(element.value);
												var hasLowerCase = /[a-z]/
														.test(element.value);
												var hasDigistChar = /[0-9]/
														.test(element.value);
												switch (this._security.userCodeComposition) {
												case "1":
												case "3":
													if (!hasDigistChar
															&& !(hasLowerCase || hasUpperCase)) {
														return I18N.USERMGR_USER_CODE_CONTAINS_NUMBER_OR_CHAR;
													}
													break;
												case "2":
												case "4":
													if (!hasDigistChar
															|| !(hasLowerCase || hasUpperCase)) {
														return I18N.USERMGR_USER_CODE_CONTAINS_NUMBER_AND_CHAR;
													}
													break;
												}
												return true;
											}.bind(this)
										}
									});

							// 查看相应的安全等级信息
							commonAction
									.qryCurrentSecurityRule(function(data) {
										if (data && data.userCodeComposition) {
											this._security.userCodeMinLength = data.userCodeMinLength;
											this._security.userCodeMaxLength = data.userCodeMaxLength;
											this._security.userCodeComposition = data.userCodeComposition;
											$userDetailForm
													.validator(
															"setField",
															"userCode",
															I18N.USERMGR_USER_CODE
																	+ ':required;length['
																	+ this._security.userCodeMinLength
																	+ '~'
																	+ this._security.userCodeMaxLength
																	+ '];userCode');
										} else {
											$userDetailForm
													.validator(
															"setField",
															"userCode",
															I18N.USERMGR_USER_CODE
																	+ ':required;length[0~60]');
										}
									}.bind(this));
							//查询是否需要email
							commonAction.qryUserHasEmail(function(result){
								if(result.toUpperCase() == 'TRUE'){
									this.$(".hasEmail").addClass("required");
									$userDetailForm.validator({
										fields: {
											'email': 'required;'
										}
									});
								}
							}.bind(this));
						},

						pageData : function(reset, postLoad) {
							var qryCondition = this.userQryCondition.toJSON();
							// var count = Number(data);
							var pageLength = this.$userGrid.grid(
									"getGridParam", "rowNum"), page = reset ? 1
									: this.$userGrid.grid("getGridParam",
											"page"), sortname = this.$userGrid
									.grid("getGridParam", "sortname"), sortorder = this.$userGrid
									.grid("getGridParam", "sortorder");
							var filter = {
								pageIndex : page - 1,
								pageLen : pageLength
							};
							if (sortname) {
								filter.orderFields = sortname + " " + sortorder;
							}
							UserMgrAction.qryUserListByPageInfo(qryCondition,
									filter, function(data) {
										var userList = data.list;
										fish.forEach(userList, function(user) {
											this.normalizeDate(user);
										}, this);
										this.$userGrid.grid("reloadData", {
											'rows' : userList,
											'page' : page,
											'records' : data.total
										});
										if (fish.isFunction(postLoad)) {
											postLoad.call(this);
										} else {
											if (userList.length > 0) {
												this.$userGrid.grid(
														"setSelection",
														userList[0]);
											} else {
												this.$(".js-user-detail").form(
														'clear');
												this.$(".js-user-detail").form(
														'disable');
												// fish.info(I18N.HINT_SEARCH_MATCH_NULL);
											}
										}
									}.bind(this));
						},

						rowSelectCallback : function(event, rowid, state) {
							var e = event.originalEvent;
							var $grid = this.$(".js-user-grid"), rowdata = $grid
									.grid('getRowData', rowid), userId = rowdata.userId;
							this.userDetail.clear({
								silent : true
							});
							this.userDetail.set(rowdata);
							if (e) {
								switch ($(e.target).data("action")) {
								case 'disable':
									if (fish.cookies.get('username') === rowdata.userName) {
										fish
												.warn(I18N.USERMGR_DISABLE_USER_SELF);
									} else {
										UserMgrAction
												.disableUser(
														userId,
														function() {
															$grid
																	.grid(
																			"setRowData",
																			fish
																					.extend(
																							{},
																							rowdata,
																							{
																								state : 'X'
																							}));
															$(e.target).hide();
															$(e.target).next()
																	.show();
															fish
																	.success(I18N.USERMGR_DISABLE_USER_SUCCESS);
														}.bind(this));
									}
									break;
								case 'enable':
									UserMgrAction
											.enableUser(
													userId,
													function() {
														$grid
																.grid(
																		"setRowData",
																		fish
																				.extend(
																						{},
																						rowdata,
																						{
																							state : 'A'
																						}));
														$(e.target).hide();
														$(e.target).prev()
																.show();
														fish
																.success(I18N.USERMGR_ENABLE_USER_SUCCESS);
													}.bind(this));
									break;
								case 'lock':
									if (fish.cookies.get('username') === rowdata.userName) {
										fish.warn(I18N.USERMGR_LOCK_USER_SELF);
									} else {
										fish
												.confirm(
														I18N.USERMGR_LOCK_USER_CONFIRM,
														function() {
															UserMgrAction
																	.lockUser(
																			userId,
																			function() {
																				$grid
																						.grid(
																								"setRowData",
																								fish
																										.extend(
																												{},
																												rowdata,
																												{
																													isLocked : 'Y'
																												}));
																				$(
																						e.target)
																						.hide();
																				$(
																						e.target)
																						.next()
																						.show();
																				fish
																						.success(I18N.USERMGR_LOCK_USER_SUCCESS);
																			}
																					.bind(this));
														}.bind(this), $.noop);
									}
									break;
								case 'unlock':
									fish
											.confirm(
													I18N.USERMGR_UNLOCK_USER_CONFIRM,
													function() {
														UserMgrAction
																.unlockUser(
																		userId,
																		function(
																				status) {
																			$grid
																					.grid(
																							"setRowData",
																							fish
																									.extend(
																											{},
																											rowdata,
																											{
																												isLocked : 'N',
																												loginFail : '0'
																											}));
																			$(
																					e.target)
																					.hide();
																			$(
																					e.target)
																					.prev()
																					.show();
																			fish
																					.success(I18N.USERMGR_UNLOCK_USER_SUCCESS);
																		}
																				.bind(this));
													}.bind(this), $.noop);
									break;
								case 'export':
									break;
								case 'passwd':
									fish
											.confirm(
													I18N.USERMGR_RESET_PASSWD_CONFIRM,
													function() {
														UserMgrAction
																.resetPasswd(
																		userId,
																		function(
																				status) {
																			fish
																					.success(I18N.USERMGR_RESET_PASSWD_SUCCESS);
																		}
																				.bind(this));
													}.bind(this), $.noop);
									break;
								default:
									break;
								}
							}
						},

						userDetailUpdated : function() {
							this.hideEffCheck();
							this.$(".js-user-detail").form("clear");
							this.$(".js-user-detail").form("disable");
							this.$(".js-user-detail").form("value",
									this.userDetail.toJSON());
							this.$(".js-user-detail").resetValid();
							this.$(".js-user-cancel").parent().hide();
							this.$(".js-user-cancel").parent().prev().show();
						},

						queryUserInfo : function() {
							var $form = this.$(".js-user-query"), value = $form
									.form('value');
							this.userQryCondition.clear({
								silent : true
							});
							this.userQryCondition.set(new UserQryCondition(
									value).toJSON(), {
								silent : true
							});
							this.userQryCondition.trigger('change');
						},

						resetUserInfo : function() {
							this.$el.children("form").form('clear');
							this.userQryCondition.clear();
							this.userQryCondition.trigger('change');
						},

						/**
						 * Note: form.form('clear') affects the checkbox
						 */
						showEffCheck : function() {
							var $form = this.$(".js-user-detail");
							$form.find(":input[name='userEffDate']").parent()
									.parent().removeClass('col-md-8 col-sm-8')
									.addClass('col-md-4 col-sm-4');
							$form.find(":input[name='userEffDate']").parent()
									.parent().removeClass('inline-table');
							$form.find(".js-eff-check").show()
									.find(":checkbox").prop('checked',
											'checked');
							$form.find(":input[name='userEffDate']")
									.datetimepicker('disable');
							$form.form().validator("cleanUp");
						},

						hideEffCheck : function() {
							var $form = this.$(".js-user-detail");
							$form.find(".js-eff-check").hide();
							$form.find(":input[name='userEffDate']").parent()
									.parent().removeClass('col-md-4 col-sm-4')
									.addClass('col-md-8 col-sm-8');
							$form.find(":input[name='userEffDate']").parent()
									.parent().addClass('inline-table');
							$form.find(":input[name='userEffDate']")
									.datetimepicker('enable');
						},

						afterClear : function($form) {
							this.showEffCheck();
						},

						newUser : function() {
							var $form = this.$(".js-user-detail");
							$form.form('enable');
							$form.form('clear');
							this.afterClear($form);
							this.$(".js-user-new").parent().hide();
							this.$(".js-user-new").parent().next().show();
							$form.find(":input[name='userName']").focus();
							this.$(".js-user-ok").data("type", "new");
						},

						editUser : function() {
							this.$(".js-user-detail").form('enable');
							this.$(".js-user-edit").parent().hide();
							this.$(".js-user-edit").parent().next().show();
							this.$(".js-user-ok").data("type", "edit");
						},

						ok : function() {
							var $grid = this.$(".js-user-grid"), $ok = this
									.$(".js-user-ok"), $form = this
									.$(".js-user-detail");
							switch ($ok.data("type")) {
							case "new":
								if ($form.isValid()) {
									var inputUser = new UserDetail($form
											.form('getValue',false)).toJSON();
									UserMgrAction
											.addUser(
													inputUser,
													function(user) {
														this
																.normalizeDate(user);
														this.userDetail.clear({
															silent : true
														});
														this.userDetail
																.set(user);
														$grid
																.grid(
																		"addRowData",
																		this.userDetail
																				.toJSON(),
																		'last');
														$grid
																.grid(
																		"setSelection",
																		this.userDetail
																				.toJSON());
														fish
																.success(I18N.USERMGR_ADD_USER_SUCCESS);
													}.bind(this));
								}
								break;
							case "edit":
								if ($form.isValid()) {
									var user = fish.extend(this.userDetail.toJSON(), $form.form('getValue',false));
									UserMgrAction
											.modUser(
													user,
													function() {
														this.userDetail.clear({
															silent : true
														});
														this.userDetail
																.set(user);
														$grid
																.grid(
																		"setRowData",
																		this.userDetail
																				.toJSON());
														fish
																.success(I18N.USERMGR_MOD_USER_SUCCESS);
													}.bind(this));
								}
								break;
							default:
								break;
							}
						},

						normalizeDate : function(userDetail) {
							var effDate = userDetail.userEffDate, expDate = userDetail.userExpDate;
							if ($.trim(effDate)) {
								userDetail.userEffDate = effDate.split(" ")[0];
							}
							if ($.trim(expDate)) {
								userDetail.userExpDate = expDate.split(" ")[0];
							}
						},

						cancel : function() {
							this.$(".js-user-cancel").parent().hide();
							this.$(".js-user-cancel").parent().prev().show();
							this.$(".js-user-detail").form('disable');
							this.$(".js-user-detail").resetValid();
							this.userDetail.trigger("change", this.userDetail);
						},

						effCheck : function() {
							var $form = this.$(".js-user-detail");
							if ($form.find(".js-eff-check :checkbox").prop(
									'checked')) {
								$form.find("[name='userEffDate']")
										.datetimepicker('disable')
										.datetimepicker('clearDate');
								$form
										.validator('setField', 'userEffDate',
												null);
								$form
										.validator('setField', 'userExpDate',
												null);
							} else {
								$form.find("[name='userEffDate']")
										.datetimepicker('enable');
								$form
										.validator(
												'setField',
												'userEffDate',
												I18N.USERMGR_EFF_DATE
														+ ":required;match[lt, userExpDate, date]");
								$form
										.validator(
												'setField',
												'userExpDate',
												I18N.USERMGR_EXP_DATE
														+ ":match[gt, userEffDate, date]");
							}
							$form.validator("hideMsg", $form
									.find("[name='userEffDate']"));
						},

						grantRole : function() {
							fish.popupView({
								url : "modules/usermgr/views/grant/UserRole",
								viewOption : {
									model : this.userDetail
								},
								callback : function(popup, view) {
									this.userDetail.trigger('change');
								}.bind(this)
							});
						},

						grantPortal : function() {
							fish.popupView({
								url : "modules/usermgr/views/grant/UserPortal",
								viewOption : {
									model : this.userDetail
								},
								callback : function(popup, view) {
									this.userDetail.trigger('change');
								}.bind(this),
								close : function(msg) {
									this.pageData(false, function() {
										this.$userGrid.grid("setSelection",
												this.userDetail.toJSON());
									});
								}.bind(this)
							});
						},

						grantMenu : function() {
							fish.popupView({
								url : "modules/usermgr/views/grant/UserMenu",
								viewOption : {
									model : this.userDetail
								},
								callback : function(popup, view) {
									this.userDetail.trigger('change');
								}.bind(this)
							});
						},

						grantComp : function() {
							fish.popupView({
								url : "modules/usermgr/views/grant/UserComp",
								viewOption : {
									model : this.userDetail
								},
								callback : function(popup, view) {
									this.userDetail.trigger('change');
								}.bind(this)
							});
						},

						grantPortlet : function() {
							fish
									.popupView({
										url : "modules/usermgr/views/grant/UserPortlet",
										viewOption : {
											model : this.userDetail
										},
										callback : function(popup, view) {
											this.userDetail.trigger('change');
										}.bind(this)
									});
						},

						grantData : function() {
							fish.popupView({
								url : "modules/usermgr/views/grant/UserData",
								viewOption : {
									model : this.userDetail
								},
								callback : function(popup, view) {
									this.userDetail.trigger('change');
								}.bind(this)
							});
						},

						showHis : function() {
							fish.popupView({
								url : "modules/userhis/views/UserHis",
								viewOption : {
									userId : this.userDetail.get("userId")
								}
							});
						},

						exportData : function() {
							var qryCondition = this.userQryCondition.toJSON();
							this.$userGrid.grid("exportDataAysn", {
								url : 'users/export',
								serviceParam : qryCondition,
								fileName : "users"
							});
						},

						resize : function(delta) {
							portal.utils.gridIncHeight(this.$(".js-user-grid"),
									delta);
						}
					});
		});
