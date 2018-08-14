define([
  "oss_core/inms/pm/graphs/components/views/RootView.js", "oss_core/inms/pm/graphs/utils/util.js",
  "text!oss_core/inms/pm/graphs/components/graphstabs/PropPageView.html",
], function(RootView, util,tpl) {
  var evetMap = [
  ]

  var PropPageView = function(option){
     RootView.call(this, option)
   };
   PropPageView.prototype = Object.create(RootView.prototype);
   PropPageView.prototype.constructor = PropPageView;
    PropPageView.prototype.initProp= function() {
      this.tpl = fish.compile(tpl);
      this.evetMap = evetMap;
    },
    PropPageView.prototype.loadPage= function() {
      this.$el.html(this.tpl());
    },
    PropPageView.prototype.getJSON =function(){
        json = {};
        json.h = this.$el.find('.propH').val();
        json.r= this.$el.find('.propR').val();
        json.i=this.$el.find('.propI').val();
        json.showlable=this.$el.find('.propShowLable').is(':checked')?"o":"c";
        json.showscale=this.$el.find('.propShowScale').is(':checked')?"o":"c";
        return json;
    }
    PropPageView.prototype.afterRender= function() {

      console.log('PropPageView PropPageView',this.option.state);
      this.initPage();

    },
    PropPageView.prototype.initPage=function(){
      var self =this;
      var config=this.option.state.config||{};
      var propPageConfig=config.propPage||{};
      console.log('PropPageView 22222',propPageConfig);
      var h = propPageConfig.h||"";
      var i = propPageConfig.i||"";
      var r = propPageConfig.r||"";
      var showlabel=propPageConfig.showlable||'o';
      var showscale=propPageConfig.showscale||'c';

      this.$el.find('.propH').val(h);
      this.$el.find('.propI').val(i);
      this.$el.find('.propR').val(r);
      if(showlabel=='o'){
       this.$el.find('.propShowLable').attr('checked',true);
      }else{
       this.$el.find('.propShowLable').attr('checked',false);
      }
      if(showscale=='o'){
        this.$el.find('.propShowScale').attr('checked',true);
      }else{
        this.$el.find('.propShowScale').attr('checked',false);
      }

    }
  return PropPageView;
});
