/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/ColCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "change #ad-colcfg-top-btn" : "topCheck",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.colList = inParam.colList;
                this.selectedDimIndiList = inParam.selectedDimIndiList;
                //
                this.gridTop = inParam.gridTop;
                this.sortCol = inParam.sortCol;
                this.sortType = inParam.sortType;
                this.showColList = inParam.showColList;
                if(typeof(inParam.selectableColList) == 'string'){
                    this.selectableColList = inParam.selectableColList.split(",");
                }else{
                    this.selectableColList = inParam.selectableColList;//.split(",");
                }
                if(typeof(inParam.drillColList) == 'string'){
                    this.drillColList = inParam.drillColList.split(",");
                }else{
                    this.drillColList = inParam.drillColList;//.split(",");
                }
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            /**
             * name: "DIM_"+i,
             label: item.name,
             index: "DIM_"+i,
             width: "30%",
             sortable:false
             */
            contentReady: function() {
                this.$('#ad-colcfg-container').empty();
                for(var i=0; i<this.colList.length; i++){
                    var col = this.colList[i];
                    var isDisplay = false;
                    var isSelectable = false;
                    var isDrill = false;
                    var isSort = false;
                    for(var j=0; j<this.showColList.length; j++){
                        var colId = this.showColList[j];
                        if(col.name == colId){
                            isDisplay = true;
                            break;
                        }
                    }
                    for(var j=0; j<this.selectableColList.length; j++){
                        var colId = this.selectableColList[j];
                        if(col.name == colId){
                            isSelectable = true;
                            break;
                        }
                    }
                    for(var j=0; j<this.drillColList.length; j++){
                        var colId = this.drillColList[j];
                        if(col.name == colId){
                            isDrill = true;
                            break;
                        }
                    }
                    var htmlText = "";
                    if(col.name.indexOf('DIM_')!=-1) {// 维度
                        htmlText = '<tr><td>'+col.label+'</td><td><label class="checkbox-inline">'
                            + '<input '+(isDisplay?'checked':'')+' type="checkbox" name="displayChk" id="ad-display-'+col.index+'"></label></td><td><label class="checkbox-inline">'
                        + '<input '+(isSelectable?'checked':'')+' type="checkbox" name="selectableChk" id="ad-selectable-'+col.index+'"></label></td><td></td>'
                        + '<td><select id="ad-colcfg-sortselect-'+col.index+'" name="ad-colcfg-sortselect" class="form-control" style="width: 75px">'
                        + '<option value="" selected="selected"></option>'
                        + '<option value="asc">'+this.resource.ASC+'</option>'
                        + '<option value="desc">'+this.resource.DESC+'</option></select></td></tr>';
                    }else{
                        htmlText = '<tr><td>'+col.label+'</td><td><label class="checkbox-inline"><input '+(isDisplay?'checked':'')+' type="checkbox" name="displayChk" id="ad-display-'+col.index+'"></label></td>'
                            + '<td><label class="checkbox-inline">'
                        + '<input '+(isSelectable?'checked':'')+' type="checkbox" name="selectableChk" id="ad-selectable-'+col.index+'"></label></td><td><label class="checkbox-inline">'
                        + '<input '+(isDrill?'checked':'')+' type="checkbox" name="drillChk" id="ad-drill-'+col.index+'"></label></td><td>'
                        + '<select id="ad-colcfg-sortselect-'+col.index+'" name="ad-colcfg-sortselect" class="form-control" style="width: 75px">'
                        + '<option value="" selected="selected"></option>'
                        + '<option value="asc">'+this.resource.ASC+'</option>'
                        + '<option value="desc">'+this.resource.DESC+'</option></select></td></tr>';
                    }
                    this.$('#ad-colcfg-container').append(htmlText);
                }
                this.$('#ad-colcfg-table').css('height', 23+this.colList.length*34);
                this.$("[name='ad-colcfg-sortselect']").off();
                this.$("[name='ad-colcfg-sortselect']").on("change", this.wrap(function(e){
                    this.sortSelectChange(e.currentTarget.id);
                }));
                //
                if(this.gridTop!=''){
                    var topChkBtn = this.$('#ad-colcfg-top-btn')[0];
                    topChkBtn.checked = true;
                    this.$('#ad-colcfg-top-input').val(this.gridTop);
                    this.topCheck();
                }
                if(this.sortType && this.sortType!="" && this.sortCol && this.sortCol!=""){
                    var sortTypeList = this.sortType.split(",");
                    var sortColLsit = this.sortCol.split(",");
                    for(var i=0;i<sortTypeList.length;i++){
                        var sortType = sortTypeList[i];
                        var sortCol = sortColLsit[i];
                        this.$('#ad-colcfg-sortselect-'+sortCol).val(sortType);
                    }
                }
            },

            topCheck: function() {
                var topChkBtn = this.$('#ad-colcfg-top-btn')[0];
                if(topChkBtn.checked){
                    this.$('[id*="ad-colcfg-sortselect-DIM"]').hide();
                    this.$('[id*="ad-colcfg-sortselect-DIM"]').val("");
                    this.$('[id*="ad-colcfg-sortselect-DIM"]').removeAttr("checked");
                    this.$('#ad-colcfg-top-input').attr("disabled",false);
                }else{
                    this.$('[id*="ad-colcfg-sortselect-DIM"]').show();
                    this.$('#ad-colcfg-top-input').attr("disabled",true);
                }
            },

            sortSelectChange: function(id) {
                var selectVal = this.$('#'+id).val();
                if(selectVal!=""){
                    //this.$("[name='ad-colcfg-sortselect']").val("");
                    this.$('#'+id).val(selectVal);
                    //this.sortCol = id.substring(21);
                    //this.sortType = selectVal;
                }
            },

            fnOK: function() {
                //
                var gridTop = "";
                var topChkBtn = this.$('#ad-colcfg-top-btn')[0];
                if(topChkBtn.checked) {
                    gridTop = this.$('#ad-colcfg-top-input').val();
                }
                //
                var sortColList = [];
                var sortTypeList = [];
                for(var i=0; i<this.$("[name='ad-colcfg-sortselect']").length; i++){
                    var selectObj = this.$("[name='ad-colcfg-sortselect']")[i];
                    var sortType = selectObj.value;
                    if(sortType!=""){
                        sortTypeList[sortTypeList.length] = sortType;
                        sortColList[sortColList.length] = selectObj.id.substring(21);
                    }
                };
                //
                var checkboxList = this.$(':checkbox');
                var displayColList = [];
                var selectableColList = [];
                var drillColList = [];
                for(var i=0; i<checkboxList.length; i++) {
                    var checkboxObject = checkboxList[i]
                    if(checkboxObject.checked){
                        if(checkboxObject.name=='displayChk') {
                            displayColList[displayColList.length] = checkboxObject.id.substring(11);
                        }
                        if(checkboxObject.name=='selectableChk') {
                            selectableColList[selectableColList.length] = checkboxObject.id.substring(14);
                        }
                        if(checkboxObject.name=='drillChk'){
                            drillColList[drillColList.length] = checkboxObject.id.substring(9);
                        }
                    }
                }
                //
                this.trigger("okEvent", {
                    gridTop: gridTop,
                    sortCol: sortColList.join(),
                    sortType: sortTypeList.join(),
                    displayColList: displayColList,
                    selectableColList: selectableColList,
                    drillColList: drillColList
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    }
);