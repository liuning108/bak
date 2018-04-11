define(['text!modules/menu/templates/Menu.html',
    'modules/menu/actions/MenuAction'
], function (menuTemplate, MenuAction) {
    return portal.BaseView.extend({
        events: {
            'click a[type=1]': 'menuClick'
        },

        menuClick: function (event) {
            var $target = $(event.target);
            var menuId = $target.attr("menuId");
            var url = $target.attr("url");
            var menuType = $target.attr("menuType"); //菜单类型
            var text = $.trim($target.text());
            var privCode = $target.attr("privCode");
            // var appId = $target.attr("appId");
            portal.openMenu(menuId, url, menuType, text, {"privCode": privCode});
        },

        menuTemplate: fish.compile(menuTemplate),
        afterRender: function () {
            var that = this;
            var currentPortalId = portal.appGlobal.get("portalId");
            if (currentPortalId) {
                MenuAction.qryMenuList(currentPortalId, function (menuList) {
                    portal.allMenu = menuList;
                    var treeData = portal.utils.getTree(menuList, "partyId", "parentId", null); //获取树形结构
                    that.setElement(that.menuTemplate(treeData));
                    that.$el.prev().dropdown({
                        trigger: "hover"
                    });
                    that.$el.find('.portal-menu').menu();
                    this._resizeHandler = fish.onResize(function() {
                        var menuMaxHeight = $(window).outerHeight() - 80;
                        that.$el.find('.portal-menu').css('max-height', menuMaxHeight + 'px');
                    }.bind(this));
                    this._resizeHandler();

                    that.options.$menuDef.resolve();
                }.bind(this));
            }
        }
    });
});
