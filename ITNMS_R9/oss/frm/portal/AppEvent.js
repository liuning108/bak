define(function() {

	var eventConst = {
		//等后面将登陆页面拆出去,loginafter要放到indexView里面，业务有一些内容需要在打开首页的时候处理
		LoginBefore:'plugin_login_before',
		LoginAfter:'plugin_login_after',
		EnterBefore:'plugin_enter_before',//进入主页之前的事件（如业务产品需要在进入之前选择好员工职位）
		LogoutBefore:'plugin_logout_before', //注销之前

		FrameReady:'plugin_frame_ready',  //主页外壳渲染完成的事件，页头、菜单信息等加载完成之后（如业务产品需要在页头部分新增一些业务的按钮）
		FrameOff:'plugin_frame_off',      //主页卸载离开的事件，一般用于门户切换（如业务产品切换到新门户之前，需要将页头部分的按钮事件清理掉）

		WorkspaceReady:'plugin_workspace_ready', //workspace页面包含内部的Portlet都渲染完成

		MenuChanged:'plugin_menu_changed', //菜单改变之后，后台更新了menuid，记录菜单打开日志，加载菜单内部服务之前
		IframeMenuOpen:'plugin_iframe_menu_open',//iframe菜单打开之前,业务产品可以返回自己按需拼接的url
		OtherMenuOpen:'plugin_other_menu_open'//外部系统菜单打开之前,业务产品可以返回自己按需拼接的url,一般用于新弹出窗口

	};

	var Event = {};
    Event.valMap = {};  //key,[def1,def2,...]
    Event._bind = function(key,func){
    	var def = $.Deferred(); 
    	if(_isDeferred(func)){ //传入的本身是deferred对象,用它本身
    		def = func;
    	}
		if(!this.valMap[key]){
			this.valMap[key] = [];
		} 
		this.valMap[key].push(def); 
		def.always(function(){ //def使用完之后移除
			this.valMap[key] = _.without(this.valMap[key],def);
		}.bind(this))
		return def;
	};
	Event.on = function(key,func){
		var def = this._bind(key,func);
		if(!_isDeferred(func)){
			//传入的如果是普通函数,需要在事件触发的时候响应到,并且将def对象作为业务的参数返回,业务需要在合适的时机处理掉resolve/reject
			portal.appGlobal.on(key,function(){
				func.call(null,def);
			}); 
		}
	};
	Event.once = function(key,func){
		var def = this._bind(key,func);
		if(!_isDeferred(func)){
			portal.appGlobal.once(key,function(){
				func.call(null,def);
			}); 
		}
	};
	Event.trigger = function(key){
		//派发事件,业务如果注册的是defer对象,需要在响应事件里面调用resolve/reject
        portal.appGlobal.trigger(key);
        //返回promise对象,等业务代码执行完成在执行框架的回调,使主流程进行下去
        var deferreds = this.valMap[key];
		if(deferreds && deferreds.length > 0){
	        return Event.when(deferreds);
		} else {
			var $d = $.Deferred();
			$d.resolve();
			return $d.promise();
		}
	};
	
	for (var key in eventConst) {
    	Event["on"+key] = (function(key,func){
    		return function(func){
    			Event.on(eventConst[key],func);
    		}
	    })(key);
	    Event["once"+key] = (function(key,func){
    		return function(func){
    			Event.once(eventConst[key],func);
    		}
	    })(key);
		Event["trigger"+key] = (function(key){
			return function(){
	    		return Event.trigger(eventConst[key]);
    		}
	    })(key)
    };

    Event.when = function(deferreds){
    	if (!fish.isArray(deferreds)) {
            deferreds = Array.prototype.slice.call(arguments);
        }
		var defer = $.Deferred();
        $.when.apply(this, deferreds).done(function () {
			var args = Array.prototype.slice.call(arguments).map(function (item, index) {
        		return _isAjax(deferreds[index]) ? item[0] : item;
    		})
		    switch (deferreds.length) {
		    	case 1: defer.resolve(args[0]); return;
		        case 2: defer.resolve(args[0],args[1]); return;
		        case 3: defer.resolve(args[0],args[1],args[2]); return;
		        default:  defer.resolve.apply(this,args); return;
		    }
        });
        return defer;
	};


    function _isDeferred(obj) {
        return obj && typeof obj.promise === 'function';
    }

    function _isAjax(obj) {
        return _isDeferred(obj) && obj.hasOwnProperty('readyState');
    }

	return Event;
});