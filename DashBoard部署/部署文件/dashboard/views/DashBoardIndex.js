/**
 * 指标筛选弹出窗
 */
define([
    "oss_core/pm/dashboard/actions/DashBoardAction",
    "oss_core/pm/dashboard/views/DashBoardDetail",
    "oss_core/pm/dashboard/js/html2canvas",
    "oss_core/pm/dashboard/js/Dcharts",
    "oss_core/pm/dashboard/js/echarts-all-3",
    "i18n!oss_core/pm/dashboard/i18n/SDesinger",
    "text!oss_core/pm/dashboard/templates/DashBoardIndex.html",
    'css!oss_core/pm/util/css/ad-component.css',
    'css!oss_core/pm/util/css/ad-block.css',
    'css!oss_core/pm/dashboard/assets/bi-common.css',
    'css!oss_core/pm/dashboard/assets/adhoc.css'
], function(action, DetailView, html2canvas, Dcharts, echarts, i18nData, tpl) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
        resource: fish.extend({}, i18nData),
        initialize: function(options) {
            this.parentView = options.parentView;
            this.params = options.params;
            this.currTreeNode = null;
        },
        events: {
            'click #ad-addDashboard-btn':"addDasdhBoard"
        },

        addDasdhBoard:function() {
          var zTree =this.$el.find("#dashboardTree")
       	  var selNode = zTree.tree("getSelectedNodes")[0];
          if(selNode){

           this.parentView.edit({
               id:0,
               classNo:selNode.id
           });
          }
        },

        render: function() {
            this.$el.html(this.template(this.resource));
            return this;
        },

        afterRender: function() {
            this.initTopicTabs();
            this.initTopicTree();
            this.resize();
            return this;
        },

        initTopicTree: function() {
            var self = this;
            var userId = portal.appGlobal.get("userId")
            action.queryDashBoardClassByUserID(userId, function(data) {
                var result = data.result;
                var catalogs = fish.map(result.datas, function(catalog) {
                     var openFlag=false;

                    return {
                        "id": catalog.classNo,
                        "name": catalog.className,
                        "CLASS_TYPE": "02",
                        "open": openFlag,
                        "nodeType": 0,
                        "isParent": true,
                        "children": []
                    }
                });

                var datas = [
                    {
                        "id": -1,
                        "name": "Topic Catalog",
                        "CLASS_TYPE": "",
                        "open": true,
                        "nodeType": -1,
                        "children": [
                            {
                                "id": -2,
                                "name": "My favorite",
                                "CLASS_TYPE": "00",
                                "open": false,
                                "iconSkin": "pIcon02",
                                "nodeType": 0,
                                "children": [],
                                "isParent": true
                            }, {
                                "id": -3,
                                "name": "Recent browse",
                                "CLASS_TYPE": "01",
                                "open": false,
                                "nodeType": 0,
                                "children": [],
                                "isParent": true
                            }
                        ]
                    }
                ];
                datas[0].children=datas[0].children.concat(catalogs)
                console.log(datas);


                self.treeSetting = {
                    "expandAll": true,
                    "view": {
                        addHoverDom: function(treenode) {
                            self.addHoverDom(treenode)
                        },
                        removeHoverDom: function(treenode) {
                            self.removeHoverDom(treenode)
                        },
                        "selectedMulti": false
                    },
                    "edit": {
                        "enable": true,
                        "removeTitle": "removeTitle",
                        "renameTitle": "renameTitle",
                        showRenameBtn: self.showRenameBtn, // 是否显示编辑
                        "showRemoveBtn": self.showRemoveBtn, //是否显示删除
                        "editNameSelectAll": true,
                        "drag": false
                    },
                    "data": {
                        "simpleData": {
                            "enable": true
                        }
                    },
                    "callback": {
                        onClick: function(event, treeNode) {
                            self.treeOnClick(event, treeNode)
                        }, //树的点击事件
                        beforeRemove: function(event, treeNode) {
                            return self.beforeRemove(event, treeNode)
                        },
                        onRename: function(event, treeNode, isCancel) {
                            return self.onRename(event, treeNode, isCancel)
                        },
                        beforeExpand: function(e, treeNode) {
                            self.showNodes(treeNode)
                        }
                    },
                    "fNodes": datas
                }

                self.$el.find("#dashboardTree").tree(self.treeSetting);
                if(self.params.classNo){

                    var treeInstance = self.$el.find("#dashboardTree").tree("instance");
                    var node = treeInstance.getNodesByFilter(function(node) {
                        return node.level == 1 && node.id==self.params.classNo
                    }, true);
                    // console.log(nodes);
                    // treeInstance.selectNode(nodes[2]);
                    treeInstance.expandNode(node, true, false, false,true);
                }
            })},

        showNodes : function(treeNode) {
            var self =this;
          if (treeNode.id=="-2" ||  treeNode.id=="-3") return
          if(!treeNode.children || treeNode.children.length == 0 ){

              var userId = portal.appGlobal.get("userId");
              var catalogId =treeNode.id;
              action.queryDashBoarListByClassId(userId,catalogId,function(data){
                   var datas  = data.result.datas;
                   var topics=fish.map(datas,function(data) {
                       return {
                            "id": data.topicNo,
                            "name":data.topicName,
                            "classNo":data.classNo,
                            "CLASS_TYPE": "00",
                            "nodeType": 1,
                            "iconSkin": "ico_ind"
                       }
                   })
                  self.$el.find("#dashboardTree").tree("addNodes", treeNode, topics, true);

                  if(self.params.topicId){

                      var treeInstance = self.$el.find("#dashboardTree").tree("instance");
                      var node = treeInstance.getNodesByFilter(function(node) {
                          return node.level == 2 && node.id==self.params.topicId
                      }, true);
                      treeInstance.selectNode(node);
                      self.treeOnClickFunc(node)
                     // treeInstance.expandNode(node, true, false, false,true);
                  }
              })
          }
        },

        treeOnClick: function(event, treeNode) {
            this.treeOnClickFunc(treeNode);
            this.currTreeNode = treeNode;
        },
        //树点击事件
        treeOnClickFunc: function(treeNode) {
            this.CLASS_TYPE = treeNode.CLASS_TYPE;
            this.CLASS_NO = treeNode.id;
            this.nodeType = treeNode.nodeType;
            // 当选中普通目录时 新建按钮可用
            if (this.CLASS_TYPE != '00' && this.CLASS_TYPE != '01' && this.nodeType != -1) {
                this.$('#ad-addDashboard-btn').removeAttr("disabled");
            } else {
                this.$('#ad-addDashboard-btn').attr('disabled', true);
            }
            if (this.nodeType == 1) {
               this.previewDashBoard(treeNode.id, treeNode.name,treeNode);
            } else {
                 this.$("#ad-dashboard-tabs").tabs("remove", 1);
            }
        },
        previewDashBoard: function(id, name,treeNode) {
            var self  =this;
            action.queryDashBoardById(id,function(data){
                var topicJson= data.result.topicJson;
                console.log(topicJson);
                self.$("#ad-dashboard-tabs").tabs("remove", 1);
                self.$("#ad-dashboard-tabs").tabs("add", {
                    id: id,
                    active: true
                });
                self.$("[href=#" + id + "]").html("DashBoard");
                self.$("#" + id).addClass("DashBoardPerviewTabs")
                self.$("#" + id).height(self.leftTreeHeight + 1);
                if (self.detailView) {
                    self.detailView.remove();
                    $("#" + id).empty();
                }
                //加载详情
                self.detailView = new DetailView({
                    'el': $("#" + id),
                    'parentView': self,
                    model: {
                        'id': id,
                        'name': name,
                        'treeNode':treeNode,
                        'json':topicJson,
                        'h':self.leftTreeHeight,
                    }
                }).render();
            })


        },
        beforeRemove: function(event, treeNode) {
            var zTree = this.$el.find("#dashboardTree");
            zTree.tree("selectNode", treeNode);
            var catalogId = treeNode.id;
            // 验证是否包含主题
            var isExist = treeNode.children.length > 0;
            if (isExist) {
                fish.toast('info', 'There is a topic in this catalog that cannot be deleted');
            } else {
                fish.confirm('Are you sure you want to delete the catalog？').result.then(this.wrap(function() {
                    this.deleteCatalogFunc(zTree, treeNode);
                }));
            }
            return false;

        },
        deleteCatalogFunc: function(zTree, treeNode) {
            action.delDashBoardClassByID(treeNode.id,function(){
                zTree.tree("removeNode", treeNode);
            })

        },
        addHoverDom: function(treeNode) {

            if (this.$("#" + treeNode.tId + "_add").length > 0 || this.$("#" + treeNode.tId + "_cfg").length > 0) {
                return;
            }
            if (treeNode.nodeType == -1) {
                var sObj = this.$el.find("#" + treeNode.tId + "_span");
                var addStr = "<span class='button add' id='" + treeNode.tId + "_add' title='新建目录' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                // 绑定事件message: that.res.SA_NAME_C
                var btn = this.$el.find("#" + treeNode.tId + "_add");
                if (btn) {
                    btn.bind("click", function() {
                        var zhTree = $("#dashboardTree");
                        //var treeInstance = $("#dashboardTree").tree("instance");

                        var zhNode = zhTree.tree("getNodeByTId", treeNode.tId);
                        var newNode = {
                            id: -999,
                            pId: treeNode.id,
                            name: "",
                            CLASS_TYPE: '02',
                            children: []
                        };
                        zhTree.tree("addNodes", zhNode, newNode);

                        newNode = $("#dashboardTree").tree("getNodeByParam", "id", -999, zhNode);
                        zhTree.tree("editName", newNode);
                    });
                }
            }

        },
        onRename: function(event, treeNode, isCancel) {
            // 表示新增
            if (treeNode.id === -999) {
                // 调用服务新增
                this.addCatalogFunc(treeNode);
            } else {
                // 编辑目录名称
                this.modCatalogFunc(treeNode);
            }
        },
        addCatalogFunc: function(newNode) {
            var self = this;
            // var zTree = $.fn.zTree.getZTreeObj("selfAnalysisTree");
            var zTree = self.$el.find("#dashboardTree");
            var treeInstance = zTree.tree("instance");
            var catalogName = newNode.name;

            var rootNode = treeInstance.getNodesByFilter(function(node) {
                return node.level == 0
            }, true);

            // 验证非空
            if (!catalogName) {
                fish.toast('info', '目录名称不能为空');
                treeInstance.removeNode(newNode);
                return false;
            }
            // 验证是否已存在
            var isExist = false;
            fish.forEach(rootNode.children, function(catalog) {
                if (catalog.name == catalogName && catalog.id != -999) {
                    fish.toast('info', '该目录名称已存在');
                    treeInstance.removeNode(newNode);
                    isExist = true;
                }
            });
            //
            if (!isExist) {
                var userId = portal.appGlobal.get("userId")
                action.addDashBoardClass(catalogName, userId, function(data) {
                    var result = data.result;
                    var catalogId = result.id
                    if (catalogId) {
                        newNode.id = catalogId;
                        newNode.CLASS_TYPE = '02';
                        newNode.open = true;
                        newNode.nodeType = 0;
                        zTree.tree("updateNode", newNode);
                        fish.toast('success', '目录添加成功');
                    }

                });
            }
        },

        modCatalogFunc: function(treeNode) {
            action.changeDashBoardClassNameByID(treeNode.name,treeNode.id,function(){

            })
        },
        removeHoverDom: function(treeNode) {
            this.$el.find("#" + treeNode.tId + "_add").unbind().remove();
            this.$el.find("#" + treeNode.tId + "_cfg").unbind().remove();
        },

        showRemoveBtn: function(treeNode) {
            var catalogType = null;
            if (treeNode.id == -2 || treeNode.id == -3 || treeNode.nodeType == 1 || treeNode.nodeType == -1) {
                return false;
            }
            return true;
        },
        showRenameBtn: function(treeNode) {
            var catalogType = null;
            if (treeNode.CLASS_TYPE == '02') {
                return true;
            }
            return false;
        },

        initTopicTabs: function() {
            var self = this;
            this.$("#ad-dashboard-tabs").tabs({
                canClose: true,
                paging: {
                    "selectOnAdd": true
                },
                remove: function(e, ui) {},
                activate: function(e, ui) {}
            });
        },

        resize: function() {
            this.uiTabHeight = this.$el.parents("body").outerHeight();
            this.leftTreeHeight = this.uiTabHeight -135; //95
            this.$el.find("#dashboardTree").css({
                'height': + this.leftTreeHeight + 'px'
            });

        }

    });
});
