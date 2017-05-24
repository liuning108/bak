define([
	     "oss_core/pm/screendesigner/js/graphLibs/GRoot",
	   ], function(GRoot,tpl) {

    var GAnnular = GRoot.extend({
        initElement: function() {
            var x=0;
			var y=0;
			var paper=this.paper;
		 	this.doms['gb']=paper.image('oss_core/pm/screendesigner/js/graphLibs/images/bgline.png',x,y,532,377);
			this.doms['title'] = paper.text(x+532/2,y,'当月套餐Top10').attr({'fill':'#ebeb6d','font-size':24,'font-family': '微软雅黑','font-weight':'bold'});

		},
        initLocation:function(){
             this.ft.attrs.translate.x=20;
             this.ft.attrs.translate.y=30;
        },
        addEvent: function() {

        }

    })

    return GAnnular;


})
