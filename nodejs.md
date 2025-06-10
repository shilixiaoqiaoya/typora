# 基本知识

#### REPL

- 输入、执行、输出

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250523110644026.png" alt="image-20250523110644026" style="zoom:33%;" />





#### Path库

- 用于处理文件和目录路径，它提供了一系列工具方法来跨操作系统（windows、linux、macos）解析、拼接、规范化路径



#### form表单提交数据

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const { url, method } = req
  if(url === '/') {
    res.write('<html>')
    res.write('<head><title>enter message</title></head>')
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"/><button type="submit">send</button></form></body>')
    res.write('</html>')
    return res.end()
  }
  if(url === '/message' && method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()    // message='...'
      const msg = parsedBody.split('=')[1]
      fs.writeFileSync("message.txt", msg)
      res.statusCode = 302         
      res.setHeader('Location', '/')      // 重定向
      res.end()
    })
  }
})

server.listen(3000)
```





#### 事件驱动

注册回调；非阻塞

- **适合io密集型应用**，文件操作和网络请求多的
- **不适合运算密集型应用**，比如视频渲染和图片操作，这种需要cpu完成大量的运算，文件操作和网络请求极少，导致单线程一直在为一个用户运算，阻塞

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250528102453588.png" alt="image-20250528102453588" style="zoom:33%;" />





#### js执行

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529154212058.png" alt="image-20250529154212058" style="zoom:40%;" />

- 一部分耗时操作会由libuv交给线程池去执行：文件操作、加密，对应事件循环的`pendingOperations`数组
-  一些操作会由libuv委托给操作系统内核，不占用线程池资源：网络请求(发出请求、接收请求)，对应事件循环的`pendingOSTasks`数组

【通常文件操作要比网络请求慢得多，文件操作使用有限的线程池，网络请求直接由操作系统处理，不受线程池限制】





#### 提升执行性能

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529205216012.png" alt="image-20250529205216012" style="zoom:40%;" />

##### cluster

- 第一次运行`node index.js`会生成`cluster manager`

- 每次执行`cluster.fork()`都会生成一个node实例

  

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250530095741232.png" alt="image-20250530095741232" style="zoom:40%;" />

- cluster manager负责监控各个node实例的运行情况

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250530095401313.png" alt="image-20250530095401313" style="zoom:40%;" />

```js
const cluster = require('cluster')
const express = require('express')

if(cluster.isMaster) {
  cluster.fork()
} else {
  const app = express()
  app.listen(3000)
}
```

- 理想情况下，node实例的数量 * 每个线程池中线程数量  = cpu 内核数量









#### 事件循环

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529170523734.png" alt="image-20250529170523734" style="zoom:50%;" />

```js
1、是否有pending setTimeout/ setInterval / setImmediate
2、是否有pendingOsTasks (服务器监听某端口)
3、是否有pendingOperations（读取文件）

若有其一，会进入下一次事件循环 tick，程序不会退出

每次事件循环tick 
- check pendingTimers and see if any functions are ready to be called 【setTimeout/ setInterval】
- check pendingOSTasks、pendingOperations and call relevant callbacks
- ???
- check pendingTimers 【setImmediate】
- close阶段   
```

 







#### libuv

- 是一个跨平台异步IO库，充当了【**nodejs与操作系统之间的桥梁】**，负责处理**事件循环、文件系统操作、网络通信等底层任务**

| 功能         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 事件循环     | 利用「事件循环+线程池」实现非阻塞io，平衡js单线程的局限性    |
|              | 管理定时器、io事件和回调的执行顺序                           |
| 跨平台抽象层 | 统一不同操作系统的io操作（如文件读写、网络请求）             |
|              | 让开发者无需关心操作系统差异                                 |
| 线程池管理   | 将部分阻塞操作（如文件读写、DNS解析）委托给线程池，避免阻塞主线程 |

- 读取文件
  - node.js代码调用fs.readFile
  - v8执行js并调用libuv的接口
  - libuv调用操作系统内核（如windows的IOCP）
    - libuv将任务放入线程池，线程池中的线程执行阻塞的文件读取，读取完成后，libuv将回调放入事件循环队列，事件循环在主线程执行回调

- http服务器
  - libuv使用操作系统提供的非阻塞网络I/O（如linux的epoll）





操作系统中的线程调度

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250527215527238.png" alt="image-20250527215527238" style="zoom:57%;" />





#### v8引擎

- 高级语言转换为机器码是针对不同cpu架构的，**【不同cpu架构对应的机器指令集是不同的】**

```js
int add(int a, int b) {
    return a + b;
}

// x86机器码      汇编代码
55               push rbp
48 89 e5         mov rbp, rsp
89 7d fc         mov [rbp-4], edi
89 75 f8         mov [rbp-8], esi
8b 55 fc         mov edx, [rbp-4]
8b 45 f8         mov eax, [rbp-8]
01 d0            add eax, edx
5d               pop rbp
c3               ret

// arm64机器码   汇编代码
00 00 80 D2     mov x0, #0
20 00 80 D2     mov x1, #0
00 00 01 8B     add x0, x0, x1
C0 03 5F D6     ret
```













# 认识

![image-20250517192343772](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250517192343772.png)

- nodejs可以使js运行在操作系统中，实现网络请求和 文件操作的功能

### 响应html

```js
server.on('request', (req, res) => {
  fs.readFile('./index.html', 'utf-8', (err, data) => {
    res.write(data)
    res.end()
  })
})

// 使用sendFile
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'test.html'))
})
```





### 文件上传

- form-data数据

```html
<form action='/profile' method='post' enctype='multipart/form-data'>
  <input type='file' name='avatar'/>
  <button type='submit'>upload</button>  
</form>
```

- 利用multer上传form-data数据
- 将图片保存至node静态资源服务器中

```js
const app = express()
//利用fs对图片重命名
const fs = require('fs')
// 上传form-data
const multer = require('multer')
// 规定文件上传路径
const upload = multer({ dest: 'public/' }) 

// 设置静态资源服务器,可以通过get请求获取到图片
app.use(express.static('public'))

const { promisity } = require('util')
const rename = promisity(fs.rename)

