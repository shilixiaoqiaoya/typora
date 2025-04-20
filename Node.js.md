# Node.js

**是一个基于V8 JavaScript引擎的 JavaScript运行时环境**

- V8可以嵌入到任何C++应用程序中，无论是chrome还是nodejs，都是嵌入了V8引擎来执行js代码
- **在chrome浏览器中，还需要解析渲染html/css等相关渲染引擎、提供支持浏览器操作的API、事件循环**
- **在node.js中，也需要一些额外的操作，比如文件系统读/写、网络IO、压缩解压文件等**

![](D:\DeskTop\笔记\typora-images\浏览器和node.js架构.png)



### 传递参数

- `node index.js env=development coderwhy`

- 获取参数：在`process.argv`中获取，`process.argv`是一个数组





# 浏览器内核

例：浏览器内核WebKit由两部分组成

1. WebCore:负责HTML解析、布局、渲染等相关的工作
2. JavaScriptCore:解析、执行JavaScript代码

![](D:\DeskTop\笔记\node.js\webkit内核.jpg)





# V8引擎

![](D:\DeskTop\笔记\node.js\V8引擎.png)

![](D:\DeskTop\笔记\node.js\V8引擎原理.png)





# node程序传递参数

```js
//执行一个node程序，希望给node传递一些参数
node index.js env=development coderwhy
```

- 获取参数是在内置对象process中
- 它的argv属性是一个数组，里面包含了给node传递的参数



# 常见全局对象

### global

- **类似于浏览器的window**

- 注意：在浏览器，通过var定义一个变量，会被放在window上

  ​			  在node.js，通过var定义一个变量，是不会被放在global上的

### __dirname

- 当前文件所在的目录结构

### __filename

- 当前目录+文件名称





# 常见内置模块

### path模块

#### 基本使用

- **path模块用于对路径和文件进行处理**
- 在Mac OS、Linux和window上的路径是不一样的
  - window上会使用`\`和`\\`来作为文件路径的分隔符，目前也支持`/`
  - 在Mac OS、Linux操作系统上使用`/`来作为文件路径的分隔符
- 在window使用`\`作为分隔符开发一个应用程序，部署到Linux上面路径会出现问题
- **为了屏蔽不同操作系统之间路径分隔符的差异，应该使用path模块**

```js
const path = require('path')

const basePath = '/User/why'
const filename = 'abc.txt'
const filepath = path.resolve(basePath, filename)
console.log(filepath)   // 'D:/User/why/abc.txt'
```

#### 其它方法的使用

```js
const path = require('path')

//1、获取路径的信息
const filepath = '/User/why/abc.txt'
console.log(path.dirname(filepath))  //'User/why'
console.log(path.basename(filepath))  //'abc.txt'
console.log(path.extname(filepath))  //'.txt'

//2、join路径拼接
const basePath = '/User/why'
const filename = 'abc.txt'
const filepath = path.join(basePath, filename)
console.log(filepath)  //'/User/why/abc.txt'
//和resolve的区别：resolve会判断拼接的路径前面是否有`/`或`./`或`../`
```





### fs模块

- 某些用户资源是以文件的形式存在于服务器的操作系统上的
- 借助于node提供的文件系统，我们可以在任何操作系统上(window/mac os /linux)直接去操作文件

#### 基本使用

- **很多方法有三种使用方式：同步、回调函数异步、promise异步**

```js
const fs = require('fs')

//1、同步操作文件
let res = fs.readFileSync('./abc.txt', {
  encoding: 'utf8'
})
console.log(res)
console.log('后续代码')


//2、异步，回调函数操作文件
fs.readFile('./abc.txt', {
  encoding: 'utf8'
}, (err, data) => {
  if(err) {
    console.log('读取失败')
    return
  }
  console.log('读取成功：', data)
})
console.log('后续代码')


