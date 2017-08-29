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
    var showLabel = config.showLabel || '';
    var format = config.format || false;
    var doneFun =config.donefun||function(){};
    this.customAttributes.charsbarnum = function(num, num2) {
      var label = this.data('label');
      var result = '';
      result=Number(num).toFixed(1);
      affix_num=result.split(".")[1];
      if(affix_num==0){
          result=result.split(".")[0];
      }
      return {
        'text': result+label

      }
    }
    var numobj = this.text(x, y, 0).attr(attrs)
    numobj.data('label', showLabel);
    numobj.attr({
      'charsbarnum': [0, 1]
    });


    function setValue(val,fun) {
      value = val;
      numobj.attr("charsbarnum", [0, 1]);
      numobj.animate({
        'charsbarnum': [value, 1]
    }, 2000,function(){
            if(fun)fun();
    });
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

    setValue(value,doneFun);
    // var result={
    //    'setValue':setValue,
    //    'getValue':getValue,
    //     'numobj':numobj
    // }
    numobj.setValue = setValue;
    numobj.getValue = getValue;

    numobj.setUnit=function(unit,fun){
       numobj.data('label', unit);
       numobj.setValue(value,fun||function(){});
    }
    return numobj;
  }
}));
