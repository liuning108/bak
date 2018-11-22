define([
  "oss_core/inms/pm/resMgr/actions/action"
], function(action) {
  return {
    qryClassinfo: function(data, type, fun) {
      console.log('loadKpiClass', data, type);
      var param = {};
      //PIM
      if (type == "1") {
        param.kpiClassList = [{
            CLASS_ID: "PIM",
            CLASS_NAME: "PIM"
          },
          {
            CLASS_ID: "VE",
            CLASS_NAME: "厂家"
          }
        ];
        var kpiClassTagList = [];
        var kpiClassTagList = fish.map(data.pim, function(d, i) {
          return {
            CLASS_ID: "PIM",
            TAG_ID: d.id,
            TAG_VALUE: d.name
          }
        })
        var flag = kpiClassTagList.length > 4;
        kpiClassTagList = kpiClassTagList.splice(0, 4);
        if (flag) {
          kpiClassTagList.push({
            CLASS_ID: "PIM",
            TAG_ID: "moremoremorepim",
            TAG_VALUE: "更多>>"
          })
        }
        var vendors = fish.map(data.vendor, function(d) {
          return {
            CLASS_ID: "VE",
            TAG_ID: d.id,
            TAG_VALUE: d.name
          }
        })
        param.kpiClassTagList = kpiClassTagList.concat(vendors);
        console.log("param", param)
      }
      //VIM
      if (type == "2") {
        param.kpiClassList = [{
            CLASS_ID: "VIM",
            CLASS_NAME: "VIM"
          },

        ];
        param.kpiClassTagList = fish.map(data.vim, function(d) {
          return {
            CLASS_ID: "VIM",
            TAG_ID: d.id,
            TAG_VALUE: d.name
          }
        })
        var flag = param.kpiClassTagList.length > 4;
        param.kpiClassTagList = param.kpiClassTagList.splice(0, 4);
        if (flag) {
          param.kpiClassTagList.push({
            CLASS_ID: "VIM",
            TAG_ID: "moremoremorevim",
            TAG_VALUE: "更多>>"
          })
        }
      }
      //VNF
      if (type == "3") {
        param.kpiClassList = [{
            CLASS_ID: "AREA",
            CLASS_NAME: "区域"
          },
          {
            CLASS_ID: "VE",
            CLASS_NAME: "厂家"
          },
        ];
        var kpiClassTagList = fish.map(data.vendor, function(d) {
          return {
            CLASS_ID: "VE",
            TAG_ID: d.id,
            TAG_VALUE: d.name
          }
        })
        var citys = fish.map(data.province, function(d) {
          return {
            CLASS_ID: "AREA",
            TAG_ID: d.id,
            TAG_VALUE: d.name
          }
        })
        param.kpiClassTagList = kpiClassTagList.concat(citys);
        console.log("param", param)

      }


      fun(param);

    },
    loadInitData: function(fun) {
      var listfun = function(d) {
        return "'" + d + "'";
      }
      action.getInfo().then(function(data) {
        var d = data;
        var pimarray = fish.map(d.pim, function(d) {
          return listfun(d.id);
        })
        d.pims = pimarray.join(',');
        var vendorarray = fish.map(d.vendor, function(d) {
          return listfun(d.id);
        })
        d.vendors = vendorarray.join(',');
        var vimarray = fish.map(d.vim, function(d) {
          return listfun(d.id);
        })
        d.vims = vimarray.join(',');
        var provincearray = fish.map(d.province, function(d) {
          return listfun(d.id);
        })
        d.ps = provincearray.join(',');
        var cityarray = fish.map(d.city, function(d) {
          return listfun(d.id);
        })
        d.citys = cityarray.join(',');
        console.log('loadInitData', d);
        fun(d);
      })
    },
    enterDashBoard: function(tid, self, tableH, rmUID) {
      action.qurTmpInfo(tid).then(function(data) {
        var model_code = data.result[0].MCODE;
        require([
          'oss_core/inms/pm/zdashboard/views/DashBoard'
        ], function(dashBoard) {
          self.dashBoardView = new dashBoard({
            el: self.$el.find('.res-tpl-graph-container'),
            'id': tid,
            'code': model_code,
            'rmUID': rmUID,
            tableH: tableH,
            callback: function() {
              self.$el.find('.res-tpl-list-container').show(500);
              self.$el.find('.res-tpl-graph-container').hide();
              self.dashBoardView = null;
            }
          });
          self.$el.find('.res-tpl-list-container').slideUp(500);
          self.$el.find('.res-tpl-graph-container').show();
          self.dashBoardView.render();
        });
        console.log(data)
      })
    },
    hidColByType: function(type, $grid) {
      //PIM
      if (type == "1") {
        $grid.jqGrid("hideCol", ['VIM', 'CITY']);
        $grid.jqGrid("showCol", ['PIM',"VENDOR"]);
      }
      //VIM
      if (type == "2") {
        $grid.jqGrid("hideCol", ['PIM', 'CITY']);
        $grid.jqGrid("showCol", ['VIM',"VENDOR"]);
      }

      //VNF
      if (type == "3") {
        $grid.jqGrid("hideCol", ['PIM', 'VIM']);
        $grid.jqGrid("showCol", ['CITY',"VENDOR"]);
      }

      if (type == "4") {
        $grid.jqGrid("hideCol", ['VIM', 'PIM',"VENDOR","CITY"]);
      }
    },
    loadResData: function($grid, param, initData) {
      action.qurRes(param, initData).then(function(data) {
        $grid.jqGrid("reloadData", data.result);
      })
    },
    loadTree: function($tree, data) {
      console.log('loadTree', data);
      var vnType = fish.map(data.vnf_type, function(d) {
        return "'" + d + "'"
      })
      var strVnType = vnType.join(',');
      action.loadTree(strVnType).then(function(data) {
        var result = data.result
        if (!result) return;
        console.log(result)
        var treeData = result;
        var setSelection = result[0].children[0]
        console.log('loadTree', data);
        $tree.jqGrid("reloadData", treeData);
        $tree.jqGrid("setSelection", setSelection);
      })

    }
  }
})
