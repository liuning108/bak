define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/views/GStripLineView", "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsListLineBar"
], function(GRoot, View) {

    var GStripLine = GRoot.extend({
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
            var x = 0;
            var y = 0;
            var paper = this.paper;
            this.names = this.attrs.names || [
                'CRM下单',
                '服务单',
                '资源变更单',
                '流程启动',
                '派单',
                '归档'
            ]
            this.attrs.titleColor = this.attrs.titleColor || "#fff";
            this.attrs.lineColor = this.attrs.lineColor || '#c7f404';
            this.attrs.dotColor = this.attrs.dotColor || '#fff';
            this.attrs.labelColor = this.attrs.labelColor || '#fff';
            this.attrs.labelStyle = this.attrs.labelStyle || 1;
            this.attrs.names = this.names;
            this.attrs.datas = this.attrs.datas || this.createRandom(this.names, 99, 999);

            this.Data2Graph();
            this.linebar = paper.chartListLineBar({
                'x': x,
                'y': y,
                'titleColor': this.attrs.titleColor,
                'lineColor': this.attrs.lineColor,
                'dotColor': this.attrs.dotColor,
                'labelColor': this.attrs.labelColor,
                'labelStyle': this.attrs.labelStyle,
                'keys': this.names
            });
            this.doms['linebar'] = this.linebar.allItem();
            this.doms['config'] = this.paper.text(100, -350, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.doms['remove'] = this.paper.text(0, -350, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.initDatas();
        },
        getData: function() {

            var self = this;
            var initDatas = [];
            var intervalTime = 1000 * 60 * 5;
            fish.each(this.names, function(name) {
                initDatas.push({
                    'name': name,
                    'value': fish.random(99, 999)
                })
            })
            this.linebar.inputData(initDatas, '');

            setTimeout(function() {
                self.getData();
            }, intervalTime);
        },
        initDatas: function() {
            var self = this;
            var initDatas = [];
            var intervalTime = 1000 * 60 * 5;
            fish.each(this.names, function(name, index) {
                initDatas.push({'name': name, 'value': self.attrs.datas[index]})
            })
            console.log(initDatas)
            this.linebar.inputData(initDatas, '');

        },
        getXAxisName: function() {
            return this.attrs.names;

        },
        setXAxisName: function(datas) {
            this.attrs.names = datas;
        },
        getXAxisDatas: function() {
            return this.attrs.datas;
        },
        setXAxisDatas: function(datas) {
            this.attrs.datas = datas;
        },
        toGraph: function(choiceTreeJson) {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisName(json.xAxis.data)
            this.setXAxisDatas(json.series.data)

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 30;
            this.ft.attrs.translate.y = 380;
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

    return GStripLine;

})
