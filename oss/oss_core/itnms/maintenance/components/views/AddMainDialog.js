define([
  "text!oss_core/itnms/maintenance/components/views/AddMainDialog.html",
  "oss_core/itnms/maintenance/components/views/BaseInfoView",
  "oss_core/itnms/maintenance/components/views/PeriodsInfoView",
  "oss_core/itnms/maintenance/components/views/HostGroupInfoView",
], function(tpl,BaseInfoView,PeriodsInfoView,HostGroupInfoView) {
  var AddMainDialog = function() {
    this.tpl = fish.compile(tpl);
    this.state = {
      data: [
        '.Step1', ".Step2", ".Step3"
      ],
      curIndex: 0
    }
  };
  AddMainDialog.prototype.content = function() {
    this.$el = $(this.tpl())
    return this.$el;
  }
  AddMainDialog.prototype.popup = function(options, props, callback) {
    options.content = this.content(),
    this.popOption=options;
    this.$popup = fish.popup(options);
    this.props = props;
    this.callback = callback;
    this.afterPopup();
  }
  AddMainDialog.prototype.afterPopup = function() {
    var self = this;
    this.$el.find('.stepNext').off('click').on('click', function() {
      self.stepNext($(this))
    })
    this.$el.find('.stepUp').off('click').on('click', function() {
      self.stepUp($(this))
    })
    this.$el.find('.mainPageCancel').off('click').on('click',function(){
        self.$popup.hide();
    })
    this.loadAllPage();
  }
  AddMainDialog.prototype.loadAllPage=function(){
    this.baseInfoView=new BaseInfoView({
      el: this.$el.find('.Step1Page')
    });
    this.baseInfoView.render();
    this.periodsInfoView=new PeriodsInfoView({
      el: this.$el.find('.Step2Page'),
      'tableW':this.popOption.width,
      'H':this.popOption.height,
      'positionEL':this.$el
    })
    this.periodsInfoView.render();
    this.hostGroupInfoView= new HostGroupInfoView({
      el: this.$el.find('.Step3Page'),
     "catatlog":this.props.catatlog,
    });
    this.hostGroupInfoView.render();


  }
  AddMainDialog.prototype.stepUp = function(_this) {
    var $ws = this.$el.find('.kdoWizardSteps')
    //把当前的状态设置为active,complete,当前显示的页面为hide
    var curState = this.state.data[this.state.curIndex];
    $ws.find(curState).removeClass('complete').removeClass('active')
    var curView = $ws.find(curState).data('view');
    this.$el.find(curView).hide();
    //把下个状态设置为active
    this.state.curIndex = this.state.curIndex - 1;
    if (this.state.curIndex <= 0) {
      this.$el.find('.stepUp').removeClass('show').addClass('hide');
    }
    if (this.state.curIndex < this.state.data.length - 1) {
      this.$el.find('.stepNext').html('下一步')
    }
    var upState = this.state.data[this.state.curIndex]
    $ws.find(upState).addClass('active')
    var upStatePage = $ws.find(upState).data('view');
    this.$el.find(upStatePage).show();
  }
  AddMainDialog.prototype.stepNext = function(_this) {
    var self = this;
    var $ws = this.$el.find('.kdoWizardSteps')
    //把当前的状态设置为complete,当前显示的页面为hide
    var curState = this.state.data[this.state.curIndex];
    $ws.find(curState).removeClass('active').addClass('complete');
    var curView = $ws.find(curState).data('view');
    if (this.state.curIndex < this.state.data.length - 1) {
      this.$el.find(curView).hide();
    }
    //把下个状态设置为active
    this.state.curIndex = this.state.curIndex + 1;
    if (this.state.curIndex > 0) {
      this.$el.find('.stepUp').removeClass('hide').addClass('show');
    }
    if (this.state.curIndex >= this.state.data.length - 1) {
      _this.html('完成');
    }
    var nextState = this.state.data[this.state.curIndex]
    $ws.find(nextState).addClass('active')
    var curView = $ws.find(nextState).data('view');
    this.$el.find(curView).show();
    if (!nextState) {
      self.done();
      this.state.curIndex = this.state.curIndex - 1;
    }

  }
  AddMainDialog.prototype.done = function() {
    alert(this.baseInfoView.getInfo());
    alert(this.periodsInfoView.getInfo());
    alert(this.hostGroupInfoView.getInfo());
  }
  return AddMainDialog;
})
