define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
     "oss_core/pm/screendesigner/js/graphLibs/views/GStripBarView",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/RegainNumsKPI",

], function(GRoot, tpl,View) {
  var GStripBar = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
            this.attrs.title=this.attrs.title||'停复机在途复机量';
		//	this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x+1,y,532,377);
        this.doms['gb'] =paper.rect(x,y,532, 377).attr({
            'fill': '#36b0c8',
            'fill-opacity': 0,
            'stroke':'#595959',
            'stroke-width':5,
            'stroke-dasharray':'-'
        })
            this.doms['title']= paper.text(x+532/2,y,this.attrs.title).attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
			this.xAxisNames = this.attrs.xAxisNames || ['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港'];
            var v_setp=19
            if(this.canvas.perview){
                v_setp=1;
            }
            var regainNumsKPI = new RegainNumsKPI(paper, {
                'x': x + 100,
                'y': y + 50,
                nums_width: 100,
                nums: 19,
                step:v_setp,
                waring: 80,
                error: 100,
            });
            fish.each(this.xAxisNames, function(name) {
                regainNumsKPI.add({
                    'name': name,
                    'value': 0
                });
            })
            regainNumsKPI.show();
            this.doms['regainNumsKPI']=regainNumsKPI.allitem();
            this.regainNumsKPI=regainNumsKPI;
        //    regainNumsKPI.animate();

            this.doms['config'] = this.paper.text(30,30, '配置').attr({
                    'fill': 'red',
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                });;

            this.doms['remove'] = this.paper.text(30,60, '删除').attr({
                    'fill': 'red',
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                });;
			//this.doms['regainNumsKPI'].hide();
            //this.doms['config'] = this.paper.text(100, -20, '配置').attr({ 'fill': 'red', 'font-size': 18, 'font-family': '微软雅黑', 'font-weight': 'bold' });;
        },
        getData:function() {
               this.regainNumsKPI.animate();
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {
            var self=this;

            // TODO:配置属性(node)
            this.doms['config'].click(function(e) {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
                self.ConfigEffect();
                e.stopImmediatePropagation();
            });

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
