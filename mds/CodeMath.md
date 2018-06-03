# 代码中的数学

记录工作中和学习中数学在程序中来完成各种任务。

-------------------
[TOC]

## 介绍
我们将使用 Canvas,  来使 数学公式可视化。
更好理解数学在程序中完成任务的原理。


``` javascript
//得到Canvas Dom元素
var canvas  =document.getElementById("canvas");
// 得到 2D 画布
var ctx = canvas.getContext('2d');
// 设置 画布的大小
var width = canvas.width = 500;
var height =canvas.height = 500;
// 开始画

for (var i = 0 ; i <100; i++){
  //开始画新的图形
	ctx.beginPath();
  //移动到哪个点
	ctx.moveTo(Math.random()*width,Math.random()*height);
  //画一条线
  ctx.lineTo(Math.random()*width,Math.random()*height);
  //描线
  ctx.stroke();
}

```
## 三角函数
![1F431ED3-6830-4E13-B280-690E4331BDA5](/assets/1F431ED3-6830-4E13-B280-690E4331BDA5.png)
``` javascript
ctx.translate(0,height/2);
ctx.scale(1,-1);
var d = 78;
for (var i = 0 ; i<Math.PI*2 ; i+=0.01){
	var x = i*d;
	var y = Math.sin(i)*d
	ctx.fillRect(x,y,5,5);
}
````
## 三角函数周期
![1E6D96F5-5E08-4542-BB64-4412853E01E3](/assets/1E6D96F5-5E08-4542-BB64-4412853E01E3.png)

```` javascript
//定义中心
var centerX = w/2;
var centerY =h/2;
//基本R大小
var baseR = 100;
// SinA, A初始值
var angle =0;
// 每一帧，增加A的速度
var speend =0.01;
draw();
function draw(){
  //重点 (Math.sin(angle)*50) 
	//【-50，50】 Sin波周期
	var dr = baseR+(Math.sin(angle)*50);
	ctx.clearRect(0,0,w,h);
	ctx.beginPath();
	ctx.arc(centerX,centerY,dr,0,Math.PI*2);
	ctx.fill();
	angle+=speend;

	requestAnimationFrame(draw);
}
````
## 极坐标


```` javascript
// 计算把2PI，平均给每个对象的Rad
var sliceRad = Math.PI*2/numsObj;
var offsetRad =0;
var  R= 100;
var time =0;
draw();
function draw(){
	ctx.clearRect(0,0,w,h);
	for (var i = 0 ; i<numsObj;i++){
		//计算每个对象所有的RAD
		var rad = i*sliceRad+(offsetRad);
		//极坐标公式
		var  x = centerX+(Math.cos(rad)*R)
		var  y = centerY+(Math.sin(rad)*R)


	  ctx.beginPath();
	  ctx.arc(x,y,5,0,Math.PI*2);
   	ctx.fill();
	  //每秒偏移的RAD
		offsetRad+=0.0005

	}
````
##  使用Arctangent 来算 角度
### 需要得到Mouse 在Canvas位置
### 画对象
### Math.atan2(y/x) 公式算角度
