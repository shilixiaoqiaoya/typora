# 十六进制应用

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251016145726772.png" alt="image-20251016145726772" style="zoom:40%;" />





#  字符集

### unicode

- 一个**国际标准**，旨在为世界上所有语言的字符提供统一编码方案
- 字符集大小，目前10万加
- 覆盖范围：包含世界上所有语言的字符、表情符号等
- 编码方式
  - **utf-8：使用1-4字节表示一个字符，完全兼容ascii（1字节）**
  - Utf-16：2/4 字节表示一个字符
  - Utf-32:  4 字节表示一个字符
- eg： s 对应数字115(十进制)

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251016170252774.png" alt="image-20251016170252774" style="zoom:33%;" />





### ASCII

- 字符集大小，共128个字符
- 覆盖范围：**（英语）**主要包含英文字母、数字、标点符号等
- **是unicode字符集的子集**
- **每个字符占据1字节（8位**
- eg： s 对应数字115

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251016161311863.png" alt="image-20251016161311863" style="zoom:43%;" />



### 字符编/解码

- 编码：将文本、图片、视频转为计算机可以处理的形式：二进制

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251016162038630.png" alt="image-20251016162038630" style="zoom:30%;" />

- 解码：将二进制转为文本、图片、视频
  - 图像解码器：正确显示图片，会识别某位置像素应显示的颜色
  - pdf解码器

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251016162104726.png" alt="image-20251016162104726" style="zoom:33%;" />



 





# Buffer缓冲区 

### 基本概念

- **一块内存空间，用于按字节存放二进制数据。默认用0填满这块内存空间**
- 垃圾回收：在不用时会释放所占用内存

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728104644463.png" alt="image-20250728104644463" style="zoom:50%;" />

```js
const { Buffer } = require('buffer')
const memoryContainer = Buffer.alloc(4)
memoryContainer[0] = 0xf4
memoryContainer[1] = 0x34
memoryContainer[2] = 0xb6
memoryContainer[3] = 0xff

console.log(memoryContainer)
// <Buffer f4 34 b6 ff>
console.log(memoryContainer[0], memoryContainer[1], memoryContainer[2], memoryContainer[3])
// 244 52 182 255（十进制）
```

```js
// 由数组创建
const buf = Buffer.from([65, 66, 67, 68])  // 本质是使用Buffer.allocUnsafe()方法
console.log(buf)
// <Buffer 41 42 43 44>
console.log(buf.toString())
// ABCD
```



### 文件操作

```js
const fs = require('fs')
const fileBuffer = fs.readFileSync('input.txt')
fs.writeFileSync('output.txt', fileBuffer)
```



### 图像处理

```js
const imageBuffer = fs.readFileSync('test.jpg')
if(imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff) {
	console.log('这是jpg图片')
}

// 可以对图片数据做处理...
```







# File

### 基本概念

- 电脑上所有东西都是文件，本质是一串二进制数据

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728152206100.png" alt="image-20250728152206100" style="zoom:40%;" />



- 不同的文件需要使用不同的解码器打开
  - 文本文件：字符解码，node内置文本解码器
  - 图片文件：图像解码

- 比如一个应用程序，双击**「Unix可执行文件」**即可运行，**可执行文件是特定于操作系统和cpu类型的**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728153654760.png" alt="image-20250728153654760" style="zoom:40%;" />



- node打开一个文件时，是通过**系统调用机制**实现的，node通过系统调用与操作系统交互，操作系统访问硬件并执行具体操作
  - 是libuv调用操作系统提供的系统调用函数open()，操作系统控制硬件


<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728154700004.png" alt="image-20250728154700004" style="zoom:40%;" />

- 文件描述符（fd）
  - 继承自EventEmitter
  - **用来标识一个打开的文件，是操作系统内核用来跟踪打开文件的索引**
  - 每个进程都有自己独立的文件描述符表；操作系统会限制每个进程可以打开的文件描述符数量
  - 应用
    - **文件操作：通过文件描述符进行读写操作**
    - 网络通信：socket通过文件描述符管理

```js
const fd = fs.openSync('test.txt', 'r')
console.log('文件描述符', fd)
```

- 打开一个文件时，发生了什么？
  - 执行系统调用open()时，在内存中会给文件分配一个数字，也就是文件描述符
    - 在执行完后，**需要执行关闭操作**，避免内存泄漏
  - 执行系统调用read()时，会从磁盘读取数据进入内存



- 三种代码编写方式：**promises API**、callback API、synchronous API
  - 回调方式比promise方式代码运行速度要快


```js
const fs = require('fs/promises')
(async () => {
	try {
    await fs.copyFile('file.txt', 'copied-promise.txt')
  } catch(err) {
    console.error(err)
  }
})()

const fs = require('fs')
fs.copyFile('file.txt', 'copied-callback.txt', err => {
  if(err) console.error(err)
})

fs.copyFileSync('file.txt', 'copied-sync.txt')
```







### 实践

- `.js`文件监听`.txt` 文件的变化，`.txt` 文件内容是一些命令，比如创建文件、修改文件、删除文件
- `.js`文件执行相应逻辑：创建文件、修改文件、删除文件

```js
const fs = require('fs/promises')

(async () => {
  // 创建文件
  const CREATE_FILE = 'create a file'
  async function createFile(path) {
    let fileHandle
    try {
      fileHandle = await fs.open(path, 'r')  // 未报错说明文件已存在
      return console.log('the file already exists')
    } catch(err) {
      fileHandle = await fs.open(path, 'w')  // 报错则创建文件
    }
    fileHandle.close()
  }
  
  // 删除文件
  const DELETE_FILE = 'delete the file'
  async function deleteFile(path) {
     try {
       await fs.unlink(path)
     } catch(err) {
       console.error(err)
     }
  }
  
  // 重命名文件
  const RENAME_FILE = 'rename the file'
  async function renameFile(oldPath, newPath) {
    try {
      await fs.rename(oldPath, newPath)
    } catch(err) {
      console.error(err)
    }
  }
  
  // 向文件添加内容
  const ADD_TO_FILE = 'add to the file'
  async function addToFile(path, content) {
    try {
      const fileHandle = await fs.open(path, 'a')
      fileHandle.write(content)
      fileHandle.close()
    } catch(err) {
      console.error(err)
    }
  }
  
  
  // 打开.txt文件
  const fd = await fs.open('./command.txt', 'r')
  
  fd.on('change', async () => {
    // 获取文件大小
    const fileSize = (await fd.stat()).size
    // 分配大小适合的缓存区,避免内存浪费
    const buff = Buffer.alloc(fileSize)
    // 将文件内容放入缓冲区
    await fd.read(buff, 0, fileSize, 0)
    // 对二进制数据解码
    const command = buff.toString()
    
    // 创建文件
    if(command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1)
      createFile(filePath)
    }
    
    // 删除文件
    if(command.includes(DELETE_FILE)) {
       const filePath = command.substring(DELETE_FILE.length + 1)
       deleteFile(filePath)
    }
    
    // 重命名文件
    if(command.includes(RENAME_FILE)) {
       const _idx = command.indexOf(' to ')
       const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx)
       const newFilePath = command.substring(_idx + 4)
       renameFile(oldFilePath, newFilePath)
    }
    
    // 向文件添加内容
    if(command.includes(ADD_TO_FILE)) {
       const _idx = command.indexOf(' this content: ')
       const filePath = command.substring(ADD_TO_FILE.length + 1, _idx)
       const content = command.substring(_idx + 15 )
       addToFile(filePath, content)
    }
    
  })
  
  // fs.watch监听文件(文件内容变更change、文件名修改rename)
  const watcher = fs.watch('./command.txt')
  	// watcher 是一个async iterator ？？？
  for await (const event of watcher) {
    if(event.eventType === 'change') {
      fd.emit('change')
    }
  }
})()
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728175716321.png" alt="image-20250728175716321" style="zoom:40%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728181142597.png" alt="image-20250728181142597" style="zoom:40%;" />









# Stream

### 示例

- 向一个`.txt`文件写入字符十万次，
  - 打开文件利用`fs.open()`的promise和回调两种方式，实测发现：回调api执行要比promise api执行快

```js
// 均使用promise api
	// 执行时长8s; cpu: 100%(one core); memory: 50mb
(async () => {
  console.time('writeMany')
  const fileHandle = await fs.open('test.txt', 'w')
  for(let i=0; i<1000000; i++) {
    await fileHandle.write(` ${i} `)
  }
  console.timeEnd('writeMany')
})()


// open回调api + writeSync
	// 执行时长1.2s; cpu: 100%(one core); memory: 50mb
console.time('writeMany')
fs.open('test.txt', 'w', (err, fd) => {
  for(let i=0; i<1000000; i++) {
    fs.writeSync(fd, ` ${i} `)
  }
  console.timeEnd('writeMany')
})


// open和write都使用回调api
	// 执行时长750ms; 非常占用cpu和memory
console.time('writeMany')
fs.open('test.txt', 'w', (err, fd) => {
  for(let i=0; i<1000000; i++) {
    fs.write(fd, ` ${i} `, () => {})   // write操作向事件循环推入大量的回调，内存会爆满
  }
  console.timeEnd('writeMany')
})
	// 本质上，node会为每项创建缓冲区
  for(let i=0; i<1000000; i++) {
    const buff = Buffer.from( ` ${i} `, 'utf-8')
    fs.write(fd, buff, () => {})
  }
