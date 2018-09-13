define([
  "oss_core/inms/pm/graphs/actions/GraphsAction.js",
  "oss_core/inms/pm/graphs/components/views/AddClassDialog.js",
  "oss_core/inms/pm/graphs/components/views/PerviewGrpahView.js",
  "oss_core/inms/pm/graphs/components/graphstabs/GraphsTabsView.js",
  "oss_core/inms/pm/graphs/components/views/RootView.js",
  "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/views/CreateGraphsView.html"
], function(action, AddClassDialog, PerviewGrpahView, GraphsTabsView, RootView, util, tpl) {
  var evetMap = [
    {
      'el': '.graphsCancel',
      'type': 'click',
      'handel': 'cancel'
    }, {
      'el': '.graphsOK',
      'type': 'click',
      'handel': 'ok'
    }, {
      'el': '.kdo-dash-container',
      'type': 'click',
      'handel': 'selGraphType'
    }, {
      'el': '.perview-iconBtn',
      'type': 'click',
      'handel': 'perview'
    }
  ]
  var CreateGraphsView = function(option) {
    RootView.call(this, option)
  }
  CreateGraphsView.prototype = Object.create(RootView.prototype);
  CreateGraphsView.prototype.constructor = CreateGraphsView;
  CreateGraphsView.prototype.initProp = function() {
    this.tpl = fish.compile(tpl);
    this.evetMap = evetMap;
  },
  CreateGraphsView.prototype.loadPage = function() {
    this.$el.html(this.tpl());
  },
  CreateGraphsView.prototype.afterRender = function() {
    var self = this;
    this.loadData(function(data) {
      self.initPage(data);
      self.initDatas(data);
    })

  },
  CreateGraphsView.prototype.loadData = function(fun) {
    var self = this;
    var d = {};
    action.getGraphsTags().then(function(data) {
      d.tags = data.result;
      return action.getTimeConfig()
    }).then(function(data){
        d.timeConfig = data.result;
      return action.getbusField(self.option.data.code)
    }).then(function(data) {
      var dimKpiArr = fish.partition(data.modelField,function(d){
        return d.FIELD_TYPE==0;
      })
      var items = fish.map(dimKpiArr[1],function(d){
         return {
            "ID":d.FIELD_CODE,
            "NAME":d.FIELD_NAME
         }
      })
      var dims =fish.map(dimKpiArr[0],function(d){
         return {
            "value":d.FIELD_CODE,
            "name":d.FIELD_NAME,
            'dataType':d.DATA_TYPE
         }
      })
      console.log('getItemsByTId2',dimKpiArr);
      console.log('getItemsByTIdData2',data);
      d.items = items
      d.dims= dims;
      self.option.data.dims=d.dims;
      self.option.data.items = d.items;

      //获取时间配置信息
       var field =fish.first(data.modelField);
       self.tableName=field.MODEL_PHY_CODE;
       var GRANU_MODE= JSON.parse(field.GRANU_MODE)
       console.log("CreateGraphsView33",field)
       var granus =fish.map(GRANU_MODE,function(d){
         return d.GRANU
       })
       self.option.data.granusConfig={
          'granus':granus,
          'timeConfig':d.timeConfig
       }
       console.log("CreateGraphsView22",self.option.data.granusConfig);
      fun(d)
    })
  }
  CreateGraphsView.prototype.initDatas = function() {
    var d = this.option.data;
    this.$el.find('.graphsName').val(d.title);
    this.$el.find('.graphsDesc').val(d.desc);
  },
  CreateGraphsView.prototype.initPage = function(data) {
    var self = this;
    var d = this.option.data;
    console.log(d);
    this.titlePosition = this.$el.find('.titlePosition').combobox({
      editable: false,
      dataTextField: 'name',
      dataValueField: 'value',
      dataSource: [
        {
          name: '偏左',
          value: 'L'
        }, {
          name: '居中',
          value: 'C'
        }, {
          name: '偏右',
          value: 'R'
        }
      ]
    });
    var pos = d.position || 'L';
    this.titlePosition.combobox('value', pos);
    var gdatas = fish.pluck(data.tags, 'NAME');
    var tags = gdatas;
    if (d.gclass) {
      if (d.gclass.length > 0) {
        tags = fish.union(tags, [d.gclass]);
      }
    }

    var classesData = fish.map(tags, function(d) {
      return {"name": d, "value": d}
    });
    this.classesName = this.$el.find('.classesName').combobox({editable: false, dataTextField: 'name', dataValueField: 'value', dataSource: classesData, template: '<li class="graphs-addClass"><a href="#">新建分类</a></li>'});
    this.classesName.combobox('droplistOn', 'click .graphs-addClass', function(e) {
      self.graphsAddClass();
    });

    this.classesName.combobox('value', d.gclass);
    util.kdoinputStyle(this.$el.find('.kdo-input-style'));
    this.selGraphType(this.$el.find('.kdo-dash-container[data-num="' + d.gtype + '"]')[0]);
    util.resizeH(this.$el.find('.createGraphsViewContext'))
    this.$el.find("#create_graphs_form").validator({
      stopOnError: true,
      timely: false,
      fields: {
        graphsName: {
          invalid: function(el, ret) {
            fish.toast('warn', '标题不能为空');
            $(el).parent().addClass("errorInput")
          },
          valid: function(el, ret) {
            $(el).parent().removeClass("errorInput")
          }
        },
        classesName: {
          invalid: function(el, ret) {
            fish.toast('warn', '图形分类不能为空');
            $(el).parent().parent().addClass("errorInput")
          },
          valid: function(el, ret) {
            $(el).parent().parent().removeClass("errorInput")
          }
        }
      }
    })
  },
  CreateGraphsView.prototype.cancel = function() {
    var d = this.option.data;
    util.doNotNull(this.option.cancel, d.templateId);
  },
  CreateGraphsView.prototype.graphsAddClass = function() {
    var self = this;
    var options = {
      height: "auto",
      width: 230,
      modal: true,
      draggable: false,
      autoResizable: false
    };
    var addClassDialog = new AddClassDialog();
    addClassDialog.popup(options, {}, function(name) {

      self.classesName.combobox('append', {
        "name": name,
        "value": name
      });
      self.classesName.combobox('hide');

      // $colorEL.css('backgroundColor',color);
    });
  }
  CreateGraphsView.prototype.getJSON = function() {
    var self = this;
    var d = this.option.data;
    var type = this.$el.find('.kdo-chart-sel').data("num");
    var code =self.option.data.code;
    var graphsJson = {
      'title': this.$el.find('.graphsName').val(),
      'desc': this.$el.find('.graphsDesc').val(),
      'templateId': d.templateId,
      'gid': d.gid,
      'code':code,
       gtype: type,
      'tableName': self.tableName,
      gclass: this.classesName.combobox('value'),
      position: this.titlePosition.combobox('value'),
      tabsConfig:this.graphsTabsView.getJSON()
    }
    console.log("CreateGraphsView JSON:",graphsJson);
    return graphsJson;
  }
  CreateGraphsView.prototype.ok = function() {
    var self = this;
    var d = this.option.data;
    var graphsJson = this.getJSON();
    var result = this.$el.find("#create_graphs_form").isValid();
    if (result) {
      action.saveOrUpdateGraphs(graphsJson).then(function(data) {
        util.doNotNull(self.option.ok, d.templateId);
      })
    }

    //
  },
  CreateGraphsView.prototype.selGraphType = function(target) {
    var self = this;
    var $target = $(target);
    self.$el.find('.kdo-chart-sel').removeClass('kdo-chart-sel');
    $target.addClass('kdo-chart-sel');
    var type = $target.data('num');
    this.changeGTabs(type);
  },
  CreateGraphsView.prototype.changeGTabs = function(num) {
    var d = this.option.data;

    console.log('changeGTabs',d);
    this.graphsTabsView = new GraphsTabsView(
       {
         el: this.$el.find('.graphs-tabs'),
          type: num,
         "items": d.items,
         "dims":d.dims,
         "granusConfig":d.granusConfig,
         "config":d.tabsConfig,
       })
    this.graphsTabsView.render();
  }
  CreateGraphsView.prototype.perview = function() {
    var self = this;
    self.option.data=self.getJSON();
    this.perviewGrpahView = new PerviewGrpahView({
      el: self.$el,
      config: self.option.data,
      callback: function() {
        self.render();
      }
    });
    this.perviewGrpahView.render();
  }
  return CreateGraphsView;
});
