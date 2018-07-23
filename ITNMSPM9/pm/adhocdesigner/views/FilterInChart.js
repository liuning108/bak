/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/FilterInChart.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.dimList = inParam.dimList;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                that = this;
                for(var i=0; i<this.dimList.length; i++) {
                    var dim = this.dimList[i];
                    var dimCode = dim.DIM_CODE;
                    var dimName = dim.DIM_NAME;
                    var htmlText = '<li id="ad-fic-selecteditem-'+dimCode+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'+dimName
                        +'<a id="ad-fic-'+dimCode+'" href="#">'+this.resource.ADD+'</a></li>';
                    this.$('[name="ad-filterinchart-selectabledim"]').append(htmlText);
                    this.$('#ad-fic-'+dimCode).unbind();
                    this.$('#ad-fic-'+dimCode).bind("click", function(event){
                        that.selectDimData(this.id.substring(7));
                    });
                }
            },

            selectDimData: function(dataId) {
                that = this;
                this.$('#ad-fic--'+dataId).unbind();
                this.$('#ad-fic-selecteditem-'+dataId).remove();
                for(var i=0; i<this.dimList.length; i++){
                    var dim = this.dimList[i];
                    var dimCode = dim.DIM_CODE;
                    var dimName = dim.DIM_NAME;
                    if(dimCode == dataId){
                        var htmlText = '<li name="ad-selected-item" id="ad-fic-selecteditem-'+dimCode+'">'
                            +dimName+'<a id="ad-fic-remove-'+dimCode+'" href="#">'+this.resource.DELETE+'</a></li>';
                        this.$('[name=ad-filterinchart-selecteddim]').append(htmlText);
                        this.$('#ad-fic-remove-'+dimCode).unbind();
                        this.$('#ad-fic-remove-'+dimCode).bind("click", function(event){
                            that.cancelData(this.id.substring(14));
                        });
                        break;
                    }
                }
            },

            cancelData: function(dataId) {
                that = this;
                this.$('#ad-fic-remove-'+dataId).unbind();
                this.$('#ad-fic-selecteditem-'+dataId).remove();
                for(var i=0; i<this.dimList.length; i++){
                    var dim = this.dimList[i];
                    var dimCode = dim.DIM_CODE;
                    var dimName = dim.DIM_NAME;
                    if(dimCode == dataId){
                        var htmlText = '<li id="ad-fic-selecteditem-'+dimCode+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'+dimName
                            +'<a id="ad-fic-'+dimCode+'" href="#">'+this.resource.ADD+'</a></li>';
                        this.$('[name="ad-filterinchart-selectabledim"]').append(htmlText);
                        this.$('#ad-fic-'+dimCode).unbind();
                        this.$('#ad-fic-'+dimCode).bind("click", function(event){
                            that.selectDimData(this.id.substring(7));
                        });
                        break;
                    }
                }
            },

            getSelectedList: function() {
                var listLength = this.$('[name=ad-selected-item]').length;
                var selectedList = [];
                for(var i=0; i<listLength; i++) {
                    var dataId = this.$('[name=ad-selected-item]')[i].id.substring(20);
                    for(var j=0; j<this.dimList.length; j++) {
                        if(dataId == this.dimList[j].DIM_CODE) {
                            selectedList[selectedList.length] = this.dimList[j];
                            break;
                        }
                    }
                }
                return selectedList;
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var filterList = this.getSelectedList();
                this.trigger("okFilterInChartEvent", {
                    selectedList:filterList
                });
            },

            resize: function() {
                return this;
            }
        });
    }
);