```



- 借助流stream
  - 执行速度更快
  - 内存占用高，所以不推荐这种流的处理方式
  - TODO: 如何既执行速度快又内存高效呢？

```js
// 执行时长150ms，占用内存: 150mb
(async () => {
  console.time('writeMany')
  const fileHandle = await fs.open('test.txt', 'w')
  const stream = fileHandle.createWriteStream()
  for(let i=0; i<1000000; i++) {
    const buff = Buffer.from(` ${i} `, 'utf-8')
    stream.write(buff)
  }
  console.timeEnd('writeMany')
})()
```





### 使用场景

- **数据加密**，二进制数据的映射

![image-20250729172529179](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729172529179.png)

- **数据压缩**，二进制数据的映射

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729164711906.png" alt="image-20250729164711906" style="zoom:33%;" />

- 其它：**网络通信，文件操作，不同进程间数据传输**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729162643159.png" alt="image-20250729162643159" style="zoom: 33%;" />

### 可写流

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729180708551.png" alt="image-20250729180708551" style="zoom:40%;" />

- 内部有buffer缓冲区，默认大小：64KB 
- write()方法
  - 将数据持续推入到内部缓冲区，直达缓冲区全部填满，会将这些数据一次性取出并处理
  - 上图：向流中写入8次数据，向底层资源只写入1次
  - 示例中不借助流，需要向底层资源写入一百万次，使用流将显著减少向底层资源写入的次数
  - 假设最后一个数据块是3000字节，2177字节会被推入缓冲区，剩下字节会在内存中，当缓冲区清空时，剩下字节会被推入缓冲区
  - 示例中为什么会出现内存暴涨的情况呢？
    - 持续向内部缓冲区写入，而不让它清空，所有数据都会被堆在内存中
    - 解决：等待内部缓冲区清空，再继续安全地向内部缓冲区推送数据


```js
const writableStream = fs.createWriteStream('test.txt')

// 获取流的缓冲区大小
console.log(writableStream.writableHighWaterMark)   // 64KB

// 获取流的缓冲区已使用大小
console.log(writableStream.writableLength)  // 0

const buff = Buffer.from('string')
// write()方法，当写入缓冲区成功时返回true，否则返回false
writableStream.write(buff)
console.log(writableStream.writableLength)  // 6
```



- 解决示例中的内存暴涨问题：promise结合stream,  监听streamWrite的drain事件
  - streamWrite.on('drain', () => {})
    - 可写流的缓冲区被清空时触发
    - 用于背压(backpressure)控制，防止内存溢出
    - 当缓冲区满时，streamWrite.write()返回false

```js
// 执行时长150ms，memory: 50mb
(async () => {
  const fileHandle = await fs.open('test.txt', 'w')
  const stream = fileHandle.createWriteStream()
	let i = 0
  const writeMany = () => {
    while(i < 1000000) {
      const buff = Buffer.from(` ${i} `, 'utf-8')
      if(i === 999999) {
        return stream.end(buff)
      }
      i++
      if(!stream.write(buff)) break
    }
  }
  writeMany()
  stream.on('drain', () => {
    writeMany()
  })
  stream.on('finish', () => {
    fileHandle.close()
  })
})()
```



- StreamWrite.end('最后的数据')：会触发finish事件
  - 在end()后执行write()会报错
- streamWrite.on('finish', () => {}) ：所有数据都已写入到底层目标，可写流不再接收新数据，缓冲区已清空



- 通过fs模块直接创建流【适用于大多常规需求】
  - 通过filehandle创建流，需要注意要关闭filehandle，否则可能导致内存泄漏

```js
const fs = require('fs')
fs.createWriteStream('./test.txt')  
```





### 可读流

- 可读流会维护一个缓冲区，用于临时存储从底层资源（如文件、网络）读取的数据
- 内部缓冲区大小待确定，查官方文档
- cat命令是通过可读流的方式打开文件的，所以打开大文件不会导致崩溃

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729181100564.png" alt="image-20250729181100564" style="zoom:40%;" />

- push()方法
  - 将数据推入流的内部缓冲区
- data事件
  - 当内部缓冲区被填满会触发，此时内部缓冲区所有数据以chunk的形式在回调中

- 实现文件复制
  - 磁盘读取速度远大于写入速度，需要避免背压


```js
(async () => {
  const fileHandleRead = await fs.open('src.txt', 'r')
  const fileHandleWrite = await fs.open('dest.txt', 'w')
  
  const streamRead = fileHandleRead.createReadStream()
  const streamWrite = fileHandleWrite.createWriteStream()
  
  console.log(streamRead.readableFlowing)  // null 
  
  streamRead.on('data', (chunk) => {
    console.log(streamRead.readableFlowing)  // true 数据流动
    
    // chunk为可读流缓冲区的数据
    if(!streamWrite.write(chunk)) {
      streamRead.pause()
    }
  })
  
  streamWrite.on('drain', () => {
    streamRead.resume()
  })
})()
```

- 通过下面方法来控制可读流的数据流速度
  - streamRead.pause()：暂停向可读流的缓冲区push数据
  - streamRead.resume()：恢复向可读流的缓冲区push数据
  - streamRead.on('data', () => {})：监听数据到达事件
    - data事件的触发不依赖缓冲区是否填满，当数据达到缓冲区时立即触发




- chunk限制为64KB，导致有的数字不完整，如何处理chunk中不完整的数据

```js
let split = ''
streamRead.on('data', (chunk) => {
 const numbers = chunk.toString('utf-8').split('  ')
  if(Number(numbers[0]) !== Number(numbers[1])-1) {
    if(split) numbers[0] = split.trim() + numbers[0].trim()
  }
  if(Number(numbers[numbers.length-2])+1 !== Number(numbers[numbers.length-1])) {
    split = numbers.pop()
  }
  console.log(numbers)
})
```

- streamRead.on('end', () => {})
  - 表示源数据已经全部读取完成



- 通过fs模块直接创建流【适用于大多常规需求】

```js
fs.createReadStream('./test.txt')  
```







### 两种方式实现文件复制

- 假设text.txt文件是1GB，要实现文件的复制

  - 使用`fs.readFile()`

  ```js
  // 使用readFile()时，会将整个文件加载进内存
  // memeory usage: 1GB
  // exec time: 1s
  (async () => {
    const destFile = await fs.open('text-copy.txt', 'w')
    const res = await fs.readFile('text.txt')
    await destFile.write(res)
  })()
  ```

  - 使用`filehandle.read()`,  每次读的数据大小是16KB

  ```js
  // memeory usage: 20mb
  // exec time: 1s
  (async () => {
    const destFile = await fs.open('text-copy.txt', 'w')
    const srcFile = await fs.open('text.txt', 'r')
    let bytesRead = -1
    while(bytesRead !== 0) {
      const res = await srcFile.read()
     	bytesRead	= res.bytesRead
      if(bytesRead !== 16384) {
        const indexOfNotFilled = res.buffer.indexOf(0)
        const newBuffer = Buffer.alloc(indexOfNotFilled)
        res.buffer.copy(newBuffer, 0, 0, indexOfNotFilled)
        destFile.write(newBuffer)
      } else {
        destFile.write(res.buffer)
      }
    }
  })()
  ```
  
- ### fs.readFile()和fs.writeFile()

  - 基于系统调用，一次性操作，不是基于流的方式

  



### pipe()

- `readable.pipe(destination)`
- **自动背压控制**
- 支持链式，中间的流需要是既可读又可写的 

```js
(async () => {
  const destFile = await fs.open('text-copy.txt', 'w')
  const srcFile = await fs.open('text.txt', 'r')
  
  const readStream = srcFile.createReadStream()
  const writeStream = destFile.createWriteStream()
  readStream.pipe(writeStream)
})()
```

- `unpipe()`

  - 断开之前通过`pipe()`方法建立的管道连接
  - 如果可读流持续向一个已经关闭的可写流传输数据，可能导致内存泄漏

  ```js
  writeStream.on('close', () => {
    readStream.unpipe(writeStream)
  })
  ```





### pipeline()

- **可以自动处理错误，会捕获所有流的错误【错误处理】**
- **在出错或数据传输完成时自动销毁( destroy )所有流【资源释放】**

```js
const pipeline = require('stream/promises')
pipeline(
  readStream, 
  transformStream1,
  transformStream2, 
  writeStream, 
  (err) => {
  	if(err) {
      console.error('pipeline failed')
    } else {
      console.log('pipeline succeeded')
    }
	}
)
```





双工流

- 有两个内部缓冲区，一个读缓冲区，一个写缓冲区，这两个缓冲区互不干扰

转换流

- 特殊的双工流，只有一个中间缓冲区（具备读写功能），核心是对输入的数据进行转换后再输出









# network

- **全球互联网的数据传输主要依赖海底光缆，光缆是通过光信号传输比特流「漂洋过海」**
- 将电信号（比特流010）转换为不同波长的光信号（如1550nm激光）
- 全球海底光缆网络总长度绕地球30圈，承载99%的国际互联网流量，是**全球互联网的大动脉**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250801112845561.png" alt="image-20250801112845561" style="zoom:60%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250801112934970.png" alt="image-20250801112934970" style="zoom:50%;" />

- 手机开了热点，此时手机就是路由器
- 传输层端口范围
  - 0-65535
  - 0-1023是系统端口，不能用于应用程序 

- ipv6标准，本地回环地址是`::1`







## TCP

### 实现chatApp

- **`net.createServer()`: 创建tcp服务端或ipc服务端**
  - 两台不同电脑上的两个进程通信，通过tcp
  - 同一台电脑的两个进程通信，通过ipc
  - **该方法返回值类型是`net.Server`**

```js
// server.js 
const net = require('net')
const server = net.createServer()
// 保存与服务端建立连接的所有客户端
const clients = []
server.on('connection', socket => {
  clients.push(socket)
   // 注：此处的socket类型也是`net.Socket`
  socket.on('data', (chunk) => {
    clients.forEach((s) => {
      s.write(chunk)
    })
  })
})
server.listen(3000, '127.0.0.1', () => {
  console.log('open server on', server.address())
})
```



- **`net.createConnection()`: 创建tcp客户端或ipc客户端**
  - **该方法返回值类型是`net.Socket`**

 ```js
 // client.js
 const net = require('net')
 	// 终端可以交互
 const readline = require('readline/promises')
 const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
 })
 
 const socket = net.createConnection({ host: '127.0.0.1', port: 3000 }, async () => {
   const msg = await rl.question('Enter a msg > ')
   // socket代表服务端
   socket.write(msg)
 })
 socket.on('data', (chunk) => {
   console.log(chunk.toString('utf-8'))
 })
 ```



- socket

  - 双工流
    - client端
      - 可写流：向服务器发送数据
      - 可读流：接收服务器响应

  - server端
    - 可读流：接收客户端数据
      - 可写流：向客户端发送响应



- **当多个客户端连接到同一服务端时，每次触发connection事件时，不同的客户端对应有不同socket**

```js
// server.js
server.on('connection', socket => {
  socket.on('data', (chunk) => {
    console.log(chunk.toString('utf-8'))
  })
})
```



- 优化终端样式

```js
// client.js
	// 清空某行，传0清空一行
