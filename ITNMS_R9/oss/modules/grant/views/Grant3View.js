/**
 * Title: grant3.js
 * Description: Granting View of 3 Divided Area
 * Author: wu.yangjin
 * Created Date: 15-4-10 上午11:01
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!modules/grant/templates/Grant3View.html'
], function(grant3Tpl) {
	return portal.BaseView.extend({
		template: fish.compile(grant3Tpl),

		events: {
			"click .js-transfer > button:nth-child(2)": 'grant',
			"click .js-transfer > button:nth-child(1)": 'grantBatch',
			"click .js-transfer > button:nth-child(3)": 'degrant',
			"click .js-transfer > button:nth-child(4)": 'degrantBatch',
			"click .js-confirm": 'confirm',
			"click .js-cancel": 'cancel'
		},

		initialize: function() {
			if (fish.isArray(this.tabItemInfo)) {
				fish.forEach(this.tabItemInfo, function(tabItem) {
					this.listenTo(tabItem.grantItems, 'reset', function() {
						var $grid = this.$("#tabs-" + tabItem.name + " .js-tab-grid"),
							itemArr = tabItem.grantItems.toJSON(),
							id = tabItem.grantItems.model.prototype.idAttribute,
							rowdata = null;
						$grid.grid("reloadData", itemArr);
						if (itemArr.length > 0) {
							// we must retrieve rowdata using the grid api
							rowdata = $grid.grid("getRowData", itemArr[0][id]);
							$grid.grid("expandNode", rowdata, true);
						}
					});
				}, this);
			} else {
				if (fish.isObject(this.tabItemInfo)) {
					this.listenTo(this.tabItemInfo.grantItems, 'reset', function() {
						var itemArr = this.tabItemInfo.grantItems.toJSON(),
							id = this.tabItemInfo.grantItems.model.prototype.idAttribute,
							rowdata = null;
						this.$tab.grid("reloadData", itemArr);
						if (itemArr.length > 0) {
							rowdata = this.$tab.grid("getRowData", itemArr[0][id]);
							this.$tab.grid("expandNode", rowdata, true);
						}
					});
				}
			}

			this.listenTo(this.grantItemsU, 'all', function(event) {
				var id = this.grantItemsU.model.prototype.idAttribute,
					chkdItems = fish.map(this.grantItemsU.filter(function(item) {
						return item.get('_chkd_') ? true : false;
					}), function(m) {return m.toJSON()}),
					avaiItems = fish.map(this.grantItemsU.filter(function(item) {
						return item.get('_chkd_') ? false : true;
					}), function(m) {return m.toJSON()});
				if (event === 'reset') {
					this.$gridU.grid("reloadData", this.grantItemsU.toJSON());
					if (chkdItems.length > 0) {
						this.$gridU.grid("setCheckRows", fish.pluck(chkdItems, id), true);
						this.$gridU.grid("setCheckDisabled", fish.pluck(chkdItems, id), true);
					}
					if (avaiItems.length > 0) {
						this.$gridU.grid("setSelection", avaiItems[0]);
					}
				}
				this.resetBatchButtonD();
				this.resetButtonD();
			});

			this.listenTo(this.grantItemsD, 'all', function(event) {
				if (event === 'reset') {
					this.$gridD.grid("reloadData", this.grantItemsD.toJSON());
					if (this.grantItemsD.size() > 0) { // seek grid row
						this.$gridD.grid("setSelection", this.grantItemsD.at(0).toJSON());
					}
					var disaItems = fish.map(this.grantItemsD.filter(function(item) {
						return item.get('_disa_') ? true : false;
					}), function(m) {return m.toJSON()}),
						id = this.grantItemsD.model.prototype.idAttribute;
					if (disaItems.length > 0) {
						this.$gridD.grid("setCheckDisabled", fish.pluck(disaItems, id), true);
					}
				}
				this.resetBatchButtonU();
				this.resetButtonU();
			});
		},

		/**
		 * initialize grant item collection
		 * user are encouraged to override this function
		 */
		reload: function() {
			var loadGrid = this.getActiveTabItem().loadGrid;
			if (fish.isFunction(loadGrid)) {
				loadGrid.call(this);
			}
		},

		render: function() {
			this.setElement(this.template(fish.extend({
				tabItemInfo: this.tabItemInfo
			}, this.i18nData)));
			this.$tab = this.$(".js-tab-area");
			this.$gridU = this.$(".js-listing-grid");
			this.$gridD = this.$(".js-summary-grid");
			this.$btns = this.$(".js-transfer > button");
		},

		getActiveTabGrid: function() {
			if (this.$tab.hasClass("ui-tabs")) {
				var index = this.$tab.tabs('option', 'active'),
				tabName = this.tabItemInfo[index].name;
				return this.$("#tabs-" + tabName + " .js-tab-grid");
			} else {
				return this.$tab;
			}
		},

		getActiveTabItem: function() {
			if (this.$tab.hasClass("ui-tabs")) {
				var index = this.$tab.tabs('option', 'active');
				return this.tabItemInfo[index];
			} else {
				return this.tabItemInfo;
			}
		},

		afterRender: function() {
			var $tab = this.$tab,
				i = 0;
			if (fish.isArray(this.tabItemInfo) && this.tabItemInfo.length > 0) {
				// must initialize tab first
				$tab.tabs();
				fish.forEach(this.tabItemInfo, function(tabItem) {
					var $grid = this.$("#tabs-" + tabItem.name + " .js-tab-grid");
					$tab.tabs('option', 'active', i++);
					$grid.grid({
//						height: 180,
						autoWidth: true,
						colModel: tabItem.colModel,
						expandColumn: tabItem.colModel[1].name,
						treeGrid: true,
//						treeIcons: tabItem.treeIcons || {
//							plus: 'glyphicon glyphicon-folder-close',
//		                    minus: 'glyphicon glyphicon-folder-open',
//		                    leaf: 'glyphicon glyphicon-file'
//		                },
						//treeDataFormat: 'line',
						onRowExpand: function(e, rowdata) {
							if (fish.isFunction(tabItem.rowExpandCallback)) {
								if ($grid.grid("getNodeChildren", rowdata).length === 0) {
									tabItem.rowExpandCallback.call(this, e, rowdata);
									// make sure rowSelectionCallback is called only once on initialization
									$grid.grid("setSelection", rowdata);
								}
							}
						}.bind(this),
						onSelectRow: tabItem.rowSelectCallback.bind(this)
					});
				}, this);
				$tab.tabs('option', 'active', 0);
				$tab.tabs({
					activate: function(event, ui) {
						var index = $tab.tabs('option', 'active'),
							func = this.tabItemInfo[index].loadGrid;
						if (fish.isFunction(func)) {
							func.call(this);
						}
						this.tabresize();
					}.bind(this)
				});
			} else {
				$tab.grid({
//					height: 180,
					autoWidth: true,
					colModel: this.tabItemInfo.colModel,
					expandColumn: this.tabItemInfo.colModel[1].name,
					treeGrid: true,
//					treeIcons: this.tabItemInfo.treeIcons || {
//						plus: 'glyphicon glyphicon-folder-close',
//	                    minus: 'glyphicon glyphicon-folder-open',
//	                    leaf: 'glyphicon glyphicon-file'
//	                },
					onRowExpand: function(e, rowdata) {
						if (fish.isFunction(this.tabItemInfo.rowExpandCallback)) {
							if ($tab.grid("getNodeChildren", rowdata).length === 0) {
								this.tabItemInfo.rowExpandCallback.call(this, e, rowdata);
								// make sure rowSelectionCallback is called only once on initialization
								$tab.grid("setSelection", rowdata);
							}
						}
					}.bind(this),
					onSelectRow: this.tabItemInfo.rowSelectCallback.bind(this)
				});
			};

			this.$gridU.grid({
//				height: 180,
				autoWidth: true,
				colModel: this.colModelU,
				multiselect: true,
				onSelectRow: function() {
					var $btn = this.$btns.eq(1),
						selrows = fish.filter(this.$gridU.grid("getCheckRows"), function(r) {
							return r._chkd_ ? false : true;
						});
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				}.bind(this),
				onSelectAll: function(arowids, status) {
					var $btn = this.$btns.eq(1),
					    selrows = this.$gridU.grid("getCheckRows");
					if (selrows.length > 0) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				}.bind(this)
			});

			this.$gridD.grid({
//				height: 180,
				autoWidth: true,
				colModel: this.colModelD,
				multiselect: true,
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent;
					var $btn = this.$btns.eq(2),
						selrows = this.$gridD.grid("getCheckRows"),
						rowdata = this.$gridD.grid("getRowData", rowid);
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				}.bind(this),
				onSelectAll: function(arowids, status) {
					var $btn = this.$btns.eq(2);
					    selrows = this.$gridD.grid("getCheckRows");
					if (selrows.length > 0) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				// }.bind(this),
				// beforeSaveRow: function(e, rowid, rowdata, option) {
				// 	if (fish.isFunction(this.gridDBeforeSaveRow)) {
				// 		return this.gridDBeforeSaveRow(e, rowid, rowdata, option);
				// 	} else {
				// 		return true;
				// 	}
				}.bind(this)
			});
		},

		grant: function() {
			var selrows = fish.filter(this.$gridU.grid("getCheckRows"), function(r) {
					return r._chkd_ ? false : true;
				}), // makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsU.model.prototype.idAttribute;

			this.grantConfirm(selrows, function(modrows) {
				var rowids = fish.pluck(selrows, id),
					rows = modrows || fish.clone(selrows);
				fish.forEach(selrows, function(r) {r._chkd_ = true});
				//this.$gridU.grid("setCheckRows", rowids, true);
				this.$gridU.grid("setCheckDisabled", rowids, true);
				this.$gridD.grid("addRowData", rows, 'last');
				this.grantItemsU.remove(rowids);
				this.grantItemsD.add(rows);
			}.bind(this));
		},

		grantBatch: function() {
			var selrows = fish.filter(this.$gridU.grid("getRowData"), function(r) {
				return r._chkd_ ? false : true;
			}), // makes a shallow copy of the original row data array returned by fish
			id = this.grantItemsU.model.prototype.idAttribute;

			this.grantConfirm(selrows, function(modrows) {
				var rowids = fish.pluck(selrows, id),
					rows = modrows || fish.clone(selrows);
				fish.forEach(selrows, function(r) {r._chkd_ = true});
				//this.$gridU.grid("setCheckRows", rowids, true);
				this.$gridU.grid("setCheckDisabled", rowids, true);
				this.$gridD.grid("addRowData", rows, 'last');
				this.grantItemsU.remove(rowids);
				this.grantItemsD.add(rows);
			}.bind(this));
		},

		degrant: function() {
			var selrows = fish.clone(this.$gridD.grid("getCheckRows")),
				// makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsD.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				var rowids = fish.pluck(selrows, id);
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridD.grid("getRowid", row),
						rowdata = this.$gridU.grid("getRowData", rowid);
					if (!fish.isEmpty(rowdata)) {
						this.$gridU.grid("setCheckDisabled", [rowid], false);
						this.$gridU.grid("setCheckRows", [rowid], false);
						delete rowdata._chkd_;
						//this.$gridU.grid("setRowData", rowdata);
					}
					this.$gridD.grid("delRowData", rowid);
				}, this);

				this.grantItemsD.remove(rowids);
				this.grantItemsU.add(selrows);
			}.bind(this));
		},

		degrantBatch: function() {
			var selrows = fish.clone(this.$gridD.grid("getRowData")),
				// makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsD.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				var rowids = fish.pluck(selrows, id);
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridD.grid("getRowid", row),
						rowdata = this.$gridU.grid("getRowData", rowid);
					if (!fish.isEmpty(rowdata)) {
						this.$gridU.grid("setCheckDisabled", [rowid], false);
						this.$gridU.grid("setCheckRows", [rowid], false);
						delete rowdata._chkd_;
					}
					this.$gridD.grid("delRowData", rowid);
				}, this);

				this.grantItemsD.remove(rowids);
				this.grantItemsU.add(selrows);
			}.bind(this));
		},

		resetButtonD: function() {
			var selrows = fish.filter(this.$gridU.grid("getCheckRows"), function(r) {
					return r._chkd_ ? false : true;
				});
			if (selrows.length > 0) {
				this.$btns.eq(1).prop("disabled", false);
				this.$btns.eq(1).addClass("active");
			} else {
				this.$btns.eq(1).prop("disabled", true);
				this.$btns.eq(1).removeClass("active");
			}
		},

		resetButtonU: function() {
			if (this.$gridD.grid("getCheckRows").length > 0) {
				this.$btns.eq(2).prop("disabled", false);
				this.$btns.eq(2).addClass("active");
			} else {
				this.$btns.eq(2).prop("disabled", true);
				this.$btns.eq(2).removeClass("active");
			}
		},

		resetBatchButtonD: function() {
			if (this.grantItemsU.size() > 0) {
				this.$btns.eq(0).prop("disabled", false);
				this.$btns.eq(0).addClass("active");
			} else {
				this.$btns.eq(0).prop("disabled", true);
				this.$btns.eq(0).removeClass("active");
			}
		},

		resetBatchButtonU: function() {
			if (this.grantItemsD.size() > 0) {
				this.$btns.eq(3).prop("disabled", false);
				this.$btns.eq(3).addClass("active");
			} else {
				this.$btns.eq(3).prop("disabled", true);
				this.$btns.eq(3).removeClass("active");
			}
		},

		tabresize: function() {
			var $grid = this.getActiveTabGrid(),
				delta = this.$gridU.height() - $grid.height();
			portal.utils.gridIncHeight($grid, delta);
		}
	});
});