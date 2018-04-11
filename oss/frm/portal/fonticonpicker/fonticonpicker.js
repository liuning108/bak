/**
 * 字体图标选择
 * 适用于菜单图标的选择，只可选不编辑
 */
!function () {
    "use strict";

    $.widget('ui.fonticonpicker', $.ui.popover, {
        options: {
            /**
             * @cfg {String} value=null 选择值
             */
            value: null,
            dataSource: []
        },

        _create: function () {
            this.$element = this.element;
            this.$element.hide();

            this.icondata = {
                data: this.options.dataSource
            };
            this.template =
                "<div class='fonticonpicker form-control'>" +
                "<span class='fonticonpicker-text'>{{#if value}}<span class='{{value}}'>{{value}}</span>{{else}}<span class='fonticonpicker-placeholder'>Select a State</span>{{/if}}</span>" +
                "<span class='iconfont icon-pencil form-control-feedback'></span>" +
                "</div>";
            this.iconTemplate = 
                "<div class='iconfontpicker-content'><div class='iconfontpicker-page'><span class='iconfontpicker-currentpage'>1</span>/{{data.length}}</div><div class='iconfontpicker-list'>" +
                "{{#each data}}<div class='well'>" +
                "{{#each list}}<span class='{{this}}'></span>{{/each}}" +
                "</div>{{/each}}" +
                "</div></div>";
            var thisId = this.$element.attr('id');
            this.$element.after(fish.compile(this.template)(this.options));
            this.$fonticonpicker = this.$element.next('.fonticonpicker');
            var iconpicker = this.$fonticonpicker.popover({
                html: true,
                placement: 'bottom-right',
                content: fish.compile(this.iconTemplate)(this.icondata)
            }).on("popover:show",function(){
                $('.iconfontpicker-list').slick({
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1
                });
                $(".slick-dots button",".popover").on("click",function(){
                    $('.iconfontpicker-currentpage').html($(this).html());
                });
                $(".iconfontpicker-list span",".popover").on("click",function(){
                    $("#" + thisId).next('.fonticonpicker ').children('.fonticonpicker-text').html("<span class='" + $(this).attr('class') + "'>" + $(this).attr('class') + "</span>");
                    $("#" + thisId).val($(this).attr('class'));
                    iconpicker.popover("hide");
                });
            });
        },

        disable: function () {
        },

        enable: function () {
        }
    });
}();
