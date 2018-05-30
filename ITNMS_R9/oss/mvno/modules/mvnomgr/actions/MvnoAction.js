define(["webroot"],function(webroot) {
	return {
		qryMvnoList : function(success) {
			fish.get("mvnos",success, webroot);
		},
		addMvno : function(mvnoDto, success){
			fish.post("mvnos", mvnoDto, success, webroot);
		},
		modMvno : function(mvnoDto, success){
			fish.put("mvnos", mvnoDto, success, webroot);
		},
		delMvno: function(spId, success){
			fish.remove("mvnos/" + spId, success, webroot);
		},
		modMvnoUser: function(spId, userPrivList, success){
			fish.post("mvnos/" + spId + "/user/priv", {spUserPriv:userPrivList}, success, webroot);
		},
		queryMvnoUser: function(spId, success){
			fish.get("mvnos/" + spId + "/user", success, webroot);
		},
		queryAuthInfo: function(acct, spId, success, errorfuc){
			if (acct == "ngportal"){
				fish.get("mvnos/" + spId + "/auth", success, webroot);
			}
			else
			{
				// fish.get(acct + "/mvnos/" + spId + "/auth", success, webroot);
				fish.ajax({
					type : 'GET',
					url : (webroot ? webroot:"") + (fish.restPrefix ? fish.restPrefix + "/" :"") + acct + "/mvnos/" + spId + "/auth",
					success : function(re){
						success && success(re);
					},
					showError :false,
					error : function(xhr, status, error) {
						errorfuc && errorfuc(error);
					}
				});
			}
		},
		queryNoticeInfo: function(acct, spId, success, errorfuc){
			if (acct == "ngportal"){
				fish.get("mvnos/" + spId + "/notice", success, webroot);
			}
			else
			{
				// fish.get(acct + "/mvnos/" + spId + "/auth", success, webroot);
				fish.ajax({
					type : 'GET',
					url : (webroot ? webroot:"") + (fish.restPrefix ? fish.restPrefix + "/" :"") + acct + "/mvnos/" + spId + "/notice",
					success : function(re){
						success && success(re);
					},
					showError :false,
					error : function(xhr, status, error) {
						errorfuc && errorfuc(error);
					}
				});
			}
		},
		sendNotice: function(acct, url, success, errorfuc){			
			if (acct == "ngportal"){
				fish.get(url, success, webroot);
			}
			else
			{
				// fish.get(acct + "/mvnos/" + spId + "/auth", success, webroot);
				fish.ajax({
					type : 'GET',
					url : (webroot ? webroot:"") + (fish.restPrefix ? fish.restPrefix + "/" :"") + url,
					success : function(re){
						success && success(re);
					},
					showError :false,
					error : function(xhr, status, error) {
						errorfuc && errorfuc(error);
					}
				});
			}
		},
		qryMvnoHisCount: function(cond, success) {
			return fish.get("mvnos/history/count", cond, success, webroot);
		},
		qryMvnoHis: function(cond, filter, success) {
			return fish.get("mvnos/history", fish.extend(cond, filter), success, webroot);
		},
		qryCurrentUserSpList : function(success) {
			return fish.get("mvnos/currentUser/sps", success, webroot);
		},
		setCurentSpId:function(spId, success) {
			return fish.put("mvnos/" + spId + "/currentUser", success, webroot);
		}
	};
});