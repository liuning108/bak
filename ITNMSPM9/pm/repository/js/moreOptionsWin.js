define([
  'text!oss_core/pm/repository/templates/moreOptionsWin.html', "oss_core/pm/repository/actions/Action.js"
], function(tpl, action) {
  return {
    mainTpl: fish.compile(tpl),
    itemATpl:fish.compile('<li data-value="{{value}}" data-type="A"><input type="checkbox"  value="{{value}}" data-name="{{name}}" data-value="{{value}}"><span class="filterSpanName">{{name}}</span></li>'),
    itemBTpl:fish.compile('<li class="typeBLi"  data-name="{{name}}" data-value="{{value}}" data-type="B">{{name}}</li>'),
    show: function($item, data, parent) {
      var self = this;
      self.$area = $item;
      self.type = $item.data('type');
      self.parent = parent;
      console.log("moreOptionsWin");
      console.log(data);
      action.queryAttrValues(data, function(attrValues) {
        var result = attrValues.result;
        result = fish.map(result, function(d) {
          d.MORE_FLAG = Number(d.CNT) > 1;
          d.svalue = ("" + d.VALUE).toLowerCase()
          return d;
        })
        self.loadData(result)
      });

    },
    loadData: function(result) {
      var self = this;
      this.$el = $(this.mainTpl({items: result}));
      var option = {
        content: this.$el,
        width: 680,
        height: 470
      };
      this.view = fish.popup(option);
      this.$el.find('.listItems').slimscroll({
        height: (470 - 100) + 'px',
        opacity: 0.5,
        size: '5px'
      });
      self.bindEvent()

    },
    bindEvent: function() {
      var self = this;
      self.navFilterEvent();
      self.choiceItemEvent();

    },
    choiceItemEvent: function() {
      var self = this;
      self.$el.find('.listItems').find('span').off('click').on('click', function() {
        var v = $(this).data('value');
        var $vItem = self.findItem(v)
        if ($vItem == 0) {
          self.addItem(v);
        } else {
          self.choiceItem($vItem);
        }
         self.close();
      })
    },
    close: function() {
      this.view.close();
    },
    findItem: function(v) {
      var self = this;
      var $area = self.$area.parent().parent();
      var $vItem = $area.find("li[data-value='" + v + "']");
      if ($vItem.length <= 0) {
        return 0
      }
      return $vItem;
    },
    addItem: function(v) {
      var self = this;
      if (self.type == 'A') {
        this.typeAaddItem(v)
        return;
      }
      if (self.type == 'B') {
        this.typeBaddItem(v)
        return;
      }
    },
    typeAaddItem: function(v) {
      var self = this;
      var $area = self.$area.parent().parent();
      var $moreSpan =$area.find('.moreSpan')
      var d = {
        name:v,
        value:v
      }
      var $vItem=$(self.itemATpl(d)).insertBefore($moreSpan);
      $vItem.find('input[type=checkbox]').prop('checked', true).addClass("areaItemChoice")
      self.parent.buildTypeA($area,null);
      self.parent.BulidFilterNav();
    },
    typeBaddItem: function(v) {
      var self = this;
      var $area =self.$area.parent().parent();
      var $moreSpan =$area.find('.moreSpan')
      var d = {
        name:v,
        value:v
      }
      var $vItem=$(self.itemBTpl(d)).insertBefore($moreSpan);
      $area.find('.areaItemChoice').removeClass('areaItemChoice');
      $vItem.addClass("areaItemChoice")
      self.parent.buildTypeB($area,null);
      self.parent.BulidFilterNav();
    },
    choiceItem: function($vItem) {
      var self = this;
      if (self.type == 'A') {
        this.typeAChoiceItem($vItem)
        return;
      }
      if (self.type == 'B') {
        this.typeBChoiceItem($vItem)
        return;
      }
    },
    typeAChoiceItem: function($vItem) {
      var self = this;
      $vItem.find('input[type=checkbox]').prop('checked', true).addClass("areaItemChoice")
      self.parent.BulidFilterNav();

    },
    typeBChoiceItem: function($vItem) {
      var self = this;
      var $area =$vItem.parent().parent();
      $area.find('.areaItemChoice').removeClass('areaItemChoice');
      $vItem.addClass("areaItemChoice")
      self.parent.BulidFilterNav();
    },
    navFilterEvent: function() {
      var self = this;
      self.$el.find('.pagnSpan').off('click').on('click', function() {
        var value = $(this).data('value').trim().toLowerCase();
        self.$el.find('.pagnCur').removeClass('pagnCur')
        $(this).removeClass('pagnLink').addClass('pagnCur');
        if (value == 'all') {
          self.$el.find('.listItems').find('span').show();
        } else {
          self.$el.find('.listItems').find('span').hide();
          self.$el.find('.listItems').find('span[data-svalue^=' + value + ']').show();
        }
      });
    }
  }
})
