define([
    'modules/menu/actions/MenuAction',
    'text!modules/menu/templates/LeftMenu.html',
    'frm/fish-desktop/third-party/pagesidebar/fish.pagesidebar',
    "css!frm/fish-desktop/third-party/pagesidebar/pagesidebar.css",
    "css!modules/menu/css/pagesidebar.css",
    "css!modules/menu/css/leftmenu.css"
], function (MenuAction, menuTemplate) {
    return portal.BaseView.extend({
        el:".js-left-menu",
        menuTemplate: fish.compile(menuTemplate),
        events: {
            'click .ui-sidebar-menu a[type=1]': 'menuClick'//,
            // 'click .ui-sidebar-menu a': 'menuClickAnimate'
        },

        menuClick: function (event) {
            if (event && event.target) {
                var $target = $(event.target);
                if ($target.is('span') || $target.is('i')) { //左侧菜单有span,i
                    $target = $target.closest("a");
                }
                //返回兄弟节点，确定点击的是否需要弹出新页面
                var $tars = $target.siblings();
                var menuId = $target.attr("menuId");
                var url = $target.attr("url");
                var menuType = $target.attr("menuType"); //菜单类型
                var text = $.trim($target.text());
                var privCode = $target.attr("privCode");
                // var appId = $target.attr("appId");
                portal.openMenu(menuId, url, menuType, text, {"privCode": privCode});
            }
        },

        // menuClickAnimate: function (e) {
        //     var $target = $(e.target);
        //     if ($target.is('span') || $target.is('a')) { //转成<a>
        //         $target = $target.closest("li");
        //     }
        //     //点击效果---begin
        //     var parent = $target.parent();

        //     if (parent.find("span.ink").length === 0) {
        //         parent.prepend("<span class='ink '></span>");
        //         setTimeout(function () {
        //             parent.find("span.ink").remove();
        //         }, 500);

        //     }

        //     var ink = parent.find(".ink");

        //     ink.removeClass("animate");

        //     if (!ink.height() && !ink.width()) {
        //         var d = Math.max(parent.outerWidth(), parent.outerHeight());
        //         ink.css({height: d, width: d});
        //     }

        //     var x = e.pageX - parent.offset().left - ink.width() / 2;
        //     var y = e.pageY - parent.offset().top - ink.height() / 2;

        //     if (parent.hasClass("sub-menu")) {
        //         y += $target.outerHeight();
        //     }

        //     ink.css({top: y + 'px', left: x + 'px'}).addClass("animate");
        //     //---end
        // },

        afterRender: function () {
            var currentPortalId = portal.appGlobal.get("portalId"), 
                that = this;
            $(".js-menu").removeClass("icon-menu-list").addClass("icon-menufold");
            if (currentPortalId) {
                MenuAction.qryMenuList(currentPortalId, function (menuList) {
                    portal.allMenu = menuList;
                    var menuTree = portal.utils.getTree(menuList, "partyId", "parentId", null); //获取树形结构
                    this.$el.next().addClass("page-container-wrapper").children('.ui-tabs').addClass('page-container');
                    this.setElement(this.menuTemplate({data: menuTree}));
                    this.$el.removeClass("display-none");
                    this.pagesidebar = this.$el.pagesidebar({
                        zIndex: 1000,
                        width: 230,
                        animate: true
                    });

                    //隐藏pageSideBar组件自带的收缩按钮
                    this.$(".ui-sidebar-toggler-wrapper").hide();
                    $(".js-menu").on("click", function () {
                        this.pagesidebar.find('.ui-sidebar-toggler').trigger("click");
                        var menuWidth = this.pagesidebar.find('.ui-sidebar-menu').width();
                        if ($(".js-menu").hasClass("icon-menufold")){
                            $(".js-menu").removeClass("icon-menufold").addClass("icon-menuunfold");
                        }
                        else
                        {                            
                            $(".js-menu").removeClass("icon-menuunfold").addClass("icon-menufold");
                        }
                        this.pagesidebar.width(menuWidth);
                        // this.pagesidebar.animate({width:menuWidth},'slow');
                        $(window).trigger("debouncedresize");
                    }.bind(this));

                    // $(".js-menu").trigger("click");
                    that.options.$menuDef.resolve();

                }.bind(this));
            }
            return this;
        },

        cleanup: function() {
            fish.offResize(this._resizeHandler);
        }
    });
});
