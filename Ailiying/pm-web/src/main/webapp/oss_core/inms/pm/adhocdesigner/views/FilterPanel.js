/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/FilterPanel.html',
        'oss_core/inms/pm/adhocdesigner/actions/AdhocAction',
        "oss_core/inms/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/inms/pm/adhocdesigner/views/AdhocUtil",
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
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
            var self = this;
            if(!this.dragNode) {// 过滤器插件
                self.$el.find('#ad-cfg').on('click', function () {
                    self.trigger("showFilterPluginSetup", {DIM_CODE: self.DIM_CODE,panel_id: self.panel_id});
                });
            }else if(this.dragNode.tagType==0) {// 维度过滤器
                self.$el.find('#ad-cfg').on('click', function () {
                    self.trigger("showDimFilterSetup", {DIM_CODE: self.DIM_CODE});
                });
            }else{// 指标过滤器
                self.$el.find('#ad-cfg').on('click', function () {
                    self.trigger("showIndiFilterSetup", {DIM_CODE: self.DIM_CODE});
                });
            }
            self.$el.find('#ad-data-tag-close').on('click', function(){
                self.removeFilterPanel();
            });
            if(this.META_DIM_CODE) {
                action.metaDimQuery({
                    DIM_CODE: this.META_DIM_CODE
                }, function (ret) {
                    var dimScript = "";
                    if (ret.scriptList && ret.scriptList.length > 0) {
                        dimScript = ret.scriptList[0].DIM_SCRIPT;
                    }
                    action.scriptResultQuery({
                        SCRIPT: dimScript
                    }, function (dimDataRet) {
                        fish.forEach(dimDataRet.resultList, function (item) {
                            self.dimDataCache.put(item.ID, item.NAME);
                        });
                        self.updateFilterPanel();
                    });
                });
            }else{
                self.updateFilterPanel();
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
                    action.qryPluginList(function (pluginList) {
                        if (pluginList && pluginList.length > 0) {
                            fish.forEach(pluginList, function (item) {
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
