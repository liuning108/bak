/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/FilterPanel.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, Draggabilly) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

        events: {

        },

        initialize: function (opt) {
            this.panel_id = this.guid();
            this.FILTER_TYPE = opt.data.FILTER_TYPE;// 精确还是条件筛选
            this.VIEW_TYPE = opt.data.VIEW_TYPE;// 在呈现界面显示的类型
            this.SUBFILTER_TYPE = opt.data.SUBFILTER_TYPE;// 包含还是不包含
            this.DIM_CODE = opt.data.DIM_CODE
            this.DIM_NAME = opt.data.DIM_NAME;
            this.selectedList = opt.data.selectedList;
            this.filterOperList = opt.data.filterOperList;
            this.dragNode = opt.dragNode;
            this.source_x;
            this.source_y;
            //this.$('#ad-setupdim-btn').on('click', this.showDimSetup());
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend({tagName: this.DIM_NAME,nodeName: this.panel_id})));
            return this;
        },

        afterRender: function () {
            if(this.dragNode.tagType==0) {
                this.$el.find('#ad-cfg').on('click', this.wrap(function () {
                    this.trigger("showDimFilterSetup", {DIM_CODE: this.DIM_CODE});
                }));
            }else{
                this.$el.find('#ad-cfg').on('click', this.wrap(function () {
                    this.trigger("showIndiFilterSetup", {DIM_CODE: this.DIM_CODE});
                }));
            }
            this.$el.find('#ad-data-tag-close').on('click', this.wrap(function(){
                this.removeFilterPanel();
            }));
            this.updateFilterPanel();
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
            //console.log( $(this.element).css("left"));

        },
        onDragMove: function ( event, pointer, moveVector ) {
            //console.log( 'dragMove on ' + event.type +
            //pointer.pageX + ', ' + pointer.pageY);
        },

        updateFilterPanel: function() {
            $('#'+this.panel_id+'-list').empty();
            if(this.FILTER_TYPE==0){// 精确筛选
                if(this.SUBFILTER_TYPE=='INCLUDE'){
                    $('#'+this.panel_id+'-list').append('<li>Include the following options</li>');
                }else{
                    $('#'+this.panel_id+'-list').append('<li>Exclude the following options</li>');
                }
                for(var i=0; i<this.selectedList.length; i++){
                    var htmlText = '<li>'+this.selectedList[i].name+'</li>';
                    $('#'+this.panel_id+'-list').append(htmlText);
                }
            }else if(this.FILTER_TYPE==1){// 条件筛选
                for(var i=0; i<this.selectedList.length; i++){
                    var htmlText = '<li>'+this.selectedList[i].name+' '+this.selectedList[i].value+'</li>';
                    $('#'+this.panel_id+'-list').append(htmlText);
                }
            }
        },

        removeFilterPanel: function () {
            var dataObj = {
                panel_id: this.panel_id
            };
            this.trigger('removeFilterPanel', dataObj);
        },

        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        resize: function () {

        }
    })
});
