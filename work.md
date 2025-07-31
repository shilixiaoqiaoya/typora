```js
优秀网址

https://www.joshwcomeau.com/
https://tkdodo.eu/blog/
https://antfu.me/
https://www.frontendjoy.com/
https://blog.isquaredsoftware.com/
https://roadmap.sh/
https://www.patterns.dev/
https://www.typescriptlang.org/docs/handbook/2/functions.html
https://zh.javascript.info/
https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
https://objtube.github.io/front-end-roadmap/#/
https://web.dev/learn/performance/welcome?hl=zh-cn
https://tsejx.github.io/javascript-guidebook/
https://blog.jiang.in/


// 随机图片
https://placedog.net/500/300?random
```





css媒体查询如何实现 暗黑模式 

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329120513517.png" alt="image-20250329120513517" style="zoom:30%;" />



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329123108221.png" alt="image-20250329123108221" style="zoom:33%;" /> 

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329123325082.png" alt="image-20250329123325082" style="zoom:33%;" />

 代码特性开关、KV服务推送配置



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329125121453.png" alt="image-20250329125121453" style="zoom:33%;" />  

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329125154740.png" alt="image-20250329125154740" style="zoom:33%;" />



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250329125336687.png" alt="image-20250329125336687" style="zoom:33%;" />



**日志**是“点”，**追踪**是“线”，**度量**是“面”  









 p82-86，掷骰子游戏  

地图程序实现 class

食谱程序实现 mvc



# 小技巧

- 代码逻辑没问题就检查写法
- localhost对应127.0.0.1
- *涉及到异步就想promise*
- **flex布局**  YYDS！
- **【当只有纯粹的 if-else且是简单的赋值操作时，使用三元运算符 `age >= 18 ? wine : water `】**
  - **如果`if`条件是判断该值是否为undefined，使用OR运算符去判断更好**

- 数组：先考虑使用高阶函数实现； map、filter、reduce；还有其他的数组方法 

```js
const str = "this is a sentence";
const foo = (str) => {
  return str.split(" ").reduce((acc, cur) => {
    return acc + cur[0].toUpperCase() + cur.slice(1) + " ";
  }, "");
};
console.log(foo(str));  // This Is A Sentence 
```

```js
const { deposits, withdraws } = accounts.flatMap(acc => acc.movements)
.reduce((sums, cur) => {
  sums[cur > 0 ? 'deposits' : 'withdraws'] += cur
  return sums
}, { deposits: 0, withdraws: 0 })
```



- 对数组和 对象进行解构，更加语义化

- focus()获取焦点，blur() 失去焦点

- toFixed()返回值是字符串
- 在bigint出现前js可以表示的最大数字  `2**53 - 1`，超过这个数表示不准确
  - 表示：Number.MAX_SAFE_INTEGER

- **数字转字符串除了` + ‘’`；也可以使用模板字符串包装下** 

```js
123 + ''
`${123}`
```

- **字符串转数字，前面添加 `+`**

```js
console.log(+'23')  // 23
```

- Number.parseInt()  Number.parseFloat() 
- `getComputedStyle(element)`  可以获取到该dom的所有样式



-  事件委托： 1️⃣给父元素绑定事件 2️⃣ 构造函数的原型 也是多个实例将方法委托到原型对象上

- `crypto.randomUUID()`是js的一个方法，生成唯一标识符









vscode

- command+k  清除终端 
- Command + j 打开终端 
- Command + d 同时选中同一个变量，可进行编辑
- javascript查看时间差

```js
// 启动一个定时器，并为其指定一个唯一的标签
console.time(timer)
// 在计时器运行期间记录当前时间差
console.timeLog(timer, 'node 1 completed')
// 停止指定标签的计时器，并输出从console.time到console.timeEnd之间的时间差（毫秒为单位）
console.timeEnd(timer)
```

- 命令行创建文件夹：mkdir  xxx
- 命令行删除文件夹：rmdir  xxx
- 命令行创建文件：touch xxx.js 
- 命令行删除文件：rm xxx.js 



Json placeholder 提供了一些后端接口





代码架构

- 业务逻辑
- 状态state
- 网络请求库
- 应用程序逻辑
- ui侧

![image-20250319144400996](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250319144400996.png)



# Vue

- template是数据驱动
- script需要通过computed和watch来监听数据变化，实现数据驱动

### router

```js
// 常规写法：
<router-view></router-view>

// 插槽写法
<router-view v-slot='{Component}'>
  <Component :is='Component'/>
</router-view>

// 结合内置组件keep-alive使用
<router-view v-slot='{Component}'>
  <keep-alive>
  	<Component :is='Component'/>
  </keep-alive>
</router-view>
```





### keep-alive

- include属性匹配的是组件的name属性，而不是router中的name属性
- include支持「以逗号分隔的字符串」，数组，正则

```js
<keep-alive include='a,b'>
  <Component :is='view'/>
</keep-alive>
```





### defineOptions

- 用于在setup顶层定义组件的一些选项

```js
defineOptions({
  name: 'omponentName'
})
```



### beforeEach

```js
const router = useRouter()
router.beforeEach((to, from, next) => {
  // to:即将进入的目标，是一个对象，有属性fullPath
  
  // 返回值
  ① false:取消当前的导航
  ② true:继续当前的导航
  ③ 一个对象，如同调用 router.push() 会中断当前的导航，重定向到新地址
  
  // next函数，不推荐使用
})
```





### ？v-if、v-show、visibility

-  **一开始`display: none`， 在mounted里面，`element.offsetWidth`  `dom.getBoundingClientRect()` 都为 0**
- **改为 `visibility: hidden` ，元素不可见，但仍然占据空间，mounted里面可以获取正确尺寸**

- 如果在mounted里拿不到dom，可能是它或它的父元素设置了v-if，需改为v-show
- v-if 搭配template使用更佳
- echarts图形成功绘制需要初始化+塞值





### Object.assign 

- **使用reactive对深层对象reportData进行初始化**  
- 通过接口获取数据：**Object.assign(reportData, res.data)**

```js
const obj = {}
const res = Object.assign(obj, { a: 1 })
console.log(obj === res)  // true
console.log(obj) // { a: 1 }
```

- **可以将对象进行解构以方便使用某些属性**  

  - 解构时起别名

  ```js
  const { user: applyUser } = gitlabData
  ```

  - 解构时赋默认值

  ```js
  const { user = 'why' } = gitlabData
  ```

  - 误区

  ```js
  const { a, b } = { a:1, b: 2 }
  a = 3 // 报错 TypeError: Assignment to constant variable.
  ```

  ```js
  let a = 111
  let b = 999
  const obj = { a:1, b: 9 }
  ({a, b} = obj)
  console.log(a, b)  // 1 9
  ```

- 实现对象的浅拷贝

```js
const obj = { foo: 'foo',  : 'bar' }
① Object.assign({}, obj)
② 扩展运算符：{ ...obj }
```

- 数组解构优雅用法。 摒弃 arr[0] arr[1]这种非语义化代码

```js
const arr = ['coder', 'why']
const [firstName, lastName] = arr
```







### 输入事件

- input事件，输入内容变更时，实时触发
- change事件，输入框失去焦点且其内容发生变化时触发
- v-model双向绑定，默认绑定input事件
- v-model.lazy绑定为change事件，失焦才更新值





### 环境变量

- 前端项目的环境变量是用于配置前端应用行为的变量，**通常在开发、测试和生产环境中使用，以区分不同的配置（如API地址**
  - 区分环境：NODE_ENV=development  NODE_ENV=production
  - 在不同的环境中使用不同的后端服务地址
- 为什么需要环境变量
  - 环境隔离。不同环境需要不同配置，环境变量可以轻松切换配置，无需修改代码
  - 安全性。敏感信息不应该硬编码在代码中，将信息和代码分离，降低泄漏风险
- 安全性问题
  - 在使用webpack等工具进行打包时，环境变量会被注入到代码中，有暴露风险
  - 应该将敏感信息保留在后端，并通过安全的API提供服务
- **【修改环境变量之后需要重启项目】**



### 给props赋默认值

```js
const props = withDefaults(defineProps<{
    selectedSession: ISession[];
    clearSelectedSession: () => void
	}>(), 
  {
  	selectedSession: () => ([])
	}
)
```





### ? pointer事件

- touch-action: none
  - 用于防止触摸事件的默认行为，以实现自定义的复杂的交互效果
- 如何实现类似知乎的图片预览效果





# Javascript

- **es5在所有的浏览器都支持，所以是babel转译的目标**

- Es2016-es2020  es6+

- Es2021往后  esnext

- 特点

  - 多范式：面向对象编程 、函数式编程 
  - 早期javascript是解释型语言  
  - 现代javascriptp是即时编译型语言（just-in-time compiled language）
  - **如何理解编译型语言/解释性语言/即时编译型语言**
  - <img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250212151529831.png" alt="image-20250212151529831" style="zoom:50%;" />

  

  - javascript引擎基本工作原理

  - ![image-20250212152547330](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250212152547330.png) 
  - 

  - javascript运行时

    - 浏览器：三大部分。js引擎，webAPIs，回调函数队列

  - ![image-20250212153425122](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250212153425122.png)

     

    - node.js：三大部分。js引擎，c++ bindings & 线程池，回调函数队列

  - <img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250212153621324.png" alt="image-20250212153621324" style="zoom:50%;" />

- **v8引擎组成：栈 + 堆**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250212150632722.png" alt="image-20250212150632722" style="zoom:40%;" />

- 代码在函数调用栈中执行
- 函数调用的顺序和作用域链毫无关系，作用域链取决于函数 定义的位置

- 变量提升

```js
console.log(a);  // undefined
console.log(b);  // ReferenceError: Cannot access 'b' before initialization
var a = 1;
const b = 2;
【var声明的变量会放在window对象上】 
————————————————————————
foo(); // foo
bar(); // bar is not a function  ===> bar is undefined
baz(); // ReferenceError: Cannot access 'baz' before initialization
function foo() {
  console.log("foo");
}
var bar = function () {
  console.log("bar");
};
const baz = () => {
  console.log("baz");
};
```

- this指向

```js
'use strict'
console.log(this)  // window
var birthday = 2000  【var声明的变量会被加在window上】
const jonas = {
  birthday: 1991,
  calcAge: () => {
    console.log(this)  // window
    console.log(2037 - this.birthday)  // 37
  }
}
jonas.calcAge()
```

