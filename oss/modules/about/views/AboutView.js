define([ "text!modules/about/templates/AboutPopWin.html",
		"i18n!modules/about/i18n/about",
		"i18n!modules/login/i18n/login",
		'modules/about/actions/AboutAction'], 
	function(tplAbout, i18nData, i18nLogin, aboutAction) {
	
	return portal.BaseView.extend({

		template : fish.compile(tplAbout),

		resource : fish.extend({}, i18nData, i18nLogin),


		afterRender : function() {				
			var that = this;
			aboutAction.qryVersionList(function(versions){
				var data = that.resource;
				data.prods = [];
				if(versions && versions.length > 0){	
					for(var index in versions){
						var prod = portal.utils.htmlEncodeAllData(versions[index]);
						if(prod.master){
							data.masterProd = prod; //主产品
						}else{
							data.prods.push(prod);
						}
					}
				}
				//通过数据编译模板之后已弹框的形式展示出来
				that.setElement(that.template(data));
	        	fish.popup({
	                content: that.$el,
	                height: 542,
	                width: 652
	            });
				
//				that.$(".js-product").niceScroll({
//					railpadding:{right:8},
//					cursorcolor: '#1d5987',
//	                cursorwidth: '10px',
//	                cursoropacitymax:"0.4"
//				});
	        	this.$(".js-product").slimscroll({
					height: 100
				});
				
				that.$(".modal-body").css("overflow","hidden");
			})
		}
	});

});