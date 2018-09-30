/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/FilterPluginCfg.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(RuleMgrView, action, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),

            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-fp-ok" : "fnOK",
                "click #ad-fp-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.inParam = inParam;
                this.panel_id = inParam.panel_id?inParam.panel_id:'';
                this.plugin_param = null;
                this.modelCode = inParam.modelCode;
                this.pluginList = [];
                this.currentPluginView = null;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                this.$form = this.$(".js-adhoc-filterplugin-form");
                var pluginSelObj = this.$("#ad-fp-select");
                action.qryPluginList(function (pluginList) {
                    self.pluginList = [];
                    if (pluginList && pluginList.length > 0) {
                        fish.forEach(pluginList, function (item) {
                            self.pluginList[self.pluginList.length] = item;
                            var value = item.PLUGIN_NO;
                            var text = item.PLUGIN_NAME
                            pluginSelObj.append("<option value='" + value + "'>" + text + "</option>");
                        });
                    }
                    pluginSelObj.on("change", function(e){
                        self.pluginSelectChange();
                    });
                    if(self.inParam.FILTER_NAME){
                        self.loadParam();
                        self.plugin_param = self.inParam.PLUGIN_PARAM;
                        var pluginNo = self.$('#ad-fp-select').val();
                        fish.forEach(self.pluginList, function(pluginItem){
                            if(pluginItem.PLUGIN_NO == pluginNo){
                                self.loadPlugin(pluginItem.PLUGIN_URL);
                            }
                        });
                    }else{
                        self.pluginSelectChange();
                    }
                });
            },

            pluginSelectChange: function () {
                this.currentPluginView = null;
                this.plugin_param = null;
                var self = this;
                var pluginNo = this.$('#ad-fp-select').val();
                fish.forEach(this.pluginList, function(pluginItem){
                    if(pluginItem.PLUGIN_NO == pluginNo){
                        self.loadPlugin(pluginItem.PLUGIN_URL);
                    }
                });
            },

            loadPlugin: function (moduleUrl) {
                var self = this;
                require([moduleUrl], function(FilterPlugin) {
                    var view = new FilterPlugin({
                        modelCode: self.modelCode
                    });
                    view.render();
                    view.afterRender();
                    self.$("#ad-fp-container").html(view.$el);
                    self.listenTo(view, 'backToListView', function () {

                    });
                    self.listenTo(view, 'refreshTopicTree', function () {

                    });
                    self.currentPluginView = view;
                    if(self.plugin_param) {
                        self.currentPluginView.setPluginParams(self.plugin_param);
                    }
                });
            },

            loadParam: function() {
                this.$('#ad-fp-name-input').val(this.inParam.FILTER_NAME);
                this.$('#ad-fp-select').val(this.inParam.PLUGIN_NO);
            },

            fnOK: function() {
                var self = this;
                if (!this.$form.isValid()) {
                    return;
                }
                var filter_name = this.$('#ad-fp-name-input').val();
                var filter_plugin = this.$('#ad-fp-select').val();
                var filter_plugin_name;
                fish.forEach(self.pluginList, function(plugin){
                    if(plugin.PLUGIN_NO == filter_plugin){
                        filter_plugin_name = plugin.PLUGIN_NAME;
                    }
                });
                var plugin_param = null;
                if(this.currentPluginView != null){
                    plugin_param = this.currentPluginView.getPluginParams();
                    if(!plugin_param){
                        return;
                    }
                }
                this.trigger("filterPluginOkEvent", {
                    panel_id: this.panel_id,
                    FILTER_NAME: filter_name,
                    PLUGIN_NO: filter_plugin,
                    PLUGIN_NAME: filter_plugin_name,
                    PLUGIN_PARAM: plugin_param
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    }
);
