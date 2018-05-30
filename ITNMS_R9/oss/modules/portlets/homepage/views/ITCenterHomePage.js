define([
	"text!modules/portlets/homepage/templates/ITCenterHomePage.html",
	"modules/portlets/homepage/views/ContentItem",
	'css!modules/portlets/homepage/css/homepage.css'
], function(tpl,ContentItem) {
	return portal.BaseView.extend({
		initialize: function(options) {
			var ts = this;
			
			if (this.options.params && this.options.params.privs) {
				this.itemViewList = [];
				var iconSize = this.options.params.iconSize || 3, res = [];
				fish.each(this.options.params.privs, function (v) {
					var menu = fish.find(portal.allMenu, {privCode: v});
					if (menu) {
					   res.push(menu);
					}
				});
				fish.each(res, function (d) {
					ts.itemViewList.push(new ContentItem({ url: d.url, iconSize: iconSize}));
				});
			} else {
				this.itemViewList = [
				    new ContentItem({
				    	url: "modules/usermgr/views/UserMgr",
				    	iconSize: 3
				    }),
				   
				    new ContentItem({
				    	url: "modules/rolemgr/views/RoleMgr",
				    	iconSize: 3
				    }),
				 
				    new ContentItem({
				    	url: "modules/dirmenumgr/views/DirMenuMgr",
				    	iconSize: 3
				    }),
				   
				    new ContentItem({
				    	url: "modules/portalmgr/views/PortalMgr",
				    	iconSize: 3
				    }),
				    
				    new ContentItem({
				    	url: "modules/logmgr/views/LogMgr",
				    	iconSize: 3
				    })
				];
			}
		},

		renderContent:function(){
			var cnt = 1,
			that = this;
			var menuUrlMap = {};
			fish.forEach(portal.allMenu, function(item) {
				if (item.type == '1') {
					menuUrlMap[item.url] = item;
				}
			});
			ContentItem.prototype.setMenuUrlMap(menuUrlMap);
			var cntPerRow = 12/that.itemViewList[0].model.iconSize;
			fish.forEach(that.itemViewList, function(itemView) {
				var url = itemView.model.url;
				if (menuUrlMap[url]) {
					if (cnt <= cntPerRow) {
						that.insertView("#homepage_content_1", itemView);
					} else {
						that.insertView("#homepage_content_2", itemView);
					}
					cnt++;
				}
			});
			that.renderViews("#homepage_content_1");
			that.renderViews("#homepage_content_2");
		},

		render: function() {
			this.setElement(tpl);
			this.renderContent();
		},

		refreshFunc: function () {
			console.log('refresh grid');
		},

		removeFunc: function () {
			console.log('remove grid');
		},

		scaleFunc: function (operate) {
			if (operate === "maximize") {
				console.log('maximize grid');
			}
			if (operate === "restore") {
				console.log('restore grid');
			}
		},

		toggleFunc: function (direction) {
			if (direction === 'up') {
				console.log('collapse grid');
			}
			if (direction === 'down') {
				console.log('expand grid');
			}
		},

		settingFunc: function() {
			var that = this, items = [], size;
			this.getViews('#homepage_content_1').each(function (view) {
                items.push(view.model.privCode);
                size = view.model.iconSize;
            });
            this.getViews('#homepage_content_2').each(function (view) {
                items.push(view.model.privCode);
            });
			fish.popupView({
		    	url: "modules/portlets/homepage/views/ContentItemSelector",
		    	width: 650,
		    	viewOption: {
		    		selectedItem: items,
		    		size: size
		    	},
		    	close: function(data) {
		    		var count = 1, res = [], 
		    			iconSize = data.menuIconSize,
		    			cntPerRow = 12/iconSize;
		    		fish.each(data.menuData, function (d) {
		    			res.push(d.privCode);
		    		});
		    		that.params = {
		    			privs: res,
		    			iconSize: iconSize
		    		};
		    		that.removeView("#homepage_content_1");
					that.removeView("#homepage_content_2");
		    		fish.forEach(data.menuData, function(d) {
						if (d.url) {
							var itemView = new ContentItem({ url: d.url, iconSize: iconSize });
							if (count <= cntPerRow) {
								that.insertView("#homepage_content_1", itemView);
							} else {
								that.insertView("#homepage_content_2", itemView);
							}
							count++;
						}
					});
					that.renderViews("#homepage_content_1");
					that.renderViews("#homepage_content_2");
		    	}
		    });
		}
	});
});
