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

