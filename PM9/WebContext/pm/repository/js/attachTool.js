portal.define([
  'text!oss_core/pm/repository/templates/attachDownload.html', "oss_core/pm/repository/actions/Action.js"
], function(tpl, action) {
  return {
    htmlTpl: fish.compile(tpl),
    show: function(id) {
      var self = this;
      action.queryAttachByDocId({
        'docId': id
      }, function(data) {
        console.log("loadAttach222");
        var result = data.result;
        self.loadHtml(result)
      });
    },
    loadHtml: function(result) {
      var self = this;
      console.log("loadHtml");
      console.log(result);
      this.$el = $(self.htmlTpl({'data': result}));
      var option = {
        width: 520,
        height: 476,
        modal: false,
        draggable: true,
        content: this.$el,
        autoResizable: false
      }
      this.$popup = fish.popup(option);
      this.downloadEvent();
    },
    downloadEvent: function() {
      this.$el.find('.download').off('click').on('click', function() {
        var path = $(this).data('path');
        try {
          var url = portal.appGlobal.attributes.webroot + "/download?filePath=" + path;
          var elemIF = document.createElement("iframe");
          elemIF.src = url;
          elemIF.style.display = "none";
          document.body.appendChild(elemIF);
        } catch (e) {} //end of try
      })
    }
  }
})
