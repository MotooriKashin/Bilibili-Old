这里存放的是css层叠样式表文件，可以将模块中用到的css代码单独成一个文件放到本目录，然后通过API.getModule等方法以字符串形式获取。
```
// 示例
API.getModule("ui.css"); // 获取一个样式文件
API.getCss("hr.css","icon.css"); // 同时获取多个样式文件并合并为一个
```