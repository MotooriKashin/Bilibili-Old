import { debug } from "../debug";
import { addCssEs } from "../element/addElement";
import { objUrl } from "../format/url";
import { getCookies } from "../cookies";
import { toast } from "../toast/toast";
import { biliQuickLogin } from "../unit";
import { uid } from "../variable/uid";
import { xhr } from "../xhr";
import { VAR } from "../variable/variable";

addCssEs("runtime/danmaku/commandDm.css");
let player: any, widgetContainer: any;
let playing = false;
let visible = true;
let commandDm = {
    visible: [], // 可见的互动弹幕
    hidden: []   // 未显示的互动弹幕
};

/** 初始化互动弹幕功能 */
function init(cdm: any) {
    if (VAR.player) {
        if (widgetContainer === undefined)
            widgetContainer = initContainer();
        player = VAR.player;
        bindEvents();
        load(cdm);
    } else throw "获取window.player失败";
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
function initContainer() {
    let videoWrap = document.getElementsByClassName("bilibili-player-video-wrap")[0];
    if (!videoWrap) throw "未能获取播放器div";
    let widgetContainer = document.createElement("div");
    widgetContainer.className = "bilibili-player-video-popup";
    videoWrap.appendChild(widgetContainer);
    return widgetContainer;
}

/** 绑定播放器事件，使用window.player.addEventListener */
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
                widgetContainer.style.display = "none";
            } else if (option == "ctlbar_danmuku_on") {
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
function parseDm(commandDmRaw: any[]) {
    let popupWindow = [];
    for (let i = 0, cdm, extra, from; i < commandDmRaw.length; i++) {
        cdm = commandDmRaw[i];
        extra = JSON.parse(cdm.extra);
        from = cdm.progress / 1000;
        switch (cdm.command) {
            // 4种将会弹出界面的互动弹幕(见原生代码appendPopup())
            case "#ATTENTION#":
            case "#ACTORFOLLOW#":
            case "#MANAGERFOLLOW#":
                debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                debug.warn(cdm);
                break;
            case "#VOTE#": // 投票弹窗
                popupWindow.push(new Vote(cdm, extra, from));
                break;
            case "#GRADE#": // 评分弹窗
                popupWindow.push(new Grade(cdm, extra, from));
                break;
            // 滚动弹幕(见原生代码appendDmImg())，它们的渲染也许需要去修改原生弹幕渲染器
            case "#LINK#":
                popupWindow.push(new Link(cdm, extra, from));
                break;
            case "#RESERVE#":
            case "#ACTOR#":
            case "#ACTIVITYCOMBO#":
                debug.warn("未被支持的互动弹幕类型：" + cdm.command);
                debug.warn(cdm);
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

/** 播放器大小更改时触发 */
function resize() {
    // 获得当前播放器显示分辨率与最小分辨率(680x504)时的缩放比，用于UI缩放
    let scaleX = widgetContainer.clientWidth / 680;
    let scaleY = widgetContainer.clientHeight / 504;
    for (let i = 0; i < commandDm.visible.length; i++) {
        (<any>commandDm.visible[i]).resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
    }
    for (let i = 0; i < commandDm.hidden.length; i++) {
        (<any>commandDm.hidden[i]).resize(scaleX, scaleY, widgetContainer.clientWidth, widgetContainer.clientHeight);
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
            resize();
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

function isLoggedin() {
    if (uid) return true;
    player.pause();
    toast.warning("请先登录！")
    biliQuickLogin();
}

function post(url: string, data: any, contentType = "application/x-www-form-urlencoded;charset=UTF-8") {
    data.csrf = getCookies().bili_jct;
    return xhr({
        url: url,
        data: objUrl("", data),
        headers: { "Content-Type": contentType },
        method: "POST",
        credentials: true
    });
}

/** 弹窗组件 */
class PopupWindow {
    popup: HTMLElement;
    duration: number;
    from: number;
    to: number;
    pos_x: number;
    pos_y: number;
    constructor(cdm: any, extra: any, from: any) {
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
    resize(scaleX: any, scaleY: any, containerWidth: any, containerHeight: any) {
        this.popup.style.transform = "translateX(-50%) translateY(-50%) scale(" + Math.min((scaleX + scaleY) / 2, 1.5) + ")";
        let left = this.pos_x * scaleX;
        let top = this.pos_y * scaleY;
        left = Math.max(left, this.popup.clientWidth / 2);
        top = Math.max(top, this.popup.clientHeight / 2);
        left = Math.min(left, containerWidth - this.popup.clientWidth / 2);
        top = Math.min(top, containerHeight - this.popup.clientHeight / 2);
        this.popup.style.left = left + "px";
        this.popup.style.top = top + "px";
    }
}

/** 投票互动UI */
class Vote extends PopupWindow {
    total: any;
    voteId: any;
    options: any;
    question: any;
    myVote: any;
    dialog: any;
    result: any;
    button: any;
    count: any;
    progress: any;
    constructor(cdm: any, extra: any, from: any) {
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
        for (let i = 0, btn: any, opt: any; i < this.options.length; i++) {
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
        };
    }
    goVote(idx: any, i: any) {
        if (isLoggedin()) {
            this.total += 1;
            this.options[i].cnt += 1;
            // 发送投票操作到服务器
            let url = "//api.bilibili.com/x/web-interface/view/dm/vote";
            post(url, {
                aid: VAR.aid,
                cid: VAR.cid,
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
    /** 投票结果的动画 */
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
    /*
    avg_score: 8.7  <= 平均评分
    count: 2990
    duration: 5000
    grade_id: 14369
    mid_score: 0    <= 当前用户的评分
    msg: "评分标题"  <= 最长为8个汉字
    posX: 344
    posY: 159
    skin_selected: "http://i0.hdslb.com/bfs/b/ee3aca3dbc22087341cf312d71a1354af527e444.png"
    skin_unselected: "http://i0.hdslb.com/bfs/b/1d8fc3daf9201d70189a3778e605d2acf9cae7e9.png"
    */
    gradeInfo: any;
    scoreInfo: any;
    scoreButton: any;
    constructor(cdm: any, info: any, from: any) {
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
        let scoreArea = <HTMLElement>this.popup.getElementsByClassName("grade-score-area")[0];
        let scoreButton: any[] = [];
        function highlightScores(i: number) {
            for (let m = 0; m < 5; m++) {
                if (m <= i && !scoreButton[m].highlight) {
                    scoreButton[m].highlight = true;
                    scoreButton[m].className = "highlight";
                } else if (m > i && scoreButton[m].highlight) {
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
                <img width=20 hegiht=20 src="${info.skin_selected}" class="score-button"></img>`
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
                }
            }
        };
        if (info.mid_score === 0)
            scoreArea.onmouseleave = () => highlightScores(-1);
        this.scoreButton = scoreButton;
        if (info.mid_score != 0) {
            this.showResult();
            highlightScores(info.mid_score / 2 - 1);
            scoreArea.classList.remove("pointer");
        }
    }
    goGrade(score: number) {
        post("https://api.bilibili.com/x/v2/dm/command/grade/post", {
            aid: VAR.aid,
            cid: VAR.cid,
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
/** 用于获取收藏列表有关信息 */
class favList {
    static list = []
    static defaultFolderId = 0
    static get() {
        if (this.list.length > 0) return Promise.resolve(this.list);
        return xhr({
            url: objUrl("//api.bilibili.com/x/v3/fav/folder/created/list-all", {
                type: 2,
                rid: VAR.aid,
                up_mid: uid
            }),
            credentials: true
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

/** @see https://github.com/SocialSisterYi/bilibili-API-collect */
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
            aid: VAR.aid,
            like: bool
        }, "application/json; charset=utf-8").then((resp: any) => biliAPI.verify(resp, "点赞"));
    }
    static follow() {
        return post("//api.bilibili.com/x/relation/modify", {
            aid: VAR.aid,
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
            rid: VAR.aid,
            type: 2,
            add_media_ids: favList.defaultFolderId,
        }).then((resp: any) => {
            resp = JSON.parse(resp);
            return biliAPI.verify(resp, "收藏");
        });
    }
    static triple() {
        return post("//api.bilibili.com/x/web-interface/archive/like/triple", {
            aid: VAR.aid
        }, "application/json; charset=utf-8").then((resp: any) => {
            biliAPI.verify(resp, "三连");
            let d = resp.data;
            if (d.coin && d.like && d.fav) return;
            if (!d.coin) toast.error("投币失败");
            if (!d.like) toast.error("点赞失败");
            if (!d.fav) toast.error("收藏失败");
            return d;
        });
    }
}

/** 关联视频跳转按钮 */
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
        widgetContainer.appendChild(button);
        this.button = button;
    }
    show() {
        this.button.style.display = "block";
    }
    hide() {
        this.button.style.display = "none";
    }
    /** 根据视频区域大小缩放，放大倍数限制在最大1.5倍 */
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
export async function loadCommandDm(cdm: any[], aid: string | number, cid: string | number) {
    try {
        if (aid != aid || cid != cid || (widgetContainer !== undefined && (<HTMLDivElement>document.getElementById("bilibiliPlayer")).contains(widgetContainer))) {
            // 正在“载入其他视频弹幕”，不必处理互动弹幕
            return;
        }
        init(cdm); // 由于切P后整个播放器会被销毁重建，每次载入互动弹幕都需要重新绑定事件
    } catch (e) {
        toast.error("互动弹幕组件出错~");
        debug.error("互动弹幕组件出错~", e);
    }
}