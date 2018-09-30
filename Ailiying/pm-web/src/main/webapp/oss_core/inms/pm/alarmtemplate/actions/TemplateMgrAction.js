/**
 *
 */
define(["webroot"],function(webroot) {
	return {

        // 获取设备图标集合
        loadNeIconList: function (param, success) {
            fish.post("pm/api/alarmtemplate/neIconList", param, success, webroot);
        },

        // 获取业务模型集合
        loadBusiModelList: function (param, success) {
            param.MODE = "ALL";
            fish.post("busimodel/field", param, success, webroot);
        },

        getFieldInModel: function (param, success) {
            fish.post("pm/api/alarmtemplate/getFieldInModel", param, success, webroot);
        },

        // 新建模板
        addTemplate: function (param, success) {
            fish.post("pm/api/alarmtemplate/addTemplate", param, success, webroot);
        },

        // 编辑模板
        editTemplate: function (param, success) {
            fish.post("pm/api/alarmtemplate/editTemplate", param, success, webroot);
        },

        qryTemplate: function (param, success) {
            fish.post("pm/api/alarmtemplate/qryTemplate", param, success, webroot);
        },

        searchTemplate: function (param, success) {
            fish.post("pm/api/alarmtemplate/searchTemplate", param, success, webroot);
        },

        delTemplate: function (param, success) {
            fish.post("pm/api/alarmtemplate/delTemplate", param, success, webroot);
        },

        qryTemplateDetail: function (param, success) {
            fish.post("pm/api/alarmtemplate/qryTemplateDetail", param, success, webroot);
        }

    }
});
