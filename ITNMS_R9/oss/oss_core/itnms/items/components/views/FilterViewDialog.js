define([
    "oss_core/itnms/items/actions/ItemAction",
    "text!oss_core/itnms/items/components/views/filterItemView.html"
], function(action,tpl) {
    var FilterViewDialog = function() {
        this.tpl = fish.compile(tpl);
    }

    FilterViewDialog.prototype.content = function(datas) {
        this.$el = $(this.tpl(datas))
        return this.$el;
    }

    FilterViewDialog.prototype.popup = function(options, props,callback) {
        var self = this;
        action.itemTypes('ITEM_TYPE,ITEM_STATE,ITEM_STATUS,ITEM_TRIGGER,ITEM_TEMPLATED').then(function(datas){
            options.content = self.content(datas),
            self.$popup = fish.popup(options);
            self.props = props;
            self.callback = callback;
            self.afterPopup();
        })

    }
    FilterViewDialog.prototype.afterPopup = function() {
        var self = this;
        this.$el.find('.filterName').val(this.props.search.name);
        this.$el.find('.filterkey').val(this.props.search.key_);
        this.$el.find('.filterInterval').val(this.props.search.delay);
        this.$el.find('.filterHistory').val(this.props.search.history);
        this.$el.find('.filterTrends').val(this.props.search.trends);
        this.$el.find(".filterType option[value="+this.props.filter.type+"]").prop("selected","selected");
        this.$el.find(".filterState option[value="+this.props.filter.state+"]").prop("selected","selected");
        this.$el.find(".filterStatus option[value="+this.props.filter.status+"]").prop("selected","selected");
        this.$el.find(".filterTriggers option[value="+this.props.with_triggers+"]").prop("selected","selected");
        this.$el.find(".filterTemplate option[value="+this.props.templated+"]").prop("selected","selected");
        this.$el.find('.reset').off('click').on('click', function() {
            self.props.filter = {};
            self.props.search = {};
            delete self.props.with_triggers;
            delete self.props.templated;
            self.$el.find('.filterInput').val("");
            self.$el.find(".filterOption option:first").prop("selected", "selected");
            self.callback(self.props);
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.props.search = {
                "name": self.$el.find('.filterName').val(),
                "key_": self.$el.find('.filterkey').val(),
                "delay": self.$el.find('.filterInterval').val(),
                'history': self.$el.find('.filterHistory').val(),
                'trends': self.$el.find('.filterTrends').val()
            }
            var templated = self.$el.find('.filterTemplate option:selected').val();
            var with_triggers = self.$el.find('.filterTriggers option:selected').val();
            if(with_triggers === 'true'){
                self.props.with_triggers = true;
            }else if(with_triggers === 'false'){
                self.props.with_triggers = false;
            }else{
                delete self.props.with_triggers;
            }
            if(templated === 'true'){
                self.props.templated = true;
            }else if(templated === 'false'){
                self.props.templated = false;
            }else{
                delete self.props.templated;
            }
            self.props.templaed = (self.$el.find('.filterTriggers option:selected').val() !== '-1') ? self.$el.find('.filterTriggers option:selected').val() : '';
            self.props.filter = {
                'type':(self.$el.find('.filterType option:selected').val() !== '-1') ? self.$el.find('.filterType option:selected').val() : '',
                'state':(self.$el.find('.filterState option:selected').val() !== '-1') ? self.$el.find('.filterState option:selected').val() : '',
                'status':(self.$el.find('.filterStatus option:selected').val() !== '-1') ? self.$el.find('.filterStatus option:selected').val() : ''
            }
            self.props.type = (self.$el.find('.filterType option:selected').val() !== '-1') ? self.$el.find('.filterType option:selected').val() : '';
            self.callback(self.props)
            self.$popup.hide();
        });

    }

    return FilterViewDialog;
})