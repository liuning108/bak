define([
    "text!i18n/modules/onlinetranslate/templates/OnlineTranslateTemplate.html",
    "i18n/modules/onlinetranslate/views/WebDirMenuTreeView",
    "i18n/modules/onlinetranslate/views/WebTranslateDetailView",
    'i18n/modules/onlinetranslate/actions/OnlineTranslateAction',
    'i18n!i18n/modules/onlinetranslate/i18n/onlinetranslate',
    'webroot',
    "css!i18n/modules/onlinetranslate/css/onlinetranslate"
], function(OnlinetranslateTpl, WebDirMenuTreeView, WebTranslateDetailView, onlineTranslateAction, i18nData, webroot) {
    var ComponentMgrView = portal.BaseView.extend({
        tagName: "div",
        template: fish.compile(OnlinetranslateTpl),
        initialize: function() {       
            this.setViews({
                '.js-layout-left':new WebDirMenuTreeView(),
                '.js-layout-right':new WebTranslateDetailView()
            })       
            fish.on("rowChange.webOnlineTranslate", this.rowChange.bind(this));
            fish.on("exportAll.webOnlineTranslate", this.exportAll.bind(this));
            fish.on("translateAll.webOnlineTranslate", this.translateAll.bind(this));
        },
        translateAll : function(confirmMsg,successMsg){
        	var that = this,
        		$activeLi = this.$(".js-translate-tab >.ui-tabs-nav >li.ui-tabs-active > a"),
        		lang = $activeLi.text();
        	fish.confirm(confirmMsg.replace("{0}",lang),function(){
        		onlineTranslateAction.translateAll($activeLi.parent().attr("language"),function(){
            		fish.success(i18nData.SUCCESS_TO_TRANSLATE_ALL.replace("{0}",lang));
            	})
        	});
        },
        exportAll : function(confirmMsg,successMsg){
        	var that = this,
	        	$activeLi = this.$(".js-translate-tab >.ui-tabs-nav >li.ui-tabs-active > a"),
	    		lang = $activeLi.text();
        	fish.confirm(confirmMsg.replace("{0}",lang),function(){
        		onlineTranslateAction.exportAll($activeLi.parent().attr("language"),function(data){
        			if(data.success){
        				window.location.href="download?filePath="+data.filePath;
        			} else {
        				alert("导出文件失败");
        			}
            	})
        	});
        },
        render: function() {
            this.$el.html(this.template());
        },
        afterRender: function(contentHeight) {
            var that = this;
            onlineTranslateAction.qrySupportLang(function(data){
                if(data && data.languageChoose && data.languageList && data.languageList.length > 0){
                    that.languageList = data.languageList;
                    for(var i=0; i < data.languageList.length; i++){
                        var newTab = "<li language='" + data.languageList[i].key + "'><a href='" + "#tabs-detail" + "'>" + data.languageList[i].showValue + "</a></li>";
                        that.$(".js-language").append(newTab);
                    }
                    that.$(".js-translate-tab").tabs({
                        activate: function(event, ui) {
                            var language = that.$(".ui-tabs-active").attr("language");
                            that.type = language;
                            if(!that.view){
                                var view = that.requireView({
                                    url: webroot+"i18n/modules/onlinetranslate/views/WebTranslateTemplate",
                                    selector: "#tabs-detail",
                                    callback: that.renderTranslateTemplate
                                });
                                that.view = view ;
                                // $.when(view,that).done(that.renderTranslateTemplate);
                            }else{
                                fish.trigger("tabsChange.webOnlineTranslate", that.type);
                            }
                            if(language === 'en' || language=== 'zh'){
                            	that.$("#translateAllButton").prop("disabled",true);
                            } else {
                            	that.$("#translateAllButton").prop("disabled",false);
                            }
                        }.bind(that)
                    });
                }
            }.bind(that));

        },
        renderTranslateTemplate:function(){
            var that = this;
            that.$(".js-template-tabs").tabs({
                activateOnce:true,
                activate: function(event, ui) {
                    var id = ui.newPanel.attr('id');
                    switch (id) {
                    case "tabs-translated":         
                        that.requireView({
                            url: webroot+"i18n/modules/onlinetranslate/views/WebTranslatedView",
                            selector: "#tabs-translated",
                            viewOption: {type:that.type,rowData:that.rowData}
                        });
                        that.setSubHeight();       //                  
                        break;  
                    case "tabs-untranslated":   
                        that.requireView({
                            url: webroot+"i18n/modules/onlinetranslate/views/WebUnTranslatedView",
                            selector: "#tabs-untranslated",
                            viewOption: {type:that.type,rowData:that.rowData}
                        });
                        that.setSubHeight();
                        break;  
                    }           
                }
            });            
            
        },
        rowChange: function(rowData) {
            this.rowData = rowData;
        },
        resize: function(delta) {
            this.getView(".js-layout-left").subResize(delta); //子视图定义定义成subResize,由父视图控制
            if(this.$(".js-template-tabs > .ui-tabs-panel").length>0){ //当已经存在的时候,设置父容器大小;不存在的时候,在创建完成之后设置
                this.setSubHeight();
            }
        },
        setSubHeight : function(){
        	var subHeight = this.$(".js-layout-left .ui-jqgrid").height() - this.$(".js-translate-tab > .ui-tabs-nav").outerHeight() - this.$(".js-template-tabs > .ui-tabs-nav").outerHeight() - 2;
    		this.$(".js-template-tabs > .ui-tabs-panel").outerHeight(subHeight);
        },
        cleanup: function(){
            fish.off("rowChange.webOnlineTranslate");
            fish.off("exportAll.webOnlineTranslate");
            fish.off("translateAll.webOnlineTranslate");
            fish.off("tabsChange.webOnlineTranslate");
        }
    });
    return ComponentMgrView;
});