// 会将图片放在public文件夹下，req.file是上传的图片file
app.post('/upload', upload.single('img-name'), async (req, res) => {
  console.log(res.file）
  // {
  //   fieldname: 'file',
  //   originalname: '👍.png',
  //   encoding: '7bit',
  //   mimetype: 'image/png',
  //   destination: 'public/',
  //   filename: '576ff9c68d686f57d45b706edbbcb66c',
  //   path: 'public/576ff9c68d686f57d45b706edbbcb66c',
  //   size: 2617
  // }
  
	const type = req.file.originalname.split('.')[1]
  const fileName = req.file.filename + '.' + type
  try {
    await rename(`./public/${req.file.filename}`, `./public/${fileName}`)   // 对图片进行重命名保证图片可查看
    res.status(201).json({ fileName })
  } catch(err) {
    res.status(500).json({err})
  }
})
```





### 视频点播

##### 获取上传凭证

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250520113453395.png" alt="image-20250520113453395" style="zoom:70%;" />

- 客户端向服务端发请求，服务端向阿里云发请求拿到上传凭证，服务端将凭证下发到客户端，客户端就可以上传视频了

```js
// nodejs sdk  服务端向阿里云发请求拿到上传凭证
const RPCClient = require('@alicloud/pop-core').PRCClient
function initVodClient(accessKeyId, accessKeySecret) {
  const regionID = 'cn-shanghai'
  const client = new RPCClient({
    accessKeyId: xxx,
    accessKeySecret: yyy,
    endpoint: 'http://vod.' + regionID + '.aliyuncs.com'
  })
  return client
}

app.get('/getvod', (req, res) => {
  const client = initVodClient('test-accessKeyId', 'test-accessKeySecret')
  client.request('CreateUploadVideo' {
     Title: 'video_title',
     Filename: 'filename.mp4'
  }).then(data => {
    // 将uploadAddress uploadAuth videoid 返回给客户端
    res.status(200).json({
      vod: data
    })
  })
})
```

```js
// web sdk  客户端拿到上传凭证，上传视频
axios.get('http://localhost:5500/api/v1/video/getvod').then(data => {
  ...
  // 上传视频逻辑
})
```





##### 视频信息落库

```js
// schema
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  videoId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.ObjectId,
    required: true,
    ref: 'User'
  }
})

app.post('/createvideo', async (req, res) => {
  req.body.user = req.user._id
  const video = new Video(req.body)
  await video.save()
	res.send('视频信息保存成功')
})
```











# 基础知识

#### node模块

- 每个js文件都是一个模块

```js
console.log(module)
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250528104624307.png" alt="image-20250528104624307" style="zoom:40%;" />









#### 读写文件

```js
// 同步
const fs = require('fs')
// 读
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn)

const textOut = `${textIn}\nCreated on ${Date.now()}`
// 写 
fs.writeFileSync('./txt/output.txt', textOut)


// 异步
fs.readFile('.txt/start.txt', 'utf-8', (err, data) => {
  console.log(data)
})

fs.writeFile('./txt/final.txt', '这是被写入的文本', 'utf-8', err => {
  console.log('文本已被写入')
})

// 写的操作是将内容直接覆盖的，实现追加需先读取后写入 
```



读取文件时，会访问两次硬盘

- **第一次访问硬盘，获取文件元数据**，包括文件大小、修改时间等，数据会返回给nodejs运行时

  基于获取的文件元数据，nodejs发起实际的文件内容读取请求

- **第二次访问硬盘，文件内容被读取**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529183511196.png" alt="image-20250529183511196" style="zoom:53%;" />

```js
const https = require('https')
const crypto = require('crypto')
const fs = require('fs')
const startTime = Date.now()
// 请求
function doRequest() {
  https.request('htttps://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => {
      console.log('request', Date.now() - startTime)
    })
  }).end()
}
// 加密
function doHash() {
	crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  	console.log('hash:', Date.now() - startTime)
	})
}

doRequest()
fs.readFile('xxx.js', 'utf-8', () => {
  console.log('fs', Date.now() - startTime)
})
doHash()
doHash()
doHash()
doHash()
```











#### 单线程 single thread 

- 无论是10个用户还是10w个用户同时访问node应用程序，他们是共用一个线程的 
- 而php是为每一个用户创建一个新线程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508163739984.png" alt="image-20250508163739984" style="zoom:50%;" />

- 所以要避免线程阻塞
  - 在回调函数中不要使用fs、crypto、zlib模块的sync版本
  - 不要执行复杂的计算逻辑
  - 对于大数据量的json数据要注意
  - 不要使用复杂的正则表达式









#### 线程池

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508160725647.png" alt="image-20250508160725647" style="zoom:35%;" />

- 当事件循环遇到计算密集型任务，会将其分流到线程池，避免阻塞事件循环
  - 阻塞任务完成后，回调返回事件循环
- **【默认有4个线程】**，可以处理以下几种异步IO操作
  - 文件系统操作（fs模块）
  - 加密操作（crypto模块）
  - 压缩/解压操作（zlib模块）
  - dns操作（dns模块）
- 线程数是可配置的，通过环境变量调整
  - 过多的线程会导致上下文切换开销


```js
process.env.UV_THREADPOOL_SIZE = 1
```

- 以加密为例

```js
const crypto = require('crypto')
const startTime = Date.now()
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - startTime)
})
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - startTime)
})
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529150943322.png" alt="image-20250529150943322" style="zoom:43%;" />



```js
const crypto = require('crypto')
const startTime = Date.now()
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - startTime)    // 249
})
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - startTime)    // 256
})
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3:', Date.now() - startTime)    // 256
})
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4:', Date.now() - startTime)    // 257
})
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5:', Date.now() - startTime)    // 476
})
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250529150909620.png" alt="image-20250529150909620" style="zoom:43%;" />







####   事件循环

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508162531313.png" alt="image-20250508162531313" style="zoom:35%;" />

- 一次tick分为四个阶段
  - timers: setTimeout、setInterval
  - IO：网络IO、文件IO
  - setImmediate
  - close callback
- 两个特殊的阶段：NextTick()和微任务队列
  - 这两个队列中若有回调要执行，会直接在当前阶段后立即执行，不需要等四个阶段全部执行完

- **node.js进程会在事件循环为空时自动退出，无需显式调用exit()**







#### createServer

```js
const http = require('http')
const server = http.createServer((req, res) => {
	res.end('Hello from the server')
})
server.listen(8000, '127.0.0.1', () => {
	console.log('listening to requests on port 8000')
})
```





#### 路由

```js
const server = http.createServer((req, res) => {
  const pathName = req.url
  if(pathName === '/' || pathName === '/overview') {
    res.end('this is overview')
  } else if(pathName === '/product') {
    res.end('this is prduct')
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    })
    res.end('<h1>page not found</h1>')
  }
	res.end('Hello from the server')
})
```



- 对无效路由的处理

```js
...    // 有效路由相关处理

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: 'can not find this url'
  })
  next()
})
```









#### events模块

```js 
const EventEmitter = require('events')

class Sales extends EventEmitter {
  constructor() {
    super()
  }
}
const myEmitter = new Sales()

myEmitter.on('newSale', () => {
  console.log('there is a new sale')
})
myEmitter.on('newSale', () => {
  console.log('listen newSale')
})
myEmitter.emit('newSale')
```



- http模块也继承自EventEmitter

