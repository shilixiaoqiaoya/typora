疑问1：

![image-20250403144328316](https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250403144328316.png)



vue的watch对应useEffect???

computed对应derived state???





# Udemy Jonas

### component composition

- 利用chilren prop的特性
- 封装高复用性和灵活的组件

```js
function Success() {
  return <p>well done!</p>
}
function Error() {
  return <p>This went wrong!</p>
}
// modal组件受限制，只能展示成功信息
function Modal() {
  return (
  	<div className='modal'>
    	<Success/>
    </div>
  )
}
// 通过children，提高modal组件的可复用性
function Modal({ children }) {
  return (
  	<div className='modal'>
    	{ children }
    </div>
  )
}
<Modal><Success/></Modal>
<Modal><Error/></Modal>
```

- 解决props过度下钻的问题，组件层层嵌套改为插槽形式传入

```js
function App() {
  const [movies, setMovies] = useState([])
  return (
  	<>
    	<NavBar>
    		<NumResults movies={movies} />
    	</NavBar>
    	<Main>
    		<Box>
    			<MovieList movies={movies} />
    		</Box>
				<Box>
    			<WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
    		</Box>
    	</Main>
    </>
  )
}
```





### 封装星级评分组件

- 展示几颗星 ：maxRating ，默认值5
- 点击第几颗星对应展示几级，对应有几颗实心星
- 当在星上hover时，展示对应级别，如果没有点击动作，鼠标移走后保持之前的星级
  - **mouseenter和mouseleave事件**

```js
function StarRating({ maxRating = 5, onSetRating }) {
  const [rating, setRating] = useState(0)
  const [tmpRating, setTmpRating] = useState(0)
  const handleSetRating = (rating) => {
    setRating(rating)}
  	onSetRating(rating)
  }
  return (
  	<div>
    	<div>
    		{Array.from({length: maxRating}, (_, i) => {
          <Star key={i} 
          	onRate={() => handleSetRating(i+1)
    				full={tmpRating ? tmpRating >= i+1 : rating >= i+1}
					 	onHoverIn={() => setTmpRating(i+1)}
            onHoverOut={() => setTmpRating(0)}
					/>
        })}
    	</div>
			<p>{tmpRating || rating || ''}</p>
    </div>
  )
}

function Star({ onRate, full, onHoverIn, onHoverOut }) {
  return (
  	<span role='button' 
    			onClick={onRate}
					onMouseEnter={onHoverIn}
					onMouseLeave={onHoverOut}
		>
    	{full ? <full-star-svg> : <empty-star-svg>}
    </span>
  )
}
```

- 使用StarRating组件时，想知道组件的内部状态rating的值，怎么做？

```js
function Test() {
  const [testRating, setTestRating] = useState(0)
  return (
  	<StarRating onSetRating={setTestRating}/>	
		<p>This movie was rated {testRating} stars</p>
  )
}
```





### 界面呈现过程

- component ==>  react element  ==> dom element

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406175844827.png" alt="image-20250406175844827" style="zoom:40%;" />

- trigger触发渲染 ==》 render阶段 ==》 提交阶段 ==》 浏览器绘制

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406180217414.png" alt="image-20250406180217414" style="zoom:33%;" />     

- react内部render阶段，得到一颗更新后的fiber tree，和一系列dom更新的list
- 是异步的

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406182339926.png" alt="image-20250406182339926" style="zoom:40%;" />



<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406181849319.png" alt="image-20250406181849319" style="zoom:33%;" />



- 提交阶段：是同步的，为了保持数据和ui的一致性

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406182829093.png" alt="image-20250406182829093" style="zoom:33%;" />













# **React**

- **声明式编程**

  - 只需要维护自己的状态，当状态改变时，React可以根据最新的状态去渲染UI

- **多平台适配**





### react

- **包含react所必须的核心代码**

### react-dom

- **react渲染在不同平台所需要的核心代码**

- web端：react-dom会将jsx最终渲染成**真实的dom**，显示在浏览器中

- native端：react-dom会将jsx最终渲染成**原生的控件**（比如安卓的Button，ios中的UIButton）


### babel

- **将jsx转换成js代码的工具**

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250330105633613.png" alt="image-20250330105633613" style="zoom:33%;" />



### 库与框架

- vue、angular是框架
- react是库，可以自由选择其他第三方库来搭建应用

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406211258992.png" alt="image-20250406211258992" style="zoom:33%;" />















# 初体验

```jsx
// 引入三个包的CDN地址
<div id='root'></div>
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(<h2>Hello World</h2>)
```



- **类组件：定义一个类，类名大写，继承自React.Component**
- **实现当前组件的render函数，render函数返回的jsx内容，就是React帮助我们渲染的内容**
- **组件中的数据：**
  - **参与界面更新的数据：称为参与数据流，被定义在当前对象的state属性中**
  - **不参与界面更新的数据**
- **当数据发生变化时，调用`this.setState`来更新数据，React会重新调用render函数，渲染界面**

### 电影列表展示

```jsx
<div id='root'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                movies: ['大话西游', '盗梦空间', '星际穿越', '流浪地球']
            }
        }
        render() {
            return (
                <div>
                	<h2>电影列表</h2>
                	<ul>
                		{this.state.movies.map((item) => <li>{item}</li>)}
                	</ul>
                </div>
            ) 
        }
    }
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(<App/>)
</script>
```

### 计数器

```jsx
<div id='root'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                counter: 0
            }
        }
        render() {
            return (
                <div>
                	<h2>当前计数：{this.state.counter}</h2>
					<button onClick={this.increment.bind(this)}>+</button>
					<button onClick={this.decrement.bind(this)}>-</button>
                </div>
            )
        }
        increment() {
            this.setState({
                counter: this.state.counter + 1
            })
        }	
		decrement() {
            this.setState({
                counter: this.state.counter - 1
            })
        } 
    }
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(<App/>)
</script>
```



# JSX语法

**【是一种JS的语法扩展(eXtension)，也在很多地方称之为JavaScript XML（html in js）】**

**React认为渲染逻辑本质上与UI逻辑存在内在耦合** 

- 比如UI需要绑定事件（button、a原生等等）； 
-  比如UI中需要展示数据状态；
- 比如在某些状态发生改变时，又需要改变UI；

 **他们之间是密不可分，所以React没有将标记分离到不同的文件中，而是将它们组合到了一起，这个地方就是组件**





### 规范

- **JSX的顶层只能有一个根元素，所以我们会在外层包裹一个div（或者使用后面我们学习的Fragment）**
- **为了方便阅读，通常在jsx的外层包裹小括号()，并且jsx可以进行换行书写**
- **JSX中的单标签，必须以/>结尾；**

```jsx
<div id='root'></div>

const element = <h2>Hello World</h2>
const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(element)
```



### 注释

```jsx
render() {
            return (
                <div>
               		{/* 我是注释 */}
                	<h2>jsx中的注释书写</h2>
                </div>
            )
        }
```



### 嵌入变量

- **当变量是Number、String、Array类型时，可以直接显示**

- **当变量是null、undefined、Boolean类型时，内容为空**

  【如果希望可以显示null、undefined、Boolean，那么需要转成字符串；

  转换的方式有很多，比如toString方法、和空字符串拼接，String(变量)等方式】

- **对象类型不能作为子元素（objects are not valid as a React child）**

```jsx
<div id='root'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                //1、在{}中可以正常显示
                name: 'why',	//String
                age: 18,	//Number
                movies: ['盗梦空间'，'海贼王']	//Array
                
                //2、在{}中不可以正常显示(忽略)
                test1: null,	//null
                test2: undefined,	//undefined
                test3: true/false,	//Boolean
                
                //3、对象不能作为jsx的子元素
                friend: {
                	name: 'kobe',
                	height: 1.98
            	}
            }
        }
        render() {
            return (
                <div>
                	<h2>{this.state.test1}</h2>  //界面不显示
                
					<h2>{this.state.friend}</h2>  //会直接报错
                </div>
            )
        }
    }
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(<App/>)
</script>
```



### 嵌入表达式

- **运算表达式**
- **三元运算符**
- **执行函数**

```jsx
<div id='root'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                firstname: 'kobe',
                lastname: 'bryant',
                isLogin: true
            }
        }
        render() {
            const { firstname, lastname, isLogin} = this.state
            return (
                <div>
                	//运算符表达式
                	<h2>{firstname + ' ' + lastname}</h2>
                	<h2>{20 * 3}</h2>
                
                	//三元表达式
					<h2>{isLogin ? '欢迎回来' : '请先登录'}</h2> 
                
                	//函数调用
                	<h2>{this.getFullName.bind(this)}</h2>
                </div>
            )
        }
        getFullName() {
          return this.state.firstname + ' ' + this.state.lastname
        }
    }
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(<App/>)
</script>
```



### 绑定属性

- 普通属性
- classname
- style

```jsx
<div id='root'></div>
<script type='text/babel'>
    function getSizeImage(imgUrl, size) {
    	return imgUrl + `?param=${size}x${size}`
	}
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                title: '标题',
                link: 'http://www.baidu.com',
                isActive: true
            }
        }
        render() {
            const { title, imgUrl, link, isActive} = this.state
            
            // 字符串拼接
            const className = `abc cba ${isActive ? 'active' : ''}`
            // 数组
            const classList = ['abc', 'cba']
            if(isActive) classList.push('active')
            
            return (
                <div>
                	{/*绑定普通属性*/}
                	<h2 title={title}>标题</h2>
                    <a href={link}>百度一下</a> 

					{/*绑定class 【要写成className，因为class是类的关键字】*/}  
					<div className={className}>我是div</div>
					<div className={classList.join(' ')}>我也是div</div>

					{/*绑定style 【部分属性要写成小驼峰，不能用连接符】*/}
	          		<div style={{color: 'red', fontSize: '20px'}}>哈哈哈</div>
				</div>
            )
        }
    }
    const root = ReactDOM.createRoot(document.querySelector("#root"))
    root.render(<App/>)
</script>
```



