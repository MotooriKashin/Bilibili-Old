/**
 * 本模块负责实现互动弹幕
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(function () {
    try {
        API.addCss(API.getModule("commandDm.css"));
        var player, widgetContainer;
        var playing = false;
        var visible = true;
        var commandDm = {
            visible: [],
            hidden: [] // 未显示的互动弹幕
        };
        /**
         * 初始化互动弹幕功能
         */
        function init() {
            if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.videoData && window.player) {
                if (widgetContainer === undefined)
                    widgetContainer = initCountainer();
                player = window.player;
                bindEvents();
            }
        }
        /**
         * 添加互动弹幕
         * @param commandDmRaw 从服务器获得的互动弹幕数据
         */
        function load(commandDmRaw) {
            commandDm.hidden = parseDm(commandDmRaw);
            resize();
        }
        /**
         * 创建互动弹幕的容器div
         * @returns div.bilibili-player-video-popup
         */
        function initCountainer() {
            let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
            if (!videoWrap)
                return;
            let widgetContainer = document.createElement("div");
            widgetContainer.className = "bilibili-player-video-popup";
            videoWrap.appendChild(widgetContainer);
            return widgetContainer;
        }
        /**
         * 绑定播放器事件，使用window.player.addEventListener
         */
        function bindEvents() {
            const EVENT = {
                VIDEO_MEDIA_PLAYING: "video_media_playing",
                VIDEO_MEDIA_PAUSE: "video_media_pause",
                VIDEO_MEDIA_SEEK: "video_media_seek",
                VIDEO_MEDIA_SEEKED: "video_media_seeked",
                VIDEO_MEDIA_ENDED: "video_media_ended",
                VIDEO_RESIZE: "video_resize",
                VIDEO_PLAYER_RESIZE: "video_player_resize",
                VIDEO_DESTROY: "video_destroy"
            };
            player.addEventListener(EVENT.VIDEO_MEDIA_PLAYING, play);
            player.addEventListener(EVENT.VIDEO_MEDIA_PAUSE, pause);
            player.addEventListener(EVENT.VIDEO_MEDIA_SEEK, pause);
            player.addEventListener(EVENT.VIDEO_MEDIA_SEEKED, play);
            player.addEventListener(EVENT.VIDEO_MEDIA_ENDED, pause);
            player.addEventListener(EVENT.VIDEO_PLAYER_RESIZE, resize);
            player.addEventListener(EVENT.VIDEO_DESTROY, destroy);
            // 开启/关闭弹幕事件
            document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku").addEventListener("click", (event) => {
                let option = event.target.getAttribute("name");
                if (option == "ctlbar_danmuku_close") {
                    visible = false;
                    pause();
                    widgetContainer.style.display = "none";
                }
                else if (option == "ctlbar_danmuku_on") {
                    visible = true;
                    play();
                    widgetContainer.style.display = "";
                }
            });
        }
        /**
         * 生成互动弹幕的UI组件，各种后续处理
         * @param commandDmRaw 互动弹幕原始数据
         * @returns 互动弹窗的UI对象
         */
        function parseDm(commandDmRaw) {
            let popupWindow = [];
            for (let i = 0, cdm, extra, from; i < commandDmRaw.length; i++) {
                cdm = commandDmRaw[i];
                extra = JSON.parse(cdm.extra);
                from = cdm.progress / 1000;
                switch (cdm.command) {
                    // 4种将会弹出界面的互动弹幕(见原生代码appendPopup())
                    case "#ATTENTION#":
                        break;
                    case "#ACTORFOLLOW#":
                    case "#MANAGERFOLLOW#":
                        break;
                    case "#VOTE#": // 投票弹窗
                        popupWindow.push(new Vote(cdm, extra, from));
                        break;
                    case "#GRADE#": // 评分弹窗
                        popupWindow.push(new Grade(cdm, extra, from));
                        break;
                    // 滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
                    case "#RESERVE#":
                        break;
                    case "#LINK#":
                        popupWindow.push(new Link(cdm, extra, from));
                        break;
                    case "#ACTOR#":
                        break;
                    case "#ACTIVITYCOMBO#":
                        break;
                }
            }
            return popupWindow;
        }
        function play() {
            if (visible) {
                playing = true;
                loop();
            }
        }
        function pause() {
            playing = false;
            loop();
        }
        /**
         * 播放器大小更改时触发
         */
        function resize() {
            // 获得当前播放器显示分辨率与最小分辨率(680x504)时的缩放比，用于UI缩放
            let scaleX = widgetContainer.clientWidth / 680;
            let scaleY = widgetContainer.clientHeight / 504;
            for (let i = 0; i < commandDm.visible.length; i++) {
                commandDm.visible[i].resize(scaleX, scaleY);
            }
            for (let i = 0; i < commandDm.hidden.length; i++) {
                commandDm.hidden[i].resize(scaleX, scaleY);
            }
        }
        function loop() {
            let time = player.getCurrentTime(); // 获得以秒为单位的当前播放进度
            if (playing) {
                requestAnimationFrame(loop);
            }
            // 根据播放进度，显示、隐藏互动弹幕界面
            for (let i = 0, cdm; i < commandDm.hidden.length; i++) {
                cdm = commandDm.hidden[i];
                if (cdm.from < time && cdm.to > time) {
                    commandDm.visible.push(cdm);
                    commandDm.hidden.splice(i, 1);
                    cdm.show();
                }
            }
            for (let i = 0, cdm; i < commandDm.visible.length; i++) {
                cdm = commandDm.visible[i];
                if (cdm.to < time || cdm.from > time) {
                    commandDm.hidden.push(cdm);
                    commandDm.visible.splice(i, 1);
                    cdm.hide();
                }
            }
        }
        function destroy() {
            playing = false;
            for (let i = 0; i < commandDm.visible.length; i++) {
                commandDm.visible[i].destroy();
            }
            for (let i = 0; i < commandDm.hidden.length; i++) {
                commandDm.hidden[i].destroy();
            }
            commandDm.visible.splice(0, commandDm.visible.length);
            commandDm.hidden.splice(0, commandDm.hidden.length);
        }
        function divClass(className) {
            let div = document.createElement("div");
            div.className = className;
            return div;
        }
        function isLoggedin() {
            if (API.uid)
                return true;
            player.pause();
            toast.warning("请先登录");
            API.biliQuickLogin();
        }
        function post(url, data, contentType = "application/x-www-form-urlencoded") {
            data.csrf = API.getCookies().bili_jct;
            return xhr({
                url: url,
                data: API.objUrl("", data),
                headers: { "Content-type": contentType },
                method: "POST",
                credentials: true
            });
        }
        /**
         * 弹窗组件
         */
        class PopupWindow {
            constructor(cdm, extra, from) {
                this.duration = extra.duration / 1e3 || 5;
                this.from = from || 0;
                this.to = from + (extra.duration / 1e3 || 5);
                this.pos_x = extra.posX || 200;
                this.pos_y = extra.posY || 200;
                this.popup = divClass("commandDm-popup");
                this.popup.style.display = "none";
                widgetContainer.appendChild(this.popup);
            }
            show() {
                this.popup.style.display = "";
                requestAnimationFrame(() => this.popup.className = "commandDm-popup on");
            }
            hide() {
                this.popup.className = "commandDm-popup";
                setTimeout(() => this.popup.style.display = "none", 200);
            }
            destroy() {
            }
            /**
            * 根据视频区域大小等比缩放投票界面
            */
            resize(scaleX, scaleY) {
                this.popup.style.left = (this.pos_x * scaleX) + "px";
                this.popup.style.top = (this.pos_y * scaleY) + "px";
                this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
            }
        }
        /**
         * 投票互动UI
         */
        class Vote extends PopupWindow {
            constructor(cdm, extra, from) {
                super(cdm, extra, from);
                this.popup.style.width = "150px";
                this.total = extra.cnt;
                this.voteId = extra.vote_id;
                this.options = extra.options;
                this.question = extra.question;
                this.myVote = extra.my_vote; // 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
                let dialog = divClass("vote-dialog");
                let panel = divClass("vote-panel");
                let title = divClass("vote-title");
                title.innerHTML = this.question;
                let optionDiv = divClass("vote-option");
                let button = [];
                for (let i = 0, btn, opt; i < this.options.length; i++) {
                    // 投票按钮
                    opt = this.options[i];
                    btn = divClass("vote-button");
                    btn.innerHTML = opt.desc;
                    btn.setAttribute("idx", opt.idx);
                    btn.onclick = () => this.goVote(opt.idx, i);
                    button[i] = btn;
                    optionDiv.appendChild(btn);
                }
                panel.appendChild(optionDiv);
                dialog.appendChild(title);
                dialog.appendChild(panel);
                this.popup.appendChild(dialog);
                this.dialog = dialog;
                this.button = button;
                this.progress = [];
                // 已投票则直接显示结果
                if (this.myVote !== 0) {
                    this.showResult();
                    this.progress[this.myVote - 1].className = "vote-progress vote-progress-blue";
                }
                ;
            }
            goVote(idx, i) {
                if (isLoggedin()) {
                    this.total += 1;
                    this.options[i].cnt += 1;
                    // 发送投票操作到服务器
                    let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
                    post(url, {
                        aid: API.aid,
                        cid: API.cid,
                        progress: Math.max(Math.round(1e3 * player.getCurrentTime()), 1),
                        vote: idx,
                        vote_id: this.voteId
                    }).then((resp) => {
                        resp = JSON.parse(resp);
                        biliAPI.verify(resp, "投票");
                        this.progress[i].className = "vote-progress vote-progress-blue";
                    });
                    this.myVote = idx;
                    this.showResult();
                    this.to += 5; //点击投票后推迟5秒消失，防止结果消失太快来不及看
                }
            }
            showResult() {
                // 显示票数、比例条
                this.count = [];
                for (let i = 0, progress, desc; i < this.button.length; i++) {
                    this.button[i].onclick = null;
                    this.button[i].innerHTML = "";
                    this.button[i].className = "vote-progress-bg";
                    progress = divClass("vote-progress");
                    desc = divClass("vote-progress-desc");
                    desc.innerHTML = this.options[i].desc;
                    progress.appendChild(desc);
                    this.button[i].appendChild(progress);
                    this.progress[i] = progress;
                    // 结果数据
                    let cnt = divClass("vote-count");
                    cnt.innerHTML = this.options[i].cnt;
                    this.count[i] = cnt;
                    this.button[i].appendChild(cnt);
                }
                this.resultAnimation();
            }
            /**
             * 投票结果的动画
             */
            resultAnimation() {
                // 投票比例条型图向右展开
                for (let i = 0; i < this.progress.length; i++) {
                    this.progress[i].style.width = "0";
                    requestAnimationFrame(() => this.progress[i].style.width = (this.options[i].cnt / this.total * 100) + "%");
                }
                // 右侧票数递增动画，持续0.8秒
                let start = performance.now();
                let frame = (t) => {
                    let percentage = (t - start) * 0.00125;
                    if (percentage < 1)
                        requestAnimationFrame(frame);
                    else
                        percentage = 1;
                    for (let i = 0; i < this.count.length; i++) {
                        this.count[i].innerHTML = Math.floor(this.options[i].cnt * percentage);
                    }
                };
                requestAnimationFrame(frame);
            }
            show() {
                super.show();
                if (this.myVote !== 0) {
                    this.resultAnimation();
                }
            }
            hide() {
                super.hide();
                this.to = this.from + this.duration; // 重设消失时间
            }
        }
        class Grade extends PopupWindow {
            constructor(cdm, info, from) {
                super(cdm, info, from);
                this.popup.style.width = "184px";
                this.gradeInfo = info;
                this.popup.innerHTML = `
            <div style="display:block" class="grade-title">${info.msg}</div>
            <div class="grade-score-area pointer"></div>
            <div class="grade-score-info" style="display:none">
                <div style="color:#6f6f6f;display:inline-block;">平均</div><span style="color:${info.skin_font_color};font-size:27px" class="grade-avg-score">${info.avg_score}</span>
            </div>
            <span style="position:absolute;right:1rem;top:0.8rem;font-size:12px;color:#6f6f6f" class="grade-score-count">${info.count}人参与</span>
            `;
                this.scoreInfo = this.popup.getElementsByClassName("grade-score-info")[0];
                let scoreArea = this.popup.getElementsByClassName("grade-score-area")[0];
                let scoreButton = [];
                function highlightScores(i) {
                    for (let m = 0; m < 5; m++) {
                        if (m <= i && !scoreButton[m].highlight) {
                            scoreButton[m].highlight = true;
                            scoreButton[m].className = "highlight";
                        }
                        else if (m > i && scoreButton[m].highlight) {
                            scoreButton[m].highlight = false;
                            scoreButton[m].className = "";
                        }
                    }
                }
                for (let i = 0; i < 5; i++) {
                    let score = document.createElement("div");
                    scoreButton[i] = score;
                    score.innerHTML = `
                <img width=20 hegiht=20 src="${info.skin_selected}" class="bg"></img>
                <img width=20 hegiht=20 src="${info.skin_selected}" class="score-button"></img>`;
                    scoreArea.appendChild(score);
                    if (info.mid_score === 0) {
                        score.onmouseenter = () => highlightScores(i);
                        score.onclick = () => {
                            if (isLoggedin()) {
                                this.gradeInfo.avg_score = (this.gradeInfo.count * this.gradeInfo.avg_score + (i + 1) * 2) / (this.gradeInfo.count + 1);
                                this.gradeInfo.avg_score = this.gradeInfo.avg_score.toPrecision(2);
                                this.gradeInfo.count += 1;
                                this.popup.getElementsByClassName("grade-avg-score")[0].innerHTML = this.gradeInfo.avg_score;
                                this.popup.getElementsByClassName("grade-score-count")[0].innerHTML = this.gradeInfo.count + "人参与";
                                this.showResult();
                                for (let index = 0; index < 5; index++) {
                                    if (index <= i) {
                                        scoreButton[index].style.animation = "grade-score-hit 0.7s ease forwards";
                                        setTimeout(() => scoreButton[index].style.animation = "", 1000);
                                    }
                                    scoreButton[index].onclick = null;
                                    scoreButton[index].onmouseenter = null;
                                }
                                scoreArea.onmouseleave = null;
                                scoreArea.classList.remove("pointer");
                                this.goGrade((i + 1) * 2);
                            }
                        };
                    }
                }
                ;
                if (info.mid_score === 0)
                    scoreArea.onmouseleave = () => highlightScores(-1);
                this.scoreButton = scoreButton;
                if (info.mid_score != 0) {
                    this.showResult();
                    highlightScores(info.mid_score / 2 - 1);
                    scoreArea.classList.remove("pointer");
                }
            }
            goGrade(score) {
                post("https://api.bilibili.com/x/v2/dm/command/grade/post", {
                    aid: API.aid,
                    cid: API.cid,
                    progress: parseInt(player.getCurrentTime()) * 1000,
                    grade_id: this.gradeInfo.grade_id,
                    grade_score: score
                });
                this.to += 3;
            }
            showResult() {
                this.scoreInfo.style.display = "";
                this.scoreInfo.style.animation = "grade-score-showup 0.3s ease 0.2s forwards";
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => this.scoreButton[i].style.width = "24px", i * 50);
                }
            }
            hide() {
                super.hide();
                this.to = this.from + this.duration;
            }
        }
        /**
         * 用于获取收藏列表有关信息
         */
        class favList {
            static get() {
                if (this.list.length > 0)
                    return Promise.resolve(this.list);
                return xhr({
                    url: API.objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
                        type: String(2),
                        rid: String(API.aid),
                        up_mid: String(API.uid)
                    }),
                    credentials: true
                }).then((resp) => {
                    resp = JSON.parse(resp);
                    biliAPI.verify(resp, "获取收藏列表");
                    this.list = resp.data.list;
                    this.list.forEach((v) => v.attr === 1 && (this.defaultFolderId = v.id));
                    return this.list;
                });
            }
            static getDefaultFolder() {
                if (this.defaultFolderId !== 0)
                    return Promise.resolve(this.defaultFolderId);
                return this.get().then(() => { return this.defaultFolderId; });
            }
        }
        favList.list = [];
        favList.defaultFolderId = 0;
        /**
         * @see https://github.com/SocialSisterYi/bilibili-API-collect
         */
        class biliAPI {
            static verify(resp, msg) {
                if (resp.code !== 0) {
                    toast.error(msg + "失败", resp.code, resp.message);
                    throw msg + "失败";
                }
                return resp;
            }
            static like(bool) {
                bool = bool ? 1 : 2;
                return post("//api.bilibili.com/x/web-interface/archive/like", {
                    aid: API.aid,
                    like: bool
                }, "application/json; charset=utf-8").then((resp) => biliAPI.verify(resp, "点赞"));
            }
            static follow() {
                return post("//api.bilibili.com/x/relation/modify", {
                    aid: API.aid,
                    fid: window.getAuthorInfo().mid,
                    act: 1,
                    re_src: 14
                }).then((resp) => {
                    resp = JSON.parse(resp);
                    return biliAPI.verify(resp, "关注");
                });
            }
            static coin() {
            }
            static fav() {
                return post("//api.bilibili.com/x/v3/fav/resource/deal", {
                    rid: API.aid,
                    type: 2,
                    add_media_ids: favList.defaultFolderId,
                }).then((resp) => {
                    resp = JSON.parse(resp);
                    return biliAPI.verify(resp, "收藏");
                });
            }
            static triple() {
                return post("//api.bilibili.com/x/web-interface/archive/like/triple", {
                    aid: API.aid
                }, "application/json; charset=utf-8").then((resp) => {
                    biliAPI.verify(resp, "三连");
                    var d = resp.data;
                    if (d.coin && d.like && d.fav)
                        return;
                    if (!d.coin)
                        toast.error("投币失败");
                    if (!d.like)
                        toast.error("点赞失败");
                    if (!d.fav)
                        toast.error("收藏失败");
                    return d;
                });
            }
        }
        /**
         * 关联视频跳转按钮
         */
        class Link {
            constructor(cdm, extra, from) {
                this.content = cdm.content;
                this.aid = extra.aid;
                this.from = from || 0;
                this.to = from + 5;
                this.pos_x = extra.posX || 200;
                this.pos_y = extra.posY || 200;
                /*
                    <div class="link-button">
                        <img src="https://static.hdslb.com/images/favicon.ico">
                        <span>关联视频跳转</span>
                    </div>
                */
                let button = divClass("link-button");
                let img = document.createElement("img");
                img.src = "https://static.hdslb.com/images/favicon.ico";
                let span = document.createElement("span");
                span.innerHTML = this.content;
                button.appendChild(img);
                button.appendChild(span);
                button.style.display = "none";
                button.onclick = () => {
                    player.pause();
                    window.open("https://www.bilibili.com/video/av" + this.aid);
                };
                widgetContainer.appendChild(button);
                this.button = button;
            }
            show() {
                this.button.style.display = "block";
            }
            hide() {
                this.button.style.display = "none";
            }
            /**
             * 根据视频区域大小缩放，放大倍数限制在最大1.5倍
             */
            resize(scaleX, scaleY) {
                this.button.style.left = (this.pos_x * scaleX) + "px";
                this.button.style.top = (this.pos_y * scaleY) + "px";
                this.button.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min(1.5, (scaleX + scaleY) / 2) + ")";
            }
            destroy() {
            }
        }
        /**
         * 程序入口
         * @param cdm 互动弹幕原始数据
         * @param aid aid
         * @param cid cid
         */
        API.loadCommandDm = (cdm, aid, cid) => {
            if (aid != API.aid || cid != API.cid || widgetContainer !== undefined) {
                // 正在“载入其他视频弹幕”，不必处理互动弹幕
                return;
            }
            init(); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
            load(cdm);
        };
    }
    catch (e) {
        API.trace(e, "commandDm.js", true);
    }
})();
