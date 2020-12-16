这里存放的是主脚本所用到的各种模块，包括：html、css、js、json……  

---
### 模块源起
最初的脚本只是一个重写旧版av/bangumi页面的小脚本，代码不过几十行，那时一个脚本文件就可以解决。后来随着需求增多、接口失效等问题纷纷涌现，脚本所需要处理的任务越来越多，代码量越来越大，行数突破3000，大小突破300KB，维护起来定位代码位置越来越难。所以就有了模块化脚本的想法。  
不借助其他工具，从JavaScript原生特性出发可选的模块化方案如下：
   1. `// @require [脚本url]`：脚本管理器提供的模块化方案，模块先于脚本运行并处于同一上下文，可惜不支持按需加载，而且[Greasyfork](https://greasyfork.org/zh-CN)对于该方法引用外部脚本的[政策](https://greasyfork.org/zh-CN/help/external-scripts)过于严苛。
   2. `import/import() [脚本URL]`：ES6标准的模块化语法，可是对于浏览器版本要求高，而且该方法返回一个promise，这意味着模块只能异步加载，但本脚本重写页面所使用的`document.write()`方法只有同步加载才能有效阻断原生页面渲染。
   3. `eval([脚本代码字符串])`：非法工具！
   4. `new Function([脚本代码字符串])()`：`eval`的安全替代。

显然没有比方案4更合适的了，作为构造函数`function`的原型，`Function`应该不存在任何兼容问题，同步运行且不像`eval`那么危险，异步与否可以交给模块代码自身决定。

---
### 模块引入
模块可以在任何需要的地方使用`new Function([脚本代码字符串])()`引入，如：
```
new Function(GM_getResourceText("debug"))();
```
这是脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)所引入的第一个模块，其中封装了调试模块，其中"debug"是在脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)头部元数据中声明的：  
```
// @resource     debug https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js
```
*这里使用的是github原生源，由于众所周知的原因体验并不好，实际发布使用的还是[jsdelivr](https://www.jsdelivr.com/)CDN中转的源。*  
`GM_getResourceText`是脚本管理器提供的以**字符串**形式载入文件的方法。  
这是用户脚本引入资源的方式，不受[Greasyfork](https://greasyfork.org/zh-CN)引用外部脚本的[政策](https://greasyfork.org/zh-CN/help/external-scripts)所限制。  
当然引入其他模块不一定要在脚本主体中，模块本身也可以引入其他模块，如模块[define.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/define.js)中部分函数在需要用到md5哈希值才会引入[md5.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/md5.js)，相关代码如下：
```
BLOD.urlSign = (url, obj, id) => {
    if (!BLOD.md5) new Function(BLOD.getResourceText("md5"))();
    id = 1 * id || 0;
    url = url || "";
    ...
}
```
当然引入的模块也需要在脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)元数据中声明：
```
// @resource     md5 https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/md5.js
```
简而言之：**一处声明，处处可引**。当然为防止重复引入模块，上面的代码引入部分作了一定处理，这一点后面会说明。

---
### 模块格式
脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)中定义了一个对象`BLOD`并暴露到了`window`下（对于[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)而言是`unsafeWindow`），约定脚本与模块、模块与模块之间交换数据全部挂载在`BLOD`下，以上面提到的[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)为例，[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)模块代码第一行
```
const BLOD = window.BLOD;
```
获取这个`BLOD`对象，上面有脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)预定义并暴露给所有模块的数据
```
// 暴露顶层接口
const BLOD = unsafeWindow.BLOD = {
    xmlhttpRequest: GM_xmlhttpRequest,
    setValue: GM_setValue,
    getValue: GM_getValue,
    getResourceText: GM_getResourceText,
    getResourceURL: GM_getResourceURL,
    deleteValue: GM_deleteValue,
    aid: aid,
    cid: cid,
    bvid: bvid,
    hash: [],
    ids: [],
    bloburl: {},
    title: document.title.includes("出错") ? null : document.title
}
```
这样[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)模块就可以通过`BLOD`使用相关功能，比如要使用脚本管理器提供的高级API`GM_xmlhttpRequest`访问跨域资源，就可以这样使用：
```
BLOD.xmlhttpRequest({
    url: "https://...",
    methord: "get",
    ...
})
```
与原来`GM_xmlhttpRequest`方法的使用方式没有本质区别，只是方法名称变成了`BLOD.xmlhttpRequest`，属性方面也是一样的，比如获取`aid`就直接使用`BLOD.aid`以此类推。  
同样模块也可以暴露属性和方法给脚本主体和其他模块，同样以[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)模块为例：接上面获取完`BLOD`对象后：
```
class Debug {...}
const exports = () => {
    let debug = new Debug();
    function makeExports(type){
        return function (...msg) {
            return debug[type](...msg);
        }
    }
    let method = makeExports("log");
    method.log = makeExports("log");
    method.error = makeExports("error");
    method.warn = makeExports("warn");
    method.debug = makeExports("debug");
    method.msg = makeExports("msg");
    return method;
}
    
BLOD.debug = exports();
```
其含义是先定义了一个`Debug`类，`new`初始化后赋值给`debug`对象，然后把`debug`对象挂载到`BLOD`下，这样脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)所和有其他模块就可以使用`BLOD.debug`了。  
*中间那个`exports`函数的用途是让`debug`对象本身同时作为方法，使用`BLOD.debug()`等于使用`BLOD.debug.log()`。*  
当然也可以不通过什么class类，直接在`BLOD`上挂载函数，如[define.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/define.js)模块：
```
const BLOD = window.BLOD;

// 时间格式化
BLOD.timeFormat = (time, type) => {
    let date = new Date(time);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return type ? Y + M + D + h + m + s : h + m + s;
}

// 格式化存储
BLOD.sizeFormat = (size) => {...}
...
```
把两个函数直接匿名地挂载在`BLOD`上，这样[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)和所有其他模块就可以直接使用`BLOD.timeFormat`和`BLOD.sizeFormat`了。  

