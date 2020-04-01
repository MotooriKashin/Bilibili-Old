# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 80](https://img.shields.io/badge/Google_Chrome_80-compatible-green.svg?longCache=true) ![Firefox 74](https://img.shields.io/badge/Mozilla_Firefox_74-compatible-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- 本脚本为自用的[Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到B站旧版播放页
- 本脚本默认开启部分任性的附加功能，如不喜欢可通过设置界面关闭
- 本脚本会与小部分同域脚本产生冲突，详情及可能的解决思路见下文兼容性条目
- 本脚本的初衷是旧版播放器有些功能是无可替代的，并不是排斥新版播放器
   + 2019年12月09日：B站突然取消了旧版av、Bangumi页面入口
   + 2019年12月24日：B站再次把稍后再看也改为了新版
   + 2020年03月23日：B站启用BV号替代原本的av号
   + 仅存的旧版页面：[播单页](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")

---
### 脚本实现
- 重写
   + av(BV)，如 [av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")或[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss和ep)，如 [ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 或 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生")
   + 稍后再看，如 [av50619577](https://www.bilibili.com/watchlater/#/av50619577/p1 "Brambly Boundaries")
   + Special，如 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
- 修改
   + 替换嵌入式播放器(如 [blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视") [campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘") [biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传") [moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才"))
   + 替换大部分新版版头和版底
   + 添加BV跳转到对应的av页
   + 添加番剧分集播放数和弹幕数
   + 添加旧版av(BV)页点赞功能
   + 添加在倒计时(10s)后去掉6分钟预览框
   + 添加个人空间显示注册时间
   + 恢复B站首页在线数据
   + 修复评论区的楼层信息
   + 修复收藏和频道里的失效视频信息
- 设置
   + 上述部分功能默认不启用，需自行在设置界面开启
   + 设置入口在页面右下角2~3厘米高处，隐形且自动贴边，鼠标移过会自动浮现
   + 设置入口有意设计得并不明显以尽量不污染原生版面
   + 设置界面会在鼠标移开后消失，然后设置内容会自动保存
   + 设置内容依赖本地缓存，不同主机间不共享，须分别设置
   + 部分设置可能需要刷新才会生效，刷新前请将鼠标移开让界面消失

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 旧版播放器原生不支持互动视频，观看互动视频可临时在设置中关闭“av(BV)项”。
2. 嵌入式页面的换p功能会失效(如[拜年祭](https://www.bilibili.com/blackboard/bnj2020.html "拜年祭2020"))。
3. 稍后再看页播放器右侧列表载入失败、投币功能失效。
4. 稍后再看页没有mini播放器(新版页面也没有，大概是B站自身bug)。
5. 稍后再看页宽屏或网页全屏模式下弹幕滚动区域没有重绘。
6. av(BV)页在播放器渲染出来之前可能版面会有些奇怪。
7. **偶发载入异常问题请通过刷新解决，没用就多刷新几次，硬刷新更佳**(快捷键`Shift + F5`或者`Ctrl + Shift + R`)
8. 由于脚本实现机制，可能导致部分同域脚本功能异常。

---
### 兼容测试
下面是测试用的平台，不保证其他平台兼容性
>
> Microsoft Windows 8 (Build 6.2.9200.0) （64 位）  
> Google Chrome 80.0.3987.149 (正式版本) （64 位） (cohort: 80_87_Win)  
> Tampermonkey BETA 4.10.6112
>
 
与其他同域脚本兼容数据
|       | 兼容性 | 备注 |
| ---------------------- | ------------- | --------------------------------------------------------------- |
| [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved) | 完全正常 | |
| [解除B站区域限制](https://greasyfork.org/scripts/25718) | 功能正常 | 缺失设置界面，调整设置需去新版页面 |
| [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513) | 完全正常 | 初次使用需在新版页面读取设置数据 |
| [Bilibili 修车插件](https://greasyfork.org/scripts/374449) | 基本正常  | 可以添加`run-at document-start`元数据增强稳定性 |
| [Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH) | 完全正常 | |

---
### 参考致谢
- 感谢[Wayback Machine](https://archive.org/web/)保存的旧版网页备份。
- 感谢[indefined](https://github.com/indefined)提供的[脚本](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)参考和细心讲解，实在受益良多。
- 感谢[BiliPlus](https://www.biliplus.com/)和[Bilibilijj]()开放的Bilibili数据查询接口。
- 脚本描述文件参考了[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)的设计，非常感谢。
- 番剧分集数据参考了[Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)，非常感谢。
- 部分内容还学习和参考了[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)，与其他脚本的冲突问题也是受其启发，非常感谢。
- BV转av参考了[mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)开源的Python代码，非常感谢。

---
### 效果预览
①[Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/eh/valwnnnfyrpx.jpg) ②[Video](https://greasyfork.org/zh-CN/forum/uploads/editor/3i/lts2zojlzla4.jpg) ③[Watchlater](https://greasyfork.org/zh-CN/forum/uploads/editor/xc/tiah7eq7uxcq.jpg) ④[Bagumi-special](https://greasyfork.org/zh-CN/forum/uploads/editor/el/ekipssyk5445.jpg)
![Bangumi](https://greasyfork.org/zh-CN/forum/uploads/editor/pa/q98b6e0nrghx.png)
### 版本历史
- 2020-03-30
   + 修改av(BV)页失效版头处理方法，缓解双版头“一闪而过”的现象；
- 2020-03-28
   + 修复一个强制类型转化错误；
   + 修正无效av(BV)页判定以缓和与其他同域脚本的冲突；
- 2020-03-27
   + 修复bvid导致的嵌入式播放器替换失败；
- 2020-03-26
   + 添加初始化设置选项；
   + 修复点赞数少打了个零的bug；
   + 在av(BV)页添加点赞功能，默认不启用，可通过设置界面启用
   + 修复部分设置项无效的错误
   + 修复新版主页中设置界面异常
- 2020-03-25
   + 引入设置界面以供自定义功能开关
   + 修正选择弹幕列表功能
   + 修复BV号导致的稍后再看页错误
- 2020-03-24
   + 修复因BV改版而失效的功能
   + 默认启用BV强制重定向(非二次请求)到原av页功能
   + 修复BV转av时未带上参数的bug
- 2020-03-23
   + 紧急适配新版BV号
- 2020-03-19
   + 修复存在类似`index.html`后缀时的主页判定
   + 替换“标签修改记录”页失效版头
- 2020-03-17
   + 修复已付费时付费信息未配置的bug
   + 将搜索页搜索框字号改回旧版大小
- 2020-03-10
   + 修改页面上下文获取方式
   + 完善调试模块
   + 添加第三方接口(Bilibilijj)的视频信息接口
- 2020-03-09
   + 固定失效视频信息防止被页面顽固地改回去
   + 初步修复评论楼层信息
- 2020-03-08
   + 修复稍后再看页面重写错误
   + 修复带参数情况下B站主页判定失误
- 2020-03-06
   + 不再对子页面进行多余处理以降低性能需求
   + 修复了跨域请求未带协议时可能请求错误的bug
   + 初步引入错误收集功能以缓解因报错而导致脚本完全瘫痪的情况
- 2020-03-05
   + 使用第三方接口(BiliPlus)修复了失效视频信息
- 2020-03-04
   + 修改元数据以缓解与其他同域脚本的冲突
   + 添加番剧分集播放和弹幕显示
- 2020-03-03
   + 修复播单页失效版头并统一播放器布局
   + 恢复B站首页在线数统计和投稿数统计
- 2020-03-02
   + 添加了当前登录的B站账号注册时间信息显示
   + 初步修复空间收藏和频道中的失效视频信息
- 2020-03-01
   + 重写嵌入式播放器替换逻辑，解决了子页面的跨域问题并将`match`改回了Bilibili主站
- 2020-02-22
   + 修复版头替换bug
   + 更改脚本为全网生效以处理非主站嵌入式播放器跨域问题
- 2020-02-21
   + 规范脚本架构
   + 重写了嵌入式播放器替换逻辑并默认选择宽屏模式
- 2020-02-06
   + 对av页也主动写入__INITIAL_STATE__字段
- 2020-01-29
   + 当嵌入播放器分辨率太小(宽度<720)时自动启动宽屏模式
- 2020-01-25
   + 排除匹配直播站点，消除对于直播站点的影响
- 2020-01-24
   + 紧急修复部分页面(拜年祭)嵌入式播放器替换失败问题
- 2020-01-22
   + 优化部分其他实现
- 2020-01-20
   + 修正大会员及付费提示
   + 修复部分特殊Bangumi页(ep)判定
- 2020-01-19
   + 从BGM页中分离出特殊页面(有特殊背景图)另外处理
   + 修复稍后再看无法读取标题导致报错
   + 主动构造了ep页番剧信息
   + 主动写入标题
- 2020-01-18
   + 主动构造了番剧信息，解决ss番剧页”开播提醒“问题
   + 添加了av页的__INITIAL_STATE__，防止注入过快导致缺少相关数据使播放器启动失败
- 2020-01-17
   + 修复了av页分离错误
   + 重写了内嵌播放页替换过程
- 2020-01-16
   + 实现了部分嵌入播放器页面
   + 实现了部分版头和版底
   + 修改了av播放器大小
- 2020-01-11
   + 去掉了一个正则表达式以改善兼容问题
- 2020-01-10
   + 再重写替换架构，不再主动继承任何原生网页数据 
   + 为兼容性重新引入XHR并修复部分问题
   + 重写脚本架构
   + 修复部分布局问题
- 2020-01-08
   + 规范脚本结构
   + 再处理av页版头问题
- 2020-01-05
   + 回滚2.1.3版本的av页架构，使渲染过程不那么撕裂
- 2020-01-04
   + 参考2.1.3版本再优化av页架构，加快av页载入速度
- 2020-01-03
   + 重写av页框架
   + 添加bangumi页实现
- 2019-12-31
   + 修复av页版头问题
- 2019-12-30
   + 修复高分辨率下av页播放器布局问题
   + 缓解了稍后再看页面播放器容易初始化失败的问题
   + 修改av页替换逻辑，提高与其他脚本的兼容性
   + 修复了一个布局问题
   + 实现自动切换到弹幕列表
- 2019-12-29
   + 重写脚本结构并整合了稍后再看页面
- 2019-12-27
   + 发布脚本
   + 改进修复播放器布局的方法
   + 修复整个页面布局
