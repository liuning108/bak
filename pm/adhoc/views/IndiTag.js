/**
 *
 */
define([
        'text!oss_core/pm/adhocdesigner/templates/IndiTag.html',
        "oss_core/pm/adhocdesigner/assets/js/echarts-all-3",
        "oss_core/pm/adhocdesigner/assets/js/draggabilly.pkgd.min"
    ],
    function(mainTpl, echarts, Draggabilly) {
        return portal.BaseView.extend({
            reportMainTemplate: fish.compile(mainTpl),

            events: {
                'click #ad-indi-setup-btn': "showIndiSetup"
            },

            initialize: function (opt) {
                this.tag_id = this.guid();
                this.dragNode = opt.dragNode;
                this.formatObj = {};
                this.formatObj.tagName = this.dragNode.name;
                this.tagName = this.dragNode.name;
                this.formatObj.tagAlias = "";
                this.formatObj.tagDesc = "";
                this.formatObj.displayType = 0;
                this.formatObj.precision = 0;
                this.formatObj.isThousandDisplay = false;
                this.formatObj.showUnit = false;
                this.formatObj.calculateFormat = "";
                this.tagAlias = "";
                this.tagDesc = "";
                this.formatObj.sortType = "";
                this.$draggable;
                this.source_x;
                this.source_y;
            },

            render: function () {
                this.$el.html(this.reportMainTemplate(fish.extend({tagName: this.formatObj.tagName,nodeName: this.tag_id})));
                return this;
            },

            afterRender: function () {
                that = this;
                this.$("#ad-indi-setup-btn").off();
                this.$("#ad-indi-setup-btn").on("click", this.wrap(function(){
                    this.showIndiSetup();
                }));
                this.$("#ad-is-nosort-"+this.tag_id).off();
                this.$("#ad-is-nosort-"+this.tag_id).on("click", this.wrap(function(){
                    this.noSort();
                }));
                this.$("#ad-is-ascend-"+this.tag_id).off();
                this.$("#ad-is-ascend-"+this.tag_id).on("click", this.wrap(function(){
                    this.ascendSort();
                }));
                this.$("#ad-is-descend-"+this.tag_id).off();
                this.$("#ad-is-descend-"+this.tag_id).on("click", this.wrap(function(){
                    this.descendSort();
                }));
                if(this.$(".ad-tags")[0]) {
                    this.$draggable = new Draggabilly(this.$('[name="'+this.tag_id+'"]')[0]);
                    this.$draggable.on('dragStart', this.onDragStart.bind(that));
                    this.$draggable.on('dragEnd', this.onDragEnd.bind(that));
                    this.$draggable.on('dragMove', this.onDragMove.bind(that));
                }
                $('#ad-is-as-'+this.tag_id).hide();
                $('#ad-is-des-'+this.tag_id).hide();
            },

            noSort: function () {
                this.formatObj.sortType = "";
                $('#ad-is-as-'+this.tag_id).hide();
                $('#ad-is-des-'+this.tag_id).hide();
            },

            ascendSort: function () {
                this.formatObj.sortType = "asc";
                $('#ad-is-as-'+this.tag_id).show();
                $('#ad-is-des-'+this.tag_id).hide();
            },

            descendSort: function () {
                this.formatObj.sortType = "desc";
                $('#ad-is-as-'+this.tag_id).hide();
                $('#ad-is-des-'+this.tag_id).show();
            },

            onDragStart: function ( event, pointer ) {

            },
            onDragEnd: function ( t, t ) {
                if(this.source_y<-35 || this.source_y>30){
                    that.removeTag(this.tag_id);
                }else{
                    that.restoreTag(this.tag_id);
                }
            },
            onDragMove: function ( t, e, n ) {
                this.source_x = n.x;
                this.source_y = n.y;
                console.log("indi onDragMove :"+this.source_y);
            },

            showIndiSetup: function () {
                portal.require([
                    'oss_core/pm/adhocdesigner/views/IndiSetup'
                ], this.wrap(function (Dialog) {
                    var sData = this.formatObj;
                    var dialog = new Dialog(sData);
                    var content = dialog.render().$el;
                    var option = {
                        content: content,
                        width: 550,
                        height: 425
                    };
                    this.indiSetUpView = fish.popup(option);
                    dialog.afterRender();
                    this.listenTo(dialog, 'okEvent', this.wrap(function (data) {
                        this.tagAlias = data.tagAlias;
                        this.tagDesc = data.tagDesc;
                        this.formatObj = data;
                        this.refreshTag(this.tag_id);
                        this.indiSetUpView.close();
                    }));
                    this.listenTo(dialog, 'cancelEvent', this.wrap(function () {
                        this.indiSetUpView.close();
                    }));
                }));
            },

            refreshTag: function (tag_id) {
                if(this.formatObj.tagAlias!=''){
                    $("[name='"+tag_id+"'] > button > span").eq(2).text(this.formatObj.tagAlias);
                    this.dragNode.name = this.formatObj.tagAlias;
                }else{
                    $("[name='"+tag_id+"'] > button > span").eq(2).text(this.formatObj.tagName);
                    this.dragNode.name = this.formatObj.tagName;
                }
            },

            removeTag: function (tag_id) {
                var dataObj = {
                    tag_id: tag_id
                };
                this.trigger('removeIndiTag', dataObj);
            },

            restoreTag: function (tag_id) {
                var dataObj = {
                    tag_id: tag_id
                };
                this.trigger('restoreIndiTag', dataObj);
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
    }
);
