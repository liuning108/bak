/**
 * Created by CT on 2016/2/3 0003.
 * Title: MetadataAction.js
 * Description: metadata data process
 */
portal.define(function () {
    return {

        /*
         * description: 拆分成物理的和逻辑的2个list
         * @param  metadataTypeArray original metadata type array
         */
        divideSpecificationArray: function (specificationArray) {
            var returnArray = [];
            var physicalArray = [];
            var businessArray = [];
            var typeSize = specificationArray.length;
            for (var i = 0; i < typeSize; i++) {
                if (specificationArray[i].specificationType==="0") {
                    physicalArray[physicalArray.length] = specificationArray[i];
                }
                else {
                    businessArray[businessArray.length] = specificationArray[i];
                }
            }
            returnArray[0] = physicalArray;
            returnArray[1] = businessArray;
            return returnArray;
        },

        /*
         * description: catalog list转换 增加 属性设置
         * @param  metadataTypeArray original metadata type array
         */
        transformCatalogArray: function (catalogArray) {
            var size = catalogArray.length;
            for (var i = 0; i < size; i++) {
                catalogArray[i].open = false;
                catalogArray[i].isParent = true;
                catalogArray[i].name = catalogArray[i].nodeName;
            }
            return catalogArray;
        },

        /*
         * description: catalog list转换 增加 属性设置
         * @param  metadataTypeArray original metadata type array
         */
        transformInstanceArray: function (instanceArray, viewImg) {
            var size = instanceArray.length;
            for (var i = 0; i < size; i++) {
                instanceArray[i].icon = viewImg;
                instanceArray[i].name = instanceArray[i].nodeName;
            }
            return instanceArray;
        }


    }
});