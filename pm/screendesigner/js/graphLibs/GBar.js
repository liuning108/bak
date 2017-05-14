define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/raphael-areaLineBar",
    "text!oss_core/pm/screendesigner/templates/GRectConfig.html"
], function(GRoot, tpl) {

    var GBar = GRoot.extend({
        initElement: function() {
            var self = this;
            this.names = ['名称1', '名称2', '名称3', '名称4', '名称5', '名称6', '名称7', '名称8', '名称8', '名称9', '名称10', '名称11', '名称12'];
            this.top = this.paper.areaLineBar({
                'keys': this.names,
                'x': 100,
                'y': 100,
                'waring': [40, 70, 90]
            });
            this.doms['rect'] = this.top.allItem;
            this.doms['config'] = this.paper.text(100, -20, '配置').attr({
                'fill': 'red',
                'font-size': 18,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });;

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        getData: function() {
            var self=this;
            var  datas=[];
            for (var i = 0; i < this.names.length; i++) {

                datas.push({
                    name: this.names[i],
                    value: fish.random(10, 100)
                })
            }
            this.top.inputData(datas)
            setTimeout(function() {
                 self.getData();
            }, 5000);
        },
        addEvent: function() {
            this.doms['config'].click(function() {

            })
        }

    })

    return GBar;


})
