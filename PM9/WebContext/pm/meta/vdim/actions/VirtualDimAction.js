define(function () {
    return {

        saveVdim: function (param, success) {
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "saveVdim";
            portal.callService(serviceName, param, success);
        },

        deleteVdim: function (param, success) {
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "deleteVdim";
            portal.callService(serviceName, param, success);
        },

        loadVdimList: function (param, success) {
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "loadVdimList";
            portal.callService(serviceName, param, success);
        }

    }
});