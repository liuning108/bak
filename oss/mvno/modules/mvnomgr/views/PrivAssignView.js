define([ "text!mvno/modules/mvnomgr/templates/PrivAssign.html",
		'mvno/modules/mvnomgr/actions/MvnoAction',
		'mvno/modules/mvnomgr/models/PrivAssignModel',
		"i18n!mvno/modules/mvnomgr/i18n/mvnomgr"
], function(TplPrivAssign, MvnoAction, PrivAssignModel, I18N) {
	
	return portal.BaseView.extend({

		template : fish.compile(TplPrivAssign),

		events: {
			"click .js-mvno-edit": 'editMvno',
			"click .js-mvno-ok": 'ok',
			"click .js-mvno-cancel": 'cancel'
		},

		initialize: function() {
			// this.privAssignModel
			// this.listenTo(this.privAssignModel, 'change', this.userDetailUpdated);
		},

		render: function() {
			this.setElement(this.template(I18N));
		},

		afterRender: function() {
			this.$form = $(".js-mvno-assign");
			this.$form.form('enable');
		},
		editMvno: function() {
			this.$form.form('enable');
			this.$(".userName")[0].disabled = true;
            this.$(".userCode")[0].disabled = true;
            this.$(".js-mvno-edit").parent().hide();
			this.$(".js-mvno-edit").parent().next().show();
			this.$(".js-mvno-ok").data("type", "edit");
		},
		ok: function() {
			var that = this;
			var $ok = that.$(".js-mvno-ok");
			var selection = $(".js-mvno-grid").grid("getSelection");
			var cloneMenus = new Array();
			for (var key in that.selectedMenus) {
				var item = that.selectedMenus[key];
				var menu = {};
				menu.privId = item.privId;
				menu.isAuthorized = item.isAuthorized;
				menu.spId = item.spId;									
				menu.privLevel = item.privLevel;
				menu.isGrant = item.isGrant;
				cloneMenus.push(menu);
			}
			switch ($ok.data("type")) {
			case "edit":
				if (this.$form.isValid()) {
					var user = {};
					user.userName = this.$(".userName").val();
					user.userCode =	this.$(".userCode").val();
					user.spId = selection.spId;
					user.userId = that.user.userId;
					MvnoAction.modMvnoUser(selection.spId,cloneMenus, function(data) {
						console.info(data);
						fish.success(I18N.MVNOMGR_MOD_MVNO_SUCCESS);
						this.$(".js-mvno-edit").parent().show();
						this.$(".js-mvno-edit").parent().next().hide();
						this.$form.form('disable');
					}.bind(this));
				}
				break;
			default:
				break;
			}
			// this.cancel();
		},
		cancel: function() {
			var that = this;
			that.$(".js-mvno-cancel").parent().hide();
			that.$(".js-mvno-cancel").parent().prev().show();			
			that.$form.form('disable');
			that.$form.resetValid();
			// this.$form.form('clear');
			// this.$form.form('value', this.selectData);
			// this.$(".userName").val(this.user.userName);
			// this.$(".userCode").val(this.user.userCode);
			// this.$userPopEdit.setValue(this.val);
		},
		reloadView: function(selectData, level){
			var that = this;
			that.$(".js-mvno-edit").parent().show();
			that.$(".js-mvno-edit").parent().next().hide();

			that.val = '';
            that.spId = selectData.spId;
			that.selectedMenus = {};
			MvnoAction.queryMvnoUser(selectData.spId,function(data){
				if(data){
					//初始化菜单
					that.$userPopEdit = that.$("[name='userMenus']").popedit({
						open: function() {
							fish.popupView({
								url: "mvno/modules/mvnomgr/views/MenuSelector",
								viewOption: {menus: data.localUserPriv, selectMenus: data.spUserPriv},
								close: function(msg) {
									that.selectedMenus = msg;
									var textValue = '';
									for (var idx in that.selectedMenus){
										if (idx == that.selectedMenus.length - 1){
											textValue += that.selectedMenus[idx].privName;
										}
										else
										{
											textValue += that.selectedMenus[idx].privName + ",";
										}
									}
									that.$userPopEdit.popedit("setValue", {
										value: textValue,
										text: textValue
									});
								}
							});
						}.bind(this),
						dataTextField: "text",
						dataValueField: "value"
					});
					that.$form.form('clear');
					if (data.spUserPriv !== undefined && data.spUserPriv.length > 0){
						that.val = '';
						for (var index in data.spUserPriv){							
							if (index == data.spUserPriv.length - 1){
								that.val += data.spUserPriv[index].privName;
							}
							else
							{
								that.val += data.spUserPriv[index].privName + ",";
							}
						}
						that.$userPopEdit.popedit("setValue", {
							value: that.val,
							text: that.val
						});
					}				
					
					that.$form.form('disable');
                    if(data.user.userId != undefined) {
                        that.user = data.user;
                        that.$(".userName").val(that.user.userName);
                        that.$(".userCode").val(that.user.userCode);
                    }
                    that.editable =false;
                    //只有自己的下级可以修改用户权限
                    if (that.spId != 0 && level == 1 && data.user.userId != undefined) {
                        that.editable = true;
                    }
                    that.$(".js-mvno-edit")[0].disabled = !that.editable;
				}
			}.bind(this));
			
		}
	});
});
