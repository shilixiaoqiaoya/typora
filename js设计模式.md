## 概括

烹饪有菜谱，游戏有攻略，每个领域都存在一些能够让我们又好又快的达成目标的套路。在程序世界，编程的套路就是「设计模式」

学会驾驭一门语言，能凭借自己深刻的架构思想和工程思想去支配一门语言，利用它去创造好的产出

- **能用健壮的代码解决具体的问题**
- 能用抽象的思维应对复杂的系统
- 能用工程化的思想规划更大规模的业务

面向对象编程的原则

- 单一功能原则
- 开放封闭原则

设计模式的核心思想---**封装变化**

- 把变化留给自己，把统一留给用户
- 在实际开发中，不发生变化的代码是不存在的。我们能做到只有将这个变化造成的影响最小化——**将变与不变分离，确保变化的部分灵活，不变的部分稳定**
- 封装变化，封装的正是软件中不稳定的要素，它是一种防患于未然的行为——提前抽离了变化，就为后续的扩展提供了无限的可能性







## 开放封闭原则

- 软件应该对扩展开放，对修改关闭
- 以乐高玩具举例
  - 可以随时添加新积木，比如加个轮子或飞机翼
  - 不能拆掉已有的积木（修改原有代码）

#### 反例

- 假设有一个计算面积的函数，每次新增一种图形都需要修改代码

```js
function calculateArea(shape) {
  if(shape.type === 'circle') {
    return Math.PI * shape.radius ** 2 
  } else if(shape.type === 'square') {
    return shape.size * shape.size
  } else {
    ...
  }
}
```

#### 修正

- 通过抽象+多态，未来新增图形时只需扩展类，无需修改原有函数

```js
// 抽象基类，对修改关闭
class Shape {
  area() {
    throw new Error('子类必须实现area方法')
  }
}
// 扩展子类，对扩展开放
class Circle extends Shape {
  constructor(radius) {
    super()
    this.radius = radius
  }
  area() {
    return Math.PI * this.radius ** 2 
  }
}

class Square extends Shape {
  constructor(size) {
    super()
    this.size = size
  }
  area() {
    return this.size * this.size
  }
}
// 使用时无需修改代码
function calculateArea(shape) {
  return shape.area()
}
const circle = new Circle(5);
const square = new Square(10);
console.log(calculateArea(circle)); // 78.54
console.log(calculateArea(square)); // 100
```

- 减少风险：修改原有代码可能引入bug，不动原有逻辑最安全
- 提高可维护性：新增功能时，只需添加新代码，而不是在旧代码里‘打补丁’
- 解耦合：各功能独立，通过接口/抽象类交互











## 工厂模式

#### 构造器模式

```js
function User(name, age, career) {
  this.name = name
  this.age = age
  this.career = career
}
```



#### 简单工厂

- 为每份工种提供一个构造函数，每个工种对应的work不同，需要人工去判断工种并为其分配构造函数

```js
function Coder(name , age) {
    this.name = name
    this.age = age
    this.career = 'coder' 
    this.work = ['写代码','写系分', '修Bug']
}
function ProductManager(name, age) {
    this.name = name 
    this.age = age
    this.career = 'product manager'
    this.work = ['订会议室', '写PRD', '催更']
}
```

- 自动进行工种判断，为其分配对应构造函数

```js
function Factory(name, age, career) {
    switch(career) {
        case 'coder':
            return new Coder(name, age) 
            break
        case 'product manager':
            return new ProductManager(name, age)
            break
        ...
}
```

- 复用user类

```js
function User(name , age, career, work) {
    this.name = name
    this.age = age
    this.career = career 
    this.work = work
}

function Factory(name, age, career) {
    let work
    switch(career) {
        case 'coder':
            work =  ['写代码','写系分', '修Bug'] 
            break
        case 'product manager':
            work = ['订会议室', '写PRD', '催更']
            break
        case 'boss':
            work = ['喝茶', '看报', '见客户']
        case 'xxx':
            // 其它工种的职责分配
            ...
            
    return new User(name, age, career, work)
}
```





#### 抽象工厂

- 抽象工厂用来规范具体工厂的通用能力，“是定规矩的”

```js
class MobilePhoneFactory {
  createOS() {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写！')
  }
  createHardware() {
    throw new Error('抽象工厂方法不允许直接调用，你需要将我重写')
  }
}

class FakeStarFactory extends MobilePhoneFactory {
  createOs() {
    return new AndroidOS()
  }
  createHardware() {
    return new QualcommHardware()
  }
}
```





