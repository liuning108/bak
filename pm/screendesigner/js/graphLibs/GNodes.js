define([
    "oss_core/pm/screendesigner/js/graphLibs/GRoot",
    "oss_core/pm/screendesigner/js/graphLibs/raphaelLibs/raphael-chartsProcess",
], function(GRoot, tpl) {

    var GNodes = GRoot.extend({
        initElement: function() {
            var x = 0;
            var y = 0;
			var paper=this.paper;
			this.names = this.attrs.names || ['CRM下单', '服务单', '资源变更单', '流程启动', '派单', '归档']
            this.nodes=paper.chartsProcess({
                'x': x,
                'y': y,
                'keys': this.names
            })
			this.doms['nodes']=this.nodes.allItem();

			this.doms['label_t1']=paper.text(x+235,y+30,'正常').attr({'fill':'#ffffff','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
	        this.doms['label_r1']=paper.rect(x+235-45,y+20,20,20).attr({'fill':'#02b7ec','stroke-width':0});
		    this.doms['label_t2']=paper.text(x+235+75,y+30,'紧急').attr({'fill':'#fcc314','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
	        this.doms['label_r2']=paper.rect(x+235-45+75,y+20,20,20).attr({'fill':'#fcc314','stroke-width':0});
			this.doms['label_t3']=paper.text(x+235+75+75,y+30,'危险').attr({'fill':'#ff0000','font-size':18,'font-family': '微软雅黑','font-weight':'bold'});
	        this.doms['label_r3']=paper.rect(x+235-45+75+75,y+20,20,20).attr({'fill':'#ff0000','stroke-width':0});
            this.doms['remove'] = this.paper.text(30,30, '删除').attr({
                    'fill': 'red',
                    'font-size': 18,
                    'font-family': '微软雅黑',
                    'font-weight': 'bold'
                });;
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
            this.nodes.inputData(datas);
        },
        initLocation: function() {
            this.ft.attrs.translate.x = 20;
            this.ft.attrs.translate.y = 30;
        },
        addEvent: function() {

            var self=this;
            // TODO:配置删除(node)
            this.doms['remove'].click(function() {
                fish.confirm('确认是否删除该组件').result.then(function() {
                    self.remove();
                });
            })//end of remove

        }

    })

    return GNodes;


})
