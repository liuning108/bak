/**
 * Adhoc工具
 */
define([
        "oss_core/pm/util/views/Util"
    ],
    function(pmUtil) {
        return {

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
                    case 'BT' : fmtName = "Between";break;
                    case 'EQ' : fmtName = "Equal to";break;
                    case 'NEQ' : fmtName = "Not equal to";break;
                    case 'CONT' : fmtName = "Contain";break;
                    case 'NCONT' : fmtName = "Does not contain";break;
                    case 'GT' : fmtName = "Greater than";break;
                    case 'LW' : fmtName = "Less than";break;
                    case 'GE' : fmtName = "Greater than or equal to";break;
                    case 'LE' : fmtName = "Less than or equal to";break;
                    case 'INCLUDE' : fmtName = "Include";break;
                    case 'EXCLUDE' : fmtName = "Exclude";break;
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

            toThousands: function(num) {
                var num = (num || 0).toString(), result = '';
                var decimal = "";
                if(num.indexOf(".")!=-1){
                    decimal = num.substring(num.indexOf("."));
                    num = num.substring(0, num.indexOf("."));
                }
                var isNegative = false;
                if(num.substring(0,1)=="-"){
                    isNegative = true;
                    num = num.substring(1,num.length);
                }
                while (num.length > 3) {
                    result = ',' + num.slice(-3) + result;
                    num = num.slice(0, num.length - 3);
                }
                if (num) { result = num + result; }
                if (isNegative) { result = "-" + result; }
                return result + decimal;
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
            }

        }
    }
);