webpack支持多种模块化，会将代码中的多种模块化方式转为webpack_require

当代码量很高时，需要很长时间才可以启动开发服务，hmr也耗时



vite基于es mudule



yarn create vite

- 利用脚手架`create-vite`，搭建项目
- 项目构建工具是vite



- Es module应用于浏览器端

不使用构建工具的情况下，import路径只能是相对路径或绝对路径

`import _ from 'lodash'`会报错，浏览器不会去node modules下查找lodash

如果浏览器去node modules下查找lodash，可能lodash还依赖其它文件，会导致请求大量的js文件（网络多包传输的性能问题）

```js
import _ from 'lodash'  
// Uncaught TypeError: Failed to resolve module specifier "lodash". Relative references must start with either "/", "./", or "../".
```



- commonjs应用于node端

不使用构建工具的情况下，可以通过require引入lodash，是因为node会去内存里读node modules下文件

```js
const _ = require('lodash')
```





- 依赖预构建

  - esbuild会对非esmodule规范的代码进行转换，转为遵循esmodule规范的代码
  - 转换后的代码会被放在当前目录下的 node-modules/.vite/deps 文件夹
  - 在引入lodash时，vite会对其做路径补全，所以浏览器不会报错

  ```js
  import _ from '/node-modules/.vite/deps/lodash.js'
  ```

  - 为避免浏览器请求瀑布流，预构建时会对依赖文件进行集成
    - 引入的lodash文件，是包含其所有依赖代码的文件
    - 解决了网络多包传输的性能问题





vite-dev-server是基于node实现，处理资源和api请求

在浏览器看来，响应内容都是字符串，是根据content-type来进行解析

vite.config.js文件是在node端执行，可以使用esmodule规范（代码最终会被转为cjs规范，所以可以在node端运行）





dotenv库会读取`.env`文件，将文件中的变量注入到process.env中，process对象是node进程

根据mode变量，将`.env.development`、  `.env.production`中的变量分别注入到process.env中

客户端侧，环境变量会被注入到import.meta.env中

```shell
yarn dev  
等同于 yarn dev --mode development
会将`.env.development`文件的变量注入到process.env中（node端） 
```

```shell
yarn build  
等同于 yarn build --mode production
会将`.env.production`文件的变量注入到process.env 中
```







vite对css文件的处理（基于node）

- vite读取到main.js引用到了index.css
- 利用fs模块读取index.css中文件内容
- 创建一个style标签，将index.css文件内容copy进去，并将style标签插入到index.html中
- 将index.css文件中的内容替换为js脚本，同时设置content-type为text/javascript，方便浏览器解析



vite对css module的处理（基于node）

- module.css文件后缀
- 对文件中的类名进行一定规则的替换（如footer--> footer_123st），将替换后内容copy到style标签并插入到html中
- 同时创建一个映射对象{ footer: footer_123st }
- 将index.module.css文件中的内容替换为js脚本，**默认导出创建的映射对象**















