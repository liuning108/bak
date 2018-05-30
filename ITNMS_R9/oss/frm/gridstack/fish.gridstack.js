define([
    'hbs!frm/gridstack/fish.gridstack.hbs',
    'i18n!frm/gridstack/gridstack',
    'frm/gridstack/gridstack',
    'css!frm/gridstack/gridstack',
    'css!frm/gridstack/fish.gridstack'
], function (template, i18n) {

	var gridStack = function (context, opt) {
		this.$element = context;
		this.viewInstance = {}; //  存放所有grid中的视图实例
		this.callback = {
			'down': 'togglePanelDown',
			'up': 'togglePanelUp',
			'maximize': 'scalePanelMaximize',
			'restore': 'scalePanelRestore',
			'setting': 'settingPanel',
			'refresh': 'refreshPanel',
			'delete': 'removePanel'
		}
		this.options = $.extend({}, {cellHeight: 15}, opt);
        this.gridstack = context.gridstack(this.options).data('gridstack');
        if(opt && opt.disableDrag){
            //如果设置了disableDrag为true,则认定为非编辑模式,不绑定删除事件
        } else {
            $(this.$element).on('click','.js-trash', function (e) {
                var el = this.getDom(e.target).gridDom[0];
                this.gridstack.removeWidget(el);
            }.bind(this));
            $(this.$element).on('gsresizestop', function(e, ui) {
                this.refreshWidget(this.getDom(ui).panelDom);
                $(ui).data('gsOldHeight', parseInt($(ui).attr('data-gs-height')));
            }.bind(this));
        }
        for (var key in this.callback) {
        	(function (key) {
                var method = this.callback[key];
        		$(this.$element).on('click','.js-' + key, function (e) {
                    this[method].call(this, e);
                }.bind(this));
        	}.bind(this))(key);
        }
	}

	gridStack.prototype = {

		getDom: function (dom) {
			return {
				gridDom: $(dom).parents('.grid-stack-item'),
				panelDom: $(dom).find('.panel').length > 0 ? $(dom).find('.panel-body')
														   : $(dom).parents('.panel').find('.panel-body')
			}
		},

        refreshPanel: function (e) {
            var $dom = this.getDom(e.target).panelDom,
                view = this.viewInstance[$dom[0].id];

            $dom.blockUI({
                message: '',
                template: '<div class="load-effect">'
                         +'<span></span>'
                         +'<span></span>'
                         +'<span></span>'
                         +'<span></span>'
                         +'<span></span>'
                         +'<span></span>'
                         +'<span></span>'
                         +'</div>'
            });
            setTimeout(function () {
                if ($.isFunction(view.refreshFunc) && view.refreshFunc.call(view) === false) {
                    $dom.unblockUI();
                    return;
                }
                view.remove();
                $dom.prepend(view.render().$el);
                this.refreshWidget($dom);
                $dom.unblockUI();
            }.bind(this), 0);
        },

		removePanel: function (e) {
			var domId = this.getDom(e.target).panelDom[0].id;
				view = this.viewInstance[domId],
        		el = this.getDom(e.target).gridDom[0];
            
            if ($.isFunction(view.removeFunc) && view.removeFunc.call(view) === false) {
            	return;
            }
            view.remove();
            delete this.viewInstance[domId];
            this.gridstack.removeWidget(el);
		},

        scalePanelMaximize : function(e){
            this.scalePanel(e, 'maximize');
        },
        scalePanelRestore : function(e){
            this.scalePanel(e, 'restore');
        },

		scalePanel: function (e, op) {
			var dom = this.getDom(e.target).gridDom,
				$panelBody = this.getDom(e.target).panelDom,
				view = this.viewInstance[$panelBody[0].id];
        	
        	if ($.isFunction(view.scaleFunc) && view.scaleFunc.call(view, op) === false) {
            	return;
            }

        	if (op === "maximize") {
        		$(e.target).hide().next().show();
        		dom.addClass('maximize');
        	} else if (op === "restore") {
        		$(e.target).hide().prev().show();
        		dom.removeClass('maximize');
        	}
        	this.refreshWidget($panelBody);
		},

        settingPanel: function (e) {
            var dom = this.getDom(e.target).gridDom,
                view = this.viewInstance[this.getDom(e.target).panelDom[0].id];
            $.isFunction(view.settingFunc) && view.settingFunc.call(view);
        },

        togglePanelDown : function(e){
            this.togglePanel(e, 'down');
        },
        togglePanelUp : function(e){
            this.togglePanel(e, 'up');
        },

		togglePanel: function (e, op) {
			var el = this.getDom(e.target).gridDom[0], len,
				$panelBody = this.getDom(e.target).panelDom,
				view = this.viewInstance[$panelBody[0].id],
                headHeight = $panelBody.parent().prev().outerHeight(),
                cellHeight = this.options.cellHeight;

            len = headHeight <= cellHeight ? 1 : (headHeight % cellHeight === 0 ? headHeight / cellHeight : parseInt(headHeight / cellHeight) + 1);

			if ($.isFunction(view.toggleFunc) && view.toggleFunc.call(view, op) === false) {
            	return;
            }

			if (!$(el).data('gsOldHeight')) {
				$(el).data('gsOldHeight', $(el).data('gsHeight'));
			}

			if (op === 'up') {
				$panelBody.slideUp(200, function () {
                    $(e.target).hide().prev().show();
                    this.gridstack.resize(el, null, len);
                }.bind(this));
			} else if (op === 'down') {
				this.gridstack.resize(el, null, $(el).data('gsOldHeight'));
				$panelBody.slideDown(200, function () {
                    $(e.target).hide().next().show();
                    this.refreshWidget($panelBody);
                }.bind(this));
			}
		},

        /**
         * 将选择的widget,包含数据库的widget,加载到当前环境中
         */
		loadGrid: function (widgets) {
            var ts = this;
            if (!!widgets) {
                fish.each(widgets, function (widget, index) {
                	 if(!widget.url){
                        if(fish.portletPriv){
                            widget.url = 'modules/portlets/unavailable/views/Unavailable';
                        } else {
                            return ;
                        }
                     } 

                     var def = $.Deferred(); 
                     portal.appEvent.once("plugin_portlet_ready",def);

                	 var widgetOption = [];
                     widget.cover = !ts.options.disableDrag;
                     widgetOption.push(template(fish.extend({}, i18n, widget)));
                     widgetOption.push(widget.x);
                     widgetOption.push(widget.y);
                     widgetOption.push(widget.width);
                     widgetOption.push(widget.height);
                     ts.gridstack.addWidget.apply(ts.gridstack, widgetOption);

                     var $dom = $("#" + widget.domId, ts.$element);
                     require([widget.url], function(PortletView) {
                         // widget
                         if(portal.appGlobal.get("currentMenu")){
                            widget.menuId = portal.appGlobal.get("currentMenu").menuId;
                         }
                         widget.el = $dom.children('.portlet-view');
                         widget.userParams = ts.options.userParams;
                         widget.editMode = ts.options.disableDrag ? false : true;

                         var portletView = new PortletView(widget);
                         ts.viewInstance[widget.domId] = portletView;
                         portletView.header = ts.titleRender(portletView.titleLine,$dom);
                         portletView.contentHeight = $dom.parent().height() - $dom.prev().outerHeight() - $dom.innerHeight();
                         portletView.contentWidth = $dom.width();
                         portletView.changePortletTitle = function (newtitle) {
                            this.$el.parents('.panel').find('.panel-title-text').text(newtitle);
                         }.bind(portletView);

                         portletView.render();
                         ts.refreshWidget($dom);

                         def.resolve();
                    });
                });
            }
            //通知所有的Portlet，并等待portlet加载完成来通知主页
            portal.appEvent.trigger("plugin_portlet_ready").done(function(){
                console.log("workspace ready !!!")
                portal.appEvent.triggerWorkspaceReady();
            })

		},

        titleRender : function(titleLine,$dom){
            $th = $dom.parent().find(".panel-heading"),
            $tl = $th.children(".panel-title");
            // examine portlet title line components
            if (titleLine) {
                if(fish.isString(titleLine)){
                    titleLine = {
                        override: false,
                        template: titleLine
                    }
                } else if (titleLine.override) {
                    $tl.remove();
                }
                $th.append(titleLine.template);
            }
            return $th;
        },

        refreshWidget : function ($dom) {
            var height = $dom.closest(".panel").innerHeight() - $dom.closest(".panel").children(".panel-heading").outerHeight(),
                width =  $dom.closest(".panel").innerWidth();
            $dom.outerHeight(height);
            $dom.slimscroll({
                height:height,
                width:"100%",
                axis: 'both'
            })
        },


        /**
         * 获取当前设计状态下所有自定义之后的组件，在保存到数据库之前调用
         */
		getWidgetsData: function () {
			var ts = this;
			return fish.map($('.grid-stack-item:visible', this.$element), function (el) {
                var node = $(el).data('_gridstack_node'),
                	$div = ts.getDom(el).panelDom;

                var widget = {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height,
                    domId : $div.attr("id"),
                    portletId : $div.attr("portletId")
                };
                var portletView = ts.viewInstance[widget.domId] ;
                widget.params = portletView.params || portletView.options.params;
                return widget;
            });
		},

		clearGrid: function () {
			this.gridstack.removeAll() ;
		},
        /**
         * 获取弹出层中选择的组件，在确认选择关闭弹框的时候，将选择的组件保存起来，以便加载到设计界面
         */
		getSelectedGrids : function($selWid){
            var ts = this,
            	x = 0,
            	y = 0;
            fish.each($selWid,function (widget) {
                widget.domId = fish.getUUID();
                widget.x = x;
                widget.y = y;
                widget.width = 2;
                widget.height = 4;
                x += 2;
                if (x > 10) {
                	x = 0;
                	y += 2;
                }
            });
            return $selWid;
        },
        destroy :function(){
            this.gridstack.destroy() ;
        }
	}

	$.fn.gridStack = function(options) {
		return new gridStack(this, options);
	}
});
