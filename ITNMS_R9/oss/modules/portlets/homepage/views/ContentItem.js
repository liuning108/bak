define([
	"text!modules/portlets/homepage/templates/ContentItem.html"
], function(ContentItemTpl) {
	var menuUrlMap = null;
	return portal.BaseView.extend({
		template: fish.compile(ContentItemTpl),

		resource: {},

		events: {
			"click": "lanuchMenu"
		},

		initialize: function(options) {
			this.model = {
				url: options.url,
				iconSize: options.iconSize
			};
		},

		render: function() {
			var res = fish.extend(this.model, {
				privName: menuUrlMap[this.model.url].partyName,
				privCode: menuUrlMap[this.model.url].privCode || '',
				iconUrl: menuUrlMap[this.model.url].iconUrl ? menuUrlMap[this.model.url].iconUrl : 'iconfont icon-page'
			});
			this.setElement(this.template(res));
		},

		lanuchMenu: function() {
			var menuItem = menuUrlMap[this.model.url];
			portal.openMenu(menuItem.partyId, this.model.url, null, this.model.privName,{"privCode": menuItem.privCode});
		},

		setMenuUrlMap: function(map) {
			menuUrlMap = map;
		}
	});
});
