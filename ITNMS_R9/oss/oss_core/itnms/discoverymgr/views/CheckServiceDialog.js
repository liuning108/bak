define(
    [
        'text!oss_core/itnms/discoverymgr/templates/CheckServiceDialog.html',
        'oss_core/itnms/discoverymgr/actions/DiscoveryMgrAction',
        'oss_core/itnms/hostgroup/views/HostGroupUtil',
        'oss_core/itnms/discoverymgr/views/Util',
        'i18n!oss_core/itnms/discoverymgr/i18n/discoverymgr'
    ], function(createDruleMain, action, hostGroupUtil, util, i18nData) {
        return fish.View.extend({
            resource: fish.extend({}, i18nData),
            template: fish.compile(createDruleMain),

            events : {

            },

            content: function(){
                this.$el = $(this.template(this.resource));
                this.resource = fish.extend({}, i18nData);
                return this.$el;
            },

            popup: function(options, inParams, callback) {
                var self = this;
                options.content = this.content(),
                this.$popup = fish.popup(options);
                this.checkTypeList = inParams.checkTypeList;
                this.checkAttrList = inParams.checkAttrList;
                this.checkServiceParam = inParams.checkServiceParam;
                this.callback = callback;
                this.initCheckTypeSel();
                //
                this.$el.find('.OK').off('click').on('click',function(){
                    self.okClick();
                });
                this.$el.find('.reset').off('click').on('click',function(){
                    self.cancelClick();
                });
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.contentReady();
                return this;
            },

            initCheckTypeSel: function () {
                var self = this;
                self.$checkTypeCombobox = self.$('#dr-checktype-sel').combobox({
                    placeholder: ' ',
                    dataTextField: 'PARA_NAME',
                    dataValueField: 'PARA_VALUE',
                    dataSource: self.checkTypeList
                });
                self.$checkTypeCombobox.combobox('value', self.checkTypeList[0].PARA_VALUE);
                self.$checkTypeCombobox.on('combobox:change', function () {
                    self.checkTypeChange();
                });
                self.checkTypeChange();
                if(self.checkServiceParam){
                    self.$checkTypeCombobox.combobox('value', self.checkServiceParam.PARA_VALUE);
                }
            },

            checkTypeChange: function () {
                var self = this;
                self.$('.attrComponentContainer').empty();
                var checkTypeId = self.$checkTypeCombobox.combobox('value');
                if(checkTypeId == "13"){
                    self.setSecurityLevelComponent(checkTypeId);
                }else {
                    self.$('.securityLevelContainer').hide();
                    self.$('.attrComponentContainer').show();
                    fish.forEach(self.checkAttrList, function (attrItem) {
                        if (attrItem.CHECK_TYPE == checkTypeId) {
                            var component_type = attrItem.COMPONENT_TYPE;
                            var component_vrule = attrItem.COMPONENT_VRULE;
                            if (component_type == "T" && !component_vrule) {
                                self.setTextComponent(attrItem);
                            } else if (component_type == "T") {

                            } else if (component_type == "L") {
                                self.setListComponent(attrItem);
                            }
                        }
                    });
                }
            },

            setSecurityLevelComponent: function (checkTypeId) {
                var self = this;
                self.$('.attrComponentContainer').hide();
                self.$('.securityLevelContainer').show();
                var component_no = "snmpv3_securitylevel";
                var component_name;
                var query_param;
                var default_value;
                fish.forEach(self.checkAttrList, function(attrItem){
                    if(attrItem.CHECK_TYPE=="13"){
                        var lable_name = attrItem.COMPONENT_NAME;
                        self.$('#dr-'+attrItem.COMPONENT_NO+'-label').text(lable_name);
                        if(attrItem.COMPONENT_NO=="snmpv3_securitylevel") {
                            component_name = attrItem.COMPONENT_NAME;
                            query_param = attrItem.QUERY_PARAM;
                            default_value = attrItem.DEFAULT_VALUE;
                            self.$('#dr-' + attrItem.COMPONENT_NO + '-label').text(component_name);
                        }
                    }
                });
                action.qryParamDataById({
                    para_id: query_param
                }, function(dataList){
                    self.$securityLevelCombobox = self.$('#dr-'+component_no+'-'+checkTypeId).combobox({
                        placeholder: ' ',
                        dataTextField: 'PARA_NAME',
                        dataValueField: 'PARA_VALUE',
                        dataSource: dataList
                    });
                    self.$securityLevelCombobox.on('combobox:change', function () {
                        self.securityLevelChange();
                    });
                    self.$securityLevelCombobox.combobox('value', default_value);
                    if(self.checkServiceParam){
                        fish.forEach(self.checkServiceParam.PARA_DATALIST, function(dataItem){
                            if(dataItem.COMPONENT_NO == component_no){
                                self.$securityLevelCombobox.combobox('value', dataItem.COMPONENT_VALUE);
                            }
                        })
                    }
                });
                //snmpv3_authprotocol snmpv3_privprotocol
                fish.forEach(self.checkAttrList, function(attrItem){
                    if(attrItem.CHECK_TYPE=="13" && attrItem.COMPONENT_NO=="snmpv3_authprotocol"){
                        self.setSnmpv3AuthProtocol(attrItem);
                    }
                    if(attrItem.CHECK_TYPE=="13" && attrItem.COMPONENT_NO=="snmpv3_privprotocol"){
                        self.setSnmpv3PrivProtocol(attrItem);
                    }
                });
                if(self.checkServiceParam){
                    fish.forEach(self.checkServiceParam.PARA_DATALIST, function(dataItem){
                        self.$('#dr-'+dataItem.COMPONENT_NO+'-'+checkTypeId).val(dataItem.COMPONENT_VALUE);
                    })
                }
            },

            setSnmpv3AuthProtocol: function (attrItem) {
                var self = this;
                var component_no = "snmpv3_authprotocol";
                var component_name = attrItem.COMPONENT_NAME;
                var query_param = attrItem.QUERY_PARAM;
                var default_value = attrItem.DEFAULT_VALUE;
                var checkTypeId = attrItem.CHECK_TYPE;
                action.qryParamDataById({
                    para_id: query_param
                }, function(dataList){
                    if(!self.$snmpv3AuthProtocolCombobox) {
                        self.$snmpv3AuthProtocolCombobox = self.$('#dr-' + component_no+'-'+checkTypeId).combobox({
                            placeholder: ' ',
                            dataTextField: 'PARA_NAME',
                            dataValueField: 'PARA_VALUE',
                            dataSource: dataList
                        });
                    }
                    self.$snmpv3AuthProtocolCombobox.combobox('value', default_value);
                    if(self.checkServiceParam){
                        fish.forEach(self.checkServiceParam.PARA_DATALIST, function(dataItem){
                            if(dataItem.COMPONENT_NO == component_no){
                                self.$snmpv3AuthProtocolCombobox.combobox('value', dataItem.COMPONENT_VALUE);
                            }
                        })
                    }
                });
            },

            setSnmpv3PrivProtocol: function (attrItem) {
                var self = this;
                var component_no = "snmpv3_privprotocol";
                var component_name = attrItem.COMPONENT_NAME;
                var query_param = attrItem.QUERY_PARAM;
                var default_value = attrItem.DEFAULT_VALUE;
                var checkTypeId = attrItem.CHECK_TYPE;
                action.qryParamDataById({
                    para_id: query_param
                }, function(dataList){
                    if(!self.$snmpv3PrivProtocolCombobox) {
                        self.$snmpv3PrivProtocolCombobox = self.$('#dr-' + component_no+'-'+checkTypeId).combobox({
                            placeholder: ' ',
                            dataTextField: 'PARA_NAME',
                            dataValueField: 'PARA_VALUE',
                            dataSource: dataList
                        });
                    }
                    self.$snmpv3PrivProtocolCombobox.combobox('value', default_value);
                    if(self.checkServiceParam){
                        fish.forEach(self.checkServiceParam.PARA_DATALIST, function(dataItem){
                            if(dataItem.COMPONENT_NO == component_no){
                                self.$snmpv3PrivProtocolCombobox.combobox('value', dataItem.COMPONENT_VALUE);
                            }
                        })
                    }
                });
            },

            securityLevelChange: function () {
                var self = this;
                var securityLevel = self.$securityLevelCombobox.combobox('value');
                if(securityLevel=="0"){
                    self.$('.securityLevel_1').hide();
                    self.$('.securityLevel_2').hide();
                }else if(securityLevel=="1"){
                    self.$('.securityLevel_2').hide();
                    self.$('.securityLevel_1').show();
                }else if(securityLevel=="2"){
                    self.$('.securityLevel_1').hide();
                    self.$('.securityLevel_2').show();
                }
            },

            setTextComponent: function (attrItem) {
                var self = this;
                var check_type = attrItem.CHECK_TYPE;
                var component_no = attrItem.COMPONENT_NO;
                var component_name = attrItem.COMPONENT_NAME;
                var component_type = attrItem.COMPONENT_TYPE;
                var default_value = attrItem.DEFAULT_VALUE;
                var componentHtml = '<div class="col-md-12 form-group">' +
                    '<label>' + component_name + '</label><input id="dr-' + component_no + '-' + check_type +
                    '" value="' + (default_value?default_value:'') + '" class="form-control"/></div>';
                self.$('.attrComponentContainer').append(componentHtml);
                if(this.checkServiceParam){
                    fish.forEach(this.checkServiceParam.PARA_DATALIST, function(dataItem){
                        if(dataItem.COMPONENT_NO == component_no){
                            self.$('#dr-'+component_no+'-'+self.checkServiceParam.PARA_VALUE).val(dataItem.COMPONENT_VALUE);
                        }
                    })
                }
            },

            setListComponent: function (attrItem) {
                var self = this;
                var check_type = attrItem.CHECK_TYPE
                var component_no = attrItem.COMPONENT_NO;
                var component_name = attrItem.COMPONENT_NAME;
                var component_type = attrItem.COMPONENT_TYPE;
                var default_value = attrItem.DEFAULT_VALUE;
                var query_param = attrItem.QUERY_PARAM;
                action.qryParamDataById({
                    para_id: query_param
                }, function(dataList){
                    var componentHtml = '<div class="col-md-12 form-group">' +
                        '<label>' + component_name +
                        '</label><input style="padding-left:4px;width:356px" id="dr-'+component_no+'-'+check_type+'" class="form-control"/>'+
                        '</div>';
                    self.$('.attrComponentContainer').append(componentHtml);
                    var $tmpCombobox = self.$('#dr-'+component_no+'-'+check_type).combobox({
                        placeholder: ' ',
                        dataTextField: 'PARA_NAME',
                        dataValueField: 'PARA_VALUE',
                        dataSource: dataList
                    });
                    $tmpCombobox.on('combobox:change', function () {

                    });
                    $tmpCombobox.combobox('value', default_value);
                    if(self.checkServiceParam){
                        fish.forEach(self.checkServiceParam.PARA_DATALIST, function(dataItem){
                            if(dataItem.COMPONENT_NO == component_no){
                                self.$('#dr-'+component_no+'-'+self.checkServiceParam.PARA_VALUE).combobox('value', dataItem.COMPONENT_VALUE);
                            }
                        })
                    }
                });
            },

            cancelClick: function () {
                this.$popup.hide();
            },

            okClick: function () {
                var self = this;
                var validFlag = true;
                var para_desc;
                var para_item;
                var checkType = self.$checkTypeCombobox.combobox('value');
                fish.forEach(self.checkTypeList, function(item) {
                    if(item.PARA_VALUE == checkType){
                        para_item = item;
                        if(item.PARA_DESC){
                            para_desc = item.PARA_DESC;
                        }
                    }
                });
                var paraDataList = [];
                fish.forEach(self.checkAttrList, function(item){
                    if(item.CHECK_TYPE == checkType) {
                        var component_no = item.COMPONENT_NO;
                        if(item.COMPONENT_TYPE == "T"){
                            var component_value = hostGroupUtil.trim(self.$('#dr-'+component_no+'-'+checkType).val());
                            if(component_value=="" && !(self.$('#dr-'+component_no+'-'+checkType).is(":hidden"))){
                                fish.toast('info', self.resource.INCORRECT + item.COMPONENT_NAME.toLowerCase());
                                validFlag = false;
                                return;
                            }
                            paraDataList[paraDataList.length] = {
                                COMPONENT_NO: component_no,
                                COMPONENT_VALUE: component_value
                            };
                            if(para_desc){
                                para_desc = para_desc.replace("{"+component_no+"}", component_value);
                            }
                        }else if(item.COMPONENT_TYPE == "L" || item.COMPONENT_TYPE == "R"){
                            var component_value = self.$('#dr-'+component_no+'-'+checkType).combobox('value');
                            if((component_value=="" || !component_value) && !(self.$('#dr-'+component_no+'-'+checkType).is(":hidden"))){
                                fish.toast('info', item.COMPONENT_NAME + " is incorrect");
                                validFlag = false;
                                return;
                            }
                            paraDataList[paraDataList.length] = {
                                COMPONENT_NO: component_no,
                                COMPONENT_VALUE: component_value
                            };
                            if(para_desc){
                                para_desc = para_desc.replace("{"+component_no+"}", component_value);
                            }
                        }
                    }
                });
                if(validFlag){
                    self.callback({
                        PARA_ID: self.checkServiceParam?self.checkServiceParam.PARA_ID:util.guid(),
                        PARA_VALUE: para_item.PARA_VALUE,
                        PARA_NAME: para_item.PARA_NAME,
                        PARA_DESC: para_desc,
                        PARA_DATALIST: paraDataList
                    });
                    self.$popup.hide();
                }
            }

        });
    }
);