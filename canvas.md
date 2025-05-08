# 基本使用

- html5新增元素
- canvas元素只有2个属性，width和height，默认值是w-300px；h-150px
- 坐标原点默认在canvas元素左上角
- 需要结束标签

```js
 <canvas id='demo' width='300' height='300'></canvas>

let canvasEl = document.getElementById('demo')
let ctx = canvasEl.getContext('2d')

// 在0，0点绘制一个长100宽50的填充矩形
ctx.fillRect(0, 0, 100, 50)

// 在100，100处绘制一个长100宽50的边框矩形
ctx.strokeRect(100, 100, 100, 50)

// 清除指定区域的矩形
ctx.clearRect(0, 0, 300, 300)
```

![image-20250126144858655](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250126144858655.png)

### 状态保存和恢复

- 保存绘画状态的快照

```js
save()
restore()
```





### Translate

- 移动canvas的原点



### Rotate

- 以原点为中心旋转canvas



### Scale





# getContext()

- 用于获取和画布关联的渲染上下文对象，它提供了在画布上绘制图形的各种方法
- **常见的上下文类型有2D和WebGL**
  - 2d 用于二维绘图
  - webgl 用于三维图形渲染

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250126144651077.png" alt="image-20250126144743117" style="zoom:70%;" />



- 可以通过测试getContext方法是否存在，检测浏览器是否支持canvas标签

```js
if(canvas.getContext) {
  const ctx = canvas.getContext('2d')
}
```







# 路径

- 图形的基本元素是路径
  - 先创建路径起始点
  - 使用绘图命令画出路径
  - 之后把路径闭合
  - 一旦路径生成，就可以通过**描边stroke**或**填充路径区域fill**来渲染图形
- beginPath()：新建一条路径，图形绘制命令被指向到新的路径上
- moveTo()：移动笔触到指定的坐标上
- lineTo()：绘制从当前位置到指定位置的一条直线
- **closePath()：**闭合路径，图形绘制命令被指向到beginpath之前的路径上
  - **【它会绘制一条从当前点到开始点的直线来闭合图形】，如果图形是已经闭合了的，即当前点是开始点，该函数什么也不做**
- stroke()：描边
- fill()：填充
  - 调用fill函数时，没有闭合的形状会自动闭合，可以不调用closePath函数



### 画线段

```js
<canvas id='el' width='300' height='300'></canvas>
const el = document.getElementById('el')
const ctx = el.getContext('2d')
ctx.beginPath()
ctx.moveTo(10, 10)   // 将画笔移到 10,10
ctx.lineTo(100, 10)  // 画线段至 100,10
ctx.closePath()
ctx.stroke()  // 描边
```



### 画三角形

```js
ctx.beginPath()
ctx.moveTo(50, 0)
ctx.lineTo(100, 50)
ctx.lineTo(50, 100)
ctx.closePath()   // 闭合路径
ctx.stroke()
```







# 基本图形绘制

### 矩形

```js
// 填充
ctx.fillRect(x, y, width, height)
// 绘制
ctx.strokeRect(x, y, width, height)
// 清除
ctx.clearRect(x, y, width, height)
```



### 圆弧

```js
// 以x、y为圆心，radius为半径，角度从startAngle到endAngle，默认顺时针false
ctx.arc(x, y, radius, startAngle, endAngle, 顺/逆时针)
```



##### 二次贝塞尔曲线

```js
// cp1x, cp1y是控制点; x,y是结束点
quadraticCurveTo(cp1x, cp1y, x, y)
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508100016622.png" alt="image-20250508100016622" style="zoom:50%;" />

```js
// 利用二次贝塞尔曲线绘制聊天气泡
ctx.beginPath()
ctx.moveTo(75, 25)
ctx.quadraticCurveTo(25, 25, 25, 62.5);
ctx.quadraticCurveTo(25, 100, 50, 100);
ctx.quadraticCurveTo(50, 120, 30, 125);
ctx.quadraticCurveTo(60, 120, 65, 100);
ctx.quadraticCurveTo(125, 100, 125, 62.5);
ctx.quadraticCurveTo(125, 25, 75, 25);
ctx.stroke()
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508100026779.png" alt="image-20250508100026779" style="zoom:50%;" />

##### 三次贝塞尔曲线

```js
// cp1x, cp1y是控制点一; cp2x, cp2y是控制点二；x,y是结束点
bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
```



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508100038952.png" alt="image-20250508100038952" style="zoom:50%;" />

