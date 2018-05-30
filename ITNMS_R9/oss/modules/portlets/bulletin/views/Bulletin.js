define([
	"modules/portlets/bulletin/actions/BulletinAction",
	"text!modules/portlets/bulletin/templates/Bulletin.html"
], function(bulletinAction, tpl) {
	return portal.BaseView.extend({

		template: fish.compile(tpl),
		titleLine : "<div class='panel-heading-button pull-right'><i id='myBulletin' class='iconfont icon-ellipsis'></i></div>",
		
		events: {
			"click a": function(e) {
				var bulletinId = $(e.currentTarget).data("bulletinid"),
					title = $(e.currentTarget).data("title"),
					hasRead = $(e.currentTarget).data("hasread"),
					typeName = $(e.currentTarget).data("typename"),
					levelName = $(e.currentTarget).data("levelname"),
					stateDate = $(e.currentTarget).data("statedate"),
					content = $(e.currentTarget).data("content");
				fish.popupView({
					url: "bulletin/modules/bulletinmgr/views/BulletinDetailPopWin",
					viewOption: {
						title: title,
						content: content,
						typeName: typeName,
						levelName: levelName,
						stateDate: stateDate
					},
					height: 500
				});
				//如果未读的话，需要修改成已读
				if(hasRead == 'N'){
					bulletinAction.modBulletinView(bulletinId, function(data){
						if(data){
							$(e.currentTarget).find(".list-group-item-icon > i").removeClass("icon-no-read").addClass('icon-read');
						}
					});
				}			
			}
		},

		render: function() {
			var that = this;
			bulletinAction.queryBulletinByStaffId(function(data) {
					if(data){
						var bulletinList = data || [], height = 0;							
						that.setElement(that.template({
							bulletinList: bulletinList
						}));
						that.$("a").each(function(i, el) {
							height += $(this).outerHeight(true);
							if(height >= that.contentHeight) {
								this.remove();
							} else {
								el.style.color = bulletinList[i].recordColor;
								$(el).data("bulletinid", bulletinList[i].bulletinId);	
								$(el).data("title", bulletinList[i].title);	
								$(el).data("levelname", bulletinList[i].levelName);
								$(el).data("statedate", bulletinList[i].stateDate);
								$(el).data("typename", bulletinList[i].typeName);	
								$(el).data("hasread", bulletinList[i].hasRead);	
								$(el).data("content", bulletinList[i].content);
							}
						});
					}
				}
					
			);
			that.header.on("click","#myBulletin",function(){
				portal.openMenu(null, 'modules/bulletinmgr/views/BulletinReceive', 's', 'BulletinReceive');
			})
		}
	});
});