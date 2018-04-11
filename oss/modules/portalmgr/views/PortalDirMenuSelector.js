define(["text!modules/portalmgr/templates/PortalDirMenuSelectorTemplate.html"],
	function(template) {
	var PortalDirMenuSelector = portal.BaseView.extend({
		template: fish.compile(template),
		grid: null,
		events: {
			"click .js-ok": 'ok',
			"click .js-rowdata-checkbox": "childrenChecked"
		},
		initialize: function(options) {
			this.i18nData = options.i18nData;
			this.dirmenus = options.dirmenus;
			this.parentName = options.parentName;
			this.colModel = [{
				name: 'partyId',
				label: '',
				key: true,
				hidden: true
			}, {
				name: 'partyName',
				label: this.i18nData.PORTAL_DIR_MENU_SEL_NAME,
				search: true
			}, {
				name: 'url',
				label: this.i18nData.PORTAL_DIR_MENU_SEL_URL,
				search: true		
			}, {
				name: 'operate',
				label: "",
				width: 80,
				formatter: function(cellValue, formatterOptions, rowData) {
					if (rowData) {
						var html = "<div class='pull-right checkedAddChildren'><input type='checkbox' class='js-rowdata-checkbox dialog-grid-icon' rowid='" + rowData.partyId + "' "
						+ (rowData.type == 1 ? 'disabled' : '') + ">" + this.i18nData.PORTAL_DIR_MENU_SEL_ADD_CHILDREN + "</input></div>";
						return html;
					}
					return "";
				}.bind(this)
			}];
			fish.forEach(this.dirmenus, function(item) {
			    if (!item.url) {
			        item.url = item.menuUrl;
			    }
			});			
		},
		render: function() {
			this.setElement(this.template(this.i18nData));
		},
		afterRender: function() {
			var $grid = this.$el.find(".js-grid-sel").grid({
				autowidth: true,
//				height: 360,
				colModel: this.colModel,
				searchbar: true,
				caption: this.parentName,
				multiselect: true,
				data: this.dirmenus,
				selarrrow: []
			});
			$(".checkedAddChildren").css("padding-right","20px");
			// this.$(".js-parent-name").html(this.parentName);
			$grid.prev().children('div').searchbar({target: $grid});
		},
		ok: function() {
			var menuList = this.$(".js-grid-sel").grid("getCheckRows");
			if (menuList.length > 0) {
				// this.trigger("OKEvent", menuList);
				this.popup.close(menuList);
			} else {
				fish.info(this.i18nData.PORTAL_DIR_OR_MENU_SEL_NULL);
			}
		},
		childrenChecked: function(event) { //children触发的事件
			if (event && event.target) {
				var $check = $(event.target);
				var selectedNode = this.$(".js-grid-sel").grid("getRowData", $check.attr("rowid"));
				selectedNode.addCascade = $check.prop("checked"); //设置Cascade值
			}
		}
	});
	return PortalDirMenuSelector;
});
