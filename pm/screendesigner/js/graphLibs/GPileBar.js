define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/todayLoadNumberClass",
    "oss_core/pm/screendesigner/js/graphLibs/views/GPileBarView"
], function(GRoot, tpl,View) {

    var GPileBar = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
            var paper = this.paper;
		    this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x,y,532,377);
            this.attrs.title=this.attrs.title||'C网今日新装量'
            this.doms['title'] = paper.text(x+532/2,y,this.attrs.title).attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});
            this.xAxisNames = this.attrs.xAxisNames || ['南京', '无锡', '徐州', '常州', '苏州', '南通', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁', '连云港'];
            var loadNumber = new todayLoadNumberClass(paper, {
                'x': x + 82,
                'y': y + 30,
                'element_width': 180,
                'element_high': 24,
                'element_distance': 26

            });

            loadNumber.add({
                'name': '南京',
                'value_3g': 42,
                'value_4g': 62
            })

            loadNumber.add({
                'name': '无锡',
                'value_3g': 39,
                'value_4g': 49
            })


            loadNumber.add({
                'name': '徐州',
                'value_3g': 22,
                'value_4g': 33
            })

            loadNumber.add({
                'name': '常州',
                'value_3g': 47,
                'value_4g': 99
            })


            loadNumber.add({
                'name': '苏州',
                'value_3g': 46,
                'value_4g': 55
            })

            loadNumber.add({
                'name': '南通',
                'value_3g': 33,
                'value_4g': 38
            })

            loadNumber.add({
                'name': '连云港',
                'value_3g': 20,
                'value_4g': 44
            })

            loadNumber.add({
                'name': '淮安',
                'value_3g': 55,
                'value_4g': 56
            })



            loadNumber.add({
                'name': '盐城',
                'value_3g': 55,
                'value_4g': 36
            })

            loadNumber.add({
                'name': '扬州',
                'value_3g': 22,
                'value_4g': 43
            })

            loadNumber.add({
                'name': '镇江',
                'value_3g': 33,
                'value_4g': 45
            })
            loadNumber.add({
                'name': '泰州',
                'value_3g': 25,
                'value_4g': 33
            })
            loadNumber.add({
                'name': '宿迁',
                'value_3g': 30,
                'value_4g': 40
            })
            loadNumber.show();

            this.doms['loadNumber'] = loadNumber.allitem();
            var title3G = paper.text(x + 82 + 55 + 10 + 145 + 27, y + 45, '3G').attr({
                'fill': '#4bcaff',
                'font-size': 24,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
			this.doms['title3G']=title3G;
            var title4G = paper.text(x + 82 + 55 + 10 + 145 + 100 + 27, y + 45, '4G').attr({
                'fill': '#ffdb11',
                'font-size': 24,
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            });
			this.doms['title4G']=title4G;


            var sum3gkpi = new sumkpi(paper, {
                'currentvalue': 340,
                'rate': 0.05,
                'nums': 19,
                'item_high': 5,
                'x': x + 82 + 55 + 10 + 145,
                'y': y + 72,
                'item_width': 50,
                'space_high': 15,
                'fill': '#00b7ee'

            });

            sum3gkpi.show();
            this.doms['sum3gkpi']=sum3gkpi.allitem();


            var sum4gkpi = new sumkpi(paper, {
                'currentvalue': 340,
                'rate': 0.04,
                'nums': 19,
                'item_high': 5,
                'x': x + 82 + 55 + 10 + 145 + 100,
                'y': y + 72,
                'item_width': 50,
                'space_high': 15,
                'fill': '#e89f21'

            });
            sum4gkpi.show();
			this.doms['sum4gkpi']=sum4gkpi.allitem();

           loadNumber.animate(sum3gkpi,sum4gkpi);



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

        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {
            var self=this;
            // TODO:配置属性(node)
            this.doms['config'].click(function() {
                var view = new View(self);
                view.render();
                var $panel = $('.configPanel');
                $panel.html(view.$el.html());
                view.afterRender();
            });

            // TODO:配置删除(node)
            this.doms['remove'].click(function() {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
            })//end of remove
        }

    })

    return GPileBar;


})
