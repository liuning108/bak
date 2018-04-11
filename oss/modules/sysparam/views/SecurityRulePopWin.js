define([
	'text!modules/sysparam/templates/SecurityRulePopTemplate.html',
	'modules/sysparam/actions/SecurityAction',
	'i18n!modules/sysparam/i18n/securitymgr',
	'modules/common/actions/CommonAction'
], function(template, securityAction, i18nSecurityMgr, commonAction) {
	return portal.BaseView.extend({
		template: fish.compile(template),
		status: null,
		events: {
			"click .js-level-button": "levelButtonClick",
			"click .js-edit": "editClick",
			"click .js-cancel": "cancelClick",
			"click .js-ok": "okClick"
		},
		initialize: function(options) {
			this.userCodeCompositeArray = [{
				text: i18nSecurityMgr.SECURITY_USER_COMPOSITION_1,
				value: "1"
			}, {
				text: i18nSecurityMgr.SECURITY_USER_COMPOSITION_2,
				value: "2"
			}, {
				text: i18nSecurityMgr.SECURITY_USER_COMPOSITION_3,
				value: "3"
			}, {
				text: i18nSecurityMgr.SECURITY_USER_COMPOSITION_4,
				value: "4"
			}];

			this.passwordCompositeArray = [{
				text: i18nSecurityMgr.SECURITY_PWD_COMPOSITION_1,
				value: "1"
			}, {
				text: i18nSecurityMgr.SECURITY_PWD_COMPOSITION_2,
				value: "2"
			}, {
				text: i18nSecurityMgr.SECURITY_PWD_COMPOSITION_3,
				value: "3"
			}, {
				text: i18nSecurityMgr.SECURITY_PWD_COMPOSITION_4,
				value: "4"
			}, {
				text: i18nSecurityMgr.SECURITY_PWD_COMPOSITION_5,
				value: "5"
			}];
		},
		render: function() {
			this.setElement(this.template(i18nSecurityMgr));

			this.editButton = this.$(".js-edit");
			this.closeButton = this.$(".js-close");

			this.okButton = this.$(".js-ok");
			this.cancelButton = this.$(".js-cancel");

			this.statusChange();
		},
		afterRender: function() {
			var that = this;
			that.$('.js-user-code-composite').combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: this.userCodeCompositeArray
			});

			that.$('.js-password-composite').combobox({
				dataTextField: 'text',
				dataValueField: 'value',
				dataSource: this.passwordCompositeArray
			});

			that.detailForm = that.$(".js-form-detail").form().form("disable");

			commonAction.qrySecurityLevel(function(data) {
				if (data) {
					var level = data;
					that.changeByLevel(level);
					commonAction.qrySecurityRuleByLevelCode(level, function(result){
						that.detailForm.form("value",result);
					});
				}
			});
		},
		editClick: function() {
			this.status = "EDIT";
			this.statusChange();
		},
		cancelClick: function() {
			this.status = null;
			this.statusChange();
			this.detailForm.resetValid();
			this.changeByLevel(this.currentLevel); //重新触发一次事件
		},
		okClick: function() {
			if (this.detailForm.isValid()) { //如果校验成功
				var data = this.detailForm.form("value");
				data.levelId = this.currentSecurity.levelId;
				data.levelCode = this.currentSecurity.levelCode;
				securityAction.editSecurityRule(data, function(data) {
					this.detailForm.form("disable");
					this.status = null;
					this.statusChange();
					fish.success(i18nSecurityMgr.SECURITY_MODIFY_SUCCESS);
				}.bind(this));
			}
		},
		statusChange: function() {
			if (this.status && this.status == "EDIT") {
				this.editButton.hide();
				this.closeButton.hide();
				this.okButton.show();
				this.cancelButton.show();
				if (this.detailForm) {
					this.detailForm.form("enable");
				}
			} else {
				this.editButton.show();
				this.closeButton.show();
				this.okButton.hide();
				this.cancelButton.hide();
				if (this.detailForm) {
					this.detailForm.form("disable");
				}
			}
		},
		levelButtonClick: function(event) {
			if (event && event.target) {
				var $target = $(event.target);
				var level = $target.attr("level");
				if (level) {
					this.currentLevel = level;
					this.$(".js-level-button").each(function() {
						var $btn = $(this);
						var levelTemp = $btn.attr("level");
						if (levelTemp == level) {
							$btn.addClass("active");
						} else {
							$btn.removeClass("active");
						}
					});
					commonAction.qrySecurityRuleByLevelCode(level, function(data) {
						this.detailForm.form('value', data);
						this.status = null;
						this.statusChange();
						this.currentSecurity = data;
					}.bind(this));
				}
			}
		},
		changeByLevel: function(level) {
			if (level) {
				this.$(".js-level-button[level=" + level + "]").trigger("click"); //触发对应的事件
			}
		}
	});
});