define(["webroot"],function(webroot) {
    return {

        isEmailSendOn: function (success) {
            fish.get("util/emailSendStatus", success, webroot);
        },

        // 元数据接口服务 获取EMS
        qryEms: function (param, success) {
            fish.post("util/ems", param, success, webroot);
        },

        getGlobalVdimList: function (param, success) {
            fish.get("vdim/loadVdimList", success, webroot);
        },

        cacheOperUser: function (success) {
            fish.get("adhoc/cacheOperUser", success, webroot);
        },

        qryCatalogAndTopic: function (param, success) {
            fish.post("adhoc/qryCatalogAndTopic", param, success, webroot);
        },

        delCatalog: function (param, success) {
            fish.post("adhoc/delCatalog", param, success, webroot);
        },

        addCatalog: function (param, success) {
            fish.post("adhoc/addCatalog", param, success, webroot);
        },

        modCatalog: function (param, success) {
            fish.post("adhoc/modCatalog", param, success, webroot);
        },

        cacheDimData: function (param, success) {
            fish.post("dim/diminfo", param, success, webroot);
        },

        cacheKpiData: function (param, success) {
            fish.post("kpi/kpiinfo", param, success, webroot);
        },

        cacheModelData: function (param, success) {
            param.MODE = "ALL";
            fish.post("busimodel/field", param, success, webroot);
        },

        cacheMapType: function (success) {
            fish.get("adhoc/cacheMapType", success, webroot);
        },

        favTopic: function (param, success) {
            fish.post("adhoc/favTopic", param, success, webroot);
        },

        saveTopic: function (param, success) {
            fish.post("adhoc/saveTopic", param, success, webroot);
        },

        saveSharedTopic: function (param, success) {
            fish.post("adhoc/saveSharedTopic", param, success, webroot);
        },

        moveTopic: function (param, success) {
            fish.post("adhoc/moveTopic", param, success, webroot);
        },

        shareTopic: function (param, success) {
            fish.post("adhoc/shareTopic", param, success, webroot);
        },

        cacheMapType: function (success) {
            fish.get("adhoc/cacheMapType", success, webroot);
        },

        loadSharedTopicList: function (success) {
            fish.get("adhoc/loadSharedTopicList", success, webroot);
        },

        delTopic: function (param, success) {
            fish.post("adhoc/delTopic", param, success, webroot);
        },

        loadTopicDetail: function (param, success) {
            fish.post("adhoc/loadTopic", param, success, webroot);
        },

        /*loadUserList: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadUserList";
            portal.callService(serviceName, param, success);
        },*/

        metaDimQuery: function (param, success) {
            fish.post("dim/diminfo", param, success, webroot);
        },

        scriptResultQuery: function (param, success) {
            fish.post("util/scriptresult", param, success, webroot);
        },

        queryKpiComments: function (param, success) {
            fish.post("kpi/kpiinfo", param, success, webroot);
        },

        sendMailDelete: function (param, success) {
            var serviceName = "MPM_DASHBOARD_TOPIC_SERVICE";
            portal.callService(serviceName, param, success);
        },

        qryPluginList: function (success) {
            fish.get("adhoc/qryPluginList", success, webroot);
        },

        expressionCheck: function (param, success) {
            fish.post("adhoc/expressionCheck", param, success, webroot);
        }

    }
});