```js
const http = require('http')
const server = http.createServer()
server.on('request', (req, res) => {
  console.log(req.url)
  res.end('request received')
})
server.on('request', (req, res) => {
  console.log('another request listen')
})
server.on('close', () => {
  console.log('serer closed')
})
server.listen(8000, '127.0.0.1', () => {
  console.log('waiting for request')
})
```







#### stream流模块

- 流是nodejs中处理流式数据的抽象接口，是nodejs的核心模块之一，用于高效处理大量数据或不确定大小的数据源
- **内存效率：不需要一次性加载全部数据到内存**
- **时间效率：可以边读取边处理，无需等待全部数据就绪**
- **组合性：可以通过管道pipeline将多个流连接起来**



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250508184551558.png" alt="image-20250508184551558" style="zoom:35%;" />

- 可读流
  - 示例：文件读取、http请求

```js
fs.createReadStream()
```

- 可写流
  - 示例：文件写入、http响应

```js
fs.createWriteStream()
```

- 双工流：即可读又可写
  - 示例：websocket
- 转换流：一种特殊的双工流，可以修改 读取或写入的数据
  - 示例：zlib压缩/解压、加密/解密







#### 中间件

1、普通中间件

```js
app.use(function(req, res, next) => {
})

// 将请求体的json数据放在req.body
app.use(express.json())
// 解析请求体的urlencoded数据，放在req.body
app.use(express.urlencoded({ extended: true }))
```



2、路由中间件

```js
// tourRoute.js
const router = express.Router()

router.route('/').get(getTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router

// index.js
const tourRouter = require('./tourRoute ')
app.use('/api/v1/tours', tourRouter)    // 安装路由器
```



3、参数中间件

- 对参数进行预处理

```js
router.param('id', (req, res, next, val) => {
  console.log(`tour id is : ${val}`)
  
  if(+val > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id'
    })
  }
  next()
})
```

- `router.route('/').post(middleware, fn)`

```js
function checkBody(req, res, next) {
  if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price'
    })
  }
  next()
}
router.route('/').post(checkBody, createTour)
```



4、静态资源中间件

- 向外暴露静态资源，`localhost:3000/text.png`

```js
app.use(express.static(path.join(__dirname, 'public'))
```

- **对于静态资源的Js和css文件、图片，node会在public文件夹下找**

```js
<link href='/css/main.css'>
```





三方中间件

- morgan 用于记录HTTP请求的详细信息

```js
app.use(morgan('dev'))
```

- cors 解决跨域问题

```js
// 允许所有来源的请求
app.use(cors())

// 自定义cors规则
const corsOptions = {
  origin: 'http://localhost:3000',   // 只允许该来源
  methods: ['GET', 'POST'],  // 允许的http方法
  allowedHeaders: ['Content-Type'],  // 允许的请求头
  credentials: true,	 // 允许携带cookie(如jwt认证)
  maxAge: 60000   // 预检请求缓存时间
}
app.use(cors(corsOptions))
```





#### 中间件调用实现

```js
function Pipeline(...middlewares) {
  const stack = middlewares
  
  const push = (...middlewares) {
    stack.push(...middlewares)
  }
  
  const execute = async(req, res) {
    let prevIndex = -1
    const runner = async(index) {
      if(index === prevIndex) {
        throw new Error('next() called multiple times')
      }
      
      prevIndex = index
      const middleware = stack[index]
      if(middleware) {
        await middleware(req, res, () => {
          return runner(index + 1)
        })
      }
    }
    await runner(0)
  }
  return { push, execute }
}
```







#### 环境变量

1、process.env

- 是nodejs中的一个全局对象，包含了所有在进程启动时设置的环境变量
- 本质是nodejs对操作系统环境变量的javascript封装
- **【敏感信息不要通过环境变量传递，应存储在后端，通过接口与后端交互】**
- 利用dotenv将自定义环境变量与process.env结合起来

```js
// server.js
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

// config.env
NODE_ENV=development
USER=jonas
PASSWORD=123456
JWT_SECRET=my-ultra-secure-and-ultra-long-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXP IRES_IN=90

EMAIL_USERNAME=...
EMAIL_PASSWORD=...
EMAIL_HOST=...
EMAIL_PORT=...
```





2、NODE_ENV 

是一个由开发者定义的环境变量，用于标识运行环境，一般设为development、production、test、staging(预发布环境)

- ① 可以通过命令行临时设置，操作后可以在process.env上获取NODE_ENV

```js
NODE_ENV=production node app.js
```

- 在package.json中设置

```js
{
  scripts: {
    start:dev: 'NODE_ENV=development nodemon app.js',
    start:prod: 'NODE_ENV=production node app.js'
  }
}
```

- ② 放在单独配置文件中 config.env文件

- 代码中访问
  - **`app.get('env')`是express应用程序用于获取当前环境变量的方法**
  - 如果没有设置NODE_ENV， `app.get('env')`返回值是development
  - 不推荐通过`process.env.NODE_ENV`获取当前环境


```js
if(app.get('env') === 'production') {
  // 生产环境特殊逻辑
  app.use(express.static('build'))
} else {
  // 开发环境特殊逻辑
  app.use(require('morgan')('dev'))
}
```







####  `./`和`__dirname`

- `./`或`../`是进程启动时所在的目录  `process.cwd()`
- `__dirname`是当前执行脚本文件所在的目录

```js
/my-project
	/src
		app.js     const data = require('./config.json'); 
	config.json

cd my-project
node src/app.js			// 此时process.cwd()是/my-project，此时路径解析正确

cd my-project/src
node app.js					// 此时process.cwd()是/my-project/src，会去src下找config.json，此时路径解析错误
```

- `./`是危险的，  `__dirname`是可靠的，建议用`path.join()`+ `__dirname`的方式引入文件



```js
// ？？？
path.dirname(process.mainModule.filename)
```









#### process.argv

- 是一个数组，包含了启动脚本进程时传入的**命令行参数**

```js
[
  '/usr/local/bin/node', // nodejs可执行文件的路径
  '/path/to/your/script.js',  // 正在执行的脚本路径
  'arg1', // 第一个用户参数
  'arg2'  // 第二个用户参数
]

node app.js --delete --import
arg1 就是 --delete
arg2 就是 --import
```





#### process.exit([exitCode])

- exitCode为0表示成功退出，非0表示异常退出

![image-20250513112311490](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250513112311490.png)

- 强制终止nodejs进程，不会等待未完成的异步操作
- 通常是在server.close事件执行退出
  - 否则正在处理的客户端请求会被强行中断，用户可能收到错误
  - server.close()会停止接受新请求；等待已有请求完成


```js
server.close(() => {
  process.exit(1)
})
```







#### 错误处理

- 有两大类错误：操作错误和程序错误

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250512163844282.png" alt="image-20250512163844282" style="zoom:43%;" />

##### 1、全局错误处理中间件

```js
// 捕获错误
app.use((err, req, res, next)  => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.messagae
  })
})
```

