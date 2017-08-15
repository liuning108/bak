var canvas =   document.getElementById('canvas')
var ctx = canvas.getContext('2d');
var MARGIN=105;
var FONT_HEIGHT=35;
var RADIUS=canvas.width/2-MARGIN;
ctx.font = FONT_HEIGHT + 'px Arial'
loop = window.setInterval(drawClock,1000);

function drawClock(){
  drawCircle()
  drawCenter();
  drawNumbers();
}

function drawCircle(){
  ctx.beginPath();
  var x= canvas.width/2;
  var y =canvas.height/2
  ctx.arc(x,y,RADIUS,0,Math.PI*2,true);
  ctx.stroke();
}


function drawCenter(){
  ctx.beginPath();
  var x= canvas.width/2;
  var y =canvas.height/2
  ctx.arc(x,y,5,0,Math.PI*2,true);
  ctx.fill();
}


function drawNumbers(){
  var nums =[1,2,3,4,5,6,7,8,9,10,11,12];
  var angle=0;
  var numW=0;
  nums.forEach(function(num){
     angle = Math.PI/6*(num-3)
     x = canvas.width/2+Math.cos(angle)* RADIUS
     y = canvas.height/2+Math.sin(angle)* RADIUS+FONT_HEIGHT/3
     ctx.fillText(num,x,y)
  })
}
