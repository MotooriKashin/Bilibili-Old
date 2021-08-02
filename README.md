使用`typescript`重构的版本，主要改动及目标有：
1. 除B站原生脚本外全部使用`typescript`重构，再由`tsc`模块编译回`JavaScript`。
2. 模块使用脚本管理器提供的存储API`GM_setValue`而不是资源`@resource`元数据方案，让脚本能主动接管模块更新检查。
3. 模块导入方法支持`importModule`支持像函数调用一样传递参数给要导入的模块，不再依赖页面上下文`window`传递也不再主动暴露对象。
4. 配置任务链主动记录模块`commit`哈希值，不再需要手动获取和修改。

---
**项目当前处于脚本框架搭建阶段，实际功能完全不能用中！**
### 构建指南
1. 环境依赖：
   - Visual Studio Code
   - node.js
   - git
2. 源文件目录：
   - src：typescript代码目录
   - JavaScript：typescript原文件编译的js输出目录，自动生成，请勿手动修改！（B站原生脚本除外）
   - CSS：css资源目录
   - Json：json资源目录
   - image：图片资源目录
   - build：任务脚本目录
3. 编译：
   - 代码编辑
      - 除B站原生脚本外都在src目录下编辑ts文件，项目原声提供一些全局变量(见下文)可直接调用。
      - 理论上上每个功能都可以拆分成一个ts模块文件
      - Json等资源目录文件可使用高级API`GM`(见下文)系列引入到代码中
      - 脚本元数据在`meta.json`，版本号等请在这里修改
   - 编译任务
      - 项目提供一个默认任务`build`（VSCode默认快捷键`Ctrl + Shift + B`），依次执行编译ts文件、记录commit哈希值、生成脚本等任务
      - 运行编译任务后的生成文件git检查到有文件修改，请将**除`main.user.js`和`resource.json`外的**修改提交后再一次运行编译任务，依次往复直到再无变动为止。
      - 最终得到的是主目录下的`main.user.js`即是可供安装使用的脚本主体文件。
      - *项目额外提供一个`biuld-local`任务，该任务生成的`main.user.js`将使用本地文件作为模块，仅作为开发调试使用（切勿提交该版本！），安装后将直接使用本地磁盘上项目的模块，任务本地对于模块的修改编译后都可以直接刷新到（甚至不用提交！），注意允许脚本管理器访问本地文件权限！*
   - 提交推送
      - **`main.user.js`和`resource.json`请作为单独的提交留到最后！**即编译任务生成的文件若有`main.user.js`和`resource.json`外的文件变动，请将那些文件提交后再次编译，重复直到只剩`main.user.js`和`resource.json`两个文件有变动，这时才可以提交`main.user.js`和`resource.json`两个文件。因为`main.user.js`写入的模块信息（来自`resource.json`）需要同步到最新才是有效的。

---
### 全局变量
`index.ts`作为项目主模块，共享了一些全局数据给所有其他模块调用，这些数据可以向使用“全局变量”一样直接使用，但请注意：这些被作为“全局变量”的变量名不可以在模块顶层再重新定义！打个比方一个模块就是一个函数的花括号`{}`间的函数体，而这些全局变量就是圆括号`()`里声明的传递给函数的参数。
1. API：这是模块间共享数据的对象，其上定义有一些核心方法，模块也可以将要暴露给其他模块的方法附加到上面
   - 例：API上有一个`importModule`用于载入模块，可以直接`API.importModule("要载入的模块名字")`这样使用。
   - 例：本模块定义了一个函数`md5`想要在另一个模块中使用。可以令`API.md5=md5`，另一个模块就可以`API.md5()`这样使用。当然：
      1. 要确保两个模块都载入运行了，最好定义该函数的模块运行在先，用到该函数的模块运行在后。
      2. 往API对象上添加方法和属性需要符合typescript语法，具体可参考`xhr.js`等核心模块的实现方案。
2. GM：封装的脚本管理器提供的高级API，如`GM_getValue`
   - 注意：方法名称修正为了符合“驼峰命名法”的样子，如`GM_xmlhttpRequest`应该使用`GM.xmlHttpRequest`。
   - 注意：仅提供了封装后版本，直接使用`GM_getValue`等是不可以的，请用`GM.getValue`。
   - 目前只提供了用到的高级API，清单参考`meta.json`的`grant`属性，如需添加也请添加名称到该处，并在`index.ts`顶部依格式封装一下。
3. config：用户自定义某些功能开关的设置数据
4. importModule：将`API.importModule`单独独立了出来

模块也可以传递一些全局变量给由本模块通过`importModule`方法引入的另一模块，但仅能在哪个模块中使用，如
```
// module1.js
    function md5 = (str:string)=> {/* 函数实现 */}
    importModule("module2.js",{md5: md5, debug: console.log})

// module2.js
    debug(md5("1")) // 控制台打印字符串“1”的md5哈希值：c4ca4238a0b923820dcc509a6f75849b
```
这个例子中模块`module1.js`定义了一个名为`md5`函数求取字符串的md5哈希值，然后导入模块`module2.js`时将该函数与标准函数`console.log`分别命名为`md5`和`debug`传递给`module2.js`，于是`module2.js`中直接就能用这两个名称使用这两个函数了。