- 不同数据类型的存储区别
- ![image-20250214094019502](/Users/tal/Library/Application Support/typora-user-images/image-20250214094019502.png)



### Array

##### 创建数组

```js
1、new Array
// 传入多个参数
const arr = new Array(-10, -2, 1, 2, 4, 8)
console.log(arr) // [-10, -2, 1, 2, 4, 8]

// 传入一个参数，代表所创建数组的长度
const arr = new Array(5)
console.log(arr)  // [empty x 5]

// fill方法
arr.fill(1) ==> [1,1,1,1,1]
arr.fill(23, 3, 5) ==>  [1,1,1,23,23] // 索引[3,5)填充为23


2、Array.from()
Array.from({ length: 5}, () => 1)  // [1,1,1,1,1]

const arr = Array.from({ length: 5 }, (_, i) => i + 6);  // [6,7,8,9,10]
Array.from(类数组对象, 映射回调函数)
```





##### at()

- **从数组中拿到指定位置的元素**
- 可以使用**负数**从数组的末尾访问元素
- 处理动态数组时更加方便

```js
const arr = [10, 20, 30, 40, 50]
console.log(arr.at(0))  // 10
console.log(arr.at(-1))  // 50
console.log(arr.at(5))  // undefined
```

- 也适用于字符串

```js
'jonas'.at(0)  // 'j'
```



##### sort()

- 会改变原数组，为了不改变原数组，采取下面写法

```js
arr.slice().sort()
```

- 方法如果不传参数，会把元素视为字符串进行对应排序
- **传入的回调函数返回值大于1，调换位置；小于1则位置不变**

```js
const arr = [1, 2, 4, -2, 8, -10]
// 由小到大排序
arr.sort((a, b) => {
  if(a > b) return 1
  if(a < b) return -1
})
// 由大到小排序
arr.sort((a, b) => {
  if(a > b) return -1
  if(a < b) return 1
})
// 简练
升序：arr.sort((a, b) => a - b)
降序：arr.sort((a, b) => b - a)
```





##### flatmap()

- 是map()和flat(1)的结合



##### foreach不能中断

- 无法通过break和return跳出循环

```js
function bar() {
  [1,2,3].forEach(item => {
    console.log(item)
    if(item === 2) return
  })
  console.log('end')
}
bar()
// 1 2 3 end
```





##### reduce强大用法

```js
let arr = [
  {
    name: "why",
    age: 18,
  },
  {
    name: "kobe",
    age: 24,
  },
  {
    name: "kobe",
    age: 64,
  },
  {
    name: "james",
    age: 23,
  },
  {
    name: "james",
    age: 244,
  },
];

console.log(
  arr.reduce((acc, cur) => {
    // 存在
    if (acc.findIndex((item) => item.name === cur.name) !== -1) {
      return acc;
    } else {
      acc.push(cur);
      return acc;
    }
  }, [])
)
// 输出 
{ name: "why", age: 18}
{ name: "kobe", age: 24}
{ name: "james", age: 23}
```







### 字符串

##### subString

- 返回该字符串从起始索引到结束索引（不包括）的部分
- 不影响原数组，类似数组的slice方法
- 如果未给结束索引，则截取到字符串最后



##### lastIndexOf

##### replace不影响原字符串



### Class的私有/公有的属性/方法

- 实现数据隐私和封装

```js
class Test {
  // public field
  locale = navigator.language;

  // private field
  #name;
  #height = 1.88;
  #address;

  constructor(age, address) {
    this.age = age;
    this.#address = address;
  }

  // private method
  #sayHello() {
    console.log("sayHello");
  }

  say() {
    this.#sayHello();
  }

  get name() {
    return this.#name;
  }

  set name(value) {
    this.#name = value;
  }

  get height() {
    return this.#height;
  }

  get address() {
    return this.#address;
  }
}
const test = new Test(18, "beijing");
test.name = "why";

console.log(test); // {locale: 'zh-CN', age: 18, #name: 'why'}
console.log(test.#name);  // 报错
test.say(); // sayHello
test.#sayHello();  // 报错

console.log(test.height); // 1.88
console.log(test.address);  // beijing
```

![image-20250302120419356](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250302120419356.png)







### URL编码和解码

##### encodeURIComponent

- 用于对url进行编码
- **会将某些字符（空格，特殊符号）转换成百分号加上十六进制值，确保url的合法性**
- 如果对整个url进行编码，应该使用encodeURI，不会对url的冒号和斜杠等字符进行编码



##### decodeURIComponent

- 解码被encodeURIComponent编码的字符串
- 将百分号加上十六进制转换为原始形式



##### 使用场景

- 当需要将数据作为查询参数附加到url上时，使用encodeURIComponent对参数进行编码，避免语法错误以确保url可用

```js
const name = "John Doe";
const age = 25;
const url = `https://example.com?name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}`;
console.log(url);
// https://example.com?name=John%20Doe&age=25
```

- 对一些特殊字符做处理，保证url可用

```js
const id = 'xxx/123?param=value'
const url = `https://example.com?id=${encodeURIComponent(id)}`
```

- 避免跨站脚本攻击，将危险字符进行转义

```js
const userInput = "<script>alert('XSS');</script>";
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
console.log(url);
// https://example.com/search?q=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E
```





### 实现横向滚动

##### css属性

- oveflow-x属性：控制元素在横向上的溢出行为，通常设置为auto

```css
.container {
  overflow-x: auto
  white-space: nowrap
}
.item {
  display: inline-block
  width: 200px
  height: 200px
  margin-right: 10px
  background-color: red
}

// 自定义滚动条样式
.container::-webkit-scrollbar {
  display: none // 隐藏
}
```

##### flex布局

```css
.container {
  display: flex
  overflow-x: auto
}
.item {
  flex: 0 0 auto
  width: 200px
  height: 200px
  margin-right: 10px
  background-color: red
}
```

##### js控制scrollLeft

- 如果元素不能滚动（比如：子元素没有溢出），scrollLeft的值为0
- **如果scrollLeft设置的值小于0，那么scrollLeft的值将为0**

```javascript
<div class="scroll-container" id="scrollContainer">
  <div class="scroll-item">Item 1</div>
  <div class="scroll-item">Item 2</div>
  <div class="scroll-item">Item 3</div>
  <div class="scroll-item">Item 4</div>
  <div class="scroll-item">Item 5</div>
</div>
<button onclick="scrollLeft()">Scroll Left</button>
<button onclick="scrollRight()">Scroll Right</button>

function scrollLeft() {
  document.getelementbyid('scroll-container').scrollLeft -= 100
}
function scrollRight() {
  document.getelementbyid('scroll-container').scrollLeft += 100
}


// 实现自动滚动
setinterval(() => {
   document.getelementbyid('scroll-container').scrollLeft += 1
}, 50)
```

- 实现：点击每个题号滚动到对应item，假设可视区域内最多展示5个item，每个item及右边的间隔总共64px

```js
let index = curQuelist.value.findIndex(item => item.order === curOrder.value)
if(index > curQuelist.value.length - 5) {
  wrapper.scrollLeft = 0
  wrapper.scrollLeft += (curQuelist.value.length - 5) * 64
} else {
  wrapper.scrollLeft = 0
  wrapper.scrollLeft += index * 64
}
```

##### 如何提高滚动性能

- 虚拟滚动：只渲染当前可见的内容，减少dom节点数量
- GPU硬件加速：通过css属性如transform:translateZ(0)启用硬件加速
- 事件节流：对于滚动事件监听，使用节流减少事件触发频率





### 常用api

##### img.onload()

- 监听图片从无到有全部展示



##### 新人引导是否展示实现

- 存localStorage一个数组，判断数组是否包含用户id
- 若没有，则展示气泡，并且将该用户id也push到数组中



##### regex.test(string) 

- 返回值是布尔值，看某个字符串是否满足正则表达式



##### URLSearchParams()

- 用于处理URL中的query string

```js
const params = new URLSearchParams('q=javascript&page=2');
console.log(params.get('q')); // 输出: javascript
console.log(params.get('page')); // 输出: 2
console.log(params.get('unknown')); // 输出: null（如果参数不存在）
```



##### 获取时间戳

```js
const timeStamp = new Date('2025-2-8').getTime()
```



##### 运算

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250209122431658.png" alt="image-20250209122431658" style="zoom:50%;" />

- 5个虚假值：**0 空字符串 undefined null NaN** 
- **Boolean()，以上5个虚假值会变为false**
  - if ( [ ] )  为true 
  - if ( { } )  为true
- **【当只有if-else且是简单的赋值操作时，使用三元运算符 `age >= 18 ? wine : water `】**
- while循环适合于「不确定要循环多少次」的情况，不需要 计数器

```js
`Math.max()` 可以传入多个逗号分隔的值。`Math.min()同理`

`console.table(obj)`以表格的形式展示对象

Math.trunc() 直接将数字的小数部分去掉
```

- dom对类名的原生操作

```js
// 给一个dom节点添加/移除某个类名
dom.classList.add('hidden')
dom.classList.remove('hidden')
dom.classList.contains ('hidden')  是否有某个类
dom.classList.toggle ('hidden')  若存在则移除类，若不存在则添加类

// keydown事件，event里「key」存储了按下键的信息
```

- OR运算符 
  - 操作数可以是任意数据类型；可以返回任意数据类型；会短路(short-circuit)【遇到真值直接返回 
  - **返回第一个真值**；如果都假则返回最后一个假值
  - **应用：赋默认值**

```js
3 || 'jonas'  ==>  3
'' || 'jonas'  ==> 'jonas'
true || 0  ==> true
undefined || null  ==> null

// 应用
bar = bar || 'default'
```

- AND运算符
  - **返回第一个假值**；如果都真则返回最后一个真值
  - **应用: 如果第一个操作数为真值，则执行第二个操作数的代码逻辑**

```js
true && console.log('hhh')
```

- #### ??

  - 空值合并运算符
  - 当??左侧是null或undefined时，返回右侧的值
  - **|| 还会将 「0、 false、 ''」视为假值，而 ?? 只关注null和undefined**
- `||=`  
- `??=` 
- `&&=`

```js
// 数字常用方法:
Number.isInteger()
Number.parseInt()
Number.parseFloat()
```





##### 值传递； 引用传递

 

##### bind

```js
const addTax = (rate, value) => value + value * rate

const add23 = addTax.bind(null, 0.23) 
add23(100)
const add34 = addTax.bind(null, 0.34)
add23(100)

