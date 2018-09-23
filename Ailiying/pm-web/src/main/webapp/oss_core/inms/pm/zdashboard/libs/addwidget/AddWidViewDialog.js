define([
  "oss_core/inms/pm/zdashboard/actions/DashAction.js", "text!oss_core/inms/pm/zdashboard/libs/addwidget/AddWidViewDialog.html",
  "text!oss_core/inms/pm/zdashboard/libs/addwidget/Item.html"
], function(action, tpl,itemTpl) {
  var AddWidViewDialog = function() {
    this.tpl = fish.compile(tpl);
    this.itemTpl =fish.compile(itemTpl);

  };
  AddWidViewDialog.prototype.content = function() {
    this.$el = $(this.tpl())
    return this.$el;
  }
  AddWidViewDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.$popup = fish.popup(options);
    this.options = options;
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  AddWidViewDialog.prototype.translateData = function(data) {
      if(!data.result) return [];
      if(data.result.length<=0) return [];
      var result =fish.groupBy(data.result,"GCLASS")
      return result;
  }
  AddWidViewDialog.prototype.initMultipleItems = function(data) {
    var self = this;
    var resultData = self.translateData(data);
    console.log('initMultipleItems', resultData);
    var  $multipleItems=this.$el.find('.multipleItems');
    $multipleItems.html("");
    var keys  =  fish.keys(resultData);
    fish.each(keys,function(key){
      var values = resultData[key];
      console.log("initMultipleItems",values);
      var $list =$(self.itemTpl({'title':key,'items':values}));
      $multipleItems.append($list);
    })

    $multipleItems.find('li').on('click',function(){
         var  flag  = $(this).hasClass('cactive')
         if(flag){
           $(this).removeClass('cactive');
         }else{
           $(this).addClass('cactive');
         }
    })
    $multipleItems.slick({dots: false, infinite: true, speed: 500, slidesToShow: 4, slidesToScroll: 4});
    $multipleItems.find('.body').slimscroll({height: '300px'});

  }
  AddWidViewDialog.prototype.loadData = function(param) {
    var self = this;
    action.getGraphsByCondition(param).then(function(data) {
      self.initMultipleItems(data)
    })
  }
  AddWidViewDialog.prototype.graphsOK=function(datas){
    var self =this;
    self.callback(datas)
    self.$popup.hide();
  }
  AddWidViewDialog.prototype.afterPopup = function() {
    var self = this;
    this.$el.find('.graphsCancel').off('click').on('click', function() {
      self.$popup.hide();
    });
    this.$el.find('.graphsOK').on('click', function() {
        var  $multipleItems=self.$el.find('.multipleItems');
        var  domsData =$multipleItems.find('.cactive')
        if(domsData.length>0){
          var datas =fish.map(domsData,function(dom){
              return {
                type:1,
                gid: $(dom).data('id')
              }
          })
          self.graphsOK(datas);
        }else{
          self.$popup.hide();
        }

    })
    var tid = self.props.tid;
    this.loadData({
      'tId': tid,
      name: ''
    })

    this.$el.find('.g_name_search').on('click',function(){
      var val =self.$el.find('.g-theme-search').val();
      if(val.length<=0){
        self.loadData({
          'tId': tid,
           name: ''
        })
      }else{
        self.loadData({
          'tId': tid,
           name: val
        })
      }

    })
    this.$el.find('.g_name_reset').on('click',function(){
      self.$el.find('.g-theme-search').val("")
      self.loadData({
        'tId': tid,
         name: ''
      })
    })



  }

  return AddWidViewDialog;
})
