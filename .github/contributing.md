# 代码贡献指南
本项目是为了还原 2019 年 12 月 09 日[B站](https://www.bilibili.com/)弃用旧版播放器而来。原是一个小小的用户脚本，后添加了chrome扩展支持。

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
- 全栈TypeScript化.

---
### 目录结构
```
├─dist                     【加载已解压的扩展程序】  
├─extension                chrome扩展模块  
├─src                      主模块  
└─userscript               用户脚本模块  
```

---
### 开发  
VSCode里的typescript项目，使用esbuild编译打包为对应chrome扩展和用户脚本。  
项目使用npm本地模块的方式进行了拆分，通常只需要修改src目录下的主模块即可。  
简要流程为：
1. clone项目到本地并使用VSCode打开。
2. 更新npm包依赖。
3. 进行typescript开发。
4. VSCode里运行对应的任务生成chrome或展和用户脚本。（详见对应子条目）
5. 测试。（详见对应子条目）
6. git提交。
7. 向master发起合并请求。

#### 扩展
扩展模块位于extension目录，主要是负责准备主模块的基础依赖及引导，实际业务本体还是位于src目录。  
扩展模块代码分为三部分：
1. 后台脚本background.ts。运行于扩展后台的server-worker，负责处理主模块的提权请求。
2. 内容脚本content.ts。运行与页面独立的上下文，负责引导主模块，并担任主模块与后台脚本通信的中间人。
3. 主模块脚本main.ts。运行于页面上下文。实际业务本体。 
4. player目录下是另一个项目(bilibiliplayer)[https://github.com/MotooriKashin/bilibiliplayer]生成的播放器脚本。

测试：VSCode里运行扩展对应的编译任务（已设为默认任务）会将未打包的扩展程序释放到dist目录，使用chrome开发者模式的【加载已解压的扩展程序】加载该目录就可以进行测试。

注意：设计background.ts和content.ts的修改需要移除然后重新【加载已解压的扩展程序】才会生效。

#### 用户脚本
用户脚本模块位于userscript目录，主要是负责引导主模块，实际业务本体还是位于src目录。运行于脚本管理器提供的上下文，但基本不处理任何业务。  

测试：VSCode里运行用户脚本对应的编译任务会将`main.user.js`生成到userscript目录下，使用Tampermonkey等脚本管理器加载即可测试。  

提交：请尽量不要将`*.user.js`放进提交里，除非确信此次修改要直接推送给用户。  

注意：新版用户脚本需要启用`<><![CDATA[]]></>`兼容支持，一般在脚本管理器里卸载重装即可。

#### 主模块
主模块位于src目录，负责实际业务。  

注意：主模块使用的`GM`特权API的代码时需要判定是扩展还是用户脚本，分别编写二者的兼容代码。通过全局变量`_UserScript_`判定，为真时说明处于用户脚本环境。`GM`的接口的会说明提示哪种环境中不可用，切换为可用的接口接口。