#### classnames库

```jsx
import classNames from classnames

<h2 className={ classNames('foo', 'bar') }></h2>
<h2 className={ classNames('foo', {bar: true}) }></h2>
<h2 className={ classNames({'foo-bar': true}) }></h2>
<h2 className={ classNames({foo: true}, {bar: true}) }></h2>
<h2 className={ classNames({foo: true, bar: true}) }></h2>
```





### 绑定事件

- **通过bind给函数显式绑定this**
- **定义函数时采用箭头函数**
- **事件监听时传入箭头函数【推荐】**

**【代码最后要通过babel进行转化，转化后的代码是在严格模式下的，this不指向window，而是指向undefined】**

```jsx
<div id='app'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                message: '你好啊',
                counter: 100
            }
            
            //对需要绑定的方法，提前绑定好this
            this.btnClick = this.btnClick.bind(this)
        }
        render() {      
            return (
                <div>
                	{/*方式一：通过bind绑定this*/}
                	<button onClick={this.btnClick}>按钮</button>

					{/*方式二：定义函数时，使用箭头函数*/}
            		<button onClick={this.increment}>+1</button>

					{/*【推荐】方式三：直接传入箭头函数，在箭头函数中调用需要执行的函数 								this.decrement()是我们在调用，进行this隐式绑定*/}
                    <button onClick={() => {this.decrement()}}>-1</button>
				</div>
            )
        }
        btnClick(event) {
            console.log(this.state.message, event)
        }
		increment = () => {
            console.log(this.state.counter)
        }
        decrement() {
            console.log(this.state.counter)
        }     
    }
</script>
```



### 事件传参

- **事件监听时传入箭头函数，传参更容易**

```jsx
<div id='app'></div>
<script type='text/babel'>
    class App extends React.Component {
        constructor() {
            super()
        }
        render() {      
            return (
                <div>
                	<button onClick={this.btn1Click.bind(this)}>按钮1</button>

                    <button onClick={(e) => {this.btn2Click(e, 'why', 18)}}>按钮2</button>
				</div>
            )
        }
        btn1Click(event) {
            console.log('btn1Click', event)
        }
        btn2Click(event, name, age) {
            console.log('btn2Click', event, name, age)
        }
    }
</script>
```



### 条件渲染

- **if条件判断**
- **三元运算符**
- **与运算符&&：前面条件成立，渲染后面内容；前面条件不成立，不渲染后面内容**

```jsx
<div id='app'></div>
<script type='text/babel'>
      class App extends React.Component {
          constructor() {
              super()
              this.state = {
                  isLogin: false
              }
          }
          render() {
            let welcome = null
            if(this.state.isLogin) {
              welcome = <h2>欢迎回来</h2>
            } else {
              welcome = <h2>请先登录</h2>
            }
            return (
                <div>
                  {/*方案一：if判断*/}
                  { welcome }
                
                   {/*方案二：三元运算符*/}
                  <button onClick={e => this.loginClick()}>{this.state.isLogin ? '退出' : '登录'}</button>
				   {/*方案三：逻辑与：前面条件成立，渲染后面内容；前面条件不成立，不渲染后面内容*/}
				   <h2>{this.state.isLogin && '你好啊'}</h2>
                </div>
            )
          }
          loginClick() {
            this.setState({
              isLogin: !this.state.isLogin
            })
          }
      }
</script>
```



#### 实现v-show

- **控制display属性是否为none**

```jsx
<div id='app'></div> 
<script type='text/babel'>
      class App extends React.Component {
          constructor() {
              super()
              this.state = {
                  isShow: true
              }
          }
          render() {
            const { isShow } = this.state
            return (
                <div>
                  <h2 style = {{display: isShow ? 'block' : 'none'}}>实现v-show效果</h2>
                  <button onClick={() => this.toggleClick()}>切换</button>
                </div>
            )
          }  
          toggleClick() {
            this.setState({
              isShow: !this.state.isShow
            })
          }
      }
</script>
```



### 列表渲染

- **使用最多的是数组的高阶函数map**

```jsx
    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          students: [
            { id: 111, name: "why", score: 199 },
            { id: 112, name: "kobe", score: 98 },
            { id: 113, name: "james", score: 199 },
            { id: 114, name: "curry", score: 188 },
          ]
        }
      }

      render() {
        const { students } = this.state
        return (
          <div>
            <h2>学生列表数据</h2>
            <div className="list">
              {
            	// 分数大于100的学生进行展示，只展示两个人的信息
                students.filter(item => item.score > 100).slice(0, 2).map(item => {
                  return (
                    <div className="item" key={item.id}>
                      <h2>学号: {item.id}</h2>
                      <h3>姓名: {item.name}</h3>
                      <h1>分数: {item.score}</h1>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    }
```





### JSX的本质

- **jsx最终会被babel转换成React.createElement的函数调用**
- **createElement需要传递三个参数：**
  - **参数一：type，如果是标签元素，使用字符串来表示如div；如果是组件，使用组件名称**
  - **参数二：config对象，所有jsx中的属性以对象属性和值的形式存储在config中**
  - **参数三：children数组，存放在标签中的内容以元素方式存储在children数组中**
- **React.createElement()函数最终创建出来一个 ReactElement对象，即虚拟节点；**
- **ReactElement对象会组成JavaScript的对象树，即虚拟DOM树；**
- **再由root.render函数渲染成真实DOM**
- **【root.render让虚拟DOM和真实DOM同步起来，这个过程称为协调】**

```jsx
为什么使用虚拟DOM,而不是直接操作真实DOM？
1、很难跟踪状态的改变，不方便调试
2、性能较低
 	2.1、document.createElement创建出来的是一个非常复杂的对象
	2.2、DOM操作会引起浏览器的回流和重绘
```







### children prop

- **使用子组件时用双标签，中间内容jsx将作为「children的props」传给子组件**
- 作用同vue的插槽 

```js
function Button({ textColor, bgColor, children }) {
  return (
  	<button
    	style = {{ backgroundColor: bgColor, color: textColor }}
		>
        {chilren}
    </button>
  )
}

function App() {
  return (
  	<Button bgColor='red' textColor='white'>
    	<span> ← </span>
    </Button>
    <Button bgColor='green' textColor='black'>
    	<span> 👉🏻 </span>
    </Button>
  )
}
```

- 不使用children的名字，使用其他的prop代替

```js
function Button({ element }) {
  return (
  	<button>
        { element }
    </button>
  )
}

function App() {
  return (
    <Button element={<span> 👉🏻 </span>} />
  )
}
```





### state

- **批处理更新**，每个状态的更新是异步的，不是立即更新

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406192904294.png" alt="image-20250406192904294" style="zoom:40%;" />

- 上图的console打印的answer还是旧值，只有在重新渲染后，才可以获得新值

```js
setLike(like+1)
setLike(like+1)
setLike(like+1) // like只会加1 

setLike((like) => like+1)
setLike((like) => like+1)
setLike((like) => like+1)  // like会加3
```

- react18之前，只支持在事件处理函数中批处理更新状态

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406193335517.png" alt="image-20250406193335517" style="zoom:33%;" />



##### 异步

```js
// 事件处理函数中处理localStorage逻辑
function handleAddWatched(movie) {
  setWatched((watched) => [...watched, movie])
  // 在handleAddWatched函数执行完watched才会更新
  localStorage.setItem('watched', JSON.stringify(watched))   // 不可行，此时获取的watched是旧的
  localStorage.setItem('watched', JSON.stringify([...watched, movie]))   // 可行
}

// 利用useEffect存储
useEffect(function() {
  localStorage.setItem('watched', JSON.stringify(watched))
}, [watched])
```











### 事件处理

- React中所有事件都被绑定在根元素上（事件委托）

- react中事件对象不同于原生js的event，它抹平了不同浏览器之间的差异性，是一个**「合成事件对象**」

  区别：合成事件比如focus、blur、change会冒泡，原生js不会

- 捕获阶段的click事件名称 onClickCapture

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250406205540615.png" alt="image-20250406205540615" style="zoom:33%;" />





# hook

### 基本使用

- **只能在函数式组件或自定义hook的顶层使用，不可以在条件语句、循环语句使用**
- **不可以在return语句之后使用hook**
- *「需要保证一个组件中所有hook在每次渲染时都按照相同的顺序去调用」*，如果在条件语句中使用hook，在每次重新渲染时hook调用顺序可能被打乱

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250410113545554.png" alt="image-20250410113545554" style="zoom:40%;" />

- 为什么要保证hook顺序不打乱呢？？？





### useState

- **参数：初始化值，如果不设置为undefined**
- **返回值：数组，包含两个元素**
  - **元素一：当前状态的值**
  - **元素二：设置状态值的函数**
- **【一般来说，在函数退出后变量就会消失，而state中的变量会被React保留】**

```jsx
import React, { useState } from 'react'

export default function CouterHook() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h2>当前计数：{count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
      <button onClick={e => setCount(count - 1)}>-1</button>
    </div>
  )
}
```

