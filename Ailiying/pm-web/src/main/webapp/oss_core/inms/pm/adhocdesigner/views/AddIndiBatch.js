/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/AddIndiBatch.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(RuleMgrView, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel",
                'keyup #ad-dim-indi-search': "dimIndiSearch"
            },

            /**
             *  id: kpi.ID,
                name: kpi.NAME,
                CLASS_TYPE: "02",
                nodeType: 1,
                tagType: 1
             * @param inParam
             */
            initialize: function(inParam) {
                var self = this;
                this.kpiList = [];
                this.emsTypeList = inParam.emsTypeList;
                fish.forEach(this.emsTypeList, function(emsType){
                    fish.forEach(emsType.children, function(ems){
                        fish.forEach(ems.children, function(kpi){
                            self.kpiList[self.kpiList.length] = kpi;
                        });
                    });
                });
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.reloadKpi(this.kpiList);
            },

            reloadKpi: function(dataList) {
                var i = 0;
                var self = this;
                this.$('#ad-batchkpi-container').empty();
                var htmlText = ""
                fish.forEach(dataList, function(kpi) {
                    if(i!=0) {
                        if(i%2==1){
                            var divId = 'ad-batchkpi-' + kpi.id;
                            htmlText += '<div class=" col-md-6">'
                                + '<label title="'+kpi.name+'" class="ad-batchindi-item control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                                + kpi.name
                                + '</label></div></div>';
                        }else if(i%2==0){
                            var divId = 'ad-batchkpi-' + kpi.id;
                            htmlText += '<div class="row"><div class=" col-md-6">'
                                + '<label title="'+kpi.name+'" class="ad-batchindi-item control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                                + kpi.name
                                + '</label></div>';
                        }
                        if(i%2==1 && i==dataList.length-1){
                            htmlText += "</div>"
                        }
                    }else{
                        var divId = 'ad-batchkpi-' + kpi.id;
                        htmlText += '<div class="row"><div class=" col-md-6">'
                            + '<label title="'+kpi.name+'" class="ad-batchindi-item control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                            + kpi.name
                            + '</label></div>';
                    }
                    i++;
                });
                this.$('#ad-batchkpi-container').append(htmlText);
            },

            dimIndiSearch: function (e) {
                var reloadData = [];
                var searchCont = adhocUtil.trim(e.currentTarget.value);
                if(searchCont == ''){
                    this.reloadKpi(this.kpiList);
                }else {
                    for (var i = 0, l = this.kpiList.length; i < l; i++) {
                        var item = this.kpiList[i];
                        if (item.name.toLowerCase().indexOf(searchCont.toLowerCase()) != -1) {
                            reloadData[reloadData.length] = item;
                        }
                    }
                    this.reloadKpi(reloadData);
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var selectedKpiList = [];
                var checkboxList = this.$(':checkbox');
                for(var i=0; i<checkboxList.length; i++) {
                    var checkboxObject = checkboxList[i]
                    if(checkboxObject.checked){
                        var divId = checkboxObject.id;
                        var kpiId = divId.substring(12);
                        selectedKpiList[selectedKpiList.length] = kpiId;
                    }
                }
                this.trigger("okEvent", {selectedKpiList:selectedKpiList});
            },

            resize: function() {
                return this;
            }
        });
    });
