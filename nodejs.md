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





#### process.exit()

- 强制终止nodejs进程
- 不会等待未完成的异步操作







# MongoDB

- **【是非关系型数据库，属于文档型】**
- 关系型数据库像Excel表格一样组织数据，有严格的行列结构
  - 适合处理结构化数据
- 非关系型数据库像JSON格式存储数据，结构灵活
  - 适合非结构化数据

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250509165242645.png" alt="image-20250509165242645" style="zoom:40%;" />



#### 常见命令

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





#### 查询

```js
// 查询name是xxx的文档
db.tours.find({ name: "xxx" })

// 查询价格小于500的, 且评分高于4.8的
db.tours.find({ price: {$lte: 500}, rating: {$gte: 4.8} })

// 查询价格小于500的, 或评分高于4.8的
db.tours.find({ $or: [ {price: {$lte: 500}}, {rating: {$gte: 4.8}} ]})
```





#### 更新

```js
// 对name为xxx的文档，price改为597 
db.tours.updateOne({ name: 'xxx'}, { $set: {price: 597} })

// 对name为xxx的文档，新增属性yyy
db.tours.updateMany({ name: 'xxx'}, { $set: {yyy: 'yyy'} })
```





#### 删除

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
    unique: true
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
```



#### delete

```js
exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id )
}
```





### 数据聚合

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







