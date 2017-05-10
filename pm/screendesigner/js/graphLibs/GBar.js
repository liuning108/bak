define([
         "oss_core/pm/screendesigner/js/graphLibs/GRoot",
         "text!oss_core/pm/screendesigner/templates/GRectConfig.html"
        ], function(GRoot,tpl) {

    var GBar = GRoot.extend({
        initElement: function() {
            this.doms['rect'] = this.paper.rect(0, 0, 100, 100).attr('fill', 'red');
            this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;
        },
        initLocation:function(){
             this.ft.attrs.translate.x=20;
             this.ft.attrs.translate.y=30; 
        },
        addEvent: function() {
            this.doms['config'].click(function() {
                var options = {
                    height: 300,
                    width:500,
                    modal: false,
                    draggable: true,
                    content: tpl,
                    autoResizable: true
                };
                var popup = fish.popup(options);
                popup.show();
            })
        }

    })

    return GBar;


})
