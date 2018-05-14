define([
  "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/mapBase/GMapView", "oss_core/pm/screendesigner/actions/BScreenMgrAction"
], function(GRoot, View, action) {

  var GMap = GRoot.extend({
    initObjetGraph:function() {
      var self =this;
      // this.domsSet.remove();
      // this.doms = {};
      // this.domsSet=this.paper.set();
      // this.ft.unplug();
      // this.ft=null;

    self.areaEffect(this.mapBox, this.MapResult)




    },
    initAll: function() {
      var self = this;

      if (this.attrs.mapId === 'NONE') {
        self.initElement();
        self.initAllActions();
      } else {
        action.getMap({
          'id': this.attrs.mapId
        }, function(data) {
          var result = data.result;
          console.log("getMap");
          console.log(result);


          if (!result) {
            self.initElement();
          } else {
            self.initMapElement(result);
          }

          self.initAllActions();
        });
      }

    },
    initAllActions: function() {

      //this.initElement();
      this.merge();
      this.createFt();
      this.hide();
      this.addEvent();
      // TODO: 优化SVN
      if (this.canvas.perview) {
        this.perview();
        this.getData()
      } else {
        this.addBoxEvent();
        this.editDone();
      }
      this.show();
    },
    initAttrs: function() {
      var self = this;
      this.attrs.mapId = this.attrs.mapId || 'NONE';
      this.attrs.fcolor = this.attrs.fcolor || '#42a6f9'
      this.attrs.scolor = this.attrs.scolor || '#0b7abb'
      this.attrs.mapLineColor=this.attrs.mapLineColor || "#ffffff";

      this.attrs.MaxValue = this.attrs.MaxValue || 100;
      this.attrs.MinValue = this.attrs.MinValue || 0;
      this.attrs.showTitle = this.attrs.showTitle || false;
      this.attrs.showGradient = this.attrs.showGradient || false;
      this.attrs.showGradientValue = this.attrs.showGradientValue || 5;
      this.attrs.position = this.attrs.position || 'left';
      this.attrs.angle = this.attrs.angle || 0;
      this.attrs.offsetX = this.attrs.offsetX || 0;
      this.attrs.offsetH = this.attrs.offsetH || 0;
      this.attrs.isGlow =this.attrs.isGlow||false
      this.attrs.showValue = (typeof(this.attrs.showValue) === 'undefined')
        ? true
        : this.attrs.showValue;
      this.attrs.colorReversal = this.attrs.colorReversal || false;
      this.attrs.dbServer = this.attrs.dbServer || {
        'serverName': 'NetworkOverviewDemoQryService',
        'islocal': true,
        'xAxis': ['filed_map'],
        'yAxis': ['field_2'],
        'xNums': 1,
        'yNums': 1,
        'xMinNums': 1,
        'yMinNums': 1
      }
    },
    initElement: function() {
      var self = this;
      var title = this.attrs.title || '地图名称';
      var titleColor = this.attrs.titleColor || '#ddff00';
      var numColor = this.attrs.numColor || '#ffffff';
      this.attrs.value = this.attrs.value || 0;
      this.Data2Graph()
      var imgURL = "oss_core/pm/screendesigner/images/2.png";
      this.doms['title'] = this.paper.image(imgURL, 0, 0, 300, 300).toBack();
      this.doms['config'] = this.paper.text(100, -20, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
      this.doms['remove'] = this.paper.text(100, 10, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

    },
    pickHex: function(color1, color2, weight) {
      var p = weight;
      var w = p * 2 - 1;
      var w1 = (w / 1 + 1) / 2;
      var w2 = 1 - w1;
      var rgb = [
        Math.round(color1.r * w1 + color2.r * w2),
        Math.round(color1.g * w1 + color2.g * w2),
        Math.round(color1.b * w1 + color2.b * w2)
      ];
      return Raphael.color('rgb(' + rgb.join() + ')').hex;
    },
    initMapElement: function(result) {
      var self = this;
      var title = '地图生成了';
      var titleColor = this.attrs.titleColor || '#ddff00';
      var numColor = this.attrs.numColor || '#ffffff';

      this.attrs.value = this.attrs.value || 0;
      this.Data2Graph()
      this.defColor = "#CCCCCC";
      var mapBox = self.drawMap(result);
      this.mapBox=mapBox;
      this.MapResult=result;

      self.areaEffect(mapBox, result)
      this.doms['config'] = this.paper.text(100, -20, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
      this.doms['remove'] = this.paper.text(100, 10, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
    },
    drawMap: function(result) {
      var self = this;
      var MapSet = this.paper.set();
      var fcolor = this.attrs.fcolor || '#fffc37';
      var scolor = this.attrs.scolor || '#fda428';
      var lineColor =this.attrs.mapLineColor;
      console.log("draw Map ids")
      var all_str=""
      for (var i = 0; i < result.length; i++) {
        var data = result[i];

        self.doms["map_" + data.id] = this.paper.path(data.d).attr({'fill': fcolor, 'stroke': lineColor, 'stroke-width': 0.5, "fill-opacity": 1})
        self.doms["map_" + data.id].title = data.title;

        MapSet.push(self.doms["map_" + data.id]);

      }


        // for (var i = 0; i < result.length; i++) {
        //
        // }
      if(this.attrs.isGlow){
        self.doms["map_set_glow" + data.id]=MapSet.glow({
          width:5,
          color:lineColor
        });
      }
      return MapSet.getBBox();
    },

    colorsArray: function(fclr, sclr, n) {
      var self = this;
      console.log("colorsArray");
      var array = [];
      for (var i = 0; i < n; i++) {
        array[i] = 0;
      }
      array[0] = fclr.hex
      array[n - 1] = sclr.hex;
      var per = 1 / n;
      // array[1]='#2828fd';
      // array[2]='#28fdf7';
      // array[3]='#eb28fd';

      for (var i = 1; i < n - 1; i++) {
        var curPer = per * i;

        array[i] = self.pickHex(sclr, fclr, curPer)
      }
      return array;
    },
    colorStyle: function(array) {
      var per = 100 / array.length;
      var s = "90-"
      for (var i = 0; i < array.length; i++) {
        s += array[i] + ":" + per + "-"
      }
      s = s.substr(0, s.length - 1);
      return s;

    },
    areaEffect: function(mapBox, result) {
      var self = this;
      var fcolor = this.attrs.fcolor || '#fffc37';
      var scolor = this.attrs.scolor || '#fda428';
      if (this.attrs.colorReversal) {
        var temp = fcolor;
        fcolor = scolor;
        scolor = temp;
      }
      var fclr = Raphael.color(fcolor);
      var sclr = Raphael.color(scolor);
      var colorsArray = this.colorsArray(fclr, sclr, this.attrs.showGradientValue)

      var max = this.attrs.MaxValue || 1000;
      var min = this.attrs.MinValue || 0;
      var showTitle = this.attrs.showTitle;
      var showValue = this.attrs.showValue;
      var rangeValue = Math.abs(max - min);
      for (var i = 0; i < self.attrs.mapDatas.length; i++) {
        var data = {
          'id': self.attrs.mapDatas[i][0],
          'value': self.attrs.mapDatas[i][1]
        };
        var randomValue = Number(data.value)
        var per = randomValue / rangeValue;
        var color = self.pickHex(sclr, fclr, per)
        if (!self.doms["map_" + data.id])continue;

        self.doms["map_" + data.id].attr({'fill': color})
        if (showTitle) {
          var bbox = self.doms["map_" + data.id].getBBox();
          var x = bbox.x + bbox.width / 2;
          var y = bbox.y + bbox.height / 2;
          var title = self.doms["map_" + data.id].title || data.id;
          if(self.doms["map_" + data.id + "_text"]){
            self.doms["map_" + data.id + "_text"].attr({"text":title})
          }else{
            self.doms["map_" + data.id + "_text"] = this.paper.text(x, y, title).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})

          }
        }
        if (showValue) {
          var bbox = self.doms["map_" + data.id].getBBox();
          var x = bbox.x + bbox.width / 2;
          var y = bbox.y + bbox.height / 2;
          if (showTitle) {
            y = y + 20;
          }
          if(self.doms["map_" + data.id + "_value"]){
            self.doms["map_" + data.id + "_value"].attr({"text":randomValue})
          }else{
            self.doms["map_" + data.id + "_value"] = this.paper.text(x, y, randomValue).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})

          }
        }
      }
      //var s =self.colorStyle(colorsArray)
      //console.log(s);
      //alert(s);
      if (!this.drawGradient){
        this.drawGradient=false
        if (this.attrs.showGradient) {
          self.drawTipRect2(mapBox, max, min, colorsArray)
          this.drawGradient=true;
        } else {
          self.drawTipRect(mapBox, max, min, fcolor + "-" + sclr);
          this.drawGradient=true;
        }
      }
      //self.drawTipRect(mapBox,max,min,"90-#fffc37-#2828fd-#28fdf7-#eb28fd-#fda428");
      //self.drawTipRect2(mapBox,max,min,colorsArray)

    },
    drawTipRect2: function(mapBox, max, min, array) {

      var offsetX = this.attrs.offsetX;
      var offsetH = this.attrs.offsetH;
      if (this.attrs.position == 'left') {
        var mapx = mapBox.x + offsetX;
        var mapy = mapBox.y;
      } else {
        var mapx = mapBox.x + mapBox.width + offsetX;
        var mapy = mapBox.y;
      }

      var angle = this.attrs.angle;
      if (angle == 90) {
        var w = 140 + offsetH;
        var h = 20;
        var cell_h = w / array.length;
        var cellset = this.paper.set();
        for (var i = 0; i < array.length; i++) {
          var color = array[i];
          var x = mapx + (i * (cell_h));
          var y = (mapy + mapBox.height);
          var cell = this.paper.rect(x, y, cell_h, cell_h);
          cell.attr({'fill': color, 'stroke': color, 'stroke-width': 2, 'opacity': 1});
          this.doms['TipRect_cell_' + i] = cell;
          cellset.push(cell);
        }

        var rectBox = cellset.getBBox();

        var x = rectBox.x + rectBox.width / 2
        var y = rectBox.y
        this.doms['TipRect_max'] = this.paper.text(rectBox.x + rectBox.width, y + rectBox.height + 10, max).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
        this.doms['TipRect_min'] = this.paper.text(rectBox.x, y + rectBox.height + 10, min).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})

      } else {
        var w = 20;
        var h = 140 + offsetH;
        var cell_h = h / array.length;
        var cellset = this.paper.set();
        for (var i = 0; i < array.length; i++) {
          var color = array[i];
          var x = mapx - 40;
          var y = (mapy + mapBox.height - (i * (cell_h)));
          var cell = this.paper.rect(x, y, w, cell_h);
          cell.attr({'fill': color, 'stroke': color, 'stroke-width': 2, 'opacity': 1});
          this.doms['TipRect_cell_' + i] = cell;
          cellset.push(cell);
        }

        var rectBox = cellset.getBBox();

        var x = rectBox.x + rectBox.width / 2
        var y = rectBox.y
        this.doms['TipRect_max'] = this.paper.text(x, y - 10, max).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
        this.doms['TipRect_min'] = this.paper.text(x, y + rectBox.height + 10, min).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
      }
    },

    drawTipRect: function(mapBox, max, min, fillStyle) {

      var offsetX = this.attrs.offsetX;
      var offsetH = this.attrs.offsetH;
      if (this.attrs.position == 'left') {
        var x = mapBox.x + offsetX;
        var y = mapBox.y;
      } else {
        var x = mapBox.x + mapBox.width + offsetX;
        var y = mapBox.y;
      }
      var angle = this.attrs.angle;

      if (angle == 90) {
        var w = 140 + offsetH;
        var h = 20;
        fillStyle = "0-" + fillStyle;

        this.doms['TipRect'] = this.paper.rect(x - 40, y + mapBox.height - h, w, h).attr({'fill': fillStyle, 'fill-opacity': 1, 'stroke-width': 0}).show();

        //this.doms['TipRect'].rotate(90)
        var rectBox = this.doms['TipRect'].getBBox();
        this.doms['TipRect'].attr({'fill': fillStyle});
        var x = rectBox.x + rectBox.width / 2
        var y = rectBox.y
        this.doms['TipRect_max'] = this.paper.text(rectBox.x + rectBox.width, y + rectBox.height + 10, max).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
        this.doms['TipRect_min'] = this.paper.text(rectBox.x, y + rectBox.height + 10, min).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
      } else {
        var w = 20;
        var h = 140 + offsetH;
        fillStyle = "90-" + fillStyle;

        this.doms['TipRect'] = this.paper.rect(x - 40, y + mapBox.height - h, w, h).attr({'fill': fillStyle, 'fill-opacity': 1, 'stroke-width': 0}).show();
        var rectBox = this.doms['TipRect'].getBBox();
        this.doms['TipRect'].attr({'fill': fillStyle});
        var x = rectBox.x + rectBox.width / 2
        var y = rectBox.y
        this.doms['TipRect_max'] = this.paper.text(x, y - 10, max).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})
        this.doms['TipRect_min'] = this.paper.text(x, y + rectBox.height + 10, min).attr({'fill': '#fff', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'})

      }

    },

    createFt: function() {

      var self = this;
      var gbbox = this.domsSet.getBBox(true);
      if (!this.attrs.mapW) {

        this.attrs.mapW = gbbox.width;
        this.attrs.mapH = gbbox.height;
        this.attrs.mapX = gbbox.x;
        this.attrs.mapY = gbbox.y;
      }

      if (!this.canvas.perview) {
        this.gbox = this.paper.rect(gbbox.x, gbbox.y, gbbox.width, gbbox.height).attr({'fill': '#36b0c8', 'fill-opacity': 0, 'stroke-width': 0})
        this.domsSet.push(this.gbox);
      }
      this.dataErrorProcess(2000);
      this.ft = this.paper.freeTransform(this.domsSet, {
        keepRatio: true,
        'rotate': false,
        attrs: {
          'fill': '#1dd7fc',
          'stroke': '#ffffff',
          'stroke-width': 2
        },
        scale: [
          'bboxCorners', 'bboxSides'
        ],
        draw: []
      }, function(subject, events) {
        self.ftcallBack(subject, events)
      });

      if (this.attrs.ft_attrs) {

        var ox = this.attrs.ft_attrs.center.x;
        var oy = this.attrs.ft_attrs.center.y;
        this.attrs.ft_attrs.center.x = this.ft.attrs.center.x
        this.attrs.ft_attrs.center.y = this.ft.attrs.center.y
        this.attrs.ft_attrs.size.x = this.ft.attrs.size.x
        this.attrs.ft_attrs.size.y = this.ft.attrs.size.y
        this.attrs.ft_attrs.scale.x = (this.attrs.mapW * this.attrs.ft_attrs.scale.x) / gbbox.width;
        this.attrs.ft_attrs.scale.y = (this.attrs.mapH * this.attrs.ft_attrs.scale.y) / gbbox.height;
        var offset_x = ox - this.ft.attrs.center.x;
        var offset_y = oy - this.ft.attrs.center.y;
        this.attrs.ft_attrs.translate.x = this.attrs.ft_attrs.translate.x + offset_x;
        this.attrs.ft_attrs.translate.y = this.attrs.ft_attrs.translate.y + offset_y;
        this.ft.attrs = this.attrs.ft_attrs;
        this.ft.apply();
      } else {
        this.initLocation2();
      }
      this.attrs.mapW = gbbox.width;
      this.attrs.mapH = gbbox.height;
      this.attrs.mapX = gbbox.x;
      this.attrs.mapY = gbbox.y;

    },
    getValue: function() {
      return this.attrs.value;
    },
    setValue: function(val) {
      this.attrs.value = val;
    },

    toGraph: function(choiceTreeJson) {
      try {
        var self = this;
        var json = {};
        json.xAxis = {};
        console.log(choiceTreeJson);
        json.xAxis.data = choiceTreeJson.xAxis[0].data;
        json.series = {};
        json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
        console.log("Map ToGraph");
        console.log(json.xAxis.data);
        console.log(json.series.data);
        this.attrs.xAxisData = json.xAxis.data;
        this.attrs.SeriesData = json.series.data;
        this.attrs.mapDatas = fish.zip(this.attrs.xAxisData, this.attrs.SeriesData);
        console.log(this.attrs.mapDatas);
      } catch (e) {
        console.log("GPieBase ToGraph");
        console.log(choiceTreeJson);
      }

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
    setNumColor: function(color) {
      this.doms['nums'].attr({
        'fill': "" + color
      });
      this.attrs.numColor = "" + color;
    },
    getTitle: function() {
      return this.attrs.title;
    },
    getTitleColor: function() {
      return this.attrs.titleColor;
    },
    getNumColor: function() {

      return this.attrs.numColor;
    },
    addEvent: function() {
      var self = this;
      // TODO:配置属性(node)
      var view = new View(self);
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

  return GMap;

})
