portal.define(['text!oss_core/pm/repository/templates/searchSolr.html'
              ,"oss_core/pm/repository/actions/Action.js",
              "oss_core/pm/repository/js/BrowsePage.js",
            ], function(tpl,action,BrowsePage) {
  return {
    searchSolrTpl:fish.compile(tpl),
    show: function($el, parent,searchKey,queryObj) {
      var self =this;
      self.$el = $el;
      self.parent = parent;
      self.searchKey=searchKey;
      self.queryObj= queryObj;
      self.querySolrByKey()
    },
    querySolrByKey:function(){
      var self =this;
      action.querySolrByKey(self.queryObj,function(data){
          console.log(data);
          console.log();
          self.render(data.result);
       })

    },
    render: function(data) {
      var self =this;
      this.$el.html(this.searchSolrTpl({
        'data':data,
        'searchKey':this.searchKey,
      }));
      this.afterRender(data);
      this.resizeHight()
    },

    pageination:function(count,queryObj,fun){
      var self =this;
      $('#pagination-solrList').pagination({
        records: Number(count),
        rowNum:Number(queryObj.rowNums),
        rowList:[],
        pgInput:false,
        pgRecText:false,
        start:Number(queryObj.page),
        onPageClick:function(e,eventData){
          queryObj.page=eventData.page;
          self[fun](queryObj);
        }
      })
    },

    afterRender: function(data) {
      var self = this;
      this.closeSeachSolrView();
      this.pageination(data.count,self.queryObj,'querySolrByKey')
      this.listEvent();
    },
    listEvent:function(){
      var self=this;
      this.$el.find('.docTile2').off('click').on('click',function(){
        var id =$(this).data('docid');
        action.queryKnowLedge({
          'id': id
        }, function(data) {
          var result = data.result;
          var json = self.toModelJson(result);
          if(json.rRole=='1'){
              var curUserId=""+portal.appGlobal.get('userId');
               if(json.userId!=curUserId)
               {
                  fish.toast('warn', '作者设置了只能本人查看');
                  return;
               }
          }
          self.parent.$el.find('.searchBar').hide();
          BrowsePage.create().show(self.$el, json, self, self.queryObj, null);
        })
      })

    },
    resizeHight: function(k) {
       if(!k)k=0;
       var height = $(document).outerHeight();
           height=height-(height*0.35)-k;
          this.$el.find('.solrItemlist').slimscroll({
            height:height+"px"
         })
    },
    comeback:function(queryObj){
      var self =this;
      self.parent.$el.find('.searchBar').show();
      self.queryObj=queryObj;
      self.querySolrByKey();
    },
    toModelJson: function(result) {
      console.log("toModelJson");
      console.log(result);
      return {
        id: result.doc.ID || "0",
        bNo: result.doc.DOC_TYPE_NO || "",
        sNo: result.doc.SUB_DOC_TYPE_NO || "",
        context: result.doc.content || "",
        domainNo: result.doc.DOMAIN_NO || "",
        state: result.doc.STATE || "00",
        title: result.doc.TITLE || "",
        rRole: result.doc.R_ROLE,
        wRole: result.doc.W_ROLE,
        keys: result.doc.KEYS || '',
        tags: result.doc.TAGS || '',
        attrNos: result.attrNos,
        VHC: result.doc.VOTE_HELP_COUNT || 0,
        VNC: result.doc.VOTE_NOHELP_COUNT || 0,
        userId:""+result.doc.OPER_USER

      }
    },
    closeSeachSolrView: function() {
      var self = this;
      this.$el.find('.comeback').click(function() {
        self.parent.closeSeachSolrView();
      })
    }

  }
});
