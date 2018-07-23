define(
    [
        'text!oss_core/itnms/templatemgr/templates/CreateTemplateMain.html',
        'oss_core/itnms/hostgroup/views/HostGroupUtil',
        'oss_core/itnms/host/components/kdoDSelect/KdoDSelect',
        'i18n!oss_core/itnms/templatemgr/i18n/templatemgr'
    ], function(createTemplateMain, hostGroupUtil, kdoDSelect, i18nData) {
        return fish.View.extend({
            resource: fish.extend({}, i18nData),
            template: fish.compile(createTemplateMain),

            events : {
                "change #tm-new-group-btn" : "newGroupCheck"
            },

            initialize: function(inParam) {
                this.$el = inParam.el;
                this.templateList = inParam.templateList;
                this.groupList = inParam.groupList;
                this.groupRelaList = inParam.groupRelaList;
                this.catalogList = inParam.catalogList;
                this.subtypesList = inParam.subtypesList;
                this.curSubtype = inParam.curSubtype;
                this.curTemplate = inParam.curTemplate;
                this.curTemplateid = this.curTemplate?this.curTemplate.templateid:"";
                this.templateInfo;
                this.state={
                    data:['.Step1',".Step2"],
                    curIndex:0
                }
                this.selectedHosts = [];
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.contentReady();
                return this;
            },

            contentReady: function() {
                var self = this;
                self.stepEventInit();
                self.groupSelectInit();
                self.subtypesSelectInit();
                self.hostSelectInit();
                if(this.curTemplate){
                    this.setTemplateInfo();
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
                    _this.html('完成');
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
                    this.$el.find('.stepNext').html('下一步')
                }
                var upState= this.state.data[this.state.curIndex]
                $ws.find(upState).addClass('active')
                var upStatePage =$ws.find(upState).data('view');
                this.$el.find(upStatePage).show();
            },

            groupSelectInit: function () {
                var self = this;
                var selectedGroups = self.curTemplate?self.curTemplate.groups:[];
                var dp_l = [];
                var dp_r = [];
                fish.forEach(self.groupList, function(group) {
                    var isSelected = false;
                    if(selectedGroups && selectedGroups.length>0){
                        fish.forEach(selectedGroups, function(selectedGroup){
                            if(selectedGroup.groupid==group.groupid){
                                dp_r[dp_r.length] = {
                                    value: selectedGroup.groupid,
                                    name: selectedGroup.name
                                }
                                isSelected = true;
                            }
                        })
                    }
                    if(!isSelected) {
                        dp_l[dp_l.length] = {
                            value: group.groupid,
                            name: group.name
                        }
                    }
                });
                self.setKdoDSelect(dp_l, dp_r);
            },

            hostSelectInit: function () {
                var self = this;
                var dp_l = [];
                var dp_r = [];
                self.selectedHosts = [];
                if(self.curTemplate){
                    fish.forEach(self.curTemplate.hosts, function(host){
                        dp_r[dp_r.length] = {
                            value: host.hostid,
                            name: host.name
                        }
                        self.selectedHosts[self.selectedHosts.length] = {
                            value: host.hostid,
                            name: host.name
                        }
                    });
                    fish.forEach(self.curTemplate.templates, function(template){
                        dp_r[dp_r.length] = {
                            value: template.templateid,
                            name: template.name
                        }
                        self.selectedHosts[self.selectedHosts.length] = {value: template.templateid,
                            name: template.name
                        }
                    });
                }
                self.setStep2HostSelect(dp_l, dp_r);
            },

            setStep2GroupSel: function (relaGroups) {
                var self = this;
                var dataList = [];
                fish.forEach(self.groupList, function (hostgroup) {
                    fish.forEach(relaGroups, function (relahostgroup) {
                        if (hostgroup.groupid == relahostgroup.GROUPID) {
                            dataList[dataList.length] = hostgroup;
                        }
                    });
                });
                self.$step2GroupCombobox = self.$('#tm-step2-group-sel').combobox({
                    placeholder: 'Please select',
                    dataTextField: 'name',
                    dataValueField: 'groupid',
                    dataSource: dataList
                });
                self.$step2GroupCombobox.on('combobox:change', function () {
                    self.step2GroupFilterChange();
                });
                if(dataList.length>0) {
                    self.$step2GroupCombobox.combobox('value', dataList[0].groupid);
                }
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
                    placeholder: "Please select",
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    fNodes : fNodes
                };
                self.$('#tm-step1-subtypes-sel').combotree(options);
                self.$('#tm-step1-subtypes-sel').combotree('enable');
                self.$('#tm-step2-subtypes-sel').combotree(options);
                self.$('#tm-step2-subtypes-sel').combotree('enable');
                self.$('#tm-step2-subtypes-sel').on('combotree:change', function (e, data){
                    self.step2SubtypesSelchange(data);
                });
                if(self.curSubtype){
                    var subtypeName;
                    fish.forEach(self.subtypesList, function(item){
                        if(item.SUBTYPES_NO == self.curSubtype){
                            subtypeName = item.SUBTYPES_NAME;
                        }
                    });
                    self.$('#tm-step1-subtypes-sel').combotree('value', subtypeName);
                    self.$('#tm-step2-subtypes-sel').combotree('value', subtypeName);
                }else{
                    self.$('#tm-step1-subtypes-sel').combotree('clear');
                    self.$('#tm-step2-subtypes-sel').combotree('value', subtypeName);
                }
            },

            step2SubtypesSelchange: function (data) {
                var self = this;
                var nodes = data.selectNodes;
                var subtypes_no = nodes[0].subtypes_no;
                var relaGroups = [];
                fish.forEach(self.groupRelaList, function (relaItem) {
                    if (subtypes_no && subtypes_no == relaItem.SUBTYPES_NO) {
                        relaGroups[relaGroups.length] = relaItem;
                    }
                });
                self.setStep2GroupSel(relaGroups);
            },

            step2GroupFilterChange: function () {
                var self = this;
                if(self.hostSel){
                    self.selectedHosts = [];
                    fish.forEach(self.hostSel.val(), function(host){
                        self.selectedHosts[self.selectedHosts.length] = {
                            value: host.value,
                            name: host.name
                        }
                    })
                }
                var step2Group = self.$step2GroupCombobox.combobox('value');
                var hosts = [];
                var templates = [];
                fish.forEach(self.groupList, function(group){
                    if(group.groupid == step2Group){
                        hosts = group.hosts;
                        templates = group.templates;
                    }
                });
                var lList = [];
                var rList = [];
                if(hosts.length>0){
                    fish.forEach(hosts, function(hostItem){
                        lList[lList.length] = {
                            value: hostItem.hostid,
                            name: hostItem.host
                        };
                    })
                }
                if(templates.length>0){
                    fish.forEach(templates, function(templateItem){
                        lList[lList.length] = {
                            value: templateItem.templateid,
                            name: templateItem.name
                        };
                    })
                }
                for(var i=0;i<self.selectedHosts.length;i++){
                    var isInLlist = false;
                    for(var j=0;j<lList.length;j++){
                        if(self.selectedHosts[i].value == lList[j].value){
                            rList[rList.length] = {
                                name: lList[j].name,
                                value: lList[j].value
                            }
                            lList.splice(j--,1);
                            isInLlist = true;
                        }
                    }
                    if(!isInLlist){
                        rList[rList.length] = {
                            name: self.selectedHosts[i].name,
                            value: self.selectedHosts[i].value
                        }
                    }
                }
                self.setStep2HostSelect(lList, rList);
            },

            setKdoDSelect: function (dp_l, dp_r) {
                var self = this;
                self.groupSel = new kdoDSelect({
                    el: self.$el.find('.tm-group-sel'),
                    L: dp_l,
                    R: dp_r
                });
                self.groupSel.render();
            },

            setStep2HostSelect: function (dp_l, dp_r) {
                var self = this;
                self.hostSel = new kdoDSelect({
                    el: self.$el.find('.tm-host-sel'),
                    L: dp_l,
                    R: dp_r
                });
                self.hostSel.render();
            },

            newGroupCheck: function () {
                this.$('#tm-new-group-input-container').toggle();
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
            },

            setTemplateInfo: function () {
                this.$('#tm-template-name-input').val(this.curTemplate.host);
                this.$('#tm-template-visiblename-input').val(this.curTemplate.name);
                this.$('#tm-template-description-input').val(this.curTemplate.description);
            },

            validateInfo: function () {
                var self = this;
                var validFlag = true;
                var templateName = hostGroupUtil.trim(this.$('#tm-template-name-input').val());
                if(templateName == ''){
                    validFlag = false;
                    fish.toast('info', "Template name is required");
                }else {
                    fish.forEach(self.templateList, function(template){
                        if(template.host == templateName && self.curTemplateid!=template.templateid){
                            validFlag = false;
                            fish.toast('info', "Template name existed");
                        }
                    });
                }
                //
                var visibleName = hostGroupUtil.trim(this.$('#tm-template-visiblename-input').val());
                if(validFlag && visibleName != '') {
                    fish.forEach(self.templateList, function(template){
                        if(template.name == visibleName && self.curTemplateid!=template.templateid){
                            validFlag = false;
                            fish.toast('info', "Template visible name existed");
                        }
                    });
                }
                //
                var description = hostGroupUtil.trim(this.$('#tm-template-description-input').val());
                //
                var groupList = [];
                if(self.groupSel){
                    fish.forEach(self.groupSel.val(), function(group){
                        groupList[groupList.length] = {
                            groupid: group.value

                        };
                    });
                }
                //
                var newGroupChecked = (self.$('#tm-new-group-btn')[0]).checked;
                var newGroupSubtypes = self.$('#tm-step1-subtypes-sel').combotree('value');
                var newGroupName =  hostGroupUtil.trim(self.$('#tm-newgroup-name-input').val());
                if(validFlag && groupList.length==0 && !newGroupChecked) {
                    validFlag = false;
                    fish.toast('info', "Group is required");
                }else if (validFlag && newGroupChecked){
                    if(!newGroupSubtypes){
                        validFlag = false;
                        fish.toast('info', "Subtypes is required");
                    }else if(newGroupName==""){
                        validFlag = false;
                        fish.toast('info', "New group name is required");
                    }else {
                        fish.forEach(self.groupList, function(group){
                            if(group.name == newGroupName){
                                validFlag = false;
                                fish.toast('info', "New group name existed");
                            }
                        });
                    }
                }
                //
                var hosts = [];
                if(self.hostSel){
                    fish.forEach(self.hostSel.val(), function(host){
                        hosts[hosts.length] = {
                            hostid: host.value
                        };
                    });
                }
                self.templateInfo = {
                    templateid: self.curTemplate?self.curTemplate.templateid:"",
                    host: templateName,
                    name: visibleName,
                    description: description,
                    groups: groupList,
                    subtypes_no: newGroupSubtypes?newGroupSubtypes.id:"",
                    category_no: newGroupSubtypes?newGroupSubtypes.pId:"",
                    newGroupName: newGroupName,
                    hosts: hosts
                };
                return validFlag;
            },

            resize: function() {
                return this;
            }
        });
    }
);