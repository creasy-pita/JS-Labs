
# browserify模块化

## 构建项目结构

## 下载browserify

全局 npm install browserify -g
局部 npm install browserify --save-dev

## 使用browserify编译打包

browserify app.js -o dist/bundle.js

## 打包文件放到html

```html
<script type="text/javascript" src="dist/bundle.js" ></script>
```

### 打包后bundle.js文件解读

参考：
<http://zhenhua-lee.github.io/nodejs/browserify.html>
<https://benclinkinbeard.com/posts/how-browserify-works/>
<https://github.com/browserify/browser-pack/blob/d29fddc8a9207d5f967664935073b50971aff708/prelude.js>

#### IIFE

最外部是一个IIFE,第二层是一个`function r(modulesMap,cache,entry)`的定义和返回
参数包括modulesMap,cache,entry;简单的原型如下;

```javascript
(function () { 
  function r(modulesMap,cache,entry) { 
  }
  return r 
})()(params)
```

##### the module map

第一个参数e是一个用到模块列表，可以叫map,key是一个唯一的数字，value是两个元素的数组。

比如下图：

```javascript
{
  1: [function (require, module, exports) {
    module.exports = 'DEP';

  }, {}],
  2: [function (require, module, exports) {
    require('./dep');

    module.exports = 'ENTRY';

  }, {"./dep": 1}]
}
```

##### cache

第二个参数n是模块的缓存

##### entry modules

第三个参数是id，它是构建这个依赖图的`入口模块`的id

#### Making it all work

上面的整个函数有一个通俗版本[prelude.js](https://github.com/browserify/browser-pack/blob/d29fddc8a9207d5f967664935073b50971aff708/prelude.js)

```javascript

// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function outer (modules, cache, entry) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof require == "function" && require;

    function newRequire(name, jumped){
        if(!cache[name]) {
            if(!modules[name]) {
                // if we cannot find the the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof require == "function" && require;
                if (!jumped && currentRequire) return currentRequire(name, true);

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) return previousRequire(name, true);
                throw new Error('Cannot find module \'' + name + '\'');
            }
            var m = cache[name] = {exports:{}};
            modules[name][0].call(m.exports, function(x){
                var id = modules[name][1][x];
                return newRequire(id ? id : x);
            },m,m.exports,outer,modules,cache,entry);
        }
        return cache[name].exports;
    }
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);

    // Override the current require with this new one
    return newRequire;
})
```

### 工作的步骤

browserify bundle.js工作的步骤
1 外层IIFE自动执行，返回r(modulesMap,cache,entry)函数

```javascript
(function () {  
})()
```

2 传入模块列表moduleMap,cache,entry等参数，执行r函数

```javascript
(function () { 
  function r(modulesMap,cache,entry) { 
  }
  return r 
})()(params)
```

本例中`params`为

```javascript
{
  1: [function (require, module, exports) {
    module.exports = 'DEP';

  }, {}],
  2: [function (require, module, exports) {
    require('./dep');

    module.exports = 'ENTRY';

  }, {"./dep": 1}]
}
```

3 遍历entry数组（即入口可能有多个）,获取每个最入口js模块的js独享


```javascript
// 比如 i=0, entry[0] = 2，调用newRequire(2)，会去获得最外层，也就是entry.js模块的js对象
    for(var i=0;i<entry.length;i++) newRequire(entry[i]);
```


4 调用`newRequire`方法获得入口模块的js对象

当前方法的变量： moduleKeyId=2（对应entry.js模块）

4.1 执行`modulesMap[moduleKeyId][0].call`获取`entry.js`模块，`entry.js`模块内部依赖的`dep.js`模块对象会调用传入的require函数返回
4.2 执行`return cache[moduleKeyId].exports`，返回

```javascript
        function newRequire(moduleKeyId, jumped) {
            //如果缓存中不存在
            if (!cache[moduleKeyId]) { 
                if (!modulesMap[moduleKeyId]) { 
                    var currentRequire = "function" == typeof require && require; 
                    if (!jumped && currentRequire) return currentRequire(moduleKeyId, !0); 
                    if (previousRequire) return previousRequire(moduleKeyId, !0); 
                    var a = new Error("Cannot find module '" + moduleKeyId + "'"); throw a.code = "MODULE_NOT_FOUND", a 
                } 
                var _module = cache[moduleKeyId] = { exports: {} }; 
                modulesMap[moduleKeyId][0].call(
                    //call函数的第一个参数，用来重定义this对象
                    _module.exports,
                    //就是require的定义，传入模块id调用，会返回模块对象
                    function (moduleName) { 
                         var keyId = modulesMap[moduleKeyId][1][moduleName];
                         return newRequire(keyId || moduleName) 
                    },
                    _module, _module.exports, r, modulesMap, cache, entry
                ) 
            }
            //返回 cache[moduleKeyId].exports,也就是 _module.exports
            return cache[moduleKeyId].exports
        }
```

问题
`function newRequire`作用
`return newRequire`干什么用
