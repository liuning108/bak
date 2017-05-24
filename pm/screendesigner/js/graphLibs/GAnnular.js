define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsPie",
], function(GRoot, tpl) {

    var GAnnular = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
			this.names=this.attrs.names||['乐享4G-99','乐享4G-59','流量升级包-30','乐享4G-129','乐享4G-199','乐享4G-399','飞Young4G-99']
            var colors=['#ff7f50','#ff8212', '#c5ff55','#30cd2f', '#30cd2f','#5599f2','#fe62ae','#c050c8']
			this.doms['gb'] = paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png', x, y, 532, 377);
            this.doms['title'] = paper.text(x + 532 / 2, y, '当月套餐').attr({
                'fill': '#ebeb6d',
                'font-size': 24,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
            var pie_x = x + 532 / 1.5;
            var pie_y = y + 377 / 2;
            var r = 100;
            var models=[];
			fish.each(this.names,function(name,index){
                 models.push({
					 'name':name,
					 'color':colors[index%colors.length]
				 })
			})


             this.pie = paper.chartsPie({
                'x': pie_x,
                'y': pie_y,
                'r': r,
                'listx': pie_x - 2 * r,
                'listy': pie_y - 1.5 * r,
                'modes': models
            });

            this.doms['pie'] = this.pie.allitem();
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
            this.pie.inputData(datas);
            //alert(sum);
			setTimeout(function() {
                self.getData();
            }, 5000);

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {

        }

    })

    return GAnnular;


})
