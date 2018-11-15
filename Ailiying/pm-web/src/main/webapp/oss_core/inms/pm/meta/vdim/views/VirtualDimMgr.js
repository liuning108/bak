/**
 *
 */
define([
        'text!oss_core/inms/pm/meta/vdim/templates/VirtualDimMgr.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        'oss_core/inms/pm/meta/vdim/actions/VirtualDimAction',
        'oss_core/inms/pm/util/views/Util',
        'oss_core/inms/pm/adhocdesigner/views/AdhocUtil',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        'css!oss_core/inms/pm/util/css/ad-component.css',
        'css!oss_core/inms/pm/util/css/ad-block.css',
        'css!oss_core/inms/pm/meta/vdim/assets/virtualdim.css'
    ],
    function(mainTpl, adhocAction, vdimAction, pmUtil, adhocUtil, i18nAdhoc) {
    return portal.BaseView.extend({
        vdimMainTemplate: fish.compile(mainTpl),
        resource: fish.extend(i18nAdhoc, pmUtil.i18nCommon, pmUtil.i18nPMCommon),
        events: {
            'click #vdim-add-btn' : 'addVdim',
            'change #vdim-field-select' : 'fieldChange',
            'keyup #vdim-fieldname-input' : "fieldNameChange",
            'change #vdim-grouptype-sel' : "groupTypeChange",
            'change #vdim-exp-input' : "inputVdimExp",
            'click #vdim-ok-btn' : 'vdimOkClick',
            'click #vdim-cancel-btn' : 'vdimCancelClick',
            'click #vdim-addall' : "addAllItem",
            'click #vdim-removeall' : "removeAllItem",
            'click #vdim-addgroup-btn' : "addNewGroupClick",
            'click .selectableGroup li' : "selectableGroupClick",
            'keyup #vdim-groupname-input' : "groupNameChange",
            'keyup #vdim-search' : "itemSearch",
            'click .list-group' : 'vdimItemClick',
            'click .vdim-item-edit' : 'vdimItemEdit',
            'click .vdim-item-delete' : 'vdimItemDelete',
            'click #vdim-check-btn' : "expCheck"
        },

        initialize: function (opt) {
            this.VDIM_CODE = '';
            this.MAX_LISTLENGTH = 500;
            this.dimList = [];
            this.allItemList = [];
            this.groupList = [];
            this.cachedDimCode = new adhocUtil.HashMap();
            this.dimScriptCache = new adhocUtil.HashMap();
            this.highlightGroup = null;
            this.groupIndex = 0;
            this.nogroupName = 'Others';
            this.vdimGroupDetailList = [];
            this.vdimGroupList = [];
            this.vdimList = [];
        },

        render: function () {
            this.$el.html(this.vdimMainTemplate(this.resource));
            return this;
        },

        afterRender: function () {
            var self = this;
            this.$form = this.$(".js-vdim-info-form");
            adhocAction.cacheModelData({}, function (data) {
                fish.forEach(data.DIMS, function (dim) {
                    if(dim.DIM_CODE) {
                        self.cachedDimCode.put(dim.FIELD_CODE, dim.DIM_CODE);
                        //this.cachedDim.put(dim.FIELD_CODE, dim.FIELD_NAME);
                        self.dimList[self.dimList.length] = {
                            DIM_CODE: dim.FIELD_CODE,
                            META_DIM_CODE: dim.DIM_CODE,
                            DIM_NAME: dim.FIELD_NAME
                        }
                    }
                })
                var fieldSelObj = self.$("#vdim-field-select");
                for(var i=0; i<self.dimList.length; i++){
                    var obj = self.dimList[i];
                    var value = obj.DIM_CODE;
                    var text = obj.DIM_NAME
                    fieldSelObj.append("<option value='" + value + "'>" + text + "</option>");
                }
                self.clearInput();
                ////
                self.loadVdimList();
            });
        },

        vdimItemClick: function(e) {
            var self = this;
            self.clearInput();
            var vdim_code = e.currentTarget.id.substring(10);
            this.showVdimDetail(vdim_code);
        },

        showVdimDetail: function (vdim_code) {
            var self = this;
            this.VDIM_CODE = vdim_code;
            this.$('.vdim-list-item').removeClass('active');
            var divObject = this.$('#vdim-item-'+vdim_code+' div a')[0];
            divObject.className += " active";
            fish.forEach(self.vdimList, function(vdim){
                if(vdim.VDIM_CODE == vdim_code){
                    self.$('#vdim-fieldname-input').val(vdim.VDIM_NAME);
                    self.$('#vdim-title').text(vdim.VDIM_NAME);
                    self.$('#vdim-field-select').val(vdim.FIELD_CODE);
                    self.$('#vdim-grouptype-sel').val(vdim.GROUP_TYPE);
                    var metaDimCode = self.cachedDimCode.get(vdim.FIELD_CODE);
                    adhocAction.metaDimQuery({
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
                        adhocAction.scriptResultQuery({
                            SCRIPT: dimScript
                        }, function (ret) {
                            self.allItemList = [];
                            if (metaDimCode) {
                                fish.forEach(ret.resultList,  function (item) {
                                    self.allItemList[self.allItemList.length] = {
                                        id: item.ID?item.ID:item.id,
                                        name: item.NAME?item.NAME:item.name
                                    };
                                });
                            }
                            fish.forEach(self.vdimGroupList, function (vdimGroup) {
                                if (vdimGroup.VDIM_CODE == vdim_code && vdimGroup.GROUP_NO != "0") {
                                    var group = {
                                        id: vdimGroup.GROUP_NO,
                                        name: vdimGroup.GROUP_NAME,
                                        items: [],
                                        expression: ''
                                    }
                                    fish.forEach(self.vdimGroupDetailList, function (vdimGroupItem) {
                                        if (vdimGroupItem.VDIM_CODE == vdim_code && vdimGroupItem.GROUP_NO == vdimGroup.GROUP_NO) {
                                            var groupItemId = vdimGroupItem.GROUP_ATTR;
                                            if(vdim.GROUP_TYPE=="0"){
                                                self.changeGroupTypeByItems();
                                                var groupItemName;
                                                fish.forEach(self.allItemList, function(dimItem){
                                                    if(dimItem.id == groupItemId){
                                                        groupItemName = dimItem.name;
                                                    }
                                                });
                                                group.items[group.items.length] = {
                                                    id: groupItemId,
                                                    name: groupItemName
                                                }
                                            }else if(vdim.GROUP_TYPE=="1"){
                                                self.changeGroupTypeByExpression();
                                                group.expression = groupItemId;
                                            }
                                        }
                                    });
                                    self.addNewGroupFunc(group);
                                } else if (vdimGroup.VDIM_CODE == vdim_code) {
                                    // 其他组
                                    self.nogroupName = vdimGroup.GROUP_NAME;
                                    self.$('.vdim-nogroup-li span').text(self.nogroupName);
                                }
                            });
                            self.$('.selectableGroup li').removeClass("active");
                            self.$('#vdim-groupname-input').val('');
                        });
                    });
                }
            });
            //填充
        },

        vdimItemEdit: function(e) {
            e.stopImmediatePropagation();
            e.stopPropagation();
            var self = this;
            this.$("#vdim-fieldname-input").removeAttr('disabled');
            this.$("#vdim-field-select").removeAttr('disabled');
            this.$("#vdim-grouptype-sel").removeAttr('disabled');
            this.$("#vdim-groupname-input").removeAttr('disabled');
            this.$("#vdim-search").removeAttr('disabled');
            this.$("#vdim-addgroup-btn").removeAttr('disabled');
            this.$("#vdim-bottom-btngroup").show();
            if(this.VDIM_CODE==''){
                var vdim_code = e.currentTarget.parentElement.id.substring(10);
                this.VDIM_CODE = vdim_code;
                this.showVdimDetail(vdim_code);
            }
        },

        vdimItemDelete: function(e) {
            var self = this;
            var vdim_code = e.currentTarget.parentElement.id.substring(10);
            var vdim_name;
            fish.forEach(self.vdimList, function(vdim){
                if(vdim.VDIM_CODE == vdim_code){
                    vdim_name = vdim.VDIM_NAME;
                }
            });
            fish.confirm(self.resource.DEL_VDIM_TIP+vdim_name+' ?').result.then(function() {
                vdimAction.deleteVdim({VDIM_CODE:vdim_code},function(data) {
                    fish.success(self.resource.DEL_SUCCESS);
                    self.loadVdimList();
                    self.clearInput();
                });
            });
        },

        loadVdimList: function () {
            this.VDIM_CODE = '';
            this.allItemList = [];
            this.groupList = [];
            this.highlightGroup = null;
            this.groupIndex = 0;
            this.vdimGroupDetailList = [];
            this.vdimGroupList = [];
            this.vdimList = [];
            var self = this;
            self.$('.vdimListDiv').empty();
            vdimAction.loadVdimList({}, function (data) {
                self.vdimGroupDetailList = data.vdimGroupDetailList;
                self.vdimGroupList = data.vdimGroupList;
                self.vdimList = data.vdimList;
                fish.forEach(data.vdimList, function(vdim){
                    var vdim_name = vdim.VDIM_NAME;
                    var vdim_code = vdim.VDIM_CODE;
                    var itemHtml = '<div id="vdim-item-'+vdim_code+'" class="list-group m-b-none"><div class="col-md-10">'
                        + '<a title="'+vdim_name+'" class="vdim-list-item list-group-item vdim-item clickable">'
                        + vdim_name + '</a></div><div class="col-md-1 vdim-item-edit clickable"><a><i class="fa fa-edit"></i></a>'
                        + '</div> <div class="col-md-1 vdim-item-delete clickable"> <a><i class="fa fa-trash"></i></a> </div></div>'
                    self.$('.vdimListDiv').append(itemHtml);
                });
            });
        },

        clearInput: function () {
            this.$('.vdim-list-item').removeClass('active');
            //清空
            this.$('#vdim-fieldname-input').val('');
            this.$('#vdim-field-select').val('');
            this.$('#vdim-grouptype-sel').val('0');
            this.$('.vdim-group-li').remove();
            this.$('#vdim-groupname-input').val('');
            this.$('#vdim-title').text('');
            this.allItemList = [];
            this.groupList = [];
            this.VDIM_CODE = '';
            this.resetLeftRightGrid();
            //禁用
            this.$("#vdim-fieldname-input").attr('disabled', 'disabled');//.removeAttr('disabled');
            this.$("#vdim-field-select").attr('disabled', 'disabled');
            this.$("#vdim-grouptype-sel").attr('disabled', 'disabled');
            this.$("#vdim-groupname-input").attr('disabled', 'disabled');
            this.$("#vdim-search").attr('disabled', 'disabled');
            this.$("#vdim-addgroup-btn").attr('disabled', 'disabled');
            this.$("#vdim-bottom-btngroup").hide();
        },

        enableComponent: function () {
            this.$("#vdim-fieldname-input").removeAttr('disabled');
            this.$("#vdim-field-select").removeAttr('disabled');
            this.$("#vdim-grouptype-sel").removeAttr('disabled');
            this.$("#vdim-groupname-input").removeAttr('disabled');
            this.$("#vdim-search").removeAttr('disabled');
            this.$("#vdim-addgroup-btn").removeAttr('disabled');
            this.$("#vdim-bottom-btngroup").show();
        },

        addVdim: function () {
            this.editVdim(null);
        },

        editVdim: function () {
            this.clearInput();
            this.enableComponent();
        },

        fieldChange: function () {
            var self = this;
            var metaDimCode = this.cachedDimCode.get(this.$('#vdim-field-select').val());
            var dimScript = this.dimScriptCache.get(metaDimCode);
            if(dimScript){
                adhocAction.scriptResultQuery({
                    SCRIPT: dimScript
                }, this.wrap(function (ret) {
                    this.allItemList = [];
                    fish.forEach(ret.resultList, this.wrap(function (item) {
                        this.allItemList[this.allItemList.length] = {
                            id: item.ID?item.ID:item.id,
                            name: item.NAME?item.NAME:item.name
                        };
                    }));
                    self.clearGroup();
                }));
            }else{
                adhocAction.metaDimQuery({
                    DIM_CODE: metaDimCode
                }, this.wrap(function (ret) {
                    if(ret.scriptList.length==0){
                        dimScript = "";
                    }else{
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                    }
                    if(metaDimCode) {
                        this.dimScriptCache.put(metaDimCode, dimScript);
                    }
                    adhocAction.scriptResultQuery({
                        SCRIPT: dimScript
                    }, this.wrap(function (ret) {
                        this.allItemList = [];
                        if(metaDimCode) {
                            fish.forEach(ret.resultList, this.wrap(function (item) {
                                this.allItemList[this.allItemList.length] = {
                                    id: item.ID?item.ID:item.id,
                                    name: item.NAME?item.NAME:item.name
                                };
                            }));
                        }
                        self.clearGroup();
                    }));
                }));
            }
        },

        addNewGroupClick: function() {
            var self = this;
            if(this.highlightGroup!=null && !this.validateGroup(this.highlightGroup)){
                fish.toast('info', self.resource.CONDI_VALUE_NOT_EMPTY);
            }else{
                var groupType = this.$('#vdim-grouptype-sel').val();
                switch(groupType){
                    case "0" : this.changeGroupTypeByItems();
                        break;
                    case "1" : this.changeGroupTypeByExpression();
                        break;
                }
                this.$('#vdim-nogroup-detail').hide();
                this.$('.selectableGroup li').removeClass("active");
                var groupName = "Group " + (this.groupList.length+1);
                var groupId = adhocUtil.guid().substring(0,26);
                var group = {
                    id: groupId,
                    name: groupName,
                    items: [],
                    expression: ''
                }
                self.addNewGroupFunc(group);
            }
        },

        addNewGroupFunc: function(group) {
            var groupId = group.id;
            var groupName = group.name;
            this.$('#vdim-nogroup-li').before(
                '<li id="' + groupId + '" class="active vdim-group-li">' +
                '<span class="selectable" style="left:0px;">' +
                groupName +
                '</span>' +
                '<a id="vdim-delgroup-'+groupId+'" style="right:4px;top:9px;"><i class="fa fa-trash ad-icon"></i></a>' +
                '</li>');
            this.$('#vdim-delgroup-' + groupId).unbind();
            this.$('#vdim-delgroup-' + groupId).bind("click", function () {
                self.delGroup(this.id.substring(14));
            });
            this.$('#vdim-groupname-input').val(groupName);
            this.groupList[this.groupList.length] = group;
            this.highlightGroup = group;
            //清空上次的内容
            this.resetLeftRightGrid();
        },

        validateGroup: function(group) {
            // 0-按条目 1-表达式
            var groupType = this.$('#vdim-grouptype-sel').val();
            var result = true;
            if(groupType=="0" && group.items.length==0){
                result = false;
            }
            if(groupType=="1" && group.expression==''){
                result = false;
            }
            return result;
        },

        resetLeftRightGrid: function() {
            var self = this;
            this.$('#vdim-search').val('');
            this.$('#vdim-exp-input').val('');
            this.$('[name=vdim-selectable]').empty();
            this.$('[name=vdim-selected]').empty();
            for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++){
                var item = this.allItemList[i];
                var htmlText = '<li id="vdim-selectableitem-'+item.id+'"><span></span>'
                    +'<span class="vdim-item" title="'+item.name+'">' + item.name + '</span><a id="vdim-add-'+item.id+'" href="#"><i class="fa fa-plus"></i></a></li>';
                this.$('[name=vdim-selectable]').append(htmlText);
                this.$('#vdim-add-'+item.id).unbind();
                this.$('#vdim-add-'+item.id).bind("click", function(event){
                    self.selectDimData(this.id.substring(9));
                });
            }
        },

        inputVdimExp: function () {
            var exp = this.$('#vdim-exp-input').val();
            this.highlightGroup.expression = exp;
        },

        selectDimData: function(dataId) {
            self = this;
            this.$('#vdim-add-'+dataId).unbind();
            this.$('#vdim-selectableitem-'+dataId).remove();
            for(var i=0; i<this.allItemList.length; i++){
                var item = this.allItemList[i];
                if(item.id == dataId){
                    var htmlText = '<li name="ad-selected-item" id="vdim-selecteditem-'+item.id+'"><span class="vdim-item" title="'+item.name+'">'+item.name+'</span><a id="vdim-remove-'+item.id+'" href="#"><i class="fa fa-trash"></i></a></li>';
                    this.$('[name=vdim-selected]').append(htmlText);
                    this.$('#vdim-remove-'+item.id).unbind();
                    this.$('#vdim-remove-'+item.id).bind("click", function(event){
                        self.cancelData(this.id.substring(12));
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
            this.$('#vdim-remove-'+dataId).unbind();
            this.$('#vdim-selecteditem-'+dataId).remove();
            var searchCont = this.$('#vdim-search').val();
            for(var i=0; i<this.allItemList.length; i++){
                var item = this.allItemList[i];
                if(item.id == dataId){
                    if (searchCont=='' || (searchCont!='' && item.name.indexOf(searchCont) != -1)) {
                        var htmlText = '<li id="vdim-selectableitem-' + item.id + '"><span></span>'
                            +'<span class="vdim-item" title="'+item.name+'">'+ item.name + '</span><a id="vdim-add-' + item.id + '" href="#"><i class="fa fa-plus"></i></a></li>';
                        this.$('[name=vdim-selectable]').append(htmlText);
                        this.$('#vdim-add-' + item.id).unbind();
                        this.$('#vdim-add-' + item.id).bind("click", function (event) {
                            that.selectDimData(this.id.substring(9));
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

        addAllItem: function () {
            this.$('[name=vdim-selectable]').empty();
            this.$('[name=vdim-selected]').empty();
            for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
                var item = this.allItemList[i];
                this.selectDimData(item.id);
            }
        },

        removeAllItem: function() {
            this.$('[name=vdim-selectable]').empty();
            this.$('[name=vdim-selected]').empty();
            for(var i=0; i<this.allItemList.length && i<this.MAX_LISTLENGTH; i++) {
                var item = this.allItemList[i];
                this.cancelData(item.id);
            }
        },

        selectableGroupClick: function(e) {
            var groupId = e.currentTarget.id;
            this.selectGroup(groupId);
        },

        selectGroup: function(groupId) {
            if(this.$('#vdim-nogroup-detail').css('display')=="none"
                && groupId!="vdim-nogroup-li" && this.highlightGroup!=null && !this.validateGroup(this.highlightGroup)){
                fish.toast('info', this.resource.GROUP_CONDITION_NOT_EMPTY);
                return;
            }
            this.$('.selectableGroup li').removeClass("active");
            if(groupId == "vdim-nogroup-li"){
                this.nogroupClick();
            }else {
                this.$('#'+groupId).addClass("active");
                var groupType = this.$('#vdim-grouptype-sel').val();
                switch(groupType){
                    case "0" : this.changeGroupTypeByItems();
                        break;
                    case "1" : this.changeGroupTypeByExpression();
                        break;
                }
                this.$('#vdim-nogroup-detail').hide();
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

        loadGroup: function (group) {
            that = this;
            this.$('#vdim-groupname-input').val(group.name);
            var groupType = this.$('#vdim-grouptype-sel').val();
            if(groupType=="0") {
                for (var i = 0; i < group.items.length; i++) {
                    var item = group.items[i];
                    this.$('#vdim-add-' + item.id).unbind();
                    this.$('#vdim-selectableitem-' + item.id).remove();
                    var htmlText = '<li name="ad-selected-item" id="vdim-selecteditem-' + item.id + '"><span class="vdim-item" title="' + item.name + '">' + item.name + '</span><a id="vdim-remove-' + item.id + '" href="#"><i class="fa fa-trash"></i></a></li>';
                    this.$('[name=vdim-selected]').append(htmlText);
                    this.$('#vdim-remove-' + item.id).unbind();
                    this.$('#vdim-remove-' + item.id).bind("click", function (event) {
                        that.cancelData(this.id.substring(15));
                    });
                }
            }else{
                this.changeGroupTypeByExpression();
                this.$('#vdim-exp-input').val(group.expression);
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

        nogroupClick: function () {
            this.$('#vdim-nogroup-li').addClass("active");
            this.$('#vdim-exact').hide();
            this.$('#vdim-exp-area').hide();
            this.$('#vdim-nogroup-detail').show();
            this.$('#vdim-groupname-input').val(this.nogroupName);
            this.highlightGroup = null;
        },

        groupNameChange: function () {
            var groupName = this.$('#vdim-groupname-input').val();
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
                this.$('#vdim-nogroup-li')[0].children[0].innerText = groupName;
            }
        },

        fieldNameChange: function () {
            var fieldName = this.$('#vdim-fieldname-input').val();
            this.$('#vdim-title').text(fieldName);
        },

        groupTypeChange: function () {
            this.clearGroup();
            var groupType = this.$('#vdim-grouptype-sel').val();
            switch(groupType){
                case "0" : this.changeGroupTypeByItems();
                    break;
                case "1" : this.changeGroupTypeByExpression();
                    break;
            }
        },

        changeGroupTypeByItems: function () {
            this.$('#vdim-exact').show();
            this.$('#vdim-exp-area').hide();
        },

        changeGroupTypeByExpression: function () {
            this.$('#vdim-exact').hide();
            this.$('#vdim-exp-area').show();
        },

        clearGroup: function () {
            for(var i=0;i<this.groupList.length;i++){
                this.$('#'+this.groupList[i].id).remove();
            }
            this.groupList = [];
            this.highlightGroup = null;
            this.addNewGroupClick();
            this.resetLeftRightGrid();
        },

        itemSearch: function () {
            this.$('[name=vdim-selectable]').empty();
            var reloadData = [];
            var searchCont = this.$('#vdim-search').val();
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

        resize: function () {
            this.uiContainerHeight = this.$el.parents(".portal-page-content").outerHeight();
            this.uiContainerWidth = this.$el.parents(".portal-page-content").outerWidth();
            if(!this.uiContainerHeight) {
                this.uiContainerHeight = this.$el.parents(".container_main").outerHeight();
            }
            var height = this.uiContainerHeight - 40;
            this.$el.find("#vdim-container").css({'height': +(height) + 'px'});
            //
            var leftPosition = this.uiContainerWidth-435;
            var topPosition = this.uiContainerHeight-70;
            this.$('#vdim-bottom-btngroup').css("left", leftPosition+"px");
            this.$('#vdim-bottom-btngroup').css("top", topPosition+"px");
        },

        vdimOkClick: function () {
            var self = this;
            if (!this.$form.isValid()) {
                return;
            }
            //至少添加一个分组项
            if(this.groupList.length==0){
                fish.toast('info', this.resource.ADD_GROUP_ATLEAST);
                return;
            }
            var existSameName = false;
            for(var i=0;i<this.groupList.length && !existSameName;i++){
                var group = this.groupList[i];
                if(adhocUtil.trim(group.name)==''){
                    fish.toast('info', this.resource.GROUP_NAME_NOT_EMPTY);
                    return;
                }
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
            var vdimName = this.$('#vdim-fieldname-input').val();
            var vdimField = this.$('#vdim-field-select').val();
            var dimCode = this.cachedDimCode.get(vdimField);
            var vdimType = this.$('#vdim-grouptype-sel').val();
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
                adhocAction.expressionCheck({
                    expressionList: expList
                }, function(ret){
                    if(ret.isValid && ret.isValid=="1"){
                        vdimAction.saveVdim({
                            "VDIM_CODE" : self.VDIM_CODE,
                            "DIM_CODE" : dimCode,
                            "VDIM_NAME" : vdimName,
                            "VDIM_FIELD" : vdimField,
                            "VDIM_TYPE" : vdimType,
                            "NOGROUP_NAME" : self.nogroupName,
                            "groupList" : self.groupList
                        }, function(){
                            self.loadVdimList();
                            self.clearInput();
                        });
                    }else{
                        fish.toast('info', self.resource.ERROR_EXPRESSION);
                    }
                });
            }else {
                vdimAction.saveVdim({
                    "VDIM_CODE" : self.VDIM_CODE,
                    "DIM_CODE" : dimCode,
                    "VDIM_NAME" : vdimName,
                    "VDIM_FIELD" : vdimField,
                    "VDIM_TYPE" : vdimType,
                    "NOGROUP_NAME" : self.nogroupName,
                    "groupList" : self.groupList
                }, function(){
                    self.loadVdimList();
                    self.clearInput();
                });
            }
        },

        expCheck: function() {
            var self = this;
            var expression = this.$('#vdim-exp-input').val();
            adhocAction.expressionCheck({
                expression: expression
            }, function(ret){
                if(ret.isValid && ret.isValid=="1"){
                    fish.toast('info', self.resource.CHECK_SUCCESS);
                }else{
                    fish.toast('info', self.resource.CHECK_FAILURE);
                }
            });
        },

        vdimCancelClick: function () {
            this.clearInput();
        }

    })

});
