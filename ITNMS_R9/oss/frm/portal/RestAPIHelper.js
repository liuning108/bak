define(function() {

	var callService = function (type, url, data, success, webroot){
		var option = {};
		if(fish.isObject(url)){//处理第一个参数是option的场景
			option = url;
			url = option.url;
			data = option.data;
			success = option.success;
			webroot = option.webroot;
		} else {
			if(fish.isFunction(data)){//第一个参数是url,第二个参数是回调函数,没有参数
				webroot = success;
				success = data;
				data = null;
			}
		}
		
		var url = (webroot ? webroot:"") + (fish.restPrefix ? fish.restPrefix + "/" :"") + url ;
		
		if(data){
			
			if(type !== "GET" && type !== "POSTBASIC" ){
				if(fish.isEmpty(data) ) {
					if(fish.isArray(data)){
						data = "[]";
					} else {
						data = "{}";
					}
				} else {
					data = JSON.stringify(data);
				}
			}
		} else {
			data = null;
		}
		// var token = $("meta[name='_csrf']").attr("content");
		// var header = $("meta[name='_csrf_header']").attr("content");
		var token = portal.appGlobal.get("_csrf");  
		var header = portal.appGlobal.get("_csrf_header");
		var ajaxOption = {
			type : type,
			url : url,
			data: data,
			success : function(re){
				success && success(re);
			},
			showError :false,
			showMask: true,
			beforeSend:function(xhr){
				xhr.setRequestHeader(header, token);
			},
			error : function(xhr, status, error) {
				if (xhr && xhr.responseText) {
                    var errorObj = {};
                    try {
                        errorObj = JSON.parse(xhr.responseText);
					} catch (e) {
                        fish.error(xhr.responseText); //responseText: "This session has been expired (possibly due to multiple concurrent logins being attempted as the same user)."
                        return false;
					}

					if(errorObj){
						if(errorObj.type === void(0)) {
	                    	// 请求异常
	                        console.error(xhr.responseText);
	                        fish.error({
	                            title: 'Ajax ' + status,
	                            message: url + ' ' + error
	                        });
						} else if(errorObj.type==0){ //业务异常
							fish.warn(errorObj.code + " : " + errorObj.message);
						} else { //系统异常
							if (errorObj.code == "S-SYS-00027") { //Session过期
			                    if (portal.appGlobal.get("currentStatus") != "sessionTimeOut") {
			                        portal.appGlobal.set("currentStatus", "sessionTimeOut");
			                    }
			                } else {
								fish.error(errorObj.message);
			                }
						}
					}else{
						fish.error({
		                    title: 'Ajax ' + status,
		                    message: url + ' ' + error
		                });
					}
	            } else { // 请求异常
	            	fish.error({
	                    title: 'Ajax ' + status,
	                    message: url + ' ' + error
	                });
	            }
            },
			//#72 先暂停跨域请求，IE8，IE9有问题
			xhrFields : {
				withCredentials : true
			},
			cache : false
		}
		$.extend(true,ajaxOption,fish.omit(option, 'url', 'data'));
		
		if(type !== "GET") {
			if(type == "POSTBASIC"){
				ajaxOption.type = "POST";
			} else {
				ajaxOption.contentType  = 'application/json';
				ajaxOption.processData = false;
			}
		} 
		
		return fish.ajax(ajaxOption);
	};

	/**
	 * GET /collection：返回资源对象的列表（数组） 
	 * GET /collection/{id}：返回单个资源对象 
	 * POST /collection：返回新生成的资源对象
	 * PUT /collection： 修改完整的资源对象 
	 * PATCH /collection/{id}：修改资源对象的部分属性 
	 * DELETE /collection/{id}：删除资源对象	 
	 **/
	
	
	fish.get = function(url, data, success, webroot) {
		return callService("GET",url, data, success, webroot);
	};

	fish.post = function(url, data, success, webroot) {
		return callService("POST",url, data, success, webroot);
	};

	fish.put = function(url, data, success, webroot) {
		return callService("PUT",url, data, success, webroot);
	};

	fish.patch = function(url, data, success, webroot) {
		return callService("PATCH",url, data, success, webroot);
	};

	fish.remove = function(url, data, success, webroot) {
		return callService("DELETE",url, data, success, webroot);
	};
	
	/**
	 * @since V9.0.7.1
	 * 提供基础的form表单的提交方式,与原post的区别在于不是以json方式交互
	 * contentType类型为默认值application/x-www-form-urlencoded
	 * 后台spring mvc的rest接口不能通过@requestBody获取，需要改成@requestParam
	 * 这种方式对于单数据，如string类型的参数处理起来比较方便
	 */
	fish.postBasic = function(url, data, success, webroot) {
		return callService("POSTBASIC",url, data, success, webroot);
	};

});
