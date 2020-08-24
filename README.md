# Bilibili 旧播放页

**旧版番剧页触发B站风控启用失败，原因不明，正在寻求绕行方案！**

---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 84](https://img.shields.io/badge/Google_Chrome_84-compatible-green.svg?longCache=true) ![Firefox 79](https://img.shields.io/badge/Mozilla_Firefox_79-uncompatible-red.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- [Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到原生旧版页面
- 默认启用了部分附加功能，可在设置中选择关闭
- 与部分脚本及扩展不兼容，详见兼容数据条目
- B站改版时间轴
   + 2019年12月09日：放弃旧版av、Bangumi
   + 2019年12月24日：放弃旧版稍后再看
   + 2020年03月23日：启用BV代替av
   + 2020年04月04日：放弃旧版主页
   + 2020年04月23日：开启4K灰度测试
   + 2020年04月28日：放弃播单
   + 2020年05月21日：启用proto弹幕
   + 2020年07月13日：启用收藏式稍后再看
   + 2020年07月29日：启用新播放器加载图

---
### 脚本实现
- 重写 (基于旧版网页框架)
   + 主页：[www.bilibili.com](https://www.bilibili.com)
   + av(BV)：[av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")、[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss/ep)：[ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 、 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 、 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   + 稍后再看：[watchlater/#/list](https://www.bilibili.com/watchlater/#/list "播放列表")、[medialist/play/watchlater](https://www.bilibili.com/medialist/play/watchlater "播放全部")
   + 播单：[playlist/video/pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")
   + 收藏：[medialist/play/ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   + 嵌入：[blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视")、[campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘")、[biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传")、[moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")、[mylist](https://www.bilibili.com/mylist4#4 "各种神弹幕")
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
- 设置入口在页面右下角2-3厘米处贴边，鼠标移动到位置会自动浮现，点击即可出现设置面板。
- 所有设置选项可通过对应按钮选择启用还是关闭，鼠标移动到对应选项会出现简短提示。
- 大部分设置都不会及时生效，需要刷新页面，部分设置之间可能相互依赖。
- 如果实在不会操作，[这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif "设置参考示例") 应该能解决所有一些问题

---
### 下载视频
![dash](https://i.loli.net/2020/08/16/Y4GzOdmqtZshH3b.png)
![flv](https://i.loli.net/2020/08/16/LPaobejz1GONkYR.png)
- 由于引入了`xhr hook`实现部分功能，就顺便就记录了视频地址，然后参考[YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)的样式实现了下载面板。呼出方式是播放器的右键菜单，当然可能需要在设置里启用。由于新旧播放器结构大致相同，所以对于新版播放器也一样有效。
- 下载面板位于屏幕底部，如上图，在对应的链接上鼠标右键另存为即可，IDM用户可以右键IDM，当然IDM也能捕获左键点击，但这取决于IDM的设置。由于浏览器同源策略，直接鼠标左键单击是无法下载的。又由于B站防盗链策略，直接复制下载地址到第三方下载工具也是无效的，需要配置`referer`在*.bilibili.com域名下，且`user-agent`不能为空。
- 由于是捕获播放器的视频链接，所以正在播放什么格式和画质就提供什么下载，建议下载前请先切换到对应格式或画质。能播放的才能下载，6分钟预览捕获的也是预览，请不要指望能突破大会员及区域限制，那些甚至连播放器右键菜单都不存在。
- DASH和flv可能涉及到要使用其他工具进行二次封装，mp4就没有这个问题，但最高画质只到1080P，1080P+及更高画质只能选择前两者。播放器默认选择的是DASH，只有DASH不存在的情况下才选择flv。DASH音视频分流其实挺恶心的，而且新视频的flv也不再分段，不分段的flv就约等于mp4，所以相对而言flv其实更适合下载。
- DASH格式是把一个视频的视频和音频拆开来，B站提供了两种视频编码可选：avc是最通行的格式，视频流推荐这个，hev是下一代的视频编码，体积小但兼容性不佳，浏览器甚至不支持解码。音频流没得选，只有aac一种，推荐选择码率最高音质最好的一条。另外虽然都是B站自定义的后缀`.m4s`，下载时请手动修改后缀：视频流`.m4v`，音频流`.m4a`，顺便把文件名改成一样的，方便对应和识别。不想封装的话，[MPC-HC](https://github.com/clsid2/mpc-hc)是支持音视频分轨的，可以直接播放。
- flv是flash流媒体，flash虽然该死，但flv作为一个视频封装格式却是合格的，不分段的flv修改后缀冒充mp4也并无不妥，分段的话就恶心了，楞是把一个视频切成好几段。所以若选择flv，不分段(也就是只有一个分段)最好，分段的话就要把所有分段依次下载，再使用其他工具按顺序合并成一个视频。
- 其他选项还提供了xml弹幕下载，旧版播放器启用新版弹幕后提供的就是从proto弹幕转化而来的xml弹幕，弹幕池是旧版xml弹幕的两倍。顺便一并提供了封面、CC字幕等下载选项。大小为"--"表示没有去获取大小数据而不是不能下载，当然这些也都请鼠标右键另存为而不是左键点击。

---
### 已知问题
以下问题这里可能处于并将长期处于无法解决状态，请多担待！  
1. 由于实现机制做不到在浏览器访问新版页面之前启用旧版页面，所以旧版页面载入比较慢且新版页面可能一闪而过。
2. 旧版播放器已失去官方维护，版本停留在`2019-10-31 07:38:36`，所以新版播放器互动视频、全景视频、高能进度条等功能是不支持的，互动视频脚本已主动忽略不会启用旧版，全景视频无法移动视角，CC字幕有[Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)提供第三方支持。
3. 主页内容改版极大，旧版很多接口已出现问题，脚本已将被废弃的广告区替换为资讯区的内容，但B站并不提供资讯区的排行所以右边排行榜无法获取。推荐视频不再提供三日/昨日/一周分类，已屏蔽对应的切换按钮。直播推荐及排行已通过`xhr hook`方式修复。
4. 旧版播放页面的充电接口是失效的，为避免财产损失请不要使用，新版播放页面也不提供充电入口，需要给UP主充电请移步对应的空间。
5. 替换嵌入播放器后顶层页面对于播放器的控制将失效，脚本也无暇去一一适配，不过涉及的页面也不多，已知的只有拜年祭2020专题页面。
6. 播单相关的页面直接被B站404，而404指令会限制对页面的修改，只能使用重定向的方式恢复播单的播放页面。
7. 收藏列表的播放页面并不存在对应的旧版，脚本使用重定向到av页并载入稍后再看列表进行模拟，但并不完美，请尽量不要在播放列表太大时启用。已知稍后再看列表上限是100，用来模拟容量为999的收藏列表极为卡顿。
8. 恢复评论楼层号时一并添加了楼中楼的楼层号，当楼中楼的当前页码大于2且第一条评论是@回复别人时，那页楼中楼的所有评论楼层号将无法获取。
9. 页面载入异常时请先尝试刷新，硬刷新更佳(`Shift + F5`或`Ctrl + Shift + R`)。部分功能由于脚本无法在浏览器读取缓存前注入而失效，同样只能靠硬刷新缓解。

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
   1. 只针对以`run-at document-start`注入脚本
   2. 只针对启用了旧版框架的页面
   3. window的属性和方法等不会失效

附上测试结果：
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：**基本正常**：`GM_setValue`失效，在旧版页面无法修改设置、“简化主页”冲突，使旧版主页布局紊乱、旧版番剧页面“批量下载”报错：“获取番剧数据失败: 无法找到 Season ID”、快捷键拓展未适配，在旧版页面部分快捷键无效
- [Bilibili直播间挂机助手3](https://github.com/SeaLoong/Bilibili-LRHH)：**完全正常**
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：**基本正常**：旧版UI未适配，无法在旧版页面调出设置、**若要同时使用请关闭本脚本“区域限制”选项！**
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)：**完全正常**：初次使用可能会报错：“CC字幕助手配置失败:SyntaxError: Unexpected token u in JSON at position 0”，去新版页面使用一次即可永久解决 、**推荐安装以让旧版播放器支持CC字幕**
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)：**完全正常**：推荐以`run-at document-start`注入 、推荐只在需要时启用该脚本
- [Bilibili - Whose Bullets](https://greasyfork.org/zh-CN/scripts/40341)：**完全正常**
- [IDM Integration Module](http://www.internetdownloadmanager.com)：**下载浮动条失效 ಥ_ಥ**
- [pakku.js](https://chrome.google.com/webstore/detail/jklfcpboamajpiikgkbjcnnnnooefbhh)：**完全正常**
- [smoothscroll](http://iamdustan.com/smoothscroll/)：**平滑滚动失效 ಥ_ಥ**

---
### 隐私相关
1. 脚本会读取您的部分信息
   - cookies：与B站后端进行交互时识别用户身份
      + DedeUserID：判断是否登录
      + bili_jct：与B站后端进行操作验证
2. 脚本申请了`GM_xmlhttpRequest`跨域权限，`@connect`元数据如下
   - [BiliPlus](https://www.biliplus.com/)：获取失效视频信息
   - [Bilibilijj](https://www.jijidown.com/)：获取失效视频信息
   - [bilibili](https://www.bilibili.com)：用于获取无[CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS "Cross-origin resource sharing")权限B站数据
3. 脚本引用了部分公开库
   - [protobuf](https://github.com/protobufjs/protobuf.js)：解码新版proto弹幕

---
### 参考致谢
- [protobuf](https://github.com/protobufjs/protobuf.js)(License: BSD 3-Clause)：protobuf.js库
- [Wayback Machine](https://archive.org/web/)：B站旧版网页源代码
- [indefined](https://github.com/indefined/)：脚本原型及指导
- [BiliPlus](https://www.biliplus.com/)/[Bilibilijj](https://www.jijidown.com/)：第三方数据接口
- [哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)：注册时间样式参考
- [mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)：av/BV转化算法的python源码
- [wly5556](https://github.com/MotooriKashin/Bilibili-Old/issues/10)：proto弹幕解码转码
- [Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)：番剧分集信息接口
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：兼容问题启发及部分实现参考
- [Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)：playurl接口算法
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：BPplayurl接口参考
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)：下载面板参考
- [MD5_百度百科](https://baike.baidu.com/item/MD5/212708?fr=aladdin#6_4)：md5算法

---
### 效果预览
![binguo.png](https://i.loli.net/2020/08/09/dStpanmQZYAJce6.png)
### 版本历史
- 2020-08-23
   + 不再预隐藏av页播放器，以优化Firefox79体验(未根本解决)
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
- [……更多……](https://github.com/MotooriKashin/Bilibili-Old/blob/master/history.md)