//3、异步，Promise操作文件
fs.promises.readFile('./abc.txt', {
  encoding: 'utf8'
}).then(res => {
  console.log('读取结果：', res)
}).catch(err => {
  console.log(err)
})
console.log('后续代码')
```



#### 文件描述符

- file descriptor，文件系统操作**使用文件描述符来标识和跟踪每个特定的文件**

```js
const fs = require('fs')

fs.open('./abc.txt', (err, fd) => {
  console.log(fd)  // 拿到filepath对应的文件描述符，是一个数字
  
    //通过文件描述符来获取文件的相关信息
  fs.fstat(fd, (err, state) => {
    console.log(state)
  })
})
```



#### 文件的写入

```js
const fs = require('fs')
const content = '你好啊'
fs.writeFile('./ccc.txt', content, (err) => {
  if(err) {
    console.log('文件写入失败')
  }
  console.log('文件写入成功')
})
```



#### 对文件夹操作

```js
const fs = require('fs')
const path = require('path')
const dirname = './why'

//1、创建文件夹
if(!fs.existsSync(dirname)) {
  fs.mkdir(dirname, err => {
    console.log(err)
  })
}


//2、读取文件夹中的所有文件
fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
  for(let item of files) {
          if(item.isDirectory()) {
            console.log('item是一个文件夹')
          } else {
            console.log('item是一个文件')
          }
        }
})

	//扩展：递归读取文件夹下所有文件
    function getFiles(dirname) {
      fs.readdir(dirname, { withFileTypes: true }, (err, files) => {
        for(let file of files) {
          if(file.isDirectory()) {
            const filePath = path.resolve(dirname, file.name)
            getFiles(filePath)
          } else {
            console.log(file.name)
          }
        }
      })
    }
    getFiles(dirname)
```

##### 文件的复制

```js
const fs = require('fs')
const path = require('path')

const srcDir = process.argv[2]
const destDir = process.argv[3]
let i = 0
while(i < 30) {
    i++
    const num = 'day' + (i + '').padStart(2, 0)
    const srcPath = path.resolve(srcDir, num)
    const destPath = path.resolve(destDir, num)
    if(fs.existsSync(destpath)) continue
    fs.mkdir(destPath, (err) => {
        if(!err) console.log('文件创建成功开始拷贝')
        const srcFiles = fs.readdirSync(srcPath)
        for(const file of srcFiles) {
            if(file.endWith('.mp4')) {
                const srcFile = path.resolve(srcPath, file)
                const destFile = path.resolve(destPath, file)
                fs.copyFileSync(srcFile, destFile)
                console.log(file, '拷贝成功')
            }
        }
    })
}
```





### events模块

- 类似于事件总线

```js
const EventEmitter = require('events')
//创建发射器
const emitter = new EventEmitter()

//监听某一个事件
emitter.on('click', args => {
  console.log('监听1:',args)
})
emitter.on('click', args => {
  console.log('监听2:',args)
})

//发出一个事件
emitter.emit('click', 'coderwhy')

