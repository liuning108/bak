/**
 * Title: MenuMgr.js
 * Description: Menu Management View
 * Author: wu.yangjin
 * Created Date: 15-5-11 9:26 AM
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 * Modify: wang.hui
 */
define([
	'text!modules/dirmenumgr/templates/MenuMgr.html',
	'modules/dirmenumgr/models/DirOrMenuItem',
	'modules/dirmenumgr/actions/DirMenuAction',
	'i18n!modules/dirmenumgr/i18n/dirmenumgr'
], function(menuMgrTpl, DirOrMenuItem, dirMenuAction, i18nDirMenuMgr) {
	return portal.BaseView.extend({
		template: fish.compile(menuMgrTpl),

		events: {
			"click .js-new": "newMenu",
			"click .js-edit": "editMenu",
			"click .js-ok": "ok",
			"click .js-delete": "del",
			"click .js-cancel": "cancel"
		},

		initialize: function(options) {
			this.initMenu = options.rowdata;
			this.colModel = [{
				name: 'privId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'privName',
				label: i18nDirMenuMgr.DIRMENUMGR_MENU_NAME,
				search: true,
				width: "25%"
			}, {
				name: 'url',
				label: i18nDirMenuMgr.DIRMENUMGR_MENU_URL,
				search: true,
				width: "45%"		
			}, {
				name: 'privCode',
				label: i18nDirMenuMgr.DIRMENUMGR_PRIV_CODE,
				width: "20%"			
			}, {
				name: 'operate',
				label: '',
				sortable: false,
				width: "10%",
				formatter: 'actions',
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];
			this._menuItem = new DirOrMenuItem(); //定义menuItem

			this.listenTo(this._menuItem, 'change', this.menuItemUpdated); //设置menu的change事件
		},

		render: function() {
			this.setElement(this.template(i18nDirMenuMgr));
		},

		afterRender: function() {
			var $grid = this.$(".grid").grid({
				autowidth: true,
				colModel: this.colModel,
				searchbar: true,
				onSelectRow: function(e, rowid, state) {
					var rowdata = $grid.grid("getRowData", rowid);
					if(rowdata.menuType == undefined){
						rowdata.menuType = 'S';
					}
					this._menuItem.clear({
						silent: true
					}).set(rowdata, {
						silent: true
					});
					this.cancel();
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(i18nDirMenuMgr.DIRMENUMGR_DEL_MENU_CONFIRM,function() {
							this.remMenu(rowdata);
						}.bind(this), $.noop)
					return false;
				}.bind(this)
			});
			// $grid.prev().children().searchbar({target: $grid});

			this.$(".js-menu-detail .js-menu-hold").combobox({
				dataTextField: 'Text',
				dataValueField: 'Value',
				dataSource: [{
					'Text': i18nDirMenuMgr.COMMON_YES,
					'Value': "Y"
				}, {
					'Text': i18nDirMenuMgr.COMMON_NO,
					'Value': "N"
				}]
			});
			this.$(".js-menu-type").combobox({
				dataTextField: 'Text',
				dataValueField: 'Value',
				dataSource: [{
					'Text': i18nDirMenuMgr.DIRMENUMGR_MENU_TYPE_S,
					'Value': "S"
				}, {
					'Text': i18nDirMenuMgr.DIRMENUMGR_MENU_TYPE_I,
					'Value': "I"
					//暂不支持flex
				// }, {
				// 	'Text': i18nDirMenuMgr.DIRMENUMGR_MENU_TYPE_F,
				// 	'Value': "F"
				}, {
					'Text': i18nDirMenuMgr.DIRMENUMGR_MENU_TYPE_D,
					'Value': "D"
				}, {
					'Text': i18nDirMenuMgr.DIRMENUMGR_MENU_TYPE_O,
					'Value': "O"
				}]
			});

			this.$(".form").form();

			dirMenuAction.qryAllMenus(function(data) {
				var menuList = data || [];
			
				$grid.grid("reloadData", menuList);
				if (data.length > 0) {
					$grid.grid("setSelection", menuList[0]);
				}
				if (this.initMenu != null) {
					$grid.grid("setSelection", this.initMenu);
					this.$(".js-edit").trigger('click');
					this._hasInitMenu = true;
				}
			}.bind(this));
		},

		newMenu: function() {
			var $form = this.$("form");
			$form.find(".js-new").parent().hide();
			$form.find(".js-new").parent().next().show();
			$form.form('enable');
			$form.form('clear');
			$form.find(".js-ok").data("type", "new");
			this.$(".js-menu-type").combobox('value','S');
		},

		editMenu: function() {
			var $form = this.$("form");
			$form.find(".js-edit").parent().hide();
			$form.find(".js-edit").parent().next().show();
			$form.form('enable');
			$form.find(".js-ok").data("type", "edit");
		},

		ok: function() {
			var $form = this.$("form"),
				$grid = this.$(".grid");
			if ($form.isValid()) {
				var menuData = $form.form('value');
				// menuData.menuName = menuData.privName;
				menuData.privType = "M";
				switch ($form.find(".js-ok").data("type")) {
				case "new":
					dirMenuAction.addMenu(menuData, function(status) {
						var menu = status;
						menu.privId = status.menuId;
					
						$grid.grid("addRowData", menu, 'last');
						$grid.grid("setSelection", menu);
						fish.success(i18nDirMenuMgr.DIRMENUMGR_ADD_MENU_SUCCESS);
					}.bind(this));
					break;
				case "edit":
					menuData.menuId = this._menuItem.get("privId");
					dirMenuAction.modMenu(menuData, function(status) {
						if(status){
							var val = fish.extend({}, menuData);
							val.privId = val.menuId;
							
							$grid.grid("setRowData", val);
							$grid.grid("setSelection", val);
							fish.success(i18nDirMenuMgr.DIRMENUMGR_MOD_MENU_SUCCESS);
						}
						
					}.bind(this));
					break;
				default:
					break;
				}
			}
		},

		cancel: function() {
			var $form = this.$("form");
			$form.find(".js-cancel").parent().prev().show();
			$form.find(".js-cancel").parent().hide();
			this._menuItem.trigger("change");
			return false;
		},

		seekBeforeRemRow: function($grid, rowdata) {
			var nextrow = $grid.grid("getNextSelection", rowdata),
				prevrow = $grid.grid("getPrevSelection", rowdata);
			if (nextrow) {
				$grid.grid("setSelection", nextrow);
			} else if (prevrow) {
				$grid.grid("setSelection", prevrow);
			}
		},

		remMenu: function(rowdata) {
			var $grid = this.$(".grid");
			dirMenuAction.delMenu(rowdata.privId, function(status) {
				this.seekBeforeRemRow($grid, rowdata);
				$grid.grid("delRowData", rowdata);
				fish.success(i18nDirMenuMgr.DIRMENUMGR_DEL_MENU_SUCCESS);
			}.bind(this));
		},

		menuItemUpdated: function() {
			var $form = this.$("form");
			$form
				.form('disable')
				.form('clear')
				.form('value', this._menuItem.toJSON());
			$form.resetValid();
			if (this._hasInitMenu) {
				this.trigger('edit-close', this._menuItem.toJSON());
				// this.popup.close();
			}
		}
	});
});
