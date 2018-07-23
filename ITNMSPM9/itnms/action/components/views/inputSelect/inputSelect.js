define([
    "text!oss_core/itnms/action/components/views/inputSelect/inputSelect.html",
], function(tpl) {
    var inputSelect = function(options) {
        this.options = options
        this.$el = $(this.options.el);
        this.tpl = fish.compile(tpl)
        console.log(this.options);
    }
    inputSelect.prototype.render = function() {
        this.remove();
        this.$el.html(this.tpl());
        this.afterRender();
    }
    inputSelect.prototype.remove = function() {
        this.$el.html("");
    }
    inputSelect.prototype.afterRender = function() {
        var self = this;
        this.$el.find(".pDiv").focus(function(e){
            e.preventDefault();
            var lEl = self.$el.find(".pUl li");
            var isEdit = self.$el.find(".pDiv div");
            if(isEdit.length > 0) self.$el.find(".pDiv").attr("contenteditable", "false");
            if(isEdit.length === 0) self.$el.find(".pDiv").attr("contenteditable", "true");
            if(lEl.length > 0){
                self.$el.find(".pUl").show();
            }
        });
        $(document).on('click', function(event) {
             self.$el.find(".pUl").hide();
        });
        /*this.$el.find(".pDiv").blur(function(){
            self.$el.find(".pUl").hide();
        });*/
        self.$el.find(".pUl li").off('click').bind('click',function(event){
            var flag = $(this).hasClass('result-selected')
            var dataText = $(this).data('option-text');
            var dataId = $(this).data('option-id');
            if(!flag){
                self.$el.find(".pDiv").append('<div><span>'+dataText+'</span><span class="sClose" data-id="'+dataId+'">×</span></div>')
                $(this).addClass('result-selected')
                self.addClose()
            }
        });
        this.$el.find('.pDiv').off('keyup').on('keyup',function() {
            self.keyEvent($(this).text());
        })
    }
    inputSelect.prototype.addClose = function() {
        var self = this;
        self.$el.find(".pDiv .sClose").off('click').bind('click',function(){
            $(this).parent().remove()
            var dataId = $(this).data('id');
            var pUl = self.$el.find(".pUl li")
            fish.map(pUl, function(d) {
                if($(d).data('option-id') === dataId){
                    $(d).removeClass('result-selected')
                }
            })
        });
    }
    inputSelect.prototype.appendLi = function(obj) {
        var self = this;
        var arr = []
        if(obj && obj.length>0){
            var pUl = self.$el.find(".pUl li")
            fish.map(pUl, function(d) {
                arr.push(""+$(d).data('option-id'))
            })
            fish.map(obj, function(d) {
                var index = $.inArray(d.id,arr)
                if(index < 0){
                    self.$el.find(".pUl").append('<li data-option-text="'+d.value+'" data-option-id="'+d.id+'">'+d.value+'</li>')
                }
            })
            self.appendLiEvent();
        }
    }
    inputSelect.prototype.appendLiEvent = function(obj) {
        var self = this;
        self.$el.find(".pUl li").off('click').bind('click',function(){
            var flag = $(this).hasClass('result-selected')
            var dataText = $(this).data('option-text');
            var dataId = $(this).data('option-id');
            if(!flag){
                self.$el.find(".pDiv").append('<div><span>'+dataText+'</span><span class="sClose" data-id="'+dataId+'">×</span></div>')
                $(this).addClass('result-selected')
                self.addClose()
            }
        });
    }
    inputSelect.prototype.keyEvent = function(txt) {
        var lEl = this.$el.find(".pDiv div");
        if(lEl.length > 0) return;
        if(txt.length<=0) {
            this.$el.find(".pUl").find('li').show();
        }else{
            console.log(111)
            this.$el.find(".pUl").find('li').hide();
            this.$el.find(".pUl").find('li[data-option-text*="'+txt+'"]').show();
        }
    }

    return inputSelect;

})