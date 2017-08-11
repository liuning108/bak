/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/DimTag.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, Draggabilly) {
    return portal.BaseView.extend({
        reportMainTemplate: fish.compile(mainTpl),

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
            this.$el.html(this.reportMainTemplate(fish.extend({tagName: this.tagName,nodeName: this.tag_id})));
            return this;
        },

        afterRender: function () {
            that = this;
            //this.$("#adhoc-dimtag-tagname").text(this.tagName);
            this.$("#ad-dim-setup-btn").off();
            this.$("#ad-dim-setup-btn").on("click", this.wrap(function(){
               this.showDimSetup();
            }));
            this.$("#ad-ds-nosort-"+this.tag_id).off();
            this.$("#ad-ds-nosort-"+this.tag_id).on("click", this.wrap(function(){
                this.noSort();
            }));
            this.$("#ad-ds-ascend-"+this.tag_id).off();
            this.$("#ad-ds-ascend-"+this.tag_id).on("click", this.wrap(function(){
                this.ascendSort();
            }));
            this.$("#ad-ds-descend-"+this.tag_id).off();
            this.$("#ad-ds-descend-"+this.tag_id).on("click", this.wrap(function(){
                this.descendSort();
            }));
            if(this.$(".ad-tags")[0]) {
                this.$draggable = new Draggabilly(this.$('[name="'+this.tag_id+'"]')[0]);
                this.$draggable.on('dragStart', this.onDragStart.bind(that));
                this.$draggable.on('dragEnd', this.onDragEnd.bind(that));
                this.$draggable.on('dragMove', this.onDragMove.bind(that));
            }
            $('#ad-ds-as-'+this.tag_id).hide();
            $('#ad-ds-des-'+this.tag_id).hide();
        },

        noSort: function () {
            this.sortType = "";
            $('#ad-ds-as-'+this.tag_id).hide();
            $('#ad-ds-des-'+this.tag_id).hide();
        },

        ascendSort: function () {
            this.sortType = "asc";
            $('#ad-ds-as-'+this.tag_id).show();
            $('#ad-ds-des-'+this.tag_id).hide();
        },

        descendSort: function () {
            this.sortType = "desc";
            $('#ad-ds-as-'+this.tag_id).hide();
            $('#ad-ds-des-'+this.tag_id).show();
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
            portal.require([
                'oss_core/pm/adhocdesigner/views/DimSetup'
            ], this.wrap(function (Dialog) {
                var sData = {
                    tagAlias: this.tagAlias,
                    tagDesc: this.tagDesc,
                    calculateFormat: this.calculateFormat
                };
                var dialog = new Dialog(sData);
                var content = dialog.render().$el;
                var option = {
                    content: content,
                    width: 550,
                    height: 360
                };
                this.dimSetUpView = fish.popup(option);
                dialog.afterRender();
                this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                    this.tagAlias = data.tagAlias;
                    this.tagDesc = data.tagDesc;
                    this.calculateFormat = data.calculateFormat;
                    this.refreshTag(this.tag_id);
                    this.dimSetUpView.close();
                }));
                this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                    this.dimSetUpView.close();
                }));
            }));
        },

        refreshTag: function (tag_id) {
            if(this.tagAlias!=''){
                $("[name='"+this.tag_id+"'] > button > span").eq(2).text(this.tagAlias);
                this.dragNode.name = this.tagAlias;
            }else{
                $("[name='"+this.tag_id+"'] > button > span").eq(2).text(this.tagName);
                this.dragNode.name = this.tagName;
            }
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
