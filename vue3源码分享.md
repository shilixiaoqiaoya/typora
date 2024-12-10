### v8引擎

![image-20240904172353367](/Users/tal/Library/Application Support/typora-user-images/image-20240904172353367.png)

V8选择将JS代码编译到机器代码执行，**机器码的执行性能已经非常之高**，引入字节码则是选择编译js代码到一个中间态的字节码，执行时性能是低于机器代码的，**V8引入字节码的动机是什么呢？**

- **① 减轻机器码占用的内存空间，即牺牲时间换空间**
  - **机器码占空间很大**
  - 通过恰当设计字节码的编码方式，**字节码可以做到比机器码紧凑很多**
  
- **② 提高代码的启动速度**

  - 内存占用过大的问题被消除，就可以提前编译所有代码了
  - **v8对于facebook网站可以选择全部提前编译js代码为字节码，并把字节码缓存下来**

<img src="/Users/tal/Library/Application Support/typora-user-images/image-20240901132647768.png" alt="image-20240901132647768" style="zoom:50%;" />





## vue库源码整体架构

<img src="/Users/tal/Library/Application Support/typora-user-images/image-20240901131923239.png" alt="image-20240901131923239" style="zoom:37%;" />

- Monorepo

- compiler-sfc：处理单文件组件， 将 .vue文件转换为.js文件

  Compiler-dom，compiler-core：将 template编译成render函数

- Runtime运行时：渲染器renderer 

  - 可以渲染到不同端：浏览器、服务端ssr、移动端
  - Runtime-dom：针对浏览器端

- 响应式reactivity

<img src="/Users/tal/Library/Application Support/typora-user-images/image-20240901175242626.png" alt="image-20240901175242626" style="zoom:50%;" />

createApp(App).mount('#app')的源码跟踪 

- 装饰器模式：不改变原有的实现，对方法进行增强
- 单例模式





## 编译器

- 将我们编写的模版编译成可以在运行时生成虚拟dom树的render渲染函数

- 三个步骤：解析、转换、代码生成

- 和babel类似

  ![image-20240904180047279](/Users/tal/Library/Application Support/typora-user-images/image-20240904180047279.png)

<img src="/Users/tal/Library/Application Support/typora-user-images/image-20240904180321257.png" alt="image-20240904180321257" style="zoom:30%;" />





![](/Users/tal/Library/Application Support/typora-user-images/image-20240901194932575.png)

### WeakMap

1、**key只能使用对象**，不能使用其他数据类型

2、**key对对象的引用是弱引用，对垃圾回收更加友好**

应用:vue3响应式所采用的数据结构

```js
const obj = {
    name:'why',
    age:18
}
//obj的name发生改变需要执行的函数
function objNameFn1(){
    console.log(objNameFn1)
}
function objNameFn2(){
    console.log(objNameFn2)
}
//obj的age发生改变需要执行的函数
function objAgeFn1(){
    console.log(objAgeFn1)
}
function objAgeFn2(){
    console.log(objAgeFn2)
}

//创建WeakMap
const weakMap = new WeakMap()
//收集依赖结构
const map = new Map()
map.set('name', [objNameFn1, objNameFn2])
map.set('age', [objAgeFn1, objAgeFn2])
weakMap.set(obj,map)
//如果obj的name发生了改变
obj.name = 'curry'
const targetMap = weakMap.get(obj)
const fns = targetMap.get('name')
fns.forEach(item => item())
```





trackid防止依赖被重复收集   相较于set的优势在哪里？





### reactive

```js
<h1 id="title"></h1>
// 1.通过reactive创建一个响应式的对象
const info = reactive({
  name: "王小波",
  age: 18
})

// 2.使用effect函数包裹fn
const titleH1 = document.querySelector("#title")
// 执行effect函数到底做了什么?
// 执行传入的fn函数到底做了什么?
effect(() => {
  titleH1.innerHTML = info.name
})

setTimeout(() => {
  info.name = "李银河"
}, 2000);
```



 ```js
 export function reactive(target: object) {
   // if trying to observe a readonly proxy, return the readonly version.
   // 判断是否已经是一个只读代码, 是的话直接返回target
   if (isReadonly(target)) {
     return target
   }
   // 通过调用createReactiveObject来创建响应式对象
   // 只读对象是在readonly函数中, 第二个参数传入一个true
   // mutableHandlers: 是我们之后的getter/setter等操作的一个对象
   // mutableCollectionHandlers: 对几何类型的代理处理器, Map/Set
   // reactiveMap全局对象, 用来存放target到响应式对象的映射关系
   return createReactiveObject(
     target,
     false,
     mutableHandlers,
     mutableCollectionHandlers,
     reactiveMap, 
   )
 }
 
 // createReactiveObject()核心
 	const proxy = new Proxy(
     target,
     // 什么是Collection? Map/Set/WeakMap/WeakSet
     targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers,
   )
 ```



