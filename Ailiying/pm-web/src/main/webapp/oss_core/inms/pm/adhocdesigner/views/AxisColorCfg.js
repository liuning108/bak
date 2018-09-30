/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/AxisColorCfg.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil",
        'frm/fish-desktop/third-party/colorpicker/fish.colorpicker',
        'css!frm/fish-desktop/third-party/colorpicker/colorpicker.css'
    ],
    function(RuleMgrView, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click .color-thumb": "colorClick",
                "click .field-value-item": "fieldItemClick",
                "click #ad-axiscolorcfg-ok" : "fnOK",
                "click #ad-axiscolorcfg-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.axisCfgYaxisList = inParam.axisCfgYaxisList;
                this.axisColorCfgYaxisList = inParam.axisColorCfgYaxisList;
                this.colModel = inParam.colModel;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var self = this;
                //
                this.$('#ad-axiscolorcfg-colorpanel').empty();
                for(var i=0;i<adhocUtil.getColorSeriesCount();i++){
                    this.$('#ad-axiscolorcfg-colorpanel').append(
                        '<li class="color-thumb" style="background-color: '+adhocUtil.getColorSeries(i)+';">'
                        + '<i class="bdp-icon ico-ok-white ico-no-opacity"></i></li>'
                    );
                }
                //
                this.$('#ad-axiscolorcfg-axislist').empty();
                for(var i=0;i<this.axisColorCfgYaxisList.length;i++){
                    var colorValue = this.axisColorCfgYaxisList[i];
                    var fieldValue;
                    fish.forEach(this.colModel, function(col){
                        if(col.index == self.axisCfgYaxisList[i]){
                            fieldValue = col.label;
                        }
                    });
                    var htmlText = '<li id="ad-axiscolorcfg-item-'+i+'" class="field-value-item nowrap '+(i==0?'selected':'')+'" title="'+fieldValue+'">'
                        + '<i id="ad-axiscolorcfg-item-i-'+i+'" class="color-thumb-sm" style="background-color: '+colorValue+'"></i>'
                        + '<span class="ng-binding">'+fieldValue+'</span></li>';
                    self.$('#ad-axiscolorcfg-axislist').append(htmlText);
                };
                this.$("#ad-axiscolorcfg-customecolor").colorpicker();
                this.$("#ad-axiscolorcfg-customecolor").off();
                this.$("#ad-axiscolorcfg-customecolor").on("move.colorpicker", function(e, color) {
                    self.$('.field-value-item.nowrap.selected i').css("background-color", color.toHexString());
                    self.$('.color-thumb').removeClass("checked");
                });
                this.setSelectColor("ad-axiscolorcfg-item-0");
            },

            fieldItemClick: function(e) {
                this.$('.field-value-item').removeClass("selected");
                var id = e.currentTarget.id;
                this.$('#'+id).addClass("selected");
                this.setSelectColor(id);
            },

            colorClick: function(e) {
                this.$('.color-thumb').removeClass("checked");
                e.currentTarget.className += " checked";
                var colorValue = this.$('.color-thumb.checked').css("background-color");
                this.$('.field-value-item.nowrap.selected i').css("background-color", colorValue);
                this.$("#ad-axiscolorcfg-customecolor").colorpicker("set", colorValue);
            },

            setSelectColor: function(itemId) {
                var colorValue = this.$('#'+itemId+' i').css("background-color")
                this.$('.color-thumb').removeClass("checked");
                fish.forEach(this.$('.color-thumb'), function(colorIitem){
                    if(colorValue.substring(0,colorIitem.style["background-color"].length)==colorIitem.style["background-color"]){
                        colorIitem.className += " checked";
                    }
                });
                this.$("#ad-axiscolorcfg-customecolor").colorpicker("set", colorValue);
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var self = this;
                this.axisColorCfgYaxisList = [];
                fish.forEach(this.$(".field-value-item"), function(item){
                    var colorValue = item.firstChild.style["background-color"];
                    self.axisColorCfgYaxisList[self.axisColorCfgYaxisList.length] = adhocUtil.rgbToHex(colorValue);
                });
                this.trigger("okEvent", {axisColorCfgYaxisList: this.axisColorCfgYaxisList});
            },

            resize: function() {
                return this;
            }
        });
    }
);
