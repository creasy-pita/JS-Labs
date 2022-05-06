//browserify bundle的文件解读
var outer = 
(function(){
    function r(modulesMap,cache,entry){
        function newRequire(moduleKeyId, jumped) {
            //如果缓存中不存在
            console.log("moduleKey");
            console.log(moduleKeyId);
            if (!cache[moduleKeyId]) { 
                if (!modulesMap[moduleKeyId]) { 
                    var currentRequire = "function" == typeof require && require; 
                    if (!jumped && currentRequire) return currentRequire(moduleKeyId, !0); 
                    if (previousRequire) return previousRequire(moduleKeyId, !0); 
                    var a = new Error("Cannot find module '" + moduleKeyId + "'"); throw a.code = "MODULE_NOT_FOUND", a 
                } 
                var _module = cache[moduleKeyId] = { exports: {} }; 
                // call的用法 ,对应模块定义中的function(require,module,exports)方法
                modulesMap[moduleKeyId][0].call(
                    //call函数的第一个参数，用来重定义this对象
                    _module.exports,
                    //就是require的定义，传入模块id调用，会返回模块对象
                    function (moduleName) { 
                         var keyId = modulesMap[moduleKeyId][1][moduleName];
                        //  console.log(keyId);
                        //  console.log(moduleName);
                        //  console.log(keyId || moduleName);
                        //  console.log(newRequire);
                         return newRequire(keyId || moduleName) 
                    },
                    _module, _module.exports, r, modulesMap, cache, entry
                ) 
            }
            //返回 cache[moduleKeyId].exports,也就是 _module.exports
            return cache[moduleKeyId].exports
        }
        //遍历入口entry数组，给通过newRequire方法给每个入口完成js对象的组块
        for(var previousRequire="function"==typeof require&&require,i=0;i<entry.length;i++)
            newRequire(entry[i]);
        //返回newRequire ，比如 var a =r(modulesMap,cache,entry);a会赋值为newRequire
        return newRequire
    }
    return r
})()(
    {
        1:[
            function(require,module,exports){
                module.exports = 'dep';
            }
            ,{}
        ],
        2:[
            function(require,module,exports){
                let dep = require('./dep');
                console.log(dep);
                // console.log(modulesMap);
                module.exports = "entry";
            }
            ,{"./dep":1}
        ]
    },{},[2]);

console.log(outer);