//获取发射器相关信息
console.log(emitter.eventNames()) //[ 'click' ]
console.log(emitter.listenerCount('click'))  //2
console.log(emitter.listeners('click')) //[ [Function (anonymous)], [Function (anonymous)] ]
```





### Buffer

- **在计算机中，通常会将8位二进制合在一起作为一个单元，这个单元称之为一个字节`1byte = 8bit`**

- **比如RGB的值分别都是255，本质上在计算机中都是用一个字节存储的**

- **Buffer是一个存储二进制的数组，数组的每一项可以保存8位二进制，即一个字节**

```js
const buffer = Buffer.from('world')
console.log(buffer)
```





# 事件循环

- libuv中主要维护了一个EventLoop和worker threads（线程池）

- libuv是使用c语言写的库

  ![](D:\DeskTop\笔记\typora-images\node事件循环.jpg)



### 阻塞IO/非阻塞IO

- **在程序中对一个文件进行操作，需要通过文件描述符打开这个文件**
- **任何程序中的文件操作都需要进行系统调用（操作系统的文件系统）**
- **对文件的操作，是一个操作系统的IO操作（输入、输出）**



- **操作系统为我们提供了阻塞式调用和非阻塞式调用**

  阻塞式调用：调用结果返回前，当前线程处于阻塞态，调用线程只有得到调用结果才能继续执行

  非阻塞式调用：调用执行后，当前线程不会停止执行

- **【开发中很多耗时操作，都是基于非阻塞式调用**】

- **非阻塞式IO存在一定问题：【为了知道是否读取到了完整的数据，我们需要频繁的去确定读取到的结果是否是完整的，这个过程称之为轮询**】

- 【**在node中，轮询由谁来完成？**

  **libuv提供了线程池，线程池会负责所有相关的操作，并且通过轮询或其他方式等待结果**

  **当某一线程获取到结果时，就可以将对应的回调放到事件循环的某一事件队列中**

  **事件循环就可以负责后续的回调工作，告知JavaScript application执行对应的回调函数】**





### 宏任务/微任务

- **宏任务：setTimeout、setInterval、IO事件、setImmediate、close事件**
- **微任务：Promise的then回调、process.nextTick、queueMicrotask**

- **微任务队列**
  - **nexttick queue:  process.nextTick**
  - **other queue: Promise的then回调、queueMicrotask**
- **宏任务队列**
  - **timer queue:  setTimeout、setInterval**
  - **poll(轮询) queue: IO事件**
  - **check queue: setImmediate**
  - **close queue: close事件**











# Stream

- 当我们从一个文件中读取数据时，文件的二进制（字节）数据会源源不断的被读取到程序中

- **一连串的字节，就是程序中的流【流是连续字节的一种表现形式和抽象概念】**

- **流是可读的，也是可写的**

- **常见两种流：**

  - **writable: 可以向文件写入数据的流**
  - **readable: 可以从文件读取数据的流**

- 为什么需要流？

  - 直接读写文件无法控制一些细节的操作

    比如从什么位置开始读，读到什么位置，一次性读取多少个字节

    读到某个位置后，暂停读取，某个时刻恢复读取

  - 当某个文件很大，一次性全部读取不合适
  
- **http模块的request和response对象是基于流实现的**

- **所有的流都是EventEmitter的实例**



### 可读流

```js
const fs = require('fs')

const readStream = fs.createReadStream('./aaa.txt', {
  // 从什么位置开始读，读到什么位置，一次性读取多少个字节
  start: 4,
  end: 9,
  highWaterMark: 2
})

