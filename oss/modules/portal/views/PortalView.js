define(['text!modules/portal/templates/Portal.html',
    "i18n!modules/portal/i18n/portal",
    "modules/common/actions/CommonAction",
    "modules/myfavmgr/actions/MyFavoriteAction",
    "modules/portal/models/DefaultMenu",
    "./ComprivContextMenu",
    "./MenuUtils"
], function (portalTemplate, i18nData, CommonAction, myFavAction, defaultMenu, ComprivContextMenu, menuUtils) {
    var PortalView = portal.BaseView.extend({
        template: fish.compile(portalTemplate), //主模板
        className: "container-main",
        el: 'body',
        events: {
            'click #btnProfile': 'profileClick',
            'click #btnDesigner': "designerClick",
            'click #btnRefreshMenu': 'refreshMenuClick',
            'click #btnLogOut': 'logout',
            'click #btnClickHelp': 'showHelp',
            'click .portal-skin': 'changeSkin',
            'click .portalMenu a': 'changePortal',
            'click #btnClickAbout': 'showAbout',
            'click #btnMyFavorite': 'myFavoriteClick',
            'click .portal-menu-searchbar .btn': 'searchbarClick'
        },

        render: function () {
            this.$el.html(this.template(i18nData));
        },

        initialize: function (option) {
            this.MenuUtils = new menuUtils(this);
            //监听view的菜单改变事件,用户更改helpCode的url
            portal.appGlobal.on("change:currentMenu", this.changeHelpCode, this); 
            //绑定高度自适应事件
            this._resizeHandler = fish.onResize(function() {
                this.MenuUtils.resizeMenu(portal.appGlobal.get("currentMenu"));
            }.bind(this));       
            this.pwdExpiredRemind = option.pwdExpiredRemind;
            this.pwdExpiredDays = option.pwdExpiredDays;
        },

        afterRender: function () {
            var that = this;
            that.$(".username").html(portal.appGlobal.get("userName"));
            var logo = portal.appGlobal.get("logo");
            if(logo) {
                that.$("#mvnolog").attr("src", "download?fileName=" + encodeURIComponent("mvno/" + logo));   
            }
            //初始化首页页签
            var workSpaceMenu = defaultMenu.workspace;
            that.$("#divContent").tabs({
                paging: true,
                activate: function (event, ui) {

                    var oldTab = ui.oldPanel;
                    if(!$.isEmptyObject(oldTab)){
                        var oldView = that.getView("#" + oldTab.attr("id"));
                        //进入菜单或离开菜单，执行菜单的menuEnter和menuLeave方法
                        if (oldView && fish.isFunction(oldView.menuLeave)) {
                            oldView.menuLeave.call(oldView, null);
                        }
                    }

                    var newTab = ui.newPanel,
                        $divContext = $("#" + newTab.attr('id')),
                        menuObj = $divContext.data();

                    if (!menuObj.menuId) {//不是通过tabs的add方法新增的菜单,此时没有menuid,只有workspace
                        menuObj = workSpaceMenu;

                    }
                    portal.appGlobal.set("currentMenu", menuObj); //设置当前的菜单

                    //设置菜单id到后台session,第一次创建菜单的话,需要加载页面，因此采用Deferred方式实现
                    CommonAction.setCurrentMenu(menuObj.menuId).then(function(){
                        portal.appEvent.triggerMenuChanged().done(function(){
                            view = that.getView($divContext.selector);
                            if (view && fish.isFunction(view.menuEnter)) {
                                view.menuEnter.call(view, null);
                            }
                            that.MenuUtils.resizeMenu(portal.appGlobal.get("currentMenu"));
                        });
                    });
                   
                }.bind(this),
                remove: function (e, ui) {
                    var id = $(ui.panel).attr("id");
                    that.removeView('#' + id);
                }
            }); 
            //workspace加载之后,设置tabs为可删除模式
            that.$("#divContent").tabs("option", "canClose", true);
            that.$("#divContent").tabs("option", "tabCanCloseTemplate", "<li><a title='#{label}' href='#{href}'><button type='button' class='ui-tabs-close close' role='button'><span aria-hidden='true' title='close'>&times;<span class='sr-only'>Close</span></span></button>#{label}</a></li>");

            //进入之后，需要根据参数配置渲染头部按钮等基础数据
            portal.appEvent.when(
                that.portalListDFD(),
                that.systemParamsDFD(),                
                that.contextMenuDFD()
            ).done(function(a,b,c){
                portal.appEvent.when(that.menuDisplayDFD()).done(function(){
                    //头部按钮等基础数据加载完成,派发FrameReady事件,业务产品可以根据之前的内容加载自己的页面元素
                    //等业务的代码执行完成之后，执行workspaceMenu的加载
                    portal.appEvent.triggerFrameReady().done(function(){
                        that.requireView({
                            url: workSpaceMenu.menuUrl,
                            selector: "#tabs-WorkSpace"
                        });
                    })
                });
                
            });

            //workspace页面之后，会触发此回调。此时内部的Portlet尚未加载完成。
            portal.appEvent.onceWorkspaceReady(function($def){
                that.mayOpenInitMenu();
                that.setPageMinWidth();
                that.autoOpenFavMenuDFD();
                //通知打开收藏夹中默认打开的菜单或者通过鉴权自动定位的菜单;

                //在workspace上添加右键菜单
                // that.createContextMenu();
            });

            if ( this.pwdExpiredRemind ){
                this.pwdExpired();
            }
        },

        autoOpenFavMenuDFD : function(){
            return myFavAction.qryUserFavMenuListByPortalId(portal.appGlobal.get("portalId"),
                function(favMenuList) {
                    console.log("after workspace ready and autoopen menu......");
                    if (favMenuList.length > 0){
                        for (var i = 0; i<favMenuList.length; i++){
                            if (favMenuList[i].alias) {
                                favMenuList[i].menuLabel = favMenuList[i].alias;
                            } else {
                                favMenuList[i].menuLabel = favMenuList[i].privName;
                            }
                            favMenuList[i].menuUrl = favMenuList[i].url;
                            if (favMenuList[i].isDefaultOpen == "Y"){    
                                portal.openMenu(favMenuList[i]);
                                break;
                            }
                        }
                    }                                                          
                }
            );
        },

        portalListDFD : function(){
            var that = this,
                userId = portal.appGlobal.get("userId");
            return CommonAction.qryPortalListByUserId(userId, function (portalList) {
                if (portalList.length > 1) {
                    for (var i = 0; i < portalList.length; i++) {
                        if (portal.appGlobal.get("portalId") == portalList[i].portalId) {
                            that.$(".portalMenu").append("<li class='portal-menu__item active'>" +
                                "<a href='javascript:void 0'" + (portalList[i].url == ''?" ":" data-url=" + portalList[i].url) +  (portalList[i].extraUrl ? " data-extraurl=" + portalList[i].extraUrl : " ")  + " data-id=" + portalList[i].portalId + ">" + fish.escape(portalList[i].portalName) + "</a>" +
                                "</li>");
                        }
                        else {
                            that.$(".portalMenu").append("<li class=" + "portal-menu__item" + ">" +
                                "<a href='javascript:void 0'" + (portalList[i].url == ''?" ":" data-url=" + portalList[i].url) + (portalList[i].extraUrl ? " data-extraurl=" + portalList[i].extraUrl : " ")  + "  data-id=" + portalList[i].portalId + ">" + fish.escape(portalList[i].portalName) + "</a>" +
                                "</li>");
                        }
                    }                   
                    that.$("#portalDropdown").show();
                }
                //用户不拥有任何门户。直接提示
                if (portalList.length == 0){
                    fish.warn(i18nData.USER_NO_PORTAL);
                }
                //用户有门户，但是没有设置默认门户，取第一个
                else if (!portal.appGlobal.get("portalId")){
                    portal.appGlobal.set("portalId",portalList[0].portalId);
                    that.$(".portalMenu > li:first").addClass("active");
                }
            });
        },

        //TODO 这里有问题,在默认门户没有设置的时候,存在取不到的情况;这个方法应该等portalListDFD执行完了再处理
        menuDisplayDFD : function(){
            var def = $.Deferred(); 
            if (portal.appGlobal.get("leftMenu")) {
                this.requireView({
                    url: "modules/menu/views/LeftMenuView",
                    selector: ".js-left-menu",
                    viewOption: {"$menuDef":def}
                });
            } else {
                this.requireView({
                    insert: true, //.js-top-menu这里有点特殊，里面已经有html了
                    url: "modules/menu/views/MenuView",
                    selector: ".js-top-menu",
                    viewOption: {"$menuDef":def}
                });
            }
            return def;
        },

        systemParamsDFD : function(){
            return CommonAction.qryCommonParams(function (data) {
                if (data[0] === "true") {
                    $("#btnClickHelp").show();
                    portal.appGlobal.set('helpUrl', data[1]);
                    $("#btnHelp").attr("href", data[1]);
                }
                fish.config.set("dateDisplayFormat.datetime", data[2]);
                fish.config.set("dateDisplayFormat.date", data[3]);
                fish.config.set("dateDisplayFormat.time", data[4]);
                if (data[5] === "true") {
                    this.$("#btnDesigner").show();
                }
                if (data[6] === "true") {
                    var themes = fish.store.get("themes");
                    if (themes) {
                        this.$(".portal-skin").children(':first-child').removeClass('icon-skin-solid');
                        this.$(".portal-skin").each(function(index,item){
                            if(themes.indexOf($(item).data("themes"))>0){
                                $(item).children(':first-child').addClass('icon-skin-solid');
                                return false;
                            }
                        })
                    }
                    this.$("#btnSkin").show();
                }
            }.bind(this));
        },

        contextMenuDFD : function(){
            return CommonAction.isAdmin(function (item) {
                if (item == true) {
                    ComprivContextMenu.create(this)
                }
            }.bind(this));
        },
        
        mayOpenInitMenu: function() {
        	var initMenu = fish.cookies.get('INIT_MENU');
        	if (initMenu && initMenu.indexOf('"') == 0) {
        		initMenu = initMenu.slice(1);
        	}
        	if (initMenu && initMenu.lastIndexOf('"') + 1 == initMenu.length) {
        		initMenu = initMenu.slice(0, -1);
        	}
        	if (initMenu == "null") {
        		initMenu = "";
        	}
        	if (initMenu) {
                this.MenuUtils.openMenu("", initMenu);
        		fish.cookies.remove('INIT_MENU');
        	}
        },

        //navbar 按钮功能
        profileClick: function (event) {
            var personalMenu = defaultMenu.personal;
            personalMenu.menuLabel = i18nData.PROFILE;
            portal.openMenu(personalMenu);
        },
        designerClick: function (event) {
            var designerMenu = defaultMenu.designer;
            designerMenu.menuLabel = i18nData.DESIGNER;
            portal.openMenu(designerMenu);
        },
        showHelp: function () {
            window.open($("#btnHelp")[0].href);
        },
        showAbout: function () {
        	require(["modules/about/views/AboutView"], function (AboutView) {
                new AboutView().render();
            });
        },
        myFavoriteClick: function (event) {
            fish.popupView({
                url: "modules/myfavmgr/views/MyFavoriteMgr"
            });
        },
        changeHelpCode: function (view, menuObj) {
            var url = portal.appGlobal.get('helpUrl');
            if (menuObj && menuObj.privCode != null) {
                url = url + "?" + menuObj.privCode;
            }
            $("#btnHelp").attr("href", url);
        },
        
        
        logout: function (e) {
            
            portal.appEvent.triggerLogoutBefore().done(function(){
                this.remove();
                window.location.href="logout";

                // fish.post("logout", function (data) {
                //     debugger;
                //     //刷新浏览器,全部重加载,不用清理portal.appGlobal
                //     window.location.reload();
                // });  
            }.bind(this));
    
        },
        changeSkin: function (event) {
            
            if (event && event.currentTarget) {
                var $target = $(event.currentTarget);
                var cssHref = "static/styles/{0}.css".replace("{0}",$target.data("css"));
                var themesHref = "static/frm/fish-desktop/css/fish-desktop-{0}.min.css".replace("{0}",$target.data("themes"));
                $("#indexCss").attr("href", cssHref);
                $("#themesCss").attr("href", themesHref);
                fish.store.set("skin", cssHref);
                fish.store.set("themes", themesHref);
                $target.siblings().children(':first-child').removeClass('icon-skin-solid');
                $target.children(':first-child').addClass('icon-skin-solid');
            }
            
        },
        changePortal: function (e) {
            var $target = $(e.target);
            var portalUrl = $target.data('url');
            //上一个portal的url
            var oldPortalUrl = $(".portalMenu > .portal-menu__item.active > a").data("url");
            var portalId = $target.data('id') + "";
            var currentPortalId = portal.appGlobal.get('portalId') + "";
            
            if (portalId !== currentPortalId) {
                portal.appEvent.triggerFrameOff().done(function(){
                    if (oldPortalUrl === portalUrl){
                        portal.appGlobal.set('portalId', portalId);
                        portal.appGlobal.trigger("change:currentStatus", e);
                    } else {
                        fish.cookies.set('INIT_PORTAL',portalId)
                        window.top.location.href = portalUrl;
                    }    
                })
            }
            
        },

        refreshMenuClick: function (event) { //获取当前选中的项
            this.MenuUtils.refreshMenu();
        },

        remove: function () {
            portal.appGlobal.off("change:currentMenu", this.changeHelpCode, this);

            fish.offResize(this._resizeHandler);

            if ($("#context-menu").length > 0) {
                $("#context-menu").contextmenu("destroy");
                if ($("#context-menu").length > 0) {
                    $("#context-menu").remove();
                }
            }

            portal.appGlobal.set("currentMenu", null);

            // one more thing:
            // system menu might be reloaded
            portal.allMenu = null;
        },

        setPageMinWidth: function () {
            var $sidebarWidth = $('.ui-sidebar-wrapper').width();
            if ($sidebarWidth > 0) {
                $('.wrap-page').css('min-width',(1024 + $sidebarWidth)+'px');
            }
        },

        searchbarClick: function () {
            var $searchbar = $('.portal-menu-searchbar'),
            $searchbarWidth = $('.portal-menu-searchbar').width();
            $(".portal-menu-searchbar .form-control").clearinput();
            if ($searchbarWidth < 200) {
                $searchbar.animate({width: '200px'}, 120);
                var dataSource = fish.filter(portal.allMenu,function(obj){
                    return !obj.children;
                });
                dataSource = fish.pluck(dataSource,"partyName");
                $(".portal-menu-searchbar .form-control").autocomplete({
                    source: dataSource,
                    rowCount: 10,
                    customClass: 'portal-search-menu__list',
                    select: function (e, ui) {
                        var menuList = fish.filter(portal.allMenu,function(obj){
                            return obj.partyName == ui.item.value;
                        });
                        if(menuList.length >0){
                            var menu = menuList[0];
                            portal.openMenu(menu.partyId, menu.url, menu.menuType, menu.partyName);
                        }
                    }
                });
            } else {
                $searchbar.animate({width: '30px'}, 120);
            }
        },
        pwdExpired: function(){
            var ts = this ;                 
            CommonAction.qryCurrentUser(function(userStaffInfo) {
                ts.userInfo = userStaffInfo;  
                if (ts.userInfo){
                    fish.popupView({
                        url:'modules/pwdmgr/views/ModPwdPopWin',
                        canClose: false,
                        viewOption:{mustModify: true, userCode: ts.userInfo.userCode}               
                    })
                }
            });   
        }
        
    });    
    return PortalView;
});
