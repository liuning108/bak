/**
 * Adhoc工具
 */
define([
        "oss_core/pm/util/views/Util",
        'i18n!oss_core/pm/adhocdesigner/i18n/adhoc'
    ],
    function(pmUtil, i18nData) {
        return {

        	resource: fish.extend({}, i18nData),
        		
            getLineChartOption: function(topic) {
                var dp1 = this.getSimuData(5, 20, 40);
                var option = {
                    topic_no: topic.TOPIC_NO,
                    title : {
                        text: topic.TOPIC_NAME,
                        subtext: ''
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['Cell_1','Cell_2','Cell_3','Cell_4','Cell_5']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            max : 100
                        }
                    ],
                    series : [
                        {
                            name:'CNDROP-CNRELCONG',
                            type:'line',
                            data: dp1
                        }
                    ]
                };
                return option;
            },

            getColChartOption: function(topic) {
                var dp1 = this.getSimuData(5, 100, 0);
                var dp2 = this.getSimuData(5, 100, 0);
                var option = {
                    topic_no: topic.TOPIC_NO,
                    title : {
                        text: topic.TOPIC_NAME,
                        subtext: ''
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            data : ['BTS_1','BTS_2','BTS_3','BTS_4','BTS_5']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            max : 100
                        }
                    ],
                    series : [
                        {
                            name: 'CNDROP-CNRELCONG',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#b8f1cc',
                                    label: {
                                        show: false,
                                        position: 'top',
                                        formatter: '{b}\n{c}'
                                    }
                                }
                            },
                            data: dp1
                        },
                        {
                            name: 'CNSCAN',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#42a5f5',
                                    label: {
                                        show: false,
                                        position: 'top',
                                        formatter: '{b}\n{c}'
                                    }
                                }
                            },
                            data: dp2
                        }
                    ]
                };
                return option;
            },

            getSimuData: function (dataCount, base, lowest) {
                var dp = [];
                for(var i=0; i<dataCount; i++){
                    dp[dp.length] = this.definedRound(Math.random()*base+lowest,2);
                }
                return dp;
            },

            trim: function (str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },

            definedRound: function(v,e) {
                var t=1;
                for(;e>0;t*=10,e--);
                for(;e<0;t/=10,e++);
                return Math.round(v*t)/t;
            },

            mappingFilterFormatterName: function (fmtId) {
                var fmtName;
                switch(fmtId){
                    case 'BT' : fmtName = this.resource.BETWEEN;break;
                    case 'EQ' : fmtName = this.resource.EQUAL_TO;break;
                    case 'NEQ' : fmtName = this.resource.NOT_EQUAL_TO;break;
                    case 'CONT' : fmtName = this.resource.CONTAIN;break;
                    case 'NCONT' : fmtName = this.resource.NOT_CONTAIN;break;
                    case 'GT' : fmtName = this.resource.GREATER_THAN;break;
                    case 'LW' : fmtName = this.resource.LESS_THAN;break;
                    case 'GE' : fmtName = this.resource.GREATER_THAN_OR_EQUAL_TO;break;
                    case 'LE' : fmtName = this.resource.LESS_THAN_OR_EQUAL_TO;break;
                    case 'INCLUDE' : fmtName = this.resource.INCLUDE;break;
                    case 'EXCLUDE' : fmtName = this.resource.EXCLUDE;break;
                }
                return fmtName;
            },

            guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            },

            parseGranuModeJson: function (granuModeStr) {
                var granuStr = "";
                var granuNameStr = "";
                var granuModeArray = JSON.parse(granuModeStr);
                for(var i=0;i<granuModeArray.length;i++) {
                    var granuObj = granuModeArray[i];
                    var granu = granuObj.GRANU;
                    var granuName;
                    fish.forEach(pmUtil.paravalue("GRANU"), function (para) {
                        if (para[pmUtil.parakey.val] == granu) {
                            granuName = para[pmUtil.parakey.name];
                        }
                    });
                    if(i==granuModeArray.length-1){
                        granuStr += granu;
                        granuNameStr += granuName;
                    }else{
                        granuStr += granu + ",";
                        granuNameStr += granuName + ",";
                    }
                }
                return {
                    granuStr: granuStr,
                    granuNameStr: granuNameStr
                }
            },

            compare: function (obj1, obj2) {
                var val1 = obj1.name;
                var val2 = obj2.name;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },

            deepCopy: function(p, c) {
                var c = c || {};
                for (var i in p) {
                    if (typeof p[i] === 'object') {
                        c[i] = (p[i].constructor === Array) ? [] : {};
                        deepCopy(p[i], c[i]);
                    } else {
                        c[i] = p[i];
                    }
                }
                return c;
            },

            HashMap: function () {
                //定义长度
                var length = 0;
                //创建一个对象
                var obj = new Object();

                /**
                 * 判断Map是否为空
                 */
                this.isEmpty = function(){
                    return length == 0;
                };

                /**
                 * 判断对象中是否包含给定Key
                 */
                this.containsKey=function(key){
                    return (key in obj);
                };

                /**
                 * 判断对象中是否包含给定的Value
                 */
                this.containsValue=function(value){
                    for(var key in obj){
                        if(obj[key] == value){
                            return true;
                        }
                    }
                    return false;
                };

                /**
                 *向map中添加数据
                 */
                this.put=function(key,value){
                    if(!this.containsKey(key)){
                        length++;
                    }
                    obj[key] = value;
                };

                /**
                 * 根据给定的Key获得Value
                 */
                this.get=function(key){
                    return this.containsKey(key)?obj[key]:null;
                };

                /**
                 * 根据给定的Key删除一个值
                 */
                this.remove=function(key){
                    if(this.containsKey(key)&&(delete obj[key])){
                        length--;
                    }
                };

                /**
                 * 获得Map中的所有Value
                 */
                this.values=function(){
                    var _values= new Array();
                    for(var key in obj){
                        _values.push(obj[key]);
                    }
                    return _values;
                };

                /**
                 * 获得Map中的所有Key
                 */
                this.keySet=function(){
                    var _keys = new Array();
                    for(var key in obj){
                        _keys.push(key);
                    }
                    return _keys;
                };

                /**
                 * 获得Map的长度
                 */
                this.size = function(){
                    return length;
                };

                /**
                 * 清空Map
                 */
                this.clear = function(){
                    length = 0;
                    obj = new Object();
                };
            },

            getColorSeriesCount: function() {
                return 9;//colorList.length
            },

            getColorSeries: function(index) {
                var colorList = ["#F35352", "#5182E4", "#F7CB4A", "#3FB27E", "#F88D48", "#51B4F1",
                "#5156B8", "#69D4DB", "#CE62D6"];
                return colorList[index%colorList.length];
            },

            rgbToHex: function(rgbStr){
                if(/^(rgb|RGB)/.test(rgbStr)){
                    var aColor = rgbStr.replace(/(?:||rgb|RGB)*/g,"").split(",");
                    var strHex = "#";
                    for(var i=0; i<aColor.length; i++){
                        if(i==0){
                            aColor[i] = aColor[i].substring(1);
                        }
                        if(i==2){
                            aColor[i] = aColor[i].substring(0,aColor[i].length-1);
                        }
                        var hex = Number(aColor[i]).toString(16);
                        if(hex === "0"){
                            hex += hex;
                        }
                        strHex += hex;
                    }
                    if(strHex.length !== 7){
                        strHex = rgbStr;
                    }
                    return strHex;
                }else if(reg.test(rgbStr)){
                    var aNum = rgbStr.replace(/#/,"").split("");
                    if(aNum.length === 6){
                        return rgbStr;
                    }else if(aNum.length === 3){
                        var numHex = "#";
                        for(var i=0; i<aNum.length; i+=1){
                            numHex += (aNum[i]+aNum[i]);
                        }
                        return numHex;
                    }
                }else{
                    return rgbStr;
                }
            }
        }
    }
);