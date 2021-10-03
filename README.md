![Windows 11](https://img.shields.io/badge/Microsoft_Windows_11-pass-green.svg?longCache=true) ![Chrome 93](https://img.shields.io/badge/Google_Chrome_91-pass-green.svg?longCache=true) ![Firefox 89](https://img.shields.io/badge/Mozilla_Firefox_89-pass-green.svg?longCache=true) ![Tampermonkey 4.13](https://img.shields.io/badge/Tampermonkey_4.14-pass-green.svg?longCache=true)

[Tampermonkey](https://www.tampermonkey.net/)（chrome）脚本，通过重写网页框架的方式还原 B 站旧版页面，即2020年改版之前的页面，尤其是还原当时的播放器样式。  
初次使用需要进行初始化操作，点击“确定”后将进行跨域申请，建议勾选“总是允许全部域名”。

---
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
- 其他：挺多的，请参考脚本设置界面，如有其他附加功能请求也可以提issue。

---
### 设置相关
脚本正常载入会在页面右下角添加一个滚动的齿轮<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.429 1.525a6.593 6.593 0 011.142 0c.036.003.108.036.137.146l.289 1.105c.147.56.55.967.997 1.189.174.086.341.183.501.29.417.278.97.423 1.53.27l1.102-.303c.11-.03.175.016.195.046.219.31.41.641.573.989.014.031.022.11-.059.19l-.815.806c-.411.406-.562.957-.53 1.456a4.588 4.588 0 010 .582c-.032.499.119 1.05.53 1.456l.815.806c.08.08.073.159.059.19a6.494 6.494 0 01-.573.99c-.02.029-.086.074-.195.045l-1.103-.303c-.559-.153-1.112-.008-1.529.27-.16.107-.327.204-.5.29-.449.222-.851.628-.998 1.189l-.289 1.105c-.029.11-.101.143-.137.146a6.613 6.613 0 01-1.142 0c-.036-.003-.108-.037-.137-.146l-.289-1.105c-.147-.56-.55-.967-.997-1.189a4.502 4.502 0 01-.501-.29c-.417-.278-.97-.423-1.53-.27l-1.102.303c-.11.03-.175-.016-.195-.046a6.492 6.492 0 01-.573-.989c-.014-.031-.022-.11.059-.19l.815-.806c.411-.406.562-.957.53-1.456a4.587 4.587 0 010-.582c.032-.499-.119-1.05-.53-1.456l-.815-.806c-.08-.08-.073-.159-.059-.19a6.44 6.44 0 01.573-.99c.02-.029.086-.075.195-.045l1.103.303c.559.153 1.112.008 1.529-.27.16-.107.327-.204.5-.29.449-.222.851-.628.998-1.189l.289-1.105c.029-.11.101-.143.137-.146zM8 0c-.236 0-.47.01-.701.03-.743.065-1.29.615-1.458 1.261l-.29 1.106c-.017.066-.078.158-.211.224a5.994 5.994 0 00-.668.386c-.123.082-.233.09-.3.071L3.27 2.776c-.644-.177-1.392.02-1.82.63a7.977 7.977 0 00-.704 1.217c-.315.675-.111 1.422.363 1.891l.815.806c.05.048.098.147.088.294a6.084 6.084 0 000 .772c.01.147-.038.246-.088.294l-.815.806c-.474.469-.678 1.216-.363 1.891.2.428.436.835.704 1.218.428.609 1.176.806 1.82.63l1.103-.303c.066-.019.176-.011.299.071.213.143.436.272.668.386.133.066.194.158.212.224l.289 1.106c.169.646.715 1.196 1.458 1.26a8.094 8.094 0 001.402 0c.743-.064 1.29-.614 1.458-1.26l.29-1.106c.017-.066.078-.158.211-.224a5.98 5.98 0 00.668-.386c.123-.082.233-.09.3-.071l1.102.302c.644.177 1.392-.02 1.82-.63.268-.382.505-.789.704-1.217.315-.675.111-1.422-.364-1.891l-.814-.806c-.05-.048-.098-.147-.088-.294a6.1 6.1 0 000-.772c-.01-.147.039-.246.088-.294l.814-.806c.475-.469.679-1.216.364-1.891a7.992 7.992 0 00-.704-1.218c-.428-.609-1.176-.806-1.82-.63l-1.103.303c-.066.019-.176.011-.299-.071a5.991 5.991 0 00-.668-.386c-.133-.066-.194-.158-.212-.224L10.16 1.29C9.99.645 9.444.095 8.701.031A8.094 8.094 0 008 0zm1.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM11 8a3 3 0 11-6 0 3 3 0 016 0z"></svg>，滚动数秒后消失。鼠标移动到对应位置会再次显现，点击即可呼出脚本的设置界面。  
基本上所有功能都可以在设置中自行决定启用与否，本脚本只默认开启重写页面相关的部分。  
大部分设置都不能及时生效，需要刷新当前页面才行。

---
### 已知问题
_以下问题这里可能处于并将长期处于无法解决状态，请多担待！如能提供相关帮助，不胜感激！_
1. 技术上无法实现排除新版页面干扰对于重写页面的干扰，新版页面会一闪而过，取决于脚本注入速度和您的网络延时情况。  
2. 上述干扰严重到破坏页面的话请尝试刷新，最好是硬刷新(shift + F5 或 Ctrl + shift + r)。
3. 如果是浏览器内核过时不支持相关特性类的问题原则上不会修复，浏览器内核还是越新越好。
4. 重写页面是过于底层的操作，可能导致其他脚本或浏览器扩展失效，需要第三方主动去兼容。重写模式改为“异步”或许可以缓解，但会引发一些其他问题。
5. 反查弹幕发送者信息原理是逆向CRC32，存在哈希碰撞的可能性，查出的uid信息仅供参考。
6. 互动视频、全景视频、高能进度条等新功能暂时未能移植。
7. HDR、Dobby等流要求HEVC的软解支持暂时未能移植。
8. 旧版弹幕已获取不到90分钟以后的内容，非必要不要关闭“新版弹幕”。
9. av页的充电功能失效，切勿使用，如有需求，请前往对应UP主空间。
10. 主页是改版最大的地方，已尽力去修复，依旧无法做到完美还原请多担待。

---
### B站纪事
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
- 2021 年 07 月 01 日：和谐网页端评论接口，上古按“评论数”排序评论彻底失效。

---
### 编程环境
操作系统    Microsoft Windows 11 professional Insider Preview 10.0.22449.1000  
浏览器      Google Chrome 93.0.4577.63 (stable) (x64) (cohort: 93_Win_63)  
脚本管理器  Tampermonkey Beta 4.14.6143

---
### 参考来源
- [protobufjs](https://github.com/protobufjs/protobuf.js)
- [toastr](https://github.com/CodeSeven/toastr/)
- [Wayback Machine](https://archive.org/web/)
- [bilibiliOldPlayer](https://github.com/indefined/UserScripts)
- [BiliPlus](https://www.biliplus.com/)
- [Bilibilijj](https://www.jijidown.com/)
- [mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)
- [Bilibili_video_download](https://github.com/Henryhaohao/Bilibili_video_download)
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)
- [js-md5](https://github.com/emn178/js-md5)
- [js-base64](https://github.com/dankogai/js-base64)
- [BiliBili_crc2mid](https://github.com/esterTion/BiliBili_crc2mid)
- [解除 B 站区域限制](https://greasyfork.org/scripts/25718)
- [用crc彩虹表反向B站弹幕“匿名”？我不想浪费内存，但是要和彩虹表一样快！](https://moepus.oicp.net/2016/11/27/crccrack/)

--- 
### 许可协议
[MIT License](https://opensource.org/licenses/MIT)