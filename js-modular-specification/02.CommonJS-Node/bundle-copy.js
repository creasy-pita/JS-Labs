// 打包后文件解读
(function () { 
  function r(e, n, t) { 
    //定义o函数
    function o(i, f) { 
      debugger
      if (!n[i]) { 
        if (!e[i]) { 
          var c = "function" == typeof require && require; 
          if (!f && c) return c(i, !0); 
          if (u) return u(i, !0); 
          var a = new Error("Cannot find module '" + i + "'"); 
          throw a.code = "MODULE_NOT_FOUND", a 
        } 
        var p = n[i] = { exports: {} }; 
        e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) 
      } 
      return n[i].exports 
    }
    //遍历并执行o函数
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
      o(t[i]); 
    return o 
  }
//返回函数 fun(e,n,t)
  return r 
})()({
  1: [function (require, module, exports) {
    // 将其他的模块汇集到主模块
    const uniq = require('uniq')
    let module1 = require('./modules/module1')
    let module2 = require('./modules/module2')
    let module3 = require('./modules/module3')

    module1.foo()
    module2()
    module3.foo()
    module3.bar()
    console.log(uniq(module3.arr));
  }, { "./modules/module1": 2, "./modules/module2": 3, "./modules/module3": 4, "uniq": 5 }], 2: [function (require, module, exports) {
    //module.exports = value 暴露一个对象
    module.exports = {
      msg: 'module1',
      foo() {
        console.log(this.msg);
      }
    }
  }, {}], 3: [function (require, module, exports) {
    //module.exports = function(){} 暴露一个函数
    module.exports = function () {
      console.log('module2');
    }
    //module.exports ={} //会覆盖上面写的
  }, {}], 4: [function (require, module, exports) {
    //exports.xxx = value
    exports.foo = function () {
      console.log('foo() module3');
    }
    exports.bar = function () {
      console.log('bar() module3');
    }
    exports.arr = [1, 2, 2, 33, 33, 4, 4, 5, 5]
  }, {}], 5: [function (require, module, exports) {
    "use strict"

    function unique_pred(list, compare) {
      var ptr = 1
        , len = list.length
        , a = list[0], b = list[0]
      for (var i = 1; i < len; ++i) {
        b = a
        a = list[i]
        if (compare(a, b)) {
          if (i === ptr) {
            ptr++
            continue
          }
          list[ptr++] = a
        }
      }
      list.length = ptr
      return list
    }

    function unique_eq(list) {
      var ptr = 1
        , len = list.length
        , a = list[0], b = list[0]
      for (var i = 1; i < len; ++i, b = a) {
        b = a
        a = list[i]
        if (a !== b) {
          if (i === ptr) {
            ptr++
            continue
          }
          list[ptr++] = a
        }
      }
      list.length = ptr
      return list
    }

    function unique(list, compare, sorted) {
      if (list.length === 0) {
        return list
      }
      if (compare) {
        if (!sorted) {
          list.sort(compare)
        }
        return unique_pred(list, compare)
      }
      if (!sorted) {
        list.sort()
      }
      return unique_eq(list)
    }

    module.exports = unique

  }, {}]
}, {}, [1]);
