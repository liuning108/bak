define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-workflowPie",
], function(GRoot, tpl) {

    var GPieRing = GRoot.extend({
        initElement: function() {
            var paper = this.paper;
            var x = 0;
            var y = 0;
            this.names = this.attrs.names || ['CRM下单', '服务单', '资源变更单', '流程启动', '派单', '归档']
            var colors = ['#f89d2c', '#f299bd', '#e8410e', '#30cd2f', '#dbdb01', '#8e228f']
            var modes = [];
            for (var i = 0; i < this.names.length; i++) {
                var name = this.names[i];
                var color = colors[i % colors.length];
                modes.push({
                    'name': name,
                    'color': color
                })
            }





            this.pie = paper.workflowPie({
                'x': x,
                'y': y,
                'r': 70,
                'listx': x - 300,
                'listy': y - 190,
                'modes': modes
            });
            this.doms['nameValue'] = paper.text(x, y - 20, '流程总数').attr({
                'fill': '#ffffff',
                'font-size': 23,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
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

            //this.doms['rect'] = this.paper.rect(0, 0, 100, 100).attr('fill', 'red');

            //this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        getData: function() {
            var self = this;
            var datas = [];
			var sum=0;
            for (var i = 0; i < this.names.length; i++) {
				var val =fish.random(10, 100);
                datas.push({
                    name: this.names[i],
                    value: val
                })
				sum+=val;
            }
            this.pie.inputData(datas,function(){
                self.doms['nums'].setValue(sum);
            });
            //alert(sum);

        },
        addEvent: function() {

        }

    })

    return GPieRing;


})