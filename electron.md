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





ipc通信

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250911192802609.png" alt="image-20250911192802609" style="zoom:40%;" />



ipcMain module

- 处理由渲染进程发来的消息

```js
// 监听渲染进程发送的消息
ipcMain.on(channel, listener)

// 处理渲染进程的 invoke()
ipcMain.handle(channel, listener)

ipcMain.once(channel, listener)

// 移除特定监听器
ipcMain.removeListener()
```



```js
// fire-and-forget communication
ipcMain.on('save-file', (event, data) => {
  console.log('save file with data', data)
})

ipcRenderer.send('save-file', fileData)
```



```js
// 请求-响应模式通信
ipcMain.handle('get-app-version', async () => {
  return app.getVersion()
})

const version = await ipcRenderer.invoke('get-app-version')
console.log(version)
```





ipcRenderer Module

```js
ipcRenderer.send(channel, ...args)

ipcRenderer.invoke(channel, ...args)  // 返回值是一个promise  

ipcRenderer.on(channel, listener)
ipcRenderer.once(channel, listener)

ipcRenderer.removeListener()
```



