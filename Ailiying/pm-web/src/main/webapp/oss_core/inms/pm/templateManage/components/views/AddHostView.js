define([
    "oss_core/inms/pm/templateManage/actions/template",
    'i18n!oss_core/inms/pm/templateManage/i18n/template',
    "text!oss_core/inms/pm/templateManage/components/views/addHostView.html"
], function(action,i18nData,tpl) {
    var AddHostView = function() {
        this.tpl = fish.compile(tpl);
    }

    AddHostView.prototype.content = function() {
        this.$el = $(this.tpl(i18nData))
        return this.$el;
    }

    AddHostView.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content()
        self.$popup = fish.popup(options);
        self.props = props;
        this.catagory = this.props.catagory;
        self.callback = callback;
        console.log(self.props,444444)
        self.afterPopup();

    }

    AddHostView.prototype.afterPopup = function() {
        var self = this;
        self.readerList()
        self.rendInfo()
        this.$el.find('.reset').off('click').on('click', function() {
            self.callback();
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.CPSchemeinfo = {
                'cpName':self.$el.find('.cp_name').val(),
                'cpTypeId':(self.props.CPSchemeinfo &&  self.props.CPSchemeinfo.cpId) ? self.props.CPSchemeinfo.cpId : '',
                'cpId':self.$cp_type_id.combobox('value'),
                'checkPointSelectConds':self.CPAttributeInfo(),
                'rid':(JSON.stringify(self.props.CPSchemeinfo) !== "{}") ? self.props.CPSchemeinfo._id_ : ''
            }
            self.callback(self.props)
            self.$popup.hide();
        });
    }

    AddHostView.prototype.CPAttributeInfo = function() {
        var self = this;
        var CPAttributeInfo = [];
        this.$el.find('.condList').each(function() {
            CPAttributeInfo.push({
                'condAttrCode':$(this).find('.cp1 .mt4').data("name"),
                'condType':$(this).find('.cond_type').val(),
                'condValue':$(this).find('.cond_attr_value').val(),
                'macro':$(this).find('.macroIpt').val()
            })
        })
        return CPAttributeInfo
    }

    AddHostView.prototype.readerList = function() {
        var self = this;
        action.pmcpSchemeInfo({"catagory":self.catagory}).then(function(data) {
            if(data.tList.length>0){
                action.getParamvalueInfo('CP_COND_TYPE').then(function(datas){
                    self.$cp_type_id = self.$el.find('.cp_type_id').combobox({
                        editable: false,
                        dataTextField: 'cp_type_name',
                        dataValueField: 'cp_type_id',
                        dataSource: data.tList
                    });
                    self.$cp_type_id.combobox().on('combobox:change', function(e) {
                        self.changeList(datas.CP_COND_TYPE,data.cList,self.$cp_type_id.combobox('value'))
                    });
                    self.$cp_type_id.combobox('value',self.props.CPSchemeinfo.cpTypeId ? self.props.CPSchemeinfo.cpTypeId : data.tList[0].cp_type_id)
                })
            }
        })
    }

    AddHostView.prototype.rendInfo = function(cList,list,id) {
        var self = this;
        self.$el.find('.cp_name').val(self.props.CPSchemeinfo.cpName ? self.props.CPSchemeinfo.cpName : '');
        //JSON.stringify(self.props.CPSchemeinfo) !== "{}"
    }

    AddHostView.prototype.changeList = function(cList,list,id) {
        var self = this;
        var pappend = ''
        if(list.length >0 ){
            var oList = list.filter(function (e) {
                return e.cp_type_id == id;
            })
            fish.map(oList,function(row){
                var codeName = ''
                if(self.props.CPSchemeinfo.checkPointSelectConds && self.props.CPSchemeinfo.checkPointSelectConds.length>0){
                    codeName = self.props.CPSchemeinfo.checkPointSelectConds.filter(function (e) {
                        return e.condAttrCode == row.cp_attr_code;
                    })
                }
                var condValue = (codeName && codeName.length > 0) ? codeName[0].condValue : '';
                var macroVal = (codeName && codeName.length > 0) ? codeName[0].macro : '';
                var isnone = (codeName && codeName.length > 0) ? '' : 'none';
                pappend += '<div class="col-md-12 padd0 condList">'+
                        '<div class="col-md-5 cp1">'+
                            '<div class="col-md-4"><span class="mt4" style="width: 50px" data-name="'+row.cp_attr_code+'">'+row.cp_attr_name+'</span></div>'+
                            '<div class="col-md-8"><span style="width: 155px;margin-left: 5px;">'+
                                '<input type="text" class="cond_type filterInput tranItem">'+
                            '</span></div>'+
                        '</div>'+
                        '<div class="col-md-3 cp2">'+
                            '<input type="text" class="cond_attr_value filterInput tranItem" value="'+condValue+'">'+
                        '</div>'+
                        '<div class="col-md-4 cp3">'+
                            '<span class="setMacro mt4"><label><input type="checkbox" name="setMacro">设置宏</label></span>'+
                            '<span class="'+isnone+'" style="width: 110px;margin-left: 5px;">'+
                                '<input type="text" class="macroIpt filterInput tranItem" value="'+macroVal+'">'+
                            '</span>'+
                        '</div>'+
                    '</div>'
            });
            self.$el.find('.temCondition').html('')
            self.$el.find('.temCondition').append(pappend);
            self.$cond_type = self.$el.find('.cond_type').combobox({editable: false, dataTextField: 'paraName', dataValueField: 'paraValue', dataSource: cList});
            self.$cond_type.combobox('value',cList[0].paraValue)
            self.showInput()
        }
    }

    AddHostView.prototype.showInput = function(cList,list,id) {
        $(".setMacro input").on("change",function(){
            var this_ = $(this)
            if(this_.prop('checked')){
                this_.parent().parent().next().show()
            }else{
                this_.parent().parent().next().hide()
            }
        });
    }

    return AddHostView;
})