/**
 * Created by TZ on 2016/08/05
 * Title: SlaTplAction.js
 */
define(function () {
    return {

        // 元数据接口服务 获取EMS
        qryEms: function (param, success) {
            var serviceName = "MPM_UTIL_EMS";
            portal.callService(serviceName, param, success);
        },

        // 搜索功能
        searchContent: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "searchContent";
            portal.callService(serviceName, param, success);
        },

        cacheOperUser: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "cacheOperUser";
            portal.callService(serviceName, param, success);
        },

        cacheDimData: function (param, success) {
            var serviceName = "MPM_META_DIM_QUERY";
            portal.callService(serviceName, param, success);
        },

        cacheKpiData: function (param, success) {
            var serviceName = "MPM_META_KPI_QUERY";
            portal.callService(serviceName, param, success);
        },

        cacheModelData: function (param, success) {
            var serviceName = "MPM_META_MODEL_BUSI_FIELD_QUERY";
            param.MODE = "ALL";
            portal.callService(serviceName, param, success);
        },

        cacheMapType: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "cacheMapType";
            portal.callService(serviceName, param, success);
        },

        qryCatalogAndTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "qryCatalogAndTopic";
            portal.callService(serviceName, param, success);
        },

        addCatalog: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "addCatalog";
            portal.callService(serviceName, param, success);
        },

        modCatalog: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "modCatalog";
            portal.callService(serviceName, param, success);
        },

        delCatalog: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "delCatalog";
            portal.callService(serviceName, param, success);
        },

        favTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "favTopic";
            portal.callService(serviceName, param, success);
        },

        saveTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "saveTopic";
            portal.callService(serviceName, param, success);
        },

        saveSharedTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "saveSharedTopic";
            portal.callService(serviceName, param, success);
        },

        moveTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "moveTopic";
            portal.callService(serviceName, param, success);
        },

        shareTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "shareTopic";
            portal.callService(serviceName, param, success);
        },

        loadSharedTopicList: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadSharedTopicList";
            portal.callService(serviceName, param, success);
        },

        delTopic: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "delTopic";
            portal.callService(serviceName, param, success);
        },

        loadTopicDetail: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadTopic";
            portal.callService(serviceName, param, success);
        },

        loadUserList: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadUserList";
            portal.callService(serviceName, param, success);
        },

        metaDimQuery: function (param, success) {
            var serviceName = "MPM_META_DIM_QUERY";
            portal.callService(serviceName, param, success);
        },

        scriptResultQuery: function (param, success) {
            var serviceName = "MPM_UTIL_SCRIPT_RESULT";
            portal.callService(serviceName, param, success);
        },

        queryKpiComments: function (param, success) {
            var serviceName = "MPM_META_KPI_QUERY";
            portal.callService(serviceName, param, success);
        },

        sendMailDelete: function (param, success) {
            var serviceName = "MPM_DASHBOARD_TOPIC_SERVICE";
            portal.callService(serviceName, param, success);
        },

        getGlobalVdimList: function (param, success) {
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "loadVdimList";
            portal.callService(serviceName, param, success);
        },

        qryPluginList: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "qryPluginList";
            portal.callService(serviceName, param, success);
        },

        expressionCheck: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "expressionCheck";
            portal.callService(serviceName, param, success);
        }

    }
});