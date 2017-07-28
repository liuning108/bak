define([
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/serviceLi.html",
  "oss_core/pm/screendesigner/actions/BScreenMgrAction",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/ConfigDBSourceView",
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
  "oss_core/pm/screendesigner/js/dbHelper/DBHelper",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dbConfigTree.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/xLi.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/yLi.html",
  "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LookDBSourceView",
  "css!oss_core/pm/screendesigner/css/dbconfigtree.css"
], function(serviceLiTpl, action, ConfigDBSourceView, i18nData, dbHelper, tpl, tplXLi, tplYLi, lookDBSourceView) {

  return portal.CommonView.extend({
    template: fish.compile(tpl),
    xLiTpl: fish.compile(tplXLi),
    yLiTpl: fish.compile(tplYLi),
    serviceLiTplFun: fish.compile(serviceLiTpl),
    resource: fish.extend({}, i18nData),
    initialize: function(config) {
      this.config = config;
      this.config.db = this.config.g.getDBTreeJson();
    },
    render: function() {
      this.$el.html(this.template(this.resource));
      return this;
    },

    renderDBtoHTML: function(el, db) {
      this.renderServerName(el, db);
      this.renderServerXAxis(el, db);
      this.renderServerYAxis(el, db);
    },
    renderServerName: function(el, db) {
      el.find('.dbServerName').text(db.serverLabel);
    },

    renderServerXAxis: function(el, db) {
      var self = this;
      el.find('.xnums').text(db.xNums);
      el.find('.xAxisUL').empty();
      fish.each(db.xAxis, function(obj) {
        $li = $(self.xLiTpl(obj)).appendTo(el.find('.xAxisUL'));
        if (obj.choice == 'y') {
          $li.show();
        } else {
          $li.hide();
        }

      });

    },

    renderServerYAxis: function(el, db) {
      var self = this;
      el.find('.ynums').text(db.yNums);
      el.find('.yAxisUL').empty();
      fish.each(db.yAxis, function(obj) {
        $li = $(self.yLiTpl(obj)).appendTo(el.find('.yAxisUL'));
        if (obj.choice == 'y') {
          $li.show();
        } else {
          $li.hide();
        }
      });
    },
    renderBtn: function($parent) {
      var self = this;
      $parent.find('.db_edit_btn').show().off('click').on('click', function() {
        self.dbEdit($(this), $parent);
      })
      $parent.find('.db_sure').hide().off('click').on('click', function() {
        self.dbSure($(this), $parent);
      })
      $parent.find('.db_cancel').hide().off('click').on('click', function() {
        self.dbCancel($(this), $parent);
      })
      $parent.find('.serverCommand').hide().find('.choiceDBSource').off('click').on('click', function() {
        self.choiceDBSource($parent);
      });
      $parent.find('.lookDBSource').off('click').on('click', function() {
        self.lookDBSource();
      })

      $parent.find('.dbconfig-button-plus').off('click').on('click', function() {
        self.createNewDBSource();
      })

      $parent.find('.serachBtn').off('click').on('click', function() {
        self.serachSourceService($parent);
      })
    },
    serachSourceService: function($parent) {
      var text = $parent.find(".serachServiceInput").val().toLowerCase();
      var $ul = $parent.find(".dbserverlistUL");
      if (text.length <= 0) {
        $ul.find('li').show();
        return;
      }
      $ul.find('li').hide();
      var li = $ul.find('li[data-name*=' + text + ']')
      li.show();
    },
    createNewDBSource: function(json) {
      var self = this;
      var $parent = this.$el.find(".db_panel_side");
      var view = new ConfigDBSourceView(json || {
        no: '0',
        name: '',
        type: '1',
        source: '',
        userId: portal.appGlobal.get("userId"),
        attrs: {
          sql: '',
          x_colModels: [],
          y_colModels: []
        }
      }).render();
      var w = 842;
      var options = {
        width: w,
        height: 509,
        modal: false,
        draggable: false,
        content: view.$el,
        autoResizable: true,
        modal: true,
        db: this.config.db
      };
      var popup = fish.popup(options);
      this.listenTo(view, 'close', function() {
        popup.close();
        self.choiceDBSource($parent)
      })

    },
    lookDBSource: function() {
      var view = new lookDBSourceView({db: this.config.db}).render();
      var w = 1024;
      var options = {
        width: w,
        modal: false,
        draggable: false,
        content: view.$el,
        autoResizable: true,
        modal: true,
        db: this.config.db
      };
      var popup = fish.popup(options);
      this.listenTo(view, 'close', function() {
        popup.close();
      })
    },
    choiceDBSource: function($parent) {
      var self = this;
      var userId = portal.appGlobal.get("userId");
      action.getSourceServiceListByUserID(userId, function(data) {
        var $ul = $parent.find('.db_edit_plane').find('.dbserverlistUL');
        $ul.empty();
        fish.each(data.serviceList.datas, function(data) {
          data.serviceNameLowerCase=(""+data.serviceName).toLowerCase();
          $ul.append(self.serviceLiTplFun(data));
        })

        //选择服务
        $ul.find('li').off('click').on('click', function() {
            $ul.find('li').removeClass("actionService");
            $(this).addClass("actionService");
        })

        //删除服务
        $ul.find('.removeIcon').off('click').on('click', function() {
          var no = $(this).data('no');
          fish.confirm('Confirm whether to delete this service').result.then(function() {
            action.delSourceServiceById(no, function(data) {
              //fish.success('删除成功');
              self.choiceDBSource($parent);
            })
          });
        });
        //修改服务
        $ul.find('.pencilIcon').off('click').on('click', function() {
          var no = $(this).data('no');
          action.getSourceServiceById(no, function(data) {
            self.createNewDBSource(data.sourceService.data)
          })

        })

        $parent.find('.db_edit_plane').show();
      })

    },
    dbEdit: function(el, $parent) {
      var self = this;
      el.hide();
      $parent.find('.db_sure').show();
      $parent.find('.db_cancel').show();
      $parent.find('.serverCommand').show();
      $parent.find('[data-choice=n]').show();
      $parent.find('[data-choice]').removeClass('dbChoice');

      fish.each(this.config.db.xAxis, function(xItem) {
        var $item = $parent.find('.xAxisUL').find('#' + xItem.id)
        if (xItem.choice == 'y') {
          $item.addClass('dbChoice')
          $item.data('index', 0);
        } else {
          $item.show();
        }

      })

      fish.each(this.config.db.yAxis, function(xItem) {
        var $item = $parent.find('.yAxisUL').find('#' + xItem.id)
        if (xItem.choice == 'y') {
          $item.addClass('dbChoice')
          $item.data('index', 0);
        } else {
          $item.show();
        }
      })

      $parent.find('.coa').text(this.resource.ALLF);
      var xClickIndex = 0;
      $parent.find('.xAxisUL').find('li').off('click').on('click', function() {
        self.choiceFieldByNums($(this), $parent, '.xAxisUL', self.config.db.xNums, xClickIndex++);
      })

      var yClickIndex = 0;
      $parent.find('.yAxisUL').find('li').off('click').on('click', function() {
        self.choiceFieldByNums($(this), $parent, '.yAxisUL', self.config.db.yNums, yClickIndex++);
      })
    },
    choiceFieldByNums: function(el, $parent, className, nums, clickIndex) {
      if (el.hasClass("dbChoice")) {
        el.removeClass('dbChoice');
      } else {
        var array = $parent.find(className).find('.dbChoice')
        minDom = fish.min(array, function(dom) {
          return $(dom).data('index');
        })
        if (array.length >= nums) {
          $(minDom).removeClass('dbChoice');
        }
        el.addClass('dbChoice');
        el.data("index", clickIndex);
      }
    },
    dbCancel: function(el, $parent) {
      el.hide();
      $parent.find('.db_edit_btn').show();
      $parent.find('.db_sure').hide();
      $parent.find('.serverCommand').hide();
      $parent.find('[data-choice=n]').hide();
      $parent.find('[data-choice=y]').removeClass('dbChoice');
      $parent.find('.db_edit_plane').hide();
      $parent.find('.coa').text(this.resource.ALLF);
      $parent.find('[data-choice]').off("click");
      $parent.find('.xmessage').hide();
      $parent.find('.ymessage').hide();
      this.renderDBtoHTML($parent, this.config.db)

    },
    dbSure: function(el, $parent) {
      var newDB = this.modifiedDB($parent);
      if (this.checkDB($parent)) {
        this.config.db = newDB
        $parent.find('.xmessage').hide();
        $parent.find('.ymessage').hide();
        el.hide();
        $parent.find('.db_edit_btn').show();
        $parent.find('.db_cancel').hide();
        $parent.find('.serverCommand').hide();
        $parent.find('[data-choice=n]').hide();
        $parent.find('[data-choice=y]').removeClass('dbChoice');
        $parent.find('.db_edit_plane').hide();
        $parent.find('.coa').text(this.resource.SEL_FIELDS);
        this.renderDBtoHTML($parent, this.config.db)
        this.changeServer();
        this.config.g.toGraph(dbHelper.toChoiceDB(this.config.db));
        this.config.g.redraw()
      }

    },
    /**
      ex:
    {
     'serverName':'新装量预览服务',
     'islocal':true,
     xAxis':['field_1'],
    'yAxis':['field_2','field_3'],
    }
    **/
    changeServer: function() {
      var db = this.config.db;
      var g = this.config.g;
      g.attrs.dbServer.serverName = db.serverName;
      g.attrs.dbServer.islocal = db.islocal;
      g.attrs.dbServer.xAxis = fish.pluck(fish.where(db.xAxis, {'choice': 'y'}), 'id');
      g.attrs.dbServer.yAxis = fish.pluck(fish.where(db.yAxis, {'choice': 'y'}), 'id');
    },

    checkDB: function($parent) {
      var flag = true;
      $parent.find('.xmessage,.ymessage').hide();

      if (this.xc < this.config.db.xMinNums) {
        $parent.find('.xmessage').show().text(this.resource.TMBAL + ":" + this.config.db.xMinNums)
        flag = false;
      }
      if (this.yc < this.config.db.yMinNums) {
        $parent.find('.ymessage').show().text(this.resource.TMBAL + ":" + this.config.db.yMinNums)
        flag = false;
      }

      return flag;

    },
    modifiedDB: function($parent) {
      var newDB = $.extend(true, {}, this.config.db)

      this.modifiedX($parent, newDB)
      this.modifiedY($parent, newDB)
      newDB.colModels = dbHelper.createColModel(newDB);
      return newDB;
    },
    modifiedXY: function($parent, axis, prop, count, db) {
      var doms = $parent.find(axis).find('.dbChoice')
      var choiceIds = fish.map(doms, function(dom) {
        var id = $(dom).attr('id');
        return id
      });
      this[count] = choiceIds.length;
      console.log(choiceIds)
      fish.each(db[prop], function(Item) {
        Item.choice = fish.contains(choiceIds, Item.id)
          ? 'y'
          : 'n'
      })
    },

    modifiedX: function($parent, db) {
      this.modifiedXY($parent, '.xAxisUL', 'xAxis', 'xc', db)

    },
    modifiedY: function($parent, db) {
      this.modifiedXY($parent, '.yAxisUL', 'yAxis', 'yc', db)
    },
    afterRender: function() {
      var self = this;
      var $parent = $(".db_panel_side");

      $fange = $('input[type=radio][name="dbServer"]');
      $fange.icheck();
      $parent.find('.db_edit_plane_sure').off('click').on('click', function() {
        $parent.find('.db_edit_plane').hide();
      })
      $parent.find('.db_edit_plane_cancel').off('click').on('click', function() {
        $parent.find('.db_edit_plane').hide();
      })

      this.renderBtn($parent);
      this.renderDBtoHTML($parent, this.config.db)

      var bodyOutH = $('body').outerHeight();
      var outH = bodyOutH * (0.9 / 2);
      $parent.find('.g_field_context').slimscroll({height: outH, axis: 'y'});
    }

  })
});
