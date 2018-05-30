define([
	"text!modules/portlets/myfav/templates/MyFavorite.html",
	"modules/portlets/myfav/actions/MyFavoriteAction",
	"css!modules/portlets/myfav/css/MyFavorite"
], function(MyFavTpl, MyFavoriteAction) {
	return portal.BaseView.extend({
		template: fish.compile(MyFavTpl),

		events: {
			"click li": "menuOpen",
			"click .thumbnail": "menuOpen"
		},

		initialize : function(){
		},

		titleLine : "<div class='panel-heading-button pull-right'><i id='myfavicon' class='iconfont icon-list'></i></div>",

		render: function() {
			var that = this;
			var portalId = portal.appGlobal.get("portalId");

			that.header.on("click","#myfavicon",function(){
	    		that.$el.toggleClass("myfavList");
	    		var fontColor = that.$el.hasClass("myfavList")?"red":"yellowgreen";
	    		fish.trigger("favIconClick:"+that.options.menuId, {"fontColor":fontColor})
	    	})

			MyFavoriteAction.qryUserFavMenuListByPortalId(portalId,
				function(favMenuList) {
					fish.forEach(favMenuList, function(fav) {
						if (fav.alias) {
							fav.menuName = fav.alias;
						} else {
							fav.menuName = fav.privName;
						}
						if (!fav.iconUrl) {
							fav.iconUrl = 'iconfont icon-page';
						}
					});
					this.setElement(this.template({
						favMenuList: favMenuList
					}));
					// 根据参数进行一些必要的操作
					if(this.options.params && this.options.params == 2) {
			    		this.$el.toggleClass("myfavList");
					}
					//
                    this.$(".thumbnail").each(function (i, el) {
   						that.menuClick(el,favMenuList[i]);
                    });
					this.$("li").each(function(i, el) {
						that.menuClick(el,favMenuList[i]);
					});
				}.bind(this)
			);
		},

		menuClick : function(el,menu){
			$(el).data("menuid", menu.menuId);
			$(el).data("menuurl", menu.url);
			$(el).data("privname", menu.menuName);
			$(el).data("menutype", menu.MENU_TYPE);
		},
		menuOpen : function(e){
			var menuId = $(e.currentTarget).data("menuid"),
				menuUrl = $(e.currentTarget).data("menuurl"),
				menuType = $(e.currentTarget).data("menutype"),
				privName = $(e.currentTarget).data("privname");
			portal.openMenu(menuId, menuUrl, menuType, privName);
		},
		cleanup:function(){
		},

		refresh: function (params) {
			console.log('refresh my favorite portlet');
		}
	});
});
