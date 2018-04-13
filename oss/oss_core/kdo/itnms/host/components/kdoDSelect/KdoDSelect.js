define([
       "text!oss_core/kdo/itnms/host/components/kdoDSelect/kdoDSelect.html",
      ]
    ,function(tpl) {
    var KdoDSelect = function(options){
      this.options= options
      this.doProcess();
      this.$el =$(this.options.el);
      this.tpl = fish.compile(tpl)
      console.log("KdoDSelect");
      console.log(this.options);
    }
    KdoDSelect.prototype.doProcess=function() {
       var self = this;
       var R = fish.filter(self.options.R,function(d){
          return !fish.findWhere(self.options.L,d);
       })
       this.options.R=R;

    },

    KdoDSelect.prototype.render=function(){
      this.remove();
      this.$el.html(this.tpl({
          L: this.options.L,
          R: this.options.R
      }));
      this.afterRender();
    }
    KdoDSelect.prototype.remove =function() {
      this.$el.html("");
    }
    KdoDSelect.prototype.afterRender=function () {
      var self =this;
      this.$el.find('.ROp').off('click').on('click',function() {
        self.RopEvent();
      })
      this.$el.find('.LOp').off('click').on('click',function() {
        self.LOpEvent();
      })
      this.$el.find('.LF').off('keyup').on('keyup',function() {
        self.LFEvent($(this).val());
      })
      this.$el.find('.RF').off('keyup').on('keyup',function() {
        self.RFEvent($(this).val());
      })
    }

    KdoDSelect.prototype.RopEvent=function() {
       var option =this.$el.find(".lSelect option:selected");
       if(option.length<=0)return;
       this.$el.find(".rSelect").append(option.clone());
       option.remove();

    }

    KdoDSelect.prototype.LOpEvent=function() {
      var option =this.$el.find(".rSelect option:selected");
      if(option.length<=0)return;
      this.$el.find(".lSelect").append(option.clone());
      option.remove();
    }
    KdoDSelect.prototype.LFEvent=function(txt) {
      if(txt.length<=0)
      {
        this.$el.find(".lSelect").find('option').show();
      }else{
        this.$el.find(".lSelect").find('option').hide();
        this.$el.find(".lSelect").find('option[data-name*="'+txt+'"]').show();
      }

    }

    KdoDSelect.prototype.RFEvent=function(txt) {
      if(txt.length<=0)
      {
        this.$el.find(".rSelect").find('option').show();
      }else{
        this.$el.find(".rSelect").find('option').hide();
        this.$el.find(".rSelect").find('option[data-name*="'+txt+'"]').show();
      }

    }
    KdoDSelect.prototype.val=function(){
        return fish.map(this.$el.find('.lSelect').find('option'),function(dom){
              return {
                 name: $(dom).data('name')+"",
                 value: $(dom).val()+""
              }
        });
    }

    KdoDSelect.prototype.valR=function(){
        return fish.map(this.$el.find('.rSelect').find('option'),function(dom){
              return {
                 name: $(dom).data('name')+"",
                 value: $(dom).val()+""
              }
        });
    }



    return KdoDSelect;

})
