define([
    "oss_core/itnms/items/actions/ItemAction",
    "text!oss_core/itnms/items/components/views/preprocessView.html"
], function(action,tpl) {
    var preprocessView = function() {
        this.tpl = fish.compile(tpl);
    }

    preprocessView.prototype.content = function() {
        this.$el = $(this.tpl())
        return this.$el;
    }

    preprocessView.prototype.popup = function(options, props,callback) {
        var self = this;
        options.content = self.content(),
        self.$popup = fish.popup(options);
        self.props = props;
        self.props.selrow = self.props.selrow ? self.props.selrow : {};
        //console.log(props);
        self.callback = callback;
        self.afterPopup();

    }

    preprocessView.prototype.afterPopup = function() {
        var self = this;
        self.filterPreprocess();
        this.$el.find('.reset').off('click').on('click', function() {
            self.$el.find('.filterInput').val('');
            self.callback([])
            self.$popup.hide();
        });

        this.$el.find('.OK').off('click').on('click', function() {
            self.callback(self.preprocessVal())
            self.$popup.hide();
        });
    }

    preprocessView.prototype.filterPreprocess = function(el,data) {
        var self = this;
        var lPreprocess = [];
        self.$comboboxPreprocess = self.$el.find('.filterPreprocess');
        fish.map(self.props.ITEM_PROCESSING_TYPE,function(d, elem) {
            var name = d.paraName.split('|')
            lPreprocess.push({
                "name":name[0],
                "paraValue":d.paraValue,
                "key":(name.length > 1)  ? name[1] : ''
            })
        })
        self.$comboboxPreprocess.combobox('setEditable', false)
        self.$comboboxPreprocess.combobox({dataTextField: 'name', dataValueField: 'paraValue', dataSource: lPreprocess});
        self.props.selrowRow = self.props.selrowRow ? self.props.selrowRow : {};
        if(self.props.selrowRow && self.props.selrowRow.edit > 0){
            self.$comboboxPreprocess.combobox('value',self.props.selrowRow.edit)
        }else{
            self.$comboboxPreprocess.combobox('value', lPreprocess[0].paraValue)
        }
        var pSelect = self.$comboboxPreprocess.combobox('getSelectedItem').key.split(',')
        self.showInput(self.$comboboxPreprocess)
        self.$comboboxPreprocess.combobox().on('combobox:change', function(e) {
            self.showInput(self.$comboboxPreprocess)
        });
    }

    preprocessView.prototype.showInput = function(el) {
        var self = this
        var pSelect = self.$comboboxPreprocess.combobox('getSelectedItem').key.split(',')
        self.$el.find('.filterProssR .col-xs-12').remove()
        if(pSelect[0] && pSelect[0] !== ""){
            var pappend = '';
            for (var i=0;i<pSelect.length;i++) {
                pappend += '<div class="col-xs-12">'+
                    '<div class="form-group itemFrom">'+
                        '<label for="filterPattern">'+pSelect[i]+'</label>'+
                        '<input type="text" class="filterPattern filterInput tranItem" name="filterPattern" placeholder="'+pSelect[i]+'">'+
                    '</div>'+
                '</div>';
            }
            self.$el.find('.filterPross .filterProssR').append(pappend)
        }
    }

    preprocessView.prototype.preprocessVal = function(){
        var self = this;
        var pSelect = self.$comboboxPreprocess.combobox('getSelectedItem')
        //console.log(pSelect)
        var rvalue = [],rObj = {};
        self.$el.find('.filterProssR').find('input').each(function() {
            rvalue.push($(this).val())
        });
        rObj.name = pSelect.name;
        rObj.paraValue = pSelect.paraValue;
        rObj.value = rvalue.join("|");
        rObj.selrow = self.props.selrow;
        rObj.selrowRow = self.props.selrowRow;
        return rObj;
    }

    return preprocessView;
})