define([
  "text!oss_core/pm/screendesigner/js/graphLibs/mapBase/ExportMapHtml.html",
  "text!oss_core/pm/screendesigner/js/graphLibs/mapBase/MapLi.html",
  "oss_core/pm/screendesigner/actions/BScreenMgrAction", "oss_core/pm/screendesigner/js/webupload/js/webuploader"
], function(tpl,MapliTxt,action, WebUploader) {
  return {
    htmlTpl: fish.compile(tpl),
    MapLiTpl:fish.compile(MapliTxt),
    render: function(datas) {
      var self = this;
      $popup = $(self.htmlTpl())
      var options = {
        height: 500,
        width: 350,
        modal: false,
        draggable: false,
        content: $popup,
        autoResizable: false
      }; // end of options
      var popup = fish.popup(options);

      //添加图添点
      this.exportMapWebUpload = WebUploader.create({
        auto: true,
        swf: portal.appGlobal.get('webroot') + "frm/fish-desktop/third-party/fileupload/Uploader.swf",
        server: portal.appGlobal.get('webroot') + "/upload?modelName=bscreenMap/import/&genName=true",
        pick: $popup.find('.exportCustomMap'),
        accept: {
          title: 'svg',
          extensions: 'svg',
          mimeTypes: 'image/svg+xml'
        },
        resize: false,
        duplicate: true
      });
      this.exportMapWebUpload.on('uploadSuccess', function(file, response) {
        var config = response.data;
        var exportJson = {
          'fileName': config.fileSrc,
          'filePath': config.filePath
        }
        action.exportMap(exportJson, function() {
          fish.toast('success', '操作成功')
          self.renderList();
        })

      })
      $popup.find('.MapList').slimscroll({
        'height':370+"px"
      })

      this.MapListEvent($popup,datas,popup);


    },
    MapListEvent:function($el,datas,popup){
      var self =this;
      $el.find('.MapList')
            .html('')
            .append(self.MapLiTpl({
              'datas':datas
            }))
            .find('li').off('click').on('click',function(){
              $el.find('.MapList').find('.active').removeClass('active');
              $(this).addClass('active');
                // var id =$(this).data('id')
                // var parent=self.option.parent;
                // parent[self.option.okEvent](id);
                // popup.close();
            })
      $el.find('.mapLi_'+self.option.id+'').addClass('active');
      $el.find('#save-button').off('click').on('click',function(){
           var active=$el.find('.MapList').find('.active')
           var id =active.data('id')
           var parent=self.option.parent;
           parent[self.option.okEvent](id);
           popup.close();
      })
      $el.find('.removeMap').off('click').on('click',function(e){
        var parent =$(this).parent().parent();
        var name=parent.find('.mapName').text()
        var id =parent.data('id');

        fish.confirm('确认是否删除该选项').result.then(function() {
            action.delMap({
              'id':id
            },function() {
              self.renderList();
            });
        });


        e.stopPropagation();
      })
      $el.find('.rename').off('click').on('click',function(e){

          var parent =$(this).parent().parent();
          var name=parent.find('.mapName').text()
          var id =parent.data('id');
        fish.prompt({title:'重命名',message:''},name).result.then(function(data){
            action.renameMap({
              'id':id,
              "name":data
            },function(){
              parent.find('.mapName').text(data);
            })

        });
        e.stopPropagation();

      })

    },
    renderList:function($el,popup){
      var self  =this;
      action.getMapList(function(data) {
        var result = data.result;
        console.log("getMapList");
        self.MapListEvent($popup,result,popup);
      })
    },
    create:function(){
      return fish.create(this,{});
    },
    show: function(option) {
      var self = this;
      this.option=option;

      action.getMapList(function(data) {
        var result = data.result;
        console.log("getMapList");
        console.log(result);
        self.render(result)
      })
    } // end of show s
  }

})
