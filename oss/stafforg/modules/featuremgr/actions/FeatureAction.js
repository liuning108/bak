define(["webroot"],function(webroot) {
	return {
		qryCanDefAttrColumnList: function(tableAlias, success) {
			fish.get("stafforg/attrs/" + tableAlias + "/undefined", success, webroot);
		},
		qryAttrDefList: function(tableAlias, success) { //查询所有的属性定义列表信息
			fish.get("stafforg/attrs/" + tableAlias + "/defined", success, webroot);
		},
		addAttrDef: function(param, success) {
			fish.post("stafforg/attrs", param, success, webroot);
		},
		editAttrDef: function(param, success) {
			fish.put("stafforg/attrs", param, success, webroot);
		},
		deleteAttrDef: function(param, success) {
			fish.remove("stafforg/attrs/" + param.tableName + "/" + param.columnName, success, webroot);
		},
		ModDisplayOrder: function(attrDefList, success) {
			fish.put("stafforg/attrs/order", attrDefList, success, webroot);
		},
		qryAttrDefValueList: function(valueId, success) {
			fish.get("stafforg/attrs/values/"+valueId, success, webroot);
		}
	};
});