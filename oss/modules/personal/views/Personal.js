define(['text!modules/personal/templates/Personal.html',
	'i18n!modules/personal/i18n/person',
	'modules/personal/actions/PersonalAction',
	"modules/common/actions/CommonAction",
	"webroot",
	"css!modules/personal/css/personal"
], function(tpl, i18nPersonal, personalAction,CommonAction,webroot) {
	return portal.BaseView.extend({
		template: fish.compile(tpl),
		events: {
			'click .js-ok': 'btnOKClick',
			'click .js-edit': "btnEditClick",
			'click .js-cancel': "btnCancelClick",
			'click .js-btn-change-pwd': 'btnChangePwd'
		},
		render: function() {
			this.$el.html(this.template(i18nPersonal));
			this.$btnOK = this.$(".js-ok").hide();
			this.$btnCacel = this.$(".js-cancel").hide();
			this.$btnEdit = this.$(".js-edit").show();
			//是否拥有属性,没有属性时代理人展示在个人信息下面；有属性时代理人列表展示在右侧TAB页
			this.hasAttr = false;
			//prolist存放属性控件需要的json
			this.prolist = null;
			//attrList作为参数传给修改service，值从prolist中来
			this.attrList = null;
			//是否必须要有email
			this.hasEmail = false;
			this.userInfo = null;
//			return this;
		},
		afterRender: function(contentHeight) {	
			var that = this;
			// that.$(".js-email-dom").hide();
			that.$(".js-personal-tab").tabs({
				activateOnce:true,
				activate: function(event, ui) {
					var id = ui.newPanel.attr('id');
					switch (id) {
						case "tabs-log":
							that.requireView({
								url:webroot+'modules/personal/views/Log',
								selector:"#tabs-log"
							});
						break;		
						// case "tabs-delegate":
						// 	that.requireView({
						// 		url:webroot+'modules/personal/views/Delegate',
						// 		selector:"#tabs-delegate",
						// 		viewOption:that.userInfo //此时应该有staffId了--改成动态加载代理人页签
						// 	});
						// break;
					}
				}.bind(that)
			});
			
			CommonAction.qryCurrentUser(function(userStaffInfo) {
				that.userInfo = userStaffInfo;
				if (that.userInfo.hasEmail && that.userInfo.hasEmail.toLocaleUpperCase() == "TRUE"){
					that.$(".js-email-dom").addClass("required");
					that.$('form').validator({
						fields: {
							'email': 'required;'
						}
					 });
				}
				if (userStaffInfo) {
					CommonAction.qryPortalListByUserId(that.userInfo.userId, function(portalList) {
						that.comboxDefaultPortal = that.$(".js-default-portal").combobox({
							dataTextField: 'portalName',
							dataValueField: 'portalId',
							dataSource: portalList
						});						
						that.personalForm.form("value", that.userInfo);
					});
					
					// if(that.userInfo.staffId != undefined){
					// 	personalAction.queryAttrDefList(function(json) {
					// 		if(json.length == 0 ) return ;
							
					// 		that.hasAttr = true;
					// 		that.prolist = json;	
					// 	    require([webroot + "frm/portal/PropertyList"], function() {
				    //             that.$(".js-profile-property").propertylist({
				    //                 data: json,
				    //                 colCssp: "",
				    //                 labelCssp: "col-md-4 col-sm-4",
				    //                 elCssp: "col-md-8 col-sm-8"
				    //             });				       
				    //             that.personalForm = that.$(".js-personal-form").form("disable");         
					// 	    });
					// 	    personalAction.qryAttrDataByStaffId(that.userInfo.staffId,function(attrList) {				
					// 			that.attrList = attrList;
					// 			for(var j = 0; j < that.attrList.length; j++){
					// 				that.userInfo[that.attrList[j].attrId] = that.attrList[j].attrValue;
					// 			}
					// 			that.personalForm.form("value", that.userInfo);
					// 			that.comboxDefaultPortal.combobox('value', that.userInfo.portalId);
					// 		});
					// 	});
									
					// }	
					// else			
					// {
						// this.$(".js-staff-name-input").hide();
						//this.$(".delegateTab").hide();
					// }
					
				}
				
			});
						
			that.personalForm = that.$(".js-personal-form").form("disable");
//			that.$(".detailFormBtn").css({"width":"100%","padding": "0px 10px 0px 0px", "margin-top": "8px"});
			return this;
		},
		btnChangePwd: function (){
			var ts = this ;
			fish.popupView({
				url:webroot+'modules/pwdmgr/views/ModPwdPopWin',
				viewOption:{mustModify: false,userCode: ts.userInfo.userCode}
			})
		},
		btnEditClick: function(){
			this.$btnOK.show();
			this.$btnCacel.show();
			this.$btnEdit.hide();
			this.$(".js-personal-form").form().form("enable");
			this.$(".js-user-code").attr("disabled",true);
		},
		btnCancelClick: function(){
			this.$btnOK.hide();
			this.$btnCacel.hide();
			this.$btnEdit.show();
			this.afterRender();
		},
		btnOKClick: function(){
			var that = this;	
			var param = {};	
			if (that.$(".js-personal-form").form().isValid()){						
				param = fish.extend(that.userInfo,that.$(".js-personal-form").form("getValue", false));
				personalAction.modUserInfoBySelf(param,function(){
					//弹出提示，修改成功
					fish.success(i18nPersonal.PERSON_USER_MOD_SUCCESS);
					that.$btnOK.hide();
					that.$btnCacel.hide();
					that.$btnEdit.show();
					that.$(".js-personal-form").form("disable");
				});		
			}
			
		},
		resize: function(delta) {
			this.$(".js-profile-body").height(this.$el.outerHeight() - 22);
			this.$(".js-personal-tab").height(this.$(".js-profile-body").parent().outerHeight() - 2);
			this.$(".js-personal-tab > .ui-tabs-panel").outerHeight( this.$(".js-personal-tab").innerHeight()- this.$(".js-personal-tab > .ui-tabs-nav").outerHeight(true) );
			return this;
		}
	});
})
