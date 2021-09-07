/**
 * 本模块负责实现互动弹幕  
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(function () {
    API.addCss(API.getModule("commandDm.css"));
    var player: any, popupDiv: any;
    var playing = false;
    var visible = true;
    var commandDm = {
        visible: [], // 可见的互动弹幕
        hidden: []   // 未显示的互动弹幕
    };

    /**
     * 初始化互动弹幕功能
     */
    function init() {
        if ((<any>window).__INITIAL_STATE__ && (<any>window).__INITIAL_STATE__.videoData && (<any>window).player) {
            if (popupDiv === undefined)
                popupDiv = initCountainer();
            player = (<any>window).player;
            bindEvents();
        }
    }

    /**
     * 添加互动弹幕
     * @param commandDmRaw 从服务器获得的互动弹幕数据
     */
    function load(commandDmRaw: any) {
        (<any>commandDm.hidden) = parseDm(commandDmRaw);
        resize();
    }

    /**
     * 创建互动弹幕的容器div
     * @returns div.bilibili-player-video-popup
     */
    function initCountainer() {
        let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
        if (!videoWrap) return;
        let popupDiv = document.createElement("div");
        popupDiv.className = "bilibili-player-video-popup";
        videoWrap.appendChild(popupDiv);
        return popupDiv;
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
            VIDEO_RESIZE: "video_resize",                   // 等价于 onresize
            VIDEO_PLAYER_RESIZE: "video_player_resize",     // 播放器大小调整完成之后触发，不会执行多次，缺点是切换到mini播放器时只触发video_resize，不会触发video_player_resize，导致互动弹幕界面缩放不正确
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
        (<HTMLDivElement>document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku")).addEventListener(
            "click",
            (event) => {
                let option = (<HTMLElement>event.target).getAttribute("name");
                if (option == "ctlbar_danmuku_close") {
                    visible = false;
                    pause();
                    popupDiv.style.display = "none";
                } else if (option == "ctlbar_danmuku_on") {
                    visible = true;
                    play();
                    popupDiv.style.display = "";
                }
            });
    }

    /**
     * 生成互动弹幕的UI组件，各种后续处理
     * @param commandDmRaw 互动弹幕原始数据
     * @returns 互动弹窗的UI对象
     */
    function parseDm(commandDmRaw: any[]) {
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
                case "#VOTE#": // 投票弹幕
                    popupWindow.push(new Vote(cdm, extra, from));
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
        let scaleX = popupDiv.clientWidth / 680;
        let scaleY = popupDiv.clientHeight / 504;
        for (let i = 0; i < commandDm.visible.length; i++) {
            (<any>commandDm.visible[i]).resize(scaleX, scaleY);
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            (<any>commandDm.hidden[i]).resize(scaleX, scaleY);
        }
    }

    function loop() {
        let time = player.getCurrentTime(); // 获得以秒为单位的当前播放进度
        if (playing) {
            requestAnimationFrame(loop);
        }
        // 根据播放进度，显示、隐藏互动弹幕界面
        for (let i = 0, cdm; i < commandDm.hidden.length; i++) {
            cdm = <any>commandDm.hidden[i];
            if (cdm.from < time && cdm.to > time) {
                (<any[]>commandDm.visible).push(cdm);
                commandDm.hidden.splice(i, 1);
                cdm.show();
            }
        }
        for (let i = 0, cdm; i < commandDm.visible.length; i++) {
            cdm = <any>commandDm.visible[i];
            if (cdm.to < time || cdm.from > time) {
                (<any[]>commandDm.hidden).push(cdm);
                commandDm.visible.splice(i, 1);
                cdm.hide();
            }
        }
    }

    function destroy() {
        playing = false;
        for (let i = 0; i < commandDm.visible.length; i++) {
            (<any[]>commandDm.visible)[i].destroy();
        }
        for (let i = 0; i < commandDm.hidden.length; i++) {
            (<any[]>commandDm.hidden)[i].destroy();
        }
        commandDm.visible.splice(0, commandDm.visible.length);
        commandDm.hidden.splice(0, commandDm.hidden.length);
    }

    function divClass(className: string) {
        let div = document.createElement("div");
        div.className = className;
        return div;
    }

    function isLogin() {
        return API.uid !== undefined;
    }

    function post(url: string, data: any, contentType = "application/x-www-form-urlencoded") {
        data.csrf = API.getCookies().bili_jct;
        return xhr({
            url: url,
            data: API.objUrl("", data),
            headers: { "Content-type": contentType },
            method: "POST"
        });
    }

    /*
    投票弹幕的extra属性的例子
        cnt: 22343      <= 投票总人数
        duration: 5000
        icon: "http://i0.hdslb.com/bfs/album/5ec559dbd4d54f8c1e76021d52eb9807de94bfb9.png"
        my_vote: 0      <= 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
        options: Array(2) ->
            0: {idx: 1, desc: "好玩", cnt: 15782}
            1: {idx: 2, desc: "非常好玩", cnt: 6595}
        posX: 194
        posY: 196.49823321554769
        pub_dynamic: false
        question: "你觉得这个功能好玩吗？"
        vote_id: 703019
    */

    /** 
     * 投票互动UI
     */
    class Vote {
        total: any;
        voteId: any;
        options: any;
        question: any;
        myVote: any;
        duration: any;
        from: any;
        to: any;
        pos_x: any;
        pos_y: any;
        dialog: any;
        result: any;
        button: any;
        count: any;
        progress: any;
        constructor(cdm: any, extra: any, from: any) {
            this.total = extra.cnt;
            this.voteId = extra.vote_id;
            this.options = extra.options;
            this.question = extra.question;
            this.myVote = extra.my_vote; // 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
            this.duration = extra.duration / 1e3 || 5;
            this.from = from || 0;
            this.to = from + (extra.duration / 1e3 || 5);
            this.pos_x = extra.posX || 200;
            this.pos_y = extra.posY || 200;
            /*
            创建UI，结构如下
                <div class="vote-dialog" style="display: none;">
                    <div class="vote-title">投票标题</div>
                    <div class="vote-panel">
                        <div class="vote-option">
                            <div class="vote-button" idx="1">选项A</div>  <= idx：选项的序号
                            <div class="vote-button" idx="2">选项B</div>
                        </div>
                        <div class="vote-result" style="display: none;">
                            <div class="vote-count">12345票</div>  <= 投A的票数
                            <div class="vote-count">12345票</div>  <= 投B的票数
                        </div>
                    </div>
                </div>
            */
            let dialog = divClass("vote-dialog");
            let panel = divClass("vote-panel");
            let title = divClass("vote-title");
            title.innerHTML = this.question;
            let optionDiv = divClass("vote-option");
            let result = divClass("vote-result");
            result.style.display = "none";
            let button = [], count = [];
            for (let i = 0, btn: any, cnt: any, opt: any; i < this.options.length; i++) {
                // 投票按钮
                opt = this.options[i];
                btn = divClass("vote-button");
                btn.innerHTML = opt.desc;
                btn.setAttribute("idx", opt.idx);
                btn.onclick = () => this.goVote(opt.idx, i);
                button[i] = btn;
                optionDiv.appendChild(btn);
                // 结果数据
                cnt = divClass("vote-count");
                cnt.innerHTML = opt.cnt;
                count[i] = cnt;
                result.appendChild(cnt);
            }
            panel.appendChild(optionDiv);
            panel.appendChild(result);
            dialog.appendChild(title);
            dialog.appendChild(panel);
            dialog.style.display = "none";
            popupDiv.appendChild(dialog);
            this.dialog = dialog;
            this.result = result;
            this.button = button;
            this.count = count;
            this.progress = [];
            // 已投票则直接显示结果
            if (this.myVote !== 0) {
                this.showResult();
                this.progress[this.myVote - 1].className = "vote-progress vote-progress-blue";
            };
        }
        goVote(idx: any, i: any) {
            if (isLogin()) {
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
                }).then((resp: any) => {
                    resp = JSON.parse(resp);
                    biliAPI.verify(resp, "投票");
                    this.progress[i].className = "vote-progress vote-progress-blue";
                });
                this.myVote = idx;
                this.showResult();
                this.to += 5; //点击投票后推迟5秒消失，防止结果消失太快来不及看
            }
            else {
                player.pause();
                toast.info("请先登录");
                API.biliQuickLogin()
            }
        }
        showResult() {
            this.result.style.display = "flex";
            // 显示票数、比例条
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
            let frame = (t: any) => {
                let percentage = (t - start) * 0.00125;
                if (percentage < 1)
                    requestAnimationFrame(frame);
                else
                    percentage = 1;

                for (let i = 0; i < this.count.length; i++) {
                    this.count[i].innerHTML = Math.floor(this.options[i].cnt * percentage);
                }
            }
            requestAnimationFrame(frame);
        }
        show() {
            this.dialog.style.display = "flex";
            this.dialog.className = "vote-dialog vote-dialog-show";
            if (this.myVote !== 0) {
                this.resultAnimation();
            }
        }
        hide() {
            this.dialog.style.display = "none";
            this.dialog.className = "vote-dialog";
            this.to = this.from + this.duration; // 重设消失时间
        }
        /**
         * 根据视频区域大小等比缩放投票界面
         */
        resize(scaleX: any, scaleY: any) {
            this.dialog.style.left = (this.pos_x * scaleX) + "px";
            this.dialog.style.top = (this.pos_y * scaleY) + "px";
            this.dialog.style.transform = "translateX(-50%) translateY(-50%) scale(" + (scaleX + scaleY) / 2 + ")";
        }
        destroy() {
        }
    }

    /**
     * 用于获取收藏列表有关信息
     */
    class favList {
        static list = []
        static defaultFolderId = 0
        static get() {
            if (this.list.length > 0) return Promise.resolve(this.list);
            return xhr({
                url: API.objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
                    type: String(2),
                    rid: String(API.aid),
                    up_mid: String(API.uid)
                })
            }).then((resp: any) => {
                resp = JSON.parse(resp);
                biliAPI.verify(resp, "获取收藏列表");
                this.list = resp.data.list;
                this.list.forEach((v: any) => v.attr === 1 && (this.defaultFolderId = v.id));
                return this.list;
            });
        }
        static getDefaultFolder() {
            if (this.defaultFolderId !== 0) return Promise.resolve(this.defaultFolderId);
            return this.get().then(() => { return this.defaultFolderId });
        }
    }

    /**
     * @see https://github.com/SocialSisterYi/bilibili-API-collect
     */
    class biliAPI {
        static verify(resp: any, msg: any) {
            if (resp.code !== 0) {
                toast.error(msg + "失败", resp.code, resp.message);
                throw msg + "失败";
            }
            return resp;
        }
        static like(bool: any) {
            bool = bool ? 1 : 2;
            return post("//api.bilibili.com/x/web-interface/archive/like", {
                aid: API.aid,
                like: bool
            }, "application/json; charset=utf-8").then((resp: any) => biliAPI.verify(resp, "点赞"));
        }
        static follow() {
            return post("//api.bilibili.com/x/relation/modify", {
                aid: API.aid,
                fid: (<any>window).getAuthorInfo().mid,
                act: 1,
                re_src: 14
            }).then((resp: any) => {
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
            }).then((resp: any) => {
                resp = JSON.parse(resp);
                return biliAPI.verify(resp, "收藏");
            });
        }
        static triple() {
            return post("//api.bilibili.com/x/web-interface/archive/like/triple", {
                aid: API.aid
            }, "application/json; charset=utf-8").then((resp: any) => {
                biliAPI.verify(resp, "三连");
                var d = resp.data;
                if (d.coin && d.like && d.fav) return;
                if (!d.coin) toast.error("投币失败");
                if (!d.like) toast.error("点赞失败");
                if (!d.fav) toast.error("收藏失败");
                return d;
            });
        }
    }

    /**
     * 关联视频跳转按钮
     */
    class Link {
        /*
            extra = {
                aid: 2
                bvid: "BV1xx411c7mD"
                icon: "http://i0.hdslb.com/bfs/archive/03ef3f34944e0f78b1b4050fc3f9705d1fa905e3.png"
                posX: 333.5
                posY: 93.7
                title: "字幕君交流场所"
            }
        */
        content: any;
        aid: any;
        from: any;
        to: any;
        pos_x: any;
        pos_y: any;
        button: any;
        constructor(cdm: any, extra: any, from: any) {
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
            popupDiv.appendChild(button);
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
        resize(scaleX: any, scaleY: any) {
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
    API.loadCommandDm = (cdm: any[], aid: string | number, cid: string | number) => {
        if (aid != API.aid || cid != API.cid || popupDiv !== undefined) {
            // 正在“载入其他视频弹幕”，不必处理互动弹幕
            return;
        }
        init(); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
        load(cdm);
    }
})();
declare namespace API {
    /**
     * 载入互动弹幕
     * @param cdm 互动弹幕原始数据
     * @param aid aid
     * @param cid cid
     */
    function loadCommandDm(cdm: any[], aid: string | number, cid: string | number): void
}