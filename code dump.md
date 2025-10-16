编译型语言

- 被编译器编译为可执行文件
- 可执行文件运行时，在内存中有对应进程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250822174500538.png" alt="image-20250822174500538" style="zoom:50%;" />

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250822174756100.png" alt="image-20250822174756100" style="zoom:50%;" />

解释型语言

- 被解释器解释
- 以node执行demo.js为例，node是可执行文件，而demo.js放在进程的heap部分

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250822174904305.png" alt="image-20250822174904305" style="zoom:50%;" />





多线程

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250917165040851.png" alt="image-20250917165040851" style="zoom:30%;" />

- 各线程有独立的程序计数器、cpu状态、栈
- 共享同一地址空间下的指令集（代码）

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250917164849556.png" alt="image-20250917164849556" style="zoom:30%;" />

- 同一个进程，不同线程的程序计数器可以指向同一内存地址，意味着程序的某些代码片段并发执行

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250917170632844.png" alt="image-20250917170632844" style="zoom:30%;" />

- 【**操作系统会限制单个进程的最大内存使用**】
- 进程的地址空间分为几部分
  - TEXT
    - 代码段
    - 存储程序的可执行代码（机器指令）
    - 是只读的，在程序运行期间不会改变
  - DATA
    - 数据段
    - 存储全局变量
    - 内容在程序运行期间可以修改
  - HEAP
    - 堆段
    - 存储动态分配的内存（malloc函数、new实例化）
    - **注意：避免堆内存泄漏，忘记释放动态分配的内存**
  - STACK
    - 存储函数调用信息，管理函数调用的执行流程
    - 存储临时变量和函数参数
    - **注意： 避免栈溢出，递归过深或局部变量过大**，默认栈空间最多8MB



终端快捷键

- Ctrl+a 光标定位到最前面
- ctrl+e 光标定位到最后面

命令 uname -a ：查看电脑cpu架构

![image-20251011164932471](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251011164932471.png)



nvm 为特定项目使用某个版本node

- 新建.nvmrc文件，内容是所使用的node版本；
- 每次输入nvm use，就可以使用.nvmrc文件中的版本





<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251013172351207.png" alt="image-20251013172351207" style="zoom:30%;" />

**c、 c++ 可以控制硬件**，可以访问文件，可以发送网络请求。javascript不可以

- 图片/视频编辑软件，需要最大程度控制硬件，需要高性能，通常是c++编写



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20251013180422865.png" alt="image-20251013180422865" style="zoom:33%;" />

- javascript由js引擎来转化为机器码





当主线程和事件循环中都无任务时，node进程会退出

```js
// 下面代码，node进程不会退出
	// 事件循环中有任务：每当有新请求时，libuv会捕获到这个请求，通知事件循环，回调会被放入任务队列
server.listen(3000, '127.0.0.1', () => {
  console.log('open server on', server.address())
})
```



libuv为js赋予了处理文件、进行网络请求的能力

网络请求不使用libuv的线程池？？？文件处理使用线程池

nodejs正尽量减少使用线程，避免占用大量硬件资源



















