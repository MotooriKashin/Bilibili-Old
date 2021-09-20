/**
 * 本模块负责添加分段进度条
 */
(function () {
    try {
        class SegProgress {
            constructor(resp) {
                if (!resp.data.view_points || resp.data.view_points.length == 0)
                    return;
                this.init(resp.data.view_points);
            }
            async init(view_points) {
                if (!SegProgress.cssInited) {
                    SegProgress.cssInited = true;
                    API.addCss(`.bilibili-progress-segmentation{height:29px;position:absolute;top:-12px}
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
                let duration = view_points[view_points.length - 1].to;
                let ratio = window.player.getDuration() / duration / duration;
                let sliderTracker = document.querySelector(".bilibili-player-video-progress .bpui-slider-tracker"); // 播放器进度条的div  // 播放器进度条的div
                let chptName = document.createElement("div"); // 显示在视频预览缩略图上方的看点标题
                chptName.className = "bilibili-progress-detail-chapter";
                document.querySelector(".bilibili-player-video-progress-detail").appendChild(chptName);
                // 添加分段进度条
                for (let v of view_points) {
                    let seg = document.createElement("div");
                    seg.className = "bilibili-progress-segmentation";
                    seg.style.width = (v.to - v.from) * ratio * 100 + "%";
                    seg.style.left = v.from * ratio * 100 + "%";
                    seg.innerHTML = '<div><div></div></div>';
                    seg.onmouseenter = (content => () => chptName.innerHTML = content)(v.content);
                    sliderTracker.appendChild(seg);
                }
                // 添加“视频看点”面板
                let wrapList = document.querySelector("div.bilibili-player-wraplist"); // 获取播放器右侧面板的容器div
                let panels = wrapList.children;
                let chptInfo = null; // 数组，存放每一看点的UI卡片
                let chptPanel = document.createElement("div"); // “视频看点”面板
                chptPanel.style.display = "none";
                chptPanel.className = "bilibili-player-filter-wrap bilibili-player-chapterList";
                wrapList.appendChild(chptPanel);
                let chptBtn = document.createElement("div"); // “视频看点”按钮
                chptBtn.className = "bilibili-player-filter-btn bilibili-player-filter-chapter bpui-component bpui-button bpui-button-type-small button";
                chptBtn.innerHTML = '<span class="bpui-button-text"><span>视频看点</span></span>';
                document.querySelector("div.bilibili-player-filter").appendChild(chptBtn);
                // 用当前播放进度刷新面板
                function refreshState() {
                    if (!chptInfo)
                        return;
                    let progress = window.player.getCurrentTime();
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
                let timeFormat = (t) => t < 10 ? "0" + t : t;
                chptBtn.onclick = () => {
                    let activePanel = document.querySelector("div.bilibili-player-filter-btn.active");
                    if (activePanel == chptBtn)
                        return;
                    // 切换按钮的激活状态
                    activePanel.classList.remove("active");
                    chptBtn.classList.add("active");
                    for (let i = 0; i < panels.length; i++) {
                        const element = panels[i];
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
                            let div = document.createElement("div");
                            div.className = "bilibili-player-chapter-info";
                            div.innerHTML = `<img width="112" height="63" src="${v.imgUrl}"/>
                                        <p class="chapter-name">${v.content}</p>
                                        <span style="margin-left: 138px">${timeFormat(Math.floor(v.from / 60))}:${timeFormat(v.from % 60)}</span>
                                        <span style="margin-right: 5px; float: right;">${(v.to - v.from) >= 60 ? `${Math.floor((v.to - v.from) / 60)}分` : ""}${(v.to - v.from) % 60}秒</span>`;
                            div.onclick = (jumpto => () => {
                                window.player.seek(jumpto);
                                let active = document.querySelector(".bilibili-player-chapter-info.active");
                                active && active.classList.remove("active");
                                div.classList.add("active");
                            })(v.from);
                            chptInfo[i] = div;
                            chptPanel.appendChild(div);
                        }
                    }
                    ;
                    chptPanel.style.display = "block";
                    // 将当前的播放进度对应的UI卡片显示为灰色底色
                    refreshState();
                };
                window.player.addEventListener("video_media_seeked", refreshState);
                chptPanel.onmouseenter = refreshState;
                class timer {
                    static start() { if (!timer.handle)
                        timer.handle = setInterval(refreshState, 3000); }
                    static stop() { if (timer.handle) {
                        clearInterval(timer.handle);
                        timer.handle = null;
                    } }
                }
                window.player.addEventListener("video_media_playing", timer.start);
                window.player.addEventListener("video_media_pause", timer.stop);
                if (window.player.getState() == "PLAYING")
                    timer.start();
            }
        }
        SegProgress.cssInited = false;
        API.segProgress = (data) => { new SegProgress(data); };
    }
    catch (e) {
        API.trace(e, "segProgress.js", true);
    }
})();
