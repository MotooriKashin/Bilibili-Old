使用`typescript`重构的版本，主要改动及目标有：
1. 除B站原生脚本外全部使用`typescript`重构，再由`tsc`模块编译回`JavaScript`。
2. 模块使用脚本管理器提供的存储API`GM_setValue`而不是资源`@resource`元数据方案，让脚本能主动接管模块更新检查。
3. 模块导入方法支持`importModule`支持像函数调用一样传递参数给要导入的模块，不再依赖页面上下文`window`传递也不再主动暴露对象。
4. 配置任务链主动记录模块`commit`哈希值，不再需要手动获取和修改。

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
3. 代码编辑主要集中在src目录下，编辑完成后运行默认任务(`Ctrl + Shift + B`)将自动生成脚本主体`main.user.js`，并记录所有模块修改`commit`值到`resource.json`，设计模块更新时，请提交所有更改后再运行一次默认任务以确保`resource.json`中的`commit`同步到最新。
4. 除一步到位的默认任务外，也可以单独执行某一项任务以加快编译速度
   - build：默认编译任务，生成脚本`main.user.js`，公开发行的版本。
   - build-local：编译本地版脚本`loacl.user.js`，所有模块依赖全在本地git目录，需要允许`TamperMonkey`访问本地文件才能正常使用。适合开发者使用的版本，对于模块的修改能立刻同步生效，甚至不必git提交，合作者的提交则需要git里主动拉取。
   - build-online：编译预加载版本脚本`online.user.js`，基本同`main.user.js`只是使用旧版(master分支)模块方案，初次安装不必下载模块，但模块修改会更新修改脚本主体`online.user.js`，因为`commit`值写死在脚本里了。
   - tsc：单独编译ts文件到js。
   - resource：单独写入`commit`值到`resource.json`。
5. `meta.json`：用户脚本元数据，版本号等值请在这里修改，当然除`loacl.user.js`外也用不到修改版本号。