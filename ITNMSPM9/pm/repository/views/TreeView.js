portal.define([
  'text!oss_core/pm/repository/templates/TreeView.html',
  'text!oss_core/pm/repository/templates/RootView.html',
  'text!oss_core/pm/repository/templates/SubView.html',
  'text!oss_core/pm/repository/templates/SubViewTree.html',
   "i18n!oss_core/pm/repository/i18n/i18n",
    "oss_core/pm/repository/actions/Action.js",
      "oss_core/pm/repository/js/moreOptionsWin.js",
    "css!oss_core/pm/repository/css/style.css"
], function(tpl,rootTpl,subTpl,subViewTreeTpl, i18nData,action, moreOptionsWin) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    rootTpl:fish.compile(rootTpl),
    subTpl:fish.compile(subTpl),
    subTreeTpl:fish.compile(subViewTreeTpl),
    initialize: function(config) {
      this.config = config;
      console.log("initialize");
      console.log(this.config);
    },
    render: function() {
      //this.$el.html(this.template(i18nData));
      return this;
    },
    afterRender: function() {
      var self =this;
      this.createIndexTree();
      self.config.parentView.$el.find('.navOrderBy')
                                .off('change')
                                .on('change',function(){
                                  self.toQueryList();
                                })

    },
    toModel:function(d){
      return {
         id: ""+d.ID,
         name: ""+d.NAME,
         pid: ""+d.PID,
         bNo:""+d.BNO,
         sNo:""+d.SNO
      }
    },
    getIndexDoclist:function() {
      var self =this;
      $state=self.config.parentView.$el.find('.docListHeader').find('.active');
      self.config.parentView.isIndex=true;
      self.config.parentView.docListView.getIndexDoclist($state.data("value"));
    },
    createIndexTree: function(data) {
      var self=this;
      self.getIndexDoclist()
       action.getRootTree(function(data){
         var result = data.result;
            self.clearNavBar();
            var datas = fish.map(result,self.toModel);
            self.$el.html("");
            var treeView =$(self.template()).appendTo(self.$el);
            var treeContext=treeView.find('.TreeMenu')
            self.createTree(datas, '0',treeContext);

            if(data){
              var $li =treeView.find('.TreeMenu').find('#repositoryBigLi_'+data.id);
              $li.find('.headingArrow')
                     .removeClass('glyphicon-menu-down')
                     .addClass('glyphicon-menu-up')
              $li.find('.subTree').show();
              $li.show();
            }
    });

    },
    createTree: function(datas, pid,treeContext) {
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        if (data.pid === pid) {
          if (pid === '0') {
              data.context=this.subView(treeContext,data,this.rootTpl);
          } else {
             data.context=this.subView(treeContext,data,this.subTpl);
          }
          this.createTree(datas, data.id,data.context);
        }
      }
    },
    subView:function(treeContext,data,tpl,d){
      var self =this;
      var subView= $(tpl(data)).appendTo(treeContext)
      subView.find('.broadHeading').off("click").on('click',function(){
         self.treeClickFun(subView,data)
      })
      return  subView.find('.subTree');
    },
    treeClickFun:function(subView,data){
         if (data.pid==='0'){

           var subTree =subView.find('.subTree')
            if(subTree.is(":hidden")){
              subView.find('.headingArrow')
                     .removeClass('glyphicon-menu-down')
                     .addClass('glyphicon-menu-up')
              subTree.show(200);
            }else{
              subView.find('.headingArrow')
                     .removeClass('glyphicon-menu-up')
                     .addClass('glyphicon-menu-down')
              subTree.hide(200);
            }
        }else{

           this.showNavBar();
           this.createSubViewTree(data);
        }
    },
    showNavBar:function(){
      this.config.parentView.$el.find('.navBar').show();
    },
    clearNavBar:function() {
      this.config.parentView.$el.find('.navBar').hide();
    },
    createSubViewTree:function(data){
       var self =this;
       this.bulidSubViewTreeData(data,function(subViewTreeData,dictDatas){
         self.getBulidNav(subViewTreeData,dictDatas);
         self.bulidSubViewTreeHTML(subViewTreeData);
       });
      //
    //  this.bulidSubViewTreeHTML(subViewTreeData);
    },
    getBulidNavData:function(data,datas){
      var navDatas=[];
      var current=data;
     while(current.pid!='0'){
         var parent=fish.findWhere(datas,{id:""+current.pid});
         current=parent;
         navDatas[navDatas.length]=current;
     }

      return navDatas.reverse();


    },
    navBarHtml:function(data,str){
        return "<span data-id="+data.id+" data-pid="+data.pid+">"+data.name+"</span>"+str;
    },

    getBulidNav:function(data,dictDatas){
       var self =this;

       self.currentData= data;
       console.log("getBulidNav");
       console.log(dictDatas);
       var navDatas= this.getBulidNavData(data,dictDatas);

       var navBar=this.config.parentView.$el.find('.navBar');
       navBar.find('.navCategoryName').html("");
       var NavBarhtml=fish.map(navDatas,function(data){
            return self.navBarHtml(data,"/");
       })
       NavBarhtml.push(self.navBarHtml(data,""));
       navBar.find('.navCategoryName').html(NavBarhtml)
       navBar.find('.navCategoryName')
             .find('span')
             .off('click')
             .on('click',function(){
               var id = $(this).data('id');
               var pid = $(this).data('pid');
               var name  = $(this).text();
               self.subViewTreeClickFun({
                   'id': ""+id,
                   'pid': ""+pid,
                   'name': name
               })
             })
       this.BulidFilterNav();
    },
    bulidSubViewTreeData:function(data,doneFun){

      var self =this;
      action.getTreeUpAndDown(data.id,data.pid,function(dictData){
         var result =dictData.result;
         var navResult=dictData.navResult;
         var datas = fish.map(result,self.toModel);
         console.log("bulidSubViewTreeData");
         console.log(datas);
         var navDatas = fish.map(navResult,self.toModel);



      data=fish.findWhere(datas,{id:data.id});
      data.parent=fish.findWhere(datas,{id:data.pid});
      data.subs=fish.where(datas,{pid:data.id});


      /// id , sno, bno;
      console.log("bulidSubViewTreeData");
      console.log(data);;
      action.getFilterResult(data.id,data.sNo,data.bNo,function(filterResultData){
         console.log("filterResultData");
         console.log(filterResultData.result);

         // 0 多选   1 单选   2 text
         filtersData=fish.map(filterResultData.result,function(d){
           //d.FILTER_CTLTYPE
                var valuesData=fish.map(d.values,function(v){
                    return {
                       name:v.ATTR_VALUE,
                       value:v.ATTR_VALUE
                    }
                })
                return {
                  id: d.ATTR_NO,
                  attr_no:d.ATTR_NO,
                  name:d.ATTR_NAME,
                  type:""+d.FILTER_CTLTYPE,
                  values:valuesData
                }
         })
          // var filtersData=[
          //   {id:'1',"name":"制式",colName:'cs',values:[{"name":"2g",value:'2v'},{"name":"3g",value:'3g'},{"name":"4g",value:'4g'}],type:"0"},
          //   {id:'4',"name":"型号",colName:'cs',values:[{"name":"A类",value:'A'},{"name":"B类",value:'B'},{"name":"C类",value:'C'}],type:"0"},
          //   {id:'5',"name":"型号B",colName:'cs',values:[{"name":"A类",value:'A'},{"name":"B类",value:'B'},{"name":"C类",value:'C'}],type:"0"},
          //   {id:'2',"name":"时间",colName:'cs',values:[{"name":"当天",value:'d'},{"name":"本周",value:'w'},{"name":"本月",value:'m'}],type:"1"},
          //   {id:'3',"name":"内容",colName:'context',values:[],type:"3"}
          // ]
         data.filterData=fish.map(filtersData,function(d){
             d.id=data.name+d.id;
             d.name=d.name;
             d.bNo=data.bNo;
             d.sNo=data.sNo;
             if(d.type==='0'){
               d.typeA=true;
             }
             if(d.type==='1'){
               d.typeB=true;
             }
             if(d.type==='2'){
               d.typeC=true;
             }
             if(d.values.length>10){
               d.values=fish.filter(d.values,function(d,i){return i<=9});
               d.overLength=true;
             }else{
               d.overLength=false;
             }
             return d
         })

         doneFun(data,navDatas);
      })


      })
    },
    bulidSubViewTreeHTML:function(subViewTreeData){
       var self =this;
       console.log("bulidSubViewTreeHTML000000000");
       console.log(subViewTreeData);

       this.$el.html(this.subTreeTpl(subViewTreeData));
       var subTree=this.$el.find('.RepositorySubViewTree');
       subTree.find('.parentName').off('click').on('click',function(){
         var data ={
             name: $(this).text(),
             id:""+$(this).data('id'),
             pid:""+$(this).data('pid'),
         }
         self.subViewTreeClickFun(data);
       })

       subTree.find('.subItemLi').off('click').on('click',function(){
         var data ={
             name: $(this).text(),
             id:""+$(this).data('id'),
             pid:""+$(this).data('pid'),
         }

         self.subViewTreeClickFun(data);
       })


       self.buildFilterEvent(subTree,subViewTreeData);
       self.resizeHight();

    },
    resizeHight:function(){
      var height = $(document).outerHeight()-80
      this.$el.find('.RepositorySubViewTree').slimscroll({
        height:height+"px",
        opacity:0
      })
    },
    buildFilterEvent:function(subTree,subViewTreeData){
      var self =this;
      for (var i = 0 ; i<subViewTreeData.filterData.length;i++){
           var data=subViewTreeData.filterData[i]
           var $areaItem= subTree.find('#filterItem_'+data.id);
           if(data.typeA){
              self.buildTypeA($areaItem,data)
           }
           if(data.typeB){
             self.buildTypeB($areaItem,data)
           }
           if(data.typeC){
             self.buildTypeC($areaItem,data)
           }

           $areaItem.find('.moreSpan').off('click').on('click',function() {
                 var data ={
                    no: $(this).data('no'),
                    sno:$(this).data('sno'),
                    bno:$(this).data('bno')
                 }
                 moreOptionsWin.show($(this),data,self);
           })//end of click

      }
    },

    buildTypeC:function($areaItem,data) {
      var self  =this;
      var $li =$areaItem.find('.typeCLi');
      $li.find('.imgTypeCBtn').off('click')
               .on('click',function(){
                  $areaItem.find('.areaItemChoice').removeClass('areaItemChoice');
                  var value=$li.find('.typeCInput').val();
                  if(value.length>0){
                    $areaItem.find('.typeCLi').addClass("areaItemChoice");
                    $areaItem.find('.typeCLi').data('name',value);
                    $areaItem.find('.typeCLi').data('value',value);
                  }else{
                    $areaItem.find('.typeCLi').data('name',"");
                    $areaItem.find('.typeCLi').data('value',"");
                  }


                  self.BulidFilterNav();
               })

               $areaItem.find('.clearAll').off('click')
                     .on('click',function(){
                       $areaItem.find('.areaItemChoice').removeClass('areaItemChoice');
                       $areaItem.find('.typeCLi').data('name',"");
                       $areaItem.find('.typeCLi').data('value',"");
                       $areaItem.find('.typeCLi').find('.typeCInput').val("");
                       self.BulidFilterNav();
                     })
    },

    buildTypeB:function($areaItem,data){
      var self  =this;
      $areaItem.find('.typeBLi').off('click')
               .on('click',function(){
                  $areaItem.find('.areaItemChoice').removeClass('areaItemChoice');
                  $(this).addClass("areaItemChoice")
                  self.BulidFilterNav();
               })
      $areaItem.find('.clearAll').off('click')
                .on('click',function(){
                       $areaItem.find('.typeBLi')
                                .removeClass("areaItemChoice")
                       self.BulidFilterNav();
                })
    },

    buildTypeA:function($areaItem,data){
      var self  =this;
      $areaItem.find('input[type=checkbox]').off('click')
               .on('click',function(){
                  if($(this).hasClass("areaItemChoice")){
                    $(this).removeClass("areaItemChoice")
                  }else{
                    $(this).addClass("areaItemChoice")
                  }
                  self.BulidFilterNav();
               })
         $areaItem.find('.clearAll').off('click')
               .on('click',function(){
                 $areaItem.find('input[type=checkbox]')
                          .removeClass("areaItemChoice")
                          .prop('checked',false);
                 self.BulidFilterNav();
               })

    },
    filterNavHtml:function(filteNames,i,data){
       return "<span class='filterSpan'  data-index="+i+" data-id="+data.id+">" +filteNames+"<span>/"
    },
    BulidFilterNav:function(){
       var self = this;
       var index =1;
       if(self.currentData.filterData){
         var subTree=this.$el.find('.RepositorySubViewTree');
         var navBar=self.config.parentView.$el.find('.navBar');
          navBar.find('.navCategoryFilter').html("");
         for (var i = 0 ; i<self.currentData.filterData.length;i++){
              var data=self.currentData.filterData[i]
              var $areaItem= subTree.find('#filterItem_'+data.id);
              var items=$areaItem.find('.areaItemChoice')
              data.items=fish.map(items,function(d){
                  return {
                     'name':$(d).data('name'),
                     'value':$(d).data('value'),
                  }
              })
              if(data.items.length>0){
                var filteNames="";
                if(data.items.length>2){
                    var filteNames=data.name +" : "+data.items.length+"已选择"
                }else{
                  filteNames=fish.pluck(data.items,'name').join(" or ")
                }

                navBar.find('.navCategoryFilter').append(
                   self.filterNavHtml(filteNames,index,data)
                );
                index++;
                var $cateFilter=navBar.find('.navCategoryFilter')
                $cateFilter.find(".filterSpan").off('click').on('click',function(){
                          var currentIndex=$(this).data('index');
                          for (var ii=Number(currentIndex)+1;ii<index;ii++){
                            self.removeFilterSpan(ii,$cateFilter);
                          }
                      })

              }


         } //end of  for

       }//end of filterData


       self.toQueryList()
    },
    toQueryList:function(){

      var self =this;
      self.config.parentView.isIndex=false;
      console.log("toQueryList");

      var orderByStr=self.config.parentView.orderByStr.split('|');
       console.log(self.currentData);
       var filterArray=[];
      if(self.currentData.filterData){
        for (var i =0 ;i<self.currentData.filterData.length;i++){
           var fdata=self.currentData.filterData[i]
           if(fdata.items.length>0){
              var fileItem={
                attrNo:fdata.attr_no,
                values:fish.pluck(fdata.items,"value").join(','),
                type:fdata.type
              }
              filterArray.push(fileItem)
           }
        }//end of for
      }
      var filterSearchValues=[]
      var $navSVC= self.config.parentView.$el.find('.navSearchValuesChooise');
      if($navSVC.length>0){
        var types=$navSVC.data('type').split('|');
       filterSearchValues.push({
            value:$navSVC.data('value'),
            field:types[0],
            oper:types[1]
       })
      }
      console.log("filterSearchValues");
      console.log(filterSearchValues);

      console.log("filterArray");
      console.log(filterArray);

        $state=self.config.parentView.$el.find('.docListHeader').find('.active');

      var queryObj={
         'bNo' :self.currentData.bNo,
         'sNo' :self.currentData.sNo,
         'oderByF':orderByStr[0],
         'oderByM':orderByStr[1],
         'filterArray':filterArray,
         'filterSearchValues':filterSearchValues,
         'state':$state.data('value')

      }
      self.config.parentView.docListView.toQueryList(queryObj);
    },
    removeFilterSpan:function(perIndex,$cateFilter) {
      var self =this;
      var $perSapn=$cateFilter.find("[data-index='"+perIndex+"']");

      var subTree=this.$el.find('.RepositorySubViewTree');
      var id=""+$perSapn.data('id');
      for (var i = 0 ; i<self.currentData.filterData.length;i++){
           var fData = self.currentData.filterData[i];
           if(fData.id==id){
             fData.items=[];
             var $areaItem= subTree.find('#filterItem_'+id);
             if(fData.typeA){
               $areaItem.find("input[type='checkbox']")
                        .attr('checked',false)
                        .removeClass('areaItemChoice');
             }
             if(fData.typeB){

             }
             if(fData.typeC){

             }
             $perSapn.remove();
           }
      }


    },

    subViewTreeClickFun:function(data) {
      var self =this;

      if(data.pid==='0'){
        self.currentData= null;
        this.createIndexTree(data)
      }else{
        self.currentData= data;
       subTree=this.$el.find('.RepositorySubViewTree').find('.areaItemChoice').removeClass('areaItemChoice');
        this.createSubViewTree(data)
      }
    },

    resize: function() {}
  })
})
