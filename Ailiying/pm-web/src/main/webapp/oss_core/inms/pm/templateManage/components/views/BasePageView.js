define([
    "oss_core/inms/pm/templateManage/actions/template",
    "text!oss_core/inms/pm/templateManage/components/views/BasePageView.html"
], function(action,tpl) {
    var BasePageView = function(options) {
        this.options = options;
        this.$el = $(this.options.el);
        this.tpl = fish.compile(tpl);
        this.upObj = this.options.upObj;
        console.log(this.upObj)
        this.type = this.options.type;
        this.TemplateDto = this.options.TemplateDto;
    }

    BasePageView.prototype.render = function() {
        this.$el.html(this.tpl());
        this.afterRender()
    }

    BasePageView.prototype.afterRender = function() {
        var self = this;
        self.renderCom();
        self.renderBasePage();
    }

    BasePageView.prototype.renderCom = function() {
        var self = this;
        action.getParamvalueInfo('TEMPLATE_CATAGORY').then(function(datas){
            self.$catagory = self.$el.find('.catagory').combobox({
                editable: false,
                dataTextField: 'paraName',
                dataValueField: 'paraValue',
                dataSource: datas.TEMPLATE_CATAGORY
            });
            self.$catagory.combobox().on('combobox:change', function(e) {
                self.renderImgList(self.$catagory.combobox('value'))
            });
            if(self.upObj && self.upObj.length > 0){
                self.$catagory.combobox('value',self.upObj[0].catagory)
            }else{
                self.$catagory.combobox('value',datas.TEMPLATE_CATAGORY[0].paraValue)
            }
        })
    }

    BasePageView.prototype.renderImgList = function(val) {
        var self = this;
        var obj = {
            "iconType" : val ? val : ''
        }
        action.pmtemplateIconInfo(obj).then(function(datas){
            console.log(datas,122233)
            var pappend = '';
            self.$el.find('.lIconShadow img').remove();
            if(datas.length > 0){
                /*if(self.upObj && self.upObj.length>0){
                    var filterList = datas.filter(function (e) {
                        return e.iconId == self.upObj[0].iconId;
                    });
                    self.$el.find('.lIconShadow').append('<img src="static/oss_core/inms/pm/templateManage/images/'+filterList[0].iconUrl+'" data-iconId='+filterList[0].iconId+' data-iconType='+filterList[0].iconType+'>')
                }else{
                    self.$el.find('.lIconShadow').append('<img src="static/oss_core/inms/pm/templateManage/images/'+datas[0].iconUrl+'" data-iconId='+datas[0].iconId+' data-iconType='+datas[0].iconType+'>')
                }*/
                self.$el.find('.lIconShadow').append('<img src="static/oss_core/inms/pm/templateManage/images/'+datas[0].iconUrl+'" data-iconId='+datas[0].iconId+' data-iconType='+datas[0].iconType+'>')
            }
            self.$el.find('.rIconUl ul li').remove()
            fish.map(datas,function(row){
                pappend += '<li><img src="static/oss_core/inms/pm/templateManage/images/'+row.iconUrl+'" data-iconId='+row.iconId+' data-iconType='+row.iconType+'></li>'
            });
            self.$el.find('.rIconUl ul').append(pappend);
            self.imgClick()
        })
    }

    BasePageView.prototype.imgClick = function(val) {
        var self = this;
        self.$el.find('.rIconUl li').off('click').on('click',function(){
            self.$el.find('.lIconShadow img').remove();
            self.$el.find('.lIconShadow').append($(this)[0].innerHTML)
        })
    }

    BasePageView.prototype.renderBasePage = function() {
        var self = this
        if(self.upObj && self.upObj.length > 0){
            if(self.type === 'copy'){
                this.$el.find('.template_name').val(this.upObj[0].templateName+'_copy');
            }else{
                this.$el.find('.template_name').val(this.upObj[0].templateName);
            }
            this.$el.find('.comments').val(this.upObj[0].comments ? this.upObj[0].comments : '');
        }
    }

    BasePageView.prototype.getInfo = function() {
        var self = this;
        self.TemplateDto.templateName = self.$el.find('.template_name').val() ? self.$el.find('.template_name').val() : '';
        self.TemplateDto.catagory = self.$catagory.combobox('value')
        self.TemplateDto.comments = self.$el.find('.comments').val() ? self.$el.find('.comments').val() : ''
        self.TemplateDto.iconId = self.$el.find('.lIconShadow img').data('iconid') ? self.$el.find('.lIconShadow img').data('iconid') : ''
        if(self.upObj && self.upObj.length > 0){
            self.TemplateDto.templateId = self.upObj[0].templateId
        }
        return self.TemplateDto
    }

    return BasePageView;
})