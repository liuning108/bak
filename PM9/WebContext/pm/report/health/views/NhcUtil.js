/**
 *
 */
define([

    ],
    function() {
        return {

        formatCSTDate: function (strDate,format){
            return this.formatDate(strDate,format);
        },

        paddNum: function(num){
            num += "";
            return num.replace(/^(\d)$/,"0$1");
        },

        formatDate: function (date,format){
            //指定格式字符
            var yyyy = date.getFullYear(); //年 : 4位
            var MM = this.paddNum(date.getMonth() + 1); //月 : 如果1位的时候补0
            var dd = this.paddNum(date.getDate());//日 : 如果1位的时候补0
            var hh = this.paddNum(date.getHours());  //时
            var mm = this.paddNum(date.getMinutes()); //分
            var ss = this.paddNum(date.getSeconds()); //秒
            var dateStr = yyyy+"-"+MM+"-"+dd+" "+hh+":"+mm+":"+ss;
            return dateStr;
        },

        guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
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