// 类似于下面高阶函数的功能，推荐使用bind
const addTax = (rate) => {
  return value => value + value * rate
} 
```



##### 日期

```js
const future = new Date(2037, 10, 19, 15, 23)
console.log(future)  // 2037-11-19T07:23:00.000Z
console.log(future.getFullYear())  // 2037
console.log(future.getMonth() + 1) // 11
console.log(future.getDate()) // 19
console.log(future.getHours())  // 15
console.log(future.getMinutes())  // 23
console.log(future.getSeconds()) // 0
console.log(future.getTime())  // 2142228180000
console.log(future.getDay())  // 4 礼拜几 
console.log(future.toISOString()) // 2037-11-19T07:23:00.000Z  

console.log(new Date(2142228180000)) // 2037-11-19T07:23:00.000Z
```

- 日期国际化 `new Intl.DateTimeFormat(locale, options)`

```js
const now = new Date()
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: '2-digit',
  year: 'numeric',
  weekday: 'long',
}
const locale = navigator.language  // 通过浏览器获取语言环境  zh-CN
new Intl.DateTimeFormat(locale, options).format(now)  // 2025年02月22日星期六 11:55

// numeric 、2-digit(两位) 、long
```

- 数字国际化 `new Intl.NumberFormat(navigator.language, options).format(num)`



- 获取时间范围的具体日期

```js
// 近一个月日期
const today = new Date()
const pastDate = new Date(today)
const yesterday = new Date(today)
pastDate.setDate(today.getDate() - 30)
yesterday.setDate(today.getDate() - 1)


const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${date}`
}
```







 

### 截图

##### html2canvas

- **display为none会截取失败**
- 耗时短，ios/安卓兼容性好
- **支持截取脱离标准流的元素` absolute; left-9999px`** 
- 部分css属性不支持，比如波浪线和虚线
- useCORS设为true，可以通过http请求获取图片
- Scale
- **在产生滚动行为的div内再包裹一个div，可以截取整个滚动元素，而不只是可视区域内**



##### dom2image

- 耗时长，ios/安卓兼容性差
- **脱离标准流的元素只能截取可视区域内的**
- 支持波浪线和虚线









### 基本函数

##### 递归检查对象是否存在空属性值

```js
const checkAllFilledMethod = (obj: any) => {
  for(let key in obj) {
    if(typeof obj[key] === 'object' && obj[key] !== null) {
      if('isShow' in obj[key]) {
        if(obj[key]['isShow']) {
          if(!checkAllFilledMethod(obj[key])) return false
        }
      } else {
        if(!checkAllFilledMethod(obj[key])) return false
      }
    } else {
      if(key === 'attitude' || key === 'content') continue
      if(obj[key] === '') return false
    }
  }
}
```



##### 隔2s递归获取progress直至100拿到url

```js
function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
let download_url = ''
async function checkProgress() {
  const res = await getUrl()
  if(res.data.obj.progress !== 100) {
    await sleep(2000)
    await checkProgress()
  } else {
    download_url = res.data.obj.download_url
  }
}
```







##### 递归直至blob不为null（限制次数

```js
function generatePic(dom: HTMLElement, retryCount: number = 5): Promise<Blob> {
	return new Promise((resolve, reject) => {
    html2canvas(dom, { scale: 3, useCORS: true }).then(canvas => {
      canvas.toBlob(blob => {
        if(blob === null) {
          if(retryCount > 0) {
            resolve(generatePic(dom, retryCount - 1))  // 递归调用，重试次数-1
          } else {
            reject(new Error('xx'))  // 重试次数用尽，抛出错误
          }
        } else {
          resolve(blob)  // 成功生成blob
        }
      })
    })
  })
}
```





##### 时间戳转换

- toLocaleString(locales, options)
  - locales：表示语言代码的字符串
  - options：调整输出格式的对象
- 返回该日期对象的字符串，该字符串格式因不同语言而不同
- `zh-CN` 指定语言环境为中国
- `2-digit`：显示两位数 如 01

```js
function timeStampToYMDHM(timestamp: number) {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false  // 24小时制
  })
}
```







### 滚动

##### 距离值

- document.documentElement.**clientHeight**
  - 页面的高度

- document.documentElement.**clientWidth**
  - 页面的宽度

- window.**pageXOffset**
  - 页面的x轴方向偏移值

- window.**pageYOffset**
  - 页面的y轴方向偏移值

- **element.getBoundingClientRect()**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250222174131271.png" alt="image-20250222174131271" style="zoom:50%;" />



##### container.scrollTo(0, 0)

- 将容器的滚动条移动到容器的顶部
- 第一个参数是水平滚动的位置，第二个参数是垂直滚动的位置
- `window.scrollTo(0, 0)`
- `window.scrollTo({left: xx, top: yy, behavior: 'smooth'})`



##### scrollIntoView()

- **使指定的元素滚动到指定区域内**
- 参数
  - 一个布尔值
  - 一个对象

```js
element.scrollIntoView(alignToTop)
// alignToTop: true，元素对齐到视口顶部；false，元素对齐到视口底部

element.scrollIntoView({
  behavior: 'smooth',
  block: 'start/center/end',  // 垂直对齐
  inline: 'start/center/end'  // 水平对齐
})
```

 





### 异步JS

```js
const img = document.querySelector('.dog')
img.src = 'dog.jpg'  // 异步
img.addEventListener('load', () => {
  img.classList.add('fadeIn')
})
```



.then接收的函数return一个promise，会进行状态移交



回调地狱  ---》 then链 ---》async、 await



在js module中，可以在顶层使用await ，不需要在async函数中，会阻止整个模块的代码执行 



- async/await的异常处理

```
const fn = async () => {
	try {
	
	} catch(err) {
	
	}
}
```

- 异步函数也可以IIFE（立即执行函数

```js
(asycn function() {
  try {
    await xxx
  } catch(err) {
    console.error(err)
  }
})()
```





- **并行生成图片** Promise.all()

```js
function handleGeneratePic() {
  // 生成图片前置空逻辑
  imgShowSrc.value = ''
  fileList = []
  picBlobArr = []
  isShowOriginDom.value = true
  isShowLoading.value = true
  // 并行生成图片
  Promise.all(generatePic(picOneRef.value?.$el, picTwoRef.value?.$el)).
  	then(async (res) => {
			isShowOriginDom.value = false
    	picOneBlob = res[0]
      picTwoBlob = res[1]
    	picBlobArr.push(picOneBlob. picTwoBlob)
      const picOneFlie = new File([picOneBlob], 'report1.png', { type: 'image/png' })
      const picTwoFile = new File([picTwoBlob], 'report2.png', { type: 'image/png' })
      fileList.push(picOneFlie, picTwoFile)
    	const uploadRes = await uploader.uploadFile(fileList)
      imgSrcList = uploadRes.map(item => 'https://' + item.data.location)
    	imgShowSrc.value = imgSrcList[0]
    })
}
```

- 其中一个promise失败会导致promise.all()的状态是rejected，但是所有的promise都会被执行

