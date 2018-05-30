define([
    'frm/portal/Remote',
    "frm/portal/AppGlobal",
    "frm/portal/AppEvent",
    "frm/portal/Utils",
    "frm/portal/fish.extend",
    "frm/portal/RestAPIHelper"
], function (remote, appGlobal, appEvent, utils) {
    var FishView = fish.View,
    	PortalDef = function () {
        this.appGlobal = appGlobal;
        this.appEvent = appEvent;
        // this object serves as an interface exposed to other parts of the system
        // to wait upon a specific promise which is a property of this object,
        // and properties of this object is initialized in PortalView
        this.promise = {};
        
//        this.exportData = this.exportDataFunc();
    }

//    请使用restful方式调用服务;兼容portal8.1
    PortalDef.prototype.callService = remote.callService;
    PortalDef.prototype.callRemoteService = remote.callRemoteService;
    PortalDef.prototype.callServiceSyn = remote.callServiceSyn;

    fish.View.configure({manage: true, syncRender:true});
    /**
     * @method portal.BaseView
     * 返回fish.View实例,重写其中的initialize,resize,setElement方法
     */
    PortalDef.prototype.BaseView = (function() {
    	var adviceFuncs = {
    		initialize: function(func) { return function() {
				func.apply(this, arguments);
				this.on('render', function() {
					
				}, this);
				this.on('afterRender', function(){
					//菜单加载完成,会触发resize事件,会执行到menuresize方法;因此这里菜单的就不再执行了
					//workspace菜单没有tabs__content样式,但也没有resize方法,这里不做考虑
					if(!this.$el.hasClass("tabs__content")) {
						this.resize(portal.utils.getDeltaHeight(this.$el));
					}
				}, this);
				this.on('afterRender', function() {
					checkMenuComponentPriv(this);
				}, this);
			}},
			checkCompPriv: function (func) {return function (domId) {
				checkMenuComponentPriv(this, domId);
			}},
			resize: function(func) {return function(delta) {
				func.call(this, delta);
				// this.views; //{selector: new View()} or Selector:[ new View()]
				fish.each(this.__manager__.views, function (views) {
					fish.each($.makeArray(views), function (view) {
						if (view.$el.is(':visible')) {
							if (fish.isFunction(view.resize)) {
								var delta = view.$el.parent().height() - view.$el.outerHeight(true);
								view.resize(delta);
							}
						}
					}, this);
				}, this);
			}},
			setElement: function(func) {return function() {
				var $el = $(this.el);//支持异步setElement
				func.apply(this, arguments);
				this.$el.addClass("comprivroot");
				if($el[0] !== this.$el[0]){
					$el.replaceWith(this.$el);
				}
				return this;
			}}
    	},
    	checkMenuComponentPriv = function (context, id) {
			var viewType = utils.drawViewType(context.$el),
				menuView = context,
				comprivList = [];
				
			// lookup parent menu view
			while (menuView && !menuView.$el.hasClass("tabs__content")) {
				menuView = menuView.parentView;
			}
			if (menuView) {
				comprivList = menuView.comprivList;
			}

			var $el,$elAll = [];

			fish.forEach(comprivList, function(priv) {
				// OBJ_ID must has 3 components
				var parts = priv.objId.split("/");
				if (parts.length !== 3) {
					return;
				}
				// view type must match
				if (parts[0] !== viewType) {
					return;
				}
				var compid = parts[1],
					wrapid = compid.split(".")[0],
					elemid = compid.split(".")[1],
					path = parts[2];
				// wrapid must match
				if (wrapid && this.$el.parent().attr("id") !== wrapid) {
					return;
				}
				if (id && id !== elemid) {
					return;
				}
				$el = this.$(path);
				$elAll.push(this.$(path));
			}, context);
			compHideAll($elAll);

    	},
		comprivTabButton = function($el) {
			if ($el.parent().parent().hasClass("ui-tabs-nav")) {
				return true;
			} else {
				return false;
			}
		},
		comprivGridColumn = function($el) {
			if ($el.is("th") && $el.parents("div.grid").length > 0) {
				return true;
			} else {
				return false;
			}
		},
		compHideAll = function($compAll) {
			fish.each($compAll,function($comp){
				// detect if $comp is a tab button
				if (comprivTabButton($comp)) {
					var index = $comp.parent().prevAll().length,
						$tab = $comp.parent().parent().parent();
					$tab.tabs("hideTab", index);
				} else if (comprivGridColumn($comp)) {
					var $grid = $comp.parents("div.grid"),
						colModel = $grid.grid("option", "colModel"),
						index = $comp.prevAll().length,
						colDef = colModel[index];
					$grid.grid("hideCol", colDef.name, false);
				} else {
					$comp.remove();
				}
			})
		},
		compShow = function($comp) {
			// detect if $comp is a tab button
			if (comprivTabButton($comp)) {
				var index = $comp.parent().prevAll().length,
					$tab = $comp.parent().parent().parent();
				$tab.tabs("showTab", index, false);
			} else if (comprivGridColumn($comp)) {
				var $grid = $comp.parents("div.grid"),
					colModel = $grid.grid("option", "colModel"),
					index = $comp.prevAll().length,
					colDef = colModel[index];
				$grid.grid("showCol", colDef.name);
			} else {
				$comp.show();
			}
		};
    	return FishView.extend({
    		resize: $.noop
    	}, {
    		extend: function (protoProps, staticProps) {
    			var parent = this;

    			protoProps = protoProps || {};
//    			protoProps.manage = true;
//    			protoProps.syncRender = true;
    			protoProps.className = (protoProps.className ? protoProps.className + ' ' : '') + 'comprivroot';

				// deadvice, restore some function definition
    			if (parent !== portal.BaseView) {
    				fish.each(fish.keys(adviceFuncs), function(fName) {
        				if (fish.isFunction(parent[fName])) {
        					parent.prototype[fName] = parent[fName];
        				} else {
        					delete parent.prototype[fName];
        				}
    				});
    			}

    			fish.extend(staticProps, fish.pick.apply(fish, [protoProps].concat(fish.keys(adviceFuncs))));

    			// here do advice for functions that framework interests
    			$.each(adviceFuncs, function(funcName, adviceFunc) {
    				var func = protoProps[funcName] || parent.prototype[funcName];
    				protoProps[funcName] = adviceFunc(func);
    			});

    			return FishView.extend(protoProps, staticProps);
    		}
    	});
    })();
    
    fish.View = PortalDef.prototype.BaseView;
    
	PortalDef.prototype.role = function() {
		var appId = appGlobal.get("origin").appId;
		if (appId) {
			if (appId == '1') {
				return 'M'; // master
			} else {
				return 'S'; // slave
			}
		}
		return null;
	};
	
	PortalDef.prototype.exportData = function(param) {
		var dlform = document.createElement('form');
		dlform.style = "display:none;";
		dlform.method = 'post';
		dlform.action = param.url;
		dlform.target = 'id_iframe';
		var hdnFilePath = document.createElement('input');
		hdnFilePath.type = 'hidden';
		hdnFilePath.name = 'ftfexpformat';
		hdnFilePath.value = "xlsx";
		dlform.appendChild(hdnFilePath);

		var hdnftfexpcfg = document.createElement('input');
		hdnftfexpcfg.type = 'hidden';
		hdnftfexpcfg.name = 'ftfexpcfg';
		hdnftfexpcfg.value = (param.configstr);
		dlform.appendChild(hdnftfexpcfg);

		var hdnparam = document.createElement('input');
		hdnparam.type = 'hidden';
		hdnparam.name = 'param';
		hdnparam.value = (param.data);
		dlform.appendChild(hdnparam);

		document.body.appendChild(dlform);
		dlform.submit();
		document.body.removeChild(dlform);
	};


	/**
	 * 刷新菜单视图缓存（包含视图的整个依赖树），define时引入的依赖才会被刷新
	 * 例外：1、i18n文件暂时无法刷新（需要改requireJS）；2、代码中动态require的文件
	 * 弹框：可以先在define的时候引入对应的视图，pop的时候设置url为该视图类即可，例如： fish.popupView({url:
	 * DetailView})，注意DetailView是视图类，不是视图实例
	 * 
	 * @param menuModule
	 */
    var deps = [];
    PortalDef.prototype.clearRequireCache = function (menuModule) {
        if(!/\.js$/.test(menuModule) && /^\/|^http/.test(menuModule)) {
            menuModule = menuModule + '.js';
        }

        var projectUrls = require.s.contexts['_'].config.projectUrls,
            projectPrefix = "";
        if(projectUrls) {
            projectPrefix = fish.find(projectUrls, function(url) {
                return menuModule.indexOf(url) == 0;
            });
            if (projectPrefix)
                menuModule = projectPrefix + "static/" + menuModule.substring(projectPrefix.length);
        }

        var depModules = _.uniq(findAllDeps(menuModule, menuModule));
        var exceptList = ['webroot', 'exports', 'jquery'];
        _.each(depModules, function(module) {
            if(_.indexOf(exceptList, module) == -1  && module.indexOf('frm/portal') == -1 ) {
                require.undef(module);
            }
        });

        function findAllDeps (module, defineId, prefix) {
            var modules = [defineId];
            // var depArray = portal.appGlobal.get('deps');
            _.each(deps, function (depMap) {
                var map = depMap.map,
                    deps = depMap.deps;
                if(map.name == module && map.prefix === prefix) {
                    _.each(deps, function (dep) {
                        modules = modules.concat(findAllDeps(dep.name, dep.id, dep.prefix));
                    });
                }
            });

            return modules;
        }
    };

    require.onResourceLoad = function (context, map, depArray) {
        if(depArray && depArray.length) {
            var index = _.findIndex(deps, function (dep) {
                return dep.map.id === map.id;
            });

            if(index == -1) {
                deps.push({map: map, deps: depArray});
            } else {
                deps.splice(index, 1, {map: map, deps: depArray});
            }
        }
    };

	window.portal = new PortalDef();
    window.portal.utils = utils;
    //openMenu、closeMenu的实现需要等portalView加载之后才有具体的实现
    window.portal.openMenu = $.noop;
    window.portal.closeMenu = $.noop;
});