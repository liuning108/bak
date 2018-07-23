define([
    "oss_core/itnms/trigger/actions/triggerAction",
    "text!oss_core/itnms/trigger/components/views/addExpressionView.html",
    "oss_core/itnms/trigger/components/views/SelectItemsView.js"
], function(action,tpl,SelectItemsView) {
    var AddExpressionView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddExpressionView.prototype.content = function(datas) {
        this.$el = $(this.tpl(datas))
        return this.$el;
    }

    AddExpressionView.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        this.$popup = fish.popup(options);
        this.selectItems = props;
        self.callback = callback;
        self.afterPopup();

    }

    AddExpressionView.prototype.afterPopup = function() {
        var self = this;
        this.$triggerFunc = this.$el.find('.triggerFunc').combobox('setEditable', false);
        this.$el.find('.reset').off('click').on('click', function() {
            self.callback(self.props);
            self.$popup.hide();
        });
        this.$triggerFunc.combobox({
            dataTextField: 'DECRIPTION',
            dataValueField: 'FUNC_NAME',
            dataSource: []
        });
        this.$el.find('.OK').off('click').on('click', function() {
            var rVal = self.checkInput()
            if(rVal){
                self.callback(rVal)
                self.$popup.hide();
            }
        });

        self.$el.find('.smaster_span').off('click').on('click', function() {
            var options = {
                height: 400,
                width: (self.$el.width()*1.5),
                modal: true,
                draggable: false,
                autoResizable: true
            };
            var selectItemsView = new SelectItemsView();
            selectItemsView.popup(options,self.selectItems,function(param) {
                console.log(param)
                var iVal = param.name + ':' + param.selrow.name
                self.changeInput(iVal)
                self.sFunctoin(param.selrow.value_type)
            });
        });
    }

    AddExpressionView.prototype.changeInput = function(iVal) {
        this.$el.find('.selectItems input').val(iVal)
    }

    AddExpressionView.prototype.checkInput = function(iVal) {
        var self = this;
        var funStr = '';
        //console.log(this.arrInfo)
        if(this.arrInfo && this.arrInfo.ival){
            var checkval = self.$el.find(".ExpFuncPara1 input[name='check_rad']:checked").val();
            for (var i=0;i<this.arrInfo.ival.length;i++) {
                isrequird = self.$el.find('.'+this.arrInfo.ival[i]).parent();
                if(checkval === 'count' && this.arrInfo.ival[i] === 'SEC_OR_NUM'){
                    inputVal = '#'+self.$el.find('.'+this.arrInfo.ival[i]).val();
                }else{
                    inputVal = self.$el.find('.'+this.arrInfo.ival[i]).val();
                }
                if(this.arrInfo.ival[i] === 'SEC_OR_NUM' && !inputVal){
                    fish.toast('warn','time or count is required');
                    return;
                }else if(isrequird.hasClass('required') && !inputVal){
                    fish.toast('warn',this.arrInfo.ival[i] + ' is required');
                    return;
                }else{
                    if(self.$el.find('.'+this.arrInfo.ival[this.arrInfo.ival.length-1]).val()){
                        funStr += inputVal + ',';
                    }else{
                        if(inputVal){
                            funStr += inputVal + ',';
                        }else{
                            funStr += inputVal;
                        }
                    }
                }
            }
            funStr = funStr.substr(0,funStr.length-1)
            var lastRtm = '{' + self.selectItems.host+':'+self.selectItems.selrow.keys+'.'+this.arrInfo.fun + '('+funStr+')' + '}'
            //console.log(lastRtm)
            return lastRtm
        }else{
            fish.toast('warn','items is required');
        }
    }

    AddExpressionView.prototype.sFunctoin = function(types) {
        var self = this;
        var fData = {};
        action.queryItnmsExpFunc().then(function(data){
            fData.ExpFunc = data
        }).then(function(){
            action.queryItnmsExpFuncPara().then(function(datas){
                fData.ExpFuncPara = datas.filter(function (e) {
                    return e.PARA_ID !== 'TIME_SHIFT' && e.PARA_ID !== 'SEC_OR_NUM'
                })
                var filterType = fData.ExpFunc.filter(function (e) {
                    return e.SUPPORTED_DATA_TYPES.indexOf(types) >= 0
                })
                self.$triggerFunc.combobox({
                    dataSource: filterType
                });
                self.$triggerFunc.combobox('enable');
                self.$triggerFunc.off('combobox:change').on('combobox:change', function() {
                    var d = self.$triggerFunc.combobox('getSelectedItem');
                    if(!d) return;
                    self.showPara(d,fData.ExpFuncPara)
                });
                self.$triggerFunc.combobox('value',filterType[0].FUNC_NAME);
            })
        })
    }
    AddExpressionView.prototype.showPara = function(d,param) {
        var self = this;
        this.arrInfo = {};
        this.arrInfo.fun = d.FUNC_NAME
        this.arrInfo.ival = []
        self.$el.find('.ExpFunc .form-group').remove()
        self.$el.find('.ExpFunc').hide()
        self.$el.find('.ExpFuncPara .SEC_OR_NUM').val("");
        self.$el.find('.ExpFuncPara .TIME_SHIFT').val("");
        self.$el.find('.ExpFuncPara').hide()
        self.$el.find('.ExpFuncPara1').hide()
        self.$el.find('.ExpFuncPara2').hide()
        if(d.IN_PARAM_IDS){
            var arrV = d.IN_PARAM_IDS.split(",");
            var arrN = []
            for (var i=0;i<arrV.length;i++) {
                arrW = (arrV[i].substr(arrV[i].length-1,1) === '*') ? arrV[i].substr(0,arrV[i].length-1) : arrV[i];
                self.arrInfo.ival.push(arrW);
                isrequir = (arrV[i].substr(arrV[i].length-1,1) === '*') ? 'required' : '';
                isrequirstr = (arrV[i].substr(arrV[i].length-1,1) === '*') ? '<span></span>' : '';
                isrequirstr = (arrV[i].substr(arrV[i].length-1,1) === '*') ? '<span>*</span>' : '';
                if(arrW === 'SEC_OR_NUM'){
                    self.$el.find('.ExpFuncPara').show()
                    self.$el.find('.ExpFuncPara1').show()
                }else if(arrW === 'TIME_SHIFT'){
                    self.$el.find('.ExpFuncPara').show()
                    self.$el.find('.ExpFuncPara2').show()
                }else{
                    self.$el.find('.ExpFunc').show()
                    var pappend = '';
                    var filterParam = param.filter(function (e) {
                        return e.PARA_ID === arrW
                    })
                    var placehold = filterParam[0].MARK ? filterParam[0].MARK : '';
                    pappend = '<div class="form-group itemFrom '+isrequir+'" ><div class="col-xs-12">'+
                        '<div class="col-xs-2 lh28 mgr4 paradiv">'+filterParam[0].PARA_NAME+isrequirstr+'</div>'+
                            '<div class="col-xs-6 '+isrequir+'">'+
                            '<input type="text" class="filterInput tranItem '+arrW+'" placeholder="'+placehold+'" name="">'+
                        '</div>'+
                    '</div></div>';
                    self.$el.find('.ExpFunc .paracontemt').append(pappend);
                    if(filterParam[0].VALUE_RESTRICTION){
                        var arrO = filterParam[0].VALUE_RESTRICTION.split(",");
                        var arrOn = []
                        for (var j=0;j<arrO.length;j++) {
                            arrOn.push({
                                "id":arrO[j],
                                "value":arrO[j]
                            })
                        }
                        self.$el.find('.' + arrW).combobox({
                            editable: false,
                            dataTextField: 'value',
                            dataValueField: 'id',
                            dataSource: arrOn
                        });
                    }
                }
            }
            console.log(self.arrInfo)
            // fish.map(arrV,function(row){
            //     triggeridObj.push({"triggerid":""+row,"status": status});
            // });
            // var filterParam = param.filter(function (e) {
            //     return value.indexOf(e.PARA_ID) > 0
            // })
        }
    }
    return AddExpressionView;
})