![image-20250619144004520](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250619144004520.png)

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
    console.log('p1 done')   // 会被执行
  }, 2000)
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
     reject(222)
  }, 1000)
})
Promise.all([p1, p2]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

- **【Promise.race()、Promise.any()也同理，所有promise都会被执行**】







### iframe通信

- 基本通信
  - **为什么在父窗口是iframe.contentWindow.postMessage，类似发邮件时需标明接收方**

```js
// 父窗口
const iframe = document.getElementById('myIframe')
iframe.contentWindow.postMessage('hello from parent', '*')  //  *表示不限制目标域

window.addEventListener('message', (event) => {
  console.log('parent received', event.data)
})

// iframe
window.parent.postMessage('hello from iframe', '*')
window.addEventListener('message', (event) => {
  console.log('iframe received', event.data)
})
```

- 在嵌套 iframe 的场景中（A → B → C），当 B 同时监听来自父窗口 A 和子 iframe C 的 `message` 事件时，

  **可以通过`event.source`区分消息来源**

```js
window.addEventListener('message', (event) => {
  // 判断消息来自父窗口A
  if(event.source === window.parent) {
    console.log('消息来自父窗口A', event.data)
  }
  // 判断消息来自子窗口C
  const iframeC = document.getElementById('iframeC')
  if(iframeC && event.source === iframeC.contentWindow) {
    console.log('消息来自子窗口C', event.data)
  }
})
```







### 模版字符串

- 模版字符串在函数调用的场景中，下面代码为例
  - 第一个参数是所有静态内容的数组
  - 第二个参数是动态内容的数组
  - （第一个参数的数组长度比第二个参数的数组长度多1）

```js
function fn(strings, ...tags) {
  console.log(strings)  // ['', ' is a ', '.']
  console.log(tags)  // ['Mike', 20]
}
const person = 'Mike'
const age = 20
fn`${person} is a ${age}.`
```





### setInterval

```js
setInterval(() => {
  console.log('fn call')
}, 1000)
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250619174616714.png" alt="image-20250619174616714" style="zoom:80%;" />

- 用递归的setTimeout代替

```js
function fn() {
  console.log('fn call')
  setTimeout(fn, 1000)
}
setTimeout(fn, 1000)
```

![image-20250619174908469](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250619174908469.png)





### 拖拽

- 面板，绝对定位(0,0)

```js
.panel {
  position: absolute;
  top: 0;
  left: 0;
 	transform: translate3d(1920px, 1080px, 0)
}
```

- **transform不会影响文档流，只是视觉上的移动，元素在DOM中原本的位置不变**

```js
// 开始按下，获取鼠标相对于面板的offsetX/offsetY
const rect = panel.getBoundingClientRect()
const offsetX = e.clientX - rect.left
const offsetY = e.clientY - rect.top

// 移动过程中,获取面板左上角的新位置
const newX = e.clientX - offsetX
const newY = e.clientY - offsetY

// 根据新位置移动
panel.style = `transform: translate3d(${newX}px, ${newY}px, 0)`
```







### 事件循环

- 执行流程
  - 执行一个宏任务
  - 清空宏任务关联的微任务队列
  - 完成渲染（浏览器）
  - 进入下一次事件循环，从宏任务队列中取下一个任务
- 同步代码本身属于事件循环的一个「初始宏任务」，即全局脚本的执行

```js
setTimeout(() => console.log('setTimeout'), 1000)
for(let i=0, i<3e9, i++) {}
Promise.resolve().then(() => console.log('promise'))

// 先执行同步代码for循环（耗时2s），再清空微任务队列（打印promise），再开始下一次事件循环，打印setTimeout
// 由于同步代码的阻塞，导致timer并没有按时执行
```

- 调用栈为空是事件循环从任务队列中取任务的前提（无论是宏任务还是微任务）
  - 所以可推断出：每次事件循环的开始都需要函数调用栈为空





#### setTimeout(fn, 1000)

- 调用setTimeout()
  - 将fn交给浏览器的定时器线程处理，并设置1000ms的延迟
  - **setTimeout本身是同步的，会立即从调用栈弹出**
- 定时器线程等待
  - 定时器线程开始计时，不阻塞主线程（调用栈继续执行其它代码
- 时间到达后
  - **定时器线程会将回调函数放入宏任务队列**
- 事件循环处理
  - **当调用栈为空时，事件循环从宏任务队列中取出该回调，放入调用栈执行**
- 1000ms是最小延迟，实际执行时间可能因调用栈阻塞（长同步任务）而延迟

- 回调函数不直接出现在当前调用栈中，而是由事件循环在未来的某个事件循环中调度，回调的实际执行时间受主线程繁忙程度影响。通过这种机制，js实现了非阻塞的异步行为





#### nodejs

- 一次事件循环分为多个阶段，每个阶段处理特定类型的宏任务
- 每个阶段执行时，会处理当前阶段队列中的所有可执行任务（不一定是1个）
- 每进入一个新阶段前，会清空微任务队列







# Typescript

```text
@types是DefinitelyTyped项目下的一个命名空间，专门用于存放Typescript类型定义文件（.d.ts文件）
当js库本身没有内置类型，@types提供第三方类型支持，让这些库在ts项目中获得类型检查和代码提示

@types/node是为nodejs核心模块提供的typescript类型定义
```

- **在高版本的node中，可以通过命令行选项直接运行ts文件，甚至不需要命令行选项就能运行**

```js
node --experimental-strip-types example.ts
```







- 断言缩小类型

```ts
const input = document.getElementById('input') as HTMLInputElement
```

- as unknown as AxiosRequestHeaders 双重类型断言，绕过ts的类型检查，将对象强制转为目标类型





- 定义变量时如果有赋值，会有类型推导，不必要加类型；如果未赋值，有必要加类型

```js
let num = 1
// let num: number = 1 没必要

let num: number
num = 1
```





- 为第三方库进行类型扩展

```js
declare module 'fabric' {
  interface FabricObject {
    isKeep?: boolean
  }
}
```





- 字面量类型

```js
const request = { url: 'google.com', method: 'get' as 'get' }
function handleReq(url:string, method: 'get' | 'post') {}
handleReq(request.url, request.method)

const request = { url: 'google.com', method: 'get'} as const
function handleReq(url:string, method: 'get' | 'post') {}
handleReq(request.url, request.method)
```





- 布尔化

```js
Boolean('hello') =>  true
!!'hello' =>  true
```





```js
let x = Math.random() < 0.5 ? 10 : 'hello'

x = 1
console.log(x)  // x类型为number

x = 'good'
console.log(x)  // x类型为string
```





- 自定义type guard

```js
interface Fish {
  swim: () => void
}
interface Bird {
  fly: () => void
}

type Animal = Fish | Bird
function isFish(animal: Animal): animal is Fish {
  return (animal as Fish).swim !== undefined
}
  
function move(animal: Animal) {
  if(isFish(animal)) {
    animal.swim()
  } else {
    animal.fly()
  }
}
```





- never类型 
  - **可以将never类型的值赋值给其他任意类型的值，不可以将其它类型的值赋值给never值**
  - 作用：做全面性检查
  - **可以认为是「空集」，是所有类型的子集，可以赋值给其他类型**

```js
function isBird(animal: Animal): animal is Bird {
  return (animal as Bird).fly !== undefined
}

function move(animal: Animal) {
  if(isFish(animal)) {
    animal.swim()
  } else if(isBird(animal)){
    animal.fly()
  } else {
    const _exhaustiveCheck: never = animal    // 此时animal为never类型，赋给_exhaustiveCheck变量不会报错，全面性检查通过
  }
}
```





- unknown类型，和any类似，可以将其它任意类型的值赋值给unknown，但是要比any更安全，保留了一些type check
  - **可以认为是「全集」, 包含所有类型，是所有类型的父集，所有类型都可以赋值给unknown**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250612111045405.png" alt="image-20250612111045405" style="zoom:50%;" />





- function type

```js
// 当函数有属性时
interface DescribableFunction {
  testAttr: string;
  (a: number): string
}
function foo(fn: DescribableFunction) {
  console.log(fn.testAttr + fn(6))
}

function bar(a: number) {
  return `${a}`
}
bar.testAttr = 'testAttr'
foo(bar)


// 当函数作为构造函数使用时
interface SomeConstructor {
  new (s: string): SomeObject
}
function fn(ctor: SomeConstructor) {
  return new ctor('hello')
}
```

- 函数重载

```js
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date

function makeDate(mOrTimestamp: number, d?: number, y?:number): Date {
  if(d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d)
  } else {
    return new Date(mOrTimestamp)
  }
}
```

- void返回值

```js
// 不会报错
type voidFunc = () => void
const fn: voidFunc = () => {
  return true     
}

// 会报错
function fn1(): void {
  return true    
}
```





- 泛型
  - 原则：定义的泛型至少有2个地方使用，如果只有一处使用没必要定义泛型

```js
function filter<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func)
}

function filter<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func)
}
```





- &：取交集

```js
type interA = 'A' | 'B'
type interB = 'A' | 'C'
type interC = interA & interB   // 'A'

type Name = { name: string }
type Age = { age: number }
type Info = Name & Age  // { name: string, age: number }
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250612103651033.png" alt="image-20250612103651033" style="zoom:70%;" />

```js
interface A {
  a: 1;
}
interface B {
  b: 1;
}
const x: A | B = { a: 1 }; // succeeds
const y: A | B = { b: 1 }; // succeeds
const z: A | B = { a: 1, b: 1 }; // succeeds, assignable to overlap


interface A {
  a: 1;
}
interface B {
  b: 1;
}
const x: A & B = { a: 1 }; // fails
const y: A & B = { b: 1 }; // fails
const z: A & B = { a: 1, b: 1 }; // succeeds
```





- String & {}

```js
string & {} 结果是string
- {}在ts中表示任何非null和非undefined的值，即任何可以访问属性的值
- string是对象包装器（String对象）的原始值，可以访问属性（如length）
- string是{}的子集

// 应用
type ModelNames = 'gpt-4o' | 'o3-mini' | 'claude-sonnet-3.7' | string
type ModelNames = 'gpt-4o' | 'o3-mini' | 'claude-sonnet-3.7' | (string & {})
const model: ModelNames = 'awdfdd'  // 第一种方式，model是string类型，没有很好的代码提示
// 第二种，此时model可以得到很好的代码提示
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250617095840080.png" alt="image-20250617095840080" style="zoom:50%;" />







# socket

`wss://connection.com`

### 心跳机制

- 保持网络连接活跃的通信技术，通过定期发送小型数据包（心跳包或ping-pong包）来确认连接的有效性
- 客户端和服务端之间以固定时间间隔（如60s）交换heartbeat-ping和heartbeat-pong消息
- **【检测连接存活状态**】
  - 网络环境不稳定可能导致连接"假死"，定期心跳可快速发现断连状态
- 【**防止连接自动关闭**】
  - 防火墙会关闭长时间无活动的连接，60秒间隔的心跳可保持连接不被回收

```js
let heartbeatInterval

function setupHeartBeat() {
  heartbeatInterval = setInterval(() => {
    if(socket.readyState === WebSocket.OPEN) {
      socket.send({
        command: 'heartbeat-ping'
      })
    }
  })
  
  socket.addEventListener('message', (event) => {
    if(event.data.command === 'heartbeat-pong') {
      console.log('心跳响应正常')
    }
  })
}
```





### 二次封装

```js
class SocketClient {
  private socket: WebSocket | null
	private isConnect    // 连接状态
  private timeoutTimer: NodeJS.Timeout | null
	private heartbeatTimer: NodeJS.Timeout | null
	private isActivelyClose: boolean   // 是否主动关闭连接
  private param
  private timeout: number  // 连接断开几秒后尝试重连
  
  constructor(param, timeout) {
    this.param = param
    this.timeout = timeout
    this.socket = null
    this.isConnect = false
    this.timeoutTimer = null
    this.heartbeatTimer = null
    this.isActivelyClose = false
  }
  
	connect() {
    const url = 'xxxx'
    this.socket = new WebSocket(url)
    this.init(this.param)
  }
  
  init(param) {
    // 监听关闭
    this.socket.onclose = () => {
      this.isConnect = false
      if(!this.isActivelyClose) this.reconnectSocket()
    }
    
    // 监听错误
    this.socket.onerror = () => {
      this.reconnectSocket()
    }
    
    // 监听连接
    this.socket.onopen = () => {
      this.isConnect = true
      this.heartbeat()
    }
    
    // 监听消息
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if(data.command !== 'ACK' || data.command !== 'HEARTBEAT_PONG') {
        param.callback(data)
        this.sendAck()
      }
    }
  }

	// 【状态锁的实现，防止重连逻辑被频繁触发，同时确保在一次重连尝试结束后（无论是否成功），可以进行新的重连尝试】
	reconnectSocket() {
    if(this.isConnect) return 
    this.isConnect = true  // 当短时间内重复触发重连，只有第一次真正执行
    
    clearInterval(this.timeoutTimer)
    clearInterval(this.heartbeatTimer)
    this.timeoutTimer = setTimeout(() => {
      this.connect()
      this.isConnect = false  // 保证重连失败后可以进行下一次重连尝试，如果重连成功会onopen事件中将其置为true
    }, this.timeout)
  }
	
	send(data) {
    this.socket.send(JSON.stringify(data))
  }

	close() {
    this.isActivelyClose = true
    this.socket.close()
    clearInterval(this.timeoutTimer)
    clearInterval(this.heartbeatTimer)
  }

	heartbeat() {
    heartbeatTimer = setInterval(() => {
      this.send({
        command: 'HEARTBEAT_PING'
      })
    }, 60 * 1000)
  }

	sendAck() {
    this.send({
      command: 'ACK'
    })
  }
}

```







# SSE

