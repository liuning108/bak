define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot",
  "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsPie",
  "oss_core/pm/screendesigner/js/graphLibs/views/GAnnularView"
], function(GRoot, tpl, View) {

  var GAnnular = GRoot.extend({
    initElement: function() {
      var x = 0;
      var y = 0;
      var paper = this.paper;
      this.names = this.attrs.names || ['乐享4G-99', '乐享4G-59', '流量升级包-30', '乐享4G-129', '乐享4G-199', '乐享4G-399', '飞Young4G-99']
      this.attrs.title = this.attrs.title || '当月套餐';

      var colors = ['#ff7f50', '#ff8212', '#c5ff55', '#30cd2f', '#30cd2f', '#5599f2', '#fe62ae', '#c050c8']
      //	this.doms['gb'] = paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png', x, y, 532, 377);
      this.doms['gb'] = paper.rect(x, y, 532, 377).attr({
        'fill': '#36b0c8',
        'fill-opacity': 0,
        'stroke': '#595959',
        'stroke-width': 5,
        'stroke-dasharray': '-'
      })
      this.doms['title'] = paper.text(x + 532 / 2, y, this.attrs.title).attr({
        'fill': '#ebeb6d',
        'font-size': 24,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });
      var pie_x = x + 532 / 1.5;
      var pie_y = y + 377 / 2;
      var r = 100;
      var models = [];
      fish.each(this.names, function(name, index) {
        models.push({
          'name': name,
          'color': colors[index % colors.length]
        })
      })


      this.pie = paper.chartsPie({
        'x': pie_x,
        'y': pie_y,
        'r': r,
        'listx': pie_x - 2 * r,
        'listy': pie_y - 1.5 * r,
        'modes': models
      });

      this.doms['pie'] = this.pie.allitem();

      this.doms['config'] = this.paper.text(30, 30, '配置').attr({
        'fill': 'red',
        'font-size': 18,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });;

      this.doms['remove'] = this.paper.text(30, 60, '删除').attr({
        'fill': 'red',
        'font-size': 18,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });;
    },
    getData: function() {
      var self = this;
      var datas = [];
      var sum = 0;
      for (var i = 0; i < this.names.length; i++) {
        var val = fish.random(10, 100);
        datas.push({
          name: this.names[i],
          value: val
        })
        sum += val;
      }
      this.pie.inputData(datas);
      //alert(sum);
      var intervalTime=1000*60*5;
      setTimeout(function() {
        self.getData();
      }, intervalTime);

    },
    initLocation: function() {
      this.ft.attrs.translate.x = 20;
      this.ft.attrs.translate.y = 30;
    },

    addEvent: function() {
      var self = this;



      // TODO:配置属性(node)
      this.doms['config'].click(function(e) {
        var view = new View(self);
        view.render();
        var $panel = $('.configPanel');
        $panel.html(view.$el.html());
        view.afterRender();
        self.ConfigEffect();
        e.stopImmediatePropagation();
      });


      // TODO:配置删除(node)
      this.doms['remove'].click(function(e) {
        fish.confirm('确认是否删除该组件').result.then(function() {
          self.remove();
        });
        e.stopImmediatePropagation();
      }) //end of remove


    }

  })

  return GAnnular;


})