## 单例模式

- 一般地，针对一个类，每次实例化都会返回一个新的对象
- **单例模式：不管类被实例化几次，返回的都是第一次实例化的对象**
- **【避免内存泄漏】**

```js
class SingleDog {
  static getInstance() {
    if(!SingleDog.instance) {
      SingleDog.instance = new SingleDog()
    }
    return SingleDog.instance
  }
}

const s1 = SingleDog.getInstance()
const s2 = SingleDog.getInstance()
console.log(s1 === s2) // true
```



#### 实现storage类

- 通过类的静态方法实现

```js
class Storage {
  static getInstance() {
    if(!Storage.instance) {
      Storage.instance = new Storage()
    }
    return Storage.instance
  }
  
  getItem(key) {
    return localStorage.getItem(key)
  }
  setItem(key，value) {
    return localStorage.setItem(key, value)
  }
}
const storage1 = Storage.getInstance()
const storage2 = Storage.getInstance()

storage1.setItem('name', '李雷')  
storage1.getItem('name')  // 李雷
storage2.getItem('name')  // 李雷
storage1 === storage2  // true
```

- 通过闭包实现

```js
function StorageBase(){}
StorageBase.prototype.getItem = function(key) {
  return localStorage.getItem(key)
}
StorageBase.prototype.setItem = function(key，value) {
    return localStorage.setItem(key, value)
}
const Storage = (function(){
  let instance = null
  return function() {
    if(!instance) {
      instance = new StorageBase()
    } 
    return instance
  }
})()
const storage = Storage()
```







## 原型范式

- **prototype、`_proto_`、原型链**

- 在java等强类型语言中，当想创建一个对象时，会先找到一个对象作为原型，通过克隆原型的方式创建出一个与原型一样的对象
  - **【对应于js中的对象深拷贝】**
  - java专门针对原型模式设计了一套接口和方法





## 装饰器模式

- **装饰器本质上是一个函数，不依赖于任何逻辑而存在**
- 装饰器函数可以对已有的功能做扩展，不改变原有逻辑，只关心扩展出来的新功能如何实现
- core-decorators 库实现了一些高频的装饰器

#### es6示例

- 点击按钮时展示弹窗，在原有逻辑的基础上，在弹窗弹出后把按钮的文案改为“弹窗已弹出”，同时把按钮置灰

```js
class OpenButton {
  onClick() {
    const modal = new Modal()
    modal.style.display = 'block'
  }
}
class Decorator {
  constructor(open_btn) {
    this.open_btn = open_btn
  }
  onClick() {
    this.open_btn.onClick()
    this.changeButtonStatus()
  }
  changeButtonStatus() {
    const btn = document.getElementById('open')
    btn.setAttribute('disabled', true)
    btn.innerText = '弹窗已弹出'
  }
}
const openBtn = new OpenButton()
const decorator = new Decorator(openBtn) 
```





#### es7—类的装饰器

- 装饰器函数，**target指的是「目标类」**

```js
function classDecorator(target) {
	target.hasDecorator = true
  return target
}
@classDecorator   // 将装饰器作用在Button类上
class Button {
  
}
console.log('Button类被装饰了', Button.hasDecorator)
```





#### es7—类的方法的装饰器

- 装饰器函数，**target指的是「`Button.prototype`」，name是函数名，descriptor是「被修饰方法的属性描述符」**

```js
function fnDecorator(target, name, descriptor) {
  let orignFn = descriptor.value
  descriptor.value = function() {
    console.log('我是装饰器逻辑')
    return originFn()
  }
  return descriptor
}

// @语法糖
class Button {
  @fnDecorator
  fn() {
    console.log('我是fn函数的原有逻辑')
  }
}
// @fnDecorator等效于fnDecorator()调用
class Button {
  fn() {}
}
fnDecorator(Button.prototype, 'fn', Object.getOwnPropertyDescriptor(Button.prototype, 'fn'))
```

- 使用场景
  - 拦截方法调用：在原始方法前后插入逻辑
  - 非侵入式增强：不修改原类代码，通过装饰器动态扩展功能
  - 面向切面编程（AOP）：解耦通用逻辑（如日志）和业务逻辑







## 适配器模式





## 代理模式

- 在dns解析过程中，某些域名被禁止解析，比如google

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250410165801424.png" alt="image-20250410165801424" style="zoom:50%;" />

