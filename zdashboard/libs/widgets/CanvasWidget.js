define(["text!oss_core/pm/zdashboard/libs/widgets/CanvasWidget.html"], function(tpl) {
  return portal.BaseView.extend({
    template:fish.compile(tpl),
    initialize:function(opt){
      this.w=opt.w;
      this.h=opt.h;

    },
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    afterRender: function() {

      this.c = this.$el.find('#MyCanvas')[0];
      this.timeText= this.$el.find('#MyTime');
      this.ctx =this.c.getContext('2d');
      //
      this.c.width=this.w-5;
      this.c.height=this.h-10;
      this.deg_to_pi=Math.PI/180;
      this.count=200;
      var center={
          x: this.c.width/2,
          y: this.c.height/2
      }
      this.timeText.css({
         'top':(center.y*2-15)+"px",
         'left':(center.x-this.timeText.width()/2)+"px",
      })
      this.time=0;
      var self =this;
      this.ctx.translate(center.x,center.y)
      window.setInterval(function(){
        self.draw()
      },10)
    },
    draw:function(){

      var ctx =this.ctx;
      var time = this.time;

      ctx.clearRect(-this.w,-this.h,this.w*2,this.h*2);
      this.drawXY(ctx);
      this.drawCircle(ctx);
      this.drawNumber(ctx,3.5);
      this.drawNumber(ctx,1.9);
      this.drawTime(ctx);


      this.time++;

    },
    drawTime:function(ctx){
      var now = new Date();
      var sec = now.getSeconds();
      var min = now.getMinutes();
      var hour = now.getHours();
      this.timeText.text(this.format(hour)+":"+this.format(min)+":"+this.format(sec));
      var r =fish.min([this.c.width,this.c.height])/2;
      this.drawPointer(ctx,r,-360*(sec/60),1.5);
      this.drawPointer(ctx,r-r*.5,-360*(min/60),4);
      this.drawPointer(ctx,r-r*.3,-360*(hour+(min/60))/12,6);


    },
    drawPointer:function(ctx,r,deg,lineWidth){
      ctx.beginPath();
      ctx.lineWidth=lineWidth;
      var now_deg =(deg+90)*this.deg_to_pi;
      ctx.moveTo(0,0);
      ctx.lineTo(
         r*Math.cos(now_deg),
         r*Math.sin(now_deg),
      );
      ctx.strokeStyle='rgba(1,123,185,'+1+')'
      ctx.stroke();

    },
    format:function(v) {
      var v =""+v;
      if(v.length<=1)return "0"+v;
      return v;
    },

    drawNumber:function(ctx,nums){
        var r =fish.min([this.c.width,this.c.height])/nums;
        var n = this.count;

        ctx.lineWidth=1;
        for(var i =0;i<=n;i++){
          var deg = 360*(i/n)* this.deg_to_pi;
          ctx.beginPath();
          var len = 4+(i%10==0?4:0)+(i%50==0?8:0);
          var opacity=(len>4)?1:0.7
          var sR= r;
          var eR= r+len
          var x = Math.cos(deg)*(sR);
          var y = Math.sin(deg)*(sR);

          var x2 = Math.cos(deg)*eR;
          var y2 = Math.sin(deg)*eR;

          ctx.moveTo(x,y);
          ctx.lineTo(x2,y2);
          ctx.strokeStyle='rgba(1,123,185,'+opacity+')'
          ctx.stroke();
        }


    },
    drawCircle:function(ctx){
      var r =fish.min([this.c.width,this.c.height])/4;
       ctx.beginPath();
      ctx.lineWidth=2;
      var n=this.count;
      for(var i= 0 ;i<=n;i++){
        var now_r=r+2*Math.sin(Math.PI*2*i/10+this.time/20);
        var deg = i*(360/n)*this.deg_to_pi;
        var x = Math.cos(deg)*now_r;
        var y = Math.sin(deg)*now_r;
        ctx.lineTo(x,y);
      }

         ctx.strokeStyle='rgba(1,123,185,1)'
         ctx.stroke();



    },
    drawXY:function(ctx){
       ctx.beginPath();
       ctx.lineWidth=1;
       ctx.strokeStyle='rgba(1,123,185,0.1)'
       ctx.moveTo(-this.c.width/2,0);
       ctx.lineTo(this.c.width/2,0);
       ctx.moveTo(0,-this.c.height/2)
       ctx.lineTo(0,this.c.height/2)
       ctx.stroke();
    },
    widgetResize: function(w, h) {
      this.w=w;
      this.h=h;
      this.c.width=w-5;
      this.c.height=h-10;
      var center={
          x: this.c.width/2,
          y: this.c.height/2
      }
      this.timeText.css({
         'top':(center.y*2-15)+"px",
         'left':(center.x-this.timeText.width()/2)+"px",
      })
      this.ctx.translate(center.x,center.y)
      console.log("widgetResize"+":"+w+":"+h)
      this.time=0;
      this.draw();
    }
  });
})
