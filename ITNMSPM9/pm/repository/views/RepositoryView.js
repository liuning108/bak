portal.define([
  "oss_core/pm/repository/views/SearchSolrView.js",
  'text!oss_core/pm/repository/templates/attachTpl.html',
  "oss_core/pm/repository/js/webupload/js/webuploader",
  "oss_core/pm/repository/js/PerviewPage.js",
  'text!oss_core/pm/repository/templates/RepositoryView.html',
  'text!oss_core/pm/repository/templates/navOptionView.html',
  'text!oss_core/pm/repository/templates/RepositoryNewView.html',
  'text!oss_core/pm/repository/templates/attrNoInputLabel.html',
  "oss_core/pm/repository/views/TreeView.js",
  "oss_core/pm/repository/views/DocListView.js",
  "i18n!oss_core/pm/repository/i18n/i18n",
  "oss_core/pm/repository/actions/Action.js",
  "oss_core/pm/repository/js/TagsTool.js",
  "css!oss_core/pm/repository/css/style.css",
  "css!oss_core/pm/repository/js/webupload/css/webuploader.css"
], function(SearchSolrView, attachTpl, WebUploader, PerviewPage, tpl, optionTpl, RepositoryNewViewTpl, attrNoViewTpl, TreeView, DocListView, i18nData, action, TagsTool) {
  return portal.BaseView.extend({
    template: fish.compile(tpl),
    OptionHtml: fish.compile(optionTpl),
    repositoryNewView: fish.compile(RepositoryNewViewTpl),
    attrNoTpl: fish.compile(attrNoViewTpl),
    attachFileTpl: fish.compile(attachTpl),
    render: function() {

      return this;
    },
    afterRender: function() {
      this.index();
      var self = this;
      $(window).resize(function() {
        self.resizeHight()
      })
    },
    resizeHight: function() {
      var self =this;
      var height = $(document).outerHeight() - 80;
      self.$el.find('.RepositoryContext').css('height', height + 'px');
    },
    index: function() {
      var self = this;
      action.getDocOpers(function(data) {
        self.run(data);
      })

    },

    respositoryNew: function(initData) {

      if (window.UE) {
        UE.delEditor('RespositoryNewEditor');
      }
      var self = this;
      self.json = initData;
      self.json.state = initData.state || '00';
      this.$el.html(this.repositoryNewView(initData));
      if (self.json.state != '00') {
        this.$el.find('.save00').hide();
      }
      var height = $(document).outerHeight() - 38 - 54 - 25 - 30;
      this.$el.find('.RepositoryNewBody').css('height', height + "px");
      this.$el.find('.RepositoryNewBody').slimscroll({
        height: height + "px",
        opacity: 0
      });
      var $slidebar = this.$el.find('.RepositoryNewBody').find('.SolutionForm_Slidebar')
      var $subs = self.$el.find('.TabsNewHeadingSubs');
      $subs.hide();
      self.$el.find("#knowledgeSub_NewRepsitory").show()
      this.$el.find('.TabsNewHeading').off('click').on('click', function() {
        $subs.hide();
        var sub = $(this).data("sub");
        var pos = $(this).position();
        $slidebar.animate({"left": pos.left});
        self.$el.find(sub).show();

      })
      this.$el.find('.R_Permission').find('span').off('click').on('click', function() {
        self.$el.find('.R_Permission').find(".Click").removeClass("Click");
        $(this).addClass("Click");
      })

      this.$el.find('.W_Permission').find('span').off('click').on('click', function() {
        self.$el.find('.W_Permission').find(".Click").removeClass("Click");
        $(this).addClass("Click");
      })

      this.commboTree();

      window.UEDITOR_HOME_URL = 'oss_core/pm/repository/js/ueditor/'; //portal.appGlobal.get('webroot')+"/oss_core/pm/repository/js/ueditor"
      window.imageUrlPrefix = "";
      portal.require([
        "oss_core/pm/repository/js/ueditor/ueditor.config.js", "oss_core/pm/repository/js/ueditor/ueditor.all.js"
      ], function() {
        var editor = UE.getEditor('RespositoryNewEditor', {
          //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
          toolbars: [
            [
              'fullscreen',
              'undo',
              'redo',
              '|',
              'bold',
              'italic',
              'underline',
              'fontborder',
              'strikethrough',
              'superscript',
              'subscript',
              'removeformat',
              '|',
              'forecolor',
              'backcolor',
              'insertorderedlist',
              'insertunorderedlist',
              'selectall',
              'cleardoc',
              '|',
              'rowspacingtop',
              'rowspacingbottom',
              'lineheight',
              '|',
              'customstyle',
              'paragraph',
              'fontfamily',
              'fontsize',
              '|',
              'directionalityltr',
              'directionalityrtl',
              'indent',
              '|',
              'justifyleft',
              'justifycenter',
              'justifyright',
              'justifyjustify',
              '|',
              'simpleupload',
              'imagenone',
              'imageleft',
              'imageright',
              'imagecenter',
              'inserttable',
              'deletetable',
              'insertparagraphbeforetable',
              'insertrow',
              'deleterow',
              'insertcol',
              'deletecol',
              'mergecells',
              'mergeright',
              'mergedown',
              'splittocells',
              'splittorows',
              'splittocols'
            ]
          ],
          autoHeightEnabled: false,
          //focus时自动清空初始化时的内容
          autoClearinitialContent: true,
          //关闭字数统计
          wordCount: false,
          //关闭elementPath
          elementPathEnabled: false,
          //默认的编辑区域高度
          initialFrameHeight: (418 - 50),
          //快捷菜单

          shortcutMenu: [
            "fontfamily",
            "fontsize",
            "bold",
            "italic",
            "underline",
            "forecolor",
            "backcolor",
            "insertorderedlist",
            "insertunorderedlist"
          ]

          //更多其他参数，请参考ueditor.config.js中的配置项
        });
        editor.ready(function() {
          editor.setContent(self.json.context);

        })
        editor.addListener("focus", function() {
          self.$el.click();
        })
        editor.addListener('simpleuploadSendJson', function(name, json) {
          console.log("simpleuploadSendJson");
          if (json.state != "SUCCESS")
            return;
          console.log(json);
          var file_state = 'A';
          var uploadJson = {
            'docId': self.json.id,
            'filePath': json.url,
            'fileName': json.title,
            'state': file_state,
            'type': "0"
          }
          console.log(uploadJson);
          action.addAttach(uploadJson, function(data) {
            var id = data.result;
            uploadJson.id = id;
            self.addAttachEvent(uploadJson, true)
          })

        })
        self.editor = editor;

      })

      self.tags = TagsTool.newRepsitorytags(self, 10);
      var tags = [];
      if (self.json.tags) {
        if (self.json.tags.length > 0) {
          tags = self.json.tags.split(',');
        }
      }
      self.tags.setValues(self, tags);
      var rRole = self.json.rRole || '0';
      var wRole = self.json.wRole || '1';
      self.$el.find('.R_Permission').find("span[data-value=" + rRole + "]").addClass('Click')
      self.$el.find('.W_Permission').find("span[data-value=" + wRole + "]").addClass('Click')

      this.$el.find(".saveKnowledge").off('click').on('click', function() {
        var state = $(this).data('state')
        self.saveKnowledge(state);

      })

      this.$el.find('.comeback').off('click').on('click', function() {
        self.index();
      })
      this.$el.find('.perviewKnowledge').off('click').on('click', function() {
        self.$el.find('.RepositoryNewView').hide()
        var $perview_el = self.$el.find('.RepositoryNewViewPerview').show()
        var json = {
          'title': self.$el.find("#RespositoryNewTitleInput").val(),
          'context': self.editor.getContent()
        }
        PerviewPage.show($perview_el, json, self);
      })
      this.uploadFile();
      this.loadAttach(self.json.id);

    },
    loadAttach: function(id) {
      var self = this;
      action.queryAttachByDocId({
        'docId': id
      }, function(data) {
        console.log("loadAttach222");
        var result = data.result;
        console.log(result);
        if (result.length <= 0)
          return;
        var fileDatas = fish.map(result, function(d) {
          return {
            'docId': d.DOC_ID,
            'filePath': d.ATTACH_PATH,
            'fileName': d.ATTACH_NAME,
            'state': d.STATE,
            'type': d.ATTACH_TYPE,
            'id': d.ID
          }
        });

        console.log(fileDatas);
        fish.each(fileDatas, function(d) {
          self.addAttachEvent(d);
        })

      })
    },
    uploadFile: function() {
      var self = this;
      //添加图添点
      this.shiftUploader = WebUploader.create({
        auto: true,
        swf: portal.appGlobal.get('webroot') + "frm/fish-desktop/third-party/fileupload/Uploader.swf",
        server: portal.appGlobal.get('webroot') + "/upload?modelName=repository/import/&genName=true",
        pick: ".uploadBrowse_Knowlege",
        // accept: {
        //         title: 'Image',
        //         extensions: 'jpg,jpeg,bmp,png',
        //         mimeTypes: 'image/*'
        //     },
        //  fileNumLimit: 1,
        resize: false
      });
      this.shiftUploader.on('uploadSuccess', function(file, response) {
        var response = response.data;
        var file_state = 'A';

        console.log("shiftUploader");
        var uploadJson = {
          'docId': self.json.id,
          'filePath': response.filePath,
          'fileName': response.fileSrc,
          'state': file_state,
          'type': "1"
        }
        console.log(uploadJson);
        action.addAttach(uploadJson, function(data) {
          var id = data.result;
          uploadJson.id = id;
          self.addAttachEvent(uploadJson)
        })

      });

      this.shiftUploader.on('uploadError', function(file, response) {
        fish.toast('error', '上传文失败:  文件大小过大或文件类型被限制')
      });

    },
    addAttachEvent: function(uploadJson, flag) {
      var self = this;
      var $el = {};
      if (flag) {
        //$el.hide();
        $el = self.$el.find('.uploadAttachmentFiles');
        uploadJson.hideStyle = 'hideStyle'
      } else {
        $el = self.$el.find('.uploadAttachmentFiles').show();
      }
      var $fileItem = $(self.attachFileTpl(uploadJson)).appendTo($el)
      $fileItem.find('.fileTrach').off('click').on('click', function() {
        var _this = this;
        var id = $(this).data('id');
        var filepath = $(this).data('filepath');
        var delJson = {
          'id': id,
          'filePath': filepath
        }
        action.delAttachById(delJson, function() {
          $(_this).parent().remove();
        })
      })

    },
    comeback: function() {
      var self = this;
      self.$el.find('.RepositoryNewView').show();
      self.$el.find('.RepositoryNewViewPerview').hide()
    },
    saveKnowledge: function(state) {
      var self = this;
      var json = {};
      json.id = self.json.id;
      json.state = state;
      json.sNo = self.json.sNo;
      json.bNo = self.json.bNo;
      json.title = self.$el.find("#RespositoryNewTitleInput").val();
      json.context = self.editor.getContent();
      json.keys = self.$el.find('#knowledgeKeysInput').val();
      json.tags = self.tags.getValues(self).join(',');
      json.rRole = self.$el.find('.R_Permission').find('.Click').data('value');
      json.wRole = self.$el.find('.W_Permission').find('.Click').data('value');
      json.domainNo = self.json.domainNo;
      var ids = fish.map(self.$el.find('.knowledge_fileAttr'), function(dom) {
        return $(dom).data('id');
      })
      json.attachIds = ids.join(',');

      var attrsData = self.$el.find('.ATTR_NO_INPUT_VALUE')
      var filterData = fish.filter(attrsData, function(d) {
        return $(d).val().length > 0;
      })
      var attrsModelData = fish.map(filterData, function(d) {
        return {'name': $(d).data('name'), 'no': $(d).data('no'), 'val': $(d).val()}
      })
      json.attrNos = attrsModelData
      if (!self.isSave(json))
        return;
      console.log("save");
      console.log(json);
      action.saveOrUpdate(json, function(data) {
        var result = data.result;
        self.json.id = result.id;
        fish.toast('info', json.title + '保存成功');
      })
    },
    isSave: function(json) {
      if (json.title.length <= 0) {
        fish.toast('warn', '标题不能为空');
        return false;
      }
      if (json.sNo <= 0 || json.bNo <= 0) {
        fish.toast('warn', '请选择一个类别');
        return false;
      }

      return true;
    },
    commboTree: function() {
      var self = this;
      action.getRootTree(function(data) {
        var result = data.result;
        var datas = fish.map(result, self.toModel);
        self.commboTreeEvent(datas);
      })
    },

    commboTreeEvent: function(datas) {
      var self = this;
      console.log("commboTreeEvent");
      console.log(fish.version)
      console.log(datas);
      var options = {
        view: {
          showIcon: function(treeNode) {
            return false;
          }
        },
        dataValueField: 'id',
        formatter: function(nodes) {
          if (nodes[0].pId) {
            var p = nodes[0].getParentNode();
            return p.name + "-" + node[0].name;
          }
          return nodes[0].name;
        },
        callback: {
          beforeClick: function(e, treeNode) {
            console.log("beforeClick");
            if (!treeNode.pId) {
              return false;
            }
            return true;

          }
        },
        placeholder: "请选择所在的类型",
        data: {
          simpleData: {
            enable: true
          }
        },
        fNodes: datas
      }; //end of options
      var $combotree = self.$el.find('#NewRepsitoryConfig_CategorySel').combotree(options);

      $combotree.combotree('value', self.json.sNo);
      action.getFilterResult(self.json.sNo, self.json.sNo, self.json.bNo, function(data) {
        var result = data.result;
        console.log("getFilterResult");
        console.log(result);
        self.attrsHtml(result);
      })

      $combotree.on('combotree:change', function(e, data) {
        var nodes = data.selectNodes;
        var node = nodes[0];
        var sNo = node.id;
        var bNo = node.pId;
        self.json.sNo = sNo;
        self.json.bNo = bNo;
        self.json.domainNo = node.name;
        action.getFilterResult(sNo, sNo, bNo, function(data) {
          var result = data.result;
          self.attrsHtml(result);
        })

      })
    },
    attrsHtml: function(result) {
      var self = this;
      var $context = self.$el.find('.attrsHtml');
      $context.html(self.attrNoTpl({"datas": result}));
      fish.each(self.json.attrNos, function(d) {
        var selector = ".ATTR_NO_INPUT_VALUE[data-no=" + d.ATTR_NO + "]";
        $context.find(selector).val(d.ATTR_VALUE);
      })

    },
    toModel: function(d) {
      var node = {
        id: "" + d.ID,
        name: "" + d.NAME,
        pId: "" + d.PID,
        bNo: "" + d.BNO,
        sNo: "" + d.SNO,
        open: true
      }
      return node
    },
    run: function(initData) {
      var self = this;
      this.$el.html(this.template(i18nData));
      self.height = $(document).outerHeight() - 80;
      self.$el.find('.RepositoryContext').css('height', self.height + 'px');
      self.queryJson = {};
      self.$el.find('.navOrderBy').html(this.OptionHtml(initData))
      self.docListView = new DocListView({'el': self.$el.find('.listItemsContext'), 'parentView': self, 'data': initData}).render();
      self.treeView = new TreeView({'el': self.$el.find('.filterArea'), 'parentView': self}).render();

      var datas = fish.map(initData.result2, function(d) {
        return {name: d.NAME, value: d.ID}
      });
      datas.unshift({"name": "所有分类", "value": "ALL"})
      var $combobox1 = $('#searchBarComb').combobox({placeholder: '', editable: false, dataTextField: 'name', dataValueField: 'value', dataSource: datas});
      $combobox1.combobox('value', 'ALL')

      var dataSources = fish.map(initData.result0, function(d) {
        return {
          'name': d.NAME,
          'value': d.FNO + "|" + d.OPER
        };
      })
      var fistV = dataSources[0].value;;
      var $nav2 = $('#navSearchBarComb').combobox({
        height: 20,
        placeholder: '',
        editable: false,
        dataTextField: 'name',
        dataValueField: 'value',
        dataSource: dataSources
      });

      self.$el.find('.bcGoButton').off('click').on('click', function() {
        var value = self.$el.find('#navSearchInputValue').val();
        var $navValues = self.$el.find('.navSearchValues');
        if (value.length > 0) {
          $navValues.addClass('navSearchValuesChooise')
          $navValues.data('value', value);
          $navValues.data('type', $nav2.combobox('value'));
        } else {
          $navValues.removeClass('navSearchValuesChooise')
          $navValues.data('value', "");
          $navValues.data('type', "");
        }
        self.treeView.toQueryList();

      })
      self.$el.find('.smallCancel').off('click').on('click', function() {
        self.$el.find('#navSearchInputValue').val("");
        self.$el.find('.navSearchValues').data("value", "");
        self.$el.find('.navSearchValues').data("type", "");
        self.$el.find('.navSearchValues').removeClass("navSearchValuesChooise");
        self.treeView.toQueryList();
      })

      self.$el.find('.docListHeader').find('.header').off('click').on('click', function() {
        self.$el.find('.docListHeader').find('.active').removeClass('active');
        $(this).addClass('active');
        if (self.isIndex) {
          self.treeView.getIndexDoclist();
        } else {
          self.treeView.toQueryList();
        }

      })

      self.$el.find('.RespositoryNew').on('click', function() {
        self.respositoryNew({id: '0', sNo: '', bNo: '', domainNo: ''});
      })

      //fuzzy query查询
      self.$el.find('.searchSolr').off('click').on('click', function() {
        if (self.$el.find('.searchSolrKey').val().length <= 0) {
          return;
        }
        var type = $combobox1.combobox('value');
        var searchValue = self.$el.find('.searchSolrKey').val()
        var searchKey = self.$el.find('.searchSolrKey').val().split(' ');
        var searchKeyArray = fish.map(searchKey, function(key) {
          return "*" + key + "*";
        })
        var searchFuzzyKey = searchKeyArray.join(' ');
        var queryObj = {
          'type': type,
          'searchKey': searchFuzzyKey,
          'page': 1,
          'rowNums': 20
        }
        var $el = self.$el.find('.searchSolrList').show();
        self.$el.find('.NoSearchSolrList').hide();
        self.$el.find('.filterArea').hide();
        self.$el.find('.searchBar').removeClass('pl250')

        SearchSolrView.show($el, self, searchValue, queryObj);

      })

    }, //end of run;
    closeSeachSolrView: function() {
      var self = this;
      self.$el.find('.searchSolrList').hide();
      self.$el.find('.NoSearchSolrList').show();
      self.$el.find('.filterArea').show();
      self.$el.find('.searchBar').addClass('pl250')

      if (self.isIndex) {
        self.treeView.getIndexDoclist();
      } else {
        self.treeView.toQueryList();
      }

    }

  })
})
