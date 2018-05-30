define([ "text!mvno/modules/mvnomgr/templates/Qualify.html",
	    "mvno/modules/mvnomgr/actions/MvnoAction",
		"i18n!mvno/modules/mvnomgr/i18n/mvnomgr"
], function(TplQualify, MvnoMgrAction, I18N) {
	
	return portal.BaseView.extend({

		template : fish.compile(TplQualify),

		events: {
			"click .js-mvno-new": 'newMvno',
			"click .js-mvno-edit": 'editMvno',
			"click .js-mvno-ok": 'ok',
			"click .js-mvno-cancel": 'cancel'
		},

		initialize: function() {
		},

		render: function() {
			this.setElement(this.template(I18N));
		},
		afterRender: function() {			
			this.uploadProcess();
		},
		deferredMvno:{},
		fileData: {},
		fileUploadResult: {},
		uploadProcess: function() {
	    	$('.fileinput-button').fileupload({
	            url: 'mvnos/logo/upload',
	            dataType: 'json',
	            acceptFileTypes: /(\.|\/)(gif|jpg|jpeg|png)$/i,
	            previewMaxWidth: 140,
		        previewMaxHeight: 65,
		        previewCrop: true,
		   		add: function(e, data) {
		   			var maxFileSize = 1024000; //上传图片最大值，单位：字节。
                    if (data.files[0].size > maxFileSize) {
                        fish.warn('选择的文件大小超过最大限制，请重新选择');
                        return;
                    }
                    $('input[name="logo"]').val(data.files[0].name);	
                    fileData = data;
	            },
	            done: function(e, data) {
	            	fileUploadResult = data;
	            	deferredMvno.resolve();
	            },
	            fail: function(e, data) {
	            	fish.error(data.jqXHR.responseJSON.message);
	            }    
	        });
		},
		newMvno: function() {
		    var $form = $(".js-mvno-detail");
			$form.form('enable');
			$form.form('clear');
			this.$(".js-mvno-new").parent().hide();
			this.$(".js-mvno-new").parent().next().show();
			$form.find(":input[name='spName']").focus();
			this.$(".js-mvno-ok").data("type", "new");
		},
		editMvno: function() {
			$(".js-mvno-detail").form('enable');
			this.$(".js-mvno-edit").parent().hide();
			this.$(".js-mvno-edit").parent().next().show();
			this.$(".js-mvno-ok").data("type", "edit");
		},
		ok: function() {
					
				var that = this;
				var logo = $('input[name="logo"]').val() ;
				var inputUser = $(".js-mvno-detail").form('value');
				if (logo !== null && logo !== "") {
				   	fileData.submit();
					deferredMvno = $.Deferred();
					deferredMvno.done(function(value) {
   						inputUser.logo = fileUploadResult.result;
   						that.saveOrUpdate(inputUser);
					});
				} 
				else {
					that.saveOrUpdate(inputUser);
				}			
		},
		saveOrUpdate: function(inputUser) {
			var $grid = $(".js-mvno-grid");
			$ok = this.$(".js-mvno-ok");
			$form = $(".js-mvno-detail");
			// inputUser = $(".js-mvno-detail").form('value'),
			rowData = $grid.grid('getSelection');
			switch ($ok.data("type")) {
			case "new":
				if ($form.isValid()) {
					inputUser.parentSpId = rowData.spId;
					inputUser.state = 'A';
					MvnoMgrAction.addMvno(inputUser, function(mvno) {
						$grid.grid("addChildNodes", mvno, rowData);
						$grid.grid("expandNode", rowData);
						// $grid.grid("setSelection", inputUser);
						fish.success(I18N.MVNOMGR_ADD_MVNO_SUCCESS);
						this.cancel();
					}.bind(this));
				}
				break;
			case "edit":
				if ($form.isValid()) {
					inputUser.spId = rowData.spId;			
					MvnoMgrAction.modMvno(inputUser, function() {
						$grid.grid("setRowData", inputUser);
						$grid.grid("setSelection", inputUser);
						fish.success(I18N.MVNOMGR_MOD_MVNO_SUCCESS);
						this.cancel();
					}.bind(this));
				}
				break;
			default:
				break;
			}
		},
		cancel: function() {
			this.$(".js-mvno-cancel").parent().hide();
			this.$(".js-mvno-cancel").parent().prev().show();
			$(".js-mvno-detail").form('clear');
			$(".js-mvno-detail").form('disable');
			$(".js-mvno-detail").resetValid();
			var mvnoData = $(".js-mvno-grid").grid('getSelection');
			$(".js-mvno-detail").form('value', mvnoData).form("disable");
		}
	});
});