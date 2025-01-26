- 移动端1px的边框如何实现：伪元素+scale

```css
:before {
 		content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%
    height: 200%
    transform: scale(0.5)
    transform-origin: 
}
```

- 2x，3x图像，resolution特性 配合@media媒体查询

- 合成层 如何触发？ GPU硬件加速

  【**分层确实可以提高性能，但是是以内存管理为代价的**】

- 跨域：静态资源服务器和API服务器不是同一个造成的

  - 部署在同一个服务器中
  - cors：access-control-allow-origin
    - 服务器会标识哪些origin，使得浏览器允许这些origin访问加载自己的资源
  - node代理服务器【开发 webpack/vite server】http-proxy
  - nginx反向代理 【部署】
    - **nginx仅仅代理API服务器，给nginx服务器配置CORS**
    - **nginx代理了静态资源和API服务器**
  - 没有同源策略，恶意网站很容易通过脚本去访问另一个网站的敏感数据

- 正向代理：代表客户端向服务器发起请求

- 反向代理：代表服务器接受来自客户端的请求

  - 可做**负载均衡**，反向代理将接收到的请求分散到多个后端服务器上，提高响应速度

- 浏览器事件循环：是一个在js引引擎和渲染引擎之间协调工作的机制

  - 执行当前宏任务
  - 检查执行所有微任务，微任务队列被清空
  - 渲染更新界面
  - 下一个宏任务

- 宏任务：ajax请求、Ui渲染【首先执行的script脚本可以看做宏任务，‘宏大’】

- node事件循环

- **宏任务：timer，IO事件，setImmediate，close事件**

- **微任务：promise的then回调，process.nextTick，queueMicrotask **

  - 【微任务队列有2个】
  - **next tick queue**: process.nextTick
  - other queue: promise的then(catch)(finally)回调，queueMicrotask

- process.nextTick()：是一个在事件循环的各个阶 段/各个宏任务之间允许开发者插入操作的功能

  - 因为其**具有极高的优先级**