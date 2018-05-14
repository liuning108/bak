portal.define([
  'text!oss_core/pm/repository/templates/PerviewPage.html', 'text!oss_core/pm/repository/templates/comment.html', "oss_core/pm/repository/actions/Action.js"
], function(tpl, comment, action) {
  return {
    browserTpl: fish.compile(tpl),
    commentTpl: fish.compile(comment),
    show: function($el, json, parent) {
      this.$el = $el;
      this.json = json;
      this.parent = parent;
      this.render();
    },
    render: function() {
      var self = this;
      this.json.stateName = '预览';
      console.log(self.json);
      this.$el.html(this.browserTpl(this.json));
      this.afterRender();
    },
    afterRender: function() {
      var self = this;
      self.$el.find('.body').html(self.json.context);
      self.$el.find('.comebackList').on('click', function() {
        self.parent.comeback();
      })

    }
  }

})
