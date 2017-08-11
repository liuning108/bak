/**
 *
 */
define([
        'text!oss_core/pm/adhoc/templates/FilterItem.html'
    ],
    function(mainTpl) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {
            "click #ad-condifmtitem-plus" : "addCondifmtItem",
            "click #ad-condifmtitem-minus" : "delCondifmtItem"
        },

        initialize: function (opt) {
            this.item_id = "";
            this.filterLabel = opt.filterLabel;
            this.itemList = opt.itemList;
            this.fieldNo = opt.fieldNo;
            this.selectedFilterValueList = [];
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({fieldNo: this.fieldNo,filterLabel: this.filterLabel})));
            return this;
        },

        afterRender: function () {
            //
            this.$('#ad-filteritem-condiselect-'+this.fieldNo).off();
            this.$('#ad-filteritem-condiselect-'+this.fieldNo).on("click", this.wrap(function(){
                this.showCondiSelectWin();
            }));
            this.$("#ad-filteritem-"+this.fieldNo).empty();
            this.filterValue = '';
        },

        showCondiSelectWin: function () {
            portal.require([
                'oss_core/pm/adhoc/views/DimFilterSelect'
            ], this.wrap(function (Dialog) {
                var dialog = new Dialog({
                    DIM_CODE: this.fieldNo,
                    META_DIM_CODE: "",
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
                    $('#ad-filteritem-'+this.fieldNo).val(selectedNameStr);
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

        resize: function () {

        }
    })
});
