interface modules {
    /** 自动化处理，包括自动宽屏、自动关弹幕等操作 */
    readonly "automate.js": string;
}
namespace API {
    /** 滚动到播放器 */
    function bofqiToView() {
        let str = [".bangumi_player", "#bofqi", "#bilibiliPlayer"];
        let node = str.reduce((s, d) => {
            s = s || document.querySelector(d);
            return s;
        }, document.querySelector("#__bofqi"));
        node && node.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // 播放器自动化操作
    switchVideo(() => {
        config.danmakuFirst && (<HTMLElement>document.querySelectorAll(".bilibili-player-filter-btn")[1]).click(); // 展示弹幕列表
        setTimeout(() => {
            config.showBofqi && bofqiToView(); // 滚动到播放器
        }, 500)
        config.screenWide && runWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff"), () => (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen")).click()); // 自动宽屏
        config.webFullScreen && runWhile(() => document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-web-fullscreen.icon-24webfull.player-tooltips-trigger"), () => (<HTMLElement>document.querySelector(".bilibili-player-video-web-fullscreen")).click()); // 自动网页全屏
        config.noDanmaku && runWhile(() => document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku"), () => {
            !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off") && (<HTMLElement>document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")).click(); // 自动关闭弹幕
        });
        config.autoPlay && setTimeout(() => { (<any>window).player && (<any>window).player.play && (<any>window).player.play() }, 1000); // 自动播放
    })
    // 播放本地媒体按钮
    path.name && observerAddedNodes(e => {
        if (e.className && /bilibili-player-danmaku-setting-lite-panel/.test(e.className)) {
            runWhile(() => document.querySelector(".bilibili-player-setting-dmask-wrap"), () => {
                const node = (<any>document).querySelector(".bilibili-player-setting-dmask-wrap").parentElement;
                const lebel = addElement("label", { class: "bpui-checkbox-text", style: "cursor: pointer;display: inline-table;" }, node, "本地文件");
                const input = addElement("input", { type: "file", accept: ".mp4,.xml,.json", multiple: "multiple", style: "width: 0;" }, lebel);
                input.onchange = () => {
                    (!window.player?.setDanmaku) && toast.warning("内部组件丢失，无法载入弹幕文件！");
                    input.files && new LocalMedia(input.files);
                }
            })
        }
    })
    // 修复顶栏分区数据
    runWhile(() => document.querySelector(".bili-header-m"), () => {
        try {
            let node = <HTMLCollectionOf<HTMLDivElement>>(<HTMLDivElement>document.querySelector(".bili-header-m")).getElementsByClassName('nav-name');
            if (node[0]) {
                for (let i = 0; i < node.length; i++) {
                    if (node[i].textContent == "科技") {
                        node[i].textContent = "知识";
                        (<any>node[i].parentNode).href = "//www.bilibili.com/v/knowledge/";
                        (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/knowledge/science/"><span>科学科普</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/social_science/"><span>社科·法律·心理</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/humanity_history/"><span>人文历史</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/business/"><span>财经商业</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/campus/"><span>校园学习</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/career/"><span>职业职场</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/design/"><span>设计·创意</span></a></li>
                        <li><a href="//www.bilibili.com/v/knowledge/skill/"><span>野生技能协会</span></a></li>`
                    }
                    if (node[i].textContent == "数码") {
                        node[i].textContent = "科技";
                        (<any>node[i].parentNode).href = "//www.bilibili.com/v/tech/";
                        (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/tech/digital/"><span>数码</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/application/"><span>软件应用</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/computer_tech/"><span>计算机技术</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/industry/"><span>工业·工程·机械</span></a></li>
                        <li><a href="//www.bilibili.com/v/tech/diy/"><span>极客DIY</span></a></li>`
                    }
                    if (node[i].textContent == "时尚") {
                        (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/fashion/makeup/"><span>美妆护肤</span></a></li>
                        <li><a href="//www.bilibili.com/v/fashion/clothing/"><span>穿搭</span></a></li>
                        <li><a href="//www.bilibili.com/v/fashion/trend/"><span>时尚潮流</span></a></li>`;
                    }
                    if (node[i].textContent == "广告") {
                        node[i].textContent = "资讯";
                        (<any>node[i].parentNode).href = "//www.bilibili.com/v/information/";
                        (<any>node[i].parentNode).parentNode.children[1].innerHTML = `<li><a href="//www.bilibili.com/v/information/hotspot/"><span>热点</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/global/"><span>环球</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/social/"><span>社会</span></a></li>
                        <li><a href="//www.bilibili.com/v/information/multiple/"><span>综合</span></a></li>`
                    }
                    if (node[i].textContent == "生活") {
                        (<any>node[i].parentNode).parentNode.children[1].children[2].remove(); // 移除美食圈
                        (<any>node[i].parentNode).parentNode.children[1].children[2].remove(); // 移除美食圈
                        (<any>node[i].parentNode).parentNode.children[1].children[5].remove(); // 移除其他
                        (<HTMLAnchorElement>(<any>node[i].parentNode).parentNode.children[1].children[4].children[0]).href = "//www.bilibili.com/v/sports"; // 修复运动区链接
                    }
                    if (node[i].textContent == "娱乐") (<any>node[i].parentNode).parentNode.children[1].lastChild.remove();
                }
            }
        } catch (e) { debug.error("automate.js", e) }
    })
    config.heartbeat && xhrhook(['api.bilibili.com/x/report/web/heartbeat'], function (args) {
        args[1] = args[1].replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
    }, undefined, false);
    config.unloginPopover && !uid && runWhile(() => document.querySelector(".lt-row"), () => document.querySelector<any>(".lt-row").remove()); // 移除登录提示弹窗
    config.unloginPopover && !uid && runWhile(() => document.querySelector(".unlogin-popover"), () => document.querySelector<any>(".unlogin-popover").remove()); // 移除登录提示弹窗
}