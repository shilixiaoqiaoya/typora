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
- `.js`文件逻辑

```js
const fs = require('fs/promises')

(async () => {
  // 打开文件
  const fd = await fs.open('./command.txt', 'r')
  
  fd.on('change', async () => {
    // 获取文件大小
    const fileSize = (await fd.stat()).size
    // 分配大小适合的缓存区,避免内存浪费
    const buff = Buffer.alloc(fileSize)
    // 将文件内容放入缓冲区
    await fd.read(buff)
    // 对二进制数据解码
    console.log(buff.toString())
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







