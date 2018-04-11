define(["i18n!modules/dataprivmgr/i18n/dataprivmgr"], function(I18N) {
	var i18nData = fish.extend({}, I18N);

	return fish.Model.extend({
		idAttribute: 'DATA_PRIV_ID',

		defaults: {
			dataPrivId: null,
			dataPrivName: null,
			dataPrivCode: null,
			dataType: null,
			comments: null,
			dataSrc: null
		},

		initialize: function() {
			switch (this.get('dataType')) {
			case 'L':
				this.set('DATA_TYPE_STR', i18nData.DATAPRIVMGR_LIST);
				break;
			case 'T':
				this.set('DATA_TYPE_STR', i18nData.DATAPRIVMGR_TEXT);
				break;
			default:
				this.set('DATA_TYPE_STR', null);
				break;
			}
		}
    });
});