const clearLine = (dir) => {
  return new Promise((resolve) => {
    process.stdout.clearLine(dir, () => {
      resolve()
    })
  })
}
	// 移动光标
const moveCursor = (dx, dy) => {
  return new Promise((resolve) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve()
    })
  })
}
const socket = net.createConnection({ host: '127.0.0.1', port: 3000 }, async () => {
  const ask = async () => {
    const msg = await rl.question('Enter a msg > ')
    // 输入msg后光标先上移一行，再清空
    await moveCursor(0, -1)
    await clearLine(0)
    socket.write(msg)
  }
  ask()
  
  socket.on('data', async (chunk) => {
    console.log()
    await moveCursor(0, -1)
    await clearLine(0)
    console.log(chunk.toString('utf-8'))
    ask()
  })
})
```



- 为每个客户端分配id

```js
// server.js
server.on('connection', socket => {
  const clientId = clients.length + 1
  socket.write(`id-${clientId}`)
  clients.push({ id: clientId, socket })
   // 注：此处的socket类型也是`net.Socket`
  socket.on('data', (chunk) => {
    clients.forEach(({socket}) => {
      socket.write(`${chunk.toString('utf-8')} from ${clientId}`)
    })
  })
})

// client.js
socket.on('data', async (chunk) => {
  console.log()
  await moveCursor(0, -1)
  await clearLine(0)
  if(chunk.toString('utf-8').startsWith('id')) {
    console.log(`your id id ${chunk.toString('utf-8').substring(3)}`)
  } else {
    console.log(chunk.toString('utf-8'))
  }
  ask()
})
```



- 通知有新用户加入/离开

```js
// server.js
server.on('connection', socket => {
  const clientId = clients.length + 1
  clients.forEach(({socket}) => {
    socket.write(`User ${clientId} joins`)
  })
  ...
  socket.on('end', (s) => {
    clients.forEach(({socket}) => {
      socket.write(`User ${clientId} leaves`)
    })
  })
})
```





### DNS

```js
const dns = require('dns/promises')
(async () => {
  const res = await dns.lookup('google.com')
  console.log(res)  // { address: '8.7.198.46', family:4 }
})()
```



- cat /etc/hosts

  - 本地dns记录表。查看本地的域名与ip的映射
  - 使用场景
    - 本地开发测试，将域名临时指向本地IP，绕过DNS解析
- 安全性：恶意程序可能篡改此文件以劫持域名【dns劫持】，将域名指向错误的恶意ip

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250804143347134.png" alt="image-20250804143347134" style="zoom:40%;" />



ipv6

- 128bit
- 连续的0可以使用`::`代替
- 本地回环地址`0000.0000.0000.0000.0000.0000.0000.0001`
  - `::1`





### 实现uploader

#### 基本实现

- client

```js
const net = require('net')
const fs = require('fs/promises')

const socket = net.createConnection({host: '127.0.0.1', port: 5050}, async () => {
  const filePath = './upload.txt'
  const fileHandle = await fs.open(filePath, 'r')
  const fileStream = fileHandle.createReadStream()
  fileStream.on('data', chunk => {
    // socket为可写流，向服务器发送数据
    if(!socket.write(chunk)) {
      fileStream.pause()
    }
  })
  
  socket.on('drain', () => {
    fileStream.resume()
  })
  
  // 读文件结束
  fileStream.on('end', () => {
    socket.end()
    console.log('文件上传完成')
  })
})
```

- server

```js
const net = require('net')
const fs = require('fs/promises')
const path = require('path')

const server = net.createServer()
server.on('connection', (socket) => {
  let fileHandle, fileStream
  // socket为可读流，接收客户端数据
  socket.on('data', async (chunk) => {
    if(!fileHandle) {
      // fs.open需要一定时间，可能导致fs.open执行多次，所以在首次data事件后，停止读取数据，fs.open执行完再恢复
      socket.pause()
      
      const filePath = path.resolve(__dirname, 'storage', 'text.txt')
      fileHandle = await fs.open(filePath, 'w')
      fileStream = fileHandle.createWriteStream()
      fileStream.write(chunk) 
      
      // 恢复
      socket.resume()
      
      // 监听drain事件
      fileStream.on('drain', () => {
        socket.resume()
      })
    } else {
      if(!fileStream.write(chunk)) {
        socket.pause()
      }
    }
  })
  
  // 连接结束
  socket.on('end', () => {
    fileHandle.close()
    // 下面两行代码非常重要，若没有，同一客户端第二次上传时会有bug
    fileHandle = null;
    fileStream = null;
  })
})

