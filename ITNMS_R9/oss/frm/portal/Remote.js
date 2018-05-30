/**
 * @deprecated
 * 请使用restful 方式调用服务
 * 兼容portal8.1版本
 */
define(function() {
	function prepareData(serviceName, data, filter) {
		data = data || {};
		data.zsmart_referer_url = window.location.href;

		if (filter) {
			data.zsmart_query_page = {};
			if (fish.isString(filter.PageIndex)
					&& fish.isString(filter.PageLen)) {
				data.zsmart_query_page.page_index = filter.PageIndex;
				data.zsmart_query_page.page_size = filter.PageLen;
			} else if (filter.PageIndex > -1 && filter.PageLen > 0) {
				data.zsmart_query_page.page_index = filter.PageIndex + "";
				data.zsmart_query_page.page_size = filter.PageLen + "";
			}
			if (filter.Count) {
				data.zsmart_query_page.count = true;
			}
			if (filter.OrderFields != null) {
				data.zsmart_query_page.order = filter.OrderFields;
			}
			if (filter.ShowFields != null) {
				data.zsmart_query_page.fields = filter.ShowFields;
			}
		}

		// var currentMenu = portal.appGlobal.get("currentMenu") || null;
		// currentMenu = fish.clone(currentMenu);
		// if(currentMenu){
		// currentMenu.MenuID = currentMenu.menuId;
		// delete currentMenu.menuID;
		// currentMenu.MenuUrl = currentMenu.menuUrl;
		// delete currentMenu.menuUrl;
		// }
		return {
			ServiceName : serviceName,
			Data : data,
			zsmart_origin_menu : currentMenu = portal.appGlobal
					.get("currentMenu")
					|| null
		};
	}

	function getProjectUrl(serviceName,webroot) {
		var url = "callservice.json?service=" + serviceName;
		if (webroot) {
			return webroot + url;
		}
		return portal.appGlobal.get("webroot") + "/" + url;
	}

	function callRemote(serviceName,webroot, data, filter, options) {
		var deferred = $.Deferred();
		var actualUrl = getProjectUrl(serviceName,webroot);

		fish.ajax($.extend({
			processData : false,
			type : "POST",
			contentType : "text/json",
			dataType : "json",
			showMask : true, // 是否采用默认的全局遮罩
			showError : true, // 不采用默认的提示错误的方式
			url : actualUrl,
			xhrFields : {
				withCredentials : true
			},
			data : JSON.stringify(prepareData(serviceName, data, filter))
		}, options)).then(function(result) {
			if (result.isSuccess) {
				if (3 == result.serviceType) { // 表示的是SQL服务
					if (filter && filter.Count) { // 表示的是查询COUNT
						deferred.resolve(result.z_d_r[0].CNT);
					} else {
						deferred.resolve(result.z_d_r);
					}
				} else { // 表示的是Java服务
					 deferred.resolve(result);
				}
			} else {
				deferred.reject(result);
			}
		}, deferred.reject);

		return deferred.promise();
	}

	function callRemoteService(serviceName, webroot, data, success, filter,
			error, options) {
		if (fish.isFunction(data)) { // 如果data是function,表示没有参数
			options = error;
			error = filter;
			filter = success;
			success = data;
			data = {};
		}

		var obj;
		var promise = callRemote(serviceName,webroot, data, filter, options)
				.then(
						function(result) {
							obj = result;
							return (success && success(result)) || result;
						},
						function(err) {
							if (0 == err.ExceptionType) { // 表示的是业务异常
								if (error) {
									error(err);
								} else {
									fish.warn(err.Msg || err.MsgCode);
								}
							} else {
								if (err.MsgCode == "S-SYS-00027") { // Session过期
									if (portal.appGlobal.get("currentStatus") != "sessionTimeOut") {
										portal.appGlobal.set("currentStatus",
												"sessionTimeOut");

									}
								} else if (err.MsgCode == "S-LOGIN-00002") { // 被剔除
									if (portal.appGlobal.get("currentStatus") != "beenKickedFromLogin") {
										portal.appGlobal.set("currentStatus",
												"beenKickedFromLogin");
									}
								} else {
									if (error) {
										error(err);
									} else {
										fish.error(err.Msg);
									}
								}
							}
						});

		if (options && options.async === false) {
			// 同步调用返回值
			return obj;
		} else {
			// 异步调用返回Promise对象
			return promise;
		}
	}
	
	function callService(serviceName, data, success, filter, error, options) {
		if (fish.isFunction(data)) { // 如果data是function,表示没有参数
			options = error;
			error = filter;
			filter = success;
			success = data;
			data = {};
		}

		var obj;
		var promise = callRemote(serviceName,"", data, filter, options)
				.then(
						function(result) {
							obj = result;
							return (success && success(result)) || result;
						},
						function(err) {
							if (0 == err.ExceptionType) { // 表示的是业务异常
								if (error) {
									error(err);
								} else {
									fish.warn(err.Msg || err.MsgCode);
								}
							} else {
								if (err.MsgCode == "S-SYS-00027") { // Session过期
									if (portal.appGlobal.get("currentStatus") != "sessionTimeOut") {
										portal.appGlobal.set("currentStatus",
												"sessionTimeOut");

									}
								} else if (err.MsgCode == "S-LOGIN-00002") { // 被剔除
									if (portal.appGlobal.get("currentStatus") != "beenKickedFromLogin") {
										portal.appGlobal.set("currentStatus",
												"beenKickedFromLogin");
									}
								} else {
									if (error) {
										error(err);
									} else {
										fish.error(err.Msg);
									}
								}
							}
						});

		if (options && options.async === false) {
			// 同步调用返回值
			return obj;
		} else {
			// 异步调用返回Promise对象
			return promise;
		}
	}

	return {
		/**
		 * [异步方式执行后台服务]
		 * 
		 * @param {[String]}
		 *            serviceName [服务名称]
		 * @param {[Object]}
		 *            data [服务对应的数据，JSON格式,可为空]
		 * @param {[Object]}
		 *            filter [服务对应的filter]
		 * @param {[Function]}
		 *            success [服务成功时候的回调]
		 * @param {[Function]}
		 *            error [服务失败时候的回调]
		 * @return {[Object]} [通过回调来调用服务，所以返回的值为null]
		 */
		callService : callService,
		/**
		 * [同步方式执行后台服务]
		 * 
		 * @param {[String]}
		 *            serviceName [服务名称]
		 * @param {[Object]}
		 *            data [服务数据]
		 * @param {[Function]}
		 *            success [成功之后的回调]
		 * @param {[Object]}
		 *            filter [服务对应的filter（针对查询服务有效，主要是分页数据，排序数据等等）]
		 * @param {[Function]}
		 *            error [失败之后的回调]
		 * @param {[Object]}
		 *            custOptions
		 *            [ajax相关的其他的一些用户自定义的参数，比如是否显示mask，beforeSend，complete事件等等]
		 * @return {[Object]} [如果有回调函数，则返回的是回调函数执行之后的值，否则直接返回服务对应的值]
		 */
		callServiceSyn : function(serviceName, data, success, filter, error,
				custOptions) {
			return callService(serviceName, data, success, filter, error, $
					.extend({
						async : false
					}, custOptions));
		},
		callRemoteService : callRemoteService,
	}
});
