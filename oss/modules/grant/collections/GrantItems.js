/**
 * Title: GrantItems.js
 * Description: Grant Items
 * Author: wu.yangjin
 * Created Date: 15-4-13 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return Backbone.Collection.extend({
		/**
		 * fire one `add' event for all adding models instead of each model
		 */
		add: function(models, option) {
			option = option || {};
			if (fish.isArray(models)) {
				Backbone.Collection.prototype.add.call(this, models,
					fish.extend({silent: true}, option));
				if (!option.silent) {
					this.trigger("add", new Backbone.Collection(models), this);
				}
			} else {
				Backbone.Collection.prototype.add.call(this, models, option);
			}
			return this;
		},

		/**
		 * fire one `remove' event for all removing models instead of each model
		 */
		remove: function(models, option) {
			option = option || {};
			if (fish.isArray(models)) {
				Backbone.Collection.prototype.remove.call(this, models,
					fish.extend({silent: true}, option));
				if (!option.silent) {
					this.trigger("remove", new Backbone.Collection(models), this);
				}
			} else {
				Backbone.Collection.prototype.remove.call(this, models, option);
			}
			return this;
		}
	});
});
