# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 84](https://img.shields.io/badge/Google_Chrome_84-compatible-green.svg?longCache=true) ![Firefox 79](https://img.shields.io/badge/Mozilla_Firefox_79-uncompatible-red.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- [Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到原生[旧版页面](https://www.bilibili.com/blackboard/html5playerhelp.html "HTML5播放器简介&示例")
- 默认启用了部分其他功能，可通过设置关闭
- 可能会与其他同域脚本产生冲突，详情参见下文兼容数据
- B站改版摘记
   + 2019年12月09日：放弃旧版av、Bangumi
   + 2019年12月24日：放弃旧版稍后再看
   + 2020年03月23日：启用BV代替av
   + 2020年04月04日：放弃旧版主页
   + 2020年04月23日：开启4K灰度测试
   + 2020年04月28日：放弃播单
   + 2020年05月21日：弹幕改版：启用proto弹幕
   + 2020年07月13日：稍后再看改版：套用收藏播放
   + 2020年07月29日：新版播放器改版：启用新抖动图

---
### 脚本实现
- 重写 (基于旧版网页框架)
   + 主页：[www.bilibili.com](https://www.bilibili.com)
   + av(BV)：[av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")、[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss/ep)：[ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 、 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 、 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   + 稍后再看：[watchlater/#/list](https://www.bilibili.com/watchlater/#/list "播放列表")、[medialist/play/watchlater](https://www.bilibili.com/medialist/play/watchlater "播放全部")
   + 播单：[playlist/video/pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")
   + 收藏：[medialist/play/ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   + 嵌入
      - html5player：[blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视")、[campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘")、[biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传")、[moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")
      - mylist： [mylist4](https://www.bilibili.com/mylist4#4 "各种神弹幕")、[mylist8](https://www.bilibili.com/mylist8#8 "缘之空")、[mylist23649](https://www.bilibili.com/mylist23649#23649 "魔魔弹幕")
- 修改 (部分需在设置里启用)
   + 替换 全局版头和版底
   + 启用 av并在进入BV时跳转到av
   + 添加 显示番剧分集播放数和弹幕数
   + 添加 旧版播放页点赞功能
   + 添加 下载视频功能
   + 移除 付费预览提示框
   + 添加 个人空间显示注册时间
   + 修复 评论楼层号 并 添加 楼中楼层号
   + 修复 收藏和频道里的失效视频封面和标题
   + 添加 屏蔽直播及轮播视频的功能
   + 添加 旧版播放器支持新版弹幕
   + 添加 历史记录只显示视频播放历史功能

---
### 关于设置
- 入口贴边隐藏以保护原生页面
- 入口在页面右下角高约一寸处
- 部分设置都需要刷新才会生效
- 设置数据存储在脚本管理器中
- [这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif "设置参考示例")能解决所有设置问题

---
### 下载视频
![dash](https://i.loli.net/2020/08/16/Y4GzOdmqtZshH3b.png)
![flv](https://i.loli.net/2020/08/16/LPaobejz1GONkYR.png)
- 播放器右键-->下载视频-->右键另存为（有[IDM](https://www.internetdownloadmanager.com/)的可以右键调用IDM）
- **链接复制无效，左键点击无效，时效120分钟！**
- 捕获播放器内容，而不是另外请求，格式说明如下：
   + mp4：首选格式，但最高只提供1080P画质
   + dash：视音频分流，虽然都显示后缀`.m4s`，其实应该是视频`.m4v`、音频`.m4a`
      - avc：h.264 视频流，主流的视频编码，体积大兼容好
      - hev：h.265 视频流，较新的视频编码，体积小兼容差
      - aac：aac 音频流
   + flv：流媒体，不分段约等于mp4，分段需要合并
   + 其他：“--” 表示大小未知而不是无法获取
      - 弹幕：xml弹幕
      - 封面：封面图片
      - 海报：特殊背景图，只在特殊Bangumi页面
      - 中文：CC字幕文件，其他语言同理
- 分流及分段视频可能需要自行合并，工具推荐如[ffmpeg](http://ffmpeg.org/)、[MKVToolNix](https://mkvtoolnix.download/)
   + dash(封装)：视频轨 + 音频轨 = 完整视频
   + flv(合并)：分段1 + 分段2 + … + 分段n = 完整视频
- 画质也取决于播放器，所以请先切换到对应画质
- 能播放才能下载，6分钟预览也只能捕获预览

---
### 已知问题
以下问题这里可能处于并将长期处于无法解决状态，请多担待！  
1. 旧版页面载入较新版慢，做不到在新版前载入。
2. 旧版播放器不支持CC字幕，可以通过[Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)支持。
3. 旧版播放器不支持互动视频，已主动忽略。
4. 旧版播放器不支持全景视频。
5. 旧版主页广告区替换为资讯区且无法获取排行。
6. 旧版主页推荐位接口失效，已屏蔽相关切换。
7. 旧版页面的充电接口失效，请不要使用。
8. 嵌入页面播放器外的内容不单独适配。
9. 收藏播放重定向到av页进行模拟，延迟高，列表不宜过大。
10. 楼中楼层号当页数>2且第一条是回复(@)时获取不到。
11. 遇到问题请刷新页面，硬刷新更佳(`Shift + F5`或`Ctrl + Shift + R`)。

---
### 兼容数据
>
> Microsoft Windows 8 (Build 6.2.9200.0) （64 位）  
> Google Chrome 84.0.4147.125 (正式版本) （64 位） (cohort: Stable)  
> Tampermonkey BETA 4.10.6118
>


- **Firefox最新版(79)旧版框架启用失败**，原因不明，之前的版本没问题   
- 旧版页面使用的`document.write()`方法对其他脚本及扩展的影响：
   - DOM的数据被覆盖
   - DOM的回调失效：如`addEventListener`、`document.onclick`
   - `GM_setValue()`方法失效
   - 注1：只针对以`run-at document-start`注入脚本
   - 注2：只针对启用了旧版框架的页面
   - 注3：window的属性和方法等不会失效

附上测试结果：
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：**基本正常**  
   + `GM_setValue`失效，在旧版页面无法修改设置  
   + “简化主页”冲突，使旧版主页布局紊乱  
   + 旧版番剧页面“批量下载”报错：“获取番剧数据失败: 无法找到 Season ID”  
   + 快捷键拓展未适配，在旧版页面部分快捷键无效
- [Bilibili直播间挂机助手3](https://github.com/SeaLoong/Bilibili-LRHH)：**完全正常**
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：**基本正常**  
   + 旧版UI未适配，无法在旧版页面调出设置  
   + **若要同时使用请关闭本脚本“区域限制”选项！**
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)：**完全正常**  
   + 初次使用可能会报错：“CC字幕助手配置失败:SyntaxError: Unexpected token u in JSON at position 0”，去新版页面使用一次即可永久解决  
   + **推荐安装以让旧版播放器支持CC字幕**
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)：**完全正常**  
   + 推荐以`run-at document-start`注入  
   + 推荐只在需要时启用该脚本
- [Bilibili - Whose Bullets](https://greasyfork.org/zh-CN/scripts/40341)：**完全正常**
- [IDM Integration Module](http://www.internetdownloadmanager.com)：**下载浮动条失效 ಥ_ಥ**
- [pakku.js](https://chrome.google.com/webstore/detail/jklfcpboamajpiikgkbjcnnnnooefbhh)：**完全正常**
- [smoothscroll](http://iamdustan.com/smoothscroll/)：**平滑滚动失效 ಥ_ಥ**

---
### 隐私相关
1. 脚本会读取您的部分信息
   - cookies：与B站后端进行交互时识别用户身份
      + DedeUserID：判断是否登录以修复动态
      + bili_jct：与B站后端进行校验实现点赞功能
2. 脚本申请了`GM_xmlhttpRequest`跨域权限，`@connect`元数据如下
   - [BiliPlus](https://www.biliplus.com/)：获取缓存的视频标题和封面等信息以修复失效视频
   - [Bilibilijj](https://www.jijidown.com/)：获取缓存的视频标题和封面等信息以修复失效视频
   - [bilibili](https://www.bilibili.com)：同域名下的不同主机(如 www.bilibili.com 与 space.bilibili.com )，B站可能并未开通[CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS "Cross-origin resource sharing")权限
3. 脚本引用了部分公开库，用于无法自己独立实现的功能
   - [protobuf](https://github.com/protobufjs/protobuf.js)：解码新版proto弹幕并转化为旧版播放器能识别的xml弹幕

---
### 参考致谢
- JavaScript公开库：[protobuf](https://github.com/protobufjs/protobuf.js)
- 旧版网页框架来源：[Wayback Machine](https://archive.org/web/)
- 脚本原型来源及指导：[indefined](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)
- 第三方数据接口来源：[BiliPlus](https://www.biliplus.com/)、[Bilibilijj](https://www.jijidown.com/)
- 注册时间样式来源：[哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)
- BV<=>av算法来源：[mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)
- 新版弹幕转码来源：[wly5556](https://github.com/MotooriKashin/Bilibili-Old/issues/10)
- README设计参考：[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)
- 番剧分集数据参考：[Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)
- 部分API示例及兼容问题启发：[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)
- playurl算法来源：[Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)
- BPplayurl接口来源：[BiliPlus](https://www.biliplus.com/)、[解除B站区域限制](https://greasyfork.org/scripts/25718)
- 下载界面样式来源：[YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)
- MD5算法来源：[MD5_百度百科](https://baike.baidu.com/item/MD5/212708?fr=aladdin#6_4)

---
### 效果预览
![binguo.png](https://i.loli.net/2020/08/09/dStpanmQZYAJce6.png)
### 版本历史
- 2020-08-18
   + 修复4k画质初始化播放器
- 2020-08-16
   + xhrhook选项调整为只控制send(open因为太多功能依赖默认开启)
   + 修改话题、活动主页版头类型
   + 添加跳过充电鸣谢功能
- 2020-08-14
   + 补全下载清晰度信息
- 2020-08-11
   + 提供xhrhook关闭选项，关闭后部分依赖功能将一并被关闭
   + 下载就算左键误点也将在新标签页打开
- 2020-08-10
   + 下载视频支持弹幕、封面等
- 2020-08-09
   + 精确获取评论楼中楼层号
   + 更新最新的分区信息
   + 修复不含音频的dash导致下载出错
- 2020-08-08
   + 支持修复评论楼中楼的楼层号
- 2020-08-07
   + 修复bv超链接
   + 优化收藏列表模拟，排序、加快载入速度
- 2020-08-06
   + 添加历史记录只显示视频播放历史的功能
   + 更新bangumi框架以处理页面部分请求重复的问题
- 2020-08-05
   + 下载面板flv类型也显示画质
   + 优化脚本结构和注释便于维护
- 2020-08-04
   + 实现旧版播放器支持新版弹幕 (感谢wly5556)
- 2020-08-03
   + 修复点赞功能
- 2020-07-31
   + 优化评论楼层功能
   + 优化失效视频功能
   + 下载视频将随切P而更新
- 2020-07-30
   + 添加解除区域限制功能(大概不支持会员视频)
- 2020-07-29
   + 添加屏蔽直播间视频及轮播视频的功能
   + 改进播放通知信息生成方法
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
- [……更多……](https://github.com/MotooriKashin/Bilibili-Old/blob/master/history.md)
