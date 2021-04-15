(function () {
    // 测试用例 (av374310136)
    const commandDmForTest = [
        {
            "id": "45699475678691336",
            "oid": "302685251",
            "mid": "29959830",
            "command": "#VOTE#",
            "content": "投票弹幕",
            "progress": 153000,
            "ctime": "2021-02-26 10:36:48",
            "mtime": "2021-03-25 18:22:42",
            "extra": "{\"vote_id\":703019,\"question\":\"你觉得这个功能好玩吗？\",\"cnt\":22348,\"options\":[{\"idx\":1,\"desc\":\"好玩\",\"cnt\":15786},{\"idx\":2,\"desc\":\"非常好玩\",\"cnt\":6596}],\"icon\":\"http://i0.hdslb.com/bfs/album/5ec559dbd4d54f8c1e76021d52eb9807de94bfb9.png\",\"my_vote\":1,\"pub_dynamic\":false,\"posX\":194,\"posY\":196.49823321554769,\"duration\":5000}",
            "idStr": "45699475678691335"
        },
        {
            "id": "45699503076933640",
            "oid": "302685251",
            "mid": "29959830",
            "command": "#ATTENTION#",
            "content": "关注弹幕",
            "progress": 261400,
            "ctime": "2021-02-26 10:37:40",
            "mtime": "2021-02-26 10:59:45",
            "extra": "{\"duration\":5000,\"posX\":129,\"posY\":180,\"icon\":\"http://i0.hdslb.com/bfs/album/ea58d134636f05ddc208a13889dd054ae45eb6ef.png\",\"type\":2}",
            "idStr": "45699503076933639"
        },
        {
            "id": "45700004947951624",
            "oid": "302685251",
            "mid": "29959830",
            "command": "#UP#",
            "content": "哈哈哈，糟了被发现了",
            "progress": 28186,
            "ctime": "2021-02-26 10:53:38",
            "mtime": "2021-02-26 10:57:59",
            "extra": "{\"icon\":\"http://i0.hdslb.com/bfs/face/1f0ff00ad152f286f1dc47af2aadc0abfe221921.jpg\"}",
            "idStr": "45700004947951621"
        }
    ];

    var player, popupDiv;
    var playing = false;
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
            player = window.player;
            popupDiv = initCountainer();
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
            VIDEO_RESIZE: "video_resize",
            VIDEO_PLAYER_RESIZE: "video_player_resize",
        };
        player.bind(EVENT.VIDEO_MEDIA_PLAYING, play);
        player.bind(EVENT.VIDEO_MEDIA_PAUSE, pause);
        player.bind(EVENT.VIDEO_MEDIA_SEEK, pause);
        player.bind(EVENT.VIDEO_MEDIA_SEEKED, play);
        player.bind(EVENT.VIDEO_MEDIA_ENDED, pause);
        player.bind(EVENT.VIDEO_PLAYER_RESIZE, resize);
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
        playing = true;
        loop();
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
        my_vote: 0      <= 0：未投票 1：已投票
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
            this.myVote = extra.my_vote;
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
            let button = [];
            for (let i = 0, btn, count, opt; i < this.options.length; i++) {
                // 投票按钮
                opt = this.options[i];
                btn = divClass("vote-button");
                btn.innerHTML = opt.desc;
                btn.setAttribute("idx", opt.idx);
                btn.onclick = () => this.goVote(i);
                button[i] = btn;
                optionDiv.appendChild(btn);
                // 结果数据
                count = divClass("vote-count");
                count.innerHTML = opt.cnt + "票";
                result.appendChild(count);
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
        }
        goVote(i) {
            // 发送投票操作到服务器...
            this.showResult(i);
        }
        showResult(selected) {
            this.result.style.display = "flex";
            // 显示票数、比例条
            for (let i = 0, progress, desc; i < this.button.length; i++) {
                this.button[i].onclick = null;
                this.button[i].innerHTML = "";
                this.button[i].className = "vote-progress-bg";
                progress = divClass(i === selected ? "vote-progress vote-progress-blue" : "vote-progress");
                progress.style.width = "0";
                desc = divClass("vote-progress-desc");
                desc.innerHTML = this.options[i].desc;
                progress.appendChild(desc);
                this.button[i].appendChild(progress);
                requestAnimationFrame(() => progress.style.width = (this.options[i].cnt / this.total * 100) + "%");
            }
        }
        show() {
            this.dialog.style.display = "flex";
            this.dialog.className = "vote-dialog vote-dialog-show";
        }
        hide() {
            this.dialog.style.display = "none";
            this.dialog.className = "vote-dialog";
        }
        resize(scaleX, scaleY) {
            this.dialog.style.left = (this.pos_x * scaleX) + "px";
            this.dialog.style.top = (this.pos_y * scaleY) + "px";
            this.dialog.style.transform = "translateX(-50%) translateY(-50%) scale(" + (scaleX + scaleY) / 2 + ")";
        }
        destroy() {
            this.dialog.remove();
            this.dialog = null;
        }
    }

    class Attention {

    }

    class Up {

    }

    /**
     * 程序入口
     * @param  {[]} cdm 互动弹幕原始数据，留空则载入测试用数据
     */
    BLOD.test = (cdm) => {
        init();
        load(cdm ? cdm : commandDmForTest);
    }
})()