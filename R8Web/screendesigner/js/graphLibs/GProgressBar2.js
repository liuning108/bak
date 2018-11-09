define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GProgressBarView2"
], function(GRoot, View) {

  var GProgressBar2 = GRoot.extend({
      initAttrs: function() {
          this.attrs.dbServer = this.attrs.dbServer||{
            'serverName': 'NetworkOverviewDemoQryService',
            'islocal': true,
            'xAxis': [],
            'yAxis': ['field_2'],
            'xNums': 0,
            'yNums': 1,
            'xMinNums': 0,
            'yMinNums': 1

          }
      },
    initElement: function() {
      var self = this;
      var title = this.attrs.title || '文字名称22';
      var titleColor = this.attrs.titleColor || '#e7e7e7';
      var processColor = this.attrs.processColor || '#01b1f1';
      this.attrs.memberTitle = this.attrs.memberTitle || '增幅';
      this.attrs.denominatorTitle = this.attrs.denominatorTitle || '总量'
      this.attrs.processColor = processColor;
      var paper = this.paper;
      var set = paper.set();
      var x = 0;
      var y = 0;
      var w = 400;
      var h = 12;
      var num1 = this.attrs.num || 0;
      this.attrs.num = num1;

      this.Data2Graph()
      if(num1<0)num1=0;
      if(num1>100)num1=100;
      var perValue = num1

      var rect = paper.rect(x, y, w, h, 6).attr({'fill': '#e7e7e7', 'stroke-width': 0});
      var rectBBox =rect.getBBox(true);

      var p_w = w * (perValue / 100);
      this.process = paper.rect(x, y, 0, h, 6).attr({'fill': processColor, 'stroke-width': 0});

      this.process.animate({
        "width": p_w
      }, 1900);
      set.push(rect);
      set.push(this.process);
      this.doms['process'] = set;

      var title_x = x + 40;
      var title_y = y - 20;
      this.doms['title'] = this.paper.text(title_x, title_y, title).attr({'fill': titleColor, 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

      var nums_x = title_x + (w / 1.5);
      var nums_y = title_y;
      // this.doms['nums'] = this.paper.chartsNumbser({
      //   'x': nums_x,
      //   'y': nums_y,
      //   'value': num1,
      //   'showLabel': '',
      //   attrs: {
      //     'fill': titleColor,
      //     'font-size': 20,
      //     'font-family': '微软雅黑',
      //     'font-weight': 'bold'
      //   }
      // });
      var nums3_x = rectBBox.width ;
      var nums3_y = nums_y;


  this.doms['nums3']=this.paper.text(nums3_x, nums3_y, perValue+'%').attr({'fill': processColor, 'font-size': 30, 'font-family': '微软雅黑', 'font-weight': 'bold'});
      // this.doms['nums3'] = this.paper.chartsNumbser({
      //   'x': nums3_x,
      //   'y': nums3_y,
      //   'value': perValue,
      //   'showLabel': '%KK',
      //   attrs: {
      //     'fill': processColor,
      //     'font-size': 30,
      //     'font-family': '微软雅黑',
      //     'font-weight': 'bold'
      //   }
      // });

      self.setTitle(title);
      self.setTitleColor(titleColor);

      this.doms['config'] = this.paper.text(100, -30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
      this.doms['remove'] = this.paper.text(160, -30, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

    },
    setFractions: function(data) {
      this.attrs.num = data[0];
    },
    getFractions: function() {
      return [this.attrs.num];
    },

    toGraph: function(choiceTreeJson) {
      try {
      var json = {}
      json.series = {}
      json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
      console.log(json.series.data);
      this.setFractions([json.series.data[0]]);
      }catch(e){
        console.log("GProgressBar ToGraph");
        console.log(choiceTreeJson);
      }
    },

    getValueUnit: function() {
      // var num2_text = this.attrs.den + '(' + this.attrs.denominatorTitle + ')';
      // return '(' + this.attrs.memberTitle + ')/' + num2_text;
    },
    getMemberTitle: function() {
      return this.attrs.memberTitle;
    },
    setMemberTitle: function(title) {
      var self = this;
      this.attrs.memberTitle = title;
    },
    getDenominatorTitle: function() {
      return this.attrs.denominatorTitle;
    },
    setDenominatorTitle: function(title) {
      var self = this;
      this.attrs.denominatorTitle = title;
    },
    initLocation: function() {
      this.ft.attrs.translate.x = 20;
      this.ft.attrs.translate.y = 30;
    },
    setTitle: function(text) {
      this.doms['title'].attr({'text': text});
      this.attrs.title = text;
    },
    setTitleColor: function(color) {
      this.doms['title'].attr({
        'fill': "" + color
      });

      console.log("" + color)
      this.attrs.titleColor = "" + color;
    },

    getProcessColor: function() {

      return this.attrs.processColor
    },

    setProcessColor: function(color) {
      this.doms['nums3'].attr({
        'fill': "" + color
      });
      this.process.attr({
        'fill': "" + color
      });

      this.attrs.processColor = "" + color;
    },
    //setProcessColor

    getTitle: function() {
      return this.attrs.title;
    },
    getTitleColor: function() {
      return this.attrs.titleColor;
    },

    addEvent: function() {
      if (!this.doms['config'])
        return;
      var self = this;
        var view = new View(self);
      // TODO:配置属性(node)
      this.doms['config'].click(function(e) {
        view.render();
        var $panel = $('.configPanel');
        $panel.html(view.$el.html());
        view.afterRender();
        self.ConfigEffect();
        e.stopImmediatePropagation();
      });
      // TODO:配置删除(node)
      this.doms['remove'].click(function(e) {
        fish.confirm(view.resource.ISDEL).result.then(function() {
          self.remove();
        });
        e.stopImmediatePropagation();
      })

    }

  })

  return GProgressBar2;

})
