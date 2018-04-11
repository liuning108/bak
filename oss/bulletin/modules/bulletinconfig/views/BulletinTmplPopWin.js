define([
    'text!bulletin/modules/bulletinconfig/templates/BulletinTmplPopWin.html',
    'i18n!bulletin/modules/bulletinconfig/i18n/bulletinconfig',
    'bulletin/modules/bulletinconfig/actions/BulletinConfigAction',
    "frm/fish-desktop/third-party/ueditor/ueditor.config",
	"frm/fish-desktop/third-party/ueditor/ueditor.all"	
], function(tpl, i18nconfig, configAction) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),

        events: {
			"click .js-ok": "ok"
        },
        
        initialize: function(options) {
            this.type = options.type;
            this.detail = options.data;
        },

        render: function() {
            // this.$el.html(this.template(i18nconfig));
            this.setElement(this.template(i18nconfig));
        },

        afterRender: function() {
            var that = this;
            that.$(".js-config-define").form();
            if (that.type == "edit"){
                that.$("[name='templateName']").val(that.detail.templateName);
                that.$("[name='comments']").val(that.detail.comments);
            }
            var text = this.ue = UE.getEditor('content',{
				// UEDITOR_HOME_URL : 'frm/fish-desktop/third-party/ueditor/',
				// serverUrl : 'frm/fish-desktop/third-party/ueditor/jsp/controller.jsp',
				elementPathEnabled:false,
				initialFrameWidth: 600,
				maximumWords:4000,
				autoHeightEnabled:false,
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
        },

        ok: function(){
            if (this.$(".js-config-define").isValid()){
                if (this.type == 'add'){
                    var msg = {};
                    msg.templateName = this.$("[name='templateName']").val();
                    msg.comments = this.$("[name='comments']").val();
                    msg.content = this.ue.getContent();               
                    this.popup.close(msg);
                   
                }
                if (this.type == 'edit'){
                    this.detail.templateName = this.$("[name='templateName']").val();
                    this.detail.comments = this.$("[name='comments']").val();
                    this.detail.content = this.ue.getContent();               
                    this.popup.close(this.detail);
                }
            }   
        }
    });
    
});