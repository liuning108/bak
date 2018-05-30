define([
	'text!mvno/modules/mvnomgr/templates/MenuSelector.html',
	'modules/rolemgr/actions/RoleMgrAction',
	'modules/usermgr/actions/UserMgrAction',
	'i18n!modules/rolemgr/i18n/rolemgr',
	'i18n!mvno/modules/mvnomgr/i18n/mvnomgr',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr'
], function(menuSelectorTpl, RoleMgrAction, UserMgrAction, i18nRoleMgr, i18nMvnoMgr,i18nDirMenuMgr) {
	return portal.BaseView.extend({
		template: fish.compile(menuSelectorTpl),
		events: {
			"click .js-ok": 'ok'
		},
		i18nData: fish.extend({}, i18nRoleMgr, i18nMvnoMgr, i18nDirMenuMgr),
		getBoolStr: function(bool) {
			if (bool === 'Y') {
				return this.i18nData.COMMON_YES;
			} else if (bool === 'N') {
				return this.i18nData.COMMON_NO;
			} else {
				return '';
			}
		},
		initialize: function(options) {
			this.menus = options.menus;
			this.selectMenus = options.selectMenus;
			// this.dirName = options.dirName;
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
				width: "70%"
			}];
			// return this.render();
		},
		render: function() {
			this.setElement(this.template(this.i18nData));
		},

		afterRender: function() {
			this.ids = [];
			fish.forEach(this.menus, function(menu) {
				menu.isHoldStr = this.getBoolStr(menu.isHold);
				for (var i = 0; i < this.selectMenus.length; i++) {
					this.ids[i] = this.selectMenus[i].privId;
					if (this.selectMenus[i].privId == menu.privId){
						menu.isAuthorized = this.selectMenus[i].isAuthorized;
						menu.privLevel = this.selectMenus[i].privLevel;
					}
				}
				// menu.isGrantStr = menu.isAuthorized == undefined ?'Y':menu.isAuthorized;
				// var testmenu = fish.findWhere(this.selectMenus,menu);
				// console.info(testmenu);
			}, this);
			this._menus = this.menus;

			this.$grid = this.$(".js-menu-sel").grid({
				colModel: this.colModel,
				multiselect: true,
				data: this._menus,
				searchbar: true
			});
			this.$grid.prev().children("div").searchbar({target: this.$grid});
			if (this._menus.length > 0) {
				this.$grid.grid("setSelection", this._menus[0]);
				
				this.$grid.grid("setCheckRows", this.ids);
			}
			
		},

		ok: function() {
			this.popup.close(this.$grid.grid("getCheckRows"));
		}
	});
});
