define(["webroot"],function(webroot) {
	return {
		qryRootDirList: function(success) {
			fish.get("dirs/0/dirs", success, webroot);
		},
		qryDirMenuList: function(dirId, success) {
			fish.get("dirs/"+dirId+"/dirmenus", success, webroot);
		},
		qryAllMenus: function(success) {
			fish.get("menus", success, webroot);
		},
		qryMenuList: function(dirId, success) {
			fish.get("dirs/"+dirId+"/menus", success, webroot);
		},
		delMenuFromDir: function(menuList, dirId, success) {
			fish.remove("dirs/"+dirId+"/menus", menuList, success, webroot);
		},
		delDir: function(dirId, success, ctx) {
			fish.remove("dirs/"+dirId, success, webroot);
		},
		addDir: function(param, success) {
			fish.post("dirs", param, success, webroot);
		},
		modDir: function(param, success, ctx) {
			fish.put("dirs", param, success, webroot);
		},
		addMenu: function(param, success) {
			fish.post("menus", param, success, webroot);
		},
		addDirMenu: function(dirId, menuList, success) {
			fish.post("dirs/"+dirId+"/menus", menuList, success, webroot);
		},
		delMenu: function(menuId, success) {
			fish.remove("menus/"+menuId, success, webroot);
		},
		modMenu: function(param, success) {
			fish.put("menus", param, success, webroot);
		},
		qryNoDirMenuList: function(success) {
			fish.get("menus/out", success, webroot);
		},
		qryFonticons: function(success) {
			fish.get("fonticons", success, webroot);
		}
	}
});