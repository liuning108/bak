portal.define([
	'oss_core/pm/util/actions/UtilAction',
	'i18n!i18n/common',
	'i18n!oss_core/pm/util/i18n/util',
	"css!oss_core/pm/util/css/ad-block.css",
	"css!oss_core/pm/util/css/ad-component.css",
    "css!oss_core/pm/util/css/ad-util-component.css" 
],function(utilAction, i18nCommon, i18nPMCommon) {
	this.sysParavalue = null;  
	this.sysParameter = null;
	this.parakey={
		id	:"PARA_ID",
		val	:"PARA_VALUE",
		name:"PARA_NAME",
		fname:"PARA_F_NAME",
		desc :"PARA_DESC",
	};
	
	return {
		utilAction:utilAction,
		i18nCommon:i18nCommon,
		i18nPMCommon:i18nPMCommon,
		parakey:this.parakey,
		paravalue:function(key){
			var that = this;
			if(!that.sysParavalue){
				utilAction.qryParavalue(function(data) {
					if(data && data.paraList){ 
						that.sysParavalue = data.paraList;
					}
				},true);
			}
			var ret = [];
			if(key){
				fish.forEach(that.sysParavalue,function(para,index){
            		if(para[that.parakey.id]==key){
            			ret.push(para);
            		}
            	});
			}else{
				ret = that.sysParavalue;
			}
			return ret;
		},
		parameter:function(key){
			var that = this;
			if(!that.sysParameter){
				utilAction.qryParameter(function(data) {
					if(data && data.paraList){ 
						that.sysParameter = data.paraList;
					}
				},true);
			}
			var ret = {};
			if(key){
				fish.forEach(that.sysParameter,function(para,index){
            		if(para[that.parakey.id]==key){
            			ret = para;
            			ret.val=function(){
            				return ret[that.parakey.val];
            			};
            			ret.name=function(){
            				return ret[that.parakey.name];
            			};
            			ret.fname=function(){
            				return ret[that.parakey.fname];
            			};
            			return true;
            		}
            	});
            }else{
				ret = that.sysParameter;
			}
			return ret;
		},
		paraToGridSel:function(params){
			var ret = "";
			fish.forEach(params,function(para,index){
				if(!ret){
					ret = para[this.parakey.val]+":"+para[this.parakey.name];
				}else{
        			ret += ";"+para[this.parakey.val]+":"+para[this.parakey.name];
        		}
        	});
        	return {value:ret};
		},
		sysdate:function(type,datetime){//type:date;time 
			if(!datetime) datetime = new Date();
			var ret;
			switch (type) {
				case 'date':
					ret = fish.dateutil.format(datetime, 'yyyy-mm-dd');
					break;
				case 'time':
					ret = fish.dateutil.format(datetime, 'yyyy-mm-dd hh:ii:ss');
					break;
				default:
					ret = fish.dateutil.format(datetime, 'yyyy-mm-dd');
					break;
			}
			return ret;
		},
		loadEMSTree:function($tree,noVer){ 
			if(!$tree) return false;
			utilAction.qryEMSInfo(function(data) {
				var treeData = [];
				if (data){//emsListÖÐ½«ems_type_codeºÍems_code·ÅÔÚÒ»ÐÐÖÐ·µ»Ø
						
                    fish.forEach(data.emsList, function(ems) {
                		
                		var verData = [];
                		if (!noVer){//ÕÒ³öemsµÄver
					
							fish.forEach(data.verList, function(ver) { //±éÀúËùÓÐemsµÄ°æ±¾
		                		if(ver.EMS_CODE == ems.EMS_CODE){
	                    			verData.push({'CAT_NAME':ver.EMS_VER_NAME,'CAT_CODE':ver.EMS_VER_CODE,'REL_ID':ems.EMS_TYPE_REL_ID+"-"+ver.EMS_VER_CODE,'type':'VER'});
	                    		}
		                    }.bind(this));
						}
                		
                		var exists = false 
                		fish.forEach(treeData,function(node,index){
                    		if(ems.EMS_TYPE_CODE == node.CAT_CODE){//Èç¹ûtreeDataÖÐÒÑ¾­ÓÐÁËemsÐÅÏ¢,ÔòÔÚÆäÏÂ×·¼Óº¢×Ó½Úµã
                    			if(!treeData[index].children) treeData[index].children = [];
                    			
                    			var emsObj = {CAT_NAME:ems.EMS_NAME,CAT_CODE:ems.EMS_CODE,'REL_ID':ems.EMS_TYPE_REL_ID,'type':'EMS',expanded: true};
                    			if(verData.length > 0) emsObj["children"] = verData;
                    			
                    			treeData[index].children.push(emsObj);
                    			exists = true;
                    			return true;
                    		}
                    	});
		                if(!exists){  //Èç¹ûtreeDataÖÐ»¹Î´ÓÐemsÐÅÏ¢,ÔòÉú³Éems½ÚµãºÍÆäº¢×Ó½Úµã      	
                        	var emsObj = {CAT_NAME:ems.EMS_NAME,CAT_CODE:ems.EMS_CODE,'REL_ID':ems.EMS_TYPE_REL_ID,'type':'EMS',expanded: true};
                    		if(verData.length > 0) emsObj["children"] = verData;
                        	
                        	treeData.push(
                        		{CAT_NAME:ems.EMS_TYPE,CAT_CODE:ems.EMS_TYPE_CODE,'REL_ID':ems.EMS_TYPE_CODE,'type':'EMS_TYPE',expanded: true,
                        			children:[emsObj]}
                        	);
                        }
                    }.bind(this));
				}
				
				$tree.jqGrid("reloadData", treeData);
				$tree.jqGrid("setSelection", (treeData.length>0)?treeData[0]:null);
			});
		},
		tab:function(el,option){
			var $el=$(el).tabs(option);

			$el.checked=function(index,flag){
				var li_array=$el.find('ul[class="ui-tabs-nav"] li')
				var li=$(li_array[index]);
				if (flag==true){
					var oldcss=li.css('borderLeft');
					li.data('ad-li-oldcss',oldcss);
					li.css({'borderLeft':'5px solid #2DC3E8'})
				}else{
                	var oldcss=li.data('ad-li-oldcss');
				    li.css({'borderLeft':oldcss});
				}
				
				console.log(li_array);
			}
			return $el;
		}
	}
});