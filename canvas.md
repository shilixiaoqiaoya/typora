# Canvas

### 基本使用

- html5新增元素==>画布
- canvas元素只有2个属性，width和height，默认值是w-300px；h-150px
- 坐标原点默认在canvas元素左上角

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







### canvas.getContext()

- 用于获取和画布关联的绘图上下文对象，它提供了在画布上绘制图形的各种方法
- **常见的上下文类型有2D和WebGL**
  - 2d 用于二维绘图
  - webgl 用于三维图形渲染

![image-20250126144743117](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250126144651077.png)





### 路径

- 图形的基本元素是路径
  - 先创建路径起始点
  - 使用绘图命令画出路径
  - 之后把路径闭合
  - 一旦路径生成，就可以通过**描边stroke**或**填充路径区域fill**来渲染图形
- beginPath()：新建一条路径，图形绘制命令被指向到新的路径上
- closePath()：闭合路径，图形绘制命令被指向到beginpath之前的路径上



##### 画线段

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



##### 画三角形

```js
ctx.beginPath()
ctx.moveTo(50, 0)
ctx.lineTo(100, 50)
ctx.lineTo(50, 100)
ctx.closePath()   // 闭合路径
ctx.stroke()
```





### 图像样式

- fillStyle = color： 设置填充颜色，需在fill()函数前调用
- strokeStyle = color: 设置描边颜色，需在stroke()函数前调用
- color表示：关键字、十六进制、rgb、rgba
- 设置透明度：第一种通过rgba，第二种通过ctx.globalAlpha()全局设置透明度
- 绘制文本：fillText(text, x, y)、strokeText(text, x, y)

```js
ctx.font = "30px Arial";
ctx.fillStyle = "green";
ctx.fillText("hello cxanvas", 50, 50);
```

- 绘制图片：drawImage(image, x, y, width, height)【width height是以多大尺寸展示在画布上】

```javascript
let image = new Image()
image.src = 'demo.png'
image.onload = function() {
	ctx.drawImage(image, 0, 0, 180, 130)
}
```







### 实现涂鸦效果

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





### 实现时钟

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







