```js
// baseHandlers
  class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    super(false, isShallow)
  }
    
  get(target: Target, key: string | symbol, receiver: object) {
    const isReadonly = this._isReadonly,
      isShallow = this._isShallow
    // 判断key是否是响应对象/只读/浅层响应等
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    } else if (key === ReactiveFlags.RAW) {
      if (
        receiver ===
          (isReadonly
            ? isShallow
              ? shallowReadonlyMap
              : readonlyMap
            : isShallow
              ? shallowReactiveMap
              : reactiveMap
          ).get(target) ||
        // receiver is not the reactive proxy, but has the same prototype
        // this means the reciever is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
      ) {
        return target
      }
      // early return undefined
      return
    }

    // 判断是否是数组类型
    const targetIsArray = isArray(target)

    if (!isReadonly) {
      // 如果是数字类型, 并且是一些数组特有的操作, 会使用arrayInstrumentations来处理
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver)
      }
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }

    // 直接从原生对象上获取res
    const res = Reflect.get(target, key, receiver)
    // 如果是Symbol并且是builtInSymbols(内建符号), 或者其他不可跟踪的key, 那么直接返回, 不收集依赖
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res
    }
    // 不是只读属性
    if (!isReadonly) {
      // 调用track跟踪依赖
      track(target, TrackOpTypes.GET, key)
    }
    // 如果是isShallow, 那么不进行深层的代理
    if (isShallow) {
      return res
    }
    // 是ref, 并且key是一个数字, 那么返回res或者res.value
    if (isRef(res)) {
      // ref unwrapping - skip unwrap for Array + integer key.
      return targetIsArray && isIntegerKey(key) ? res : res.value
    }
    // 如果是一个对象类型, 那么进行对象的深层代理(key对应的res又是一个对象类型)
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }

  set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ): boolean {
    // 先从target中获取旧的值(为了后续判断新值和旧值是否发生了变化, 还有ref/只读属性的特殊情况)
    let oldValue = (target as any)[key]
    // 看是否是浅层响应
    if (!this._isShallow) { // 深层响应模式
      // 旧的值是不是只读的属性
      const isOldValueReadonly = isReadonly(oldValue)
      if (!isShallow(value) && !isReadonly(value)) {
        // 不是只读的, 也不是浅层的, 那么都转化成原始的value
        oldValue = toRaw(oldValue)
        value = toRaw(value)
      }
      // 目标不是一个数组, 并且旧值是一个ref, 但是新值不是一个ref
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) { // 旧值是只读的, 直接返回false, 不允许修改
          return false
        } else { // 旧值是ref, 新值不是, 那么直接将oldValue.value = value即可
          oldValue.value = value
          return true
        }
      }
    } else {
      // in shallow mode, objects are set as-is regardless of reactive or not
    }
    // 判断key是否已经在target当中了
    const hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key)
    // 通过Reflect.set(设置新的值
    const result = Reflect.set(target, key, value, receiver)
    // don't trigger if target is something up in the prototype chain of original
    // 如果目标对象是receiver的原始对象, 那么才会触发更新
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        // 新增属性, 触发ADD
        trigger(target, TriggerOpTypes.ADD, key, value)
      } else if (hasChanged(value, oldValue)) {
        // 修改属性的值, 触发SET
        trigger(target, TriggerOpTypes.SET, key, value, oldValue)
      }
    }
    return result
  }

  deleteProperty(target: object, key: string | symbol): boolean {
    const hadKey = hasOwn(target, key)
    const oldValue = (target as any)[key]
    const result = Reflect.deleteProperty(target, key)
    if (result && hadKey) {
      trigger(target, TriggerOpTypes.DELETE, key, undefined, oldValue)
    }
    return result
  }

  has(target: object, key: string | symbol): boolean {
    const result = Reflect.has(target, key)
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, TrackOpTypes.HAS, key)
    }
    return result
  }
  ownKeys(target: object): (string | symbol)[] {
    track(
      target,
      TrackOpTypes.ITERATE,
      isArray(target) ? 'length' : ITERATE_KEY,
    )
    return Reflect.ownKeys(target)
  }
}
```



### effect(fn)

