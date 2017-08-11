/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/DimIndiTag.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, Draggabilly) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {
            'click #ad-graph-btn': "showGraphMode",
            'click #ad-backtolist-btn': "backToListView",
            'keyup #ad-dim-indi-search': "dimIndiSearch"
        },

        initialize: function (opt) {
            this.dragNode = opt.dragNode;
            this.tagName = this.dragNode.name;
            this.tagAlias = "";
            this.$draggable;
            this.source_x;
            this.source_y;
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({tagName: this.tagName})));
            return this;
        },

        afterRender: function () {
            if(this.$(".ad-tags")[0]) {
                this.$draggable = new Draggabilly(this.$(".ad-tags")[0]);
                this.$draggable.on('dragStart', this.onDragStart);
                this.$draggable.on('pointerUp', this.onDragEnd);
                this.$draggable.on('dragMove', this.onDragMove);
            }
        },

        onDragStart: function ( event, pointer ) {
            this.source_x = pointer.pageX;
            this.source_y = pointer.pageY;
            //console.log( 'onDragStart on ' + event.type +
            //pointer.pageX + ', ' + pointer.pageY);

        },
        onDragEnd: function ( event, pointer ) {
            //$(this.element)[0].style.left = "0px";
            //$(this.element).css("left", "");
            console.log( $(this.element).css("left"));

        },
        onDragMove: function ( event, pointer, moveVector ) {
            console.log( 'dragMove on ' + event.type +
            pointer.pageX + ', ' + pointer.pageY);
        },

        resize: function () {

        }
    })
});