readStream.on('data', (data) => {
  console.log(data.toString())

  // 读到某个位置后，暂停读取
  readStream.pause()
    
  setTimeout(() => {
    readStream.resume()   //某个时刻恢复读取
  }, 1000
})

readStream.on('open', (fd) => {
  console.log('文件被打开', fd)
})

readStream.on('end', () => {
  console.log('已读取到end位置')
})

readStream.on('close', () => {
  console.log('文件读取结束被关闭')
})
```





### 可写流

```js
const fs = require('fs')

const writeStream = fs.createWriteStream('./bbb.txt', {
  flags: 'a'
})

writeStream.write('你好啊李银河')
writeStream.write('coderwhy')

// 相当于写入内容 + 关闭文件
writeStream.end('hello world')
```





### pipe

- 我们可以手动将读取到的输入流，放到输出流进行写入
- 也可以使用pipe

```js
const fs = require('fs')
const readStream = fs.createReadStream('aaa.txt')
const writeStream = fs.createWriteStream('aaa_copy01.txt')

readStream.on('data', (data) => {
  writeStream.write(data)
})
readStream.on('end', () => {
  writeStream.close()
})

//等同于：
readStream.pipe(writeStream)
```





# http模块

### 基本使用

- **request和response对象是基于流实现的**

```js
const http = require('http')

// 创建http对应的服务器，
const server = http.createServer((request, response) => {
  // request对象中包含客户端请求的所有信息
  // response用于给客户端返回结果  本质上是可写流
  response.end('hello world')
  
})

// 开启对应的服务器，并且告知需要监听的端口（1024-65535）
server.listen(8000, () => {
  console.log('服务器已经开启成功了')
})
```



### 解析request

```js
const server = http.createServer((req, res) => {
	console.log(req.url)  // '/login'
    console.log(req.method)
    console.log(req.headers)
    
    res.end('hello world')
})
```



### 解析get的query参数

```js
const http = require('http')
const url = require('url')
const qs = require('querystring')

// 创建http对应的服务器
const server = http.createServer((req, res) => {
  const {pathname, query} = url.parse(req.url)
  console.log(query)  //'username=why&password=123'
  // 拿到query参数
  const {username, password} = qs.parse(query)
  console.log(username, password) // why 123
    
  response.end('hello world')
})

// 开启对应的服务器，并且告知需要监听的端口（1024-65535）
server.listen(8000, () => {
  console.log('服务器已经开启成功了')
})
```



### 解析post的body参数(json格式)

```js
const http = require('http')

// 创建http对应的服务器，
const server = http.createServer((req, res) => {
  req.setEncoding('utf-8')

  let isLogin = false
  // req是可读流
  req.on('data', (data) => {
    const {username, password} = JSON.parse(data)
    if(username == 'kobe' && password == '888888') {
      isLogin = true
    } else {
      isLogin = false
    }
  })

  req.on('end', () => {
    if(isLogin) {
      res.end('登录成功，欢迎回来')
    } else {
      res.end('账号或密码错误')
    }
  })
})

// 开启对应的服务器，并且告知需要监听的端口（1024-65535）
server.listen(8000, () => {
  console.log('服务器已经开启成功了')
})
```



### 解析response

```js
const server = http.createServer((req, res) => {
	//设置状态码,两种方式
    res.statusCode = 400
    res.writeHead(503)
    
    // 设置响应头
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200, {
        'Content-Type': 'application/json'
    })
    
    //响应结果
    res.write('响应结果')
    res.end('hello world')
})
```





### 发送网络请求-axios

- **axios可以在浏览器中使用，也可以在node中使用**
- **在浏览器，axios使用的是封装xhr**
- **在node中，使用的是http模块**

```js
const http = require('http')
// get请求
http.get('http://localhost:8000', res => {
  //注意：此处的res是可读流，和之前的req类型一样    
  res.on('data', data => {
    console.log(data.toString())
  })
})

// post请求
const request = http.request({
  method: 'POST',
  hostname: 'localhost',
  port: 8000
}, res => {
  res.on('data', data => {
	  console.log(data.toString())
  })
})
request.end()
```





# express框架

### 基本使用

```js
const express = require('express')

// 创建服务器
const app = express()

// /home的get请求处理
app.get('/home', (req, res) => {
  res.end('Hello Home')
})

// /login的post请求处理
app.post('/login', (req, res) => {
  res.end('Hello Login')
})

// 开启监听
app.listen(8000, () => {
  console.log('服务器启动成功~')
})
```



### 中间件

- **Express应用程序本质上是一系列中间件函数的调用**

- **中间件的本质是传递给express的一个回调函数**

- **接收三个参数：**

  - **请求对象（request对象）**

  - **响应对象（response对象）**

  - **next函数（在express中定义的用于执行下一个中间件的函数）**

    

- #### 中间件可以执行的任务有：

  - **执行任何代码**
  - **更改请求对象和响应对象**
  - **结束请求-响应周期**
  - **调用栈中的下一个中间件**
  - **【如果当前中间件没有结束请求-响应周期，则必须调用next()将控制权传递给下一个中间件，否则，请求将被挂起】**



#### 注册中间件

- **当express接收到客户端发送的网络请求时，在所有中间件中开始进行匹配**
  **当匹配到第一个符合要求的中间件时，那么就会执行这个中间件**
  **后续的中间件是否会执行呢？ 取决于上一个中间件有没有执行next**

- 最普通的中间件：app/router.use(callback)

  通过use注册的中间件是最普通的中间件，无论是什么请求方式都可以匹配上

```js
app.use((req, res, next) => {
  console.log('normal middleware 01')
  next()
})

