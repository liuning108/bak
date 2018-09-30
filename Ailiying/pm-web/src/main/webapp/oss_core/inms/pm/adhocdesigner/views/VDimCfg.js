/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/VDimCfg.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        'oss_core/inms/pm/adhocdesigner/views/AdhocUtil'
    ],
    function(RuleMgrView, action, i18nData, adhocUtil) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                'keyup #ad-vdim-search' : "itemSearch",
                'keyup #ad-vdim-groupname-input' : "groupNameChange",
                'change #ad-vdim-field-select' : "fieldChange",
                'change #ad-vdim-grouptype-sel' : "groupTypeChange",
                'change #ad-vdim-exp-input' : "inputVdimExp",
                'click #ad-vdim-addgroup-btn' : "addNewGroup",
                'click .selectableGroup li' : "selectableGroupClick",
                'click #ad-vdim-addall' : "addAllItem",
                'click #ad-vdim-removeall' : "removeAllItem",
                'click #btn-slm-slimgr-ok' : "fnOK",
                'click #btn-slm-slimgr-cancel' : "fnCancel",
                'click #ad-vdim-check-btn' : "expCheck"
            },

            initialize: function(inParam) {
                var self = this;
                this.MAX_LISTLENGTH = 500;
                this.allItemList = [];
                this.VDIM_CODE = inParam.VDIM_CODE;
                this.dimList = [];;
                for(var i=0;i<inParam.dimList.length;i++){
                    if(inParam.dimList[i].VDIM_FIELD){
                        //
                    }else{
                        this.dimList[this.dimList.length] = inParam.dimList[i];
                    }
                }
                this.cachedDimCode = inParam.cachedDimCode;
                this.dimScriptCache = new adhocUtil.HashMap();
                if(this.VDIM_CODE==''){
                    this.VDIM_CODE = 'vdim-'+(adhocUtil.guid().substring(0,26));
                    this.groupList = [];
                    this.VDIM_NAME = "";
                    this.VDIM_FIELD = "";
                    if(this.dimList.length>0){
                        this.VDIM_FIELD = this.dimList[0].id;
                    }
                    this.VDIM_TYPE = "0";
                    this.nogroupName = 'Others';
                }else{
                    this.groupList = [];
                    fish.forEach(inParam.groupList, function(group){
                        self.groupList[self.groupList.length] = {
                            id: group.id,
                            name: group.name,
                            expression: group.expression,
                            items: group.items.slice(0)
                        }
                    });
                    this.VDIM_NAME = inParam.VDIM_NAME;
                    this.VDIM_FIELD = inParam.VDIM_FIELD;
                    this.VDIM_TYPE = inParam.VDIM_TYPE;
                    this.nogroupName = inParam.NOGROUP_NAME;
                }
                this.highlightGroup = null;
                this.groupIndex = 0;
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                var that = this;
                var fieldSelObj = this.$("#ad-vdim-field-select");
                for(var i=0; i<this.dimList.length; i++){
                    var obj = this.dimList[i];
                    var value = obj.id;
                    var text = obj.name
                    fieldSelObj.append("<option value='" + value + "'>" + text + "</option>");
                }
                this.$('#ad-vdim-field-select').val(this.VDIM_FIELD);
                //
                var metaDimCode = this.cachedDimCode.get(this.$('#ad-vdim-field-select').val());
                var dimScript = this.dimScriptCache.get(metaDimCode);
                action.metaDimQuery({
                    DIM_CODE: metaDimCode
                }, function (ret) {
                    if(ret.scriptList.length==0){
                        dimScript = "";
                    }else{
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                    }
                    if(metaDimCode){
                        that.dimScriptCache.put(metaDimCode, dimScript);
                    }
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, function (ret) {
                        that.allItemList = [];
                        if(metaDimCode) {
                            fish.forEach(ret.resultList, function (item) {
                                that.allItemList[that.allItemList.length] = {
                                    id: item.ID?item.ID:item.id,
                                    name: item.NAME?item.NAME:item.name
                                };
                            });
                        }
                        if (that.groupList.length == 0) {
                            that.addNewGroup();
                        }
                        that.resetLeftRightGrid();
                        // 编辑状态时加载数据
                        if(that.VDIM_NAME!=""){
                            that.$('#ad-vdim-name-input').val(that.VDIM_NAME);
                            that.$('#ad-vdim-field-select').val(that.VDIM_FIELD);
                            that.$('#ad-vdim-grouptype-sel').val(that.VDIM_TYPE);
                            for(var i=0;i<that.groupList.length;i++){
                                var group = that.groupList[i];
                                that.$('.selectableGroup li').removeClass("active");
                                that.$('#ad-vdim-nogroup-li').before(
                                    '<li id="' + group.id + '" class="active">' +
                                    '<span class="selectable" style="left:0px;">' +
                                    group.name +
                                    '</span>' +
                                    '<a id="ad-vdim-delgroup-'+group.id+'" style="right:4px;top:9px;"><i class="fa fa-trash ad-icon"></i></a>' +
                                    '</li>');
                                that.$('#ad-vdim-delgroup-' + group.id).unbind();
                                that.$('#ad-vdim-delgroup-' + group.id).bind("click", function () {
                                    that.delGroup(this.id.substring(17));
                                });
                                //
                                fish.forEach(group.items, function(item){
                                    for(var j=0;j<that.allItemList.length;j++){
                                        if(item.id==that.allItemList[j].id){
                                            item.name = that.allItemList[j].name;
                                            break;
                                        }
                                    }
                                });
                                that.highlightGroup = group;
                                //清空上次的内容
                                that.resetLeftRightGrid();
                                that.loadGroup(group);
                            }
                        }
                        that.$('#ad-vdim-nogroup-li')[0].children[0].innerText = that.nogroupName;
                    });
                });
            },

            resetLeftRightGrid: function() {
                this.$('#ad-vdim-search').val('');
                this.$('#ad-vdim-exp-input').val('');
                this.$('[name=ad-vdim-selectable]').empty();
                this.$('[name=ad-vdim-selected]').empty();
                for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++){
                    var item = this.allItemList[i];
                    var htmlText = '<li id="ad-vdim-selectableitem-'+item.id+'"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                        +'<span class="vdim-item" title="'+item.name+'">' + item.name + '</span><a id="ad-vdim-add-'+item.id+'" href="#"><i class="fa fa-plus"></i></a></li>';
                    this.$('[name=ad-vdim-selectable]').append(htmlText);
                    this.$('#ad-vdim-add-'+item.id).unbind();
                    this.$('#ad-vdim-add-'+item.id).bind("click", function(event){
                        that.selectDimData(this.id.substring(12));
                    });
                }
            },

            itemSearch: function () {
                this.$('[name=ad-vdim-selectable]').empty();
                var reloadData = [];
                var searchCont = this.$('#ad-vdim-search').val();
                if(searchCont == ''){
                    var selectableList = this.getSelectableItemList();
                    for (var i = 0, l =  selectableList.length; i < l && i<this.MAX_LISTLENGTH; i++) {
                        var item =  selectableList[i];
                        this.cancelData(item.id);
                    }
                }else {
                    var matchCount = 0;
                    var selectableList = this.getSelectableItemList();
                    for (var i = 0, l =  selectableList.length; i < l && matchCount<this.MAX_LISTLENGTH; i++) {
                        var item =  selectableList[i];
                        if (item.name.indexOf(searchCont) != -1) {
                            matchCount++;
                            this.cancelData(item.id);
                        }
                    }
                }
            },

            addAllItem: function () {
                this.$('[name=ad-vdim-selectable]').empty();
                this.$('[name=ad-vdim-selected]').empty();
                for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
                    var item = this.allItemList[i];
                    this.selectDimData(item.id);
                }
            },

            removeAllItem: function() {
                this.$('[name=ad-vdim-selectable]').empty();
                this.$('[name=ad-vdim-selected]').empty();
                for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
                    var item = this.allItemList[i];
                    this.cancelData(item.id);
                }
            },

            groupTypeChange: function () {
                this.clearGroup();
                var groupType = this.$('#ad-vdim-grouptype-sel').val();
                switch(groupType){
                    case "0" : this.changeGroupTypeByItems();
                        break;
                    case "1" : this.changeGroupTypeByExpression();
                        break;
                }
            },

            changeGroupTypeByItems: function () {
                this.$('#ad-vdim-exact').show();
                this.$('#ad-vdim-exp-area').hide();
            },

            changeGroupTypeByExpression: function () {
                this.$('#ad-vdim-exact').hide();
                this.$('#ad-vdim-exp-area').show();
            },

            clearGroup: function () {
                for(var i=0;i<this.groupList.length;i++){
                    this.$('#'+this.groupList[i].id).remove();
                }
                this.groupList = [];
                this.highlightGroup = null;
                this.addNewGroup();
                this.resetLeftRightGrid();
            },

            fieldChange: function () {
                var self = this;
                var metaDimCode = this.cachedDimCode.get(this.$('#ad-vdim-field-select').val());
                var dimScript = this.dimScriptCache.get(metaDimCode);
                if(dimScript){
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, function (ret) {
                        self.allItemList = [];
                        fish.forEach(ret.resultList, function (item) {
                            self.allItemList[self.allItemList.length] = {
                                id: item.ID?item.ID:item.id,
                                name: item.NAME?item.NAME:item.name
                            };
                        });
                        self.clearGroup();
                    });
                }else{
                    action.metaDimQuery({
                        DIM_CODE: metaDimCode
                    }, function (ret) {
                        if(ret.scriptList.length==0){
                            dimScript = "";
                        }else{
                            dimScript = ret.scriptList[0].DIM_SCRIPT;
                        }
                        if(metaDimCode) {
                            self.dimScriptCache.put(metaDimCode, dimScript);
                        }
                        action.scriptResultQuery({
                            SCRIPT: dimScript
                        }, function (ret) {
                            self.allItemList = [];
                            if(metaDimCode) {
                                fish.forEach(ret.resultList, function (item) {
                                    self.allItemList[self.allItemList.length] = {
                                        id: item.ID?item.ID:item.id,
                                        name: item.NAME?item.NAME:item.name
                                    };
                                });
                            }
                            self.clearGroup();
                        });
                    });
                }
            },

            groupNameChange: function () {
                var groupName = this.$('#ad-vdim-groupname-input').val();
                if(this.highlightGroup){
                    this.$('#'+this.highlightGroup.id+'')[0].children[0].innerText = groupName;
                    for(var i=0;i<this.groupList.length;i++){
                        if(this.highlightGroup==this.groupList[i]){
                            this.groupList[i].name = groupName;
                            break;
                        }
                    }
                }else{
                    this.nogroupName = groupName;
                    this.$('#ad-vdim-nogroup-li')[0].children[0].innerText = groupName;
                }
            },

            getSelectableItemList: function() {
                var listLength = this.highlightGroup.items.length;
                var selectableList = [];
                for(var i=0; i<this.allItemList.length; i++) {
                    var item = this.allItemList[i];
                    var isSelected = false;
                    for(var j=0; j<listLength; j++) {
                        var dataId = this.highlightGroup.items[j].id;
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

            selectGroup: function(groupId) {
                if(this.$('#ad-vdim-nogroup-detail').css('display')=="none"
                    && groupId!="ad-vdim-nogroup-li" && this.highlightGroup!=null && !this.validateGroup(this.highlightGroup)){
                    fish.toast('info', this.resource.GROUP_CONDITION_NOT_EMPTY);
                    return;
                }
                this.$('.selectableGroup li').removeClass("active");
                if(groupId == "ad-vdim-nogroup-li"){
                    this.nogroupClick();
                }else {
                    this.$('#'+groupId).addClass("active");
                    var groupType = this.$('#ad-vdim-grouptype-sel').val();
                    switch(groupType){
                        case "0" : this.changeGroupTypeByItems();
                            break;
                        case "1" : this.changeGroupTypeByExpression();
                            break;
                    }
                    this.$('#ad-vdim-nogroup-detail').hide();
                    for (var i = 0; i < this.groupList.length; i++) {
                        var group = this.groupList[i];
                        if (group.id == groupId) {
                            this.highlightGroup = group;
                            break;
                        }
                    }
                    this.resetLeftRightGrid();
                    this.loadGroup(group);
                }
            },

            nogroupClick: function () {
                this.$('#ad-vdim-nogroup-li').addClass("active");
                this.$('#ad-vdim-exact').hide();
                this.$('#ad-vdim-exp-area').hide();
                this.$('#ad-vdim-nogroup-detail').show();
                this.$('#ad-vdim-groupname-input').val(this.nogroupName);
                this.highlightGroup = null;
            },

            selectableGroupClick: function(e) {
                var groupId = e.currentTarget.id;
                this.selectGroup(groupId);
            },

            loadGroup: function (group) {
                that = this;
                this.$('#ad-vdim-groupname-input').val(group.name);
                var groupType = this.$('#ad-vdim-grouptype-sel').val();
                if(groupType=="0") {
                    for(var i=0; i<group.items.length; i++){
                        var item = group.items[i];
                        this.$('#ad-vdim-add-'+item.id).unbind();
                        this.$('#ad-vdim-selectableitem-'+item.id).remove();
                        var htmlText = '<li name="ad-selected-item" id="ad-vdim-selecteditem-'+item.id+'"><span class="vdim-item" title="'+item.name+'">'+item.name+'</span><a id="ad-vdim-remove-'+item.id+'" href="#"><i class="fa fa-trash"></i></a></li>';
                        this.$('[name=ad-vdim-selected]').append(htmlText);
                        this.$('#ad-vdim-remove-'+item.id).unbind();
                        this.$('#ad-vdim-remove-'+item.id).bind("click", function(event){
                            that.cancelData(this.id.substring(15));
                        });
                    }
                }else{
                    this.changeGroupTypeByExpression();
                    this.$('#ad-vdim-exp-input').val(group.expression);
                }
            },

            inputVdimExp: function () {
                var exp = this.$('#ad-vdim-exp-input').val();
                this.highlightGroup.expression = exp;
            },

            selectDimData: function(dataId) {
                that = this;
                this.$('#ad-vdim-add-'+dataId).unbind();
                this.$('#ad-vdim-selectableitem-'+dataId).remove();
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    if(item.id == dataId){
                        var htmlText = '<li name="ad-selected-item" id="ad-vdim-selecteditem-'+item.id+'"><span class="vdim-item" title="'+item.name+'">'+item.name+'</span><a id="ad-vdim-remove-'+item.id+'" href="#"><i class="fa fa-trash"></i></a></li>';
                        this.$('[name=ad-vdim-selected]').append(htmlText);
                        this.$('#ad-vdim-remove-'+item.id).unbind();
                        this.$('#ad-vdim-remove-'+item.id).bind("click", function(event){
                            that.cancelData(this.id.substring(15));
                        });
                        this.highlightGroup.items[this.highlightGroup.items.length] = {
                            id: item.id,
                            name: item.name
                        };
                        break;
                    }
                }
            },

            cancelData: function(dataId) {
                that = this;
                this.$('#ad-vdim-remove-'+dataId).unbind();
                this.$('#ad-vdim-selecteditem-'+dataId).remove();
                var searchCont = this.$('#ad-vdim-search').val();
                for(var i=0; i<this.allItemList.length; i++){
                    var item = this.allItemList[i];
                    if(item.id == dataId){
                        if (searchCont=='' || (searchCont!='' && item.name.indexOf(searchCont) != -1)) {
                            var htmlText = '<li id="ad-vdim-selectableitem-' + item.id + '"><span><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i></span>'
                                +'<span class="vdim-item" title="'+item.name+'">'+ item.name + '</span><a id="ad-vdim-add-' + item.id + '" href="#"><i class="fa fa-plus"></i></a></li>';
                            this.$('[name=ad-vdim-selectable]').append(htmlText);
                            this.$('#ad-vdim-add-' + item.id).unbind();
                            this.$('#ad-vdim-add-' + item.id).bind("click", function (event) {
                                that.selectDimData(this.id.substring(12));
                            });
                        }
                        for(var j=0;j<this.highlightGroup.items.length;j++){
                            if(this.highlightGroup.items[j].id==dataId){
                                this.highlightGroup.items.splice(j,1);
                            }
                        }
                        break;
                    }
                }
            },

            addNewGroup: function() {
                if(this.highlightGroup!=null && !this.validateGroup(this.highlightGroup)){
                    fish.toast('info', this.resource.CONDITION_VALUE_NOT_NULL);
                }else{
                    var groupType = this.$('#ad-vdim-grouptype-sel').val();
                    switch(groupType){
                        case "0" : this.changeGroupTypeByItems();
                            break;
                        case "1" : this.changeGroupTypeByExpression();
                            break;
                    }
                    this.$('#ad-vdim-nogroup-detail').hide();
                    this.$('.selectableGroup li').removeClass("active");
                    var groupName = "Group " + (this.groupList.length+1);
                    var groupId = adhocUtil.guid().substring(0,26);
                    var group = {
                        id: groupId,
                        name: groupName,
                        items: [],
                        expression: ''
                    }
                    this.$('#ad-vdim-nogroup-li').before(
                        '<li id="' + groupId + '" class="active">' +
                        '<span class="selectable" style="left:0px;">' +
                        groupName +
                        '</span>' +
                        '<a id="ad-vdim-delgroup-'+groupId+'" style="right:4px;top:9px;"><i class="fa fa-trash ad-icon"></i></a>' +
                        '</li>');
                    this.$('#ad-vdim-delgroup-' + groupId).unbind();
                    this.$('#ad-vdim-delgroup-' + groupId).bind("click", function () {
                        that.delGroup(this.id.substring(17));
                    });
                    this.$('#ad-vdim-groupname-input').val(groupName);
                    this.groupList[this.groupList.length] = group;
                    this.highlightGroup = group;
                    //清空上次的内容
                    this.resetLeftRightGrid();
                }
            },

            delGroup: function(groupId) {
                var highlightGroupId = this.highlightGroup.id;
                for(var i=0;i<this.groupList.length;i++){
                    if(this.groupList[i].id == groupId){
                        this.groupList.splice(i,1);
                        break;
                    }
                }
                this.$('#'+groupId).remove();
                if(groupId==highlightGroupId && this.groupList.length>0){
                    this.highlightGroup = null;
                    this.selectGroup(this.groupList[0].id);
                }else if(groupId==highlightGroupId && this.groupList.length==0){
                    this.nogroupClick();
                }
            },

            validateGroup: function(group) {
                // 0-按条目 1-表达式
                var groupType = this.$('#ad-vdim-grouptype-sel').val();
                var result = true;
                if(groupType=="0" && group.items.length==0){
                    result = false;
                }
                if(groupType=="1" && group.expression==''){
                    result = false;
                }
                return result;
            },

            fnOK: function() {
                var self = this;
                //至少添加一个分组项
                if(this.groupList.length==0){
                    fish.toast('info', this.resource.ADD_GROUP_ATLEAST);
                    return;
                }
                var existSameName = false;
                for(var i=0;i<this.groupList.length && !existSameName;i++){
                    var group = this.groupList[i];
                    for(var j=i+1;j<this.groupList.length && !existSameName;j++){
                        var comGroup = this.groupList[j];
                        if(group.name == comGroup.name){
                            existSameName = true;
                        }
                    }
                }
                if(existSameName){
                    fish.toast('info', this.resource.GROUP_WITH_SAME_NAME);
                    return;
                }
                //验证是否有未配置条件的组
                for(var i=0;i<this.groupList.length;i++){
                    var result = this.validateGroup(this.groupList[i]);
                    if(!result){
                        fish.toast('info', this.resource.GROUP_WITH_EMPTY_CONDITION);
                        return;
                    }
                }
                var vdimName = this.$('#ad-vdim-name-input').val();
                var vdimField = this.$('#ad-vdim-field-select').val();
                var vdimType = this.$('#ad-vdim-grouptype-sel').val();
                if(adhocUtil.trim(vdimName)==''){
                    fish.toast('info', this.resource.FIELD_NAME_NOT_EMPTY);
                    return;
                }
                //表达式需要全部验证通过
                if(vdimType=="1"){
                    var expList = [];
                    fish.forEach(this.groupList, function(group){
                        expList[expList.length] = group.expression;
                    });
                    action.expressionCheck({
                        expressionList: expList
                    }, function(ret){
                        if(ret.isValid && ret.isValid=="1"){
                            self.trigger("okEvent", {
                                "VDIM_CODE": self.VDIM_CODE,
                                "VDIM_NAME": vdimName,
                                "VDIM_FIELD": vdimField,
                                "VDIM_TYPE": vdimType,
                                "NOGROUP_NAME": self.nogroupName,
                                "groupList": self.groupList
                            });
                        }else{
                            fish.toast('info', self.resource.ERROR_EXPRESSION);
                        }
                    });
                }else {
                    this.trigger("okEvent", {
                        "VDIM_CODE": this.VDIM_CODE,
                        "VDIM_NAME": vdimName,
                        "VDIM_FIELD": vdimField,
                        "VDIM_TYPE": vdimType,
                        "NOGROUP_NAME": this.nogroupName,
                        "groupList": this.groupList
                    });
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            expCheck: function() {
                var self = this;
                var expression = this.$('#ad-vdim-exp-input').val();
                action.expressionCheck({
                    expression: expression
                }, function(ret){
                    if(ret.isValid && ret.isValid=="1"){
                        fish.toast('info', self.resource.CHECK_SUCCESS);
                    }else{
                        fish.toast('info', self.resource.CHECK_FAILURE);
                    }
                });
            },

            resize: function() {
                return this;
            }
        });
    }
);
