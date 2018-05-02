portal.define([
  'text!oss_core/pm/repository/templates/docListView.html',
  'text!oss_core/pm/repository/templates/OrderMethodLi.html',
  'text!oss_core/pm/repository/templates/filterValueMethod.html',
     "i18n!oss_core/pm/repository/i18n/i18n",
   "oss_core/pm/repository/actions/Action.js",
    "oss_core/pm/repository/js/BrowsePage.js", "css!oss_core/pm/repository/css/style.css"
], function(tpl,orderTpl,filterValueMethodTxt, i18nData, action, BrowsePage) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    orderLiTpl:fish.compile(orderTpl),
    filterValueMethodTpl:fish.compile(filterValueMethodTxt),
    render: function() {
      return this;
    },
    initialize: function(config) {
      this.config = config;
      this.pageRowNum=20;
      console.log("initialize");
      console.log(this.config);
      this.headerIcon(config.data)
      var self =this;
    
    },
    afterRender: function() {

      // action.getIndexDoclist()
      //    this.$el.html(this.template(i18nData));
      // alert("DocList")



    },
    getIndexDoclist: function(stateValue) {
      var self = this;
      var queryObj={
        'state': stateValue,
        'page':1,
        'rowNums':self.pageRowNum
      }
     self.getIndexDoclistAction(queryObj);

    },
    getIndexDoclistAction:function(queryObj){
      var self  =this;
      var orderByStr=self.config.parentView.orderByStr.split('|');
      queryObj.oderByF=orderByStr[0];
      queryObj.oderByM=orderByStr[1];
      var filterSearchValues=[];
      var $navSVC= self.config.parentView.$el.find('.navSearchValuesChooise');
      if($navSVC.length>0){
        var types=$navSVC.data('type').split('|');
       filterSearchValues.push({
            value:$navSVC.data('value'),
            field:types[0],
            oper:types[1]
       })
      }
      queryObj.filterSearchValues=filterSearchValues;
      self.getIndexDoclistQueryObj=queryObj;
      action.getIndexDoclist(queryObj, function(data) {
        var doclists = data.result.doclists;
        var cnt =data.result.cnt;
        if (!doclists)
          doclists = [];
        var emptyFlag = doclists.length <= 0;
        console.log("getIndexDoclist");
        console.log(doclists);
        var doclists=fish.map(doclists,self.hasPower)
        self.$el.html("");
        self.$el.height(0);
        self.$el.html(self.template({emptyTure: emptyFlag, doctList: doclists}));
        self.pageination(cnt,queryObj,'getIndexDoclistPage');
        self.resizeHight();
        self.listEvent(queryObj.state, false);
        self.headerIconIndexEvent();
      })
    },
    headerIconIndexEvent:function(){
      var self =this;
      self.filterEvent=self.filterValueIndexApply;
      self.orderByEvent=self.orderByIndex;



       //alert(1)
    },
    filterValueIndexApply:function(){
       var self =this;
       self.getIndexDoclistAction(self.getIndexDoclistQueryObj)
    },
    filterValueApply:function(){
      var self =this;
      self.config.parentView.treeView.toQueryList()
    },
    orderByIndex:function(){
      var self =this;
      self.getIndexDoclistAction(self.getIndexDoclistQueryObj)
    },

    orderByNoIndex:function(){
      var self =this;
      self.config.parentView.treeView.toQueryList();
    },

    // filterValueApply:function(){
    //   alert('no Index'),
    // },
    headerIconEvent:function(){
      var self =this;
      self.filterEvent=self.filterValueApply;
      self.orderByEvent=self.orderByNoIndex;

    },
    headerIcon:function(initData,applyBtn,liBtn){
      var self =this;
      var headerIconFilter =this.config.parentView.$el.find('.headerIconFilter')
      var sortOrderList =this.config.parentView.$el.find('.sortOrderList')
      var $sortOrderEl= $(self.orderLiTpl(initData));
      sortOrderList.popover({
        html:true,
        template: '<div class="popover headerPopver" role="tooltip"><div class="arrow" style="right:0px"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        placement: 'bottom-right',
        title: '排序方式',
        content: $sortOrderEl
      });
      $sortOrderEl.find('li').off('click').on('click',function(){
        $sortOrderEl.find('li.active').removeClass('active');
        $(this).addClass('active');
        self.config.parentView.orderByStr=$(this).data('value')
        self.orderByEvent();
        sortOrderList.popover('hide');
      });
      if(!self.config.parentView.orderByStr){
        self.config.parentView.orderByStr=$sortOrderEl.find('li:first').data('value');
      }
      $sortOrderEl.find('li[data-value="'+self.config.parentView.orderByStr+'"]').addClass("active");

      var $elFilter=$(self.filterValueMethodTpl());
      var $filterPopver=headerIconFilter.popover({
        html:true,
        template: '<div class="popover headerPopver" role="tooltip"><div class="arrow" style="right:0px"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        placement: 'bottom-right',
        title: '过滤设置',
        content: $elFilter
      });
      $elFilter.find('.applyBtn').off('click').on('click',function(){
           self.filterEvent();
      });
       var dsOrderDatas=fish.map(initData.result0,function(d){
         return  {
           'name': d.NAME,
           'value': d.FNO + "|" + d.OPER
         }
       })
       var comMethodInput=$elFilter.find('.comMethodInput').combobox({
            placeholder: 'Select a State',
            dataTextField: 'name',
            dataValueField: 'value',
            editable: false,
            dataSource: dsOrderDatas,
        });
        comMethodInput.combobox('value', dsOrderDatas[0].value)
        $elFilter.find('.applyBtn').off('click').on('click', function() {
          var value = $elFilter.find('.comValueInput').val();
          var $navValues = self.config.parentView.$el.find('.navSearchValues');
          if (value.length > 0) {
            $navValues.addClass('navSearchValuesChooise')
            $navValues.data('value', value);
            $navValues.data('type', comMethodInput.combobox('value'));
          } else {
            $navValues.removeClass('navSearchValuesChooise')
            $navValues.data('value', "");
            $navValues.data('type', "");
          }
        //  self.config.parentView.treeView.toQueryList();
          self.filterEvent();
          $filterPopver.popover('hide');

        })
        //comMethodInput.combobox('value',dsOrderDatas[0].value);
    },
    hasPower:function(d){
      var curUserId=""+portal.appGlobal.get('userId');
       d.hasPower=(d.USER_ID===curUserId) || d.W_ROLE==='0';
       return d;
    },
    getIndexDoclistPage: function(queryObj) {
      var self = this;
     self.getIndexDoclistAction(queryObj);
    },
    pageination:function(count,queryObj,fun){
      var self =this;
      $('#pagination-docList').pagination({
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
    toQueryList: function(queryObj) {
      var self = this;

      queryObj.page=1;
      queryObj.rowNums=self.pageRowNum;

      self.toQueryListAction(queryObj);
    },
    toQueryListPage: function(queryObj) {
      var self = this;
      self.toQueryListAction(queryObj);
    },
    toQueryListAction:function(queryObj){
      var self =this;
      action.queryDocList(queryObj, function(data) {
        var doclists = data.result.doclists;
        if (!doclists)doclists = [];
        var emptyFlag = doclists.length <= 0;
        console.log("getIndexDoclist");
        console.log(doclists);
        var doclists=fish.map(doclists,self.hasPower)
        self.$el.html("");
        self.$el.height(0);
        self.$el.html(self.template({emptyTure: emptyFlag, doctList: doclists}));
         self.resizeHight(30);
        self.pageination(data.result.cnt,queryObj,"toQueryListPage");
        self.listEvent(queryObj, true);
        self.headerIconEvent();

      })
    },
    listEvent: function(queryObj, fflag) {
      var self = this;
      self.$el.find('.DocListLi').find('.edit').off('click').on('click', function() {
        var id = $(this).data('id')
        action.queryKnowLedge({
          'id': id
        }, function(data) {
          console.log("queryKnowLedge");
          var result = data.result;
          var json = self.toModelJson(result);
          console.log(json);
          self.config.parentView.respositoryNew(json);

        })
      });

      self.$el.find('.DocListLi').find('.remove').off('click').on('click', function() {
        var id = $(this).data('id')
        fish.confirm('确认是否删除该文章').result.then(function() {
            action.delKnowLedge({
              'id': id
            }, function(data) {
              if (fflag) {
                self.toQueryList(queryObj);
              } else {
                self.getIndexDoclist(queryObj);
              }
            })
            fish.toast('success', '操作成功')
       });

      });

      self.$el.find('.DocListLi').find('.docTile').off('click').on('click', function() {
        var id = $(this).data('id')
        action.queryKnowLedge({
          'id': id
        }, function(data) {
          console.log("queryKnowLedge");
          var result = data.result;
          var json = self.toModelJson(result);
          console.log(json);
          self.config.parentView.$el.find('.RepositoryContext').hide();
          var $el = self.config.parentView.$el.find('.browserKnowlege').show()
          BrowsePage.create().show($el, json, self, queryObj, fflag);
        })
      })

      self.$el.find('.blueBtn').off('click').on('click',function(){
        self.config.parentView.respositoryNew({id: '0', sNo: '', bNo: '', domainNo: ''});
      })

    },
    comeback: function(queryObj, fflag) {
      var self = this;
      self.config.parentView.$el.find('.browserKnowlege').hide();
      self.config.parentView.$el.find('.RepositoryContext').show();
      if (fflag) {
        self.toQueryList(queryObj);
      } else {
        self.getIndexDoclist(queryObj);
      }
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
        VNC: result.doc.VOTE_NOHELP_COUNT || 0
      }
    },
    resizeHight: function(k) {
       if(!k)k=0;
       var height = $(document).outerHeight();
           height=height-(height*0.35)-k;
          this.$el.find('.doctListUL').slimscroll({
            height:height+"px"
         })
    }
  })
})
