define([
       'modules/dynamicmenu/views/DynamicView'
], function(DynamicView) {
    return DynamicView.extend({
        //示例写法，支持继承框架的DynamicView
        initialize: function() {
            console.log("this ucc test menu!");
            return DynamicView.prototype.initialize.call(this);
        }
        // render,afterRender,resize......
    })
})
