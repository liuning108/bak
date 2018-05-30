define([
	'text!modules/pwdmgr/templates/ModPwdPopWin.html',
	'i18n!modules/pwdmgr/i18n/pwd',
	'modules/pwdmgr/actions/PwdAction',
	"modules/common/actions/CommonAction",
	"css!modules/pwdmgr/css/pwdmgr" 
], function(template, i18Pwd, pwdAction,CommonAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		events: {
			"click .js-ok": "ok",
			"input .js-old-password": "changeAttr",
			"input .js-new-pwd": "changeNewAttr",
			"keyup .js-new-pwd": "showPwdSecurity" //新密码改变显示对应的安全等级
		},
		initialize: function(option) {
			this.mustModify = option.mustModify;
			this.userCode = option.userCode;
		},
		render: function() {
			this.setElement(this.template(i18Pwd));
			if (this.mustModify) {
				this.$(".js-cancel").hide();
			}
		},

		afterRender: function() {
			var that = this;
			this.userPwdMinLength = 1; //默认为1
			this.pwdComposition = 1; //默认组成规则为1
			this.userPwdMaxLength = 30;

			this.progressbar = this.$(".js-progressbar").progressbar({
				value: 0,
				change: function(event, ui) {
					var value = that.progressbar.progressbar("value");
					var color;
					var label;
					if (value <= 25) {
						that.progressbar.removeClass("warning success higher error").addClass('error');
						that.$(".js-pwd-label").html(i18Pwd.PWD_SECURITY_LEVEL_LOW).removeClass("security__level_error security__level_warning security__level_suc security__level_higher").addClass('pwd-security-error');
					} else if (value <= 50) {
						that.progressbar.removeClass("warning success higher error").addClass('warning');
						that.$(".js-pwd-label").html(i18Pwd.PWD_SECURITY_LEVEL_MEDIUM).removeClass("security__level_error security__level_warning security__level_suc security__level_higher").addClass('pwd-security-warning');
					} else if (value <= 75) {
						that.progressbar.removeClass("warning success higher error").addClass('success');
						that.$(".js-pwd-label").html(i18Pwd.PWD_SECURITY_LEVEL_HIGH).removeClass("security__level_error security__level_warning security__level_suc security__level_higher").addClass('pwd-security-suc');
					} else if (value <= 100) {
						that.progressbar.removeClass("warning success higher error").addClass('higher');
						that.$(".js-pwd-label").html(i18Pwd.PWD_SECURITY_LEVEL_HIGHER).removeClass("security__level_error security__level_warning security__level_suc security__level_higher").addClass('pwd-security-higher');
					}
				}
			});
			this.changeProgressValue(25); //修改成25，表示低等级
			this.$oldPwd = this.$(".js-old-password");
			this.$newPwd = this.$(".js-new-pwd");
			this.$confirmPwd = this.$(".js-confirm-pwd");

			this.$oldPwd.attr("data-rule", i18Pwd.PWD_OLD_PWD + ":required;length[1~" + this.userPwdMaxLength + "]");
			this.$confirmPwd.attr("data-rule", i18Pwd.PWD_CONFIRM_PWD + ":required;match[NEW_PWD]"); //确认密码和新密码一致

			this.detailForm = this.$(".js-detail").form();

			this.detailForm.validator({
				placement: "left",
				rules: {
					newPwd: function(element, param, field) {
						var password = element.value;
						var hasUpperCase = /[A-Z]/.test(password);
						var hasLowerCase = /[a-z]/.test(password);
						var hasSpecialChar = /[@#$%!&*]/.test(password);
						var hasDigistChar = /[0-9]/.test(password);
						switch (that.pwdComposition) {
							case "2":
								if (!hasDigistChar || (!(hasLowerCase || hasUpperCase))) {
									return i18Pwd.PWD_COMPOTION_2;
								}
								break;
							case "3":

								if (!hasDigistChar || !hasLowerCase || !hasUpperCase) {
									return i18Pwd.PWD_COMPOTION_3;
								}
								break;
							case "4":
								if (!hasDigistChar || (!(hasLowerCase || hasUpperCase)) || !hasSpecialChar) {
									return i18Pwd.PWD_COMPOTION_4;
								}
								break;
							case "5":
								if (!hasDigistChar || !hasLowerCase || !hasUpperCase || !hasSpecialChar) {
									return i18Pwd.PWD_COMPOTION_5;
								}
								break;
						}
						return true;
					}
				}
			});			
			
			CommonAction.qryCurrentSecurityRule(function(securityRule){
				that.userPwdMinLength = securityRule.pwdMinLength; //密码的最小长度
        		that.pwdComposition = securityRule.pwdComposition; //密码的组成规则
        		that.detailForm.validator("setField", "NEW_PWD", i18Pwd.PWD_NEW_PWD + ':required;length[' + that.userPwdMinLength + '~' + that.userPwdMaxLength + '];newPwd');
			});
		},
			
		ok: function() {
			if (this.detailForm.isValid()) { //校验控件
				var oldPwd = this.$oldPwd.val();
				var newPwd = this.$newPwd.val();
				pwdAction.changeUserPwd(fish.Base64.encode(newPwd), fish.Base64.encode(oldPwd),this.userCode,function(data) {
					fish.success(i18Pwd.PWD_MOD_SUCCESS,function() {
				        	this.popup.close(newPwd);
				        }.bind(this));
				}.bind(this));
			}
		},

		changeAttr: function(event){
			if(this.$(".js-old-password").val().length > 0){
				this.$(".js-old-password").attr("type", "password");
			}
			else
			{
				this.$(".js-old-password").attr("type", "text");
			}
		},	
		changeNewAttr: function(event){
			if(this.$(".js-new-pwd").val().length > 0){
				this.$(".js-new-pwd").attr("type", "password");
			}
			else
			{
				this.$(".js-new-pwd").attr("type", "text");
			}
		},	

		changeProgressValue: function(value) {
			this.progressbar.progressbar("option", {
				value: value
			});
		},
		showPwdSecurity: function(event) {
			var password = this.$newPwd.val();
			password = password.replace(/\s/g, ""); //删除空格
			this.$newPwd.val(password);
			var levelId = 1;
			if (password != "") {
				var levelId = this.checkPasswordSafe(password);
			}
			this.changeProgressValue(levelId * 25);
		},
		checkPasswordSafe: function(password) { //根据密码来判断安全等级
			var staffCode = this.userCode;			

			var containStaffCode = false;			
			var lengthShort = false;

			if (password.indexOf(staffCode) >= 0) { // 包含staffCode
				containStaffCode = true;
				return 1;
			}		
			if (password.length < 6) { // 密码长度小于6
				lengthShort = true;
				return 1;
			}
			var digitStr = /\d$/; // 所有数字
			var charStr = /\D$/; // 所有字符
			var specialStr = '@#$%!&*'; // 所有特殊字符
			var upperStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 所有大写字符

			var allDigits = true;
			var allChars = true;
			var allSame = true;
			var specialFlag = true;
			var upperCaseFlag = true;
			for (var i = 0; i < password.length; i++) {
				if (digitStr.test(password.charAt(i))) {
					allDigits = false;
				}
				if (charStr.test(password.charAt(i))) {
					allChars = false;
				}
				if (specialStr.indexOf(password.charAt(i)) >= 0) {
					specialFlag = false;
				}
				if (upperStr.indexOf(password.charAt(i)) >= 0) {
					upperCaseFlag = false;
				}
				if (i > 0) {
					if (password.charAt(i) != password.charAt(i - 1)) {
						allSame = false;
					}
				}
			}
			if (allSame)
				return 1;
			if (allDigits || allChars)
				return 2;
			if (password.length >= 8 && !specialFlag && !upperCaseFlag)
				return 4;
			return 3;
		}
	});
});