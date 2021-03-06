define([
		"text!oss_core/inms/pm/config/task/templates/compute/merge/TableView.html",
		"text!oss_core/inms/pm/config/task/templates/compute/merge/CardView.html",
		"text!oss_core/inms/pm/config/task/templates/compute/merge/NullView.html",
		"text!oss_core/inms/pm/config/task/templates/compute/merge/checkbox.html",
		"text!oss_core/inms/pm/config/task/templates/compute/merge/checkboxOutput.html",
		"css!oss_core/inms/pm/util/css/ad-util-component.css",
		"oss_core/inms/pm/config/task/views/merge/js/jquery.widget.swappable"
	],
	function (tpl, cardViewTpl, nullView, checkboxView, checkboxViewOutput) {
		return portal.BaseView.extend({
			//加载模板
			template: fish.compile(tpl),
			events: {
				'click .js-compute-merge-del-mo': 'delMoTr',
			},
			initialize: function (options) {
				this.i18nData = options.i18nData;
			},
			render: function () {
				this.$el.html(this.template(this.i18nData));
				return this;
			},
			tr_flag: [],
			tableTemplate: {
				'tr': fish.template("<tr class=<%= flag %>><%= body %></tr>"),
				'td_header': fish.template("<td><div data-no=<%= no %>><%= name %><i class='fa fa-close js-compute-merge-del-mo'></i></div></td>"),
				'td_data': fish.template(cardViewTpl),
				'td_null': fish.template(nullView),
				'td_operation': fish.template(checkboxView),
				'td_operation_output': fish.template(checkboxViewOutput),

			},
			afterRender: function (option) {
				var self = this;
				self.table = $("#mergeTableView");
				self.tableBody = self.table.find('tbody');

			}, //end of afterRender
			putAll: function (datas, isGrouping) {
				var self = this;
				fish.each(datas, function (data) {
					self.putModel(data, isGrouping)
				});
			},

			putModel: function (model, isGrouping) {
				this.addRow(model, isGrouping);
				this.addJS();
			},
			addJS: function () {
				var self = this;
				//start DnD function
				fish.each(self.tr_flag, function (className, index) {
					console.log(name + "---" + index)
					$("." + className).swappable({
						items: "." + className + "_td",
						cursorAt: {
							top: 0
						},
						stop: function (event, ui) {
							self.tableBody.find(".null_td").removeClass("null_flag");
							$('.notnull_checkbox').trigger('change');
						}
					}).disableSelection();
				});
				//end of DnD function

				//start  change index
				$('.card_input').off('change');
				$(".card_input").on('change', function (event) {
					var val = parseInt($(this).val());
					if (fish.isNaN(val)) val = 0;
					if (val < 0) val = Math.abs(val);
					$(this).val(val);
					var $sib_tds = self.getColumTds(this);
					fish.each($sib_tds, function (s_td) {
						var $input = $(s_td).find('.card_input');
						var input_val = parseInt($input.val());
						if (fish.isNaN(input_val)) return;
						if (input_val >= val) {
							input_val += 1;
							$input.val(input_val);
						}
					})
				});
				//end of change index
			},
			putMergeCol: function (isMergeCol) {
				var self = this;
				var $first = self.tableBody.find('tr:first');
				//var $last = self.tableBody.find('tr:last');

				fish.each($first.find('td'), function (td, index) {
					if (isMergeCol[index]) {
						$(td).find(".notnull_checkbox").attr("checked", 'checked');
					}
				});
			},
			putOutCol: function (isOutCol) {
				var self = this;
				//var $first = self.tableBody.find('tr:first');
				var $last = self.tableBody.find('tr:last');

				fish.each($last.find('td'), function (td, index) {
					if (isOutCol[index]) {
						$(td).find(".output_checkbox").attr("checked", 'checked');
					}
				});
			},
			getData: function () {
				var self = this;
				var $trs = self.tableBody.find('tr').not(':first').not(".last");
				var $first = self.tableBody.find('tr:first');
				var $last = self.tableBody.find('tr:last');
				var datas = [];
				var f_data = fish.map($first.find('td'), function (td) {
					return $(td).find(".notnull_checkbox").is(":checked");
				});
				datas.push(f_data);
				fish.each($trs, function (tr) {
					var rows = [];
					fish.each($(tr).find('td'), function (td) {
						var no = $(td).find('div').data('no');
						if (!no) no = "";
						rows.push(no);
					})
					datas.push(rows);
				})

				var l_data = fish.map($last.find('td'), function (td) {
					/*
                    var obj={
                         'checked':$(td).find(".output_checkbox").is(":checked"),
                         'text':''+$(td).find(".output_text").val()
                    }
                    */
					return $(td).find(".output_checkbox").is(":checked");
				});

				datas.push(l_data);

				fish.each(datas, function (data) {
					console.log(data);
				})
				return datas;

			},
			getColumTds: function (_this) {
				var self = this;
				var $td = $(_this).parents('td');
				var $tr = $(_this).parents('tr');
				var col_index = $tr.children('td').index($td);
				var $sib_tds = $tr.siblings().find('td:eq(' + col_index + ')');
				return $sib_tds;
			},
			addRow: function (model, isGrouping) {
				var self = this;

				var datas = model.datas;
				var newDatas;
				if (isGrouping) {
					newDatas = self.grouping(fish.clone(datas));
				} else {
					newDatas = fish.clone(datas);
				}
				var body = self.tableTemplate.td_header({
					'no': model.no,
					'name': model.name
				});
				var trClassName = "recode" + self.tr_flag.length;

				fish.each(newDatas, function (key, value) {
					if (key.no.length <= 0) {
						body += self.tableTemplate.td_null({
							'flag': trClassName + "_td"
						});
					} else {
						body += self.tableTemplate.td_data({
							'name': key.name,
							'no': key.no,
							'index': key.index,
							'flag': trClassName + "_td"
						});
					}
				})
				var domStr = self.tableTemplate.tr({
					'body': body,
					'flag': trClassName
				});
				self.tableBody.append(domStr)
				self.supplement(); //补充DOM元素

				self.tr_flag.push(trClassName);
			},
			grouping: function (datas) {
				var self = this;

				var trs = self.tableBody.find('tr');
				var cols = self.getTDMax(trs);
				var rows = []
				var row_length = trs.length;
				rows = fish.map(trs, function (tr) {
					return fish.map($(tr).find('td'), function (td) {
						return $(td).find('.recode_td').data('no');
					})
				})
				var row2col = [];
				//列转行
				for (var i = 0; i < cols; i++) {
					var col_arry = [];
					for (var y = 0; y < row_length; y++) {
						col_arry.push(rows[y][i]);
					}
					row2col.push(col_arry)
				}
				//列转行

				var newModelData = [];
				var d = {
					'no': '',
					'name': '',
					'index': ''
				};
				for (var i = 1; i < row2col.length; i++) {
					newModelData.push(d);
				}
				//console.log('-------------0->'+newModelData.length+'-----------------')
				//console.log('-------------1'+fish.map(datas,function(v){return v.no; })+'-----------------')
				for (var i = 1; i < row2col.length; i++) {
					var col = row2col[i];
					d = {
						'no': '',
						'name': '',
						'index': ''
					};
					for (var j = 0; j < datas.length; j++) {

						var falg = fish.contains(col, datas[j].no);
						if (falg) {
							d = datas[j];
							datas.splice(j, 1);
							//console.log('del' + datas.length)
							break;
						} else {
							d = {
								'no': '',
								'name': '',
								'index': ''
							};
						}
					}
					newModelData[i - 1] = d;
					// console.log('++++++++++++++++++'+d.no)
				}
				// console.log('-------------1.5->'+newModelData.length+'-----------------')
				//console.log('-------------2->'+fish.map(newModelData,function(v){return v.no; })+'-----------------')

				var newDate = newModelData.concat(datas);
				//  console.log('<::::::::3--></::::::::3-->'+fish.map(newDate,function(v){return v.no; })+'::::::::::')

				return newDate;

			},
			supplement: function () {
				var self = this;
				//添加行首

				var trs = self.tableBody.find('tr');
				var td_max = self.getTDMax(trs);
				self.addFristRow(td_max - 1);
				trs = self.tableBody.find('tr').not(':first');
				fish.each(trs, function (tr, index) {
					var td_cout = $(tr).find("td").length;
					var remainder = td_max - td_cout;
					trClassName = "recode" + index + "_td";
					var tdStr = "";
					for (var i = 0; i < remainder; i++) {
						tdStr += self.tableTemplate.td_null({
							'flag': trClassName
						});
					}
					$(tr).append(tdStr);
				})
				//添加最后一行
				self.addLastRow(td_max - 1);



			},
			addLastRow: function (td_nums) {
				var self = this;
				self.tableBody.find('.last').remove();
				var domStr = self.createRowHTML({
					'name': '',
					'trClassName': 'last',
					datas: fish.range(td_nums),
					handel: function (key, value) {
						return self.tableTemplate.td_operation_output({
							'name': this.i18nData.OUTPUT,
							'flag_class': 'output_checkbox',
							'flag_output_class': 'output_text'
						});
					}.bind(this),
				});
				self.tableBody.append(domStr);
				/*
				$('.output_checkbox').on('change', function() {
				       var falg = $(this).is(':checked');
				       var input=$(this).parent().find('.output_text')
				       var $sib_tds = self.getColumTds(this);
				       var no =$($sib_tds[1]).find('div').data('no')
				       if(falg){
				        input.show();
				        input.val(no);
				       }else{
				        input.hide();
				        input.val('')
				       }

				});
				*/
			},
			addFristRow: function (td_nums) {
				var self = this;
				self.tableBody.find('.first').remove();
				var domStr = self.createRowHTML({
					'name': '',
					'trClassName': 'first',
					datas: fish.range(td_nums),
					handel: function (key, value) {
						return self.tableTemplate.td_operation({
							'name': this.i18nData.MERGE,
							'flag_class': 'notnull_checkbox'
						});
					}.bind(this),
				});
				self.tableBody.find('tr:first').before(domStr);
				$('.notnull_checkbox').on('change', function () {
					var falg = $(this).is(':checked');
					var $sib_tds = self.getColumTds(this);
					if (falg) {
						var $null_td = $sib_tds.find(".null_td");
						if ($null_td.length > 0) {
							//$null_td.addClass("null_flag");
							//fish.toast('info', '合并列中不能有空数据，请拖动一个数据进来');
						}

					} else {
						//没有选择时，要还原样式
						$sib_tds.find(".null_td").removeClass("null_flag");
					}

				})

			},
			createRowHTML: function (option) {
				var self = this;
				var body = self.tableTemplate.td_header({
					'no': option.no,
					'name': option.name
				});
				var trClassName = option.trClassName;

				fish.each(option.datas, function (key, value) {
					body += option.handel(key, value);
				})
				return self.tableTemplate.tr({
					'body': body,
					'flag': trClassName
				})

			},
			getTDMax: function (trs) {
				if (!trs) return;
				var self = this;
				var tdCount_array = fish.map(trs, function (tr) {
					return $(tr).find("td").length;
				})

				var td_max = fish.max(tdCount_array);
				self.table.find('#table_colspan').attr('colspan', td_max);
				return td_max;
			},
			delMoTr: function (event) {
				$(event.target).parents('tr').remove();
			}
		});
	});