- **Server-Sent Events 是一种基于HTTP的服务器推送技术，允许服务器单向地向客户端实时推送数据**

- websocket是双向通信，是一个独立协议；SSE是单向通信，基于http协议
- 原理
  - 客户端通过EventSource API发起连接
  - 服务端保持连接打开，通过HTTP流发送事件
  - 服务端可以随时推送数据，客户端接收并处理

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250517184622650.png" alt="image-20250517184622650" style="zoom:40%;" />

- 每一次发送的消息，由若干个message组成，每个message之间用`\n\n`分隔，每个message内部由若干行组成，每一行是如下格式

```js
[filed]: value\n

field可取值：
- data: 数据字段
- event: 【自定义的事件类型】，默认是message事件，浏览器可以用addEventListener()监听该事件
- id
- retry
```





### 前端

```js
const msg = ref('')

const eventSource = new EventSource('http://localhost:8080/sse')
// 连接建立
eventSource.onopen = (event) => {
  console.log('连接建立')
}

// 监听消息
eventSource.onmessage = (event) => {
  msg.value += event.data
}
 
// 自定义事件
eventSource.addEventListener('close', (event) => {
  eventSource.close()  // 关闭连接
})

// 错误处理
eventSource.onerror = (error) => {
  console.error('SSE连接出错', error)
}
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250609144552700.png" alt="image-20250609144552700" style="zoom:50%;" />



### 后端

```js
// express
const http = require('http')
http.createServer(function(req, res) {
  if(req.url === '/sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      "Connection": 'keep-alive',
      'access-control-allow-origin': '*'
    })
    
    let counter = 0
    const timer = setInterval(() => {
      if(counter > 6) {
        res.write(`event: close\n`)
        res.write(`data: close\n\n`)
        return 
      }
      res.write(`data: ${counter}\n\n`)
      counter++
    }, 100)
    
    res.on('close', () => {
      clearInterval(timer)
      console.log('client disconnect')
    })
  }
}).listen(8080, () => {
  console.log('running on port 8000')
})
```





### 缺点

- 仅支持文本数据
- 单向通信
- 部分浏览器有并发连接限制

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250517182319844.png" alt="image-20250517182319844" style="zoom:50%;" />





# web components

#### 基本流程

- **Window对象提供了一个只读属性：`customElements`可以注册一个自定义元素**

- **shadow dom**：将一个shadow dom 附加到自定义元素上，使用通用的dom方法向shadow dom中添加子元素、事件监听等；**与主文档隔离，保持自定义元素的功能私有**
- **HTML template标签**：元素内容不会被渲染

- 生命周期

  - connectedCallback：元素插入dom时调用

  - disconnectCallback：元素从dom移除时调用

  - attributeChangedCallback：元素属性变化时调用
- `:host`指的是包含shadow树的元素

```js
// 定义
<template id="hw-template">
  <style>
  	:host([type='primary']) button{
      background-color: green;
    }
    :host([type='error']) button{
      background-color: red;
    }
  </style>
  <button>btn</button>
	<script>
    ...
  </script>
</template>

<script>
  class HelloWorld extends HTMLElement {
    constructor() {
      super()
      // 获得组件的模板内容
      const templateEl = document.querySelector('#hw-template')

      // 创建shadow dom
      this.attachShadow({ mode: 'open' })

      // 将模版内容添加到shadow dom
      this.shadowRoot.appendChild(templateEl.content.cloneNode(true))
      
      // 获取传递的属性
      const msg = this.getAttribute('message')  
    }
    
    // 元素插入dom时调用 
    connectedCallback() {
      console.log("insert");
    }
  }
  customElements.define('hello-world', HelloWorld)
</script>

// 使用
<hello-world type="primary"></hello-world>
<hello-world type="error"></hello-world>
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250617094946610.png" alt="image-20250617094946610" style="zoom:53%;" />

- attachShadow()，mode参数
  - open: 可以从外部访问shadow dom
  - closed: 不可以从外部访问shadow dom

```js
document.querySelector('hello-world').shadowRoot
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250527142945820.png" alt="image-20250527142945820" style="zoom:100%;" />



#### 传递属性

```js
class HelloWorld extends HTMLElement {
  constructor() {
    ...
    // 获取传递的属性
    const msg = this.getAttribute('message')  
  }
}

// 使用
<hello-world message='test'>Hi</hello-world>
```





#### 自定义事件

通过`new CustomEvent()`自定义事件，通过`this.dispatchEvent()`将事件广播出，外部使用addEventListener监听

```js
this.dispatchEvent(new CustomEvent('play', {
  
}))
```





### vue支持 

1、以`.ce.vue`后缀写vue组件

文件会开启vue的自定义元素模式，会将样式暴露为组件的styles选项，以便在`defineCustomElement`时能够被提取和使用，组件初始化时能够将样式注入到web组件的shadow root上，以便样式生效

```js
// src/counter/counter.ce.vue
<template>
  <div>
  	<span class='count'>{{ count }}</span>
		<button @click="add">+1</button>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  const count = ref(0)
  const addCount = () => {
    count.value++
  }
</script>
<style scoped>
  .count {
    font-size: 20px;
  }
</style>
```

2、创建自定义元素

```js
// src/counter/index.ts
import { defineCustomElement } from 'vue'
import Counter from 'src/counter/counter.ce.vue'

const CustomElement = defineCustomElement(Counter)
export function register(tagName:string = 'my-count') {
  customElements.define(tagName, CustomElement)
}
```

3、使用

```js
// App.vue
<template>
  <my-count></my-count>
</template>
<script>
  import { register } from 'src/counter/index.ts'
  register()
</script>
```









lit库：google开发的轻量级web components库

```js
import { LitElement, html, css } from 'lit'
class LitButton extends LitElement {
  static styles = css`
  	button { background: xxx }
  `
  render() {
    return html`<button @click=${this._onClick}><slot></slot></button>`
  }
  _onClick() {
    this.dispatchEvent(new CustomEvent('lit-click'))
  }
}
```





























# jsbridge

#### 原生开发

- ios和android，虽然性能优越且功能全面，但开发周期较长，需要重新打包应用并等待用户更新

#### web开发

- 具备良好的跨平台特性，易于发布和更新，但在性能和访问硬件能力等方面存在一定限制

#### jsbridge

- H5可以访问原生功能，如打开相机、发送通知
- 在h5和原生之间方便地传递复杂的数据结构
- native执行完操作后，可以将结果反馈给h5



#### Native => Web

- native调用web端，js作为解释性语言，最大的特性是可以通过解释器执行一段js代码，利用这一点，将拼接的js代码字符串，传入js解析器执行就可以，js解析器在这里就是webview
- Android提供了evaluateJavascript来执行js代码，并且可以获取返回值执行回调

```java
String jsCode = String.format("window.showWebDialog('%s')", text)
webView.evaluateJavascript(jsCode, new ValueCallback<String>() {
  public void onReceiveValue(String value) {
		...
  }
})
```





#### Web => Native

- URL Schema

```js
<protocol>://<host>/<path>?<query>#fragment
```

native加载webview后，web发送的所有请求都会经过webview组件，所以native可以重写webview里的方法，拦截web发起的请求

对请求的格式进行判断，符合自定义的URL Schema，对url进行解析，进而调用原生native的方法

- 在webview中注入js api

通过webview提供的接口，将native的相关接口注入到js的context（window)的对象中

Android的接口 @JavascriptInterface

```js
// 注入全局js对象
webView.addJavascriptInterface(new NativeBridge(this), 'NativeBridge')

class NativeBridge {
  private Context ctx
  NativeBridge(Context ctx) {
    this.ctx = ctx
  }
  
  @JavascriptInterface
  public void showNativeDialog(String text) {
    new AlertDialog.Builder(ctx).setMessage(text).create().show()
  }
}

// 调用nativeBridge的方法
window.NativeBridge.showNativeDialog('hello')
```























# Dom API

![image-20250222133333153](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250222133333153.png) 

 

### lastElementChild

- 返回文档的最后一个子元素，若不存在则返回null







# 组件封装

### 函数调用

- 动态创建容器 -》 渲染组件 -》 销毁组件时清理dom

```js
// 目标组件
function Alert({message, onClose}) {
  return (
  	<div>
    	<p>{message}</p>
    	<button onClick={onClose}>close</button>
    </div>
  )
}

// 函数式调用逻辑
const alert = () => {
  show: (message) => {
    // 创建容器
    const container = document.createElement('div')
    document.body.appendChild(container)
    // 渲染组件
    const root = ReactDOM.createRoot(container)
    root.render(
      <Alert message={message} 
  					 onClose={() => {
               root.unmount()
               document.body.removeChild(container)
             }}
			/>
    )
  }
}

// 调用示例
alert.show('hello world')
```





### 对象映射: 某一prop不同值对应不同样式

要求：给组件传入不同type，会有对应的样式

- **通过「对象」来存储映射关系**

```js
const base = '这是基础样式'
const styles = {
  primary: base + 'primary样式',
  small: base + '小的样式'
}

<P className={styles[type]}>这是一段文本</p>
```









# CSS

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250208151004587.png" alt="image-20250208151004587" style="zoom:50%;" />

### 常用属性

```js
// 实现高斯模糊
filter: blur(4px)  // 将模糊或颜色偏移等图形效果应用于元素
backdrop-filter: blur(4px)   // 为一个元素的背景添加模糊或颜色偏移


// 禁止图片被拖拽
img {
  -webkit-user-drag: none
}

// 文字不可选
user-select: none

// div限制宽度, 但文字可能折行，如何避免
white-space: nowrap

// 元素变形的原点
transform-origin: center（默认值
- top left 左上角
- 50px 50px 

// 宽度设为「不带单位的小数」是无效的，需要设为百分比
<div :style="{ width: `${submitRadio * 100}%` }"></div>

// flex为1通常要和overflow-auto结合使用


width: fit-content
// 让元素的宽度根据内容的大小自适应，同时受到父容器或最大尺寸的限制
.box {
  width: fit-content;
  max-width: 100%;
}

// 圆形
border-radius: 50%
rounded-full     // 用于img标签上
  
// 元素不响应点击事件
pointer-events: none

// inline-flex
inline-flex会让元素成为行内flex容器，宽度由内容决定
```





- 苹果的底部安全距离

```css
@supports (margin-botton: env(safe-area-inset-bottom)) {
  .safe-footer {
    margin-bottom: env(safe-area-inset-bottom)
  }
}