server.listen(5050, '127.0.0.1', () => {
  console.log('uploader server opened on', server.address())
})
```





#### 动态指定上传文件

- client

```js
const path = require('path')
const socket = net.createConnection({host: '127.0.0.1', port: 5050}, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  socket.write(`fileName: ${fileName}---`);
  const fileHandle = await fs.open(filePath, "r");
  ...
})
```

- server

```js
server.on('connection', (socket) => {
  let fileHandle, fileStream
  // socket为可读流，接收客户端数据
  socket.on('data', async (chunk) => {
    if(!fileHandle) {
      socket.pause();
      const indexOfDivider = chunk.indexOf("---");
      const fileName = chunk.subarray(10, indexOfDivider).toString("utf-8");
      const filePath = path.resolve(__dirname, "storage", fileName);
      fileHandle = await fs.open(filePath, 'w')
      fileStream = fileHandle.createWriteStream()
      fileStream.write(chunk.subarray(indexOfDivider + 3))
      ...
    }
  })
	...
})
```





#### 显示上传进度条

- client

```js
const fileSize = (await fileHandle.stat()).size
let uploadedPercent = 0  // 上传百分比
let uploadedBytes = 0  // 已上传字节
fileStream.on('data', async (chunk) => {
  if(!socket.write(chunk)) {
    fileStream.pause()
  }
  uploadedBytes += chunk.length
  const newUploadedPercent = (uploadedBytes / fileSize).toFixed(2) * 100;
  if (newUploadedPercent % 5 ===0 && newUploadedPercent !== uploadedPercent) {
    console.log(`${newUploadedPercent}%`);
    uploadedPercent = newUploadedPercent;
  }
})
```







## UDP

- client

```js
const dgram = require('dgram')
const sender = dgram.createSocket('udp4')
sender.send('some text', 8000, '127.0.0.1', (error, bytes) => {
  if(error) console.log(error)
  console.log(bytes)
})
```

- server

```js
const dgram = require('dgram')
const receiver = dgram.createSocket('udp4')
receiver.on('message', (message, remoteInfo) => {
  console.log(`server got: ${message} from ${remoteInfo.address}:${remoteInfo.port}`)
})
receiver.bind({ address: '127.0.0.1', port: 8000 })
receiver.on('listening', () => {
  console.log(receiver.address())
})
```







## HTTP

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250807102019199.png" alt="image-20250807102019199" style="zoom:35%;" />



- 先建立tcp连接，三次握手
- tcp连接本质上是用户主机上的应用程序（客户端）与服务器上的服务应用程序（服务端）之间建立的端到端通信链路
  - 客户端：用户设备上的应用程序（浏览器、app、curl）
  - 服务端：服务器上运行的特定服务（如nginx、api服务）
- http1.0和2.0基于tcp；http3.0基于udp
- 请求体和响应体，有结束标识



### http模块

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250811140555528.png" alt="image-20250811140555528" style="zoom:40%;" />

- server  

```js
const http = require('node:http') // `node:`表示node原生模块，无需安装直接使用
const server = http.createServer()
server.on('request', (request, response) => {
  // 打印请求方法、url、请求头
  console.log(request.method, request.url, request.headers)
  
  // 以流的方式获取请求体，内存友好
  request.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
  request.on("end", () => {
    response.writeHead(200, {"Content-Type": 'application/json'})
    response.end(JSON.stringify({status: 'success'}))
  });
  
})
server.listen(8000, () => {
  console.log('server listening on http://localhost:8000')
})
```



- **Connection: keep-alive** 

  - 两个端之间的数据传输（多个请求-响应），复用一个tcp连接，复用socket对象
    - 两个端指的是：<客户端IP, 客户端端口, 服务器IP, 服务器端口>

  ```js
  server.on('connection', socket => {
  })
  ```

  - 有超时设置
    - 设置请求头：`Keep-Alive: timeout=8,max=800`
    - 8秒内tcp连接无数据段交换，断开连接
      - 节省服务器资源，服务器需要同时服务成千上万用户，空闲连接不关闭，会很快耗尽服务器的可用临时端口和内存
    - tcp连接最多可以被用来发送800个请求
      - 限制最大请求数可以强制重新建立连接，确保连接的健康度



- client

```js
// agent对应于特定的一个tcp连接
const agent = new http.Agent ({ keepAlive: true })
// request是双工流，可读可写
const requst = http.request({
  agent: agent,
  hostname: 'localhost',
  port: 8000,
  method: 'POST',
  path: '/create-post',
  headers: {
		"Content-Type": 'application/json'
  }
})
request.on('response', (response) => {
  console.log(response.statusCode, response.headers)
  response.on("data", (chunk) => {
    console.log(JSON.parse(chunk.toString("utf-8")));
  });
})
request.write(JSON.stringify({message: 'Hi there'}))
request.write(JSON.stringify({message: 'How are you going'}))
request.end(JSON.stringify({message: 'This is my last message'}))
```



- net模块实现client，可以成功和http server通信

```js
const net = require('net')
const socket = net.createConnection({ host: 'localhost', port: 8050 }, () => {
  // 请求行、请求头的二进制数据 
  const head = Buffer.from("...")
  // 请求体的二进制数据, 这些二进制数据是未经过加密的，通过toString方法就可以解析出内容（http是明文传输）
  const body = Buffer.from('...')
  socket.write(Buffer.concat([head, body]))
})
socket.on('data', (chunk) => {
  console.log(chunk.toString('utf-8'))
})
```



- net模块实现server

```js
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString('utf-8'))
  })
  
  // 响应的二进制数据
  const response - Buffer.from('...')
  socket.write(response)
})
server.listen(8000, '127.0.0.1'. () => {
  console.log(server.address())
})
```





### 重要细节

- **Content-length**: 所要发送数据的大小
- **Transfer-encoding: 'chunked'**：未标明数据大小的默认头【和Content-length不同时使用 】

- 媒体类型**content-type**

  - 是必需的，决定了浏览器以何种方式处理文件，比如html文件会渲染，css文件会美化页面，js文件会被执行
  - 形式为`type/subtype;key=value`，比如 `text/html;charset=utf-8`
  - 根据正文结构分两种大类，单一类型、复合类型
    - 单一：`Content-Type: text/html; charset=utf-8`
    - 复合：`Content-Type: multipart/form-data; boundary=ExampleBoundaryString`
    - <img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251112100040969.png" alt="image-20251112100040969" style="zoom:80%;" />

- **魔法数字**

  - 文件对应二进制数据的开头几个字节，像是文件的身份证，用于唯一标识该文件的真实格式
  - 不要相信文件的扩展名，扩展名可以轻易被修改，要相信魔法数字，比如 `89 50 4e 47`表明它是.png文件类型

- 请求方法head

  - 快速获取资源的元信息，**只返回响应头**，比如看资源的类型（content-type）、大小（content-length）
  - 可以节省带宽，尤其对大文件（如视频）的元数据查询非常有效

- Option方法：查询服务器支持的请求方法和请求头

- 301 重定向状态码

  - 举例: 输入`apple.com`，会重定向到`www.apple.com`
  - **常用于 Nginx 等web服务来实现永久重定向**

  ```nginx
  # 方式1：rewrite（支持正则匹配）
  rewrite ^/old-url$ /new-url permanent;  # 'permanent' 表示301
  
  # 方式2：return（更高效，适合简单路径）
  server {
      listen 80;
      server_name example.com;
      return 301 https://example.com$request_uri;  # HTTP→HTTPS 跳转
  }
  ```

  - 告知浏览器，目标资源已永久迁移到新url，浏览器会自动重新访问新地址
  - seo友好：搜索引擎会将旧url的权重重新转移到新url






### web server网页服务器

- 网页服务器主要功能是，将html、css、js文件返回到客户端，客户端进行页面渲染
- 文件路由：返回html、css、js文件『静态资源服务』
- 除了文件路由，还有一种json路由「接口服务」

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/fetching-a-page.svg" alt="A single Web document composed from multiple resources from different servers." style="zoom:67%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250811103745814.png" alt="image-20250811103745814" style="zoom:80%;" />

```js
const http = require('http')
const fs = require('fs/promises')
const server = http.createServer()
server.on('request', async (request, response) => {
  // html文件路由
  if(request.url === '/' && request.method === 'GET') {
    response.setHeader('Content-Type', 'text/html')
    const fileHandle = await fs.open('./public/index.html', 'r')
    const fileStream = fileHandle.createReadStream()
    fileStream.pipe(response)
  }
  // css文件路由
  if(request.url === '/styles.css' && request.method === 'GET') {
    response.setHeader('Content-Type', 'text/css')
    const fileHandle = await fs.open('./public/styles.css', 'r')
    const fileStream = fileHandle.createReadStream()
    fileStream.pipe(response)
  }
  // js文件路由
  if(request.url === '/scripts.js' && request.method === 'GET') {
    response.setHeader('Content-Type', 'text/javascript')
    const fileHandle = await fs.open('./public/scripts.js', 'r')
    const fileStream = fileHandle.createReadStream()
    fileStream.pipe(response)
  }
  
  // json路由
  if(request.url === '/login' && request.method === 'POST') {
    response.setHeader('Content-Type', 'application/json')
    response.statusCode = 200
    const body = { msg: 'logging...' }
    response.end(JSON.stringify(body))
  }
})
server.listen(9000, () => {
	console.log('server listening on http://localhost:9000')
})
```

```html
<html>
  <head>
  	<link href='style.css'/>  // 浏览器会自动发送请求 'http://localhost:9000/style.css' 
  </head>
  <body>
    <h1>hello world</h1>
		<script src='script.js'></script>  // 浏览器会自动发送请求 'http://localhost:9000/script.js'
  </body>
</html>
```

- 上传功能

```js
if(request.url === '/upload' && request.method === 'POST') {
  response.setHeader('Content-Type', 'application/json')
  const fileHandle = await fs.open('./storage/image.jpg', 'w')
  const fileStream = fileHandle.createWriteStream()
  request.pipe(fileStream)
  
  request.on('end', async () => {
    await fileHandle.close()
    response.end(JSON.stringify({msg: 'file was uploaded'}))
  })
}
```





### 封装http模块

#### 路由实现

```js
// butter.js
const http = require('http')
const fs = require('fs/promises')
class Butter {
  constructor() {
    this.server = http.createServer()
    
    // 维护一个routes对象，key为[method+path],value是一个函数 { 'get/': () => {}, 'post/upload': () => {} }
    this.routes = {}
    this.server.on('request', (req, res) => {
      // 【处理文件路由】
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, 'r')
        const fileStream = fileHandle.createReadStream()
        res.setHeader('Content-Type', mime)
        fileStream.pipe(res)
      }
      // 设置状态码
      res.status = (code) => {
        res.statusCode = code
        return res
      }
      // 【处理json路由】
      res.json = data => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(data)) // 适用于大小低于流的内部缓冲区大小的json
      }
      
			// 当访问到未定义路由时，返回404
      if(!this.routes[req.method.toLowerCase() + req.url]){
         return res.status(404).json({error: `cannot find ${req.method} ${req.url}`})
      }
      
      // 真正处理请求
      this.routes[req.method.toLowerCase() + req.url](req, res)
    })
  }
  listen(port, cb) {
    this.server.listen(port, cb)
  }
  // 路由
  route(method, path, cb) {
    this.routes[method+path] = cb
  }
}
module.exports = Butter
```

```js
// server.js
const Butter = require('./butter.js')
const PORT = 9000

const server = new Butter()
//【文件路由】
server.route('get', '/', (req, res) => {
  res.status(200).sendFile('./public/index.html', 'text/html')
})
server.route('get', '/styles.css', (req, res) => {
  res.status(200).sendFile('./public/styles.css', 'text/css')
})
server.route('get', '/scripts.js', (req, res) => {
  res.status(200).sendFile('./public/scripts.js', 'text/javascript')
})
server.listen(PORT, () => {
  console.log('server listening on http://localhost:9000')
})
```



- 对于单页面应用，访问前端路由时，全部返回index.html，由前端解析路由渲染出对应界面

```js
server.route('get', '/login', (req, res) => {
  res.status(200).sendFile('./public/index.html', 'text/html')
})
```



#### Body-parser

- 解析`Content-Type`为`application/json`请求体

```js
server.route('post', '/api/login', (req, res) => {
  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString('utf-8')
  })
  req.on('end', () => {
    body = JSON.parse(body)
    const { username, password } = body
  })
})
```







### 负载均衡服务

- 反向代理
  - **分配客户端流量到不同服务器，避免某台服务器请求压力过大**
  - 本质上也是server

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250812095900308.png" alt="image-20250812095900308" style="zoom:40%;" />

```js
const http = require('http')
// 代理服务的端口
const PORT = 9000
// 主服务器
const mainServers = [
  {host: 'localhost', port: 9001},
  {host: 'localhost', port: 9002},
]

const proxy = http.createServer()
// 监听客户端的请求
proxy.on('request', (clientRequest, proxyResponse) => {
  // 采用算法：循环
  const mainServer = mainServers.shift()
  mainServers.push(mainServer)
  const proxyRequest = http.request({
    host: mainServer.host,
    port: mainServer.port,
    path: clientRequest.url,
    method: clientRequest.method,
    headers: clientRequest.headers
  })
  // 收到主服务器的响应
  proxyRequest.on('response', (mainServerResponse) => {
    // 设置代理响应状态码和响应头
    proxyResponse.writeHead(mainServerResponse.statusCode, mainServerResponse.headers)
    // 写入响应体到proxyResponse
  	mainServerResponse.pipe(proxyResponse)
  })
  // 写入请求体到proxyRequest
  clientRequest.pipe(proxyRequest)
})
// 注：proxyRequest proxyResponse 都是可写流

