/**
 * @module reset
 * @description 进行重写页面以外的处理
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const debug = BLOD.debug; /** @see debug */
    const config = BLOD.config; /** @see main */
    const xhr = BLOD.xhr; /** @see xhr */
    const toast = BLOD.toast; /** @see debug */

    BLOD.reset = {
        /**
         * 替换原生脚本，不直接修改页面框架
         * @param {string} str 页面框架
         */
        oldScript: (str) => {
            let comment = config.reset.oldreply ? "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@c74067196af49a16cb6e520661df7d4d1e7f04e5/src/comment.min.js" : "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/comment.min.js";
            str = str.replace("//static.hdslb.com/js/video.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/video.min.js");
            // CDN未更新前，两种conment.js都匹配一次
            str = str.replace("//static.hdslb.com/phoenix/dist/js/comment.min.js", comment);
            str = str.replace("//s1.hdslb.com/bfs/seed/jinkela/commentpc/comment.min.js", comment);
            str = str.replace("//s1.hdslb.com/bfs/static/jinkela/rank/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/rank.ba58f8684a87651e0e1c576df8f918bfa10c1a90.js");
            return str;
        },
        /**
         * 移除付费预览框
         * @param {HTMLElement} node 预览框节点
         */
        removePreview: async (node) => {
            try {
                if (!config.reset.preview) return;
                let hint = document.getElementsByClassName("video-float-hint-text")[0];
                // 倒计时长度，单位：秒
                let i = 10;
                let sec = document.createElement("span");
                sec.setAttribute("class", "video-float-hint-btn second-cut");
                hint.parentNode.appendChild(sec);
                function cut() {
                    sec.innerText = i - 1 + "s";
                    if (i == 0) {
                        node.remove();
                        toast("移除付费预览提示框");
                        return;
                    }
                    i = i - 1;
                    window.setTimeout(cut, 1000);
                }
                new cut();
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("付费预览", ...e); }
        },
        /**
         * 替换顶栏底栏
         */
        resetSction: async () => {
            if (!config.reset.grobalboard) return;
            if (BLOD.path.name) return;
            if (BLOD.head && BLOD.foot) return;
            let emap = [
                { type: "text/javascript", src: "//static.hdslb.com/js/jquery.min.js" },
                { class: "z-top-container has-menu" },
                { type: "text/javascript", src: "//s1.hdslb.com/bfs/seed/jinkela/header/header.js" },
                { class: "footer bili-footer report-wrap-module", id: "home_footer" },
                { type: "text/javascript", src: "//static.hdslb.com/common/js/footer.js" }
            ]
            let newHead = document.querySelector("#internationalHeader");
            let newFoot = document.querySelector(".international-footer");
            if (!BLOD.head && newHead) {
                BLOD.head = true;
                if (!window.$) BLOD.addElement("script", emap[0], undefined, true);
                newHead.setAttribute("style", "visibility:hidden;");
                if (document.querySelector(".mini-type") && !location.href.includes("blackboard/topic_list") && !location.href.includes("blackboard/x/act_list")) {
                    emap[1].class = "z-top-container";
                }
                if (BLOD.path.mhead) emap[1].class = "z-top-container";
                BLOD.addElement("div", emap[1], undefined, true);
                BLOD.addElement("script", emap[2], undefined, true);
            }
            if (!BLOD.foot && newFoot) {
                BLOD.foot = true;
                BLOD.addElement("div", emap[3], undefined, false, newFoot);
                BLOD.addElement("script", emap[4])
            }
        },
        /**
         * 切p监听
         */
        switchVideo: async () => {
            if (config.reset.localDanmaku) setTimeout(() => { new LocalDanmaku() }, 1000)
            if (BLOD.avPlus) {
                debug.msg(300, "视频已失效！", "加载弹幕", "缓存信息仅供参考", true, () => {
                    new OnlineDanmaku("aid=" + BLOD.aid + "&cid=" + BLOD.cid);
                })
            }
            if (config.reset.novideo) {
                debug.msg(300, "拦截视频页媒体载入用于呼出下载面板", "取消拦截", null, true, () => {
                    config.reset.novideo = 0;
                    BLOD.setValue("config", config);
                    window.BilibiliPlayer({ aid: BLOD.aid, cid: BLOD.cid });
                })
            }
            if (config.reset.download) { BLOD.xml = ""; BLOD.mdf = ""; };
            if (config.reset.selectdanmu && document.getElementsByClassName("bilibili-player-filter-btn")[1]) document.getElementsByClassName("bilibili-player-filter-btn")[1].click();
            setTimeout(() => {
                if (config.reset.viewbofqi) BLOD.bofqiToView();
                if (config.reset.widescreen && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff")) {
                    document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();
                }
                if (config.reset.danmakuoff && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                    if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                        document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click();
                    }
                }
            });
            if (config.reset.autoplay) setTimeout(() => { window.player && window.player.play && window.player.play() }, 1000)
        },
        /**
         * 修复主页分区
         * @param {HTMLElement} node 分区节点
         * @param {HTMLElement} [move] 添加的节点，相当于变量声明
         */
        fixnews: async (node, move) => {
            try {
                let rank = config.reset.grobalboard ? document.getElementsByClassName("rank-tab")[0] : "";
                if (node.id == "bili_ad") {
                    let sight = node.getElementsByTagName("a");
                    node = node.getElementsByClassName("name");
                    if (node[0]) node[0].text = "资讯";
                    for (let i = 0; i < sight.length; i++) if (sight[i].href.includes("www.bilibili.com/v/ad/ad/")) sight[i].href = "https://www.bilibili.com/v/information/";
                    let rcon = document.createElement("div");
                    rcon.setAttribute("class", "r-con");
                    rcon.innerHTML = '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>';
                    document.getElementById("ranking_ad").replaceWith(rcon);
                }
                if (node.className == "report-wrap-module elevator-module") for (let item of node.children[1].children) if (item.innerHTML == "广告") item.innerHTML = "资讯";
                if (node.id == "bili-header-m") {
                    node = node.getElementsByClassName('nav-name');
                    if (node[0]) {
                        for (let i = 0; i < node.length; i++) {
                            if (node[i].textContent == "科技") {
                                move = node[i].parentNode.parentNode.children[1].lastChild.cloneNode(true);
                                move.firstChild.href = move.firstChild.href.replace("technology", "life");
                                node[i].parentNode.parentNode.children[1].lastChild.remove();
                            }
                            if (node[i].textContent == "广告") {
                                node[i].textContent = "资讯";
                                node[i].parentNode.href = "//www.bilibili.com/v/information/";
                            }
                            if (node[i].textContent == "生活") {
                                let sight = node[i].parentNode.parentNode.children[1];
                                sight.insertBefore(move, sight.lastChild)
                            }
                            if (node[i].textContent == "娱乐") node[i].parentNode.parentNode.children[1].lastChild.remove();
                        }
                    }
                }
                if (rank && rank.children[5]) {
                    rank.children[5].innerText == "知识" ? rank.children[5].innerText = "科技" : "";
                    rank.children[6].innerText == "知识" ? rank.children[6].innerText = "科技" : "";
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("主页分区", ...e); }
        },
        /**
         * 修复评论跳转链接
         */
        fixVideoSeek: () => {
            window.commentAgent = {
                seek: (t) => window.player && window.player.seek(t)
            }
        },
        /**
         * 还原评论跳转链接为av号
         */
        renameCommentJump: () => {
            if (config.reset.commentjump) return;
            document.querySelectorAll(".comment-jump-url").forEach((d, i, e) => {
                if (d.href && !d.href.includes(d.innerText)) {
                    d = d.href.split("/");
                    d = d[d.length - 1] || d[d.length - 2];
                    if (config.reset.bvid2av && d.toLowerCase().startsWith('bv')) d = BLOD.abv(d);
                    e[i].title = e[i].innerHTML;
                    e[i].innerHTML = d;
                }
            })
        },
        /**
         * 修复主页排行：电视剧、电影、纪录片
         * @param {HTMLElement} node 分区节点
         */
        fixrank: async (node) => {
            // 这些分区排行榜已全部采用类似番剧排行的模式，故采用相似的节点覆盖
            let sort = {
                bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
                bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
                bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
            }
            sort = sort[node.id];
            if (!sort) return;
            let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
            section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
            try {
                let data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: 3 }));
                data = BLOD.jsonCheck(data).data;
                node = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
                for (let i = 0; i < 8; i++) {
                    let li = document.createElement("li"),
                        cl = i < 3 ? "rank-item highlight" : "rank-item",
                        fw;
                    li.setAttribute("class", cl);
                    li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                    li.onmouseover = () => {
                        fw = document.createElement("div");
                        fw.setAttribute("class", "bangumi-info-module");
                        fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (BLOD.getTotalTop(li) - 150) + 'px;');
                        fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + BLOD.unitFormat(data.list[i].stat.follow) + '</span></div>';
                        document.body.appendChild(fw);
                    }
                    li.onmouseout = () => fw.remove();
                    node.appendChild(li);
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("分区排行", ...e); }
        },
        /**
         * 移除HTML节点
         */
        resetNodes: async () => {
            BLOD.reset.parameterTrim(true);
            let remove = (node, type, hidden, index, callback) => {
                index ? index : index = 0;
                switch (type) {
                    case "id": node = document.querySelector("#" + node); break;
                    case "class": node = node.replace(/ /g, "."); node = document.querySelectorAll("." + node)[index]; break;
                    case "tag": node = document.querySelectorAll(node)[index]; break;
                }
                if (!node || node.getAttribute("hidden")) return;
                // 一般能移除的就移除，否则隐藏
                debug.debug("移除节点", node);
                hidden ? node.setAttribute("hidden", "hidden") : node.remove();
                callback && callback();
            }
            // 移除天选时刻
            if (config.reset.noanchor) remove("anchor-guest-box-id", "id", null, null, () => toast.warning("拦截天选时刻！"));
            // 移除大乱斗
            if (config.reset.nopkvm) remove("chaos-pk-vm", "id", null, null, () => toast.warning("拦截大乱斗！"));
            // 隐藏联系客服
            remove("contact-help", "class", true);
            // 隐藏历史记录搜索功能
            if (config.reset.searchHistory) remove("b-head-search", "class");
            // 移除新版提示
            remove("new-entry", "class");
            if (BLOD.path.name == "index") remove("ver", "class");
            remove("trynew-btn", "class");
            if (config.reset.panel) remove("bilibili-player-ending-panel", "class");
            // 移除app下载浮动框
            remove("fixed_app_download", "id");
            remove("app-download", "class");
            // 移除登录弹窗
            if (config.reset.grobalboard && BLOD.load) {
                if (document.querySelector(".unlogin-popover")) document.querySelector(".unlogin-popover").parentNode.remove()
                remove("lt-row", "class");
            }
            // 移除直播水印
            remove("web-player-icon-roomStatus", "class");
            // 移除失效顶栏
            remove("bili-header-m report-wrap-module", "class", false, 1);
            // 移除主页昨日榜
            if (BLOD.path.name == "index") remove("rec-btn prev", "class");
            // 移除主页七日榜
            if (BLOD.path.name == "index") remove("rec-btn next", "class");
            // 移除双重视频下载右键菜单
            if (document.getElementsByClassName("bili-old-download")[1]) document.getElementsByClassName("bili-old-download")[0].remove();
            // 使顶栏透明
            if (config.reset.headblur) {
                let blur = document.getElementsByClassName("blur-bg");
                if (blur[0]) blur[0].removeAttribute("style");
            }
            // 移除新版顶栏
            if (document.querySelector("#bili-header-m") && document.querySelector("#internationalHeader")) document.querySelector("#internationalHeader").remove();
        },
        /**
         * 识别BV号转化为超链接
         */
        avdesc: async () => {
            let desc = document.getElementsByClassName("info");
            if (desc[1] && desc[1].parentNode && desc[1].parentNode.id == "v_desc") {
                if (desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
                    let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
                    for (let i = 0; i < paster.length; i++) {
                        let newer = "av" + BLOD.abv(paster[i]);
                        newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                        desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
                    }
                }
            }
        },
        /**
         * 添加点赞功能
         * @param {*} [data] 相当于声明变量
         */
        setLike: async (data) => {
            if (!config.reset.like) return;
            let timer = window.setInterval(async () => {
                let coin = document.getElementsByClassName("bilibili-player-video-subtitle")[0];
                let number = document.getElementsByClassName("number")[0];
                let node = document.getElementsByClassName("coin")[0];
                // 判断页面渲染进度
                if (coin && node) {
                    window.clearInterval(timer);
                    let span = document.createElement("span");
                    let move = document.createElement("i");
                    let moved = document.createElement("b");
                    let text = document.createTextNode("点赞 --");
                    let arg = text;
                    // 创建点赞数据相关节点并初始化
                    span.setAttribute("class", "u like");
                    span.setAttribute("style", "margin-right : 5px;");
                    span.appendChild(move);
                    span.appendChild(moved);
                    span.appendChild(text);
                    move.setAttribute("class", "l-icon-move");
                    move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                    moved.setAttribute("class", "l-icon-moved");
                    moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                    try {
                        move.onclick = async () => {
                            // 没有点赞过绑定点赞点击事件
                            if (!BLOD.uid) return document.getElementsByClassName("c-icon-move")[0].click();
                            // 构造并请求点赞表单
                            let msg = "aid=" + BLOD.aid + "&like=1&csrf=" + BLOD.getCookies().bili_jct;
                            data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", msg);
                            data = BLOD.jsonCheck(data).ttl;
                            // 点亮点赞图标并修改显示数据
                            toast.success("点赞成功！");
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                            text = document.createTextNode(" 点赞 " + number);
                            arg.replaceWith(text);
                            arg = text;
                        }
                        moved.onclick = async () => {
                            // 点赞过绑定取消点赞点击事件
                            // 构造并请求取消点赞表单
                            let msg = "aid=" + BLOD.aid + "&like=2&csrf=" + BLOD.getCookies().bili_jct;
                            data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", msg);
                            data = BLOD.jsonCheck(data).ttl;
                            // 熄灭点赞图标并修改显示数据
                            toast.warning("取消点赞！");
                            document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                            document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                            if (arg.nodeValue.match("万")) return;
                            let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                            text = document.createTextNode(" 点赞 " + number)
                            arg.replaceWith(text);
                            arg = text;
                        }
                        number.insertBefore(span, node);
                        // 获取点赞数据
                        data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": BLOD.aid }));
                        data = BLOD.jsonCheck(data).data.stat.like;
                        document.getElementsByClassName("like")[0].setAttribute("title", "点赞人数" + data);
                        text = document.createTextNode(" 点赞 " + BLOD.unitFormat(data));
                        arg.replaceWith(text);
                        arg = text;
                        if (!BLOD.uid) return;
                        data = BLOD.jsonCheck(await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/archive/has/like", { "aid": BLOD.aid }))).data;
                        if (data == 1) {
                            // 点赞过点亮图标
                            move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                            moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                        }
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("点赞功能", ...e); }
                }
            }, 100);
        },
        /**
         * 获取账号注册时间
         */
        setJoinTime: async () => {
            if (!BLOD.mid && !config.reset.jointime) return;
            let data = await xhr.GM(BLOD.objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": BLOD.mid }));
            try {
                data = BLOD.jsonCheck(data);
                // 格式化时间戳，不是13位，主动补位
                let jointime = BLOD.timeFormat(data.card.regtime * 1000, 1);
                if (BLOD.big) toast(data.card.name + " mid：" + BLOD.mid, "注册时间：" + jointime, "生日：" + data.card.birthday);
                debug.log("注册时间", data.card.name, jointime);
                document.addEventListener("DOMNodeInserted", (msg) => {
                    let birthday = document.getElementsByClassName("birthday");
                    if (birthday[0]) {
                        if (document.getElementsByClassName("jointime")[0]) return;
                        else {
                            let div = document.createElement("div");
                            let icon = document.createElement("span");
                            let text = document.createElement("span");
                            let style = document.createElement("style");
                            div.setAttribute("class", "item jointime");
                            birthday[0].parentNode.appendChild(div);
                            icon.setAttribute("class", "icon");
                            div.appendChild(icon);
                            text.setAttribute("class", "text");
                            text.innerText = jointime;
                            div.appendChild(text);
                            style.setAttribute("type", "text/css");
                            document.head.appendChild(style);
                            style.appendChild(document.createTextNode(".user .info .meta .row {height : 88px;white-space : normal;}.user .info .jointime .icon {background-position : -209px -84px;}.user .info .jointime .text {color : #00a1d6;}}"));
                        }
                    }
                });
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("注册时间", ...e); }
        },
        /**
         * 授权接触区域限制代理服务器使用B站账号
         */
        accesskey: async () => {
            if (window.self != window.top) return;
            if (!config.reset.accesskey) {//
                if (BLOD.getValue("access_key")) {
                    BLOD.deleteValue("access_key");
                    BLOD.deleteValue("access_date");
                    let page = document.createElement("iframe");
                    page.setAttribute("style", "display: none;");
                    page.setAttribute("src", "https://www.biliplus.com/login?act=logout");
                    document.body.appendChild(page);
                    setTimeout(() => { page.remove() }, 3000);
                    toast.success("已取消会员授权！")
                }
                return;
            }
            if (!BLOD.getValue("access_key") || (Date.now() - BLOD.getValue("access_date") > 2160000)) {
                try {
                    if (!BLOD.uid) return toast.warning("请先登录！");
                    let data = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.urlSign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", "", 3)));
                    data = await new Promise((resolve, reject) => {
                        BLOD.xmlhttpRequest({
                            method: "GET",
                            url: data.data.confirm_uri,
                            onload: (xhr) => resolve(xhr.finalUrl),
                            onerror: (xhr) => reject(xhr.statusText || data.data.confirm_uri + " net::ERR_CONNECTION_TIMED_OUT"),
                        });
                    })
                    data = BLOD.urlObj(data);
                    let page = document.createElement("iframe");
                    page.setAttribute("style", "display: none;");
                    page.setAttribute("src", BLOD.objUrl("https://www.biliplus.com/login", data));
                    document.body.appendChild(page);
                    setTimeout(() => { page.remove() }, 3000);
                    BLOD.setValue("access_key", data.access_key);
                    BLOD.setValue("access_date", Date.now());
                    toast.success("授权登录成功！", "有效期30天", "届时可能需要重新授权")
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("会员授权", ...e); }
            }
        }
    }

    // 修复失效视频
    BLOD.reset.fixVideoLost = {
        /**
         * 处理收藏中的失效视频
         * @param {Event} msg 节点事件，包含失效视频节点
         * @param {*} [data] 相当于声明变量
         */
        favlist: async (msg, data) => {
            // src判定是否为频道并取消重复处理
            if (!config.reset.lostvideo || BLOD.src) return;
            // 获取av号或者将bv转为av
            let title, cover, aid = msg.target.getAttribute("data-aid");
            if (!(1 * aid)) aid = BLOD.abv(aid);
            if (BLOD.ids.indexOf(aid) != -1) return;
            // 记录已经处理过的视频aid
            BLOD.ids.push(aid);
            try {
                // 尝试读取来自jijidown的数据
                data = await xhr.GM("https://www.jijidown.com/video/av" + aid);
                data.match('window._INIT')[0];
                title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                cover = data.match(/\"img\":\ \".+?\",/)[0].match(/http.+?\",/)[0].replace(/",/, "");
                // 判断封面是否有效
                cover.match('hdslb')[0];
            } catch (e) {
                try {
                    // 尝试读取来自biliplus数据
                    data = await xhr.GM("https://www.biliplus.com/video/av" + aid);
                    data.match(/\<title\>.+?\ \-\ AV/)[0];
                    title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                    cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                } catch (e) {
                    // 无有效数据只能把标题改为av号
                    title = "av" + aid;
                }
            }
            debug.log("失效视频", "av" + aid);
            if (cover) msg.target.children[0].children[0].setAttribute("src", cover + "@380w_240h_100Q_1c.webp");
            msg.target.children[0].children[0].setAttribute("alt", title);
            msg.target.children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
            msg.target.children[1].setAttribute("title", title);
            msg.target.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
            msg.target.children[1].text = title;
            msg.target.setAttribute("class", "small-item");
            msg.target.children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
            msg.target.children[0].setAttribute("target", "_blank");
            msg.target.children[0].setAttribute("class", "cover cover-normal");
        },
        /**
         * 处理频道中的失效视频
         * @param {string} link 频道列表url
         */
        channel: async (link) => {
            if (!config.reset.lostvideo || BLOD.src == window.src) return;
            window.src = BLOD.src;
            try {
                let data, obj = BLOD.urlObj(link),
                    cid = obj.cid,
                    mid = obj.mid,
                    pn = obj.pn;
                let small_item = document.getElementsByClassName("small-item");
                if (small_item[0]) for (let i = 0; i < small_item.length; i++) if (small_item[i].getElementsByClassName("title")[0].title == "已失效视频") break;
                data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/space/channel/video", { "mid": mid, "cid": cid, "pn": pn, "ps": 30, "order": 0 }));
                data = BLOD.jsonCheck(data).data;
                for (let i = 0; i < small_item.length; i++) {
                    let aid = small_item[i].getAttribute("data-aid") * 1;
                    let title = data.list.archives[i].title || "av" + aid;
                    if (small_item[i].children[1].title == "已失效视频") {
                        small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                        if (aid) {
                            // 修复失效视频av号
                            debug.log("失效视频", "av" + aid);
                            small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                            small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                        }
                        else {
                            // 修复失效视频bv号
                            aid = small_item[i].getAttribute("data-aid");
                            debug.log("失效视频", aid);
                            small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/" + aid);
                            small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/" + aid);
                        }
                        small_item[i].children[0].setAttribute("target", "_blank");
                        small_item[i].children[0].setAttribute("class", "cover cover-normal");
                        small_item[i].children[0].children[0].setAttribute("alt", title);
                        small_item[i].children[0].children[0].setAttribute("src", data.list.archives[i].pic.replace("http", "https") + "@380w_240h_100Q_1c.webp");
                        small_item[i].children[1].setAttribute("target", "_blank");
                        small_item[i].children[1].setAttribute("title", title);
                        small_item[i].children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                        small_item[i].children[1].text = title;
                    }
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("失效视频", ...e); }
        },
        /**
         * 处理个人空间主页的失效视频并固定所有失效视频防止被页面改回去
         * @param {Event} msg 节点事件，包含被改回去的失效视频节点
         */
        home: async (msg) => {
            if (!config.reset.lostvideo) return;
            let channel_item = document.getElementsByClassName("channel-item");
            if (channel_item[0]) {
                let small_item = document.getElementsByClassName("small-item");
                if (small_item[0]) {
                    for (let i = 0; i < small_item.length; i++) {
                        if (small_item[i].getAttribute("class") == "small-item disabled") {
                            small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                            let aid = small_item[i].getAttribute("data-aid") * 1;
                            if (aid) {
                                // 修改失效视频av链接
                                debug.log("失效视频", "av" + aid);
                                small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                                small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                            }
                            else {
                                // 修改失效视频bv链接
                                aid = small_item[i].getAttribute("data-aid");
                                debug.log("失效视频", aid);
                                small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/" + aid);
                                small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/" + aid);
                            }
                            small_item[i].children[0].setAttribute("target", "_blank");
                            small_item[i].children[0].setAttribute("class", "cover cover-normal");
                            small_item[i].children[1].setAttribute("target", "_blank");
                            small_item[i].children[1].setAttribute("title", small_item[i].children[0].children[0].alt);
                            small_item[i].children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                            small_item[i].children[1].text = small_item[i].children[0].children[0].alt;
                        }
                    }
                }
            }
            // 固定失效视频数据防止被页面改回去
            if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
            if (msg.target.className == "small-item disabled") msg.target.className = "small-item";
        }
    }

    // 番剧分集数据
    BLOD.reset.setBangumi = {
        /**
         * 初始化数据
         * @param {*} data 番剧数据字符串
         */
        init: async (data) => {
            if (!config.reset.episodedata) return;
            // 判断是否有分集数据
            if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                BLOD.aid = data.epInfo.aid;
                let timer = window.setInterval(() => {
                    if (document.getElementsByClassName("info-sec-av")[0]) {
                        BLOD.reset.setBangumi.episodeData("first");
                        window.clearInterval(timer);
                    }
                }, 1000);
                // 延时取消操作，10s还未载入完成将不再处理
                window.setTimeout(() => window.clearInterval(timer), 10000);
            }
        },
        /**
         * 处理分集数据
         * @param {*} data 用于切p判断处理过与否
         * @param {Event} msg 节点事件，包含当前分p的aid
         */
        episodeData: async (data, msg) => {
            try {
                let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
                let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
                if (data == "first") {
                    // 判断是否是首次处理
                    if (views.innerText == "-" && danmakus.innerText == "-") return window.setTimeout(() => { BLOD.reset.setBangumi.episodeData("first") }, 100);
                    // 备份总播放数和弹幕数
                    views.setAttribute("title", "总播放数 " + views.innerText);
                    danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                    debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                    data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": BLOD.aid }));
                }
                if (!data) {
                    BLOD.aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                    data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": BLOD.aid }));
                }
                data = BLOD.jsonCheck(data).data;
                let view = data.view;
                let danmaku = data.danmaku;
                view = BLOD.unitFormat(view);
                danmaku = BLOD.unitFormat(danmaku);
                views.innerText = view;
                danmakus.innerText = danmaku;
                debug.debug("播放", view + " 弹幕", danmaku);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分集数据", ...e) }
        }
    }

    // 修复番剧推荐
    BLOD.reset.pgcRecommend = async () => {
        try {
            window.__INITIAL_STATE__.pgcRecommend = window.__INITIAL_STATE__.pgcRecommend || BLOD.jsonCheck(await xhr(BLOD.objUrl("https://api.bilibili.com/pgc/web/recommend/related/recommend", { season_id: window.__INITIAL_STATE__.ssId }))).result;
            let node = document.querySelector(".mCSB_container");
            if (!node) return setTimeout(() => BLOD.reset.pgcRecommend());
            let element = '';
            window.__INITIAL_STATE__.pgcRecommend.forEach(d => {
                let temp = `<a class="bilibili-player-recommend-video" href="${d.url}" target="_blank">
                    <div class="bilibili-player-recommend-left">
                    <img src="${d.new_ep.cover || d.cover}@160w_100h.webp" alt="${d.title}" class="mCS_img_loaded" />
                    <span class="player-tooltips-trigger"><i class="bilibili-player-iconfont icon-22wait-normal"></i></span>
                    </div>
                    <div class="bilibili-player-recommend-right">
                    <div class="bilibili-player-recommend-title" title="${d.title}">${d.title}</div>
                    <div class="bilibili-player-recommend-click"><i class="bilibili-player-iconfont icon-12iconplayed"></i>${BLOD.unitFormat(d.stat.view)}</div>
                    <div class="bilibili-player-recommend-danmaku"><i class="bilibili-player-iconfont icon-12icondanmu"></i>${BLOD.unitFormat(d.stat.danmaku)}</div>
                    </div></a>`;
                element = element + temp;
            });
            node.innerHTML = element;
        } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧推荐", ...e); }
        try {
            if (!window.__INITIAL_STATE__.avRecommend) {
                let data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/tag/info", { tag_name: encodeURI(window.__INITIAL_STATE__.mediaInfo.title) }));
                data = BLOD.jsonCheck(data);
                data = await xhr(BLOD.objUrl("https://api.bilibili.com/x/web-interface/tag/top", { tid: data.data.tag_id }));
                window.__INITIAL_STATE__.avRecommend = BLOD.jsonCheck(data).data;
            }
            let element = "";
            window.__INITIAL_STATE__.avRecommend.forEach(d => {
                let temp = `<li class="recom-item">
                    <a href="https://www.bilibili.com/video/av${d.aid}" target="_blank" title="${d.title}">
                    <div class="recom-img"><div class="common-lazy-img">
                    <img alt="${d.title}" src="${d.pic.replace("http:", "")}@224w_140h.webp" lazy="loaded">
                    </div></div>
                    <div class="recom-info">
                    <div class="info-title">${d.title}</div>
                    <div class="info-count">
                    <div class="play-count"><i></i><span>${BLOD.unitFormat(d.stat.view)}</span></div>
                    <div class="danmu-count"><i></i><span>${BLOD.unitFormat(d.stat.danmaku)}</span></div>
                    </div></div></a></li>`;
                element = element + temp;
            });
            document.querySelector(".recom-list.clearfix").innerHTML = element;
        } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("番剧推荐", ...e); }
    }

    // 修复评论楼层
    BLOD.reset.setReplyFloor = {
        /**
         * 初始化评论楼层数据
         * @param {{}} data 评论数据json
         */
        init(data) {
            if (!config.reset.replyfloor) return;
            let floor = {}, key = ["top", "hots", "replies", "root"];
            data = data.data;
            if (!data) return;
            if (data.upper && data.upper.top) {
                if (Array.isArray(data.top)) data.top.push(data.upper.top);
                else data.top = data.upper.top;
            }
            key.forEach((d) => {
                if (data[d]) {
                    d = Array.isArray(data[d]) ? data[d] : [data[d]]
                    d.forEach((d) => {
                        floor[d.rpid] = d.floor;
                        if (d.replies) {
                            d.replies.forEach((d) => {
                                floor[d.rpid] = d.floor;
                            })
                        }
                    })
                }
            })
            BLOD.floor = floor;
        },
        /**
         * 处理楼中楼
         */
        fix() {
            if (!config.reset.replyfloor) return;
            let floor = BLOD.floor || {};
            let li = document.querySelectorAll(".reply-item.reply-wrap");
            if (li[0]) {
                li.forEach((d) => {
                    let span = d.querySelector(".floor");
                    let id = d.getAttribute("data-id");
                    if (!span && floor[id]) {
                        span = d.querySelector(".info");
                        span.innerHTML = '<span class="floor-num" style="float: left;color: #aaa;padding-right: 10px;">#' + floor[id] + '</span>' + span.innerHTML;
                    }
                })
            } else {
                li = document.querySelectorAll("li");
                li.forEach((d) => {
                    if (d.id.includes("l_id_")) {
                        let span = d.querySelector(".floor-date");
                        let id = d.id.split('_')[2];
                        if (span.parentNode.children.length === 1 && floor[id]) {
                            span.parentNode.innerHTML = '<span class="floor-num" style="float: left;color: #aaa;padding-right: 10px;">#' + floor[id] + '</span>' + span.outerHTML;
                        }
                    }
                })
            }
        }
    }

    // 构造媒体页
    BLOD.reset.setMediaList = {
        /**
         * 构造媒体页数据
         * @param {*} [data] 判断页面是否已经跳转到av页
         */
        init: async (data) => {
            if (!BLOD.ml) return;
            if (data) {
                try {
                    // 获取首个视频av并跳转
                    toast("尝试前往构造媒体页...", "media_id：" + BLOD.ml);
                    data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/v1/medialist/detail", { "media_id": BLOD.ml, "pn": 1, "ps": 1 }));
                    data = BLOD.jsonCheck(data).data;
                    location.replace("https://www.bilibili.com/video/av" + data.medias[0].id);
                }
                catch (e) {
                    // 跳转失败，清理残余
                    e = Array.isArray(e) ? e : [e];
                    BLOD.setValue("medialist", 0);
                    toast.error(...e);
                }
            }
            else {
                try {
                    toast("重构媒体页信息中...")
                    let avs = [], value = [], promises = [];
                    // 获取收藏列表，这里获取只能获取到aid
                    data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/v1/medialist/resource/ids4Player", { "media_id": BLOD.ml }));
                    data = BLOD.jsonCheck(data).data;
                    for (let i = 0; i < data.medias.length; i++) {
                        BLOD.ids[i] = data.medias[i].id;
                        avs[i] = "av" + data.medias[i].id;
                    }
                    // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
                    while (avs.length) {
                        let i = avs.length > 20 ? 20 : avs.length;
                        value = avs.splice(0, i);
                        promises.push(xhr.true(BLOD.objUrl("https://api.bilibili.com/x/article/cards", { "ids": value.join("%2C") })));
                    }
                    value = [];
                    data = await Promise.all(promises);
                    // 格式化数据并排序
                    for (let i = 0; i < data.length; i++) {
                        data[i] = BLOD.jsonCheck(data[i]);
                        for (let key in data[i].data) avs.push(data[i].data[key]);
                    }
                    for (let i = 0; i < BLOD.ids.length; i++) {
                        for (let j = 0; j < avs.length; j++) {
                            if (avs[j].aid == BLOD.ids[i]) {
                                value.push(avs[j]);
                                break;
                            }
                        }

                    }
                    BLOD.ids = value;
                    let timer = window.setInterval(() => {
                        if (window.BilibiliPlayer) {
                            clearInterval(timer);
                            // 将视频列表重构为稍后再看列表
                            for (let i = 0; i < BLOD.ids.length; i++) {
                                BLOD.ids[i].progress = 0;
                                BLOD.ids[i].add_at = BLOD.ids[i].ctime;
                                BLOD.ids[i].pages = [];
                                BLOD.ids[i].pages[0] = {};
                                BLOD.ids[i].pages[0].cid = BLOD.ids[i].cid;
                                BLOD.ids[i].pages[0].dimension = BLOD.ids[i].dimension;
                                BLOD.ids[i].pages[0].duration = BLOD.ids[i].duration;
                                BLOD.ids[i].pages[0].from = "vupload";
                                BLOD.ids[i].pages[0].page = 1;
                                BLOD.ids[i].pages[0].part = BLOD.ids[i].title;
                                BLOD.ids[i].pages[0].vid = "";
                                BLOD.ids[i].pages[0].weblink = "";
                            }
                            let toview = { "code": 0, "message": "0", "ttl": 1, "data": { "count": BLOD.ids.length, "list": BLOD.ids } };
                            // 保存初始aid，以便判断是否切p
                            BLOD.oid = BLOD.ids[0].aid;
                            debug.debug("收藏列表", toview);
                            // 构造初始化参数并重新初始化播放器
                            BLOD.obj = { "aid": BLOD.ids[0].aid, "cid": BLOD.ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) }; // 重构初始化播放器参数
                            toast.success("重构成功！", "二次刷新播放器...");
                            window.BilibiliPlayer(BLOD.obj);
                            let bpui = document.getElementsByClassName("bpui-button-text");
                            let t = setInterval(() => {
                                // 更新列表名称
                                if (bpui[1]) {
                                    clearInterval(t);
                                    bpui[1].firstChild.innerText = "收藏列表";
                                }
                            }, 100);
                        }
                    }, 100);
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("收藏播放页", ...e); }
            }
        },
        /**
         * 监听媒体页切p
         */
        fixvar: async () => {
            if (!BLOD.aid) BLOD.aid = window.aid || BLOD.aid;
            if (BLOD.oid) {
                if (BLOD.oid != window.aid) {
                    // 收藏播放切p判断
                    BLOD.aid = window.aid || BLOD.aid;
                    BLOD.oid = window.aid;
                    BLOD.reset.setMediaList.restore();
                }
            }
        },
        /**
         * 更新媒体页切p数据
         * @param {{}} data 构造好的媒体页数据
         */
        restore: async (data) => {
            toast("更新页面信息...", "部分非关键信息不会去额外获取");
            history.replaceState(null, null, "https://www.bilibili.com/video/av" + BLOD.aid + location.search + location.hash);
            for (let i = 0; i < BLOD.ids.length; i++) if (BLOD.ids[i].aid == BLOD.aid) data = BLOD.ids[i];
            let video_info = document.getElementById("viewbox_report");
            let up_info = document.getElementById("v_upinfo")
            let arc_toolbar_report = document.getElementById("arc_toolbar_report");
            document.title = data.title;
            video_info.innerHTML = '<h1 title="' + data.title + '"><!----><span>' + data.title + '</span></h1>' +
                '<div class="tm-info tminfo"><span class="crumb"><a href="//www.bilibili.com">主页</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/">动画</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/mad/">MAD·AMV</a></span><time>' + BLOD.timeFormat(data.pubdate * 1000, true) + '</time><a class="btn-appeal">稿件投诉</a></div>' +
                '<div class="number"><span title="总播放数' + data.stat.view + '" class="v play">' + BLOD.unitFormat(data.stat.view) + '</span><span title="总弹幕数' + data.stat.danmaku + '" class="v dm">' + BLOD.unitFormat(data.stat.danmaku) + '</span><span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行' + data.stat.like + '名</span><span class="line"></span><span class="u like" style="margin-right : 5px;" title="点赞人数' + data.stat.his_rank + '"><i class="l-icon-move" style="width : 22px;height : 22px;background-position : -660px -2068px;"></i><b class="l-icon-moved" style="width : 22px;height : 22px;background-position : -725px -2068px;display : none;"></b> 点赞 ' + BLOD.unitFormat(data.stat.like) + '</span><span report-id="coinbtn1" title="投硬币枚数' + data.stat.coin + '" class="u coin"><i class="c-icon-move"></i><b class="c-icon-moved" style="background-position: -2340px -60px; display: none;"></b> 硬币 ' + BLOD.unitFormat(data.stat.coin) + '</span> <span report-id="collect1" title="收藏人数' + data.stat.favorite + '" class="u fav"><i class="f-icon-move" style="background-position: 0px 0px;"></i><b class="f-icon-moved" style="background-position: -1740px -60px; display: none;"></b> 收藏 ' + BLOD.unitFormat(data.stat.favorite) + '</span></div>';
            up_info.innerHTML = '<div class="u-face fl"><!----><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="head" class="a"><img src="' + data.owner.face + '@68w_68h.webp" width="68" height="68" class="up-face" /><!----><!----><i title="企业/团体认证" class="auth o-auth"></i></a></div>' +
                '<div class="info"><div class="user clearfix"><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="name" class="name is-vip">' + data.owner.name + '</a><a href="//message.bilibili.com/#whisper/mid' + data.owner.mid + '" target="_blank" report-id="message" class="message icon">发消息</a></div><div class="sign static"><span>up主简介</span><!----></div><div class="number clearfix"><span title="投稿数--">投稿：--</span><span title="粉丝数--">粉丝：--</span></div><div class="btn followe"><a report-id="follow1" class="bi-btn b-gz"><span class="gz">+ 关注</span><span class="ygz">已关注</span><span class="qxgz">取消关注</span></a><a report-id="charge" class="bi-btn b-cd elecrank-btn"><span class="cd">充电</span><span class="wtcd">为TA充电</span></a></div></div>';
            arc_toolbar_report.children[0].children[0].title = "分享人数" + data.stat.share;
            arc_toolbar_report.children[0].children[0].innerHTML = '<span class="t">分享</span><span class="num">' + BLOD.unitFormat(data.stat.share) + '</span><i class="icon"></i>';
            arc_toolbar_report.children[2].title = "收藏人数" + data.stat.favorite;
            arc_toolbar_report.children[2].innerHTML = '<div class="btn-item"><i class="icon-move f-icon-moved" style="display: none;"></i><b class="icon-move f-icon-move"></b><span class="t">收藏</span><span class="num">' + BLOD.unitFormat(data.stat.favorite) + '</span></div>';
            arc_toolbar_report.children[3].title = "投硬币枚数" + data.stat.coin;
            arc_toolbar_report.children[3].innerHTML = '<div class="btn-item"><i class="icon-move c-icon-moved" style="display: none;"></i><b class="icon-move c-icon-move"></b><span class="t">硬币</span><span class="num">' + BLOD.unitFormat(data.stat.coin) + '</span></div>';
            document.getElementById("v_tag").children[0].setAttribute("hidden", "hidden");
            document.getElementById("v_desc").children[1].innerText = data.desc;
            new window.bbComment(".comment", window.aid, 1, window.UserStatus.userInfo, "");
            data.stat.like ? video_info.children[2].children[2].setAttribute("style", "display: inline-block;") : video_info.children[2].children[2].setAttribute("style", "display: none;");
            let bpui = document.getElementsByClassName("bpui-button-text");
            let t = setInterval(() => {
                // 更新列表名称
                if (bpui[1]) {
                    clearInterval(t);
                    bpui[1].firstChild.innerText = "收藏列表";
                }
            }, 100);
        },
    }
    // 修复分区对照
    BLOD.reset.fixSort = {
        /**
         * 处理av页
         */
        video: async () => {
            let sort = JSON.parse(BLOD.getResourceText("sort"));
            let timer = window.setInterval(() => {
                let tminfo = document.getElementsByClassName("tm-info");
                if (tminfo[0]) {
                    window.clearInterval(timer);
                    if (!(BLOD.tid in sort)) return;
                    let nodes = tminfo[0].childNodes;
                    // 创建分区信息节点并写入tid对应的分区数据
                    nodes[1].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].childNodes[1].remove();
                    nodes[1].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                    nodes[1].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                    nodes[2].childNodes[0].href = sort[BLOD.tid][2];
                    nodes[2].childNodes[0].innerText = sort[BLOD.tid][1];
                }
            }, 1000);
        },
        /**
         * 处理稍后再看
         * @param {*} [data] 相当于变量声明
         */
        watchlater: async (data) => {
            let sort = JSON.parse(BLOD.getResourceText("sort"));
            let timer = window.setInterval(async () => {
                let tminfo = document.getElementsByClassName("tm-info");
                // 判断是否是稍后再看页面
                if (tminfo[0] && BLOD.aid) {
                    window.clearInterval(timer);
                    let child = tminfo[0].childNodes;
                    if (child[2].nodeType === 8) {
                        try {
                            // 通过链接获取tid
                            data = await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": BLOD.aid }));
                            BLOD.tid = BLOD.jsonCheck(data).data.tid;
                            if (!(BLOD.tid in sort)) return;
                            // 创建分区信息节点并写入tid对应的分区数据
                            child[2].replaceWith(child[0].cloneNode(true));
                            child[4].replaceWith(child[0].cloneNode(true));
                            child[4].childNodes[1].remove();
                            child[2].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                            child[2].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                            child[4].childNodes[0].href = sort[BLOD.tid][2];
                            child[4].childNodes[0].innerText = sort[BLOD.tid][1];
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("分区信息", ...e); }
                    }
                }
            }, 1000);
        },
    }

    // 阻止直播间挂机检测
    class LiveSleep {
        constructor() {
            this.setInterval = setInterval;
            this.clock = 0;
            window.setInterval = (...args) => {
                if (args[1] && args[1] == 300000 && args[0] && args[0].toString() == "function(){e.triggerSleepCallback()}") {
                    if (!this.clock) {
                        toast.warning("成功阻止直播间挂机检测！", ...args);
                        this.clock++;
                    }
                    return Number.MIN_VALUE;
                }
                return this.setInterval.call(window, ...args);
            }
        }
        /**
         * 留待以后释放setInterval方法
         */
        release() {
            // 释放是不可能释放的，只要鼠标还在动这丫的就一直检测！
            window.setInterval = this.setInterval;
        }
    }
    BLOD.reset.disableLiveSleep = () => {
        if (config.reset.nosleep) new LiveSleep();
    }

    // 禁用直播间p2p上传
    BLOD.reset.fuckp2p = () => {
        if (!config.reset.nop2p) return;
        window.RTCPeerConnection = undefined;
        window.RTCDataChannel = () => { };
        toast.warning("禁用直播间p2p上传！");
    }

    // 添加UP主列表
    BLOD.reset.uplist = () => {
        if (!BLOD.staff || !config.reset.uplist) return;
        let timer = setInterval(() => {
            let info = document.querySelector("#v_upinfo");
            if (info) {
                clearInterval(timer);
                let fl = '<span class="title">UP主列表</span><div class="up-card-box">';
                BLOD.staff.forEach(d => {
                    let mid = d.mid;
                    let face = d.face;
                    let title = d.title;
                    let vip = (d.vip && d.vip.status) ? 'name-text is-vip' : 'name-text';
                    let name = d.name;
                    fl = fl + [
                        '<div class="up-card">',
                        '<a href="//space.bilibili.com/',
                        mid,
                        '" data-usercard-mid="',
                        mid,
                        '" target="_blank" class="avatar"><img src="',
                        face,
                        '@48w_48h.webp" /><!----><span class="info-tag">',
                        title,
                        '</span><!----></a><div class="avatar"><a href="//space.bilibili.com/',
                        mid,
                        '" data-usercard-mid="',
                        mid,
                        '" target="_blank" class="',
                        vip,
                        '">',
                        name,
                        '</a></div></div>'
                    ].join("")
                })
                info.innerHTML = fl + '</div>';
            }
        }, 100);
    }

    // BV=>av
    class ParameterTrim {
        constructor() {
            this.param = [
                "spm_id_from",
                "from_source",
                "msource",
                "bsource",
                "seid",
                "source",
                "session_id",
                "visit_id",
                "sourceFrom",
                "from_spmid"
            ];
            this.url = [];
            this.run();
        }
        /**
         * 处理入口
         * @param {*} a 有效则处理a标签
         */
        run(a) {
            this.loca();
            if (config.reset.bvid2av && a) this.aitm();
        }
        /**
         * 处理地址栏
         */
        loca() {
            this.url[1] = location.href;
            if (this.url[0] != this.url[1]) {
                let href = this.triming(location.href);
                if (!href.includes("#") && location.href.includes("#")) href = href + location.hash;
                window.history.replaceState(null, null, href);
                this.url[0] = location.href;
            }
        }
        /**
         * 处理a标签
         */
        aitm() {
            document.querySelectorAll("a").forEach(d => {
                if (d.href && this.url.indexOf(d.href) < 0) {
                    this.logout(d);
                    let hash = d.href.includes("#") ? "#" + d.href.split("#")[1] : "";
                    hash = hash.includes("/") ? "" : hash;
                    d.href = this.triming(d.href);
                    if (d.href.includes("?")) d.href = d.href + hash;
                    this.url.push(d.href);
                }
            })
            this.area();
        }
        /**
         * 处理area历史遗留
         */
        area() {
            document.querySelectorAll("area").forEach(d => {
                if (d.href && d.href.includes("bilibili.tv")) d.href = d.href.replace("bilibili.tv", "bilibili.com")
            })
        }
        /**
         * BV=>av
         * @param {string} url 被转化的链接
         */
        triming(url) {
            let obj = this.search(url);
            url = url.split("?")[0].split("/");
            url.forEach((d, i, e) => {
                if (d.includes("#")) d = d.split("#")[0];
                if (d.toLowerCase().startsWith('bv')) e[i] = "av" + BLOD.abv(d);
            });
            url = url.join("/");
            return BLOD.objUrl(url, obj);
        }
        /**
         * 清除无用参数
         * @param {string} url 带参数的链接
         */
        search(url) {
            let obj = BLOD.urlObj(url);
            if (obj.bvid) obj.aid = BLOD.abv(obj.bvid);
            if (obj.from && obj.from == "search") obj.from = null;
            this.param.forEach(d => {
                if (obj[d]) obj[d] = null;
            })
            return obj;
        }
        /**
         * 代理退出登录
         * @param {HTMLElement} he a标签
         */
        logout(he) {
            if (he.href.includes("account.bilibili.com/login?act=exit")) {
                he.href = "javascript:void(0);";
                he.onclick = () => BLOD.loginExit();
            }
        }
    }
    const parameterTrim = new ParameterTrim()
    BLOD.reset.parameterTrim = (a) => { return parameterTrim.run(a) };

    // 载入本地弹幕
    class LocalDanmaku {
        constructor() {
            if (document.querySelector("#local-danmaku")) return;
            this.element = '<label class="button" role="button" title="载入本地弹幕">本地弹幕<input id="local-danmaku" type="file" accept=".xml" /></label>';
            this.style = '.bpui-checkbox-text.local-danmaku label{ cursor: pointer; } .bpui-checkbox-text.local-danmaku #local-danmaku { opacity:0; width: 0; }';
            let icon = document.querySelector(".bilibili-player-iconfont-danmaku");
            if (!icon) return;
            icon.onmouseover = () => {
                if (this.timer) return;
                if (!BLOD.setDanmaku) return debug.warn("无法启动本地弹幕功能");
                this.timer = setTimeout(() => this.init(), 100);
            }
        }
        /**
         * 初始化按钮
         */
        init() {
            this.parrent = document.querySelector(".bilibili-player-danmaku-setting-lite");
            if (!this.parrent) return;
            BLOD.addCss(this.style, "localDmStyle");
            this.parrent = this.parrent.children[2];
            this.node = BLOD.addElement("span", { class: "bpui-checkbox-text local-danmaku" }, this.parrent);
            this.node.innerHTML = this.element;
            this.input = this.node.querySelector("#local-danmaku");
            this.input.onchange = () => { this.change() }
        }
        /**
         * 读取文件地址
         */
        async change() {
            const file = this.input.files;
            if (file.length === 0) {
                this.input.value = "";
                return toast.warning("请选择本地弹幕文件！拓展名 .xml");
            }
            if (!/\.xml$/.test(file[0].name)) {
                this.input.value = "";
                return toast.warning("这貌似不是一个有效的弹幕文件 →_→");
            }
            let data = await this.readFile(file[0]);
            // 调用弹幕控制接口
            if (!BLOD.loadLocalDm) {
                this.input.value = "";
                return toast.error("载入本地弹幕失败：本地弹幕组件丢失！");
            }
            toast("本地弹幕：" + file[0].name, "载入模式：" + (config.reset.concatDanmaku ? "与当前弹幕合并" : "替换当前弹幕"));
            BLOD.loadLocalDm(data, config.reset.concatDanmaku);
            this.offset = 0; // 记录或重置弹幕偏移时间
            if (!BLOD.offsetDanmaku) return toast.error("绑定键盘事件失败：弹幕偏移组件丢失！")
            else {
                toast("已绑定键盘事件", "可以通过键盘 , 和 . 两个键（即上标为 < 和 > 的两个键）提前或延后弹幕偏移，频度1秒/次");
                if (!this.keyboard) {
                    this.keyboard = true;
                    document.addEventListener("keydown", (ev) => {
                        switch (ev.key) {
                            case ",":
                                BLOD.offsetDanmaku(-1);
                                this.offset--;
                                debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            case ".":
                                BLOD.offsetDanmaku(1);
                                this.offset++;
                                debug.msg(undefined, "弹幕偏移：", this.offset + " 秒");
                                break;
                            default:
                                break;
                        }
                    })
                }
            }
            // 成功载入清除上传文件控件内容
            this.input.value = "";
        }
        /**
         * 读取文件内容
         * @param {File} file 记录本地文件信息的 file 对象
         */
        readFile(file) {
            return new Promise((resolve, reject) => {
                if (!file) reject(toast.error('无效文件路径！'));
                const reader = new FileReader();
                reader.readAsText(file, 'utf-8');
                reader.onload = () => {
                    resolve(reader.result);
                }
                reader.onerror = () => {
                    reject(toast.error('读取文件出错，请重试！'));
                    // 成功失败清除上传文件控件内容
                    this.input.value = ""
                }
            })
        }
    }

    // 弹幕反查
    class DanmkuHashId {
        /**
         * 反差弹发送者信息
         * @param {string} crc 8 位 crc32 哈希值
         * @returns 预生成的占位文本
         */
        constructor(crc) {
            BLOD.importModule("crc");
            // 设置正在查询的弹幕数量
            DanmkuHashId.count = DanmkuHashId.count ? DanmkuHashId.count + 1 : 1;
            // 当前查询弹幕排序
            this.count = DanmkuHashId.count;
            // 临时缓存已查询的 mid
            DanmkuHashId.catch = DanmkuHashId.catch || {};
            this.hash = crc;
            this.mid = BLOD.midcrc(this.hash);
            this.getInfo();
            return [this.hash, this.mid];;
        }
        async getInfo() {
            try {
                this.node = document.querySelector(".bilibili-player-context-menu-container.active");
                if (!this.node) return setTimeout(() => { this.getInfo() }, 100);
                this.node = this.node.children[0];
                let j = 0; // 找到的节点序号
                for (let i = this.node.children.length - 1; i >= 0; i--) {
                    if (this.node.children[i].textContent.includes("mid")) {
                        this.dm = this.node.children[i];
                        j++;
                        if (this.count === j) break;
                    }
                }
                if (!this.dm) return setTimeout(() => { this.getInfo() }, 100);
                if (this.dm.tagName != "LI") return;
                DanmkuHashId.catch[this.mid] = DanmkuHashId.catch[this.mid] || BLOD.jsonCheck(await xhr.true(BLOD.objUrl("https://api.bilibili.com/x/web-interface/card", { mid: this.mid })));
                this.dm.innerHTML = '<div style="min-height:0px;z-index:-5;background-color: unset;" class="bb-comment"><div style="padding-top: 0;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;vertical-align: middle;" data-usercard-mid="' +
                    this.mid + '" class="reply-face"><img src="' +
                    DanmkuHashId.catch[this.mid].data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user" style="padding-bottom: 0;top: 3px;"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                    this.mid + '" href="//space.bilibili.com/' +
                    this.mid + '" target="_blank" class="' +
                    (DanmkuHashId.catch[this.mid].data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + DanmkuHashId.catch[this.mid].data.card.name + '</a> ' +
                    DanmkuHashId.catch[this.mid].data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                    DanmkuHashId.catch[this.mid].data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                DanmkuHashId.count--;
            } catch (e) { DanmkuHashId.count--; e = Array.isArray(e) ? e : [e]; toast.error("弹幕反查", ...e); }
        }
    }
    BLOD.danmkuHashId = (crc) => {
        let check = new DanmkuHashId(crc);
        return "hash: " + check[0] + " mid: " + check[1];
    }

    // 在线弹幕
    class OnlineDanmaku {
        /**
         * 所需获取弹幕的对应链接
         * @param {string} url 所需获取弹幕的对应链接
         * @param {HTMLElement} [right] 用于创建下载所获得弹幕所在的父节点
         */
        constructor(url, right) {
            toast("正在解析链接：" + url);
            if (url && !url.includes("?")) url = "?" + url;
            this.url = url;
            this.obj = BLOD.urlObj(url);
            this.node = right;
            if (document.querySelector("#BLOD-dm-dl")) document.querySelector("#BLOD-dm-dl").remove();
            if (BLOD.bloburl.xml) {
                window.URL.revokeObjectURL(BLOD.bloburl.xml);
                BLOD.bloburl.xml = "";
            }
            this.init(url);
        }
        async init() {
            // 从所有可能的aid形式中获取aid
            this.aid = this.url.match(/[aA][vV][0-9]+/) ? this.url.match(/[aA][vV][0-9]+/)[0].match(/\d+/)[0] : undefined;
            this.aid = this.aid || this.obj.aid || undefined;
            this.aid = this.aid || (/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/.test(this.url) ? BLOD.abv(this.url.match(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/)[0]) : undefined);
            this.aid = this.aid || (this.obj.bvid ? BLOD.abv(this.obj.bvid) : undefined);
            try {
                if (this.aid) {
                    // 直接能获取aid的情况，尝试获取cid
                    this.cid = this.obj.cid || undefined;
                    if (!this.cid) {
                        this.p = this.obj.p || 1;
                        try {
                            // 尝试访问B站服务器获取信息
                            this.data = BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": this.aid }))).data[this.p - 1];
                            this.cid = this.data.cid;
                            toast("正在请求av视频数据", "分P名称：" + this.data.part);
                        } catch (e) {
                            e = Array.isArray(e) ? e : [e];
                            debug.error("获取视频信息出错：aid：" + this.aid, "HOST：https://api.bilibili.com/x/player/pagelist", ...e);
                            try {
                                // 尝试访问BiliPlus获取信息
                                this.data = BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://www.biliplus.com/api/view", { "id": this.aid })));
                                this.data = (this.data.list && this.data.list[this.p - 1]) || (this.data.v2_app_api && this.data.v2_app_api.pages && this.data.v2_app_api.pages[this.p - 1]);
                                this.cid = this.data.cid;
                                toast("正在请求av视频数据", "分P名称：" + this.data.part);
                            } catch (e) {
                                e = Array.isArray(e) ? e : [e];
                                debug.error("获取视频信息出错：aid：" + this.aid, "HOST：https://www.biliplus.com/api/view", ...e);
                            }
                        }
                    }
                } else {
                    // 输入的是番剧ss/ep链接的情况，尝试获取aid、cid
                    this.ssid = this.url.match(/[sS][sS][0-9]+/) ? this.url.match(/[sS][sS][0-9]+/)[0].match(/\d+/)[0] : undefined;
                    this.ssid = this.ssid || this.obj.season_id || undefined;
                    this.epid = this.url.match(/[eE][pP][0-9]+/) ? this.url.match(/[eE][pP][0-9]+/)[0].match(/\d+/)[0] : undefined;
                    this.epid = this.epid || this.obj.ep_id || undefined;
                    try {
                        // 尝试访问bangumi接口
                        if (this.epid) this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: this.ssid }));
                        else if (this.ssid) this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: this.epid }));
                        if (this.data) {
                            this.data = BLOD.iniState.bangumi(this.data, this.epid);
                            this.aid = this.data.epInfo.aid;
                            this.cid = this.data.epInfo.cid;
                            toast("正在请求Bangumi数据", "系列名称：" + this.data.mediaInfo.title, "分p名称：" + this.data.epInfo.index_title);
                        }
                    } catch (e) {
                        e = Array.isArray(e) ? e : [e];
                        if (this.epid) debug.error("获取视频信息出错：ssid：" + this.ssid, "HOST：https://bangumi.bilibili.com/view/web_api/season", ...e);
                        else if (this.ssid) debug.error("获取视频信息出错：ssid：" + this.ssid, "HOST：https://bangumi.bilibili.com/view/web_api/season", ...e);
                        try {
                            // 尝试访问泰区接口，需要泰区代理服务器或者节点
                            let thai = BLOD.getValue("thaiLand") || "https://api.global.bilibili.com";
                            if (this.epid) {
                                this.data = await BLOD.xhr(BLOD.objUrl(`${thai}/intl/gateway/v2/ogv/view/app/season`, { ep_id: this.epid }));
                            } else if (this.ssid) {
                                this.data = await BLOD.xhr(BLOD.objUrl(`${thai}/intl/gateway/v2/ogv/view/app/season`, { season_id: this.ssid }));
                            }
                            this.data = BLOD.iniState.thaiBangumi(this.data, this.epid);
                            this.aid = this.data.epInfo.aid;
                            this.cid = this.data.epInfo.cid;
                            toast("正在请求Bangumi数据", "系列名称：" + this.data.mediaInfo.title, "分p名称：" + this.data.epInfo.index_title);
                        } catch (e) { }
                    }
                }
                if (this.aid && this.cid) {
                    BLOD.getSegDanmaku(this.aid, this.cid).then(d => {
                        let danmaku = AllDanmaku.format(d, this.aid);
                        toast("在线弹幕：aid=" + this.aid + " cid=" + this.cid, "载入模式：" + (config.reset.concatDanmaku ? "与当前弹幕合并" : "替换当前弹幕"));
                        BLOD.setDanmaku(danmaku, config.reset.concatDanmaku);
                        this.download(d);
                    })
                } else {
                    toast.warning("未能获取到任何视频信息", "请检查输入的视频链接是否有效！", "若是第三方接口抽风也可重试看看");
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("在线弹幕", ...e); }
        }
        /**
         * 回显弹幕链接到设置面板
         * @param {[]} arr 新版弹幕数组
         */
        async download(arr) {
            arr = await BLOD.toXml(arr);
            BLOD.xml = arr;
            if (!this.node) return;
            this.div = BLOD.addElement("div", { id: "BLOD-dm-dl" }, this.node);
            this.blob = new Blob([arr]);
            BLOD.bloburl.xml = URL.createObjectURL(this.blob);
            this.div.innerHTML = `<a href=${BLOD.bloburl.xml} target="_blank" download="${this.cid}.xml">获取在线弹幕成功，可以右键另存为文件！</a>`;
            if (BLOD.cid && window.player) {
                let config = BLOD.getValue("onlineDanmaku") || {};
                config[BLOD.cid] = [this.aid, this.cid];
                BLOD.setValue("onlineDanmaku", config);
            }
        }
    }
    BLOD.onlineDanmaku = OnlineDanmaku;

    // 全弹幕装填
    class AllDanmaku {
        /**
         * 全弹幕入口
         * @param {number} delay 接口冷却时间，单位：秒
         * @param {HTMLElement} [button] 调用按钮，用于获取中临时禁用
         * @returns 返回函数本身，操作都在异步了所以返回值意义不大
         */
        constructor(delay, button) {
            this.delay = delay || 5;
            this.button = button;
            // 异步获取中，临时禁用按钮
            this.button && this.button.setAttribute("disabled", true);
            let state = document.querySelector("#BLOD-UI-state");
            if (state) state.remove();
            toast("正在尝试获取全部弹幕请耐心等待。。。", "获取延时请尽量调大，以免短时间内大量请求被临时封端口！");
            this.pubdate = new Date(2009, 0);
            if (window.__INITIAL_STATE__) {
                if (window.__INITIAL_STATE__.videoData && window.__INITIAL_STATE__.videoData.pubdate) {
                    this.pubdate = new Date(1E3 * window.__INITIAL_STATE__.videoData.pubdate);
                } else if (window.__INITIAL_STATE__.epInfo && window.__INITIAL_STATE__.epInfo.pub_real_time) {
                    this.pubdate = new Date(window.__INITIAL_STATE__.epInfo.pub_real_time);
                }
            } else {
                let time = document.querySelector("div.tm-info.tminfo > time");
                time && (this.pubdate = new Date(time.innerHTML));
            }
            this.pubdate = BLOD.timeFormat(this.pubdate, 1).split(" ")[0]; // 视频上传日期
            this.today = BLOD.timeFormat(undefined, 1).split(" ")[0]; // 当天日期
            this.time = this.today;
            this.arrP = this.pubdate.split("-");
            this.danmaku = [];
            if (!this.pubdate) return toast.warning("投稿日期获取失败！无法获取全部弹幕！");
            this.init();
        }
        /**
         * 按日期拉取弹幕
         * @returns 调用月份判断
         */
        async init() {
            try {
                // 获取当日日期
                this.arrT = this.time.split("-");
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0]) return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
                // 日期未早于投稿日，正常请求日期数据
                toast("正在获取 " + this.time + " 日的弹幕。。。");
                let danmaku = await BLOD.getHistoryDanmaku(this.time);
                BLOD.sortDmById(danmaku, "idStr");
                danmaku.reverse();
                // 取最早一条弹幕的时间
                this.time = BLOD.timeFormat(danmaku[danmaku.length - 1].ctime * 1000, 1).split(" ")[0];
                this.danmaku = this.danmaku.concat(danmaku);
                toast("数据返回！已获取弹幕数：" + BLOD.unitFormat(this.danmaku.length));
                this.arrT = this.time.split("-");
                // 如果当天不是投稿日，转入月份请求
                if (this.pubdate != this.today) return this.month();
                // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
                this.done(1);
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                } else {
                    // 失败退出，取消按钮禁用
                    this.button && this.button.removeAttribute("disabled");
                    toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 按月份判断有弹幕时间
         * @returns 调用获取日期弹幕或者循环月份判断
         */
        async month() {
            try {
                // 如果年份小于投稿日，说明获取成功
                if (this.arrT[0] < this.arrP[0]) return this.done(1);
                // 年份相等但月份小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
                // 年月都相等，但日期小于投稿日说明获取成功
                if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
                // 日期未早于投稿日，正常请求月份数据
                let data = await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                    type: 1,
                    oid: BLOD.cid,
                    month: this.arrT.slice(0, 2).join("-")
                }))
                data = BLOD.jsonCheck(data).data;
                if (data && data[0]) {
                    // 当月有弹幕，进入日期判断
                    for (let i = data.length - 1; i >= 0; i--) {
                        let date = data[i].split("-");
                        if (date[2] < this.arrT[2]) {
                            // 当日在已获取弹幕之前，记录并跳出循环
                            this.timeT = data[i];
                            break;
                        }
                    }
                    if (this.timeT) {
                        // 延时转入日期请求
                        this.time = this.timeT;
                        this.timeT = undefined;
                        toast("技能冷却中。。。请稍待 " + this.delay + " 秒钟");
                        return setTimeout(() => this.init(), this.delay * 1000);
                    } else {
                        // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                        if (this.arrT[1] > 1) {
                            this.arrT[1]--;
                            this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                        }
                        else this.arrT = [this.arrT[0] - 1, 12, 31];
                        return this.month();
                    }
                } else {
                    // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                    if (this.arrT[1] > 1) {
                        this.arrT[1]--;
                        if (this.arrT[1] < 10) this.arrT[1] = (Array(2).join('0') + this.arrT[1]).slice(-2);
                    } else this.arrT = [this.arrT[0] - 1, 12, 31];
                    return this.month();
                }
            } catch (e) {
                e = Array.isArray(e) ? e : [e];
                toast.error("全弹幕装填", ...e);
                // 弹幕获取出错，载入已获取的弹幕
                if (this.danmaku[0]) {
                    toast.warning("弹幕获取出错！", "保留并载入已获取的弹幕");
                    this.done();
                } else {
                    // 失败退出，取消按钮禁用
                    this.button && this.button.removeAttribute("disabled");
                    toast.error("弹幕获取出错！", "已退出！");
                }
            }
        }
        /**
         * 载入弹幕
         * @param {Boolean} [boolean] 判断获取成功还是失败，成功请传入真值。
         */
        async done(boolean) {
            try {
                // 历史弹幕里不包含代码弹幕必须额外处理
                toast("正在获取BAS/代码弹幕专包。。。")
                this.danmaku = this.danmaku.concat(await BLOD.getSegDanmaku(undefined, undefined, true));
                toast("数据返回！正在整合。。。")
            } catch (e) { }
            let danmaku = AllDanmaku.format(this.danmaku, BLOD.aid);
            if (boolean) toast.success("全弹幕获取成功，正在装填。。。", "总弹幕量：" + BLOD.unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π");
            BLOD.setDanmaku(danmaku);
            // 成功获取弹幕，取消按钮禁用
            this.button && this.button.removeAttribute("disabled");
            BLOD.toXml(this.danmaku).then(d => { BLOD.xml = d });
        }
        /**
         * 将新版弹幕数组转化为旧版弹幕数组
         * @param {[]} dm 新版弹幕数组
         * @param {number} [aid] 视频aid，默认取当前视频aid
         * @returns {[]} 旧版弹幕数组
         */
        static format(dm, aid) {
            aid = aid || BLOD.aid
            let danmaku = dm.map(function (v) {
                return {
                    class: v.pool,
                    color: v.color,
                    date: v.ctime,
                    dmid: v.idStr,
                    mode: v.mode,
                    size: v.fontsize,
                    stime: v.progress / 1000,
                    text: (v.mode != 8 && v.mode != 9) ? v.content.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.content,
                    uid: v.midHash
                };
            });
            //对av400000(2012年11月)之前视频中含有"/n"的弹幕的进行专门处理
            if (aid && aid < 400000) {
                let textData;
                for (let i = 0; i < danmaku.length; i++) {
                    textData = danmaku[i];
                    if (textData.text.includes('\n')) {
                        textData.class = 1;
                        textData.zIndex = textData.stime * 1000;
                        if (!(textData.text.includes("█") || textData.text.includes("▂"))) {
                            textData.zIndex = textData.zIndex + 1;
                        }
                    }
                }
            }
            BLOD.sortDmById(danmaku, "dmid");
            return danmaku;
        }
    }
    BLOD.AllDanmaku = AllDanmaku;

    /**
     * @class ReplyList
     * @description 恢复评论翻页
     */
    class ReplyList {
        constructor() {
            if (BLOD.path.name) return;
            if (!config.reset.replyList) return;
            // 拦截评论脚本
            if (window.bbComment) return this.cover();
            Object.defineProperty(window, "bbComment", {
                set: () => { this.cover() },
                get: () => undefined,
                configurable: true
            })
        }
        cover() {
            delete window.bbComment; // 取消拦截
            BLOD.importModule("reply"); // 载入新评论脚本
        }
    }
    BLOD.replyList = () => { new ReplyList() }
})()
