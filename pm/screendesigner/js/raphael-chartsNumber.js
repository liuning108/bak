(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['oss_core/pm/screendesigner/js/raphael-min'], function(Raphael) {
      return factory(Raphael || root.Raphael);
    });
  } else {
    factory(Raphael);
  }
}(this, function(Raphael) {
  Raphael.fn.chartsNumbser = function(config) {
    var x = config.x || 0;
    var y = config.y || 0;
    var value = config.value || 0;
    var attrs = config.attrs || {
      'fill': '#ffffff',
      'font-size': 12,
      'font-family': '微软雅黑',
      'font-weight': 'bold'
    };
    var showLabel = config.showLabel || 0;
    var format = config.format || false;
    this.customAttributes.charsbarnum = function(num, num2) {
      var label = '';
      if (num2 == 1) {
        label = "¥"
      }
      var result = '';
      if (format) {
        result = setNumberformat(Math.floor(num))
      } else {
        result = Math.floor(num);
      }
      return {
        'text': label + result,

      }
    }
    var numobj = this.text(x, y, 0).attr(attrs).attr({
      'charsbarnum': [0, showLabel]
    });

    function setValue(val) {
      value = val;
      numobj.attr("charsbarnum", [0, showLabel]);
      numobj.animate({
        'charsbarnum': [value, showLabel]
      }, 2000);
    }

    function getValue() {
      return value;
    }


    function setNumberformat(value) {
      var value = "" + value;
      var length = value.length;
      var subarray = [];
      while (length > 3) {
        var substr = value.substr(length - 3, 3)
        subarray[subarray.length] = substr;
        length = length - 3;
      }

      var substr = value.substr(0, length);
      var result = substr + "," + subarray.reverse().join(',');

      return result;
    }

    setValue(value);
    // var result={
    //    'setValue':setValue,
    //    'getValue':getValue,
    //     'numobj':numobj
    // }
    numobj.setValue = setValue;
    numobj.getValue = getValue;
    return numobj;
  }
}));
