#  字符集

### unicode

- 一个**国际标准**，旨在为世界上所有语言的字符提供统一编码方案
- 字符集大小，目前10万加
- 覆盖范围：包含世界上所有语言的字符、表情符号等
- 编码方式
  - **utf-8：完全兼容ascii，1-4字节表示一个字符**
  - Utf-16：2/4 字节表示一个字符
  - Utf-32:  4 字节表示一个字符
- eg： s 对应数字115(十进制)





### ASCII

- 字符集大小，共128个字符
- 覆盖范围：**（英语）**主要包含英文字母、数字、标点符号等
- **每个字符占据1字节（8位**
- eg： s 对应数字115





# buffer缓冲区 

### 基本概念

- **一块内存空间，用于按字节存放二进制数据**
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

- 电脑上所有东西都是文件

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728152206100.png" alt="image-20250728152206100" style="zoom:40%;" />



- 比如一个应用程序，双击**「Unix可执行文件」**即可运行，**可执行文件是特定于操作系统和cpu类型的**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250728153654760.png" alt="image-20250728153654760" style="zoom:40%;" />



- 当nodejs打开一个文件时，是libuv调用操作系统提供的系统调用函数open()，操作系统控制硬件

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
  - 执行系统调用open()时，会给文件分配一个数字，也就是文件描述符
  - 执行系统调用read()时，会从磁盘读取数据进入内存



