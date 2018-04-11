define([
    'text!modules/dynamicmenu/templates/WidgetPopWin.html',
    'text!modules/dynamicmenu/templates/Widget.html',
    'i18n!modules/dynamicmenu/i18n/dynamic',
    'modules/dynamicmenu/actions/DynamicAction'
], function(compilePopWin, compileTpl, i18n,action) {
	var WidgetPopWin = portal.BaseView.extend({
		events: {
	        'click li > .panel': '_onSelect',
	        'click #designer-btn-add-widget-ok': '_onOK'
	    },
		render: function(){
			this.setElement(fish.compile(compilePopWin)(i18n));
		},
		
		afterRender:function(){
			this.$ulWidgets          = this.$("#designer-ul-widgets");
	        this.$btnAddWidOk        = this.$("#designer-btn-add-widget-ok");
	        this.selectWidgets = {};
	        this.allWidgets = [];
	        this.$ulWidgets.empty();
	        this.loadWidgetList();
		},
		
		_onSelect:function(e){
		    var $widget = $(e.currentTarget);

	        if(!$widget.hasClass("active")){
	        	$widget.addClass("active");
	        	this.selectWidgets[$widget.attr("id")] = 1;
	        }else{
	        	$widget.removeClass("active");
	        	delete this.selectWidgets[$widget.attr("id")];
	        }
	        if($("#designer-ul-widgets > li > .panel.active").size()>0){
	        	this.$btnAddWidOk.removeAttr("disabled");
	        }else{
	        	this.$btnAddWidOk.attr("disabled","disabled");
	        }
		},
		
		_onOK:function(){
			var selectWidgets = fish.filter(this.allWidgets,function(obj){
				return this.selectWidgets[obj.portletId];
			}.bind(this));
	    	this.popup.close(selectWidgets);
		},
	
		loadWidgetList:function(){
	        action.QryUserPortletListByMenuId(portal.appGlobal.get("currentMenu").menuId, function(result){
				this.loadWidgetsCallback(result);
			}.bind(this))
		},
		loadWidgetsCallback : function(result){
			this.allWidgets = result;
			var html = fish.compile(compileTpl)({list:result});
	        this.$ulWidgets.append(html).slimscroll({height:"auto"});
		}
	
	})
	return WidgetPopWin;
});