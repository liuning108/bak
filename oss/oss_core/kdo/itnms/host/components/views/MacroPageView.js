define(["oss_core/kdo/itnms/host/actions/HostAction",
      "text!oss_core/kdo/itnms/host/components/views/MacroPageView.html"],function(
        action,tpl
      ) {
  var MacroPageView = function(option){
    this.option=option;
    this.$el= $(this.option.el);
    this.tpl=fish.compile(tpl)

  }
  MacroPageView.prototype.render=function() {
    this.remove();
    this.$el.html(this.tpl());
    this.afterRender();

  }
  MacroPageView.prototype.afterRender=function() {
     this.renderGird();
  }
  MacroPageView.prototype.remove=function() {
    this.$el.html("");
  }

  MacroPageView.prototype.renderGird = function() {
    var mydata = [
      {
        name: 'Macro A',
        value: "12321",
        edit:true,
        id: '1'
      }, {
        name: 'Macro B',
        value:"fjdkfj",

        id: '1'
      }
    ];
    var opt = {
      data: mydata,
      height: 300,
      colModel: [
        {
          name: 'name',
          label: 'Macro',
          align: 'center',
          formatter: function(cellval, opts, rwdat, _act) {
            return "<input  class='mmm' value="+cellval+"/>"
          }
        },
        {
          name: 'value',
          label: 'Value',
          align: 'center',
          formatter: function(cellval, opts, rwdat, _act) {
              return "<input value="+cellval+"/>"
          }
        }, {
          name: 'id',
          label: '',
          width: 50,
          'title': false,
          formatter: function(cellval, opts, rwdat, _act) {
            return cellval
          }
        }
      ]
    };

    $grid = this.$el.find('.HostMarcoGrid').grid(opt);
    this.$el.find('.HostMarcoOK').off('click').on('click',function(){
      var data = $grid.grid("getDataIDs");//获取所有的rowid记录
      var newData=fish.map(data,function(rowid){
        var selrowDom = $grid.grid("getGridRowById", rowid); //获取行的dom对象
        console.log(selrowDom);
        return $(selrowDom).find('.mmm').val();
      })
      console.log(newData);


      console.log("getRowData")
      console.log(data);
    })

  }
  return MacroPageView
})
