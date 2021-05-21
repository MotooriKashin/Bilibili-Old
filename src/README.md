这里存放的是主脚本所用到的各种模块，包括：html、css、js、json等。  

 *※ 不过下文**模块**一词专指js脚本*  

---
### 模块源起
最初的脚本只是一个重写旧版av/bangumi页面的小脚本，代码不过几十行，那时一个脚本文件就可以解决。后来随着需求增多、接口失效等问题纷纷涌现，脚本所需要处理的任务越来越多，代码量越来越大，行数突破3000，大小突破300KB，维护起来定位代码位置越来越难。所以就有了模块化脚本的想法。  
不借助其他工具，从JavaScript原生特性出发可选的模块化方案如下：
   1. `@require`：脚本管理器提供的模块化接口，先于脚本运行并处于同一上下文，可惜不支持按需加载，且[Greasyfork](https://greasyfork.org/zh-CN)[政策](https://greasyfork.org/zh-CN/help/external-scripts)过于严苛。PASS！
   2. `import`：ES6标准的模块化语法，浏览器内核要求高，返回promise，只能异步加载，有些模块必须同步加载。PASS！
   3. `eval`：非法工具！PASS！
   4. `new Function()()`：`eval`的安全版本，YES！

显然没有比方案4更合适的了，作为构造函数`function`的原型，`Function`不存在任何兼容问题，能同步加载且不污染上下文，除了载入的模块调试不方便几乎完美！

---
### 模块引入
#### 声明
使用本方案引入模块必须在[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)元数据中进行声明（不只是js模块）
   - 声明语法：`// @resource     [模块名称] [模块URL]`
   - 模块名称：可以自定义
   - 模块URL：模块所在URL

例如需要引入本仓库下src目录下的`md5.js`脚本，可自定义名称为`md5`，URL为`https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/md5.js`。由于github直链访问困难，将URL替换为 jsdelivr CDN版`https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/md5.js`（CDN语法可自行访问[jsdelivr](https://www.jsdelivr.com/)），写入元数据中完成模块声明：
```
// @resource     md5 https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/md5.js
```
#### 加载
声明后即可使用方案4加载，本脚本封装了`importModule`函数挂载在`window.BLOD`上，可用于加载运行模块
   - 加载命令：`BLOD.importModule([模块名称])`
   - 模块名称：即前文自定义的模块名称
   - 加载成功将在控制台打印成功信息
   - 加载失败将在控制台打印失败报错
   - 已经加载过的模块将被忽略，防止重复加载运行。
   - 不传入模块名称直接运行`BLOD.importModule()`，将返回所有声明了但尚未载入的模块信息在一个对象中。

接上文声明的`md5.js`脚本模块为例，加载运行的语句是：
```
BLOD.importModule("md5");
```

---
### 模块格式
模块是一个标准的js脚本文件，使用JavaScript标准语法，具体支持ES版本取决于浏览器。
- **模块是一个标准的js脚本**
   - 任何可以在网页环境中直接运行的js脚本都可以是模块！
   - 为`Tampermonkey`等脚本管理器编写的后缀为`.user.js`的脚本不一定是模块：除非该脚本未使用任何脚本管理器提供的高级API（如unsafeWindow、GM_info等）。
- 模块可以引入其他js模块
   - 模块可以按需加载其他模块：只要在[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)声明一下，然后使用`BLOD.importModule`加载运行。
   - 尽量按需加载，即：**先声明，然后只在需要时再加载该模块！**
- 是脚本而不是模块
   - 模块本质是一个单独的js文件，不可出现只能出现在其他体系的模块文件中关键词
   - `export` es6模块的导出命令，不适用于本脚本。
   - `await` 特指es6允许模块中出现的**顶层**`await`，本脚本只允许`async`环境中的`await`。

模块化的初衷是把一个复杂的功能单独为一个脚本，只是该脚本又依赖其他模块提供数据。

---
### 模块规范
虽然模块可以是任何标准的js独立脚本，但作为本脚本的模块可能要与其他模块互通，或者用到其他模块提供的数据，所以我们约定如下：
1. 本脚本在页面上下文`window`上定义了一个对象`BLOD`，所有要暴露给其他模块的数据请尽量挂载在该`BLOD`对象上，同时上面也挂载有其他模块提供的数据。
   - 比如上文提到的用来加载其他模块的`BLOD.importModule`，在模块中可以直接使用来加载其他模块。
   - 这种用法的本质是对于某模块而言“未定义”的`BLOD`关键词，js引擎会尝试作为全局变量从`window`中寻找，找得到所以不会报错。
2. 如果模块需要使用`BLOD`上其他模块提供的数据，请在模块顶层所有代码之前从`window`上获取`BLOD`的引用。
   - 获取方法如：`const BLOD = window.BLOD;`，由于`BLOD`引用的是对象，可以大胆地使用`const`进行声明。
   - 虽然js引擎默认允许“未声明”变量作为全局变量，但是若是在“严格模式”下还是会报语法错误，所以为了不必要的麻烦请**务必先获取`BLOD`的引用**。
3. 对于挂载在`BLOD`上的数据请直接按使用对象属性的方式使用就好，最好不要重新引用，除非你确定该属性还是一个**对象**。
   - 因为要使用到的`BLOD`上数据，很大概率是来自其他模块，而且很有可能被其他模块更新，如果重新引用可能不会即时同步更新。
   - 比如其他`BLOD`上有个一个`aid`数据，涵义是正在播放视频的av号，该数据是`define.js`模块捕获并挂载在`BLOD`上，类型为`string`或`number`。
   - 这是一个被很多模块经常用的数据，而且可能被其他模块修改，它的类型不管是`string`还是`number`，都不是一个对象`object`。
   - 对这样的数据直接使用`BLOD.aid`就好，重新引用比如`let aid = BLOD.aid;`，这个声明的`aid`就是一个**定值**，它不会同步`BLOD.aid`的修改。
   - 而像前文提到的`BLOD.importModule`是一个函数，函数是对象的一种，对象的引用是传递的`let importModule = BLOD.importModule;`的`importModule`就是个引用，使用`importModule()`就等于使用`BLOD.importModule()`。
   - 前文的`const BLOD = window.BLOD;`就属于这种，`BLOD`我们知道它是对象，所以可以重新引用不用`window.BLOD`。
4. `BLOD`上挂载了所有脚本声明了的脚本管理器提供的高级API，这些API在模块中都可以使用，只需注意对应的格式。
   - 形如`GM_getValue`这种高级API，挂载的形式如`BLOD.getValue`，使用方式如`BLOD.getValue()`。
   - 当然这些高级API都是对象，可以像`const GM_getValue = BLOD.getValue;`这样重新引用回去。
   - `BLOD.xmlhttpRequest`已重新封装进`BLOD.xhr.GM`以与其他ajax统一，但后者是前者的精简版，详细格式见`define.js`相关JsDoc。
5. 模块如果要往`BLOD`上挂载数据暴露给其他模块，请注意属性/方法名称是否已存在，以免覆盖了其他模块挂载的数据。
   - 浏览器控制台直接输入`BLOD`并回车，会返回`BLOD`对象，可以查看所有挂载在`BLOD`对象上的数据。
   - 浏览器控制台也可以直接使用`BLOD`上的各种方法，比如键入`BLOD.importModule()`并回车，返回所有未运行的模块名称。
6. 模块请按需载入运行，不是所有模块都必须全局默认载入。
   - 脚本主体关联了B站顶层域名，但很多模块的功能只针对特定页面或者操作，不需要第一时间载入。
   - 比如`md5.js`模块，功能是在`BLOD`上挂载一个`md5`函数，使用`BLOD.md5()`返回字符串的MD5哈希值。
   - 这是一个很少用到的功能，可以只在需要求取哈希值时通过`BLOD.importModule("md5")`载入模块，然后就可以使用`BLOD.md5()`函数了。
   - `BLOD.importModule()`会忽略已载入的模块，所以尽管放心在每次调用`BLOD.md5()`前都先`BLOD.importModule("md5")`。
   - 脚本主体还默认了在所有层级上运行，但有些模块未必需要在子页面上运行。
   - 比如`ui.js`是负责绘制脚本设置界面的，只需要在顶层页面上绘制就好，所以检测到是子页面就不必载入了。
7. 如果一个模块不需要与其他模块互通数据，也不依赖脚本管理器提供的高级API，那就大胆当作一个普通js脚本来写就好，不用管上面所有规范。
   - 本脚本乐于当一个脚本运行工具。

---
### 模块问题
1. 由于模块本身是以字符串运行的，调试定位错误变得不便，不过还是有办法定位错误的。这里以引用一个未定义的对象报错为例说明：  
![error](https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/error.jpg)  
*这里直接点击红字中的`userscript`是没用，右边的`VM`有时也没用，展开错误三角，下面调用栈点进去才能定位错误：可以看见上面命令行直接不带参数调用了`BLOD.sizeFormat()`，三角点开定位的报错函数名以及链接点进去都正确定位到了错误位置。**值得注意的是报错后再打开控制台是没有那个三角的，要先打开控制台再刷新页面报错才会出现那个三角**。*  
2. 使用`resource`声明模块将把模块缓存在脚本管理器中，而且脚本管理器会不会及时更新模块还未可知，这可能带来了更新方面的不便。这是没有办法的事，也不能每次运行都在线获取模块，那样将严重拖累载入速度。另外模块分发使用的CDN[jsdelivr](https://www.jsdelivr.com/)比起Github原生源又有24h内的延时。所以模块还是尽量在本地调试好再上线吧，若要立即更新，请修改[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)声明模块部分加上新版的commit哈希值并升级版本号，如`// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5d3269259f98725aa2df5df5aeef5d3e29b538fb/src/xhrhook.js`  
   - 想要实时刷新CDN[jsdelivr](https://www.jsdelivr.com/)而不添加哈希值，可以访问 `purge.jsdelivr.net` 对应的链接。例如想要刷新`https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/xhrhook.js`，可以在浏览器中访问一次`https://purge.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/xhrhook.js`，会返回刷新信息，然后可以访问一次原链接看看刷新没有。这种方法对于不便添加哈希值的原生脚本的修改有奇效。
   - Tampermonkey编辑脚本选择外部也是可以直接编辑模块的，**但注意模块不像脚本主体，其中不能引入任何中文包括注释**，这里指的是在编辑器中添加中文，模块本身可以有中文，这些载入到Tampermonkey编辑器中都成了乱码。
   - 如果要在Tampermonkey里调试，且git了整个仓库到本地磁盘，可以开启Tampermonkey访问本地文件权限，将模块`@resource`中的链接临时替换为本地`file:///`链接方便调试模块。将全部模块全部换成本地链接也未尝不可，因为`main.user.js`代码部分基本很少更新，一般只提升版本号及模块哈希值，但这个意味着得放弃Tampermonkey自动检查更新而去主动同步git仓库。
4. 模块化后由于脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)如果没有改动，更新就通知不到greasyfork，所以更新模块时请务必在[README.md](https://github.com/MotooriKashin/Bilibili-Old/blob/master/README.md)底部添加更新历史记录。