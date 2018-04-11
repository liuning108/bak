define(function() {
	return {
		isVerifyCodeEnabled: function(success) {
			return fish.get("verificationcode/enabled", success);
		},
		getSupportLang: function(success){
			return fish.get("languages", success);
		},
		login: function(param,success,error) {
			var option = {};
			option.url = "login";
			option.data = param;
			option.success = success;
			option.error = error;
			fish.postBasic(option);
		},
		makeLoginMagicCode: function(userCode, passwd) {
			return fish.ajax({
				type: 'GET',
				url: "magiccode",
				xhrFields: {
					withCredentials: true
				},
				headers: {
					'Authorization': 'Basic ' + btoa(userCode + ":" + passwd)
			    }
			});
		}
	}
});