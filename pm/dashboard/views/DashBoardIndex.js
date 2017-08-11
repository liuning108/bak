/**
 * 指标筛选弹出窗
 */
define([
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
], function(DetailView, html2canvas, Dcharts, echarts, i18nData, tpl) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    resource: fish.extend({}, i18nData),
    initialize: function(options) {
      this.parentView = options.parentView;
      this.params = options.params;
      this.currTreeNode = null;
    },
    events: {},

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
              "open": true,
              "iconSkin": "pIcon02",
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170728-TP10184966",
                  "name": "自测专用",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170713-TP10013691",
                  "name": "Radio Network Accessibility analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000002",
                  "name": "2G小区无线网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000003",
                  "name": "TD无线网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": -3,
              "name": "Recent browse",
              "CLASS_TYPE": "01",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170728-TP10184966",
                  "name": "自测专用",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170713-TP10013691",
                  "name": "Radio Network Accessibility analysis",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170727-TP10177093",
                  "name": "ZTE 2G指标核对",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000002",
                  "name": "2G小区无线网络规模分析",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170713-TP10013645",
                  "name": "Radio Network drop call analysis",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170801-TP10205423",
                  "name": "ZTE WCDMA NodeB统计表",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012494",
                  "name": "Speech Traffic Trend analysis",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170803-TP10216216",
                  "name": "test",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000003",
                  "name": "TD无线网络规模分析",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170607-TP10004371",
                  "name": "TCH掉话分析",
                  "CLASS_TYPE": "01",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170710-TC10011727",
              "name": "01 Traffic analysis",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170712-TP10013494",
                  "name": "Traffic Profile analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012576",
                  "name": "Speech Traffic on region analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170712-TP10013190",
                  "name": "Data Traffic Trend analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170712-TP10013495",
                  "name": "Traffic Contribution analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170712-TP10013201",
                  "name": "TOP N Data Traffic Carriers analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170712-TP10013397",
                  "name": "Data traffic Contribution analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012632",
                  "name": "TOP N Voice Traffic Carriers analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012701",
                  "name": "Speech traffic Contribution analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012494",
                  "name": "Speech Traffic Trend analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170627-TC10009011",
              "name": "02 Radio Network quality",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170712-TP10013195",
                  "name": "Libyana 2G network performance daily report",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170713-TP10013691",
                  "name": "Radio Network Accessibility analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170713-TP10013645",
                  "name": "Radio Network drop call analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170710-TC10011728",
              "name": "03 Core Network quality",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170714-TP10053490",
                  "name": "CS:Authentication & Ciphering analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170714-TP10055664",
                  "name": "CS:Handover analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170719-TP10104249",
                  "name": "PS: Attach analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170719-TP10104250",
                  "name": "PS： PDP context Activation analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170719-TP10104262",
                  "name": "PS： RAU analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170719-TP10104263",
                  "name": "PS:Paging analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170714-TP10051326",
                  "name": "CS:Location update analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170714-TP10055637",
                  "name": "CS:Paging analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170714-TC10066444",
              "name": "04 Service quality",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170714-TP10055670",
                  "name": "SMS analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170714-TP10055672",
                  "name": "Voice service Accessibility analysis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170714-TP10051327",
                  "name": "Incoming&Outgoing calls ananlyis",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170713-TC10013639",
              "name": "05 ZTE3G",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170713-TP10013644",
                  "name": "ZTE WCDMA CELL01 Daily Report",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170407-TC10000068",
              "name": "Network Quality",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170525-TP10002703",
                  "name": "网络覆盖性能分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170525-TP10002704",
                  "name": "无线掉话性能分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170615-TP10005512",
                  "name": "寻呼分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170804-TP10225867",
                  "name": "Demo",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170607-TP10004371",
                  "name": "TCH掉话分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170727-TC10177092",
              "name": "指标校对",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170731-TP10201568",
                  "name": "ERICSSON MSC",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170727-TP10177093",
                  "name": "ZTE 2G指标核对",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170728-TP10193768",
                  "name": "ERICSSON WCDMA",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170728-TP10193767",
                  "name": "ERICSSON GSM",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170803-TP10216215",
                  "name": "Day & Nigth Traffic",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170803-TP10216216",
                  "name": "test",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170801-TP10205423",
                  "name": "ZTE WCDMA NodeB统计表",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170801-TP10205422",
                  "name": "ZTE 3G无线接口包V3",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170801-TP10205424",
                  "name": "ZTE WCDMA RNC统计表",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170801-TP10205425",
                  "name": "ZTE WCDMA CELL001统计表",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }, {
              "id": "PMS-20170407-TC10000067",
              "name": "网络规模",
              "CLASS_TYPE": "02",
              "open": false,
              "nodeType": 0,
              "children": [
                {
                  "id": "PMS-20170407-TP10000003",
                  "name": "TD无线网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000004",
                  "name": "GPRS网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170711-TP10012577",
                  "name": "ZTE GSM (TEST)",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000001",
                  "name": "核心网网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170407-TP10000002",
                  "name": "2G小区无线网络规模分析",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }, {
                  "id": "PMS-20170728-TP10184966",
                  "name": "自测专用",
                  "CLASS_TYPE": "00",
                  "nodeType": 1,
                  "iconSkin": "ico_ind"
                }
              ]
            }
          ]
        }
      ];
      var self = this;
      this.treeSetting = {
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
          showRenameBtn: this.showRenameBtn, // 是否显示编辑
          "showRemoveBtn": this.showRemoveBtn, //是否显示删除
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
          }
        },
        "fNodes": datas
      }

      this.$el.find("#dashboardTree").tree(this.treeSetting);

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
        this.$('#ad-addtopic-btn').removeAttr("disabled");
      } else {
        this.$('#ad-addtopic-btn').attr('disabled', true);
      }
      if (this.nodeType == 1) {
        this.previewDashBoard(treeNode.id, treeNode.name);
      } else {
        this.$("#ad-dashboard-tabs").tabs("remove", this.currPopoverTopicNo);
        this.$('#').hide();
      }
    },
    previewDashBoard: function(id, name) {
      this.$("#ad-dashboard-tabs").tabs("remove", 1);
      this.$("#ad-dashboard-tabs").tabs("add", {
        id: id,
        active: true
      });
      this.$("[href=#" + id + "]").html("DeashBoard");
      this.$("#" + id).height(this.leftTreeHeight + 1);
      if (this.detailView) {
        this.detailView.remove();
        $("#" + id).empty();
      }
     //加载详情
      this.detailView = new DetailView({
        'el': $("#" + id),
        'parentView': self,
         model:{
            'id' : id,
            'name':name
         }
      }).render();

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
      zTree.tree("removeNode", treeNode);
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
        this.addCatalogFunc(treeNode, true);
      } else {
        // 编辑目录名称
        this.modCatalogFunc(treeNode);
      }
    },
    addCatalogFunc: function() {
      alert("addCatalogFunc")
    },

    modCatalogFunc: function() {
      alert("modCatalogFunc")
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
      this.uiTabHeight = this.$el.parents(".tabs_nav").outerHeight();
      this.leftTreeHeight = this.uiTabHeight - 83; //95
      this.$el.find("#dashboardTree").css({
        'height': + this.leftTreeHeight + 'px'
      });

    }

  });
});
