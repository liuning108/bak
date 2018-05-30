define(["modules/common/actions/CommonAction",
        "modules/portal/models/DefaultMenu",
        "i18n!modules/portal/i18n/portal"
], function (CommonAction, defaultMenu, i18nDate) {
	var prefix = "PORTAL_DIV_MENU_",
        workspaceId = "#tabs-WorkSpace",
        specialExt = "__",
        count = 0,
        getMenuDOMId = function (menuId) {
            return menuId == defaultMenu.workspace.menuId ? workspaceId : "#" + prefix + menuId;
        },
        getMenuSelector = function (menuId) {
            return $(getMenuDOMId(menuId), $("#divPortalContent"));
        };

    function MenuUtils(context) {
    	this.portalView = context;

        //将打开关闭菜单的方法挂载到portal实例对象上
        portal.openMenu = function (menuId, menuUrl, menuType, menuLabel, params, enforceOpen) {
            if (_.isObject(menuId)) {//参数也可以是menuObj
                var menuObj = menuId;
                params = menuObj.params;
                menuLabel = menuObj.menuLabel;
                menuType = menuObj.menuType;
                menuUrl = menuObj.menuUrl;
                menuId = menuObj.menuId;
                enforceOpen = menuObj.enforceOpen;
            }
            this.openMenu(menuId, menuUrl, menuType, menuLabel, params, enforceOpen);
        }.bind(this);
        
        portal.closeMenu = function (menuId, menuUrl) {
            var $menuId, $menuDiv, baseUrl;
            if (menuId) {
                $menuDiv = this.$("#divContent > [menuid=" + menuId + "]");
            } else if (menuUrl) {
                if (menuUrl.indexOf("?") > 0) {
                    menuUrl = menuUrl.substring(0, menuUrl.indexOf("?"));
                } 
                $menuDiv = this.$("#divContent > [menuurl='" + menuUrl + "']");
            }
            if ($menuDiv.length > 0) {
                this.$("#divContent").tabs("remove", $menuDiv.attr("id"));
            }
        };
    }

	MenuUtils.prototype = {
		openMenu: function (menuId, menuUrl, menuType, menuLabel, params, enforceOpen) {
        	if ($.isNumeric(menuId)) {
    			this.openMenuInner(menuId, menuUrl, menuType, menuLabel, params, enforceOpen);
            } else {
        		var that = this;
        		var url;
		        if (menuUrl) {
                    url = menuUrl;
                } else {
                    url = menuId;
                }
                var urlBack;
                if (url.indexOf("?") > 0) {
                    urlBack = url.substring(0, url.indexOf("?"));
                } else {
                    urlBack = url;
                }
                
                if(menuType == "I") {
                    that.openMenuInner(menuId, url, menuType, menuLabel, params, enforceOpen);
                } else {
                	CommonAction.queryMenuByMenuUrl(urlBack).then(function (data) {
                        var menu = data[0], id = menu.privId;
                        if (params && params.stringKey === true) {
                            id = menuId;
                        }
                        that.openMenuInner(id, url, menuType || menu.menuType, menuLabel || menu.privName, $.extend({"privCode": menu.privCode}, params), enforceOpen);
                    });
                }
               
            }
        },

        openMenuInner: function (menuId, menuUrl, menuType, menuLabel, params, enforceOpen) {
            params = params || {};
            if(menuType !== 'I') {//Iframe不解析在这里不解析参数
                var p = portal.utils.extractUrlParam(menuUrl);
                if (!enforceOpen){
                    menuUrl = p.url;
                }  
                fish.extend(params, p.params);
            } else {
            	var index = menuUrl.indexOf("?");
            	if(index > -1 ){
            		params = menuUrl.substring(index+1);                   
                    menuUrl = menuUrl.substring(0,index);                                 	
            	}
            }
            var containerId = getMenuDOMId(menuId),
                viewInstance = this.portalView.getView(containerId);
            if (getMenuSelector(menuId).length > 0 && $('div[id="PORTAL_DIV_MENU_'+ menuId+'"'+'][menuUrl="'+ menuUrl +'"]').length > 0) { //如果已经存在
                $("#divContent").tabs("option", "active", containerId); //选中当前的项
                // 如果参数中出现callback回调函数,在视图加载会调用
                if (fish.isFunction(params.callback)) {
                    params.callback.call(viewInstance, params);
                }
                if (fish.isFunction(viewInstance.refresh)) {
                    viewInstance.refresh.call(viewInstance, params);
                }
            } else {
                if (menuType == "O") { //Other类型的菜单
                    portal.appEvent.triggerOtherMenuOpen().then(function(newUrl){
                        window.open(newUrl || menuUrl);
                    });
                } else { //iframe类型的菜单也在这里处理
                    if (getMenuSelector(menuId).length > 0){
                        menuId = menuId + specialExt + (++count);
                    }
                    this.menuUrlRequire(menuId, menuLabel, menuType, menuUrl, params, enforceOpen)
                }
            }
        },

        menuUrlRequire: function (menuId, menuText, menuType, menuUrl, params, enforceOpen) { //S表示单页应用
            var that = this,
                containerId = getMenuDOMId(menuId),
                deferred = $.Deferred();
                menuIdBak = menuId;
            if (menuType == "I") {
                deferred.resolve();
            } else {               
                if (String(menuId).indexOf(specialExt) > 0) {
                    menuIdBak = parseInt(menuId.substring(0, menuId.indexOf(specialExt)));
                }
                if ($.isNumeric(menuIdBak)) {
                    CommonAction.qryRealCompPrivsByMenuId(menuIdBak).then(function (data) {
                        deferred.resolve(data);
                    });
                } else {
                    CommonAction.qryCompPrivsByPrivCode(params.privCode).then(function (data) {
                        deferred.resolve(data);
                    });
                }
            }
            $.when(deferred).done(function (status) {
                var comprivList = status || [];//TODO 注入,暂时先这样
                //1 动态设置tabs模板,使之激活之前就能取到menuid,menuurl;
                //2 触发tabs的active事件,设置session之后继续后续处理
                //3 设置session之后,记录日志,同时打开菜单
                var $tpl = $("<div>").data({
                    menuId: menuId,
                    menuUrl: menuUrl,
                    privCode: params.privCode,
                    menuName: menuText,
                    menuType: menuType
                }).attr({menuId: menuId,menuUrl: menuUrl});
                $("#divContent").tabs("option", "panelTemplate", $tpl).tabs("add", {
                    active: true,
                    id: prefix + menuId,
                    label: menuText
                });
                that.createContextMenu(prefix + menuId);
                portal.appEvent.onceMenuChanged(function ($def) {
                    //记录日志
                	var logDto = {};
                	logDto.comments = "Open Menu: " + menuText;
                	logDto.menuId = menuIdBak;
                	logDto.privName = menuText;
                	logDto.url = menuUrl;
                	logDto.menuType = menuType;
                    CommonAction.addMenuLog(logDto);
                    //如果是iframe
                    if (menuType == "I") {
                        $def.resolve(); //IFrame的菜单，直接返回
                        //为兼容旧的menuView,不使用requireView的方式加载
                        require(["modules/menu/views/IframMenuView"], function (View) {
                        	fish.isString(params) ? params = {_src:params}:"";

                            var view = new View(params);//iframe的params直接挂到原url后面
                            //view.$el.parent().addClass("no-padding tabs__content");//区分commonView
							//view.comprivList = comprivList;//组件权限直接挂到view对象上  iframe的权限控制不到
                            that.portalView.setView(containerId, view);//移除旧的替换成新的,参数为params为options对象
                            that.portalView.renderViews(containerId);//调用render方法
                            var oldUrl = params._src ? menuUrl +"?"+ params._src : menuUrl;

                            portal.appEvent.triggerIframeMenuOpen().then(function(){
                                //业务未拒绝时，继续执行框架逻辑  //resovle的时候需不需要支持业务返回的url？
                                var requireURI = oldUrl.substring(0,oldUrl.indexOf("iframe.html"));
                                if (requireURI) { //need to identify system type
                                    //去iframe登录一下再打开下面的src
                                    fish.ajax({
                                        type: 'GET',
                                        url: "magiccode",
                                        data: {
                                            TARGET_USER_ID: 1,
                                            TARGET_URL: encodeURIComponent(oldUrl)
                                        },
                                        showError:false //屏蔽报错
                                    }).then(function(magic) {
                                        var finalUrl = requireURI + "ajaxLogin.do?magic="+magic;
                                        view.$el.attr("src", finalUrl ).ready(function () {
                                            that.resizeIframeMenu(params,view);
                                        });
                                    });
                                } else {
                                    view.$el.attr("src", oldUrl ).ready(function () {
                                        that.resizeIframeMenu(params,view);
                                    });
                                }
                            },function(newUrl){
                                //业务返回自己的url
                                view.$el.attr("src", newUrl ).ready(function () {
                                    that.resizeIframeMenu(params,view);
                                });
                            })
                            
                        });
                    } else {

                    	//为兼容旧的menuView,不使用requireView的方式加载
                        var menuUrlBak = menuUrl;
                        if (menuUrl.indexOf("?") > 0) {
                            menuUrlBak = menuUrl.substring(0, menuUrl.indexOf("?"));
                        }

                        //开发者模式调用
                        if(portal.appGlobal.get("deployMode") == 'dev' ){
                            portal.clearRequireCache(menuUrlBak);
                        }
                        require([menuUrlBak], function (View) {
                            try{
                                if(View.prototype.manage){
                                    var view = new View(params);
                                    // view.$el.addClass("tabs__content");//区分commonView
                                    view.comprivList = comprivList;//组件权限直接挂到view对象上
                                    that.portalView.setView(containerId, view);//移除旧的替换成新的,参数为params为options对象
                                    that.portalView.renderViews(containerId);//调用render方法
                                } else {
                                    view = null;
                                    fish.error("The menu must use fish.view");
                                }
                            }finally{
                                $def.resolve();
                            }
                        },function(err){
                            console.error(err);
                            //出现错误时也解析，resolve
                            $def.resolve();
                        });
                    }
                });
            })
        },

        resizeIframeMenu:function (params,view) {
            this.resizeMenu(portal.appGlobal.get("currentMenu"));
            if (fish.isFunction(params.callback)) {
                params.callback.call(view, params);
            }
        },

        resizeMenu: function (menuObj) {
            var viewObj = this.portalView.getView(getMenuDOMId(menuObj.menuId));
            this.setFixedMenuHeight(menuObj.menuId);
            if (viewObj && (menuObj.menuName != "MVNO")) {
                var $el = viewObj.$el;
                var delta = $el.parent().height() - $el.outerHeight(true) - (fish.isIE ? 3 : 0);
            	$el.siblings(".slimScrollDiv").remove();
                var divH = $el.parents(".ui-tabs-panel").height();
                var divW = $el.parents(".ui-tabs-panel").width();
                $el.outerHeight(divH);
                $el.outerWidth(divW);
                if (fish.isFunction(viewObj.resize)) {
                	viewObj.resize(delta);
                }
            }
            this.portalView.$(".portalMenu").css('max-height',$('html').outerHeight(true)-$('.navbar-right').outerHeight(true));
        },

        //TODO iframe等分支还需要进一步确认下
        refreshMenu: function () {
        	var that = this,
                currentMenu = portal.appGlobal.get("currentMenu"),
                containerId = getMenuDOMId(currentMenu.menuId);
            if (currentMenu && currentMenu.menuId) { //如果menu有的话
            	CommonAction.qryRealCompPrivsByMenuId(currentMenu.menuId).then(function (status) {

                    var comprivList = status || [],
                		params = {},
                    	oldView = that.portalView.getView(containerId),
                    	params = $.extend({}, oldView.options);
                    
                    if (currentMenu.menuType == "I") { //表示的是iframe类型的菜单的时候,view保存不变,刷新src
                    	var oldUrl = params._src ? currentMenu.menuUrl +"?" + params._src : currentMenu.menuUrl;
                    	oldView.$el.attr("src", oldUrl ).ready(function () {
                            if (fish.isFunction(params.callback)) {
                                params.callback.call(oldView, params);
                            }
                        });

                    } else {
                        //开发者模式调用
                        if(portal.appGlobal.get("deployMode") == 'dev' ){
                            portal.clearRequireCache(currentMenu.menuUrl);
                        }
                    	//为兼容旧的menuView,不使用requireView的方式加载
                    	require([currentMenu.menuUrl], function (View) {
                    		if(View.prototype.manage){
                        		var view = new View(params);
                    			view.comprivList = comprivList;//组件权限直接挂到view对象上
                    			that.portalView.setView(containerId, view);//移除旧的替换成新的
                    			that.portalView.renderViews(containerId);//调用render方法
                    		} else {
                    			view = null;
                    			fish.error("The menu must use fish.view or portal.baseView.");
                    		}
                            if (view && fish.isFunction(view.menuEnter)) {
                                view.menuEnter.call(view, null);
                            }
                            that.resizeMenu(portal.appGlobal.get("currentMenu"));
                    	});
                    }
                });
            }
        },

        setFixedMenuHeight: function (menuId) {
            var $menuDiv = getMenuSelector(menuId);
            $menuDiv.css("overflow-y", 'auto');
            $menuDiv.css("overflow-x", 'hidden');
            var height = $menuDiv.parent().innerHeight() - $menuDiv.parent().children('.ui-tabs-nav').outerHeight(true);
            $menuDiv.outerHeight(height);
        },

        createContextMenu: function(id){
            var that = this;            
            var selector = 'ul.portal-tabs-nav > li[aria-controls = ' + id + ']';
            $.contextmenu({
                //指定触发右键菜单的元素选择器
                selector: selector,                  
                //菜单选项
                items: {
                    item1: {
                        name: i18nDate.PORTAL_CLOSE_OTHER_MENU, 
                        callback: function(e, item) {     
                            that.contextmenuUtil(false, selector);           
                        }
                    },
                    item2: {
                        name: i18nDate.PORTAL_CLOSE_ALL_MENU, 
                        callback: function(e, item) {
                            that.contextmenuUtil(true, selector); 
                        }
                    }
                }
            });
        },
        contextmenuUtil: function(clearAll, selector){
            var that = this;
            var arr = $("#divContent").tabs("getAllTabs");                         
            if (clearAll){
                $("#divContent").tabs("showTab", 0, true);
            }         
            else
            {
                $(selector).addClass("ui-tabs-active");
            }  
            var current = $("ul.portal-tabs-nav > li").index($(".ui-tabs-active"));                 
            for(var idx in arr){
                if(idx > 0 && idx !== current + ""){
                    $("#divContent").tabs("remove",clearAll?1 : parseInt(idx));
                    current = $("ul.portal-tabs-nav > li").index($(".ui-tabs-active"));
                    idx == 1;
                }                                
            }        
        }
	}

	return MenuUtils;
});