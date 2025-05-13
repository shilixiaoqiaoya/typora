# 基础知识

#### 同步读写文件

```js
const fs = require('fs')
// 读
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn)

const textOut = `${textIn}\nCreated on ${Date.now()}`
// 写 
fs.writeFileSync('./txt/output.txt', textOut)
```



#### 异步读写文件

```js
fs.readFile('.txt/start.txt', 'utf-8', (err, data) => {
  console.log(data)
})

fs.writeFile('./txt/final.txt', '这是被写入的文本', 'utf-8', err => {
  console.log('文本已被写入')
})
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
- 默认有4个线程，可以处理以下几种异步IO操作
  - 文件系统操作（fs模块）
  - 加密操作（crypto模块）
  - 压缩/解压操作（zlib模块）
  - dns操作（dns模块）
- 线程数是可配置的，通过环境变量调整

```js
process.env.UV_THREADPOOL_SIZE = 1
```









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
```



2、路由中间件

```js
// tourRoute.js
const router = express.Router()

router.route('/').get( ).post(createTour)
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

```js
app.use(express.static(`${__dirname}/public`))
```





#### 环境变量

1、process.env

- 是nodejs中的一个全局对象，包含了所有在进程启动时设置的环境变量
- 本质是nodejs对操作系统环境变量的javascript封装
- **【敏感信息不要直接写在代码中，应通过环境变量传递】**
- 利用dotenv将自定义环境变量与process.env结合起来

```js
// server.js
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

// config.env
NODE_ENV=development
USER=jonas
PASSWORD=123456
```





2、NODE_ENV 

是一个由开发者定义的环境变量，用于标识运行环境，一般设为development、production、test、staging(预发布环境)

- ① 可以通过命令行临时设置，操作后可以在process.env上获取NODE_ENV

```js
NODE_ENV=production node app.js
```

- ② 在package.json中设置

```js
{
  scripts: {
    start:dev: 'NODE_ENV=development nodemon app.js',
    start:prod: 'NODE_ENV=production node app.js'
  }
}
```

- ③ 放在单独配置文件中 config.env文件

- 代码中访问

```js
if(process.env.NODE_ENV === 'production') {
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





#### process.argv

- 是一个数组，包含了启动脚本进程时传入的命令行参数

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















# MongoDB

- **【是非关系型数据库，属于文档型】**
- 关系型数据库像Excel表格一样组织数据，有严格的行列结构
  - 适合处理结构化数据
- 非关系型数据库像JSON格式存储数据，结构灵活
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

- mongoose是mongodb对象建模工具，它在原生mongodb驱动之上构建了一个抽象层，为开发者提供了更高级、更便捷的数据操作方式

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
  const numTours = await Tour.countDocuments()
  if(skip >= numTours) throw new Error('this page do not exist')
}
```





#### patch

```js
exports.updateTour = async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
}

//  runValidators设为true，表示在更新数据时也需要复合schema模式
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
    minlength: 8
  }
  passwordConfirm: {
      type: Sting,
      required: [true, 'please confirm your password'],
  }
})

// model
const User = mongoose.model('User', userSchema)
```



#### authController

```js
// authController.js
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  })
})

router.post('/signup', authController.signup)
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

1、用户输入账号密码，如果账号密码有效，后端会生成token，将token发送到前端

2、前端会将token存储到cookie或localstorage中

3、每次发送请求会将token携带上，后端检验token有效则返回数据



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

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250513190314999.png" alt="image-20250513190314999" style="zoom:50%;" />  



 









