- @supports是css的条件规则，用于检测浏览器是否支持某个css属性
- env()是css的环境变量函数，用于访问设备的环境变量
  safe-area-inset-bottom是一个环境变量，表示设备底部安全区域的像素值
  
【通常用于处理移动设备的安全区域，确保内容不会被设备的刘海屏、底部操作栏所遮挡】
```





### 自定义字体 

- **` @font-face ` 是CSS3中用于定义和引入自定义字体的一种css规则**
- 使浏览器在渲染文本时使用指定的字体
- 加载自定义字体时，浏览器有2种行为 **「font-display」**
  - 字体加载完成前，文字不可见。【默认】
  - 字体加载完成前，使用备用字体显示文字，加载完成后切换到自定义字体。
  - **值设为swap，可以使浏览器表现为第二种行为，确保文字始终可见**

```js
@font-face {
  font-family: 'CustomFont';
  src: url('../xxx.ttf');
  font-display: swap
} 
```







### 滚动

- **为什么产生滚动？内容长度超出容器，且overflow为auto**
- *【给哪个元素设置overflow-auto，哪个元素会滚动】*
- **overflow设置为auto而不是scroll**，因为滚动条会占位置可能出现样式错乱的问题

----

positive的relative的容器产生滚动时，内部的absolute元素会跟随滚动内容一起滚动

可以将容器改为overflow-hidden，在容器中滚动内容外包裹一层可滚动的div

--------







### 实现边框

- div加个border，如果border颜色是透明度的话，div背景色会和border颜色重叠
- 解决办法
  - 使用box-shadow实现
  - div加属性，background-clip : padding-box
    - 控制div的背景色只作用于content和padding区域



### 定位

- 将一个盒子position设为absolute，宽高设为100%，如果没有已定位祖先，会相对于视口定位，撑开整个页面

```js
.wrapper {
 /* position: relative; */ 一旦打开.box就变小
 width: 300px;
 height: 300px;
}
.box {
 width: 100%,
 height: 100%；
 position: absolute; 
 background-color: red;
}
<div class='wrapper'>
 <div class='box'></div>
</div>

// .box会扩展到整个视口的大小
```



- 【少用fixed定位】



##### sticky

- 粘性定位，是相对定位和固定定位的混合
- **元素在跨域特定阈值前为相对定位，之后是固定定位**
- **【元素相对于它的最近拥有“滚动机制”的祖先定位】**
- 需要指定top/left/right/bottom四个阈值之一，才可使得粘性定位生效
- 使用场景：

```html
<div>
  <dl>
    <dt>A</dt>
    <dd>Andrew W.K.</dd>
    <dd>Apparat</dd>
    <dd>Arcade Fire</dd>
    <dd>At The Drive-In</dd>
    <dd>Aziz Ansari</dd>
  </dl>
  <dl>
    <dt>C</dt>
    <dd>Chromeo</dd>
    <dd>Common</dd>
    <dd>Converge</dd>
    <dd>Crystal Castles</dd>
    <dd>Cursive</dd>
  </dl>
  <dl>
    <dt>E</dt>
    <dd>Explosions In The Sky</dd>
  </dl>
  <dl>
    <dt>T</dt>
    <dd>Ted Leo & The Pharmacists</dd>
    <dd>T-Pain</dd>
    <dd>Thrice</dd>
    <dd>TV On The Radio</dd>
    <dd>Two Gallants</dd>
  </dl>
</div>
```

```css
* {
  box-sizing: border-box
}
dt {
  position: sticky;
  top: 0
}
```

![image-20250208100019426](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250208100019426.png)

![image-20250208100031401](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250208100031401.png)













### 伪类、伪元素

```js
【伪类】
// 场景：一行5个div，最后一列不想要margin-right
	// flex布局实现更佳
div:nth-child(5n) {
  margin-right: 0
}

// 场景：一行5个div，最后一行不想要margin-bottom，
div:nth-last-child(-n + 5) {
  margin-bottom: 0
}
// 注意：如果使用flex布局会利用i标签，假如有2个i标签，由于i也是父元素的子元素，需要把i标签的个数也算进去, 变成了 -n + 7

// 场景：除了最后一个div，其它div都加上margin-bottom
div:not(:last-child) {
  margin-bottom: 12px
}

【伪元素】
// 设置输入框的占位文本颜色
input::placeholder {
  color: #999;
}
```







### flex布局

##### gap属性

- gap用于定义flex项之间的间距
- 在父容器上使用gap属性
  - 一个值
  - 两个值：「行间距，列间距」
- **【兼容性差，不推荐使用】**





##### *实现唯一子元素的整体居中

- Flex container有且只有一个子元素，让其居中
  - **子元素的margin设为auto**
  - Justify-content/align-items设为center

```js
  <div class="wrapper">
    <div class="box"></div>
  </div>
  .wrapper {
    width: 200px;
    height: 100px;
    border: 2px solid #000;
    display: flex;
    margin: 100px auto;
  }

  .box {
    margin: auto;
    width: 50px;
    height: 50px;
    background-color: red;
  }
```







### Unocss

```css
宽高  h-80px w-full w-10%   
大小一样时 size-16px

flex布局  justify-between items-center  flex-nowrap
flex-[0_0_auto] flex-1

内边距 px-8px py-6px  pt-12px pb-0 p-16px
外边距 ml-12px mx-12px

文本 text-#fff text-14px fw-500
text-[rgba(0,0,0,.3)]

圆角 rounded-12px rounded-tl-12px rounded-bl-0

溢出 overflow-x-atuo

层级 z-9

下边框 border-b-2px

水平居中 text-center 

pointer-events-none
元素将无法响应任何鼠标或触摸事件

indent-15px  文本缩进15px  [text-indent缩写] 

占位文本颜色：placeholder-#999

一行文本溢出控制：truncate，相当于以下三个属性
- overflow: hidden
- text-overflow: ellipsis
- white-space: nowrap

给第一个子元素单独设置margin-top  first:mt-0px

文字不可选 select-none

背景高斯模糊效果 backdrop-blur-16px 

hover、active、focus样式   hover:text-blue

cursor-not-allowed  cursor-pointer
```





### 高度塌缩

- 如果父元素的高度是由子元素撑开的（即未显式设置height），那么父元素的高度会根据子元素的内容动态计算

- 当给某个在标准流的子元素设置h-full，它会尝试继承父元素的高度，但由于父元素高度未显式设置，浏览器无法确定父元素的高度，从而导致子元素的高度失效，出现塌缩现象

  【在标准流的子元素默认会继承父元素的高度，加了h-full反而有问题】

- 如果这个子元素脱离标准流，默认情况下它的高度不依赖于父元素的内容。设置h-full会继承父元素的高度





### object-fit

- 指定可替换元素**（img、video）**的内容如何适应到一个大小确定的容器

- 默认值 fill，图片将会填满容器，如果宽高比与容器不同，图片将会变形

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250201145248362.png" alt="image-20250201145248362" style="zoom:33%;" />

- contain：图片将保持原始宽高比，将图片全部放到容器中（即使容器会留下一些空间

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250201145309915.png" alt="image-20250201145309915" style="zoom:33%;" />

- cover：图片将保持原始宽高比并覆盖整个容器，如果图片宽高比和容器不同，部分图片会被裁掉

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250201145337085.png" alt="image-20250201145337085" style="zoom:33%;" />

- none: 图片将保持原始大小，不缩放，不裁剪







### 断点breakpoint

- 通过**『媒体查询』 **在不同的屏幕尺寸下应用不同的css样式

```js
@medai (max-width: 755.98px) {}
@media (min-width: 576px) and (max-width:767.98px) {}

...
```







### 黑暗模式

```js
.App {
  transition: 0.2s
}
.App[color-mode='light'] {
	--surface1: #e6e6e6;
	--surface2: #f2f2f2;
	--element1: #111;
	--element2: #222;
}
.App[color-mode='dark'] {
	--surface1: #262626;
	--surface2: #333;
	--element1: #eee;
	--element2: #ddd;
}

function App() {
	const [mode, setMode] = useState('light')
  const handleClick = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return {
    <div className='App' color-mode={mode}>
    	<button onClick={handleClick}>toggle</button>
    </div>
  }
}
```





### transform

- 只改变视觉效果，不改变布局空间

```js
<div :style="{'--scale': layoutScale}"></div>
.close-btn {
  top: calc(-4px * var(--scale));
  right: calc(-4px * var(--scale));
  width: calc(20px * var(--scale));
  height: calc(20px * var(--scale));
}
```







### devicePixelRatio

- **设备物理像素与CSS像素的比值**
- 设为3，表面1个css像素占3 * 3个物理像素
- **在不同dpr设备上，元素的视觉大小一致，dpr越高，1个css像素占的物理像素越高，物理像素越密集，越清晰**

```js
.element {
  width: 100px
  // A电脑dpr为1，在A电脑占用100物理像素
  // B电脑dpr为2，在B电脑占用200物理像素
}
```

- dpr为3的设备上，图片设为100 * 100px, 实际用来显示内容的区域是物理像素300 * 300个

```js
htmlToImage.toPng(element, {
  poxelRatio: 1, // 生成物理像素为100*100的图片
  width: 100,
  height: 100
})
// 图片需被拉伸，模糊、锯齿、细节丢失

htmlToImage.toPng(element, {
  pixelRatio: window.devicePixelRatio, // 生成物理像素为300*300的图片
  width: 100,
  height: 100
})
// 图片以原始尺寸显示，无需缩放，清晰、锐利、细节完整
```











# 修改组件库样式

- **在devtool看是哪个属性决定样式**，比如vant-dialog的content的height实际是min-height决定的
- **有的第三方组件是直接挂载到body，覆盖样式只能在不带scoped的style标签写**



### 原因

- vue组件的style样式会添加scoped，会将template中的每个元素加上 【data-xxx】属性
- **如果使用第三方组件，【data-xxx】只加在最外层元素上，子元素上没有这个属性，而style的所有选择器都会加上【data-xxx】属性**

```js
// 以element-ui的input为例
<style scoped lang='scss'>
  .appContent {
    .el-input {
      width: 200px;
      .el-input_inner {
        border-color: red
      }
    }
  }
</style>
 