app.use((req, res, next) => {
  console.log('normal middleware 02')
})
```

- path匹配中间件

```js
app.use('/login', (req, res, next) => {
  console.log('normal middleware 01')
  res.end('login data')
})
```

- path和method匹配中间件

```js
app.get('/home', (req, res) => {
  res.end('Hello Home')
})

app.post('/login', (req, res) => {
  res.end('Hello Login')
})
```

- 注册多个中间件

```js
app.get('/home', (req, res, next) => {
  console.log('home middleware 01')
  next()	
}, (req, res, next) => {
  console.log('home middleware 02')
  next()
}, (req, res, next) => {
  console.log('home middleware 03')
  next()
}, (req, res, next) => {
  console.log('home middleware 04')
  res.end('end~')
})
```



#### 内置中间件

- **post请求中body的json格式：使用中间件express.json()**
- **post请求中body的x-www-form-urlencoded格式：使用中间件express.urlencoded()**

```js
const express = require('express')
const app = express()

// 应用express内置中间件
  // 解析客户端传过来的json
app.use(express.json())

  // 解析客户端传过来的urlencoded， 默认使用内置模块querystring
  //传入{extended: true}:不再使用内置模块querystring, 而是使用第三方库qs
app.use(express.urlencoded({extended: true}))

app.post('/login', (req, res, next) => {
  // req.body：拿到客户端传的数据，比如{username: 'why', pwd: '123'}
  console.log(req.body)
  res.end('登录成功~')
})

app.listen(8000, () => {
  console.log('服务器启动成功~')
})
```



#### 第三方中间件

- **post请求中form-data格式：使用第三方中间件multer**
- **注意：不要把multer作为全局中间件使用**

```js
const express = require('express')
const multer = require('multer')
const app = express()

// 普通数据解析
const upload = multer()
app.post('/login', upload.any(), (req, res, next) => {
    console.log(req.body)
    res.end('用户登录成功')
})

// 上传文件
const upload = multer({
  dest: './uploads'
})
	// 上传单个文件
app.post('/avatar', upload.single('avatar'), (req, res, next) => {
      console.log(req.file)  // 拿到上传图片的相关信息
      res.end('头像上传成功~')
})

	// 上传多个文件
app.post('/photos', upload.array('photos'), (req, res, next) => {
  console.log(req.files)
  res.end("上传多张照片成功")
})

app.listen(9000, () => {
  console.log('express服务器启动成功')
})
```



### 处理get请求参数

```js
app.get('/products/:id', (req, res, next) => {
    console.log(req.params.id)
    res.end('商品详情数据')
})
app.get('/login', (req, res, next) => {
    console.log(req.query)
    res.end('用户登录成功')
})
```





### 服务器响应数据

- **res.json()：可以传入很多的类型： object、array、string、boolean、number、null，会被转成json格式返回**
- **res.end()：类似于http中的response.end方法**
- **res.status()：用于设置状态码**





### 路由系统

- 如果把所有的代码逻辑都放在app上，app会变得越来越复杂
- **可以使用express.Router创建一个路由处理程序**
- **一个Rouetr实例拥有完整的中间件和路由系统，被称为`mini-app`**

```js
const express = require('express')

// 创建路由对象
const useRouter = express.Router()

// 定义路由对象中的映射
userRouter.get('/', (req, res, next) => {
  res.json('用户列表数据')
})
userRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  res.json('某一个用户数据：' + id )
})
userRouter.post('/', (req, res, next) => {
  res.json('创建用户成功')
})
userRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  res.json('删除某一个用户数据：' + id ) 
})

const app = express()
app.use('/user', userRouter)

app.listen(9000, () => {
  console.log('express服务器启动成功')
})
```





### 静态资源服务器

- express给我们提供了方便部署静态资源的方法

  ```js
  const express = require('express')
  const app = express()
  
  // 内置中间件，直接将一个文件夹作为静态资源
  app.use(express.static('./build'))
  
  app.listen(9000, () => {
    console.log('express服务器启动成功')
  })
  ```

  



### 错误信息处理

- **next()携带参数就会执行处理错误的中间件**

```js
const express = require('express')
const app = express()

