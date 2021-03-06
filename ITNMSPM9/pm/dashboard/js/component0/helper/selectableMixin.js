/**
 * Data selectable mixin for chart series.
 * To eanble data select, option of series must have `selectedMode`.
 * And each data item will use `selected` to toggle itself selected status
 *
 * @module echarts/chart/helper/DataSelectable
 */


    var zrUtil = require('zrender/lib/core/util');

    module.exports = {

        updateSelectedMap: function (targetList) {
            this._targetList = targetList.slice();
            this._selectTargetMap = zrUtil.reduce(targetList || [], function (targetMap, target) {
                targetMap.set(target.name, target);
                return targetMap;
            }, zrUtil.createHashMap());
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        // PENGING If selectedMode is null ?
        select: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            var selectedMode = this.get('selectedMode');
            if (selectedMode === 'single') {
                this._selectTargetMap.each(function (target) {
                    target.selected = false;
                });
            }
            target && (target.selected = true);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        unSelect: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            // var selectedMode = this.get('selectedMode');
            // selectedMode !== 'single' && target && (target.selected = false);
            target && (target.selected = false);
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        toggleSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            if (target != null) {
                this[target.selected ? 'unSelect' : 'select'](name, id);
                return target.selected;
            }
        },

        /**
         * Either name or id should be passed as input here.
         * If both of them are defined, id is used.
         *
         * @param {string|undefined} name name of data
         * @param {number|undefined} id dataIndex of data
         */
        isSelected: function (name, id) {
            var target = id != null
                ? this._targetList[id]
                : this._selectTargetMap.get(name);
            return target && target.selected;
        }
    };