proxy.listen(PORT, () => {
  console.log('proxy server is running')
})
```





### cookie

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250812102633550.png" alt="image-20250812102633550" style="zoom:40%;" />

- 属性：Expires、HttpOnly、Secure
- 指明 expires和max-age属性，将会在磁盘上保存

``` js
// 存储用户token
const SESSIONS = [] 
// 后端下发token，并将token和userid映射关系存入数据库
const token = Math.floor(Math.random() * 10000000000).toString()
SESSIONS.push({ userId: user.id, token})
res.setHeader('Set-Cookie', `token=${token}; Path=/;`)

// 浏览器每次请求会自动携带token，后端对请求头做校验
const token = req.headers.cookie.split('=')[1]
const session = SESSIONS.find(s => s.token === token)
if(session) {
  console.log('用户验证通过')
} else {
  res.status(401).json({error: 'unauthorized'})
}
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250812104652967.png" alt="image-20250812104652967" style="zoom:40%;" />

- 退出登录
  - 数据库删除该token
  - **浏览器删除该token，利用Set-Cookie，将Expires或Max-Age设置为过去的时间点**

```js
server.route('delete', '/api/logout', (req, res) => {
  const idx = SESSIONS.findIndex(s => s.userId === req.userId)
  if(idx !== -1) SESSIONS.splice(idx, 1)
  res.setHeader('Set-Cookie', 'token=deleted; Max-Age=0')
  res.status(200).json({ msg: 'logout successfully' })
})
```







### 中间件

```js
// butter.js
class Butter {
  constructor() {
    this.server = http.createServer()

    // 维护一个middlewares数组，存储所有的中间件
    this.middlewares = []

    this.server.on('request', (req, res) => {
      // 先执行中间件逻辑
			this.middlewares[0](req, res, () => {
        this.middlewares[1](req, res, () => {
          this.middlewares[2](req, res, () => {
            
            if(!this.routes[req.method.toLowerCase() + req.url]){
               return res.status(404).json({error: `cannot find ${req.method} ${req.url}`})
            }
            // 真正处理请求
            this.routes[req.method.toLowerCase() + req.url](req, res)
          })
        })
      })
    })
  }
  beforeEach(cb) {
    this.middlewares.push(cb)
  }
}
```

- **对中间件调用逻辑进行优化**

```js
this.server.on('request', (req, res) => {
  // 先执行中间件逻辑
  const runMiddleware = (req, res, index, middlewares) => {
  	if(index === middlewares.length) {
      // 真正处理请求
      this.routes[req.method.toLowerCase() + req.url](req, res)
    } else {
      middlewares[index](req, res, () => {
        runMiddleware(req, res, index+1, middlewares)
      })
    }
  }
  runMiddleware(req, res, 0, this.middlewares)
})
```

- server.js

```js
// server.js
const Butter = require('./butter.js')
const PORT = 9000

const server = new Butter()

// 【中间件】
server.beforeEach((req, res, next) => {
  console.log('first middleware')
  next()
})
server.beforeEach((req, res, next) => {
  console.log('second middleware')
  next()
})
server.beforeEach((req, res, next) => {
  console.log('third middleware')
  next()
})

//【文件路由】
server.route('get', '/', (req, res) => {
  res.status(200).sendFile('./public/index.html', 'text/html')
})

server.listen(PORT, () => {
  console.log('server listening on http://localhost:9000')
})
```





#### 身份验证

```js
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = ['GET /api/user', 'POST /api/post', 'DELETE /api/logout']
  if(routesToAuthenticate.indexOf(req.method + ' ' + req.url) !== -1) {
    if(req.headers.cookie) {
      const token = req.headers.cookie.split('=')[1]
			const session = SESSIONS.find(s => s.token === token)
      if(session) {
        req.userId = session.userId
        return next()
      }
    } 
    return res.status(401).json({error: 'unauthorized'})
  } else {
    next()
  }
})
```



#### 解析json请求体

```js
server.beforeEach((req, res, next) => {
  if(req.headers['content-type'] === 'application/json') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString('utf-8')
    })
    req.on('end', () => {
      req.body = JSON.parse(body)
      next()
    })
  } else {
    next()
  }
})
```



#### 返回index.html

```js
server.beforeEach((req, res, next) => {
  const routes = ['/', '/login', '/profile', '/new-post']
  if(routes.indexOf(req.url) !== -1 && req.method === 'GET') {
    res.status(200).sendFile('./public/index.html', 'text/html')
  } else {
    next()
  }
})
```





### ？静态资源

### ？疑问

tcp连接，数据包，是代码里对应的chunk吗

客户端每次write会触发服务端的data事件

可读流每次触发data事件，chunk是多少字节呢 是流的缓冲区大小吗

看下cpeak封装





# 前后端

当用户访问百度官网时，涉及的主机角色

| 角色           | 作用                                                  | 示例                     |
| :------------- | ----------------------------------------------------- | ------------------------ |
| 用户主机       | 发起请求的客户端设备                                  | 电脑、手机               |
| 前端资源服务器 | 存储和返回静态资源（index.html、styles.css、main.js） | cdn边缘节点、nginx服务器 |
| 后端应用服务器 | 处理动态请求                                          | 后端集群                 |
| cdn节点        | 缓存静态资源，加速访问                                | 第三方cdn                |
| dns服务器      | 解析域名为ip                                          | 公共dns（如8.8.8.8）     |

- 用户主机-》dns服务器，获取最近的cdn节点ip
- 用户主机-》cdn节点ip / nginx服务器，获取静态资源，通常是单页应用，由前端接管路由，渲染对应的组件
- 用户主机-》后端应用服务器，动态请求
  - 请求通过负载均衡器分配到后端集群，后端处理请求返回json数据
  - 负载均衡策略：地理就近、轮询分配、智能权重





### nginx服务

- **静态资源托管能力**
  - 可以快速托管前端构建产物（vue/react打包后的dist目录）

```nginx
server {
  listen 80;
  root /var/www/html; #静态资源目录
  location / {
    try_files $uri $uri/ /index.html  #spa前端路由支持
  }
}
```

- **反向代理**，将请求转发给后端服务，nginx作为”流量中转站“
  - 隐藏后端真实ip，防攻击

```nginx
location /api {
  proxy_pass http://backend-server:3000  #转发到后端
  proxy_set_header Host $host #透传请求头
}
```

- **负载均衡**
  - 将流量分配到多台后端服务器，避免单点过载

```nginx
upstream backend {
  server 192.168.1.1:3000 weight=5  #权重分配
  server 192.168.1.2:3000 
  server 192.168.1.3:3000 backup    # 备用服务器
}
location / {
  proxy_pass http://backend  #负载均衡
}
```





### 服务端渲染

- 以元宝分享对话链接为例：https://yb.tencent.com/s/n9NnjAkV6mwc

- nginx路由配置

```nginx
location /s/ {
  # 关键配置，不尝试找前端文件，直接转发到后端
  try_files $uri $uri/ /backend-handler?code=n9NnjAkV6mwc
}
```

- 后端处理伪代码， `Express`为例

```js
app.get('/backend-handler', (req, res) => {
  const shortCode = req.query.code  // 获取对话短码
  const chatData = db.query(`SELECT * FROM chats WHERE id = (SELECT chat_id FROM short_codes WHERE code = ?)`, [shortCode])
  
  // 动态生成html（服务端渲染）
  const html = `
      <!DOCTYPE html>
      <html>
          <head><title>分享对话</title></head>
          <body>
              <div class="chat">${chatData.content}</div>
              <!-- 直接内嵌CSS避免二次请求 -->
              <style>.chat { color: red }</style>
          </body>
      </html>
  `;
  res.send(html)
})
```

- 浏览器收到的响应

```text
HTTP/1.1 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
    ... # 包含实际数据的完整页面
</html>
```







# UNIX

- **unix操作系统，unix由c编写**
- linux是受unix开发出来的开源操作系统，linus创建的，也发明了git
- macos
- Android
- ios

*【windows不是unix系统】*



### 基础知识

1、文件权限

- 是否可读（r）、是否可写（w）、是否可执行（x）
- 文件可执行的前提是需要有它的可读权限
- 文件可执行，意味着可以通过

```bash
chmod u+x ./scripts.sh # 给文件添加可执行权限
./scripts.sh  # 在终端输入文件名执行文件

chmod u-r-w ./scripts.sh  # 移除文件的可读、可写权限
```



2、常用命令：

echo 在终端输出内容

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250812184847956.png" alt="image-20250812184847956" style="zoom:50%;" />

```js
echo 'some thing' >temp.txt  // 保存内容到文件夹
```

pwd 打印工作目录

touch 新建文件 

mkdir 新建目录

open path -R 在文件目录中打开

rm 删除文件

cat 终端显示文件内容

nano 打开文件（一个终端文本编辑器）

which  用于查找某个命令或可执行文件的完整路径





### unix shells

- shell是一个c应用程序，每开启一个终端，操作系统内核就会开启一个shell程序
- 

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250813094810187.png" alt="image-20250813094810187" style="zoom:40%;" />



- 在一个shell程序中，终端可以输入命令，会按下面顺序开始查找，「type 命令」可以得到命令的类型

  - 【**Aliases**】：给一个命令添加别名，比如给node起别名为runplay，执行runplay和执行node效果相同

  ```js
  alias runplay='node'   // runplay is an alias for node
  ```

  - **【Functions】**：函数
  - 【**Built-In Functions】**：内置函数
    - echo   **`echo is a shell builtin`**
  - 【**Path】：会挨个查找下列目录（全局路径变量），看目录下面是否有输入命令对应的unix可执行文件**
    - *unix可执行文件：二进制内容，已经被编译为机器代码的c程序，可供cpu直接执行*
    - node  **`node is /Users/tal/.volta/bin/node`**
    - echo也有可执行文件，但是相对于内置函数echo，可执行文件执行创建一个新进程，占内存，太重了

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250813104746891.png" alt="image-20250813104746891" style="zoom:50%;" />

