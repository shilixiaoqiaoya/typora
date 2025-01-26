# Vue

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





### v-if、v-show、visibility

-  **一开始`display: none`， 在mounted里面，`element.offsetWidth`  `dom.getBoundingClientRect()` 都为 0**
- **改为 `visibility: hidden` ，元素不可见，但仍然占据空间，mounted里面可以获取正确尺寸**







### ？？pointer事件

- touch-action: none
  - 用于防止触摸事件的默认行为，以实现自定义的复杂的交互效果
- 如何实现类似知乎的图片预览效果





# Javascript

### 输入事件

- input事件，输入内容变更时，实时触发
- change事件，输入框失去焦点且其内容发生变化时触发
- v-model双向绑定，默认绑定input事件
- v-model.lazy绑定为change事件，失焦才更新值



### img

- onload事件，图片从无到有全部展示





### Array

##### Array.prototype.at()

- 从数组中拿到指定位置的元素
- 可以使用负数索引从数组的末尾访问元素
- 处理动态数组时更加方便

```js
const arr = [10, 20, 30, 40, 50]
console.log(arr.at(0))  // 10
console.log(arr.at(-1))  // 50
console.log(arr.at(5))  // undefined
```



##### 空数组

- if ( [ ] )  为true
- if ( { } )  为true





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

- 避免跨站脚本攻击，将危险字符进行转义

```js
const userInput = "<script>alert('XSS');</script>";
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
console.log(url);
// https://example.com/search?q=%3Cscript%3Ealert%28%27XSS%27%29%3C%2Fscript%3E
```







### scrollIntoView()

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





















# 修改组件库样式

- **在devtool看是哪个属性决定样式**，比如vant-dialog的content的height实际是min-height决定的
- **有的组件是直接挂载到app下面，在子组件内部通过:deep()去修改是不会生效的**



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











# CSS

### 滚动

- **overflow设置为auto而不是scroll**，因为滚动条会占位置可能出现样式错乱的问题



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

【少用fixed定位】
```





### 常用属性

```js
// 背景颜色渐变渐变
background: linear-gradient(red, green)

// 禁止图片被拖拽
img {
  -webkit-user-drag: none
}

// 文字不可选
user-select: none
```



### 伪类

```js
// 场景：一行5个div，最后一列不想要margin-right
	// flex布局实现更佳
div:nth-child(5n) {
  margin-right: 0
}

// 场景：一行5个div，最后一行不想要margin-bottom
div:nth-last-child(-n + 5) {
  margin-bottom: 0
}

// 场景：除了最后一个div，其它div都加上margin-bottom
div:not(:last-child) {
  margin-bottom: 12px
}
```





### flex布局

##### gap属性

- gap用于定义flex项之间的间距
- 在父容器上使用gap属性
  - 一个值
  - 两个值：「行间距，列间距」
- **【兼容性差，不推荐使用】**





##### **实现有且只有一个子元素的水平垂直居中

- Flex container有且只有一个子元素，让其居中
  - Justify-content/align-items设为center
  - **子元素的margin设为auto**

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

```text
h-80px w-full w-10%   
宽高大小一样时 size-16px

justify-between items-center  flex-nowrap

px-8px py-6px  pt-12px pb-0 p-16px
ml-12px mx-12px

text-#fff text-14px fw-500

圆角 rounded-12px rounded-tl-12px rounded-bl-0

overflow-x-atuo

层级 z-9

flex-[0_0_auto] flex-1

下边框 border-b-2px

text-center 水平居中

pointer-events-none
元素将无法响应任何鼠标或触摸事件

indent-15px  文本缩进15px  [text-indent缩写] 
```







# 图片上传

### 基本流程

- 用户选择图片
- 前端将图片转换为合适的格式
- 通过HTTP请求将图片传输到后端
- 后端接收并处理图片



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
- **FileReader也就是将本地文件转换成base64格式的dataUrl**
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

FileReader.onload()

- 处理load事件，该事件在读取操作完成时触发

FileReader.readAsDataURL()

- 开始读取指定的Blob中的内容
- 一旦完成，result属性中将包含一个data:URL格式的字符串以表示所读取文件的内容

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
```

- 使用FileReader还实现前端图片预览，将fileReader.result赋值给img的src



### Blob对象

- 一个二进制对象
- 一个blob对象表示一个不可变的，原始数据的类似文件对象
- File基于Blob，继承blob功能并将其扩展为支持用户系统上的文件



### 图片存储

- 存到公司自己的服务器上
- 存到第三方服务器（阿里云，腾讯云）
- **各种云有专门为图片存储提供的云服务器，公司服务器只存储图片地址即可**



### URL.createObjectURL(object)

- 返回值是当前文件的内存url地址
- 该地址存在于当前document内，可以通过revokeObjectURL()手动清除
- 该方法是同步的，直接返回url地址
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







# Typescript

#### ??

- 空值合并运算符
- 当??左侧是null或undefined时，返回右侧的值
- **|| 还会将 「0、 false、 ''」视为假值，而 ?? 只关注null和undefined**







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