```js
// 举例：访问无效路由
app.all('*', (req, res, next) => {
  const err = new Error('can not find this url')
  err.statusCode = 404
  err.status = 'fail'
  
  next(err)    // 触发错误处理流程
}
```



- AppError类，对Error类二次包装

```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true   // 代表操作错误
  }
}
module.exports = AppError

// 使用
next(new AppError('can not find this url', 404 ))
```



- 区分环境

```js
// 【开发环境】
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.messagae,
    stack: err.stack
  })
}
// 【生产环境】
const sendErrorProd = (err, res) => {
  // 判断是操作错误
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.messagae,
    })
  } else {
    // 逻辑错误
    res.status(500).json({
      status: 'error',
      message: 'something went wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  
  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if(process.env.NODE_ENV === 'production') {
    // 对mongoose的错误做处理，使之operational为true
    if(err.name === 'CastError') err = handleCastErrorDB(err)
    if(err.name === 'ValidationError') err = handleValidationError(err)
    sendErrorProd(err, res)
  }
}

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`
  return new AppError(message, 400)
}

const handleValidationError = (err ) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `invalid input data, ${errors.join(',')}`
  return new AppError(message, 400) 
}
```





##### 2、捕获异步函数错误

```js
// 捕获异步错误
const catchAsync = fn => { 
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err))
  } 
}
```

```js
// 举例：创建tour
	// 重构之前
exports.createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}

	// 重构之后
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
})
```



##### 3、处理404错误

```js
 exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
  
  if(!tour) {
    return next(new AppError('no tour find', 404))
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})
```



##### 4、未处理的promise reject

```js
const server = app.listen(port, () => {
  console.log('app running on port')
})

process.on('unhandledRejection', err => {
  console.log(err.message)
  server.close(() => {
    process.exit(1)
  })
})
```





##### 5、同步代码报错

- 为了使其生效，代码需要放在最前面

```js
process.on('uncaughtException', err => {
    console.log(err.message)
    process.exit(1)
})
```







#### promisify

- Node内置的util模块提供了promisify方法

```js
const { promisify } = require('util')
const fs = require('fs')

// 回调风格的readFile
fs.readFile('file.txt', 'utf-8', (err, data) => {
})

// 用promisify转换成promise风格
const readFileProm = promisify(fs.readFile)
readFileProm('file.txt', 'utf-8').then(data => {}).catch(err => {})
```



- 自定义promisify

```js
function myPromisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if(err) reject(err)
        else resolve(data)
      })
    })
  }
}
const readFileProm = myPromisify(fs.readFile)
```







#### express.json()

- 内置中间件
- 解析请求中content-type为application/json的请求体，将json字符串转为js对象，放于req.body上

```js
const express = require('express')
const app = express()

app.use(express.json())
app.post('/api/data', (req, res) => {
  console.log(req.body)
  res.send('receive data')
})
```











# MongoDB

- **【是非关系型数据库(NOSQL)，属于文档型】**
- 关系型数据库像Excel表格一样组织数据，有严格的行列结构
  - 适合处理结构化数据
- 非关系型数据库以BSON（类似JSON）格式存储数据，结构灵活
  - 适合非结构化数据

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250509165242645.png" alt="image-20250509165242645" style="zoom:40%;" />



### 常见命令

- **mongo shell是命令行交互工具，通过它可以直接和mongodb数据库 ‘对话’**
- GUI工具 —— compass

```js
// 展示所有数据库
show dbs

// 展示所有集合
show collections

// 切换某个数据库
use xxx-db

// 在某个集合插入一条文档
db.tours.insertOne({ name:"xxx", price: 268, rating: 4.9 })

// 在某个集合插入多条文档
db.tours.insertMany([{name:"xxx", price: 88, rating: 4.9 }, { name:"xxx", price: 88, rating: 4.9 }])

// 查看某个集合的文档
db.tours.find() 
```





### 查询

```js
// 查询name是xxx的文档
db.tours.find({ name: "xxx" })

// 查询价格小于500的, 且评分高于4.8的
db.tours.find({ price: {$lte: 500}, rating: {$gte: 4.8} })

// 查询价格小于500的, 或评分高于4.8的
db.tours.find({ $or: [ {price: {$lte: 500}}, {rating: {$gte: 4.8}} ]})
```





### 更新

```js
// 对name为xxx的文档，price改为597 
db.tours.updateOne({ name: 'xxx'}, { $set: {price: 597} })

// 对name为xxx的文档，新增属性yyy
db.tours.updateMany({ name: 'xxx'}, { $set: {yyy: 'yyy'} })
```





### 删除

```js
// 删除第一个name为xxx的文档
db.tours.deleteOne({ name: 'xxx' })

// 删除所有name为xxx的文档
db.tours.deleteMany({ name: 'xxx' })

// 删除所有文档
db.tours.deleteMany ({})
```





### mongoose

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250519162852263.png" alt="image-20250519162852263" style="zoom:70%;" />

- **【MongoDB的二次封装】**
- mongoose是mongodb对象建模工具，**它在原生mongodb驱动之上构建了一个抽象层**，为开发者提供了更高级、更便捷的数据操作方式
- 特点
  - **强制schema：定义数据结构和校验规则**
  - 中间件
  - 数据校验
  - **面向对象：将集合collection映射为model类**


```js
const mongoose = require('mongoose')
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('db connection successful'))
```



2、创建schema和model和document

- schema模式，用来定义数据结构，规定文档的字段和类型【类比 typescript 类型定义】
- model模型，通过schema生成model【类比 class类】
- document文档，由model创建的单条数据，对应数据库中的一条记录【类似new出来的实例对象】

```js
// 创建schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a tour must have a name'],
    unique: true   // name值不可以重复
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: Number
})

// 创建model
const Tour = mongoose.model('Tour', tourSchema) 

// 创建document
const testTour = new Tour({
  name: 'xxx',
  rating: 4.7,
  price: 497
})

// 将上述document保存至数据库
testTour.save().then(doc => {
  console.log(doc)
}).catch(err => {
  console.error(err)
})
```





#### schema中ref

- 作用是告诉MongoDB这个字段关联到哪个集合（表），**相当于关系型数据库中的外键**
- 关联查询，通过`.populate()`自动填充关联的完整用户数据
  - 使用populate()时，mongoose会执行额外的查询，会对性能有影响
- 数据一致性校验，存储的ObjectId必须存在于User集合中

```js
// User模型
const userSchema = new mongoose.Schema({ name: String })
const User = mongoose.model('User', userSchema)

// Post模型
const postSchema = new mongoose.Schema({
  content: String,
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }   // 关联到User Model
})
const Post = mongoose.model('Post', postSchema)

// 创建一个用户
const user = new User({ name: '张三' })
// 创建帖子时关联用户id
const post = new Post({ content: 'hello', user: user._id })

