/**
 * @class fish.desktop.widget.PageSideBar PageSideBar
 * 第三方组件，页面边控制条
 * <pre>
 *  $('.pagesidebar').pagesidebar({data:data});
 * </pre>
 */

! function () {
    'use strict';

    $.widget('ui.pagesidebar', {
        animationSpeed: '300',
        options: {
            /**
             * @cfg {Number} 宽度
             */
            width: 200,
            /**
             * @cfg {Number} 缩起来的宽度
             */
            minWidth: 50,
            /**
             * @cfg {Array} 数据源
             */
            data: [],
            /**
             * @cfg {Boolean} [openFirst=false] 自动打开第一个菜单，如果第一个为目录则，打开子菜单中第一个;
             * 如果location.hash已经有值则忽略openFirst参数
             */
            openFirst: false,
            /**
             * @cfg {Boolean} [autoScroll=true] 显示时是否滚动到指定的菜单
             */
            autoScroll: true,
            /**
             * @cfg {String} [position=left] 边框位置
             */
            position: 'left', //left or right
            /**
             * @cfg {Number} [zIndex=1000] z-index
             */
            zIndex: 1000,
            /**
             * @cfg {String} [customClass=''] 自定义样式，默认为空
             */
            customClass: '',
            /**
             * @cfg {Object} [icons] 菜单项图标配置
             * collapse：收缩图标，默认值："glyphicon glyphicon-menu-right" </br>
             * expand：展开图标，默认值："glyphicon glyphicon-menu-down" </br>
             * toggle: 切换图标，默认值："glyphicon glyphicon-align-justify"
             * @since V3.12.0
             */
            icons: {
                collapse: "glyphicon glyphicon-menu-right",
                expand: "glyphicon glyphicon-menu-down",
                toggle: "glyphicon glyphicon-align-justify"
            },
            /**
             * @cfg {Boolean} [showToggleBtn=true] 是否显示切换图标，默认是true
             * @since V3.12.0
             */
            showToggleBtn: true,
            /**
             * @cfg {String} [children="children"] 保存子节点数据的属性名称,默认是“children” 
             * @since V3.12.0
             */
            children: "children",
            //event
            /**
             * @event expand pagesidebar隐藏与显示
             */
            expand: $.noop,
            /**
             * @event slideUp pagesidebar菜单向上收起事件
             */
            slideUp: $.noop,
            /**
             * @event slideDown pagesidebar菜单向下展开事件
             */
            slideDown: $.noop,
            /**
             * @event select pagesidebar菜单选中事件
             */
            select: $.noop
        },

        _create: function () {
            this._createUI();
            this._bindEvents();
            this._action();
        },
        /**
         * 创建骨架
         */
        _createUI: function () {
            var data = this.options.data,
                $el = this.element;
            if (!$el.hasClass("ui-sidebar-wrapper")) {
                $el.addClass('ui-sidebar-wrapper ' + this.options.customClass).css('z-index', this.options.zIndex);

                var $sidebar = $('<div class="ui-sidebar"></div>');
                this.$menus = $('<ul class="ui-sidebar-menu"></ul>');

                //create toggle button
                if (this.options.showToggleBtn) {
                  this.$menus.append('<li class="ui-sidebar-toggler-wrapper clearfix"><span class="' + this.options.icons.toggle + ' ui-sidebar-toggler"></span></li>');
                }

                //create menu
                if (!fish.isEmpty(this.options.data)) {
                  this._recursive(this.options.data, this.$menus);
                  this.$menus.find(".arrow").addClass(this.options.icons.collapse);
                }

                $el.append($sidebar.append(this.$menus));
            }
            this._setWidth();
            this._setPosition();
        },
        // 递归生成html
        _recursive: function(items,$meus) {
            var self = this,
                hash = location.hash,
                children = this.options.children;

            fish.each(items, function(item) {
                var $li = $("<li></li>");
                if (item.hash) {
                    if (hash === item.hash) {
                        $li.addClass("active");
                    }
                } else {
                    item.hash = "javascript:;";
                }
                var $a = $("<a href=" + item.hash + "></a>").data("data-menu-item", item);
                if (item.icon) {
                    $a.append('<span class="' + item.icon + '"></span>');
                }
                $a.append('<span class="title" title="' + item.title + '">' + item.title + '</span>');
                $li.append($a);
                if (item[children]) {
                    $a.append('<span class="arrow"></span>');
                    $li.append('<ul class="sub-menu"></ul>');
                    self._recursive(item[children], $li.find(".sub-menu"));
                }
                $meus.append($li);
            });
        },

        /**
         * 绑定事件
         * @private
         */
        _bindEvents: function () {
            var self = this,
                $el = this.element,
                $toggleBtn = $el.find('.ui-sidebar-toggler'),
                $sidebar = $el.find('.ui-sidebar'),
                slideOffeset = -200;
            this.$menus = $el.find('.ui-sidebar-menu');

            //toggle按钮
            if (this.options.showToggleBtn) {
              this._on($toggleBtn, { click: function(e) {
                  var $body = $("body");
                  self.$menus.find(".arrow")
                      .removeClass(self.options.icons.expand)
                      .addClass(self.options.icons.collapse);
                  if ($body.hasClass("ui-sidebar-closed")) {
                    $body.removeClass("ui-sidebar-closed");
                    self.$menus.removeClass("ui-sidebar-menu-closed");
                    self.$menus.css("width", self.options.width);
                    self._trigger("expand", null, {
                      expand: true,
                      $el: $el
                    });
                    self._detectHash();
                  } else {
                    $body.addClass("ui-sidebar-closed");
                    self.$menus.addClass("ui-sidebar-menu-closed");
                    $(".sub-menu").removeAttr("style");
                    self.$menus.css("width", self.options.minWidth);
                    self._trigger("expand", null, {
                      expand: false,
                      $el: $el
                    });
                  }
                } });
            }
           
            this._on(this.$menus, {
                'click a': function (e) {
                    var $this = $(e.currentTarget),
                        checkElement = $this.next(),
                        $arrow = $this.find('.arrow'),
                        collapseIcon = self.options.icons.collapse,
                        expandIcon = self.options.icons.expand,
                        autoScroll = self.options.autoScroll;
                    self._trigger('select', e, $this.data('data-menu-item'));
                    if (checkElement.is('.sub-menu') && checkElement.is(':visible')) {
                        checkElement.slideUp(this.animationSpeed, function () {
                            $arrow.removeClass(expandIcon).addClass(collapseIcon);
                            if (autoScroll === true) {
                                scrollTo($this, slideOffeset);
                            }
                            self._trigger('slideUp', null, {
                                $el: $el
                            });
                        });
                        if (!self.fromLocate) {
                            $this.parent("li").addClass("active");
                        }
                    }
                    else if ((checkElement.is('.sub-menu')) && (!checkElement.is(':visible'))) {
                        //Get the parent menu
                        var parent = $this.parents('ul').first();
                        var ul = parent.find('ul:visible').slideUp(this.animationSpeed, function() {
                            var $activeElement = $(this).find('.active');
                            if ($activeElement.length > 0) {
                                $(this).parent().addClass("active");
                            }
                        });
                        //Get the parent li
                        var parent_li = $this.parent("li");

                        checkElement.slideDown(this.animationSpeed, function () {
                            $arrow.removeClass(collapseIcon).addClass(expandIcon);
                            if (autoScroll === true) {
                                scrollTo($this, slideOffeset);
                            }
                            self._trigger('slideDown', null, {
                                $el: $el
                            });
                        });
                        var selector = '.' + expandIcon.split(" ")[1];
                        parent.find(selector).removeClass(expandIcon).addClass(collapseIcon);
                        if (!self.fromLocate) {
                            parent_li.removeClass("active");
                        }
                    }
                    else {
                        if (!self.fromLocate) {
                            self.$menus.find("li").removeClass("active");
                            $this.parent("li").addClass("active");
                        }
                        
                    }
                    self.fromLocate = false;
                },
                'mouseleave >li': function (e) {
                    if (self.$menus.hasClass("ui-sidebar-menu-closed")) {
                        var $this = $(e.currentTarget),
                            $subMenu = $this.find(".sub-menu");
                        if ($subMenu.is(":visible")) {
                            $subMenu.removeAttr("style");
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

        },
        _action: function () {
            this._openFirst();
            this._detectHash();
        },

        /**
         * 判断是否自动打开第一个菜单，如果第一个菜单为目录，则打开子菜单中的第一个
         * @private
         */
        _openFirst: function () {
            if (this.options.openFirst !== true) {
                return;
            }
            if (fish.isEmpty(this.options.data)) {
                return;
            }
            //已经有hash
            if (location.hash.length > 1) {
                return;
            }

            var $el = this.element,
                $sidebar = $el.find('.ui-sidebar'),
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            //查找一级菜单
            var $firstA = $sidebar.find('ul.ui-sidebar-menu>li>a:eq(0)');
            var hash = $firstA[0]['hash'];
            if (hash.charAt(0) === '#') {
                location.hash = hash;
                $firstA.parent().addClass('active');
            } else {
                var $secondA = $sidebar.find('ul.ui-sidebar-menu>li>ul.sub-menu>li>a:eq(0)');
                var hash = $secondA[0]['hash'];
                if (hash.charAt(0) === '#') {
                    location.hash = hash;
                }
                $secondA.parent().addClass('active');
            }
        },

        /**
         * 检测当前的页面的hash
         * @private
         */
        _detectHash: function () {
            var self = this;
            var hash = location.hash;
            if (hash && hash.length > 1) {
                setTimeout(function () {
                    self.locate(hash);
                }, 100);
            }
        },

        /**
         * 动态支持属性设置
         * @param key
         * @param value
         * @private
         */
        _setOption: function (key, value) {
            this._super(key, value);
            switch (key) {
                case 'position':
                    this._setPosition();
                case 'width':
                    this._setWidth();
            }

        },

        /**
         * 固定控件
         * @private
         */
        _setWidth: function () {
            var $el = this.element;
            var $sidebarMenu = $el.find(".ui-sidebar-menu");
            $sidebarMenu.css("width", this.options.width);
        },
        /**
         * 设置边框位置
         * @private
         */
        _setPosition: function () {
            if (this.options.position === 'right') {
                $('body').removeClass("ui-sidebar-left").addClass('ui-sidebar-right');
            } else {
                $("body").removeClass("ui-sidebar-right").addClass('ui-sidebar-left');
            }
        },


        /**
         * 菜单滚动条显示
         * @private
         */
        _setScroll: function () {
            var self = this,
                $el = this.element,
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            if ($sidebarMenu.data('ui-slim-scroll-init')) {
                //
                $sidebarMenu.slimScroll({
                    destroy: true
                });
            }
            //var autoHeight = Math.min($sidebarMenu[0].scrollHeight, document.body.scrollHeight);
            var autoHeight = $sidebarMenu[0].scrollHeight;

            $sidebarMenu.slimScroll({
                allowPageScroll: true, // allow page scroll when the element scroll is ended
                size: '7px',
                position: 'right',
                height: autoHeight,
                alwaysVisible: false,
                railVisible: true,
                disableFadeOut: true
            });
            $sidebarMenu.data('ui-slim-scroll-init', true);

        },
        /**
         * 定位右边菜单
         */
        locate: function (hash) {
            var self = this;
            var $li = this.$menus.find('.active');
            this.fromLocate = true;
            if ($li.is(":hidden")) {
                var parents = $li.parents("li");
                parents.each(function(index, li) {
                    var target = $(li).children("a");
                    target.click();
                });
            } else {
                $li.children("a").click();
            }
        },

        /**
         * 销毁组件，由widget.js destroy方法调用
         * 清空节点和样式
         * @private
         */
        _destroy: function () {
            var self = this,
                $el = self.element,
                $sidebarMenu = $el.find('.ui-sidebar-menu');
            if ($sidebarMenu.data('ui-slim-scroll-init')) {
                $sidebarMenu.slimScroll({
                    destroy: true
                });
            }

            $el.removeClass('ui-sidebar-wrapper').removeClass(this.options.customClass).css('z-index', '').empty();
            $('body').removeClass('ui-sidebar-left ui-sidebar-right');
            $('body').removeClass('ui-sidebar-closed');
        }
    });

    function scrollTo(el, offeset) {
        var pos = (el && el.size() > 0) ? el.offset().top : 0;

        if (el) {
            pos = pos + (offeset ? offeset : -1 * el.height());
        }

        $('html,body').animate({
            scrollTop: pos
        }, 'slow');
    }
}();
