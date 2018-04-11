define(["text!modules/login/templates/Login.html",
	"i18n!modules/login/i18n/login",
	"modules/login/actions/LoginAction",
	"modules/common/actions/CommonAction",
	"css!modules/login/css/login"
], function(loginTemplate, i18n, loginAction, CommonAction) {
	var LoginView = portal.BaseView.extend({
        el: 'body',
		template: fish.compile(loginTemplate),
		events: {
			'click #btnLogin': 'loginClick',
			'focus .js-toggle-focus': 'formFocus',
			'blur  .js-toggle-focus': 'formBlur',
			'click #imgVerifyCode': 'refreshVerifyCode',
			'click .js-del-user-name': 'clearUserName',
			'click .js-del-pwd': 'clearPwd',
			'click .js-login-ul > li': "changeLan"
		},

		render: function() {
			this.userCodeMaxLength = 60; //用户编码的最大长度
			this.userPasswordLength = 60; //用户密码的最大长度
			this.verifyCodeLength = 4; //验证码的最大长度

			this.$el.html(this.template(i18n));
			
			this.$('[data-toggle="dropdown"]').dropdown({
				trigger: "hover"
			});

			this.$(".js-verify-code").hide();

			this.$el.bind("contextmenu", function() { // 禁止右击，复制，粘贴和剪切等行为
				return false;
			}).bind("cut", function() {
				return false;
			}).bind("copy", function() {
				return false;
			}).bind("paste", function() {
				return false;
			});

			this.$("#inputUserName").bind("paste", function() { // 禁止用户名粘贴的行为
				return false;
			}).keydown(function(event) { //IE中keypress不支持功能按键
				this.checkLogin(event, 1);
			}.bind(this));

			this.$("#inputPassword").bind("paste", function() { // 禁止用户密码粘贴的行为
				return false;
			}).keydown(function(event) {
				this.checkLogin(event, 2);
			}.bind(this));

			this.$("#verificationCode").bind("paste", function() { // 禁止验证码粘贴的行为
				return false;
			}).keydown(function(event) {
				this.checkLogin(event, 3);
			}.bind(this));
			
			var $errorSpan = this.$("#errorMessageSpan"),
				error = fish.store.get("reLogin");
			if(error){
				$errorSpan.html(error);
				fish.store.remove("reLogin");
			}
			
		},

		afterRender:function(){

			loginAction.isVerifyCodeEnabled(function(data) {
				if (data) {
					this.verificationCode = true;
					this.refreshVerifyCode();
					this.$(".js-verify-code").show();
					this.$("#verificationCode").attr("data-rule", i18n.LOGIN_VERIFY_CODE + ":required;length[" + this.verifyCodeLength + "]");
				}
				this.loginForm = this.$("#loginForm").validator({
					hideMessage: true,
					fields: {
		            	"#inputUserName": i18n.LOGIN_USERNAME + ":required;length[1~" + this.userCodeMaxLength + "]",
		            	"#inputPassword": i18n.LOGIN_PASSWORD + ":required;length[1~" + this.userCodeMaxLength + "]"
		        	},
		            invalid:function(errors){
		                var html = "",
		                	retName = "";
		                $.map(errors, function(msg,value){
			                retName = $(value).attr('placeholder');
		                    html += '<p class="red">'+ retName + ': ' + msg +'</p>';
		                });
		                $("#errorMessageSpan").html(html);
		            }
				});	
			}.bind(this));
			loginAction.getSupportLang(function(result){
				if(result && result.languageChoose && result.languageList && result.languageList.length > 0){
					this.$(".canChoose").show();
					this.languageList = result.languageList;
	                for(var i = 0;i < result.languageList.length;i++){
	                	if(result.languageList[i].key == portal.appGlobal.get("language")){
	                		this.$(".js-login-language").html(result.languageList[i].showValue + "<span class='caret'></span>");
	                	} else {
	                		this.$(".js-login-ul").append("<li><a href='javascript:void(0)'>" + result.languageList[i].showValue + "</a></li>");
	                	}
	                }
				}
			}.bind(this));
		},

		changeLan: function(e){			
			this.$(".js-login-ul").empty();
			var clickLi = $(e.currentTarget).text().replace('\n','');
			for(var i = 0;i < this.languageList.length;i++){
            	if(this.languageList[i].showValue == clickLi){
            		this.$(".js-login-language").html(this.languageList[i].showValue + "<span class='caret'></span>");
            		portal.appGlobal.set("language",this.languageList[i].key);
            		fish.cookies.set('ZSMART_LOCALE',this.languageList[i].key);
            	}
            	else
            	{
            		this.$(".js-login-ul").append("<li><a href='#'>" + this.languageList[i].showValue + "</a></li>");
            	}
            }
            window.location.reload();
		},
		loginClick: function(event) {
			if (this.loginForm.isValid(true)) { //校验
				var userName = this.$("#inputUserName").val();
				var password = this.$("#inputPassword").val();
				
				var inputData = {
					username: userName,
					password: fish.Base64.encode(password)
				};
				if (this.verificationCode) {
					inputData.verificationCode = this.$("#verificationCode").val();
				}
				
				loginAction.login(inputData,function(data){
					var $errorSpan = this.$("#errorMessageSpan");
					var isSuccess = data.isSuccess;
					if (isSuccess) { //除了登录状态之外没有发生异常信息
						$errorSpan.html("");
						this.goToPortal(data);
					}
				}.bind(this),function(data){
					var error = data.responseJSON;
					var $errorSpan = this.$("#errorMessageSpan");
					var errorCode = error.code; //错误编码
					var errorMessage = error.message; //错误信息
					var $userName = this.$("#inputUserName");
					var $password = this.$("#inputPassword");
					var $versifyCode = this.$("#verificationCode");
					switch (errorCode) {
						case "POT-LOGIN-00004": //密码错误										
							// if (!this.RESOURCE_LOGIN_TIME_FIAL_TEMPLATE) {
							// 	this.RESOURCE_LOGIN_TIME_FIAL_TEMPLATE = fish.compile(i18n.LOGIN_FAIL_TIMES);
							// }
							// var loginFails = data.maxLoginRetry - data.loginFail;
							// if (loginFails) {
							// 	errorMessage += this.RESOURCE_LOGIN_TIME_FIAL_TEMPLATE({
							// 		times: loginFails
							// 	});
							// }
							$errorSpan.html(errorMessage);
							$versifyCode.val("");
							this.refreshVerifyCode();
							$password.focus();
							break;
						// case "POT-ACCOUNT-00006": //表示密码即将过期
						// 	if (!this.RESOURCE_PWD_EXC_NOTIFY_TEMPLATE) {
						// 		this.RESOURCE_PWD_EXC_NOTIFY_TEMPLATE = fish.compile(i18n.LOGIN_PWD_WILL_EXPIRED);
						// 	}
						// 	var excNotify = data.pwdExcNotify;
						// 	errorMessage = this.RESOURCE_PWD_EXC_NOTIFY_TEMPLATE({
						// 		expired: excNotify
						// 	});
						// 	$errorSpan.html(errorMessage);
						// 	fish.confirm(errorMessage + i18n.LOGIN_PWD_MODIFY_NOW,function() {
						// 			this.modifyPwd(false, data);
						// 		}.bind(this), function() {
						// 			this.goToPortal(data); //直接去portal，表示暂时不修改系统时间
						// 		}.bind(this));
						// 	break;
						case "POT-ACCOUNT-00007": //表示密码和默认密码相同
						case "POT-ACCOUNT-00005": //表示密码已经过期
							$errorSpan.html(errorMessage);
							this.modifyPwd(true, null);
							break;
						case "POT-LOGIN-00003": //没有用户
						case "POT-ACCOUNT-00002": //账号被冻结
						case "POT-ACCOUNT-00008": //用户过期								
						case "POT-ACCOUNT-00003": //失效账户
						case "POT-ACCOUNT-00001": //账户被禁用
						case "POT-LOGIN-00013": //超过最大在线数
							$errorSpan.html(errorMessage);
							$versifyCode.val("");
							this.refreshVerifyCode();
							$userName.focus();
							break;
						case "POT-ACCOUNT-00004": //超过最大重试次数
							var interva = data.unlockInterva;
							if (!this.RESOURCE_USER_UNLOCK_INTERVA) {
								this.RESOURCE_USER_UNLOCK_INTERVA = fish.compile(i18n.LOGIN_UNLOCK_INTERVA);
							}
							var errorMsg = this.RESOURCE_USER_UNLOCK_INTERVA({
								interva: interva
							});
							$errorSpan.html(errorMessage + errorMsg);
							break;
						case "POT-PORTAL-00001": //默认门户不存在
							$errorSpan.html(errorMessage);
							$versifyCode.val("");
							this.refreshVerifyCode();
							break;
						case "POT-ACCOUNT-00009": //验证码错误
							this.refreshVerifyCode(); //错误的时候刷新验证码
							$versifyCode.val("").focus();
						case "POT-ACCOUNT-00010": //其他原因
							this.refreshVerifyCode();
							$versifyCode.val("");
							$errorSpan.html(errorMessage);
							break;
						case "POT-LOGIN-00014": //不符合当前的安全规则
							$errorSpan.html(i18n.LOGIN_CHANGE_SECURITY);
							this.modifyPwd(true, null);
							break;
					}

				}.bind(this))
			}
			return false;
		},
		modifyPwd: function(mustModify, data) {
			var ts = this ;
			fish.popupView({
				url:'modules/pwdmgr/views/ModPwdPopWin',
				viewOption:{mustModify: mustModify,userCode: ts.$("#inputUserName").val()},
				close:function(newPwdData){
					ts.$("#inputPassword").val(newPwdData);
					ts.loginClick(); //重新登录
				},
				dismiss:function(){
					if (data && data.state == 11) { //表示密码即将过期，但是并没有修改密码的时候（点击了取消按钮）
						ts.goToPortal(data);
					}
				}
			})
		},
		goToPortal: function(portalData) {
			window.location.href= portal.appGlobal.get("webroot");
			// portal.appGlobal.set("currentStatus", "logged");
		},
		formFocus: function(event) {
			$('.js-input-focus').each(function() {
				$(this).removeClass('focus');
			});
			$(event.currentTarget).parents('.js-input-focus').addClass('focus');
		},
		formBlur: function(event) {
			$(event.currentTarget).parents('.js-input-focus').removeClass('focus');
		},
		refreshVerifyCode: function() {
			if(this.verificationCode){
				var id = Math.random() * 100000 + 1;
				this.$("#imgVerifyCode").attr("src", "verificationCode?" + id);
			}
		},
		checkLogin: function(eve, t) {
			var code = eve.keyCode || eve.which || eve.charCode;
			if (code == 13) {
				try {
					if (t == 1) {
						$("#inputPassword").focus();
					} else if (t == 2) {
						if (this.verificationCode) {
							$("#verificationCode").focus();
						} else {
							this.loginClick();
						}
					} else {
						this.loginClick();
					}
					eve.keyCode ? eve.keyCode = 0 : eve.which = 0;
					eve.preventDefault();
				} catch (e) {}
				return;
			}
			if (t == 1) { // Check if the Key pressed is digits or valid character in [A..Z,a..z] and TAB key which the code is 9;
				if (!(code >= 48 && code <= 57) && !(code >= 65 && code <= 90) && !(code >= 96 && code <= 122) && code != 45 && code != 95 && code != 8 && code != 9 && code != 37 && code != 39 && code != 189 && code != 173 && code != 190) {
					eve.keyCode ? eve.keyCode = 0 : eve.which = 0;
					eve.preventDefault();
					return;
				}
			}
		},
		clearUserName: function(){
			this.$("#inputUserName").val("");
		},
		clearPwd: function(){
			this.$("#inputPassword").val("");
		}
	});
	return LoginView;
});