- 三种代码编写方式：**promises API**、callback API、synchronous API

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
      fileHandle = await fs.open(path, 'r')
    } catch(err) {
      fileHandle = await fs.open(path, 'w')
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
  
  // 监听文件
  const watcher = fs.watch('./command.txt')
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

- 向一个`.txt`文件写入字符十万次，使用`fs.open()`的promise和回调两种方式
  - 实测发现：回调执行时间要比promise执行时间短

```js
// 执行时长8s; cpu: 100%(one core); memory: 50mb
(async () => {
  console.time('writeMany')
  const fileHandle = await fs.open('test.txt', 'w')
  for(let i=0; i<1000000; i++) {
    await fileHandle.write(` ${i} `)
  }
  console.timeEnd('writeMany')
})()

// 执行时长1.2s; cpu: 100%(one core); memory: 50mb
console.time('writeMany')
fs.open('test.txt', 'w', (err, fd) => {
  for(let i=0; i<1000000; i++) {
    fs.writeSync(fd, ` ${i} `)
  }
  console.timeEnd('writeMany')
})


// 执行时长750ms; 非常非常占用cpu和memory(write操作向事件循环推入大量的回调，内存会爆满）
console.time('writeMany')
fs.open('test.txt', 'w', (err, fd) => {
  for(let i=0; i<1000000; i++) {
    fs.write(fd, ` ${i} `, () => {})
    console.timeEnd('writeMany')
  }
})
```



- promise结合stream
  - 执行速度很快，但是内存占用高

```js
// 执行时长150ms，memory: 150mb
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

- 普通文件流，内部缓冲区默认大小：64KB 

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



- promise结合stream, 监听streamWrite的drain事件
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
      i++
      if(!stream.write(buff)) break
    }
  }
  writeMany()
  stream.on('drain', () => {
    writeMany()
  })
})()
```

- StreamWrite.end('最后的数据')：会触发finish事件
- streamWrite.on('finish', () => {}) ：所有数据都已写入到底层目标，可写流不再接收新数据，缓冲区已清空







### 可读流

- 可读流会维护一个缓冲区，用于临时存储从底层资源（如文件、网络）读取的数据

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250729181100564.png" alt="image-20250729181100564" style="zoom:40%;" />

- 实现文件复制

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



#### pipe()

- `readable.pipe(destination)`
- **有背压控制**
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





#### pipeline()

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







### 模拟实现可读可写流

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

  - 使用`filehandle.read()`, 缓冲区大小是16KB

  ```js
  // memeory usage: 20mb
  // exec time: 1s
  (async () => {
    const destFile = await fs.open('text-copy.txt', 'w')
    const srcFile = await fs.open('text.txt', 'r')
    let bytesRead = -1
    while(bytesRead !== 0) {
      const res = await srcFile.read()
      bytesRead = res.bytesRead
      destFile.write(res.buffer)
    }
  })()
  ```

  





### fs.readFile()和fs.writeFile()

- 基于系统调用，一次性操作，不是基于流的方式







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





## 实现chatApp

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





## dns

```js
const dns = require('dns/promises')
(async () => {
  const res = await dns.lookup('google.com')
  console.log(res)  // { address: '8.7.198.46', family:4 }
})()
```



- cat /etc/hosts

  - 查看本地域名与ip的静态映射，优先级高于dns查询
  - 使用场景
    - 本地开发测试，将域名临时指向本地IP，绕过DNS解析

  - 安全性：恶意程序可能篡改此文件以劫持域名【dns劫持】

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250804143347134.png" alt="image-20250804143347134" style="zoom:40%;" />



## 实现uploader

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
      socket.pause()
      const filePath = path.resolve(__dirname, 'storage', 'text.txt')
      fileHandle = await fs.open(filePath, 'w')
      fileStream = fileHandle.createWriteStream()
      fileStream.write(chunk)
      socket.resume()
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
    // 下面两行代码非常重要，若没有，第二次连接时会尝试写入已关闭的fd，导致错误
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
  if (newUploadedPercent !== uploadedPercent) {
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



- tcp连接本质上是用户主机上的应用程序（客户端）与服务器上的服务应用程序（服务端）之间建立的端到端通信链路
  - 客户端：用户设备上的应用程序（浏览器、app、curl）
  - 服务端：服务器上运行的特定服务（如nginx、api服务）



### http模块

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250811140555528.png" alt="image-20250811140555528" style="zoom:40%;" />

- server  

```js
const http = require('http')
const server = http.createServer()
server.on('request', (request, response) => {
  // 打印请求方法、url、请求头
  console.log(request.method, request.url, request.headers)
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



- client

```js
// agent对应于特定的一个tcp连接
const agent = new http.Agent({ keepAlive: true })
// request是双工流
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

- **Connection: keep-alive** 多个请求复用一个tcp连接

- 媒体类型**content-type**

  - 是必需的，决定了浏览器以何种方式处理文件，比如css文件会渲染到页面，js文件会被执行
  - 值是 `type/subtype`
  - 以.png为例，对应二进制数据中，开头一连串**magic number**`89 50 4e 47 0d 0a 1a 0a`表明它是.png文件类型

- 请求方法head

  - 快速获取资源的元信息，**只返回响应头**，比如看资源的类型（content-type）、大小（content-length）
  - 可以节省带宽，尤其对大文件（如视频）的元数据查询非常有效

- 301 重定向状态码

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

  



### web server

- 返回html、css、js文件【文件路由】
- 除了文件路由，还有一种json路由

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
})
server.listen(9000, () => {
	console.log('server listening on http://localhost:9000')
})
```

```html
<html>
  <head>
  	<link href='styles.css'/>  // 浏览器会发送请求 'http://localhost:9000/styles.css'
  </head>
  <body>
    <h1>hello world</h1>
		<script src='scripts.js'></script>  // 浏览器会发送请求 'http://localhost:9000/scripts.js'
  </body>
</html>
```

- 代码有问题，需检查 ！！！

```js
  // json路由，上传功能
  if(request.url === '/upload' && request.method === 'POST') {
    response.setHeader('Content-Type', 'application/json')
   	const fileHandle = await fs.open('./storage/image.jpg', 'w')
  	const fileStream = fileHandle.createWriteStream()
   	request.pipe(fileStream)
   	fileStream.on('finish', async () => {
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









### 疑问

tcp连接，数据包，是代码里对应的chunk吗

客户端每次write会触发服务端的data事件









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































