- el-input的宽度可以生效
- el-input_inner的颜色不生效，因为el-input_inner上无【data-xxx】
```





### 解决

##### 去掉style标签的scoped

- vue是允许写多个style标签的，可以再写个不带scoped的style标签

```css
<style lang="scss">
.appContent {
    .el-input__inner {
      border-color: red;
    }
}
</style>
```

- 为了避免样式污染，在外层添加自定义class，向下包含ui组件的样式代码，防止影响到别的组件

##### 使用深度选择器

- ```text
  >>>
  ```

- ```text
  /deep/
  ```

- ```text
  :deep()
  ```

```js
<style lang="scss" scoped>
.a >>> .b {}

// 相当于
.a[data-v-f3f3eg9] .b {}
</style>
```

##### 自带className属性

- 在不带scoped的style标签写，会影响全局







# 图片上传

file 、blob、base64的dataurl 

### 基本流程

- 用户选择图片
- 前端将图片上传到云端
- 通过HTTP请求将图片url传输到后端
- 后端接收并处理图片





### img

- Img.complete：布尔值，表示图片是否已经加载完成
- img.load()

```js
const img = new Image()
img.src = 'xxx'
img.onload = () => {
  console.log('图片加载完成')
}
```







### input的type为file

- accept指定图片的类型
- capture
  - 移动端场景
  - 值 `user` 表示应该使用前置摄像头和（或）麦克风。
  - 值 `environment` 表示应该使用后置摄像头和（或）麦克风。
- multiple
  - 一次性可以选择多个文件
- files
  - 返回一个FileList，列出所选文件对象

```javascript
<input type="file" multiple id="fileInput" accept="image/*" />

let fileInput = document.querySelector('#fileInput')
fileInput.onchange = function(e) {
  let fileList = document.querySelector('#imgLocal').files
  console.log(fileList) 
}
```



### FormData

- 通过FormData对象可以组装一组用XMLHttpRequest发送请求的键值对
- 如果将表单的编码类型设置为multipart/form-data，则通过FormData传输的数据格式和表单通过submit()方法传输的数据格式相同

```javascript
const formData = new FormData()
fileInput.onchange = function(event) {
 const files = event.target.files
 // 限制文件大小
 const maxSize = 500 * 1024  // 500kb
 for(let file of files) {
  if(file.size > maxSize) return 
  formData.append('images', file)
 }
}

formData.append(name, value, filename)
-- name：属性名
-- value: 属性值，file数据
-- filename: 当第二个参数为 file 或 blob 时，告诉服务器的文件名。
Blob 对象的默认文件名是“blob”。File 对象的默认文件名是 文件的文件名。
-- formData.append('userPicture', file, '1.jpg')



//axios实现图片上传
let config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}
axios
  .post('serverUrl', formData, config)
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
```



### FileReader

- FileReader对象允许web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用File或Blob对象指定要读取的文件或数据
- **【FileReader也就是将本地文件（File或Blob）转换成base64格式的dataUrl】**
- base64
  - 一种基于64个可打印字符来表示二进制数据的表示方法

```javascript
const reader = new FileReader()
```

- 0：empty，还没有加载任何数据
- 1：loading，数据正在被加载
- 2：done，已完成全部的读取请求

FileReader.result

- 文件的内容。该属性仅在读取操作完成后才有效

FileReader.error

**FileReader.onload()**

- 处理load事件，该事件在读取操作完成时触发

**FileReader.readAsDataURL()**

- 开始读取指定的Blob中的内容
- **一旦完成，result属性中将包含一个data:URL格式的字符串以表示所读取文件的内容【base64】**

```javascript
let file = files[0]
const fileReader = new FileReader()
// 读取图片
fileReader.readAsDataURL(file)  
// 读取完成
fileReader.onload = () => {
 // res是base64格式的图片
 let res = fileReader.result
}
【注：每个file都要创建一个FileReader实例】
```

- 使用FileReader还实现前端图片预览，将fileReader.result赋值给img的src



### Blob对象

- **一个二进制对象**
- 一个blob对象表示一个不可变的，原始数据的类似文件对象
- File基于Blob，继承blob功能并将其扩展为支持用户系统上的文件



### 图片存储

- 存到公司自己的服务器上
- 存到第三方服务器（阿里云，腾讯云）
- **各种云有专门为图片存储提供的云服务器，公司服务器只存储图片地址即可**



### URL.createObjectURL(object)

- **返回一个临时指向内存中Blob对象的URL地址**

```js
blob:http://example.com/550e8400-e29b-41d4-a716-446655440000
// 或
blob:null/550e8400-e29b-41d4-a716-446655440000（本地环境）
```

- 使用完url后，需要手动释放内存，URL.revokeObjectURL(objectURL)







### 代码示例

```html
<div class='imgs'>
  <div class=qualified-img v-show='imgUrlList.length' v-for='(url, idx) in imgUrlList' :key='url'>
    <img :src='url'>
  </div>
  <div class='img-loading' v-for='item in curImgList?.length' :key='item' v-show='isShowImgLoading'>
    <van-loading size='24px' vertical text-color='#fff' color='#fff'>上传中...</van-loading>
  </div>
  <div class='img-empty' @click='selectFile' v-show='imgList.length<3'>
    <img :src='add_icon'/>   
  </div>
  <input type='file' ref='imgInputRef' multiple accept='image/*' style='display:none' @change='handleFileChange' />  
</div>
```



```javascript
const selectFile = () => {
  imgInputRef.value.click()
}
// 现有图片
const imgList = ref<any[]>([])
// 现有图片url
const imgUrlList = ref<any[]>([])
// 本次上传的合格图片
let curImgList:any  
const isShowImgLoading = ref(true)
const handleFileChange = async (event: any) => {
  isShowImgLoading.value = true
  const files = [...event.target.files]
  // 判断图片格式
  function judgeFormat(arr: any[]) {
    const regex = /\.(png|jpg)$/i
    if(arr.findIndex(item => !regex.test(item.name)) !== -1) {
       showToast('图片格式错误，上传失败')
    }
    for(let idx = 0; idx < arr.length) {
      if(!regex.test(arr[idx].name))
      arr.splice(Number(idx), 1)
    } else {
      idx++
    }
  }
  
  // 判断图片内存是否小于10mb
  function judgeCache(arr: any[]) {
    const fileMaxSize = 10  * 1024 * 1024
    if(arr.findIndex(item => item.size > fileMaxSize) !== -1) {
       showToast('图片内存大于10mb，上传失败')
    }
    for(let idx = 0; idx < arr.length) {
      if(arr[idx].size > fileMaxSize)
      arr.splice(Number(idx), 1)
    } else {
      idx++
    }
  }
  
  // 判断图片不超过3张
  if(files.length > 3 - imgList.value.length) {
    let tmpImgList = files.slice(0, 3 - imgList.value.length)
    judgeFormat(tmpImgList)
    judgeCache(tmpImgList)
    curImgList = tmpImgList
    imgList.value.push(...tmpImgList)
    showToast('图片最多支持上传3张')
  } else {
    judgeFormat(files)
    judgeCache(files)
    curImgList = files
    imgList.value.push(...files)
  }
  
  // 无图片直接return
  if(curImgList.length === 0) {
    imgInputRef.value.value = ''
    return 
 }
  
  // 上传图片获取其src
  const fileList = await uploader.uploadFile(curImgList)
  let tmpUrls = fileList.map(item => 'https://' + item.data.Location)
  imgUrlList.value.push(...tmpUrls)
  // 重置input的value值，否则下次选择相同的文件不会触发change事件
  imgInputRef.value.value = ''
  nextTick(() => isShowImgLoading.value = false )
}
```





### 图片压缩

- **利用canvas.toDataURL()实现有损压缩，适合照片类图片**
  - 结果是base64字符串，可以直接用于img.src
  - base64是「二进制数据」转换为「由字母、数字和特殊字符组成的字符串」
  - base64的大小约为原图大小的 4/3


```js
const compressImage = (base64, rate = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = base64
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if(!ctx) {
        reject(new Error('failed to get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      const compressedBase64 = canvas.toDataURL('image/jpeg', rate)
      const compressedSize = Math.round(compressedBase64.length * 0.75)
      const compressedImage = {
        base64: compressedBase64,
        size: compressedSize
      }
      resolve(compressedImage)
    }
    img.onError = () => {
      reject(new Error('failed to load image'))
    }
  })
}
```

- **利用canvas.toBlob实现图片压缩【推荐】**
  - 结果是二进制的blob对象，不可直接用于img.src
  - 和`URL.createObjectURL(blob)`结合使用，才可用于img.src

```js
const compressImage = (base64, rate = 0.8) => {
  return new Promise((resole, reject) => {
    const img = new Image()
    img.src = base64
    img.onload = () => {
       const canvas = document.createElement('canvas')
       let width = img.width
    	 let height = img.height
       canvas.width = width
    	 canvas.height = height
       const ctx = canvas.getContext('2d')
       if(!ctx) {
          reject(new Error('failed to get canvas context'))
          return
       }
       ctx.drawImage(img, 0, 0, width, height)
       canvas.toBlob((blob) => {
         if(!blob) {
           reject(new Error('failed to get blob'))
           return
				 }
         resolve({
           blob,
           url: URL.createObjectURL(blob)
           size: blob.size
         })
       }, 'image/jpeg', rate)
    }
    img.onError = () => {
      reject(new Error('failed to load image'))
    }
  })
}
```







# 截图

### 利用canvas

- 将目标dom节点绘制到canvas画布
  - 例如，img标签可以使用drawImage方法
- canvas画布以图片形式导出
  - 利用canvas的toDataURL方法实现画布内容的导出
    - 结果是base64字符串，它包含了图片的所有像素信息（只要有这个字符串，就能还原出来原图）
  - canvas.toBlob + `URL.createObjectURL(blob)`结合使用





### 内容完整性

1、对于跨域图片，可以采取服务端转发的方式，绕过跨域限制

- 服务端将图片资源下载
- 假设请求地址`/api/redirect/image`，传入图片地址参数`redirect`

```js
const Koa = require('koa')
const router = require('koa-router')()
const querystring = require('querystring')
const app = new Koa()
app.use(router.routes())

router.get('/api/redirect/image'， async function(ctx) {
  const querys = ctx.querystring()
  const { redirect } = querystring.parse(querys)
  const res = await proxyFetchImage(redirect)
  ctx.set('Content-Type', 'image/png')
	ctx.response.body = res
})

