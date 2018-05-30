//copy from config.js+main.js

require.config({
	urlArgs: "v=9.1.0",
	waitSeconds : 0
});

define(['frm/portal/Portal' ], function(app) {
	
	fish.get("local").then(function(data){
		var deferred = $.Deferred();
		portal.appGlobal.set(fish.pick(data, "language", "shortLanguage","app","deployMode","currencyPrecision","projectCode"));
		
		fish.setLanguage(portal.appGlobal.get('shortLanguage'));

		if (fish.store.get("skin")) {
			$("#indexCss").attr("href", fish.store.get("skin"));
		}
		if (fish.store.get("themes")) {
			$("#themesCss").attr("href", fish.store.get("themes"));
		}
		
		portal.appGlobal.set("commoni18n", {});//框架公用的
		portal.appGlobal.set("customi18n", {});//客户定制的
		
		var extraurl = ["i18n/common." + data.shortLanguage];
		if(data.customLanguage){
			extraurl.push("i18n/custom." + data.customLanguage);
		}
		if(data.configJs && data.configJs.length>0){
			fish.each(data.configJs,function(url){
				extraurl.push(url + "/config");
			})
		}

		require(extraurl, function(commonI18n,customI18n) {
			portal.appGlobal.get("commoni18n")[data.language] = commonI18n;
			if (customI18n) {
				var argu = _.omit(customI18n,function(value, key, object) {
					return !/[^\s]+/.test(value);
				});
				portal.appGlobal.get("customi18n")[data.language] = argu;					
			}
			deferred.resolve();				
		})
		require(["modules/login/i18n/login." + data.language], function(loginI18n) {
			$("#btnLogin").text(loginI18n.LOGIN_LOGIN);		
			$(".js-can-choose").prepend(loginI18n.LOGIN_LOGIN);	
			$(".login__footer").text(loginI18n.LOGIN_FOOTER);
			$('[data-toggle="dropdown"]').dropdown({
				trigger: "hover"
			});
			$("#inputUserName").prop("placeholder", loginI18n.LOGIN_USERNAME);
			$("#inputPassword").prop("placeholder", loginI18n.LOGIN_PASSWORD);
			$("#verificationCode").prop("placeholder", loginI18n.LOGIN_VERIFY_CODE);
		})
		return deferred.promise();
	}).then(function(){
		fish.get("languages", function(result){				
			if(result && result.languageChoose && result.languageList && result.languageList.length > 0){
				$(".js-can-choose").show();
				this.languageList = result.languageList;
				for(var i = 0;i < result.languageList.length;i++){
					if(result.languageList[i].key == portal.appGlobal.get("language")){
						$(".js-login-language").html(result.languageList[i].showValue + "<span class='caret'></span>");
					}
					else
					{
						$(".js-login-ul").append("<li><a href='javascript:void(0)'>" + result.languageList[i].showValue + "</a></li>");
					}
				}
				$(".js-login-ul > li").on('click', function (e){			
					$(".js-login-ul").empty();
					var clickLi = $(e.currentTarget).text().replace('\n','');
					for(var i = 0;i < this.languageList.length;i++){
						if(this.languageList[i].showValue == clickLi){
							$(".js-login-language").html(this.languageList[i].showValue + "<span class='caret'></span>");
							portal.appGlobal.set("language",this.languageList[i].key);
							fish.cookies.set('ZSMART_LOCALE',this.languageList[i].key);
						}
						else
						{
							$(".js-login-ul").append("<li><a href='#'>" + this.languageList[i].showValue + "</a></li>");
						}
					}
					window.location.reload();
				}.bind(this));
			}	
		}.bind(this));	
		fish.get("verificationcode/enabled", function(data){
			if (data) {
				this.$(".js-verify-code").show();
			}
			else{
				$(".js-verify-code").hide();
			}
		});	
	});
});