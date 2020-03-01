# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Windows_8-compatible-green.svg?longCache=true) ![Chrome 80](https://img.shields.io/badge/Chrome_80-compatible-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true) ![Other](https://img.shields.io/badge/Other-unknown-red.svg?longCache=true)
- 本脚本为自用的[Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到Bilibili旧版播放页
- 使用方式同其他[Tampermonkey](https://www.tampermonkey.net/)脚本（只在Chrome下通过测试）
- **本脚本可能导致其他作用于同一页面的脚本失效，详情及可能的解决办法见下面兼容性条目**
- 脚本地址 → [Github](https://github.com/MotooriKashin/Bilibili-Old/) → [Greasy Fork](https://greasyfork.org/zh-CN/scripts/394296)

---
### 脚本实现
- 主要
   + 一般的av页包括分P，如 https://www.bilibili.com/video/av50619577
   + Bangumi页(ss和ep)，如 https://www.bilibili.com/bangumi/play/ss3398 或 https://www.bilibili.com/bangumi/play/ep84776
   + 稍后再看，如 https://www.bilibili.com/watchlater/#/av50619577/p1
   + 特殊Bangumi页(带特殊背景图)，如 https://www.bilibili.com/bangumi/play/ss12116/
- 其他
   + 实现了部分[嵌入式播放器](https://greasyfork.org/zh-CN/forum/uploads/editor/mo/76f0wjjv4k1w.jpg)([blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html) [campus](https://campus.bilibili.com/index.html) [biligame](https://www.biligame.com/detail/?id=101644) [moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D))
   + 实现了部分非播放页的新版[版头](https://greasyfork.org/zh-CN/forum/uploads/editor/4x/ntcyt7zzdzdu.jpg)和版底
   + 实现了在倒计时后去掉烦人的6分钟[预览](https://greasyfork.org/zh-CN/forum/uploads/editor/hv/kyxr9nt8gsja.jpg)提示框

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 嵌入式页面(`blackboard`)的新版换p功能会失效，不过一般也不会嵌入带分P的视频(目前只发现[拜年祭](https://www.bilibili.com/blackboard/bnj2020.html))。
2. 旧版播放器原生不支持互动视频，观看互动视频请关闭本脚本，否则将丢失分支选项。
3. 稍后再看页面没有mini播放器(新版页面也没有，大概是B站自身bug)。
4. 稍后再看页面宽屏或网页全屏模式下弹幕显示区域没有重绘。
5. av页渲染有点慢，除非版底出现，否则请稍等播放器渲染出来(其实播放器渲染比版头还快，为美观做了隐藏处理)。
6. **其他载入异常问题请通过刷新解决，没用就多刷新几次，硬刷新更佳**(快捷键`Shift + F5`或者`Ctrl + Shift + R`)
7. 构造播放信息时不可避免使用了同步请求，可能导致载入时间延长，延迟高时尤为明显。
8. 已经运行的原生脚本无法阻止，可能导致页面载入异常，也请刷新解决。
9. 由于脚本实现机制，可能导致部分其他脚本功能异常，具体应该是所有作用于同一页面的无`run-at       document-start`字段的脚本全部失效(**详情及可能的解决办法见下面兼容性条目**)

---
### 兼容测试
下面是测试用的平台，目前没有测试其他平台的条件和意向
```
Microsoft Windows 8 (Build 6.2.9200.0) （64 位）
Google Chrome 80.0.3987.116 (正式版本) （64 位） (cohort: 80_87_Win)
Tampermonkey BETA 4.10.6111
```
另外由于脚本实现机制，可能会使部分无`run-at       document-start`字段的脚本失效
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)—— 带`run-at       document-start`字段，完全正常，配合使用还可改善其他脚本兼容问题
- [解除B站区域限制](https://greasyfork.org/scripts/25718)—— 带`run-at       document-start`字段，功能方面正常，但设置界面丢失，建议在新版播放页把相关设置(登录授权等)设置好，然后就可以与本脚本一起使用
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)—— 无`run-at       document-start`字段，几乎完全失效，需安装[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)才可恢复，注意该脚本需要在新版播放页读取CC字幕设置(需登录)，之后可以与本脚本一起使用
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)—— 无`run-at       document-start`字段，几乎完全失效，可以通过添加`run-at       document-start`字段恢复，也可安装[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)恢复
- [Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)—— 带`run-at       document-start`字段，完全正常
- 其他因本脚本缘故而失效的脚本，或也可试试这两种方法能否恢复：(并未经过严格测试)

     ①添加`run-at       document-start`字段，但很多脚本可能不能过早启动，所以未必有效
     ②安装[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)脚本，原理不明，所以未必有效
   
---
### 参考致谢
- 感谢[Wayback Machine](https://archive.org/web/)保存的旧版网页备份。 → [这是链接](https://pan.bnu.edu.cn/l/toTT4q)([Github](https://github.com/MotooriKashin/Bilibili-Old/tree/master/bilibili)上也有备份)
- 感谢[indefined](https://github.com/indefined)提供的[脚本](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)参考和细心讲解，实在受益良多。
- 感谢[the1812](https://github.com/the1812)的[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)脚本，虽非本意，且原理不明，但确实能改善本脚本与部分脚本的兼容问题。
- 描述文件参考了[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)的设计，这里一并致谢。

---
### 效果预览
[Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/eh/valwnnnfyrpx.jpg) [Video](https://greasyfork.org/zh-CN/forum/uploads/editor/3i/lts2zojlzla4.jpg) [Watchlater](https://greasyfork.org/zh-CN/forum/uploads/editor/xc/tiah7eq7uxcq.jpg) [Bagumi-special](https://greasyfork.org/zh-CN/forum/uploads/editor/el/ekipssyk5445.jpg)
_为节约流量这里只展示一张预览图，其余需要的话可以直接点击查看_
![Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/om/l1wtk3aohb35.png)
### 版本历史
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
