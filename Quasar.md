# Quasar

![image-20241226215320383](/Users/tal/Library/Application Support/typora-user-images/image-20241226215320383.png)

 ### boot文件夹

- quasar-cli 搭建的项目无main.ts，boot文件夹代替main.ts

```js
import { boot } from 'quasar/wrappers';
import VueMathjax from 'vue-mathjax-next';

export default boot(({ app, router, store }) => {
  app.use(VueMathjax);
});
```

- 在quasar.config.ts 做对应添加

```js
boot: ['axios', 'bus', 'vant', 'unocss']
```

- 可以做以下工作

  - 安装vue插件： app.use()
  - 添加全局mixin： app.mixin()
  - 在globalProperties上添加属性以方便访问：this.$axios

  ```js
  app.config.globalProperties.$axios = axios
  ```

  

  - router相关，比如router.beforeEach()进行身份验证

    



### 程序启动过程

1. quasar初始化（组件、指令、插件、quasar图标集）
2. quasar css和应用的全局css被导入
3. app.vue被加载
4. pinia被注入到Vue应用实例中
5. router被注入
6. 导入boot files 
7. 如果处于Electron模式，Electron被导入并注入到Vue原型中
8. 使用根组件实例化Vue并附加到dom





### 环境变量env

- process.env.DEV  布尔值 是否为开发环境

- 两个作用
  - 在开发、生产环境使用不同的环境变量
    - .env.test 文件
    - .env.online 文件
  - 一些敏感的字段
    - **利用第三方库dotenv 帮助解析 .env 文件**
- 修改环境变量需要重启服务

<img src="/Users/tal/Library/Application Support/typora-user-images/image-20250101135351209.png" alt="image-20250101135351209" style="zoom:50%;" /> 







### 原子类

- 类似于unocss
- 更好的跨端 breakpoints 







###  暗黑模式

















eslint规则 

- No-unused-vars: ‘off'  黄线提示



.gitignore文件

- **dist文件夹代码不会被git管理**
- .env 文件 





