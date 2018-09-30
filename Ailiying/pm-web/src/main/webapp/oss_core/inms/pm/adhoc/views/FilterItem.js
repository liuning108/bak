/**
 *
 */
define([
        'text!oss_core/inms/pm/adhoc/templates/FilterItem.html',
        "oss_core/inms/pm/adhoc/views/AdhocUtil",
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(mainTpl, adhocUtil, i18nData) {
    return fish.View.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            "click #ad-condifmtitem-plus" : "addCondifmtItem",
            "click #ad-condifmtitem-minus" : "delCondifmtItem"
        },

        initialize: function (opt) {
            this.item_id = adhocUtil.guid();
            this.filterLabel = opt.filterLabel;
            this.itemList = opt.itemList;
            this.fieldNo = opt.fieldNo;
            this.meta_dim_code = opt.meta_dim_code;
            this.selectedFilterValueList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({item_id: this.item_id,fieldNo: this.fieldNo,filterLabel: this.filterLabel},this.resource)));
            return this;
        },

        afterRender: function () {
            //
            var self = this;
            if(!this.meta_dim_code && this.itemList.length==0){
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).hide();
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).removeAttr("disabled");
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).off();
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).on("change", function (e) {
                    self.filterValue = e.currentTarget.value;
                    self.inputFilter();
                });
            }else {
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).off();
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).on("click", function () {
                    self.showCondiSelectWin();
                });
                this.$("#ad-filteritem-" + this.fieldNo + '-' + this.item_id).empty();
                this.filterValue = '';
            }
        },

        showCondiSelectWin: function () {
            var self = this;
            require([
                'oss_core/inms/pm/adhoc/views/DimFilterSelect'
            ], function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: self.fieldNo,
                    META_DIM_CODE: self.meta_dim_code,
                    DIM_NAME: self.filterLabel,
                    selectedList: self.selectedFilterValueList,
                    allItemList: self.itemList
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 430
                };
                self.dimSelectView = fish.popup(option);
                dialog.contentReady();
                self.listenTo(dialog, 'okDimSelectEvent', function (data) {
                    self.dimSelectView.close();
                    self.filterValue = data.selectedValueStr;
                    var selectedNameStr = data.selectedNameStr;
                    self.selectedFilterValueList = data.selectedFilterValueList;
                    $('#ad-filteritem-'+self.fieldNo+'-'+self.item_id).val(selectedNameStr);
                    self.changeFilter();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.dimSelectView.close();
                });
            });
        },

        changeFilter: function (e) {
            this.trigger('changeFilter',{
                filterValue: this.filterValue,
                fieldNo: this.fieldNo
            });
        },

        inputFilter: function (e) {
            this.trigger('inputFilter',{
                filterValue: this.filterValue,
                fieldNo: this.fieldNo
            });
        },

        resize: function () {

        }
    })
});
