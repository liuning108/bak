define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsPie", "oss_core/pm/screendesigner/js/graphLibs/views/GAnnularView"
], function(GRoot, tpl, View) {

    var GAnnular = GRoot.extend({

        initAttrs: function() {
            this.names = this.attrs.names || [
                '乐享4G-99',
                '乐享4G-59',
                '流量升级包-30',
                '乐享4G-129',
                '乐享4G-199',
                '乐享4G-399',
                '飞Young4G-99'
            ]
            this.attrs.names = this.names;
            this.attrs.title = this.attrs.title || '当月套餐';
            this.attrs.seriesData = this.attrs.seriesData || this.createRandom(this.names, 10, 100);
            this.attrs.labelStyle = this.attrs.labelStyle || 1;
            this.attrs.bgShow = this.attrs.bgShow || false;
            this.attrs.titleColor = this.attrs.titleColor || "#ebeb6d";
            this.attrs.boradColor = this.attrs.boradColor || '#595959';
            this.attrs.ww = this.attrs.ww || 532;
            this.attrs.hh = this.attrs.hh || 377;
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
            var colors = [
                '#ff7f50',
                '#ff8212',
                '#c5ff55',
                '#30cd2f',
                '#30cd2f',
                '#5599f2',
                '#fe62ae',
                '#c050c8'
            ]
            this.Data2Graph();

            if (this.attrs.bgShow) {
                this.doms['gb'] = paper.rect(x, y, this.attrs.ww, this.attrs.hh).attr({'fill-opacity': 0, 'stroke': this.attrs.boradColor, 'stroke-width': 5, 'stroke-dasharray': '-'})
            }
            this.doms['title'] = paper.text(x + this.attrs.ww / 2, y, this.attrs.title).attr({'fill': this.attrs.titleColor, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            var pie_x = x + this.attrs.ww / 1.5;
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
                'labelStyle': this.attrs.labelStyle,
                'modes': models
            });

            this.doms['pie'] = this.pie.allitem();

            this.doms['config'] = this.paper.text(30, 30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.doms['remove'] = this.paper.text(30, 60, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            this.initData();
        },
        setXAxisNames: function(names) {
            this.attrs.names = names;
        },
        getXAxisNames: function() {
            return this.attrs.names;
        },
        setSeriesData: function(datas) {
            this.attrs.seriesData = datas;
        },
        getSeriesData: function() {
            return this.attrs.seriesData;
        },
        getData: function() {
            var self = this;
            var datas = [];
            var sum = 0;
            for (var i = 0; i < this.names.length; i++) {
                var val = fish.random(10, 100);
                datas.push({name: this.names[i], value: val})
                sum += val;
            }
            this.pie.inputData(datas);
            //alert(sum);
            var intervalTime = 1000 * 60 * 5;
            setTimeout(function() {
                self.getData();
            }, intervalTime);

        },
        initData: function() {
            var self = this;
            var datas = [];
            var sum = 0;
            for (var i = 0; i < this.names.length; i++) {
                var val = this.attrs.seriesData[i];
                datas.push({name: this.names[i], value: val})
                sum += val;
            }
            this.pie.inputData(datas);
            //alert(sum);
            var intervalTime = 1000 * 60 * 5;
            setTimeout(function() {
                self.getData();
            }, intervalTime);

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        toGraph: function(choiceTreeJson) {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisNames(json.xAxis.data)
            this.setSeriesData(json.series.data)

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

    return GAnnular;

})
