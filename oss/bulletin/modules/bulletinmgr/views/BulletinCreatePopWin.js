define([
    'text!bulletin/modules/bulletinmgr/templates/BulletinCreatePopWin.html',
    'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
    'bulletin/modules/bulletinmgr/actions/BulletinAction',
	"frm/fish-desktop/third-party/ueditor/ueditor.config",
	"frm/fish-desktop/third-party/ueditor/ueditor.all"
], function(tpl, i18n, Action) {
	// window.UEDITOR_HOME_URL = "/frm/fish-desktop/third-party/ueditor/";
    return portal.BaseView.extend({
        template: fish.compile(tpl),

        events: {
			"click .js-ok": "ok",
			"click .js-save": "save"
        },
        
        initialize: function(options) {
            this.type = options.type;
			this.detail = options.data;
			if (this.type == "edit"){
				this.recipientData = this.detail.recipient;
			}
        },

        render: function() {
            // this.$el.html(this.template(i18n));
            this.setElement(this.template(i18n));
        },

        afterRender: function() {
            var that = this;
            that.$(".js-bulletin-define").form();
            // if (that.type == "eidt"){
            //     that.$("[name='title']").val(that.detail.title);
            //     that.$("[name='comments']").val(that.detail.comments);
			// }
			that.recipientPop = that.$(".js-recipient").popedit({
				open: function() {
					var selectedValue = that.recipientData;
					fish.popupView({
						url: "bulletin/modules/bulletinmgr/views/RecipientSelPopWin",
						viewOption: {
							// resource: this.jobResource,
							selected: selectedValue ? selectedValue : null
						},
						close: function(msg) {
							that.recipientData = msg;
							var textValue = '';
							for (var idx in that.recipientData){
								if (idx == that.recipientData.length - 1){
									textValue += that.recipientData[idx].partyCode;
								}
								else
								{
									textValue += that.recipientData[idx].partyCode + ",";
								}
							}							
							that.recipientPop.popedit("setValue", {
								Value: textValue,
								Text: textValue
							});
						}
					});
				},
				dataTextField: "Text",
				dataValueField: "Value"
			});
			
			that.auditStaffPop = that.$("[name='auditStaffId']").popedit({
				dataTextField: "Text",
				dataValueField: "Value",
				open: function() {
					var selectedValue = that.auditStaffPop.popedit("getValue");
					fish.popupView({
						url: "stafforg/modules/stafforg/views/OrgStaffSelPopWin",
						viewOption: {
							// resource: this.jobResource,
							onlyOne: true
						},
						close: function(msg) {
							that.auditStaffPop.popedit("setValue", {
								Value: msg[0].staffId,
								Text: msg[0].staffName
							});
						}.bind(this)
					});
				},
			});
			Action.qryAllType(function(data){
				var allType = [];
				if (data && data.length > 0){
					allType = fish.nest(data, 'typeId', 'parentTypeId', 'children');
				}
				that.$("[name='type']").combotree({
					placeholder: i18n.COMMON_PLS_SEL,
					data: {
						key: {
							children: 'children',
							name: 'typeName',

						}
					},
					dataValueField: "typeId",
					fNodes: allType
				});
				if(that.type == "edit"){
					if (that.detail.typeId){
						that.$("[name='type']").combotree("value", that.detail.typeId);
					}					
				}
			});
			
			Action.qryBulletinLevel(function(data){
				that.$("[name='levelId']").combobox({			
					placeholder: i18n.COMMON_PLS_SEL,
					dataTextField: 'levelName',
					dataValueField: 'levelId',
					dataSource: data
				});
				if(that.type == "edit"){					
					if (that.detail.levelId){
						that.$("[name='levelId']").combobox("value", that.detail.levelId);
					}
				}
			});

			that.$("[name='effDate']").datetimepicker();
			that.$("[name='expDate']").datetimepicker();

            var text = that.ue = UE.getEditor('content',{
				// UEDITOR_HOME_URL : 'frm/fish-desktop/third-party/ueditor/',
				// serverUrl : 'frm/fish-desktop/third-party/ueditor/jsp/controller.jsp',
				elementPathEnabled:false,
				initialFrameWidth: 670,
				autoHeightEnabled:false,
				// initialFrameHeight: 200,
				toolbars:[['undo', //撤销
				           'redo', //重做
				           'bold', //加粗
				           'indent', //首行缩进
				           'italic', //斜体
				           'underline', //下划线
				           'strikethrough', //删除线
				           'subscript', //下标
				           'fontborder', //字符边框
				           'superscript', //上标
				           'formatmatch', //格式刷
				           'pasteplain', //纯文本粘贴模式
				           'selectall', //全选
				           'removeformat', //清除格式
				           'unlink', //取消链接
				           'insertrow', //前插入行
				           'insertcol', //前插入列
				           'cleardoc', //清空文档
				            'fontfamily', //字体
				           'fontsize', //字号
				           'paragraph', //段落格式
				           'link', //超链接
				           'spechars', //特殊字符
				           'searchreplace', //查询替换
				           'justifyleft', //居左对齐
				           'justifyright', //居右对齐
				           'justifycenter', //居中对齐
				           'justifyjustify', //两端对齐
				           'forecolor', //字体颜色
				           'backcolor', //背景色
				           'directionalityltr', //从左向右输入
				           'directionalityrtl', //从右向左输入
				           'rowspacingtop', //段前距
				           'rowspacingbottom', //段后距
				           'imagenone', //默认
				           'imageleft', //左浮动
				           'imageright', //右浮动
				           'imagecenter', //居中
				           'lineheight', //行间距  
				           'edittip ', //编辑提示
				           'customstyle', //自定义标题
				           'autotypeset', //自动排版
				           'touppercase', //字母大写
				           'tolowercase', //字母小写
				           'modelparam'					           
				           ]]
			});
			
			text.addListener("ready", function () {
		        if (that.type == "edit") {
					text.setContent(that.detail.content,false);
				}
			});					

			Action.qryBulletinTmpl(function(data){
				var $combobox1 = that.$("[name='tmpl']").combobox({			
					placeholder: i18n.COMMON_PLS_SEL,
					dataTextField: 'templateName',
					dataValueField: 'templateId',
					dataSource: data
				});
				$combobox1.on('combobox:change', function () {
					that.item = $combobox1.combobox("getSelectedItem");
					that.ue.setContent(that.item.content);
				});
			});
			if (that.type == "edit"){
				if (that.recipientPop){
					var textValue = '';
					for (var idx in that.recipientData){
						if (idx == that.recipientData.length - 1){
							textValue += that.recipientData[idx].partyCode;
						}
						else
						{
							textValue += that.recipientData[idx].partyCode + ",";
						}
					}							
					that.recipientPop.popedit("setValue", {
						Value: textValue,
						Text: textValue
					});
				}
				that.$("[name='title']").val(that.detail.title);
				if (that.detail.auditStaffId){
					that.auditStaffPop.popedit("setValue", {
						Value: that.detail.auditStaffId,
						Text: that.detail.auditStaffName
					});
				}				
				that.$("[name='effDate']").datetimepicker("value", that.detail.effDate);
				that.$("[name='expDate']").datetimepicker("value", that.detail.expDate);
			}
			// that.ue.setHeight(200);
		},
		getPopText: function(list) {
			if (list && list.length > 0) {
				var text = "";
				for (var i = 0; i < list.length; i++) {
					if(typeof(list[i])==undefined)
						continue;
					if (i > 0) {
						text += ("," + list[i].partyName);
					} else {
						text += list[i].partyName;
					}
				}
				return text;
			}
			return "";
		},
		save: function(){
			this.release("save");
		},
		ok: function(){
			this.release("ok");
		},

        release: function(param){
            if (this.$(".js-bulletin-define").isValid()){
				var msg = this.$(".js-bulletin-define").form('value');
				
				msg.typeId = this.$("[name='type']").combotree("value").typeId;
				msg.typeName = this.$("[name='type']").combotree("value").typeName;
				msg.levelName = this.$("[name='levelId']").combobox("text");
				msg.contentText = this.ue.getContentTxt();
				msg.content = msg.editorValue;			
				msg.auditStaffId = this.auditStaffPop.popedit("getValue").Value;
				msg.recipient =	this.recipientData;
				msg.bulletinId = this.detail.bulletinId;
				
                if (param == 'ok'){
					if (msg.auditStaffId == null){
						msg.state = 'A';
					}
					else{
						msg.state = 'C';
					}
				}
				if (param == 'save'){
					
					msg.state = 'S';					
				}
				delete msg.type;
				delete msg.editorValue;
				// delete msg.recipient;
				// msg.recipient = [{type:0,partyCode:'ADMIN'}];
				this.popup.close(msg);
            }   
        }
    });
    
});