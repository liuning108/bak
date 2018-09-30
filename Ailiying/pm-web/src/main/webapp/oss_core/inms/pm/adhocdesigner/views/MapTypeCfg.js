/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/MapTypeCfg.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-maptypecfg-ok" : "fnOK",
                "click #ad-maptypecfg-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.AREAMAP_NO = inParam.AREAMAP_NO;
                this.mapTypeList = inParam.mapTypeList;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var opt = {
                    data: this.mapTypeList,
                    colModel: [
                        {
                            key: true,
                            name: 'AREAMAP_NO',
                            label: '',
                            hidden: true,
                            sortable: false
                        },
                        {
                            name: 'AREAMAP_NAME',
                            label: '',
                            width: 100,
                            sortable: false
                        }
                    ],
                    pager: false
                };
                this.$mapTypeGrid = this.$el.find("#ad-maptype-grid").grid(opt);
                this.$mapTypeGrid.jqGrid("setGridWidth", 237);
                this.$('#ad-maptype-grid .ui-jqgrid-bdiv').css("border-top", 0);
                this.$('#ad-maptype-grid_AREAMAP_NAME').hide();
                if(this.AREAMAP_NO){
                    this.$mapTypeGrid.grid("setSelection", this.AREAMAP_NO);
                }
            },

            fnOK: function() {
                //
                var mapData = this.$mapTypeGrid.grid("getSelection");
                if(mapData.length==0){
                    fish.toast('info', this.resource.SELECT_MAP);
                    return;
                }
                this.trigger("okEvent", {
                    AREAMAP_NO: mapData.AREAMAP_NO,
                    AREAMAP_URL: mapData.AREAMAP_URL
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {

            }
        });
    }
);
