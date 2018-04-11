define([ "text!mvno/modules/mvnomgr/templates/ParameterInitialization.html",
		"mvno/modules/mvnomgr/actions/MvnoAction",
		"i18n!mvno/modules/mvnomgr/i18n/mvnomgr"
], function(TplParameterInitialization, mvnoAction, I18N) {
	
	return portal.BaseView.extend({

		template : fish.compile(TplParameterInitialization),

		events: {
			"click .js-business-notice": 'sendNotification',
		},

		initialize: function() {
		},

		render: function() {
			// this.setElement(this.template(I18N));
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
//								mvnoAction.queryNoticeInfo(appList[i].appCode,selected.spId,function(result){
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

		sendNotification: function(e) {			
			var url = $(e.currentTarget).data('url');
			if (url && url !== ''){
				fish.confirm(I18N.MVNOMGR_SEND_NOTIFICATION,function() {				
					url = url.replace('{spId}', $(".js-mvno-grid").grid("getSelection").spId);
					var acct = $(e.currentTarget).find('.mvno-config-title').text();
					mvnoAction.sendNotice(acct, url, function(){
						fish.info(I18N.MVNOMGR_SEND_NOTICE_SUCCESS);
						$(e.currentTarget).removeClass("has-warning").addClass("has-success");
					},function(err){
						fish.info(I18N.MVNOMGR_SEND_NOTICE_FAIL);
					});
				}.bind(this), $.noop);
			}			
		}
	});
});