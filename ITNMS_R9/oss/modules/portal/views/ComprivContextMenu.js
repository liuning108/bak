/**
 * 界面元素权限，涉及按钮,tabs页签,grid的列
 */
define([
    "i18n!modules/portal/i18n/portal",
    "modules/common/actions/CommonAction",
    "modules/componentmgr/actions/ComponentAction",
    "frm/fish-desktop/third-party/contextmenu/fish.contextmenu",
    "css!frm/fish-desktop/third-party/contextmenu/contextmenu"
],function(i18nData, CommonAction, ComponentAction) {

    function checkComprivExist(capturedElement) {
        var menuId = capturedElement.menuId,
            objId = capturedElement.path;
        ComponentAction.qryCompInMenuByObjId(menuId, objId, function (privDto) {
            var option = {};
            privDto && fish.extend(option,{
                privId: privDto.privId,
                oldName: privDto.privName
            })
            createComprivPopWin(fish.extend(option, capturedElement));
        })
    }

    function createComprivPopWin(options) {
        fish.popupView({
            url:'modules/componentmgr/views/ComprivPopWin',
            viewOption:{
                model: {
                    objId: options.path,
                    menuUrl: options.menuUrl,
                    name: options.menuName + '-' + options.name,
                    oldName: options.oldName,
                    privEl: options.privEl
                }
            },
            close: function(msg) {
                options.name = msg.privName;
                options.privEl = msg.privEl;
                if (options.oldName) {
                    ComponentAction.modComponent(options, function (status) {
                        fish.info(i18nData.PORTAL_MOD_COMP_SUCCESS);
                    });
                } else {
                    ComponentAction.addComponent(options, function (status) {
                        fish.info(i18nData.PORTAL_ADD_COMP_SUCCESS);
                    });
                }
            }
        })
    }

    function getCapturedElement(e){
        var $target = $(e.originalEvent.target);
        if($target.parent().is('button') && $target.parent().attr('disabled') == undefined){
            $target = $target.parent();
        }     
        return fish.extend({
            name: $target.text() || $target.val() || "",
            $ELEMENT: $target,
            privEl:$target.attr("role-priv")
        }, calcPath($(e.currentTarget)));       
    }

    
    function calcPath($el) {
        var path = "",
            bubbleUp = function ($el) {
                var $parent = $el.parent();
                //IE8不支持localname，改用nodename
                var idx = $parent.children($el[0].nodeName.toLowerCase()).index($el);
                if (path) {
                    path = $el[0].nodeName.toLowerCase() + ":eq(" + idx + ")>" + path;
                } else {
                    path = $el[0].nodeName.toLowerCase() + ":eq(" + idx + ")";
                }
                if (!$parent.hasClass("comprivroot")) {
                    return bubbleUp($parent);
                }
                return $parent;
            },
            $view = bubbleUp($el),
            viewType = portal.utils.drawViewType($view),
            compid = (function () {
                var wrapid = "",
                    elemid = "";
                if ($view.parent().hasClass("ui-tabs-panel")) {
                    wrapid = $view.parent().attr("id");
                }
                if ($el.data("priv")) {
                    elemid = $el.data("priv");
                } else if ($el.attr("id")) {
                    elemid = $el.attr("id");
                } else if ($el.attr("name")) {
                    elemid = $el.attr("name");
                }
                return wrapid + "." + elemid;
            })(),
            menuObj = portal.appGlobal.get("currentMenu");
        return {
            path: viewType + "/" + compid + "/>" + path,
            menuId: menuObj.menuId,
            menuUrl: menuObj.menuUrl,
            menuName: menuObj.menuName
        };
    }

    return {
        create: function(that) {

            var capturedElement = null;

            $.contextmenu({
                //指定触发右键菜单的元素选择器
                selector: "button,div>.ui-nav-button,input[type='button'],div.ui-jqgrid-pager li,.ui-tabs[priv]>.ui-tabs-nav>li>a,div.grid th",
                //右键菜单展开事件
                show: function(e) {
                    capturedElement = getCapturedElement(e);
                },                            
                //菜单选项
                items: {
                    item1: {
                        name: i18nData.COMPONENT_SET_PRIV, 
                        callback: function(e, item) {
                            checkComprivExist(capturedElement);
                        }
                    }
                }
            });
        }
    }
});

