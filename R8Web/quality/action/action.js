portal.define(function() {
	return {
		qryHostDataList:function(success){
      var param = {};
      var serviceName = "MPM_QUALITYVIEW_SERVICE";
      param.ACTION_TYPE = "getHotDataList";
       portal.callService(serviceName, param, success);
		},
		getHotTrendDataList:function(HOT_TYPE,success){
      var param = {};
      var serviceName = "MPM_QUALITYVIEW_SERVICE";
       param.ACTION_TYPE = "getHotTrendDataList";
      param.HOT_TYPE = HOT_TYPE;
      portal.callService(serviceName, param, success);
		},
		getWholeNetworkData:function(success){
      var param = {};
      var serviceName = "MPM_QUALITYVIEW_SERVICE";
      param.ACTION_TYPE = "getWholeNetworkData";
       portal.callService(serviceName, param, success);
		},
		getCityScoreData:function(success){
			var param = {};
			var serviceName = "MPM_QUALITYVIEW_SERVICE";
			param.ACTION_TYPE = "getCityScoreData";
       portal.callService(serviceName, param, success);
    },
		getIDCData:function(success){
			var param = {};
			var serviceName = "MPM_QUALITYVIEW_SERVICE";
			param.ACTION_TYPE = "getIDCData";
       portal.callService(serviceName, param, success);
		},
		getCDNTrendData:function(success){
			var param = {};
			var serviceName = "MPM_QUALITYVIEW_SERVICE";
			param.ACTION_TYPE = "getCDNTrendData";
       portal.callService(serviceName, param, success);
    },
		getCDNDetailData:function(success){
			var param = {};
			var serviceName = "MPM_QUALITYVIEW_SERVICE";
			param.ACTION_TYPE = "getCDNDetailData";
       portal.callService(serviceName, param, success);
		}
	}
});
