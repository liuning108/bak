define([
	"text!modules/portlets/homepage/templates/ContentItemSelector.html",
	"i18n!modules/portlets/homepage/i18n/itemselector",
	"frm/fish-desktop/third-party/icheck/fish.icheck",
	"css!frm/fish-desktop/third-party/icheck/icheck"
], function(tpl, i18n) {
	return portal.BaseView.extend({
	    el: false,

		template: fish.compile(tpl),

		serialize: i18n,

		events: {
			'click .js-ok': 'chooseContentItem'
		},

		initialize: function () {
			this.selectedItem = this.options.selectedItem;
			this.size = this.options.size;
		},

		afterRender: function() {
			var menudata = fish.filter(portal.allMenu, function (d) {
				return !!d.privCode && d.type === "1";
			});
			menudata = fish.uniq(menudata, 'privCode');
			this.$grid = this.$('.menu-item').grid({
                data: menudata,
                multiselect: true,
                height: 300,
                searchbar: true,
                colModel:[
                    {label: i18n.MENU_NAME, name: 'partyName', width: 280, search: true},
                    {label: i18n.MENU_URL, name: 'url', width: 300},
                    {name: 'privCode', key: true, hidden: true}
                ]
            });
            this.$grid.grid('setCheckRows', this.selectedItem, true);
            this.$grid.grid('sortableRows');
            this.$icheck = this.$('input[name="iconSize"]').icheck();
            switch(this.size) {
            	case 3: this.$icheck.eq(0).icheck('check'); break;
            	case 2: this.$icheck.eq(1).icheck('check'); break;
            	case 1: this.$icheck.eq(2).icheck('check'); break;
            }
		},

		chooseContentItem: function () {
			var checkdData = this.$grid.grid('getCheckRows'),
				allData = this.$grid.grid('getRowData', null, false),
				iconSize, res = [];

			fish.each(allData, function (d) {
				if (fish.findIndex(checkdData, {privCode: d.privCode}) !== -1) {
					res.push(d);
				}
			});

			switch(this.$('[name="iconSize"]:checked').val()) {
				case 'big': iconSize = 3; break;
				case 'mid': iconSize = 2; break;
				case 'small': iconSize = 1; break;
			}
			if (res.length === 0) {
				fish.warn(i18n.PLS_SELECT_MENU);
				return;
			} else {
				this.popup.close({
					menuData: res,
					menuIconSize: iconSize
				});
			}
		}
	});
});