- 修改学生年龄

```jsx
import { useState } from 'react'

export default function Student() {
  const [students, setStudents] = useState([
    {id: 1, name: 'coderwhy', age: 18},
    {id: 2, name: 'kobe', age: 40},
    {id: 3, name: 'james', age: 29}
  ])
  
	// map更好
  function addStudentAge(index) {
    const newStudents = [...students]
    newStudents[index].age += 1
    setStudents(newStudents)
  }
  return (
    <div>
      <ul>
        {
          students.map((item, index) => {
            return (
              <li key={item.id}>
                姓名：{item.name}
                年龄：{item.age}
                <button onClick={e => addStudentAge(index)}>年龄+1</button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}
```



- 减少不必要useState的使用，下方例子「商品数量」和「商品价格」从购物车可以derive

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250402162931149.png" alt="image-20250402162931149" style="zoom:33%;" />



-   sortedItems是 items derive的，学习排序时sort方法的巧妙用法

<img src="https://cdn.jsdelivr.net/gh/shilixiaoqiaoya/pictures@master/image-20250402170503953.png" alt="image-20250402170503953" style="zoom:40%;" />



- 需要考虑好state放置的位置，放在自身组件，还是进行**状态提升**放在父组件上
  - 一个组件的显示隐藏，交由父组件控制
- setState的参数可以是state，**可以是函数**（需注意**数据的不可变性**）
  - 数组push操作改为  [...state, item]
  - 如果state是一个数组，它存储多个对象，想修改某个对象的某个属性，利用数组的map方法
  - 数组操作，先把数组copy一份:   ().slice().sort()

- useState传入函数来进行初始化

  ```js
  
  ```

  







### useEffect

- 组件挂载时发送发送网络请求

```js
useEffect(() => {
  fetch('xxx').then(res => res.json()).then(data => console.log(data))
}, [])

// 使用async/await
useEffect(() => {
  async function fetchMovies() {
    const res = await fetch('xxx')
    const data = await res.json()
		console.log(data)
  }
  fetchMovies()
}, [])
```

- **可以模拟类组件的生命周期函数，但是它功能更强大**
- **类似于网络请求、一些事件的监听，都是React更新DOM的副作用（Side Effects）**
- **在函数式组件中，可以有多个useEffect，允许开发者按照代码的用途分离它们，React将按照effect声明的顺序依次调用每一个effect**

```jsx
// 将网页title设置为count值
import { useEffect, useState } from 'react'
export default function() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    document.title = count
  })  
    
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={e => setCount(count + 1)}>+1</button>
    </div>
  )
}
```

- **第一个参数为函数，每次重新渲染完会执行，相当于componentDidMount和componentDidUpdate**

- **该函数有一个返回值，是一个函数，会在组件更新和卸载时执行，在此可以做一些清除工作，比如取消订阅**

  **这是effect可选的清除机制，每个effect都会返回一个清除函数，这样可以将添加和移除订阅的逻辑放在一起，代码内聚性更强**

- **第二个参数：一个数组，只有数组中的state发生变化时，effect才会执行**

- **如果effect不希望依赖任何state时，可以传入一个空数组，此时两个回调函数对应componentDidMount和componentWillUnmount**

```jsx
useEffect(() => {
    // 在此可以执行任何带副作用操作
    return () => {  
      // 在此可以做一些清除工作
    }
}, [count])  // 如果是[], 回调函数相当于componentDidMount
```





### useRef

- **一个变量，不被呈现在界面上，修改它时不会触发界面的重新渲染；同时变量需要在每次渲染之间是持久的**

  **这时选择useRef来定义变量**

- 在useEffect中修改ref值

```js
const countRef = useRef(0)
useEffect(() => {
  if(userRating) countRef.current ++
}, [userRating])
```







# 阶段案例

```jsx
<div id='app'></div>
<script type="text/babel">
    function formatPrice(price) {
      return '￥' + Number(price).toFixed(2)
    }

    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          books: [
            {
              id:1,
              name: '算法导论',
              data: '2006-9',
              price: 85.00,
              count: 1
            },
            {
              id: 2,
              name: 'unix编程艺术',
              data: '2006-2',
              price: 59.00,
              count: 1
            },
            {
              id: 3,
              name: '编程珠玑',
              data: '2008-10',
              price: 39.00,
              count: 1
            },
            {
              id: 4,
              name: '代码大全',
              data: '2006-3',
              price: 128.00,
              count: 1
            }
          ]
        }
      }
        
      renderBooks() {
        return (
          <div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>书籍名称</th>
                  <th>出版日期</th>
                  <th>价格</th>
                  <th>购买数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.books.map((item, index) => {
                    return (
                      <tr>
                        <td>{index+1}</td>
                        <td>{item.name}</td>
                        <td>{item.data}</td>
                        <td>{formatPrice(item.price)}</td>
                        <td>
                          <button disabled={item.count <= 1} onClick={e => {this.changeCount(index, -1)}}>-</button>
                          <span className='count'>{item.count}</span>
                          <button onClick={e => {this.changeCount(index, 1)}}>+</button>
                        </td>
                        <td><button onClick={e => this.removeBook(index)}>移除</button></td>
                      </tr>
                    )
                  })
                }
              </tbody>
          </table>
          <h2>总价格：{this.getTotalPrice()}</h2>
        </div>
        )
      }

      renderEmptyTip() {
        return (<h2>购物车为空~</h2>)
      }

      render() {
        return this.state.books.length ? this.renderBooks() : this.renderEmpty()
      }

      getTotalPrice() {
        const total = this.state.books.reduce((preVal, item) => {
          return preVal + item.count * item.price
        }, 0)
        return formatPrice(total)
      }

      removeBook(index) {
        let newBooks = this.state.books.filter((item, indey) => {
          return  index != indey
        })
        {/*react设计原则：state中的数据的不可变性*/}
        {/*修改state中的值必须通过setState*/}
        this.setState({
          books: newBooks
        }) 
      }

      changeCount(index, count) {
          const anoBooks = [...this.state.books]
          anoBooks[index].count += count
          this.setState({
            books: anoBooks
          })
      }
    }
</script>
```





# 组件化开发

### 组件分类

- 根据组件的定义方式，分为**函数组件和类组件**
  - **类组件**：
    - **组件名称要大写字母开头**
    - **类组件需要继承自`React.Component`**
    - **【类组件必须实现render函数】**
  - **函数式组件**：
    - **没有生命周期函数**
    - **没有this关键字**
    - **没有内部的状态state**
  
  **【React要求无论是函数式组件还是类组件，这个组件必须像纯函数一样，保护它们的props不被修改】**
  
- 根据组件内部是否有状态需要维护，分为**无状态组件和有状态组件**

- 根据组件的不同职责，分为**展示型组件和容器型组件**





# 生命周期

![](D:\DeskTop\笔记\typora-images\react生命周期.png)

### constructor

- **通过给this.state赋值对象来初始化内部的state**

### render

- 返回值
  - React元素：jsx或者组件
  - 数组或fragments
  - 字符串或数值
  - 布尔类型或null或undefined：什么都不渲染

### componentDidMount

- **组件挂载之后立即调用**
- **依赖于DOM的操作可以在这里进行**
- **在此处发送网络请求【官方建议】**
- **在此处添加一些订阅**

### componentDidUpdate

### componentWillUnmount

- **清除timer**
- **取消网络请求**
- **清除在componentDidMount()中创建的订阅**





# 组件通信

- **【react要求我们无论是函数还是class声明一个组件，这个组件必须像纯函数一样，保护它们的props不被修改】**

### 父传子-props传递属性

- **父组件通过属性-值的形式来传递数据**
- **子组件通过props获取数据**

```jsx
<script type="text/babel">
    // 类组件
    class ChildCpn extends React.Component {
      	// 如果组件没有自己的state，constructor函数也可以省略不写
      constructor(props) {
        super(props)
      }
      render() {
        const {name, age, height} = this.props
        return (
          <div>
            {name + ' ' + age + ' ' + height}
          </div>
        )
      }
    }

	// 函数组件
	function ChildCpn(props) {
      const {name, age, height} = props
      return (
        <div>
          {name + ' ' + age + ' ' + height}
        </div>
      )
    }
    
    class App extends React.Component {
      render() {
        return (
          <div>
            <ChildCpn name='why' age='18' height='1.88'/>
          </div>
        )
      }
    }
</script>
```



### 父传子-属性验证

- **利用库prop-types**

```jsx
import PropTypes from 'prop-types'

function ChildCpn(props) {
    const {name, age} = props
    return (
        <div>
          {name + ' ' + age}
        </div>
    )
}
//类型
ChildCpn.propTypes = {
    name: PropTypes.string.isRequired, // 字符串类型、必传
    age: PropTypes.number,
}
//默认值
ChildCpn.defaultProps = {
    name: 'james',
    age: 20,
}

class App extends React.Component {
    render() {
        return (
          <div>
            <ChildCpn name='kobe' age={19}/>
          </div>
        )
    }
}
```



### 子传父-props传递函数

- **通过props，父组件给子组件传递一个回调函数，子组件中调用这个函数**

```jsx
<script type="text/babel">
    class AddCounter extends React.Component {
      addCount(count) {
          this.props.addClick(count)
      }
      render() {
        return (
          <div>
            <button onClick={e => this.addCount(1)}>+1</button>
            <button onClick={e => this.addCount(5)}>+5</button>
            <button onClick={e => this.addCount(10)}>+10</button>
          </div>
        )
      }
    }

    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          counter: 100
        }
      }
      render() {
        return (
          <div>
            <span>当前计数：{this.state.counter}</span>
            <AddCounter addClick={count => this.changeCounter(count)}/>
          </div>
        )
      }
      changeCounter(count) {
        this.setState({
          counter: this.state.counter + count
        })
      }
    }
</script>
```