// 查询post
Post.find().populate('user')
// [{ content: 'hello', user: { name: '张三', _id: '...' } }]
```

```js
// 利用mongoose中间件
postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  })
})
```







- Mvc架构

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250510092245261.png" alt="image-20250510092245261" style="zoom:40%;" />

- 应用逻辑（controllers） + 业务逻辑 (model)

![image-20250510092715070](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250510092715070.png)





3、实践

#### post

```js
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
      staus: 'success',
      data: {
        tour: newTour
      }
    })
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    })
  }
}
```



#### get

```js
// 获取tours
exports.getAllTours = async (req, res) => {
  const tours = await Tour.find()
  ... 
}

// 根据id获取对应tour
exports.getTour = async (req, res) => {
  const tour = await Tour.findById(req.params.id)
}
```

##### 1、过滤

```js
// 通过query添加过滤条件    
exports.getAllTours = async (req, res) => {
  const queryObj = {...req.query}
  // ?price=398&rating=4.9 对应的req.query是  {price: 398, rating: 4.9}
  
  // 排除某些字段
  const excludeFields = ['page', 'sort', 'limit', 'fields']
  excludeFields.forEach(item => delete queryObj[item])
  
  // 处理gte/gt/lte/lt
  let queryStr = JSON.stringify(queryObj)
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
 
  // Tour.find()返回值是Query实例
  const query = Tour.find(JSON.parse(queryStr))
  ...
  const tours = await query
}
```

- Model.find()返回的是Query实例，这是mongoose一个非常强大的设计，它支持链式调用
  - Model.find() 查询不会立即执行，只有调用.then()时才真正执行
  - 可以连续调用多个方法构建复杂查询



##### 2、排序

```js
if(req.query.sort) {
  const sortBy = req.query.sort.split(',').join(' ')
  query = query.sort(sortBy)
}
```



##### 3、字段限制

```js
if(req.query.fields) {
  const fields = req.query.fields.split(',').join(' ')
  query = query.select(fields)
}
```



##### 4、分页

```js
const page = +req.query.page || 1   // 当前页数
const limit = +req.query.limit || 100   // 每页数量
const skip = (page - 1) * limit

query = query.skip(skip).limit(limit)  // skip代表跳过前多少个

if(req.query.page){
  const numTours = await Tour.countDocuments()  // 获取集合的总文档数
  if(skip >= numTours) throw new Error('this page do not exist')
}
```





#### patch

```js
exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
}

// new设为true, 决定了函数返回的内容是 更新前的旧文档 还是 更新后的新文档
// runValidators设为true，表示在更新数据时也需要复合schema模式
```



#### delete

```js
exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id )
}
```





#### 数据聚合

- 聚合管道是mongodb强大的数据分析工具，允许对数据进行多阶段的转换和处理

```js
db.collection.aggregate([管道阶段1， 管道阶段2，...])
```

```js
exports.getTourStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: null,  // 值为null不会对数据进行分组
        _id: '$rating', // 会按rating不同值对数据进行分组，进行以下计算
        
        numTours: { $sum: 1 },  // 对tour计数
        numRating: { $sum: '$ratingQuantity '},  // 对ratingQuantity字段求和
        avgRating: { $avg: '$ratingAverage' },   // 求ratingAverage字段的平均值
        minPrice: { $min: '$price' },  // 求price字段的最小、最大值
        maxPrice: { $max: '$price' }
      }
    }，
    {
    	$sort: { avgRating: 1 }  // 根据avgRating来进行排序,1表示升序
    }
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
}
```



$unwind: 

- 用于解构数组字段，将数组中的每个元素拆分为独立的文档

```js
{
	$unwind: {
    path: <arrayField>,   // 要解构的数组字段路径
  }
}

// 举个例子
	// 数据
[
  {_id: 1, product: 'A', tags: ['red', 'blue', 'green']},
  {_id: 2, product: 'B', tags: []},
  {_id: 3, product: 'C'},
]
db.products.aggregate([{ $unwind: '$tags' }])
	// 结果
{_id: 1, product: 'A', tags: 'red'}
{_id: 1, product: 'A', tags: 'blue'}
{_id: 1, product: 'A', tags: 'green'}
```





#### 虚拟属性

- **虚拟属性允许在不实际存储到数据库的情况下，定义文档的‘计算属性’或‘派生属性’，它是由文档其它字段计算得出**
- 注意：数据查询时是不能利用虚拟属性的，因为它不存在于数据库中 

```js
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})
```





#### 中间件

- 有四种中间件：文档、查询、聚合、模型
- 在schema注册方法

1、文档中间件

```js
	// 举例：在save()/create()之前执行某些逻辑
tourSchema.pre('save', function(next) {			// next函数可以用来执行下一个中间件
  console.log(this)    // this指向当前文档
  next()
})
tourSchema.post('save', function(doc, next) => {
	console.log(doc)   // doc是当前文档
	next()
})
```

2、查询中间件，允许在执行某个查询之前/之后运行函数

```js
// query middleware 举例：在所有find相关操作之前过滤掉私密tour
tourSchema.pre(/^find/, function(next) {
  console.log(this)  // this指向当前query
  this.start = Date.now()
  this.find({ secretTour: { $ne: true } })  
  next()
})

// 举例：记录查询操作所耗时长
tourSchema.post(/^find/, functon(docs, next) => {
  console.log(Date.now() - this.start)
  console.log(docs)
  next()
})
```

3、聚合中间件

```js
tourSchema.pre('aggregate', function(next) {
  // 举例：聚合前将私密tour过滤掉
  this.pipeline().unshift({ $match: {secretTour: {$ne: true}} })
  console.log(this)  // this指向聚合对象  this.pipeline()
  next()
})
```





#### 数据验证

- create() 和 save() 操作会触发所有模式级别的验证器，包括自定义验证器
- **更新操作 updateOne() 等默认不会运行验证器**

```js
// 在更新操作中显式启用验证
Model.updateOne({...}, {...}, { runValidators: true })

// 在模式级别全局启用更新验证
const schema = new mongoose.Schema({
}, {
  validateBeforeSave: true,  //默认就是true
  validateBeforeUpdate: true  
})

// 使用中间件
schema.pre(['updateOne'], fn)
```



- 对于自定义验证器
  - 新建时，函数中的this指向新建的文档
  - 更新时，this不指向被更新的文档，需要额外处理（可以利用中间件）



1、内置验证器

```js
// String
name: {
  type: String,
  required: [true, 'A tour must have a name'],
  maxLength: [40, '需要不超过40个字符'],
  minLength: [10, '需要不低于10个字符']
}
difficulty: {
  type: String,
  enum: {
    values: ['easy', 'medium', 'difficult'],
    message: 'difficulty is either: easy/medium/difficult'
  }
}

