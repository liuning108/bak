/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/MapColorCfg.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil",
        'frm/fish-desktop/third-party/colorpicker/fish.colorpicker',
        'css!frm/fish-desktop/third-party/colorpicker/colorpicker.css'
    ],
    function(MapColorView, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(MapColorView),

            events : {
                "change #ad-mapcolorcfg-color-select" : "mapColorSelectChange",
                "click #ad-mapcolorcfg-ok" : "fnOK",
                "click #ad-mapcolorcfg-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.mapColorCfg = inParam.mapColorCfg.split(",");
                this.color_from_value = this.mapColorCfg[1];
                this.color_to_value = this.mapColorCfg[0];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                var colorSelObj = this.$("#ad-mapcolorcfg-color-select");
                this.colorList = [
                    { id: 1, name: this.resource.DEFAULT, color_from: '#ffff00', color_to: '#ffa500'},
                    { id: 2, name: this.resource.GRADUAL_RED, color_from: '#ffa9a9', color_to: '#ef6064'},
                    { id: 3, name: this.resource.GRADUAL_GREEN, color_from: '#c7ccac', color_to: '#0d9347'},
                    { id: 4, name: this.resource.GRADUAL_BLUE, color_from: '#a3ccf8', color_to: '#4a72c9'},
                    { id: 5, name: this.resource.GRADUAL_PURPLE, color_from: '#d3c3db', color_to: '#7260af'},
                    { id: 999, name: this.resource.USER_DEFINED, color_from: '', color_to: ''}
                ];
                var colorId = 999;
                fish.forEach(this.colorList, function(colorItem){
                    colorSelObj.append("<option value='" + colorItem.id + "'>" + colorItem.name + "</option>");
                    if(colorItem.color_from == self.color_from_value && colorItem.color_to == self.color_to_value){
                        colorId = colorItem.id;
                    }
                });
                //
                if(colorId){
                    this.$("#ad-mapcolorcfg-color-select").val(colorId);
                }
                //
                this.$("#ad-mapcolorcfg-color-from").colorpicker();
                this.$("#ad-mapcolorcfg-color-from").off();
                this.$("#ad-mapcolorcfg-color-from").on("move.colorpicker", function(e, color) {
                    self.color_from_value = color.toHexString();
                    self.$("#ad-mapcolorcfg-color-select").val(999);
                    self.refreshColorDisplay();
                });
                this.$("#ad-mapcolorcfg-color-to").colorpicker();
                this.$("#ad-mapcolorcfg-color-to").off();
                this.$("#ad-mapcolorcfg-color-to").on("move.colorpicker", function(e, color) {
                    self.color_to_value = color.toHexString();
                    self.$("#ad-mapcolorcfg-color-select").val(999);
                    self.refreshColorDisplay();
                });
                this.$("#ad-mapcolorcfg-color-from").colorpicker("set", this.color_from_value);
                this.$("#ad-mapcolorcfg-color-to").colorpicker("set", this.color_to_value);
                this.refreshColorDisplay();
            },

            mapColorSelectChange: function() {
                var self = this;
                var colorId = this.$("#ad-mapcolorcfg-color-select").val();
                fish.forEach(this.colorList, function(colorItem){
                    if(colorItem.id == colorId && colorId!=999){
                        self.color_from_value = colorItem.color_from;
                        self.color_to_value = colorItem.color_to;
                        self.refreshColorDisplay();
                    }
                });
            },

            refreshColorDisplay: function () {
                this.$('#ad-mapcolorcfg_1').attr("stop-color", this.color_from_value);
                this.$('#ad-mapcolorcfg_2').attr("stop-color", this.color_from_value);
                this.$('#ad-mapcolorcfg_3').attr("stop-color", this.color_to_value);
                this.$("#ad-mapcolorcfg-color-from").colorpicker("set", this.color_from_value);
                this.$("#ad-mapcolorcfg-color-to").colorpicker("set", this.color_to_value);
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var mapColorCfg = this.color_to_value+","+this.color_from_value;
                this.trigger("okEvent", {mapColorCfg: mapColorCfg});
            },

            resize: function() {
                return this;
            }
        });
    }
);
