define([
  "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/dbConfigTree.html", "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/xLi.html", "text!oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/yLi.html", "oss_core/pm/screendesigner/js/graphLibs/views/dbConfigTree/LookDBSourceView", "css!oss_core/pm/screendesigner/css/dbconfigtree.css"
], function(tpl, tplXLi, tplYLi, lookDBSourceView) {

  return portal.CommonView.extend({
    template: fish.compile(tpl),
    xLiTpl: fish.compile(tplXLi),
    yLiTpl: fish.compile(tplYLi),
    initialize: function(config) {
      this.config = config;
    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },

    renderDBtoHTML: function(el, db) {
      this.renderServerName(el, db);
      this.renderServerXAxis(el, db);
      this.renderServerYAxis(el, db);
    },
    renderServerName: function(el, db) {
      el.find('.dbServerName').text(db.serverName);
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
      var view = new lookDBSourceView().render();
      var w = 1024;
      var options = {
        width: w,
        modal: false,
        draggable: false,
        content: view.$el,
        autoResizable: true,
        modal: true
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

      $parent.find('.coa').text('所有数据字段');
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
      $parent.find('.coa').text('所选数据字段');
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
        $parent.find('.coa').text('所有数据字段');
        this.renderDBtoHTML($parent, this.config.db)
      }

    },
    checkDB: function($parent) {
      var flag = true;
      $parent.find('.xmessage,.ymessage').hide();

      if (this.xc <= 0) {
        $parent.find('.xmessage').show().text('至少要有1个维度')
        flag = false;
      }
      if (this.yc <= 0) {
        $parent.find('.ymessage').show().text('至少要有1个指标')
        flag = false;
      }

      return flag;

    },
    modifiedDB: function($parent) {
      var newDB = $.extend(true, {}, this.config.db)
      this.modifiedX($parent, newDB)
      this.modifiedY($parent, newDB)
      return newDB;
    },
    modifiedXY: function($parent, axis, prop, count, db) {
      var doms = $parent.find(axis).find('.dbChoice')
      var choiceIds = fish.map(doms, function(dom) {
        var id = $(dom).attr('id');
        return id
      });
      this[count] = choiceIds.length;
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
