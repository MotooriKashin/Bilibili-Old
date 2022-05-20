namespace API {
    export class SegProgress {
        static cssInited = false;
        constructor(resp: any) {
            if (!resp || resp.length == 0) return;
            this.init(resp);
        }
        async init(view_points: any) {
            if (!SegProgress.cssInited) {
                SegProgress.cssInited = true;
                addCss(`
                            .bilibili-progress-segmentation-logo{display:inline-block;position:absolute;top:-12px;height:30px;width:1px; transition: opacity .1s}
                            .bilibili-progress-segmentation-logo>img{position: absolute;top:-14px;transform:translate(-50%,-50%) scale(0.7);left:50%;transition:top 0.1s}
                            .bilibili-progress-segmentation-logo>svg{position: absolute;top: -19px;width: 32px;height: 36px;transform: translate(-50%, -50%)}
                            .bilibili-player.mode-widescreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-webfullscreen .bilibili-progress-segmentation-logo>img,
                            .bilibili-player.mode-fullscreen .bilibili-progress-segmentation-logo>img{top:-18px;left:50%;transform:translate(-50%,-50%) scale(1)}
                            .bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
                            .bilibili-progress-segmentation:hover > div > div{border-color:#fb7299;border-style:solid;border-width:0 2px;width:100%;height:3px;top:6px;left:-2px;position:relative;background:#fb7299}
                            .bilibili-progress-segmentation > div{box-sizing:border-box;border-style:solid;border-color:#fb7299;border-left-width:2px;position:absolute;width:100%;height:6px;top:12px}
                            .bilibili-progress-detail-chapter{top:-96px;position:absolute;width:100%;font-size:17px;font-weight:bold;color:#fff;text-shadow:0 0 5px #000}
                            .bilibili-progress-segmentation:last-child > div{border-right-width:2px}
                            .bilibili-player-filter-chapter:hover{color:#00a1d6}
                            .bilibili-player-chapterList{position:relative;height:100%;width:100%;overflow:auto}
                            .bilibili-player-chapterList::-webkit-scrollbar{width:6px}
                            .bilibili-player-chapterList::-webkit-scrollbar-track{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList::-webkit-scrollbar-thumb{border-radius:4px;background-color:#fff}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-track{background-color:#edf2f9}
                            .bilibili-player-chapterList:hover::-webkit-scrollbar-thumb{background-color:#a2a2a2}
                            .bilibili-player-chapter-info{width:100%;height:72px;margin-top:5px;white-space:normal;font-size:14px;position:relative;cursor:pointer}
                            .bilibili-player-chapter-info > img{position:absolute;left:15px;top:4px;border-radius:2px}
                            .bilibili-player-chapter-info > p{padding-top:5px;margin:0 5px 5px 138px;overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;height:43px}
                            .bilibili-player-chapter-info:hover > p{color:#00a1d6}
                            .bilibili-player-chapter-info > span{color:#99a2aa}
                            .bilibili-player-chapter-info.active{background-color:#f3f3f3}`);
            }
            let sliderTracker = <HTMLDivElement>document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker"); // 播放进度区域，6px
            let sliderBar = <HTMLElement>document.getElementsByClassName("bilibili-player-video-progress-bar")[0];
            let handleWidth = document.getElementsByClassName("bpui-slider-handle")[0].clientWidth; // 进度条圆形把手的宽度
            let trackerWrp = <HTMLElement>document.getElementsByClassName("bpui-slider-tracker-wrp")[0]; // 进度条可控区域，28px
            let videoDuration = (<any>window).player.getDuration(); // 视频总时长

            // 创建显示在视频预览缩略图上方的看点标题
            let chptName = document.createElement("div");
            chptName.className = "bilibili-progress-detail-chapter";
            (<HTMLDivElement>document.querySelector(".bilibili-player-video-progress-detail")).appendChild(chptName);

            // 添加分段进度条
            let type = view_points[0].type; // type = 1：赛事看点，type = 2：视频分段
            let segDivs: Array<HTMLElement> = []; // 存放所有分段Div

            for (let v of view_points) {
                let seg = document.createElement("div");
                if (type == "1") {
                    seg.className = "bilibili-progress-segmentation-logo";
                    let title = document.createElement("div"); // 看点标题
                    title.innerHTML = "-> " + v.content;
                    title.className = "bilibili-progress-detail-chapter";
                    title.style.cssText = "width: auto; transform: translateX(-50%); display: none";
                    let img: HTMLImageElement | SVGSVGElement;
                    if (v.logoUrl) {
                        img = <HTMLImageElement>document.createElement("img"); // 看点图标
                        img.id = "segmentation-logo"; img.width = 32; img.height = 36; img.src = v.logoUrl;
                    } else {
                        img = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        img.setAttribute("viewBox", "0 -3 32 36");
                        img.innerHTML = `
                    <defs>
                    <radialGradient id="gradient">
                            <stop offset="10%" stop-color="#ffe78f"></stop>
                            <stop offset="40%" stop-color="#ffe996"></stop>
                            <stop offset="95%" stop-color="#fcecae"></stop>
                        </radialGradient>
                    </defs>
                    <path style="fill: rgb(252, 236, 174); stroke: rgb(252, 236, 174);" d="M 16 32.097 C 13.312 32.106 10.608 30.145 11 25.897 C 11.265 22.744 16 17.097 16 17.097 C 16 17.097 20.822 22.697 21.022 25.897 C 21.322 30.097 18.801 32.088 16 32.097 Z" transform="matrix(-1, 0, 0, -1, 32.021761, 49.196602)"></path>
                    <circle cx="16" cy="22" r="5" fill="url(#gradient)"/>`;
                    }
                    img.addEventListener("mousemove", e => e.stopPropagation());
                    img.addEventListener("mouseenter", () => {
                        title.style.display = "";
                        img.style.zIndex = "1000";
                    });
                    img.addEventListener("mouseleave", () => {
                        title.style.display = "none";
                        img.style.zIndex = "";
                    });
                    img.addEventListener("click", () => (<any>window.player).seek(v.from));
                    seg.appendChild(title);
                    seg.appendChild(img);
                } else if (type == "2") {
                    seg.className = "bilibili-progress-segmentation";
                    let duration = view_points[view_points.length - 1].to;
                    let ratio = videoDuration / duration / duration;
                    seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                    seg.style.left = v.from * ratio * 100 + "%";
                    seg.innerHTML = "<div><div></div></div>";
                    seg.onmouseenter = () => chptName.innerHTML = v.content;
                }
                segDivs.push(seg);
                sliderTracker.appendChild(seg);
            }
            if (type == "1") {
                addCss(`#app #bilibiliPlayer .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-img {top:-120px}
                            .bilibili-player-video-progress-detail > .bilibili-player-video-progress-detail-time {top:-48px}`);
                function update() { // 刷新看点标记的位置
                    for (let i = 0; i < segDivs.length; i++) {
                        // 进度条上的鼠标坐标与视频时间点的互算公式，从bilibiliPlayer.js复制过来
                        // 使视频看点标记与点击进度条后实际跳转的时间点准确对应
                        segDivs[i].style.left = view_points[i].to / videoDuration * (trackerWrp.clientWidth - handleWidth) + handleWidth / 2 + "px";
                    }
                }
                setTimeout(() => update(), 500); // 等待进度条完全加载
                chptName.style.top = "-150px";
                let playerArea = <HTMLElement>document.getElementsByClassName("bilibili-player-area")[0], visibility = true;
                function hide() {
                    if (!visibility) return;
                    visibility = false;
                    for (let i = 0; i < segDivs.length; i++) segDivs[i].style.opacity = "0";
                    setTimeout(() => {
                        for (let i = 0; i < segDivs.length; i++)
                            segDivs[i].style.visibility = "hidden";
                    }, 100);
                }
                playerArea.addEventListener("mouseleave", e => {
                    hide();
                });
                playerArea.addEventListener("mousemove", e => {
                    let clientRect = playerArea.getBoundingClientRect();
                    if (e.pageY < clientRect.top + window.scrollY + clientRect.height * 0.65) {
                        hide();
                    } else {
                        visibility = true;
                        for (let i = 0; i < segDivs.length; i++) {
                            segDivs[i].style.visibility = "";
                            segDivs[i].style.opacity = "1";
                        }
                    }
                });
                // 鼠标与看点图标的交互
                trackerWrp.addEventListener("mousemove", e => {
                    let closestPoint = 1e6;
                    // 鼠标位置->视频时间点
                    let box = sliderBar.getBoundingClientRect();
                    let pos = (e.pageX - (box.left + window.scrollX - document.body.clientLeft) - handleWidth / 2) / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    0 > pos && (pos = 0);
                    pos > videoDuration && (pos = videoDuration);
                    let thumbnailArea = 80 / (trackerWrp.clientWidth - handleWidth) * videoDuration;
                    let hitArea = trackerWrp.clientWidth > 400 ? thumbnailArea / 10 : thumbnailArea / 20; // 显示标题的鼠标坐标范围
                    for (let i = 0; i < view_points.length; i++) {
                        segDivs[i].style.zIndex = "";
                        if (view_points[i].to >= pos - hitArea && view_points[i].to <= pos + hitArea && Math.abs(view_points[i].to - pos) < closestPoint) {
                            chptName.innerHTML = view_points[i].content;
                            closestPoint = Math.abs(view_points[i].to - pos);
                            segDivs[i].style.zIndex = "1000";
                        }
                    }
                    if (closestPoint == 1e6) chptName.innerHTML = "";
                });
                (<any>window).player.addEventListener("video_player_resize", () => update());
                trackerWrp.addEventListener("mouseleave", () => {
                    for (let i = 0; i < segDivs.length; i++) {
                        segDivs[i].className = "bilibili-progress-segmentation-logo";
                    }
                });
            }

            // 添加“视频看点”面板
            let wrapList = <HTMLDivElement>document.querySelector("div.bilibili-player-wraplist"); // 获取播放器右侧面板的容器div
            let panels = wrapList.children;
            let chptInfo: any = null; // 数组，存放每一看点的UI卡片

            let chptPanel = document.createElement("div"); // “视频看点”面板
            chptPanel.style.display = "none";
            chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
            wrapList.appendChild(chptPanel);

            let chptBtn = document.createElement("div"); // “视频看点”按钮
            chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
            chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
            (<any>document.querySelector("div.bilibili-player-filter")).appendChild(chptBtn);

            // 用当前播放进度刷新面板
            function refreshState() {
                if (!chptInfo) return;
                let progress = (<any>window).player.getCurrentTime();
                for (let i = 0, v; i < view_points.length; i++) {
                    v = view_points[i];
                    if (progress < v.to) {
                        let active = document.querySelector(".bilibili-player-chapter-info.active");
                        active && active.classList.remove("active");
                        chptInfo[i].classList.add("active");
                        break;
                    }
                }
            }
            let timeFormat = (t: any) => t < 10 ? "0" + t : t;
            chptBtn.onclick = () => {
                let activePanel = <HTMLDivElement>document.querySelector("div.bilibili-player-filter-btn.active");
                if (activePanel == chptBtn) return;
                // 切换按钮的激活状态
                activePanel.classList.remove("active");
                chptBtn.classList.add("active");
                for (let i = 0; i < panels.length; i++) {
                    const element = <HTMLDivElement>panels[i];
                    if (element.style.display == "block") {
                        element.style.display = "none";
                        break;
                    }
                }
                // 创建各个看点对应的UI卡片
                if (!chptInfo) {
                    chptInfo = [];
                    for (let i = 0, v; i < view_points.length; i++) {
                        v = view_points[i];
                        let dura = v.to - v.from;
                        let div = document.createElement("div");
                        div.className = "bilibili-player-chapter-info";
                        div.innerHTML = `<img width="112" height="63" src="${v.imgUrl}"/>
                                        <p class="chapter-name">${v.content}</p>
                                        <span style="margin-left: 138px">${timeFormat(Math.floor(v.from / 60))}:${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">${dura >= 60 ? `${Math.floor(dura / 60)}分` : ""}${dura > 0 ? `${dura % 60}秒` : ""}</span>`;
                        div.onclick = (jumpto => () => {
                            (<any>window).player.seek(jumpto);
                            let active = document.querySelector(".bilibili-player-chapter-info.active");
                            active && active.classList.remove("active");
                            div.classList.add("active");
                        })(v.from);
                        chptInfo[i] = div;
                        chptPanel.appendChild(div);
                    }
                };
                chptPanel.style.display = "block";
                // 将当前的播放进度对应的UI卡片显示为灰色底色
                refreshState();
            }
            (<any>window).player.addEventListener("video_media_seeked", refreshState);
            chptPanel.onmouseenter = refreshState;
            class timer {
                static handle: any;
                static start() { if (!timer.handle) timer.handle = setInterval(refreshState, 3000) }
                static stop() { if (timer.handle) { clearInterval(timer.handle); timer.handle = null } }
            }
            (<any>window).player.addEventListener("video_media_playing", timer.start);
            (<any>window).player.addEventListener("video_media_pause", timer.stop);
            if ((<any>window).player.getState() == "PLAYING") timer.start();
        }
    }
}