define([
	"modules/myfavmgr/actions/MyFavoriteAction",
	"text!modules/myfavmgr/templates/MyFavoriteMgr.html",
	"text!modules/myfavmgr/templates/DnDTip.html",
	"i18n!modules/myfavmgr/i18n/myfavmgr",
	"css!modules/myfavmgr/css/myfav"
], function(MyFavoriteAction, MyFavTpl, DnDTipTpl, i18nMyFavMgr) {
	return portal.BaseView.extend({
		template: fish.compile(MyFavTpl),

		templateDnDTip: fish.compile(DnDTipTpl),

		events: {
			"click .js-add": function(e) {
				var userId = portal.appGlobal.get("userId"),
					portalId = portal.appGlobal.get("portalId"),
					menuId = this.$("form").data("menuId"),
					alias = this.$("form").form('value').menuName;
				MyFavoriteAction.addFavoriteMenu({
					userId: userId,
					portalId: portalId,
					menuId: menuId,
					alias: alias,
					isDefaultOpen: 'N'
				}, function(status) {
					if (status) {
						if(status.menuFavId == undefined) {
							fish.info(i18nMyFavMgr.MYFAV_MENU_ALREADY_ADDED);
						} else {
							status.menuName = status.alias;
							status.stateDate = fish.dateutil.format(new Date(status.stateDate),fish.config.get("dateParseFormat.datetime"));
							
							this.$(".grid").grid("addRowData", status);
                            this.favSeqList.push(status.seq + "");
                            this.$("form").form('disable');
							this.$(".grid").grid("setSelection", status.menuFavId);
							this.$(".js-add").prop("disabled", true);
							fish.info(i18nMyFavMgr.MYFAV_ADD_MENU_SUCCESS);
						}
					}
				}.bind(this));
			}
		},

		initialize: function(options) {
			this.favSeqList = null;
		},

		render: function() {
			this.setElement(this.template(i18nMyFavMgr));
		},

		afterRender: function() {
			var $form = this.$("form"),
				$grid = this.$(".grid"),
				menuObj = portal.appGlobal.get("currentMenu");
				that = this;
			$form.data("menuId", menuObj.menuId);
			$form.form('value', {
				menuName: menuObj.menuName
			}).form('disable');
			that.$(".js-add").prop("disabled", true);
			$grid.grid({
				colModel: [{
					name: "menuFavId",
					key: true,
					hidden: true
				}, {
					name: "menuName",
					label: i18nMyFavMgr.MYFAV_MENU_NAME,
					editable: true,
					width: "30%",
					sortable:false
				}, {
					name: "menuId",
					hidden: true
				}, {
					name: "stateDate",
					label: i18nMyFavMgr.MYFAV_STATE_DATE,
					width: "25%",
					sortable:false
				}, {
					name: "isDefaultOpen",
					label: i18nMyFavMgr.MYFAV_DEFAULT_OPEN,
					editable: true,
					width: "22%",
					formatter: "select",
					edittype: "select", 
                    editoptions: {value: {Y: i18nMyFavMgr.COMMON_YES, N: i18nMyFavMgr.COMMON_NO}}
				}, {
					formatter: 'actions',
					sortable: false,
					formatoptions: {
						editbutton: true,
						delbutton: true,
						inlineButtonAdd: [{ 
	                        id: "jumpButton", 
	                        className: "inline-jump",
	                        icon: "glyphicon glyphicon-arrow-right",
	                        title: i18nMyFavMgr.MYFAV_JUMP
	                    }]
					},
					width: "23%",
				}],
				beforeDeleteRow: function(e, rowid, rowdata) {
					MyFavoriteAction.delFavoriteMenu(rowdata.menuFavId, function(status) {
						$grid.grid("delRow", rowdata.menuFavId, {trigger: false});
						//如果删除的menuid是当前的menuid,form生效
						if(rowdata.menuId == menuObj.menuId){
							$form.form("enable");
							that.$(".js-add").prop("disabled", false);
						}
					});
					return false;
				},
				beforeSaveRow: function(e, rowid, rowData) {
					rowData.alias = rowData.menuName;
					if (rowData.isDefaultOpen == undefined){
						rowData.isDefaultOpen = "Y";
					}
					MyFavoriteAction.modFavoriteMenu(rowData, function(status) {
						$grid.grid("saveRow", rowid, {trigger: false});
						$form.form("disable").form("value",rowData);
						that.$(".js-add").prop("disabled", true);
					});
					return false;
				},
				pagebar: true,
				create: function() {
					var grid_id = $grid.attr("id");
					var $td = $grid.find("#" + grid_id + "_pager_left");
					$td.append(that.templateDnDTip(i18nMyFavMgr));
				}
			});
			$grid.grid('sortableRows', {
				update: function(e, ui) {
					allFavs = $grid.grid("getRowData");
					$.each(allFavs, function(key, val) {
						val.seq = that.favSeqList[key];
						val.alias = val.menuName;
					});
					MyFavoriteAction.modFavoriteMenuSeq(allFavs, function(status) {
						that.favSeqList = fish.pluck(allFavs, "seq");
					});
				}
			});
			$grid.on("click", ".inline-jump", function (e) {
			    var rowid = $grid.grid("getRowid");
			    var data = $grid.grid("getRowData",rowid);
			    data.menuLabel = data.menuName;
				portal.openMenu(data);	    
			});
			that.loadGrid($form);
			
		},

		loadGrid: function($form) {
			var $grid = this.$(".grid"),
				portalId = portal.appGlobal.get("portalId");
			MyFavoriteAction.qryUserFavMenuListByPortalId(portalId,
				function(favMenuList) {
					fish.forEach(favMenuList, function(fav) {
						if (fav.alias) {
							fav.menuName = fav.alias;
						} else {
							fav.menuName = fav.privName;
						}
						fav.menuUrl = fav.url;
					});
					$grid.grid("reloadData", favMenuList);
					//如果menuid不在里面,form生效;menuname重新赋值一下
					var menuId = this.$("form").data("menuId"),
						menuSaved = fish.findWhere(favMenuList, {
						menuId: menuId
					});
					if (menuSaved) {
						this.$("form").form("value", menuSaved);
						$grid.grid("setSelection", menuSaved);
					} else if (+(menuId) >= 0) { // workspace, profile, etc are not allowed to be added
						this.$("form").form("enable");
						this.$(".js-add").prop("disabled", false);
					}
					this.favSeqList = fish.pluck(favMenuList, "seq");
				}.bind(this)
			);
		}
	});
});