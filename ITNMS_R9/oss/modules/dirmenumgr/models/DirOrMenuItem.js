/**
 * Title: DirOrMenuItem.js
 * Description: Directory Or Menu Component Item
 * Author: wu.yangjin
 * Created Date: 15-4-24 下午15:45
 * Copyright: Copyright 2015,+INF ZTESOFT, Inc.
 */
define(function() {
	return fish.Model.extend({
		idAttribute: 'privId',

		defaults: {
			'state': null,
			'dirId': null,
			'stateDate': null,
			'dirName': null,
			'menuId': null,
			'menuName': null,
			'privId': null,
			'privName': null,			
			'url': null,
			'parent': null,
			'isLeaf': true
		},

		initialize: function() {
			if (this.has('dirId')) {
				this.set('privId', this.get('dirId'));
				this.set('privName', this.get('dirName'));
				this.set('isLeaf', false);
			} else if (this.has('menuId')) {
				this.set('privId', this.get('menuId'));
				this.set('privName', this.get('menuName'));
				this.set('url', this.get('menuUrl'));
			} else if (this.has('privId')) {
				if (this.get('privType') === 'M') {
					this.set('menuId', this.get('privId'));
					this.set('menuName', this.get('privName'));
					this.set('menuUrl', this.get('url'));
				}
			}
		}
	});
});