```js
console.log(process.env.PATH)  // 在node中可以通过process.env.PATH访问全局路径变量
```



- Path举例：输入ls，会在`/bin`文件夹下找到对应可执行文件并执行【输入`/bin/ls`也是相同效果】

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250813105317767.png" alt="image-20250813105317767" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250813113659385.png" alt="在磁盘保存的unix可执行文件" style="zoom:67%;" />

- 可执行文件每次执行，对应一个进程

- 在shell对应的配置文件（macos以`./zshrc`为例），配置某个命令的别名，在所有终端都生效

```js
// 终端输入des希望进入Desktop文件夹

alias des='cd ~/Desktop'
type des  // des is an alias for cd ~/Desktop
```







### child_process

- 用于创建和管理子进程，允许在nodejs中执行系统命令，执行系统命令时会开启一个进程
- **Spawn：衍生子进程**
  - **第一个参数需要是unix可执行文件**
    - 如果是位于全局路径变量下的unix可执行文件，可以直接传命令名
    - 如果不是，需要传unix可执行文件的路径
  - 第二个参数是数组：传给unix可执行文件的参数列表(args)

```js
const { spawn } = require('child_process')

const subprocess = spawn('ls') 
const subprocess = spawn('ls', ['-l']) 
const subprocess = spawn('zsh', ['./demo.sh']) 
subprocess.stdout.on('data', (chunk) => {
  console.log(chunk.toString('utf-8'))
})

// `process.pid` 获取到当前node进程id
// `process.env` 获取到当前node进程的环境变量
```



- 将命令在shell中执行

```js
const { exec } = require('child_process')
exec('ls -l', (err, stdout, stderr) => {
  if(err) {
    console.error(err)
    return 
  }
  console.log(stdout)
  console.log(stderr)
})
```



- fork()
  - 基于spawn，只能衍生node进程
  - cluster.fork()，衍生自身作为子进程





### unix下进程管理

- 最顶层进程是kernel_task，其pid为0
- 其它进程都可以视为kernel_task进程的子进程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250813102428741.png" alt="image-20250813102428741" style="zoom:70%;" />

- 每个进程都有启动其它进程的能力。比如bash进程

  - 可以输入全局路径变量下的命令，开启子进程

  - 可以输入unix可执行文件路径，开启子进程

    Eg：bash进程通过内核去开启一个myapp子进程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250814103641134.png" alt="image-20250814103641134" style="zoom:40%;" />

- 在开启子进程时，可以传递参数

  - 比如，在终端输入`node test.js a b c`时，unix可执行文件后面的 `test.js`、`a`、`b`、`c`就是`args`
  - node进程可以通过`process.argv` 获取到参数数组， process.argv[0]是可执行文件的绝对路径

  ```js
  [
    '/Users/tal/.volta/tools/image/node/24.2.0/bin/node',
    '/Users/tal/Desktop/workspace/own/demo/unix.js',
    'a',
    'b',
    'c'
  ]
  ```

  

- **利用node的spawn()去打开豆包程序**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250814164955711.png" alt="image-20250814164955711" style="zoom:70%;" />

```js
const { spawn } = require('child_process')

const subprocess = spawn('/Applications/Doubao.app/Contents/MacOS/Doubao') 
subprocess.stdout.on('data', (chunk) => {
  console.log(chunk.toString('utf-8'))
})
```





#### 环境变量

- 每个进程有自己独立的环境变量空间，环境变量由进程创建而生成，随进程终止而销毁（存储在进程的内存空间

- 在开启子进程时，默认情况下，父进程的所有环境变量都会传递给子进程，子进程可以修改

- bash中定义环境变量： `export FOO='bar'`  foo是一个环境变量，此时开启node子进程

```js
console.log(process.env.FOO) // 'bar'
process.env.FOO = 'baz'
console.log(process.env.FOO) // 'baz'
```

bash中去掉环境变量 `unset FOO`

bash中可以通过命令 `env` 获取当前shell进程的所有环境变量







### 文件系统

- 根目录` /`
  - 主目录：每个用户有各自的主目录 `~`，终端输入`cd`可进入当前用户的主目录
- `.`表示当前目录，`..`表示父目录

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250815094650726.png" alt="image-20250815094650726" style="zoom:40%;" />

- 在衍生子进程时，除了参数和环境变量，父进程还会将它的当前工作目录传给子进程
  - 在node中，可以通过`process.cwd()`访问父进程的当前工作目录

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250815094712718.png" alt="image-20250815094712718" style="zoom:40%;" />

- 使用fs内置模块处理文件时，文件路径如果是相对路径，是相对于cwd的，需要确保路径正确

```js
const fs = require('fs')
const path = require('path')

const content = fs.readFileSync('./text.txt', 'utf8')  // 易发生找不到文件的错误
const content = fs.readFileSync(path.join(__dirname, './text.txt'))  // 保证文件路径正确

// __dirname在cjs规范的模块中可以使用，esm规范需要使用其他
```





### 进程通信【数据传输】

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902120217961.png" alt="image-20250902120217961" style="zoom:40%;" />

#### 1、消息传递

##### ① 管道通信

- 在unix系统中，每个进程会关联**三种标准I/O流**，它们是进程通信的基础管道

  stdin；stdout；stderr

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250815105738952.png" alt="image-20250815105738952" style="zoom:40%;" />

- 在bash中执行一个unix可执行文件，unix可执行文件进程的默认输入是终端-键盘，输出是终端-显示器

- 进程输入可以是一个文件，进程输出写入到一个文件

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250815105411754.png" alt="image-20250815105411754" style="zoom:40%;" />



- 进程输入stdin可以是其他进程的输出stdout，利用这个可实现进程通信

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250815105818661.png" alt="image-20250815105818661" style="zoom:40%;" />

1、模拟一个node进程和一个node子进程通信：

```js
// demo.js
const subprocess = spawn("node", ["./subprocess.js"]);
subprocess.stdout.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
  // 在node中console.log()本质上是stdout.write()
});
subprocess.stderr.on("data", (chunk) => {
  console.log(chunk.toString("utf-8"));
});
subprocess.stdin.write('something from parent process')


// subprocess.js
const { stdin, stdout, stderr } = require('process')
stdout.write('this is some text that i want')
stderr.write('this is some text that i may not want')
stdin.on('data', (chunk) => {
  console.log(chunk.toString('utf8'))
})
```

 

2、管道

```bash
echo 'some thing' | tr 'a-z' 'A-Z'
```

- echo进程的 `stdout` 成为了tr进程的 `stdin`



3、其它相关bash命令

- stdin；stdout；stderr对应的数字分别是0、1、2
- 将node进程的stdout保存为stdout.txt文件，stderr保存为stderr.txt文件（会被保存在bash进程的当前工作目录下 
  - 该命令是文件内容覆盖逻辑

```bash
node test.js 1>stdout.txt 2>stderr.txt
```

- 该命令是文件内容追加逻辑

```js
node test.js 1>>stdout.txt
```

- 将stdin.txt文件变成node进程的stdin

```bash
node test.js 0<stdin.txt
```





###### 模拟cat命令

```bash
node cat.js demo.txt
```

```js
// cat.js
const { stdin, stdout, argv, exit } = require('process')
const fs = require('fs')
const filepath = argv[2]
if(filepath) {
  const fileStream = fs.createReadStream(filepath)
  fileStream.pipe(stdout)
  fileStream.on('end', () => {
    exit(0)
  })
}
stdin.on('data', (chunk) => {
  stdout.write(chunk.toString('utf8'))
})
```





##### ② 套接字

- 在内存中移动数据来进行通信  

```JS
// 进程a
const net = require('net')
const SOCKET_PATH = '/tmp/node_socket'  // path用于指定unix domain socket的路径，客户端会连接到该socket文件

const client = net.createConnection({ path: SOCKET_PATH })   
client.on('connect', () => {
  console.log('connected to server')
})
client.on('data', (data) => {
  console.log('received from c server')
})
```

```js
// 进程b
const net = require('net')
const server = net.createServer()
server.on("connection", (socket) => {
  socket.write("hello i am server");
})
	// 开启服务器进程时会创建socket文件 /tmp/node_socket
server.listen(SOCKET_PATH, () => {
  console.log('ipc服务端')
})
```



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250819141046901.png" alt="image-20250819141046901" style="zoom:50%;" />





- **消息传递：进程间通过操作系统所在的内存地址空间来互相传递数据，进行频繁的系统调用**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902114923355.png" alt="image-20250902114923355" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902114928500.png" alt="image-20250902114928500" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902115204093.png" alt="image-20250902115204093" style="zoom:50%;" />





#### 2、共享内存

- 两个进程共享同一块内存空间中的数据，数据不需要移动
- **共享内存：只需要两次系统调用，相较于消息传递，性能高**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902114853267.png" alt="image-20250902114853267" style="zoom:50%;" />







### cluster

- 两个浏览器标签页，1个请求`/`，1个请求`/heavy`，node进程处理`/heavy`请求耗时，导致另一个标签页的` /`请求也慢

```js
server.route('get', '/', (req, res) => {
  res.json({ msg: 'this is some text' })
})
server.route('get', '/heavy', (req, res) => {
  for(let i=0; i<10000000000; i++) {}
  res.json({ msg: 'this is very heavy' })
})
```

- 如何解决？
  - 为充分利用cpu的内核，可以由node进程fork出多个子进程（clone父node进程）

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250819141213767.png" alt="image-20250819141213767" style="zoom:50%;" />

	- `cluster.isPrimary` 当前进程是父进程返回true，否则返回false
	- `cluster.fork()`是特殊的`spawn()`，只衍生node子进程

