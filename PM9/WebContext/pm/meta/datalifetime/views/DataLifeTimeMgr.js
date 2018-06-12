/**
 *
 */
define([
        'text!oss_core/pm/meta/datalifetime/templates/DataLifeTimeMgr.html',
        'oss_core/pm/adhocdesigner/actions/AdhocAction',
        'oss_core/pm/meta/datalifetime/actions/DataLifeTimeAction',
        'oss_core/pm/meta/datalifetime/views/DataLifeTimePopWin',
        'oss_core/pm/util/views/Util',
        'oss_core/pm/adhocdesigner/views/AdhocUtil',
        'css!oss_core/pm/util/css/ad-component.css',
        'css!oss_core/pm/util/css/ad-block.css',
        'css!oss_core/pm/meta/datalifetime/assets/datalifetime.css'
    ],
    function(mainTpl, adhocAction, action, dataLifeTimePopWin, pmUtil, adhocUtil) {
    return portal.BaseView.extend({
        dataLifeTimeTemplate: fish.compile(mainTpl),
        i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon),
        events: {
            'click #dlt-add-btn': 'addParam',
            'click .dlt-edit-btn': 'editParam',
            'click .dlt-delete-btn': 'deleteParam'
        },

        initialize: function (opt) {
            this.dataTypeMap = new adhocUtil.HashMap();
            this.granuMap = new adhocUtil.HashMap();
            this.dataTypeList = [];
            this.granuList = [];
            this.gridDataList = [];
        },

        render: function () {
            this.$el.html(this.dataLifeTimeTemplate(this.i18nData));
            return this;
        },

        afterRender: function () {
            var self = this;
            action.loadStaticParams({}, function (ret) {
                if (ret) {
                    if (ret.dataTypeList) {
                        fish.forEach(ret.dataTypeList, function (dataType) {
                            self.dataTypeMap.put(dataType.PARA_VALUE, dataType.PARA_NAME);
                            self.dataTypeList[self.dataTypeList.length] = {
                                value: dataType.PARA_VALUE,
                                name: dataType.PARA_NAME
                            }
                        })
                    }
                    if (ret.granuList) {
                        fish.forEach(ret.granuList, function (granu) {
                            self.granuMap.put(granu.PARA_VALUE, granu.PARA_NAME);
                            self.granuList[self.granuList.length] = {
                                value: granu.PARA_VALUE,
                                name: granu.PARA_NAME
                            }
                        })
                    }
                }
                self.loadGrid();
            });
        },

        loadGrid: function () {
            var self = this;
            self.gridDataList = [];
            action.loadGridData({}, function (ret) {
                if (ret && ret.dataList && ret.dataList.length > 0) {
                    fish.forEach(ret.dataList, function (data) {
                        data.DATA_TYPE_NAME = self.dataTypeMap.get(data.DATA_TYPE);
                        data.GRANU_NAME = self.granuMap.get(data.GRANU);
                        self.gridDataList[self.gridDataList.length] = data;
                    });
                }
                self.initGridCfg();
            });
        },

        initGridCfg: function () {
            var self = this;
            var opt = {
                colModel: [{
                    name: 'id',
                    label: '',
                    key:true,
                    hidden: true
                }, {
                    name: 'DATA_TYPE_NAME',
                    label: 'Data Type',
                    sortable: false,
                    width: 100
                }, {
                    name: 'GRANU_NAME',
                    label: 'Granularity',
                    sortable: false,
                    width: 100
                }, {
                    name: 'LIFE_TIME',
                    label: 'Life Time (Day)',
                    sortable: false,
                    width: 100
                }, {
                    name: 'COMMENTS',
                    label: 'Comments',
                    sortable: false,
                    width: 100
                },
                    {
                        name: 'action',
                        label: '',
                        width: 30,
                        formatter: 'actions',
                        formatoptions: {
                            editbutton: false, //默认开启编辑功能
                            delbutton: false,  //默认开启删除功能
                            inlineButtonAdd: [{ //可以给actions类型添加多个icon图标,事件自行控制
                                id: "jEditButton", //每个图标的id规则为id+"_"+rowid
                                className: "dlt-edit-btn",//每个图标的class
                                icon: "fa fa-pencil-square-o"
                            }, {
                                id: "jDeleteButton",
                                className: "dlt-delete-btn",
                                icon: "fa fa-trash-o"
                            }]
                        }
                    }],
                pager: true
            };
            this.$("#dlt-param-grid").empty();
            this.$el.find("#dlt-param-grid").grid(opt);
            this.$("#dlt-param-grid").jqGrid("reloadData",this.gridDataList);
            this.$("#dlt-add-btn").removeAttr("disabled");
        },

        vdimItemClick: function(e) {
            var self = this;
            self.clearInput();
            var vdim_code = e.currentTarget.id.substring(10);
            this.showVdimDetail(vdim_code);
        },

        addParam: function () {
            var self = this;
            var sData = {
                act: 'N',
                dataTypeList: self.dataTypeList,
                granuList: self.granuList,
                gridDataList: self.gridDataList
            };
            var dialog = new dataLifeTimePopWin(sData);
            var content = dialog.render().$el;
            var option = {
                content: content,
                width: 350,
                height: 410
            };
            this.popUpView = fish.popup(option);
            dialog.contentReady();
            this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                data.DATA_TYPE_NAME = self.dataTypeMap.get(data.DATA_TYPE);
                data.GRANU_NAME = self.granuMap.get(data.GRANU);
                self.gridDataList[self.gridDataList.length] = data;
                this.$("#dlt-param-grid").jqGrid("reloadData",this.gridDataList);
                fish.toast('info', "Add Success");
                this.popUpView.close();
            }));
            this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                this.popUpView.close();
            }));
        },

        editParam: function (e) {
            var rowData = this.$("#dlt-param-grid").jqGrid("getSelection");
            var self = this;
            var sData = {
                act: 'M',
                rowData: rowData,
                dataTypeList: self.dataTypeList,
                granuList: self.granuList,
                gridDataList: self.gridDataList
            };
            var dialog = new dataLifeTimePopWin(sData);
            var content = dialog.render().$el;
            var option = {
                content: content,
                width: 350,
                height: 410
            };
            this.popUpView = fish.popup(option);
            dialog.contentReady();
            this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                data.DATA_TYPE_NAME = self.dataTypeMap.get(data.DATA_TYPE);
                data.GRANU_NAME = self.granuMap.get(data.GRANU);
                for(var i=0;i<self.gridDataList.length;i++){
                    var gridData = self.gridDataList[i];
                    if(gridData.DATA_TYPE == data.DATA_TYPE_OLD && gridData.GRANU == data.GRANU_OLD){
                        self.gridDataList[i] = data;
                        break;
                    }
                }
                this.$("#dlt-param-grid").jqGrid("reloadData",this.gridDataList);
                fish.toast('info', "Edit Success");
                this.popUpView.close();
            }));
            this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                this.popUpView.close();
            }));
        },

        deleteParam: function () {
            var self = this;
            fish.confirm('Are you sure to delete this item').result.then(function() {
                var rowData = self.$("#dlt-param-grid").jqGrid("getSelection");
                action.deleteDataLifeTime(rowData, function(ret){
                    for(var i=0;i<self.gridDataList.length;i++){
                        var gridData = self.gridDataList[i];
                        if(gridData.DATA_TYPE == rowData.DATA_TYPE && gridData.GRANU == rowData.GRANU){
                            self.gridDataList.splice(i, 1);
                            break;
                        }
                    }
                    self.$("#dlt-param-grid").jqGrid("reloadData",self.gridDataList);
                    fish.toast('info', "Delete Success");
                });
            });
        },

        resize: function () {
            var height = this.$el.parents(".ui-tabs-panel").height() - 75;
            this.$('#dlt-param-grid').jqGrid("setGridHeight", height);
        }

    })
});