// Number
rating: {
  type: Number,
  default: 4.5,
  min: [1, '评分需不低于1'],
  max: [5, '评分需不超过5'],
}
```

2、自定义验证器

- validate函数，返回true表示验证通过

```js
priceCount: {
  type: Number,
  validate: {
    validator: function(val) {
    	return val < this.price  
  	},
    message: '折扣不得高于价格'
  } 
}
```







# 身份验证

####  schema + model

```js
// userModel.js
const momgoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name']
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  photo: String,
  password: {
    type: Sting,
    required: [true, 'please provide a password'],
    minlength: 8,
    selected: false  // 不会在接口中将该字段返回，避免泄露密码 
  }
  passwordConfirm: {
      type: Sting,
      required: [true, 'please confirm your password'],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // 用户是否注销状态
  active: {
    type: Boolean,
    default: true,
    selected: false
  }
})

// model
const User = mongoose.model('User', userSchema)
```





#### 密码

```js
// 验证密码和再次输入的密码一致
passwordConfirm: {
  type: String,
  required: [true, 'please confirm your password'],
  validate: {
    validator: function(val) {
      return val === this.password
    },
    message: 'passwordConfirm should equal password'
  }
}
```



- 密码不应该以普通格式存储在数据库中，需对密码进行加密
- bcryptjs是一个纯js实现的bcrypt密码哈希库，用于安全地存储用户密码，适合Nodejs应用

```js
const bcrypt = require('bcryptjs')
// 利用文档中间件
userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next()
  
  this.password = await bcrypt.hash(this.password, 12)
  // n 是指bcrypt哈希算法的成本因子，它决定了哈希计算的复杂度和安全性，数值越大(2^n)，计算时间越长，安全性越高, 推荐值12
  
  this.passwordConfirm = undefined  // 去除数据库中passwordConfirm字段
  
  next()
})
```





##### 加盐算法

- **在密码哈希过程中添加随机数据的技术，目的是使相同的密码产生不同的哈希值**
- 目的：防止彩虹表攻击；避免相同代码相同哈希；增加破解难度

```js
// 1、系统生成随机盐值 2、将盐值+用户密码组合 3、对组合字符串进行哈希 3、存储盐值+哈希结果
const salt = generateRandomSalt()
const hashedPassword = hash(salt + '用户密码')
```

- 在登录时，从数据库取出该用户的盐值，将盐值+用户输入的密码组合，哈希后与存储的哈希结果比对





#### Json Web Token

##### 1、token使用流程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250513183702860.png" alt="image-20250513183702860" style="zoom:40%;" />

方案一

1、用户输入账号密码，如果账号密码有效，后端会生成token，将token发送到前端

2、前端会将token存储到cookie，【避免将敏感token存储在localStorage中】

3、每次发送请求会将token携带上，后端检验token有效则返回数据

```js
// 前端登录获得token
const handleLogin = async () => {
  const res = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })
  const { token } = await res.json()
  document.cookie = `authToken=${token}; Secure; HttpOnly; SameSite=Strict`
}

// 每次请求携带token
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
```



方案二【推荐】

- secure属性：使用https
- Httponly属性：阻止javascript访问，仅限http传输【浏览器会自动在请求中包含，脚本无法触及】

```js
// 服务端以cookie返回token
res.cookie('jwt', token, {
  expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
  secure: true,
  httpOnly: true
})
// 前端会自动在每次请求中携带http-only cookie,无需手动处理
fetch('/api/protected', {
  method: 'GET',
  credentials: 'include'
})
```





##### 2、token组成

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250513185057094.png" alt="image-20250513185057094" style="zoom:40%;" />

- 标头 header
- 负载 payload
- 签名 signature
  - 利用header + payload + secret 生成

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250513185944837.png" alt="image-20250513185944837" style="zoom:50%;" />

```js
const header = {
  alg: 'HS256',
  typ: 'JWT'
}
const payload = {
  userId: '123',
  username: 'example',
  exp: Math.floor(Date.now()/1000)+(60*60) // 1小时后过期
}
const secret = 'secret-key'
const token = base64(header) + '.' + base64(payload) + '.' + signature
```





##### 3、token验证

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250514113850125.png" alt="image-20250514113850125" style="zoom:50%;" />

- 前端请求携带的token，会被后端解析，解析出header、payload、签名

- 利用解析出的header、payload、结合服务端存储的secret生成签名

- 将生成的签名与解析出的签名做比较，如果一样则token验证通过，否则验证不通过

 



#### 注册

```js
const jwt = require('jsonwebtoken')
// authController.js
	// 注册后自动登录
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })
  
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})

router.post('/signup', authController.signup)
```





#### 登录

```js
// 在model中判断密码是否正确
	// 在每个document上添加方法
userSchema.methods.correctPassword = asycn function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  
  // check email and password exist
  if(!email || !password) {
    return next(new AppError('please provide email and password', 400))
  }
  
  // check email exist, password right
  const user = await User.find({ email }).select('+password')
  if(!user || (!await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401))
  }
  
  // sign token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  res.status(200).json({
    status: 'success',
    token
  })
})
```





#### 保护路由(验证token)

```js
// 利用路由中间件
router.route('/').get(authController.protect, tourController.getAllTours)

// authController.js
const { promisify } = require('util')
exports.protect = catchAsync(async function(req, res, next) {
  // get token
  let token = ''
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.header.authorization.split(' ')[1]
  }
  if(!token) return next(new AppError('please log in to get access' 401))
  
  // verify token 
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  console.log(decoded)  
  	// token的payload数据 {id: 'xxx', iat: 1712345678, exp: 1712945678}  【iat是token签发时间, exp是过期时间】
  
  // again check user exist 用户被注销后token变无效
  const currentUser = await User.findById(decoded.id)
  if(!currentUser) return next(new AppError('the user not exist'))
  
  // check password not change 用户更改密码后token变无效
  if(currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('user changed password', 401))
  }
  
  req.user = currentUser   // 将user放到req上
  next() 
}) 

// 比较密码更改时间和token签发时间, 判断发了token后是否改密码
userSchema.methods.changePasswordAfter = function(JWTtimestamp) {
  if(this.passwordChangedAt) {
    return this.passwordChangedAt > JWTtimestamp
  }
  return false
}
```







#### 授权

- 仅有某些角色可以删除资源

```js
router.route('/:id').delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)
```

```js
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new AppError('you do not have permission', 403))
    }
    
    next()
  }
}
```





#### 忘记密码

- crypto是Node.js内置的加密模块，提供了各种加密功能

```js
// 为每个文档添加 创建重置密码token 方法
const crypto = require('crypto')
UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')    // 生成resetToken
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')   // 对其加密，存数据库
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000
  return resetToken
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// get user base on a email
  const user = await User.findOne({ email: req.body.email })
  if(!user) return next(new AppError('no user base on the email', 404))
  
  // 生成resetToken
  const resetToken = user.createPasswordResetToken()
  await user.save()
  		// save方法会将内存中的对象状态持久化到数据库，mongodb出于性能考虑，避免每次属性修改都触发数据库操作
  
  // send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassord/${resetToken}`
  const message = `please submit a patch request with new password and passwordConfirm to ${resetURL}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'password reset token (10 mins valid)',
      message
    })
  } catch(err)  {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    return next(new AppError('sending email error', 500))
  }
  
  res.status(200).json({
    status: 'success',
    message: 'token sent to email'
  })
})

router.post('/forgotPassword', authController.forgotPassword)
```



