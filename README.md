# Bilibili 旧播放页
---
![Windows 8](https://img.shields.io/badge/Microsoft_Windows_8-compatible-green.svg?longCache=true) ![Chrome 84](https://img.shields.io/badge/Google_Chrome_84-compatible-green.svg?longCache=true) ![Firefox 74](https://img.shields.io/badge/Mozilla_Firefox_76-compatible-green.svg?longCache=true) ![Tampermonkey 4.10](https://img.shields.io/badge/Tampermonkey_4.10-compatible-green.svg?longCache=true)
- [Tampermonkey](https://www.tampermonkey.net/)脚本，通过重写网页框架的方式切换到B站旧版页面(什么是[旧版播放器](https://www.bilibili.com/blackboard/html5playerhelp.html "HTML5播放器简介&示例")？)
- 默认开启部分附加功能，部分任性功能如不喜欢可自行关闭。
- 可能会与小部分同域脚本产生冲突，详情及可能的解决思路见下文兼容性条目
   + 2019年12月09日：移除旧版av、旧版Bangumi
   + 2019年12月24日：移除旧版稍后再看
   + 2020年03月23日：默认启用bv代替av
   + 2020年04月04日：移除旧版主页
   + 2020年04月23日：开启4K灰度测试
   + 2020年04月28日：移除播单相关
   + 2020年05月21日：启用新版弹幕
   + 2020年07月13日：稍后再看再改版

---
### 脚本实现
- 重写(基于原生旧版网页框架)
   + 主页，即 https://www.bilibili.com
   + av(BV)，如 [av50619577](https://www.bilibili.com/video/av50619577 "Brambly Boundaries")或[BV1w4411b7ph](https://www.bilibili.com/video/BV1w4411b7ph "Brambly Boundaries")
   + Bangumi(ss和ep)，如 [ss3398](https://www.bilibili.com/bangumi/play/ss3398 "冰菓") 或 [ep84776](https://www.bilibili.com/bangumi/play/ep84776 "深具传统的古典文学部之重生") 或 [ss12116](https://www.bilibili.com/bangumi/play/ss12116/ "声之形")
   + 稍后再看，如 [https://www.bilibili.com/watchlater/#/av50619577](https://www.bilibili.com/watchlater/#/av50619577 "Brambly Boundaries")
   + 播单，如[pl769](https://www.bilibili.com/playlist/video/pl769 "bilibili moe 2018 日本动画场应援")
   + 收藏，如[ml182603655](https://www.bilibili.com/medialist/play/ml182603655 "bilibili moe 2018 日本动画场应援")
   + 替换嵌入式播放器，如 [blackboard](https://www.bilibili.com/blackboard/topic/activity-2020bangumiQ1_web.html "bilibili 2020 一月新番导视") [campus](https://campus.bilibili.com/index.html "哔哩哔哩校园招聘") [biligame](https://www.biligame.com/detail/?id=101644 "魔法纪录  魔法少女小圆外传") [moegirl](https://zh.moegirl.org/%E4%B8%9C%E6%96%B9M-1%E6%BC%AB%E6%89%8D "东方M-1漫才")
- 修改(可能需要自行启用)
   + 替换掉新版版头和版底
   + 部分禁用BV并在进入BV时跳转到av
   + 显示番剧分集播放数和弹幕数
   + 为旧版播放页添加点赞功能
   + 添加下载视频功能
   + 移除预览提示框
   + 在个人空间显示注册时间
   + 修复评论区的楼层号
   + 修复收藏和频道里的失效视频封面和标题

---
### 关于设置
- 设置入口设计得比较隐蔽以保持页面纯粹
- 入口在页面右下角2~3厘米处，鼠标移到对应位置会自动显现
- 设置中可单独选择所有功能启用与否，附带各功能简要说明
- 设置数据存储在脚本管理器中，不受清除cookies影响
- [这个动图](https://s1.ax1x.com/2020/04/07/GgUKUS.gif "设置参考示例") 能解决所有设置相关问题

---
### 已知问题
**以下问题这里可能处于并将长期处于无法解决状态，请多担待！**
1. 旧版页面载入较新版慢，因为无法在请求新版之前启用旧版。
2. 旧版播放器4k视频支持上可能有问题。
3. 旧版播放器未适配新版弹幕，弹幕上限没有变动。
4. 旧版播放器原生不支持CC字幕，推荐安装[Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)进行支持。
5. 旧版播放器原生不支持互动视频，已主动忽略。
6. 旧版播放器原生不支持全景视频，将无法移动视角。
7. 旧版主页科技区便是新版的知识区，广告区已失效并替换为新添的资讯区且无法刷新动态。
8. 旧版主页推荐位视频数据失效，已暂时屏蔽三日\昨日\七日切换按钮。
9. 旧版播放页面的充电接口失效，请移步UP主的个人空间。
10. 嵌入式页面只简单替换播放器其他附带如切P等功能没有单独适配(如[拜年祭](https://www.bilibili.com/blackboard/bnj2020.html "拜年祭2020"))。
11. 播单页使用二次跳转的方式绕开404错误所以载入比较慢。
12. 收藏播放页并没有原生旧版页面所以采用av页加上稍后再看列表进行模拟，up简介等非重要信息没有去额外获取。
13. 偶发载入异常问题请尝试刷新解决，没用就多刷新几次硬刷新更佳(快捷键`Shift + F5`或者`Ctrl + Shift + R`)。

---
### 兼容数据
下面是测试用的平台，不保证其他平台兼容性
>
> Microsoft Windows 8 (Build 6.2.9200.0) （64 位）  
> Google Chrome 84.0.4147.89 (正式版本) （64 位） (cohort: Stable)  
> Tampermonkey BETA 4.10.6117
>
 
脚本使用的`document.write()`方法在旧版页面对其他脚本及扩展造成了一些兼容问题  
主要集中在以`run-at document-start`注入的同域脚本
- 在本脚本刷新网页框架之前写入DOM的数据无效：如对DOM/CSS的更改
- 在本脚本刷新网页框架之前写入DOM的回调无效：如addEventListener、document.onclick
- 在本脚本刷新网页框架之前注入页面的其他脚本`GM_setValue`方法失效
- **注意：写入window的属性和方法等不会失效**

下面是一些测试过的同域脚本及扩展的结果
- [Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)：大部分功能正常兼容
   + 在旧版页面`GM_setValue`失效无法导致保存设置
   + 在旧版主页“简化主页”冲突会造成布局错乱
   + 旧版番剧页面批量下载功能报错“获取番剧数据失败: 无法找到 Season ID”(当前视频下载没问题)
   + 快捷键拓展部分未适配旧版播放器
- [Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)：完全正常，本脚本并未重写直播页面所以理论上也不存在兼容问题
- [解除B站区域限制](https://greasyfork.org/scripts/25718)：功能正常
   + 并未适配旧版UI，所以无法在旧版页面调出设置，调整设置请去新版页面或者番剧详情页面
- [Bilibili CC字幕工具](https://greasyfork.org/scripts/378513)：完全正常，能使旧版播放器支持CC字幕，**强烈推荐安装！**。
   + 初次使用可能会报错“CC字幕助手配置失败:SyntaxError: Unexpected token u in JSON at position 0”，去新版页面使用一次即可永久解决
- [Bilibili 修车插件](https://greasyfork.org/scripts/374449)：只适配旧版播放器的脚本\*1，并没有兼容问题
   + 由于该脚本会二次初始化播放器，个人推荐手动为其添加以`run-at document-start`注入的元数据，并只在需要使用时启用平时最好关闭
- [Bilibili - Whose Bullets](https://greasyfork.org/zh-CN/scripts/40341)：只适配旧版播放器的脚本\*2，并没有兼容问题
- [IDM Integration Module](http://www.internetdownloadmanager.com)：IDM高级浏览器集成可能是通过往页面注入`content.js`的方式实现的下载浮动条，作为拓展该注入行为肯定在本脚本重写页面之前，所以在旧版页面下载浮动条是失效的，不过IDM下载监听没问题，本脚本下载视频功能的链接能正常捕获，右键使用IDM下载也没问题
- [pakku.js](https://chrome.google.com/webstore/detail/jklfcpboamajpiikgkbjcnnnnooefbhh)：完全正常
- [smoothscroll](http://iamdustan.com/smoothscroll/)：有人反馈平滑滚动失效，未作进一步测试

---
### 参考致谢
- 旧版网页框架来源：[Wayback Machine](https://archive.org/web/)
- 脚本原型来源及指导：[indefined](https://github.com/indefined/UserScripts/tree/master/bilibiliOldPlayer)
- 第三方数据接口：[BiliPlus](https://www.biliplus.com/)、[Bilibilijj](https://www.jijidown.com/)
- 注册时间样式来源：[哔哩哔哩注册时间查询助手](https://greasyfork.org/zh-CN/scripts/382542)
- BV<=>av算法来源：[mcfx](https://www.zhihu.com/question/381784377/answer/1099438784)
- 页面原生调用来源：[wly5556](https://greasyfork.org/users/217840)
- README设计参考：[Bilibili直播间挂机助手](https://github.com/SeaLoong/Bilibili-LRHH)
- 番剧分集数据参考：[Bilibili番剧显示单集信息](https://greasyfork.org/scripts/37970)
- 部分API示例及兼容问题启发：[Bilibili Evolved](https://github.com/the1812/Bilibili-Evolved)
- playurl算法来源：[Bilibili\_video\_download](https://github.com/Henryhaohao/Bilibili_video_download)
- 下载界面样式来源：[YouTube Links](https://greasyfork.org/zh-CN/scripts/5566)
- MD5算法来源：[MD5_百度百科](https://baike.baidu.com/item/MD5/212708?fr=aladdin#6_4)

---
### 效果预览
![Bangumi](https://camo.githubusercontent.com/1802bb815c3f624f636b0ee71554a7b3816f1801/68747470733a2f2f73312e617831782e636f6d2f323032302f30342f30372f4767774576392e706e67)
### 版本历史
- 2020-07-27
   + 修复分集数据错误
   + 替换失效的嵌入式播放器
- 2020-07-15
   + 将下载按钮移动到播放器右键菜单
- 2020-07-14
   + 修复新版av页\_\_playinfo\_\_报错
- 2020-07-13
   + 修复一个三目运算语法错误
   + 改进视频下载功能
   + 修复新版稍后再看改版引发的布局问题
   + 重定向新版稍后再看
- 2020-07-11
   + 改进去除首页广告功能
   + 改进bv=>av功能，使大部分模块直接显示av号
   + 修复主页部分分区问题
- 2020-07-07
   + 修复设置界面在部分页面布局错乱
   + 改进嵌入式播放框架选择
   + 添加去除旧版主页广告选项
- 2020-07-02
   + 修复新版播放页面样式误删
- 2020-07-01
   + 修复部分av页播放器被隐藏问题
- 2020-06-29
   + 修复av页\_\_INITIAL_STATE\_\_错误导致页面渲染失败
- 2020-06-28
   + 改进视频下载功能
- 2020-06-26
   + 修复av页带评论跳转锚点时mini播放器错位
   + 修复[HTML5播放器帮助页](https://www.bilibili.com/blackboard/html5playerhelp.html)视频cid错误
- 2020-06-25
   + 修复稍后再看顶栏
- 2020-06-11
   + 改用脚本管理器存储设置数据(需要重新自定义自己的设置选项)
   + 下载视频支持新版播放页
   + 忽略互动番剧
- 2020-06-10
   + 添加了个下载视频的功能
- 2020-06-07
   + 广告区被404，初步用资讯替代广告区
- 2020-06-06
   + 收藏播放页支持刷新评论区
   + 改进刷新播放器的方法
- 2020-06-04
   + 修复主页特别推荐位，主动生成默认数据
- 2020-05-31
   + 二次初始化av视频以便默认启用4K画质
- 2020-05-29
   + 添加替换视频心跳选项，若播放历史被广告插件等误伤时刻尝试打开
   + 修复正在直播链接
   + 由于B站关闭相关接口，移除恢复在线数据功能
- 2020-05-27
   + 修复播放器上方通知信息
   + 修复直播间轮播视频错误
   + 修复av页数据读取错误
- 2020-05-26
   + 修复首页正在直播数据
- 2020-05-25
   + 引入xhr hook以支持4k视频
   + 添加静态视频页面跳转普通av页选项
   + 添加点赞取消功能
- 2020-05-18
   + 修改一个正则表达式以改善兼容问题
   + 修复点赞功能
- 2020-05-17
   + 将av页playinfo中提供的flv链接替换为安全版本
- 2020-05-16
   + 使用稍后再看列表实现收藏播放页
- 2020-05-15
   + 通过绕过404的方式恢复旧版播单页
- 2020-05-14
   + 修复从稍后再看列表页进入稍后再看播放页面仍为新版的问题
   + 添加隐藏播放器上方通知区选项
- 2020-05-13
   + 修复播放页资讯视频分区信息
   + 修复稍后再看未登录时跳转错误
- 2020-05-10
   + 修复动态更新提醒不消失的问题
   + 评论楼层显示现支持按热度排序
- 2020-05-08
   + 修改av页框架以延迟评论加载速度
- 2020-05-06
   + 添加稍后再看点赞功能
   + 改进修改部分载入时机
- 2020-04-28
   + 撤销所有播单页失效修改，将播单直接重定向播放器
- 2020-04-26
   + 修复评论链接获取错误
- 2020-04-25
   + 修复bv2av锚的部分丢失的问题
   + 修复稍后再看右侧列表载入失败的问题
   + 修复稍后再看宽屏或网页全屏模式下弹幕滚动区域没有重绘的问题
   + 修复稍后再看页没有mini播放器的问题
- 2020-04-24
   + 配置av(BV)\_\_playinfo\_\_以提供4K画质选项
- 2020-04-20
   + 主动忽略互动视频
- 2020-04-15
   + 备份旧版播放器设置以免被新版页面置空
   + 修复部分页面设置界面被遮挡问题
- 2020-04-11
   + 优化新版版头和版底替换方式
- 2020-04-09
   + 优化av(BV)页播放器出现的时机
- 2020-04-08
   + 优化av(BV)页播放器载入速度
- 2020-04-07
   + 修复未启用旧版av(BV)页时新版播放器自毁问题
- 2020-04-06
   + 修复旧版主页部分版块数据错误
   + 忽略某同域脚本创建的子页面
- 2020-04-05
   + 实现旧版B站主页
   + 修复mylist页写入异常
   + 修复搜索及排行榜中BV号误伤
- 2020-04-04
   + 将视频简介中BV号转化为av号以便跳转
- 2020-03-30
   + 修改av(BV)页失效版头处理方法，缓解双版头“一闪而过”的现象
- 2020-03-28
   + 修复一个强制类型转化错误
   + 修正无效av(BV)页判定以缓和与其他同域脚本的冲突
- 2020-03-27
   + 修复bvid导致的嵌入式播放器替换失败
- 2020-03-26
   + 添加初始化设置选项
   + 修复点赞数少打了个零的问题
   + 在av(BV)页添加点赞功能
   + 修复部分设置项无效的错误
   + 修复新版主页中设置界面异常
- 2020-03-25
   + 引入设置界面以供自定义功能开关
   + 修正选择弹幕列表功能
   + 修复BV号导致的稍后再看页错误
- 2020-03-24
   + 修复因BV改版而失效的功能
   + 默认启用BV强制重定向(非二次请求)到原av页功能
   + 修复BV转av时未带上参数的问题
- 2020-03-23
   + 紧急适配新版BV号
- 2020-03-19
   + 修复存在类似`index.html`后缀时的主页判定
- 2020-03-17
   + 修复已付费时付费信息未配置的问题
   + 将搜索页搜索框字号改回旧版大小
- 2020-03-09
   + 固定失效视频信息防止被页面顽固地改回去
   + 修复评论楼层信息
- 2020-03-08
   + 修复稍后再看页面重写错误
   + 修复带参数情况下B站主页判定失误
- 2020-03-06
   + 不再对子页面进行多余处理以降低性能需求
   + 修复了跨域请求未带协议时可能请求错误的问题
   + 初步引入错误收集功能以缓解因报错而导致脚本完全瘫痪的情况
- 2020-03-05
   + 使用第三方接口修复了失效视频信息
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
   + 重写嵌入式播放器替换逻辑，解决了子页面的跨域问题
- 2020-02-22
   + 修复版头替换问题
- 2020-02-06
   + 对av页也主动写入\_\_INITIAL_STATE\_\_字段
- 2020-01-24
   + 紧急修复部分页面(拜年祭)嵌入式播放器替换失败问题
- 2020-01-20
   + 修正大会员及付费提示
- 2020-01-19
   + 修复稍后再看无法读取标题导致报错
   + 主动构造了ep页番剧\_\_INITIAL_STATE\_\_
   + 主动写入标题
- 2020-01-18
   + 主动构造了番剧\_\_INITIAL_STATE\_\_，解决ss番剧页”开播提醒“问题
   + 添加了av页的\_\_INITIAL_STATE\_\_，防止注入过快导致缺少相关数据使播放器启动失败
- 2020-01-17
   + 修复了av页分离错误
   + 重写了内嵌播放器替换逻辑
- 2020-01-16
   + 实现了部分嵌入播放器页面
   + 实现了部分版头和版底
- 2020-01-11
   + 去掉了一个正则表达式以改善兼容问题
- 2020-01-03
   + 添加bangumi页实现
- 2019-12-31
   + 处理av页版头问题
- 2019-12-30
   + 修复高分辨率下av页播放器布局问题
   + 缓解了稍后再看页面播放器容易初始化失败的问题
   + 实现自动切换到弹幕列表
- 2019-12-29
   + 实现稍后再看页面
- 2019-12-27
   + 实现av页
