/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/AddIndiBatch.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/slamanage'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

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
                this.kpiList = [];
                this.emsTypeList = inParam.emsTypeList;
                fish.forEach(this.emsTypeList, this.wrap(function(emsType){
                    fish.forEach(emsType.children, this.wrap(function(ems){
                        fish.forEach(ems.children, this.wrap(function(kpi){
                            this.kpiList[this.kpiList.length] = kpi;
                        }));
                    }));
                }));
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
                this.$('#ad-batchkpi-container').empty();
                var htmlText = ""
                fish.forEach(dataList, this.wrap(function(kpi) {
                    if(i!=0) {
                        if(i%2==1){
                            var divId = 'ad-batchkpi-' + kpi.id;
                            htmlText += '<div class=" col-md-6">'
                                + '<label class="control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                                + kpi.name
                                + '</label></div></div>';
                        }else if(i%2==0){
                            var divId = 'ad-batchkpi-' + kpi.id;
                            htmlText += '<div class="row"><div class=" col-md-6">'
                                + '<label class="control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                                + kpi.name
                                + '</label></div>';
                        }
                        if(i%2==1 && i==dataList.length-1){
                            htmlText += "</div>"
                        }
                    }else{
                        var divId = 'ad-batchkpi-' + kpi.id;
                        htmlText += '<div class="row"><div class=" col-md-6">'
                            + '<label class="control-label checkbox-inline"><input id="'+divId+'" type="checkbox" name="grade" value="Female">'
                            + kpi.name
                            + '</label></div>';
                    }
                    i++;
                }));
                this.$('#ad-batchkpi-container').append(htmlText);
            },

            dimIndiSearch: function (e) {
                var reloadData = [];
                var searchCont = e.currentTarget.value;
                if(searchCont == ''){
                    this.reloadKpi(this.kpiList);
                }else {
                    for (var i = 0, l = this.kpiList.length; i < l; i++) {
                        var item = this.kpiList[i];
                        if (item.name.indexOf(searchCont) != -1) {
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