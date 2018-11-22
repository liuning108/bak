define([
  "text!oss_core/inms/pm/resMgr/libs/kdoDSelect/kdoDSelect.html",
  "text!oss_core/inms/pm/resMgr/libs/kdoDSelect/selected.html",
  "text!oss_core/inms/pm/resMgr/libs/kdoDSelect/additem.html",

], function(tpl, selectedTpl, addItemTpl) {
  var KdoDSelect = function(options) {
    this.options = options
    this.doProcess();
    this.$el = $(this.options.el);
    this.tpl = fish.compile(tpl);
    this.selectedTpl = fish.compile(selectedTpl);
    this.addItemTpl = fish.compile(addItemTpl);
    console.log("KdoDSelect");
    console.log(this.options);
  }
  KdoDSelect.prototype.doProcess = function() {
      var self = this;
      var L = fish.filter(self.options.L, function(d) {
        return !fish.findWhere(self.options.R, d);
      })
      this.options.L = L;
    },
    KdoDSelect.prototype.render = function() {
      this.remove();
      this.$el.html(this.tpl({
        L: this.options.L,
        R: this.options.R
      }));
      this.afterRender();
    }
  KdoDSelect.prototype.remove = function() {
    this.$el.html("");
  }
  KdoDSelect.prototype.afterRender = function() {
    var self = this;
    self.$el.find('.kdo-addItem').off('click')
      .on("click", function() {
        self.addItem($(this));
      })
    self.$el.find('.kdo-removeItem').off('click')
      .on("click", function() {
        self.itemRmove($(this));
      })
    self.$el.find('.kdo-addall').off('click')
      .on('click', function() {
        self.addALL();
      })
    self.$el.find('.kdo-removeall').off('click')
      .on('click', function() {
        self.removeALL();
      })
    self.$el.find('.kdo-search-input').off('keyup')
           .on('keyup',function(){
              self.$el.find('.kdo-addItem').parent().hide();
              var value  = ""+$(this).val();
              if(value.length<=0){
                  self.$el.find('.kdo-addItem').parent().show();
              }else{
                self.searchInput(value.toUpperCase());
              }

           })
  }
  KdoDSelect.prototype.searchInput=function(value){
     var self =this;
     var doms=self.$el.find('.kdo-addItem')
     fish.each(doms,function(dom){
            var $dom = $(dom);
            var name =(""+$dom.data('name')).toUpperCase();
            if(value.indexOf(name)!=-1){
              $dom.parent().show();
            }
     });
  }
  KdoDSelect.prototype.removeALL = function() {
    var $doms = this.$el.find('.kdo-removeItem')
    var self = this;
    fish.each($doms, function($dom) {
      self.itemRmove($($dom));
    })
  }
  KdoDSelect.prototype.addALL = function() {
    var $doms = this.$el.find('.kdo-addItem:visible')
    var self = this;
    fish.each($doms, function($dom) {
      self.addItem($($dom));
    })
  }
  KdoDSelect.prototype.addItem = function($dom) {
      var item = {
        "name": $dom.data('name'),
        "value": $dom.data('value'),
      }
      this.createSelectedHtml(item)
      $dom.parent().remove();
    },
    KdoDSelect.prototype.createSelectedHtml = function(item) {
      var self = this;
      var $UI = this.$el.find('.selectedUI')
      var $seled = $(this.selectedTpl(item));
      $UI.append($seled);
      $seled.find('.kdo-removeItem').off('click')
        .on('click', function() {
          self.itemRmove($(this));
        })
    }
  KdoDSelect.prototype.itemRmove = function($dom) {
    var item = {
      "name": $dom.data('name'),
      "value": $dom.data('value'),
    }
    this.createAddItemHtml(item);
    $dom.parent().remove();
  }
  KdoDSelect.prototype.createAddItemHtml = function(item) {
    var self = this;
    var $item = $(this.addItemTpl(item))
    var $UI = this.$el.find('.addItemUL');
    $UI.append($item);
    $item.find('.kdo-addItem').off('click')
      .on("click", function() {
        self.addItem($(this));
      })
  }
  KdoDSelect.prototype.RopEvent = function() {
    var option = this.$el.find(".lSelect option:selected");
    if (option.length <= 0) return;
    this.$el.find(".rSelect").append(option.clone());
    option.remove();

  }
  KdoDSelect.prototype.LOpEvent = function() {
    var option = this.$el.find(".rSelect option:selected");
    if (option.length <= 0) return;
    this.$el.find(".lSelect").append(option.clone());
    option.remove();
  }
  KdoDSelect.prototype.LFEvent = function(txt) {
    if (txt.length <= 0) {
      this.$el.find(".lSelect").find('option').show();
    } else {
      this.$el.find(".lSelect").find('option').hide();
      this.$el.find(".lSelect").find('option[data-name*="' + txt + '"]').show();
    }

  }
  KdoDSelect.prototype.RFEvent = function(txt) {
    if (txt.length <= 0) {
      this.$el.find(".rSelect").find('option').show();
    } else {
      this.$el.find(".rSelect").find('option').hide();
      this.$el.find(".rSelect").find('option[data-name*="' + txt + '"]').show();
    }

  }
  KdoDSelect.prototype.val = function() {
    return fish.map(this.$el.find('.kdo-removeItem'),function(dom) {
      return {
        name: $(dom).data('name') + "",
        value: $(dom).data('value') + ""
      }
    });
  }


  return KdoDSelect;

})
