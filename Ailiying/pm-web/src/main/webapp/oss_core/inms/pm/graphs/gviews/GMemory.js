///oss_core/inms/pm/graphs/gviews/GMemory.js
define(["oss_core/inms/pm/graphs/gviews/raphael-min"], function(Snap) {
  var GMemory = function(props) {

    this.props = props;
  }
  GMemory.prototype.render = function() {
    console.log("GMemory", this.props)
    var $el = this.props.$el;
    var w = $el.width();
    var h = $el.height();
    var option = this.createOption()
    console.log(option)
    if (option) {
      this.drawChart($el[0], option, w, h);
    }
  }
  GMemory.prototype.createOption = function() {
    if (!this.props.topInfo) return null;
    if (this.props.topInfo.length <= 0) return null;
    var firstTop = this.props.topInfo[0];
    var xAxis = this.props.xAxis;
    if (!firstTop) return null;
    if (!xAxis) return null;

    var datas = fish.map(this.props.datas, function(d) {
      var item = {};
      item.xAxis = d[xAxis.value];
      if (xAxis.dataType == 2) {
        try {
          var time = fish.dateutil.format(new Date(item.xAxis), 'mm-dd');
          item.xAxis = time;
        } catch (e) {

        }
      }
      item.value = d[firstTop.value];
      return item;
    })
    console.log("GMemory 2", firstTop, xAxis, datas)

    var option = {
      'datas': datas,
      'name': firstTop.name,
      'color': firstTop.color
    }
    return option;
  }
  GMemory.prototype.drawChart = function(dom, option, w, h) {
    Raphael.el.is = function(type) {
      return this.type == ('' + type).toLowerCase();
    };
    Raphael.el.x = function(val) {
      return this.is('circle') ?
        this.attr('cx', val) :
        this.attr('x', val);
    };
    Raphael.el.y = function(val) {
      return this.is('circle') ?
        this.attr('cy', val) :
        this.attr('y', val);
    };
    Raphael.el.pin = function() {
      this.data(
        'ox', this.is('circle') ?
        this.attr('cx') :
        this.attr('x'));
      this.data(
        'oy', this.is('circle') ?
        this.attr('cy') :
        this.attr('y'));
      return this;
    };
    var count = option.datas.length
    if (count <= 0) {
      $(dom).html("数据为空");
      return;
    }
    var paper = Raphael(dom, w, h);
    var item_w = w / 8;
    var item_h = (item_w - 7) > 0 ? item_w - 7 : item_w;


    var items = [];

    function kpiDraw(start, end) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        item.del()
      }
      items = []
      for (var i = 0; i < 7; i++) {
        if (start + i > end)
          return;

        var flag = (i == 6);
        if (start + i == end) {
          flag = true
        }
        var item_x = item_w / 2 + (i * (item_w));
        var index = start + i;
        var data = option.datas[index]
        if (!data) return;
        var name = data.xAxis || '';
        var value = data.value || 0.001;
        if (value > 1) {
          value = value / 100;
        }
        if (value > 1) {
          value = 1;
        }



        var item = item_rect(item_x, 20, item_w, item_h, name, flag, value)

        var up = items[i - 1];
        if (up) {
          item.item.up = up;
        }
        items.push(item);
      }
    }

    function darwScollbarLine(box) {
      console.log('darwScollbarLine', box)
      var px = box.width / (count - 1)
      console.log('darwScollbarLine', px)
      var data = [];
      for (var i = 0; i < count; i++) {
        var d = option.datas[i]
        var value = d.value || 0.001;
        if (value > 1) {
          value = value / 100;
        }
        if (value > 1) {
          value = 1;
        }
        var itemx = box.x + (px * i)
        var itemy = box.y + (box.height / 2) + ((box.height / 2.5) * value)
        data.push({
          'x': itemx,
          'y': itemy
        })
      }
      console.log('darwScollbarLine', data)
      var path = [
        'M', data[0].x,
        data[0].y
      ];
      //path.push('R');
      for (var i = 1, num = data.length; i < num; i += 1) {
        path.push(data[i].x);
        path.push(data[i].y);
      }
      path.push(data[data.length - 1].x, box.y + box.height);
      path.push(data[0].x, box.y + box.height);
      path.push('z');
      var curve = paper.path(path);
      curve.attr({
        'fill': '#e1e3e4',
        'stroke-width': 1,
        'stroke': '#d5d8da'
      })

      console.log('darwScollbarLine', path)

    }

    kpiDraw(0, 7);
    var scollbar = paper.rect(item_w / 2, item_h + 20 + 5 + 20, item_w * 7, 21);
    var scollBarBox = scollbar.getBBox()
    darwScollbarLine(scollBarBox);

    scollbar.attr({
      'stroke': '#dddddd'
    })
    var per_w_r=(7/count);
    if(per_w_r>1){
      per_w_r=1;
    }
    var bar_w = per_w_r * (item_w * 7)
    var bar = paper.rect(item_w / 2, item_h + 20 + 5 + 20, bar_w, 21)
    bar.attr({
      'fill': '#d0d3d9',
      'stroke-width': 1,
      'stroke': '#787a7c',
      'opacity': 0.5
    })
    bar.attr({
      "cursor": "pointer"
    });

    function pageShow() {
      var barBox = bar.getBBox();
      var allBox = scollbar.getBBox();
      var start = barBox.x;
      var end = barBox.x + barBox.width;

      var sPer = start / allBox.width;
      var ePer = end / allBox.width;
      console.log("start end", sPer, ePer)
      if (ePer > 1)
        ePer = 1;

      var sIndex = parseInt(sPer * count);
      var eIndex = parseInt(ePer * count);

      console.log("start end", sIndex, eIndex)
      kpiDraw(sIndex, eIndex);
    }

    function move(dx, dy, mx, my, ev) {
      var x = this.data('ox') + dx;
      var cb = this.getBBox();
      var b = scollbar.getBBox();
      if (x < b.x - 6) {
        x = b.x - 6
      }
      if (x + cb.width <= b.x + b.width + 10) {
        this.x(x);
        pageShow()
      }

    }

    function start() {
      this.pin();
      this.toFront();
    }

    function up() {
      console.log('up')
    }
    bar.drag(move, start, up);
    var topX = scollBarBox.width / 2;
    var topName = paper.text(topX, item_h + 20 + 5 + 20 + 20 + 20, option.name);
    topName.attr({
      'font-size': 10,
      'font-family': '微软雅黑'
    });
    var tBox = topName.getBBox();
    paper.rect(tBox.x - 15, item_h + 20 + 5 + 20 + 20 + 15, 10, 10).attr({
      'fill': '#e32133',
      'stroke-width': 0
    })
    scollBarBox

    var selItem = {};

    function item_rect(x, y, item_w, item_h, text, flag, value) {
      var bk = paper.rect(x, y - 3, item_w - 4, item_h + 6);
      bk.attr({
        'fill': '#dcdcdc',
        'stroke-width': 0,
        'stroke': '#fff'
      })

      bk.hide()
      var hoverIn = function() {
        bk.show();

      };

      var hoverOut = function() {
        bk.hide();
        //item.attr({"cursor": "default"});
      }
      var handelClick = function() {
        if (selItem.item) {
          try {

            selItem.item.attr({
              'height': item_h,
              'width': item_w,
              'y': y
            })
            selItem.per.attr({
              'height': item_h,
              'y': y
            })
            selItem.t.attr({
              'y': item_h + 30
            })
            //var selItemLine =selItem.item.line.getBBox();
            selItem.item.line.show()
            selItem.item.up.item.attr({
              width: item_w
            })
            selItem.item.up.line.attr({
              'stroke-dasharray': '. '
            })

          } catch (e) {}
        }
        item.attr({
          'height': item_h + 15,
          'width': item_w - 5,
          'y': y - 5
        });
        selItem.item = item;
        per.attr({
          'height': item_h + 15,
          'y': y - 5
        });
        selItem.per = per;
        selItem.line = item.line;
        //var linebox =item.line.getBBox();
        item.line.hide();
        //alert(item.up.item)

        if (item.up && item.up.line) {
          //	alert(item.up.item)
          item.up.item.attr({
            width: item_w - 5
          })

          item.up.line.attr({
            'stroke-dasharray': null
          });
        }
        t.attr({
          'y': 6
        })
        selItem.t = t;
      }
      var item = paper.rect(x, y, item_w, item_h);
      item.attr({
        'fill': '#00a4f8',
        'stroke-width': 0,
        'stroke': '#fff'
      }).hover(hoverIn, hoverOut).click(handelClick)
      item.bk = bk;
      item.line = paper.rect(x + item_w - 4, y, 0.1, item_h);
      item.line.attr({
        'fill': 'red',
        'stroke': '#fff',
        'stroke-width': 1,
        'stroke-dasharray': '. '
      })
      item.attr({
        "cursor": "pointer"
      });
      if (flag) {
        item.line.hide()
      }
      var perW = item_w * value;
      var per = paper.rect(x, y, 0, item_h);
      per.attr({
        'fill': '#e32133',
        'stroke-width': 0
      }).hover(hoverIn, hoverOut).click(handelClick)
      per.attr({
        "cursor": "pointer"
      });
      per.animate({
        'width': perW
      }, 500)
      var t = paper.text(x + item_w / 2.1, item_h + 30, text);
      t.attr({
        'font-size': 10,
        'font-family': '微软雅黑'
      });
      var del = function() {
        per.remove();
        t.remove()
        item.bk.remove()
        item.line.remove()
        item.remove();
      }

      return {
        'del': del,
        'item': item,
        'line': item.line
      }
    }
  }
  GMemory.prototype.resize = function() {
    var $el = this.props.$el;
    $el.html("");
    this.render();
  }
  return GMemory;
})
