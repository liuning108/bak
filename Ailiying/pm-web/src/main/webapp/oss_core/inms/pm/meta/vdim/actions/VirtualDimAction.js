define(function () {
    return {

        saveVdim: function (param, success) {
            /*
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "saveVdim";
            portal.callService(serviceName, param, success);
            */
            fish.post("vdim/saveVdim",param).then(function(data){
                success(data);
            });
        },

        deleteVdim: function (param, success) {
            /*
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "deleteVdim";
            portal.callService(serviceName, param, success);
             */
            fish.post("vdim/deleteVdim",param).then(function(data){
                success(data);
            });
        },

        loadVdimList: function (param, success) {
            /*
            var serviceName = "MPM_META_VDIM_SERVICE";
            param.ACTION_TYPE = "loadVdimList";
            portal.callService(serviceName, param, success);
            */
            fish.get("vdim/loadVdimList").then(function(data){
                success(data);
            });
        }

    }
});