- 使用vpn访问google

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250410165636958.png" alt="image-20250410165636958" style="zoom:50%;" />

#### 保护代理

ES6的proxy，可以在对象某属性get和set时被拦截





#### 事件代理

- 事件委托，利用事件冒泡特性



#### 缓存代理

- 应用在计算量较大的场景里，采用**以空间换时间**
- 对于某个已经计算过的值，不想再耗时进行二次计算，希望可以进行存储，此时需要一个代理在计算的同时，进行计算结果的缓存

```js
const addAll = function(...nums) {
	return nums.reduce((sum, cur) =>  sum + cur, 0)
}

// 为什么要利用自执行函数？new Map()只期望执行一次
const proxyAddAll = (function(){
  const resultCache = new Map()
  return function(...nums) {
    const key = JSON.stringify(nums)
    if(resultCache.has(key)) {
      return resultCache.get(key)
    }
    const result = addAll(...nums)
    resultCache.set(key, result)
    return result
  }
})()
console.log(proxyAddAll(1, 2, 3)); // 首次计算，输出 6
console.log(proxyAddAll(1, 2, 3)); // 命中缓存，直接返回 6
```



#### 虚拟代理

- **用一个轻量对象（代理）控制对重量对象（真实图片）的访问**

##### 图片预加载

- **核心：【先显示占位图，等真实图片加载完成后再替换】**
- 真实对象：需要加载的大图
- 代理对象：轻量的占位图

```js
// 定义真实图片加载器
class RealImage {
  constructor(url) {
    this.url = url
  }
  load() {
    const img = new Image()
    img.src = this.url
    return img
  }
}
// 定义虚拟代理
class ImageProxy {
  constructor(url, placeholderUrl) {
    this.url = url
    this.placeholderUrl = placeholderUrl
    this.realImage = null
  }
  load() {
    if(!this.realImage) {
      // 缩略图占位
      const placeholder = new Image()
      placeholder.src = this.placeholderUrl
      document.body.appendChild(placeholder)
      // 加载真实图片，加载之后代替缩略图
      this.realImage = new RealImage(this.url)
      const realImg = this.realImage.load()
      realImg.load = () => {
        document.body.replaceChild(realImg, placeholder)
      }
      return this.realImage
    }
  }
}
// 使用代理
const proxy = new ImageProxy('realUrl', 'fakeUrl')
proxy.load()
```





##### canvas离屏渲染

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250410193541086.png" alt="image-20250410193541086" style="zoom:50%;" />

```js
<!-- 可见 Canvas -->
<canvas id="main-canvas"></canvas>
<!-- 离屏 Canvas（隐藏） -->
<canvas id="offscreen-canvas" style="display: none;"></canvas>

// 预加载阶段
const offscreenCanvas = document.getElementById('offscreen-canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
// 1. 在离屏 Canvas 上绘制复杂内容, 耗时操作
offscreenCtx.fillStyle = 'red';
offscreenCtx.fillRect(0, 0, 300, 150); 
// 2. 完成后复制到主 Canvas
const mainCanvas = document.getElementById('main-canvas');
const mainCtx = mainCanvas.getContext('2d');
mainCtx.drawImage(offscreenCanvas, 0, 0); // 瞬间完成
```











## 策略模式

- **【将 if-else 改为更加优雅的映射方式】**

```js
// 处理预热价
function prePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 20
  } 
  return originPrice * 0.9
}

// 处理大促价
function onSalePrice(originPrice) {
  if(originPrice >= 100) {
    return originPrice - 30
  } 
  return originPrice * 0.8
}

function askPrice(tag, originPrice) {
  // 处理预热价
  if(tag === 'pre') {
    return prePrice(originPrice)
  }
  // 处理大促价
  if(tag === 'onSale') {
    return onSalePrice(originPrice)
  }
}
```

使用对象来做映射：

```js
const priceMap = {
  pre(originPrice) {
    if(originPrice >= 100) {
      return originPrice - 20
    } 
    return originPrice * 0.9
  },
  onSale(originPrice) {
    if(originPrice >= 100) {
      return originPrice - 30
    } 
    return originPrice * 0.8
  }
}
function askPrice(tag, originPrice) {
  return priceMap[tag](originPrice)
}
```







## 发布-订阅模式

- 观察者模式：没有第三方，发布者直接触及到订阅者

- 发布-订阅：由第三方完成实际的通信，发布者不直接触及到订阅者

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250411155217476.png" alt="image-20250411155217476" style="zoom:50%;" />



 

