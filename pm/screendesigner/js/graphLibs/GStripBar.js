define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/RegainNumsKPI",

], function(GRoot, tpl) {

    var GStripBar = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
			this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x+1,y,532,377);
			this.doms['title']= paper.text(x+532/2,y,'停复机在途复机量').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
			this.xAxisNames = this.attrs.xAxisNames || ['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港'];

            var regainNumsKPI = new RegainNumsKPI(paper, {
                'x': x + 100,
                'y': y + 50,
                nums_width: 100,
                nums: 19,
                waring: 80,
                error: 100,
            });
            fish.each(this.xAxisNames, function(name) {
                regainNumsKPI.add({
                    'name': name,
                    'value': 60
                });
            })
            regainNumsKPI.show();
            this.doms['regainNumsKPI']=regainNumsKPI.allitem();
			//this.doms['regainNumsKPI'].hide();
            //this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;
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
