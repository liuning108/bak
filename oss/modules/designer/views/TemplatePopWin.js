define([
	'text!modules/designer/templates/TemplatePopWin.html',
    'text!modules/designer/templates/Template.html',
    'i18n!modules/designer/i18n/designer',
    'modules/designer/actions/DesignerAction'
], function(compilePopWin,compileTpl, i18nDesigner,designerAction) {
	var TemplatePopWin = portal.BaseView.extend({
		events: {
	      'click #designer-ul-templates li > .panel': '_onSelect',
	      'click #designer-btn-open-ok': '_onOK',
	      'click #designer-btn-delete': '_onDelete',
	      'click #designer-btn-workspace': '_setAsWorkspace'
	    },

		render: function(){
			this.setElement(fish.compile(compilePopWin)(i18nDesigner));
		},

		afterRender:function(){
			this.$ulTemplates        = this.$("#designer-ul-templates");
			this.$btnDel             = this.$("#designer-btn-delete");
			this.$btnOpenOk          = this.$("#designer-btn-open-ok");
			this.$btnWorkspace       = this.$("#designer-btn-workspace");
			this.loadTemplateList();
		},

		loadTemplateList:function() {
			var that = this;
	        that.$ulTemplates.empty();
	        designerAction.QryUserLayoutList(portal.appGlobal.get("portalId"), function(userAllLayout) {
				that.layouts = userAllLayout;
				var html = fish.compile(compileTpl)({list:userAllLayout});
    	        that.$ulTemplates.append(html).slimscroll({height:"auto"});
			});
	        that.$btnDel.attr("disabled","disabled");
	        that.$btnOpenOk.attr("disabled","disabled");
	        that.$btnWorkspace.attr("disabled","disabled");
		},

	    _onSelect: function(e) {
		    var $template = $(e.currentTarget);
		    if (!$template.hasClass("active")) {
		    	$template.addClass("active")
		    	$template.parent("li").siblings().children(".panel").removeClass("active");
		    	if($template.attr("removeable") === 'Y'){
		    		this.$btnDel.removeAttr("disabled");
		    	}else{
		    		this.$btnDel.attr("disabled","disabled");
		    	}
		    	if($template.attr("default") === 'Y'){
		    		this.$btnWorkspace.attr("disabled","disabled");
		    		this.$btnDel.attr("disabled","disabled");
		    	}else{
			    	this.$btnWorkspace.removeAttr("disabled");
		    	}
		    	this.$btnOpenOk.removeAttr("disabled");
	    	} else {
	    		$template.removeClass("active");
	    		this.$btnDel.attr("disabled","disabled");
	    		this.$btnOpenOk.attr("disabled","disabled");
	    		this.$btnWorkspace.attr("disabled","disabled");
	    	}
	    },

	    _onOK: function() {
	    	var $divSelectedPanel = $("#designer-ul-templates > li > .panel.active");
	    	var id = $divSelectedPanel.attr("id");
	    	var name = $divSelectedPanel.attr("title");
	    	currentTemplate = {
    			id : id,
    			name : name,
    			isPublic: $divSelectedPanel.attr("removeable") === 'Y' ? false : true,
    			widgets: fish.filter(this.layouts, function(layout){ return layout.layoutId == id; })[0].widgets
	    	};
	    	this.popup.close(currentTemplate);
	    },

	    _onDelete: function(){
	    	var that = this;
	    	var $divSelectedPanel = $("#designer-ul-templates > li > .panel.active");
	        var id = $divSelectedPanel.attr("id");
	        var title = $divSelectedPanel.attr("title");
	        fish.confirm('Sure you want to delete template: '+title+'?',function(){
	        	designerAction.DelUserLayout(id,function(){
	        		$divSelectedPanel.remove();
	                that.$btnDel.attr("disabled","disabled");
	                that.$btnOpenOk.attr("disabled","disabled");
	                that.$btnWorkspace.attr("disabled","disabled");
					fish.info("del layout success!");
				});
	        });
		},

		_setAsWorkspace : function(){
			var that = this;
	    	var $divSelectedPanel = $("#designer-ul-templates > li > .panel.active");
	        var id = $divSelectedPanel.attr("id");
	        var title = $divSelectedPanel.attr("title");
	        designerAction.SetUserLayoutDefault(id,portal.appGlobal.get("portalId"),function(){
        		fish.info(fish.compile(i18nDesigner.DESIGNER_SET_TO_WORKSPACE_SUCCESS)({
        			TITLE: title
        		}));
        		that.$btnDel.attr("disabled","disabled");
	            that.$btnWorkspace.attr("disabled","disabled");
	            $divSelectedPanel.parent("li").siblings().children(".panel").attr("default",'N');
	            $divSelectedPanel.attr("default",'Y');
			});
		}
	})
	return TemplatePopWin;
});