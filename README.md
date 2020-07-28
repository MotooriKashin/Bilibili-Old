# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 84](https://img.shields.io/badge/Google_Chrome_84-compatible-green.svg?longCache=true) ![Firefox 74](https://img.shields.io/badge/Mozilla_Firefox_76-compatible-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- [Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到原生[旧版页面](https://www.bilibili.com/blackboard/html5playerhelp.html "HTML5播放器简介&示例")
- 默认启用了部分其他功能，可通过设置关闭
- 可能会与其他同域脚本产生冲突，详情参见下文兼容数据
- B站变动时间轴记录
   + 2019年12月09日：弃用 旧版av&Bangumi
   + 2019年12月24日：弃用 旧版稍后再看
   + 2020年03月23日：启用 BV代替av
   + 2020年04月04日：弃用 旧版主页
   + 2020年04月23日：开启 4K灰度测试
   + 2020年04月28日：弃用 播单
   + 2020年05月21日：改版 弹幕
   + 2020年07月13日：改版 稍后再看

---
### 脚本实现
- 重写 (基于旧版网页框架)
   + 主页，即 https://www.bilibili.com
   + av(BV)，如 [av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")、[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss/ep)，如 [ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 、 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 、 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   + 稍后再看，如 [watchlater/#/list](https://www.bilibili.com/watchlater/#/list "播放列表")、[medialist/play/watchlater](https://www.bilibili.com/medialist/play/watchlater "播放全部")
   + 播单，如[playlist/video/pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")
   + 收藏，如[medialist/play/ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   + 嵌入，如 [blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视") [campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘") [biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传") [moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")
- 修改 (部分需在设置里启用)
   + 替换全局版头和版底
   + 默认启用av并在进入BV时跳转到av
   + 显示番剧分集播放数和弹幕数
   + 为旧版播放页添加点赞功能
   + 添加下载视频功能
   + 移除付费预览提示框
   + 在个人空间显示注册时间
   + 修复评论楼层号
   + 修复收藏和频道里的失效视频封面和标题

---
### 关于设置
- 设置入口设计得比较隐蔽以保护原生页面
- 入口在页面右下角2~3厘米处，鼠标移过会自动显现
- 所有实现都可独立选择启用与否并附带简要说明
- 设置数据存储在脚本管理器中，与cookies无关
- [这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif "设置参考示例") 能解决所有设置相关问题

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 旧版页面载入较新版慢，因为无法在请求新版之前启用旧版。
2. 旧版播放器4k视频支持上可能有问题。
3. 旧版播放器未适配新版弹幕，弹幕上限没有变动。
4. 旧版播放器原生不支持CC字幕，推荐安装[Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)进行支持。
5. 旧版播放器原生不支持互动视频，已主动忽略。
6. 旧版播放器原生不支持全景视频，将无法移动视角。
7. 旧版主页部分失效分区(如广告取)已进行替换。
8. 旧版主页推荐位接口失效，已屏蔽三日\昨日\七日切换。
9. 旧版播放页面的充电接口失效，请移步UP主的个人空间。
10. 嵌入式页面只简单替换播放器不会单独适配其他功能(如[拜年祭](https://www.bilibili.com/blackboard/bnj2020.html "拜年祭2020"))。
11. 播单页使用二次跳转的方式绕开404错误所以载入比较慢。
12. 收藏播放页会跳转av页进行模拟，up简介等非重要信息没有去额外获取。
13. 各种载入异常问题请尝试刷新，没用就多刷新几次，硬刷新更佳(`Shift + F5`或`Ctrl + Shift + R`)。

---
### 兼容数据
>
> Microsoft Windows 8 (Build 6.2.9200.0) （64 位）  
> Google Chrome 84.0.4147.89 (正式版本) （64 位） (cohort: Stable)  
> Tampermonkey BETA 4.10.6117
>
 
旧版页面使用的`document.write()`方法对其他脚本及扩展的影响：
- DOM的数据被覆盖
- DOM的回调失效：如`addEventListener`、`document.onclick`
- `GM_setValue()`方法失效
- **注1：只针对以`run-at document-start`注入脚本**
- **注2：只针对启用了旧版框架的页面**
- **注3：window的属性和方法等不会失效**

附上测试结果供参考：
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：基本正常
   + `GM_setValue`失效，在旧版页面无法修改设置
   + “简化主页”冲突，使旧版主页布局紊乱
   + 旧版番剧页面“批量下载”报错：“获取番剧数据失败: 无法找到 Season ID”
   + 快捷键拓展未适配，在旧版页面部分快捷键无效
- [Bilibili直播间挂机助手3](https://github.com/SeaLoong/Bilibili-LRHH)：完全正常
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：基本正常
   + 旧版UI未适配，无法在旧版页面调出设置
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)：完全正常，能使旧版播放器支持CC字幕。
   + 初次使用可能会报错：“CC字幕助手配置失败:SyntaxError: Unexpected token u in JSON at position 0”，去新版页面使用一次即可永久解决
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)：完全正常
   + 推荐以`run-at document-start`注入
   + 推荐只在需要时启用该脚本
- [Bilibili - Whose Bullets](https://greasyfork.org/zh-CN/scripts/40341)：完全正常
- [IDM Integration Module](http://www.internetdownloadmanager.com)：下载浮动条失效
- [pakku.js](https://chrome.google.com/webstore/detail/jklfcpboamajpiikgkbjcnnnnooefbhh)：完全正常
- [smoothscroll](http://iamdustan.com/smoothscroll/)：平滑滚动失效

---
### 参考致谢
- 旧版网页框架来源：[Wayback Machine](https://archive.org/web/)
- 脚本原型来源及指导：[indefined](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)
- 第三方数据接口：[BiliPlus](https://www.biliplus.com/)、[Bilibilijj](https://www.jijidown.com/)
- 注册时间样式来源：[哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)
- BV<=>av算法来源：[mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)
- 页面原生调用来源：[wly5556](https://greasyfork.org/users/217840)
- README设计参考：[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)
- 番剧分集数据参考：[Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)
- 部分API示例及兼容问题启发：[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)
- playurl算法来源：[Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)
- 下载界面样式来源：[YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)
- MD5算法来源：[MD5_百度百科](https://baike.baidu.com/item/MD5/212708?fr=aladdin#6_4)

---
### 效果预览
![Bangumi](https://camo.githubusercontent.com/1802bb815c3f624f636b0ee71554a7b3816f1801/68747470733a2f2f73312e617831782e636f6d2f323032302f30342f30372f4767774576392e706e67)
### 版本历史
- 2020-07-28
   + 修复主页\_\_INITIAL_STATE\_\_错误
- 2020-07-27
   + 修复分集数据错误
   + 替换失效的嵌入式播放器
- 2020-07-15
   + 将下载按钮移动到播放器右键菜单
- 2020-07-14
   + 修复新版av页\_\_playinfo\_\_报错
- 2020-07-13
   + 修复一个三目运算语法错误
   + 改进视频下载功能
   + 修复新版稍后再看改版引发的布局问题
   + 重定向新版稍后再看
- 2020-07-11
   + 改进去除首页广告功能
   + 改进bv=>av功能，使大部分模块直接显示av号
   + 修复主页部分分区问题
- 2020-07-07
   + 修复设置界面在部分页面布局错乱
   + 改进嵌入式播放框架选择
   + 添加去除旧版主页广告选项
- 2020-07-02
   + 修复新版播放页面样式误删
- 2020-07-01
   + 修复部分av页播放器被隐藏问题
- […………](https://github.com/MotooriKashin/Bilibili-Old/blob/master/history.md)