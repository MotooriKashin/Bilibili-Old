这里存放的是项目依赖的json资源，模块中可以使用API.getModule方法直接获取格式化好的对应对象（未打包进脚本的除外，如meta.json）
```
// 示例
API.getModule("protobuf.json")
```

---
下面各json文件对应说明：
1. apply.json：记录了API对象属性与该属性实现所在模块的关系，用于脚本自动根据用到的属性加载对应的模块。如果在某个模块中往API对象上暴露了属性并且该模块不是全局默认运行的，请按格式补充好对应关系。
2. bug.json：重写页面前需要清理的新版页面往顶层对象window上添加了垃圾，它们可能会破坏重写后的页面。
3. meta.json：用户脚本元数据。
4. protobuf.json：protobufjs反射配置，主要用于解码proto弹幕。
5. resource.json：项目的外部依赖URL，将以`@resource`元数据的形式写进脚本，可以使用高级API`GM_getResourceText`/`GM_getResourceURL`获取。
6. videoSort.json：视频tid分区信息表，B站多次改版分区，这些修改无法为旧版页面识别，由脚本辅助进行识别。
7. mid.json：B站用户mid信息标本，用于恢复IP限制的用户空间的访问，如[哔哩哔哩番剧出差](//space.bilibili.com/11783021),[b站_DM組](//space.bilibili.com/1988098633)。