```js
const cluster = require('cluster')
const os = require('os')
if(cluster.isPrimary) {
  console.log(`this is parent process with pid ${process.pid}`)
  const coresCount = os.availableParallelism()
  // cpu有几个内核，衍生几个子进程
  for(let i=0; i<coresCount; i++) {
    const worker = cluster.fork()
    console.log(`the parent spawned a new child with pid ${worker.process.pid}`)
  }
  // 当一个子进程退出时，重新衍生一个子进程
  cluster.on('exit', (worker, code, signal) => {
    console.log(`${worker.process.pid} process was killed`)
    cluster.fork()
  })
} else {
  console.log('this is child process')
  require('./server.js')
}
```

- 父进程负责自动分配流量，默认策略是将请求按顺序分配给子工作进程
- 子进程负责处理请求
- **父子进程通信【基于ipc实现】**

```js
// 父进程
worker.send()  // worker代表某一子进程
	 // 监听特定进程
worker.on('message', (msg) => { 
  console.log(msg)
})
	 // 监听所有子进程
cluster.on('message', (worker, message) => {
  console.log(`工作进程 ${worker.process.pid} 发送消息:`, message);
});

// 子进程
process.on('message', (msg) => {
  console.log(msg)
})
process.send()
```

- 当父进程只需要分配流量时，可以使用pm2来代替
  -  `pm2 start server.js -i max` 根据cpu核心数启动最大数量的实例，提高并发处理能力
  - 某个实例崩溃，pm2会自动重启







# video editor

客户端上传视频

```js
const uploadVideo = async (req, res) => {
  const specifiedFileName = req.headers.filename  // 文件名
  const extension = path.extname(specifiedFileName).substring(1).toLowerCase()  // 文件后缀
  const name = path.parse(specifiedFileName).name  // 文件名字
  const videoId = crypto.randomBytes(4).toString('hex')  // 作为文件夹名字
  
  try {
    await fs.mkdir(`./storage/${videoId}`)
    const fullPath = `./storage/${videoId}/original.${extension}`  
    const fileHandle = await fs.open(fullPath, 'w')
    const fileStream = fileHandle.createWriteStream()
    await pipeline(req, fileStream)
    await fileHandle.close()
  } catch(e) {
    // 使用pipeline方法，当客户端取消上传时，会进入catch语句，此时可以将创建的文件夹删除
    deleteFolder(`./storage/${videoId}`)
  }
}
```

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250820142424994.png" alt="image-20250820142424994" style="zoom:25%;" />

客户端获取资源

```js
// 在线预览图片
server.route('get', '/cover.jpg', async (req, res) => {
  const fileHandle = await fs.open(`./storage/303bd05c/cover.jpg`, 'r')
  const stat = await fileHandle.stat()
  const fileStream = fileHandle.createReadStream()
  res.setHeader('Content-Type', 'image/jpg')
  res.setHeader('Content-Length', stat.size)
  await pipeline(fileStream, res)
  await fileHandle.close()
}

// 前端下载视频，下载关键响应头 Content-Disposition
server.route('get', '/original.mp4', async (req, res) => {
  const fileHandle = await fs.open(`./storage/303bd05c/original.mp4`, "r");
  const stat = await fileHandle.stat();
  const fileStream = fileHandle.createReadStream();
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
  await pipeline(fileStream, res);
  await fileHandle.close();
})
```

Content-Disposition

- http响应头，用于指示浏览器如何处理响应内容

  - `inline`：默认值，在页面显示内容

  - `attachment`：告知浏览器将内容作为附件下载

    





### 视频

容器格式（MOV）

- 就像一个盒子，可以装载多种类型的媒体流
  - 视频流，编码器 H.265
  - 音频流，编码器AAC
  - 字幕流，编码UTF-8
- 不同的容器对于同一种流（如video）所支持的编码器不同

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250820150703269.png" alt="image-20250820150703269" style="zoom:40%;" />



### ffmpeg

- 可以对视频新增流，删除流
- 可以更改流的编码器

```js
// 转换视频格式
ffmpeg -i a.mp4 a.mov

// 查看视频详细信息
ffprobe -v quiet -print_format json -show_format -show_streams one.mp4>probe.txt
```

- 可以获取视频的一帧
- 可以获取视频的详细信息，各种流的详细信息、视频分辨率等
- 可以从视频中提取音频
- 可以对视频大小做裁剪







每个进程有nice值，操作系统会为nice值更低的进程分配更多的cpu

图像处理程序 imageMagick

pdf处理程序 poppler

计算机视觉程序 opencv

语音转文本 whisper





# Compression

- 减少文件的比特数



### zlib

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250828192143121.png" alt="image-20250828192143121" style="zoom:50%;" />

```js
const zlib = require('zlib')
const fs = require('fs')

const src = fs.createReadStream('./before-compress.txt')
const dest = fs.createWriteStream('./after-compress.txt')
src.pipe(zlib.createGzip()).pipe(dest)

// zlib.createGzip() 是一个转换流
```

- 使用Gzip压缩文件，属于无损压缩
- 使用gunzip解压使用Gzip算法压缩的数据

```js
zlib.createGunzip()
```





### 有损压缩 + 无损压缩

- 无损压缩：减少比特数而不丢失任何信息，可以复原到初始文件
  - Png
  - 压缩为zip格式
- 有损压缩：会丢失文件信息，会将人眼注意不到的细节丢失
  - jpeg、mp3、aac、H.264

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902093444186.png" alt="image-20250902093444186" style="zoom:30%;" />

- **通常文本采用无损压缩，图片、视频、音频等媒体文件采用有损压缩**
  - 不要对已经压缩过的文件进行无损压缩，文件大小变化不会很大，是无意义操作
- 压缩本质是寻找重复的内容，如果文件体积过小，没有重复内容，压缩后体积反而会变大，且耗费cpu计算
  - 压缩视频：寻找多帧中长时间静止的像素点，复用第一次出现的
  - 压缩图片：图片的可预测性越高，压缩比越大

- Https + 压缩会给黑客攻击机会，所以不要对敏感数据做压缩

  





### 应用于网络

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902094059275.png" alt="image-20250902094059275" style="zoom:50%;" />

- 在代码中启用压缩

```js
 // 【处理文件路由】
res.sendFile = async (path, mime) => {
  const fileHandle = await fs.open('./text-compressed.gz', 'r')
  const fileStream = fileHandle.createReadStream()
  res.setHeader('Content-Type', mime)
  res.setHeader('Content-Encoding', 'gzip')
  fileStream..pipe(zlib.createGzip()).pipe(res)
}

// 【处理json路由】
res.json = data => {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Encoding', 'gzip')
  zlib.gzip(JSON.stringify(data), (err, buffer) => {
    if(err) return res.end()
    res.end(buffer)
  })
}
```



- 通常有一个**Nginx代理服务来压缩响应体**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902094259032.png" alt="image-20250902094259032" style="zoom:50%;" />







- 降低文件大小，可以对文件缩小和压缩

  - 缩小：对图片做裁剪，会改变分辨率，不属于有损压缩

  - 压缩：对图片做有损压缩，不会改变分辨率






# 线程thread

### node处理请求 vs 其他语言处理请求

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902111337406.png" alt="image-20250902111337406" style="zoom:40%;" />



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902111344762.png" alt="image-20250902111344762" style="zoom:40%;" />



### 进程状态

- 就绪态：进程获得了除cpu之外的所有必要资源，等待cpu调度执行
- 运行态：进程正在cpu上执行
- 阻塞态：等待io操作完成

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902111544248.png" alt="image-20250902111544248" style="zoom:50%;" />

- **多个进程共享cpu如何保证安全性和正确性：上下文切换**

  - 为当前执行进程捕捉快照，在下次获得cpu使用权时，进行数据恢复
  - <img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902114811794.png" alt="image-20250902114811794" style="zoom:50%;" />

  <img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902113801926.png" alt="image-20250902113801926" style="zoom:70%;" />





- 当一个进程有两个线程且线程分别在两个cpu核心上运行时，此时该进程的cpu利用率是200%
- unix上，一个cpu core的使用率是100%

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250902144843524.png" alt="image-20250902144843524" style="zoom:50%;" />





### worker_threads

- node衍生新线程

```js
const { Worker } = require('worker_threads')
const a = 400
const thread = new Worker('./calc.js')  // 该文件执行在另一个线程中
console.log(a)  // 400

// calc.js
const a = 1000
console.log(a)  // 1000
```



- `while(true) {}`会阻塞主线程

```js
// 不衍生线程
setTimeout(() => {
  fs.writeFile('./text.txt', 'this is some text', (err) => {
    if(err) return console.log(err)
    console.log('file created successfully')
  })
}, 3000)
while(true) {}
```

```js
// 衍生线程
const { Worker } = require('worker_threads')
const thread = new Worker('./calc.js')  // 该文件执行在另一个线程中
while(true) {}

// calc.js
setTimeout(() => {
  fs.writeFile('./text.txt', 'this is some text', (err) => {
    if(err) return console.log(err)
    console.log('file created successfully')
  })
}, 3000)
```





#### workerData

- 创建线程时可以传递workerData属性

```js
const { Worker } = require('worker_threads')
const thread = new Worker('./calc.js', { workerData: xxx})

// calc.js
const { workerData } = require('worker_threads')
console.log(workerData)  // xxx
```





#### MessageChannel()

- `MessageChannel()`方法生成的两个port可以相互通信

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250904113421421.png" alt="image-20250904113421421" style="zoom:60%;" />

```js
import { MessageChannel } = require('worker_threads')
const { port1, port2 } = new MessageChannel()
port1.postMessage({ name: 'joe' })
port2.postMessage({ name: 'why' })
port1.on('message', (msg) => {
  console.log('msg received on port1': msg)
})
port2.on('message', (msg) => {
  console.log('msg received on port2': msg)
})
```





#### 线程通信

