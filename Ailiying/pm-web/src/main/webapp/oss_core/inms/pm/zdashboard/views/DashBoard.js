define([
  "oss_core/inms/pm/zdashboard/actions/DashAction.js",
  "oss_core/inms/pm/zdashboard/libs/addwidget/AddWidViewDialog",
  "text!oss_core/inms/pm/zdashboard/templates/DashBoard.html",
  "oss_core/inms/pm/zdashboard/libs/WidgetEngine",
  'oss_core/inms/pm/zdashboard/libs/html2canvas',
  'oss_core/inms/pm/zdashboard/libs/gridstack',
  'css!oss_core/inms/pm/zdashboard/libs/gridstack.css',
  "css!oss_core/inms/pm/zdashboard/css/zdashboard.css",
  "css!oss_core/inms/pm/graphs/css/kdo.css",
  "css!oss_core/inms/pm/graphs/css/graphs.css"
], function(action, AddWidViewDialog, tpl, WidgetEngine, html2canvas) {
  var DashBoard = function(option) {
    this.$el = $(option.el);
    this.template = fish.compile(tpl),
    this.callback = option.callback || function() {};
    this.tid = option.id || 'T00001'
    this.rmUID=option.rmUID;
    this.timeCode = -1;
  }
  DashBoard.prototype = {
    refreshChange: function(val, name, tipFlag) {
      var self = this;
      window.clearInterval(self.timeCode);
      var val = Number(val);
      if (val <= 0) {
        if (!tipFlag) {
          //fish.toast('success', '取消自动刷新');
        }
        return;
      }
      if (!val)
        return;

      if (fish.isNaN(val))
        return;
      var timeInterval = val * 1000 * 60;
      self.timeCode = setInterval(function() {
        self.zrefresh();
      }, timeInterval)
      if (!tipFlag) {
        //fish.toast('success', '刷新时间设置成功');
      }
    },
    render: function() {
      this.$el.html("");
      this.$el.html(this.template());
      this.afterRender();
    },
    initEvent: function() {
      var self = this;
      this.$el.find('.btn-save').off('click').on('click', function() {
        self.saveDashBoard();
      })
      this.$el.find('.btn-cancel').off('click').on('click', function() {
        self.cancel();
      })
      this.$el.find('.btn-add').off('click').on('click', function() {
        self.addWidgetEvent();
      })
      this.$el.find('.zrefresh').off('click').on('click', function() {
        self.zrefresh();
      })

    },
    zrefresh: function() {
      if (!this.engine)
        return;
      var items = this.engine.getItems();
      if (fish.values(items).length <= 0)
        return;
      fish.each(fish.values(items), function(item) {
        item.refresh();
      })
      fish.toast('success', '刷新成功')
    },
    addWidgetEvent: function() {
      var self = this;
      var options = {
        height: 560,
        width: 900,
        modal: true,
        draggable: false,
        autoResizable: false
      };
      var addWidViewDialog = new AddWidViewDialog();
      addWidViewDialog.popup(options, {
        'tid': self.tid
      }, function(datas) {
        self.addWidgetToScreen(datas);
      });
    },
    cancel: function() {
      window.clearInterval(self.timeCode);
      this.callback();
    },
    afterRender: function() {
      var self = this;
      this.initEvent();
      action.getConfigById('G_REFRESH_TYPE').then(function(data) {
        console.log('getConfigById', data);
        if (data.result) {
          self.initPage(data.result);
        }
      })
    },
    initPage: function(timeData) {
      console.log('timeData', timeData);
      var self = this;
      this.$el.parent().css("background", "#FFFFFF") //seting main background color
      //setting Time Combobx
      timeData = timeData.concat([
        {
          NAME: "无",
          VALUE: '0'
        }
      ])
      var timeCombox = this.$el.find("#combobox2").combobox({editable: false, dataTextField: 'NAME', dataValueField: 'VALUE', dataSource: timeData});
      timeCombox.on('combobox:change', function() {
        var val = timeCombox.combobox('value')
        if (val) {
          self.refreshChange(val);
        }
      });
      self.timeCombox = timeCombox;
      this.engine = new WidgetEngine(this.$el.find('.grid-stack'),self.rmUID);
      action.getDash(self.tid).then(function(data) {
        if (data.result) {
          if (data.result.timeCode) {
            timeCombox.combobox("value", data.result.timeCode);
          } else {
            timeCombox.combobox("value", timeData[0].VALUE);
          }
          self.engine.load(data.result);
        } else {
          timeCombox.combobox("value", timeData[0].VALUE);
          self.engine.load({datas: []});
        }
      })
    },
    addWidgetToScreen:function(datas){
      console.log("addWidgetToScreen",datas);
      var self = this;

      fish.each(datas,function(data){
        var config={
           'url':'oss_core/inms/pm/zdashboard/libs/widgets/GWidget.js',
           'data':data
        }
        self.engine.addWidget(config)
      })

    },
    saveDashBoard: function() {
      var self = this;
      var json = this.engine.getJson();
      json.tid = this.tid;
      json.timeCode = self.timeCombox.combobox('value');
      console.log('zdjson', json);
      //fish.store.set('zdjson',json);
      action.saveOrUpdateDash(json).then(function(data) {
        fish.toast('success', '保存成功')
      })

      // alert(JSON.stringify(json));
      // console.log(JSON.stringify(json));

    }
  }

  return DashBoard;
})
