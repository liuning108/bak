define([
    'text!modules/dynamicmenu/templates/Dynamic.html',
    'modules/dynamicmenu/actions/DynamicAction',
    'i18n!modules/dynamicmenu/i18n/dynamic',
    "modules/common/actions/CommonAction",
    "frm/gridstack/fish.gridstack"
], function (template, action,i18n,CommonAction) {

    return portal.BaseView.extend({
        template: fish.compile(template), //主模板

        resource: fish.extend({}, i18n),

        initialize: function() {
        },

        events: {
            "click .btn-config": "openConfig",
            "click #designer-btn-add-widget":"openWidgetPopWin",
            "click #designer-btn-save":"saveTemplate"
        },

        render: function () {
            this.setElement(this.template(this.resource));
        },

        afterRender: function () {
            var that = this;

            CommonAction.qrySysParamByMask("SUPER_ADMIN_USER_ID").then(function (data) {
                var userId = portal.appGlobal.get("userId");
                if (data && userId == data.currentValue) {
                    fish.confirm(i18n.DESIGNER_CONFIRM_EDIT, 
                        function () {
                            that.loadTemplate(true);
                        },function () {
                            that.loadTemplate();
                        }
                    );
                } else {
                    that.loadTemplate();
                }
            });
        },

        loadTemplate: function (editable) {
            if (editable) {
                this.gridstack = this.$('.grid-stack').gridStack({userParams:this.options});
                this.$(".designer-header").show().draggable();
            } else {
                this.gridstack = this.$('.grid-stack').gridStack({
                    disableDrag: true,
                    disableResize: true,
                    userParams:this.options
                });
            }
            this.loadMenuLayout(this.gridstack);
        },

        cleanup : function(){
            var portletViews = this.gridstack.viewInstance;
            fish.map(portletViews,function(view,key){
                view.remove();
            });
            this.gridstack.destroy();
        },

        refresh: function (params) {
            var portletViews = this.gridstack.viewInstance;

            fish.map(portletViews,function(view,key){
                fish.isFunction(view.refresh) && view.refresh.call(view, params);
            });
        },

        menuLeave: function () {
            var portletViews = this.gridstack.viewInstance;

            fish.map(portletViews,function(view,key){
                fish.isFunction(view.menuLeave) && view.menuLeave.call(view, null);
            });
        },

        menuEnter: function () {
            var portletViews = this.gridstack && this.gridstack.viewInstance;

            fish.map(portletViews,function(view,key){
                fish.isFunction(view.menuEnter) && view.menuEnter.call(view, null);
            });   
        },

        loadMenuLayout : function(gridstack){
            var that = this,
                portalId = portal.appGlobal.get("portalId"),
                menuId = portal.appGlobal.get("currentMenu").menuId;
            action.QryMenuLayout(portalId,menuId, function(data) {
                if(data) {
                    var widgets = JSON.parse(data.widgets);
                    gridstack.loadGrid(widgets);
                    that.currentTemplate = data.layoutId;
                }
            });
        },

        openConfig:function(e){
            var $target = $(e.currentTarget);
            this.$btnToolbar = this.$(".btn-toolbar");
            this.$toolbarBottom = this.$(".toolbar-bottom");
            if($target.hasClass("js-config")){
                $target.removeClass("js-config").addClass("icon-delete");
                this.$btnToolbar.removeClass("con-close");
                this.$toolbarBottom.removeClass("con-close");
                $('.designerPosition').css("display",'block');
                $('.designerPosition').position({
                    my: "left top",
                    at: "right top",
                    collision: "flip flip",
                    of:$target
                });
                var positionleft = Number($('.designerPosition').css('left').substring(0,$('.designerPosition').css('left').length-2));
                if(positionleft > 0){
                    $target.css('border-right',"none");
                    $target.css('border-left','1px solid #24b76c')
                }else{
                    $target.css('border-left',"none");
                    $target.css('border-right','1px solid #24b76c')
                }
            }else{
                $('.designerPosition').css("display",'none');
                $target.removeClass("icon-delete").addClass("js-config");
                this.$btnToolbar.addClass("con-close");
                this.$toolbarBottom.addClass("con-close")
            }
            e.stopPropagation();
        },

        openWidgetPopWin:function(){
            var that = this;
            fish.popupView({
                url:'modules/dynamicmenu/views/WidgetPopWin',
                close:function($selWid){
                    that.gridstack.loadGrid(that.gridstack.getSelectedGrids($selWid));
                }
            })
        },

        saveTemplate:function(){
            var options = {
                widgets: JSON.stringify(this.gridstack.getWidgetsData()),
                portalId: portal.appGlobal.get("portalId"),
                menuId: portal.appGlobal.get("currentMenu").menuId
            };
            if (this.currentTemplate) {
                options.layoutId = this.currentTemplate;
                action.ModMenuLayout(options, function(status) {
                    fish.info(i18n.DESIGNER_EDIT_LAYOUT_SUCCESS);
                }.bind(this));
            } else {
                action.AddMenuLayout(options, function(status) {
                    fish.info(i18n.DESIGNER_ADD_LAYOUT_SUCCESS);
                }.bind(this));
            }
        }
    });
});
