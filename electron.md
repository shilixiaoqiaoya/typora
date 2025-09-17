## 主进程和渲染进程



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250911120301092.png" alt="image-20250911120301092" style="zoom:40%;" />

默认情况下，html加载完且dom渲染完时浏览器窗口会抛出ready-to-show事件

由于浏览器窗口会在ready-to-show事件触发前显示，导致出现闪烁【白屏 --> dom被渲染】

如何解决？

```js
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  show: false
})
mainWindow.once('ready-to-show', () => {
  mainWindow.show()
})
```





## 程序生命周期

node主进程来管理electron程序的生命周期

- 初始化、就绪态、运行态、退出
- 退出事件触发顺序：`window-all-closed`  `before-quit`  `will-quit`  `quit`

```js
const { app } = require('electron')

// ready
app.on('ready', () => {
  console.log('App is ready')
  createWindow()
})
	// 等同于
app.whenReady().then(() => {
  createWindow()
})

// window-all-closed  关闭所有窗口
app.on('window-all-closed', () => {
  console.log('all windows closed')
  // 非macos，需要关闭应用
  if(process.platform !== 'darwin') {
    app.quit()
  }
})

// will-quit（所有窗口已经关闭，做清理操作）
app.on('will-quit', () => {
  console.log('app will quit')
})

// quit
app.on('quit', (event, exitCode) => {
  console.log(`App quit with code: ${exitCode}`)
})

// activate 
	// 仅在macos触发，每次点击程序坞的icon时
app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
```





## ipc通信

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250911192802609.png" alt="image-20250911192802609" style="zoom:40%;" />



#### ipcMain Module

```js
// 监听渲染进程发送的消息
ipcMain.on(channel, listener)

// 处理渲染进程的 invoke()
ipcMain.handle(channel, listener)

ipcMain.once(channel, listener)

// 移除特定监听器
ipcMain.removeListener()
```





#### ipcRenderer Module

```js
ipcRenderer.send(channel, ...args)

ipcRenderer.invoke(channel, ...args)  // 返回值是一个promise  

ipcRenderer.on(channel, listener)
ipcRenderer.once(channel, listener)

ipcRenderer.removeListener()
```





#### 通信

- **fire-and-forget communication**

```js
ipcMain.on('save-file', (event, data) => {
  console.log('save file with data', data)
})

// 不阻塞渲染进程
ipcRenderer.send('save-file', fileData)

____________________________

// 【不推荐】
ipcMain.on('save-file', (event, data) => {
  console.log('save file with data', data)
  event.returnValue = 'hello'  // 已弃用
})

// 会阻塞渲染进程，直至主线程返回响应
const res = ipcRenderer.sendSync('save-file', fileData)
console.log(res)
```

- **请求-响应模式通信**

  - Invoke-handle

  ```js
  ipcMain.handle('get-app-version', (event, data) => {
    return app.getVersion()
  })
  
  const version = await ipcRenderer.invoke('get-app-version')
  console.log(version)
  ```

  - event.reply()、event.sender.send()

  ```js
  ipcMain.on('get-status', (event) => {
    // 两种给渲染进程发消息的方式
    event.reply('status-response', 'data from main')
    event.sender.send('status-response', 'data from main')
  })
  
  ipcRenderer.on('status-response', (event, status) => {
    console.log('renderer received', status)
  })
  ```


- 主进程向渲染进程发消息

```js
mainWindow.webContents.send('xxx', 'xxx')
```







## preload

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250915172821610.png" alt="image-20250915172821610" style="zoom:30%;" />

- 将node api以一种安全的方式提供给渲染进程
- nodeIntegration: true、contextIsolation: false设置之后，在渲染进程/window的控制台可以使用node api，比如利用fs模块来处理文件，很不安全
- 所以要设置nodeIntegration: false、contextIsolation: true，这样渲染进程不能使用require来引入ipcRenderer，需要使用预加载脚本来安全暴露node api

```js
// main.js
const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false
    contextIsolation: true
  }
})

// preload.js
const { ipcRenderer, contextBridge } = require('electron')
contextBridge.exposeInMainWorld('api', {
	sendMessage: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  receiveMessage: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => {
      callback(...args)
    })
  }
})

// renderer.js
window.api.sendMessage(...)
```





## shell

- 用于与操作系统外壳（shell）交互的api模块

- 在浏览器打开url、在finder打开文件、将文件移动到废纸篓







## desktopCapturer

- 屏幕捕获

```js
// main.js
const { desktopCapturer } = require('electron')
ipcMain.on('capture-request', async (event) => {
  const screens = await desktopCapturer.getSources({ types: ['screen'] })
  const buffer = screens[0].thumbnail.toPNG()
  event.reply('captue-response', buffer)
})

// preload.js
const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('screenshotAPI', {
  requestCapture: () => ipcRenderer.send('capture-request'),
  onCapture: (callback) => ipcRenderer.on("captue-response", (event, data) => {
  	callback(data)
	})
})

// renderer.js
document.getElementById('capture-btn').addEventListener('click', () => {
  window.screenshotAPI.requestCapture()
})
window.screenshotAPI.onCapture((buffer) => {
  const blob = new Blob([buffer], { type: 'image/png' })
  const url = URL.createObjectURL(blob)
  document.getElementById('img-screenshot').src = url
})
```





















