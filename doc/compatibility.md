## 兼容性文档
---

### 浏览器
最新版Google Chrome浏览器。  

不会主动去兼容旧版chromium内核浏览器及其他内核浏览器。  
Mozilla Firefox浏览器应该可以兼容，但未详细测试。  

### 脚本管理器
Tampermonkey或者Tampermonkey Beta。  

不会去测试其他脚本管理器兼容性。  
不兼容Greasymonkey。

### 其他
本脚本采用暴力方式刷新网页框架，将导致其他用户脚本及扩展功能异常，已知问题：  

1. 在`document-start`阶段注入的用户脚本GM_setValue等高级API失效。
2. 在`document-start`阶段注入的`content.js`失效。
3. 刷新页面之前对于DOM的修改无效。
4. 刷新页面前对源自DOM的EventTarget添加的事件监听器无效。

对于这些问题，脚本本身无力修复，只能由对方主动去兼容，一些可能的兼容建议：

1. 如非必要不要选择`document-start`的注入时机。
2. 在页面刷新前不要对DOM应用修改或者在页面刷新后检查一下之前的修改是否生效。
3. 在页面刷新前不要添加DOM相关的事件监听器。