define(
    [
        'text!oss_core/itnms/discoverymgr/templates/CreateDruleMain.html',
        'oss_core/itnms/discoverymgr/actions/DiscoveryMgrAction',
        'oss_core/itnms/hostgroup/views/HostGroupUtil',
        'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
        'oss_core/itnms/discoverymgr/views/CheckServiceDialog',
        'i18n!oss_core/itnms/discoverymgr/i18n/discoverymgr'
    ], function(createDruleMain, action, hostGroupUtil, kdoDSelect, CheckServiceDialog, i18nData) {
        return fish.View.extend({
            resource: fish.extend({}, i18nData),
            template: fish.compile(createDruleMain),

            events : {

            },

            initialize: function(inParam) {
                this.$el = inParam.el;
                this.drList = inParam.drList;
                this.checkAttrList = [];
                this.checkTypeList = [];
                this.catalogList = inParam.catalogList;
                this.subtypesList = inParam.subtypesList;
                this.druleRelaList = inParam.druleRelaList;
                this.curSubtype = inParam.curSubtype;
                this.curDrule = inParam.curDrule;
                this.curDruleid = this.curDrule?this.curDrule.druleid:"";
                this.druleInfo;
                this.state={
                    data:['.Step1',".Step2",".Step3"],
                    curIndex:0
                }
                this.gridDataList = [];
                this.deviceFlag = "-1";
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.contentReady();
                return this;
            },

            contentReady: function() {
                var self = this;
                self.stepEventInit();
                self.proxySelectInit();
                self.subtypesSelectInit();
                //
                self.checkTypeInit();
                //
                if(this.curDrule){
                    this.setDruleInfo();
                }
            },

            stepNext: function(_this){
                var self = this;
                var $ws = this.$el.find('.kdoWizardSteps')
                //把当前的状态设置为complete,当前显示的页面为hide
                var curState =this.state.data[this.state.curIndex];
                $ws.find(curState).removeClass('active').addClass('complete');
                var curView =$ws.find(curState).data('view');
                if(this.state.curIndex<this.state.data.length-1){
                    this.$el.find(curView).hide();
                }
                //把下个状态设置为active
                this.state.curIndex=this.state.curIndex+1;
                if(this.state.curIndex>0){
                    this.$el.find('.stepUp').removeClass('hide')
                        .addClass('show');
                }
                if( this.state.curIndex>=this.state.data.length-1){
                    _this.html(self.resource.FINISH);
                    self.initDeviceFlag();
                }
                var nextState= this.state.data[this.state.curIndex]
                $ws.find(nextState).addClass('active')
                var curView =$ws.find(nextState).data('view');
                this.$el.find(curView).show();
                if(!nextState){
                    this.state.curIndex=this.state.curIndex-1;
                    this.trigger('okEvent');
                }
            },

            stepUp: function(_this){
                var $ws =this.$el.find('.kdoWizardSteps')
                //把当前的状态设置为active,complete,当前显示的页面为hide
                var curState =this.state.data[this.state.curIndex];
                $ws.find(curState).removeClass('complete')
                    .removeClass('active')
                var curView =$ws.find(curState).data('view');
                this.$el.find(curView).hide();
                //把下个状态设置为active
                this.state.curIndex=this.state.curIndex-1;
                if(this.state.curIndex<=0){
                    this.$el.find('.stepUp').removeClass('show')
                        .addClass('hide');
                }
                if( this.state.curIndex<this.state.data.length-1){
                    this.$el.find('.stepNext').html(this.resource.NEXT_STEP)
                }
                var upState= this.state.data[this.state.curIndex]
                $ws.find(upState).addClass('active')
                var upStatePage =$ws.find(upState).data('view');
                this.$el.find(upStatePage).show();
            },

            proxySelectInit: function () {
                var self = this;
                var proxyList = [];
                proxyList[proxyList.length] = {
                    proxyid: "0",
                    host: this.resource.NO_PROXY
                };
                action.qryProxy(function(retJsonObj) {
                    if (retJsonObj && retJsonObj.result) {
                        fish.forEach(retJsonObj.result, function (proxy) {
                            proxyList[proxyList.length] = proxy;
                        });
                    }
                    self.$proxyCombobox = self.$('#dr-proxy-sel').combobox({
                        placeholder: '',
                        dataTextField: 'host',
                        dataValueField: 'proxyid',
                        dataSource: proxyList
                    });
                    self.$proxyCombobox.combobox('value', proxyList[0].proxyid);
                    if(self.curDrule){
                        self.$proxyCombobox.combobox('value', self.curDrule.proxy_hostid);
                    }
                });
            },

            checkTypeInit: function () {
                var self = this;
                self.checkAttrList = [];
                self.checkTypeList = [];
                action.qryCheckType(function(checkTypeList) {
                    if(checkTypeList){
                        fish.forEach(checkTypeList, function(item){
                            if(item.hasOwnProperty("COMPONENT_TYPE")){
                                self.checkAttrList[self.checkAttrList.length] = item;
                            }else {
                                self.checkTypeList[self.checkTypeList.length] = item;
                            }
                        });
                    }
                    self.checkServiceGridInit();
                });
            },

            checkServiceGridInit: function () {
                var self = this;
                var opt = {
                    colModel: [{
                        name: 'PARA_ID',
                        label: '',
                        key:true,
                        search: false,
                        hidden: true
                    }, {
                        name: 'PARA_NAME',
                        label: self.resource.SERVICE_NAME,
                        search: true,
                        sortable: false,
                        align: "center",
                        width: 200
                    }, {
                        name: 'PARA_DESC',
                        label: self.resource.PARAMETER,
                        search: false,
                        sortable: false,
                        align: "center",
                        width: 400
                    }, {
                        name: 'action',
                        label: '',
                        search: false,
                        width: 400,
                        formatter: function (cellval, opts, rwdat, _act) {
                            var rowid = rwdat.PARA_ID;
                            return'<div class="groupMoreOp">' +
                                '<div class="btn-group pull-right">' +
                                '<button type="button" class="btn hg-link-btn dr-checkservice-edit" id="editbtn-' + rowid + '"><i class="glyphicon glyphicon-pencil"></i></button>' +
                                '<button type="button" class="btn hg-link-btn dr-checkservice-del" id="delbtn-' + rowid + '"><i class="glyphicon glyphicon-trash"></i></button>' +
                                '</div>' +
                                '</div>';
                        }
                    }],
                    pager: false,
                    gridComplete: function() {
                        //删除
                        self.$el.find(".dr_check_grid").find('.groupMoreOp').find('.dr-checkservice-del').bind("click", function(e){
                            var rowid = e.currentTarget.id.substring(7);//delbtn-xxx
                            self.deleteCheckService(rowid);
                        });
                        //编辑
                        self.$el.find(".dr_check_grid").find('.groupMoreOp').find('.dr-checkservice-edit').bind("click", function(e){
                            var rowid = e.currentTarget.id.substring(8);//editbtn-xxx
                            self.showEditCheckServiceDialog(rowid);
                        });
                    }
                };
                this.$(".dr_check_grid").empty();
                this.$grid = this.$el.find(".dr_check_grid").grid(opt);
                this.$grid.jqGrid("setGridHeight", this.leftTreeHeight-400);
                this.$grid.jqGrid("setGridWidth", this.$('.Step1Page').width());
                if(self.curDrule){
                    self.loadCheckService();
                }
            },

            loadCheckService: function () {
                var self = this;
                self.gridDataList = [];
                fish.forEach(self.curDrule.dchecks, function(checkItem){
                    var para_value = checkItem.type;
                    var para_name;
                    var para_desc;
                    fish.forEach(self.checkTypeList, function(checkType){
                        if(checkType.PARA_VALUE == para_value){
                            para_name = checkType.PARA_NAME;
                            para_desc = checkType.PARA_DESC;
                        }
                    });
                    var paraDataList = [];
                    var uniq = "0";
                    for(var key in checkItem) {
                        if(para_desc) {
                            para_desc = para_desc.replace("{" + key + "}", checkItem[key]);
                        }
                        if(key != "dcheckid" && key != "druleid" && key != "type"){
                            if(key == "uniq"){
                                uniq = checkItem[key];
                            }else{
                                paraDataList[paraDataList.length] = {
                                    COMPONENT_NO: key,
                                    COMPONENT_VALUE: checkItem[key]
                                }
                            }
                        }
                    }
                    if(uniq == "1"){
                        self.deviceFlag = checkItem.dcheckid;
                    }
                    self.gridDataList[self.gridDataList.length] = {
                        PARA_ID: checkItem.dcheckid,
                        PARA_VALUE: para_value,
                        PARA_NAME: para_name,
                        PARA_DESC: para_desc,
                        PARA_DATALIST: paraDataList
                    };
                });
                self.$grid.jqGrid("reloadData", self.gridDataList);
            },

            subtypesSelectInit: function () {
                var self = this;
                var fNodes = [];
                fish.forEach(self.catalogList, function(catalogItem){
                    fNodes[fNodes.length] = {
                        disabled: true,
                        category_no: catalogItem.category_no,
                        children: catalogItem.children,
                        id: catalogItem.id,
                        name: catalogItem.name,
                        nodeType: catalogItem.nodeType,
                        open: true
                    }
                });
                var options = {
                    view: {
                        selectedMulti: false,
                        showIcon: false
                    },
                    placeholder: " ",
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    fNodes : fNodes
                };
                self.$('#dr-category-sel').combotree(options);
                if(self.curSubtype){
                    var subtypeName;
                    fish.forEach(self.subtypesList, function(item){
                        if(item.SUBTYPES_NO == self.curSubtype){
                            subtypeName = item.SUBTYPES_NAME;
                        }
                    });
                    self.$('#dr-category-sel').combotree('value', subtypeName);
                }else if(self.curDrule){
                    fish.forEach(self.druleRelaList, function(druleRela){
                        if(druleRela.DRULEID == self.curDrule.druleid){
                            var subtypeName;
                            fish.forEach(self.subtypesList, function(item){
                                if(item.SUBTYPES_NO == druleRela.SUBTYPES_NO){
                                    subtypeName = item.SUBTYPES_NAME;
                                }
                            });
                            self.$('#dr-category-sel').combotree('value', subtypeName);
                        }
                    });
                }else{
                    self.$('#dr-category-sel').combotree('clear');
                }
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            stepEventInit: function () {
                var self = this;
                this.$('.stepNext').off('click').on('click',function(){
                    self.stepNext($(this))
                });
                this.$('.stepUp').off('click').on('click',function(){
                    self.stepUp($(this))
                });
                this.$el.find('.hostPageCancel').off('click').on('click',function(){
                    self.trigger("cancelEvent");
                });
                this.$el.find('#dr-checkservice-add-btn').off('click').on('click',function(){
                    self.showCheckServiceDialog();
                });
            },

            showCheckServiceDialog: function () {
                var self = this;
                if(self.checkServiceDialog){
                    self.checkServiceDialog = null;
                };
                var options = {
                    height: self.leftTreeHeight,
                    width: 400,
                    modal: true,
                    draggable: false,
                    autoResizable: false,
                    position: {
                        'of': self.$el,
                        'my': "top",
                        'at': "right" + " " + "top",
                        collision: "fit"
                    }
                };
                self.checkServiceDialog = new CheckServiceDialog();
                self.checkServiceDialog.popup(options, {
                    checkTypeList: self.checkTypeList,
                    checkAttrList: self.checkAttrList
                }, function(result) {
                    self.refreshGridData(result);
                });
            },

            showEditCheckServiceDialog: function (rowid) {
                var self = this;
                fish.forEach(self.gridDataList, function(dataItem){
                   if(dataItem.PARA_ID == rowid){
                       var options = {
                           height: self.leftTreeHeight,
                           width: 400,
                           modal: true,
                           draggable: false,
                           autoResizable: false,
                           position: {
                               'of': self.$el,
                               'my': "top",
                               'at': "right" + " " + "top",
                               collision: "fit"
                           }
                       };
                       self.checkServiceDialog = new CheckServiceDialog();
                       self.checkServiceDialog.popup(options, {
                           checkTypeList: self.checkTypeList,
                           checkAttrList: self.checkAttrList,
                           checkServiceParam: dataItem
                       }, function(result) {
                           self.refreshGridData(result);
                       });
                   }
                });
            },

            deleteCheckService: function (rowid) {
                var self = this;
                for(var i = 0; i < self.gridDataList.length; i++){
                    var dataItem = self.gridDataList[i];
                    if(dataItem.PARA_ID == rowid){
                        self.gridDataList.splice(i, 1);
                    }
                };
                self.$grid.jqGrid("reloadData", self.gridDataList);
            },

            refreshGridData: function (result) {
                var self = this;
                var isExist = false;
                for(var i = 0; i < self.gridDataList.length; i++){
                    var dataItem = self.gridDataList[i];
                    if(dataItem.PARA_ID == result.PARA_ID){
                        isExist = true;
                        self.gridDataList[i] = result;
                    }
                };
                if(!isExist){
                    self.gridDataList[self.gridDataList.length] = result;
                }else{

                }
                self.$grid.jqGrid("reloadData", self.gridDataList);
                self.checkServiceDialog = null;
            },

            initDeviceFlag: function(){
                var self = this;
                var deviceFlagList = [];
                fish.forEach(self.gridDataList, function (dataItem){
                    var para_value = dataItem.PARA_VALUE;
                    fish.forEach(self.checkTypeList, function(checkType){
                        if(checkType.PARA_VALUE == para_value && checkType.PARA_F_NAME == "1"){
                            deviceFlagList[deviceFlagList.length] = {
                                id: dataItem.PARA_ID,
                                name: dataItem.PARA_DESC
                            };
                        }
                    });
                });
                self.$('#dr-deviceflag-container').empty();
                fish.forEach(deviceFlagList, function(deviceFlag){
                    var radioHtml = '<div></div><label class="radio-inline">' +
                        '<input type="radio" class="yAxisTypeRadio" name="dr-deviceflag-radio" value="'+ deviceFlag.id +'">' +
                        deviceFlag.name + '</label></div>';
                    self.$('#dr-deviceflag-container').append(radioHtml);
                });
                self.$('input[name="dr-deviceflag-radio"]').off('change').on('change',function(){
                    self.deviceFlag = self.$('input[name="dr-deviceflag-radio"]:checked').val();
                });
                if(self.deviceFlag){
                    self.$("input[type=radio][name=dr-deviceflag-radio][value="+self.deviceFlag+"]").attr("checked",'checked')
                }
                if(!(self.$('input[name="dr-deviceflag-radio"]:checked').val())){
                    self.deviceFlag = "-1";
                    self.$('#dr-deviceflag-default-container').empty();
                    self.$('#dr-deviceflag-default-container').append('<label class="radio-inline">' +
                        '<input type="radio" class="yAxisTypeRadio" name="dr-deviceflag-radio" value="-1" checked="">'+self.resource.IP_ADDRESS+'</label>');
                }
            },

            setDruleInfo: function () {
                this.$('#dr-name-input').val(this.curDrule.name);
                this.$('#dr-interval-input').val(this.curDrule.delay);
                this.$('#dr-iprange-input').val(this.curDrule.iprange);
                if(this.curDrule.status=="1"){
                    this.$("#dr-drule-enabled-btn").removeAttr("checked");
                }
            },

            validateInfo: function () {
                var self = this;
                var validFlag = true;
                var druleName = hostGroupUtil.trim(this.$('#dr-name-input').val());
                if(druleName == ''){
                    validFlag = false;
                    fish.toast('info', "Name is required");
                }else {
                    fish.forEach(self.drList, function(drule){
                        if(drule.name == druleName && self.curDruleid!=drule.druleid){
                            validFlag = false;
                            fish.toast('info', "Name existed");
                        }
                    });
                }
                //
                var iprange = hostGroupUtil.trim(this.$('#dr-iprange-input').val());
                if(iprange == ''){
                    validFlag = false;
                    fish.toast('info', "IP range is required");
                }
                //
                var delay = hostGroupUtil.trim(this.$('#dr-interval-input').val());
                if(delay == ''){
                    validFlag = false;
                    fish.toast('info', "Interval is required");
                }
                //
                var proxy_hostid = self.$proxyCombobox.combobox('value');
                //
                var statusChkBtn = this.$('#dr-drule-enabled-btn')[0];
                var status = statusChkBtn.checked?"0":"1";
                //
                var subtypes = self.$('#dr-category-sel').combotree('value');
                if(subtypes == '' || !subtypes){
                    validFlag = false;
                    fish.toast('info', "Category is required");
                }
                //
                var dchecks = [];
                fish.forEach(self.gridDataList, function(checkItem){
                    var dcheck = new Object();
                    var checkType = checkItem.PARA_VALUE;
                    dcheck["type"] = checkType;
                    fish.forEach(checkItem.PARA_DATALIST, function(fieldItem){
                        dcheck[fieldItem.COMPONENT_NO] = fieldItem.COMPONENT_VALUE;
                    });
                    if(self.deviceFlag == checkItem.PARA_ID){
                        dcheck["uniq"] = "1";
                    }
                    dchecks[dchecks.length] = dcheck;
                });
                self.druleInfo = {
                    druleid: self.curDrule?self.curDrule.druleid:"",
                    iprange: iprange,
                    name: druleName,
                    delay: delay,
                    proxy_hostid: proxy_hostid,
                    subtypes_no: subtypes?subtypes.id:"",
                    category_no: subtypes?subtypes.pId:"",
                    status: status,
                    dchecks: dchecks
                };
                return validFlag;
            },

            resize: function() {
                this.uiContainerHeight = this.$el.parents(".portal-page-content").outerHeight();
                this.leftTreeHeight = this.uiContainerHeight - 35;
                return this;
            }

        });
    }
);