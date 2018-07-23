/**
 * 维度筛选弹出窗
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/DimFilter.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/slamanage',
        "oss_core/pm/adhocdesigner/views/AdhocUtil"
    ],
    function(RuleMgrView, i18nData, adhocUtil) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-btn-ok" : "fnOK",
                "click #ad-btn-cancel" : "fnCancel",
                "click #ad-dimfilter-exact-btn" : "showExactFilter",
                "click #ad-dimfilter-condi-btn" : "showConditionFilter",
                'click #ad-dimfilter-addall' : "addAll",
                'click #ad-dimfilter-removeall' : "removeAll",
                'keyup #ad-dimfilter-search': "dataSearch",
                'click #ad-dimfilter-plus': "addFilterCondition"
            },

            initialize: function(inParam) {
                this.inParam = inParam;
                this.DIM_CODE = inParam.DIM_CODE;
                this.DIM_NAME = inParam.DIM_NAME;
                this.FILTER_TYPE = inParam.FILTER_TYPE;
                this.allItemList = [
                    {id: 1, name: this.DIM_NAME+'1'},
                    {id: 2, name: this.DIM_NAME+'2'},
                    {id: 3, name: this.DIM_NAME+'3'},
                    {id: 4, name: this.DIM_NAME+'4'},
                    {id: 5, name: this.DIM_NAME+'5'}
                ];
                this.selectedList = inParam.selectedList;
                this.filterCondiList = [];
                if(this.FILTER_TYPE == '1'){
                    this.filterCondiList = inParam.filterOperList;
                }
                this.render();
            },

            render: function() {
                this.$el.html(this.template(fish.extend(this.resource,{DIM_NAME: this.DIM_NAME})));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                that = this;
                //
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    var htmlText = '<li id="ad-dim-selectableitem-'+item.id+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                        + item.name + '<a id="ad-dim-add-'+item.id+'" href="#">添加</a></li>';
                    this.$('[name=ad-dimfilter-selectable]').append(htmlText);
                    this.$('#ad-dim-add-'+item.id).unbind();
                    this.$('#ad-dim-add-'+item.id).bind("click", function(event){
                        that.selectDimData(this.id.substring(11));
                    });
                }
                //
                if(this.FILTER_TYPE == '0'){
                    this.$('#ad-dimfilter-condi-btn').removeAttr("checked");
                    this.$('#ad-dimfilter-exact-btn').attr("checked", "checked");
                    if(this.filterCondiList.length>0){
                        this.$('#ad-dimfilter-subtype').val(this.filterCondiList[0].type);
                    }
                    for(var i=0; i<this.selectedList.length; i++){
                        var item = this.selectedList[i];
                        var htmlText = '<li name="ad-selected-item" id="ad-dim-selecteditem-'+item.id+'">'+item.name+'<a id="ad-dim-remove-'+item.id+'" href="#">删除</a></li>';
                        this.$('[name=ad-dimfilter-selected]').append(htmlText);
                        this.$('#ad-dim-remove-'+item.id).unbind();
                        this.$('#ad-dim-remove-'+item.id).bind("click", function(event){
                            that.cancelData(this.id.substring(14));
                        });
                    }
                }else {
                    this.$('#ad-dimfilter-exact-btn').removeAttr("checked");
                    this.$('#ad-dimfilter-condi-btn').attr("checked", "checked");
                    this.showConditionFilter();
                    //
                    for(var i=0; i<this.filterCondiList.length; i++){
                        // itemId name type value
                        var obj = this.filterCondiList[i];
                        var divid = obj.itemId;
                        var fmtId = obj.type;
                        var fmtName = obj.name;
                        var filterCondiValue = obj.value;
                        var htmlText = '<div name="'+divid+'" class="form-group"><label class="col-md-2 control-label">' + this.DIM_NAME
                            + '</label><div class="col-md-3 text-center">' + fmtName + '</div><div class="col-md-3 text-left">'
                            + filterCondiValue + '</div><button name="'+divid+'" type="button" class="btn btn-ico" title="Cancel"><i class="fa fa-minus"></i></button></div>';
                        this.$('#ad-filter-container').append(htmlText);
                        this.$('.fa-minus').on("click", this.wrap(function(e){
                            var itemId = e.currentTarget.parentElement.name;
                            this.$("div[name="+ itemId +"]").remove();
                            for(var i=0; i<this.filterCondiList.length; i++){
                                var condiItem = this.filterCondiList[i];
                                if(condiItem.itemId == itemId){
                                    this.filterCondiList.splice(i,1);
                                    break;
                                }
                            }
                        }));
                    }
                }
            },

            selectDimData: function(dataId) {
                that = this;
                this.$('#ad-dim-add-'+dataId).unbind();
                this.$('#ad-dim-selectableitem-'+dataId).remove();
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    if(item.id == dataId){
                        var htmlText = '<li name="ad-selected-item" id="ad-dim-selecteditem-'+item.id+'">'+item.name+'<a id="ad-dim-remove-'+item.id+'" href="#">删除</a></li>';
                        this.$('[name=ad-dimfilter-selected]').append(htmlText);
                        this.$('#ad-dim-remove-'+item.id).unbind();
                        this.$('#ad-dim-remove-'+item.id).bind("click", function(event){
                            that.cancelData(this.id.substring(14));
                        });
                        break;
                    }
                }
            },

            cancelData: function(dataId) {
                that = this;
                this.$('#ad-dim-remove-'+dataId).unbind();
                this.$('#ad-dim-selecteditem-'+dataId).remove();
                var searchCont = this.$('#ad-dimfilter-search').val();
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    if(item.id == dataId){
                        if (searchCont=='' || (searchCont!='' && item.name.indexOf(searchCont) != -1)) {
                            var htmlText = '<li id="ad-dim-selectableitem-'+item.id+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                                + item.name + '<a id="ad-dim-add-'+item.id+'" href="#">添加</a></li>';
                            this.$('[name=ad-dimfilter-selectable]').append(htmlText);
                            this.$('#ad-dim-add-'+item.id).unbind();
                            this.$('#ad-dim-add-'+item.id).bind("click", function(event){
                                that.selectDimData(this.id.substring(11));
                            });
                        }
                        break;
                    }
                }
            },

            // 显示精确筛选
            showExactFilter: function() {
                this.FILTER_TYPE = '0';
                this.$('#ad-dimfilter-condi-btn').removeAttr("checked");
                this.$('#ad-dimfilter-exact').show();
                this.$('#ad-dimfilter-condi').hide();
            },

            // 显示条件筛选
            showConditionFilter: function() {
                this.FILTER_TYPE = '1';
                this.$('#ad-dimfilter-exact-btn').removeAttr("checked");
                this.$('#ad-dimfilter-exact').hide();
                this.$('#ad-dimfilter-condi').show();
            },

            // 全部添加
            addAll: function() {
                this.$('[name=ad-dimfilter-selectable]').empty();
                this.$('[name=ad-dimfilter-selected]').empty();
                for(var i=0; i<this.allItemList.length; i++) {
                    var item = this.allItemList[i];
                    this.selectDimData(item.id);
                }
            },

            removeAll: function() {
                this.$('[name=ad-dimfilter-selectable]').empty();
                this.$('[name=ad-dimfilter-selected]').empty();
                for(var i=0; i<this.allItemList.length; i++) {
                    var item = this.allItemList[i];
                    this.cancelData(item.id);
                }
            },

            dataSearch: function () {
                this.$('[name=ad-dimfilter-selectable]').empty();
                var reloadData = [];
                var searchCont = this.$('#ad-dimfilter-search').val();
                var searchedList = this.getSelectedList();
                if(searchCont == ''){
                    var selectableList = this.getSelectableList();
                    for (var i = 0, l =  selectableList.length; i < l; i++) {
                        var item =  selectableList[i];
                        this.cancelData(item.id);
                    }
                }else {
                    var selectableList = this.getSelectableList();
                    for (var i = 0, l =  selectableList.length; i < l; i++) {
                        var item =  selectableList[i];
                        if (item.name.indexOf(searchCont) != -1) {
                            this.cancelData(item.id);
                        }
                    }
                }
            },

            getSelectableList: function() {
                var listLength = this.$('[name=ad-selected-item]').length;
                var selectableList = [];
                for(var i=0; i<this.allItemList.length; i++) {
                    var item = this.allItemList[i];
                    var isSelected = false;
                    for(var j=0; j<listLength; j++) {
                        var dataId = this.$('[name=ad-selected-item]')[j].id.substring(20);
                        if (dataId == item.id) {
                            isSelected = true;
                            break;
                        }
                    }
                    if(!isSelected){
                        selectableList[selectableList.length] = item;
                    }
                }
                return selectableList;
            },

            getSelectedList: function() {
                var listLength = this.$('[name=ad-selected-item]').length;
                var selectedList = [];
                for(var i=0; i<listLength; i++) {
                    var dataId = this.$('[name=ad-selected-item]')[i].id.substring(20);
                    for(var j=0; j<this.allItemList.length; j++) {
                        if(dataId == this.allItemList[j].id) {
                            selectedList[selectedList.length] = this.allItemList[j];
                            break;
                        }
                    }
                }
                return selectedList;
            },

            // 条件筛选页面点击新增筛选项
            addFilterCondition: function() {
                var filterCondiValue = adhocUtil.trim(this.$('#ad-dimfilter-condivalue').val());
                if(filterCondiValue==''){
                    fish.toast('info', '请输入筛选值');
                }else {
                    var divid = adhocUtil.guid();
                    var fmtId = this.$('#ad-dimfilter-fmtsel').val();
                    var fmtName = adhocUtil.mappingFilterFormatterName(fmtId);
                    var htmlText = '<div name="'+divid+'" class="form-group"><label class="col-md-2 control-label">' + this.DIM_NAME
                        + '</label><div class="col-md-3 text-center">' + fmtName + '</div><div class="col-md-3 text-left">'
                        + filterCondiValue + '</div><button name="'+divid+'" type="button" class="btn btn-ico" title="Cancel"><i class="fa fa-minus"></i></button></div>';
                    this.$('#ad-filter-container').append(htmlText);
                    this.$('.fa-minus').on("click", this.wrap(function(e){
                        var itemId = e.currentTarget.parentElement.name;
                        this.$("div[name="+ itemId +"]").remove();
                        for(var i=0; i<this.filterCondiList.length; i++){
                            var condiItem = this.filterCondiList[i];
                            if(condiItem.itemId == itemId){
                                this.filterCondiList.splice(i,1);
                                break;
                            }
                        }
                    }));
                    this.filterCondiList[this.filterCondiList.length] = {
                        itemId: divid,
                        type: fmtId,
                        value: filterCondiValue,
                        name: fmtName
                    }
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var filterType;
                var filterOperList = [];
                var filterList = [];
                var subFilterType = this.$('#ad-dimfilter-subtype').val();
                if(this.FILTER_TYPE == '0'){// 精确筛选
                    filterList = this.getSelectedList();
                    var operValurStr = "";
                    for(var i=0; i<filterList.length; i++){
                        if(i!=filterList.length-1){
                            operValurStr += filterList[i].id+",";
                        }else{
                            operValurStr += filterList[i].id;
                        }
                    }
                    filterOperList[filterOperList.length] = {
                        type: subFilterType,
                        value: operValurStr
                    }
                }else {// 条件筛选
                    filterList = this.filterCondiList;
                    filterOperList = this.filterCondiList;
                }
                this.trigger("okDimFilterEvent", {
                    FILTER_TYPE: this.FILTER_TYPE,
                    SUBFILTER_TYPE:subFilterType,
                    DIM_CODE:this.DIM_CODE,
                    DIM_NAME:this.DIM_NAME,
                    selectedList:filterList,
                    filterOperList: filterOperList
                });
            },

            resize: function() {
                return this;
            }
        });
    }
);