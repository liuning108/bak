define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot", "text!oss_core/pm/screendesigner/templates/GRectConfig.html", "oss_core/pm/screendesigner/js/graphLibs/views/GStripBarView", "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/RegainNumsKPI"
], function(GRoot, tpl, View) {
    var GStripBar = GRoot.extend({
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
            var self =this;
            var paper = this.paper;
            this.attrs.title = this.attrs.title || '停复机在途复机量';
            this.attrs.titleColor = this.attrs.titleColor || '#ebeb6d';
            this.attrs.chartColor = this.attrs.chartColor || '#fff';
            this.attrs.valueColor = this.attrs.valueColor || '#fff';
            this.attrs.barColor = this.attrs.barColor || '#83e6fc';
            this.attrs.bgShow = this.attrs.bgShow || false;
            this.attrs.bgColor = this.attrs.bgColor || '#595959'
            this.attrs.ww = this.attrs.ww || 532;
            this.attrs.hh = this.attrs.hh || 377;
            this.attrs.xAxisNames = this.attrs.xAxisNames || [
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
            this.attrs.xAxisDatas = this.attrs.xAxisDatas || this.createRandom(this.attrs.xAxisNames, 0, 0);

            this.Data2Graph();

            if (this.attrs.bgShow == true) {
                this.doms['gb'] = paper.rect(x, y, this.attrs.ww, this.attrs.hh).attr({'fill': '#36b0c8', 'fill-opacity': 0, 'stroke': this.attrs.bgColor, 'stroke-width': 5, 'stroke-dasharray': '-'})
            }
            this.doms['title'] = paper.text(x + this.attrs.ww / 2, y, this.attrs.title).attr({'fill': this.attrs.titleColor, 'font-size': 24, 'font-family': '微软雅黑', 'font-weight': 'bold'});
            var v_setp = 1
            console.log(this.attrs.xAxisNames);
            var ww =this.getRootMaxWidth(this.attrs.xAxisNames,{'fill':'#ffffff','font-size':25,'font-family': '微软雅黑','font-weight':'bold'})

            var regainNumsKPI = new RegainNumsKPI(paper, {
                'x': x + 100,
                'y': y + 50,
                nums_width: 100,
                nums: 19,
                step: v_setp,
                waring: 80,
                error: 100,
                chartColor: this.attrs.chartColor,
                valueColor: this.attrs.valueColor,
                barColor: this.attrs.barColor,
                ww:ww/2.5
            });
            fish.each(this.attrs.xAxisNames, function(name, index) {
                regainNumsKPI.add({'name': name, 'value': self.attrs.xAxisDatas[index]});
            })
            regainNumsKPI.show();
            this.doms['regainNumsKPI'] = regainNumsKPI.allitem();
            this.regainNumsKPI = regainNumsKPI;
            //   regainNumsKPI.animate();

            this.doms['config'] = this.paper.text(30, 30, '配置').attr({'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold'});;

            this.doms['remove'] = this.paper.text(30, 60, 'X').attr({'fill': 'red', 'font-size': 20, 'font-family': '微软雅黑', 'font-weight': 'bold'});;
            //this.doms['regainNumsKPI'].hide();
            //this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;
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

        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        toGraph: function(choiceTreeJson) {
          try {
            var json = {};
            json.xAxis = {};
            json.xAxis.data = choiceTreeJson.xAxis[0].data;
            json.series = {};
            json.series.data = fish.pluck(choiceTreeJson.yAxis, 'data')[0];
            this.setXAxisNames(json.xAxis.data);
            this.setXAxisDatas(json.series.data)
          }catch(e){
            console.log("GStripBar ToGraph");
            console.log(choiceTreeJson);
          }

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

    return GStripBar;

})
