define([
	"oss_core/inms/pm/resMgr/libs/util.js",
	'text!oss_core/inms/pm/resMgr/templates/KpiMgr.html',
	'text!oss_core/inms/pm/meta/kpi/templates/KpiDetail.html',
	'i18n!oss_core/inms/pm/meta/kpi/i18n/kpi',
	'oss_core/inms/pm/meta/kpi/actions/KpiAction',
	'oss_core/inms/pm/util/views/Util',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
	'oss_core/inms/pm/third-party/codemirror/lib/codemirror',
	'oss_core/inms/pm/third-party/codemirror/mode/sql/sql',
	"css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
  "css!oss_core/inms/pm/resMgr/css/resMgr.css",
	"css!oss_core/inms/pm/meta/kpi/css/kpiCss.css"
], function(util,kpiTpl, kpiDetailTpl, i18nKpi, kpiAction, pmUtil, measureAction, codemirror) {
	return fish.View.extend({
		tagName: "div",
		className: "tabs__content",
		template: fish.compile(kpiTpl),
		detailTpl: fish.compile(kpiDetailTpl),
		i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nKpi),
		events: {
			"click .js-kpi-add-copy .js-new": 'addKpi',
			"click .js-kpi-add-copy .js-copy-new": 'addCopyKpi',
			"click .js-kpi-grid .js-batch-new": 'addBatchKpi',
			"keyup .js-kpi-code": 'codeToUpper',
			"blur  .js-kpi-code": 'codeToUpper',
			"click .js-kpi-ok": 'ok',
			"click .js-kpi-cancel": 'cancel',
			"click :radio[name='KPI_TYPE']": 'clickKpiType',
			"click .js-kpi-formula-ul li a": 'clickFormulaTabs',
			"click .js-kpi-search": 'search',
			"click .js-kpi-reset": 'reset',
			"click .js-kpi-form-check": 'checkKpiForm',
			"click .js-kpi-form-seling": 'formSeling',
			"click .js-kpi-mo-config": 'moConfig',
			"click .kpiClassMenu .kSon": 'kpiClassMenu',
			"click .kpiClassRemove": 'kpiClassRemove',
            "click .pm-kpi-filter-switch-off": 'filterSwitchOff',
            "click .pm-kpi-filter-switch-on": 'filterSwitchOn',
            "click .pm_filer_item": 'filterItemClick',
            "click .pm_filer_selected_term_close": 'selectedFilterItemClose'
		},
		initialize: function(options) {
			this.mapContext={
				 "1":'所属PIM',
				 "2":'所属VIM',
				 "3":'区域',
			}
			this.kpiType = "";
			this.colModel = [

				{
					name: 'VIM',
					label: "所属VIM",

				},
				{
					name: 'PIM',
					label: "所属PIM",

				},
				{
				name: 'CITY',
				label: "区域",

			}, {
				name: "VENDOR",
				label: "厂家 ",

			}, {
				name: 'NAME',
				label: "名称",
				formatter: function(cellval, opts, rwdat, _act) {
        	var v = (""+rwdat.STATE).toUpperCase();
					if(v=="OK"){
						return "<span class='rescircle'></span>"+cellval
					}else{
					  return "<span  class='rescircle error'></span>"+cellval
					}

				}
   			}, {
				name: "RMUID",
				label: "标识",
			},
				{
		 		name: "SCREEN",
		 		label: "",
				align:"center",
				formatter: function(cellval, opts, rwdat, _act) {
					 var v = Number(cellval);
					 if(v>0){
						 return '<i class="fa fa-desktop enterGTMP"></i>';
					 }else{
						 return "";
					 }
				}
		 		}];
			if (options.iframeHeight) {
                this.tableH = options.iframeHeight ? options.iframeHeight : $(".ui-tabs-panel").height();
      }
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			this.$(".js-kpi-detail-content").html(this.detailTpl(this.i18nData));
			return this;
		},
		afterRender: function() {
			this.loadTree();
			this.loadGrid();

		},
		loadKpiClassInfo: function(parent){
			var that = this;
			var appendHtml = '';
			that.$form.find('.kpiClassMenu li').remove();
			kpiAction.qryKPIClassinfo({"EMS_TYPE":parent}, function(data) {
				console.log(data,'data')
				if (data && data.kpiClassList.length > 0) {
					fish.map(data.kpiClassList,function(d, elem) {
						appendHtml += '<li class="kParent" data-classid='+d.CLASS_ID+'>'+d.CLASS_NAME+'</li>'
						if(data.kpiClassTagList.length > 0){
							var filterKson = data.kpiClassTagList.filter(function (e) {
				                return e.CLASS_ID === d.CLASS_ID;
				            });
				            fish.map(filterKson,function(c, elems) {
								appendHtml += '<li class="kSon" data-classid='+c.CLASS_ID+' data-tagid='+c.TAG_ID+'>'+c.TAG_VALUE+'</li>'
					        })
						}
			        })
					that.$form.find('.kpiClassMenu').append(appendHtml);
				}
			}.bind(this));
		},
        kpiClassMenu: function(event) {
            var that = this;
            var classid = $(event.target).data('classid');
            var tagid = $(event.target).data('tagid')
            var text = $(event.target).text();
            if(this.kpiHasValue(classid,tagid)){
                that.$form.find('.kpiClass').append('<li data-classid='+classid+' data-tagid='+tagid+'><span>'+text+'</span><span class="glyphicon glyphicon-remove kpiClassRemove"></span></li>');
            }
        },
        kpiHasValue: function(classid,tagid){
            var tags = true
            $(".kpiClass li").each(function(index){
                if($(this).data('classid') === classid && $(this).data('tagid') === tagid){
                    tags = false;
                }
            });
            return tags
        },

		kpiClassRemove: function(event) {
			$(event.target).parent().remove();
			//console.log($(event.target).parent().remove())
		},
		loadTree: function() {
			console.log(this.tableH,11)
			var $tree = this.$(".js-catalog-tree");
			this.catTree = $tree.jqGrid({
				colModel: [{
					name: 'CAT_NAME',
					label: "",
					width: "100",
				}, {
					name: "REL_ID",
					label: "",
					width: "0",
					key: true,
					hidden: true
				}],
				height: this.tableH,
				expandColumn: "CAT_NAME",
				treeGrid: true,
				colHide: true,
				pagebar: true,
				onSelectRow: function(e, rowid, state) {
					var selectRow = this.catTree.jqGrid("getRowData", rowid);
					if(selectRow.level==0)return;
				   console.log("selectRow",selectRow)
					 util.hidColByType(""+selectRow.CID,this.kpiGrid)
					 // var newLableName= 	this.mapContext[""+selectRow.CID];
					 // this.kpiGrid.jqGrid("setLabel", "DNAME", newLableName);
					 this.getKpiList();
          //  this.loadKpiClass();
				}.bind(this)
			});
		 util.loadTree(this.catTree)
	},

		loadGrid: function() {
			var $grid = this.$(".js-kpi-grid");
				this.kpiGrid = $grid.jqGrid({
				colModel: this.colModel,
				pagebar: true,
				beforeEditRow: function(e, rowid, rowdata, option) {
					this.editKpi(rowdata);
					return false;
				}.bind(this),
				beforeDeleteRow: function(e, rowid, rowdata) {
					fish.confirm(this.i18nData.KPI_DEL_CONFIRM, function(t) {
						this.delKPI(rowdata);
					}.bind(this));
					return false;
				}.bind(this),
				onSelectRow: function(e, rowid, state) {
					this.selKpi(rowid);
				}.bind(this),
				pager: true
			});
			var self =this;
		  $grid.on('click', '.enterGTMP', function() {
				var selrow = self.kpiGrid.grid("getSelection");
			  util.enterDashBoard(selrow.TID,self,self.tableH);
			})

		},


		resize: function(delta) {

			if (this.$(".js-kpi-left-panel").height() >= this.$(".js-kpi-right-panel").height()) {
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"), delta);
				var hDiff = this.$(".js-kpi-left-panel").height() - this.$(".js-kpi-right-panel").height();
				portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"), hDiff);
				if (this.$(".js-kpi-detail").is(":visible")) {
					portal.utils.incHeight(this.$(".js-kpi-detail"), hDiff);
					this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height() - this.$(".js-kpi-detail-button").height());
					this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
					this.$(".js-kpi-detail-content").slimscroll({
						height: this.$(".js-kpi-detail-content").height()
					});
					//this.$(".js-kpi-detail-button").height(this.$(".js-kpi-detail-button").height());
				}

			} else {
				portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"), delta);
				if (this.$(".js-kpi-detail").is(":visible")) {
					portal.utils.incHeight(this.$(".js-kpi-detail"), delta);
					this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height() - this.$(".js-kpi-detail-button").height()); //
					this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
					this.$(".js-kpi-detail-content").slimscroll({
						height: this.$(".js-kpi-detail-content").height()
					});
					//this.$(".js-kpi-detail-button").height(this.$(".js-kpi-detail-button").height());
				}
				portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-kpi-right-panel").height() - this.$(".js-kpi-left-panel").height());
			}
			//alert(this.$(".js-kpi-detail-button").height());
		},
		showDetailPanel: function() {
			var h = this.$(".js-kpi-grid").height();
			$('.js-kpi-grid').hide();
			$('.js-kpi-detail').fadeIn(1000);
			this.$(".js-kpi-detail-content").height(h - this.$(".js-kpi-detail-button").height());
			this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
			this.$(".js-kpi-detail-content").slimscroll({
				height: this.$(".js-kpi-detail-content").height()
			});
			this.$(".js-kpi-detail").height(h);
			this.$(".js-kpi-detail-panel").html(this.i18nData.COMMON_DETAIL);
			this.$form.resetValid();

			if (this.customKpiMode == '1') {
				if (this.$(".js-kpi-ok").data("type") == "add") {
					this.$form.find(".js-kpi-code-form").css('visibility', 'hidden');
					this.$form.validator("setField", "KPI_CODE", null);
				} else {
					this.$form.find(".js-kpi-code-form").css('visibility', 'visible');
					this.$form.validator("setField", "KPI_CODE", this.i18nData.KPI_CODE + ':required');
				}
			}
			this.$(".js-kpi-search-div").hide();
		},
		hideDetailPanel: function() {
			var h = this.$(".js-kpi-detail").height();
			$('.js-kpi-detail').hide();
			$('.js-kpi-grid').fadeIn(1000);
			//this.$(".js-kpi-grid").jqGrid("setGridHeight", h);
			this.$(".js-kpi-detail-panel").html(this.i18nData.KPI_LIST);
			this.$(".js-kpi-search-div").show();
		},
		selKpi: function(rowid) {

		},
		addKpi: function() {
			if (!this.EMS_TYPE_REL_ID) {
				fish.info(this.i18nData.SEL_EMS);
				return false;
			}
			this.$(".pm_filter_box").fadeOut();
			console.log(this.EMS_TYPE_PARENT)
			this.$(".js-kpi-ok").data("type", "add");
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);

			this.$form.form('clear');
			this.$form.find('input[name="DIRT"]').eq(0).prop('checked', 'checked');
			this.$form.find('input[name="KPI_TYPE"]').eq(0).prop('checked', 'checked');
			this.clickKpiType();
			this.$form.find('input[name="KPI_TYPE"]').attr('disabled', false);
			this.$form.find('input[name="DATA_TYPE"]').eq(0).prop('checked', 'checked');
			this.$form.find("[name='UNIT']").combobox('value', '1');
			this.$form.find("[name='KPI_AGG']").combobox('value', '1');
			this.$form.find("[name='EFF_TIME']").datetimepicker("value", pmUtil.sysdate('date'));
			this.$form.find("[name='EXP_TIME']").datetimepicker("value", pmUtil.sysdate('date', fish.dateutil.addYears(new Date(), this.defaultNYear)));
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			this.$form.find("[name='IS_ANALYSIS']").prop('checked', 'on');
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.$form.find(".kpiClass li").remove();
			this.clearEditors();
		},
		clearEditors: function() {
			$.each(this.editors, function(ver_code, editor) {
				editor.refresh();
				editor.setValue("");
				var index = this.$form.find(":input[name='KPI_FORM'][ver_code='" + ver_code + "']").attr('index');
				this.$tab.checked(parseInt(index), false);
			}.bind(this));
		},
		addCopyKpi: function() {
			var rowdata = this.kpiGrid.jqGrid('getSelection');
			if (!rowdata["KPI_CODE"]) { //没有选中数据,走普通新建
				this.addKpi();
				return false;
			}
			if (!this.EMS_TYPE_REL_ID) {
				fish.info(this.i18nData.SEL_EMS);
				return false;
			}
			this.$(".js-kpi-ok").data("type", "add");
			this.$(".pm_filter_box").fadeOut();
			this.showBlockUI(false);
			this.showDetailPanel();
			this.codePrefixShow(true);
			this.$form.form('enable');
			this.btnDisabled(false);

			this.$form.form('clear');

			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.$form.find('input[name="KPI_TYPE"]').prop('disabled', false);
			this.$form.find("[name='CODE_PREFIX']").val(this.codePrefix);
			//this.$form.find("[name='KPI_CODE']").val(rowdata['KPI_CODE'].replace(this.codePrefix,''));
			this.$form.find(":input[name='KPI_NAME']").focus();
			this.loadKpiForm(rowdata['KPI_CODE'], rowdata['KPI_TYPE']);
			this.clearEditors();
		},
		editKpi: function(rowdata) {
			this.$(".js-kpi-ok").data("type", "edit");
			this.$(".pm_filter_box").fadeOut();
			this.showBlockUI(true);
			this.showDetailPanel();
			this.codePrefixShow(false);
			this.$form.form('enable');
			this.btnDisabled(false);
			this.$form.form('clear');
			rowdata["IS_ANALYSIS"] = (rowdata["IS_ANALYSIS"] == "1") ? "on" : "off";
			this.$form.form("value", rowdata);
			this.clickKpiType();
			this.clearEditors();
			this.$form.find('input[name="KPI_TYPE"]').attr('disabled', true);
			this.$form.find(":input[name='KPI_CODE']").attr("disabled", true);
			this.$form.find(":input[name='KPI_NAME']").focus();

			//var kpiCode = rowdata['KPI_CODE'];
			this.loadKpiForm(rowdata['KPI_CODE'], rowdata['KPI_TYPE']);
		},
		delKPI: function(value) {
			var that = this;
			value["OPER_TYPE"] = "del";
			value["customKpiMode"] = this.customKpiMode;
			kpiAction.operKPI(value, function(data) {
				that.kpiGrid.jqGrid("delRowData", value);
				fish.success(that.i18nData.KPI_DEL_SUCCESS);
			}.bind(this));
		},
		addBatchKpi: function(data) {
			var options = {
				i18nData: this.i18nData,
				kpiAction: this.kpiAction
			};
			fish.popupView({
				url: "oss_core/inms/pm/meta/kpi/views/KpiBatchAdd",
				viewOption: options,
				callback: function(popup, view) {
					//this.userDetail.trigger('change');
				}.bind(this)
			});

		},


		getKpiList: function() {
			var that = this;
			var param ={};
			util.loadResData(this.kpiGrid,param)
		},



		clickKpiType: function() {
			this.counterMo = {};
			this.counterMoCfg = {};
			val = this.$form.find(":radio[name='KPI_TYPE']:checked").val();

			if (val == '1') {
				this.$form.find(".js-kpi-agg-div").css('visibility', 'visible');
				this.$form.validator("setField", "KPI_AGG", this.i18nData.KPI_AGG + ':required');
				this.$(".js-kpi-form-for-example").text("[DLSTRVOL]+[DLINTBGVOL]");
				this.$(".js-kpi-mo-config").show();
			} else if (val == '2') {
				this.$form.find(".js-kpi-agg-div").css('visibility', 'hidden');
				this.$form.validator("setField", "KPI_AGG", null);
				this.$(".js-kpi-form-for-example").text("case when sum(PA2EOSB00001)=0 then 100.0 else 100.0*round(sum(PA2EOSB00002)/sum(PA2EOSB00001),5)  end");
				this.$(".js-kpi-mo-config").hide();
			}
			this.$form.resetValid();
			if (this.kpiType != val) {
				this.kpiType = val;
				this.loadFormulaTabs();
			}
		},
		showBlockUI: function(show) {
			if (show) {
				this.$(".js-kpi-left-panel").blockUI({
					baseZ: 1,
					blockMsgClass: 'fade'
				}).data('blockui-content', true);
			} else {
				this.$(".js-kpi-left-panel").unblockUI().data('blockui-content', false);
			}
		},
		paraToRadio: function(parent, paraName) {
			if (!parent) return "";
			fish.forEach(pmUtil.paravalue(paraName), function(para, index) {
				parent.append("<label class=\"radio-inline\">" +
					"    <input type='radio' name='" + paraName + "' class='form-control' value='" + para[pmUtil.parakey.val] + "' />" + para[pmUtil.parakey.name] +
					"</label> ");
			});
		},
        loadKpiForm: function(kpiCode, kpiType) {
            if (!kpiCode) return false;
            console.log(this.EMS_TYPE_PARENT)
            var that = this;
            var param = {
                "KPI_CODE": kpiCode
            };
            if (kpiType == "1") {
                param['isCounterMoRela'] = "1"
            }
            that.$form.find('.kpiClass li').remove();
            kpiAction.qryKPIFormular(param, function(data) {
                if (data) {
                    console.log(data)
                    fish.forEach(data.kpiFormular, function(formular) {
                        that.$form.find("[name='KPI_AGG']").combobox('value', formular["KPI_AGG"]);

                        $.each(that.editors, function(ver_code, editor) {
                            if ((ver_code == formular["EMS_VER_CODE"]) || ver_code == '-1') {
                                var val = $.trim(formular["KPI_FORM"] ? formular["KPI_FORM"] : "")
                                editor.setValue(val);

                                if (val) {
                                    var index = that.$form.find(":input[name='KPI_FORM'][ver_code='" + ver_code + "']").attr('index');
                                    that.$tab.checked(parseInt(index), true);
                                }
                            }
                        });

                    });
                    if (kpiType == "1") {
                        fish.forEach(data.kpiCounterMo, function(counterMo) {
                            var ver_code = counterMo['EMS_VER_CODE'];
                            if (!this.counterMoCfg[ver_code]) {
                                this.counterMoCfg[ver_code] = {};
                            }
                            this.counterMoCfg[ver_code][counterMo['COUNTER_CODE']] = counterMo['MO_CODE'];
                        }.bind(this));
                    }
                    if(data.kpiClassList.length > 0){
                        fish.forEach(data.kpiClassList, function(classList) {
                            that.$form.find('.kpiClass').append('<li data-classid='+classList.CLASS_ID+' data-tagid='+classList.TAG_ID+'><span>'+classList.TAG_VALUE+'</span><span class="glyphicon glyphicon-remove kpiClassRemove"></span></li>');
                        });
                    }
                }
            }.bind(this));
        },
		clickFormulaTabs: function(event) {
			var ver_code = $(event.target).attr('ver_code');
			(this.editors[ver_code]).refresh();
		},
		search: function() {
			if (!this.EMS_TYPE_REL_ID) return false;
			var kpiVal = $.trim(this.$(".js-kpi-search-input").val());
			var param = {
				"EMS_TYPE_REL_ID": this.EMS_TYPE_REL_ID
			};
			if (kpiVal) {
				param['KPI_NAME'] = kpiVal;
			}
            if(this.tagList){
                param['TAG_LIST'] = this.tagList;
            }
			this.getKpiList(param);
		},
		reset: function() {
			this.$(".js-kpi-search-input").val("");
			this.search();
		},
		checkKpiForm: function() {
			var value = this.getFromValue();
			if (!value) return false;
			if (!value["kpiFormular"] || value["kpiFormular"].length <= 0) {
				fish.info(this.i18nData.KPI_FORM_NULL);
				return false;
			}
			if (this.setCounterMo(value["kpiFormular"])) {
				value["OPER_TYPE"] = "add";
				value["isOnlyCheck"] = "1";
				kpiAction.operKPI(value, function(data) {
					console.log(data)
					if (data && data.error) {
						fish.warn(this.i18nData.KPI_FORM_CHECK_NOT_THROUGH);
					} else {
						fish.success(this.i18nData.KPI_FORM_CHECK_THROUGH);
					}
				}.bind(this));
			}
		},
		setCounterMo: function(kpiFormular) {
			var isValid = true;
			console.log(kpiFormular, 111)
				//alert(JSON.stringify(kpiFormular));
			fish.forEach(kpiFormular, function(formular, index) {

				var ver_code = formular["EMS_VER_CODE"];
				var ver_name = formular["EMS_VER_NAME"];

				var counterList = formular["counterList"];
				var counterStr = "";
				fish.forEach(counterList, function(counter) {
					if (!counter['MO_CODE']) { //找出未设置MO的
						if (!counterStr) {
							counterStr = counter['COUNTER_CODE'];
						} else {
							counterStr += "," + counter['COUNTER_CODE'];
						}
					}
				});
				//alert(counterStr);
				if (counterStr) {
					var param = {};
					param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID;
					param["EMS_VER_CODE"] = ver_code;
					param["FIELD_CODES"] = counterStr;
					param["FIELD_TYPE"] = "1";

					measureAction.qryMeasureField(param, function(data) {
						fish.forEach(counterList, function(counter) {
							console.log(counter)
							if (!isValid) return false;
							var moList = [];
							fish.forEach(data.moField, function(field) {
								console.log(field, 'field');
								if (counter['COUNTER_CODE'] == field['FIELD_CODE']) {
									moList.push(field);
								}
							});
							console.log(moList.length, 'moList.length');
							if (moList.length < 1) {
								isValid = false;
								fish.error(ver_name + "[" + counter['COUNTER_CODE'] + "]" + this.i18nData.NO_CONFIG_MO);
								return false;
							} else if (moList.length > 1) {
								isValid = false;
								fish.error(ver_name + "[" + counter['COUNTER_CODE'] + "]" + this.i18nData.NO_CONFIG_MO);
								return false;
							} else {
								console.log(2222)
								counter['MO_CODE'] = moList[0]['MO_CODE'];
							}
						}.bind(this));
					}.bind(this), true); //同步call服务
					if (!isValid) {
						return false;
					}
				}
			}.bind(this));
			return isValid;
		},
		tabChange: function(e, ui) {
			this.EMS_VER_CODE = ui.newPanel.attr("ver_code");
		},
		formSeling: function() {
			//alert(this.EMS_VER_CODE);
			var kpiType = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			var options = {
				i18nData: this.i18nData,
				pmUtil: pmUtil,
				kpiType: kpiType,
				EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID,
				EMS_VER_CODE: this.EMS_VER_CODE,
			};
			fish.popupView({
				url: "oss_core/inms/pm/meta/kpi/views/KpiCounterList",
				viewOption: options,
				callback: function(popup, view) {

				}.bind(this),
				close: function(retData) {

					fish.forEach(retData, function(data) {
						var kpiCounter = "";
						if (kpiType == "1") {
							kpiCounter = "[" + data["FIELD_CODE"] + "]";
							if (!this.counterMo[this.EMS_VER_CODE]) {
								this.counterMo[this.EMS_VER_CODE] = {};
							}
							this.counterMo[this.EMS_VER_CODE][data["FIELD_CODE"]] = data["MO_CODE"];

						} else {
							kpiCounter = "SUM(" + data["KPI_CODE"] + ")";
						}
						var editor = this.editors[this.EMS_VER_CODE];
						if (editor) {
							if ($.trim(editor.getValue())) {
								editor.setValue(editor.getValue() + "+" + kpiCounter);
							} else {
								editor.setValue(editor.getValue() + kpiCounter);
							}
						}
					}.bind(this));
				}.bind(this),
			});
		},
		moConfig: function() {
			var kpiType = this.$form.find(":radio[name='KPI_TYPE']:checked").val();
			if (kpiType != "1") return false;
			var value = this.getFromValue();
			if (!value) return false;
			if (!value["kpiFormular"] || value["kpiFormular"].length <= 0) {
				fish.info(this.i18nData.KPI_FORM_NULL);
				return false;
			}
			var options = {
				i18nData: this.i18nData,
				pmUtil: pmUtil,
				kpiType: kpiType,
				EMS_TYPE_REL_ID: this.EMS_TYPE_REL_ID,
				kpiFormular: value["kpiFormular"],
			};
			fish.popupView({
				url: "oss_core/inms/pm/meta/kpi/views/CounterMoList",
				viewOption: options,
				callback: function(popup, view) {

				}.bind(this),
				close: function(retData) {
					this.counterMoCfg = retData;
				}.bind(this),
			});
		},

        /////////////////////////////
        filterSwitchOff: function() {
            this.$('.pm_filter_box').hide();
            this.$('.pm-kpi-filter-switch-on').show();
            this.$('.pm-kpi-filter-switch-off').hide();
        },

        filterSwitchOn: function() {
            this.$('.pm_filter_box').show();
            this.$('.pm-kpi-filter-switch-on').hide();
            this.$('.pm-kpi-filter-switch-off').show();
        },

        loadKpiClass: function() {
					return ;
            var self = this;
            this.$('.pm_filter_container').empty();
            this.$('.pm_filer_selected_term_ul').empty();
            this.$('#pm_filer_selected_term_ul li').remove();
            this.$('.pm_filter_select').hide();
            this.tagList = undefined;
            kpiAction.qryKPIClassinfo({"EMS_TYPE": this.EMS_TYPE_CODE}, function(data) {
                var kpiClassList = data.kpiClassList;
                var kpiClassTagList = data.kpiClassTagList;
                fish.forEach(kpiClassList, function(kpiClass){
                    var htmlText = '<div class="pm_filter_list"><div class="pm_filer_title col-md-2"><span>按'
                        + kpiClass.CLASS_NAME + '：</span></div><div class="pm_filer_term col-md-10"><ul>';
                    var class_id = kpiClass.CLASS_ID;
                    fish.forEach(kpiClassTagList, function(kpiClassTag){
                        if(kpiClassTag.CLASS_ID == class_id){
                            var tag_id = kpiClassTag.TAG_ID;
                            var elementId = 'pm_filer_item_' + class_id + '_' + tag_id;
                            var isExist = false;
                            if(self.tagList){
                                fish.forEach(self.tagList, function(selectedTag){
                                    if(elementId == selectedTag.id){
                                        isExist = true;
                                    }
                                });
                            }
                            if(!isExist){
                                htmlText += '<li id="' + elementId + '" name="' + kpiClassTag.TAG_VALUE + '" class="pm_filer_item">' + kpiClassTag.TAG_VALUE + '</li>'
                            }
                        }
                    });
                    htmlText += '</ul></div></div>';
                    self.$('.pm_filter_container').append(htmlText);
                });
                self.resizeByTagChange();
            });
        },

        filterItemClick: function(e) {
            var self = this;
            var itemId = e.currentTarget.id;
            var itemName = self.$('#'+itemId).attr("name");
            /*if(this.$('#'+itemId).hasClass("active")){
                this.$('#'+itemId).removeClass("active");
            }else{
                this.$('#'+itemId).addClass("active");
            }*/
            self.$('#'+itemId).hide();
            var selectedItemHtml = '<li class="active" name="' + itemId + '">' + itemName + '<i id="' + itemId + '" class="fa fa-close pm_filer_selected_term_close"></i></li>';
            self.$('#pm_filer_selected_term_ul').append(selectedItemHtml);
            var tagList = [];
            fish.forEach(this.$('#pm_filer_selected_term_ul li i'), function(tag){
                //pm_filer_item_2_HOST
                var tmpId = tag.id.substring(14);
                tagList[tagList.length] = {
                    id: tag.id,
                    CLASS_ID: tmpId.substring(0, tmpId.indexOf("_")),
                    TAG_ID: tmpId.substring(tmpId.indexOf("_")+1)
                };
            });
            if(tagList.length==0){
                this.tagList = undefined;
            }else{
                this.$('.pm_filter_select').show();
                this.tagList = tagList;
            }
            this.resizeByTagChange();
            this.search();
        },

        selectedFilterItemClose: function(e) {
            var self = this;
            var itemId = e.currentTarget.id;
            for(var i=0;i<this.tagList.length;i++){
                var tag = this.tagList[i];
                if(tag.id == itemId){
                    this.tagList.splice(i,1);
                    self.$('[name='+itemId+']').remove();
                }
            }
            //
            self.$('#'+itemId).show();
            //
            if(this.tagList.length==0){
                this.tagList = undefined;
                this.$('.pm_filter_select').hide();
            }
            this.resizeByTagChange();
            this.search();
        },

        getKpiByTag: function(REL_ID){
            if(!this.EMS_TYPE_REL_ID || this.EMS_TYPE_REL_ID!=REL_ID){
                this.EMS_TYPE_REL_ID = REL_ID;
                var param = {"EMS_TYPE_REL_ID":REL_ID} ;
                this.getKpiList(param);
            }
        },

        resizeByTagChange: function() {
            var self = this;
            self.$(".js-kpi-grid:visible").jqGrid('setGridHeight', self.$('.js-kpi-left-panel').height() - self.$('.pm_filter_box').height() - 70);
        }

	});
});
