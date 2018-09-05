define([
    "text!oss_core/inms/pm/templateManage/components/views/TemTabsView.html",
    "oss_core/inms/pm/templateManage/components/views/BasePageView.js",
    "oss_core/inms/pm/templateManage/components/views/HostPageView.js",
    "oss_core/inms/pm/templateManage/components/views/MacroPageView.js"
], function(tpl, BasePageView, HostPageView, MacroPageView) {
    var pageMap = {
        "BasePage": BasePageView,
        "HostPage": HostPageView,
        "MacroPage": MacroPageView
    }
    var TemTabsView = function(options) {
        this.TemplateDto = {}
        this.tabView = {}
        this.options = options;
        this.$el = $(this.options.el);
        this.upObj = this.options.upObj;
        this.type = this.options.type;
        this.pEl = this.options.pEl;
        this.tpl = fish.compile(tpl);
    }

    TemTabsView.prototype.render = function() {
        this.$el.html(this.tpl());
        this.afterRender()
    }

    TemTabsView.prototype.afterRender = function() {
        this.tabs = this.$el.find('.gtabs').tabs();
        this.addTabs("BasePage", "基本配置", true);
        this.addTabs("HostPage", "监测点");
        this.addTabs("MacroPage", "宏");

    }

    TemTabsView.prototype.addTabs = function(page, label, active) {
        var ViewPage = pageMap[page]
        if (!ViewPage) return;
        var id = "kdo-g-tabs-" + page;
        this.tabs.tabs("add", {
            id: id,
            "active": active,
            'label': label
        });
        var el = $("<div class='" + id + "-page'></div>")
            .appendTo(this.$el.find("#" + id));
        this.page = new ViewPage({
            'el': el,
            'upObj':this.upObj,
            'type':this.type,
            'parent':this.$el,
            'TemplateDto':this.TemplateDto,
            'pEl':this.pEl
        });
        this.page.render();
        this.tabView[page] = this.page
    }

    TemTabsView.prototype.getInfo = function() {
        this.getTabInfo()
        return this.TemplateDto;
    }

    TemTabsView.prototype.getTabInfo = function() {
        this.tabView['BasePage'].getInfo();
        this.tabView['HostPage'].getInfo();
        this.tabView['MacroPage'].getInfo();
    }

    return TemTabsView;
});