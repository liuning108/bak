define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot",
  "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/todayLoadNumberClass",
  "oss_core/pm/screendesigner/js/graphLibs/views/GPileBarView"
], function(GRoot, tpl, View) {

  var GPileBar = GRoot.extend({
    initElement: function() {
      var x = 0;
      var y = 0;
      var paper = this.paper;
      //  this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x,y,532,377);
      this.doms['gb'] = paper.rect(x, y, 532, 377).attr({
        'fill': '#36b0c8',
        'fill-opacity': 0,
        'stroke': '#595959',
        'stroke-width': 5,
        'stroke-dasharray': '-'
      })
      this.attrs.title = this.attrs.title || 'C网今日新装量'
      this.doms['title'] = paper.text(x + 532 / 2, y, this.attrs.title).attr({
        'fill': '#ebeb6d',
        'font-size': 24,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });
      this.xAxisNames = this.attrs.xAxisNames || ['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港'];
      this.attrs.xAxisNames=this.xAxisNames;
      this.attrs.datas=this.attrs.datas||[this.createRandom(this.xAxisNames,100,300),this.createRandom(this.xAxisNames,100,300)]
      this.attrs.labels=this.attrs.labels||['3G','4G'];
      var loadNumber = new todayLoadNumberClass(paper, {
        'x': x + 82,
        'y': y + 30,
        'element_width': 180,
        'element_high': 24,
        'element_distance': 26

      });
      for (var i = 0; i < this.xAxisNames.length; i++) {
          var name =this.xAxisNames[i]
          loadNumber.add({
            'name': name,
            'value_3g': this.attrs.datas[0][i],
            'value_4g': this.attrs.datas[1][i]
          })
      }



      loadNumber.show();


      this.doms['loadNumber'] = loadNumber.allitem();
      var title3G = paper.text(x + 82 + 55 + 10 + 145 + 27, y + 45, this.attrs.labels[0]).attr({
        'fill': '#4bcaff',
        'font-size': 24,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });
      this.doms['title3G'] = title3G;
      var title4G = paper.text(x + 82 + 55 + 10 + 145 + 100 + 27, y + 45, this.attrs.labels[1]).attr({
        'fill': '#ffdb11',
        'font-size': 24,
        'font-family': '微软雅黑',
        'font-weight': 'bold'
      });
      this.doms['title4G'] = title4G;


      var sum3gkpi = new sumkpi(paper, {
        'currentvalue': 340,
        'rate': 0.05,
        'nums': 19,
        'item_high': 5,
        'x': x + 82 + 55 + 10 + 145,
        'y': y + 72,
        'item_width': 50,
        'space_high': 15,
        'fill': '#00b7ee'

      });

      sum3gkpi.show();
      this.doms['sum3gkpi'] = sum3gkpi.allitem();


      var sum4gkpi = new sumkpi(paper, {
        'currentvalue': 340,
        'rate': 0.04,
        'nums': 19,
        'item_high': 5,
        'x': x + 82 + 55 + 10 + 145 + 100,
        'y': y + 72,
        'item_width': 50,
        'space_high': 15,
        'fill': '#e89f21'

      });
      sum4gkpi.show();
      this.doms['sum4gkpi'] = sum4gkpi.allitem();


      this.loadNumber = loadNumber;
      this.sum3gkpi = sum3gkpi;
      this.sum4gkpi = sum4gkpi;





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
      this.loadNumber.animate(this.sum3gkpi, this.sum4gkpi);
    },
    getXAxisNames:function () {
     return this.attrs.xAxisNames;
    },
    setXAxisNames:function (datas) {
      this.attrs.xAxisNames=datas;
    },
    getXAxisDatas:function() {
        return this.attrs.datas;
    },
    setXAxisDatas:function(data) {
        this.attrs.datas=data
    },
    getLabels:function () {
        return this.attrs.labels;
    },
    setLabels:function(labels) {
         this.attrs.labels=labels;
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

  return GPileBar;


})