简而言之，`BLOD`的作用就相当于脚本和模块的顶层上下文，即相当于是`window`，“BLOD”是“Bilibili Old”的缩写，没有其他别的意思。使用这样一个对象的原因有二：
   1. 脚本[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)与模块的上下文并不相同，前者是`unsafeWindow`，其他是`window`，所以需要通过中介交换数据。
   2. 为什么不直接使用页面上下文`window`？也可以，不过把数据直接暴露在`window`下太污染上下文了，不如汇总到一个`BLOD`对象下。

其他模块不与脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)和其他模块交换数据也是没有任何问题的，模块本身可以作为一个独立的脚本运行，不用引用什么`BLOD`对象，也无需挂载任何东西在`BLOD`对象上。  
脚本引入的模块中就有类似这样的存在——[ui.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/ui.js)模块，该模块负责绘制右下角的设置面板，就不挂载任何东西到`BLOD`对象上，虽然还是引用了`BLOD`对象，毕竟要调用调试相关代码及修改脚本设置。  
把完全独立的脚本作为本脚本的一个模块引入也是可以的，只要添加下元数据，再在脚本任意位置`new Function()()`一下就行，那样本脚本就是一个代码启动工具了。  
*但直接调用带高级功能的用户脚本(即上下文为`unsafeWindow`)是不能的，因为页面上下文`window`并没有它们依赖的`GM_xmlhttpRequest`等高级API(通过`BLOD`提供了它们也得主动引入`BLOD`对象才能用啊。)。*

---
### 模块规范
模块本身就是一个个普普通通的`js`文件，任何通过的`js`文件都可以作为模块。模块单独使用当然无拘无束，但如果要与本脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)及其他模块交流还是要有些约定的：
   - 这里所指的模块如无特别说明指的是js脚本。*html、json、css等也无需运行不是吗。*
   - 模块最开头请注释说明模块名称及大致作用，并大概列举挂载了什么内容到`BLOD`对象下，以便脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)及其他模块使用。
   - 模块主体请运行在一个自运行函数中以免污染页面上下文。*这应该是所有js脚本默认遵守的吧。*
   - 所有功能具体实现请尽量都写在模块中，脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)只负责初始化、暴露接口和引入模块。
   - 不是全局需要的模块请按需加载以减少资源消耗，并通过模块本身挂载在`BLOD`上的痕迹判断是否重复加载。这种情况多现于在模块中引用其他模块，因为模块定义的功能也是挂载出去供别人引用的。*如上文示例按需加载的[md5.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/md5.js)。*
   - 模块中请使用`console.debug()`打印一条输出到控制台以便调试模块是否正常加载。*使用[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)封装的`BLOD.debug.debug()`也可以，只需引入顺序在[debug.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/src/debug.js)后面以免报未定义错误即可。*

---
### 模块问题
1. 由于模块本身是以字符串运行的，调试定位错误变得不便，不过还是有办法定位错误的。这里以引用一个未定义的对象报错为例说明：  
![error](https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/error.jpg)  
*这里直接点击红字中的`userscript`是没用，右边的`VM`有时也没用，展开错误三角，下面调用栈点进去才能定位错误：可以看见上面命令行直接不带参数调用了`BLOD.sizeFormat()`，三角点开定位的报错函数名以及链接点进去都正确定位到了错误位置。**值得注意的是报错后再打开控制台是没有那个三角的，要先打开控制台再刷新页面报错才会出现那个三角**。*
2. 模块中使用`const BLOD = window.BLOD`获得了`BLOD`对象后，然后接下来请**不要**`let aid = BLOD.aid`获取属性`aid`以便模块中直接使用方便`aid`代替麻烦的`BLOD.aid`。因为挂载在`BLOD`上的`aid`数据可能会变动，比如被其他模块修改了什么的，将其二次赋值给其他变量就不会同步变动，导致该模块中获取到的可能是过时甚至未初始化的`aid`。  
对于其他任意属性`value`也是一样的，不要偷懒去二次赋值，直接使用`BLOD[value]`或`BLOD.value`就是了，虽然是麻烦了点，这也是没有办法的事情。就算该`value`是一个对象可以传参，也不代表模块载入时该对象已经初始化了。  
3. 使用`resource`声明模块将把模块缓存在脚本管理器中，而且脚本管理器会不会及时更新模块还未可知，这可能带来了更新方面的不便。这是没有办法的事，也不能每次运行都在线获取模块，那样将严重拖累载入速度。另外模块分发使用的CDN[jsdelivr](https://www.jsdelivr.com/)比起Github原生源又有24h内的延时。所以模块还是尽量在本地调试好再上线吧，若要立即更新，请修改[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)声明模块部分加上新版的commit哈希值并升级版本号，如`// @resource     xhrhook https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@5d3269259f98725aa2df5df5aeef5d3e29b538fb/src/xhrhook.js`  
Tampermonkey编辑脚本选择外部也是可以直接编辑模块的，**但注意模块不像脚本主体，其中不能引入任何中文包括注释**，这里指的是在编辑器中添加中文，模块本身可以有中文，这些载入到Tampermonkey编辑器中都成了乱码。
4. 模块化后由于脚本主体[main.user.js](https://github.com/MotooriKashin/Bilibili-Old/blob/master/main.user.js)如果没有改动，更新就通知不到greasyfork，所以更新模块时请务必在[README.md](https://github.com/MotooriKashin/Bilibili-Old/blob/master/README.md)底部添加更新历史记录。