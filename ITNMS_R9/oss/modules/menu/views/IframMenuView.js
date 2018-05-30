define(["text!modules/menu/templates/IframMenuView.html"], function(template) {
	return portal.BaseView.extend({
		render: function() {
            this.setElement(template);
		}
	})
});