async function proxyFetchImage(url) {
  const res = await fetch(url)
  return res.body
}
```



2、对图片资源做加载请求时，可能加载失败

- 提前利用图片url转为本地的base64字符串或blob对象





### 清晰度优化

- 问题：在高分辨率的屏幕下，canvas默认会显得很模糊
- 解决：根据dpr，来创建canvas，用css将画布缩回原来的显示尺寸【配置高倍的canvas画布】
  - 假如dpr为3，100 * 100px的canvas画布，会先绘制300 * 300px的画布，后续缩小

```js
<canvas id='myCanvas' style='width:300px;height:150px'></canvas>

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
// 获取dpr
const dpr = 2
// 设置画布实际像素大小
canvas.width = 100 * dpr
canvas.height = 100 * dpr
// 用css控制画布显示大小
canvas.style.width = '100px'
canvas.style.height = '100px'
// 缩放绘图操作
ctx.scale(dpr, dpr)

ctx.fillStyle = "red";
ctx.fillRect(50, 50, 50, 50);
```

- **ctx.scale()方法会把后续所有的绘图操作都按指定倍数进行缩放**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250717143556652.png" alt="image-20250717143556652" style="zoom:50%;" />

- 如果注释这行代码，canvas会变成

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250717143701941.png" alt="image-20250717143701941" style="zoom:50%;" />









# 部署

### 容器

【容器采用沙箱机制，相互隔离】

1、**容器是一种计算单元，介于进程和虚拟机之间，可以称为高度隔离的进程**

- 相较于虚拟机应用部署方式，容器更加`【轻量化】`，启动迅速 

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250610181021927.png" alt="image-20250610181021927" style="zoom:40%;" />



传统虚拟机：每个VM需要独立运行完整的Guest OS内核

容器：所有容器共享Host OS内核，无需虚拟化整个操作系统，节省内存和CPU

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250610181307207.png" alt="image-20250610181307207" style="zoom:50%;" />

 

2、容器是**一种应用的包装形式**`【自包含】`

- 相较于虚拟机应用部署方式，容器包含运行应用的所有依赖，在开发、测试、生产环境高度一致，可部署在任意基础设施

 



3、构建安全容器的两种解决方案

![image-20250610215738799](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250610215738799.png)

- **限制系统调用**
- **独立内核**：在容器中添加内核（微内核 ： mini操作系统），容器与宿主机之间无直接系统调用，由内核和宿主机打交道





### docker

- **docker是一个容器管理平台**，解决软件跨环境迁移的问题
- docker可以让开发者打包应用以及依赖包到一个轻量级、**可移植**的容器中

- docker背后的复杂工作
  - 应用包装、下载：docker image、dockerhub
  - 创建容器运行环境：各种namespace
  - 创建容器与外部的通信环境：NAT、iptables
  - 管理容器生命周期



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250610214617311.png" alt="image-20250610214617311" style="zoom:50%;" />

- **镜像image是一个只读的文件和文件夹组合，是可执行程序（可以从镜像仓库拉取别人制作好的镜像）**
- 容器container是镜像的运行实体，一个镜像可以创建多个容器， 容器运行着真正的应用进程
- 镜像仓库用来存储和分发Docker镜像

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250610205746769.png" alt="image-20250610205746769" style="zoom:50%;" />







### pod

- **是由多个容器组成的，包括1个主容器和n个辅助容器，pod是一种增强的容器**
- pod的实现：多个容器共享一个或多个namespace。每个容器的自包含和便携性得以保存









# sourcemap

### .map文件内容

- version: sourcemap的版本，当前为3
- file: 转换后的文件名
- sources： 转换前的文件，该项是一个数组，表示可能存在多个文件合并
- names：数组，存储转换前的所有变量名和属性名
  - 源代码转换成ast树，由ast树中的name字段构成的数组
- mappings：记录位置信息的字符串

```js
"mappings": "+LACOA,MAAM,S,GACTC,EAAAA;EAAAA,GAA8B,UAA1B;yBAAqB,G,GAAz"
```









# 基建

### lint-staged

- 利用husky管理git钩子
- 在提交之前（pre-commit钩子）运行lint-staged
- 根据lint-staged相关配置对暂存区代码进行校验
  - 与eslint、prettier、stylelint等工具结合，确保提交的代码符合规范











# 性能优化

- 三个方面： 项目架构、项目开发、项目部署
- 架构设计：
  - 协同开发
  - 模块解耦
  - 构建工具的优化
    - 代码分割，有助于只加载需要的模块，减少初始加载时间
    - 动态导入，根据需要懒加载模块，进一步降低加载时间
    - tree-shaking
- 开发
  - 合理使用v-if和v-show
  - 避免不必要的组件重新渲染
    - 列表渲染使用key
    - 使用v-once指令确保不变的数据只渲染一次
  - 动态import实现按需加载组件，减少初始加载时间
  - **状态下沉**
    - 根据虚拟dom更新特性，将状态下沉到子组件，避免全局或父组件频繁更新
  - 合理使用keep-alive
    - 使用keep-alive缓存动态组件，避免不必要的组件销毁和创建
  - 防抖、节流
  - 使用web workers
  - 避免内存泄漏
  - 使用现代图片格式和精灵图
    - **使用WebP、AVIF等格式减少图片文件大小，加快加载速度，对图片进行压缩处理**
    - 对于图标和简单的图形，可以使用svg格式，不仅文件体积小，而且可以无损缩放
    - 精灵图：显著减少HTTP请求的数量，降低网络开销
  - 服务端渲染
    - **在服务器端预先渲染页面，并将完整的html发送到客户端**
    - 提高首屏渲染速度，利于seo优化
  - 首屏优化
    - 将首屏渲染所需的关键css内联到html中，减少css阻塞渲染的时间
    - 使用async、defer
    - ssr
    - 代码分割、懒加载
- 部署
  - CDN
  - 减少DNS查询，将多个资源托管在同一域名下，减少dns查询的时间
    - 对于必须跨域的资源，使用DNS预解析 **dns-prefetch**
- **1、四类资源优先级 **
  - prefetch：浏览器在网络和cpu空闲时预先获取资源到本地内存【各种文件】
  - preload：确保当前页面的关键资源可以**优先**加载【**字体文件**】
  - preconnect：提示浏览器提前和目标域名完成连接
  - dns-prefetch：提前进行dns寻址，获取到域名对应的ip
    - 是preconnect的子集，但是dns-prefetch的浏览器兼容性更好
- 2、传统**代码分割**的痛点
  - 配置复杂，开发者难以确定拆分目标模块
  - 拆分配置方案无法适应项目的快速迭代变化，需要经常调整
  - **优化用户体验的效果不好**，拆分出的模块每次打包上线都会变化，不便于配合增量构建进行缓存，没有实现最优缓存效果，甚至导致用户体验恶化
- 细粒度代码分割webpack配置-知乎？？？
  - 【拆分出很多js文件，配合htts2的多路复用】
  - 配置统一通用，自动选择拆分目标模块，不必人工判断哪些模块需要拆分
  - 健壮性强，用不变的代码分割配置应对不断迭代的各类型前端项目
  - 分割颗粒度较细，产物文件稳定，多次构建部署后，仍有较多文件名称内容不变，缓存命中率高
- 3、**SSR**
  - 服务器端：Node.js服务端渲染为html字符串 renderToString()
  - 客户端：浏览器客户端活化 hydrate()
  - 缺点：无改动的页面重复渲染，浪费服务端资源
  - SSG：ssr允许开发者指定部分页面，在项目打包编译时，就提前生成静态页面HTML文件，随服务端应用部署后，直接将html文件作为响应返回给用户
    - 缺点：构建耗时太长
  - ISR：将单次renderToString()渲染的结果缓存，并设置缓存有效期，来实现既减少重复渲染，节省服务端资源，又避免构建耗时太长的需求

web vitals 5个性能指标

performance API自定义指标 mark measure

- 前端构建内存爆栈 webpack dll plugin???







# V8引擎

- scanner进行词法分析
- parser和pre-parser进行语法分析
  - pre-parser：对不必要的函数进行预解析，**只解析暂时需要的内容**，而对函数的全量解析是在函数被调用时才会进行

**1、标记整理**

- 回收期间将保留的存储对象搬运汇集到连续的内存空间，从而整合空闲空间，避免内存碎片化 【**新生代的from-space和to-space**】

**2、分代收集**

- 对象被分成两组：新的和旧的
- 许多对象出现，完成他们的工作并很快死去，他们可以很快被清理
- 长期存活的对象会变得老旧，被检查的频次也会减少
- 新生代分为两个空间：from-space和to-space
- 老生代也有两个区域：
  - 老指针空间：对象嵌套对象的「对象」
  - 老数据空间：没有嵌套关系的「对象」

**3、增量收集**

- 有很多对象，如果试图一次遍历并标记整个对象集，可能需要一些时间，并在执行过程中带来明显的延迟
- 所以引擎将垃圾收集工作分成几部分来做（增量），这几部分会逐一进行处理，这样会有很多微小的延迟而不是一个大的延迟

**4、闲时收集**

- 垃圾收集器只会在cpu空闲时收集垃圾，减少对代码执行的影响



### 导致内存泄漏

**1、全局变量滥用**

- 未使用var、let、const声明创建的全局变量

**2、未清理的定时器和回调函数**

**3、闭包**

**4、dom引用**

- js对象持有已从dom中删除的元素的引用，这会阻止这些dom元素的内存被释放

**5、监听器的回调未进行移除**





# 视频转码

- 把视频从一种格式转换成另一种格式，类似把中文书翻译成英文书，内容不变但是形式变了
- **视频转码 = 格式转换 + 压缩瘦身，目的是让视频在不同设备、网速下流畅播放**
- 为什么需要转码

| 场景         | 例子                                                         |
| ------------ | ------------------------------------------------------------ |
| 兼容不同设备 | iphone用.mov，安卓用.mp4，网站需要统一成.mp4                 |
| 节省流量     | 原视频1GB太大，转成100mb的压缩版，加载更快                   |
| 适配不同网速 | 4G用户看高清版，2G用户看低清版（如b站的1080p/720p/480p多分辨率选择） |

- 转码过程类比

| 步骤     | 技术实现               | 类比                            |
| -------- | ---------------------- | ------------------------------- |
| 拆解视频 | 把书拆成一页页纸       | 解码原始视频（如mkv -> 帧画面） |
| 修改内容 | 将中文翻译成英文       | 改变编码格式（H.264 -> H.265)   |
| 重新打包 | 将翻译好的纸装订成新书 | 编码成目标格式(帧画面 -> mp4)   |

















 









