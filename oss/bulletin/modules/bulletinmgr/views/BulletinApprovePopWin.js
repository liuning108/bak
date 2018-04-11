define([
    'text!bulletin/modules/bulletinmgr/templates/BulletinApprovePopWin.html',
    'i18n!bulletin/modules/bulletinmgr/i18n/bulletin'
], function(tpl, i18n) {
    return portal.BaseView.extend({
        template: fish.compile(tpl),

        events: {
			"click .js-ok": "ok"
        },
        
        initialize: function(options) {
            this.detail = options.data;
        },

        render: function() {
            this.setElement(this.template(i18n));
        },

        afterRender: function() {
           	// this.$form = this.$(".js-approve-form");
		},	

        ok: function(){
            if (this.$(".js-approve-form").isValid()){   
				this.detail.state = this.$(":checked").val();
				this.detail.auditReason = this.$("[name='auditReason']").val();          
				this.popup.close(this.detail);
            }   
        }
    });
    
});