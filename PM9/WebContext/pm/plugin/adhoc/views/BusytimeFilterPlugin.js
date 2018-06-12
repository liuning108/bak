/**
 *
 */
define([
        'text!oss_core/pm/plugin/adhoc/templates/BusytimeFilterPlugin.html',
        'oss_core/pm/plugin/adhoc/actions/BusytimeFilterPluginAction'
    ],
    function(BusytimeFilterPluginView, action) {
        return portal.CommonView.extend({

            resource: fish.extend({}),

            template: fish.compile(BusytimeFilterPluginView),

            events : {
                "change #ad-axiscfg-top-btn" : "topCheck",
                "change #ad-axiscfg-xaxis-select" : "xAxisDimChange",
                "change #ad-axiscfg-series-btn" : "seriesCheck",
                "click #ad-ds-asc" : "ascBtnClick",
                "click #ad-ds-desc" : "descBtnClick",
                "change .kpiSortTypeRadio" : "kpiSortTypeRadioChange",
                'click #ad-btfp-kpi-addall' : "addAll",
                'click #ad-btfp-kpi-removeall' : "removeAll",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.modelCode = inParam.modelCode;
                //可选
                this.selectableDimList = [];
                this.selectableKpiList = [];
                //已选
                this.selectedDim = "";
                this.selectedKpiList = [];
                this.kpiSortTypeList = [];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            afterRender: function() {
                var self = this;
                action.loadBusytimePluginDimKpiList({
                    modelCode: this.modelCode
                }, function (ret) {
                    if (ret.kpiList) {
                        fish.forEach(ret.kpiList, function (kpi) {
                            self.selectableKpiList[self.selectableKpiList.length] = kpi;
                        });
                    }
                    if (ret.dimList) {
                        fish.forEach(ret.dimList, function (dim) {
                            self.selectableDimList[self.selectableDimList.length] = dim;
                        });
                    }
                    self.initSelect();
                });
            },

            initSelect: function() {
                var self = this;
                var dimSelObj = this.$("#ad-btfp-dim-select");
                fish.forEach(self.selectableDimList, function(dim){
                    dimSelObj.append("<option value='" + dim.FIELD_CODE + "'>" + dim.FIELD_NAME + "</option>");
                });
                fish.forEach(self.selectableKpiList, function(kpi){
                    var value = kpi.FIELD_CODE;
                    var text = kpi.FIELD_NAME;
                    var htmlText = '<li id="ad-btfp-kpi-selectableitem-'+value+'" title="'+text+'">'
                        + '<span class="selectable">' + text + '</span><a id="ad-btfp-kpi-add-'+value+'" href="#"><i class="fa fa-plus"></i></a></li>';
                    this.$('[name=ad-btfp-kpi-selectable]').append(htmlText);
                    this.$('#ad-btfp-kpi-add-'+value).unbind();
                    this.$('#ad-btfp-kpi-add-'+value).bind("click", function(event){
                        self.selectKpiData(this.id.substring(16), 'asc');
                    });
                });
            },

            selectKpiData: function(dataId, axisType) {
                var self = this;
                self.$('#ad-btfp-kpi-add-'+dataId).unbind();
                self.$('#ad-btfp-kpi-selectableitem-'+dataId).remove();
                fish.forEach(this.selectableKpiList, function(kpi){
                    if(kpi.FIELD_CODE == dataId) {
                        self.selectedKpiList[self.selectedKpiList.length] = kpi;
                        self.kpiSortTypeList[self.kpiSortTypeList.length] = {
                            FIELD_CODE: dataId,
                            SORT_TYPE: axisType
                        };
                        var value = kpi.FIELD_CODE;
                        var text = kpi.FIELD_NAME;
                        var htmlText = '<li title="' + text + '" name="ad-btfp-kpi-selecteditem" id="ad-btfp-kpi-selecteditem-' + value + '">'
                            + '<span class="selectable">' + text + '</span>'
                            + '<label class="radio-inline ad-axiscfg-radio-inline-1">'
                            + '<input type="radio" class="kpiSortTypeRadio" title="Asc" name="sortypeRadio' + value + '" value="asc" '
                            + (axisType == 'asc' ? 'checked' : '') + '>Asc</input></label>'
                            + '<label class="radio-inline ad-axiscfg-radio-inline-2">'
                            + '<input type="radio" class="kpiSortTypeRadio" title="Desc" name="sortypeRadio' + value + '" value="desc" '
                            + (axisType == 'desc' ? 'checked' : '') + '>Desc</input></label>'
                            + '<a id="ad-btfp-kpi-remove-' + value + '" href="#"><i class="fa fa-trash"></i></a></li>';
                        self.$('[name=ad-btfp-kpi-selected]').append(htmlText);
                        self.$('#ad-btfp-kpi-remove-' + value).unbind();
                        self.$('#ad-btfp-kpi-remove-' + value).bind("click", function (event) {
                            self.cancelData(this.id.substring(19));
                        });
                    }
                });
            },

            cancelData: function(dataId) {
                var self = this;
                self.$('#ad-btfp-kpi-remove-' + dataId).unbind();
                self.$('#ad-btfp-kpi-selecteditem-' + dataId).remove();
                var text;
                var value = dataId;
                for(var j = 0; j < self.selectedKpiList.length; j++) {
                    if(dataId == self.selectedKpiList[j].FIELD_CODE){
                        text = self.selectedKpiList[j].FIELD_NAME;
                        self.selectedKpiList.splice(j, 1);
                        self.kpiSortTypeList.splice(j, 1);
                        break;
                    }
                }
                var htmlText = '<li title="'+text+'" id="ad-btfp-kpi-selectableitem-' + value + '"><span class="selectable">'
                    + text + '</span><a id="ad-btfp-kpi-add-' + value + '" href="#"><i class="fa fa-plus"></i></a></li>';
                self.$('[name=ad-btfp-kpi-selectable]').append(htmlText);
                self.$('#ad-btfp-kpi-add-' + value).unbind();
                self.$('#ad-btfp-kpi-add-' + value).bind("click", function (event) {
                    self.selectKpiData(this.id.substring(16), 'asc');
                });
            },

            ascBtnClick: function() {
                this.$('#ad-ds-asc').hide();
                this.$('#ad-ds-desc').show();
            },

            descBtnClick: function() {
                this.$('#ad-ds-asc').show();
                this.$('#ad-ds-desc').hide();
            },

            kpiSortTypeRadioChange: function(e) {
                var kpi = e.currentTarget.name.substring(12);
                var sortType = e.currentTarget.value;
                for(var i=0;i<this.kpiSortTypeList.length;i++){
                    var value = this.kpiSortTypeList[i].FIELD_CODE;
                    if(value == kpi){
                        this.kpiSortTypeList[i].SORT_TYPE = sortType;
                        break;
                    }
                }
            },

            // 全部添加
            addAll: function() {
                var self = this;
                fish.forEach(self.selectableKpiList, function(kpi){
                    var isExist = false;
                    var value = kpi.FIELD_CODE;
                    for (var j = 0; j < self.selectedKpiList.length && !isExist; j++) {
                        if (value == self.selectedKpiList[j].FIELD_CODE) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        self.selectKpiData(value, 'asc');
                    }
                });
            },

            // 清空
            removeAll: function() {
                var self = this;
                for (var j = 0; j < this.selectedKpiList.length; j++) {
                    this.cancelData(this.selectedKpiList[j--].FIELD_CODE);
                }
            },

            getPluginParams: function() {
                var self = this;
                var dim_code = this.$('#ad-btfp-dim-select').val();
                var kpi_list = [];
                for(var i=0;i<this.selectedKpiList.length;i++){
                    var kpiObj = this.selectedKpiList[i];
                    var kpiSortObj = this.kpiSortTypeList[i];
                    kpi_list[kpi_list.length] = {
                        FIELD_CODE: kpiObj.FIELD_CODE,
                        SORT_TYPE: kpiSortObj.SORT_TYPE
                    }
                };
                if(this.selectedKpiList.length==0){
                    fish.toast('info', 'Please select a kpi at least');
                    returnParamObj = null;
                }else{
                    returnParamObj = {
                        DIM_CODE: dim_code,
                        KPI_LIST: kpi_list
                    };
                }
                return returnParamObj;
            },

            setPluginParams: function(paramObj) {
                var self = this;
                _.delay(function () {
                    self.$('#ad-btfp-dim-select').val(paramObj.DIM_CODE);
                    fish.forEach(paramObj.KPI_LIST, function(kpiObj){
                        self.selectKpiData(kpiObj.FIELD_CODE, kpiObj.SORT_TYPE);
                    });
                }.bind(this), 1000);
            },

            resize: function() {
                return this;
            }
        });
    }
);