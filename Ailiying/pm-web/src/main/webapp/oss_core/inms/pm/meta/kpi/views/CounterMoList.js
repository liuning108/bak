define([
	'text!oss_core/inms/pm/meta/kpi/templates/CounterMoList.html',
	'oss_core/inms/pm/meta/measure/actions/MeasureAction',
],function(counterMoTpl, measureAction){
	return fish.View.extend({
		template: fish.compile(counterMoTpl),
		events: {
			"click .js-ok": 'ok',
		},
		initialize: function(options) {
			this.i18nData =	options.i18nData;
			this.pmUtil = options.pmUtil;
			this.kpiType = options.kpiType;
			this.EMS_TYPE_REL_ID = options.EMS_TYPE_REL_ID;
			this.kpiFormular = options.kpiFormular;
		},
		render: function() {
			this.$el.html(this.template(this.i18nData));
			return this;
		},
		afterRender: function(){
			this.$(".js-kpi-ems-ver-content").slimscroll({height:280,width:680});
			this.verCnt = this.kpiFormular?this.kpiFormular.length:0;
			fish.forEach(this.kpiFormular,function(formular,index){

				var ver_code = formular["EMS_VER_CODE"] ;

        		var counterList = formular["counterList"];
        		var counterStr = "";
        		fish.forEach(counterList,function(counter){
        			if(!counterStr){
        				counterStr = counter['COUNTER_CODE'];
        			}else{
        				counterStr += ","+counter['COUNTER_CODE'];
        			}
        			//counter['MO_CODE']
        		});
        		if(counterStr){
	        		var param = {};
	        		param["EMS_TYPE_REL_ID"] = this.EMS_TYPE_REL_ID ;
	        		param["EMS_VER_CODE"] = ver_code ;
	        		param["FIELD_CODES"] = counterStr ;
	        		param["FIELD_TYPE"] = "1";

	        		measureAction.qryMeasureField(param,function(data) {
	        			var content = "";
	        			this.$(".js-kpi-ems-ver-ul").append("<li><a href='#demo-tabs-box-"+ver_code+"' ver_code='"+ver_code+"' ><span class=\"glyphicon glyphicon-ok\" style='margin-right:5px;display:none;'></span> "+formular["EMS_VER_NAME"]+"</a></li>") ;
	        			fish.forEach(counterList,function(counter){
	        				var form="<form class='form-horizontal clearfix' counter='"+counter['COUNTER_CODE']+"'>	"
									+"    <div class='panel panel_shadow'>	"
									+"	    <div class='panel-heading'>	"
									+"	    	<h3 class='panel-title' style='width:500px;'>"+counter['COUNTER_CODE']+"</h3>	"
									+"	    </div>	"
									+"	    <div class='panel-body js-mo-group-div'>	";
		        			var moList = [];
		        			fish.forEach(data.moField,function(field){
		        				if(counter['COUNTER_CODE'] == field['FIELD_CODE']){
		        					moList.push(field);
		        				}
		        			});

		        			fish.forEach(moList,function(mo){
		        				var checkFlag = "";
	        					if(mo['MO_CODE'] == counter['MO_CODE'] || moList.length==1){
	        						checkFlag = "checked";
	        					}
			        			form+="			<label class=\"radio-inline\">"
									+"    			<input type='radio' name='moGroupRadio' class='form-control' value='"+mo['MO_CODE']+"' "+checkFlag+" />"+mo['MO_NAME']
									+"			</label> "

			        		});
			        		form+="	    </div>	"
								+"	</div>	"
								+"</form>	";
							content += 	form ;
		        		});
		        		this.$(".js-kpi-ems-ver-content").append(
		        			"<div id='demo-tabs-box-"+ver_code+"' ver_code='"+ver_code+"'>"
							+content
							+"</div>"
		        		);
		        		this.loadTab();
		        	}.bind(this));
        		}
        	}.bind(this));


		},
		loadTab:function(){
			this.verCnt-- ;
			if(this.verCnt == 0){
				this.pmUtil.tab(this.$('.js-kpi-ems-ver-tab'),{});
			}
		},
		ok: function(){
            var self = this;
			var retData = {};
			var isValid = true;
			fish.forEach(this.kpiFormular,function(formular,index){

				var ver_code = formular["EMS_VER_CODE"] ;
				var ver_name = formular["EMS_VER_NAME"] ;
				retData[ver_code] = {};
				var $form = this.$("#demo-tabs-box-"+ver_code).find("form[counter]");

				fish.forEach($form, function(form) {
					var counterCode = $(form).attr('counter');
					var moRadios = $(form).find(":radio[name='moGroupRadio']") ;

					if(moRadios.length == 0){
						isValid = false;
						fish.info(ver_name+"["+counterCode+"]"+self.i18nData.NO_CONFIG_MO);
						return false;
					}else if(moRadios.length == 1){
						retData[ver_code].push({'FIELD_CODE':counterCode, 'MO_CODE':moRadios.eq(0).val()});
					}else{
						var moChkRadio = $(form).find(":radio[name='moGroupRadio']:checked");
						if(moChkRadio.length == 0){
							isValid = false;
							fish.info(ver_name+"["+counterCode+"]"+self.i18nData.NO_CONFIG_MO);
							return false;
						}else{
							retData[ver_code][counterCode] = moChkRadio.eq(0).val();
						}
					}
				});
			}.bind(this));
			if(!isValid) return false;
			//alert(JSON.stringify(retData));
			this.popup.close(retData);
		},

	});
});
