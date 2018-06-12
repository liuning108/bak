define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/todayLoadNumberClass", "oss_core/pm/screendesigner/js/graphLibs/views/GPileBarView"
], function(GRoot, tpl, View) {
    var GPileBar = GRoot.extend({
        initAttrs: function() {
            this.attrs.dbServer = this.attrs.dbServer || {
                'serverName': 'NetworkOverviewDemoQryService',
                'islocal': true,
                'xAxis': ['field_1'],
                'yAxis': [
                    'field_2', 'field_3'
                ],
                'xNums': 1,
                'yNums': 2,
                'xMinNums': 1,
                'yMinNums': 2
            }
        },
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
            this.attrs.titleColor = this.attrs.titleColor || "#ebeb6d"
            this.attrs.chartColor = this.attrs.chartColor || "#fff"
            this.attrs.valueColor = this.attrs.valueColor || '#fff';
            this.attrs.labelStyle = this.attrs.labelStyle || 1;
            this.attrs.c1Color = this.attrs.c1Color || '#00a0e9';
            this.attrs.c2Color = this.attrs.c2Color || '#e89f21';
            this.attrs.bgShow = this.attrs.bgShow || false;
            this.attrs.bgColor = this.attrs.bgColor || "#595959"
            this.attrs.ww = this.attrs.ww || 532;
            this.attrs.hh = this.attrs.hh || 377;
            this.attrs.title = this.attrs.title || ''
            this.xAxisNames = this.attrs.xAxisNames ;
            this.attrs.xAxisNames = this.xAxisNames;
            this.attrs.datas = this.attrs.datas || [
                this.createRandom(this.xAxisNames, 100, 300),
                this.createRandom(this.xAxisNames, 100, 300)
            ]
            this.attrs.labels = this.attrs.labels || ['3G', '4G'];

            this.Data2Graph()

            //  this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x,y,532,377);
            if (this.attrs.bgShow == true) {
                this.doms['gb'] = paper.rect(x, y, this.attrs.ww, this.attrs.hh).attr({'fill-opacity': 0, 'stroke': this.attrs.bgColor, 'stroke-width': 5, 'stroke-dasharray': '-'})
            }
            this.doms['title'] = paper.text(x + this.attrs.ww / 2, y, this.attrs.title).attr({'fill': this.attrs.titleColor, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            var loadNumber = new todayLoadNumberClass(paper, {
                'x': x + 82,
                'y': y + 30,
                'element_width': 180,
                'element_high': 24,
                'element_distance': 26,
                'chartColor': this.attrs.chartColor,
                'valueColor': this.attrs.valueColor,
                'c1Color': this.attrs.c1Color,
                'c2Color': this.attrs.c2Color
            });
            for (var i = 0; i < this.xAxisNames.length; i++) {
                var name = this.xAxisNames[i]
                 loadNumber.add({'name': name, 'value_3g': this.attrs.datas[0][i], 'value_4g': this.attrs.datas[1][i]
                })
            }

            loadNumber.show();

            this.doms['loadNumber'] = loadNumber.allitem();

            var topBBox=this.doms['loadNumber'].getBBox(true);


        var max_box=this.getMaxWidth([this.attrs.labels[0],this.attrs.labels[1]]);

            var title3G = paper.text(topBBox.x+topBBox.width+90, y + 45, this.attrs.labels[0]).attr({'fill': this.attrs.c1Color, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            this.doms['title3G'] = title3G;
            var v1 =title3G.getBBox(true);
            var title4G = paper.text(v1.width+v1.x+max_box.width/1.5 , y + 45, this.attrs.labels[1]).attr({'fill': this.attrs.c2Color, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            this.doms['title4G'] = title4G;
           var v2 =title4G.getBBox(true);
             var vkpi =loadNumber.getSum();
             var n_nums =19;

            var sum3gkpi = new sumkpi(paper, {
                'currentvalue': vkpi.sum_3g,
                'rate': vkpi.rate3,
                'nums': n_nums,
                'item_high': 5,
                'x': topBBox.x+topBBox.width+90/2,
                'y': y + 72,
                'item_width': 50,
                'space_high': 15,
                'fill': this.attrs.c1Color,
                'chartColor': this.attrs.chartColor

            });

            sum3gkpi.show();
            this.doms['sum3gkpi'] = sum3gkpi.allitem();



            var sum4gkpi = new sumkpi(paper, {
                'currentvalue': vkpi.sum_4g,
                'rate': vkpi.rate4,
                'nums': n_nums,
                'item_high': 5,
                'x': v2.x+v2.width/2-50/2,
                'y': y + 72,
                'item_width': 50,
                'space_high': 15,
                'fill': this.attrs.c2Color,
                'chartColor': this.attrs.chartColor
            });
            sum4gkpi.show();
            this.doms['sum4gkpi'] = sum4gkpi.allitem();

            this.loadNumber = loadNumber;
            this.sum3gkpi = sum3gkpi;
            this.sum4gkpi = sum4gkpi;

            this.doms['config'] = this.paper.text(30, 30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.doms['remove'] = this.paper.text(30, 60, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

        },
        getMaxWidth:function(arry){
            var max=0;
            var text="";
            for (var i=0;i<arry.length;i++){
                if(arry[i].length>max){
                 text=arry[i];
                 max=arry[i].length;
                }
            }
            var tt=this.paper.text(0, 0, text).attr({'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            var box =tt.getBBox(true);
            tt.remove();
            return box

        },
        getXAxisNames: function() {
            return this.attrs.xAxisNames;
        },
        setXAxisNames: function(datas) {
            this.attrs.xAxisNames = datas;
        },
        getXAxisDatas: function() {
            return this.attrs.datas;
        },
        setXAxisDatas: function(data) {
            this.attrs.datas = data
        },
        getLabels: function() {
            return this.attrs.labels;
        },
        setLabels: function(labels) {
            this.attrs.labels = labels;
        },

        toGraph: function(choiceTreeJson) {

            try {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.labels = fish.pluck(choiceTreeJson.yAxis, 'label');
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data');
            this.setXAxisNames(json.xAxis.data);
            this.setXAxisDatas(json.series.data);
            this.setLabels(json.series.labels)
          }catch(e){
            console.log("GPileBar ToGraph");
            console.log(choiceTreeJson);
          }

        },

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
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
            }) //end of remove
        }

    })

    return GPileBar;

})
