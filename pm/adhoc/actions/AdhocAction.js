/**
 * Created by TZ on 2016/08/05
 * Title: SlaTplAction.js
 */
define(function () {
    return {

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

        loadTopicDetail: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadTopic";
            portal.callService(serviceName, param, success);
        },

        loadData: function (param, success) {
            var serviceName = "MPM_ADHOC_TOPIC_SERVICE";
            param.ACTION_TYPE = "loadData";
            portal.callService(serviceName, param, success);
        },

        metaDimQuery: function (param, success) {
            var serviceName = "MPM_META_DIM_QUERY";
            portal.callService(serviceName, param, success);
        },

        metaKpiQuery: function (param, success) {
            var serviceName = "MPM_META_KPI_FORMULAR_QUERY";
            portal.callService(serviceName, param, success);
        },

        metaKpiDetailQuery: function (param, success) {
            var serviceName = "MPM_META_KPI_QUERY";
            portal.callService(serviceName, param, success);
        },

        scriptResultQuery: function (param, success) {
            var serviceName = "MPM_UTIL_SCRIPT_RESULT";
            portal.callService(serviceName, param, success);
        }

    }
});