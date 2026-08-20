# Bilibili

                         //
             \\         //
              \\       //
        ##DDDDDDDDDDDDDDDDDDDDDD##
        ## DDDDDDDDDDDDDDDDDDDD ##   ________   ___   ___        ___   ________   ___   ___        ___
        ## hh                hh ##   |\   __  \ |\  \ |\  \      |\  \ |\   __  \ |\  \ |\  \      |\  \
        ## hh    //    \\    hh ##   \ \  \|\ /_\ \  \\ \  \     \ \  \\ \  \|\ /_\ \  \\ \  \     \ \  \
        ## hh   //      \\   hh ##    \ \   __  \\ \  \\ \  \     \ \  \\ \   __  \\ \  \\ \  \     \ \  \
        ## hh                hh ##     \ \  \|\  \\ \  \\ \  \____ \ \  \\ \  \|\  \\ \  \\ \  \____ \ \  \
        ## hh      wwww      hh ##      \ \_______\\ \__\\ \_______\\ \__\\ \_______\\ \__\\ \_______\\ \__\
        ## hh                hh ##       \|_______| \|__| \|_______| \|__| \|_______| \|__| \|_______| \|__|
        ## MMMMMMMMMMMMMMMMMMMM ##
        ##MMMMMMMMMMMMMMMMMMMMMM##                  曾经沧海难为水，除却巫山不是云。
             \/            \/


从零开始的Bilibili扩展，仿2019年12月9日改版前的页面。

### 使用
扩展正在紧张开发中，可参考[开发](#开发)步骤尝鲜。

### 功能
- [ ] 仿2019年12月9日改版前的页面。
  - [x] av
    - [ ] 视频合集
  - [ ] bangumi
  - [ ] 稍后再看
  - [ ] 空间
  - [ ] 搜索
- [ ] 播放器组件
  - [ ] 流类型
    - [x] mp4
    - [x] DASH
    - [ ] flv
  - [ ] 弹幕
    - [ ] 弹幕类型
      - [x] mode1 普通弹幕
      - [x] mode4 底端弹幕
      - [x] mode5 顶端弹幕
      - [x] mode6 逆向弹幕
      - [x] mode7 高级弹幕
      - [ ] mode8 代码弹幕
      - [ ] mode9 BAS弹幕
    - [x] 实时弹幕
    - [ ] 弹幕发送
    - [ ] 弹幕列表（等待扩展消息传递的结构化克隆支持）
    - [ ] 弹幕交互
    - [ ] 弹幕发送者查询
  - [ ] 画中画模式
  - [x] hook 全局播放器组件
  - [ ] DRM
  - [ ] 高能进度条
  - [ ] 分段进度条
  - [ ] 解除播放区域限制
  - [x] 无痕模式
  - [ ] `t`参数跳转
  - [ ] CC 字幕
  - [ ] 互动视频
  - [ ] 下载视频及弹幕
- [ ] 评论组件
    - [x] 评论翻页（页码总数B站不再提供，仅供参考）
    - [x] 评论楼层（只显示漏网之鱼）
    - [x] 评论归属地
    - [x] 评论发送/删除/屏蔽等操作
    - [ ] 用户浮窗
    - [x] 对话查看
    - [x] hook 全局弹幕组件
- [x] 屏蔽跟踪
- [x] 屏蔽直播页面后台检测

### 开发
1. 专为 chrome 最新版本打造，不会兼容旧版本，更无暇顾及其他浏览器。——当前最低版本要求：150
   - 低版本浏览器或许可以在`chrome://flags/`页面启用`Experimental Web Platform features`尝试
2. 项目还在原型阶段，随时可能推到重来，所以暂时不接受任何 issue 和 PR
3. 开发流程
```
# 安装 git
winget install -i git.git

# 克隆项目到本地磁盘
git clone https://github.com/MotooriKashin/Bilibili-Old.git

# 安装 node.js
winget install openjs.nodejs --installer-type portable

# 更新 npm 依赖
npm update

# 编译：将在项目跟目录的 dist 文件夹输出未编译的扩展
# 浏览器【扩展程序】里打开【开发者模式】，【加载未打包的扩展程序】即可。
# 注意每次编译后浏览器【扩展程序】里都需要点击【重新加载】
npm run build

```
### 开源
本项目使用 MIT 许可证开发所有源代码，以下是项目参考：
- 旧版页面存档：[Wayback Machine](https://archive.org/web/)
- BV号算法原型：[如何看待 2020 年 3 月 23 日哔哩哔哩将稿件的「av 号」变更为「BV 号」？ - mcfx的回答 - 知乎](https://www.zhihu.com/question/381784377/answer/1099438784)
- BV号算法参考：[bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/bvid_desc.md)
- 第三方数据存档：https://www.biliplus.com/ 、 https://www.jijidown.com/