/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/FilterPanel.html',
        'oss_core/pm/adhocdesigner/actions/AdhocAction',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/views/AdhocUtil",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc',
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, action, echarts, adhocUtil, i18nData, Draggabilly) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {

        },

        initialize: function (opt) {
            this.opt = opt;
            this.panel_id = this.guid();
            this.FILTER_TYPE = opt.data.FILTER_TYPE;// 精确还是条件筛选
            this.VIEW_TYPE = opt.data.VIEW_TYPE;// 在呈现界面显示的类型
            this.SUBFILTER_TYPE = opt.data.SUBFILTER_TYPE;// 包含还是不包含
            this.DIM_CODE = opt.data.DIM_CODE;
            this.META_DIM_CODE = opt.data.META_DIM_CODE;
            this.DIM_NAME = opt.data.DIM_NAME;// 过滤器名称
            this.selectedList = opt.data.selectedList;
            this.filterOperList = opt.data.filterOperList;
            this.dragNode = opt.dragNode;
            this.dimDataCache = new adhocUtil.HashMap();
            this.source_x;
            this.source_y;
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend(this.resource,{tagName: this.DIM_NAME,nodeName: this.panel_id})));
            return this;
        },

        afterRender: function () {
            if(!this.dragNode) {// 过滤器插件
                this.$el.find('#ad-cfg').on('click', this.wrap(function () {
                    this.trigger("showFilterPluginSetup", {DIM_CODE: this.DIM_CODE,panel_id: this.panel_id});
                }));
            }else if(this.dragNode.tagType==0) {// 维度过滤器
                this.$el.find('#ad-cfg').on('click', this.wrap(function () {
                    this.trigger("showDimFilterSetup", {DIM_CODE: this.DIM_CODE});
                }));
            }else{// 指标过滤器
                this.$el.find('#ad-cfg').on('click', this.wrap(function () {
                    this.trigger("showIndiFilterSetup", {DIM_CODE: this.DIM_CODE});
                }));
            }
            this.$el.find('#ad-data-tag-close').on('click', this.wrap(function(){
                this.removeFilterPanel();
            }));
            if(this.META_DIM_CODE) {
                action.metaDimQuery({
                    DIM_CODE: this.META_DIM_CODE
                }, this.wrap(function (ret) {
                    var dimScript = "";
                    if (ret.scriptList && ret.scriptList.length > 0) {
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                    }
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, this.wrap(function (dimDataRet) {
                        fish.forEach(dimDataRet.resultList, this.wrap(function (item) {
                            this.dimDataCache.put(item.ID, item.NAME);
                        }));
                        this.updateFilterPanel();
                    }));
                }));
            }else{
                this.updateFilterPanel();
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
            //console.log( $(this.element).css("left"));

        },
        onDragMove: function ( event, pointer, moveVector ) {
            //console.log( 'dragMove on ' + event.type +
            //pointer.pageX + ', ' + pointer.pageY);
        },

        updateFilterPanel: function() {
            var self = this;
            $('#'+this.panel_id+'-list').empty();
            if(this.FILTER_TYPE=='0'){// 精确筛选
                if(this.SUBFILTER_TYPE=='INCLUDE'){
                    $('#'+this.panel_id+'-list').append('<li>'+this.resource.INCLUDE_FOLLOWING_OPTIONS+'</li>');
                }else{
                    $('#'+this.panel_id+'-list').append('<li>'+this.resource.EXCLUDE_FOLLOWING_OPTIONS+'</li>');
                }
                if(this.META_DIM_CODE) {
                    for (var i = 0; i < this.selectedList.length; i++) {
                        var htmlText = '<li>' + this.dimDataCache.get(this.selectedList[i].id) + '</li>';
                        $('#' + this.panel_id + '-list').append(htmlText);
                    }
                }else{
                    for (var i = 0; i < this.selectedList.length; i++) {
                        var htmlText = '<li>' + this.selectedList[i].name + '</li>';
                        $('#' + this.panel_id + '-list').append(htmlText);
                    }
                }
            }else if(this.FILTER_TYPE=='1'){// 条件筛选
                for(var i=0; i<this.selectedList.length; i++){
                    var htmlText = '<li>'+this.selectedList[i].name+' '+this.selectedList[i].value+'</li>';
                    $('#'+this.panel_id+'-list').append(htmlText);
                }
            }else if(this.FILTER_TYPE=='2') {// 使用全部
                $('#'+this.panel_id+'-list').append('<li>All</li>');
            }else if(this.FILTER_TYPE=='3') {// 插件
                var pluginName = this.opt.data.PLUGIN_NAME;
                if(!pluginName || pluginName=='') {
                    action.qryPluginList({}, function (ret) {
                        if (ret.pluginList && ret.pluginList.length > 0) {
                            fish.forEach(ret.pluginList, function (item) {
                                var value = item.PLUGIN_NO;
                                var text = item.PLUGIN_NAME
                                if(value == self.opt.data.PLUGIN_NO){
                                    $('#'+self.panel_id+'-list').html('<li>'+text+'</li>');
                                }
                            });
                        }
                    });
                }else{
                    $('#'+this.panel_id+'-list').html('<li>'+this.opt.data.PLUGIN_NAME+'</li>');
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
