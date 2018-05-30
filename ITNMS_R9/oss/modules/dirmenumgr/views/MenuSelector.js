define([
	'text!modules/dirmenumgr/templates/MenuSelector.html',
	'modules/dirmenumgr/actions/DirMenuAction'
], function(menuSelectorTpl, DirMenuAction) {
	return portal.BaseView.extend({
		template: fish.compile(menuSelectorTpl),
		events: {
			"click .js-ok": 'ok'
		},
	
		initialize: function(options) {
			this.i18nData = options.i18nData;
			var menus = fish.clone(options.menus);
			
			this._menus = menus;
			this.dirName = options.dirName;
			this.colModel = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: this.i18nData.DIRMENUMGR_MENU_NAME,
				search: true,
				width: "30%"
			}, {
				name: 'url',
				label: this.i18nData.DIRMENUMGR_MENU_URL,
				search: true,
				width: "45%"
		
			}, {
				name: 'privCode',
				label: this.i18nData.DIRMENUMGR_PRIV_CODE,
				width: "25%"
			}];
			// return this.render();
		},
		render: function() {
			this.setElement(this.template(this.i18nData));
		},

		afterRender: function() {
			// this.$(".js-dir-name").html(this.dirName);

			this.$grid = this.$(".js-grid-menu-sel").grid({
				colModel: this.colModel,
				multiselect: true,
				data: this._menus,
				searchbar: true,
				caption: this.dirName
			});
			this.$grid.prev().children("div").searchbar({target: this.$grid});
			
		},

		ok: function() {
			var menuList = this.$(".js-grid-menu-sel").grid("getCheckRows");
			if (menuList.length > 0) {
				
				this.popup.close(menuList);
			} else {
				fish.info(this.i18nData.DIRMENUMGR_PLS_SEL_MENU);
			}
		}
	});
});
