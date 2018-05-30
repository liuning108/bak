/**
 * Title: DirOrMenuItems.js
 * Description: Directory Or Menu Items
 * Author: wu.yangjin
 * Created Date: 15-4-13 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(['modules/dirmenumgr/models/DirOrMenuItem'], function(DirOrMenuItem) {
	return Backbone.Collection.extend({
		model: DirOrMenuItem,

		/**
		 * fire one `add' event for all adding models instead of each model
		 */
		add: function(models, option) {
			option = option || {};
			if (fish.isArray(models)) {
				Backbone.Collection.prototype.add.call(this, models,
					fish.extend(option, {silent: true}));
				if (!option.silent) {
					this.trigger("add", new Backbone.Collection(models), this);
				}
			} else {
				Backbone.Collection.prototype.add.call(this, models, option);
			}
		},

		/**
		 * fire one `remove' event for all removing models instead of each model
		 */
		remove: function(models, option) {
			option = option || {};
			if (fish.isArray(models)) {
				Backbone.Collection.prototype.remove.call(this, models,
					fish.extend(option, {silent: true}));
				if (!option.silent) {
					this.trigger("remove", new Backbone.Collection(models), this);
				}
			} else {
				Backbone.Collection.prototype.remove.call(this, models, option);
			}
		}
	});
});