- 将其中一个port以workerData传给另一个线程，就可以实现线程之间的通信

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250904113852095.png" alt="image-20250904113852095" style="zoom:50%;" />

```js
// 实现两个worker thread的通信
const { port1, port2 } = new MessageChannel()
const thread1 = new Worker('./calc.js', { workerData: {port: port1}, transferList: [port1] })
const thread2 = new Worker('./calc.js', { workerData: {port: port2}, transferList: [port2] })

// 实现主线程和各个worker thread的通信
const channel1 = new MessageChannel()
const channel2 = new MessageChannel()
const thread1 = new Worker('./calc.js', { workerData: {port: channel1.port2}, transferList: [channel1.port2] })
const thread2 = new Worker('./calc.js', { workerData: {port: channel2.port2}, transferList: [channel2.port2] })
```

- 实现主线程和worker thread的通信

```js
const thread = new Worker('./calc.js')
thread.on('message', (msg) => {
  console.log('main thread got': msg)
})
thread.postMessage({name: 'joe'})

// calc.js
import { parentPort } = require('worker_threads')
parentPort.postMessage('some text')
parentPort.on('message', (msg) => {
  console.log('worker thread got': msg)
})
```





#### Multi-threads

- node主线程应该执行轻量级任务，能高效调度【不要阻塞主线程】
  - 执行重量级任务时，程序计数器不能移动（阻塞）
- 重量级耗时（cpu密集型任务）任务交由worker threads执行



使用cluster，有可能所有进程的主线程都在执行重量级任务，没有进程来处理轻量级请求

所以每个进程可以利用worker thread来处理重量级任务，主线程处理轻量级请求

每个重量级任务的请求都会衍生worker thread来处理，所以要注意处理大量的恶意heavy请求，它会衍生大量的线程

```js
const { Worker } = require('worker_threads')
server.route('get', '/api/primes', (req, res) => {
  const count = Number(req.params.get('count'))    
  let startingNumber = BigInt(req.params.get('start'))
  
  const start = performance.now() // 记录开始时间
  if(startingNumber < BigInt(Number.MAX_SAFE_INTEGER)) {
    startingNumber = Number(startingNumber)
  }
  
  // 添加5s超时处理
  const t = setTimeout(() => {
    // 终止线程
    worker.terminate()  
    res.status(408).json({ message: 'request time out'})
  }, 5000)
  
  // 衍生worker线程
  const worker = new Worker('./calc.js', { workerData: {count, startingNumber} })
  worker.on('message', (primes) => {
    clearTimeout(t)
    res.json({
      primes,
      time: ((performance.now() - start)/1000).toFixed(2)
    })
  })
})

// calc.js
const { workerData, parentPort } = require('worker_threads')
const generatePrimes = require('./prime-generator')
const primes = generatePrimes(workerData.count, workerData.startingNumber)
parentPort.postmessage(primes)
```







#### thread pool

`UV_THREADPOOL_SIZE`  线程池中线程数量

异步文件操作api、异步加密api、异步压缩api



对于cpu密集型任务，多线程相对单线程会缩短执行时间

- 生成质数、图/音/视频处理、加解密、压缩【线程处于运行态】

对于io密集型任务，node本身处理的很好

- 进程通信、处理网络请求（网卡）、读写文件【线程处于sleep态】
  - 异步压缩、异步加密？？？
  - promise.all()  并行本质是多线程吗？太多的promise同时执行，会耗尽内存





利用worker_threads模块开发线程池

```js
const Pool = require('./pool.js')
const numWorkers = 4
const pool = new Pool(numWorkers)

pool.submit('generatePrimes', { count:2, start:1_000_000 }, (primes) => console.log(primes))
```



```js
// pool.js
const { Worker } = require('worker_threads')
class Pool {
  constructor(threadCount) {
    this.threadCount = threadCount
    this.threads = []   // 所有worker threads
    this.idleThreads = []  // 空闲worker threads
    this.scheduledTasks = []
    for(let i=0; i<threadCount; i++) {
      this.spawnThread()
    }
  }
  spawnThread() {
    const worker = new Worker('./calc.js')
    // worker任务完成时会监听到message事件
    worker.on('message', (res) => {
      this.idleThreads.push(worker)
      // 执行task对应回调
      worker.currentTask.callback && worker.currentTask.callback(res)
      this.runNextTask()
    })
    this.threads.push(worker)
    this.idleThreads.push(worker)
  }
  
  submit(taskName, options, callback) {
    this.scheduledTasks.push({taskName, options, callback})  
    this.runNextTask()
  }
  
  runNextTask() {
    if(this.scheduledTasks.length > 0 && this.idleThreads.length > 0) {
      const { taskName, options, callback } = this.scheduledTasks.shift()
      const worker = this.idleThreads.shift()
      worker.currentTask = { taskName, options, callback }  // 将worker正在执行的任务挂载在worker对象上
      worker.postMessage({ taskName, options })
    }
  }
}
module.exports = Pool
```



```js
// calc.js
const { parentPort } = require('worker_threads')
const generatePrimes = require('./prime-generator')

parentPort.on('message', ({ taskName, options }) => {
  switch(taskName) {
    case 'generatePrimes':
      const primes = generatePrimes(options.count, options.start)
      parentPort.postMessage(primes)
      break
    default:
      parentPort.postMessage('unknown task')
  }
})
```



- 问题一：当submit了大量的任务，且任务的执行时间短时，cpu利用率低，没有达到预期的100%
  - 主线程执行大量的回调，事件循环一直被激活，会造成主线程阻塞（程序计数器动不了

- 事件循环利用率：`performance.eventLoopUtilization()` 

  - ```js
    idle:
    active:
    utilization: 
    ```

  - 





#### 事件循环

1、第一阶段

- pc程序计数器从上到下移动
- 主线程将异步任务交给libuv线程池的线程
- 当pc移动到第 5 行时，遇到process.nexttick，将回调推入nexttick & microtask queues

2、第二阶段

- pc移动到最底部，会执行nexttick & microtask queues 中的所有回调函数
  - process.nextTick()
  - microtask ==》 promise.resolve() 
  - **优先级极高，在主线程执行另一个回调或进入下一个队列前执行**

3、第三阶段

- **事件循环建立**

- libuv线程完成异步任务，将对应回调推入到 callback queues，主线程将回调函数挨个弹出并执行
  - 弹出 settimeout CB，此时pc会移动至第 4 行
  - 弹出 write CB, pc会移动至第 2 行

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250908103627368.png" alt="image-20250908103627368" style="zoom:40%;" />

check ==》setImmediate

timer ==》 setTimeout

poll ==》 fs

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250908140744776.png" alt="image-20250908140744776" style="zoom:40%;" />



```js
const { performance } = require("perf_hooks");
for (let i = 0; i < 10_000_000_000_000; i++) {
  if (i % 100_000_000 === 0) {
    console.log(performance.eventLoopUtilization());
  }
}
// { idle:0, active:0, utilization: 0} 三个值都是0
主线程执行代码，处于第一阶段
```

```js
setImmediate(() => {
  for (let i = 0; i < 10_000_000_000_000; i++) {
    if (i % 100_000_000 === 0) {
      console.log(performance.eventLoopUtilization());
    }
  }
}) 
// { idle:0, active:1154, utilization: 1} 
// { idle:0, active:1243, utilization: 1} active越来越大，idle为0，utilization为1 
callbak queues, 处于第三阶段，事件循环的活跃状态
```

```js
process.nextTick(() => {
  for (let i = 0; i < 10_000_000_000_000; i++) {
    if (i % 100_000_000 === 0) {
      console.log(performance.eventLoopUtilization());
    }
  }
}) 
// { idle:0, active:0, utilization: 0} 三个值都是0
nextTick queue，处于第二阶段，在事件循环之前
```





例子一

```js
setTimeout(() => {
  console.log('A')
})
setTimeout(() => {
  setImmediate(() => {
    console.log('D')
  })
  process.nextTick(() => {
    console.log('B')
  })
})
setTimeout(() => {
  console.log('C')
})

// ABCD 或 ABDC
```





例子二

setImmediate的执行时机

- 在非i/o回调中，下一个tick的check阶段执行

```js
setTimeout(() => {
  console.log('A')
})
setImmediate(() => {
  console.log('B')
})

// AB 或 BA
```

- 在i/o回调中，当前tick的check阶段执行

```js
const fs = require("fs");
fs.readFile("./demo.txt", (err, data) => {
  setTimeout(() => {
    console.log("B");
  }, 0);
  setImmediate(() => {
    console.log("A");
  });
});
// AB
```







# 加密crypto

Cipher 密码

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250908182540865.png" alt="image-20250908182540865" style="zoom:40%;" />



### 对称加密

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250908181747799.png" alt="image-20250908181747799" style="zoom:50%;" />



#### 一次一密（One-Time Pad）

- 密钥真随机
- 密钥与明文等长
- 密钥绝对一次一用（

```js
const crypto = require('crypto')
const fs = require('fs')
const key = crypto.randomBytes(100)  // 100 bytes of random data 
// 加密
function encrypt(plaintext) {
  const ciphertext = Buffer.alloc(plaintext.length)
  for(let i=0; i<plaintext.length; i++) {
    ciphertext[i] = plaintext[i] ^ key[i]
    key[i] = 0
	}
  return ciphertext  
}

// 解密 
function decrypt(ciphertext) {
  const plaintext = Buffer.alloc(ciphertext.length)
  for(let i=0; i<ciphertext.length; i++) {
    plaintext[i] = ciphertext[i] ^ key[i]
    key[i] = 0
	}
  return plaintext.toString('utf-8')
}

// 如果A ⊕ B = C, 那么C ⊕ B = A, 并且C ⊕ A = B
```





#### AES

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250909110320846.png" alt="image-20250909110320846" style="zoom:33%;" />









----------------------------------------------------

io : dns ops

















