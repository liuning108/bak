$.widget("ui.multiselect", $.ui.multiselect, {
        appendNew: function appendNew(result) {
        
            var dataValueField = this.options.dataValueField;
            var dataTextField = this.options.dataTextField;
            if (!fish.isEmpty(result)) {
                if (this._isMultiple()) {
             
                    this.$input.val(result[dataValueField]);
                  //   alert(this.options.dataValueField);
                } else {
                    this.$innerInput.val(result[dataValueField]);
                   
                }

                this._tabHandler2(result);
            }
        },
                _tabHandler2: function _tabHandler(evt) {
            var self = this,
                _inputValue = this._isMultiple() ? this.$input.val() : this.$innerInput.val();
            if (_inputValue && this.options.tabKey) {
                             alert("eedde");
                //响应tab�?                
                //evt && evt.preventDefault();
                var isNew = true;
               // alert("ddd");
                $.each(this.results_data, function (index, obj) {
                    if (obj.text === _inputValue) {
                        if (obj.selected) {
                            self.close();
                        } else {
                            self.result_highlight = self.$menu.find('.active-result').first();
                            self._selectMenu();
                        }
                        isNew = false;
                        return isNew;
                    }
                });
                //alert(isNew);
                if (!isNew) {
                    return;
                }
                if (this._isMultiple())
                var $option = $('<option value="' + _inputValue + '" selected="selected"></option>').text(evt[this.options.dataTextField]);
                else
                var $option = $('<option value="' + _inputValue + '" selected="selected"></option>').text(_inputValue);
                this.element.append($option);
                var item = {};
                item[this.options.dataValueField] = _inputValue;
                item[this.options.dataTextField] = _inputValue;
                this._newItems.push(item);
                if (!fish.isEmpty(this.options.dataSource)) {
                    this.options.dataSource.push(item);
                }
                this._trigger('createItem', null, item);
                this._update();
                this.close();
            }
        }
});