define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsListLineBar",

], function(GRoot, tpl) {

    var GStripBar = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
            this.names = this.attrs.names || ['CRM下单', '服务单', '资源变更单', '流程启动', '派单', '归档']
            this.linebar=paper.chartListLineBar({
                'x': x,
                'y': y,
                'keys': this.names
            });

            this.doms['linebar'] =this.linebar.allItem();

            this.doms['remove'] = this.paper.text(0,-350, '删除').attr({
                    'fill': 'red',
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                });;


        },
        getData: function() {

            var self = this;
            var initDatas=[];
            var intervalTime=1000*60*5;
            fish.each(this.names,function(name){
                initDatas.push({
                    'name':name,
                    'value':fish.random(99, 999),
                })
            })
            this.linebar.inputData(initDatas,'');

            setTimeout(function() {
                self.getData();
            }, intervalTime);
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {
            var self=this;
            // TODO:配置删除(node)
            this.doms['remove'].click(function(e) {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
                e.stopImmediatePropagation();
            })//end of remove
        }

    })

    return GStripBar;


})
