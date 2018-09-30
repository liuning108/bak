/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/DimTag.html',
        "oss_core/inms/pm/adhocdesigner/assets/js/echarts-all-3",
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc',
        "oss_core/inms/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, i18nData, Draggabilly) {
    return fish.View.extend({
        reportMainTemplate: fish.compile(mainTpl),
        resource: fish.extend({}, i18nData),
        events: {
            'click #ad-dim-setup-btn': "showDimSetup"
        },

        initialize: function (opt) {
            this.tag_id = this.guid();
            this.dragNode = opt.dragNode;
            this.tagName = this.dragNode.name;
            this.tagAlias = "";
            this.calculateFormat = "";
            this.tagDesc = "";
            this.sortType = "";
            // 拖拽使用的变量
            this.$draggable;
            this.source_x;
            this.source_y;
        },

        render: function () {
            this.$el.html(this.reportMainTemplate(fish.extend(this.resource,{tagName: this.tagName,nodeName: this.tag_id})));
            return this;
        },

        afterRender: function () {
            var that = this;
            //this.$("#adhoc-dimtag-tagname").text(this.tagName);
            this.$("#ad-dim-setup-btn").off();
            this.$("#ad-dim-setup-btn").on("click", function(){
                that.showDimSetup();
            });
            //
            this.$("#ad-dimsort-asc-"+this.tag_id).off();
            this.$("#ad-dimsort-asc-"+this.tag_id).on("click", function(){
                that.sortAsc();
            });
            //
            this.$("#ad-dimsort-desc-"+this.tag_id).off();
            this.$("#ad-dimsort-desc-"+this.tag_id).on("click", function(){
                that.sortDesc();
            });
            //
            if(this.$(".ad-tags")[0]) {
                this.$draggable = new Draggabilly(this.$('[name="'+this.tag_id+'"]')[0]);
                this.$draggable.on('dragStart', this.onDragStart.bind(that));
                this.$draggable.on('dragEnd', this.onDragEnd.bind(that));
                this.$draggable.on('dragMove', this.onDragMove.bind(that));
            }
            $('#ad-ds-as-'+this.tag_id).hide();
            $('#ad-ds-des-'+this.tag_id).hide();
        },

        sortAsc: function () {
            this.clearSortLiActive();
            if(this.sortType!="asc") {
                this.sortType = "asc";
                $("#ad-dimsort-asc-li-" + this.tag_id).addClass("active");
            }else{
                this.sortType = "";
            }
            this.changeSortType();
        },

        sortDesc: function () {
            this.clearSortLiActive();
            if(this.sortType!="desc") {
                this.sortType = "desc";
                $("#ad-dimsort-desc-li-" + this.tag_id).addClass("active");
            }else{
                this.sortType = "";
            }
            this.changeSortType();
        },

        changeSortType: function () {
            var sortType = this.sortType;
            if(sortType!=""){
                if(sortType=="asc"){
                    $('#ad-dimsort-tag-'+this.tag_id).text("(Asc)");
                }else{
                    $('#ad-dimsort-tag-'+this.tag_id).text("(Desc)");
                }
                $("#ad-dimsort-"+this.sortType+"-li-" + this.tag_id).addClass("active");
            }else{
                $('#ad-dimsort-tag-'+this.tag_id).text("");
            }
        },

        clearSortLiActive: function () {
            $("#ad-dimsort-asc-li-"+this.tag_id).removeClass("active");
            $("#ad-dimsort-desc-li-"+this.tag_id).removeClass("active");
        },

        onDragStart: function ( event, pointer ) {

        },
        onDragEnd: function ( t, t ) {
            that = this;
            if(this.source_y<-35 || this.source_y>30){
                that.removeTag(this.tag_id);
            }else{
                that.restoreTag(this.tag_id);
            }
        },
        onDragMove: function ( t, e, n ) {
            this.source_x = n.x;
            this.source_y = n.y;
        },

        // 设置字段
        showDimSetup: function () {
            var self = this;
            require([
                'oss_core/inms/pm/adhocdesigner/views/DimSetup'
            ], function (Dialog) {
                var sData = {
                    tagAlias: self.tagAlias,
                    tagDesc: self.tagDesc,
                    calculateFormat: self.calculateFormat
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 550,
                    height: 360
                };
                self.dimSetUpView = fish.popup(option);
                dialog.afterRender();
                self.listenTo(dialog, 'okEvent', function (data) {
                    self.tagAlias = data.tagAlias;
                    self.tagDesc = data.tagDesc;
                    self.calculateFormat = data.calculateFormat;
                    self.refreshTag(self.tag_id);
                    self.dimSetUpView.close();
                });
                self.listenTo(dialog, 'cancelEvent', function () {
                    self.dimSetUpView.close();
                });
            });
        },

        refreshTag: function (tag_id) {
            if(this.tagAlias!=''){
                $("[name='"+this.tag_id+"'] > button > span").eq(2).text(this.tagAlias);
                this.dragNode.name = this.tagAlias;
            }else{
                $("[name='"+this.tag_id+"'] > button > span").eq(2).text(this.tagName);
                this.dragNode.name = this.tagName;
            }
            if(this.sortType!=''){
                this.changeSortType();
            }
            this.trigger("refreshDimKpiTagName");
        },

        removeTag: function (tag_id) {
            var dataObj = {
                tag_id: tag_id
            };
            this.trigger('removeDimTag', dataObj);
        },

        restoreTag: function (tag_id) {
            var dataObj = {
                tag_id: tag_id
            };
            this.trigger('restoreDimTag', dataObj);
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
