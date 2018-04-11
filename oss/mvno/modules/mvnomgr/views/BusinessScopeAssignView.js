define([ "text!mvno/modules/mvnomgr/templates/BusinessScopeAssign.html",
	    "mvno/modules/mvnomgr/actions/MvnoAction",
		"i18n!mvno/modules/mvnomgr/i18n/mvnomgr"
], function(TplBusinessScopeAssign, mvnoAction, I18N) {
	
	return portal.BaseView.extend({

		template : fish.compile(TplBusinessScopeAssign),

		events: {
			"click .js-business-assign": 'openBusinessAssign',
		},

		initialize: function() {
		},

		render: function() {
			
		},

		afterRender: function() {
			var that = this;
			var $dfd = $.Deferred();
			var selected = $(".js-mvno-grid").grid("getSelection");
//			appAction.qryAppList().then(function(status) {
//				var appList = status || [];				
//				if (appList.length > 0) {
//					for (var i in appList){						
//						if (selected.spId !== undefined){
//							(function(i) {
//								mvnoAction.queryAuthInfo(appList[i].appCode,selected.spId,function(result){
//									// var result = {enable:true,done:false,url:'modules/usermgr/views/UserMgr'};
//									if(result){
//										appList[i] = fish.$.extend({},appList[i],result);								
//									}
//									if(i == appList.length-1){
//										$dfd.resolve();
//									}
//								},function(err){
//									appList[i] = fish.$.extend({},appList[i],{done:false});
//									if(i == appList.length-1){
//										$dfd.resolve();
//									}
//								});		
//							})(i);												
//						}						
//					}
//					$dfd.promise().then(function(){
//						that.setElement(that.template({list:appList}));
//					});
//				}
//			});
			
		},

		openBusinessAssign: function(e) {
			var url = $(e.currentTarget).data('url');
			if (url && url !== ''){
				// fish.confirm(I18N.MVNOMGR_OPEN_BUSINESS_ASSIGN,function() {
					fish.popupView({
						url: url,
						viewOption: {
							"spId": $(".js-mvno-grid").grid("getSelection").spId
						},
						close: function(){
							$(e.currentTarget).removeClass("has-warning").addClass("has-success");
						}
					});
				// }.bind(this), $.noop);
			}			
		}
	});
});