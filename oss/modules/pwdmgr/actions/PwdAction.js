define(["webroot"],function(webroot) {
	return {
		changeUserPwd: function(newPwd, oldPwd, userCode, success) {
			fish.patch("users/self/pwd", {oldPwd: oldPwd,newPwd: newPwd, userCode: userCode}, success, webroot);
		}
	
	}
});
