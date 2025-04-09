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



