define([
  "i18n!oss_core/pm/screendesigner/i18n/SDesinger",
 "oss_core/pm/screendesigner/js/dbHelper/DBHelper", "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dbConfigTree.html", "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/xLi.html", "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/yLi.html", "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LookDBSourceView", "css!oss_core/pm/screendesigner/css/dbconfigtree.css"
], function(i18nData,dbHelper,tpl, tplXLi, tplYLi, lookDBSourceView) {

  return portal.CommonView.extend({
    template: fish.compile(tpl),
    xLiTpl: fish.compile(tplXLi),
    yLiTpl: fish.compile(tplYLi),
    resource : fish.extend({}, i18nData),
    initialize: function(config) {
      this.config = config;
      this.config.db=this.config.g.getDBTreeJson();
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
    },
    lookDBSource: function() {
    console.log(this.config.db);
      var view = new lookDBSourceView({db:this.config.db}).render();
      var w = 1024;
      var options = {
        width: w,
        modal: false,
        draggable: false,
        content: view.$el,
        autoResizable: true,
        modal: true,
        db:this.config.db
      };
      var popup = fish.popup(options);
      this.listenTo(view, 'close', function() {
        popup.close();
      })
    },
    choiceDBSource: function($parent) {
      $parent.find('.db_edit_plane').show();

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
    changeServer:function() {
        var db = this.config.db;
        var g=this.config.g;
        g.attrs.dbServer.serverName=db.serverName;
        g.attrs.dbServer.islocal=db.islocal;
        g.attrs.dbServer.xAxis=fish.pluck(fish.where(db.xAxis,{'choice':'y'}),'id');
        g.attrs.dbServer.yAxis=fish.pluck(fish.where(db.yAxis,{'choice':'y'}),'id');
    },

    checkDB: function($parent) {
      var flag = true;
      $parent.find('.xmessage,.ymessage').hide();

      if (this.xc < this.config.db.xMinNums) {
        $parent.find('.xmessage').show().text(this.resource.TMBAL+":"+this.config.db.xMinNums)
        flag = false;
      }
      if (this.yc < this.config.db.yMinNums) {
        $parent.find('.ymessage').show().text(this.resource.TMBAL+":"+this.config.db.yMinNums)
        flag = false;
      }

      return flag;

    },
    modifiedDB: function($parent) {
      var newDB = $.extend(true, {}, this.config.db)

      this.modifiedX($parent, newDB)
      this.modifiedY($parent, newDB)
      newDB.colModels=dbHelper.createColModel(newDB);
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
