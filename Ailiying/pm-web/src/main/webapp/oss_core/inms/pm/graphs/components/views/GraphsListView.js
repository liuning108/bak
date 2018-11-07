define([
  "oss_core/inms/pm/graphs/actions/GraphsAction.js",
  "oss_core/inms/pm/graphs/components/views/PerviewGrpahView.js",
  "oss_core/inms/pm/graphs/components/views/CreateGraphsView.js",
  "oss_core/inms/pm/graphs/components/views/RootView.js",
  "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/views/CreateListView.html",
  "text!oss_core/inms/pm/graphs/components/views/graphsOp.html"
], function(action, PerviewGrpahView, CreateGraphsView, RootView, util, tpl, graphsOp) {
  var evetMap = [
    {
      'el': '.graphscallback',
      'type': 'click',
      'handel': 'callback'
    }, {
      'el': '.createGraphs',
      'type': 'click',
      'handel': 'createGraphs'
    }, {
      'el': '.delGraphs',
      'type': 'click',
      'handel': 'delGraphsEvent'
    }, {
      'el': '.g_name_search',
      'type': 'click',
      'handel': 'search_load'
    }, {
      'el':'.g_name_reset',
      'type':'click',
      'handel':'reset_load'
    }
  ]
  var GraphsListView = function(option) {
    RootView.call(this, option)
  }
  GraphsListView.prototype = Object.create(RootView.prototype);
  GraphsListView.prototype.constructor = GraphsListView;
  GraphsListView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.graphsOp = fish.compile(graphsOp);
    this.option.code =this.option.code||"PMPS_PIMSERVER_BM"
    console.log("GraphsListView option",this.option);
    this.evetMap = evetMap;
  },
  GraphsListView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  GraphsListView.prototype.afterRender = function() {
    var self = this;
    this.loadData(function(d) {
      self.groupAndHost(d);
      self.initGraphasGrid();
    })
  }
  GraphsListView.prototype.search_load = function() {
    var value = this.$el.find('.g-theme-search').val();
     if(value.trim().length>0){
       var id = this.option.id;
       this.loadGridDatasByCondition({
         'tId':id,
         'name':value
       })
     }else{
       this.reset_load();
     }

  }
  GraphsListView.prototype.reset_load = function() {
     var txt = this.$el.find('.g-theme-search');
     txt.val("");
     var id = this.option.id;
     this.changeTmpId({
       'id':id
     });
  }
  GraphsListView.prototype.loadData = function(callback) {
    var d = {
      'allGroup': {}
    };
    var id = this.option.id;
    callback({'id': id});
  }
  GraphsListView.prototype.initGraphasGrid = function() {
    var self = this;
    var mydata = [];
    var opt = {
      data: mydata,
      height: this.option.tableH,
      pager: false,
      multiselect: false,
      pagebar: true,
      colModel: [
        {
          name: 'catagory',
          label: '归类',
          align: 'left'
        }, {
          name: 'name',
          label: '名称',
          align: 'left'
        }, {
          name: 'type',
          label: '类型',

          formatter: function(cellval, opts, rwdat, _act) {
            // if((""+cellval)=='11'){
            //    return "自定义"
            // }
            return "<div class='kdo-on-off-icon'><img width='18' height='18' src='static/oss_core/inms/pm/graphs/images/" + cellval + ".png'></img></div>"
          }
        }, {
          name: 'desc',
          label: '描述'
        }, {
          name: 'gid',
          label: '',
          align: 'center',
          'title': false,
          formatter: function(cellval, opts, rwdat, _act) {
            return self.graphsOp({id: cellval});
          }
        }
      ]
    };
    this.$gird = this.$el.find('.graphsListGrid').grid(opt);
    this.$gird.on('click', '.deleteGraph', function() {
      var selrow = self.$gird.grid("getSelection");
      self.delGraphsAction([selrow]);
    })
    this.$gird.on('click', '.updateGraph', function() {
      var selrow = self.$gird.grid("getSelection");
      self.updateGraphs(selrow);
    })
    this.$gird.on('change', '[type="checkbox"]', function() {
      var selrow = self.$gird.grid("getCheckRows");
      if (selrow.length > 0) {
        self.$el.find('.graphsListBtn').show();
      } else {
        self.$el.find('.graphsListBtn').hide();
      }
    })

    this.$gird.on('click', '.previewGraph', function() {
      var selrow = self.$gird.grid("getSelection");
      self.perviewGraph(selrow.gid);
    })

    this.$gird.grid("setLabel", "catagory", "归类", {
      "text-align": 'left'
    }, {});
    this.$gird.grid("setLabel", "name", "名称", {
      "text-align": 'left'
    }, {});
  },
  GraphsListView.prototype.delGraphsEvent = function() {
    var self = this;
    var selrows = self.$gird.grid("getCheckRows");
    this.delGraphsAction(selrows);
  },
  GraphsListView.prototype.delGraphsAction = function(selrows) {
    var self = this;
    fish.confirm("您确定删除所选图形?").result.then(function() {
      ids = fish.map(selrows, function(d) {
        return d.gid
      })
      console.log("ids", ids);
      action.delGraphs({"ids": ids}).then(function() {
         fish.toast('success', '操作成功')
         self.reset_load();
      })
      // fish.each(selrows, function(d) {
      //   self.$gird.grid("delRowData", d);
      // });
    });
  },
  GraphsListView.prototype.groupAndHost = function(d) {

    console.log("groupAndHost", d);
    var self = this;
    this.changeTmpId(d);

  },
  GraphsListView.prototype.changeTmpId = function(g) {
    if (g) {
      var param = {
        tId: g.id
      }
      this.loadGridDatas(param);
    }

  }
  GraphsListView.prototype.loadGridDatas = function(param) {
    var self = this;
    action.getGraphsByUserID(param).then(function(data) {
      var datas = fish.map(data.result, function(d) {
        return {catagory: d.GCLASS, name: d.NAME, "type": d.GTYPE, "desc": d.DESCR, "gid": d.GID}
      })
      self.$gird.grid("reloadData", datas)
    })
  }
  GraphsListView.prototype.loadGridDatasByCondition = function(param) {
    var self = this;
    action.getGraphsByCondition(param).then(function(data) {
      var datas = fish.map(data.result, function(d) {
        return {catagory: d.GCLASS, name: d.NAME, "type": d.GTYPE, "desc": d.DESCR, "gid": d.GID}
      })
      self.$gird.grid("reloadData", datas)
    })
  }
  GraphsListView.prototype.changeGropupCombobox = function(g) {
    var self = this;
    action.getTemplatesByCatagroyId(g.VALUE).then(function(data) {
      var tmpDataSource = fish.map(data.result, function(d) {
        return {name: d.NAME, value: d.ID}
      });
      self.tmpCombox.combobox({"dataSource": tmpDataSource})
      var tmp = fish.find(tmpDataSource, function(d) {
        return "" + d.value == "" + self.templateObj.ID
      })
      if (tmp) {
        self.tmpCombox.combobox({
          "value": "" + tmp.value
        })
      } else {
        if (tmpDataSource.length > 0) {
          var first = tmpDataSource[0];
          self.tmpCombox.combobox({
            "value": "" + first.value
          })
        }
      }
    })
  }
  GraphsListView.prototype.updateGraphs = function(selrow) {
    var self = this;
    var gid = selrow.gid;
    var code = this.option.code;
    action.getGraphsById(gid).then(function(data) {
      if (data.result) {
        var json = data.result;
        json.code=code;
        self.enterCreateGraphs(data.result)

      }
    });
  }
  GraphsListView.prototype.createGraphs = function() {
    var self = this;
    var tid = this.option.id;
    var code = this.option.code;
    self.enterCreateGraphs({
      templateId: tid,
     'code':code,
      gid: "NONE",
      title: "",
      position: "L",
      desc: "",
      gtype: 1,
      gclass: ""
    })
  },
  GraphsListView.prototype.enterCreateGraphs = function(data) {
    var self = this;
    this.createGraphsView = new CreateGraphsView({
      'el': this.$el,
      'data': data,
      'cancel': function(tid) {
        self.option.id = tid;
        self.render();
      },
      'ok': function(tid) {
        fish.toast('success', '保存成功')
        self.option.id = tid;
        self.render();

      }
    })
    this.createGraphsView.render();
  },
  GraphsListView.prototype.callback = function() {
    util.doNotNull(this.option.callback);
  },
  GraphsListView.prototype.perviewGraph = function(gid) {
    var self = this;
    var code = self.option.code;
    action.getGraphsById(gid).then(function(data) {
      if (data.result) {
        console.log("perviewGraph 333", data.result)
        // data.result.code=code;
        self.perviewGrpahView = new PerviewGrpahView({
          el: self.$el,
          "config": data.result,
          callback: function() {
            self.render();
          }
        });
        self.perviewGrpahView.render();
      }
    });

  }
  return GraphsListView;
});
