 

三大原则

- 响应式
- 可维护性和可扩展性
- 网络性能





b标签用  strong标签代替

i标签用  em标签代替

html实体  版权  ---》 &copy;

css实现大写：text-transform: uppercase

line-height:  

- 不带单位，默认值是1，同字体的大小
- 带单位，指定具体行高

text-align

列表： list-style: 可以设置小点 的样式

a:link  只针对有href属性的a标签  

margin-bottom要比margint-top更合理

设置了一张图片的宽度，长度设为auto，就可以保持长宽比

实现水平居中 margin: 0  auto

**行内级元素padding和margin左右生效，上下不生效**

button默认 display: inline-block

伪元素 

- :: first-letter 比如h1元素内容第一个字
- :: first-line  比如p元素内容的第一行
- ::before   ::after



伪类  :hover  :active可以作用于任何元素



div默认情况下 宽度占父元素100%可用宽度，一旦脱离标准流，width由内容撑开

span元素通过display为block去占据整行



通配符选择器：为所有元素应用某种样式  box-sizing: border-box

align-items： 默认值normal，行为同stretch，拉伸子元素高度和父元素高度一样

align-self:  子元素的该属性可以覆盖父元素的align-items

flex里面width属性用flex-basis代替，更加规范



grid

- 构建二维布局，有横轴和纵轴（不能改变

- Grid container  

  - Gird-template-columns: 显式设置几列及其宽度
  - Grid-template-rows: 显式设置几行及其高度
    - 1 fr，代表1个fraction，类似于flex为1
  - Justidy-content: 设置横轴布局
  - Align-content: 设置纵轴布局
  - Justify-items: 设置item在cell里的水平布局
  - Align-items: 设置item在cell里的垂直布局
  - gap
    - column-gap
    - Row-gap

- grid items

  - grid-column
  - gird-row
  - Justify-self: 覆盖justify-items
  - Align-self: 覆盖align-items

  

```css
display: grid
// 分为四行
grid-template-columns：200px 200px 100px 150px
// 分两行
frid-template-rows: 300px 200px
```



![image-20250115132436214](/Users/tal/Library/Application Support/typora-user-images/image-20250115132436214.png)



background

- background-image:url()
- background-size: cover
- Background-position: top/center/bottom



clip-path

- 使用裁剪的方式创建元素的可显示区域，区域内的部分显示，区域外的隐藏



css动画

- 分析动画的开始状态和结束状态
- **animation-fill-mode: backwards  延迟动画后，在动画开始前使元素样式和0%保持一样**

```css
// 在某个元素上应用这个动画
.element {
  animation-name: moveInLeft;
  animation-duration: 3s;
  // 动画循环次数 animation-iteration-count: 3
  // animation-timing-function: ease-out
}

// 在icon被hover的时候应用动画
.icon:hover {
  animation: moveInLeft 3s ease-out
}

// 关键帧动画
@keyframes moveInLeft {
  0% {
    opacity: 0；
    transform: translateX(-100px)
  }
  80% {
     transform: translateX(10px)
  }
  100% {
    opacity; 1；
    transform: translateX(0)
  }
}
```



- 按钮hover上去

  ```css
  .btn{
    position: relative
  }
  .btn:after {
    content: '';
    display: inline-block;
    width: 100%;    // 相对于btn宽度
    heigth: 100%;
    bacground-color: #fff;
    border-radius: 100px；
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    transition: all .4s
  }
  .btn:hover:after {
    transform: scale(1.5)
    opacity: 0
  }
  ```

  





强制让某个属性可以被继承

```css
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: inherit
}
body {
  box-sizding: border-box
}
```





堆叠上下文

- 定位元素的z-index 



scss定义css变量：  $开头







Vscode 输入lorem 会有一长串英文（假文本

选中某个单词 command+d  可以同时选中下一个一样的值
