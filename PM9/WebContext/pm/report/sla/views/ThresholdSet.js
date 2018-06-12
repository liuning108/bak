portal.define([
	'text!oss_core/pm/report/sla/templates/ThresholdSet.html',
	'oss_core/pm/meta/measure/actions/MeasureAction',
],function(templateTpl){
	return portal.BaseView.extend({
		template: fish.compile(templateTpl),
		events: {
			"click .js-ok": 'ok',
			"click .js-counter-search":'counterSearch',
			'click .js-counter-add': 'counterAdd',
			'click .js-counter-del': 'counterDel',
			'click .js-counter-add-all': 'counterAddAll',
			'click .js-counter-del-all': 'counterDelAll',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.measureAction = options.measureAction;
			this.pmUtil = options.pmUtil;
			this.emsData = options.emsData;
			this.counterData = options.counterData?options.counterData:{};
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$form = this.$(".js-counter-set-form");
			this.$(".js-counter-group-ul").slimscroll({height:250});
			this.$(".js-counter-seling-ul").slimscroll({height:150});
			this.$(".js-counter-seled-ul").slimscroll({height:150});
			
			
		},
		
		loadMo: function(mo){
			var emsType = this.$form.find("input[name='EMS_TYPE']").combobox('value');
			var emsCode = this.$form.find("input[name='EMS']").combobox('value');
			var emsRela = "";
			fish.forEach(this.emsData['emsList'], function(ems) {
				if(ems['EMS_TYPE_CODE'] == emsType && ems['EMS_CODE'] == emsCode){
					emsRela = ems['EMS_TYPE_REL_ID'] ;
				}
			});
			var emsVer = this.$form.find("input[name='EMS_VER']").combobox('value');
			this.measureAction.qryMeasure({'EMS_TYPE_REL_ID':emsRela,'EMS_VER_CODE':emsVer}, function(data) {
				if (data){
					this.$form.find("input[name='MO_CODE']").combobox({
						dataTextField: 'MO_NAME',
				        dataValueField: 'MO_CODE',
				        dataSource:  data.moList
					});
					if(mo){
						this.$form.find("input[name='MO_CODE']").combobox('value',mo);
					}else{
						this.$form.find("input[name='MO_CODE']").combobox('value',(data.moList.length > 0)?data.moList[0]['MO_CODE']:'');
					}
				}
			}.bind(this));
		},
		init:function(){
			if(this.counterData['value']){
				this.$form.find("input[name='EMS_TYPE']").combobox('value',this.counterData['value']['EMS_TYPE'])
				this.loadEms(this.counterData['value']['EMS']);
				this.loadEmsVer(this.counterData['value']['EMS_VER']);
				this.loadMo(this.counterData['value']['MO_CODE']);
				this.$form.find("input[name='COUNTER_NAME']").val(this.counterData['value']['COUNTER_NAME']);
			}
			fish.forEach(this.counterData['detail'], function(detail) {
				this.counterSeledAppend(detail['code'],detail['name'],detail['title']);
			}.bind(this));
		},
		counterSearch:function(){
			if (!this.$form.isValid()) return false;
			
			var moCode = this.$form.find("input[name='MO_CODE']").combobox('value');
			var searchKey = $.trim(this.$form.find("input[name='COUNTER_NAME']").val());
			var fieldCode = "";
			fish.forEach(this.$(".js-counter-seled-ul .js-counter-del"), function(item) {
				if(fieldCode){
					fieldCode += ",'"+$(item).attr("code")+"'";
				}else{
					fieldCode = "'"+$(item).attr("code")+"'";
				}
			}.bind(this));
			
			var sql ="select a.mo_code,		\n"
					+"       a.field_code,	\n"
					+"       a.field_name,	\n"
					+"       a.field_type,	\n"
					+"       a.data_type,	\n"
					+"       b.mo_name,	\n"
					+"       b.mo_name,	\n"
					+"       (select m.model_code	\n"
					+"          from pm_adapter_mo m	\n"
					+"         where m.mo_code = a.mo_code	\n"
					+"           and rownum = 1) as model_code	\n"
					+"  from pm_mo_detail a, pm_mo b	\n"
					+" where a.mo_code = b.mo_code	\n"
					+"   and field_type = '1'	\n"
					+(moCode?" and a.mo_code='"+moCode+"' \n":"")
					+(searchKey?"   and upper(a.field_name) like '%' || upper('"+searchKey+"') || '%'	\n":"")
					+(fieldCode?"   and a.field_code  not in ("+fieldCode+")	\n":"");
			this.pmUtil.utilAction.qryScriptResult({SCRIPT:sql},function(data) {
				if(data && data.resultList){ 
					this.$(".js-counter-seling-ul").empty();
					fish.forEach(data.resultList,function(mo_field){
						var code = mo_field['FIELD_CODE'];
						var name = mo_field['FIELD_NAME'];
						var title = mo_field['FIELD_NAME']+'['+mo_field['MO_NAME']+']';
						this.counterSelingAppend(code,name,title)
					}.bind(this));
				}
			}.bind(this),true);		
		},
		ok: function(){
			var value = this.$form.form("value");		
			var retData = {counter:'',detail:[],value:value};

			fish.forEach(this.$(".js-counter-seled-ul .js-counter-del"), function(item,index) {
				var code = $(item).attr("code") ;
				var name = $(item).attr("name") ;
				var title = $(item).attr("tt") ;
				retData['counter'] += '['+code+']';
				retData['detail'].push({'code':code,'name':name,'title':title});
			}.bind(this));

			//alert(JSON.stringify(retData));
			this.popup.close(retData);
		},
		
		counterAdd:function(event){
			var $target = $(event.target) ;
			$target.parent().remove();
			this.counterSeledAppend($target.attr('code'),$target.attr('name'),$target.attr('tt'));
		},
		counterDel:function(event){
			var $target = $(event.target) ;
			$target.parent().remove();
			this.counterSelingAppend($target.attr('code'),$target.attr('name'),$target.attr('tt'));
		},
		counterAddAll:function(){
			fish.forEach(this.$(".js-counter-seling-ul .js-counter-add"), function(item,index) {
				this.counterSeledAppend($(item).attr("code"),$(item).attr("name"),$(item).attr("tt"));
			}.bind(this));
			this.$(".js-counter-seling-ul").empty();
		},
		counterDelAll:function(){
			fish.forEach(this.$(".js-counter-seled-ul .js-counter-del"), function(item,index) {
				this.counterSelingAppend($(item).attr("code"),$(item).attr("name"),$(item).attr("tt"));
			}.bind(this));
			this.$(".js-counter-seled-ul").empty();
		},
		counterSelingAppend:function(code,name,title){
			this.$(".js-counter-seling-ul").append("<li class=\"ui-sortable-handle\" title='"+title+"'>"
				+"<span style='width:195px;overflow:hidden; text-overflow:ellipsis; white-space:nowrap; word-break:keep-all;'>"+name+"</span>"
				+"<a href=\"#\" class=\"js-counter-add\" code='"+code+"' name='"+name+"' tt='"+title+"'>"+this.i18nData.COMMON_ADD+"</a></li>");
		},
		counterSeledAppend:function(code,name,title){
			this.$(".js-counter-seled-ul").append("<li class=\"ui-sortable-handle\" title='"+title+"'>"
				+"<span style='width:195px;overflow:hidden; text-overflow:ellipsis; white-space:nowrap; word-break:keep-all;'>"+name+"</span>"
				+"<a href=\"#\" class=\"js-counter-del\" code='"+code+"' name='"+name+"' tt='"+title+"'>"+this.i18nData.COMMON_DELETE+"</a></li>");
		},
		
	});
});