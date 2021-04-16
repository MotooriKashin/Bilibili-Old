(function () {

    var player, popupDiv;
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
        if (window.__INITIAL_STATE__ && __INITIAL_STATE__.videoData && window.player) {
            console.log('import module "commandDm.js"');
            if (popupDiv === undefined)
                popupDiv = initCountainer();
            player = window.player;
            bindEvents();
        }
    }

    /**
     * 添加互动弹幕
     * @param  {[]} commandDmRaw 从服务器获得的互动弹幕数据
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
        if (!videoWrap) return;
        let popupDiv = document.createElement("div");
        popupDiv.className = "bilibili-player-video-popup";
        videoWrap.appendChild(popupDiv);
        return popupDiv;
    }

    /**
     * 绑定播放器事件，使用window.player.bind
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
        document.querySelector("div.bilibili-player-video-control > div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku").addEventListener(
            "click",
            (event) => {
                let option = event.target.getAttribute("name");
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
     * @param {[]} commandDmRaw 互动弹幕原始数据
     * @returns {[]} 包含UI组件对象，都实现了相应的show() hide() destroy() resize()
     */
    function parseDm(commandDmRaw) {
        let result = [];
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
                    result.push(new Vote(cdm, extra, from));
                    break;
                // 5种特殊的滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
                case "#UP#":
                    break;
                case "#RESERVE#":
                    break;
                case "#LINK#":
                    result.push(new Link(cdm, extra, from));
                    break;
                case "#ACTOR#":
                    break;
                case "#ACTIVITYCOMBO#":
                    break;
            }
        }
        return result;
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
        constructor(cdm, extra, from) {
            // 这堆属性的定义代码是复制过来的，多余的属性留着备用
            this.total = extra.cnt;
            this.dmid = cdm.idStr;
            this.voteId = extra.vote_id;
            this.options = extra.options;
            this.question = extra.question;
            this.myVote = extra.my_vote; // 0：未投票  非零数字：已投票，my_vote的值即为已投项的idx
            this.duration = extra.duration / 1e3 || 5;
            this.mid = extra.mid;
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
            for (let i = 0, btn, cnt, opt; i < this.options.length; i++) {
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
        goVote(idx, i) {
            // 发送投票操作到服务器
            let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
            BLOD.xhr.post(url,
                BLOD.objUrl(null, {
                    aid: String(BLOD.aid),
                    cid: BLOD.cid,
                    progress: Math.max(Math.round(1e3 * player.getCurrentTime()), 1),
                    vote: idx,
                    vote_id: this.voteId,
                    csrf: BLOD.getCookies().bili_jct
                })).then((resp) => {
                    resp = JSON.parse(resp);
                    if (resp.code === 0) {
                        this.progress[i].className = "vote-progress vote-progress-blue";
                    } else {
                        BLOD.toast.error("投票失败", resp.code, resp.message);
                    }
                }).catch((e) => {
                    BLOD.toast.error("投票失败", e);
                });
            this.myVote = idx;
            this.showResult();
            this.to += 5; //点击投票后推迟5秒消失，防止结果消失太快来不及看
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
            let frame = (t) => {
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
        resize(scaleX, scaleY) {
            this.dialog.style.left = (this.pos_x * scaleX) + "px";
            this.dialog.style.top = (this.pos_y * scaleY) + "px";
            this.dialog.style.transform = "translateX(-50%) translateY(-50%) scale(" + (scaleX + scaleY) / 2 + ")";
        }
        destroy() {
        }
    }

    class Attention {

    }

    class Up {

    }

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
                    <img src="https://space.bilibili.com/favicon.ico">
                    <span>关联视频跳转</span>
                </div>
            */
            let button = divClass("link-button");
            let img = document.createElement("img");
            img.src = "https://space.bilibili.com/favicon.ico";
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
     * @param  {[]} cdm 互动弹幕原始数据
     * @param {String} aid aid
     * @param {String} cid cid
     */
    BLOD.loadCommandDm = (cdm, aid, cid) => {
        if (aid != BLOD.aid || cid != BLOD.cid || popupDiv !== undefined) {
            // 正在“载入其他视频弹幕”，不必处理互动弹幕
            return;
        }
        init(); // 切P后整个播放器会被销毁重建，需要重新绑定事件
        load(cdm);
    }
})()