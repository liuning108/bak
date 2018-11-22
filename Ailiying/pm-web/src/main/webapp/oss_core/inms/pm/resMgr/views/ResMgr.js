define([
	"oss_core/inms/pm/resMgr/libs/kdoDSelect/kdoSelectDialog",
	"oss_core/inms/pm/resMgr/views/ResGridLevel",
  "oss_core/inms/pm/resMgr/libs/util.js",
  'text!oss_core/inms/pm/resMgr/templates/KpiMgr.html',
  'text!oss_core/inms/pm/meta/kpi/templates/KpiDetail.html',
  'i18n!oss_core/inms/pm/meta/kpi/i18n/kpi',
  'oss_core/inms/pm/meta/kpi/actions/KpiAction',
  'oss_core/inms/pm/util/views/Util',
  'oss_core/inms/pm/meta/measure/actions/MeasureAction',
  'oss_core/inms/pm/third-party/codemirror/lib/codemirror',
  'oss_core/inms/pm/third-party/codemirror/mode/sql/sql',
  "css!oss_core/inms/pm/third-party/codemirror/lib/codemirror.css",
  "css!oss_core/inms/pm/resMgr/css/resMgr.css",
  "css!oss_core/inms/pm/meta/kpi/css/kpiCss.css",
  'css!oss_core/inms/pm/util/css/ad-block.css',
], function(KdoSelectDialog,ResGridLevel,util, kpiTpl, kpiDetailTpl, i18nKpi, kpiAction, pmUtil, measureAction, codemirror) {
  return fish.View.extend({
    tagName: "div",
    className: "tabs__content",
    template: fish.compile(kpiTpl),
    detailTpl: fish.compile(kpiDetailTpl),
    i18nData: fish.extend({}, pmUtil.i18nCommon, pmUtil.i18nPMCommon, i18nKpi),
    events: {
      "click .js-kpi-add-copy .js-new": 'addKpi',
      "click .js-kpi-add-copy .js-copy-new": 'addCopyKpi',
      "click .js-kpi-grid .js-batch-new": 'addBatchKpi',
      "keyup .js-kpi-code": 'codeToUpper',
      "blur  .js-kpi-code": 'codeToUpper',
      "click .js-kpi-ok": 'ok',
      "click .js-kpi-cancel": 'cancel',
      "click :radio[name='KPI_TYPE']": 'clickKpiType',
      "click .js-kpi-formula-ul li a": 'clickFormulaTabs',
      "click .js-kpi-form-check": 'checkKpiForm',
      "click .js-kpi-form-seling": 'formSeling',
      "click .js-kpi-mo-config": 'moConfig',
      "click .kpiClassMenu .kSon": 'kpiClassMenu',
      "click .kpiClassRemove": 'kpiClassRemove',
      "click .pm-kpi-filter-switch-off": 'filterSwitchOff',
      "click .pm-kpi-filter-switch-on": 'filterSwitchOn',
      "click .pm_filer_item": 'filterItemClick',
      "click .pm_filer_selected_term_close": 'selectedFilterItemClose'
    },
    initialize: function(options) {
			this.levels=[];
      this.mapContext = {
        "1": '所属PIM',
        "2": '所属VIM',
        "3": '区域',
      }
      this.kpiType = "";
      this.colModel = [

        {
          name: 'VIM',
          label: "所属VIM",

        },
        {
          name: 'PIM',
          label: "所属PIM",

        },
        {
          name: 'CITY',
          label: "区域",

        }, {
          name: "VENDOR",
          label: "厂家 ",

        }, {
          name: 'NAME',
          label: "名称",
          formatter: function(cellval, opts, rwdat, _act) {
            var v = ("" + rwdat.STATE).toUpperCase();
            if (v == "OK") {
              return "<span class='rescircle'></span>" + cellval
            } else {
              return "<span  class='rescircle error'></span>" + cellval
            }

          }
        }, {
          name: "RMUID",
          label: "标识",
        },
        {
          name: "SCREEN",
          label: "",
          align: "center",
          formatter: function(cellval, opts, rwdat, _act) {
            var v = Number(cellval);
            if (v > 0) {
              return '<i class="fa fa-desktop enterGTMP"></i>';
            } else {
              return "";
            }
          }
        }
      ];
			this.params={};
      this.tableH = options.iframeHeight ? options.iframeHeight : $(".ui-tabs-panel").height();
    },
    render: function() {
      this.$el.html(this.template(this.i18nData));
      this.$(".js-kpi-detail-content").html(this.detailTpl(this.i18nData));
      return this;
    },
    afterRender: function() {
			var self =this;
			this.$el.find('.res-kpi-search').off('clcik')
			        .on('click',function(){
								self.search();
							})
		 this.$el.find('.res-kpi-reset').off('clcik')
							        .on('click',function(){
												self.resetname();
											})
			var self =this;
				util.loadInitData(function(data){
					self.initData=data;
					self.reslevel = new ResGridLevel({
						el : self.$el.find('.res-grid-levels'),
						parent: self,
					});
					self.reslevel.render()
					self.loadTree(data);
					self.loadGrid();
				})

    },

    loadTree: function(data) {
			var self =this;
      var $tree = this.$(".js-catalog-tree");
      this.catTree = $tree.jqGrid({
        colModel: [{
          name: 'CAT_NAME',
          label: "",
          width: "100",
        }, {
          name: "REL_ID",
          label: "",
          width: "0",
          key: true,
          hidden: true
        }],
        height: this.tableH,
        expandColumn: "CAT_NAME",
        treeGrid: true,
        colHide: true,
        pagebar: true,
        onSelectRow: function(e, rowid, state) {
          var selectRow = this.catTree.jqGrid("getRowData", rowid);
          if (selectRow.level == 0) return;
          console.log("selectRow", selectRow)
          util.hidColByType("" + selectRow.CID, this.kpiGrid);
					self.$el.find('.res-search-input').val("");
					//每次会重新定义查询Start
					this.params.CID="" + selectRow.CID;
					this.params.CODE=selectRow.CAT_CODE;
					this.params.TNAME=selectRow.TNAME;
					this.params.TYPE="tree";
					this.params.iswhere="0";
					this.params.where={};
					//每次会重新定义查询 END

					self.levels=[];
					self.levels.push({
							 'id':selectRow.REL_ID,
							 'name':selectRow.CAT_NAME,
							 'subIds':selectRow.SUBIDS,
							 'code':selectRow.CAT_CODE,
							 'tname':selectRow.TNAME
					})

          self.getKpiList();
          self.loadKpiClass(data,"" + selectRow.CID);
        }.bind(this)
      });
      util.loadTree(this.catTree,data)
		var rH = this.$el.find('.js-kpi-right-panel').height();
		this.$el.find('.js-kpi-left-panel').height(rH-30)
    },
		subList:function(item,rowId){
			var params  ={}
			params.CODE=item.code;
			params.TNAME=item.tname;
			params.rowId =rowId
			params.TYPE="sublist";
			console.log('subList',params);
			this.getKpiSubList(params);
		},
		getKpiSubList: function(param) {
      var self = this;
      util.loadResData(this.kpiGrid,param,self.initData)
    },
    loadGrid: function() {
      var $grid = this.$(".js-kpi-grid");
      this.kpiGrid = $grid.jqGrid({
        colModel: this.colModel,
        pagebar: true,
        onSelectRow: function(e, rowid, state) {
					var selrow = self.kpiGrid.grid("getSelection");
					console.log("onSelectRow2",selrow)
					self.reslevel.setRowId(selrow.OID);
        },
        pager: true
      });
      var self = this;
      $grid.on('click', '.enterGTMP', function() {
        var selrow = self.kpiGrid.grid("getSelection");
				console.log('enterGTMP',selrow);
        util.enterDashBoard(selrow.TID, self, self.tableH,selrow.RMUID);
      })

    },


    resize: function(delta) {

      if (this.$(".js-kpi-left-panel").height() >= this.$(".js-kpi-right-panel").height()) {
        portal.utils.gridIncHeight(this.$(".js-catalog-tree"), delta);
        var hDiff = this.$(".js-kpi-left-panel").height() - this.$(".js-kpi-right-panel").height();
        portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"), hDiff);
        if (this.$(".js-kpi-detail").is(":visible")) {
          portal.utils.incHeight(this.$(".js-kpi-detail"), hDiff);
          this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height() - this.$(".js-kpi-detail-button").height());
          this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
          this.$(".js-kpi-detail-content").slimscroll({
            height: this.$(".js-kpi-detail-content").height()
          });
        }

      } else {
        portal.utils.gridIncHeight(this.$(".js-kpi-grid:visible"), delta);
        if (this.$(".js-kpi-detail").is(":visible")) {
          portal.utils.incHeight(this.$(".js-kpi-detail"), delta);
          this.$(".js-kpi-detail-content").height(this.$(".js-kpi-detail").height() - this.$(".js-kpi-detail-button").height()); //
          this.$(".js-kpi-detail-content").parent().height(this.$(".js-kpi-detail-content").height());
          this.$(".js-kpi-detail-content").slimscroll({
            height: this.$(".js-kpi-detail-content").height()
          });
        }
        portal.utils.gridIncHeight(this.$(".js-catalog-tree"), this.$(".js-kpi-right-panel").height() - this.$(".js-kpi-left-panel").height());
      }
    },

    getKpiList: function() {
      var self = this;
      var param =self.params;
			self.reslevel.update([self.levels[0]]);
      util.loadResData(this.kpiGrid,param,self.initData)
    },

    filterSwitchOff: function() {
      this.$('.pm_filter_box').hide();
      this.$('.pm-kpi-filter-switch-on').show();
      this.$('.pm-kpi-filter-switch-off').hide();
    },

    filterSwitchOn: function() {
      this.$('.pm_filter_box').show();
      this.$('.pm-kpi-filter-switch-on').hide();
      this.$('.pm-kpi-filter-switch-off').show();
    },

    loadKpiClass: function(data,type) {
      var self = this;
      this.$('.pm_filter_container').empty();
      this.$('.pm_filer_selected_term_ul').empty();
      this.$('#pm_filer_selected_term_ul li').remove();
      this.$('.pm_filter_select').hide();
      this.tagList = undefined;
      util.qryClassinfo(data,type, function(data) {
        var kpiClassList = data.kpiClassList;
        var kpiClassTagList = data.kpiClassTagList;
        fish.forEach(kpiClassList, function(kpiClass) {
          var htmlText = '<div class="pm_filter_list"><div class="pm_filer_title col-md-2"><span>' +
            kpiClass.CLASS_NAME + '：</span></div><div class="pm_filer_term col-md-10"><ul>';
          var class_id = kpiClass.CLASS_ID;
          fish.forEach(kpiClassTagList, function(kpiClassTag) {
            if (kpiClassTag.CLASS_ID == class_id) {
              var tag_id = kpiClassTag.TAG_ID;
              var elementId = 'pm_filer_item_' + class_id + '_' + tag_id;
              var isExist = false;
              if (self.tagList) {
                fish.forEach(self.tagList, function(selectedTag) {
                  if (elementId == selectedTag.id) {
                    isExist = true;
                  }
                });
              }
              if (!isExist) {
                htmlText += '<li data-tagid='+ tag_id +' id="' + elementId + '" name="' + kpiClassTag.TAG_VALUE + '" class="pm_filer_item">' + kpiClassTag.TAG_VALUE + '</li>'
              }
            }
          });
          htmlText += '</ul></div></div>';
          self.$('.pm_filter_container').append(htmlText);
        });
        self.resizeByTagChange();
      });
    },
		moreDialog:function(type){
			var self = this;
	    var options = {
	      height: 430,
	      width: 500,
	      modal: true,
	      draggable: false,
	      autoResizable: false
	    };
			var Litems =[];

			if(type=="PIM"){
				 var pimAll =fish.map(this.initData.pim,function(d){
					  return {
							 "name":d.name,
							 'value':d.id,
						}
				 })
				 Litems=fish.filter(pimAll,function(d){
					 var elementId = 'pm_filer_item_PIM'+ '_' + d.value;
           var  elmd=self.$el.find('#'+elementId);
					 return !(elmd.length>0);
				 })

			}
			if(type=="VIM"){
				var vims =fish.map(this.initData.vim,function(d){
					 return {
							"name":d.name,
							'value':d.id,
					 }
				})
				Litems=fish.filter(vims,function(d){
					var elementId = 'pm_filer_item_VIM'+ '_' + d.value;
					var  elmd=self.$el.find('#'+elementId);
					return !(elmd.length>0);
				})
			}
		  console.log('initData',Litems);
	    var dialog = new KdoSelectDialog();
	    dialog.popup(options,
				{  title:type+"列表",
				   L:Litems,
					 R:[]
			  },
			  function(items) {
          console.log('KdoSelectDialog',items)
					fish.each(items,function(item){
						var elementId = 'pm_filer_item_' + type + '_' + item.value;
						var itemName =item.name;
						self.selectfilterItem(elementId,itemName);
					})
	    });
		},
    filterItemClick: function(e) {
      var self = this;
      var itemId = e.currentTarget.id;
      var itemName = self.$('#' + itemId).attr("name");
			var tag_id =self.$('#' + itemId).data('tagid')
			if(tag_id=='moremoremorepim'){
				this.moreDialog("PIM");
				return;
			}
			if(tag_id=='moremoremorevim'){
				this.moreDialog("VIM");
				return;
			}
			self.selectfilterItem(itemId,itemName);

    },
		selectfilterItem:function(itemId,itemName){
			self.$('#' + itemId).hide();
      var selectedItemHtml = '<li class="active" name="' + itemId + '">' + itemName + '<i id="' + itemId + '" class="fa fa-close pm_filer_selected_term_close"></i></li>';
      self.$('#pm_filer_selected_term_ul').append(selectedItemHtml);
      var tagList = [];
      fish.forEach(this.$('#pm_filer_selected_term_ul li i'), function(tag) {
        //pm_filer_item_2_HOST
        var tmpId = tag.id.substring(14);
        tagList[tagList.length] = {
          id: tag.id,
          CLASS_ID: tmpId.substring(0, tmpId.indexOf("_")),
          TAG_ID: tmpId.substring(tmpId.indexOf("_") + 1)
        };
      });
      if (tagList.length == 0) {
        this.tagList = undefined;
      } else {
        this.$('.pm_filter_select').show();
        this.tagList = tagList;
      }
      this.resizeByTagChange();
      this.search();
		},
    selectedFilterItemClose: function(e) {
      var self = this;
      var itemId = e.currentTarget.id;
      for (var i = 0; i < this.tagList.length; i++) {
        var tag = this.tagList[i];
        if (tag.id == itemId) {
          this.tagList.splice(i, 1);
          self.$('[name=' + itemId + ']').remove();
        }
      }
      //
      self.$('#' + itemId).show();
      //
      if (this.tagList.length == 0) {
        this.tagList = undefined;
        this.$('.pm_filter_select').hide();
      }
      this.resizeByTagChange();
      this.search();
    },
		resetname:function(){
			this.$el.find('.res-search-input').val("")
			this.search();
		},
		search:function(){
			 var name  = this.$el.find('.res-search-input').val()
			 this.params.where={};
			 if(name.length>0){
				  this.params.where.resname=name;
			 }else{
				  this.params.where.resname=null;
			 }
			 if(this.tagList){
				  var pims =[];
					var vims =[];
					var vendor =[];
					var ps = [];
          fish.each(this.tagList,function(d){
               if(d.CLASS_ID=="PIM"){
								  if(d.TAG_ID){
										pims.push("'"+d.TAG_ID+"'")
									}
							 }
							 if(d.CLASS_ID=="VIM"){
								  if(d.TAG_ID){
										vims.push("'"+d.TAG_ID+"'")
									}
							 }
							 if(d.CLASS_ID=="VE"){
								  if(d.TAG_ID){
										vendor.push("'"+d.TAG_ID+"'")
									}
							 }
							 if(d.CLASS_ID=="AREA"){
								  if(d.TAG_ID){
										ps.push("'"+d.TAG_ID+"'")
									}
							 }

				 })
				 ///
				 if(pims.length>0){
					 this.params.where.pim =pims.join(',')
				 }
				 if(vims.length>0){
					 this.params.where.vim =vims.join(',')
				 }
				 if(vendor.length>0){
					 this.params.where.vendor =vendor.join(',')
				 }
				 if(ps.length>0){
					 this.params.where.ps =ps.join(',')
				 }

			 }
			 console.log('tagList',this.params)
       this.getKpiList();
		},

		resizeByTagChange: function() {
				var self = this;
				self.$(".js-kpi-grid:visible").jqGrid('setGridHeight', self.$('.js-kpi-left-panel').height() - self.$('.pm_filter_box').height() - 70);
		},
    getKpiByTag: function(REL_ID) {
      if (!this.EMS_TYPE_REL_ID || this.EMS_TYPE_REL_ID != REL_ID) {
        this.EMS_TYPE_REL_ID = REL_ID;
        var param = {
          "EMS_TYPE_REL_ID": REL_ID
        };
        this.getKpiList(param);
      }
    },


  });
});
