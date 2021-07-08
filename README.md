![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-pass-green.svg?longCache=true) ![Chrome 89](https://img.shields.io/badge/Google_Chrome_91-pass-green.svg?longCache=true) ![Firefox 83](https://img.shields.io/badge/Mozilla_Firefox_89-pass-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.13-pass-green.svg?longCache=true)

[Tampermonkey](https://www.tampermonkey.net/)（chrome）脚本，通过重写网页框架的方式还原 B 站旧版页面，即2020年改版之前的页面，尤其是还原当时的播放器样式。

--

### 脚本实现

- 重写：使用旧版网页框架还原当时的页面，是脚本的核心功能。
   - 主页：[www.bilibili.com](https://www.bilibili.com)
   - av/BV：[av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")、[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   - Bangumi(ss/ep)：[ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 、 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 、 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   - 稍后再看：[list](https://www.bilibili.com/watchlater/#/list "播放列表")、[watchlater](https://www.bilibili.com/medialist/play/watchlater "播放全部")
   - 收藏播放：[ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   - 嵌入播放器：[blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视")、[campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘")、[biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传")、[moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")、~~[mylist](https://www.bilibili.com/mylist8 "缘之空")~~
   - 排行榜：[ranking](https://www.bilibili.com/ranking)、[popular](https://www.bilibili.com/v/popular)
   - ~~播单：[pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")、[detail](https://www.bilibili.com/playlist/detail/pl769 "bilibili moe 2018 日本动画场应援")~~
   - 专栏：如[cv1](https://www.bilibili.com/video/cv1)
- 修改：重写页面之外的其他修改、修复及功能添加。
   - 全局
      - 替换所有顶栏、底栏为旧版样式，丰富顶栏动图彩蛋
      - 恢复所有评论区的页码翻页功能（问题1）
      - 转化页面中出现的所有BV号为av号，同时链接中去除无效的查询参数
   - 播放
      - 自动滚动到播放器，自动网页宽屏，自动关闭弹幕，自动播放视频
      - 自动跳过充电鸣谢
      - 播放结束画面停留在最后一帧
      - 支持CC字幕
      - 支持载入本地视频、弹幕文件（问题2）
      - 支持新版弹幕，修复高级、BAS弹幕，修复实时弹幕
      - 支持互动弹幕
      - 支持反查弹幕发送者信息（问题3）
      - 支持载入站内其他视频、弹幕
   - 其他
      - 支持查询账号注册时间
      - 修复失效视频信息，可以的话直接重建失效页面
      - 还原评论跳转链接的标题为av号等链接
      - 连载Bangumi显示分集数据
      - 支持下载视频（问题4） 
      - 解除港澳台、APP等视频限制，对于泰版视频须自备反代服务器
      - 直播间禁用挂机检测，禁用天选时刻、大乱斗弹窗，禁用p2p带宽共享

※ 以上功能除重写部分外大部分都需要在脚本设置界面自行启用

---

### 设置相关

**脚本设置在哪里？请戳[这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif)！**  
设置界面虽然有所改动，但入口还是参考动图鼠标操作。  
脚本提供的所有功能都可以自行单独调整启用与否。  
大部分功能可能需要**刷新**页面才可以启用。

---

### 已知问题

_以下问题这里可能处于并将长期处于无法解决状态，请多担待！如能提供相关帮助，不胜感激！_  
- **刷新能解决一半问题，硬刷新(shift + F5 或 Ctrl + shift + r)更佳！**  
- 反馈问题最好附带控制台console报错截图以方便定位，且为了沟通效率建议前往[Github](https://github.com/MotooriKashin/Bilibili-Old/issues)。
- 本脚本机制上可能与部分其他脚本或浏览器扩展互斥，并且无法解决也请多担待！

1. 默认载入“按热度排序”评论时页码总数存在虚标现象，具体虚标页数取决于评论被和谐的数量，切换一次“按时间排序”即可获取到实际页数。
2. 本地视频文件拓展名必须为`.mp4`，且视频、音频编码及封装格式必须为浏览器本身所支持。弹幕格式可以是`.xml`和`.json`，前者是B站曾经默认的弹幕文件格式本脚本下载弹幕也是这种，后者是旧版播放器实际解析的弹幕数组并暂无获取方式。载入本地视频可能导致控制台大量报错请无视！
3. 反查弹幕发送者信息原理是逆向CRC32，存在哈西碰撞的可能性，所以提供的信息仅供参考。
4. 获取到的下载链接请右键保存或右键IDM，直接复制大概率会下载失败。配合IDM百分百成功下载的办法可以搭配作者的另一个项目[`ef2`](https://github.com/MotooriKashin/ef2)，并在脚本设置里启用ef2下载功能。
   - 原则上1080P可以下载mp4格式是最好的，更高画质有flv和DASH可选，flv可能分段，DASH则把音视频分开了：avc/hev视频轨二选一，aac是音频轨
   - 脚本设置里可自行添加其他下载：弹幕、封面、CC字幕
5. 重写页面时新版页面一闪而过纯属正常，无需大惊小怪。
6. 部分Firefox浏览器版本兼容不太好，请认准本脚本指定运行环境 chrome + Tampermonkey。
7. 互动视频、全景视频、高能进度条等功能不被旧版播放器所支持。
8. HDR画质的视频在chrome里肯定是无法支持的。
9. 旧版弹幕已获取不到90分钟以后的内容，如非必要不要在脚本设置里关闭“新版弹幕”。
10. av页的充电功能失效，切勿使用，如有需求，请前往对应UP主空间。
11. 旧版主页改版极大，已尽力在尽可能的范围内加以修复。


---

### 运行环境

```
Microsoft Windows 8 (Build 6.2.9200.16384) （64 位）
Google Chrome 91.0.4472.77 (正式版本) （64 位） (cohort: 91_Win_77)
Tampermonkey BETA 4.10.6137
```

---

### 隐私相关
**本脚本运行时可能会侵犯您的部分隐私信息告知如下，使用本脚本默认您同意本脚本使用相关信息。**  
- cookies
  - DedeUserID：用于本地判断您是否登录以方便功能实现
  - bili_jct：用于修复部分接口中恢复与B站后端的通信  

**脚本不会保留您的任何隐私信息或者发送给任何第三方！**  
脚本申请了部分用于跨域的高级功能，说明如下：
- `GM_xmlhttpRequest`（`@connect`）：Tampermonkey提供的跨域Ajax。
  - [BiliPlus](https://www.biliplus.com/)/[Bilibilijj](https://www.jijidown.com/)：用于获取缓存的失效视频标题和封面
  - [mcbbs](https://www.mcbbs.net)：用于获取 APP 端的鉴权`access_key`，只在解除限制功能同时开启“会员授权”时
  - [bilibili](https://www.bilibili.com)：用于获取无[CROS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS "Cross-origin resource sharing")权限 B 站数据
- `GM_getResourceURL`/`GM_getResourceText`（`@resource`）：脚本运行的模块依赖，全部保存在Tampermonkey本地。
    - html：旧版网页框架，修改自[Wayback Machine](https://archive.org/web/)缓存
    - json：各种配置数据，包括脚本默认设置
    - js：各个功能模块，可以按需加载
  
脚本引用了部分公开js库
- [protobuf](https://github.com/protobufjs/protobuf.js)：解码新版 proto 弹幕
- [toastr](https://github.com/CodeSeven/toastr/)：实现通知模块
  
脚本使用了部分原生脚本历史版本并可能进行了修改  
- [comment.min.js](https://github.com/MotooriKashin/Bilibili-Old/tree/master/src/comment.min.js) 2019 年 12 月的备份，进行了部分修改用以找回新版移除评论区小页码区域及恢复旧版评论排序
- [video.min.js](https://github.com/MotooriKashin/Bilibili-Old/tree/master/src/video.min.js) 2019 年 12 月的备份，进行了部分修改以支持 4K、HDR 清晰度

---

### 参考致谢

- [protobuf](https://github.com/protobufjs/protobuf.js)（BSD 3-Clause 许可）：protobuf.js 库
- [toastr](https://github.com/CodeSeven/toastr/)（BSD 3-Clause 许可）：toastr 库，使用原生 JavaScript 重新实现
- [Wayback Machine](https://archive.org/web/)：B 站旧版网页源代码
- [indefined](https://github.com/indefined/)：脚本原型及指导，CC字幕移植来源
- [BiliPlus](https://www.biliplus.com/)/[Bilibilijj](https://www.jijidown.com/)：第三方数据接口
- [哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)：注册时间样式参考
- [mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)：av/BV 转化算法的 python 源码
- [Bilibili 番剧显示单集信息](https://greasyfork.org/scripts/37970)：番剧分集信息接口
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：兼容问题启发及部分实现参考
- [Bilibili_video_download](https://github.com/Henryhaohao/Bilibili_video_download)：playurl 接口算法
- [解除 B 站区域限制](https://greasyfork.org/scripts/25718)：BPplayurl 接口参考、授权登录接口
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)：下载面板参考
- [js-md5](https://github.com/emn178/js-md5)（MIT 许可）：md5 哈希算法
- [MoePus](https://moepus.oicp.net/2016/11/27/crccrack/ "用crc彩虹表反向B站弹幕“匿名”？我不想浪费内存，但是要和彩虹表一样快！")：弹幕哈希反查算法
- [esterTion](https://github.com/esterTion/BiliBili_crc2mid)（GFUL 许可）：弹幕哈希反查算法的 JavaScript 实现
- [miyouzi](https://github.com/miyouzi/bilibili-helper/raw/0316840c56b3295377fc0f6b7095daa54bc6ac9d/packages/unblock-area-limit/src/api/biliplus.ts)（MIT 许可）：APP 端 DASH sidx 解析
- [js-base64](https://github.com/dankogai/js-base64)（BSD-3-Clause 许可）：Base64 算法

---

### B 站记忆

- 2019 年 12 月 09 日：改版 av、Bangumi 页面，旧版播放页面入口从此消失。
- 2019 年 12 月 24 日：改版稍后再看，使用稍后再看找回旧版播放器的方法失效。
- 2020 年 03 月 23 日：启用 BV 号，av 号也不再自增。
- 2020 年 04 月 04 日：改版 B 站主页，刚好那天是清明节。
- 2020 年 04 月 23 日：开启 4K 灰度测试，幸好旧版播放器可以兼容。
- 2020 年 04 月 28 日：404 播单，从此再无原生旧版播放页面。
- 2020 年 05 月 21 日：启用 proto 弹幕，旧版接口只能获取 90 分钟以内的弹幕。
- 2020 年 07 月 13 日：稍后再看再改，使用的是收藏播放页面同一套模版。
- 2020 年 07 月 29 日：新版播放器小电视抖动图消失。
- 2020 年 08 月 25 日：旧版番剧信息接口被风控，旧版接口一一失效的开始。
- 2020 年 09 月 23 日：启用新版播放器弹幕叠加层。
- 2020 年 10 月 14 日：重定向排行榜页面，旧版排行榜消失。
- 2020 年 10 月 27 日：评论区右上角小页码区消失。
- 2020 年 11 月 20 日：评论区 av/BV 链接替换为标题。
- 2020 年 12 月 03 日：404 mylist，少了个考古工具
- 2021 年 02 月 08 日：关闭旧版历史弹幕池，部分高级弹幕、历史弹幕从此消失。
- 2021 年 04 月 14 日：改版旧版嵌入式播放器。
- 2021 年 04 月 21 日：改版评论区，不再支持翻页。
- 2021 年 07 月 01 日：和谐网页端评论接口，上古按“评论数”排序评论彻底失效

---

### 开放源码
本项目以 MIT 许可开放所有源代码，包括对于B站原生脚本修改的部分。