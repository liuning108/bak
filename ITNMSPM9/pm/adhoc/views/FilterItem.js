/**
 *
 */
define([
        'text!oss_core/pm/adhoc/templates/FilterItem.html',
        "oss_core/pm/adhoc/views/AdhocUtil",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(mainTpl, adhocUtil, i18nData) {
    return portal.BaseView.extend({
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
            if(!this.meta_dim_code && this.itemList.length==0){
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).hide();
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).removeAttr("disabled");
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).off();
                this.$('#ad-filteritem-' + this.fieldNo + '-' + this.item_id).on("change", this.wrap(function (e) {
                    this.filterValue = e.currentTarget.value;
                    this.inputFilter();
                }));
            }else {
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).off();
                this.$('#ad-filteritem-condiselect-' + this.fieldNo + '-' + this.item_id).on("click", this.wrap(function () {
                    this.showCondiSelectWin();
                }));
                this.$("#ad-filteritem-" + this.fieldNo + '-' + this.item_id).empty();
                this.filterValue = '';
            }
        },

        showCondiSelectWin: function () {
            portal.require([
                'oss_core/pm/adhoc/views/DimFilterSelect'
            ], this.wrap(function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: this.fieldNo,
                    META_DIM_CODE: this.meta_dim_code,
                    DIM_NAME: this.filterLabel,
                    selectedList: this.selectedFilterValueList,
                    allItemList: this.itemList
                });
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 650,
                    height: 430
                };
                this.dimSelectView = fish.popup(option);
                dialog.contentReady();
                this.listenTo(dialog, 'okDimSelectEvent', this.wrap(function (data) {
                    this.dimSelectView.close();
                    this.filterValue = data.selectedValueStr;
                    var selectedNameStr = data.selectedNameStr;
                    this.selectedFilterValueList = data.selectedFilterValueList;
                    $('#ad-filteritem-'+this.fieldNo+'-'+this.item_id).val(selectedNameStr);
                    this.changeFilter();
                }));
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.dimSelectView.close();
                }));
            }));
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
