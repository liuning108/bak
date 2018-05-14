define(function () {
    return {

        saveParam: function (param, success) {
            var serviceName = "MPM_META_PARAMMGR_SERVICE";
            param.ACTION_TYPE = "saveParam";
            portal.callService(serviceName, param, success);
        },

        loadParam: function (param, success) {
            var serviceName = "MPM_META_PARAMMGR_SERVICE";
            param.ACTION_TYPE = "loadParam";
            portal.callService(serviceName, param, success);
        }

    }
});