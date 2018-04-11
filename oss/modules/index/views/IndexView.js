define(["i18n!modules/index/i18n/index",
    "./AppUrl",
    "modules/common/actions/CommonAction"
], function (i18n,appUrl,CommonAction) {

    
    //begin 以下代码作为示例提供
    // portal.appEvent.onDomReady(function($def){
    //     console.log("onPortalDomReady trigger ......");
    //     $def.resolve();
    // });

    // portal.appEvent.onWorkspaceInit(function($def){
    //     console.log("onWorkspaceInit trigger ......");
    //     $def.resolve();
    // });
    // 
    // 
    

    // portal.appEvent.onIframeMenuOpen(function($def){
    //     // portal.appGlobal.get("currentMenu") 可以获取到对应的菜单,根据菜单编码来干一些事情
    //     console.log("onIframeMenuOpen trigger ......");
    //     // $def.resolve(new url);
    //     // do something about url&token
    //     $def.reject("new url"); //可以通过reject(),不再走框架的默认逻辑
    // });
    //end

    
    var IndexView = portal.BaseView.extend({

        initialize: function () {
            portal.appGlobal.on("change:currentStatus", this.currentStatusChange, this); //监听menuView的菜单加载完的事件
            document.title = i18n.PROJECT_TITLE;
            this.portalView = null;
        },

        index: function () {
            var that = this;
            var d1 = fish.get("logged", function (data) {
              if(!data.userId){
                //根据配置项加载不同的登录页
                require([data.loginPage], function (LoginView) {
                     new LoginView().render();
                 });
              } else {
                portal.appGlobal.set("userId", data.userId);
                portal.appGlobal.set("userCode", data.userCode);
                portal.appGlobal.set("userName", data.userName);
                portal.appGlobal.set("portalId", data.portalId);
                portal.appGlobal.set("leftMenu", data.leftMenu);
              
                if (data._csrf && data._csrf.token){
                    portal.appGlobal.set("_csrf", data._csrf.token);
                    portal.appGlobal.set("_csrf_header", data._csrf.headerName);                   
                }

                // 将staffjob的选择提前，避免每次选门户的时候触发
                portal.appEvent.triggerEnterBefore().done(function(){
                    // portal.appGlobal.set("currentStatus", "running");
                    that.mainViewRender(data);
                });
              }
            });
        },

        currentStatusChange: function () { //登录状态改变
            if ("sessionTimeOut" == portal.appGlobal.get("currentStatus")) {
            	  fish.store.set("reLogin", i18n.SESSION_TIME_OUT_REASON);
                window.location.href= portal.appGlobal.get('webroot');
            } else if ("beenKickedFromLogin" == portal.appGlobal.get("currentStatus")) {
            	  fish.store.set("reLogin", i18n.SESSION_TIME_OUT_BEEN_KICKED);
                window.location.href= portal.appGlobal.get('webroot');
            } 
            else {
                var portalId = portal.appGlobal.get("portalId");
                var extraurl = $(".portalMenu").find("[data-id="+portalId+"]").data("extraurl");
                this.mainViewRender({extraUrl: extraurl});
            }
           
        },

        mainViewRender : function(data){
            var that = this;
            // var portalId = portal.appGlobal.get("portalId");
            //根据portalId获取extraUrl; TODO 第一个门户,extraUrl取不到,不应该通过portalMenu来取,而在设置默认portalId的同时查出来
            // var extraurl = $(".portalMenu").find("[data-id="+portalId+"]").data("extraurl");
            if(data.extraUrl && data.extraUrl != 'undefined' ){
                
                require([data.extraUrl], function() {
                    require(['modules/portal/views/PortalView'], function (PortalView) {
                        if (that.portalView !== null){
                            new PortalView(data).undelegateEvents().render();
                        }
                        else{
                            that.portalView = new PortalView(data);
                            that.portalView.render();
                        }
                    });
                });
            } else {
                require(['modules/portal/views/PortalView'], function (PortalView) {
                    if (that.portalView !== null){
                        new PortalView(data).undelegateEvents().render();
                    }
                    else{
                        that.portalView = new PortalView(data);
                        that.portalView.render();
                    }
                });
            }
        }
        
    });


    return IndexView;
});