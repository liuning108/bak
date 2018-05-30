define([
	"modules/portlets/lastoper/actions/LastOperAction",
	"text!modules/portlets/lastoper/templates/LastOper.html"
], function(LastOperAction, tpl) {
	return portal.BaseView.extend({

		template: fish.compile(tpl),

		events: {
			"click a": function(e) {
				var menuId = $(e.currentTarget).data("menuid"),
					menuUrl = $(e.currentTarget).data("menuurl"),
					menuName = $(e.currentTarget).data("menuname"),
					menuType = $(e.currentTarget).data("menutype");
				portal.openMenu(menuId, menuUrl, menuType, menuName);
			}
		},

		render: function() {
			var that = this;
			
			LastOperAction.qryUserLastOperMenus(function(menuList) {
				that.setElement(that.template({
					operMenuList: menuList
				}));
				that.$("a").each(function(i, el) {
					$(el).data("menuid", menuList[i].menuId);
					$(el).data("menuurl", menuList[i].url);
					$(el).data("menuname", menuList[i].privName);
					$(el).data("menutype", menuList[i].menuType);
				});
			});
		},
		
		refresh: function (params) {
			console.log('refresh last oper portlet');
		}
	});
});