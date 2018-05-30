define([
    "text!i18n/modules/onlinetranslate/templates/OnlineTranslateTemplate.html",
    "i18n/modules/onlinetranslate/views/DirMenuTreeView",
    "i18n/modules/onlinetranslate/views/TranslateDetailView",
	'i18n/modules/onlinetranslate/actions/OnlineTranslateAction',
    'webroot',
    "css!i18n/modules/onlinetranslate/css/onlinetranslate"
], function(OnlinetranslateTpl, DirMenuTree, TranslateDetailView, onlineTranslateAction, webroot) {
    var ComponentMgrView = portal.BaseView.extend({
        tagName: "div",
        template: fish.compile(OnlinetranslateTpl),
        initialize: function() {     
            this.setViews({
                '.js-layout-left':new DirMenuTree(),
                '.js-layout-right':new TranslateDetailView()
            })       
			fish.on("rowChange.onlineTranslate", this.rowChange.bind(this));
        },
        rowChange: function(rowData) {
        	this.rowData = rowData;
        },
        render: function() {
            this.$el.html(this.template());
        },
        
        afterRender: function() {
            // this.getView(".col-lg-3").afterRender();
            var that = this;
            onlineTranslateAction.qrySupportLang(function(data){
            	if(data && data.languageChoose && data.languageList && data.languageList.length > 0){
                    that.languageList = data.languageList;
                    for(var i=0; i < data.languageList.length; i++){
                        var newTab = "<li language='" + data.languageList[i].key + "'><a href='#tabs-detail'>" + data.languageList[i].showValue + "</a></li>";
                        that.$(".js-language").append(newTab);
                    }
                }				
				that.$(".js-translate-tab").tabs({
					activate: function(event, ui) {
						var language = that.$(".ui-tabs-active").attr("language");
						that.type = language;
						if(!that.view){
                            var view = that.requireView({
                                url: webroot+"i18n/modules/onlinetranslate/views/TranslateTemplate",
                                selector: "#tabs-detail",
                                callback: that.renderTranslateTemplate
                            });
							that.view = view ;
							// $.when(view,that).done(that.renderTranslateTemplate);
						}else{
							fish.trigger("tabsChange.onlineTranslate", that.type);
						}
					}.bind(that)
				});
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
                            url: webroot+"i18n/modules/onlinetranslate/views/TranslatedView",
                            selector: "#tabs-translated",
                            viewOption: {type:that.type,rowData:that.rowData}
                        });
                        that.setSubHeight();
						break;	
					case "tabs-untranslated":	
                        that.requireView({
                            url: webroot+"i18n/modules/onlinetranslate/views/UnTranslatedView",
                            selector: "#tabs-untranslated",
                            viewOption: {type:that.type,rowData:that.rowData}
                        });
                        that.setSubHeight();
						break;	
					}			
				}
			});
        },
        resize: function(delta) {
            this.getView(".js-layout-left").subResize(delta);
        	if(this.$(".js-template-tabs > .ui-tabs-panel").length>0){ //当已经存在的时候,设置父容器大小;不存在的时候,在创建完成之后设置
            	this.setSubHeight();
        	}
        },
        setSubHeight : function(){
        	var subHeight = this.$(".js-layout-left .ui-jqgrid").height() - this.$(".js-translate-tab > .ui-tabs-nav").outerHeight() - this.$(".js-template-tabs > .ui-tabs-nav").outerHeight() - 2;
    		this.$(".js-template-tabs > .ui-tabs-panel").outerHeight(subHeight);
        },
        cleanup: function(){
            fish.off("rowChange.onlineTranslate");            
            fish.off("tabsChange.onlineTranslate");
        }
    });
    return ComponentMgrView;
});
