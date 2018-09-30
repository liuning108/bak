/**
 * 维度筛选弹出窗
 */
define([
        'text!oss_core/inms/pm/adhoc/templates/DimFilterSelect.html',
        'oss_core/inms/pm/adhoc/actions/AdhocAction',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhoc/views/AdhocUtil"
    ],
    function(RuleMgrView, action, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #ad-btn-ok" : "fnOK",
                "click #ad-btn-cancel" : "fnCancel",
                "click #ad-dimfilter-exact-btn" : "showExactFilter",
                "click #ad-dimfilter-condi-btn" : "showConditionFilter",
                "click [name='ad-dimfilter-showtype-chx']" : "changeFilterShowType",
                'click #ad-dimfilter-addall' : "addAll",
                'click #ad-dimfilter-removeall' : "removeAll",
                'keyup #ad-dimfilter-search': "dataSearch",
                'click #ad-dimfilter-plus': "addFilterCondition"
            },

            initialize: function(inParam) {
                var self = this;
                this.MAX_LISTLENGTH = 500;
                this.inParam = inParam;
                this.DIM_CODE = inParam.DIM_CODE;
                this.DIM_NAME = inParam.DIM_NAME;
                this.META_DIM_CODE = inParam.META_DIM_CODE;
                this.allItemList = [];
                fish.forEach(inParam.allItemList, function(item){
                    self.allItemList[self.allItemList.length] = {
                        sID: item.id,
                        id: adhocUtil.guid(),
                        name: item.name
                    }
                });
                //
                this.selectedList = inParam.selectedList;
                this.filterCondiList = [];
                if (this.FILTER_TYPE == '1') {
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
                action.metaDimQuery({
                    DIM_CODE: this.META_DIM_CODE
                }, function (ret) {
                    var dimScript = "";
                    if(ret.scriptList && ret.scriptList.length>0){
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                    }
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, function (ret) {
                        if((!that.allItemList || that.allItemList.length==0) && that.META_DIM_CODE) {
                            that.allItemList = [];
                            fish.forEach(ret.resultList, function (item) {
                                var itemId = item.ID?item.ID:item.id;
                                var itemName = item.NAME?item.NAME:item.name;
                                that.allItemList[that.allItemList.length] = {
                                    id: itemId,
                                    name: itemName
                                };
                                for(var i=0;i<that.selectedList.length;i++) {
                                    if (itemId == that.selectedList[i].id) {
                                        that.selectedList[i].name = item.NAME;
                                        break;
                                    }
                                }
                            });
                        }
                        //
                        for(var i=0; i<that.allItemList.length && i<that.MAX_LISTLENGTH; i++){
                            var item = that.allItemList[i];
                            var htmlText = '<li id="ad-dim-selectableitem-'+item.id+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                                + item.name + '<a id="ad-dim-add-'+item.id+'" href="#"><i class="fa fa-plus"></i></a></li>';
                            that.$('[name=ad-dimfilter-selectable]').append(htmlText);
                            that.$('#ad-dim-add-'+item.id).unbind();
                            that.$('#ad-dim-add-'+item.id).bind("click", function(event){
                                that.selectDimData(this.id.substring(11));
                            });
                        }
                        //
                        that.$('#ad-dimfilter-condi-btn').removeAttr("checked");
                        that.$('#ad-dimfilter-exact-btn').attr("checked", "checked");
                        if(that.filterCondiList.length>0){
                            that.$('#ad-dimfilter-subtype').val(that.filterCondiList[0].type);
                        }
                        for(var i=0; i<that.selectedList.length; i++){
                            var item = that.selectedList[i];
                            var itemID;
                            fish.forEach(that.allItemList, function(allitem){
                                if((allitem.sID && item.id == allitem.sID) || (!allitem.sID && item.id == allitem.id)){
                                    itemID = allitem.id;
                                }
                            })
                            that.selectDimData(itemID);
                        }
                    });
                });
            },

            selectDimData: function(dataId) {
                that = this;
                this.$('#ad-dim-add-'+dataId).unbind();
                this.$('#ad-dim-selectableitem-'+dataId).remove();
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    if(item.id == dataId){
                        var htmlText = '<li name="ad-selected-item" id="ad-dim-selecteditem-'+item.id+'">'+item.name+'<a id="ad-dim-remove-'+item.id+'" href="#"><i class="fa fa-trash"></i></a></li>';
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
                                + item.name + '<a id="ad-dim-add-'+item.id+'" href="#"><i class="fa fa-plus"></i></a></li>';
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

            // 全部<i class="fa fa-plus"></i>
            addAll: function() {
                this.$('[name=ad-dimfilter-selectable]').empty();
                this.$('[name=ad-dimfilter-selected]').empty();
                for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
                    var item = this.allItemList[i];
                    this.selectDimData(item.id);
                }
            },

            removeAll: function() {
                this.$('[name=ad-dimfilter-selectable]').empty();
                this.$('[name=ad-dimfilter-selected]').empty();
                for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
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
                    for (var i = 0, l =  selectableList.length; i < l && i<this.MAX_LISTLENGTH; i++) {
                        var item =  selectableList[i];
                        this.cancelData(item.id);
                    }
                }else {
                    var matchCount = 0;
                    var selectableList = this.getSelectableList();
                    for (var i = 0, l =  selectableList.length; i < l && matchCount<this.MAX_LISTLENGTH; i++) {
                        var item =  selectableList[i];
                        if (item.name.indexOf(searchCont) != -1) {
                            this.cancelData(item.id);
                            matchCount++;
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
                            var selectedItemId = this.allItemList[j].sID;
                            if(!selectedItemId){// 优先判断sID 若无 则为普通维度
                                selectedItemId = dataId;
                            }
                            selectedList[selectedList.length] = {
                                id: selectedItemId,
                                name: this.allItemList[j].name
                            };
                            break;
                        }
                    }
                }
                return selectedList;
            },

            // 条件筛选页面点击新增筛选项
            addFilterCondition: function() {
                var self = this;
                var filterCondiValue = adhocUtil.trim(this.$('#ad-dimfilter-condivalue').val());
                if(filterCondiValue==''){
                    fish.toast('info', 'Please enter a filter value');
                }else {
                    var divid = adhocUtil.guid();
                    var fmtId = this.$('#ad-dimfilter-fmtsel').val();
                    var fmtName = adhocUtil.mappingFilterFormatterName(fmtId);
                    var htmlText = '<div name="'+divid+'" class="form-group"><label class="col-md-2 control-label">' + this.DIM_NAME
                        + '</label><div class="col-md-3 text-center">' + fmtName + '</div><div class="col-md-3 text-left">'
                        + filterCondiValue + '</div><button name="'+divid+'" type="button" class="btn btn-ico" title="Cancel"><i class="fa fa-minus"></i></button></div>';
                    this.$('#ad-filter-container').append(htmlText);
                    this.$('.fa-minus').on("click", function(e){
                        var itemId = e.currentTarget.parentElement.name;
                        self.$("div[name="+ itemId +"]").remove();
                        for(var i=0; i<self.filterCondiList.length; i++){
                            var condiItem = self.filterCondiList[i];
                            if(condiItem.itemId == itemId){
                                self.filterCondiList.splice(i,1);
                                break;
                            }
                        }
                    });
                    this.filterCondiList[this.filterCondiList.length] = {
                        itemId: divid,
                        type: fmtId,
                        value: filterCondiValue,
                        name: fmtName
                    }
                }
            },

            changeFilterShowType: function(e) {
                var selectedId = e.currentTarget.id;
                for(var i=0;i<this.viewTypeBtns.length;i++){
                    if(selectedId!=this.viewTypeBtns[i]){
                        this.$("#"+this.viewTypeBtns[i]).removeAttr("checked");
                    }else{
                        this.VIEW_TYPE = this.viewTypeValues[i];
                    }
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            fnOK: function() {
                var filterOperList = [];
                var filterList = this.getSelectedList();
                var selectedValueStr = "";
                var selectedNameStr = "";
                for(var i=0; i<filterList.length; i++){
                    var filterItemId;
                    if(this.DIM_CODE.substring(0,4)=="vdim"){
                        filterItemId = filterList[i].name;
                    }else{
                        filterItemId = filterList[i].id;
                    }
                    if(i!=filterList.length-1){
                        selectedValueStr += filterItemId+",";
                        selectedNameStr += filterList[i].name+",";
                    }else{
                        selectedValueStr += filterItemId;
                        selectedNameStr += filterList[i].name;
                    }
                }
                this.trigger("okDimSelectEvent", {
                    selectedFilterValueList: filterList,
                    selectedValueStr: selectedValueStr,
                    selectedNameStr: selectedNameStr
                });
            },

            resize: function() {
                return this;
            }
        });
    }
);
