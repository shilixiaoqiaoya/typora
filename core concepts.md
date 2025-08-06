# 字符集

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

- **使用流，写入硬件一次，不使用流，写入硬件n次**

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





### dns

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







### UDP

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



























