/**
 * 本模块负责下载功能，主要是视频下载功能
 */
(function () {
    try {
        class Download {
            constructor() {
                /**
                 * 已获取类型列表
                 */
                this.type = [];
                /**
                 * 整理出的链接列表
                 */
                this.links = [];
                /**
                 * url序号对应的质量信息
                 * 暂缺杜比视界/杜比全景声部分
                 */
                this.quality = {
                    30280: "高音质",
                    30232: "中音质",
                    30216: "低音质",
                    30125: "HDR",
                    30121: "4K",
                    30120: "4K",
                    30116: '1080P60',
                    30112: '1080P+',
                    30106: '1080P+',
                    30102: '1080P+',
                    30080: '1080P',
                    30077: '1080P',
                    30076: '720P',
                    30074: '720P',
                    30066: '720P',
                    30064: '720P',
                    30048: "720P",
                    30033: '480P',
                    30032: '480P',
                    30016: '360P',
                    30015: '360P',
                    30011: '360P',
                    208: "1080P",
                    192: "720P",
                    160: "480P",
                    125: "HDR",
                    120: "4K",
                    116: "1080P60",
                    112: "1080P+",
                    80: "1080P",
                    74: "720P60",
                    64: "720P",
                    48: "720P",
                    32: "480P",
                    16: "360P",
                    15: "360P"
                };
                /**
                 * 颜色表
                 */
                this.color = {
                    "Dolby": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                    "HDR": "background-color: #ffe42b;background-image: linear-gradient(to right, #ffe42b, #dfb200);",
                    "4K": "background-color: #c0f;background-image: linear-gradient(to right, #c0f, #90f);",
                    "1080P60": "background-color: #c0f;background-image: linear-gradient(to right, #c0f, #90f);",
                    "1080P+": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                    "1080P": "background-color: #f00;background-image: linear-gradient(to right, #f00, #c00);",
                    "720P60": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                    "720P": "background-color: #f90;background-image: linear-gradient(to right, #f90, #d70);",
                    "480P": "background-color: #00d;background-image: linear-gradient(to right, #00d, #00a);",
                    "360P": "background-color: #0d0;",
                    "mp4": "background-color: #e0e;",
                    "avc": "background-color: #07e;",
                    "hev": "background-color: #7ba;",
                    "aac": "background-color: #07e;",
                    "flv": "background-color: #0dd;"
                };
                // 切P后清楚下载数据并移除下载面板
                API.switchVideo(() => { this.type = []; this.links = []; this.table && this.table.remove(); });
            }
            /**
             * 整理playurl返回值并提取其中的媒体链接记录到links
             * @param playinfo ajax返回的JSON数据
             */
            decodePlayinfo(playinfo) {
                playinfo.data && this.decodePlayinfo(playinfo.data);
                playinfo.result && this.decodePlayinfo(playinfo.result);
                playinfo.durl && this.durl(playinfo.durl);
                playinfo.dash && this.dash(playinfo.dash);
            }
            /**
             * 根据url确定画质/音质信息
             * 需要维护quality表
             * @param url 多媒体url
             * @returns 画质/音质信息
             */
            getQuality(url) {
                return this.quality[url.match(/[0-9]+\.((flv)|(mp4)|(m4s))/)[0].split(".")[0]] || "N/A";
            }
            /**
             * 整理dash部分
             * @param dash dash信息
             */
            dash(dash) {
                dash.video && this.dashVideo(dash.video, dash.duration);
                dash.audio && this.dashAudio(dash.audio, dash.duration);
            }
            /**
             * 整理dash视频部分
             * @param video dash视频信息
             * @param duration duration信息，配合bandwidth能计算出文件大小
             */
            dashVideo(video, duration) {
                video.forEach(d => {
                    const url = d.baseUrl || d.base_url;
                    let type = "";
                    if (!url)
                        return;
                    switch (d.codecs.includes("avc")) {
                        case true:
                            type = "avc";
                            break;
                        case false:
                            type = "hev";
                            break;
                    }
                    !this.type.includes("dash") && this.type.push("dash");
                    this.links.push({
                        type: type,
                        url: url,
                        quality: this.getQuality(url),
                        size: API.sizeFormat(d.bandwidth * duration / 8)
                    });
                });
            }
            /**
             * 整理dash音频部分
             * @param audio dash音频信息
             * @param duration duration信息，配合bandwidth能计算出文件大小
             */
            dashAudio(audio, duration) {
                audio.forEach(d => {
                    const url = d.baseUrl || d.base_url;
                    url && this.links.push({
                        type: "aac",
                        url: url,
                        quality: this.getQuality(url),
                        size: API.sizeFormat(d.bandwidth * duration / 8)
                    });
                });
            }
            /**
             * 整理durl部分
             * @param durl durl信息
             */
            durl(durl) {
                durl.forEach(d => {
                    let type = "";
                    switch (d.url.includes("mp4?")) {
                        case true:
                            type = "mp4";
                            !this.type.includes("mp4") && this.type.push("mp4");
                            break;
                        case false:
                            type = "flv";
                            !this.type.includes("flv") && this.type.push("flv");
                            break;
                    }
                    this.links.push({
                        type: type,
                        url: d.url,
                        quality: this.getQuality(d.url),
                        size: API.sizeFormat(d.size)
                    });
                });
            }
            /**
             * 右键下载相应
             */
            async contentMenu() {
                if (API.aid && API.cid) {
                    if (!this.links[0]) {
                        API.__playinfo__ && this.decodePlayinfo(API.__playinfo__);
                        const result = await Promise.all(config.downloadList.reduce((s, d) => {
                            !this.type.includes(d) && s.push(this.getContent(d));
                            return s;
                        }, []));
                        result.forEach(d => d && this.decodePlayinfo(d));
                    }
                    const title = this.getTitle();
                    this.links.forEach(d => {
                        !d.filename && (d.filename = title);
                    });
                    this.showTable();
                }
            }
            /**
             * 封装请求链接
             * 用于过滤Promise.all请求错误
             * @param d 请求类型
             * @returns 请求结果
             */
            async getContent(d) {
                let result;
                try {
                    switch (d) {
                        case "dash":
                            result = API.pgc ?
                                await API.getJson("api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: 80 }, true) :
                                await API.getJson("api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid, fnver: 0, fnval: 80 }, true);
                            break;
                        case "flv":
                            result = API.pgc ?
                                await API.getJson("api.bilibili.com/pgc/player/web/playurl", { avid: API.aid, cid: API.cid }, true) :
                                await API.getJson("api.bilibili.com/x/player/playurl", { avid: API.aid, cid: API.cid }, true);
                            break;
                        case "mp4":
                            result = API.pgc ?
                                await API.getJson("api.bilibili.com/pgc/player/api/playurlproj", { cid: API.cid }) :
                                await API.getJson("app.bilibili.com/v2/playurlproj", { cid: API.cid });
                            break;
                    }
                }
                catch (e) { }
                return result;
            }
            /**
             * 呼出下载面板
             */
            showTable() {
                if (!this.links[0])
                    return toast.warning("未获取到任何下载数据！");
                this.table && this.table.remove();
                this.table = API.addElement("div");
                const real = this.table.attachShadow({ mode: "closed" });
                const root = API.addElement("div", { class: "table" }, real);
                const cells = {};
                API.element.clickRemove(this.table);
                API.addCss(API.getCss("download.css"), undefined, real);
                this.links.forEach(d => {
                    const cell = cells[d.type] || API.addElement("div", { class: "cell" }, root);
                    if (!cells[d.type]) {
                        cells[d.type] = cell;
                        const div = API.addElement("div", { class: "type" }, cell, d.type);
                        this.color[d.type] && div.setAttribute("style", this.color[d.type]);
                    }
                    const item = API.addElement("a", { class: "item", target: "_blank" }, cell);
                    const up = API.addElement("div", { class: "up" }, item, d.quality);
                    this.color[d.quality] && up.setAttribute("style", this.color[d.quality]);
                    API.addElement("div", { class: "down" }, item, d.size);
                    item.onclick = () => {
                        /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-,.\/?%&=]*)?/.test(d.url) ?
                            this.postData(d) :
                            API.saveAs(d.url, d.filename || `download ${API.timeFormat(undefined, true)}.txt`, d.contentType || "text/plain");
                    };
                });
            }
            postData(data) {
                switch (config.downloadMethod) {
                    case "IDM+EF2":
                        "";
                        break;
                    case "aria2":
                        "";
                        break;
                    case "aira2 RPC":
                        "";
                        break;
                    default: this.rightKey(data);
                }
            }
            /**
             * 获取当前视频标题
             * @returns 标题
             */
            getTitle() {
                const title = document.title.split("_哔哩")[0];
                const p = location.href.includes("p=") ? location.href.match(/p=\d+/)[0].split("=")[1] : "";
                return p ? title + p : title;
            }
            /**
             * 从URL中提取可能的文件名和拓展名
             * @param url
             * @returns [文件名，拓展名]
             */
            getUrlFileName(url) {
                url = url.split("?")[0];
                const arr = url.split("/");
                return arr[arr.length - 1].split(".");
            }
            /**
             * 合成最终文件名
             * @param url 下载url，从中提取可能的文件名，优先级最低
             * @param type 下载资源类型，用于决定后缀名，优先级次之
             * @param filename 预设定文件名，优先级最高
             * @returns 文件名
             */
            setFinalName(url, type, filename = "") {
                let adv = "";
                let arr = this.getUrlFileName(url);
                let ars = filename.split(".");
                switch (type) {
                    case "mp4":
                        adv = ".mp4";
                        break;
                    case "flv":
                        adv = ".flv";
                        break;
                    case "aac":
                        adv = ".m4a";
                        break;
                    case "avc":
                        adv = ".avc.m4v";
                        break;
                    case "hev":
                        adv = ".hevc.m4v";
                        break;
                }
                adv = ars[1] || (adv ? adv : arr[1] ? `.${arr[1]}` : "");
                return (filename || arr[0]) + adv;
            }
            /**
             * 右键下载
             * @param data 下载数据
             */
            rightKey(data) {
                const root = API.element.popupbox({ width: "300px" });
                const name = this.setFinalName(data.url, data.type, data.filename);
                API.addElement("div", { style: "text-align: center;font-weight: bold;padding-block-end: 10px;" }, root, name);
                API.addElement("div", { style: "padding-block-end: 10px;" }, root, `<a href=${data.url} target="_blank" download="${name}">请在此处右键“另存为”以保存文件，IDM的话也可以右键“使用 IDM下载链接”。</a>`);
                API.addElement("div", { style: "font-size: 10px; padding-block-end: 10px;" }, root, '本方式下载不太稳定，不嫌麻烦的话可在设置中更换下载方式。');
            }
        }
        const download = new Download();
        API.downloadThis = () => download.contentMenu();
    }
    catch (e) {
        API.trace(e, "download.js", true);
    }
})();
