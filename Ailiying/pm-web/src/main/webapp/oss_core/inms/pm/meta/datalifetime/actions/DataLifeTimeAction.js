define(function () {
    return {

        loadStaticParams: function (param, success) {
            var serviceName = "MPM_META_DATALIFETIME_SERVICE";
            param.ACTION_TYPE = "loadStaticParams";
            portal.callService(serviceName, param, success);
        },

        saveDataLifeTime: function (param, success) {
            var serviceName = "MPM_META_DATALIFETIME_SERVICE";
            param.ACTION_TYPE = "saveDataLifeTime";
            portal.callService(serviceName, param, success);
        },

        loadGridData: function (param, success) {
            var serviceName = "MPM_META_DATALIFETIME_SERVICE";
            param.ACTION_TYPE = "loadGridData";
            portal.callService(serviceName, param, success);
        },

        updateDataLifeTime: function (param, success) {
            var serviceName = "MPM_META_DATALIFETIME_SERVICE";
            param.ACTION_TYPE = "updateDataLifeTime";
            portal.callService(serviceName, param, success);
        },

        deleteDataLifeTime: function (param, success) {
            var serviceName = "MPM_META_DATALIFETIME_SERVICE";
            param.ACTION_TYPE = "deleteDataLifeTime";
            portal.callService(serviceName, param, success);
        }

    }
});