### tabControl案例

```jsx
<script type="text/babel">
    class TabControl extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          currentIndex: 0
        }
      }
      render() {
        const {titles} = this.props
        const {currentIndex} = this.state
        return (
          <div className='tab-control'>
            {
              titles.map((item, index) => {
                return (
                  <div key={index} 
                       className={'tab-item ' + (currentIndex == index ? 'active' : '')}
                       onClick={e => {this.itemClick(index)}}>
                    <span>{item}</span>
                  </div>
                )
              })
            }
          </div>
        )
      }
      itemClick(index) {
        const {oneClick} = this.props
        oneClick(index)
        this.setState({
          currentIndex: index
        })
      }
    }

    class App extends React.Component {
      constructor(props) {
        super(props)
        this.titles = ['新款','流行','精选']
        this.state = {
          currentTitle: '新款'
        }
      }
      render() {
        return ( 
          <div>
            <TabControl titles={this.titles}
                        oneClick = {index => {this.oneClick(index)}}/>
            <h2>{this.state.currentTitle}</h2>
          </div>
        )
      }
      oneClick(index) {
        this.setState({
          currentTitle: this.titles[index]
        })
      }
    }
</script>
```





### 插槽slot

- **①父组件使用子组件时，子组件写成双标签，将插槽内容直接放进去，子组件通过this.props.children就可以拿到插槽内容**

- **如果children子元素有一个，那`this.props.children`就是子元素**

  **如果children子元素有多个，那`this.props.children`是多个子元素的数组**

```jsx
<script type="text/babel">
    class NavBar1 extends React.Component {
      render() {
        const {children} = this.props
        return (
          <div className='nav-bar'>
            <div className="nav-item nav-left">{children[0]}</div>
            <div className="nav-item nav-center">{children[1]}</div>
            <div className="nav-item nav-right">{children[2]}</div>
          </div>
        )
      }
    }

    class App extends React.Component {
      constructor() {
        super()
      }
      render() {
        return (
          <div>
            <NavBar1>
              <span>aaa</span>
              <strong>bbb</strong>
              <a href="#">ccc</a>
            </NavBar1>
          </div>
        )
      }
    }
</script>
```



- **②通过props传递React元素【推荐】**

```jsx
<script type="text/babel">
    class NavBar2 extends React.Component {
      render() {
        const { leftSlot, centerSlot, rightSlot } = this.props
        return (
          <div className='nav-bar'>
            <div className="nav-item nav-left">{leftSlot}</div>
            <div className="nav-item nav-center">{centerSlot}</div>
            <div className="nav-item nav-right">{rightSlot}</div>
          </div>
        )
      }
    }

    class App extends React.Component {
      constructor() {
        super()
      }
      render() {
        return (
          <div>
            <NavBar2 leftSlot={<span>aaa</span>}
                     centerSlot={<strong>bbb</strong>}
                     rightSlot={<a href="#">ccc</a>}/>
          </div>
        )
      }
    }
</script>
```





### Context-跨组件通信

- **context提供了一种在组件之间共享值的方式，而不必通过组件树逐层传递props**

- **conetxt设计目的是为了共享对于一个组件树而言全局的数据，比如当前用户信息**

- API:

  - **`React.createContext()`：创建需要共享的context对象**

  - **`context.Provider`：context对象的Provider组件**

    **`Provider`接收value属性，传递给消费组件，当value值发生变化时，消费组件都会重新渲染**

  - **`context.Consumer`：context对象的Consumer组件，函数/类组件中均可使用**

    **函数作为子元素，函数参数是value，返回一个React节点**
  
  - **当消费组件是类组件时：`类.contextType`可以被赋值为context对象，类组件就可以通过`this.context`来消费value**

```jsx
// APP组件直接向孙组件ProfileHeader传值
<script type="text/babel">
    // 1、创建Context对象
	const UserContext = React.createContext()
   
    class ProfileHeader extends React.Component {
      render() {
        return (
          const {nickname, level} = this.context
          <div>
            <div>用户昵称：{nickname}</div>
            <div>用户等级：{level}</div>
          </div>
        )
      }
    }
    // 3、设置孙组件的contextType为某一个context
    ProfileHeader.contextType = UserContext

    class Profile extends React.Component {
      render() {
        return (
          <div>
            <ProfileHeader/>
            我是Profile组件
          </div>
        )
      }
    }

    class App extends React.Component {
      constructor() {
        super()
        this.state = {
          nickname: 'kobe',
          level: 99
        }
      }
      render() {
        return (
          <div>
            {/*2、使用创建的context的Provider包裹子组件*/}
            <UserContext.Provider value={...this.state}>
              <Profile/>
            </UserContext.Provider>
            我是App组件
          </div>
        )
      }
    }
</script>
```

```jsx
	/*函数组件形式*/
// <UserContext.Consumer>组件，内部自动调用函数，将共享值value作为参数【也可以用于类组件】
	function ProfileHeader() {
      return (
        <UserContext.Consumer>
          {
            (value) => {
              return (
                <div>
                  <div>用户昵称：{value.nickname}</div>
                  <div>用户等级：{value.level}</div>
                </div>
              )
            }
          }
        </UserContext.Consumer>
      )
    }
```





# setState

- **React没有实现类似于vue中的数据劫持来监听数据的变化，必须通过setState来告知React数据已经发生了变化，希望React根据最新的state来重新渲染界面**
- **setState方法是从React.Component继承过来的**

### 基本使用

- **setState底层是通过Object.assign()来实现的**

```jsx
const o1 = { a: 1 };
const o2 = { b: 2 };

const obj1 = Object.assign(o1, o2);
console.log(obj1); // { a: 1, b: 2 }
console.log(o1); // { a: 1, b: 2 }，目标对象本身发生了变化
console.log(obj1 === o1)  // true
```

- **this.setState()传参：**
  - **对象**
  - **回调函数：接受state和props两个参数，返回一个对象**

```jsx
this.setState((state, props) => {
    console.log(state.message)
    return {
        message: '你好啊李银河'
    }
})
```

- **this.setState()是异步的，如果希望在【数据合并】之后，获取到更新后的数据执行一些逻辑代码，可以在setState中传入第二个参数：callback**

```js
this.setState({message: '你好啊李银河'}, () => {
    console.log('+++++', this.state.message)   //拿到的是更新后的数据
})
console.log('-----', this.state.message)  //拿到的是更新前的数据
```



### 异步调用

- **显著地提高性能**

  **如果每次调用setState都进行一次更新，那么意味着render函数会被频繁调用，界面重新渲染，这样效率很低。最好的方法是获取到多个更新，之后进行批量更新**

```js
// 该方法执行，counter只会+1
addClick1() {
    this.setState({counter: this.state.counter + 1})
    this.setState({counter: this.state.counter + 1})
    this.setState({counter: this.state.counter + 1})
}

// 该方法执行，counter会+3
addClick2() {
    this.setState((state) => {
        return {
            counter: state.counter + 1
        }
    })
    this.setState((state) => {
        return {
            counter: state.counter + 1
        }
    })this.setState((state) => {
        return {
            counter: state.counter + 1
        }
    })
}
```

- **state和props一致性**

  **如果同步更新了state，但是render函数还没有执行，那么state和传给子组件的props不能保持同步**



### React18前

- **在组件生命周期或React事件处理中，setState是异步**
- **在setTimeout或者原生dom事件中，setState是同步**

``` js
changeText() {
    setTimeout(() =>{
        this.setState({message: '你好吖，李银河'})
        console.log(this.state.message)  // 你好吖，李银河
    }, 0)
}

componentDidMount() {
    const btnEl = document.getElementByID('btn')
    btnEl.addEventListener('click', () => {
        this.setState({message: '你好吖，李银河'})
        console.log(this.state.message)
    })
}
```

- **React18之后，默认所有的操作都被放到了批处理中（Automatic Batching）**

<img src="D:\DeskTop\笔记\typora-images\react180sutomatic batch.jpg" style="zoom:90%;" />







# 性能优化

- App根组件下有很多子组件，只要是修改了App中的数据，所有组件默认都需要重新render，进行diff算法，性能很低
- 事实上，子组件render应该有一个前提，就是依赖的数据（state、props）发生改变时，再调用自己的render方法
- 如何控制render方法是否被调用呢？通过`shouldComponentUpdate`

### shouldComponentUpdate

- **接收两个参数**
  - **nextProps：修改之后的props属性**
  - **nextState：修改之后的state属性**
- **返回值是boolean**
  - **默认返回值是true，也就是只要调用了setState，就会调用render方法**
  - **是true，就需要调用render方法**
  - **为false，就不需要调用render方法**
- **优化：通过判断props和state中的数据是否改变，来决定shouldComponentUpdate返回值**





### PureComponent

- **如果所有的类组件，我们都需要手动实现shouldComponentUpdate，那么开发工作量会很大**
- **所以React针对类组件为我们提供了PureComponent类，针对函数组件提供了memo函数**
- **本质上是做了浅层比较：通过props和state中的数据是否发生改变**

