/**
 *
 *
 */
define(function () {
    return {

        loadBusytimePluginDimKpiList: function (param, success) {
            var serviceName = "MPM_ADHOC_PLUGIN_SERVICE";
            param.ACTION_TYPE = "loadBusytimePluginDimKpiList";
            portal.callService(serviceName, param, success);
        }

    }
});