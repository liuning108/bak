define([
    "oss_core/pm/dashboard/actions/DashBoardAction", "text!oss_core/pm/dashboard/js/emailPlug/emailConfig.html", "css!oss_core/pm/dashboard/js/emailPlug/style.css"
], function(action, tpl) {
    return portal.CommonView.extend({
        className: "ui-dialog dialog",
        template: fish.compile(tpl),
        initialize: function(param) {
            this.param = param;
        },
        render: function() {
            this.$el.html(this.template());
            return this;
        },
        afterRender: function() {
            var self = this;
            action.querySendTopicByNo(self.param, function(data) {
                var result = data.result;
                console.log(data.result);
                if (result) {
                    self.$el.find('#dashboard-subject-name').val(result.subjectName);
                    self.$el.find('#dashboard-Recipent').val(result.recipient);
                    self.$el.find('#sendmail-effDate').val(result.effDate.substr(0, 10));
                    self.$el.find('#sendmail-expDate').val(result.expDate.substr(0, 10));
                    var reportTypeArry = eval(result.reportType);

                    fish.each(reportTypeArry, function(obj, index) {

                        var select = "._" + obj.type + "_LI"
                        self.$el.find(select).addClass('selRun')
                        var rg =self.$el.find(select).data('rg');
                        self.$el.find('input[name='+rg+'][value='+obj.data_range+']').attr('checked',true)
                        var link = self.$el.find(select).data('link')
                        if (index == 0) {
                            self.$el.find(link).show();
                        }
                        self.$el.find(link).find('.toggle-switch').attr('checked', true)
                        var sub = self.$el.find(link).find('.toggle-switch').data('sub');
                        self.$el.find(sub).show();


                    })

                    self.$el.find('.typeConfigItems').show();
                } else {
                    self.$el.find('#dashboard-subject-name').val(self.param.topicName);
                    self.$el.find('.typeConfigItems').hide();
                }
                self.eventRender();
            })

        },

        eventRender: function() {

            var self = this;

            $('#sendmail-effDate,#sendmail-expDate').datetimepicker({viewType: "date"});

            $('#btn-sendmail-ok').click(function() {
                value = fish.map($('.selCardUL li.selRun'), function(dom) {
                      var rg =$(dom).data('rg');
                      var value=self.$el.find('input[name='+rg+']:checked').val();

                    return {'type': $(dom).data('value'),
                             'data_range': value}
                })

                if (value.length > 0) {
                    var flag = $('#detailfrom').isValid();
                    if (flag) {
                        var subjectName = self.$el.find('#dashboard-subject-name').val();
                        var recipents = self.$el.find('#dashboard-Recipent').val();
                        var effD = self.$el.find('#sendmail-effDate').val();
                        var expD = self.$el.find('#sendmail-expDate').val();
                        var repotyTypeValue = JSON.stringify(value);

                        action.saveOrUpdateSendTopic({
                            topicType: self.param.topicType,
                            topicNo: self.param.topicNo,
                            SubjectName: subjectName,
                            Recipent: recipents,
                            ReportType: repotyTypeValue,
                            EffDate: effD,
                            ExpDate: expD
                        }, function() {
                            fish.toast('success', 'config success')
                            self.trigger('close')
                        })
                    }

                } else {
                    $('#detailfrom').resetValid();
                    action.delSendTopic({
                        topicType: self.param.topicType,
                        topicNo: self.param.topicNo
                    }, function() {
                        fish.toast('success', 'config success')
                        self.trigger('close')
                    })
                }

            })

            $('.selCardUL li').click(function() {
                self.$el.find('.typeConfigItems').show();
                var flag = $(this).hasClass("selLi")
                $(".selLi").removeClass('selLi')
                var panelId = $(this).data("link")
                self.$el.find('.typeConfigItems .plane').hide();
                self.$el.find(panelId).show();
                if (!flag) {
                    $(this).addClass('selLi');
                } else {
                    $(this).removeClass('selLi');
                }

            })

            $('#btn-sendmail-cancel').click(function() {
                self.trigger('close')
            })

            self.$el.find('#daily-checkbox , #week-checkbox , #month-checkbox').click(function() {
                var flag = $(this).is(':checked')
                var sel = $(this).data("sub");
                var psel = $(this).data('title')
                if (flag) {
                    self.$el.find(sel).show();
                    self.$el.find(psel).addClass('selRun')
                } else {
                    self.$el.find(sel).hide();
                    self.$el.find(psel).removeClass('selRun')
                }
            })

        }
    })

})
