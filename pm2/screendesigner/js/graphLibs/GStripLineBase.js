define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GStripLineBaseView"
], function(GRoot, View) {

    var GCharacter = GRoot.extend({
        initAttrs: function() {
            this.attrs.dbServer = this.attrs.dbServer || {
                'serverName': 'NetworkOverviewDemoQryService',
                'islocal': true,
                'xAxis': ['field_1'],
                'yAxis': ['field_2'],
                'xNums': 1,
                'yNums': 1,
                'xMinNums': 1,
                'yMinNums': 1
            }
        },
        initElement: function() {
            var self = this;
            var title = this.attrs.title || '文字名称';
            this.attrs.titleColor = this.attrs.titleColor || '#f9ffd0';
            this.attrs.axisColor = this.attrs.axisColor || '#11bde8';
            this.attrs.lineColor = this.attrs.lineColor || '#11bde8';
            this.attrs.dotColor = this.attrs.dotColor || '#11bde8';
            this.attrs.areaColor = this.attrs.areaColor || '#164e62';
            this.attrs.unit = this.attrs.unit || '';
            this.attrs.unitx = this.attrs.unitx || '';
            this.attrs.labelStyle=this.attrs.labelStyle||1;
            var paper = this.paper;
            this.attrs.xAxisNames = this.attrs.xAxisNames || this.createSeqNums(2008, 10);
            this.attrs.xAxisDatas = this.attrs.xAxisDatas || this.createRandom(this.attrs.xAxisNames, 10, 90);

            var max =Math.round(fish.max(this.attrs.xAxisDatas));

            var smax =""+max
            if (smax.length>1){
            var twonums =Number(smax[smax.length-2]+smax[smax.length-1])
               max =max+(100-twonums);
            }else{
              max =10;
            }
            var n = this.attrs.xAxisNames.length;
            var items = [];
            var x = 0;
            var y = 0;
            var w = 15;
            var h = 140;
            var space_w = 20;
            var r = 5;

            this.doms['y_axis'] = paper.rect(x, y, 1, h).rotate(180, x, y).attr({'stroke': this.attrs.axisColor, 'stroke-width': 2});
            //var max=6000;

            var box_w =this.getBox(Math.floor(max)+this.attrs.unit).width;
            var step = 5;
            var step_num = max/step;
            var step_h = h / (step);
            for (var i = 0; i <= step; i++) {
                var step_y = -(step_h * i);
                var num = step_num * i
                this.doms['y_axis_num' + i] = paper.text(x, step_y, num+this.attrs.unit).attr({'fill': this.attrs.titleColor, 'font-size': 12, 'font-family': '微软雅黑'});;
                var box = this.doms['y_axis_num' + i].getBBox();
                this.doms['y_axis_num' + i].attr({
                    'x': x - box_w
                });
            }

            space_w=this.getBox(this.getMaxLength(this.attrs.xAxisNames)).width;
            this.doms['x_axis'] = paper.rect(x, y, (w + space_w) * n, 1).attr({'stroke': this.attrs.axisColor, 'stroke-width': 2});
            for (var i = 0; i < n; i++) {
                var vvalue =this.attrs.xAxisDatas[i] ;
                var per = vvalue / max;
                var item = this.createPointItem(i, x+r, y, w, h, space_w, r, per, this.attrs.xAxisNames[i],vvalue);
                items.push(item);
                this.doms['item' + i] = item.set;
            }
            var firstItem = items[0];
            var lastItem = items[items.length - 1];
            var curve_path = ['M', firstItem.x, firstItem.y];
            var bg_path = ['M', x, y];

            curve_path.push('L');
            bg_path.push('L');
            bg_path.push(firstItem.x);
            bg_path.push(firstItem.y);
            for (var i = 1; i < items.length; i++) {
                var item = items[i];
                curve_path.push(item.x);
                curve_path.push(item.y);
                bg_path.push(item.x);
                bg_path.push(item.y);

            }
            bg_path.push(lastItem.x);
            bg_path.push(y);
            bg_path.push('z');

            var curve = paper.path(curve_path).attr({'stroke': this.attrs.lineColor, 'stroke-width': 1});
            var bgPath = paper.path(bg_path).attr({'fill': this.attrs.areaColor, 'stroke-width': 0, 'opacity': 0.4});
            this.doms['curve'] = curve;
            this.doms['bgPath'] = bgPath;

            this.doms['config'] = this.paper.text(100, -30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.doms['remove'] = this.paper.text(160, -30, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

        },

        getMaxLength:function(names) {
              var   len = 0;
              var  result = "";
             for (var i=0;i<names.length;i++){
                 var name = ""+names[i];
                 if(name.length>len){
                    len =name.length;
                    result= name;
                 }
             }
             return result;
        },

        getData:function(){
              var self = this;
              var run =function(){
                self.dbHelper.getServiceDataInfo(self).done(
                     function(data){
                             self.Data2Graph();
                             self.initObjetGraph();
                             setTimeout(function() {
                                run();
                             }, 1000*30);
                     }
                )
              }

            setTimeout(function() {
               run();
            }, 1000*30);

        },

        getXAxisNames: function() {
            return this.attrs.xAxisNames;
        },
        setXAxisNames: function(datas) {
            this.attrs.xAxisNames = datas;
        },
        getXAxisDatas: function() {
            return this.attrs.xAxisDatas;
        },
        setXAxisDatas: function(datas) {
            this.attrs.xAxisDatas = datas;
        },
        getBox: function(val) {

            var text = this.paper.text(0, 0, val).attr({'fill': '#fff', 'font-size': 12, 'font-family': '微软雅黑'})
            var box = text.getBBox();
            text.remove();
            return box;
        },
        createPointItem: function(i, x, y, w, h, space_w, r, per, name,vvalue) {
            var self = this;
            var paper = this.paper;
            var item = {};
            item.set = paper.set();
            item.x = x + (i * (w + space_w));
            item.y = y - (h * per);
            item.circle = paper.circle(item.x, item.y, r).attr({"stroke-width": 0, 'fill': this.attrs.dotColor});
            item.name = paper.text(item.x, y + 15, name).attr({'fill': this.attrs.titleColor, 'font-size': 12, 'font-family': '微软雅黑'});

            if(this.attrs.labelStyle==1){
            item.value = paper.text(item.x, item.y - 15, vvalue+self.attrs.unitx).attr({'fill': this.attrs.titleColor, 'font-size': 10, 'font-family': '微软雅黑'});
            item.set.push(item.value);
            }
            item.set.push(item.name);
            item.set.push(item.circle);

            return item;
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

        getTitle: function() {
            return this.attrs.title;
        },
        getTitleColor: function() {
            return this.attrs.titleColor;
        },

        toGraph: function(choiceTreeJson) {
          try {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisNames(json.xAxis.data)
            this.setXAxisDatas(json.series.data)
          }catch(e){
            console.log("GStripLineBase ToGraph");
            console.log(choiceTreeJson);
          }

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

    return GCharacter;

})
