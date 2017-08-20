define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/raphael-areaLineBar", "oss_core/pm/screendesigner/js/graphLibs/views/GBarView"
], function(GRoot, tpl, View) {

    var GBar = GRoot.extend({
        initAttrs: function() {
            this.attrs.switch = this.attrs.switch || false;
            this.attrs.normalText = this.attrs.normalText || '正常'
            this.attrs.urgencyText = this.attrs.urgencyText || '紧急'
            this.attrs.riskText = this.attrs.riskText || '危险'
            this.attrs.normalColor = this.attrs.normalColor || '#ffffff'
            this.attrs.urgencyColor = this.attrs.urgencyColor || '#ffcc00';
            this.attrs.riskColor = this.attrs.riskColor || '#ff3600';
            this.attrs.normalValue = this.attrs.normalValue || 40;
            this.attrs.urgencyValue = this.attrs.urgencyValue || 70;
            this.attrs.riskValue = this.attrs.riskValue || 90;
            this.attrs.titleColor = this.attrs.titleColor || '#ebeb6d';
            this.attrs.labelColor = this.attrs.labelColor || '#fff';
            this.attrs.valueColor = this.attrs.valueColor || '#fff'
            this.attrs.LineColor = this.attrs.LineColor || '#51f711';
            this.attrs.bgShow = this.attrs.bgShow || false;
            this.attrs.bgColor = this.attrs.bgColor || '#595959'
            this.attrs.ww = this.attrs.ww || 532;
            this.attrs.hh = this.attrs.hh || 377;
            this.xAxisNames = this.attrs.xAxisNames || [
                '南京',
                '无锡',
                '徐州',
                '常州',
                '苏州',
                '南通',
                '淮安',
                '盐城',
                '扬州',
                '镇江',
                '泰州',
                '宿迁',
                '连云港'
            ];
            this.attrs.xAxisNames = this.xAxisNames;
            this.attrs.datas = this.attrs.datas || this.createRandom(this.xAxisNames, 10, 90);
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
            var x = 0;
            var y = 0;
            var paper = this.paper;

            this.Data2Graph()

            if (this.attrs.bgShow == true) {
                this.doms['gb'] = paper.rect(x - 25, y - 140, this.attrs.ww, this.attrs.hh).attr({'fill-opacity': 0, 'stroke': this.attrs.bgColor, 'stroke-width': 5, 'stroke-dasharray': '-'})
            }

            this.attrs.title = this.attrs.title || 'C网超3分钟未峻工量';
            this.doms['title'] = this.paper.text(x + 240, y - 140, this.attrs.title).attr({'fill': this.attrs.titleColor, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});

            var v_colors = [this.attrs.normalColor, this.attrs.normalColor, this.attrs.normalColor];
            if (this.attrs.switch) {
                v_colors = [this.attrs.normalColor, this.attrs.urgencyColor, this.attrs.riskColor]
            }
            this.top = this.paper.areaLineBar({
                'keys': this.xAxisNames,
                'x': x,
                'y': y,
                'waring': [
                    this.attrs.normalValue, this.attrs.urgencyValue, this.attrs.riskValue
                ],
                'colors': v_colors,
                'labelColor': this.attrs.labelColor,
                'valueColor': this.attrs.valueColor,
                'LineColor': this.attrs.LineColor
            });
            this.doms['rect'] = this.top.allItem;
            this.doms['nums'] = paper.chartsNumbser({
                'x': x + 235,
                'y': y - 92,
                'value': 794,
                attrs: {
                    'fill': this.attrs.valueColor,
                    'font-size': 36,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                }
            });

            if (this.attrs.switch) {

                this.doms['label_1'] = paper.text(x + 184, y + 195, this.attrs.normalText).attr({'fill': this.attrs.normalColor, 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});
                this.doms['label_1_rect'] = paper.rect(x + 140, y + 185, 20, 20).attr({'fill': this.attrs.normalColor, opacity: '0.4'});

                this.doms['label_2'] = paper.text(x + 184 + 65, y + 195, this.attrs.urgencyText).attr({'fill': this.attrs.urgencyColor, 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});
                this.doms['label_2_rect'] = paper.rect(x + 140 + 65, y + 185, 20, 20).attr({'fill': this.attrs.urgencyColor, opacity: '0.4'});

                this.doms['label_3'] = paper.text(x + 184 + 65 + 65, y + 195, this.attrs.riskText).attr({'fill': this.attrs.riskColor, 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});
                this.doms['label_3_rect'] = paper.rect(x + 140 + 65 + 65, y + 185, 20, 20).attr({'fill': this.attrs.riskColor, opacity: '0.4'});
            }

            this.doms['config'] = this.paper.text(0, y - 92, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.doms['remove'] = this.paper.text(0, y - 72, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.initDatas();

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },

        getData: function() {
            var self = this;
            var datas = [];
            for (var i = 0; i < this.xAxisNames.length; i++) {

                datas.push({
                    name: this.xAxisNames[i],
                    value: fish.random(10, 100)
                })
            }
            var intervalTime = 1000 * 60 * 5;
            this.top.inputData(datas)
            setTimeout(function() {
                self.getData();
            }, intervalTime);
        },

        getXAxisDatas: function() {
            return this.attrs.datas;
        },
        setXAxisDatas: function(datas) {
            this.attrs.datas = datas;
        },
        initDatas: function() {
            var self = this;
            var datas = [];
            for (var i = 0; i < this.xAxisNames.length; i++) {

                datas.push({name: this.xAxisNames[i], value: this.attrs.datas[i]})
            };
            this.top.inputData(datas)
        },
        //TODO  获得X轴的名称
        getXAxisNames: function() {
            return this.attrs.xAxisNames;
        },
        toGraph: function(choiceTreeJson) {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisNames(json.xAxis.data)
            this.setXAxisDatas(json.series.data)

        },
        setXAxisNames: function(names) {
            this.attrs.xAxisNames = names;
            //  this.redraw();
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

    return GBar;

})
