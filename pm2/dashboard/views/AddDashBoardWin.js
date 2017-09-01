define([
        'text!oss_core/pm/dashboard/templates/AddDashBoardWin.html',
        'text!oss_core/pm/dashboard/templates/CatalogItem.html',
        "oss_core/pm/dashboard/actions/DashBoardAction",
        
    ],
    function(RuleMgrView,CatalogItemTemp,action) {
        return portal.CommonView.extend({
            className : "ui-dialog dialog",
            //加载模板
            template: fish.compile(RuleMgrView),
            catalogItem:fish.compile(CatalogItemTemp),
            events : {
              'click #btn-slm-dashboard-ok':'fnOK',
              'click #btn-slm-dashboard-cancel':'fnCancel'
            },

            initialize: function(config) {
                this.config=config
            },

            render: function() {
                this.$el.html(this.template(this.resource));
                return this;
            },

            contentReady: function() {

              $('.dashboardCatalogs').slimscroll({
                              height: '290px',
                              width:'290px'
                            });
              this.config.catalogs[0].classStyle="selCatalog"
              $("#dashboard-catalog-select").html(this.catalogItem(this.config));

               $("#dashboard-catalog-select").find('li').off('click').on('click',function(){
                   $("#dashboard-catalog-select").find("li").removeClass("selCatalog");
                   $(this).addClass("selCatalog");
               })
            },



            fnOK: function() {
                var dashboardName = $('#dashboard-newname').val();
                var classNo= $("#dashboard-catalog-select").find('.selCatalog').data('id');
                var json = {
                    id:0,
                    classNo:classNo,
                    name:dashboardName
                }

                if(dashboardName.length<=0){
                  $('#dashboardTitleTip').show();
                  return ;
                }
                this.trigger("okEvent", json);
            },

            fnCancel: function() {
                this.trigger('cancelEvent');
            }
        });
    }
);