```js
// 利用三次贝塞尔曲线绘制❤
ctx.beginPath();
ctx.moveTo(75, 40);
ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
ctx.fill();
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508100048391.png" alt="image-20250508100048391" style="zoom:50%;" />

### 文本

- fillText(text, x, y)、strokeText(text, x, y)

```js
ctx.font = "30px Arial";
ctx.fillStyle = "green";
ctx.fillText("hello cxanvas", 50, 50);
```



### 图片

- drawImage(image, x, y, width, height)【width height是以多大尺寸展示在画布上】

```javascript
let image = new Image()
image.src = 'demo.png'
image.onload = function() {
	ctx.drawImage(image, 0, 0, 180, 130)
}
```





### Path2D()

- 可存储复用路径

```js
// 创建路径
const triangle = new Path2D();
triangle.moveTo(10, 10);
triangle.lineTo(50, 50);
triangle.lineTo(10, 50);
triangle.closePath();
// 渲染
ctx.fill(triangle);
```







# 样式

- fillStyle = color： 设置填充颜色，需在fill()函数前调用

- strokeStyle = color: 设置描边颜色，需在stroke()函数前调用

- color表示：关键字、十六进制、rgb、rgba

- 设置透明度：第一种通过rgba，第二种通过ctx.globalAlpha()全局设置透明度

  





# 实现刮刮乐

- 利用图像的合成方式 **`globalCompositeOperation`**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508100106214.png" alt="image-20250508100106214" style="zoom:50%;" />



```js
<div class="wrapper">
  <div class="text">谢谢惠顾</div>
  <canvas id="canvas" width="600" height="300"></canvas>
</div>

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "https://picsum.photos/400/300";
img.onload = function () {
  ctx.drawImage(img, 0, 0, 600, 300);
};
let isDraw = false;
canvas.onmousedown = function () {
  isDraw = true;
};
canvas.onmouseup = function () {
  isDraw = false;
};
canvas.onmousemove = function (e) {
  if (!isDraw) return;
  const x = e.pageX;
  const y = e.pageY;
  ctx.globalCompositeOperation = "destination-out";
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
  ctx.fill();
};
```







# 实现涂鸦

```js
let painting = false // 标记是否在绘制
let startPoint = {x: undefined, y: undefined}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 按下时记录初始位置
ctx.onmousedown = (e) => {
  const {offsetX, offsetY} = e
  startPoint.x = offsetX
  startPoint.y = offsetY
  painting = true
}

// 移动时绘制
ctx.onmousemove = (e) => {
  const {offsetX, offsetY} = e
  const newPoint = {x: offsetX, y: offsetY}
  if(painting) {
    drawLine(startPoint.x, startPoint.y, newPoint.x, newPoint.y)
    startPoint = newPoint
  }
}

// 抬起时将painting置为false
ctx.onmouseup = () => {
  painting = false
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath()
  ctx.lineWidth = 3  // 设置线宽度
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()
  ctx.closePath()
}
```







# 实现时钟

```js
function animate(time) {
  // 获取当前时间及时分秒
  const now = new Date()
  const sec = now.getSeconds()
  const min = now.getMinutes()
  let hour = now.getHours()
  hour = hour >= 12 ? hour - 12 : hour
  
  const ctx = document.getElementById('canvas').getContext('2d')
  ctx.save()
  ctx.clearRect(0, 0, 600, 600)
  ctx.translate(300, 300)  // 移动坐标轴中心
  ctx.rotate(-Math.PI / 2)  // 坐标轴逆时针旋转90°
  
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 5
	ctx.save()
  // 绘制小时的刻度
  for(let i=0; i<12; i++) {
    ctx.beginPath()
    ctx.rotate(Math.PI / 6)
    ctx.moveTo(100, 0)
		ctx.lineTo(120, 0)
    ctx.stroke()
  }
  ctx.restore()
  ctx.save()
  // 绘制分钟的刻度
  ctx.lineWidth = 3
  for(let i=0; i<60; i++) {
    ctx.beginPath()
    ctx.rotate(Math.PI / 30)
    ctx.moveTo(110, 0)
    ctx.lineTo(120, 0)
    ctx.stroke()
  }
  ctx.restore()
  ctx.restore()
  window.requestAnimationFrame(animate)
}
window.requestAnimationFrame(animate)
```







































