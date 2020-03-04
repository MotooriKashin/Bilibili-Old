# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Windows_8-compatible-green.svg?longCache=true) ![Chrome 80](https://img.shields.io/badge/Chrome_80-compatible-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true) ![Other](https://img.shields.io/badge/Other-unknown-red.svg?longCache=true)
- 本脚本为自用的[Tampermonkey](https://www.tampermonkey.net/)(Chrome)脚本，通过重写网页框架的方式切换到Bilibili旧版播放页
- 本脚本没有任何交互设计，所有功能安装即默认开启
- 本脚本已尽力回避与其他同域脚本的冲突，详情及可能的解决办法见下面兼容性条目
- 长记2019年12月9日下午B站官方突然取消了旧版播放页入口强制使用新版，而后2019年12月24日残留的稍后再看页也变成新版，只剩被B站遗弃的播单页或许是唯一的旧版页面遗存，可点击前往([bilibili moe 2018 日本动画场应援](https://www.bilibili.com/playlist/video/pl769))对比一下新旧播放页的体验再考虑是否需要安装本脚本，只希望不要因此而让播单页也步了稍后再看页的后尘

---
### 脚本实现
- 重写
   + av(含分P)，如 [av50619577](https://www.bilibili.com/video/av50619577)(Brambly Boundaries)
   + Bangumi(ss和ep)，如 [ss3398](https://www.bilibili.com/bangumi/play/ss3398)(冰菓) 或 [ep84776](https://www.bilibili.com/bangumi/play/ep84776)(深具传统的古典文学部之重生)
   + 稍后再看，如 [av50619577](https://www.bilibili.com/watchlater/#/av50619577/p1)(慎点！)
   + Special，如 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/)(声之形)
- 修改
   + 替换[嵌入式播放器](https://greasyfork.org/zh-CN/forum/uploads/editor/mo/76f0wjjv4k1w.jpg)([blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html) [campus](https://campus.bilibili.com/index.html) [biligame](https://www.biligame.com/detail/?id=101644) [moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D))
   + 替换除主页外的新版[版头](https://greasyfork.org/zh-CN/forum/uploads/editor/4x/ntcyt7zzdzdu.jpg)和版底
   + 添加在倒计时(10s)后去掉6分钟[预览](https://greasyfork.org/zh-CN/forum/uploads/editor/hv/kyxr9nt8gsja.jpg)提示框
   + 添加个人空间中显示B站账号(当前登录)的[注册时间](https://greasyfork.org/zh-CN/forum/uploads/editor/jh/tnnuxkpfsbqn.png)
   + 修复个人空间中[收藏](https://greasyfork.org/zh-CN/forum/uploads/editor/ac/1s42um54ff7t.png)和[频道](https://greasyfork.org/zh-CN/forum/uploads/editor/pt/5g52iq0yirlm.png)里的失效视频信息(有待完善)
   + 替换播单页已经失效的版头并统一了播放器布局
   + 恢复B站首页[在线人数及投稿数](https://greasyfork.org/zh-CN/forum/uploads/editor/zj/n7yg4qxngxd1.png)统计
   + 添加番剧分集播放和弹幕显示

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 嵌入式页面的换p功能会失效(如[拜年祭](https://www.bilibili.com/blackboard/bnj2020.html))。
2. 旧版播放器原生不支持互动视频，观看互动视频请关闭本脚本。
3. 稍后再看页面播放器右侧列表载入失败。
4. 稍后再看页面没有mini播放器(新版页面也没有，大概是B站自身bug)。
5. 稍后再看页面宽屏或网页全屏模式下弹幕滚动区域没有重绘。
6. av页渲染有点慢，除非版底出现，否则请稍等播放器渲染出来(其实播放器渲染比版头还快，为美观做了隐藏处理)。
7. **一般载入异常问题请通过刷新解决，没用就多刷新几次，硬刷新更佳**(快捷键`Shift + F5`或者`Ctrl + Shift + R`)
8. 由于脚本实现机制，可能导致部分其他脚本功能异常(**详情及可能的解决办法见下面兼容性条目**)
9. 未能找回失效收藏视频的封面和正确标题以及失效频道视频时长信息(这方面做得更好的→[哔哩哔哩(B站|Bilibili)收藏夹Fix](https://greasyfork.org/zh-CN/scripts/383143))

---
### 兼容测试
下面是测试用的平台，目前没有测试其他平台的条件和意向
- Microsoft Windows 8 (Build 6.2.9200.0) （64 位）
- Google Chrome 80.0.3987.122 (正式版本) （64 位） (cohort: 80_87_Win)
- Tampermonkey BETA 4.10.6111

虽然已尽力回避与其他脚本的冲突而改为了沙箱模式运行，但部分无`run-at document-start`仍可能出现异常！
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved) 完全正常
- [解除B站区域限制](https://greasyfork.org/scripts/25718) 功能正常，缺失设置界面，请先在新版播放页把相关设置好(登录授权等)再使用
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513) 完全正常，需先在新版播放页读取CC字幕设置(需登录)再使用
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449) 基本正常，可能会导致弹幕列表上下滑块失效，添加`run-at document-start`元数据则完全恢复正常
- [Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH) 完全正常
- 其他可能因本脚本缘故而异常的脚本，可以试试添加`run-at document-start`元数据，但部分脚本可能无法过早启动，只能建议其他同域脚本尽量以`run-at document-start`启动为前提进行建构

---
### 参考致谢
- 感谢[Wayback Machine](https://archive.org/web/)保存的旧版网页备份。 → [网盘分享](https://pan.bnu.edu.cn/l/toTT4q)([Github](https://github.com/MotooriKashin/Bilibili-Old/tree/master/bilibili)上也有备份)
- 感谢[indefined](https://github.com/indefined)提供的[脚本](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)参考和细心讲解，实在受益良多。
- 脚本描述文件参考了[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)的设计，十分感谢。
- 账号注册时间参考了[哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)，还使用了作者专栏中的最新数据，这里一并致谢。(由于原脚本已经失效并不再维护，而个人非常需要这个功能，故擅作主张添加了进了脚本。)
- 番剧分集数据参考了[Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)，十分感谢。

---
### 效果预览
①[Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/eh/valwnnnfyrpx.jpg) ②[Video](https://greasyfork.org/zh-CN/forum/uploads/editor/3i/lts2zojlzla4.jpg) ③[Watchlater](https://greasyfork.org/zh-CN/forum/uploads/editor/xc/tiah7eq7uxcq.jpg) ④[Bagumi-special](https://greasyfork.org/zh-CN/forum/uploads/editor/el/ekipssyk5445.jpg)
![Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/om/l1wtk3aohb35.png)
### 版本历史
- 2020-03-04：修改元数据以缓解与其他同域脚本的冲突；添加番剧分集播放和弹幕显示；
- 2020-03-03：修复播单页失效版头并统一播放器布局；恢复B站首页在线数统计和投稿数统计；
- 2020-03-02：添加了当前登录的B站账号注册时间信息显示，初步修复空间收藏和频道中的失效视频信息；
- 2020-03-01：重写嵌入式播放器替换逻辑，解决了子页面的跨域问题并将`match`改回了Bilibili主站；
- 2020-02-22：修复版头替换bug；更改脚本为全网生效以处理非主站嵌入式播放器跨域问题；
- 2020-02-21：规范脚本架构；重写了嵌入式播放器替换逻辑并默认选择宽屏模式；
- 2020-02-06：对av页也主动写入__INITIAL_STATE__字段；
- 2020-01-29：当嵌入播放器分辨率太小(宽度<720)时自动启动宽屏模式；
- 2020-01-25：排除匹配直播站点，消除对于直播站点的影响；
- 2020-01-24：紧急修复部分页面(拜年祭)嵌入式播放器替换失败问题；
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
