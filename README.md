![Windows 11](https://img.shields.io/badge/Microsoft_Windows_11-pass-green.svg?longCache=true) ![Chrome 101](https://img.shields.io/badge/Google_Chrome_101-pass-green.svg?longCache=true) ![Firefox 89](https://img.shields.io/badge/Mozilla_Firefox_89-pass-green.svg?longCache=true) ![Tampermonkey 4.14](https://img.shields.io/badge/Tampermonkey_4.14-pass-green.svg?longCache=true)

[Tampermonkey](https://www.tampermonkey.net/)（chrome）脚本，恢复旧版B站网页样式，包括旧版播放器。  
※ 要求浏览器版本支持到[es2020（`Promise.allSettled`）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9)


---
### 功能实现
1. 恢复旧版页面
   - B站主页：https://www.bilibili.com  
   - av/BV页：[av2](https://www.bilibili.com/video/av2)。
   - bangumi：[ss3398](https://www.bilibili.com/bangumi/play/ss3398/ "冰菓")
   - 稍后再看
   - 排行榜：https://www.bilibili.com/ranking
   - 嵌入式播放器：[拜年祭2021](https://www.bilibili.com/festival/2022bnj)专题页面
   - 专栏
   - 搜索
2. 配套的后续处理
   - （详见脚本设置）

---
### 关于设置
页面载入完成时，脚本会在页面右下角生成一个“齿轮”，点击即可打开脚本设置界面。（“齿轮”会自动隐藏，感应到鼠标焦点又会浮现。）

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 重写页面之前，新版页面必然已经显示一部分，这种“一闪而过”的现象无法彻底根除。
2. 重写前已渲染的新版页面残留的代码可能破坏重写后的页面，请通过刷新页面缓解。
3. 反查弹幕发送者功能提供的信息可能存在碰撞，仅供参考不可作为唯一判据。
4. 互动视频、全景视频、高能进度条等旧版播放器不支持
5. HDR、Dobby、8K等HEVC专属画质可能无法支持。
6. 旧版xml弹幕已获取不到90分钟后的弹幕池，所以如非必要请不要关闭“新版弹幕”功能。
7. **充电、B币支付等功能在可能已失去维护，请不要使用或者移步新版页面！**
8. 一些功能由于API的失效做不到完全还原，只能尽可能寻求替代方案。

问题反馈推荐去[Github](https://github.com/MotooriKashin/Bilibili-Old)发issue，GreasyFork的邮件通知系统经常抽风，可能无法及时接收评论和反馈。

---
### B站更新摘记  
记录从旧版页面被抛弃以来B站的一些修改。
- 2019 年 12 月 09 日：av、Bangumi改版，万恶之源。
- 2019 年 12 月 24 日：稍后再看改版，使用稍后再看找回旧版播放器的方法失效。
- 2020 年 03 月 23 日：BV号全量推送，同时保留av号支持，但是不再自增。
- 2020 年 04 月 04 日：主页改版，那天正好是清明节。
- 2020 年 04 月 23 日：4K灰度测试，保留了AVC源，旧版播放器无缝兼容。
- 2020 年 04 月 28 日：播单被404，原生旧版页面灭绝。
- 2020 年 05 月 21 日：弹幕改版，启用protobuf，旧版xml弹幕无法获取90分钟后的弹幕池。
- 2020 年 07 月 13 日：稍后再看再改，统一成为合集页面的一种。
- 2020 年 07 月 29 日：播放器加载图改版，抖动的小电视消失，改为了“你感兴趣的视频都在B站”。
- 2020 年 08 月 25 日：番剧信息接口风控，旧版接口一一失效的开始。
- 2020 年 09 月 23 日：弹幕叠加层出现，互动弹幕、弹幕弹窗。
- 2020 年 10 月 14 日：排行榜改版，旧版排行榜强制重定向。
- 2020 年 10 月 27 日：评论区改版，右上角快速翻页区域消失。
- 2020 年 11 月 20 日：评论区改版，av/BV超链接直接转化为标题。
- 2020 年 12 月 03 日：mylist被404，远古合集数据消失。
- 2021 年 02 月 08 日：历史弹幕池改版，启用protobuf，部分高级弹幕、代码弹幕以及超过上限的历史弹幕消失。
- 2021 年 04 月 14 日：嵌入式播放器改版，旧版播放器外链接口不复存在。
- 2021 年 04 月 21 日：评论区改版，评论不再支持翻页。
- 2021 年 07 月 01 日：评论接口和谐，上古按“评论数”排序评论彻底失效，之后又恢复了，但页码总数已不正常。
- 2021 年 07 月 15 日：Bangumi播放器改版。
- 2021 年 08 月 02 日：HEVC软解支持，网页端播放HEVC源成为可能。
- 2021 年 09 月 28 日：杜比视界/杜比音效支持，只提供HEVC源。
- 2021 年 12 月 03 日：8K支持，只提供HEVC源。
- 2022 年 01 月 24 日：av1编码上线。
- 2022 年 02 月 16 日：评论接口和谐，无法再获取评论楼层数。

---
### 开发环境
> 
> 操作系统        Microsoft Windows 11 professional 10.0.22000.527  
> 浏览器          Google Chrome 101.0.4951.67 (正式版本) （64 位） (cohort: Stable Installs & Version Pins)  
> 脚本管理器      Tampermonkey Beta 4.14.6160  
> 代码编辑器      Visual Studio Code 1.67.2 
> 编译器          Node.js v16.14.2  
>                TypeScript Version 4.6.4  
>

参见[开发者文档](https://github.com/MotooriKashin/Bilibili-Old/blob/master/.github/contributing.md)。

---
### 参考致谢
- [protobufjs](https://github.com/protobufjs/protobuf.js)：protobuf编解码
- [toastr](https://github.com/CodeSeven/toastr/)：浮动通知
- [Wayback Machine](https://archive.org/web/)：旧版页面存档
- [bilibiliOldPlayer](https://github.com/indefined/UserScripts)：原型参考及指导
- [BiliPlus](https://www.biliplus.com/)：第三方接口
- [Bilibilijj](https://www.jijidown.com/)：第三方接口
- [如何看待 2020 年 3 月 23 日哔哩哔哩将稿件的「av 号」变更为「BV 号」？ - mcfx的回答 - 知乎](https://www.zhihu.com/question/381784377/answer/1099438784)：av/BV互转算法
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：部分算法参考
- [Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)：下载接口参考
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)：下载面板参考
- [js-md5](https://github.com/emn178/js-md5)：MD5哈希算法参考
- [用crc彩虹表反向B站弹幕“匿名”？我不想浪费内存，但是要和彩虹表一样快！](https://moepus.oicp.net/2016/11/27/crccrack/)：crc逆向原理
- [BiliBili_crc2mid](https://github.com/esterTion/BiliBili_crc2mid)：crc逆向算法来源
- [解除 B 站区域限制](https://greasyfork.org/scripts/25718)：解除视频限制功能参考


--- 
### 开源许可
[MIT License](https://opensource.org/licenses/MIT)
