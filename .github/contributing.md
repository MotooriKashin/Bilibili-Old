# 代码贡献指南
### 开发环境搭建
- 代码编辑及编译生成工作全部使用[Visual Studio Code](https://code.visualstudio.com/)作为IDE.
- 安装[Git](https://git-scm.com/)作为版本管理工具.
- 安装[Node.js](https://nodejs.org/en/)作为编译环境.
- 全局安装[TypeScript]以支持TypeScript语言的编译. →`npm install -g typescript`.
- 浏览器及脚本管理工具：推荐 Chrome + Tampermonkey.

### 开发语言 TypeScript
- target: es2018: ESNext新特性不报错就可以用且推荐用，但不要为了强行用引入任何`Polyfill`.
- 原生ts/js语言，不适用任何前端框架.

### 源码目录
- ./src: ts源代码，代码贡献基本位于此.
- ./dist: B站原生代码，未能移植为ts代码，继续使用js语言开发.
- ./html|json|css: 非代码资源.
- ./main.user.js: 编译生成的脚本.

### 模块化
本项目基于TypeScript的`namespace`语法设计了一种模块体系，可以将代码拆分为任意多的ts模块文件，以便进行开发和维护。此模块化体系具有以下特点：
- 运行上下文回到了页面，可以直接访问全局变量，同时通过专门的`GM`对象引用了脚本管理器提供的高级API.
- 使用文件名(含拓展名)作为唯一索引，不可重复.
- 同步按需加载.

模块原则上必须使用同一个顶层命名空间`namespace`——API.  
模块可以分为两种类型：功能模块和库：后者声明定义了各种函数、类等对象供前者调用以执行一些功能。
#### 库
纯粹的变量定义声明所在的模块，使用`export`关键词导出所有数据：变量、函数、类……  
作为库的模块无须主动加载，只要使用标准格式编写就行了，如下文定义了`md5`函数的库：
```
interface modules {
  /** md5.js */
  readonly "md5.js": string;
}
namespace API {
  export function md5(str:string){
    /** 具体函数实现略 */
  }
}
```
#### 功能模块
实际执行一定功能的模块，可以直接调用库中使用`export`关键词导出的数据，但禁止使用`export`关键词导出任何数据.  
功能代码需要主动使用`importModule`载入运行，用法类似于函数调用.

### GM对象
模块中无法直接使用脚本管理器提供的高级API，取而代之的是一个可用的全局变量`GM`，该变量封装于`GM.ts`，并在`meta.json`声明了目前用到的高级API，请自行按需拓展.  
封装的高级API作为`GM`变量的属性使用，看起来像GM3后的`GM.`系列，实际上仍是`GM_`系列，也就是说还是同步的.

### 编译
脚本编译流程已编写为VSCode的任务链，直接运行`release`任务即可完成编译生成的操作，最终产物为`main.user.js`。——该任务已设为默认任务，可以直接使用快捷键`Ctrl` + `Shift` + `B`发起.  
脚本元数据在根目录`meta.json`，可以在这里更新版本号。  

#### 开发版
项目提供另一条开发者专用的任务链，任务名为`develop`，生成名为`local.user.js`的脚本，该版本利用Tampermonkey支持加载本地资源的特性直接加载本地仓库中的模块封装，达到一次编译即可调试的目的。  
安装了本地版脚本`local.user.js`后，以后代码修改后运行`release`任务编译后，无须再脚本管理器中更新脚本便可以直接刷新调试。  
但者也意味着如果本项目有其他贡献者提交并推送到远程仓库后，您需要主动同步并运行一次`release`任务以更新本地模块缓存——这应该不是很麻烦的事，对于开发者而言。  
Windows版Chorme + Tampermonkey支持加载本地资源，Firefox似乎不支持，其他浏览器或者脚本管理器支持情况未知。  
注意：如果`local.user.js`有改动(很少)，就需要再运行一次`develop`任务并更新脚本管理器中的`local.user.js`，这一般发生在涉及对于`index.ts`的修改和`meta.json`版本号之外的修改。

### 合并请求
合并请求可以直接向主分支`master`发起pr，有志于长期合作的也可以像仓库所有者申请合作者权限。  
源代码和编译后的脚本`main.user.js`请尽量不要共用一个提交，因为编译生成脚本时可能会用到当前commit哈希数据，显然提交前是获取不到该值的。