```js
  // 调用一次effect函数, 会根据传入的fn, 创建一个新的ReactiveEffect对象: _effect
// fn和_effect循环引用
  // 根据fn -> _effect对象，即activeEffect
  // fn会变成_effect对象的fn属性
  const _effect = new ReactiveEffect(fn, NOOP, () => {
    if (_effect.dirty) {
      _effect.run()
    }
  })
  /**
    _effect对象内部的scheduler 就是
    () => {
      if (_effect.dirty) {
        _effect.run()
      }
    }
    那么也就意味着, 当内部执行scheduler的时候, 它会回头调用_effect的run, 而run方法内部, 会调用fn
    意味着: scheduler() => run() => fn()
    如何执行: 那么之后我们如果想要重新执行fn函数, 只需要执行scheduler就可以了
   */
  
  
  
  
  
  run() {
    // computed: 运行过一次就变成不是脏值了(不再是“脏”状态)
    // 这对于 computed 属性来说尤为重要，因为它们的值只在依赖发生变化时才需要重新计算。
    this._dirtyLevel = DirtyLevels.NotDirty
    // 不是active的(active=false), 直接执行即可, 不需要做依赖收集
    if (!this.active) {
      return this.fn()
    }
    // 保存上一次是否应该收集依赖的(解决嵌套effect使用的)
    let lastShouldTrack = shouldTrack
    // 保存上一次的activeEffect(解决嵌套effect使用的)
    let lastEffect = activeEffect
    try {
      shouldTrack = true
      // 这里是将当前的reactiveEffect赋值给了activeEffect
      // 所以全局的activeEffect就有值了, 那么我们收集依赖的时候就可以使用activeEffect了
      activeEffect = this
      this._runnings++ // 记录是否在运行, 运行完会--
      // 在执行真正的effect函数之前, 先将上一次的清除掉
      // 为什么? 因为如果我们使用v-if/else依赖的是不同的数据, 获取某些数据在执行后就被移除了
      preCleanupEffect(this)
      // 执行过程中会重新收集依赖
      return this.fn()
    } finally {
      // 如果后续还有多余的不再使用的依赖, 那么直接清除掉
      // 第一次的依赖: {name, age, height, address}
      // 第二次的依赖: { name, age }, 那么height/address就需要清除掉
      postCleanupEffect(this)
      this._runnings--
      // 执行完操作后再赋值给activeEffect
      activeEffect = lastEffect
      shouldTrack = lastShouldTrack
    }
  }
```



### track收集依赖

```js
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep(() => depsMap!.delete(key))))
    }
    trackEffect(
      activeEffect,
      dep,
      __DEV__
        ? {
            target,
            type,
            key,
          }
        : void 0,
    )
  }
}
```

### trigger触发依赖

```js
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>,
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  let deps: (Dep | undefined)[] = []
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    deps = [...depsMap.values()]
  } else if (key === 'length' && isArray(target)) {
    const newLength = Number(newValue)
    depsMap.forEach((dep, key) => {
      if (key === 'length' || (!isSymbol(key) && key >= newLength)) {
        deps.push(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  pauseScheduling()
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        DirtyLevels.Dirty,
        __DEV__
          ? {
              target,
              type,
              key,
              newValue,
              oldValue,
              oldTarget,
            }
          : void 0,
      )
    }
  }
  resetScheduling()
} 
```





### ？清除依赖

```js
    // 1.创建一个响应式的对象reactive
    const info = reactive({
      isNick: true,
      name: "why",
      nickname: "coderwhy"
    })

    // 2.使用effect函数包裹fn
    const titleH1 = document.querySelector("#title")
    effect(() => {
      titleH1.innerHTML = info.isNick ? info.nickname: info.name
    })

    setTimeout(() => {
      info.isNick = !info.isNick
    }, 2000);
```





### ？嵌套

```js
const info = reactive({
      isNick: true,
      name: "why",
      nickname: "coderwhy"
    })

    // 2.使用effect函数包裹fn
    const titleH1 = document.querySelector("#title")
    effect(() => {
      console.log(info.isNick)

      effect(() => {
        console.log(info.name)

        effect(() => {
          console.log(info.nickname)
        })
      })
    })

    setTimeout(() => {
      info.isNick = !info.isNick
    }, 2000);
```





### ref





### 响应式

- **相较于vue2响应式优点：**
  - **vue2对数组不能实现响应式监听，需要重写部分方法**
  - **13种捕获器，功能更强大**  

**在getter中收集依赖，在setter中触发依赖。**先收集依赖，即把用到该数据的地方收集起来，然后等属性发生变化时，把之前收集好的依赖循环触发一遍就行了。

**所谓的依赖，其实就是Watcher，当外界通过Watcher读取数据时，便会触发getter从而将Watcher添加到依赖中，**哪个Watcher触发了getter，就把哪个Watcher收集到Dep中。当数据发生变化时，会循环依赖列表，把所有的Watcher都通知一遍。







## renderer































