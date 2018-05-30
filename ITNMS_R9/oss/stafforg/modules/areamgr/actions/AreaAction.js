define(function() {
	return {
		qryAreaListByParentId: function(parentId, success) {
			fish.get("stafforg/areas/parent/" + (parentId?parentId:0), success);
		},
		qryAreaById: function(areaId, success) {
			fish.get("stafforg/areas/"+ areaId, success);
		},
		delArea: function(areaId, success) {
			fish.remove("stafforg/areas/" + areaId, success);
		},
		addArea: function(param, success) {
			fish.post("stafforg/areas", fish.clone(param), success);
		},
		modArea: function(areaId, param, success) {
			fish.put("stafforg/areas", fish.extend({areaId: areaId}, param), success);
		}
	};
});