- 发邮件， NodeMailer

```js
const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_pASSWORD,
    }
  })
  
  // define email options
  const mailOptions = {
    from: 'Jonas <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }
  
  // send email
  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
```





#### 重置密码

```js
const crypto = require('crypto')
exports.reset = catchAsync(async (req, res, next) => {
  // get user base on resetToken
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() }})
  if(!user) return next(new AppError('invalid token or token expire')) 
  
  // set password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordChangedAt = Date.now() - 1000
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
  
  // log in, send jwt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  
  res.status(200).json({
    status: 'success',
    token
  })
})

router.patch('/resetPassword/:token', authController.resetPassword)
```





#### 更新密码

```js
exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user
  const user = User.findById(req.user.id).select('+password')
        
 	// check oldpasswod is valid
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
  	return next(new AppError('your old password is wrong'), 401)
  }
        
  // set password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordChangedAt = Date.now() - 1000
  await user.save()
        
  // send jwt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
  
  res.status(200).json({
    status: 'success',
    token
  })
})

router.patch('/updatePassword', authController.updatePassword)
```



 

#### 注销账号

- 实际上将账户设置为非活动状态

```js
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })
  res.status(204).json({
    status: 'success',
    data: null
  })
})

// 利用查询中间件，只返回active为true的
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})
```







# 安全方面

#### Httponly-cookie



#### 速率限制

-  全局中间件，统计某段时间内同一个ip的请求数量，当请求太多时阻止请求
- 超过设置的规定时间内请求次数，返回 429 Too Many Requests
- DDoS攻击：通过大量恶意流量淹没目标系统，使其无法提供正常服务的网络攻击方式

```js
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  max: 100,  // 每个ip最多100个请求
  windowMs: 60 * 60 * 1000,  // 60min
  message: '请求过于频繁，请稍后再试'
})
app.use('/api', limiter)  // 应用到以/api开头的路由

// 响应header会添加上
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
```





#### helmet

- 是一个express中间件集合，通过设置各种http头来增强web应用的安全性

```js
const helmet = require('helmet')

// 使用所有默认的helmet中间件
app.use(helmet())
```





#### 数据清理

- 查询注入攻击
  - 攻击者利用应用程序对用户输入处理不当的漏洞，将恶意代码注入到合法查询的攻击方式
  - 比如NoSQL注入，针对mongodb等非关系型数据库

- NoSQL注入示例

```js
// 正常查询
db.users.find({ usename: req.body.username, password: req.body.password })

// 恶意输入
{
  "username": { "$ne": '' },
  "password": { "$ne": '' },
}

// 实际查询变为
db.users.find({ username: {"$ne": ''}, password: {"$ne": ''}})	//这将匹配所有用户名和密码不为空的文档
```

- 防范**查询注入攻击**

```js
// 防范查询注入攻击，将req.body、res.query、req.params中的 $ 过滤掉 
const mongoSanitize = require('express-mongo-sanitize')

app.use(mongoSanitize())
```

- 防范**XSS攻击**

```js
// 防范恶意html注入，将<、>转为html实体
const xss = require('xss-clean')

app.use(xss())
```





#### 参数污染

- http参数污染，攻击者通过**向http请求注入多个同名参数**，利用不同web技术对参数处理的差异来实现恶意目的

```js
const hpp = require('hpp')
app.use(hpp({
  whitelist: ['duration']   // 设置白名单，允许某些字段重复
}))
```



- 可以严格参数验证，确保参数唯一

```js
function validateParams(req) {
  const idValues = [].concat(req.query.id || [])
  if(idValues.length > 1) {
    throw new Error('duplicate params not allowed')
  }
  return idValues[0]
}
```







# 数据建模

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250516143021776.png" alt="image-20250516143021776" style="zoom:40%;" />

### 数据关联模式

##### 引用式Referenced

- 通过id建立关联，适合一对多、多对多关系

```js
// 用户文档
{
  _id: '123',
  name: 'coder',
  posts: ['post1', 'post2']  // 引用帖子id
}
// 帖子文档
{
  _id: 'post1',
  title: 'xxx',
  content: 'yyy'
}
```

- 引用类型：
  - 子引用：适合一对少，上方例子是子引用，
  - 父引用：适合一对多
  - 双向引用：适合多对多

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250516151154651.png" alt="image-20250516151154651" style="zoom:40%;" />

 



##### 嵌入式Embedded

- 将关联数据直接嵌套在父文档中，适合一对一、一对少关系

```js
{
  _id: '123',
  name: 'john',
  post: {
  	title: 'xxx',
    content: 'yyy'
  }
}
```









### 虚拟填充

****

- 子引用会导致父文档的子引用数组越来越大
- **解决方法：虚拟填充（virtual populate），保存对所有子文档的引用，但是没有真正持久化，不会在数据库中创建真实的引用字段**

- 在查询时动态关联文档 

```js
// 用户模型
const UserSchema = new mongoose.Schema({
  name: String
})
// 博客模型
const PostSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

// 在用户模型中设置虚拟填充
UserSchema.virtual('posts', {
  ref: 'Post',    // 关联的模型
  localField: '_id',   // 本地字段（用户id）
  foreignField: 'author',   // 外键字段
  justOne: false  // 设置为false表示一对多关系
})

// 查询用户并填充其所有文章
const user = await User.findOne({ name: '张三' }).populate('posts')
```





### 嵌套路由

- merge params **允许子路由器访问父路由器的参数**
- 例子：获取所有的评论、获取某旅行的所有评论
  - 对于某旅行，需要在tour路由嵌套review路由

```js
// tourRouter.js
const tourRouter = express.Router()
tourRouter.use('/:tourId/reviews', reviewRouter)    // 路由嵌套

// reviewRouter.js  
const reviewRouter = express.Router({ mergeParams: true })   // 合并参数 mergeParams，以访问到tourId字段
reviewRouter.route('/').get(reviewController.getAllReviews)

// reviewController.js
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}
  if(req.params.tourId) filter = { tour: req.params.tourId }
  const reviews = await Review.find(filter)
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    daat: {
      reviews
    }
  })
})

// app.js
app.use('/api/v1/tours', tourRouter)
```