````jsx
// 类组件继承自PureComponent类
class App extends PureComponent {
    constructor() {
        super()
        this.state = {
            msg: 'hello world'
        }
    }
    render() {
        return (
            <div>
                <h2>App: {this.state.msg}</h2>
                <Profile msg={this.state.msg}/>
            </div>
        )
    }
}

// memo函数对函数式组件进行包裹
import { memo } from 'react'
const Profile = memo(function(props) {
    return <h2>Profile: {props.msg}</h2>
})
export default Profile
````





### 不可变数据的力量

- **出于性能优化，让类组件继承自PureComponent**
- **下例中如果直接在friends数组push，PureComponent会判断friends内存地址未发生变化，就不会重新渲染**
- **所以friends数组需要浅拷贝一个新数组，在新数组上做push操作**

```jsx
    class App extends PureComponent {
      constructor() {
        super()
        this.state = {
          friends: [
            {name: 'kobe', age: 19},
            {name: 'why', age: 20},
            {name: 'lily', age: 30}
          ]
        }
      }
      render() {
        return (
          <div>
            <h2>列表：</h2>
            <ul>
              {
                this.state.friends.map((item, index) => {
                  return <li key={index}>{item.name}</li>
                })
              }
            </ul>
            <button onClick={e => this.insert()}>添加数据</button>
          </div>
        )
      }
      insert() {
        const newFriends = [...this.state.friends]
        newFriends.push({name:"hhh", age:10})
        this.setState({
          friends: newFriends
        })
      }
    }
```





# ref 

- **方式一【弃用】：在html元素上绑定ref字符串**

- **方式二【推荐】：通过`createRef()`创建ref对象，绑定到元素上**
  
  - **ref属性用于html元素时，其current属性是dom元素**
  - **ref属性用于class组件时，其current属性是类组件的实例对象**
  - **ref不可用于函数组件上，因为它没有实例，可以通过forwardRef进行ref传递，传给内部dom**
  
  ```jsx
  import { forwardRef } from 'react'
  const Home = forwardRef(function(props, ref) {
      return (
      	<div>
          	<h2 ref={ref}>Home</h2>
          </div>
      )
  })
  class App extends PureComponent {
        constructor() {
          super()
          this.hRef = createRef()
        }
        render() {
          return (
            <div>
  			<Home ref={this.hRef}/>
              <button onClick={e => this.getDOM()}>获取函数组件内部DOM</button>
            </div>
          )
        }
        getDOM() {
          console.log(this.hRef.current)
        }
  }
  ```
  
- **方式三：ref绑定一个回调函数，元素在被渲染之后，回调函数会被执行，其参数是元素**

```jsx
<script type="text/babel">
    class App extends PureComponent {
      constructor() {
        super()
        this.titleRef = createRef()
        this.titleEl = null
      }
      render() {
        return (
          <div>
            {/*字符串*/}
            <h2 ref='refStr'>Hello React</h2>
            
            {/*创建ref对象*/}
            <h2 ref={this.titleRef}>Hello React</h2>

            {/*回调函数*/}
            <h2 ref={el => this.titleEl = el}>Hello React</h2>

            <button onClick={e => this.getNativeDOM()}>获取DOM</button>
          </div>
        )
      }
      getNativeDOM() {
        //使用方式一：字符串
        console.log(this.refs.refStr)
          
        //使用方式二：创建ref对象
        console.log(this.titleRef.current)
          
        //使用方式三：回调函数
        console.log(this.titleEl)
      }
    }
</script>
```





# 表单元素

### 受控组件

- **在html中，表单元素自己维护state，并根据用户输入进行更新**

- **在React中，状态要保存在组件的state属性中，并且要通过setState()来更新**

- **①在input上设置value属性，表单显示的值将始终为this.state.value，这使得React的state成为唯一数据源**

  **②监听input的change事件在每次按键时都会改变React的state，显示的值将随用户输入而更新**

  **被React以这种方式控制取值的表单输入元素叫做【受控组件】**

```jsx
class App extends PureComponent {
      constructor() {
        super()
        this.state = {
          username: ''
        }
      }
      render() {
        const {username} = this.state
        return (
          <div>
                <input type="text" 
                       value={username}
                       onChange={e => this.inputChange(e)}/>
          </div>
        )
      }
      inputChange(event) {
        this.setState({
          username: event.target.value
        })
      }
		// 当多个受控组件由同一个函数处理时
		inputChange(event) {
            this.setState({
              [event.target.name]: event.target.value
            })
          }
    }
```



### 非受控组件

- 使用ref从dom节点中获取表单数据
- 需要通过defaultValue来设置默认值

```jsx
<input type='text' defaultValue={intro} ref={this.introRef}/>
// 监听改变
componentDidMount() {
    this.introRef.current.addEventListener('change', () => {})
}
```







# 高阶组件

- `HigherOrderComponent `   HOC
- **高阶组件：参数为组件，返回值为新组件的函数**

```js
    function higherOrderComponent(WrappedComponent) {
      class NewComponent extends PureComponent {
        render() {
          return <WrappedComponent/>
        }
      }
      return NewComponent
    }
    const enhancedComponent = higherOrderComponent(cpn)
```

- **高阶组件并不是React API的一部分，它是基于React的特性而形成的设计模式，它可以针对某些react代码进行更加优雅的处理，达到代码复用的效果**
- **应用：redux中的connect； react-router中的withRouter；memo函数；forwardRef函数**
- 缺点：
  - 在原组件上进行包裹，如果大量使用HOC，将会产生非常多的嵌套，让调试变得困难
  - HOC可以劫持props，可能会造成冲突



### 应用一：增强props

- **给某些组件添加特定的props**

```jsx
function enhancedUserInfo(OriginCpn) {
    class newCpn extends PureComponent {
        constructor() {
            super()
            this.state = {
                userInfo: {
                    name: 'coderwhy',
                    age: 18
                }
            }
        }
        render() {
            return <OriginCpn {...this.state.userInfo} {...this.props}/>
        }
    }
    return newCpn
}
const Home = enhancedUserInfo(function(props) {
    return <h2>Home: {props.name}</h2>
})
const Profile = enhancedUserInfo(function(props) {
    return <h2>Profile: {props.age}</h2>
})
class App extends PureComponent {
    render() {
        return (
            <div>
            	<Home/>
            	<Profile/>
            </div>
        )
    }
}
```



### 应用二：共享context

- **对某些组件使用某个context**

```jsx
//高阶组件withTheme
function withTheme(originCpn) {
    return props => {
        return (
            <ThemeContext.Consumer>
            {
                value => {
               	  return <originCpn {...value} {...props}/>
            	}
            }
            </ThemeContext.Consumer>
        )
    }
}

class Home extends PureComponent {
    const {color, fontSize} = this.props
    render() {
        return (
        	<h2>{color}-{fontSize}</h2>
        )
    }
}
const withThemeHome = withTheme(Home)

const themeContext = createContext()
class App extends PureComponent {
    render() {
        <div>
            <ThemeContext.provider value={{color: 'red', fontSize: 20}}>
                <withThemeHome/>
            </ThemeContext.provider>
        </div>
    }
}
```



### 应用三：登录鉴权

- **要跳转到某些页面，需判断用户有无登录**

```jsx
  function withAuth(WrappedComponent) {
    return props => {
      const token = localStorage.getItem('token')
      if(token) {
          return <Cart {...props}/> 
      } else {
          return <h2>请先登录，再进行页面跳转</h2>
      }
    }
  }

  class Cart extends PureComponent {
    render() {
      return <h2>cart页面</h2>
    }
  }
  const AuthCart = withAuth(Cart)
  
  class App extends React.PureComponent {
    render() {
      return (
        <AuthCart/>
      )
    }
  }
```



### 应用四：生命周期劫持

- **拿到某些组件的渲染时间**

```jsx
  function withRenderTime(WrappedComponent) {
    return class extends PureComponent {
      UNSAFE_componentWillMount() {
        this.beginTime = Date.now()
      }
      componentDidMount() {
        this.endTime = Date.now()
        const interval = this.endTime - this.beginTime
        console.log(`${WrappedComponent.name}渲染时间为：${interval}`)
      }
      render() {
        return <WrappedComponent/>
      }
    }
  }
    
  class Home extends React.PureComponent {
    render() {
      return <h2>Home</h2>
    }
  }
  const TimeHome = withRenderTime(Home)

  class App extends React.PureComponent {
    render() {
      return (
        <div>
          <TimeHome/>
        </div>
      )
    }
  }
```



# Fragment

- **语法糖：<> </>，相当于<Fragment></Fragment>**
- **注意：如果需要在Fragment标签上添加属性，那么不能使用【短语法】**



# portals

- **某些情况下，我们希望渲染的内容独立于当前挂载的DOM元素中（默认都是挂载在id为root的元素上）**

```js
ReactDOM.createPortal(<h2>内容</h2>, document.querySelector('#why'))
```





# CSS样式

### 内联样式

- 优点：
  - **样式之间不会有冲突**
  - **可以动态获取当前state中的状态**
- 缺点：
  - **写法上都需要使用驼峰标识**
  -   **某些样式无法编写（伪类/伪元素）**
  -  **大量的样式，代码混乱**

```jsx
class App extends React.PureComponent {
      render() {
        return (
          <div>
            <a href="#" style={{fontSize: "50px", color: 'red'}}>百度一下</a>
          </div>
        )
      }
    }
```





### .css文件

- **优点：编写方式和普通的网页开发中的编写方式一致**

- **缺点：普通的css属于全局的css，样式之间会相互影响，会相互层叠掉**





### css modules

