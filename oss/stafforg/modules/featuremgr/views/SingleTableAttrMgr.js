define([
    'stafforg/modules/featuremgr/actions/FeatureAction',
	'text!stafforg/modules/featuremgr/templates/SingleTableAttrMgr.html',
	'i18n!stafforg/modules/featuremgr/i18n/featuremgr',
	'text!stafforg/modules/featuremgr/templates/SingleFeatureGridRowEdit.html'
], function(AttrAction, AttrMgrTpl, i18nAttrMgr, gridRowEdit) {
	var hideField = function($form, field) {
		var $block = $form.find("[name='" + field + "']")
			.parent().parent().parent();
		$block.hide();
	},
		showField = function($form, field) {
		var $block = $form.find("[name='" + field + "']")
			.parent().parent().parent();
		$block.show();
	}, gridMinHeight = $.ui.grid.prototype.options.minHeight;
	return portal.BaseView.extend({
		template: fish.compile(AttrMgrTpl),

		rowEditTemplate: fish.compile(gridRowEdit),

		events: {
			"click .js-new": "newAttr",
			"click .js-edit": "editAttr",
			'click .js-ok': "ok",
			'click .js-cancel': 'cancel'
		},

		initialize: function(options) {
			this.model = new fish.Model({
				TABLE_ALIAS: options.type,
				COLUMN_TYPE: null,
				INPUT_TYPE: null,
				DEPENDENCY_ON_OTHERS: null,
				DEPENDENCY_FUTURE: null,
				NULL_ABLE: null
			});

			this.listenTo(this.model, {
				"change:COLUMN_TYPE": function(model, value, options) {
					var $form = this.$("form");
					if (!options.rowdata) {
						this.filterColNameByColType(value);
					}
					this.filterInputTypeByColType(value,
						$form.find("[name='inputType']").parent().parent());
					//this.dynamicValidator();
				},
                "change:INPUT_TYPE": function (model, value, options) {
					var $form = this.$("form"),
                        $ok = $form.find(".js-ok"),
						colType = $form.find("[name='columnType']").combobox('value') || model.attributes.COLUMN_TYPE;
					// before doing any show of hide, we shall put the main grid in
					// a minimal height state
					//this.$(".js-attr-grid").grid("setGridHeight", gridMinHeight);
                    if (!options.rowdata) {
                        this.dealWithMultiInteger(value, colType);
                    }
                    if (colType == "S" && (value == '4' || value == '5')) {
						showField($form, "minLength");
						showField($form, "maxLength");
					} else {
						hideField($form, "minLength");
						hideField($form, "maxLength");
					}
					if (value == "1" || value == "2") {
						showField($form, 'depOnOthers');
						showField($form, 'valueGrid');
						this.initValueGrid();
						this.ensureTrigger($form, "depOnOthers", {
							oldval: "Y",
							newval: "N"
						});
					} else {
						hideField($form, 'depOnOthers');
						hideField($form, 'depFuture');
						this.destroyValueGrid();
						hideField($form, 'valueGrid');
					}
					this.dynamicValidator();
					this.resizeInner();
				},
				"change:DEPENDENCY_ON_OTHERS": function(model, value) {
					var $form = this.$("form");
                    var $valueGrid = $form.find("[name='valueGrid']");
					if (value == "Y") {
						showField($form, "depFuture");
						(function() {
							var $grid = this.$(".js-attr-grid"),
								rowdata = $grid.grid("getSelection"),
								dependedAttrs = [],
								editype = $form.find(".js-ok").data('type');
							fish.forEach($grid.grid("getRowData"), function(attr) {
								if (attr.inputType == '1' && !(editype == 'edit' && attr.extCode == rowdata.extCode)) {
									dependedAttrs.push(attr);
								}
							});
							this.model.set("DEPENDENCY_FUTURE", "");
							$form.find("[name='depFuture']")
								.combobox('option', "dataSource", dependedAttrs);
						}.bind(this))();
					} else {
						hideField($form, "depFuture");
						if ($valueGrid.data("ui-init")) {
							$valueGrid.grid('hideCol', 'refValueCode');
							$valueGrid.grid("setColProp", "refValueCode", {
								editrules: "",
								edittype: "",
								formatter: ""
							});
						}
					}
					this.dynamicValidator();
				},
				"change:DEPENDENCY_FUTURE": function(model, value) {
					var $form = this.$("form"),
						$valueGrid = $form.find("[name='valueGrid']"),
						editype = $form.find(".js-ok").data('type'),
						valueId = value;
					if (valueId) { //如果有值，则修改具体的valueGrid表格中的数据源
						$valueGrid.grid('showCol', 'refValueCode');
						$valueGrid.grid("setColProp", "refValueCode", {
							edittype: "select",
							formatter: "select",
							editrules: i18nAttrMgr.FEATURE_REF_VALUE_CODE + ":required"
						});
						AttrAction.qryAttrDefValueList(valueId, function(status) {
							var valueList = status || [],
								editList = {},
								colProp = $valueGrid.grid("getColProp", "refValueCode");
							fish.forEach(valueList, function(value) {
								editList[value.valueCode] = value.valueCode;
							});
							if (editype) {
								$.each($valueGrid.grid("getRowData"), function(i, n) {
									$valueGrid.grid("restoreRow", $valueGrid.grid("getRowid", n));
								});
							}
							colProp.editoptions.value = editList;
							if (editype) {
								$.each($valueGrid.grid("getRowData"), function(i, n) {
									$valueGrid.grid("editRow", $valueGrid.grid("getRowid", n));
								});
							}
						});
					} else {
						$valueGrid.grid('hideCol', 'refValueCode');
						$valueGrid.grid("setColProp", "refValueCode", {
							editrules: "",
							edittype: "",
							formatter: ""
						});
					}
				}
			});
		},
        dealWithMultiInteger: function (inputType, colType) {
			// 多选并且当前的列已经是STR的时候可以跳过
            if (!inputType || !this.model.attributes.COLUMN_NAME) {
                return;
            }
            if (inputType == "2") {
                if (this.model.attributes.COLUMN_NAME.indexOf("EXT_STR") == -1) {
                    this.filterColNameByColType(colType);
                } else {
                    return;
                }
            }
            if(colType == "I" && this.model.attributes.COLUMN_NAME.indexOf("EXT_NUM") != -1) {
            	return;
			}
            if(colType == "D" && this.model.attributes.COLUMN_NAME.indexOf("EXT_DAT") != -1) {
                return;
            }
            if(colType == "S" && this.model.attributes.COLUMN_NAME.indexOf("EXT_STR") != -1) {
                return;
            }
            this.filterColNameByColType(colType);
        },

		render: function() {
			this.gridCellDelHtml = this.rowEditTemplate(i18nAttrMgr);
			this.$el.html(this.template(i18nAttrMgr));
		},

		afterRender: function() {
			var $grid = this.$(".js-attr-grid").grid({
				colModel: [{
					name: 'extCode',
					label: i18nAttrMgr.FEATURE_CODE,
					sortable: false,
					width: "15%"
				}, {
					name: 'displayName',
					label: i18nAttrMgr.FEATURE_DISPLAY_NAME,
					sortable: false,
					width: "15%"
				/*}, {
					name: 'tableName',
					label: i18nAttrMgr.FEATURE_TABLE_ALIAS,
					sortable: false,
					width: "15%"*/
				}, {
					name: 'columnName',
					label: i18nAttrMgr.FEATURE_COLUMN_NAME,
					key: true,
					hidden: true
				/*}, {
					name: 'columnType',
					label: i18nAttrMgr.FEATURE_COLUMN_TYPE,
					formatter: "select",
					formatoptions:{
						value: {
							'I': i18nAttrMgr.FEATURE_COLUMN_TYPE_INTEGER,
							'D': i18nAttrMgr.FEATURE_COLUMN_TYPE_DATE,
							'S': i18nAttrMgr.FEATURE_COLUMN_TYPE_STRING
						}
					},
					sortable: false,
					width: "15%"
				}, {
					name: 'inputType',
					label: i18nAttrMgr.FEATURE_INPUT_TYPE,
					formatter: "select",
					formatoptions: {
						value: {
							'1': i18nAttrMgr.FEATURE_SINGLE_CHOICE,
							'2': i18nAttrMgr.FEATURE_MULTI_CHOICE,
							'3': i18nAttrMgr.FEATURE_DATE_SELECTOR,
							'4': i18nAttrMgr.FEATURE_TEXT,
							'5': i18nAttrMgr.FEATURE_MEMO
						}
					},
					sortable: false,
					width: "15%"
				}, {
					name: 'nullAble',
					label: i18nAttrMgr.FEATURE_CAN_NULL,
					formatter: "select",
					formatoptions:{
						value: {
							'Y': i18nAttrMgr.COMMON_YES,
							'N': i18nAttrMgr.COMMON_NO
						}
					},
					sortable: false,
					width: "10%"*/
				}, {
					name: 'operate',
					label: '',
					sortable: false,
					align: 'center',
					formatter: function(cellValue, rowId, rowData) {
						return this.gridCellDelHtml;
					}.bind(this),
					width: "10%"
				}],
				onSelectRow: function(ee, rowid, state) {
					var e = ee.originalEvent,
						rowdata = $grid.grid("getRowData", rowid);
					this.cancel(null, rowdata);
					if (e && e.target) {
						switch ($(e.target).attr('action')) {
						case 'delete':
							this.deleteAttr(rowdata);
							break;
						case 'up':
							this.upDisplayOrder(rowdata);
							break;
						case 'down':
							this.downDisplayOrder(rowdata);
							break;
						default:
							break;
						}
					}
				}.bind(this)
			});

			var $form = this.$("form");

			$form.form();

			$form.find("[name='columnType']").combobox({
				dataTextField: 'TEXT',
				dataValueField: 'VALUE',
				dataSource: [{
					TEXT: i18nAttrMgr.FEATURE_COLUMN_TYPE_INTEGER,
					VALUE: "I"
				}, {
					TEXT: i18nAttrMgr.FEATURE_COLUMN_TYPE_DATE,
					VALUE: "D"
				}, {
					TEXT: i18nAttrMgr.FEATURE_COLUMN_TYPE_STRING,
					VALUE: "S"
				}]
			}).combobox('value', 'S').on("combobox:change", function(e) {
				this.model.set("COLUMN_TYPE", $form.form('value').columnType);
			}.bind(this));

			$form.find("[name='inputType']").parent().parent().on("change", function(e) {
				this.model.set("INPUT_TYPE", $form.form('value').inputType);
			}.bind(this));

			$form.find("[name='depOnOthers']").combobox({
				dataTextField: "TEXT",
				dataValueField: "VALUE",
				dataSource: [{
					TEXT: i18nAttrMgr.COMMON_YES,
					VALUE: 'Y'
				}, {
					TEXT: i18nAttrMgr.COMMON_NO,
					VALUE: 'N'
				}]
			}).combobox("value", false).on("combobox:change", function(e) {
				this.model.set("DEPENDENCY_ON_OTHERS",
					$form.form('value').depOnOthers);
			}.bind(this));

			$form.find("[name='depFuture']").combobox({
				dataTextField: "extCode",
				dataValueField: "valueId",
				dataSource: []
			}).on("combobox:change", function(e) {
				this.model.set("DEPENDENCY_FUTURE", $form.form('value').depFuture);
			}.bind(this));

			$form.find("[name='nullAble']").combobox({
				dataTextField: "TEXT",
				dataValueField: "VALUE",
				dataSource: [{
					TEXT: i18nAttrMgr.COMMON_YES,
					VALUE: "Y"
				}, {
					TEXT: i18nAttrMgr.COMMON_NO,
					VALUE: "N"
				}]
			}).combobox('value', 'Y');
			$form.validator({
				rules: {
					extCode: function(element, param, field) {
						var hasSpecial = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im.test(element.value);
						// var hasSpace = /(^\s*)|(\s*$)/g.test(element.value);
						var index = element.value.indexOf(" ");
						if (hasSpecial || index != -1) {
							return i18nAttrMgr.FEATURE_EXT_CODE_VALIDATE;
						}						
						return true;
					}.bind(this)
				}				
 			});
			$form.validator("setField", "extCode", i18nAttrMgr.FEATURE_CODE + ':required;length[1~60];extCode');
			this.loadData();
		},

		loadData: function() {
			AttrAction.qryAttrDefList(this.model.get('TABLE_ALIAS'), function(status) {
				var $grid = this.$(".js-attr-grid"),
					attrDefList = status || [];
				$grid.grid("reloadData", attrDefList);
				if (attrDefList.length > 0) {
					$grid.grid("setSelection", attrDefList[0]);
				} else {
					this.cancel();
					this.$("form").find('.js-edit').prop('disabled', true);
				}
			}.bind(this));
		},

		/**
		 * after enabling the form
		 */
		afterEnable: function($form) {
			$form.find("[name='columnType']").combobox('disable');
			$form.find("[name='columnName']").combobox('disable');
			$form.find("[name='inputType']").attr('disabled', 'disabled');
			$form.find("[name='inputType']").prop('disabled', true);
			(function() {
				var $valueGrid = $form.find("[name='valueGrid']"),
					colType = $form.find("[name='columnType']").combobox('value');
				if ($valueGrid.data("ui-init")) {
					$valueGrid.grid("showCol", "action");
					$valueGrid.find(".js-add-value").prop("disabled",false);
					if (colType == "I") {
						$valueGrid.grid("setColProp", "valueCode", {
							editrules: i18nAttrMgr.FEATURE_VALUE_CODE + ":required;length[1~255, true];integer",
						});
					}
				}
			})();
		},

		/**
		 * after clearing the form
		 */
		afterClear: function($form) {
			this.model.set({
				COLUMN_TYPE: null,
				DEPENDENCY_ON_OTHERS: null,
				NULL_ABLE: null,
				INPUT_TYPE: null,
				COLUMN_NAME: null
			}, {silent: true});
			$form.find("[name='depOnOthers']").combobox('value', 'N');
			$form.find("[name='nullAble']").combobox('value', 'N');
			$form.find("[name='columnType']").trigger('combobox:change');
		},

		newAttr: function() {
			var $form = this.$("form");
			$form.find(".js-new").parent().hide();
			$form.find('.js-new').parent().next().show();
			$form.find(".js-ok").data("type", "new");
			$form.form('enable');
			$form.form('clear');
			this.afterClear($form);
		},

		editAttr: function() {
			var $form = this.$("form");
			$form.find(".js-edit").parent().hide();
			$form.find('.js-edit').parent().next().show();
			$form.find(".js-ok").data("type", "edit");
			$form.form('enable');
			this.afterEnable($form);
		},

		filterInputTypeByColType: function(colType, $ctx) {
			var endisable = function(vec) {
				$.each(vec, function(i, disabled) {
					var val = i + 1 + "",
						qryStr = "[value='" + val + "']";
					$ctx.find(qryStr).prop("disabled", disabled);
					if (disabled) {
						$ctx.find(qryStr).attr("disabled", "disabled");
					} else {
						$ctx.find(qryStr).removeAttr("disabled", "disabled");
					}
					$ctx.find(qryStr).prop("checked", false);
				});
			};
			switch (colType) {
			case "D":
				endisable([true, true, false, true, true]);
				break;
			case "F":
			case "I":
				endisable([false, false, true, false, true]);
				break;
			case "S":
				endisable([false, false, true, false, false]);
				break;
			default:
				endisable([true, true, true, true, true]);
				break;
			}
			$ctx.trigger('change');
		},

		filterColNameByColType: function(colType, success) {
			var $form = this.$("form"),
				$ok = $form.find(".js-ok");
			if (!colType) {
				return;
			}
            var inputType =this.$("form").find("[name='inputType']:checked").val() || this.model.attributes.INPUT_TYPE;
            AttrAction.qryCanDefAttrColumnList(this.model.get('TABLE_ALIAS'), function(status) {
				var colNameCollection = [],
					allCanDefList = status || [],
					containsStr = null;
				if (allCanDefList.length > 0) {
						containsStr = "_STR_";
					if (colType == "D") {
						containsStr = "_DAT_";
					} else if (colType == "F" || colType == "I") {
                        if(inputType == '2') {
                            containsStr = "_STR_";
                        }else{
                            containsStr = "_NUM_";
                        }
					} else if (colType == "S" || colType == "M") {
						containsStr = "_STR_";
					}
					fish.forEach(allCanDefList, function(item) {
						if (item && item.toString().indexOf(containsStr) >= 0) {
							colNameCollection.push(item.toString());
						}
					});
					if (colNameCollection.length > 0) {
						this.model.set("COLUMN_NAME", colNameCollection[0]);
						$ok.removeAttr('disabled');
						$ok.prop('disabled', false);
					} else if ($ok.data('type')) {
						$ok.attr('disabled', 'disabled');
						$ok.prop('disabled', true);
						fish.warn(i18nAttrMgr.FEATURE_NO_AVAIL_FIELDS);
					}
				}
			}.bind(this));
		},

		initValueGrid: function() {
			var $form = this.$("form"),
				$grid = $form.find("[name='valueGrid']"),
				colType = $form.find("[name='columnType']").combobox('value');
			if (!$grid.data("ui-init")) {
				$grid.grid({
					pagebar: true,
					height: gridMinHeight + 60,
					colModel: [{
						name: 'valueCode',
						label: i18nAttrMgr.FEATURE_VALUE_CODE,
						editable: true,
						editrules: i18nAttrMgr.FEATURE_VALUE_CODE + ":required;length[1~255, true]",
						sortable: false
					}, {
						name: 'valueName',
						label: i18nAttrMgr.FEATURE_VALUE_NAME,
						editable: true,
						sortable: false,
						editrules: i18nAttrMgr.FEATURE_VALUE_NAME + ":required;length[1~60, true]"
					}, {
						name: 'refValueCode',
						label: i18nAttrMgr.FEATURE_REF_VALUE_CODE,
						editable: true,
						editoptions: {
							value: {} //其值列表关联到一个ref的Object中去
						}
					}, {
						name: 'action',
						label: ' ',
						formatter: 'actions',
						formatoptions: {
							delbutton: true,
							editbutton: true
						},
						width: 40
					}],
					onSelectRow: function(e, rowid, state) {
						if (e && e.target) {
							var action = $(e.target).attr("action");
							if (action && action == "delete") {
								var selrow = this.valueGrid.grid("getSelection"); //获取当前的行
								this.valueGrid.grid('setNextSelection', selrow, true).grid("delRowData", selrow);
							}
							if (colType == "I") {
                                var $valueGrid = $form.find("[name='valueGrid']");
								$valueGrid.grid("setColProp", "valueCode", {
									editrules: i18nAttrMgr.FEATURE_VALUE_CODE + ":required;length[1~255, true];integer",
								});
							}
						}
					}.bind(this)
				});
				$grid.grid("navButtonAdd", {
					//buttonicon: "glyphicon glyphicon-plus",
					caption: i18nAttrMgr.COMMON_ADD,
					cssprop: "js-add-value",
					onClick: function(e) {
						$grid.grid("addRow", {
							initdata: {
								valueName: "",
								valueCode: "",
								refValueCode: ""
							},
							position: "last"
						});
					}
	            });
	            $grid.find(".js-add-value").parent().parent().parent().css("padding","5px 0 0 0");
				$grid.data("ui-init", true);
			}
			if ($form.find(".js-ok").data('type')) {
				$grid.grid('showCol', 'action');
				$grid.find(".js-add-value").prop("disabled",false);
			} else {
				$grid.grid('hideCol', 'action');
				$grid.find(".js-add-value").prop("disabled",true);
			}
		},

		destroyValueGrid: function() {
			var $form = this.$("form"),
				$grid = $form.find("[name='valueGrid']");
			if ($grid.data('ui-init')) {
				$form.find("[name='valueGrid']").grid("destroy");
			}
			$form.find("[name='valueGrid']").data("ui-init", false);
		},

		dynamicValidator: function() { //动态密码校验规则
			var $form = this.$("form"),
				$block = function(field) {
				return $form.find("[name='" + field + "']").parent().parent().parent();
			},
				$divMinLength = $block("minLength"),
				$divMaxLength = $block("maxLength"),
				$divDependOthers = $block("depOnOthers"),
				$divDependFeature = $block("depFuture");
			if ($divMinLength.is(":hidden")) {
				$form.validator("setField", "minLength", '');
			} else {
				$form.validator("setField", "minLength", i18nAttrMgr.FEATURE_MIN_LENGTH + ':integer[+];range[1~99999]');
			}
			if ($divMaxLength.is(":hidden")) {
				$form.validator("setField", "maxLength", '');
			} else {
				$form.validator("setField", "maxLength", i18nAttrMgr.FEATURE_MAX_LENGTH + ':integer[+];range[1~99999];match[gt, MIN_LENGTH]');
			}
			if ($divDependOthers.is(":hidden")) {
				$form.validator("setField", "depOnOthers", '');
			} else {
				$form.validator("setField", "depOnOthers", i18nAttrMgr.FEATURE_REFERENCE_OTHERS + ':required');
			}
			if ($divDependFeature.is(":hidden")) {
				$form.validator("setField", "depFuture", '');
			} else {
				$form.validator("setField", "depFuture", i18nAttrMgr.FEATURE_DEPEND_FEATURE + ':required');
			}
		},

		seekBeforeRemRow: function($grid, rowdata) {
			var nextrow = $grid.grid("getNextSelection", rowdata),
            	prevrow = $grid.grid("getPrevSelection", rowdata);
			if (nextrow) {
				$grid.grid("setSelection", nextrow);
			} else if (prevrow) {
				$grid.grid("setSelection", prevrow);
			}
			else
			{
				//grid中没有数据，清空form。
				this.$("form").form('clear');
				this.$("form").find("[name='valueGrid']").grid("reloadData", []);
				this.$("form").find('.js-edit').prop('disabled', true);
			}
		},

		deleteAttr: function(rowdata) {
			var $grid = this.$(".js-attr-grid");
			fish.confirm(i18nAttrMgr.FEATURE_SURE_TO_DELETE, function() {
				AttrAction.deleteAttrDef(rowdata, function(status) {
					this.seekBeforeRemRow($grid, rowdata);
					$grid.grid("delRowData", rowdata);
					//if ($.isEmptyObject(selrow)) { //如果没有数据了，则清空
						//this.detailFormToDefault();
					//}
					fish.success(i18nAttrMgr.FEATURE_DEL_SUCCESS);
				}.bind(this));
			}.bind(this), $.noop);
		},

		upDisplayOrder: function(rowData) {
			var $grid = this.$(".js-attr-grid");
			var selected = $grid.grid("getSelection");
			var preved = $grid.grid("getPrevSelection", selected);
			if (fish.isEmpty(preved)) { //如果为空，表明已经是最上面的节点了
				fish.warn(i18nAttrMgr.FEATURE_MODIFY_ORDER_IS_HIGHEST);
				return;
			}
			var selectedItemOrder = selected.displayOrder;
			selected.displayOrder = preved.displayOrder;
			preved.displayOrder = selectedItemOrder;
			if(selected.maxLength === null){
				delete selected.maxLength;
			}
			if(selected.minLength === null){
				delete selected.minLength;
			}
			if(selected.valueId === null){
				delete selected.valueId;
			}
			if(preved.maxLength === null){
				delete preved.maxLength;
			}
			if(preved.minLength === null){
				delete preved.minLength;
			}
			if(preved.valueId === null){
				delete preved.valueId;
			}
			var attrDefItemList = [];
			attrDefItemList.push(selected);
			attrDefItemList.push(preved);
			AttrAction.ModDisplayOrder(attrDefItemList, function(result) {
				$grid.grid("delRowData", selected);
				var rowid = $grid.grid("getRowid", preved);
				$grid.grid("addRowData", selected, "before", rowid);
				$grid.grid("setSelection", selected);
			});
		},

		downDisplayOrder: function(rowData) {
			var $grid = this.$(".js-attr-grid");
			var selected = $grid.grid("getSelection");
			var nexted = $grid.grid("getNextSelection", selected);
			if ($.isEmptyObject(nexted)) { //如果为空，表明已经是最上面的节点了
				fish.warn(i18nAttrMgr.FEATURE_MODIFY_ORDER_IS_LOWEST);
				return;
			}
			var selectedItemOrder = selected.displayOrder;
			selected.displayOrder = nexted.displayOrder;
			nexted.displayOrder = selectedItemOrder;
			if(selected.maxLength === null){
				delete selected.maxLength;
			}
			if(selected.minLength === null){
				delete selected.minLength;
			}
			if(selected.valueId === null){
				delete selected.valueId;
			}
			if(nexted.maxLength === null){
				delete nexted.maxLength;
			}
			if(nexted.minLength === null){
				delete nexted.minLength;
			}
			if(nexted.valueId === null){
				delete nexted.valueId;
			}
			var attrDefItemList = [];
			attrDefItemList.push(selected);
			attrDefItemList.push(nexted);
			AttrAction.ModDisplayOrder(attrDefItemList, function(result) {
				$grid.grid("delRowData", selected);
				var rowid = $grid.grid("getRowid", nexted);
				$grid.grid("addRowData", selected, "after", rowid);
				$grid.grid("setSelection", selected);
			});
		},

		ok: function() {
			var $grid = this.$(".js-attr-grid"),
				$form = this.$("form"),
				$valueGrid = $form.find("[name='valueGrid']"),
				$valueGridDiv = $valueGrid.parent().parent().parent(),
				rowDatas = null;

			if ($form.isValid()) {
				if (!$valueGridDiv.is(":hidden")) { //如果可见，表示有属性，需要对valueGrid进行校验
					rowDatas = $valueGrid.grid("getRowData");
					if (fish.isEmpty(rowDatas) || rowDatas.length <= 0) {
						fish.warn(i18nAttrMgr.FEATURE_VALUE_LIST_CAN_NOT_NULL);
						return;
					}
					var isNull = false;
					fish.forEach(rowDatas, function(row) {
						if (row.valueCode == "" || row.valueName == ""){							
							isNull = true;
							return;
						}
						else
						{
							$valueGrid.grid("saveRow", $valueGrid.grid("getRowid", row));
						}						
					});
					if(isNull){
						fish.warn(i18nAttrMgr.FEATURE_VALUE_LIST_CAN_NOT_NULL);
						return;
					}
					rowDatas = $valueGrid.grid("getRowData"); //去最新的值

					(function() {
						var refValueId = $form.form('value').depFuture,
							valueCodeArray = [];
						$.each(rowDatas, function(i, n) {
							n.valueCode = $.trim(n.valueCode);
							n.valueName = $.trim(n.valueName);
							if (refValueId) {
								n.refValueId = refValueId;
							}
							if ($.inArray(valueCodeArray, n.valueCode) >= 0) {
								if (!this.SAME_VALUE_CODE_TEMPLATE) {
									this.SAME_VALUE_CODE_TEMPLATE = fish.compile(i18nAttrMgr.FEATURE_EXIST_SAME_VALUE_CODE);
								}
								fish.warn(this.SAME_VALUE_CODE_TEMPLATE(n.VALUE_CODE));
								return;
							}
						}.bind(this));
					}.bind(this))();
				}

				(function() {
					var formdata = $form.form('value'),
						rowdata = $grid.grid("getSelection");
					delete formdata.depOnOthers;
					delete formdata.depFuture;
					switch ($form.find(".js-ok").data('type')) {
					case "new":
						var _rowDatas = fish.clone(rowDatas);
					    if(_rowDatas != null && rowDatas.length > 0){
							for(var i=0; i<_rowDatas.length; i++){
				    			delete _rowDatas[i]._id_;
				    		}
					    }
						AttrAction.addAttrDef(fish.extend({
							tableName: this.model.get("TABLE_ALIAS"),
							columnName: this.model.get("COLUMN_NAME"),
							valueList: rowDatas || []
						}, formdata), function(status) {
							var attr = status;
							$grid.grid("addRowData", attr);
							$grid.grid("setSelection", attr);
							fish.success(i18nAttrMgr.FEATURE_ADD_SUCCESS);
							this.$("form").find('.js-edit').prop('disabled', false);
						}.bind(this));
						break;
					case "edit":
					    var colType = $form.form('value').depOnOthers;
					    if (colType == "N"){
					    	if(rowDatas.length > 0){
					    		for(var i=0; i<rowDatas.length; i++){
					    			// rowDatas[i].refValueId = null;
					    			delete rowDatas[i].refValueId;
					    			rowDatas[i].refValueCode = "";
					    		}
					    	}					    	
					    }
					    var _rowDatas = fish.clone(rowDatas);
					    if(_rowDatas != null && rowDatas.length > 0){
							for(var i=0; i<_rowDatas.length; i++){
				    			delete _rowDatas[i]._id_;
				    		}
					    }
					    
					    var _rowdata = fish.clone(rowdata);
					    delete _rowdata.valueList;
					    var param = fish.extend({
							valueList: rowDatas || []
						}, _rowdata, formdata);
						AttrAction.editAttrDef(param, function(status) {
							$grid.grid("setRowData", param);
							$grid.grid("setSelection", param);
							fish.success(i18nAttrMgr.FEATURE_EDIT_SUCCESS);
						}.bind(this));
						break;
					default:
						break;
					}
				}.bind(this))();
			}
		},

		ensureTrigger: function($form, field, valchg) {
			this.model.set(field, valchg.oldval, {silent: true});
			if (valchg.oldval) {
				$form.find("[name='" + field + "']").combobox('value', valchg.oldval);
			} else {
				$form.find("[name='" + field + "']").combobox('clear');
			}
			$form.find("[name='" + field + "']").combobox('value', valchg.newval);
		},

		hideExtra: function() {
			var $form = this.$("form");
			hideField($form, "minLength");
			hideField($form, "maxLength");
			hideField($form, 'depOnOthers');
			hideField($form, 'depFuture');
			hideField($form, 'valueGrid');
			this.resizeInner();
		},

		cancel: function(e, rowdata) {
			var $form = this.$("form");
			rowdata = rowdata || this.$(".js-attr-grid").grid("getSelection");
			$form.find('.js-ok').removeData('type');
			$form.find('.js-ok').removeAttr('disabled');
			$form.find('.js-ok').prop('disabled', false);
			$form.form('clear').form('disable').resetValid();

			$form.find(".js-cancel").parent().hide();
			$form.find(".js-cancel").parent().prev().show();

			if (!rowdata || fish.isEmpty(rowdata)) {
				this.hideExtra();
				return;
			}

			this.model.set({
				COLUMN_TYPE: null,
				DEPENDENCY_ON_OTHERS: null,
				NULL_ABLE: null,
				INPUT_TYPE: null
			}, {silent: true});
			var _rowdata = fish.extend({}, rowdata, {inputType: [rowdata.inputType]});
			// we have to coordinate callback invocation sequence

            this.model.set('COLUMN_TYPE', _rowdata.columnType, {rowdata: _rowdata});
            this.model.set('INPUT_TYPE', _rowdata.inputType, {rowdata: _rowdata});
			$form.form('value', _rowdata).form('disable');
			this.$(".js-attr-grid").grid("setSelection", rowdata, false);

			if (rowdata.valueId) {
				AttrAction.qryAttrDefValueList(rowdata.valueId, function(status) {
					var $valueGrid = $form.find("[name='valueGrid']"),
						valueList = status || [],
						refValueId = null;
					if ($valueGrid.data("ui-init")) {
						$valueGrid.grid("reloadData", valueList);
						if (valueList.length > 0) {
							$valueGrid.grid("setSelection", $valueGrid.grid("getRowData")[0]);
						}
					}
					if (valueList.length > 0 && valueList[0].refValueId) {
						refValueId = valueList[0].refValueId;
					}
					if (refValueId) {
						this.ensureTrigger($form, "depOnOthers", {
							oldval: "N",
							newval: "Y"
						});
						this.ensureTrigger($form, "depFuture", {
							oldval: "",
							newval: refValueId
						});
					}
				}.bind(this));
			}
		},

		resizeInner: function() {
			//var delta = this.$el.parent().height() - this.$el.outerHeight();
			//portal.utils.gridIncHeight(this.$(".js-attr-grid"), delta);
		},

		resize: function(delta) {
			portal.utils.incHeight(this.$(".js-attr-detail .panel"), delta);
			this.$('.js-attr-grid').grid('setGridHeight',this.$(".js-attr-detail").height());
			var panelBodyHeight = this.$('.js-attr-detail .panel').height() - this.$('.js-attr-detail .panel-heading').innerHeight();
			this.$('.js-attr-detail .panel-body').slimscroll({
				height: panelBodyHeight
			});
		}
	});
});