app.use(express.json())

app.post('/login', (req, res, next) => {
  const { username, password }  = req.body
  if(!username || !password) {
    next(-1001)
  } else if(username != 'coderwhy' && password != '123456') {
    next(-1002)
  } else {
    res.json({
      code: 0,
      message: '登录成功',
      token: 'xxxxxxx'
    })
  }
})

// 错误处理的中间件 
app.use((errCode, req, res, next) => {
  let code = errCode
  let message = '未知错误信息'
  switch(code) {
    case -1001:
      message = '没有输入用户名和密码'
      break
    case -1002:
      message = '用户名或密码错误'
      break
  }
  res.json({code, message})
})

app.listen(9000, () => {
  console.log('express服务器启动成功')
})
```



### (*)源码解析

- 调用express()创建的是什么
- app.listen()启动服务器
- app.use(中间件)内部发生了什么
- 发送请求，中间件如何被回调
- 调用next()为什么会执行下一个中间件







# koa框架

- **Koa旨在为web应用程序和API提供更小、更丰富、更强大的能力**

- **相对于express具有更强的异步处理能力**

- **Koa核心代码1600+行，是一个更加轻量级的框架**

- **我们可以根据需要安装和使用中间件**

  ```js
  const Koa = require('koa')
  const app = new Koa()
  
  app.use((ctx, next) => {
    ctx.body = '我是返回的内容'
  })
  app.listen(9000, () => {
    console.log('Koa服务器开启成功~')
  })
  ```



### 中间件

- **第一个参数是ctx（上下文对象），表示一次请求的上下文对象**
  - **`ctx.request`：获取请求对象，这是Koa封装的**
  - **`ctx.req`：Node封装的请求对象**
  - **`ctx.response`：获取响应对象，这是Koa封装的**
  - **`ctx.res`：Node封装的响应对象**
- **【大部分在`ctx.request`  `ctx.response`  上的属性都可以直接在ctx上拿到，源码做了一层代理】**
- **koa注册中间件只能通过use方法，并且use方法只能传入回调函数**





### 路由

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const app = new Koa()
const userRouter = new KoaRouter({ prefix: '/user'})

// 定义路由对象中的映射
userRouter.get('/', (ctx, next) => {
  ctx.body = '所有用户列表数据'
})
userRouter.post('/', (ctx, next) => {
  ctx.body = '创建用户成功'
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods()) //用于判断某一个method是否支持

app.listen(9000, () => {
  console.log('Koa服务器开启成功~')
})
```



### 解析客户端传递的参数

- **get---params-query**

```js
// get请求的query参数
userRouter.get('/', (ctx, next) => {
  const query = ctx.query
  ctx.body = '用户的query信息' + JSON.stringify(query)
})

// get请求的params参数
userRouter.get('/:id', (ctx, next) => {
  const id = ctx.params.id
  ctx.body = '某一个用户数据：' + id
})
```



- **post---json-urlencoded-formdata**

```js
// 引入第三方中间件bodyParser：帮助解析post请求json/urlencoded
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
userRouter.post('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = '用户的json信息'
})
userRouter.post('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = '用户的urlencoded信息'
})

// 引入第三方中间件koa/multer：帮助解析post请求form-data
const multer = require('@koa/multer')
const formParser = multer()
userRouter.post('/', formParser.any(), (ctx, next) => {
    console.log(ctx.request.body)  
    ctx.body = '用户的formdata信息'
})
```



### 文件上传

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const multer = require('@koa/multer')

const app = new Koa()

const upload = multer({
  dest: './uploads'
})
const uploadRouter = new KoaRouter({prefix: '/upload'})
// 上传单个文件
uploadRouter.post('/avatar', upload.single('avatar'), (ctx, next) => {
  // 可以拿到上传图片的相关信息
  console.log(ctx.request.file)
  ctx.body = '头像上传成功~'
})

