define([
    'text!bulletin/modules/bulletinmgr/templates/BulletinDetailPopWin.html',
    'i18n!bulletin/modules/bulletinmgr/i18n/bulletin',
    'bulletin/modules/bulletinmgr/actions/BulletinAction',
    "css!bulletin/modules/bulletinmgr/css/bulletin"
], function(tpl, i18n, BulletinAction) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),
               
        initialize: function(options) {
            this.title = options.title;
            this.content = options.content;
            this.typeName = options.typeName;
            this.levelName = options.levelName;
            this.stateDate = options.stateDate;
        },

        render: function() {
            i18n.BULLETIN_DETAIL_TITLE = this.title;
            i18n.typeName = this.typeName;
            i18n.levelName = this.levelName;
            i18n.stateDate = this.stateDate;
            this.setElement(this.template(i18n));
        },

        afterRender: function() {
            if(this.content){
                this.$(".content").append(this.content);
            }
          
		}
    });
    
});