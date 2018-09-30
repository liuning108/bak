define([
	'text!oss_core/inms/pm/config/adapter/templates/AdapterDetail.html',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
	'oss_core/inms/pm/meta/model/phy/actions/ModelPhyAction',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror.js',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql.js',
	"css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
], function (detailTpl, measureAction, modelPhyAction, codemirror) {
	return portal.BaseView.extend({
		template: fish.compile(detailTpl),
		events: {
			"click .js-ok": 'ok',
			"click .js-adapter-btn": 'showAdapterBox',
			"click .js-adapter-param-btn": 'addParam',
			"click .js-mo-list-ul .list-group-item": 'clickMoList',
			"click .js-nav-tabs": 'clickNavTabs',
			"click .js-adapter-map-ul li a": 'clickMapSqlTabs',
			//"blur  :input[name='MAP_SQL']":'updateMapSql',
			"click .js-mo-list-add": 'getMoList',
			"click .js-mo-list-ok": 'returnMoList',
			"click .js-mo-list-cancel": 'cancelMoList',
			"click .js-mo-list-close": 'closeMoList',
			"click .js-adapter-previous-btn": 'previousTab',
			"click .js-adapter-next-btn": 'nextTab',
			'keyup .js-mo-list-seling-search': 'searchSeling',
			'click .js-mo-list-seling-all': 'selingAll',
		},
		initialize: function (options) {
			this.pluginType = '00';
			this.bpId = options.bpId;
			this.operType = options.operType;
			this.i18nData = options.i18nData;
			this.adapterAction = options.adapterAction;
			this.pmUtil = options.pmUtil;
			this.EMS_CODE = options.EMS_CODE;
			this.EMS_TYPE_REL_ID = options.EMS_TYPE_REL_ID;
			this.EMS_VER_CODE = options.EMS_VER_CODE;
			this.datas = options.datas;
			this.paramModel = [{
				name: "PARAM_CODE",
				label: this.i18nData.PARAM_CODE,
				width: "47",
				editable: true,
				editrules: "required;"
			}, {
				name: 'PARAM_VALUE',
				label: this.i18nData.PARAM_VALUE,
				width: "47",
				editable: true,
				editrules: "required;"
			}, {
				sortable: false,
				label: "",
				width: "6",
				formatter: 'actions',
				formatoptions: {
					editbutton: false,
					delbutton: true
				}
			}];
		},
		render: function () {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function () {
			this.pmUtil.extContains();
			this.pluginList = [];
			if (this.operType == "edit") {
				$(".js-adapter-detail-title").html(this.i18nData.ADAPTER_EDIT);
			} else {
				$(".js-adapter-detail-title").html(this.i18nData.ADAPTER_NEW);
			}
			this.$form = this.$(".js-adapter-detail-form");
			this.moObj = {};
			this.moList = [];
			$(".js-mo-list-ul").slimscroll({
				height: 272,
				width: 230
			});
			$(".js-mo-list-seling-item").slimscroll({
				height: 245,
				width: 200
			});
			this.$("[name='PROTOCOL_TYPE']").combobox({
				dataTextField: this.pmUtil.parakey.name,
				dataValueField: this.pmUtil.parakey.val,
				dataSource: this.pmUtil.paravalue("PROTOCOL_TYPE")
			});
			this.$("[name='PROTOCOL_TYPE']").combobox('value', '00');
			this.$("[name='PLUGIN_SPEC_NO']").combobox();

			this.pmUtil.utilAction.qryPluginSpec({
				'PLUGIN_TYPE': this.pluginType
			}, function (data) {
				if (data && data.pluginList) {
					this.pluginList = data.pluginList;
					this.$("[name='PLUGIN_SPEC_NO']").combobox({
						dataTextField: 'PLUGIN_NAME',
						dataValueField: 'PLUGIN_SPEC_NO',
						dataSource: data.pluginList
					});
				}
			}.bind(this), true);

			this.$("[name='MODEL_CODE']").combobox({});
			this.$("[name='GRANU']").combobox({});
			this.$("[name='MODEL_CODE']").on('combobox:change', function () {
				var modelCode = this.$("[name='MODEL_CODE']").combobox('value');
				this.setMOObj("MODEL_CODE", modelCode);
				var granu_val = '';
				if (modelCode && this.moObj[modelCode]) {
					granu_val = this.moObj[modelCode]['GRANU'];
				}
				this.modelComboxChange(modelCode, granu_val);
			}.bind(this));
			this.$("[name='GRANU']").on('combobox:change', function () {
				if (!this.isPut) {
					var granu = this.$("[name='GRANU']").combobox('value');
					this.setMOObj("GRANU", granu);
				}
			}.bind(this));

			if (this.EMS_TYPE_REL_ID && this.EMS_VER_CODE) {
				var param = {
					"EMS_TYPE_REL_ID": this.EMS_TYPE_REL_ID,
					"EMS_VER_CODE": this.EMS_VER_CODE,
					"MODEL_TYPE": '0'
				}; //Detail model
				modelPhyAction.qryModel(param, function (data) {
					if (data && data.modelList) {
						this.modelList = data.modelList;
						this.$("[name='MODEL_CODE']").combobox({
							dataTextField: 'MODEL_PHY',
							dataValueField: 'MODEL_PHY_CODE',
							dataSource: data.modelList
						});
					}
				}.bind(this));

				measureAction.qryMeasure(param, function (data) {

					if (data && data.moList) {
						this.moList = data.moList;
						this.getAdapterInfo();
					}
				}.bind(this));

			}
			this.showAdapterBox();
			this.loadParamGrid();
			this.loadAdapterMapTabs();
			this.showBlockUI(true);
			this.tabSwitch(0);
		},
		loadAdapterMapTabs: function () {
			this.editors = {};
			fish.forEach(this.pmUtil.paravalue("DB_DIALECT"), function (para, index) {
				var db_dialect = para[this.pmUtil.parakey.val];
				this.$(".js-adapter-map-ul").append("<li><a href='#demo-tabs-box-" + db_dialect + "' db_dialect='" + db_dialect + "' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> " + para[this.pmUtil.parakey.name] + "</a></li>");
				this.$(".js-adapter-map-content").append(
					"<div id='demo-tabs-box-" + db_dialect + "' class='form-group'>" +
					"    <textarea name='MAP_SQL' index='" + index + "' db_dialect='" + db_dialect + "' rows='4' class='form-control' ></textarea>" +
					"</div>"
				);
				var mapSqlText = document.getElementsByName('MAP_SQL')[index];
				var editor = codemirror.fromTextArea(mapSqlText, {
					mode: 'text/x-plsql',
					indentWithTabs: true,
					smartIndent: true,
					lineNumbers: true,
					matchBrackets: true,

					//autofocus: true,
					//scrollbarStyle: 'null',
				});
				editor.setSize('height', '120px');
				editor.on("update", function (self) {
					this.updateMapSql(self, mapSqlText);
				}.bind(this));
				this.editors[db_dialect] = editor;
			}.bind(this));
			this.$tab = this.pmUtil.tab(this.$('.js-adapter-map-tab'), {});
		},
		loadParamGrid: function () {
			var that = this;
			var $grid = this.$(".js-param-grid");
			this.paramGrid = $grid.jqGrid({
				colModel: this.paramModel,
				pagebar: false,
				sortable: true,
				cellEdit: true,
				rownumbers: true,

				afterEditCell: function (e, rowid, name, value, iRow, iCol) {
					return false;
				},
				beforeSaveCell: function (e, rowid, colName, cellcontext, iRow, iCol) {
					var allData = $grid.jqGrid("getRowData");
					if (colName == "PARAM_CODE") {
						for (var i = 0; i < allData.length; i++) {
							if (cellcontext == allData[i].PARAM_CODE) {
								fish.toast('warn', that.i18nData.PARAM_CODE + that.i18nData.REPETITION);
								return false;
							}
						}
					}
				},
				beforeDeleteRow: function (e, rowid, rowdata) {
					that.delParam(rowdata);
					return false;
				}.bind(this),
				onSelectRow: function (e, rowid, state) {
					return false;
				}.bind(this)
			});
		},
		addParam: function () {
			var addData = this.paramGrid.jqGrid("getChangedCells");
			for (var i = addData.length - 1; i >= 0; i--) {
				if (addData[i].PARAM_CODE.trim() == "") {
					fish.toast('warn', this.i18nData.PARAM_CODE + this.i18nData.IS_REQUIRED);
					return;
				} else if (addData[i].PARAM_VALUE.trim() == "") {
					fish.toast('warn', this.i18nData.PARAM_VALUE + this.i18nData.IS_REQUIRED);
					return;
				}
			}
			var data = {};
			this.paramGrid.jqGrid("addRowData", data, 'last');
			this.paramGrid.jqGrid("setSelection", data);
		},
		delParam: function (rowdata) {
			fish.confirm(this.i18nData.PARAM_DEL_CONFIRM, function (t) {
				this.paramGrid.jqGrid("delRowData", rowdata);
			}.bind(this));
		},
		ok: function () {
			if (this.$form.isValid()) {
				if (!this.EMS_VER_CODE) {
					fish.info(this.i18nData.SEL_EMS_VER);
					return false;
				}
				var that = this;
				var value = this.$form.form("value");
				value["CODE_PREFIX"] = this.pmUtil.parameter("codePrefix").val();
				value["PLUGIN_NO"] = (this.operType == "edit") ? this.datas.PLUGIN_NO : "";
				value["PLUGIN_TYPE"] = this.pluginType;

				fish.forEach(this.pluginList, function (plugin, index) {
					if (plugin['PLUGIN_SPEC_NO'] == value["PLUGIN_SPEC_NO"]) {
						value["PLUGIN_CLASSPATH"] = plugin['PLUGIN_CLASSPATH'];
						value["PLUGIN_NAME"] = plugin['PLUGIN_NAME'];
					}
				});

				value["OPER_TYPE"] = this.operType;
				value["ADAPTER_NO"] = (this.operType == "edit") ? this.datas.ADAPTER_NO : "";
				value["EMS_CODE"] = this.EMS_CODE;
				value["STATE"] = (value["IS_STATE"] == "on") ? "1" : "0";
				value["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
				value["EMS_VER_CODE"] = this.EMS_VER_CODE;
				var pluginParam = this.paramGrid.jqGrid("getRowData");
				for (var i = 0; i < pluginParam.length; i++) {
					if (!pluginParam[i].PARAM_CODE || pluginParam[i].PARAM_CODE.trim() == "") {
						this.tabSwitch(0);
						fish.toast('warn', this.i18nData.PARAM_CODE + this.i18nData.IS_REQUIRED);
						return;
					} else if (!pluginParam[i].PARAM_VALUE || pluginParam[i].PARAM_VALUE.trim() == "") {
						this.tabSwitch(0);
						fish.toast('warn', this.i18nData.PARAM_VALUE + this.i18nData.IS_REQUIRED);
						return;
					}
				}
				value["pluginParam"] = pluginParam; //参数
				value["adapterMO"] = [];
				value["dbDialect"] = [];
				if ($(".js-mo-list-ul").children().length == 0) {
					fish.toast('warn', this.i18nData.MO_LIST + this.i18nData.IS_REQUIRED);
					return;
				}
				var isValid = true;
				var tipInfo = "";
				fish.forEach($(".js-mo-list-ul .list-group-item"), function (moItme, index) {
					var moCode = $(moItme).attr("mo_code");
					if (moCode) {
						if (!this.moObj[moCode] || !this.moObj[moCode]['MODEL_CODE'] || !this.moObj[moCode]['GRANU']) {

							tipInfo = this.i18nData.MO_RELA_MODEL_ISNULL.replace('$1', $(moItme).attr("title"));
							this.tabSwitch(1);
							isValid = false;
							return false;
						} else {
							value["adapterMO"].push({
								"MO_CODE": moCode,
								"MODEL_CODE": this.moObj[moCode]['MODEL_CODE'],
								"GRANU": this.moObj[moCode]['GRANU'],
							});
							var isExist = false;
							fish.forEach(this.pmUtil.paravalue("DB_DIALECT"), function (para, index) {
								var db_dialect = para[this.pmUtil.parakey.val];
								if (this.moObj[moCode][db_dialect]) {
									isExist = true;
									value["dbDialect"].push({
										"MO_CODE": moCode,
										"DB_DIALECT": db_dialect,
										"MAP_SQL": this.moObj[moCode][db_dialect]
									});
								}
							}.bind(this));

							if (!isExist) {

								tipInfo = this.i18nData.DATA_MAP_SQL_ISNULL.replace('$1', $(moItme).attr("title"));
								this.tabSwitch(1);
								isValid = false;
								return false;
							}
						}
					}
				}.bind(this));

				if (!isValid) {
					// fish.info(tipInfo);
					fish.toast('warn', tipInfo);
					return false;
				}

				this.adapterAction.operAdapter(value, function (data) {

					if (this.operType == "edit") {
						fish.success(this.i18nData.ADAPTER_EDIT_SUCCESS);
					} else {
						value["PLUGIN_NO"] = data["PLUGIN_NO"];
						value["ADAPTER_NO"] = data["ADAPTER_NO"];
						fish.success(this.i18nData.ADAPTER_NEW_SUCCESS);
					}
					this.popup.close(value);
				}.bind(this));

				//alert(JSON.stringify(value));
			} else {
				this.tabSwitch(0);
			}
		},
		showAdapterBox: function () {
			$('#js-adapter-box').toggleClass('fadeInUp animated block');
			this.$(".js-param-grid:visible").jqGrid("setGridHeight", 140);
		},
		clickMoList: function (event) {
			$(".js-mo-list-ul .list-group-item").removeClass('active list-primary js-mo-list-active-itme');
			$(event.target).addClass('active list-primary js-mo-list-active-itme');
			var moCode = $(event.target).attr("mo_code");
			this.putMOObj(moCode);
		},

		updateMapSql: function (editor, text) {
			var val = $.trim(editor.getValue());
			this.setMOObj(this.$(text).attr('db_dialect'), val);
			this.$tab.checked(parseInt($(text).attr('index')), !!val);
		},
		setMOObj: function (key, value) {
			var moCode = this.$(".js-mo-list-active-itme").attr("mo_code");
			if (moCode) {
				if (!this.moObj[moCode]) this.moObj[moCode] = {
					'MODEL_CODE': '',
					'GRANU': ''
				};
				this.moObj[moCode][key] = value;
			}
		},
		putMOObj: function (moCode) {
			this.isPut = true;
			if (moCode) {
				this.showBlockUI(false);

				if (!this.moObj[moCode]) this.moObj[moCode] = {
					'MODEL_CODE': '',
					'GRANU': ''
				};
				this.$("[name='MODEL_CODE']").combobox('value', this.moObj[moCode]['MODEL_CODE']);

				this.modelComboxChange(this.moObj[moCode]['MODEL_CODE'], this.moObj[moCode]['GRANU']);


				fish.forEach(this.$(":input[name='MAP_SQL']"), function (mapSqlText) {
					var db_dialect = $(mapSqlText).attr('db_dialect');
					var index = parseInt($(mapSqlText).attr('index'));
					var val = this.moObj[moCode][db_dialect];
					val = val ? $.trim(val) : "";
					//$(":input[db_dialect='"+db_dialect+"']").val(this.moObj[moCode][db_dialect]);
					(this.editors[db_dialect]).setValue(val);
					(this.editors[db_dialect]).refresh();
					this.$tab.checked(index, !!val);
				}.bind(this));
			} else {
				this.showBlockUI(true);
			}
			this.isPut = false;
		},
		getAdapterInfo: function () {
			if (!this.datas || !this.datas.ADAPTER_NO) return false;
			//alert(this.datas["STATE"]);
			this.datas["IS_STATE"] = (this.datas["STATE"] == "1") ? "on" : "off";

			this.$form.form("value", this.datas);
			var param = {
				"ADAPTER_NO": this.datas.ADAPTER_NO,
				"PLUGIN_NO": this.datas.PLUGIN_NO,
				"PLUGIN_TYPE": this.pluginType
			};
			this.adapterAction.qryMapping(param, function (data) {
				if (data) {
					this.paramGrid.jqGrid("reloadData", data.pluginParam);

					fish.forEach(data.adapterMO, function (mo, index) {
						var moCode = mo["MO_CODE"];
						var moName = mo["MO_CODE"];
						fish.forEach(this.moList, function (molist, index) {
							if (moCode == molist["MO_CODE"]) {
								moName = molist["MO_NAME"];
								return false;
							}
						}.bind(this));

						if (!this.moObj[moCode]) this.moObj[moCode] = {
							'MODEL_CODE': mo["MODEL_CODE"],
							'GRANU': mo["GRANU"]
						};

						this.addMoItem(moCode, moName);

						fish.forEach(data.dbDialect, function (dialect, index) {
							if (moCode == dialect["MO_CODE"]) {
								if (!this.moObj[moCode][dialect["DB_DIALECT"]]) {
									this.moObj[moCode][dialect["DB_DIALECT"]] = "";
								}
								this.moObj[moCode][dialect["DB_DIALECT"]] += dialect["MAP_SQL"];
							}
						}.bind(this));

					}.bind(this));
					var moCode = this.$(".js-mo-list-ul .list-group-item:first").attr("mo_code");
					this.putMOObj(moCode);
				}
			}.bind(this));
		},
		initMoItem: function (moCode, moName) {
			this.$(".js-mo-list-seling-item").append("<label class=\"checkbox-inline\" title='" + moName + "(" + moCode + ")" + "'><input type=\"checkbox\" mo_code='" + moCode + "' mo_name='" + moName + "'>" + moName + "</label>");
		},
		addMoItem: function (moCode, moName) {
			this.$(".js-mo-list-ul").append("<li class='list-group-item' mo_code='" + moCode + "' title='" + moName + "(" + moCode + ")" + "'>" + moName + "<div class=\"listclose\"><i class=\"fa fa-close js-mo-list-close\"></i></div></li>");
			if (this.$(".js-mo-list-ul").children().length > 0) {
				this.$(".js-mo-list-ul .list-group-item:first").addClass("active list-primary js-mo-list-active-itme");
				var moCode = this.$(".js-mo-list-ul .list-group-item:first").attr("mo_code");
				this.putMOObj(moCode);
			}
		},
		getMoList: function () {
			this.siwtchMoBtn();
			this.$(".js-mo-list-seling-item").empty();
			this.$(".js-mo-list-seling-search").val("");
			this.$(".js-mo-list-seling-all").attr('checked', false);
			this.$(".js-mo-list-seling-all").prop('checked', false);

			fish.forEach(this.moList, function (molist, index) {

				var isValid = true;
				fish.forEach($(".js-mo-list-ul .list-group-item"), function (moItme, index) {
					if (molist["MO_CODE"] == $(moItme).attr("mo_code")) {
						isValid = false;
						return false;
					}
				});
				if (isValid) {
					this.initMoItem(molist["MO_CODE"], molist["MO_NAME"]);
				}
			}.bind(this));

		},
		returnMoList: function () {
			this.siwtchMoBtn();
			var that = this;
			$(".js-mo-list-seling-item input[type=checkbox]:checked").each(function () {
				that.addMoItem($(this).attr("mo_code"), $(this).attr("mo_name"));
			});
		},
		cancelMoList: function () {
			this.siwtchMoBtn();
		},
		closeMoList: function (event) {
			$(event.target).parent().parent().remove();
		},
		siwtchMoBtn: function () {

			this.$(".js-mo-list-add").toggleClass("hide");
			this.$(".js-mo-list-ok").toggleClass("hide");
			this.$(".js-mo-list-cancel").toggleClass("hide");
			this.$(".js-mo-list-seled-div").toggleClass("hide");
			this.$(".js-mo-list-seling-div").toggleClass("hide");
		},
		clickNavTabs: function (event, target) {
			var $target = target;
			if (event) {
				$target = $(event.target)
			}

			var tabContent = $target.attr("tab-content");
			//var tabContent = $target.attr("tab-index");
			$target.parent().siblings().removeClass("active");
			$target.parent().addClass("active");
			$("#" + tabContent).siblings().removeClass("active");
			$("#" + tabContent).addClass("active");
			if (tabContent == 'js-adapter-wizard-tab2') {
				$.each(this.editors, function (db_dialect, editor) {
					editor.refresh();
				});
			}
			if (tabContent == 'js-adapter-wizard-tab1') {
				this.$(".js-adapter-previous-btn").hide();
				this.$(".js-adapter-next-btn").html(this.i18nData.NEXT);
			} else if (tabContent == 'js-adapter-wizard-tab2') {
				this.$(".js-adapter-previous-btn").show();
				this.$(".js-adapter-next-btn").html(this.i18nData.SAVE);
			}
			return false;
		},
		previousTab: function () {
			this.tabSwitch(null, 'previous');
		},
		nextTab: function () {
			this.tabSwitch(null, 'next');
		},
		tabSwitch: function (tabIdx, action) {
			var tabNum = $(".js-nav-tabs").length;
			if (action) {
				fish.forEach($(".js-nav-tabs"), function (tab, index) {
					if ($(tab).parent().hasClass("active")) {
						tabIdx = index;
						return false;
					}
				}.bind(this));
				if (action == 'next') {
					if ((tabIdx + 1) >= tabNum) {
						this.ok();
					} else {
						this.clickNavTabs(null, $(".js-nav-tabs").eq(tabIdx + 1));
					}
				} else if (action == 'previous') {
					if ((tabIdx - 1) >= 0) {
						this.clickNavTabs(null, $(".js-nav-tabs").eq(tabIdx - 1));
					}
				}
			} else {
				this.clickNavTabs(null, $(".js-nav-tabs").eq(tabIdx));
			}
		},
		clickMapSqlTabs: function (event) {
			var db_dialect = $(event.target).attr('db_dialect');
			(this.editors[db_dialect]).refresh();
		},
		searchSeling: function (event) {
			var val = $(event.target).val();
			if (val) {
				this.$(".js-mo-list-seling-item label").hide();
				this.$(".js-mo-list-seling-item label").filter(":contains('" + val + "')").show();
			} else {
				this.$(".js-mo-list-seling-item label").show();
			}
		},
		selingAll: function (event) {
			var checked = $(event.target).is(':checked');

			$(".js-mo-list-seling-item input[type=checkbox]:visible").each(function () {
				$(this).attr('checked', checked);
				$(this).prop('checked', checked);
			});
		},
		showBlockUI: function (show) {
			if (show) {

				this.$("[name='MODEL_CODE']").combobox('value', '');
				fish.forEach(this.$(":input[name='MAP_SQL']"), function (mapSqlText) {
					var db_dialect = $(mapSqlText).attr('db_dialect');
					var index = parseInt($(mapSqlText).attr('index'));
					(this.editors[db_dialect]).setValue('');
					(this.editors[db_dialect]).refresh();
					this.$tab.checked(index, false);
				}.bind(this));
				this.$(".js-adapter-map-detail").blockUI({
					baseZ: 1,
					blockMsgClass: 'fade'
				}).data('blockui-content', true);

			} else {
				this.$(".js-adapter-map-detail").unblockUI().data('blockui-content', false);
			}
		},
		modelComboxChange: function (modelCode, granu_value) {
			var granu;

			fish.forEach(this.modelList, function (mo_field) {
				if (mo_field['MODEL_PHY_CODE'] == modelCode) {
					granu = mo_field['GRANU_MODE'];
					return false;
				}
			});

			var granuArr = [];
			if (granu) {
				granuArr = JSON.parse(granu);
			}

			fish.forEach(granuArr, function (granuObj, index) {
				var isExist = false;
				fish.forEach(this.pmUtil.paravalue("GRANU"), function (para) {
					if (para[this.pmUtil.parakey.val] == granuObj['GRANU']) {
						granuObj['GRANU_NAME'] = para[this.pmUtil.parakey.name];
						isExist = true;
						return false;
					}
				}.bind(this));
				if (!isExist) {
					granuObj['GRANU_NAME'] = granuObj['GRANU'];
				}
			}.bind(this));

			this.$("[name='GRANU']").combobox({
				dataTextField: "GRANU_NAME",
				dataValueField: "GRANU",
				dataSource: granuArr,
			});
			if (!granu_value) granu_value = '';
			if (granu_value) {
				this.$("[name='GRANU']").combobox('value', granu_value);
			} else {
				this.$("[name='GRANU']").combobox('value', (granuArr.length > 0) ? granuArr[0]['GRANU'] : '');
			}

		},


	});
});