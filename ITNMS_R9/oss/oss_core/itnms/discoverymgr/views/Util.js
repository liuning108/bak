/**
 * 工具
 */
define([
        'i18n!oss_core/itnms/discoverymgr/i18n/discoverymgr'
    ],
    function(i18nData) {
        return {

            resource: fish.extend({}, i18nData),

            trim: function (str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            },

            definedRound: function(v,e) {
                var t=1;
                for(;e>0;t*=10,e--);
                for(;e<0;t/=10,e++);
                return Math.round(v*t)/t;
            },

            guid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            }

        }
    }
);