// 上传多个文件
uploadRouter.post('/photos', upload.array('photos'), (ctx, next) => {
  console.log(ctx.request.files)
  ctx.body = "上传多张照片成功"
})

app.use(uploadRouter.routes())
app.use(uploadRouter.allowedMethods())
app.listen(9000, () => {
  console.log('express服务器启动成功')
})
```



### 静态资源服务器

 ```js
 const Koa = require('koa')
 const koaStatic = require('koa-static')
 const app = new Koa()
 
 app.use(koaStatic('./build'))
 
 app.listen(9000, () =>{
     console.log('koa服务器开启成功')
 })
 ```



### 错误信息处理

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')

// app本质上是EventEmitter实例对象
const app = new Koa()
const userRouter = new KoaRouter({prefix: '/users'})

userRouter.get('/', (ctx, next) => {
  const isAuth = false
  if(isAuth) {
    ctx.body = 'user list data'
  } else {
    // 通过ctx.app可以拿到app
    ctx.app.emit('error', -1003, ctx)
  }
})

app.on('error', (code, ctx) => {
  let message = ''
  switch(code) {
    case -1001:
      message = '账号或密码错误'
      break
    case -1002:
      message = '请求参数不正确'
      break
    case -1003:
      message = '未认证,请检查token信息'
      break
  }
  const body = {
    code,
    message
  }
  ctx.body = body
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.listen(9000, () => {
  console.log('服务器启动成功')
})
```





# 两个框架对比

- **express是完整和强大的，其中帮助我们内置了很多好用的功能**

- **koa是简洁和自由的，它只包含最核心的功能，并不会对我们使用其他中间件进行任何的限制**

- **两个框架核心都是中间件，但它们中间件的执行机制是不同的，特别是针对某个中间件中包含异步操作时**

  

### koa中间件

- **【中间件不管是执行同步代码还是异步代码，都符合洋葱模型（递归）的概念】**

- 执行同步代码

```js
const Koa = require('koa')

const app = new Koa()
app.use((ctx,next) => {
  ctx.msg = 'aaa'
  next()
  ctx.body = ctx.msg    //给客户端结果是aaabbbccc
})
app.use((ctx,next) => {
  ctx.msg += 'bbb'
  next()
})
app.use((ctx,next) => {
  ctx.msg += 'ccc'
})

app.listen(9000, () => {
  console.log('Koa服务器开启成功~')
})
```

- 执行异步代码**【koa中next函数返回值是promise，所以可以使用await】**

```js
const Koa = require('koa')
const axios = require('axios')

const app = new Koa()
app.use(async (ctx,next) => {
  ctx.msg = 'aaa'
  await next()

  ctx.body = ctx.msg  //可以给客户端返回完整数据
})
app.use(async (ctx,next) => {
  ctx.msg += 'bbb'

  // 如果执行的下一个中间件是一个异步函数，那么next默认不会等到异步操作的结果，就会执行下一步操作
  // 如果希望等待异步函数的执行结果，那么需要在next函数前面加await，把中间件变为异步函数
  await next()
})
app.use(async (ctx,next) => {
  const res = await axios.get('http://xxxxx')
  ctx.msg += res.data.data
})

app.listen(9000, () => {
  console.log('Koa服务器开启成功~')
})
```



### express中间件

- **【中间件只有执行同步代码，才符合洋葱模型；执行异步代码，是不符合的】**

- 执行同步代码流程和koa一样
- 执行异步代码【**express中next函数返回值是空**】

```js
const express = require('express')
const axios = require('axios')

const app = express()
app.use((req, res, next) => {
  req.msg = 'aaa'
  next()
})
app.use((req, res, next) => {
  req.msg += 'bbb'
  next()
})
app.use(async (req, res, next) => {
  const resData = await axios.get('http://xxxxx')
  req.msg += resData.data.data
    
  // 只有在这里返回给客户端的结果才是完整的，如果在第一个中间件返回结果，它是不包含异步拿到的数据的
  res.json(req.msg)
})

app.listen(9000, () => {
  console.log('express服务器开启成功~')
})
```



