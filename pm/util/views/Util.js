portal.define([
	'oss_core/pm/util/actions/UtilAction',
	'i18n!i18n/common',
	'i18n!oss_core/pm/util/i18n/util',
	"css!oss_core/pm/util/css/ad-block.css",
	"css!oss_core/pm/util/css/ad-component.css",
    "css!oss_core/pm/util/css/ad-util-component.css",
    "css!oss_core/pm/util/css/scheduleView.css",
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
				if (data){//emsList中将ems_type_code和ems_code放在一行中返回

                    fish.forEach(data.emsList, function(ems) {

                		var verData = [];
                		if (!noVer){//找出ems的ver

							fish.forEach(data.verList, function(ver) { //遍历所有ems的版本
		                		if(ver.EMS_CODE == ems.EMS_CODE){
	                    			verData.push({'CAT_NAME':ver.EMS_VER_NAME,'CAT_CODE':ver.EMS_VER_CODE,'REL_ID':ems.EMS_TYPE_REL_ID+"-"+ver.EMS_VER_CODE,'type':'VER'});
	                    		}
		                    }.bind(this));
						}

                		var exists = false
                		fish.forEach(treeData,function(node,index){
                    		if(ems.EMS_TYPE_CODE == node.CAT_CODE){//如果treeData中已经有了ems信息,则在其下追加孩子节点
                    			if(!treeData[index].children) treeData[index].children = [];

                    			var emsObj = {CAT_NAME:ems.EMS_NAME,CAT_CODE:ems.EMS_CODE,'REL_ID':ems.EMS_TYPE_REL_ID,'type':'EMS',expanded: true};
                    			if(verData.length > 0) emsObj["children"] = verData;

                    			treeData[index].children.push(emsObj);
                    			exists = true;
                    			return true;
                    		}
                    	});
		                if(!exists){  //如果treeData中还未有ems信息,则生成ems节点和其孩子节点 
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
				
				var li_array=$el.find('ul[class*="ui-tabs-nav"] li');

				var li=$(li_array[index]);
				if (flag==true){
					li.find('.glyphicon-ok').show();
				}else{
                	 li.find('.glyphicon-ok').hide();
				}

			}
			return $el;
		},
		extContains: function(){
			jQuery.expr[':'].contains = function(a, i, m) {  
	 
			  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;  
			 
			}; 
		},
	}
});
