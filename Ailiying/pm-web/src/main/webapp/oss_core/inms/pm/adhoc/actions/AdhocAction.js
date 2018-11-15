define(["webroot"],function(webroot) {
    return {

        cacheDimData: function (param, success) {
            fish.post("dim/diminfo", param, success, webroot);
        },

        cacheMapType: function (param, success) {
            fish.get("adhoc/cacheMapType", success, webroot);
        },

        cacheKpiData: function (param, success) {
            fish.post("kpi/kpiinfo", param, success, webroot);
        },

        cacheModelData: function (param, success) {
            param.MODE = "ALL";
            fish.post("busimodel/field", param, success, webroot);
        },

        loadTopicDetail: function (param, success) {
            fish.post("adhoc/loadTopic", param, success, webroot);
        },

        loadData: function (param, success) {
            fish.post("adhoc/loadData", param, success, webroot);
        },

        metaDimQuery: function (param, success) {
            fish.post("dim/diminfo", param, success, webroot);
        },

        metaKpiQuery: function (param, success) {
            fish.post("kpi/kpiformular", param, success, webroot);
        },

        metaKpiDetailQuery: function (param, success) {
            fish.post("kpi/kpiinfo", param, success, webroot);
        },

        scriptResultQuery: function (param, success) {
            fish.post("util/scriptresult", param, success, webroot);
        },

        gridExport: function (param, success) {
            fish.post("adhoc/gridExport", param, success, webroot);
        },

        dataExport: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "dataExport";
            portal.callService(serviceName, param, success);
        },

        getGlobalVdimList: function (param, success) {
            fish.get("vdim/loadVdimList", success, webroot);
        }

    }
});
