## 代码贡献指南
---
### 开发环境
1. 安装[Visual Studio Code](https://code.visualstudio.com/)，[Git](https://git-scm.com/)，[Node.js](https://nodejs.org/en/)。
2. Fork仓库然后克隆到本地，Git操作可直接在VSCode中交互完成。
3. 安装TypeScript
```
npm install -g typescript
```

---
### 目录结构
```
├─CSS 层叠式样式     
├─dist B站原生脚本存档
├─doc 说明文档
├─HTML 超文本文档
├─image 图片
├─json JSON
│  ├─ apply.json 方法对照表
│  ├─ meta.json 脚本元数据
│  ├─ resource.json 外部资源
├─src 源代码
│  ├─__INITIAL_STATE__ 重构__INITIAL_STATE__数据
│  ├─download 下载相关 
│  ├─extensions 工具组件    
│  ├─hook hook组件  
│  ├─match 分类引导
│  │  ├─av 普通视频
│  │  ├─bangumi 番剧
│  │  ├─index 主页
│  │  ├─live 直播
│  │  └─space 个人空间
│  ├─required 一般组件
│  ├─units 基础组件
│  │      modules.ts 主引导
│  │      notice.ts 脚本公告
│  │      rewrite.ts 重写引导
│  │      setting.ts 设置注册
│  │      vector.ts 一般引导
│  └─ index.ts 脚本主体
├─tasks 任务脚本
│  └─ build.js 合成脚本
└─ main.user.js 编译出的脚本
        
```

---
### 模块释名
本脚本使用了**自创**的模块化方案将代码进行模块化，本脚本所谓的“模块”区别于市面上任何已知的模块形式，具体特点如下：
1. 开发语言为TypeScript。
2. 本质上是普通的ts脚本，而不是其他语境中的模块。
3. 在页面环境中运行而不是脚本管理器提供的沙盒，可以正常访问顶层对象window。
4. 预定义了大量全局变量，由脚本基础组件提供。
5. 在脚本中以字符串形式存在，按需运行。
6. 使用特殊方法载入运行。

参考上面的结构的本脚本的编译生成流程如下：

<div align="center">
    <div>TypeScript模块</div>
    <div>↓ tsc任务</div>
    <div>JavaScript模块</div>
    <div>↓ build任务</div>
    <div>main.user.js</div>
</div>

最后运行clear任务清理临时文件。*已设计为任务链，运行clear任务会预先执行前两个命令：tsc -> build -> clear*

---
### 代码编辑
#### 模块
- 模块源代码都在src目录下，维护已有功功能参考目录结构直接在对应模块编辑代码即可。  
- 开发新功能可以新建一个模块，也可以新建子目录然后创建一堆模块，本脚本以文件名索引模块而不关系所在路径，所以**禁止新建同名模块！**
- 模块中可以使用API等已预定好的全局变量，完全模块间的数据交换。
- 按需加载的模块中暴露数据请添加为API对象的新属性或者新方法，请在声明中添加`export`关键词，以实现按需自动载入相关模块。
```
// 示例1：

// aaa.ts
// 暴露一个函数：doSomething
API.doSomething = function(){...}

// 添加暴露声明
declare namespace API {
    ...
    export function doSomething(): void;
}

// xxx.js
// 当调用到doSomething方法时，脚本会预先运行aaa.js以确保doSomething方法存在
const example = API.doSomething();
```
- 模块如果需要主动运行，请在对应引导模块中添加引导代码，使用importModule方法主动调用。
```
// 示例2：

// rewrite.js
// rewrite.js负责重写相关引导，判断是av页面且设置了重写av页，便使用importModule方法主动调用av.js
if (config.av && /\/video\/[AaBb][Vv]/.test(location.href)) API.importModule("av.js");

// vector.js
// vector.js负责一般全局引导，重写结束后判断设置了分页评论区，便使用importModule方法主动调用replyList.js
config.replyList && API.importModule("replyList.js");

// av.js
// av.js负责av页相关处理及引导，判断设置了互动弹幕，便使用importModule方法主动调用commandDm.js
config.commandDm && API.importModule("commandDm.js");
```
#### 主体
脚本主体一般不需要修改，除非需要添加使用脚本管理器提供的其他高级API。
```
// 示例3：

// meta.json
// 在脚本元数据中声明GM_xmlhttpRequest
{
    ...
    "grant": [
        ...
        "GM_xmlhttpRequest"
    ]
}

// index.ts
// 在脚本主体中封装GM_xmlhttpRequest于GM对象中
GM.xmlHttpRequest = GM_xmlhttpRequest;
```
#### 其他
1. 涉及对于B站原生脚本的修改在dist目录下，直接修改js文件即可。
2. 添加非源代码资源请添加进对应的顶层目录中，如CSS、HTML、image、JSON。
3. 字符串及json格式的资源可以使用getModule方法传入文件名获取，其中json会被格式为对象。
4. 外部资源依赖请将链接写入“外部资源”，可以使用GM.getResourceText等方法获取。

---
### 全局变量
模块中可以像使用`window`一样直接使用一些预定义好的变量：
1. API：作为类似于`window`的存在，是模块间交流数据的基础。
2. GM：高级API对象，只申请了目前用到的，需要添加的话请在json/meta.json中声明，然后在index.ts中封装好。
3. debug：console的部分再封装，添加了时间戳。
4. toast：浮动通知组件。
5. xhr：XMLHttpRequest的Promise封装，同时还封装了高级API`GM_xmlhttpRequest`为Promise。
6. config：用户设置数据，来自API.registerSetting方法注册的设置项，存储形式key：value。

其他内置的或由模块添加数据都位于API对象上，已完善了类型声明，可以在VSCode中自动获取详细的代码提示，往API上暴露数据时也请一并完善类型声明。

---
### 代码规范
1. 模块主体代码需要放在一个自运行函数或命名空间中以免污染顶层对象。
2. 请使用原生的ts/js语法，不要引入jQuery等直接改变语法的外部库，或者自行使用原生ts/js封装“库”，就像xhr.ts封装XMLHttpRequest那样。
3. ESNext的新特性只要不报错就可以使用，但不要为了强行使用引入任何Polyfill。
4. 不要求代码风格统一，但请一定要完善类型声明，以便其他贡献者使用相关数据。
5. API对象代理了顶层window对象上的全部属性，所以向API暴露新属性禁止与window上现有属性重名。

---
### 贡献代码
1. 编辑代码及其他资源
2. 在脚本元数据以添加版本号
3. 运行任务clear(Ctrl + Shift + B)任务进行编译
4. Git保存提交推送
5. 向`master`分支发起合并请求
