portal.define([
  'text!oss_core/pm/repository/templates/searchChoice.html', "oss_core/pm/repository/actions/Action.js"
], function(searchChoiceTpls, action) {
  return {
    liTpl: fish.compile('<li data-value="{{value}}">{{value}}</li>'),
    searchChoiceTpl: fish.compile(searchChoiceTpls),
    delay: (function() {
      var timer = 0;
      return function(callback, ms) {

        window.clearTimeout(timer);
        timer = window.setTimeout(callback, ms);
      };
    })(),
    tagsBlur: function(self) {
      var _this = this;
      self.$el.on('click').click(function() {
        if (_this.blurFlag) {
          self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').hide();
          self.$el.find('#multiselect_commondItemTags_multi').find('.search-field').find("input[type='text']").val("");
          $(this).val("");
        }
      })
    },
    downAction: function(self, e) {
      var _this = this;
      var $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('li')
      var $ul = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('ul');

      $lis.removeClass("action")
      var offset = $($lis[0]).position().top;
      _this.currIndex = _this.currIndex + 1;
      if (_this.currIndex >= $lis.length) {
        _this.currIndex--;
      }
      $($lis[_this.currIndex]).addClass("action");
      console.log($($lis[_this.currIndex]).position().top);
      $ul.scrollTop($($lis[_this.currIndex]).position().top - offset);
      e.preventDefault();
    },
    upAction: function(self, e) {
      var _this = this;
      var $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('li')
      var $ul = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('ul');

      $lis.removeClass("action")
      var offset = $($lis[0]).position().top;
      _this.currIndex = _this.currIndex - 1;

      if (_this.currIndex < 0) {
        _this.currIndex = 0;
      }
      $($lis[_this.currIndex]).addClass("action")
      $ul.scrollTop($($lis[_this.currIndex]).position().top - offset);
      e.preventDefault();
    },

    autoWidthInput: function(self, v, $input) {
      if (v.length <= 0)
        return;
      var maxW = self.$el.find('#multiselect_commondItemTags_multi').width();
      if ((v.length * 8) + 10 < maxW) {
        $input.width((v.length * 8) + 10);
      }

    },
    showTypeMoreTips: function(self, v) {
      var _this = this;
      if (v.length > 1)
        return;
      var $ul = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('ul');
      $ul.find('li').remove();
      _this.currIndex = 0;
      if (self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice').length >= this.maxLength) {
        $ul.append(_this.liTpl({
          value: "Already created " + _this.maxLength + " tags"
        }));
      } else {
        $ul.append(_this.liTpl({
          value: "Please enter " + (
          2 - v.length) + " or more characters"
        }));
      }
      self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').show();
      var $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('li')
      $($lis[_this.currIndex]).addClass("noresult")
      $lis.off('click').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
      })

    },
    backAction: function(self, v) {
      if (v.length <= 0) {
        //  alert('backAction')
        self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice').last().remove();
      }
    },
    queryTagsShow: function(self, v) {
      var fflag = false;
      if (self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice').length >= this.maxLength) {
        fflag = true;
      }
      var _this = this;
      var $ul = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('ul');
      $ul.find('li').remove();
      var message = (fflag)
        ? "Already created " + _this.maxLength + " tags"
        : "Search....";
      $ul.append(_this.liTpl({
        value: "" + message
      }));
      _this.currIndex = 0;
      self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').show();
      var $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('li')
      $($lis[_this.currIndex]).addClass("action")

      $lis.off('click').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
      })
      if (fflag)
        return;
      _this.loadData(self, v)

    },
    loadData: function(self, v) {
      var _this = this;
      action.queryLikeTags({
        tag:v
      },function(data) {
        var result =data.result;
        var resultDatas= fish.map(result,function(d){
            return  d.ATTR_VALUE
        })

        var allData = fish.union([v],resultDatas);

        // var nums = fish.random(1, 50);
        // for (var i = 0; i < nums; i++) {
        //   allData.push({
        //     'value': v + "_" + i
        //   });
        // }
        _this.createLiHtml(allData, self)
      })
    },
    createLiHtml: function(allData, self) {
      var _this = this;
      console.log("createLiHtml");
      console.log(allData);
      var $ul = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('ul');
      $ul.find('li').remove();
      fish.each(allData, function(d) {
        $ul.append(_this.liTpl({value: d}));
      })
      var $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('li')
      $lis.css("cursor", "pointer");
      $($lis[_this.currIndex]).addClass("action")
      $lis.off('click').click(function(e) {
        var value = {
          'value': $(this).data('value')
        };
        _this.addItem(self, value);
        e.stopPropagation();
        e.preventDefault();
      })

    },

    addItem: function(self, value, flag) {
      var _this = this;
      if (self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice').length >= this.maxLength) {
        return;
      }
      var $context = self.$el.find('#multiselect_commondItemTags_multi').find('.search-field');
      var $item = $(_this.searchChoiceTpl(value)).insertBefore($context);
      $item.find('.close').off('click').on('click', function() {
        $item.remove();
        self.$el.find('#multiselect_commondItemTags_multi').find('.search-field').find("input[type='text']").focus();
      })

      self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').hide();
      self.$el.find('#multiselect_commondItemTags_multi').find('.search-field').find("input[type='text']").val("");
      if (!flag) {
        self.$el.find('#multiselect_commondItemTags_multi').find('.search-field-input').focus()
      }
      _this.currIndex = 0;
    },
    enterAction: function(self, e) {
      var _this = this;
      var $li = self.$el.find('#multiselect_commondItemTags_multi').find('.select-tag-drop-mask').find('.action');
      if ($li.length <= 0)
        return;
      var value = {
        'value': $li.data('value')
      };
      _this.addItem(self, value);
    },
    setValues: function(self, datas) {
      var _this = this;
      self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice').remove();
      fish.each(datas, function(d) {
        var value = {
          'value': d
        }
        _this.addItem(self, value, true);
      })

    },
    getValues: function(self) {
      $lis = self.$el.find('#multiselect_commondItemTags_multi').find('.search-choice');
      var values = fish.map($lis, function(li) {
        return $(li).data('value');
      })

      return values;
    },
    newRepsitorytags: function(self, nums) {
      this.currIndex = 0;
      this.blurFlag = false;
      this.maxLength = nums;
      var _this = this;

      _this.tagsBlur(self); //失支焦点时动作
      self.$el.find('#multiselect_commondItemTags_multi').off('click').on('click', function() {
        $(this).find('.search-field').find("input[type='text']").focus();
      })

      self.$el.find('#multiselect_commondItemTags_multi').find('.search-field').find("input[type='text']").off('keydown').off('keyup').off('blur').off('focus').blur(function() {
        _this.blurFlag = true;
      }).focus(function(e) {
        _this.blurFlag = false;
        var v = $(this).val();
        _this.showTypeMoreTips(self, v);
      }).keydown(function(e) {

        var keyNum = e.which;
        if (keyNum == 40) {
          //_this.downAction(self, e);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        //up
        if (keyNum == 38) {
          //_this.upAction(self, e);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      }).keyup(function(e) {
        var $input = $(this);
        var v = $(this).val();
        var w = $(this).width();
        _this.autoWidthInput(self, v, $(this));
        _this.showTypeMoreTips(self, v);

        var keyNum = e.which;
        if (keyNum == 8) {
          _this.backAction(self, v);
        }
        //down
        if (keyNum == 40) {
          _this.downAction(self, e);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        //up
        if (keyNum == 38) {
          _this.upAction(self, e);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        //enter
        if (keyNum == 13) {
          _this.enterAction(self, e);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }

        if (v.length > 1) {
          _this.delay(function() {
            v = $input.val();
            if (v.length > 1) {
              _this.queryTagsShow(self, v); //查询并显示
            }
          }, 600);
        }

      })

      return _this;

    } // end of
  }
});