# 登录流程

### 服务端设置cookie

- 客户端登录后，服务器给返回一个cookie
- 之后的http请求，浏览器会携带这个cookie来验证身份

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')

const app = new Koa()
const userRouter = new KoaRouter({prefix: '/user'})

userRouter.get('/login', (ctx, next) => {
  ctx.cookies.set('slogan', 'ikun', {
    maxAge: 5 * 60 * 1000     //5分钟有效时间
  })
  ctx.body = '登录成功'
})

userRouter.get('/list', (ctx, next) => {
  const val = ctx.cookies.get('slogan')
  if(val === 'ikun') {
    ctx.body = 'user list data'
  } else {
    ctx.body = '没有权限，请先登录'
  }
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(8000, () => {
  console.log('服务器开启成功')
})
```



### 服务端设置session

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const koaSession = require('koa-session')

const app = new Koa()
const userRouter = new KoaRouter({prefix: '/user'})

const session = koaSession({
  key: 'sessionid',
  //进一步加密：signed: true   并进行加盐操作
  signed: true
}, app)
// 加盐操作
app.keys = ['aaa', 'bbb', 'ccc']
app.use(session)

userRouter.get('/login', (ctx, next) => {
  ctx.session.slogan = 'ikun'
  ctx.body = '登录成功'
})

userRouter.get('/list', (ctx, next) => {
  const val = ctx.session.slogan
  if(val === 'ikun') {
    ctx.body = 'user list data'
  } else {
    ctx.body = '没有权限，请先登录'
  }
})
```





### cookie/session缺点

- **cookie会被附加在每个http请求中，事实上某些请求是不需要的，会无形增加流量**
- **cookie明文传递，存在安全性；session进行了双重加密，安全性得到提高**
- **cookie大小限制4kb，对于复杂的需求是不够的**
- **对于浏览器外的其他客户端，必须手动保存cookie和session**
- **对于分布式系统和服务器集群，在子系统之间和服务器之间共享cookie实现麻烦**





### 服务器设置token

```js
const Koa = require('koa')
const KoaRouter = require('@koa/router')
const jwt = require('jsonwebtoken')

const app = new Koa()
const userRouter = new KoaRouter({prefix: '/user'})

// 编写secretKey
const secretKey = 'aaabbbccc'
userRouter.get('/login', (ctx, next) => {
  const payload = {id: 111, name: 'why'}
  //颁发token
  const token = jwt.sign(payload, secretKey, {
    expiresIn: 60
  })
  ctx.body = {
    token,
    message: '登录成功'
  }
})

userRouter.get('/list', (ctx, next) => {
  const authorization = ctx.headers.authorization
  const token = authorization.replace('Bearer ', '')

  try {
      //验证
    const res = jwt.verify(token, secretKey)
    ctx.body = {
      message: 'user list data'
    }
  } catch {
    ctx.body = {
      message: 'token无效或过期'
    }
  }
})
```





# Koa源码

```js
module.exports = compose

function compose (middleware) {
  // 类型判断 middleware必需是一个函数数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  // 返回一个函数，接受context和next参数，koa在调用koa-compose时只传入context，所以此处next为undefined
  return function (context, next) {
    // last called middleware #
    // 初始化index
    let index = -1;
    // 从第一个中间件开始执行
    return dispatch(0);
    function dispatch (i) {
      // 在一个中间件出现两次next函数时，抛出异常
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      // 设置index，作用是判断在同一个中间件中是否调用多次next函数
      index = i;
      // 中间件函数
      let fn = middleware[i]
      // 跑完所有中间件时，fn=next，即fn=undefined，可以理解为终止条件
      if (i === middleware.length) fn = next
      // fn为空时，返回一个空值的promise对象
      if (!fn) return Promise.resolve();
      try {
        // 返回一个定值的promise对象，值为下一个中间件的返回值
        // 这里时最核心的逻辑，递归调用下一个中间件，并将返回值返回给上一个中间件
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```

