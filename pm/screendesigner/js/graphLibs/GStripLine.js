define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsListLineBar",

], function(GRoot, tpl) {

    var GStripBar = GRoot.extend({
        initElement: function() {
            var x = 500;
            var y = 500;
            var paper = this.paper;
            this.names = this.attrs.names || ['CRM下单', '服务单', '资源变更单', '流程启动', '派单', '归档']
            this.linebar=paper.chartListLineBar({
                'x': x,
                'y': y,
                'keys': this.names
            });
        
            this.doms['linebar'] =this.linebar.allItem();

            var initDatas=[]


        },
        getData: function() {

            var self = this;
            var initDatas=[];
            fish.each(this.names,function(name){
                initDatas.push({
                    'name':name,
                    'value':fish.random(99, 999),
                })
            })
            this.linebar.inputData(initDatas,'');

            setTimeout(function() {
                self.getData();
            }, 3000);
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {

        }

    })

    return GStripBar;


})
