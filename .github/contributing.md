# 代码贡献指南
本项目是自 2019 年 12 月 09 日[B站](https://www.bilibili.com/)弃用旧版播放器以来尝试恢复旧版页面的各种尝试。从最初一个简单的用户脚本，对失效功能的修补，对更多改版页面的恢复，维护工作已俨然超出个人的能力范围。所以诚邀各位旧版页面的爱好者参与进来共同维护，不胜感激。  

**使用最新的开发工具，追随最新的前端标准，使用最新的语言特性。** 业余项目，无须束手束脚。

---
### 开发环境
- [Visual Studio Code](https://code.visualstudio.com/).
- [Node.js](https://nodejs.org/).
- [Google Chrome](https://www.google.com/chrome/).

---
### TypeScript
- 既已[manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)，何妨ESNext，任何最新特性放开手用就是.
- 推荐[modules](https://www.typescriptlang.org/docs/handbook/modules.html)而不是[namespace](https://www.typescriptlang.org/docs/handbook/namespaces.html)来组织代码.
- 全栈TypeScript化，除了修复并托管的B站播放器脚本`bilibiliPlayer.js`.

---
### 目录结构
```
├─main.user.js             编译生成的用户脚本  
├─dist                     【加载已解压的扩展程序】  
└─src                      源代码  
    ├─bilibili             托管的B站原生脚本  
    ├─content              内容脚本（MAIN）
    ├─images               扩展图片资源  
    ├─rules                declarativeNetRequest 静态规则集  
    ├─runtime              模块仓库  
    │  ├─chrome            后台脚本、弹出页面和选项页面限定模块  
    │  ├─content           内容脚本（ISOLATED）限定模块  
    │  ├─tampermonkey      用户脚本（Tampermonkey） 限定模块
    └─_locales             i18n目录  
```

---
### 开发  
项目本体是[manifest V3](https://developer.chrome.com/docs/extensions/mv3/manifest/)扩展，同时编译为Tampermonkey用户脚本。  
使用TypeScript开发，`esbuild`打包，官方tsc工具只用于开发模式下的语法检查。

1. 命令`update`（VSCode任务`npm: update`或者命令行`npm run update`）更新npm依赖.
2. 命令`tsc`（VSCode任务`npm: tsc`或者命令行`npm run tsc`）进行语法检查.
3. 命令`build`（VSCode任务`npm: build`或者命令行`npm run build`）编译打包生成扩展和用户脚本。
4. 命令`test`（VSCode任务`npm: test`或者命令行`npm run test`）编译打包生成开发模式扩展和用户脚本.

---
### Pull Request
因为项目会经常改动，分支多了容易出现过多合并冲突，所以请直接向主分支`master`发起pr，有志于长期合作的也可以像仓库所有者申请合作者权限，无须合并请求直接基于`master`分支开发。

---
### 用户脚本相关
用户脚本目标平台是[Tampermokey](https://www.tampermonkey.net/)，其他脚本管理器没有测试，由于使用同步API，[Greasymonkey](https://www.greasespot.net/)肯定是不适配的。  
由于项目愿景是使用ESNext，享受最新特性，这作为浏览器扩展中可行，因为支持MV3肯定支持ESNext，但用户脚本显然得照顾大多数旧浏览器用户，目前的最低兼容要求是**Chrome76**。如果使用了高于这个目标的特性，解决办法是在用户脚本专属目录中添加polyfill，无论是自己编写还是引入npm包。目前引入的有：
   - Element.replaceChildren

*遗憾的是当前esbuild并不支持主动提示哪些特性不受支持，所以只能见招拆招了，如能提供这方面的帮助，实在感激不尽！*

用户脚本兼容资源都在用户脚本专属目录src/tampermonkey，在其他源码若有实现需求中需要导入`isUserScript`对象判定是否为用户脚本环境以作出兼容性修改（参考src/runtime/gm.ts中的例子）。  
项目编译出的用户脚本文件关联了GreasyFork的webhook，所以每次提交时请务必小心不要包含*.user.js文件的修改（直接单独撤销该文件的修改就行），除非你确定要将此提交直接发布为新版本的用户脚本。  
发布新版本用户脚本时，需要在src/tampermonkey/meta.json中添加版本号后重新编译，直接版本+1就行，保证每一位都只有一位数，超过就向前进位。  
不要将开发模式（npm: test）编译出的main.user.js进行提交，开发模式下用户脚本会引入本地资源，提交将泄露本地仓库信息。

---
### 扩展相关
拓展架构分为后台脚本、选项页面、弹出页面、内容脚本以及注入进页面的降级为普通脚本“主脚本”组成，各部分之间通过消息传递机制进行沟通。  
非“主脚本”所有模块都在src/runtime/chrome目录下，这些模块中导出的接口都有【后台脚本】标记），意味着她们不能导入进“主脚本”中，当然更不要导入到用户脚本中。*更多事项见下文[“主脚本”条目](#主脚本)*    
内容脚本所有模块都在src/runtime/content目录下，这些模块中导出的接口也只限在内容脚本src/content.ts中导入。当然作为内容脚本，导入为“主脚本”编写的模块中没问题的，但内容脚本本身就是残废，也用不到许多功能。*更多事项见下文[内容脚本条目](#内容脚本)*  
由于扩展并未上架，所以当前无须修改元数据中的版本号。（元数据位于src/manifest.json）

#### 后台脚本
Manifest V3取消了常驻的后台页面，改为基于Server Worker，这带来了一些列限制需要特别注意：
   1. 后台脚本无法使用任何涉及DOM的运行环境，包括通常的顶层上下文`window`。
   2. 后台脚本有5分钟强制休眠的机制，任何全局变量都面临丢失的风险，所以原则上不要使用任何全局变量。
   3. 后台脚本禁止使用XMLHttpRequest，访问网络只能通过fetch。
   4. ~~后台脚本只支持最基础的 ESNext module，不能将json作为模块导入。~~ （引入[esbuild](https://esbuild.github.io)后已无妨）
   5. 后台脚本不会主动执行，只能由事件回调唤醒，不要在回调之外执行任何操作。

新标准是铁了心让后台脚本无法主动执行任何业务逻辑，成为真真正正的“后台”脚本，充当一个在后台为扩展其他部分服务的角色（残废*🤣）。主要是通过`storage`和消息传递机制处理其他部分（主要是内容脚本和“主脚本”）无权进行的操作并将结果返还回去。

#### 选项页面和弹出页面
选项页面和弹出页面在新标准中没有什么大的改动，不过这两者都是与用户交互的，一个作为扩展设置调整界面，一个提供了一些针对当前页面可执行的操作，通过消息机制将用户的选择发送给内容脚本和“主脚本”处理。

#### 内容脚本
内容脚本即注入到标签页（ISOLATED）中脚本，在新标准中也有了新的注意事项：
   1. 严格的CSP策略导致内容脚本无法以任何手段突破独立上下文环境的封锁，包括但不限于`eval`、`setTimeout/setInterval`和`new Function`都无法使用，也不允许往页面中添加内联或拓展外源的script元素。
   2. 内容脚本无法以任何手段及时获取到页面上下文中的任何JavaScript变量，反之亦然，就算通过消息机制传递任何不可克隆的对象都被禁止。
   3. 内容脚本往DOM上自定义的非原生属性对页面上下文不可见，反之亦然。
   4. ~~内容脚本不支持静态的 ESNext module 你敢信！~~ （引入[esbuild](https://esbuild.github.io)后已无妨）
   5. 内容脚本不支持`customElements`你敢信！

以上限制基本锁死了内容脚本能够对页面进行的修改，除非你不打算与页面上下文有任何交互，也不管不顾页面上下文任何看待你对于DOM的修改，否则用来承载对页面的针对性修改工作是完全不称职的。（残废*🤣🤣）只能当作消息传递的中间人：对于来自“主脚本”的请求消息，内容脚本有权处理就处理，无权处理就打包发送给后台脚本再等待后台脚本返回处理结果打包发还给“主脚本”；同时选项页面和弹出页面有任何消息进行打包传递。
#### “主脚本”
注入到页面上下文环境（MAIN）中的脚本，但也彻底失去了作为拓展一部分的任何特权，只能以消息传递机制向内容脚本申请自己的诉求。  
任何实际的对页面执行的业务代码实际上都是“主脚本”负责的。使用标准的 ESNext module 语法编写，实际业务逻辑进一步细分到每一个具体的业务模块及依赖模块中。  
为避免代码冲突和消息传递紊乱，原则同一时间运行一个“主脚本”。  
“主脚本”目前尴尬的地方在于，同样身为扩展的一部分，竟然无法直接与后台脚本传递消息，必须额外添加一个内容脚本作为中介。想来在技术上也不难实现，给“主脚本”传递当前扩展ID就行（当前不经消息中介，主脚本甚至不知道所属扩展ID🤣），不然本项目根本无需额外添加一个内容脚本。
