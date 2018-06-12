define([
	     "oss_core/pm/screendesigner/js/graphLibs/GRoot",
	     "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
	    ], function(GRoot,tpl) {

    var GRect = GRoot.extend({
		initAttrs: function() {
            this.attrs.dbServer = this.attrs.dbServer || {
                'serverName': 'NetworkOverviewDemoQryService',
                'islocal': true,
                'xAxis': ['field_1'],
                'yAxis': [
                    'field_2', 'field_3'
                ],
                'xNums': 1,
                'yNums': 2,
                'xMinNums': 1,
                'yMinNums': 2
            }
        },
        initElement: function() {
            this.doms['rect'] = this.paper.rect(0, 0, 100, 100).attr('fill', 'red');
            this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;

		},
        initLocation:function(){
             this.ft.attrs.translate.x=20;
             this.ft.attrs.translate.y=30;
        },
				getData:function() {

				},
        addEvent: function() {
            this.doms['config'].click(function(e) {
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
				e.stopImmediatePropagation();
            })
        }

    })

    return GRect;


})
