define(function() {
	return fish.Model.extend({

		defaults: {
			'spId': null,
			'userId': null,
			'userName': "",
			'userCode': "",
			'privData': null
		}
    });
});