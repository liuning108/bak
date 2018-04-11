/**
 * Title: Grant2.js
 * Description: Granting View of 2 Divided Area
 * Author: wu.yangjin
 * Created Date: 15-4-10 上午11:01
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!modules/grant/templates/Grant2View.html'
], function(grant2Tpl) {
	return portal.BaseView.extend({
		template: fish.compile(grant2Tpl),

		events: {
			"click .js-transfer .js-ds": 'grant',
			"click .js-transfer .js-dd": 'grantBatch',
			"click .js-transfer .js-us": 'degrant',
			"click .js-transfer .js-ud": 'degrantBatch',
			"click .js-ok": 'ok',
			"click .js-cancel": 'cancel',
			"click .js-edit": 'edit'
		},

		initialize: function() {
			this.listenTo(this.grantItemsU, 'all', function(event) {
				var grantItemList = this.grantItemsU.toJSON();
				if (event === 'reset') {
					this.$gridU.grid("reloadData", grantItemList);
					var operatable = fish.filter(grantItemList, function(item) {
						return item._rowd_ ? false : true
					});
					if (operatable.length > 0) {
						this.$gridU.grid("setSelection", operatable[0]);
					}
					this.postResetU();
				}
				this.resetBatchButtonD();
				this.resetButtonD();
			});

			this.listenTo(this.grantItemsD, 'all', function(event) {
				var grantItemList = this.grantItemsD.toJSON(),
					operaItemList = fish.filter(grantItemList, function(item) {
						return item._rowd_ ? false : true
				});
				if (event === 'reset') {
					this.$gridD.grid("reloadData", grantItemList);
					if (operaItemList.length > 0) {
						this.$gridD.grid("setSelection", operaItemList[0]);
					}
					this.postResetD();
				}
				this.resetBatchButtonU();
				this.resetButtonU();
			});
		},

		/**
		 * Users are encouraged to override this function
		 */
		reload: function() {},

		render: function() {
			this.setElement(this.template(this.i18nData));
			this.$(".showTitle").css({
				"width": "30%",
				"text-overflow": "ellipsis",
				"white-space": "nowrap",
				"overflow": "hidden"
			});
			if (this.templateBottom) {
				this.$(".modal-footer").append(this.templateBottom(this.i18nData));
			}
			if (this.templateDLHalf) {
				this.$(".js-dlh").append(this.templateDLHalf(this.i18nData));
			}

			this.$gridU = this.$('.grant-grid-u');
			this.$gridD = this.$('.grant-grid-d');
			this.$btnGroup = this.$(".js-transfer");
		},

		afterRender: function() {
			this.$gridU.grid({
				colModel: this.colModelU,
				caption: this.i18nData.GRANT_UP_TITLE,
				searchbar: true,		
				maxHeight:190,
				height:'auto',		
				multiselect: this.i18nData.multisel ? true : false,
				onSelectRow: function(e, rowid, state) {
					var $btn = this.$btnGroup.find(".js-ds"),
						selrows = this.i18nData.multisel
							&& this.$gridU.grid("getCheckRows")
							|| this.$gridU.grid("getRowData");
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
					this.trigger("selrow:u", this.$gridU.grid("getRowData", rowid));
				}.bind(this),
				onSelectAll: function(e, arowids, status) {
					var $btn = this.$btnGroup.find(".js-ds"),
						selrows = this.i18nData.multisel
							&& this.$gridU.grid("getCheckRows")
							|| this.$gridU.grid("getRowData");
					if (selrows.length > 0) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				}.bind(this)
			});
			this.$gridU.prev().children('div').searchbar({target: this.$gridU});

			this.$gridD.grid({
				colModel: this.colModelD,
				caption: this.i18nData.GRANT_DOWN_TITLE,
				searchbar: true,
				maxHeight:190,
				height:'auto',
				multiselect: this.i18nData.multisel ? true : false,
				onSelectRow: function(e, rowid, state) {
					var $btn = this.$btnGroup.find(".js-us"),
						selrows = this.i18nData.multisel
							&& this.$gridD.grid("getCheckRows")
							|| this.$gridD.grid("getRowData");
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
					this.trigger("selrow:d", this.$gridD.grid("getRowData", rowid));
				}.bind(this),
				onSelectAll: function(e, arowids, status) {
					var $btn = this.$btnGroup.find(".js-us"),
						selrows = this.i18nData.multisel
							&& this.$gridD.grid("getCheckRows")
							|| this.$gridD.grid("getRowData");
					if (selrows.length > 0) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
				}.bind(this)
			});
			
			this.$gridD.prev().children('div').searchbar({target: this.$gridD});
		},

		postResetD: function() {},
		postResetU: function() {},
		grantConfirm: function(selrows, success) {
			success();
			// console.warn("Should override Grant2View.grantConfirm.");
		},
		degrantConfirm: function(selrows, success) {
			success();
			// console.warn("Should override Grant2View.degrantConfirm.");
		},

		grant: function() {
			var selrows = this.i18nData.multisel
					&& fish.clone(this.$gridU.grid("getCheckRows"))
					|| [this.$gridU.grid("getSelection")],
				// makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsU.model.prototype.idAttribute;

			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridU.grid("getRowid", row),
						nextrow = this.$gridU.grid("getNextSelection", row),
						prevrow = this.$gridU.grid("getPrevSelection", row);
					if (nextrow) {
						this.$gridU.grid("setSelection", nextrow);
					} else if (prevrow) {
						this.$gridU.grid("setSelection", prevrow);
					}
					this.$gridU.grid("delRowData", rowid);
					this.$gridD.grid("addRowData", rowid, row);
					this.$gridD.grid("setSelection", row);
				}, this);

				this.grantItemsU.remove(fish.pluck(selrows, id));
				this.grantItemsD.add(selrows);
			}.bind(this));
		},

		grantBatch: function() {
			var selrows = fish.clone(this.$gridU.grid("getRowData")),
				id = this.grantItemsU.model.prototype.idAttribute;

			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridU.grid("getRowid", row);
					this.$gridU.grid("delRowData", rowid);
					this.$gridD.grid("addRowData", rowid, row);
				}, this);

				this.grantItemsU.remove(fish.pluck(selrows, id));
				this.grantItemsD.add(selrows);
			}.bind(this));
		},

		degrant: function() {
			var selrows = this.i18nData.multisel
				&& fish.clone(this.$gridD.grid("getCheckRows"))
				|| [this.$gridD.grid("getSelection")],
				id = this.grantItemsD.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridD.grid("getRowid", row),
						nextrow = this.$gridD.grid("getNextSelection", row),
						prevrow = this.$gridD.grid("getPrevSelection", row);
					if (nextrow) {
						this.$gridD.grid("setSelection", nextrow);
					} else if (prevrow) {
						this.$gridD.grid("setSelection", prevrow);
					}
					this.$gridD.grid("delRowData", rowid);
					this.$gridU.grid("addRowData", rowid, row);
					this.$gridU.grid("setSelection", row);
				}, this);
			}.bind(this));

			this.grantItemsD.remove(fish.pluck(selrows, id));
			this.grantItemsU.add(selrows);
		},

		degrantBatch: function() {
			var selrows = fish.filter(this.$gridD.grid("getRowData"), function(row) {
					return row._rowd_ ? false : true; // `_rowd_' denotes row disabled
				}),
				id = this.grantItemsD.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridD.grid("getRowid", row);
					this.$gridD.grid("delRowData", rowid);
					this.$gridU.grid("addRowData", rowid, row);
				}, this);

				this.grantItemsD.remove(fish.pluck(selrows, id));
				this.grantItemsU.add(selrows);
			}.bind(this));
		},

		resetButtonD: function() {
			var $btn = this.$btnGroup.find(".js-ds"),
				$gridU = this.$gridU;
			if (this.i18nData.multisel) {
				if ($gridU.grid("getCheckRows").length > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			} else {
				if (!fish.isEmpty($gridU.grid("getSelection"))) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetButtonU: function() {
			var $btn = this.$btnGroup.find(".js-us"),
				$gridD = this.$gridD;
			if (this.i18nData.multisel) {
				if ($gridD.grid("getCheckRows").length > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			} else {
				if (!fish.isEmpty($gridD.grid("getSelection"))) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetBatchButtonD: function() {
			var $btn = this.$btnGroup.find(".js-dd");
			if ($btn.length > 0) {
				if (this.grantItemsU.size() > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetBatchButtonU: function() {
			var $btn = this.$btnGroup.find(".js-ud");
			if ($btn.length > 0) {
				if (this.grantItemsD.size() > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		showDLHalf: function() {
			this.$(".js-dlh").next().removeClass("col-md-12 col-sm-12");
			this.$(".js-dlh").next().addClass("col-md-6 col-sm-6");
			this.$gridD.grid("setGridWidth", this.$gridD.parent().width());
			this.$(".js-dlh").show();
		},

		hideDLHalf: function() {
			this.$(".js-dlh").hide();
			this.$(".js-dlh").next().removeClass("col-md-6 col-sm-6");
			this.$(".js-dlh").next().addClass("col-md-12 col-sm-12");
			this.$gridD.grid("setGridWidth", this.$gridD.parent().width());
		}
	});
});