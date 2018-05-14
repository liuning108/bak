/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/ColCfg.html',
        'i18n!oss_core/pm/adhocdesigner/i18n/slamanage'
    ],
    function(RuleMgrView, i18nData) {
        return portal.CommonView.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(RuleMgrView),

            events : {
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.colList = inParam.colList;
                this.selectedDimIndiList = inParam.selectedDimIndiList;
                this.showColList = inParam.showColList;
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
                /*
                <tr>
                <td>城市</td>
                <td><label class="checkbox-inline"><input type="checkbox"></label></td>
                <td></td>
                </tr>
                <tr>
                <td>年末总人口</td>
                <td><label class="checkbox-inline"><input type="checkbox"></label></td>
                <td><label class="checkbox-inline"><input type="checkbox"></label></td>
                </tr>
                */
                this.$('#ad-colcfg-container').empty();
                for(var i=0; i<this.colList.length; i++){
                    var col = this.colList[i];
                    var isChecked = false;
                    for(var j=0; j<this.showColList.length; j++){
                        var showColId = this.showColList[j];
                        if(col.name == showColId){
                            isChecked = true;
                            break;
                        }
                    }
                    var htmlText = "";
                    if(col.name.indexOf('DIM_')!=-1) {
                        htmlText = '<tr><td>'+col.label+'</td><td><label class="checkbox-inline">'
                            + '<input '+(isChecked?'checked':'')+' type="checkbox" name="displayChk" id="ad-display-'+col.index+'"></label></td><td></td> </tr>';
                    }else{
                        htmlText = '<tr><td>'+col.label+'</td><td><label class="checkbox-inline"><input '+(isChecked?'checked':'')+' type="checkbox" name="displayChk" id="ad-display-'+col.index+'"></label></td>'
                            + '<td><label class="checkbox-inline"><input type="checkbox" name="drillChk" id="ad-drill-'+col.index+'"></label></td></tr>';
                    }
                    this.$('#ad-colcfg-container').append(htmlText);
                }
                this.$('#ad-colcfg-table').css('height', 23+this.colList.length*34);
            },

            fnOK: function() {
                var checkboxList = this.$(':checkbox');
                var displayColList = [];
                for(var i=0; i<checkboxList.length; i++) {
                    var checkboxObject = checkboxList[i]
                    if(checkboxObject.checked && checkboxObject.name=='displayChk'){
                        displayColList[displayColList.length] = checkboxObject.id.substring(11);
                    }
                }
                this.trigger("okEvent", {
                    displayColList: displayColList
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    });