# websocket

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250604142416260.png" alt="image-20250604142416260" style="zoom:40%;" />

### ajax轮询

- 在特定时间间隔由浏览器发出请求，服务器返回最新的数据
  - HTTP请求一般包含的头部信息比较多，其中有效的数据可能只占很小的一部分，导致带宽浪费
  - **服务器被动接收浏览器的请求然后响应，数据没有更新时仍然要接收并处理请求，服务器有压力**




### websocket

- **基于TCP的应用层协议**
  - websocket的头部信息少，节省带宽
  - websocket支持服务端主动推送消息，支持实时通信
- 与HTTP协议有着良好的兼容性，默认端口也是80（ws）和443（wss）
- websocket开始通信之前，通信双方先进行握手，**握手采用http协议，客户端通过http请求与websocket服务端协商升级协议，协议升级完成之后，后续数据交换遵照websocket协议**





### readyState

```text
0：正在连接中，CONNECTING
1: 已经连接，可以通讯，OPEN
2: 连接正在关闭，CLOSING
3: 连接已关闭，CLOSED
```





### 代码实现

```js
// node
const Server = require('ws').Server
const socket = new Server({ port: 3001 }, () => {
  console.log('创建server')
})
socket.on('connection', ws => {
  console.log('新用户连接')
  ws.on('message', (data) => {
    ws.send(`来自服务端推送的消息${String(data)}`)
  })
})

// vue
const ws = new WebSocket('http://127.0.0.1:3001')
ws.onopen = () => {
  ws.send('msg from client')
  console.log('ws open')  
}
ws.onerror = () => {
  console.log('ws error')
}
ws.onclose = () => {
  console.log('ws close')
}
ws.onmessage = (data) => {
  console.log(data)
}
```





#### 类封装

```js
class Socket {
  ModeCode = {
    MSG: 'message', //普通消息
    HEART_BEAT: 'heart_beat' // 心跳检测消息
  }
  heartBeat = {
    time: 5 * 1000,  //心跳间隔时间
    timeout: 3 * 1000,  //心跳超时时间
    reconnectTime: 10 * 1000  // 断线重连时间
  }
  ws = null
  webSocketState = false  // ws连接状态
  reconnectTimer = null  
  
  constructor(wsUrl) {
    this.wsUrl = wsUrl  
  }
  
  initWebSocket() {
    this.ws = new WebSocket(this.wsUrl)
    
    // 监听open
    this.ws.onopen = () => {
      console.log('ws open')
      this.webSocketState = true
      // 开启心跳检测
      this.heartBeat && this.heartBeat.time ? this.startHeartBeat(this.heartBeat.time) : ''
    }
    
    // 监听服务端消息
    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data)
      switch(data.ModeCode) {
        case this.ModeCode.MSG: 
          console.log('普通消息')
          break
        case this.ModeCode.HEART_BEAT: 
          console.log('心跳检测消息')
          this.webSocketState = true
          break
      }
    }
    
    this.ws.onclose = () => {
      this.webSocketState = false
    }
    
    this.ws.onerror = () => {
      this.webSocketState = false
      this.reconnect()
  	}
  }
    
  // 心跳检测
  startHeartBeat(time) {
    setTimeout(() => {
      this.ws.send(JSON.stringify({
        ModeCode: this.ModeCode.HEART_BEAT,
        msg: Date.now()
      }))
      this.waitingServer()
    }, time)
  }

  // 等待服务端pong
  waitingServer() {
    this.webSocketState = false
    setTimeout(() => {
      if(this.webSocketState) {
        this.startHeartBeat(this.heartBeat.time)
      } else {
        this.ws.close()
        this.reconnect()
      }
    }, this.heartBeat.timeout)
  }

  // 断线重连
  reconnect() {
    this.reconnectTimer = setTimeout(() => {
        this.initWebSocket()
        clearTimeout(this.reconnectTimer)
    }, this.heartBeat.reconnectTime)
  }
}
```





### 心跳机制

- **在一段时间内没有数据交互的连接可能会被自动断开，需要心跳机制维持长链接【保活】**

  定时发送一个数据包，让对方知道自己在线且正常工作，确保通信有效

- 发送方 --> 接收方：ping，Opcode为`0x9`，表示心跳请求

- 接收方 --> 发送方：pong，Opcode为`0xA`，表示心跳响应

```js
const heartbeatInterval = 30 * 1000
function sendHeartbeat() {
  if(ws.redayState === WebSocket.OPEN) {
    ws.send('ping')
  }
}

const heartbeatTimer = setInterval(sendHeartbeat, heartbeatInterval)

ws.onmessage = function(event) {
  if(event.data === 'pong') {
		...
  }
}
  
ws.onclose = function() {
	clearInterval(heartbeatTimer)
}
```







### 淘宝登录采用短轮询

- 短轮询是一种兼容性好的通信方式；**websocket的兼容性存在一些限制**，老旧浏览器无法支持

- 扫码登录场景不需要**实时性**非常高的数据更新，使用短轮询即可满足需求

- websocket长连接会占用服务器资源，并且在高并发情况下导致服务器压力增大

  **短轮询可以根据实际需求灵活控制数据请求的频率，可以更好地控制服务器端压力（二维码一定时间会失效，短轮询停止）**

  - websocket建立了一个持久的双向通信连接
  - websocket的长连接可能会导致服务器同时维护大量的连接数









# 了解

### redis

是一个**基于内存的键值存储数据库**，同时支持持久化，并提供多种数据结构（如字符串、哈希、列表、集合等）

被广泛应用于缓存、消息队列、实时计算、排行榜等场景，因其高性能、低延迟而备受青睐

数据主要存储在内存中，读写速度超快（10万+QPS）



### QPS

Queries per second **每秒查询数**是衡量系统（如数据库）每秒能处理的请求数量的性能指标

例如：redis的qps是10万，表示每秒可处理10万次读写操作，评估系统的吞吐量和并发处理能力

通过QPS推算服务器负载，觉得是否需要扩容，所需服务器数量 = 总QPS / 单机 QPS

目标QPS为50万，单机Redis QPS为10万 --》 至少需要5台Redis实例





### nginx

- 在生产环境中，nodejs通常需要与nginx这样的web服务器配合使用

```js
客户端 --》 Nginx（负载均衡、SSL、静态文件） --》 多个Node.js实例
```

- nginx可以将流量分发到多个nodejs实例，提高应用程序的并发处理能力
- nginx可以高效地提供静态文件，减少nodejs进程的负担
- nginx反向代理，隐藏nodejs服务器的细节

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250522152550165.png" alt="image-20250522152550165" style="zoom:70%;" />

- 正向代理

![image-20250522152526438](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250522152526438.png)



master主进程 ，接受各个客户端发来的请求，将其分配给子进程

 work子进程 



