- **css modules在类似webpack配置的环境下都可以使用，React脚手架已经内置css modules的配置**

- **需要将css文件后缀`.css`改为`.module.css`**

- **优点：解决了样式层叠的问题，css有局部作用域**

- **缺点：**

  - **编写css时类名不能使用连接符（.home-title）**
  - **不方便动态修改样式**
  
  ```jsx
  import appStyle from './App.module.css'
  class App extends PureComponent {
      render() {
          return (
              <div>
              	<h2 className = {appStyle.title}>标题</h2>
              	<p> className = {appStyle.content}内容</p>
              </div>
          )
      }
  }
  ```





### CSS in JS

- **通过js为css赋予一些能力，包括样式嵌套、动态修改样式、逻辑复用等**
- **目前比较流行的CSS in JS库：styled-components、emotion**

#### styled-components

- **本质是通过模板字符串执行函数，创建出一个【样式组件】。这个组件会被自动添加上一个不重复的 class**
- **【样式嵌套】：支持类似于css预处理器的样式嵌套；可以通过&符号获取当前元素**

```jsx
import styled from 'styled-components'

const AppWrapper = styled.div`
  font-size: 30px;
  color: orange;
  .content {
    background-color: blue;
    span {
      &.active {
        color: red;
      }
      //伪类  
      &:hover {
        color: green
      }
    }
  }
`
export default memo(function() {
  return (
    <AppWrapper>
      <p>我是标题</p>
      <div className='content'>
        <span>内容1</span>
        <span className='active'>内容2</span>
      </div>
    </AppWrapper>
  )
})
```

- **【动态样式】：通过给样式组件传props，实现根据state动态修改样式**
  - 获取props可以通过**${}传入一个函数**，props会作为该函数的参数

```jsx
  import styled from 'styled-components'   

  const InputWrapper = styled.input`
    background-color: lightblue;
    color: ${props => props.color}
  `
  class App extends PureComponent {
    constructor() {
      super()
      this.state = {
        color: 'yellow'
      }
    }
    render() {
      return (
        <div>
          <InputWrapper type='text' color={this.state.color}/>
        </div> 
      )
    }
  }
```

- **【继承】**

```js
const HYButton = styled.button`
	border: 1px solid yellow;
	border-radius: 5px
`
const HYButtonWrapper = styled(HYButton)`
	color: green;
	background-color: red;
`
```







# redux

- **react在视图层帮助我们解决了DOM的渲染过程，但是state依然是留给我们自己来管理**

- **可以是组件定义自己的state，可以是组件之间通过props来通信，或是通过context进行数据间的共享**

- **当项目变得很庞大时，状态变得多且复杂，这时就可以使用redux**

  **redux是一个帮助我们管理state的容器，是JavaScript的状态容器，提供了可预测的状态管理**

- **①单一数据源：通常只创建一个store，让整个应用程序的state变得方便维护、追踪、修改**

- **②state是只读的：唯一修改state的方式就是派发action**

- **③使用纯函数来进行修改：通过reducer将旧state和action联系在一起，返回一个新的state**



### 核心概念

#### ①store

#### ②action

- **action是一个js对象，用于描述更新的type和content**
- **所有数据的变化，必须通过派发（dispatch）action来更新**

```js
const action = {type: 'ADD_FRIEND', info: {name: 'why', age: 18}}
const action = {type: 'CHANGE_NAME', payload: {index: 0, newName: 'kobe'}}
```

#### ③reducer

- **reducer是一个纯函数， 不能产生副作用**
- **reducer的作用是将传入的state和action结合起来生成一个新的state**



### 基本使用

- **定义初始状态--》dispatch actions --》 reducer处理 --》 改变store的state**

```js
const { createStore } = require('redux')

//初始状态
const defaultState = {
  counter: 0
} 

//3、reducer: state和action的桥梁【必须是纯函数】
function reducer(state = defaultState, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {...state, counter: state.counter + 1}
    case 'DECREMENT':
      return {...state, counter: state.counter - 1}
    default:
      return state
  }
}

//1、创建store，将reducer函数传入
const store = createStore(reducer)

//2、创建action
const action1 = {type: 'INCREMENT'}
const action2 = {type: 'DECREMENT'}

//5、订阅state的修改
store.subscribe(() => {
  console.log("订阅数据的变化"  + store.getState())
})

//4、派发action
store.dispatch(action1)
store.dispatch(action2)
```

<img src="D:\DeskTop\笔记\typora-images\react-redux.jpg" style="zoom:70%;" />



### 文件划分

- **将定义的所有actionCreators函数，放到一个独立的actionCreators.js中**
- **actionCreators和reducer函数中的type常量是一致的，将常量抽取到独立文件夹constants.js中**
- **将reducer函数放到独立的reducer.js中**
- **将创建store的过程放在index.js中**

##### index.js

```js
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

export default store
```



##### actionCreators.js

```js
import {
  ADD_NUMBER,
  SUB_NUMBER
} from './constants'

export const add_action = (num) => ({
  type: ADD_NUMBER,
  num
})

export const sub_action = (num) => ({
  type: SUB_NUMBER,
  num
})
```



##### reducer.js

```js
import {
  ADD_NUMBER,
  SUB_NUMBER
} from './constants'

const defaultState = {
  counter: 100
}

function reducer(state = defaultState, action) {
  switch(action.type) {
    case ADD_NUMBER:
      return {...state, counter: state.counter + action.num}
    case SUB_NUMBER:
      return {...state, counter: state.counter - action.num}
    default: 
      return state
  }
}

export default reducer
```



##### constants.js

```js
export const ADD_NUMBER = 'ADD_NUMBER'
export const SUB_NUMBER = 'SUB_NUMBER'
```





### 与react结合

```jsx
export default class Home extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      counter: store.getState().counter
    }
  }
  componentDidMount() {
      //订阅state的修改
   store.subscribe(() => {
      this.setState({
        counter: store.getState().counter
      })
    })
  }

  render() {
    return (
      <div>
        <h2>Home</h2>
        <h2>当前计数：{this.state.counter}</h2>
        <button onClick={e => this.decrement(1)}>-1</button>
        <button onClick={e => this.decrement(5)}>-5</button>
      </div>
    )
  }
  decrement(num) {
    //派发action
    store.dispatch(sub_action(num))
  }
}
```





### react-redux库

- **Provider组件提供store**
- **connect(mapStateToProps,  mapDispatchToProps)(Cpn)**
- **`mapStateToProps`函数是将store的state映射到组件的props中**
- **`mapDispatchToProps`函数是将store的派发事件映射到组件的props中**

```jsx
//index.js
import { Provider } from 'react-redux'
import store from './store'
const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
    <Provider store={store}>
    	<App/>
    </Provider>
)

//page.js
import { connect } from 'react-redux'
class Page extends PureComponent {
    calcNum(num, idAdd) {
        if(isAdd) {
            this.props.addNumber(1)
        } else {
            this.props.subNumber(1)
        }
    }
    render() {
        const { counter } = this.props
        return (
            <div>{counter}</div>
            <button onClick={e => this.calcNum(1, true)}>+1</button>
			<button onClick={e => this.calcNum(1, false)}>-1</button>
        )
    }
}
const mapStateToProps = state => ({
    counter: state.counter
}) 
const mapDispatchToProps = dispatch => ({
    addNumber: num => dispatch(addNumberAction(num)),
    subNumber: num => dispatch(subNumberAction(num))
})
export default connect(mapStateToProps, mapDispatchToProps)(Page)
```



### 异步请求数据

```js
export class About extends PureComponent {
    componentDidMount() {
        axios.get('xxx').then(res => {
            const banners = res.data.data.banner.list
            const recommends = res.data.data.recommend.list
            this.props.changeBanners(banners)
            this.props.changeRecommends(recommends)
        })
    }
    render() {
        return <h2>About Page</h2>
    }
}
const mapDispatchToProps = dispatch => ({
    changeBanners(banners) {
        dispatch(changeBannersAction(banners))
    },
    changeRecommends(recommends) {
        dispatch(changeRecommendsAction(recommends))
    }
})
export default connect(null, mapDispatchToProps)(About)
```



### redux-thunk库

<img src="D:\DeskTop\笔记\typora-images\redux-thunk.jpg" style="zoom:70%;" />

- **要将网络请求代码和组件做解耦，放在redux代码里----actionCreators文件中**
- **redux-thunk可以让dispatch(action函数调用)，action函数调用返回一个函数，该函数会被立即执行，并有两个参数**
  - **dispatch：用于之后再次派发action**
  - **getState：可以获取store中的state**
- **所以在组件内dispatch的不再是一个action对象，而是一个函数，函数内进行真正的dispatch action**

```jsx
// index.js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
const store = createStore(reducer, applyMiddleware(thunk))

// actionCreators.js
export const fetchPagedataAction = () => {
    return (dispatch, getState) => {
        axios.get('xxx').then(res => {
            const banners = res.data.data.banner.list
            const recommends = res.data.data.recommend.list
            dispatch(changeBannersAction(banners))
            dispatch(changeRecommendsAction(recommends))
        })
    }
}

// Page.jsx
class Page extends PureComponent {
    componentDidMount() {
        this.props.fetchPagedata()
    }
    render() {
        return <h2>Page</h2>
    }
}
const mapDispatchToProps = (dispatch) => ({
    fetchPagedata() {
        dispatch(fetchPagedataAction())
    }
})
export default connect(null, mapDispatchToProps)(Page)
```



### combineReducers

- **将多个reducer集合在一起**

