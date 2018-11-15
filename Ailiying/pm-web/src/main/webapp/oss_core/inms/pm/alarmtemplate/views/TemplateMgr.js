/**
 *
 */
define([
	'text!oss_core/inms/pm/alarmtemplate/templates/TemplateMgr.html',
	'i18n!oss_core/inms/pm/alarmtemplate/i18n/templatemgr',
    'oss_core/inms/pm/alarmtemplate/actions/TemplateMgrAction',
	'oss_core/inms/pm/util/views/Util',
    'oss_core/inms/pm/alarmtemplate/views/TemplateUtil',
    'oss_core/inms/pm/graphs/components/views/GraphsListView',
    'css!oss_core/inms/pm/graphs/css/kdo.css',
    'css!oss_core/inms/pm/graphs/css/graphs.css',
    'css!oss_core/inms/pm/alarmtemplate/assets/css/templatemgr.css'
    ],
    function(templateMgrTpl, i18nDim, action, pmUtil, templateUtil, GraphsListView){
    return portal.BaseView.extend({

        tagName: "div",
		className: "tabs__content",
		template: fish.compile(templateMgrTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nDim),

        events: {
			"click .js-template-add": 'addTemplate',
			"click .js-adapter-reset": 'resetTpl',
            "click #tplmgr-exit-search-btn": 'exitSearchMode',
            "keypress .js-tpl-search-input": 'searchKeyPress'
		},

		initialize: function(options) {
			this.bpId = options.bpId;
            this.emsDataList = [];
			this.colModel = [{
                name: 'TEMPLATE_ID',
                label: '',
                hidden: true,
                key: true
            }, {
				name: 'TEMPLATE_NAME',
				label: '模板名称',
				width: "25%",
				sortable: true,
				search: true
			}, {
				name: "NE_TYPE_NAME",
				label: '设备类型',
				width: "25%",
				sortable: true
			}, {
                name: 'TEMPLATE_DESC',
                label: '描述',
                width: "25%"
            }, {
				name: "ACTION",
				label: '',
				width: "25%",
                formatter: function (cellval, opts, rwdat, _act) {
                    var template_id = rwdat.TEMPLATE_ID;
                    var htmlText = '<div class="groupMoreOp pull-right">' +
                        '<div class="btn-group">' +
                        '<button type="button" title="子模板" class="btn tplmgr-link-btn tplmgr-grid-subtpl" name="' + template_id + '"><i class="fa fa-plus"></i></button>' +
                        '<button type="button" title="综合图形" class="btn tplmgr-link-btn tplmgr-grid-screen" name="' + template_id + '"><i class="fa fa-desktop"></i></button>' +
                        '<button type="button" style="display:none" title="导入" class="btn tplmgr-link-btn" name="' + template_id + '"><i class="fa fa-cloud-upload"></i></button>' +
                        '<button type="button" title="图形" class="btn tplmgr-link-btn tplmgr-grid-graph" name="' + template_id + '"><i class="fa fa-line-chart"></i></button>' +
                        '<button type="button" title="编辑" class="btn tplmgr-link-btn tplmgr-grid-edit" name="' + template_id + '"><i class="fa fa-pencil"></i></button>' +
                        '<button type="button" title="删除" class="btn tplmgr-link-btn tplmgr-grid-del" name="' + template_id + '"><i class="fa fa-trash"></i></button>' +
                        '</div></div>';
                    return htmlText;
                }
            }];
            this.subGridColModel = [{
                name: 'TEMPLATE_ID',
                label: '',
                hidden: true,
                key: true
            }, {
                name: 'TEMPLATE_NAME',
                label: '子模板名称',
                width: "25%",
                sortable: false,
                search: true
            }, {
                name: "NE_TYPE_NAME",
                label: '设备类型',
                width: "25%",
                sortable: false
            }, {
                name: 'TEMPLATE_DESC',
                label: '描述',
                width: "25%"
            }, {
                name: "ACTION",
                label: '',
                width: "25%",
                formatter: function (cellval, opts, rwdat, _act) {
                    var template_id = rwdat.TEMPLATE_ID;
                    var htmlText = '<div class="groupMoreOp pull-right">' +
                        '<div class="btn-group">' +
                        '<button type="button" title="综合图形" class="btn tplmgr-link-btn tplmgr-subgrid-screen" name="' + template_id + '"><i class="fa fa-desktop"></i></button>' +
                        '<button type="button" style="display:none" title="导入" class="btn tplmgr-link-btn" name="' + template_id + '"><i class="fa fa-cloud-upload"></i></button>' +
                        '<button type="button" title="图形" class="btn tplmgr-link-btn tplmgr-subgrid-graph" name="' + template_id + '"><i class="fa fa-line-chart"></i></button>' +
                        '<button type="button" title="编辑" class="btn tplmgr-link-btn tplmgr-subgrid-edit" name="' + template_id + '"><i class="fa fa-pencil"></i></button>' +
                        '<button type="button" title="删除" class="btn tplmgr-link-btn tplmgr-subgrid-del" name="' + template_id + '"><i class="fa fa-trash"></i></button>' +
                        '</div></div>';
                    return htmlText;
                }
            }];
		},

		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},

		afterRender: function(){
			this.$form = this.$(".js-dim-detail-form");
			this.loadTree();
			this.loadGrid();
		},

		loadTree: function(){
            var self = this;
			var $tree = this.$(".js-catalog-tree");
			this.catTree = $tree.jqGrid({
				colModel: [{
					name: 'CAT_NAME',
					label: "",
					width: "100"
				}, {
					name: "REL_ID",
					label: "",
					width: "0",
					key: true,
					hidden:true
				}],
				expandColumn: "CAT_NAME",
				treeGrid: true,
				colHide: true,
				pagebar: false,
				onSelectRow: function(e, rowid, state) {
                    self.tmpEvent = e;
                    if(self.emsDataList.length == 0){
                        self.emsDataList = self.$(".js-catalog-tree").grid("getRowData");
                    }
					var selectRow = this.catTree.jqGrid("getRowData", rowid);
					var type = selectRow.type;
					if(type=="VER"){
						var parent = this.catTree.jqGrid("getNodeParent", selectRow);
						this.$(".js-template-add").removeAttr("disabled");
						this.EMS_CODE = parent.CAT_CODE;
                        this.EMS_TYPE_CODE = parent.parent;
                        this.EMS_TYPE_REL_ID = parent.REL_ID;
						this.getTplByEMS(e);
						this.resetTpl();
					}else{
                        this.EMS_TYPE_REL_ID = "";
                        this.templateGrid.jqGrid("reloadData", []);
                        this.$(".js-template-add").attr("disabled", "disabled");
                    }
                    self.showTplListView();
				}.bind(this)
			});
			pmUtil.loadEMSTree(this.catTree);
		},

        // 初始化表格
		loadGrid: function(){
            var self = this;
			var $grid = this.$(".js-tpllist-grid");
			this.templateGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: false,
                subGrid: true,
                subGridOptions: {
                    //第二次展开时不重新渲染,这些参数按需添加
                    reloadOnExpand: false
                    //selectOnExpand: false,
                    //selectOnCollapse: false
                },
                subGridBeforeExpand: function (e, subGridId, rowId) {
                    console.log('subGridBeforeExpand', e, subGridId, rowId);
                },
                subGridRowExpanded: function (e, subGridId, parentRowId) {
                    console.log('subGridRowExpanded', e, subGridId, parentRowId);
                    // 这里可以构建不同列模型的表格
                    var subgrid_table_id = subGridId + '_t';
                    $("#" + subGridId).html("<table class='js-tpllist-subgrid' id='" + subgrid_table_id + "'></table>");
                    self.templateSubGrid = $("#" + subgrid_table_id).grid({
                        colModel: self.subGridColModel,
                        rowNum: 20,
                        height: 'auto',
                        gridComplete: function() {
                            //删除
                            self.$el.find(".js-tpllist-subgrid").find('.tplmgr-subgrid-del').bind("click", function(e){
                                var template_id = e.currentTarget.name;
                                self.delTemplate(template_id);
                            });
                            //编辑
                            self.$el.find(".js-tpllist-subgrid").find('.tplmgr-subgrid-edit').bind("click", function(e){
                                var template_id = e.currentTarget.name;
                                var up_template_id;
                                fish.forEach(self.tplList, function(tpl){
                                    if(tpl.TEMPLATE_ID == template_id){
                                        up_template_id = tpl.UP_TEMPLATE_ID;
                                    }
                                });
                                self.showDetailModal(template_id, up_template_id);
                            });
                            //图形
                            self.$el.find(".js-tpllist-subgrid").find('.tplmgr-subgrid-graph').bind("click", function(e){
                                var template_id = e.currentTarget.name;
                                self.showGraphView(template_id);
                            });
                            //综合图形
                            self.$el.find(".js-tpllist-grid").find('.tplmgr-subgrid-screen').bind("click", function(e){
                                var template_id = e.currentTarget.name;
                                self.showScreenView(template_id);
                            });
                        }
                    });
                    var parantTpl = self.templateGrid.grid("getRowData", parentRowId);
                    var subGridDp = [];
                    fish.forEach(self.tplList, function(tpl){
                        if(tpl.UP_TEMPLATE_ID == parantTpl.TEMPLATE_ID){
                            subGridDp[subGridDp.length] = tpl;
                        }
                    });
                    self.templateSubGrid.grid('reloadData', subGridDp);
                    // 移除子表格横向滚动条
                    self.$('.slimScrollBarX').remove();
                },
                subGridRowColapsed: function (e, subGridId, rowId) {
                    console.log('subGridRowColapsed', e, subGridId, rowId);
                },
                gridComplete: function() {
                    //删除
                    self.$el.find(".js-tpllist-grid").find('.tplmgr-grid-del').bind("click", function(e){
                        var template_id = e.currentTarget.name;
                        self.delTemplate(template_id);
                    });
                    //编辑
                    self.$el.find(".js-tpllist-grid").find('.tplmgr-grid-edit').bind("click", function(e){
                        var template_id = e.currentTarget.name;
                        self.showDetailModal(template_id);
                    });
                    //子模板
                    self.$el.find(".js-tpllist-grid").find('.tplmgr-grid-subtpl').bind("click", function(e){
                        var template_id = e.currentTarget.name;
                        self.addSubTemplate(template_id);
                    });
                    //图形
                    self.$el.find(".js-tpllist-grid").find('.tplmgr-grid-graph').bind("click", function(e){
                        var template_id = e.currentTarget.name;
                        self.showGraphView(template_id);
                    });
                    //综合图形
                    self.$el.find(".js-tpllist-grid").find('.tplmgr-grid-screen').bind("click", function(e){
                        var template_id = e.currentTarget.name;
                        self.showScreenView(template_id);
                    });
                }
			});
            // 更改表头样式蓝底白字
            this.$("#js-tpl-list-grid [role='columnheader']").addClass("js-tplmgr-grid-header");
            this.$("#js-tpl-list-grid .ui-jqgrid-sortable").addClass("js-tplmgr-grid-header-inner");
		},

        showScreenView: function (template_id) {
            var self = this;
            var docH = $(document).height();
            var tableH = this.$(".js-templatemgr-panel").height() - this.$(".js-templatemgr-panel-h3").height() - 35 - 8;
            var model_code;
            fish.forEach(self.tplList, function(tpl){
                if(tpl.TEMPLATE_ID == template_id){
                    model_code = tpl.MODEL_BUSI_CODE;
                }
            });
            require([
                    'oss_core/inms/pm/zdashboard/views/DashBoard'
                ], function (dashBoard) {

                self.dashBoardView = new dashBoard({
                    el: self.$('#js-tpl-graph-container'),
                    'id': template_id,
                    'code':model_code,
                    tableH: tableH,
                    callback:function() {
                        self.showTplListView();
                        //self.dashBoardView.remove();
                        self.dashBoardView = null;
                    }
                });
                self.$('#js-tpl-list-container').slideUp(500);
                self.$('#js-tpl-graph-container').show();
                self.dashBoardView.render();
            });
        },

        showGraphView: function (template_id) {
            var self = this;
            var docH = $(document).height();
            var tableH = this.$(".js-templatemgr-panel").height() - this.$(".js-templatemgr-panel-h3").height() - 35 - 8;
            var model_code;
            fish.forEach(self.tplList, function(tpl){
                if(tpl.TEMPLATE_ID == template_id){
                    model_code = tpl.MODEL_BUSI_CODE;
                }
            })
            this.graphsListView = new GraphsListView({
                el: self.$('#js-tpl-graph-container'),
                'id': template_id,
                'code':model_code,
                tableH: tableH,
                callback:function() {
                    self.showTplListView();
                }
            });
            self.$('#js-tpl-list-container').slideUp(500);
            self.$('#js-tpl-graph-container').show();
            this.graphsListView.render();
        },

        showTplListView: function() {
            self.$('#js-tpl-list-container').show(500);
            self.$('#js-tpl-graph-container').hide();
        },

        delTemplate: function(template_id) {
            var self = this;
            fish.confirm("确定要删除此模版吗").result.then(function() {
                action.delTemplate({
                    TEMPLATE_ID: template_id
                }, function(){
                    self.getTplByEMS();
                    fish.success("删除模板成功");
                });
            });
        },

		getTplByEMS: function(e){
            var self = this;
            var param = {"EMS_TYPE_REL_ID": this.EMS_TYPE_REL_ID} ;
            action.qryTemplate(param, function(tplList) {
                if (tplList){
                    self.tplList = tplList;
                    var ne_type_list = pmUtil.paravalue("TEMPLATE_CATAGORY");
                    fish.forEach(tplList, function(tpl){
                        var ne_type = tpl.NE_TYPE;
                        fish.forEach(ne_type_list, function(neItem){
                            if(neItem[pmUtil.parakey.val] == ne_type){
                                tpl["NE_TYPE_NAME"] = neItem[pmUtil.parakey.name];
                            }
                        });
                    });
                    var templateGridDp = [];
                    fish.forEach(tplList, function(tpl){
                        if(tpl.UP_TEMPLATE_ID == ""){
                            templateGridDp[templateGridDp.length] = tpl;
                        }
                    });
                    self.templateGrid.jqGrid("reloadData", templateGridDp);
                    self.templateGrid.jqGrid('setGridParam', {showSubgridBtn: function (rowdata) {
                        var ret = false;
                        fish.forEach(self.tplList, function(tpl){
                            if(rowdata.TEMPLATE_ID == tpl.UP_TEMPLATE_ID){
                                ret = true;
                            }
                        });
                        return ret;
                    }});
                    self.templateGrid.jqGrid("reloadData");
                    if(self.searchedTplId && self.searchedTplId!=""){
                        fish.forEach(self.tplList, function(tpl){
                            if(self.searchedTplId == tpl.TEMPLATE_ID && tpl.UP_TEMPLATE_ID == ""){
                                console.log("grid");
                                self.templateGrid.jqGrid("setSelection", tpl);
                                self.searchedTplId = "";
                            }else if (self.searchedTplId == tpl.TEMPLATE_ID && tpl.UP_TEMPLATE_ID != ""){
                                console.log("subGrid");
                                fish.forEach(self.tplList, function(tpl_inner){
                                    if(tpl_inner.TEMPLATE_ID == tpl.UP_TEMPLATE_ID){
                                        var rowid = self.templateGrid.jqGrid("getRowid", tpl_inner);
                                        self.templateGrid.jqGrid('expandSubGridRow', rowid);
                                        $subGrid = self.templateGrid.jqGrid('getSubGrid', rowid);
                                        $subGrid.jqGrid("setSelection", tpl, true, e);
                                        self.searchedTplId = "";
                                    }
                                });
                            }
                        });
                    }
                }
            });
		},

		addTemplate: function(){
			if(!this.EMS_TYPE_REL_ID){
				fish.toast("info", this.i18nData.SEL_EMS_VER);
				return false;
			}
			this.showDetailModal("");
		},

        addSubTemplate: function(up_template_id){
            this.showDetailModal("", up_template_id);
        },

		showDetailModal: function(template_id, up_template_id){
            var self = this;
			var options = {
                bpId: this.bpId,
                i18nData: this.i18nData,
                pmUtil: pmUtil,
                EMS_CODE: this.EMS_CODE,
                EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID,
                EMS_TYPE_CODE: this.EMS_TYPE_CODE,
                EMS_VER_CODE: this.EMS_VER_CODE ,
                TEMPLATE_ID: template_id,
                UP_TEMPLATE_ID: up_template_id
            };
            require([
                'oss_core/inms/pm/alarmtemplate/views/TemplateDetail'
            ], function (Dialog) {
                var dialog = new Dialog(options);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 840,
                    height: 510
                };
                self.templateDetailView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okEvent', function (template_id) {
                    self.searchedTplId = template_id;
                    self.templateDetailView.close();
                    //var _event = new Event('clickEvent', {"bubbles":false, "cancelable":false});
                    self.getTplByEMS(self.tmpEvent);
                    /*if(retData){
                        if(operType=="edit"){
                            var	rowdata = this.templateGrid.jqGrid("getSelection");
                            this.templateGrid.jqGrid("setRowData",fish.extend({}, rowdata, retData));
                        }else{
                            this.templateGrid.jqGrid("addRowData", retData, 'last');
                            this.templateGrid.jqGrid("setSelection", retData);
                        }
                    }*/
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.templateDetailView.close();
                });
            });
		},

        searchKeyPress: function (e) {
            if (event.keyCode == "13") {
                this.showSearchMode();
            }
        },

        showSearchMode: function () {
            var self = this;
            var searchCont = templateUtil.trim(this.$('.js-tpl-search-input').val());
            if(searchCont == ''){
                // fish.toast('info', this.resource.ENTER_SEARCH_CONTENT);
            }else {
                action.searchTemplate({
                    SEARCH_CONTENT: searchCont
                }, function(tplList) {
                    self.$('#js-tpl-list-grid').hide();
                    self.$('#tplmgr-searchcont-container').empty();
                    self.$('#tplmgr-search-container').show();
                    //
                    self.searchTplList = tplList;
                    var ne_type_list = pmUtil.paravalue("TEMPLATE_CATAGORY");
                    fish.forEach(tplList, function(tpl){
                        var ne_type = tpl.NE_TYPE;
                        var ne_type_name;
                        fish.forEach(ne_type_list, function(neItem){
                            if(neItem[pmUtil.parakey.val] == ne_type){
                                ne_type_name = neItem[pmUtil.parakey.name];
                            }
                        });
                        var template_name = tpl.TEMPLATE_NAME;
                        var titleStr = template_name;
                        var template_id = tpl.TEMPLATE_ID;
                        // 匹配模板名称
                        var index = titleStr.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = titleStr.substring(0, index);
                            suffix = titleStr.substring(index + searchCont.length);
                            titleStr = preffix + "<span>" + titleStr.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        // 匹配设备类型名称
                        index = ne_type_name.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = ne_type_name.substring(0, index);
                            suffix = ne_type_name.substring(index + searchCont.length);
                            ne_type_name = preffix + "<span>" + ne_type_name.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        // 匹配备注
                        var template_desc = tpl.TEMPLATE_DESC;
                        index = template_desc.toLowerCase().indexOf(searchCont.toLowerCase());
                        if(index!=-1) {
                            preffix = template_desc.substring(0, index);
                            suffix = template_desc.substring(index + searchCont.length);
                            template_desc = preffix + "<span>" + template_desc.substring(index, index + searchCont.length) + "</span>" + suffix;
                        }
                        //
                        var htmlText = '<div>'
                            + '<img src="static/oss_core/inms/pm/alarmtemplate/assets/images/'+tpl.NE_ICON+'">'
                            + '<a href="#" id="tplmgr-searchlink-' + template_id + '" name="tplmgr-searchlink" title="' + template_name + '" class="h5"> ' + titleStr + '</a>'
                            + '<p>设备类型：' + ne_type_name
                            + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                            + '备注：' + template_desc + ' </p>'
                            + '</div>';
                        self.$('#tplmgr-searchcont-container').append(htmlText);
                    });
                    //
                    self.$('[name="tplmgr-searchlink"]').on("click", function(e){
                        self.templateClick(e.currentTarget.id.substring(18));
                    });
                });
            }
        },

        templateClick: function (template_id) {
            var self = this;
            self.exitSearchMode();
            fish.forEach(self.searchTplList, function(tpl){
                if(tpl.TEMPLATE_ID == template_id){
                    for(var i=0;i<self.emsDataList.length;i++){
                        if(self.emsDataList[i].parent == tpl.EMS_TYPE_REL_ID){
                            self.searchedTplId = template_id;
                            self.catTree.jqGrid("setSelection", self.emsDataList[i]);
                        }
                    }
                }
            });
        },

        exitSearchMode: function () {
            this.$('#js-tpl-list-grid').show();
            this.$('#tplmgr-search-container').hide();
            this.$('.js-tpl-search-input').val('');
        },

		resetTpl: function(){
			this.$(".js-tpl-search-input").val('');
		},

        resize: function(delta){
            var baseHeight = this.$(".js-templatemgr-panel").height() - this.$(".js-templatemgr-panel-h3").height();
            this.catTree.jqGrid("setGridHeight", baseHeight - 35);
            this.catTree.jqGrid("setGridWidth", 241);
            this.templateGrid.jqGrid("setGridHeight", baseHeight - 54);
            this.$("#tplmgr-search-container").height(baseHeight - 46);
        }

	});
});
