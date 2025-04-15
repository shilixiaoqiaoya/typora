##### 同步读写文件

```js
const fs = require('fs')
// 读
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
console.log(textIn)

const textOut = `${textIn}\nCreated on ${Date.now()}`
// 写 
fs.writeFileSync('./txt/output.txt', textOut)
```



##### 异步读写文件

```js
fs.readFile('.txt/start.txt', 'utf-8', (err, data) => {
  console.log(data)
})

fs.writeFile('./txt/final.txt', '这是被写入的文本', 'utf-8', err => {
  console.log('文本已被写入')
})
```



##### 单线程 single thread 

- 所有用户共用一个线程？？？

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250404103218902.png" alt="image-20250404103218902" style="zoom:30%;" />



##### createServer

```js
const http = require('http')
const server = http.createServer((req, res) => {
	res.end('Hello from the server')
})
server.listen(8000, '127.0.0.1', () => {
	console.log('listening to requests on port 8000')
})
```





##### 路由

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



