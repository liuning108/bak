/**
 *
 */
define([
        'text!oss_core/inms/pm/meta/parammgr/templates/ParamMgr.html',
        'oss_core/inms/pm/meta/parammgr/actions/ParamMgrAction',
        'oss_core/inms/pm/util/views/Util',
        'i18n!oss_core/inms/pm/meta/parammgr/i18n/parammgr',
        'css!oss_core/inms/pm/util/css/ad-component.css',
        'css!oss_core/inms/pm/util/css/ad-block.css'
    ],
    function(mainTpl, action, pmUtil, i18nData) {
    return fish.View.extend({
        paramMgrTemplate: fish.compile(mainTpl),
        resourece: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nData),
        events: {
            'click #parammgr-reset-btn' : 'resetGrid',
            'click #parammgr-confirm-btn' : 'OkClick',
            'change #vdim-field-select' : 'fieldChange',
            'keyup #vdim-fieldname-input' : "fieldNameChange"
        },

        initialize: function (opt) {


        },

        render: function () {
            this.$el.html(this.paramMgrTemplate(this.resourece));
            return this;
        },

        afterRender: function () {
        ///  alert(portal.appGlobal.get("userId"));
           var self = this;
            action.loadParam({},function(ret){
                self.paramList = ret.paramList;
                self.$grid = this.$("#parammgr-grid").grid({
                    data: self.paramList,
                    height: 508,
                    searchbar: true,
                    colModel: [
                        {
                            name: 'PARA_ID',
                            label: 'PARA_ID',
                            key: true,
                            width: 0,
                            editable: false,
                            sortable:false
                        },
                        {
                            name: 'PARA_NAME',
                            label: self.resourece.KEY,
                            key: true,
                            width: 80,
                            editable: false,
                            search: true,
                            sortable:false,
                            formatter: function(cellval, opts, rwdat, _act) {
                                var returnStr = "";
                                if(rwdat.PARA_DESC){
                                    returnStr = '<div class="row">'
                                    + '<button title="'+rwdat.PARA_DESC+'" type="button" class="col-md-1 btn btn-link nhc-tree-btn">'
                                    + '<i class="fa fa-question-circle"></i></button>'
                                    + '<div style="margin-top: 5px">'+cellval+'</div></div>';
                                }else {
                                    returnStr = '<div>'+cellval+'</div>';
                                }
                                return returnStr;
                            }
                        },
                        {
                            name: 'PARA_VALUE',
                            label: self.resourece.VALUE,
                            width: 80,
                            editable: true,
                            search: true,
                            sortable:false,
                            edittype: "textarea",
                            editrules: "required"
                        },
                        {
                            name: '',
                            width: 20,
                            formatter: 'actions',
                            formatoptions: {
                                editbutton: true, //默认开启编辑功能
                                delbutton: false  //默认开启删除功能,此处关闭此功能
                            }
                        }
                    ],
                    afterSaveRow: function (e, rowid, data, option) {
                        $("#parammgr-confirm-btn").removeAttr("disabled");
                        $("#parammgr-confirm-btn").addClass("btn-primary");
                    }
                });
                self.$grid.grid("hideCol", 'PARA_ID');
                self.resize();
            });
        },

        OkClick: function () {
            var self = this;
            var paramList = this.$grid.jqGrid("getRowData");
            fish.confirm(self.resourece.SUBMIT_TIP+' ?').result.then(function() {
                action.saveParam({
                    "paramList": paramList
                }, function () {
                    self.resetGrid();
                    fish.toast('success', self.resourece.SUCCESS);
                });
            });
        },

        resetGrid: function () {
          var self =this;
            action.loadParam({}, function(ret){
                self.paramList = ret.paramList;
                self.$grid.jqGrid("reloadData", self.paramList);
                //self.$("#parammgr-confirm-btn").removeClass("btn-primary");
                //self.$("#parammgr-confirm-btn").attr("disabled", "disabled");
            });
        },

        resize: function () {
            this.uiContainerHeight = this.$el.parents(".portal-page-content").outerHeight();
            this.uiContainerWidth = this.$el.parents(".portal-page-content").outerWidth();
            if(!this.uiContainerHeight) {
                this.uiContainerHeight = this.$el.parents(".container_main").outerHeight();
            }
            if(this.$grid){
                this.$grid.jqGrid("setGridHeight", this.uiContainerHeight - 100);
            }
        }

    })
});
