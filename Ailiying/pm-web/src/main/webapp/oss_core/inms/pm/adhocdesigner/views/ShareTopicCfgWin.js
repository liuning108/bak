/**
 *
 */
define([
        'text!oss_core/inms/pm/adhocdesigner/templates/ShareTopicCfgWin.html',
        'i18n!oss_core/inms/pm/adhocdesigner/i18n/adhoc'
    ],
    function(ShareTopicCfgView, i18nData) {
        return fish.View.extend({

            className : "ui-dialog dialog",

            resource: fish.extend({}, i18nData),
            //加载模板
            template: fish.compile(ShareTopicCfgView),

            events : {
                "click [name='ad-sharetopic-sharetype-chx']" : "changeShareType",
                "click #btn-slm-slimgr-ok" : "fnOK",
                "click #btn-slm-slimgr-cancel" : "fnCancel"
            },

            initialize: function(inParam) {
                this.topicNo = inParam.topicNo;
                this.userList = inParam.userList;
                this.share_obj = inParam.share_obj?inParam.share_obj:"";
                this.share_type = inParam.share_type;
                this.currUserId = portal.appGlobal.get("userId");
                this.shareTypeBtns = ['ad-sharetopic-sharetype-no-btn', 'ad-sharetopic-sharetype-all-btn', 'ad-sharetopic-sharetype-some-btn'];
                this.shareTypeValues = ['00', '01', '02'];
                this.render();
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                this.$el.appendTo('body');
                return this;
            },

            contentReady: function() {
                this.initUserSelect();
                if(this.share_type=="00"){
                    this.changeShareTypeFunc( this.shareTypeBtns[0]);
                }else if(this.share_type=="01"){
                    this.changeShareTypeFunc( this.shareTypeBtns[1]);
                }else if(this.share_type=="02"){
                    this.changeShareTypeFunc( this.shareTypeBtns[2]);
                    this.$userSelect.multiselect('value', this.share_obj.split(","));
                }
                for(var i=0;i<this.shareTypeValues.length;i++){
                    if(this.share_type!=this.shareTypeValues[i]){
                        this.$("#"+this.shareTypeBtns[i]).removeAttr("checked");
                    }else{
                        this.$("#"+this.shareTypeBtns[i]).attr("checked", "checked");
                    }
                }
            },

            initUserSelect: function () {
                var self = this;
                this.$('#ad-sharetopic-user-input').empty();
                fish.forEach(this.userList, function(user){
                    if(self.currUserId!=user.USER_ID){
                        self.$('#ad-sharetopic-user-input').append('<option value="'+user.USER_ID+'">'+user.USER_NAME+'</option>');
                    }
                });
                this.$userSelect = this.$('#ad-sharetopic-user-input').multiselect();
                this.$userSelect.multiselect('disable');
                this.$('#ad_sharetopic_user_input_multi').css("width", "447");
                this.$('#ad_sharetopic_user_input_multi').css("margin-left", "10px");
            },

            changeShareType: function(e) {
                var selectedId = e.currentTarget.id;
                this.changeShareTypeFunc(selectedId);
            },

            changeShareTypeFunc: function(chxId) {
                for(var i=0;i<this.shareTypeBtns.length;i++){
                    if(chxId!=this.shareTypeBtns[i]){
                        this.$("#"+this.shareTypeBtns[i]).removeAttr("checked");
                    }else{
                        this.share_type = this.shareTypeValues[i];
                    }
                }
                if(this.share_type == "02"){
                    this.$userSelect.multiselect('enable');
                }else{
                    this.$userSelect.multiselect('value', []);
                    this.$userSelect.multiselect('disable');
                }
            },

            fnOK: function() {
                if(this.share_type=="02"){// 共享给指定用户
                    var selectedUsers = this.$userSelect.multiselect('value');
                    if(!selectedUsers){
                        fish.toast('info', this.resource.CHOOSE_A_USER_ATLEAST);
                        return;
                    }else{
                        selectedUsers = selectedUsers.toString();
                    }
                }else{
                    var selectedUsers = "";
                }
                this.trigger("okEvent", {
                    topicNo: this.topicNo,
                    shareType: this.share_type,
                    selectedUsers: selectedUsers
                });
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            },

            resize: function() {
                return this;
            }
        });
    }
);
