define([
	"text!stafforg/modules/areamgr/templates/AreaSingleSelPopWin.html",
	"i18n!stafforg/modules/areamgr/i18n/areamgr",
	"stafforg/modules/areamgr/actions/AreaAction"
], function(areaTemplate, i18nArea, areaAction) {
	return portal.BaseView.extend({
		template: fish.compile(areaTemplate),

		events: {
			"click .js-ok": "okClick",
			"click .js-cancel": "cancelClick"
		},

		initialize: function(options) {
			this.options = options;
			if (this.options.resource) {
				this.resource = fish.extend({}, i18nArea, this.options.resource);
			} else {
				this.resource = fish.extend({}, i18nArea);
			}
		},

		render: function() {
			this.setElement(this.template(this.resource));
		},

		afterRender: function() {
			this.areaGrid = this.$(".js-area-grid").grid({
				autowidth: true,
				colModel: [{
					name: 'areaId',
					label: '',
					key: true,
					hidden: true
				}, {
					name: 'areaName',
					label: this.resource.AREA_NAME,
					width: 500,
					search: true
				}, {
					name: 'areaCode',
					label: this.resource.AREA_CODE,
					width: 500,
					search: true
				}],
				leafChange:true,
				onRowExpand: function(e, rowdata, target) {
				    this.expandRowCommon(rowdata);
				}.bind(this),
				expandColumn: "areaName",
				searchbar: true,
				treeGrid: true
			});
			areaAction.qryAreaListByParentId(null, function(data) {
				if (data){
					if (data.length > 0) {
                        fish.forEach(data, function(area) {
                            area.children = []; 
                        }.bind(this));
                    }	
					this.areaGrid.grid("reloadData", data);
					this.areaGrid.grid("setSelection", data[0]);
				}
			}.bind(this));
		},
		expandRowCommon: function(rowdata) {
			var that = this;
		    that.areaGrid.grid("setSelection", rowdata);
            if (!rowdata.loaded) { 
                areaAction.qryAreaListByParentId(rowdata.areaId, function(data) {
                    var areaList = data || [];
                    var rows = [];
                    if (areaList.length > 0) {
                        fish.forEach(areaList, function(area) {
                            area.children = []; 
                            rows[rows.length] = area;
                        }.bind(this));
                         this.areaGrid.grid("addChildNodes", rows, rowdata); 
                    }      
                }.bind(that));
                 rowdata.loaded = true;
            }
		},
		okClick: function() {
			var selected = this.areaGrid.grid("getSelection");
			if (!this.options.canSelectedEmpty) { //可以选择空的，默认是不能的
				if ($.isEmptyObject(selected)) {
					fish.warn(this.resource.AREA_MUST_SEL_ROW);
					return;
				}
			}
			this.popup.close(selected);
		}
	});
});