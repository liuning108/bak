define([
        "text!oss_core/pm/util/templates/DemoView.html",
        "text!oss_core/pm/util/templates/CardView.html",
        "text!oss_core/pm/util/templates/NullView.html",
        "css!oss_core/pm/util/css/ad-util-component.css",
        "oss_core/pm/util/js/jquery.widget.swappable"
    ],
    function(tpl, cardViewTpl, nullView) {
        return portal.CommonView.extend({
            //加载模板
            template: fish.compile(tpl),
            initialize: function() {},
            render: function() {
                this.$el.html(this.template());
                return this;
            },
            tr_flag: [],
            tableTemplate: {
                'tr': fish.template("<tr class=<%= flag %>><%= body %></tr>"),
                'td_header': fish.template("<td data-no=<%= name %> ><%= name %></td>"),
                'td_data': fish.template(cardViewTpl),
                'td_null': fish.template(nullView),


            },
            afterRender: function(option) {
                var self = this;
                self.table = $("#mergeTableView");
                self.tableBody = self.table.find('tbody');

            }, //end of afterRender

            put: function(model) {
                this.addRow(model);
                this.addJS();
            },
            addJS: function() {
                var self = this;
                fish.each(self.tr_flag, function(className, index) {
                    console.log(name + "---" + index)
                    $("." + className).swappable({
                        items: "." + className + "_td",
                        cursorAt: { top: -20 },
                        stop: function(event, ui) {}
                    }).disableSelection();
                })



            },
            addRow: function(model) {
                var self = this;

                var datas = model.datas;
                var newDatas = self.grouping(fish.clone(datas));
                var body = self.tableTemplate.td_header({ 'name': model.name });
                var trClassName = "recode" + self.tr_flag.length;

                fish.each(newDatas, function(key, value) {
                    if (key.no.length <= 0) {
                        body += self.tableTemplate.td_null({ 'flag': trClassName + "_td" });
                    } else {
                        body += self.tableTemplate.td_data({ 'name': key.name, 'no': key.no, 'index': key.index, 'flag': trClassName + "_td" });
                    }
                })
                var domStr = self.tableTemplate.tr({ 'body': body, 'flag': trClassName });
                self.tableBody.append(domStr)
                self.supplementTd(); //补充TD
                self.tr_flag.push(trClassName);

            },
            grouping: function(datas) {
                var self = this;

                var trs = self.tableBody.find('tr');
                var cols = self.getTDMax(trs);
                var rows = []
                var row_length = trs.length;
                rows = fish.map(trs, function(tr) {
                    return fish.map($(tr).find('td'), function(td) {
                        return $(td).find('.recode_td').data('no');
                    })
                })
                var row2col = [];
                for (var i = 0; i < cols; i++) {
                    var col_arry = [];
                    for (var y = 0; y < row_length; y++) {
                        col_arry.push(rows[y][i]);
                    }
                    row2col.push(col_arry)
                }
                var newModelData = [];
                var d = { 'no': '', 'name': '', 'index': '' };
                for (var i = 1; i < row2col.length; i++) {
                    newModelData.push(d);
                }
                //console.log('-------------0->'+newModelData.length+'-----------------')
                //console.log('-------------1'+fish.map(datas,function(v){return v.no; })+'-----------------')
                for (var i = 1; i < row2col.length; i++) {
                    var col = row2col[i];
                    d = { 'no': '', 'name': '', 'index': '' };
                    for (var j = 0; j < datas.length; j++) {

                        var falg = fish.contains(col, datas[j].no);
                        if (falg) {
                            d = datas[j];
                            datas.splice(j, 1);
                            //console.log('del' + datas.length)
                            break;
                        } else {
                            d = { 'no': '', 'name': '', 'index': '' };
                        }
                    }
                    newModelData[i - 1] = d;
                    // console.log('++++++++++++++++++'+d.no)
                }
                // console.log('-------------1.5->'+newModelData.length+'-----------------')
                //console.log('-------------2->'+fish.map(newModelData,function(v){return v.no; })+'-----------------')

                var newDate = newModelData.concat(datas);
                //         console.log('<::::::::3--></::::::::3-->'+fish.map(newDate,function(v){return v.no; })+'::::::::::')

                return newDate;

            },
            supplementTd: function() {
                var self = this;
                var trs = self.tableBody.find('tr');
                var td_max = self.getTDMax(trs);

                fish.each(trs, function(tr, index) {
                    var td_cout = $(tr).find("td").length;
                    var remainder = td_max - td_cout;
                    trClassName = "recode" + index + "_td";
                    var tdStr = "";
                    for (var i = 0; i < remainder; i++) {
                        tdStr += self.tableTemplate.td_null({ 'flag': trClassName });
                    }
                    $(tr).append(tdStr);
                })




            },
            getTDMax: function(trs) {
                if (!trs) return;
                var self = this;
                var tdCount_array = fish.map(trs, function(tr) {
                    return $(tr).find("td").length;
                })

                var td_max = fish.max(tdCount_array);
                self.table.find('#table_colspan').attr('colspan', td_max);
                return td_max;
            }



        });
    });
