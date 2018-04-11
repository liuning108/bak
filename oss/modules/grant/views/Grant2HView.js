/**
 * Title: Grant2H.js
 * Description: Granting View of 2 Divided Area
 * Author: wu.yangjin
 * Created Date: 15-4-10 上午11:01
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define([
	'text!modules/grant/templates/Grant2HView.html'
], function(grant2HTpl) {
	return portal.BaseView.extend({
		template: fish.compile(grant2HTpl),

		events: {
			"click .js-transfer .js-rs": 'grant',
			"click .js-transfer .js-rd": 'grantBatch',
			"click .js-transfer .js-ls": 'degrant',
			"click .js-transfer .js-ld": 'degrantBatch',
			"click .js-dialog-ok": 'dialogOk',
			"click .js-dialog-cancel": 'dialogCancel',
			"click .js-ok": 'ok',
			"click .js-cancel": 'cancel',
			"click .js-edit": 'edit'
		},

		initialize: function() {
			this.listenTo(this.grantItemsL, 'all', function(event) {
				var grantItemList = this.grantItemsL.toJSON();
				if (event === 'reset') {
					this.$gridL.grid("reloadData", grantItemList);
					if (grantItemList.length > 0) {
						this.$gridL.grid("setSelection", grantItemList[0]);
					}
					this.postResetL();
				}
				this.resetBatchButtonR();
				this.resetButtonR();
			});
			this.listenTo(this.grantItemsR, 'all', function(event) {
				var grantItemList = this.grantItemsR.toJSON();
				if (event === 'reset') {
					this.$gridR.grid("reloadData", grantItemList);
					if (grantItemList.length > 0) {
						this.$(".js-edit").prop('disabled', false);
						this.$gridR.grid("setSelection", grantItemList[0]);
					}
					else
					{
						this.$(".js-edit").prop('disabled', true);
					}
					this.postResetR();
				}
				this.resetBatchButtonL();
				this.resetButtonL();
			});
		},

		/**
		 * Users are encouraged to override this function
		 */
		reload: function() {},

		render: function() {
			this.setElement(this.template(this.i18nData));
			if (this.templateTopRow) {
				this.$(".js-top").append(this.templateTopRow(this.i18nData));
			}
			if (this.templateDRHalf) {
				this.$(".js-drh").append(this.templateDRHalf(this.i18nData));
			}

			this.$gridL = this.$('.grant-grid-l');
			this.$gridR = this.$('.grant-grid-r');
			this.$btnGroup = this.$(".js-transfer");
		},

		afterRender: function() {
			this.$gridL.grid({
				autoWidth: true,
				caption: this.i18nData.GRANT_LEFT_TITLE,
				colModel: this.colModelL,
				multiselect: this.i18nData.multisel ? true : false,
				onSelectRow: function(e, rowid, state) {
					var $btn = this.$btnGroup.find(".js-rs"),
						selrows = this.i18nData.multisel
							&& this.$gridL.grid("getCheckRows")
							|| this.$gridL.grid("getRowData");
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
					this.trigger("selrow:l", this.$gridL.grid("getRowData", rowid));
				}.bind(this)
			});

			this.$gridR.grid({
				autoWidth: true,
				caption: this.i18nData.GRANT_RIGHT_TITLE,
				colModel: this.colModelR,
				multiselect: this.i18nData.multisel ? true : false,
				treeGrid: this.i18nData.treeGrid ? true : false,
				checkChildren: true,
				/*treeIcons: {
				    plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: this.i18nData.expandColumn,
				onSelectRow: function(e, rowid, state) {
					var $btn = this.$btnGroup.find(".js-ls"),
						selrows = this.i18nData.multisel
							&& this.$gridR.grid("getCheckRows")
							|| this.$gridR.grid("getRowData");
					if (selrows.length >= 1) {
						$btn.prop("disabled", false);
						$btn.addClass("active");
					} else {
						$btn.prop("disabled", true);
						$btn.removeClass("active");
					}
					this.trigger("selrow:r", this.$gridR.grid("getRowData", rowid));
				}.bind(this)
			});
		},

		postResetR: function() {},
		postResetL: function() {},
		dialogOk: function() {},
		dialogCancel: function() {},
		grantConfirm: function(selrows, success) {
			success();
			// console.warn("Should override Grant2HView.grantConfirm.");
		},
		degrantConfirm: function(selrows, success) {
			success();
			// console.warn("Should override Grant2HView.degrantConfirm.");
		},

		grant: function() {
			var selrows = this.i18nData.multisel
				&& fish.clone(this.$gridL.grid("getCheckRows"))
				|| [this.$gridL.grid("getSelection")],
				// makes a shallow copy of the original row data array returned by fish
				id = this.grantItemsL.model.prototype.idAttribute;

			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridL.grid("getRowid", row),
						nextrow = this.$gridL.grid("getNextSelection", row),
						prevrow = this.$gridL.grid("getPrevSelection", row);
					if (nextrow) {
						this.$gridL.grid("setSelection", nextrow);
					} else if (prevrow) {
						this.$gridL.grid("setSelection", prevrow);
					}
					this.$gridL.grid("delRowData", rowid);
					this.$gridR.grid("addRowData", rowid, row);
					this.$gridR.grid("setSelection", row);
					this.$(".js-edit").prop('disabled', false);
				}, this);

				this.grantItemsL.remove(fish.pluck(selrows, id));
				this.grantItemsR.add(selrows);
			}.bind(this));
		},

		grantBatch: function() {
			var selrows = fish.clone(this.$gridL.grid("getRowData")),
				id = this.grantItemsL.model.prototype.idAttribute;

			this.grantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridL.grid("getRowid", row);
					this.$gridL.grid("delRowData", rowid);
					this.$gridR.grid("addRowData", rowid, row);
				}, this);

				this.grantItemsL.remove(fish.pluck(selrows, id));
				this.grantItemsR.add(selrows);
			}.bind(this));
		},

		degrant: function() {
			var selrows = this.i18nData.multisel
				&& fish.clone(this.$gridR.grid("getCheckRows"))
				|| [this.$gridR.grid("getSelection")],
				id = this.grantItemsR.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridR.grid("getRowid", row),
						nextrow = this.$gridR.grid("getNextSelection", row),
						prevrow = this.$gridR.grid("getPrevSelection", row);
					if (nextrow) {
						this.$gridR.grid("setSelection", nextrow);
					} else if (prevrow) {
						this.$gridR.grid("setSelection", prevrow);
					}
					this.$gridR.grid("delRowData", rowid);
					this.$gridL.grid("addRowData", rowid, row);
					this.$gridL.grid("setSelection", row);
					this.$(".js-edit").prop('disabled', false);
				}, this);
			}.bind(this));

			this.grantItemsR.remove(fish.pluck(selrows, id));
			this.grantItemsL.add(selrows);
		},

		degrantBatch: function() {
			var selrows = fish.filter(this.$gridR.grid("getRowData"), function(row) {
					return row._rowd_ ? false : true; // `_rowd_' denotes row disabled
				}),
				id = this.grantItemsR.model.prototype.idAttribute;

			this.degrantConfirm(selrows, function() {
				fish.forEach(selrows, function(row) {
					var rowid = this.$gridR.grid("getRowid", row);
					this.$gridR.grid("delRowData", rowid);
					this.$gridL.grid("addRowData", rowid, row);
				}, this);

				this.grantItemsR.remove(fish.pluck(selrows, id));
				this.grantItemsL.add(selrows);
			}.bind(this));
		},

		resetButtonR: function() {
			var $btn = this.$btnGroup.find(".js-rs"),
				$gridL = this.$gridL;
			if (this.i18nData.multisel) {
				if ($gridL.grid("getCheckRows").length > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			} else {
				if (!fish.isEmpty($gridL.grid("getSelection"))) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetButtonL: function() {
			var $btn = this.$btnGroup.find(".js-ls"),
				$gridR = this.$gridR;
			if (this.i18nData.multisel) {
				if ($gridR.grid("getCheckRows").length > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			} else {
				if (!fish.isEmpty($gridR.grid("getSelection"))) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetBatchButtonR: function() {
			var $btn = this.$btnGroup.find(".js-rd");
			if ($btn.length > 0) {
				if (this.grantItemsL.size() > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		resetBatchButtonL: function(event, models) {
			var $btn = this.$btnGroup.find(".js-ld");
			if ($btn.length > 0) {
				if (this.grantItemsR.size() > 0) {
					$btn.prop("disabled", false);
					$btn.addClass("active");
				} else {
					$btn.prop("disabled", true);
					$btn.removeClass("active");
				}
			}
		},

		showDRHalf: function() {
			//this.$gridR.grid("setGridHeight", 200);
			this.$(".js-drh").show();
		},

		hideDRHalf: function() {
			var height = this.$gridR.parent().height();
			this.$(".js-drh").hide();
			this.$gridR.grid("setGridHeight", height);
		}
	});
});
