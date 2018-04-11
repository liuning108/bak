define([
	"text!modules/portletmgr/templates/PortletMenuCustomTemplate.html",
//	"text!modules/widgetmgr/templates/WidgetCusGridBtns.html",
	"modules/portletmgr/actions/PortletMgrAction",
	"i18n!modules/portletmgr/i18n/portletmgr",
	'webroot'
],function(widgetCusTpl, widgetMgrAction, i18nWidget, webroot){
	return portal.BaseView.extend({
		//className: "container_right panel panel-default",

		template: fish.compile(widgetCusTpl),

		render: function() {
			this.$el.html(this.template(i18nWidget));	
		},

		afterRender: function() { //dom加载完成的事件			
			this.$cusTree = this.$(".js-menu-custom").grid({
				colModel:[{
					name: 'gridIndex',
					key: true,
					hidden: true
				}, {
					name: 'privName',
					label: i18nWidget.PORTAL_NAME,
					sortable: false,
					search: true
				},{
					name: 'url',
					label: i18nWidget.PORTAL_URL,
					sortable: false,
					search: true
				}],
				treeGrid: true,
				/*treeIcons: {
				    plus: 'glyphicon glyphicon-folder-close',
                    minus: 'glyphicon glyphicon-folder-open',
                    leaf: 'glyphicon glyphicon-file'
				},*/
				expandColumn: "privName",
				pagebar:true,
//				toolbar: [true, 'bottom'],
				onChangeRow: function(){
					var rowdata = this.$cusTree.grid('getSelection');
					if(rowdata.parent == null || !rowdata.isLeaf){
						this.btnMenuSelector.prop("disabled",false);
					}
					else
					{
						this.btnMenuSelector.prop("disabled",true);
					}
				}.bind(this)
			});
			
			this.$cusTree.grid("navButtonAdd",{
                caption: i18nWidget.PORTLET_BIND_PRIVATE,
                cssprop: "js-bind-portlets",
                onClick : this.bindPortlets.bind(this)
            });
			this.btnMenuSelector = this.$(".js-bind-portlets");
			
			this.loadData();
		},
		loadData: function(){
			widgetMgrAction.queryMenu(function(result){
				if(result && result.length > 0){
					for(var index=0; index<result.length; index++){
						result[index].gridIndex = "menu"+result[index].portletId + "portlet" + result[index].privId;
						if(!result[index].hasOwnProperty("children")){
							result[index].children = new Array();
						}
					}
					widgetMgrAction.queryAllPortalBindProtles(function(data){
						if(data && data.length > 0){
							for(var i=0; i<data.length; i++){
								for(var j=0; j<result.length; j++){									
									if(data[i].menuId == result[j].privId){										
											result[j].children.push(data[i]);
									}
								}
								data[i].gridIndex = "menu"+data[i].portletId + "portlet" +data[i].menuId;
								data[i].privName = data[i].portletName;
							}
						}
						this.treeResult = result;
						this.$cusTree.grid("reloadData", result);
						if (result && result.length > 0) {
							this.$cusTree.grid("setSelection", result[0]);
							var rd = this.$cusTree.grid("getSelection");
							// if(rd.isLeaf!= undefined && !rd.isLeaf)
							//     this.$cusTree.grid("expandNode", rd);
						}
					}.bind(this));
				}
				
			}.bind(this));
		},
		bindPortlets: function() {
			var that = this;
			var rd = that.$cusTree.grid("getSelection");
			var initData = null;
			if (that.treeResult.length > 0){
				for(var i=0;i<that.treeResult.length;i++){
					if(that.treeResult[i].privName == rd.privName){
						initData = that.treeResult[i];
					}
				}						
				initData = initData == null? rd : initData;
				fish.popupView({
	            	url:'modules/portletmgr/views/grant/MenuBindPortlets',
	            	viewOption: initData,
	            	close: function(msg) {
						//不全量刷新，只更新选中跟节点下的数据。
						for(var i=0;i<that.treeResult.length;i++){
							if(that.treeResult[i].privName == rd.privName){
								if(msg && msg.length > 0){
									for(var j=0; j<msg.length; j++){
										msg[j].parent = initData.gridIndex;
									}
								}								
								that.treeResult[i].children = msg;
								var parent = that.$cusTree.grid("getSelection");
								var childrenNode = that.$cusTree.grid("getNodeChildren",parent);
								for(var index in childrenNode){
									that.$cusTree.grid("delTreeNode",childrenNode[index]);
								}
								that.$cusTree.grid("addChildNodes", msg, parent);
							    that.$cusTree.grid("expandNode", parent);
							    // this.$cusTree.grid("setSelection", msg.GIRD_INDEX);
							}
						}
						fish.success(i18nWidget.HINT_BIND_PORTLET_TO_PORTAL_SUCCESS);
					}        	
	            });	
            }
		},
		resize: function(delta) {
        	portal.utils.gridIncHeight(this.$(".js-menu-custom"), $(".portlet-left").height() - $(".portlet-right").height());
        	
        }
	});
});
