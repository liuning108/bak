define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GPieRingView", "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-workflowPie"
], function(GRoot, View) {

    var GPieRing = GRoot.extend({
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
            var paper = this.paper;
            var x = 0;
            var y = 0;
            this.names = this.attrs.names || [
                'CRM下单',
                '服务单',
                '资源变更单',
                '流程启动',
                '派单',
                '归档'
            ]
            this.attrs.names = this.names;
            this.attrs.seriesData = this.attrs.seriesData || this.createRandom(this.attrs.names, 10, 100);
            this.attrs.labelStyle = this.attrs.labelStyle || 1;
            var colors = [
                '#f89d2c',
                '#f299bd',
                '#e8410e',
                '#30cd2f',
                '#dbdb01',
                '#8e228f'
            ]

            this.Data2Graph();

            var modes = [];
            for (var i = 0; i < this.names.length; i++) {
                var name = this.names[i];
                var color = colors[i % colors.length];
                modes.push({'name': name, 'color': color})
            }

            this.pie = paper.workflowPie({
                'x': x,
                'y': y,
                'r': 70,
                'listx': x - 300,
                'listy': y - 190,
                'labelStyle': this.attrs.labelStyle,
                'modes': modes
            });
            this.attrs.title = this.attrs.title || '流程总数'
            this.doms['title'] = paper.text(x, y - 20, this.attrs.title).attr({'fill': '#ffffff', 'font-size': 23, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            this.doms['nums'] = paper.chartsNumbser({
                'x': x,
                'y': y + 10,
                'value': 0,
                attrs: {
                    'fill': '#ffffff',
                    'font-size': 24,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

            this.doms['pie'] = this.pie.allItem();

            this.doms['config'] = this.paper.text(-140, -230, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.doms['remove'] = this.paper.text(-100, -230, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.initData();

            //this.doms['rect'] = this.paper.rect(0, 0, 100, 100).attr('fill', 'red');

            //this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;

        },
        getXAxisNames: function() {
            return this.attrs.names;
        },
        setXAxisNames: function(datas) {
            this.attrs.names = datas;
        },
        getSeriesData: function() {
            return this.attrs.seriesData;
        },
        setSeriesData: function(datas) {
            this.attrs.seriesData = datas;
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        
        toGraph: function(choiceTreeJson) {
          try{
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisNames(json.xAxis.data)
            this.setSeriesData(json.series.data)
          }catch(e){
            console.log("GPieRing ToGraph");
            console.log(choiceTreeJson);
          }

        },
        initData: function() {
            var self = this;
            var datas = [];
            var sum = 0;
            for (var i = 0; i < this.names.length; i++) {
                var val = self.attrs.seriesData[i]
                datas.push({name: this.names[i], value: val})
                sum += val;
            }
            this.pie.inputData(datas, function() {
                self.doms['nums'].setValue(sum);
            });
            //alert(sum);

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

    return GPieRing;

})
