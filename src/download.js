/*
 * @module "download.js"
 * @description 下载组件，按需加载，挂载在BLOD下
 * @method download.init [添加播放器右键菜单] || download [呼出下载面板]
 */
(function () {
    const BLOD = window.BLOD;
    const toast = BLOD.toast;

    class Download {
        constructor() {
            console.debug('import module "download.js"');
            this.qua = { 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
            this.bps = { 30216: "64kbps", 30232: "128kbps", 30280: "320kbps" };
        }
        init(node) {
            if (!BLOD.config.reset.download) return;
            let li = document.createElement("li");
            li.innerHTML = '<a class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            node.firstChild.appendChild(li);
            li.firstChild.onclick = () => this.setTable();
        }
<<<<<<< HEAD
        async setTable() {
            toast("正在获取视频下载地址...")
            let qua = { 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
            let bps = { 30216: "64kbps", 30232: "128kbps", 30280: "320kbps" };
=======
        /**
         * 呼出下载面板
         */
        async setTable(url) {
            if (url) return this.custom(url);
            toast("正在获取视频下载地址...");
>>>>>>> b93be8e (自定义下载)
            let path = BLOD.__playinfo__ ? (BLOD.__playinfo__.data || (BLOD.__playinfo__.durl && BLOD.__playinfo__) || BLOD.__playinfo__.result) : {};
            if (!BLOD.mdf) {
                path = path || {}
                let pro = [this.geturl()];
                path && !path.durl && pro.push(this.geturl("flv"));
                path && !path.dash && pro.push(this.geturl("dash"));
                BLOD.mdf = {};
                BLOD.mdf.quee = BLOD.mdf.quee || await Promise.all(pro);
                this.quee(BLOD.mdf.quee);
                this.durl(path);
                this.dash(path);
            }
            this.other();
            this.item();
        }
        /**
         * 自定义下载URL
         * @param {string} url 视频链接
         */
        async custom(url) {
            if (url && !url.includes("?")) url = "?" + url;
            let obj = BLOD.urlObj(url);
            BLOD.pgc = undefined;
            this.aid = url.match(/[aA][vV][0-9]+/) ? url.match(/[aA][vV][0-9]+/)[0].match(/\d+/)[0] : undefined;
            this.aid = this.aid || obj.aid || undefined;
            this.aid = this.aid || (/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/.test(url) ? BLOD.abv(url.match(/[bB][vV]1[fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{9}/)[0]) : undefined);
            this.aid = this.aid || (obj.bvid ? BLOD.abv(obj.bvid) : undefined);
            try {
                if (this.aid) {
                    this.cid = obj.cid || undefined;
                    if (!this.cid) {
                        this.p = obj.p || 1;
                        this.data = BLOD.jsonCheck(await BLOD.xhr(BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": this.aid }))).data[this.p - 1];
                        this.cid = this.data.cid;
                        toast("正在请求av视频数据", "分P名称：" + this.data.part);
                    }
                } else {
                    this.ssid = url.match(/[sS][sS][0-9]+/) ? url.match(/[sS][sS][0-9]+/)[0].match(/\d+/)[0] : undefined;
                    this.ssid = this.ssid || obj.season_id || undefined;
                    if (this.ssid) {
                        this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { season_id: this.ssid }));
                    } else {
                        this.epid = url.match(/[eE][pP][0-9]+/) ? url.match(/[eE][pP][0-9]+/)[0].match(/\d+/)[0] : undefined;
                        this.epid = this.epid || obj.ep_id || undefined;
                        if (this.epid) this.data = await BLOD.xhr(BLOD.objUrl("https://bangumi.bilibili.com/view/web_api/season", { ep_id: this.epid }));
                    }
                    if (this.data) {
                        this.data = BLOD.iniState.bangumi(this.data, this.epid);
                        this.aid = this.data.epInfo.aid;
                        this.cid = this.data.epInfo.cid;
                        BLOD.pgc = 1;
                        toast("正在请求Bangumi数据", "系列名称：" + this.data.mediaInfo.title, "分p名称：" + this.data.epInfo.index_title);
                    }
                }
                if (this.aid && this.cid) {
                    BLOD.mdf = {};
                    let pro = [this.geturl("", this.aid, this.cid), this.geturl("flv", this.aid, this.cid), this.geturl("dash", this.aid, this.cid)];
                    BLOD.mdf.quee = BLOD.mdf.quee || await Promise.all(pro);
                    this.quee(BLOD.mdf.quee);
                    this.item();
                    BLOD.pgc = undefined;
                } else {
                    toast.warning("请输入有效的视频链接", "支持完整av/BV/bangumi链接，如https://www.bilibili.com/video/av50619577", "也支持视频关键参数，如aid、bvid、ssid、epid");
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("自定义下载", ...e); }

        }
        item() {
            let timer, top = document.getElementById("bili-old-download-table");
            if (top) {
                // 刷新下载面板
                top.remove();
                // 释放bolb残留
                if (BLOD.bloburl.xml) {
                    window.URL.revokeObjectURL(BLOD.bloburl.xml);
                    BLOD.bloburl.xml = "";
                }
            }
            if (!BLOD.mdf.mp4 && !BLOD.mdf.flv && !BLOD.mdf.dash) throw (toast.warning("未找到任何视频链接 ಥ_ಥ"), BLOD.mdf);
            top = document.createElement("div");
            top.setAttribute("id", "bili-old-download-table");
            if (BLOD.mdf.mp4) this.addBox(top, BLOD.mdf.mp4, "mp4", "download-mp4");
            if (BLOD.mdf.dash) {
                if (BLOD.mdf.dash.avc) this.addBox(top, BLOD.mdf.dash.avc, "avc", "download-avc");
                if (BLOD.mdf.dash.hev) this.addBox(top, BLOD.mdf.dash.hev, "hev", "download-hev");
                if (BLOD.mdf.dash.aac) this.addBox(top, BLOD.mdf.dash.aac, "aac", "download-aac");
            }
            if (BLOD.mdf.flv) this.addBox(top, BLOD.mdf.flv, "flv", "download-flv");
            if (BLOD.mdf.xml) this.addBox(top, BLOD.mdf.xml, "其他", "download-xml", "360P");
            document.body.appendChild(top);
            toast.success("成功获取下载视频链接！")
            toast.info("请右键复制下载或者右键IDM下载链接", "直接复制链接无效！", "直接左键点击无效！")
            top.onmouseover = () => window.clearTimeout(timer);
            top.onmouseout = () => {
                timer = window.setTimeout(() => {
                    top.remove();
                    if (BLOD.bloburl.xml) {
                        window.URL.revokeObjectURL(BLOD.bloburl.xml);
                        BLOD.bloburl.xml = "";
                    }
                }, 1000)
            }
        }
<<<<<<< HEAD
        quee(path, qua, bps) {
=======
        /**
         * 读取远程数据
         * @param {Object[]} path 远程函数的json数组，第一个为mp4
         */
        quee(path) {
>>>>>>> b93be8e (自定义下载)
            if (path[0] && path[0].durl) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push(["1080P", path[0].durl[0].url.replace("http:", ""), BLOD.sizeFormat(path[0].durl[0].size), ".mp4"]);
            }
            if (path[1]) {
                for (let i = 1; i < path.length; i++) {
                    let data = path[i].data || (path[i].durl && path[i]) || path[i].result || {};
                    this.durl(data);
                    this.dash(data);
                }
            }
        }
<<<<<<< HEAD
        dash(path, qua, bps) {
=======
        /**
         * 读取DASH数据
         * @param {Object} path 原始json
         */
        dash(path) {
>>>>>>> b93be8e (自定义下载)
            if (!path.dash) return;
            BLOD.mdf.dash = BLOD.mdf.dash || {};
            if (path.dash.video) {
                for (let i = 0; i < path.dash.video.length; i++) {
                    // 随机抽取下载链接
                    if (path.dash.video[i].backupUrl && path.dash.video[i].backupUrl[0]) {
                        path.dash.video[i].backupUrl.push(path.dash.video[i].baseUrl);
                        path.dash.video[i].baseUrl = BLOD.randomArray(path.dash.video[i].backupUrl)[0];
                    }
                    if (path.dash.video[i].codecs.startsWith("avc")) {
                        BLOD.mdf.dash.avc = BLOD.mdf.dash.avc || [];
                        BLOD.mdf.dash.avc.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    } else {
                        BLOD.mdf.dash.hev = BLOD.mdf.dash.hev || [];
                        BLOD.mdf.dash.hev.push([this.qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    }
                }
            }
            if (path.dash.audio) {
                for (let i = 0; i < path.dash.audio.length; i++) {
                    if (path.dash.audio[i].backupUrl && path.dash.audio[i].backupUrl[0]) {
                        path.dash.audio[i].backupUrl.push(path.dash.audio[i].baseUrl);
                        path.dash.audio[i].baseUrl = BLOD.randomArray(path.dash.audio[i].backupUrl)[0];
                    }
                    BLOD.mdf.dash.aac = BLOD.mdf.dash.aac || [];
                    BLOD.mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), BLOD.sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8), ".m4a"]);
                }
                BLOD.mdf.dash.aac = BLOD.bubbleSort(BLOD.mdf.dash.aac).reverse();
                for (let i = 0; i < BLOD.mdf.dash.aac.length; i++) if (BLOD.mdf.dash.aac[i][0] in this.bps) BLOD.mdf.dash.aac[i][0] = this.bps[BLOD.mdf.dash.aac[i][0]];
            }
        }
<<<<<<< HEAD
        durl(path, qua) {
=======
        /**
         * 读取flv数据，可能包含mp4
         * @param {Object} path 原始json
         */
        durl(path) {
>>>>>>> b93be8e (自定义下载)
            if (!path.durl) return;
            if (path.durl[0] && path.durl[0].url.includes("mp4?")) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push([this.qua[path.quality], path.durl[0].url.replace("http:", ""), BLOD.sizeFormat(path.durl[0].size), ".mp4"]);
            } else {
                BLOD.mdf.flv = [];
                for (let i = 0; i < path.durl.length; i++) BLOD.mdf.flv.push([this.qua[path.durl[i].url.match(/[0-9]+\.flv/)[0].split(".")[0]], path.durl[i].url.replace("http:", ""), BLOD.sizeFormat(path.durl[i].size), ".flv"]);
            }
        }
        other() {
            if (!BLOD.config.reset.dlother) return;
            BLOD.mdf.xml = [];
            if (BLOD.xml) {
                let blob = new Blob([BLOD.xml]);
                BLOD.bloburl.xml = URL.createObjectURL(blob);
                BLOD.mdf.xml.push(["弹幕", BLOD.bloburl.xml, BLOD.sizeFormat(blob.size), ".xml"]);
            } else {
                BLOD.mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + BLOD.cid, "--------", ".xml"]);
            }
            if (BLOD.__INITIAL_STATE__) {
                BLOD.mdf.xml.push(["封面", (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.pic || BLOD.__INITIAL_STATE__.mediaInfo.cover).replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.specialCover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), "--------"], ".jpg");
                if (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.subtitle && BLOD.__INITIAL_STATE__.videoData.subtitle.list) for (let i = 0; i < BLOD.__INITIAL_STATE__.videoData.subtitle.list.length; i++) BLOD.mdf.xml.push([BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].lan_doc, BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].subtitle_url.replace("http:", ""), "--------", ".json"]);
            }
        }
        async geturl(...arg) {
            let url = await this.playurl(...arg);
            try {
                if (!url) throw url;
                let data = await BLOD.xhr.GM(url);
                return BLOD.jsonCheck(data);
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("下载拉取", ...e); }
        }
<<<<<<< HEAD
        async playurl(type, qn) {
            BLOD.aid = BLOD.aid || window.aid;
            BLOD.cid = BLOD.cid || window.cid;
            qn = qn || 120;
=======
        /**
         * 构造在线数据url
         * @param {string} [type = mp4 | flv | dash | off] 视频格式
         * @param {number} [qn] 画质参数
         */
        async playurl(type, aid, cid, qn) {
            BLOD.aid = aid || BLOD.aid || window.aid;
            BLOD.cid = cid || BLOD.cid || window.cid;
            qn = qn || 125;
>>>>>>> b93be8e (自定义下载)
            type = type || "mp4";
            if (!BLOD.cid) return;
            switch (type) {
                case 'dash': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 80 });
                    break;
                case 'flv': if (BLOD.pgc) return BLOD.objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                else return BLOD.objUrl("https://api.bilibili.com/x/player/playurl", { avid: BLOD.aid, cid: BLOD.cid, qn: qn, fourk: 1, otype: 'json' });
                    break;
                case 'off': return BLOD.urlSign("https://interface.bilibili.com/v2/playurl", { cid: BLOD.cid, otype: 'json', qn: qn, quality: qn, type: '' });
                    break;
                case 'mp4': if (BLOD.pgc) return BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    return BLOD.urlSign("https://app.bilibili.com/v2/playurlproj", { cid: BLOD.cid, otype: 'json', platform: 'android_i', qn: 208 });
                    break;
            }
        }
        addBox(top, item, name, type, quatily) {
            let qua = quatily;
            let box = document.createElement("div");
            box.setAttribute("class", "download-box");
            box.innerHTML = '<div class="download-type ' + type + '">' + name + '</div>';
            top.appendChild(box);
            item.forEach(d => {
                switch (qua || d[0]) {
                    case "HDR": quatily = "quality-tops"; break;
                    case "4K": quatily = "quality-top"; break;
                    case "1080P60": quatily = "quality-highs"; break;
                    case "720P60": quatily = "quality-high"; break;
                    case "1080P+": quatily = "quality-1080ps"; break;
                    case "1080P": quatily = "quality-1080p"; break;
                    case "720P": quatily = "quality-720p"; break;
                    case "480P": quatily = "quality-480p"; break;
                    case "360P": quatily = "quality-360p"; break;
                    case "320kbps": quatily = "quality-720p"; break;
                    case "128kbps": quatily = "quality-480p"; break;
                    case "64kbps": quatily = "quality-360p"; break;
                    default: quatily = "quality-high";
                }
                box.innerHTML += '<a download="'
                    + "av" + BLOD.aid + d[3] +
                    '" href="' + d[1] +
                    '" target="_blank"><div class="download-quality ' + quatily +
                    '">' + d[0] + '</div><div class="download-size">' + d[2] + '</div></a>';
            })
        }
    }

    const exports = () => {
        let download = new Download();
        function makeExports(type) {
            return function (...msg) {
                return download[type](...msg);
            }
        }
        let method = makeExports("setTable");
        method.init = makeExports("init");
        return method;
    }

    BLOD.download = exports();
})()