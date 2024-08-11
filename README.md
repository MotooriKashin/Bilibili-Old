![Windows 11](https://img.shields.io/badge/Microsoft_Windows_11-pass-green.svg?longCache=true) ![Chrome 108](https://img.shields.io/badge/Google_Chrome_108-pass-green.svg?longCache=true) ![Tampermonkey 4.18](https://img.shields.io/badge/Tampermonkey_4.18-pass-green.svg?longCache=true)  ![Manifest V3](https://img.shields.io/badge/Manifest_V3-pass-green.svg?longCache=true)  

Manifest V3扩展和Tampermonkey用户脚本，恢复B站旧版网页，包括小电视播放器。

### 安装使用
以下两种方式二选一即可。
#### 用户脚本
1. 安装[Tampermonkey](https://www.tampermonkey.net/)脚本管理工具。
2. 到[GreasyFork](https://greasyfork.org/scripts/394296)安装脚本。
3. 打开任意B站页面点击页面右下角浮动的齿轮图标调整脚本设置。 *齿轮自动隐藏后，鼠标移动到对应位置会重新浮现*

#### 浏览器扩展
扩展暂时未上架任何扩展商店，请使用【加载已解压的扩展程序】安装。
1. 到[Actions](https://github.com/MotooriKashin/Bilibili-Old/actions)页面**最新**工作流里下载名为`bilibili-old`的压缩包。
2. 使用解压缩软件解压该压缩包到任意目录。
3. 在chrome浏览器【拓展程序】页面打开右上角的【开发者模式】。
4. 点击【加载已解压的扩展程序】选择步骤2中解压的目录。
5. 点击扩展图标选择【设置选项】调整扩展设置。

*拓展版不会自动更新，请自行到[Actions](https://github.com/MotooriKashin/Bilibili-Old/actions)下载最新构建解压覆盖之前版本的文件，然后重启chrome浏览器即可。*

---
### 功能实现
1. 恢复旧版页面
   - [B站主页](https://www.bilibili.com) 
   - av/BV：[av2](https://www.bilibili.com/video/av2)
   - bangumi：[ss3398](https://www.bilibili.com/bangumi/play/ss3398/ "冰菓")
   - 稍后再看
   - [全站排行榜](https://www.bilibili.com/ranking)
   - 嵌入式播放器：[拜年祭2021](https://www.bilibili.com/festival/2022bnj)
   - 专栏
   - 搜索
   - ~~播单~~
   - ~~mylist~~
2. 基于旧版页面的修复及增强
   - 模拟新版
      - 视频合集（使用播单模拟）
      - 播放全部（使用播单模拟）
   - 弹幕
      - protobuf弹幕支持
      - 反查弹幕发送者
      - 互动弹幕支持
      - ~~全弹幕装填~~
      - 在线弹幕加载
      - 本地弹幕加载
      - 代码弹幕支持
   - 播放器
      - AVC、HEVC或AV1编码切换支持
      - CC字幕支持
      - 分段进度条支持
      - 解除播放限制：港澳台/APP/东南亚（泰区）
      - 替换UPOS服务器
      - 自动化功能：展开弹幕列表、滚动到播放器、宽屏、关弹幕、播放、网页全屏、记忆播放速率、跳过充电鸣谢
      - 本地视频文件播放
   - 修复/修改
      - 全局替换回旧版顶栏
      - ~~评论区翻页支持~~
      - UP主列表支持
      - 动态banner支持
      - bangumi分集数据
      - 主页个性化推荐
      - 港澳台新番时间表
      - 访问受限UP主空间
      - 账户注册时间显示
      - 相簿地址还原
      - 获取失效视频信息
      - BV => av
      - URL垃圾参数清理
      - 日志上报拦截
      - 港澳台bangumi搜索

   - 直播
      - 禁止P2P上传
      - 禁止挂机检测
      - 过滤动态中的直播回放
   - 下载视频、封面、弹幕和字幕

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 恢复旧版页面前，新版页面可能一闪而过。
2. 恢复后的页面可能被新版页面残留脚本、样式破坏，请通过刷新缓解。
3. 原生旧版播放器已获取不到90分钟后的弹幕池，所以如非必要请使用重构播放器。
4. **充电、B币支付等功能在可能已失去维护，请不要使用或者移步新版页面！**
5. 一些功能由于API的失效做不到完全还原，只能尽可能寻求替代方案。

---
### B站更新摘记  
记录从旧版页面被抛弃以来B站的一些修改。
- 2019 年 12 月 09 日：弃用旧版av、Bangumi改版，万恶之始。
- 2019 年 12 月 24 日：弃用旧版稍后再看，借由稍后再看恢复旧版页面的方法失效。
- 2020 年 03 月 23 日：启用BV号，av自增变为乱序。
- 2020 年 04 月 04 日：启用旧版主页，正巧是清明节。
- 2020 年 04 月 23 日：升级4K画质。
- 2020 年 04 月 28 日：404playlist播单，原生旧版页面彻底消失。
- 2020 年 05 月 21 日：启用protobuf弹幕，大量高级弹幕/代码弹幕丢失，xml弹幕90分钟后的部分丢失。
- 2020 年 07 月 13 日：推出medialist页面，下调稍后再看入口并合并。
- 2020 年 07 月 29 日：弃用播放器抖动小电视Loading图，启用新slogan：你感兴趣的视频都在B站。
- 2020 年 08 月 25 日：风控bangumi主机接口，并入api主机接口。
- 2020 年 09 月 23 日：启用互动弹幕、弹幕弹窗。
- 2020 年 10 月 14 日：弃用旧版全站排行榜，强制重定向到热门页面。
- 2020 年 10 月 27 日：弃用评论区右上角快速翻页功能。
- 2020 年 11 月 20 日：启用评论区av/BV转化为标题。
- 2020 年 12 月 03 日：404mylist播放列表。
- 2021 年 02 月 08 日：启用protobuf历史弹幕，超过每日上限的历史弹幕消失。
- 2021 年 04 月 14 日：弃用旧版嵌入式播放器。
- 2021 年 04 月 21 日：弃用评论区翻页，启用瀑布流评论。
- 2021 年 07 月 01 日：和谐翻页评论接口，上古按“评论数”排序评论彻底失效。
- 2021 年 07 月 15 日：升级Bangumi播放器版本3.0。
- 2021 年 08 月 02 日：启用HEVC软解支持，网页端播放HEVC源成为可能。
- 2021 年 09 月 28 日：启用杜比视界/杜比音效支持。
- 2021 年 12 月 03 日：升级8K画质。
- 2022 年 01 月 24 日：启用av1视频编码。
- 2022 年 02 月 16 日：和谐评论接口，无法再获取评论楼层数。
- 2022 年 07 月 05 日：启用HiRes无损音频支持。
- 2022 年 11 月 02 日：弃用新视频flv封装。

---
### 开发环境
> 
> 操作系统        Microsoft Windows 11 professional 10.0.22621.819  
> 浏览器          Google Chrome 108.0.5359.125 (正式版本) （64 位） (cohort: Stable)  
> 代码编辑器      Visual Studio Code 1.74.2  
> 编译器          Node.js v19.1.0  
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
- [YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)：下载面板参考
- [用crc彩虹表反向B站弹幕“匿名”？我不想浪费内存，但是要和彩虹表一样快！](https://moepus.oicp.net/2016/11/27/crccrack/)：crc逆向原理
- [BiliBili_crc2mid](https://github.com/esterTion/BiliBili_crc2mid)：crc逆向算法来源
- [解除 B 站区域限制](https://greasyfork.org/scripts/25718)：解除视频限制功能参考

--- 
### 开源许可
[MIT License](https://opensource.org/licenses/MIT)
