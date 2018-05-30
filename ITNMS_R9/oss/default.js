/*** 此配置文件专门为R9项目定制 ***/
require.config({
	urlArgs: "v=9.0.12",
	deps : [ 'main'], 
	waitSeconds : 0,
    paths: {
    'pdfjs-dist': 'frm/fish-desktop/third-party/pdfjs'
    }
});

//r9各产品中心用到的内容，控件在这里，css由于优先级问题,放到了default.html里面
require([
    'frm/fish-desktop/third-party/icheck/fish.icheck',
    'frm/fish-desktop/third-party/loadingbar/fish.loadingbar',
    'frm/fish-desktop/third-party/fileupload/fish.fileupload',
    'frm/fish-desktop/third-party/splitter/fish.splitter',
    'frm/fish-desktop/third-party/timeline/fish.timeline',
    'frm/fish-desktop/third-party/timeaxis/fish.timeaxis',
    'frm/fish-desktop/third-party/autosize/fish.autosize',
    'frm/fish-desktop/third-party/affix/fish.affix',
    'frm/fish-desktop/third-party/versionline/fish.versionline',
    'frm/r9/plugins/ellipsis/jquery.ellipsis'
]);

fish.View = fish.View.extend({
    sliderPanelHeading:function(selector,type) {
        var headingSelector = selector;
        if(!$(selector).hasClass('panel-heading')){
            headingSelector = $(selector).parents('.panel-heading');
        }
        if (type === 'form') {
            if ($(headingSelector).find('.icon-chevron-down').hasClass('icon-chevron-down')) {
                $(headingSelector).siblings('.panel-body').slideUp(200, function() {
                    $(headingSelector).find('.icon-chevron-down').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                });
            } else {
                $(headingSelector).siblings('.panel-body').slideDown(200, function() {
                    $(headingSelector).find('.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                });
            }
        } else if (type === 'panel') {
            if ($(headingSelector).find('.icon-chevron-down').hasClass('icon-chevron-down')) {
                $(headingSelector).siblings('.panel-body').slideDown(200, function() {
                    $(headingSelector).find('.icon-chevron-down').removeClass('icon-chevron-down').addClass('icon-chevron-up');
                });
            } else {
                $(headingSelector).siblings('.panel-body').slideUp(200, function() {
                    $(headingSelector).find('.icon-chevron-up').removeClass('icon-chevron-up').addClass('icon-chevron-down');
                });
            }
        }
    },
    sliderPanel: function(selector,upicon,downicon) {
        upIcon = upicon;
        if (!upIcon) {
            upIcon = 'icon-chevron-up';
        }
        downIcon = downicon;
        if (!downIcon) {
            downIcon = 'icon-chevron-down';
        }
        if ($(selector).hasClass('icon-chervon-up')) {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideUp(200, function() {
                $(selector).removeClass('icon-chervon-up').addClass(downIcon);
            })
        } else if ($(selector).hasClass(upIcon)) {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideUp(200, function() {
                $(selector).removeClass(upIcon).addClass(downIcon);
            })
        } else {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideDown(200, function() {
                $(selector).removeClass(downIcon).addClass(upIcon);
            })
        }
    },
    sliderForm: function(selector,upicon,downicon) {
        upIcon = upicon;
        if (!upIcon) {
            upIcon = 'icon-chevron-up';
        }
        downIcon = downicon;
        if (!downIcon) {
            downIcon = 'icon-chevron-down';
        }
        if ($(selector).hasClass('icon-chervon-up')) {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideDown(200, function() {
                $(selector).removeClass('icon-chervon-up').addClass(downIcon);
            })
        } else if ($(selector).hasClass(upIcon)) {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideDown(200, function() {
                $(selector).removeClass(upIcon).addClass(downIcon);
            })
        } else {
            $(selector).parents('.panel-heading').siblings('.panel-body').slideUp(200, function() {
                $(selector).removeClass(downIcon).addClass(upIcon);
            })
        }
    },
    sliderFormOpen: function(selector) {
        $(selector).parents('.panel-heading').siblings('.panel-body').slideDown(200, function() {
            if ($(selector).hasClass('icon-chervon-up')) {
                $(selector).removeClass('icon-chervon-up').addClass('icon-chevron-down');
            } else {
                $(selector).removeClass('icon-chevron-up').addClass('icon-chevron-down');
            }
        })
    },
    sliderFormClose: function(selector) {
        $(selector).parents('.panel-heading').siblings('.panel-body').slideUp(200, function() {
            $(selector).removeClass('icon-chevron-down').addClass('icon-chevron-up');
        })
    }
});
/*** R9 end ***/
