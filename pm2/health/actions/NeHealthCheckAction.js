define(function () {
    return {

        healthScoreQuery: function (param, success) {
            var serviceName = "MPM_HEALTH_SCORE_QUERY";
            portal.callService(serviceName, param, success);
        },

        metaDimQuery: function (param, success) {
            var serviceName = "MPM_META_DIM_QUERY";
            portal.callService(serviceName, param, success);
        },

        scriptResultQuery: function (param, success) {
            var serviceName = "MPM_UTIL_SCRIPT_RESULT";
            portal.callService(serviceName, param, success);
        }

    }
});