```js
const reducer = combineReducers({
    counterInfo: counterReducer,
    homeInfo: homeReducer
})
const store = createStore(reducer)
```





# React ToolKit

- **对redux做了一层封装**



### configureStore

- 用于创建store对象，传入一个对象，对象有如下属性
- **reducer：将slice的reducer组成一个对象传入此处**
- middleWare：传入中间件
- devTools：默认为true

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter'
import homeReducer from './home'

const store = configureStore({
    reducer: {
        counter: counterReducer,
        home: homeReducer
    }
})
export default store
```





### createSlice

- 创建一个slice，传入一个对象，对象有如下属性
- **name属性：用于标记slice的名词**
- **initialState：初始化值**
- **reducers：是一个对象，包括多个函数，一个函数类似于之前reducer函数的一个case语句**
  - **函数参数：state和action**
- **createSlice返回值是一个对象**

```js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        counter: 888
    },
    reducers: {
        addNumber(state, { payload }) {
            state.counter += payload
        },
        subNumber(state, { payload }) {
            state.counter -= payload
        }
    }
})
export const { addNumber, subNumber } = counterSlice.actions
export default counterSlice.reducer
```

- **在action中可以直接对state数据做修改，实际上RTK底层使用了immer库来保证数据的不可变性**
- **利用算法：Persistent Data Structure【持久化数据结构】**
  - **用一种数据结构来保存数据**
  - **当数据被修改时，会返回一个对象，但是新的对象会尽可能利用之前的数据结构，节约内存**







### 与react结合

```jsx
import { connect } from 'react-redux'
class About extends PureComponent {
    addNumber(num) {
        this.props.addNumber(num)
    }
    render() {
        const { counter } = this.props
        return (
        	<div>
            	<h2>About Counter: {counter}</h2>
				<button onClick={e => this.addNumber(5)}>+5</button>
				<button onClick={e => this.addNumber(8)}>+8</button>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    counter: state.counter.counter
})
const mapDispatchToProps = dispatch => ({
    addNumber(num) {
        dispatch(addNumber(num))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(About)
```





### 异步请求数据

- createAsyncThunk：接受一个动作类型字符串和一个返回承诺的函数，并生成一个pending/fulfilled/rejected基于该承诺分派动作类型的thunk

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
export const fetchHomeDataAction = createAsyncThunk('fetch/homedata', async () => {
    const res = await axios.get('xxx')
    // 返回结果，action状态变为fulfilled
    return res.data
})
const homeSlice = createSlice({
    name: 'home',
    initialState: {
        banners: [],
        recommends: []
    },
    extraReducers: {
        [fetchHomeDataAction.pending](state, { payload }) {},
       	[fetchHomeDataAction.fulfilled](state, { payload }) {
            state.banners = payload.data.banner.list
            state.recommends = payload.data.recommend.list
        },
        [fetchHomeDataAction.rejected](state, { payload }) {}
    }
})
export default homeSlice.reducer

// 组件
import { connect } from 'react-redux'
class Home extends PureComponent {
    componentDidMount() {
        this.props.fetchHomeData()
    }
    render() {
        return <h2>home page</h2>
    }
}
const mapDispatchToProps = dispatch => ({
    fetchHomeData() {
        dispatch(fetchHomeDataAction())
    }
})
export default connect(null, mapDispatchToProps)(About)
```







# react-router@6

### 基本使用

- **内置组件Routes和Route**
- **Route组件有两个属性：path设置匹配路径、element设置渲染组件**
- **Link组件：to属性设置跳转路径，最终会被渲染成a元素**

```js
import { HashRouter, BrowserRouter } from 'react-router-dom'
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(
    <HashRouter>
    	<App/>
    </HashRouter>
)
```

```jsx
    {/* 路由链接 */}
    <Link to='/about'>关于</Link>
    <Link to='/profile'>我的</Link>

	{/* 注册路由 */}
	<Routes>
        <Route path="/about" element={<About/>}/>
        <Route path="/profile" element={<Profile/>}/>
            
        // 全都匹配不到，呈现notfound界面
        <Route path='*' element={<Notfound/>}/>
	</Routes>
```

- **NavLink组件：有样式的Link组件**

```js
<NavLink className={({isActive}) =>  isActive ? 'coderwhy' : ''} to='/about'>关于</NavLink>
<NavLink className={({isActive}) =>  isActive ? 'coderwhy' : ''} to='/profile'>我</NavLink>

.coderwhy {
    color: orange
}
```





### useRoutes()

- **一个普通函数，传入routes，会自动生成路由【实现将路由映射关系单独配置】**

```jsx
// router/index.js
export default [
  {
    path: '/',
    element: <Navigate to='/about'/>
  },
  {
    path: '/about',
    element: <About/>
  },
  {
    path: '/profile',
    element: <Profile/>
  },
]

//App.jsx
import { useRoutes } from 'react-router-dom'
import routes from './routes'

export default function App(){
  return (
    <div>
      {/* 注册路由 */}
      {useRoutes(routes)}
    </div>
  )
}
```





### Navigate组件

- **可用于路由的重定向**
- replace属性：用于控制跳转模式（默认是false）

```js
{/* Navigate组件可用于重定向 */}
<Route path='/' element={<Navigate to='/about'/>}/>
```

```jsx
import { Navigate } from 'react-router-dom'
export class Login extends PureComponent {
    constructor() {
        super()
        this.state = {
            isLogin: false
        }
    }
    login() {
        this.setState({ isLogin: true })
    }
    render() {
        const { isLogin } = this.state
        return (
            <div>
                <h2>Login page</h2>
                {!isLogin ? <button onClick={e => this.login()}>登录</button> : <Navigate to='/home'/>}
            </div>
        )
    }
}
```





### 路由嵌套

- **Outlet组件：子路由的占位元素**

```jsx
<Routes>
    <Route path="/home" element={<Home/>}>
        <Route path='/home/recommend' element={<HomeRecommend/>}/>
        <Route path='/home/rank' element={<HomeRank/>}/>
    </Route>
    <Route path="/about" element={<About/>}/>
</Routes>

// 子组件
<Link to='/home/recommend'>推荐</Link>
<Link to='/home/rank'>排行榜</Link>

	/* 占位的组件*/
<Outlet/>
```





### 编程式路由-useNavigate()

- **只能在函数式组件中顶层使用**

```jsx
import { useNavigate } from 'react-router-dom'
export function App(props) {
    const navigate = useNavigate()
    function navigateTo(path) {
        navigate(path)
    }
    return (
    	<div>
        	<button onClick={e => navigateTo('/category')}>分类</button>
            <button onClick={e => navigateTo('/order')}>订单</button>
        </div>
    )
}
```

- **类组件如何处理：通过高阶组件进行增强**

```JSX
function withRouter(cpn) {
    return function(props) {
        // 编程式路由导航
        const navigate = useNavigate()
        
        // 路由传参
        const params = useParams()
        const location = useLocation()
        const [searchParams] = useSearchParams()
        const query = Object.fromEntries(seachParams)
        
        const router = { navigate, params, location, query }
        return <cpn {...props} router={router}/>
    }
}
```





### 路由传参

#### useParams()-动态路由

- `/detail/${m.id}/${m.content}`

```jsx
//AboutCulture.js
export default function AboutCulture() {
  const [message] = useState([
    {id: 1, title: '消息1', content: '锄禾日当午'},
    {id: 2, title: '消息2', content: '汗滴禾下土'},
    {id: 3, title: '消息3', content: '谁知盘中餐'},
    {id: 4, title: '消息4', content: '粒粒皆辛苦'}
  ])
  return (
    <div>
      {
        message.map((m) => {
          return <Link to={`/detail/${m.id}/${m.content}`}>{m.title}</Link>
        })
      }
      <Outlet/>
    </div>
  )
}

//Detail.js
import { useParams } from 'react-router-dom'

export default memo(function Detail() {
  const { id, content } = useParams()
  return (
    <div>
      <h2>id: {id}</h2>
      <h2>content: {content}</h2>
    </div>
  )
})

// App.jsx
<Route path='/detail/:id/:content' element={<Detail/>}/>
```



#### useSearchParams()-query参数

- `detail?id=${m.id}&content=${m.content}`

```jsx
//AboutCulture.js
export default function AboutCulture() {
  const [message] = useState([
    {id: 1, title: '消息1', content: '锄禾日当午'},
    {id: 2, title: '消息2', content: '汗滴禾下土'},
    {id: 3, title: '消息3', content: '谁知盘中餐'},
    {id: 4, title: '消息4', content: '粒粒皆辛苦'}
  ])
  return (
    <div>
      {
        message.map((m) => {
          return <Link key={m.id} to={`detail?id=${m.id}&content=${m.content}`}>{m.title}</Link>
        })
      }
      <Outlet/>
    </div>
  )
}

//Detail.js
import { useSearchParams } from 'react-router-dom'

export default memo(function Detail() {
  const [searchParams, setSeatchParams] = useSearchParams()
  const id = searchParams.get('id')
  const content = searchParams.get('content')
  return (
    <div>
      <h2>id: {id}</h2>
      <h2>content: {content}</h2>
    </div>
  )
})
```



#### useLocation()

```js
//AboutCulture.js
export default function AboutCulture() {
  const [message] = useState([
    {id: 1, title: '消息1', content: '锄禾日当午'},
    {id: 2, title: '消息2', content: '汗滴禾下土'},
    {id: 3, title: '消息3', content: '谁知盘中餐'},
    {id: 4, title: '消息4', content: '粒粒皆辛苦'}
  ])
  return (
    <div>
      {
        message.map((m) => {
          return <Link key={m.id} to='detail' state={{id: m.id, content: m.content}}>{m.title}</Link>
        })
      }
      <Outlet/>
    </div>
  )
}

//Detail.js
import { useLocation } from 'react-router-dom'

export default memo(function Detail() {
  const {state: {id, content}} = useLocation()
  return (
    <div>
      <h2>id: {id}</h2>
      <h2>content: {content}</h2>
    </div>
  )
})
```



### 懒加载

- **React.lazy方法传入一个函数，该函数要求返回一个promise**
- **Suspense组件，通过fallback属性定义组件下载前显示内容**

```jsx
// router/index.js
const About = React.lazy(() => import('./pages/About'))
const Home = React.lazt(() => import('./pages/Home'))

// index.js
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(
	<HashRouter>
    	<Suspense fallback={<h2>Loading...</h2>}>
        	<App/>
        </Suspense>
    </HashRouter>
)
```







# React Hooks

- **【Hook是React16.8推出的新特性，它可以让我们在不编写class的情况下使用state和生命周期函数】**
- 100%向下兼容，可以渐进式使用hook，不需要直接将所有的代码重构为hook
- **只能在函数式组件的最顶层使用hook，不可以在循环(for)、条件判断(if)、子函数中使用**
- **可以在自定义hook函数（必须使用use开头）中使用，不可以在普通函数中使用**





### 类组件

- **优势**
  - **类组件可以定义自己的state，用来保存组件自己内部的状态**
  - **类组件有自己的生命周期，可以在对应的生命周期中完成相应逻辑**
  - **类组件在状态改变时只会重新执行render函数以及重新调用生命周期函数componentDidUpdate**
- **劣势**
  - **随着业务的增多，class组件会变得越来越复杂**
  - **复杂的this指向**











### useCallBack

- **useCallback返回一个函数的memorized值，在依赖不变的情况下，多次定义函数所返回的函数是相同的**

```js
const memorizedCallback = useCallback(() => {
    doSomething(a, b)
}, [a, b])
```

- **应用场景：将一个函数传递给子组件，要用useCallback进行优化，将优化之后的函数传递给子组件，避免子组件做无效渲染**

```jsx
const HYIncrement = memo(function(props) {
    const { increment } = props
    return (
    	<div>
            <button onClick={increment}>incre+1</button>
        </div>
    )
})

const App = memo(function() {
    const [count, setCount] = useState(0)
    const [msg, setMsg] = useState('hello')
    
    const increment = useCallback(function foo() {
        setCount(count + 1)
    }, [count])
    
    // 进一步优化，count发生改变不想引起HYIncrement的重新渲染,如何防止闭包陷阱？利用useRef()
    const countRef = useRef()
    countRef.current = count
    const increment = useCallback(function foo() {
        setCount(countRef.current + 1)
    }, [])
    
    return (
    	<div>
            <h2>计数：{count}</h2>
            <button onClick={increment}>+1</button>
            <HYIncrement increment={increment}/>
            <h2>信息：{msg}</h2>
            <button onClick={e => setMsg(Math.random())}>修改msg</button>
        </div>
    )
})
```





### useMemo

- **useMemo返回的是一个memorized值，在依赖不变的情况下，多次定义函数的时候，返回的值是相同的**
- **useCallback(fn, deps)相当于useMemo(() => fn, deps)**
- **场景一：进行计算操作，是否有必要每次渲染时都重新计算**

```jsx
import React, { useState, useMemo } from 'react'

function calcNumber(count) {
  let total = 0
  for(let i=1; i<=count; i++) {
    total = total + i
  }
  return total
}

const App = memo(function () {
  const [count, setCount] = useState(10)
  
  const total = useMemo(() => {
    return calcNumber(count)
  }, [count])
  
  return (
    <div>
      <h2>计算结果：{total}</h2>
      <button onClick={e => setCount(count+1)}>+1</button>
    </div>
  )
})
```

- **场景二：对子组件传递相同内容的对象时，使用useMemo进行性能优化**

```jsx
import React, { useState, useMemo } from 'react'

const App = memo(function () {
  
  const info = useMemo(() => {
    return {name: 'why', age: 18}
  }, [])
  
  return (
    <div>
      <HelloWorld info={info}></HelloWorld>
    </div>
  )
})
```







### useRef

- **返回一个ref对象，这个对象在组件的整个生命周期保持不变**
- **场景一：获取dom节点或组件实例（类组件）**

```js
import React, { useRef } from 'react'

export default function RefHook() {
  const titleRef = useRef()

  function showTitleDom() {
    console.log(titleRef.current)
  }
  
  return (
    <div>
      <h2 ref={titleRef}>coderwhy</h2>
      <button onClick={showTitleDom}>修改文本</button>
    </div>
  )
}
```

- **场景二：解决闭包陷阱**

```js
import React, { useState, useRef, useCallback } from 'react'

export default function RefHook() {
  const [count, setCount] = useState(0)
  const countRef = useRef(count)
  countRef.current = count
  
  const increment = useCallback(() => {
      setCount(countRef.current + 1)
  }, [])
  
  return (
    <div>
      <h2>count值:{count}</h2>
      <button onClick={increment}>+10</button>
    </div>
  )
}
```





### useContext

```jsx
// index.js
const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(
	<UserContext.Provider value={{name: 'why', age: 18}}>
    	<ThemeContext.Provider value={{color: 'red', fontSize: 30}}>
        	<App/>
        </ThemeContext.Provider>
    </UserContext.Provider>
)

// App.jsx
const App = memo(() => {
    const user = useContext(UserContext)
    const theme = useContext(ThemeContext)
    return (
    	<div>
            <h2>User: {user.name}-{user.age}</h2>
            <h2 style={theme}>Theme</h2>
        </div>
    )
})
```





### useImperativeHandle

- **通过forwardRef将子组件的dom直接暴露给父组件；父组件拿到dom后可以进行任意的操作，会变得不可控**
- **通过useImperativeHandle可以只暴露固定的操作；该方法第二个参数是一个函数，会返回一个对象；在父组件中，使用 inputRef.current时，实际上使用的是返回的对象；**

```js
import React, { forwardRef, useImperativeHandle, useRef} from 'react'

const HYinput = forwardRef((props, ref) => {
    const inputRef = useRef()
    useImperativeHandle(ref, () => {
        return {
            focus(){
                inputRef.current.focus()
            }
        }
    }
    return <input ref={inputRef} type='text'/>
})

export default function ImperativeHandleHook() {
  const inputRef = useRef()
  return (
    <div>
      <HYinput ref={inputRef}/>
      <button onClick={e => inputRef.current.focus()}>聚焦</button>
    </div>
  )
}
```





### useLayoutEffect

- **useEffect会在渲染的内容更新到dom上后执行，不会阻塞dom的更新**
- **useLayoutEffect会在渲染的内容更新到dom上之前执行，会阻塞dom的更新**
- 如果希望某些操作发生之后再更新dom，那么应该将这个操作放到useLayoutEffect





### 自定义Hook

- 监听窗口滚动位置

```jsx
export default function useScrollPosition() {
    const [scrollX, setScrollX] = useState(0)
    const [scrollY, setScrollY] = useState(0)
    
    useEffect(() => {
        function handleScroll() {
            setScrollX(window.scrollX)
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    
    return [scrollX, scrollY]
}

//app.jsx
import useScrollPosition from './hooks/useScrollPosition'
const Home = memo(() => {
    const [scrollX, scrollY] = useScrollPosition()
    return <h2>Home page: {scrollX}-{scrollY}</h2>
})
const About = memo(() => {
    const [scrollX, scrollY] = useScrollPosition()
    return <h2>About page: {scrollX}-{scrollY}</h2>
})
```





### Redux hooks

- 使用hook前

```jsx
const App = memo((props) => {
    const { count, addNumber, subNumber } = props
    function addNumberHandle(num, isAdd = true) {
        if(isAdd) {
            addNumber(num)
        } else {
            subNumber(num)
        }
    }
    return (
    	<div>
            <h2>当前计数：{count}</h2>
            <button onClick={e => addNumberHandle(5)}>+5</button>
            <button onClick={e => addNumberHandle(8, false)}>-8</button>
        </div>
    )
})
const mapStateToProps = (state) => ({
    count: state.counter.count
})
const mapDispatchToProps = (dispatch) => ({
    addNumber(num) {
        dispatch(addNumberAction(num))
    },
    sunNumber(num) {
        dispatch(subNumberAction(num))
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
```

- **使用hook后**

  - **useSelector：**

    - **参数一：将state映射到组件中**

    - **参数二：可以进行比较来决定组件是否重新渲染（引入shallowEqual函数）**

  - **useDispatch：返回dispatch函数，在组件中可以直接使用**

```jsx
const App = memo((props) => {
    const { count } = useSelector((state) => {
        return {
            count: state.counter.count
        }
    }, shallowEqual)
    const dispatch = useDispatch()
    function addNumberHandle(num, isAdd = true) {
        if(isAdd) {
            dispatch(addNumberAction(num))
        } else {
            dispatch(subNumberAction(num))
        }
    }
    return (
    	<div>
            <h2>当前计数：{count}</h2>
            <button onClick={e => addNumberHandle(5)}>+5</button>
            <button onClick={e => addNumberHandle(8, false)}>-8</button>
        </div>
    )
})
export default App
```







### useTransition















