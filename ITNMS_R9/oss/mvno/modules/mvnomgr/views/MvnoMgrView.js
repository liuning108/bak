define([ "text!mvno/modules/mvnomgr/templates/MvnoMgr.html",
		'mvno/modules/mvnomgr/actions/MvnoAction',
		'mvno/modules/mvnomgr/views/QualifyView',
		'mvno/modules/mvnomgr/views/PrivAssignView',
		'mvno/modules/mvnomgr/views/BusinessScopeAssignView',
		'mvno/modules/mvnomgr/views/ParameterInitializationView',
		'modules/rolemgr/actions/RoleMgrAction',	
		"frm/fish-desktop/third-party/fileupload/fish.fileupload",
		"i18n!mvno/modules/mvnomgr/i18n/mvnomgr",
		"css!mvno/modules/mvnomgr/css/mvnomgr",
		"css!frm/fish-desktop/third-party/fileupload/fileupload"
], function(TplMvno,MvnoAction, QualifyView, PrivAssignView, BusinessScopeAssignView, ParameterInitializationView, RoleMgrAction, Upload, I18N) {
	
	return portal.BaseView.extend({

		template : fish.compile(TplMvno),

		events: {
			// "click .js-mvno-grid .inline-lock": 'lockMvno',
			// "click .js-mvno-grid .inline-unlock": 'unlockMvno',
			// "click .js-mvno-grid .inline-exchange": 'exchangeMvno',
			// "click .js-mvno-grid .inline-review": 'reviewMvno',
			"click .js-mvno-his": 'showHistory'
		},

		initialize: function() {
			this.colModel = [{
				name: 'spId',
				key: true,
				hidden: true
			}, {
				name: 'spName',
				label: I18N.MVNOMGR_MVNO_NAME,
				width: "15%",
				sortable: false,
				search: true,
				editable: true,
				editrules: I18N.MVNOMGR_MVNO_NAME + ":required;length[1~60, true]"
			}, {
				name: "stdCode",
				label: I18N.MVNOMGR_MVNO_CODE,
				width: "6%",
				sortable: false,
				search: true,
				editable: true,
				editrules: I18N.MVNOMGR_MVNO_CODE + ":required;length[1~60, true]"
			}, {
				name: "contactName",
				label: I18N.MVNOMGR_MVNO_CONTACTS,
				width: "8%",
				sortable: false,
				search: true,
				editable: true,
				editrules: I18N.MVNOMGR_MVNO_CONTACTS + ":required;length[1~60, true]"
			}, {
				name: "contactInfo",
				label: I18N.MVNOMGR_MVNO_CONTACT_INFORMATION,
				width: "8%",
				sortable: false,
				search: true,
				editable: true,
				editrules: I18N.MVNOMGR_MVNO_CONTACT_INFORMATION + ":required;length[1~60, true]"
			}, {
				name: "state",
				label: I18N.MVNOMGR_MVNO_STATE,
				width: "6%",
				sortable: false,
				search: true,
//				editable: true,
				editrules: I18N.MVNOMGR_MVNO_STATE + ":required;length[1~60, true]",
				formatter: "select",
				formatoptions:{
					value: {'A':I18N.COMMON_ACTIVE,'X':I18N.COMMON_INACTIVE}
				}
			}, {
				name: 'operate',
				label: '',
				formatter: 'actions',
				width: "15%",
				formatoptions: {
					delbutton: true,
					editbutton: false
					// inlineButtonAdd: [{
					// 	id: "jLockButton",
					// 	className: "inline-lock",
					// 	icon: "fa fa-lock",
					// 	title: I18N.MVNOMGR_MVNO_OPT_LOCK
					// },{
					// 	id: "jUnLockButton",
					// 	className: "inline-unlock",
					// 	icon: "fa fa-unlock-alt",
					// 	title: I18N.MVNOMGR_MVNO_OPT_UNLOCK,
					// 	hidden: true
					// },{
					// 	id: "mvno-exchange",
					// 	className: "inline-exchange",
					// 	icon: "fa fa-exchange",
					// 	title: I18N.MVNOMGR_MVNO_OPT_EXCHANGE
					// },{
					// 	id: "mvno-review",
					// 	className: "inline-review",
					// 	icon: "iconfont icon-shenhe",
					// 	title: I18N.MVNOMGR_MVNO_OPT_REVIEW
     //                }]
				}
			}];

			this.setViews({
                "#collapseFirst": new QualifyView(),
                "#collapseSecond": new PrivAssignView()
//			,
//                "#collapseThird": new BusinessScopeAssignView(),
//                "#collapseFourth": new ParameterInitializationView()
            });
		},

		render: function() {
			this.setElement(this.template(I18N));
		},
		afterRender: function() {

			this.portalDetailForm = this.$(".js-mvno-detail").form('disable');
			//向导页
			this.collapseEffective();
			
		},
		// lockMvno: function(e) {
		// 	fish.confirm(I18N.MVNOMGR_LOCK_MVNO_CONFIRM,function() {
		// 	    var rowid = $(e.target).closest("tr.jqgrow").attr("id");
		// 	    $("#jLockButton_" + rowid, ".js-mvno-grid").hide();
		// 	    $("#jUnLockButton_" + rowid, ".js-mvno-grid").show();
		// 	}.bind(this), $.noop);
		// },
		// unlockMvno: function(e) {
		// 	fish.confirm(I18N.MVNOMGR_UNLOCK_MVNO_CONFIRM,function() {
		// 	    var rowid = $(e.target).closest("tr.jqgrow").attr("id");
		// 	    $("#jLockButton_" + rowid, ".js-mvno-grid").show();
		// 	    $("#jUnLockButton_" + rowid, ".js-mvno-grid").hide();
		// 	}.bind(this), $.noop);
		// },
		// exchangeMvno: function(e) {
		// 	fish.confirm(I18N.MVNOMGR_EXCHANGE_MVNO_CONFIRM,function() {
		// 	}.bind(this), $.noop);
		// },
		// reviewMvno: function(e) {
		// 	fish.confirm(I18N.MVNOMGR_REVIEW_MVNO_CONFIRM,function() {
		// 	    var rowid = $(e.target).closest("tr.jqgrow").attr("id"),
		// 	    	$grid = $(".js-mvno-grid"),
		// 	    	selrow = $grid.grid("getSelection"),
		// 	    	mvnoHaveReview = '已审核',
		// 	    	mvnoUnReview = '未审核';
		// 	    if (selrow.mvnoState == mvnoHaveReview) {
		// 	    	selrow.mvnoState = mvnoUnReview;
		// 	    } else {
		// 	    	selrow.mvnoState = mvnoHaveReview;
		// 	    }
		// 	    $grid.grid("setRowData", selrow);
		// 	}.bind(this), $.noop);
		// },
		collapseEffective: function() {
			var ts = this;

			$('#collapseFirst,#collapseSecond,#collapseThird,#collapseFourth').collapse({
				toggle: false
			});

			// $('#collapseFirst').on("collapse:show",function(){
				if(!ts.mvnoTree){
					ts.mvnoTree = ts.$(".js-mvno-grid").grid({
						treeGrid: true,
						expandColumn: "spName",
						colModel: ts.colModel,
						caption: I18N.MVNOMGR_MVNO_LIST,
						data: [],
						onChangeRow: function(e, rowid) {
							ts.onChangeRow();
						},
						beforeDeleteRow: ts.deleteRow.bind(ts),
						pagebar: true
					});
					ts.mvnoTree.grid("navButtonAdd",[{
		                caption: I18N.MVNOMGR_MVNO_HISTORY,
		                cssprop: "js-mvno-his"
		            }]);
				}

				//查询树表格列表
				MvnoAction.qryMvnoList(function(data) {
					var treeData = fish.nest(data, "spId", "parentSpId", "children"); 
					if (treeData.length > 0) {
						treeData[0].expanded = true;
						ts.mvnoTree.grid("reloadData", treeData);
						ts.mvnoTree.grid("setSelection", treeData[0]);
					}
				});
				
			// })

			//nav事件
            $(".mvno-config-nav .btn").on("click", function (e) {
            	var $that = $(this),
            	$collapseHref = $that.attr('href');
				
				if (!$that.hasClass('active')) {
	            	$('#collapseFirst,#collapseSecond,#collapseThird,#collapseFourth').collapse('hide');
	                $($collapseHref).collapse('show');
	                ts.initCollapse($collapseHref);
				}
                //nav
                $(".mvno-config-nav .btn").removeClass('active');
                $that.addClass('active');
                if (!$that.hasClass('visited')) {
                	$that.addClass('visited');
                }
                e.preventDefault();
                return false;
            });
            $(".mvno-config-nav .collapse-first").trigger("click");
		},
		onChangeRow: function() {
			var mvnoData = this.mvnoTree.grid('getSelection');
			this.portalDetailForm.form("clear");
			this.portalDetailForm.form('value', mvnoData).form("disable");
			$(".mvno-config-nav .collapse-first").trigger("click");
			this.reloadView();
		},
		deleteRow: function( e, rowid, rowData){		
			// var rowData = this.$(".js-mvno-grid").grid("getSelection");
		    var level = this.$(".js-mvno-grid").grid("getNodeDepth",rowData);
			//自身所在的mvno不能删除
			if (level == 0){
				fish.warn(I18N.MVNOMGR_DELETE_ROOT_WARN);				
			}
			else
			{	
				fish.confirm(I18N.MVNOMGR_DELETE_CONFIRM,function() {
					MvnoAction.delMvno(rowData.spId,function(data){						
							var rowId = this.$(".js-mvno-grid").grid("getRowid", rowData);
							var parentData = this.$(".js-mvno-grid").grid("getNodeParent", rowData); //获取父节点
							this.$(".js-mvno-grid").grid("setPrevSelection", rowData);
							this.$(".js-mvno-grid").grid("delTreeNode", rowData);
							
							fish.success(I18N.MVNOMGR_DELETE_SUCCESS);
						}.bind(this)
					);
				}.bind(this), $.noop);
			}
			return false;
		},
		reloadView: function(){
            var level = this.$(".js-mvno-grid").grid("getNodeDepth",this.$(".js-mvno-grid").grid("getSelection"));
			//自身所在的mvno不能编辑
			// if (level == 0){
			// 	this.$(".js-mvno-edit")[0].disabled = true;
			// }
			// else {
				this.$(".js-mvno-edit")[0].disabled = false;
			// }
			this.$(".js-mvno-new").parent().show();
			this.$(".js-mvno-new").parent().next().hide();
		},
		initCollapse:function(target){
			var mvnoData = this.mvnoTree.grid('getSelection');
			if (mvnoData.spId !== undefined){
				//collapse切换，初始化对应view的数据
				if ('#collapseFirst' == target){	
					var mvnoData = this.mvnoTree.grid('getSelection');
					this.portalDetailForm.form("clear");
					this.portalDetailForm.form('value', mvnoData).form("disable");			
					this.reloadView();
				}
				if ('#collapseSecond' == target){
						var level = this.$(".js-mvno-grid").grid("getNodeDepth",this.$(".js-mvno-grid").grid("getSelection"));
						this.getView("#collapseSecond").reloadView(mvnoData,level);
						
				}
				if ('#collapseThird' == target){
						this.getView("#collapseThird").afterRender();						
				}
				if ('#collapseFourth' == target){
					this.getView("#collapseFourth").afterRender();						
				}
			}			
		},
		showHistory: function(){
			var mvnoData = this.mvnoTree.grid('getSelection');
			fish.popupView({
				url: "mvno/modules/mvnomgr/views/MvnoHis",
				viewOption: {
					spId: mvnoData.spId
				}
			});
		}
	});
});