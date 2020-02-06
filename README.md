# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Windows_8-pass-green.svg?longCache=true) ![Chrome 79](https://img.shields.io/badge/Chrome_79-pass-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-pass-green.svg?longCache=true) ![Other](https://img.shields.io/badge/Other-unknow-red.svg?longCache=true)
- 本脚本为自用的Tampermonkey脚本，通过重写网页框架的方式切换到Bilibili旧版播放页
- 使用方式同其他Tampermonkey脚本
- 安装链接→[Github](https://github.com/201411232004/Bilibili-Old/raw/master/main.user.js)→[Greasy Fork](https://greasyfork.org/zh-CN/scripts/394296)
---
### 脚本功能
- 主要
   + 一般的av页包括分P，如 https://www.bilibili.com/video/av50619577
   + Bangumi页(ss和ep)，如 https://www.bilibili.com/bangumi/play/ss3398 或 https://www.bilibili.com/bangumi/play/ep84776
   + 稍后再看，如 https://www.bilibili.com/video/av50619577
   + 特殊Bangumi页(带特殊背景图)，如 https://www.bilibili.com/bangumi/play/ss12116/
- 其他
   + 实现了部分[blackboard](https://greasyfork.org/zh-CN/forum/uploads/editor/mo/76f0wjjv4k1w.jpg)中嵌入式播放器
   + 实现了部分非播放页的新版[版头](https://greasyfork.org/zh-CN/forum/uploads/editor/4x/ntcyt7zzdzdu.jpg)和版底
   + 实现了在倒计时后去掉烦人的6分钟[预览](https://greasyfork.org/zh-CN/forum/uploads/editor/hv/kyxr9nt8gsja.jpg)提示框
---
### 当前问题
以下问题这里可能处于并将长期处于无法解决状态，请多担待！
1. 嵌入式播放器的新版换p功能会失效，请使用播放按钮旁的下一P按钮换P。
2. 旧版不支持互动视频，观看互动视频请关闭本脚本，否则不会出现分支选项。
3. 稍后再看页面没有mini播放器(新版页面也没有，大概是B站自身bug)。
4. 稍后再看页面宽屏或网页全屏模式下弹幕显示区域没有重绘。
5. av页渲染有点慢，除非版底出现，否则请稍等播放器渲染出来(其实播放器渲染比版头还快，为美观做了隐藏处理)。
- 构造番剧信息时不可避免使用了同步请求，可能导致载入时间延长，延迟高时尤为明显。
- 由于chrome始终无法找到拦截原生脚本的办法且Tampermonkey注入可能无法达到最速，所以原生脚本可能残留并影响旧版页面功能，缓解办法还是刷新，最有效的还是硬刷新。
- 由于脚本实现机制是重写整个网页框架，可能导致部分其他脚本功能异常，不过神奇的是搭配[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)后有些就能恢复正常(参见下面兼容性列表)
---
### 兼容报告
下面是测试用的平台，目前没有测试其他平台的条件和意向
```
Windows 8 (Build 9200)
Google Chrome 79.0.3945.130 (正式版本) （64 位） (cohort: 79_Win_130)
Tampermonkey BETA 4.10.6106
```
另外，由于脚本实现机制，会使部分其他脚本失效，测试列表参考如下
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)——完全兼容，配合使用还可改善其他脚本兼容问题
- [解除B站区域限制](https://greasyfork.org/scripts/25718)——功能方面兼容，但设置界面丢失，建议在新版播放页把相关设置(登录授权等)设置好，然后就可以与本脚本一起使用
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)——本不兼容，需安装[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)才可兼容，注意该脚本需要在新版播放页读取CC字幕设置(需登录)，之后可以与本脚本一起使用
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)——本不兼容，需安装[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)才可兼容
---
### 参考致谢
- 感谢[Wayback Machine](https://archive.org/web/)保存的旧版网页备份，[如需请参考](https://pan.bnu.edu.cn/l/toTT4q)
- 感谢[indefined](https://github.com/indefined)提供的[脚本](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)参考和细心讲解，实在受益良多。
- 感谢[the1812](https://github.com/the1812)的[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)脚本，虽非本意，且原理不明，但确实能改善本脚本与部分脚本的兼容问题。
---
### 效果预览
![Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/eh/valwnnnfyrpx.jpg)
![Video](https://greasyfork.org/zh-CN/forum/uploads/editor/3i/lts2zojlzla4.jpg)
![Watchlater](https://greasyfork.org/zh-CN/forum/uploads/editor/xc/tiah7eq7uxcq.jpg)
![Bagumi-special](https://greasyfork.org/zh-CN/forum/uploads/editor/el/ekipssyk5445.jpg)
### 版本历史
- 2020-02-06：对av页也主动写入__INITIAL_STATE__字段；
- 2020-01-29：当嵌入播放器分辨率太小(宽度<720)时自动启动宽屏模式；
- 2020-01-25：排除匹配直播站点，消除对于直播站点的影响；
- 2020-01-24：紧急修复部分页面(拜年祭)潜入式播放器替换失败问题；
- 2020-01-22：优化部分其他实现；
- 2020-01-20：修正大会员及付费提示；修复部分特殊Bangumi页(ep)判定；
- 2020-01-19：从BGM页中分离出特殊页面(有特殊背景图)另外处理；修复稍后再看无法读取标题导致报错；主动构造了ep页番剧信息；主动写入标题；
- 2020-01-18：主动构造了番剧信息，解决ss番剧页”开播提醒“问题；添加了av页的__INITIAL_STATE__，防止注入过快导致缺少相关数据使播放器启动失败；
- 2020-01-17：修复了av页分离错误；重写了内嵌播放页替换过程；
- 2020-01-16：实现了部分嵌入播放器页面；实现了部分版头和版底；修改了av播放器大小；
- 2020-01-11：去掉了一个正则表达式以改善兼容问题；
- 2020-01-10：再重写替换架构，不再主动继承任何原生网页数据；为兼容性重新引入XHR并修复部分问题；重写脚本架构；修复部分布局问题；
- 2020-01-08：规范脚本结构；再处理av页版头问题；
- 2020-01-05：回滚2.1.3版本的av页架构，使渲染过程不那么撕裂；
- 2020-01-04：参考2.1.3版本再优化av页架构，加快av页载入速度；
- 2020-01-03：重写av页框架；添加bangumi页实现；
- 2019-12-31：修复av页版头问题；
- 2019-12-30：修复高分辨率下av页播放器布局问题；缓解了稍后再看页面播放器容易初始化失败的问题；修改av页替换逻辑，提高与其他脚本的兼容性；修复了一个布局问题；实现自动切换到弹幕列表；
- 2019-12-29：重写脚本结构并整合了稍后再看页面；
- 2019-12-27：添加脚本；改进修复播放器布局的方法；修复整个页面布局；
