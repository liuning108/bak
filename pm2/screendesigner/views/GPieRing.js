define([
	     "oss_core/pm/screendesigner/js/graphLibs/GRoot",
	     "text!oss_core/pm/screendesigner/templates/GRectConfig.html",
	    ], function(GRoot,tpl) {

    var GRect = GRoot.extend({
        initElement: function() {
          var x =0;
		  var y =0;



		},
        initLocation:function(){
             this.ft.attrs.translate.x=20;
             this.ft.attrs.translate.y=30;
        },
        addEvent: function() {

        }

    })

    return GRect;


})
