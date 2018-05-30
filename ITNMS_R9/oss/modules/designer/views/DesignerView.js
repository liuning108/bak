define([
    'modules/dynamicmenu/views/DynamicView',
    "modules/common/actions/CommonAction",
    'text!modules/designer/templates/Designer.html',
    'i18n!modules/designer/i18n/designer',
    'modules/designer/actions/DesignerAction',
    'modules/workspace/actions/WorkspaceAction',
], function(DynamicView,CommonAction, compileTpl, i18nDesigner, designerAction,WorkspaceAction) {
	return DynamicView.extend({

		events: {
			"click .btn-config": "openConfig",
			
			"click #designer-a-new": "newTemplate",
			"click #designer-a-open": "openTemplatePopWin",
			"click #designer-btn-template": "openTemplatePopWin",
			"click #designer-btn-new-ok": "createTemplate",
			
			"click #designer-btn-add-widget":"openWidgetPopWin",
			"click #designer-btn-save":"saveTemplate",

			"keyup #designer-ipt-template-name":"_keyUp",
			"blur #designer-ipt-template-name":"_blur"
		},
		
		render: function(){
			this.setElement(fish.compile(compileTpl)(i18nDesigner));
		},
		
		afterRender:function(){
		    this.$iptTemplateName    = this.$("#designer-ipt-template-name");
		    this.$iptTempTemplateId  = this.$("#designer-ipt-template-id");
			this.$btnNew  			 = this.$("#designer-a-new");
			this.$btnNew  			 = this.$("#designer-a-new");
		    this.$btnOk              = this.$("#designer-btn-new-ok");
		    this.$btnSave            = this.$("#designer-btn-save");
		    this.$btnSaveCaret       = this.$("#designer-btn-save-caret");
		    this.$btnAdd             = this.$("#designer-btn-add-widget");
			
			this.gridstack = this.$('.grid-stack').gridStack();
			this.$(".designer-header").draggable();

			this.designerInit();
			this.loadDeafultTemplate();
		},
		
		//--第一个布局是系统的,只能另存为 ; isDefault,表示在工作台展示 ; 打开窗口的时候回填layoutId
		saveTemplate:function(){
			this.saveAsTpl = false;
			var options = {
				title: $.trim(this.$iptTemplateName.val()),
	            widgets: JSON.stringify(this.gridstack.getWidgetsData()),
	            portalId: portal.appGlobal.get("portalId")
	        };
			if (this.currentTemplate) {
				options.layoutId = this.currentTemplate.id;
				if (this.currentTemplate.isPublic) {
					CommonAction.isAdmin(function(status) {
						if (status == true) {
							designerAction.ModUserLayout(options, function(status) {
								fish.info(i18nDesigner.DESIGNER_EDIT_LAYOUT_SUCCESS);
							}.bind(this));
						} else {
							this.saveAsTpl = true;
							this.saveAsTemplate();
						}
					}.bind(this));
				} else {
					designerAction.ModUserLayout(options, function(status) {
						fish.info(i18nDesigner.DESIGNER_EDIT_LAYOUT_SUCCESS);
					}.bind(this));
				}
			}else{
				designerAction.AddUserLayout(options,function(status){
					fish.info(i18nDesigner.DESIGNER_ADD_LAYOUT_SUCCESS);
					this.$("#designer-btn-save").prop("disabled",true);
					this.$("#designer-btn-add-widget").prop("disabled",true);
				}.bind(this));
			}
		},
		
		saveAsTemplate:function(){
	        this.currentTemplate = null;
			this.$iptTemplateName.attr('disabled',false);
	        this.$btnSave.attr('disabled',true);
	        this.$btnSaveCaret.attr('disabled',true);
            this.$btnAdd.attr('disabled',true);
	        this.$iptTemplateName.focus();
			//弹窗提示修改布局名，并保存
			fish.info(i18nDesigner.DESINER_SAVE_AS_TEMPLATE);
		},

		newTemplate:function(){
			this.designerInit();
			this.$iptTemplateName.attr('disabled',false);
			this.$iptTemplateName.focus();
		},
		createTemplate:function(){
			this.setBtnState("edit");
		},
		setBtnState:function(state){
			if("init" === state){
	            this.$iptTemplateName.attr('disabled',true);
	            this.$btnAdd.attr('disabled',true);
	            this.$btnSave.attr('disabled',true);
	            this.$btnSaveCaret.attr('disabled',true);
	        }
	        if("edit" === state){
	        	this.$iptTemplateName.attr('disabled',true);
	        	this.$btnSave.attr('disabled',false);
	        	this.$btnSaveCaret.attr('disabled',false);
	        	this.$btnAdd.attr('disabled',false);
	        	this.$btnOk.addClass("hide");
	        }
		},
		
		openWidgetPopWin:function(){
			var that = this;
			fish.popupView({
				url:'modules/designer/views/WidgetPopWin',
				close:function($selWid){
		            // var gridsArray = that.gridstack.getSelectedGrids($selWid);
		            that.gridstack.loadGrid(that.gridstack.getSelectedGrids($selWid));
				}
			})
		},
		
		openTemplatePopWin:function(){
			var that = this;
			this.$iptTemplateName.val("");
			this.$btnOk.addClass("hide");
        	this.$btnNew.parent().removeClass("hide");
			fish.popupView({
				url:'modules/designer/views/TemplatePopWin',
				close:function(template){
					that.loadDesignerTemplate(template);
				}
			})
		},
		
		loadDesignerTemplate : function(template){
			var ts = this;
			this.$iptTemplateName.val(template.name);
			this.$iptTempTemplateId.val(template.id);

            this.gridstack.clearGrid();
            this.gridstack.loadGrid(JSON.parse(template.widgets));

            this.setBtnState("edit");
            this.currentTemplate = template;
		},
		
		designerInit:function(){
			this.setBtnState("init");
	        this.$iptTemplateName.val("");
	        this.$iptTempTemplateId.val("");

	        this.gridstack.clearGrid();
	        this.currentTemplate = null;
		},

		loadDeafultTemplate : function(){
			WorkspaceAction.QryUserLayout(portal.appGlobal.get("portalId"), function (result) {
	            var template = {
	    			id : result.layoutId,
	    			name : result.title,
	    			isPublic: result.isPublic,
	    			widgets: result.widgets
		    	}
		        this.loadDesignerTemplate(template)
            }.bind(this));
		},

		_keyUp: function(){
			if (this.saveAsTpl){
				this.$btnSave.attr('disabled',false);
			}
			if ($.trim(this.$iptTemplateName.val()) === "") {
				this.$iptTemplateName.val("");
            }
            if (this.$btnOk.hasClass("hide")) {
            	this.$btnOk.removeClass("hide");
            	this.$btnNew.parent().addClass("hide");
            }
            if (event.keyCode === 13) {
            	this.$btnOk.click();
            }
		},
		
		_blur: function(){
			if($.trim(this.$iptTemplateName.val()) === ""){
            	this.$btnOk.addClass("hide");
            	this.$btnNew.parent().removeClass("hide");
            }
		}
	})
});