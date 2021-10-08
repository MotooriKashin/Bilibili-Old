![Windows 11](https://img.shields.io/badge/Microsoft_Windows_11-pass-green.svg?longCache=true) ![Chrome 94](https://img.shields.io/badge/Google_Chrome_94-pass-green.svg?longCache=true) ![Firefox 89](https://img.shields.io/badge/Mozilla_Firefox_89-pass-green.svg?longCache=true) ![Tampermonkey 4.13](https://img.shields.io/badge/Tampermonkey_4.14-pass-green.svg?longCache=true)

[Tampermonkey](https://www.tampermonkey.net/)（chrome）脚本，通过重写网页框架的方式还原 B 站旧版页面，即2020年改版之前的页面，尤其是还原当时的播放器样式。  


---
### 功能实现
- 重写网页框架以恢复旧版B站页面：参考[Wayback Machine](https://archive.org/web/)备份的B站旧版HTML源码，以一种非常**暴力**的方式还原当时的页面。包括：
  1. B站主页
  2. av/BV视频播放器页
  3. Bangumi播放页
  4. 稍后再看播放页
  5. 媒体列表（使用稍后再看模拟）
  6. 嵌入式播放页
  7. 全站排行榜页面
  8. ~~播单页面~~
  9. 专栏页面
- 重写以外的功能：包括对旧版页面失效功能的补救修复，个人常用的一些功能工具。另外由于本脚本与其他用户脚本/浏览器扩展兼容性不佳，所以也参考移植了一些别人实现的功能。

---
### 关于设置
脚本内置了一个设置调整界面，可以自定义每项功能的启用与否。  
默认情况下，脚本会在页面载入完成时在屏幕右下角绘制一个滚动的齿轮，滚动3秒后隐藏。鼠标移过时又会显现，点击便会在屏幕中央弹出一个设置界面。  
设置中也可以在设置中选择使用经典的贴边隐藏模式，不再使用滚动齿轮，取而代之的是静默地在齿轮右边的页面边缘贴边隐藏一个浮动窗口，鼠标移动到对应位置才会显现。  
大部分设置都需要刷新页面才会生效。  
至于各设置项说明，鼠标移动到对应位置都会有浮动说明，应该足够详细，这里不再一一说明。

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！若能提供相关帮助，不胜感激！**
1. 重写页面之前的页面内容一闪而过是正常的，尤其是网络延迟不稳定的时候。设置中选择“同步”模式重写或可缓解，但与其他脚本的兼容性会下降。
2. 偶发的页面变形，节点丢失，弹窗报错请先尝试刷新，最好硬刷新，快捷键一般为`shift` + `F5` 或 `Ctrl` + `shift` + `r`。
3. 弹幕发送者信息是从CRC32校验码中逆向出来的，存在哈希碰撞的可能性，所以结果未必是真。
4. 互动视频、全景视频、高能进度条等后来的新功能旧版播放器是不支持的。
5. HDR、Dobby等HEVC视频源旧版播放器也不支持。
6. 旧版播放器默认弹幕接口已获取不到长视频90分钟以后的弹幕，如非必要请不要关闭设置中的“新版弹幕”功能。
7. av页的充电功能已失效，切勿使用，充电需求请前往UP主主页。
8. 主页很多功能已名存实亡，无法修复，切莫见怪。

问题反馈推荐去[Github](https://github.com/MotooriKashin/Bilibili-Old)发issue，GreasyFork的邮件通知系统经常抽风，可能无法及时接收评论和反馈。

---
### B站改版记录
- 2019 年 12 月 09 日：改版 av、Bangumi 页面，旧版播放页面入口从此消失。
- 2019 年 12 月 24 日：改版稍后再看，使用稍后再看找回旧版播放器的方法失效。
- 2020 年 03 月 23 日：启用 BV 号，av 号不再自增而是乱序。
- 2020 年 04 月 04 日：改版 B 站主页，刚好那天是清明节。
- 2020 年 04 月 23 日：开启 4K 灰度测试，幸好旧版播放器可以兼容。
- 2020 年 04 月 28 日：404 播单，原生旧版播放页面绝。
- 2020 年 05 月 21 日：启用 proto 弹幕，旧版接口只能获取 90 分钟以内的弹幕。
- 2020 年 07 月 13 日：稍后再看再改，使用的是收藏播放页面同一套模版。
- 2020 年 07 月 29 日：新版播放器小电视抖动图消失，改为了slogan。
- 2020 年 08 月 25 日：旧版番剧信息接口被风控，旧版接口一一失效的开始。
- 2020 年 09 月 23 日：启用新版播放器弹幕叠加层，弹幕支持互动。
- 2020 年 10 月 14 日：重定向排行榜页面，旧版排行榜消失。
- 2020 年 10 月 27 日：评论区右上角小页码区消失。
- 2020 年 11 月 20 日：评论区 av/BV 链接替换为标题。
- 2020 年 12 月 03 日：404 mylist，少了个考古工具
- 2021 年 02 月 08 日：关闭旧版历史弹幕池，部分高级弹幕、历史弹幕从此消失。
- 2021 年 04 月 14 日：改版旧版嵌入式播放器。
- 2021 年 04 月 21 日：改版评论区，不再支持翻页。
- 2021 年 07 月 01 日：和谐网页端评论接口，上古按“评论数”排序评论彻底失效。之后又恢复了，但页码数已不正常。
- 2021 年 07 月 15 日：Bangumi新版播放器改版。
- 2021 年 08 月 02 日：新版播放器 H.265/HEVC 软解支持。
- 2021 年 09 月 28 日：新版播放器杜比视界/杜比音效支持。

---
### 开发环境
> 
> 操作系统        Microsoft Windows 11 professional Insider Preview 10.0.22449.1000  
> 浏览器          Google Chrome 94.0.4606.71 (正式版本) （64 位） (cohort: Stable)  
> 脚本管理器      Tampermonkey Beta 4.14.6143  
> 代码编辑器      Visual Studio Code 1.61.0  
> 编译器          Node.js v12.9.1  
>                TypeScript Version 4.4.3  
>

---
### 文档索引
- [代码贡献指南](https://github.com/MotooriKashin/Bilibili-Old/tree/master/doc/develop.md)
- [下载功能说明](https://github.com/MotooriKashin/Bilibili-Old/tree/master/doc/download.md)
- [兼容性文档](https://github.com/MotooriKashin/Bilibili-Old/tree/master/doc/compatibility.md)

---
### 参考致谢
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
- [BiliBili_crc2mid](https://github.com/esterTion/BiliBili_crc2mid)
- [解除 B 站区域限制](https://greasyfork.org/scripts/25718)
- [用crc彩虹表反向B站弹幕“匿名”？我不想浪费内存，但是要和彩虹表一样快！](https://moepus.oicp.net/2016/11/27/crccrack/)

--- 
### 开源许可
[MIT License](https://opensource.org/licenses/MIT)
