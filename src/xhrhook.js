/**
 * @module xhrhook
 * @description xhr hook
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const config = BLOD.config; /** @see main  */
    const debug = BLOD.debug; /** @see debug  */
    const toast = BLOD.toast; /** @see debug  */

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
    // @ts-ignore
>>>>>>> 2f00fde (format with JsDoc)
=======
>>>>>>> 39d49de (remove eslint rules)
    const root = window.protobuf.Root.fromJSON(JSON.parse(BLOD.getResourceText("protobuf")));
=======
    const root = window.protobuf.Root.fromJSON(JSON.parse('{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12},"attr":{"type":"int32","id":13}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}'));
>>>>>>> 34dad0d (更新protobuf弹幕结构体)
=======
    const root = window.protobuf.Root.fromJSON(JSON.parse(BLOD.getResourceText("protobuf")));
>>>>>>> 50dc2ea (独立protobuf弹幕结构体)
    const protoSeg = root.lookupType('bilibili.DmSegMobileReply');
    const protoView = root.lookupType('bilibili.DmWebViewReply');

<<<<<<< HEAD
<<<<<<< HEAD
    // hook setTimeout过滤旧版播放器强制初始化错误
    // @url https://github.com/indefined/UserScripts/issues/39#issuecomment-745279894
=======
    if (!BigInt) BigInt = (n) => { return Number(n) }

    /**
     * hook setTimeout过滤旧版播放器强制初始化错误
     * @see indefined {@link https://github.com/indefined/UserScripts/issues/39#issuecomment-745279894}
     */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
    // hook setTimeout过滤旧版播放器强制初始化错误
    // @url https://github.com/indefined/UserScripts/issues/39#issuecomment-745279894
>>>>>>> d9f62f5 (过滤旧版播放器强制初始化错误)
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
<<<<<<< HEAD
                    debug.log("过滤拦截播放器强制初始化", ...args);
<<<<<<< HEAD
<<<<<<< HEAD
                    toast.warning("禁用播放器强制初始化！")
=======
>>>>>>> d9f62f5 (过滤旧版播放器强制初始化错误)
=======
                    toast.warning("禁用播放器强制初始化！", "等待视频数据返回...")
>>>>>>> 43b3ef7 (启用toast模块)
=======
                    toast.warning("禁用播放器强制初始化！", ...args)
>>>>>>> 760e38a (Update JavaScript module)
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            }

        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 9f51f48 (reBuildPlayerurl)

    // 重构APP端playurl，result/data上层目录需另外构建
    // @url https://github.com/miyouzi/bilibili-helper/raw/0316840c56b3295377fc0f6b7095daa54bc6ac9d/packages/unblock-area-limit/src/api/biliplus.ts
    class ReBuildPlayerurl {
        constructor() {
            this.playurl = {
                accept_description: ["高清 1080P+", "高清 1080P", "高清 720P", "清晰 480P", "流畅 360P"],
                accept_format: "hdflv2,flv,flv720,flv480,mp4",
                accept_quality: [112, 80, 64, 32, 16],
                bp: 0,
                code: 0,
                dash: {
                    audio: [],
                    dolby: { audio: [], type: "NONE" },
                    duration: 0,
                    min_buffer_time: 1.5,
                    minBufferTime: 1.5,
                    video: []
                },
                fnval: 0,
                fnver: 0,
                format: "flv480",
                from: "local",
                has_paid: false,
                is_preview: 0,
                message: "",
                no_rexcode: 1,
                quality: 32,
                result: "suee",
                seek_param: "start",
                seek_type: "offset",
                status: 2,
                support_formats: [
                    {
                        description: "高清 1080P+",
                        display_desc: "1080P",
                        format: "hdflv2",
                        need_login: true,
                        need_vip: true,
                        new_description: "1080P 高码率",
                        quality: 112,
                        superscript: "高码率"
                    },
                    {
                        description: "高清 1080P",
                        display_desc: "1080P",
                        format: "flv",
                        need_login: true,
                        new_description: "1080P 高清",
                        quality: 80,
                        superscript: ""
                    },
                    {
                        description: "高清 720P",
                        display_desc: "720P",
                        format: "flv720",
                        need_login: true,
                        new_description: "720P 高清",
                        quality: 64,
                        superscript: ""
                    },
                    {
                        description: "清晰 480P",
                        display_desc: "480P",
                        format: "flv480",
                        new_description: "480P 清晰",
                        quality: 32,
                        superscript: ""
                    },
                    {
                        description: "流畅 360P",
                        display_desc: "360P",
                        format: "mp4",
                        new_description: "360P 流畅",
                        quality: 16,
                        superscript: ""
                    }
                ],
                timelength: 0,
                type: "DASH",
                video_codecid: 7,
                video_project: true
            }
            this.codecs = {
                default: {
<<<<<<< HEAD
                    30112: 'avc1.640028', // 1080P+
                    30102: 'hev1.1.6.L120.90', // HEVC 1080P+
                    30080: 'avc1.640028', // 1080P
                    30077: 'hev1.1.6.L120.90', // HEVC 1080P
                    30064: 'avc1.64001F', // 720P
                    30066: 'hev1.1.6.L120.90', // HEVC 720P
                    30032: 'avc1.64001E', // 480P
                    30033: 'hev1.1.6.L120.90', // HEVC 480P
                    30011: 'hev1.1.6.L120.90', // HEVC 360P
                    30016: 'avc1.64001E', // 360P
                    30280: 'mp4a.40.2', // 高码音频
                    30232: 'mp4a.40.2', // 中码音频
                    30216: 'mp4a.40.2', // 低码音频
                },
                app: {
                    30016: 'avc1.64001E', // APP源 360P
                    30032: 'avc1.64001F', // APP源 480P
                    30064: 'avc1.640028', // APP源 720P
                    30080: 'avc1.640032', // APP源 1080P
                    30216: 'mp4a.40.2', // APP源 低码音频
                    30232: 'mp4a.40.2', // APP源 中码音频
                    30280: 'mp4a.40.2' // APP源 高码音频 
=======
                    30112: 'avc1.640028',  // 1080P+
                    30102: 'hev1.1.6.L120.90',  // HEVC 1080P+
                    30080: 'avc1.640028',  // 1080P
                    30077: 'hev1.1.6.L120.90',  // HEVC 1080P
                    30064: 'avc1.64001F',  // 720P
                    30066: 'hev1.1.6.L120.90',  // HEVC 720P
                    30032: 'avc1.64001E',  // 480P
                    30033: 'hev1.1.6.L120.90',  // HEVC 480P
                    30011: 'hev1.1.6.L120.90',  // HEVC 360P
                    30016: 'avc1.64001E',  // 360P
                    30280: 'mp4a.40.2',  // 高码音频
                    30232: 'mp4a.40.2',  // 中码音频
                    30216: 'mp4a.40.2',  // 低码音频
                },
                app: {
                    30016: 'avc1.64001E',  // APP源 360P
                    30032: 'avc1.64001F',  // APP源 480P
                    30064: 'avc1.640028',  // APP源 720P
                    30080: 'avc1.640032',  // APP源 1080P
                    30216: 'mp4a.40.2',  // APP源 低码音频
                    30232: 'mp4a.40.2',  // APP源 中码音频
                    30280: 'mp4a.40.2'  // APP源 高码音频 
>>>>>>> 9f51f48 (reBuildPlayerurl)
                }
            }
            this.frameRate = {
                30112: '16000/672',
                30102: '16000/672',
                30080: '16000/672',
                30077: '16000/656',
                30064: '16000/672',
                30066: '16000/656',
                30032: '16000/672',
                30033: '16000/656',
                30011: '16000/656',
                30016: '16000/672'
            }
            this.resolution = {
<<<<<<< HEAD
                30112: [1920, 1080], // 1080P+
                30102: [1920, 1080], // HEVC 1080P+
                30080: [1920, 1080], // 1080P
                30077: [1920, 1080], // HEVC 1080P
                30064: [1280, 720], // 720P
                30066: [1280, 720], // HEVC 720P
                30032: [852, 480], // 480P
                30033: [852, 480], // HEVC 480P
                30011: [640, 360], // HEVC 360P
                30016: [640, 360], // 360P
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 获取链接ids
         * @param {string} url
         */
>>>>>>> 2f00fde (format with JsDoc)
        getIdxs(url) {
<<<<<<< HEAD
            BLOD.xhr(url, 'arraybuffer', { 'Range': 'bytes=0-6000' }, false);
=======
        /**
         * 获取链接ids
         * @param {string} url 下载链接
         * @param {number} duration 媒体时长
         */
        getIdxs(url, duration) {
            let range = Math.round(duration * 3.5);
            range = range < 6000 ? 6000 : range;
            return BLOD.xhr(url, 'arraybuffer', { 'Range': `bytes=0-${range}` }, false);
>>>>>>> 57513a7 (Thailand server)
        }
<<<<<<< HEAD
=======
        /**
         * 过滤问题音频
         * @param {[]} audio 音频数据数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
        fixAudio(audio) {
            // 多余的音频会造成DASH闪退
            let arr = [];
            audio.forEach(d => {
                if (d.id == 30232 || d.id == 30280 || d.id == 30216) arr.push(d);
=======
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url.replace('http', 'https'), true);
                xhr.setRequestHeader('Range', 'bytes=0-6000');
                xhr.responseType = 'arraybuffer';
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => {
                    toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                }
                xhr.send();
>>>>>>> 3a04522 (过滤问题音频)
            })
            return arr;
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
        /**
         * 过滤问题音频
         * @param {Array} audio 音频数据数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        fixAudio(audio) {
            let arr = [];
            audio.forEach(d => {
                if (d.id == 30232 || d.id == 30280 || d.id == 30216) arr.push(d);
            })
            return arr;
        }
<<<<<<< HEAD
>>>>>>> 3a04522 (过滤问题音频)
        // APP端playurl
=======
        /**
         * 重构APP端数据
         * @param {{}} app 原始数据对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 重构APP端数据
         * @param {*} app 原始数据对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        async appPlayurl(app) {
            if (app.durl) return app;
            if (app.dash.duration) {
                app.dash.audio = this.fixAudio(app.dash.audio);
                return app;
            }
<<<<<<< HEAD
            toast("重构DASH数据中...");
=======
>>>>>>> 3a04522 (过滤问题音频)
            for (let key in app) this.playurl[key] = app[key];
            // duration向上取整
            this.playurl.dash.duration = Math.ceil(app.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
            // 构造Promise序列以同时获取所有DASH媒体segment数据
            // 本应由播放器自行获取，B站官方称之为【首帧优化】却在缺失时直接报错导致播放器无法正常载入视频
            let arr = [];
            this.playurl.dash.video.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) BLOD["sidx" + String(BLOD.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        // 首个“sidx”出现4字节之前的部分为索引起始点
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        // 首个“mooc”出现前5字节结束索引
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        // 挂载到BLOD下，切换清晰度直接继承使用（以cid为切p标记）
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-video：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id];
                    d.frameRate = d.frame_rate = d.frameRate || d.frame_rate || this.frameRate[id];
                    d.height = d.height || this.resolution[id][1];
                    d.width = d.width || this.resolution[id][0];
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'video/mp4';
                    d.sar = d.sar || "1:1";
                    d.startWithSAP = d.start_with_sap = d.startWithSAP || d.start_with_sap || 1;
                })(e[i]))
            })
            this.playurl.dash.audio = this.fixAudio(this.playurl.dash.audio);
            this.playurl.dash.audio.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (d.SegmentBase) BLOD["sidx" + String(BLOD.cid)][id] = [d.SegmentBase.Initialization, d.SegmentBase.indexRange]
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-audio：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    d.segment_base = {
                        initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                        indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                    }
                    d.backupUrl = d.backup_url = d.backupUrl || d.backup_url || [];
                    d.baseUrl = d.base_url;
                    d.codecs = d.codecs || this.codecs.app[id] || this.codecs.default[id] || "mp4a.40.2";
                    d.mimeType = d.mime_type = d.mimeType || d.mime_type || 'audio/mp4';
                })(e[i]))
            })
            toast("等待数据回传...");
            if (arr[0]) await Promise.all(arr);

            // video排序
            let avc = [], hev = [], video = [];
            this.playurl.dash.video.forEach(d => {
                if (d.codecid == 7) avc.push(d);
                else hev.push(d);
            })
            let length = avc.length > hev.length ? avc.length : hev.length;
            for (let i = length - 1; i >= 0; i--) {
                if (avc[i]) video.push(avc[i]);
                if (hev[i]) video.push(hev[i]);
            }
            this.playurl.dash.video = video;
<<<<<<< HEAD
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
<<<<<<< HEAD
=======
>>>>>>> 3a04522 (过滤问题音频)
=======
            debug.log(this.playurl);
>>>>>>> 760e38a (Update JavaScript module)
            return this.playurl;
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // Thailand playurl
=======
        /**
         * 重构Thailand数据
         * @param {{}} ogv 原始数据
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 重构Thailand数据
         * @param {*} ogv 原始数据
         */
>>>>>>> 2f00fde (format with JsDoc)
        async ogvPlayurl(ogv) {
            toast("重构DASH数据中...");
            this.playurl.quality = ogv.data.video_info.quality;
            let num = this.playurl.accept_quality.indexOf(this.playurl.quality);
            this.playurl.format = this.playurl.accept_format.split(",")[num];
            this.playurl.timelength = ogv.data.video_info.timelength;

            this.playurl.accept_quality.splice(0, num);
            this.playurl.support_formats.splice(0, num);
            this.playurl.accept_description.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.split(",");
            this.playurl.accept_format.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.join(",");

            this.playurl.dash.duration = Math.ceil(this.playurl.timelength / 1000);
            this.playurl.dash.minBufferTime = this.playurl.dash.min_buffer_time = 1.5;
=======
                30112: [1920, 1080],  // 1080P+
                30102: [1920, 1080],  // HEVC 1080P+
                30080: [1920, 1080],  // 1080P
                30077: [1920, 1080],  // HEVC 1080P
                30064: [1280, 720],  // 720P
                30066: [1280, 720],  // HEVC 720P
                30032: [852, 480],  // 480P
                30033: [852, 480],  // HEVC 480P
                30011: [640, 360],  // HEVC 360P
                30016: [640, 360],  // 360P
            }
        }
        getIdxs(url) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: 'arraybuffer',
                    headers: {
                        'Range': 'bytes=0-6000',
                        'user-agent': 'Bilibili Freedoooooom/MarkII'
                    },
                    onload: (xhr) => resolve(xhr.response),
                    onerror: (xhr) => {
                        toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                        reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                    }
                });
            })
        }
        async appPlayurl(app) {
            for (let key in this.playurl) this.playurl[key] = app[key];
            this.playurl.dash.duration = Math.ceil(app.timelength / 1000);
            let arr = [];
            this.playurl.dash.video.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD.sidx = BLOD.sidx || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!BLOD.sidx[id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD.sidx[id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                    }
                    d.segment_base = {
                        initialization: BLOD.sidx[id][0],
                        index_range: BLOD.sidx[id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD.sidx[id][0],
                        indexRange: BLOD.sidx[id][1]
                    }
                    d.backupUrl = d.backup_url;
                    d.baseUrl = d.base_url;
                    d.codecs = this.codecs.app[id] || this.codecs.default[id];;
                    d.frameRate = d.frame_rate = this.frameRate[id];
                    d.height = this.resolution[id][1];
                    d.width = this.resolution[id][0];
                    d.mimeType = d.mime_type = 'video/mp4';
                    d.sar = "1:1";
                    d.startWithSAP = d.start_with_sap = 1;
                })(e[i]))
            })
            this.playurl.dash.audio.forEach((d, i, e) => {
                arr.push((async (d) => {
                    BLOD.sidx = BLOD.sidx || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!BLOD.sidx[id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD.sidx[id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                    }
                    d.segment_base = {
                        initialization: BLOD.sidx[id][0],
                        index_range: BLOD.sidx[id][1]
                    };
                    d.SegmentBase = {
                        Initialization: BLOD.sidx[id][0],
                        indexRange: BLOD.sidx[id][1]
                    }
                    d.backupUrl = d.backup_url;
                    d.baseUrl = d.base_url;
                    d.codecs = this.codecs.app[id] || this.codecs.default[id];
                    d.mimeType = d.mime_type = 'audio/mp4';
                })(e[i]))
            })
            await Promise.all(arr);
            return this.playurl;
        }
        async ogvPlayurl(ogv) {
            this.playurl.quality = ogv.data.video_info.quality;
            let num = this.playurl.accept_quality[this.playurl.quality];
            this.playurl.format = this.playurl.accept_format.split(",")[num];
            this.playurl.timelength = ogv.data.video_info.timelength.

                this.playurl.accept_quality.splice(0, num);
            this.playurl.support_formats.splice(0, num);
            this.playurl.accept_format = this.playurl.accept_format.split(",");
            this.playurl.accept_format.splice(num, 1);
            this.playurl.accept_format = this.playurl.accept_format.join(",");

            this.playurl.dash.duration = Math.ceil(this.playurl.timelength / 1000);
>>>>>>> 9f51f48 (reBuildPlayerurl)

            let arr = [];
            ogv.data.video_info.stream_list.forEach(d => {
                if (d.dash_video && d.dash_video.base_url) {
                    arr.push((async (d) => {
<<<<<<< HEAD
                        BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                        let id = d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                        if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                            let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url, this.playurl.dash.duration));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                            debug("DASH-video：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                        }
                        this.playurl.dash.video.push({
                            SegmentBase: {
                                Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                                indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                            },
                            segment_base: {
                                initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                                index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
=======
                        BLOD.sidx = BLOD.sidx || {};
                        let id = d.dash_video.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                        if (!BLOD.sidx[id]) {
                            let data = new Uint8Array(await this.getIdxs(d.dash_video.base_url));
                            let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                            let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                            let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                            BLOD.sidx[id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        }
                        this.playurl.dash.video.push({
                            SegmentBase: {
                                Initialization: BLOD.sidx[id][0],
                                indexRange: BLOD.sidx[id][1]
                            },
                            segment_base: {
                                initialization: BLOD.sidx[id][0],
                                index_range: BLOD.sidx[id][1]
>>>>>>> 9f51f48 (reBuildPlayerurl)
                            },
                            backupUrl: [],
                            backup_url: [],
                            bandwidth: d.dash_video.bandwidth,
                            baseUrl: d.dash_video.base_url,
                            base_url: d.dash_video.base_url,
                            codecid: d.dash_video.codecid,
                            codecs: this.codecs.app[id] || this.codecs.default[id],
                            frameRate: this.frameRate[id],
                            frame_rate: this.frameRate[id],
                            height: this.resolution[id][1],
                            id: d.stream_info.quality,
                            md5: d.dash_video.md5,
                            mimeType: "video/mp4",
                            mime_type: "video/mp4",
                            sar: "1:1",
                            size: d.dash_video.size,
                            startWithSAP: 1,
                            start_with_sap: 1,
                            width: this.resolution[id][0]
                        })
                    })(d))
                }
            })
            ogv.data.video_info.dash_audio.forEach(d => {
                arr.push((async (d) => {
<<<<<<< HEAD
                    BLOD["sidx" + String(BLOD.cid)] = BLOD["sidx" + String(BLOD.cid)] || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!BLOD["sidx" + String(BLOD.cid)][id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url, this.playurl.dash.duration));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD["sidx" + String(BLOD.cid)][id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                        debug("DASH-audio：", id, BLOD["sidx" + String(BLOD.cid)][id]);
                    }
                    this.playurl.dash.audio.push({
                        SegmentBase: {
                            Initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                            indexRange: BLOD["sidx" + String(BLOD.cid)][id][1]
                        },
                        segment_base: {
                            initialization: BLOD["sidx" + String(BLOD.cid)][id][0],
                            index_range: BLOD["sidx" + String(BLOD.cid)][id][1]
=======
                    BLOD.sidx = BLOD.sidx || {};
                    let id = d.base_url.match(/[0-9]+\.m4s/)[0].split(".")[0];
                    if (!BLOD.sidx[id]) {
                        let data = new Uint8Array(await this.getIdxs(d.base_url));
                        let hex_data = Array.prototype.map.call(data, x => ('00' + x.toString(16)).slice(-2)).join('');
                        let indexRangeStart = hex_data.indexOf('73696478') / 2 - 4;
                        let indexRagneEnd = hex_data.indexOf('6d6f6f66') / 2 - 5;
                        BLOD.sidx[id] = ['0-' + String(indexRangeStart - 1), String(indexRangeStart) + '-' + String(indexRagneEnd)];
                    }
                    this.playurl.dash.audio.push({
                        SegmentBase: {
                            Initialization: BLOD.sidx[id][0],
                            indexRange: BLOD.sidx[id][1]
                        },
                        segment_base: {
                            initialization: BLOD.sidx[id][0],
                            index_range: BLOD.sidx[id][1]
>>>>>>> 9f51f48 (reBuildPlayerurl)
                        },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: d.bandwidth,
                        baseUrl: d.base_url,
                        base_url: d.base_url,
                        codecid: d.codecid,
                        codecs: this.codecs.app[id] || this.codecs.default[id],
                        frameRate: "",
                        frame_rate: "",
                        height: 0,
                        id: id,
                        md5: d.md5,
                        mimeType: "audio/mp4",
                        mime_type: "audio/mp4",
                        sar: "",
                        size: d.size,
                        startWithSAP: 0,
                        start_with_sap: 0,
                        width: 0
                    })
                })(d))
            })
<<<<<<< HEAD
            toast("等待数据回传...");
            await Promise.all(arr);
            toast.success("DASH数据重构成功！", "正在投喂给播放器...");
            debug.log(this.playurl);
            return this.playurl;
        }
    }
    /**
     * 生成xml形式的弹幕
     * @param  {[]} danmaku protoSeg.decode(new Uint8Array(this.response)).elems
     * @returns {Promise<String>} 委托对象，表示生成的xml形式的弹幕字符串
     */
=======
=======
            await Promise.all(arr);
            return this.playurl;
        }
    }
>>>>>>> 9f51f48 (reBuildPlayerurl)
    // proto => xml
>>>>>>> d9f62f5 (过滤旧版播放器强制初始化错误)
    const toXml = BLOD.toXml = (danmaku) => {
        return new Promise(function (resolve) {
            danmaku.sort((a, b) => (BigInt(a.idStr) > BigInt(b.idStr) ? 1 : -1));
            let attr = [], xml = '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + BLOD.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>'
            for (let i = 0; i < danmaku.length; i++) {
                attr[0] = danmaku[i].progress / 1000;
                attr[1] = danmaku[i].mode;
                attr[2] = danmaku[i].fontsize;
                attr[3] = danmaku[i].color;
                attr[4] = danmaku[i].ctime;
                attr[5] = danmaku[i].pool;
                attr[6] = danmaku[i].midHash;
                attr[7] = danmaku[i].idStr;
                xml += '<d p="' + attr.join(",") + '">' + danmaku[i].content.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a] }) + '</d>';
            }
            xml += "</i>";
            resolve(xml);
        });
    }
    /**
     * 请求该视频所有的分段弹幕
     * @param  {Function} onload 得到所有弹幕之后触发的回调函数
     */
    const getSegDanmaku = (onload) => {
<<<<<<< HEAD
        function request(url) {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.addEventListener("load", () => {
                    if (xhr.status == 200)
                        resolve(new Uint8Array(xhr.response));
                    else
                        reject("HTTP" + xhr.status);
                });
                xhr.addEventListener("error", () => {
                    reject("HTTP Error", xhr.statusText);
                });
                xhr.responseType = "arraybuffer";
                xhr.open("get", url);
                xhr.send();
            });
        }

=======
        let request = (url) => BLOD.xhr.true(url, "arraybuffer", {}, false);
>>>>>>> 8a8909d (Update xhrhook.js)
        let DmWebViewReply = "https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=" + BLOD.cid + "&pid=" + BLOD.aid
        request(DmWebViewReply).then(getAllSeg).catch((e) => {
            toast.error("载入弹幕失败", "请尝试刷新页面");
            toast.error(e);
        });
        // 获得所有分段
        function getAllSeg(config) {
            config = protoView.decode(config);
            // dmSge.total代表的分片总数，有时错误地为100
            // 故需要按照 视频时长/分片时长(一般是360秒) 把分片总数计算出来
            let pageSize = config.dmSge.pageSize ? config.dmSge.pageSize / 1000 : 360;
            let total = player.getDuration() / pageSize + 1;
            let allrequset = [];
            let reqUrl = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + BLOD.cid + "&pid=" + BLOD.aid;
            for (let index = 1; index <= total; index++) {
                allrequset.push(request(reqUrl + "&segment_index=" + index));
            }
            // BAS弹幕
            if (config.specialDms.length > 0) {
                for (let index = 0; index < config.specialDms.length; index++) {
                    // 下发的是http链接，但会被chrome的安全措施拦掉，于是替换成https
                    allrequset.push(request(config.specialDms[index].replace("http", "https")));
                }
            }
            // 完成所有的网络请求大概要300ms
            return Promise.all(allrequset).then((segments) => {
                onload(segments);
            });
        }
    }
    /**
     * 加载本地弹幕
     * @param  {String} 读取本地弹幕文件得到的字符串
     * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
     */
    BLOD.loadLocalDm = function (xml, append) {
        xml = new DOMParser().parseFromString(xml, "application/xml");
        let dm = xml.querySelectorAll("d");
        if (dm.length == 0) {
            toast.warning("从弹幕文件中没有获取到任何弹幕！");
            return;
        }
        let danmaku = [];
        let attr, v, mode;
        for (let i = 0; i < dm.length; i++) {
            v = dm[i];
            attr = v.getAttribute('p').split(",");
            mode = parseInt(attr[1]);
            danmaku[i] = {
                class: parseInt(attr[5]),
                color: parseInt(attr[3]),
                date: parseInt(attr[4]),
                dmid: attr[7],
                mode: mode,
                size: parseInt(attr[2]),
                stime: parseFloat(attr[0]),
                text: (mode != 8 && mode != 9) ? v.textContent.replace(/(\/n|\\n|\n|\r\n)/g, '\n') : v.textContent,
                uid: attr[6]
            };
        }
        specialEffects(danmaku);
        // 弹幕池属性在原生代码中，通过.gb而不是.class引用
        for (let i = 0; i < danmaku.length; i++) {
            danmaku[i].gb = danmaku[i].class;
        }
        danmaku.sort((a, b) => (BigInt(a.dmid) > BigInt(b.dmid) ? 1 : -1));
        /**
         * bilibiliPlayer.js 21394行已经添加如下代码，用于设置弹幕池
         * @param  {Array} dm 弹幕数组
         * @param  {Boolean} append 默认为false，即不保留已加载的弹幕。为true时，则将追加到现有弹幕上
         */
        // BLOD.setDanmaku = (dm) => {......}

        if (!BLOD.setDanmaku) return toast.error("刷新弹幕列表失败：播放器内部调用丢失！");
        BLOD.setDanmaku(danmaku, append);
    }

    /**
     * 把有换行符的弹幕的zindex设为它的出现时间(progress)，并且打上“字幕弹幕”标记
     * @param {[]} dm 弹幕数组
     */
    function specialEffects(dm) {
        let textData;
        for (let i = 0; i < dm.length; i++) {
            textData = dm[i];
            if (textData.text.includes('\n')) {
                textData.class = 1;
                textData.zIndex = textData.stime * 1000;
                if (!(textData.text.includes("█") || textData.text.includes("▂")))
                    textData.zIndex = textData.zIndex + 1;
            }
        }
    }

    class Xhrhook {
        constructor() {
            console.debug('import module "xhrhook.js"');
        }
        webSocket() {
            let decoder = new TextDecoder();
            let encoder = new TextEncoder();
            let liveChatOld; // 对旧播放器建立的ws对象的引用
            let liveChat;
            // 为了获取ws对象的引用,hook WebSocket.send
            let wsHookRunOnce = true;
            const wssend = WebSocket.prototype.send;

            WebSocket.prototype.send = function (...arg) {
                if (wsHookRunOnce && this.url == 'wss://broadcast.chat.bilibili.com:4095/sub') {
                    liveChatOld = this;
                    // 切p和掉线之后需要重新启动hook,获得新的引用
                    let onclose = liveChatOld.onclose;
                    liveChatOld.onclose = function () {
                        wsHookRunOnce = true;
                        clearTimeout(liveChat.heatTimer);
                        liveChat.close();
                        onclose.call(this);
                    }
                    // 从bilibiliPlayer.js > b.prototype.xx复制过来
                    // 编码一个数据包
                    // body[Object] : 要发送的信息
                    // option[Number] : 数据包对应的行为
                    //                  =5 一条弹幕数据
                    //                  =7 首个数据包,建立与服务器的连接
                    // return[Buffer] : 包装好的数据
                    liveChatOld.convertToArrayBuffer = function (body, option) {
                        let header = [{ "name": "Header Length", "key": "headerLen", "qg": 2, "offset": 4, "value": 16 }, { "name": "Protocol Version", "key": "ver", "qg": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "qg": 4, "offset": 8, "value": option }, { "name": "Sequence Id", "key": "seq", "qg": 4, "offset": 12, "value": 1 }];
                        let headerBuf = new ArrayBuffer(16);
                        let viewer = new DataView(headerBuf, 0);
                        let bodyBuf = encoder.encode(JSON.stringify(body));
                        viewer.setInt32(0, 16 + bodyBuf.byteLength);
                        header.forEach(function (b) {
                            4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value)
                        })
                        return mergeArrayBuffer(headerBuf, bodyBuf);
                    }
                    wsHookRunOnce = false;
                    initLiveChat();
                }
                wssend.call(this, ...arg);
            }

            // 原函数位于bilibiliPlayer.js > c.a.eK 和 jsc-player > Dl.mergeArrayBuffer
            // 连接两个buffer
            function mergeArrayBuffer(headerBuf, bodyBuf) {
                headerBuf = new Uint8Array(headerBuf);
                bodyBuf = new Uint8Array(bodyBuf);
                var d = new Uint8Array(headerBuf.byteLength + bodyBuf.byteLength);
                d.set(headerBuf, 0);
                d.set(bodyBuf, headerBuf.byteLength);
                return d.buffer;
            }

            function initLiveChat() {
                // 数据包对应的Operation常量表
                let Pl = { "WS_OP_HEARTBEAT": 2, "WS_OP_HEARTBEAT_REPLY": 3, "WS_OP_DATA": 1000, "WS_OP_BATCH_DATA": 9, "WS_OP_DISCONNECT_REPLY": 6, "WS_OP_USER_AUTHENTICATION": 7, "WS_OP_CONNECT_SUCCESS": 8, "WS_OP_CHANGEROOM": 12, "WS_OP_CHANGEROOM_REPLY": 13, "WS_OP_REGISTER": 14, "WS_OP_REGISTER_REPLY": 15, "WS_OP_UNREGISTER": 16, "WS_OP_UNREGISTER_REPLY": 17, "WS_OP_OGVCMD_REPLY": 1015, "WS_PACKAGE_HEADER_TOTAL_LENGTH": 18, "WS_PACKAGE_OFFSET": 0, "WS_HEADER_OFFSET": 4, "WS_VERSION_OFFSET": 6, "WS_OPERATION_OFFSET": 8, "WS_SEQUENCE_OFFSET": 12, "WS_COMPRESS_OFFSET": 16, "WS_CONTENTTYPE_OFFSET": 17, "WS_BODY_PROTOCOL_VERSION": 1, "WS_HEADER_DEFAULT_VERSION": 1, "WS_HEADER_DEFAULT_OPERATION": 1, "ws_header_default_sequence": 1, "WS_HEADER_DEFAULT_COMPRESS": 0, "WS_HEADER_DEFAULT_CONTENTTYPE": 0 };
                // 请求头的参数表
                let wsBinaryHeaderList = [{ "name": "Header Length", "key": "headerLen", "bytes": 2, "offset": 4, "value": 18 }, { "name": "Protocol Version", "key": "ver", "bytes": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "bytes": 4, "offset": 8, "value": 7 }, { "name": "Sequence Id", "key": "seq", "bytes": 4, "offset": 12, "value": 2 }, { "name": "Compress", "key": "compress", "bytes": 1, "offset": 16, "value": 0 }, { "name": "ContentType", "key": "contentType", "bytes": 1, "offset": 17, "value": 0 }]
                liveChat = new WebSocket('wss://broadcast.chat.bilibili.com:7823/sub');
                liveChat.binaryType = "arraybuffer";
                liveChat.heatTimer = -1;

                // 每30秒一个心跳包
                liveChat.heartBeat = function () {
                    var i = this;
                    clearTimeout(this.heatTimer);
                    var e = this.convertToArrayBuffer({}, Pl.WS_OP_HEARTBEAT);
                    this.send(e);
                    this.heatTimer = window.setTimeout((function () {
                        i.heartBeat();
                    }), 1e3 * 30);
                }

                liveChat.onopen = function () {
                    let body = {
                        "room_id": "video://" + BLOD.aid + "/" + BLOD.cid,
                        "platform": "web",
                        "accepts": [1000, 1015]
                    };
                    return this.send(this.convertToArrayBuffer(body, 7));
                }

                liveChat.onmessage = function (i) {
                    try {
                        var t = this.convertToObject(i.data);
                        if (t) {
                            switch (t.op) {
                                case Pl.WS_OP_HEARTBEAT_REPLY:
                                    // 接收到心跳包后,服务器响应当前在线人数的数据
                                    // 旧播放器连接的4095端口,虽然不再下发实时弹幕,但依然照常响应在线人数
                                    // 所以暂时不用替换成新版
                                    // this.onHeartBeatReply(t.body);
                                    break;
                                case Pl.WS_OP_CONNECT_SUCCESS:
                                    this.heartBeat();
                                    break;
                                // 旧播放器只能处理(连接成功，心跳响应，实时弹幕)三种响应信息
                                // 新播放器新增的指令和功能就不管了
                                case Pl.WS_OP_CHANGEROOM_REPLY:
                                    //0 === Number(t.body.code) && this.options.onChangeRoomReply({ data : t && t.body });
                                    break;
                                case Pl.WS_OP_REGISTER_REPLY:
                                    //0 === Number(t.body.code) && this.options.onRegisterReply({ data : t && t.body });
                                    break;
                                case Pl.WS_OP_UNREGISTER_REPLY:
                                    //0 === Number(t.body.code) && this.options.onUnRegisterReply({ data : t && t.body });
                                    break;
                                case Pl.WS_OP_DATA:
                                case Pl.WS_OP_BATCH_DATA:
                                    t.body.forEach(function (v) {
                                        liveChatOld.onmessage({
                                            data: liveChatOld.convertToArrayBuffer({
                                                cmd: 'DM',
                                                info: [v[0], v[1]]
                                            }, 5)
                                        });
                                    });
                                    break;
                                case Pl.WS_OP_OGVCMD_REPLY:
                                    //this.onOgvCmdReply(t);
                                    break;
                                default:
                                //this.msgReply(t)
                            }
                        }
                    } catch (i) {
                        console.error("WebSocket Error : ", i)
                    }
                    return this;
                }

                // jsc-player > i.prototype.convertToArrayBuffer,新版播放器的请求头信息更多,需要18字节
                // 基本与liveChatOld.convertToArrayBuffer相同
                liveChat.convertToArrayBuffer = function (body, option) {
                    let headerBuf = new ArrayBuffer(Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH);
                    let viewer = new DataView(headerBuf, Pl.WS_PACKAGE_OFFSET);
                    let bodyBuf = encoder.encode(JSON.stringify(body));
                    viewer.setInt32(Pl.WS_PACKAGE_OFFSET, Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH + bodyBuf.byteLength);
                    wsBinaryHeaderList[2].value = option;
                    wsBinaryHeaderList.forEach((function (i) {
                        4 === i.bytes ? (viewer.setInt32(i.offset, i.value),
                            "seq" === i.key && ++i.value) : 2 === i.bytes ? viewer.setInt16(i.offset, i.value) : 1 === i.bytes && viewer.setInt8(i.offset, i.value)
                    }));
                    return mergeArrayBuffer(headerBuf, bodyBuf);
                }

                // jsc-player > i.prototype.convertToObject
                // convertToArrayBuffer对应的解码函数
                liveChat.convertToObject = function (i) {
                    var e = new DataView(i), t = {};
                    t.packetLen = e.getInt32(Pl.WS_PACKAGE_OFFSET);
                    wsBinaryHeaderList.forEach((function (i) {
                        4 === i.bytes ? t[i.key] = e.getInt32(i.offset) : 2 === i.bytes ? t[i.key] = e.getInt16(i.offset) : 1 === i.bytes && (t[i.key] = e.getInt8(i.offset))
                    }));
                    if (t.op && t.op === Pl.WS_OP_BATCH_DATA) {
                        t.body = this.parseDanmaku(i, e, Pl.WS_PACKAGE_HEADER_TOTAL_LENGTH, t.packetLen);
                    }
                    else if (t.op && Pl.WS_OP_DATA === t.op) {
                        t.body = this.parseDanmaku(i, e, Pl.WS_PACKAGE_OFFSET, t.packetLen);
                    }
                    else if (t.op && t.op === Pl.WS_OP_OGVCMD_REPLY) {
                        t.body = ""; // this.parseOgvCmd(i, e, Pl.WS_PACKAGE_OFFSET, t.packetLen);
                    }
                    else if (t.op) {
                        t.body = [];
                        for (var a = Pl.WS_PACKAGE_OFFSET, r = t.packetLen, n = "", l = ""; a < i.byteLength; a += r) {
                            r = e.getInt32(a);
                            n = e.getInt16(a + Pl.WS_HEADER_OFFSET);
                            try {
                                l = JSON.parse(decoder.decode(i.slice(a + n, a + r)));
                                t.body = l;
                            } catch (e) {
                                l = decoder.decode(i.slice(a + n, a + r));
                                console.error("decode body error:", new Uint8Array(i), t);
                            }
                        }
                    }
                    return t;
                }

                // jsc-player > i.prototype.parseDanmaku
                liveChat.parseDanmaku = function (i, e, t, a) {
                    for (var r, n = [], l = t; l < i.byteLength; l += a) {
                        a = e.getInt32(l);
                        r = e.getInt16(l + Pl.WS_HEADER_OFFSET);
                        try {
                            n.push(JSON.parse(decoder.decode(i.slice(l + r, l + a))));
                        } catch (e) {
                            n.push(decoder.decode(i.slice(l + r, l + a)));
                            console.error("decode body error:", new Uint8Array(i));
                        }
                    }
                    return n;
                }
            }
        }
        worker() {
            // hook postMessage来得到旧播放器创建的 获取list.so 的worker对象
            let workerPostMsg = Worker.prototype.postMessage;
            let list_so;
            let loadTime, parseTime; // 旧播放器需要得到耗时数据(网络请求，数据处理)
            Worker.prototype.postMessage = function (aMessage, transferList) {
                if (aMessage.url && aMessage.url.includes("list.so")) {
                    list_so = this;
                    loadTime = new Date();
                    let Segments = [];
                    getSegDanmaku(function (protoSegments) {
                        loadTime = new Date() - loadTime;
                        parseTime = new Date();
                        protoSegments.forEach(function (seg) {
                            Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
                        });
<<<<<<< HEAD
<<<<<<< HEAD
=======
                        // @ts-ignore
=======
>>>>>>> 39d49de (remove eslint rules)
                        Segments.sort((a, b) => (BigInt(a.idStr) > BigInt(b.idStr) ? 1 : -1));
                        //将av300000(2012年7月)之前视频中含有"/n"的弹幕打上“字幕弹幕”标记，使播放器能正确渲染
                        if (BLOD.aid < 300000) {
                            for (let i in Segments) {
                                if (Segments[i].content.includes('/n')) {
                                    Segments[i].pool = 1;
                                }
                            }
                        }
>>>>>>> 2f00fde (format with JsDoc)
                        // 将弹幕转换为旧格式
                        let danmaku = Segments.map(function (v) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
                            if(v.pool == 1) {
                                v.content = v.content.replaceAll('/n', '\n');
=======
                            if (v.pool == 1) {
                                v.content = v.content.replace(/(\/n|\\n|\n|\r\n)/g, '\r');
>>>>>>> 2df4d62 (不再使用replaceAll)
                            }
                            // 记录弹幕池哈希值
                            BLOD.hash.push(v.midHash);
>>>>>>> 640403b (尝试修复“字幕弹幕”显示效果)
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
<<<<<<< HEAD
<<<<<<< HEAD
                        //对av400000(2012年11月)之前视频中含有"/n"的弹幕的进行专门处理
                        if (BLOD.aid < 400000) {
                            specialEffects(danmaku);
                        }
                        danmaku.sort((a, b) => (BigInt(a.dmid) > BigInt(b.dmid) ? 1 : -1));
=======
                        // @ts-ignore
>>>>>>> 2f00fde (format with JsDoc)
=======
>>>>>>> 39d49de (remove eslint rules)
                        parseTime = new Date() - parseTime;

                        list_so.onmessage({
                            data: {
                                code: 0,
                                danmakuArray: danmaku,
                                loadTime: loadTime,
                                parseTime: parseTime,
                                sendTip: "",
                                state: 0,
                                textSide: "",
                                total: danmaku.length.toString()
                            }
                        });
                        toXml(Segments).then((result) => (BLOD.xml = result));
                    });
                } else {
                    workerPostMsg.call(this, aMessage, transferList);
                }
            }
        }
        open() {
            const open = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                let _url = url, hook = [_url, ""];
                let obj = BLOD.urlObj(url);
<<<<<<< HEAD
                if (obj.aid) BLOD.aid = obj.aid;
                if (obj.cid) BLOD.aid = obj.cid;
=======
                if (!BLOD.aid) BLOD.aid = obj.avid || obj.aid || BLOD.aid;
                if (!BLOD.cid) BLOD.cid = obj.cid || window.cid || BLOD.cid;
>>>>>>> fc46cfb (修复拜年祭页面切P弹幕错误)
                // 替换视频心跳
                if (url.includes('api.bilibili.com/x/report/web/heartbeat')) {
                    if (config.reset.heartbeat) {
                        url = url.replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
                        debug.debug("XHR重定向", "替换视频心跳", [_url, url]);
                    }
                    if (BLOD.vip) this.send = () => true;
                }
                // 显示历史视频
                if (url.includes('api.bilibili.com/x/web-interface/history/cursor') && url.includes("business") && config.reset.history) {
                    let max = obj.max || "", view_at = obj.view_at || "";
                    url = BLOD.objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: 20 });
                    debug.debug("XHR重定向", "显示历史视频", [_url, url]);
                }
                // 修改正在直播
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.biliIndexRec(this, hook) });
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecList', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getList?platform=web');
                }
                // 修改直播动态
                if (url.includes('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.biliIndexRec(this, hook) });
                    url = hook[1] = url.replace('api.live.bilibili.com/room/v1/RoomRecommend/biliIndexRecMore', 'api.live.bilibili.com/xlive/web-interface/v1/webMain/getMoreRecList?platform=web');
                }
                // 重定向番剧信息
                if (url.includes('bangumi.bilibili.com/view/web_api/season?')) {
                    //this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.season(this, hook) });
                    // url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season', 'api.bilibili.com/pgc/view/web/season');
                }
                // 重定向追番信息
                if (url.includes('bangumi.bilibili.com/ext/web_api/season_count?')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.stat(this, hook) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/ext/web_api/season_count', 'api.bilibili.com/pgc/web/season/stat');
                }
                // 修改番剧推荐
                if (url.includes('api.bilibili.com/pgc/web/recommend/related/recommend')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.recommend(this) });
                }
                // 修改直播数据
                if (url.includes('api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.getRoomPlayInfo(this) });
                }
                // 修改播放器通知
                if (url.includes('api.bilibili.com/x/player/carousel')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.carousel(this) });
                }
                // 修改区域限制
                if (url.includes('season/user/status?')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.status(this) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season/user/status', 'api.bilibili.com/pgc/view/web/season/user/status');
                }
                // 禁用防挡字幕
                if (url.includes('api.bilibili.com/x/player.so')) {
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.playerso(this) });
                }
                // 监听视频链接
                if (url.includes("/playurl?")) {
                    obj.fourk = obj.sign ? null : 1;
                    obj.fnval = obj.fnval ? 80 : null;
                    BLOD.cid = obj.cid || BLOD.cid;
                    BLOD.aid = obj.avid || BLOD.aid || null;
                    BLOD.bvid = obj.bvid || (BLOD.aid && BLOD.abv(BLOD.aid)) || BLOD.bvid || null;
                    if (config.reset.novideo && !obj.sign) {
                        toast.warning("拦截视频链接！", "下载功能在播放器右键菜单", "关闭设置【视频拦截】即可恢复正常！")
                        obj = Object.assign(obj, { aid: 1, cid: 1, ep_id: 1 });
                    }
                    url = BLOD.objUrl(url.split("?")[0], obj);
                    url = url.includes("84956560bc028eb7") ? BLOD.urlSign(url, 0, 8) : url;
                    BLOD.pgc = url.includes("pgc") ? true : false;
<<<<<<< HEAD
                    if (BLOD.pgc && !BLOD.limit && BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.rightsInfo && BLOD.__INITIAL_STATE__.rightsInfo.watch_platform) BLOD.limit = 2;
=======
                    if (BLOD.pgc && BLOD.__INITIAL_STATE__.rightsInfo.watch_platform && !BLOD.limit) BLOD.limit = 2;
>>>>>>> d8a708d (无区域限制也单解除app限制)
                    BLOD.vip = BLOD.big > 1 ? true : BLOD.vip;
                    if (BLOD.big > 1 || (BLOD.vip && BLOD.ids.indexOf(1 * BLOD.cid) >= 0)) this.url = url;
                    if (BLOD.limit) this.url = url;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                    if (this.url) this.send = () => xhrHook.sendPlayurl(this);
=======
                    if (config.reset.novideo) this.url = url;
>>>>>>> 2ea7cf7 (添加视频拦截功能)
=======
                    if (this.url) this.send = () => xhrHook.sendPlayurl(this);
>>>>>>> 215e079 (修改xhr send hook方法)
=======
                    // @ts-ignore
                    if (this.url) this.send = () => xhrHook.sendPlayurl(this);
                    // @ts-ignore
>>>>>>> 2f00fde (format with JsDoc)
=======
                    if (this.url) this.send = () => xhrHook.sendPlayurl(this);
>>>>>>> 39d49de (remove eslint rules)
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.playinfo(this, url) });
                }
                // 新版弹幕兼容pakku.js
                if (url.includes("list.so")) {
                    // pakku.js会在页面上挂一个xhrhook.js来修改xhr对象，这里利用这个特征实现新版弹幕兼容pakku.js
                    if (this.pakku_url && config.reset.danmuku) {
                        // 更改pakku.js请求的url，使它过滤分段弹幕
                        this.pakku_url = url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + BLOD.cid + "&pid=" + BLOD.aid + "&segment_index=1";
                        this.responseType = "arraybuffer";
                        this.callback = this.pakku_load_callback[0];
                        this.respondDanmaku = function (xml) {
                            this.response = this.responseText = xml;
                            this.callback();
                            BLOD.xml = xml;
<<<<<<< HEAD
=======
                            BLOD.hash = [];
                            BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
>>>>>>> 640403b (尝试修复“字幕弹幕”显示效果)
                        }
                        // 将pakku.js返回的数据转换回xml
                        this.pakku_load_callback[0] = function () {
                            toXml(protoSeg.decode(new Uint8Array(this.response)).elems).then((xml) => this.respondDanmaku(xml));
                        }
                        // 处理send方法，针对实例而不再针对所有XMLHttpRequest
<<<<<<< HEAD
                        // 处理pakku.js处于“休眠中”的情况
                        this.pakku_send = () => xhrHook.sendDanmuku(this);
=======
                        if (this.segRequestOnlyOnce) {
                            const addEventListener = XMLHttpRequest.prototype.addEventListener;
                            this.addEventListener = function (name, callback) {
                                if (name == "load") {
                                    this.callBack = this.callBack || [];
                                    this.callBack.push(callback);
                                }
                                return addEventListener.call(this, name, callback);
                            }
                            this.send = () => xhrHook.sendDanmuku(this);
                        }
>>>>>>> 215e079 (修改xhr send hook方法)
                    }
<<<<<<< HEAD
                    else {
                        // 在历史弹幕面板切换回当天的弹幕时，播放器不通过web worker加载弹幕，而是直接请求list.so
                        // 备份弹幕
                        this.addEventListener("load", function () {
                            BLOD.xml = this.response;
=======
                    // 在历史弹幕面板切换回当天的弹幕时，播放器不通过web worker加载弹幕，而是直接请求list.so
                    // 可以直接记录弹幕数据
                    this.addEventListener("load", function () {
                        BLOD.xml = this.response;
                        BLOD.hash = [];
                        BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                    });
                }
                // 历史弹幕
                if (url.includes("history?type=")) {
                    let param = BLOD.urlObj(url);
                    if (param.date) {
                        Object.defineProperty(this, "response", { writable: true });
                        Object.defineProperty(this, "readyState", { writable: true });
                        Object.defineProperty(this, "status", { writable: true });
                        Object.defineProperty(this, "send", { writable: true });
                        this.readyState = 4;
                        this.status = 200;
                        this.send = () => { };
                        let historyXhr = this;
                        
                        let seg = new XMLHttpRequest();
                        seg.addEventListener("load", function () {
                            let segDanmaku = protoSeg.decode(new Uint8Array(seg.response)).elems;
                            BLOD.hash = [];
                            for (let i = 0; i < segDanmaku.length; i++) {
                                BLOD.hash.push(segDanmaku[i].midHash);
                            }
                            toXml(segDanmaku).then((xml) => {
                                historyXhr.response = xml;
                                historyXhr.dispatchEvent(new ProgressEvent("load"));
                                BLOD.xml = xml;
                            });
                        });
                        seg.withCredentials = true;
                        seg.responseType = "arraybuffer";
                        seg.open("get", "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + BLOD.cid + "&date=" + param.date);
                        seg.send();
                    }
                }
                return open.call(this, method, url, ...rest);
            }
        }
<<<<<<< HEAD
        send() {
            const send = XMLHttpRequest.prototype.send;
            const addEventListener = XMLHttpRequest.prototype.addEventListener;
            XMLHttpRequest.prototype.send = function (...arg) {
                // 新版弹幕兼容pakku.js
                // pakku.js休眠中，钩子捕捉到首次对seg.so发起请求时触发
                // (pakku.js正常运行时这个send()不会被调用)
                if (config.reset.danmuku && (this.pakku_url && this.pakku_url.includes("seg.so") && this.segRequestOnlyOnce)) {
                    this.segRequestOnlyOnce = false;
                    // pakku.js会禁用Worker，这时需要模拟一个xhr响应
                    Object.defineProperty(this, "response", { writable: true });
                    Object.defineProperty(this, "responseText", { writable: true });
                    Object.defineProperty(this, "readyState", { writable: true });
                    Object.defineProperty(this, "status", { writable: true });
                    this.readyState = 4;
                    this.status = 200;
                    this.abort();
                    let callBack = this.callBack;
                    let xhr = this;
                    getSegDanmaku(function (protoSegments) {
                        let Segments = [];
                        protoSegments.forEach(function (seg) {
                            Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
>>>>>>> 891da5e (完善伪造xhr响应event流程)
                        });
                    }
                }
<<<<<<< HEAD
                // 历史弹幕
                if (url.includes("history?type=")) {
                    let param = BLOD.urlObj(url);
                    if (param.date) {
                        Object.defineProperty(this, "response", { writable: true });
                        Object.defineProperty(this, "readyState", { writable: true });
                        Object.defineProperty(this, "status", { writable: true });
<<<<<<< HEAD
                        Object.defineProperty(this, "send", { writable: true });
                        this.readyState = 4;
                        this.status = 200;
                        this.send = () => { };
<<<<<<< HEAD
                        let historyXhr = this;
                        
                        let seg = new XMLHttpRequest();
<<<<<<< HEAD
                        seg.addEventListener("load", function () {
                            let segDanmaku = protoSeg.decode(new Uint8Array(seg.response)).elems;
=======
                        seg.addEventListener("load", () => {
                            let segDanmaku;
                            try {
                                segDanmaku = protoSeg.decode(new Uint8Array(seg.response)).elems;
                            } catch (e) {
                                toast.error("载入历史弹幕失败", "请尝试刷新页面");
                                toast.error(e);
                                return;
=======
                        let response, accesskey = "";
                        try {
                            if (config.reset.novideo) response = { "code": -404, "message": "临时主动拦截视频", "data": null }
                            else if (BLOD.limit) {
                                // 区域限制 + APP限制的DASH似乎缺少码率信息，现默认启用flv以规避，platform用于伪装成APP
                                if (BLOD.uid && (BLOD.ids.indexOf(1 * BLOD.cid) >= 0) && config.reset.accesskey) accesskey = GM_getValue("access_key") || "";
                                let obj = Object.assign(BLOD.urlObj(this.url), BLOD.__INITIAL_STATE__.rightsInfo.watch_platform ? { access_key: accesskey, fnval: "", fnver: "", module: "pgc", platform: "android_i" } : { access_key: accesskey, module: "pgc" })
                                response = BLOD.jsonCheck(await BLOD.xhr.true(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                response = { "code": 0, "message": "success", "result": response };
>>>>>>> 5cf66d3 (优化xhr send响应模拟)
                            }
<<<<<<< HEAD
>>>>>>> 5e8f294 (载入弹幕失败时弹出提示)
                            BLOD.hash = [];
                            for (let i = 0; i < segDanmaku.length; i++) {
                                BLOD.hash.push(segDanmaku[i].midHash);
                            }
=======

                        let history = "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + BLOD.cid + "&date=" + param.date;
                        BLOD.xhr.true(history, "arraybuffer").then((seg) => {
                            let segDanmaku = protoSeg.decode(new Uint8Array(seg)).elems;
>>>>>>> aeac0ec (重构弹幕反查)
                            toXml(segDanmaku).then((xml) => {
                                historyXhr.response = xml;
                                historyXhr.dispatchEvent(new ProgressEvent("load"));
                                BLOD.xml = xml;
                            });
                        });
                        seg.withCredentials = true;
                        seg.responseType = "arraybuffer";
                        seg.open("get", "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&oid=" + BLOD.cid + "&date=" + param.date);
                        seg.send();
=======
                        }
                        catch (e) { debug.msg("解除限制失败 ಥ_ಥ", ...e); response = { "code": -404, "message": e, "data": null }; }
                        this.response = this.responseText = JSON.stringify(response);
                        this.status = 200;
                        this.readyState = 2;
                        this.readyState = 4;
                        this.onreadystatechange && this.onreadystatechange();
                        if (response.code !== 0) throw response.message;
                        BLOD.__playinfo__ = response;
                        debug.log("解除限制", "aid=", BLOD.aid, "cid=", BLOD.cid);
>>>>>>> 49b0faa (restore comment bangumi jump)
                    }
=======
                else if (this.url) {
<<<<<<< HEAD
                    setTimeout(async () => {
=======
                    let hookTimeOut = new HookTimeOut();
                    (async () => {
>>>>>>> d9f62f5 (过滤旧版播放器强制初始化错误)
                        try {
                            let response = {}, accesskey = null, progress = setInterval(() => { this.dispatchEvent(new ProgressEvent("progress")) }, 50);
                            this.dispatchEvent(new ProgressEvent("loadstart"));
                            Object.defineProperty(this, "response", { writable: true });
                            Object.defineProperty(this, "responseText", { writable: true });
                            Object.defineProperty(this, "responseURL", { writable: true });
                            Object.defineProperty(this, "readyState", { writable: true });
                            Object.defineProperty(this, "status", { writable: true });
                            this.status = 200;
                            this.readyState = 2;
                            this.dispatchEvent(new ProgressEvent("readystatechange"));
                            try {
                                if (BLOD.limit) {
                                    // 区域限制 + APP限制的DASH似乎缺少码率信息，现默认启用flv以规避，platform用于伪装成APP
                                    if (BLOD.uid && (BLOD.ids.indexOf(1 * BLOD.cid) >= 0) && config.reset.accesskey) accesskey = BLOD.getValue("access_key") || null;
                                    let obj = Object.assign(BLOD.urlObj(this.url), BLOD.__INITIAL_STATE__.rightsInfo.watch_platform ? { access_key: accesskey, fnval: null, fnver: null, module: "pgc", platform: "android_i" } : { access_key: accesskey, module: "pgc" })
<<<<<<< HEAD
                                    response = BLOD.jsonCheck(await BLOD.xhr.true(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
=======
                                    if (BLOD.limit == 2) response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurl", Object.assign(obj, { module: null }), 1)));
                                    else {
                                        try {
                                            //response = BLOD.jsonCheck(await BLOD.xhr.true(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));} catch (e) {
                                            //e = Array.isArray(e) ? e : [e];
                                            //debug.error("pgc模式出错", ...e)
                                            //try {
                                            obj.module = "bangumi";
                                            response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                        } catch (e) {
                                            e = Array.isArray(e) ? e : [e];
                                            debug.msg("解除限制失败 ಥ_ಥ", ...e)
                                            response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://api.global.bilibili.com/intl/gateway/v2/ogv/playurl", { aid: obj.avid || BLOD.aid, ep_id: obj.ep_id })));
                                            BLOD.__playinfo__ = { "code": 0, "message": "success", "result": xhrHook.ogvplayurl(response) };
                                            debug.msg("此类视频暂时无法播放", "请尝试右键调出下载", 300000);
                                            throw false;
                                        }
                                    }
>>>>>>> d8a708d (无区域限制也单解除app限制)
                                    response = { "code": 0, "message": "success", "result": response };
                                }
                            }
                            catch (e) { response = { "code": -404, "message": e, "data": null }; }
                            clearInterval(progress);
                            this.responseURL = this.url;
                            this.response = this.responseText = JSON.stringify(response);
                            this.readyState = 4;
                            this.dispatchEvent(new ProgressEvent("readystatechange"));
                            this.dispatchEvent(new ProgressEvent("load"));
                            this.dispatchEvent(new ProgressEvent("loadend"));
                            hookTimeOut.relese();
                            if (response.code !== 0) throw response.message;
                            BLOD.__playinfo__ = response;
                            debug.log("解除限制", "aid=", BLOD.aid, "cid=", BLOD.cid);
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
                    })
                }
                else {
                    send.call(this, ...arg);
                }
            }
            XMLHttpRequest.prototype.addEventListener = function (name, callback) {
                if (name == "load") {
                    this.callBack = this.callBack || [];
                    this.callBack.push(callback);
>>>>>>> 891da5e (完善伪造xhr响应event流程)
                }
                // 监听页面多次重写jsonp
                if (window.$ && (xhrHook.$ != window.$)) { xhrHook.jsonp(); xhrHook.$ = window.$; }
                return open.call(this, method, url, ...rest);
            }
        }
=======
>>>>>>> 215e079 (修改xhr send hook方法)
        jsonp() {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
            // @ts-ignore
>>>>>>> 2f00fde (format with JsDoc)
=======
>>>>>>> 39d49de (remove eslint rules)
            window.$.ajaxSetup({
                beforeSend: function (xhr) {
                    // 拦截日志上传
                    if (this.url.includes("data.bilibili.com/log/web")) xhr.abort();
=======
            window.$.ajaxSetup({
                beforeSend: function () {
>>>>>>> d418687 (jsonp hook全部使用新方法)
                    // 广告区转资讯区
                    if (this.url.includes("region") && this.url.includes("rid=165")) this.url = this.url.replace("rid=165", "rid=202");
                    // 取消原创排行榜
                    if (this.url.includes("region") && this.url.includes("original=1")) this.url = this.url.replace("original=1", "original=0");
                    // 修复置顶推荐
                    if (this.url.includes("api.bilibili.com/x/web-interface/ranking/index")) this.url = this.url.replace("ranking/index", "index/top");
                    // 跳过充电鸣谢
                    if (config.reset.electric && this.url.includes("api.bilibili.com/x/web-interface/elec/show")) this.url = BLOD.objUrl(this.url.split("?")[0], Object.assign(BLOD.urlObj(this.url), { aid: 1, mid: 1 }));
                    // 清除远古动态
                    if (this.url.includes("api.bilibili.com/x/web-feed/feed/unread")) this.url = this.url.replace("feed/unread", "article/unread");
                    // 修复评论楼层并修复mode返回值
<<<<<<< HEAD
<<<<<<< HEAD
                    if (config.reset.replyfloor && this.url.includes('api.bilibili.com/x/v2/reply') && this.url.includes('oid')) {
=======
                    if (config.reset.replyfloor && this.url.includes('api.bilibili.com/x/v2/reply')) {
>>>>>>> d418687 (jsonp hook全部使用新方法)
=======
                    if (config.reset.replyfloor && this.url.includes('api.bilibili.com/x/v2/reply') && this.url.includes('oid')) {
>>>>>>> 5d32692 (修复评论区点赞/点踩误伤)
                        this.url = this.url + '&mobi_app=android';
                        let jsonpCallback = this.jsonpCallback;
                        let call = window[jsonpCallback];
                        if (call) {
                            window[jsonpCallback] = function (v) {
                                if (v && v.data && v.data.replies && v.data.mode === 1) v.data.mode = 3;
<<<<<<< HEAD
<<<<<<< HEAD
                                if (v && v.data && v.data.upper && v.data.upper.top && v.data.upper.top.replies) BLOD.topReply = v.data.upper.top.replies;
                                if (BLOD.topReply && v.data && v.data.upper && v.data.upper.top && !v.data.upper.top.replies) v.data.upper.top.replies = BLOD.topReply;
=======
                                if (v && v.data && v.data.upper && v.data.upper.top && v.data.upper.top.replies) BLOD.topReply = v.data.upper.top.replies;
                                if (BLOD.topReply && !v.data.upper.top.replies) v.data.upper.top.replies = BLOD.topReply;
>>>>>>> dc1272d (备份并恢复置顶评论)
                                BLOD.reset.setReplyFloor.init(v)
                                return call.call(this, v);
                            }
                        }
                    }
                    // 替换旧版顶栏动图彩蛋
                    if (config.reset.indexIcon && this.url.includes("api.bilibili.com/x/web-interface/index/icon")) {
                        let jsonpCallback = this.jsonpCallback;
                        let call = window[jsonpCallback];
                        if (call) {
                            window[jsonpCallback] = function (v) {
                                v.data = BLOD.randomArray(JSON.parse(BLOD.getResourceText("icon")).fix, 1)[0];
                                return call.call(this, v);
                            }
                        }
                    }
                }
            })
=======
            const ajax = window.$.ajax;
            window.$.ajax = function (...rest) {
                rest.forEach((d, i, r) => {
                    if (d && d.dataType && d.dataType == "jsonp") {
                        // 替换广告区rid为资讯区rid
                        if (d.url.includes("region") && d.data.rid == 165) r[i].data.rid = 202;
                        // 替换原创排行为全部排行
                        if (d.url.includes("region") && d.data.original == 1) r[i].data.original = 0;
                        // 修改置顶推荐
                        if (d.url.includes('api.bilibili.com/x/web-interface/ranking/index')) r[i].url = r[i].url.replace('ranking/index', 'index/top');
                        // 跳过充电鸣谢
                        if (config.reset.electric && d.url.includes('api.bilibili.com/x/web-interface/elec/show')) r[i].data = { jsonp: "jsonp", aid: 1, mid: 1 };
                        // 清除远古动态
                        if (d.url.includes('api.bilibili.com/x/web-feed/feed/unread')) r[i].url = r[i].url.replace('feed/unread', 'article/unread');
                        // 修复评论楼层
                        if (config.reset.replyfloor && d.url.includes('api.bilibili.com/x/v2/reply')) {
                            if (d.url.includes('?')) rest[i].url = rest[i].url + '&mobi_app=android';
                            else if (d.data && d.data.oid) {
                                // 新版评论需修改返回值固定mode=3，使用deferred.pipe进行操作
                                BLOD.pipe = (v) => {
                                    if (v && v.data && v.data.replies && v.data.mode === 1) v.data.mode = 3;
                                    return v;
                                }
                                rest[i].data.mobi_app = "android";
=======
                                BLOD.reset.setReplyFloor.init(v)
                                return call.call(this, v);
>>>>>>> d418687 (jsonp hook全部使用新方法)
                            }
                        }
                    }
                })
                // 由于jQuery版本差异太大，需要严谨限定pipe操作对象
                let run = BLOD.pipe;
                delete BLOD.pipe;
                return ajax.call(this, ...rest).pipe(run).done((v) => {
                    // 记录评论楼层
                    if (v && v.data && v.data.replies) BLOD.reset.setReplyFloor.init(v);
                });
            }
>>>>>>> 3d73ce2 (restore elec jump)
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 首页正在直播
=======
        /**
         * 处理主页正在直播数据
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         * @param {[]} hook 处理纪录数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 处理主页正在直播数据
         * @param {*} obj XMLHttpRequest对象
         * @param {Array} hook 处理纪录数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        biliIndexRec(obj, hook = []) {
            try {
                hook.push(BLOD.jsonCheck(obj.responseText));
                let response = obj.responseText.replace(/preview_banner_list/, "preview").replace(/ranking_list/, "ranking").replace(/recommend_room_list/, "recommend");
                response = JSON.parse(response);
                response.data.text_link = { text: "233秒居然能做这些！", link: "//vc.bilibili.com" };
                if (response.data.recommend) {
                    for (let i = 0; i < response.data.recommend.length; i++) {
                        response.data.recommend[i].pic = response.data.recommend[i].cover;
                        response.data.recommend[i].link = "//live.bilibili.com" + response.data.recommend[i].link;
                    }
                }
                if (response.data.preview) for (let i = 0; i < response.data.preview.length; i++) response.data.preview[i].url = response.data.preview[i].link;
                hook.push(response);
                debug.debug("XHR重定向", "修复正在直播", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
<<<<<<< HEAD
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("获取直播数据推荐及排行失败！", ...e); }
=======
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("首页推荐", ...e) }
>>>>>>> efcabf8 (Update xhrhook.js)
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 修复番剧季度信息
=======
        /**
         * 处理番剧季度信息
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         * @param {[]} hook 处理纪录数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 处理番剧季度信息
         * @param {*} obj XMLHttpRequest对象
         * @param {Array} hook 处理纪录数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        season(obj, hook = []) {
            try {
                hook.push(BLOD.jsonCheck(obj.responseText));
                let response = BLOD.jsonCheck(obj.responseText);
                if (response.result.section) for (let i = 0; i < response.result.section.length; i++) response.result.episodes.push(...response.result.section[i].episodes);
                for (let i = 0; i < response.result.episodes.length; i++) {
                    response.result.episodes[i].ep_id = response.result.episodes[i].id;
                    response.result.episodes[i].episode_status = response.result.episodes[i].status;
                    response.result.episodes[i].index = response.result.episodes[i].title;
                    response.result.episodes[i].index_title = response.result.episodes[i].long_title;
                }
                hook.push(response);
                debug.debug("XHR重定向", "番剧季度信息", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("番剧季度信息", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 修复番剧追番信息
=======
        /**
         * 处理番剧追番信息
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         * @param {[]} hook 处理纪录数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 处理番剧追番信息
         * @param {*} obj XMLHttpRequest对象
         * @param {Array} hook 处理纪录数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        stat(obj, hook = []) {
            try {
                hook.push(BLOD.jsonCheck(obj.responseText));
                let response = BLOD.jsonCheck(obj.responseText);
                response.result.favorites = response.result.follow;
                hook.push(response);
                debug.debug("XHR重定向", "番剧追番信息", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 修改直播数据
=======
        /**
         * 处理直播间数据
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         * @param {[]} hook 处理纪录数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 处理直播间数据
         * @param {*} obj XMLHttpRequest对象
         * @param {Array} hook 处理纪录数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        getRoomPlayInfo(obj, hook = []) {
            if (!config.reset.roomplay) return;
            try {
                hook.push(BLOD.jsonCheck(obj.responseText));
                let response = BLOD.jsonCheck(obj.responseText);
                if (response.data) {
                    response.data.live_status = 0;
                    response.data.live_time = -1;
                    response.data.playurl_info = null;
                }
                hook.push(response);
                toast.warning("拦截直播间视频流！", "关闭【直播拦截】功能可恢复正常！")
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("直播拦截", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 修改番剧推荐
=======
        /**
         * 处理番剧推荐数据
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         * @param {[]} hook 处理纪录数组
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 处理番剧推荐数据
         * @param {*} obj XMLHttpRequest对象
         * @param {Array} hook 处理纪录数组
         */
>>>>>>> 2f00fde (format with JsDoc)
        recommend(obj, hook = []) {
            try {
                hook.push(BLOD.jsonCheck(obj.responseText));
                let response = BLOD.jsonCheck(obj.responseText);
                if (response.result && response.result.season) response.result = response.result.season;
                hook.push(response);
                debug.debug("XHR重定向", "修改番剧推荐", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("番剧推荐", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 生成播放信息
=======
        /**
         * 构造旧版播放器通知数据
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 构造旧版播放器通知数据
         * @param {*} obj XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        carousel(obj) {
            if (!config.reset.carousel) return;
            try {
                let msg = BLOD.loc || [];
                msg.push(...BLOD.randomArray([
                    ['https://www.bilibili.com/blackboard/activity-4KPC.html', '解锁超清4K画质'],
                    ['https://www.bilibili.com/blackboard/activity-4K120FPS-PC.html', '4K120FPS投稿全量开放'],
                    ['https://www.bilibili.com/blackboard/bilibili2009.html', '十年前的B站长啥样'],
                    ['https://www.bilibili.com/blackboard/html5playerhelp.html', 'HTML5播放器试用'],
                ], 2));
                let xmltext = '<msg><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2320" id="314825"><![CDATA[<a href="' + msg[0][0] + '" target="_blank"><font color="#FFFFFF">' + msg[0][1] + '</font></a>]]></item><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2321" id="314372"><![CDATA[<a href="' + msg[1][0] + '" target="_blank"><font color="#FFFFFF">' + msg[1][1] + '</font></a>]]></item></msg>';
                let parser = new DOMParser(),
                    responseXML = parser.parseFromString(xmltext, "text/xml");
                Object.defineProperty(obj, 'responseXML', { writable: true });
                obj.responseXML = responseXML;
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("播放通知", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        // 禁用防挡字幕
=======
        /**
         * 禁用防挡字幕
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 禁用防挡字幕
         * @param {*} obj XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        playerso(obj) {
            if (BLOD.preventshade) return;
=======
        // 禁用防挡字幕
        playerso(obj) {
>>>>>>> d635135 (禁用防挡字幕)
            let response = obj.responseText;
            if (response.includes("<bottom>1</bottom>")) {
                response = response.replace("<bottom>1</bottom>", "<bottom>0</bottom>");
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = response;
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 处理番剧信息数据
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
>>>>>>> d635135 (禁用防挡字幕)
=======
        /**
         * 处理番剧信息数据
         * @param {*} obj XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        status(obj) {
            try {
                let response = BLOD.jsonCheck(obj.responseText);
                if (response.result) {
                    if (config.reset.limit && response.result.area_limit) {
                        response.result.area_limit = 0;
                        response.ban_area_show = 1;
                        BLOD.limit = true;
                    }
                    if (response.result.pay) BLOD.big = 0;
                    if (!response.result.pay && BLOD.big && response.result.dialog) {
                        response.result.pay = 1;
                        BLOD.vip = true;
                    }
                    if (response.result.progress) response.result.watch_progress = response.result.progress;
                    if (response.result.vip_info) response.result.vipInfo = response.result.vip_info;
                    Object.defineProperty(obj, 'response', { writable: true });
                    Object.defineProperty(obj, 'responseText', { writable: true });
                    obj.response = obj.responseText = JSON.stringify(response);
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("强制启用播放器", ...e) }
        }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        // 模拟弹幕响应
=======
        /**
         * 模拟弹幕响应
         * @param {XMLHttpRequest} xhr XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 模拟弹幕响应
         * @param {*} xhr XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        async sendDanmuku(xhr) {
            // 安装并启用了pakku.js，并且将其设置成“休眠中”状态，才会运行这里的代码
            // pakku.js处于“工作中”状态时，不会调用send()，而是向回调函数直接投喂过滤之后的弹幕
=======
        // 模拟弹幕响应
        async sendDanmuku(xhr) {
            // 新版弹幕兼容pakku.js
            // pakku.js休眠中，钩子捕捉到首次对seg.so发起请求时触发
            // (pakku.js正常运行时这个send()不会被调用)
            xhr.segRequestOnlyOnce = false;
            // pakku.js会禁用Worker，这时需要模拟一个xhr响应
>>>>>>> 215e079 (修改xhr send hook方法)
            Object.defineProperty(xhr, "response", { writable: true });
            Object.defineProperty(xhr, "responseText", { writable: true });
            Object.defineProperty(xhr, "readyState", { writable: true });
            Object.defineProperty(xhr, "status", { writable: true });
            xhr.readyState = 4;
            xhr.status = 200;
            xhr.abort();
<<<<<<< HEAD
            getSegDanmaku((protoSegments) => {
                let Segments = [];
                protoSegments.forEach(seg => (Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems)));
                toXml(Segments).then((xml) => xhr.respondDanmaku(xml));
            });
        }
<<<<<<< HEAD
<<<<<<< HEAD
        // 代理playurl响应
=======
        /**
         * 模拟playurl响应
         * @param {XMLHttpRequest} xhr XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
            let callBack = xhr.callBack;
            getSegDanmaku(function (protoSegments) {
                let Segments = [];
                protoSegments.forEach(function (seg) {
                    Segments = Segments.concat(protoSeg.decode(new Uint8Array(seg)).elems);
                });
                toXml(Segments).then(function (toXml) {
                    callBack.forEach(function (f) {
                        xhr.response = xhr.responseText = toXml;
                        f.call(xhr);
                    });
                    // 备份弹幕
                    BLOD.xml = xhr.response;
                    BLOD.hash = [];
                    BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                });
            });
        }
        // 代理playurl响应
>>>>>>> 215e079 (修改xhr send hook方法)
=======
        /**
         * 模拟playurl响应
         * @param {*} xhr XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        async sendPlayurl(xhr) {
            try {
                let hookTimeOut = new HookTimeOut(),
                    response = {},
                    accesskey = null,
                    progress = setInterval(() => { xhr.dispatchEvent(new ProgressEvent("progress")) }, 50);
                xhr.dispatchEvent(new ProgressEvent("loadstart"));
                Object.defineProperty(xhr, "response", { writable: true });
                Object.defineProperty(xhr, "responseText", { writable: true });
                Object.defineProperty(xhr, "responseURL", { writable: true });
                Object.defineProperty(xhr, "readyState", { writable: true });
                Object.defineProperty(xhr, "status", { writable: true });
                xhr.status = 200;
                xhr.readyState = 2;
                xhr.dispatchEvent(new ProgressEvent("readystatechange"));
                try {
                    if (BLOD.limit) {
                        // 区域限制 + APP限制的DASH似乎缺少码率信息，现默认启用flv以规避，platform用于伪装成APP
                        if (BLOD.uid && (BLOD.ids.indexOf(1 * BLOD.cid) >= 0) && config.reset.accesskey) accesskey = BLOD.getValue("access_key") || null;
                        let obj = Object.assign(BLOD.urlObj(xhr.url), BLOD.__INITIAL_STATE__.rightsInfo.watch_platform ? { access_key: accesskey, fnval: null, fnver: null, module: "pgc", platform: "android_i" } : { access_key: accesskey, module: "pgc" })
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 43b3ef7 (启用toast模块)
                        if (BLOD.limit == 2) {
                            toast.info("尝试解除APP限制...", "使用移动端flv接口");
                            response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurl", Object.assign(obj, { module: null }), 1)));
                        } else {
<<<<<<< HEAD
                            try {
                                toast.info("尝试解除区域限制...", "访问代理服务器");
                                obj.fnval = obj.fnval ? 16 : null;
<<<<<<< HEAD
                                obj.module = "bangumi";
                                response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                let reBuildPlayerurl = new ReBuildPlayerurl();
                                response = await reBuildPlayerurl.appPlayurl(response);
                            } catch (e) {
                                try {
                                    e = Array.isArray(e) ? e : [e];
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                    debug.error("limit", ...e);
                                    toast.error("拉取视频链接出错！", "尝试拉取Thailand链接...");
=======
                                    toast.error("尝试拉取Thailand链接...", "需要人在当地！");
>>>>>>> efcabf8 (Update xhrhook.js)
=======
                                    debug.error("区域代理失败", ...e);
=======
>>>>>>> efcabf8 (Update xhrhook.js)
                                    toast.error("尝试拉取Thailand链接...", "需要人在当地！");
>>>>>>> 760e38a (Update JavaScript module)
=======
                                    toast.error("代理服务器出错！", ...e);
                                    toast("尝试拉取Thailand链接...");
>>>>>>> 8e2de3c (remove bangumi bofqi style)
                                    response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://api.global.bilibili.com/intl/gateway/v2/ogv/playurl", { aid: obj.avid || BLOD.aid, ep_id: obj.ep_id, download: 1 })));
=======
                                    toast.error("代理服务器出错！", ...e);
                                    toast("尝试拉取Thailand链接...");
                                    let thai = BLOD.getValue("thaiLand") || "https://api.global.bilibili.com";
                                    response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl(`${thai}/intl/gateway/v2/ogv/playurl`, { aid: obj.avid || BLOD.aid, ep_id: obj.ep_id, download: 1 })));
>>>>>>> 57513a7 (Thailand server)
                                    let reBuildPlayerurl = new ReBuildPlayerurl();
                                    response = await reBuildPlayerurl.ogvPlayurl(response);
                                } catch (e) {
                                    e = Array.isArray(e) ? e : [e];
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                                    debug.error("Thailand", ...e);
                                    toast.error("拉取Thailand链接失败！", "需要Thailand代理服务器 ಥ_ಥ");
=======
                                    throw toast.error("拉取Thailand链接失败！", "无效Thailand代理服务器 ಥ_ಥ");
>>>>>>> efcabf8 (Update xhrhook.js)
=======
                                    debug.error("拉取Thailand失败", ...e);
                                    toast.error("拉取Thailand链接失败！", "无效Thailand代理服务器 ಥ_ಥ");
>>>>>>> 760e38a (Update JavaScript module)
=======
                                    throw toast.error("拉取Thailand链接失败！", "无效Thailand代理服务器 ಥ_ಥ");
>>>>>>> efcabf8 (Update xhrhook.js)
=======
                                    throw toast.error("拉取Thailand链接失败！", ...e);
>>>>>>> 8e2de3c (remove bangumi bofqi style)
                                }
=======
                        if (BLOD.limit == 2) response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.urlSign("https://api.bilibili.com/pgc/player/api/playurl", Object.assign(obj, { module: null }), 1)));
                        else {
=======
>>>>>>> 43b3ef7 (启用toast模块)
                            try {
                                toast.info("尝试解除区域限制...")
=======
>>>>>>> 3a04522 (过滤问题音频)
                                obj.module = "bangumi";
                                response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                let reBuildPlayerurl = new ReBuildPlayerurl();
                                response = await reBuildPlayerurl.appPlayurl(response);
                            } catch (e) {
                                e = Array.isArray(e) ? e : [e];
                                toast.error("解除限制失败 ಥ_ಥ");
                                debug.msg("解除限制失败 ಥ_ಥ", ...e);
                                response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://api.global.bilibili.com/intl/gateway/v2/ogv/playurl", { aid: obj.avid || BLOD.aid, ep_id: obj.ep_id, download: 1 })));
<<<<<<< HEAD
                                BLOD.__playinfo__ = { "code": 0, "message": "success", "result": xhrHook.ogvPlayurl(response) };
                                toast.success("获取到下载链接！", "详见播放器右键下载菜单");
                                debug.msg("此类视频暂时无法播放", "请尝试右键调出下载", 300000);
                                throw false;
>>>>>>> 215e079 (修改xhr send hook方法)
=======
                                toast("尝试重构playurl...")
                                let reBuildPlayerurl = new ReBuildPlayerurl();
                                response = await reBuildPlayerurl.ogvPlayurl();
>>>>>>> 9f51f48 (reBuildPlayerurl)
                            }
                        }
                        response = { "code": 0, "message": "success", "result": response };
                    }
                    else if (BLOD.vip) response = BLOD.free && (await BLOD.free());
                }
<<<<<<< HEAD
                catch (e) {
                    response = { "code": -404, "message": e, "data": null };
                }
=======
                catch (e) { response = { "code": -404, "message": e, "data": null }; }
>>>>>>> 215e079 (修改xhr send hook方法)
                clearInterval(progress);
                xhr.responseURL = xhr.url;
                xhr.response = xhr.responseText = JSON.stringify(response);
                xhr.readyState = 4;
                xhr.dispatchEvent(new ProgressEvent("readystatechange"));
                xhr.dispatchEvent(new ProgressEvent("load"));
                xhr.dispatchEvent(new ProgressEvent("loadend"));
                hookTimeOut.relese();
                if (response.code !== 0) throw response.message;
                BLOD.__playinfo__ = response;
<<<<<<< HEAD
<<<<<<< HEAD
                toast.success("解除限制！", "aid=" + BLOD.aid, "cid=" + BLOD.cid);
<<<<<<< HEAD
            }
            catch (e) { toast.error("解除限制失败", e); e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
        }
<<<<<<< HEAD
=======
=======
                debug.log("解除限制", "aid=", BLOD.aid, "cid=", BLOD.cid);
=======
                toast.success("解除限制！", "aid=", BLOD.aid, "cid=", BLOD.cid);
>>>>>>> efcabf8 (Update xhrhook.js)
            }
<<<<<<< HEAD
<<<<<<< HEAD
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
        }
<<<<<<< HEAD
>>>>>>> 215e079 (修改xhr send hook方法)
        // 重构泰国番剧playurl
        // DASH码率，索引等信息丢失，无法直接播放只能下载。
        ogvPlayurl(ogv) {
            ogv = ogv.data.video_info;
            ogv.audio = [];
            ogv.dash_audio.forEach((i) => {
                ogv.audio.push({
                    SegmentBase: { Initialization: "0-919", indexRange: "920-4539" },
                    backupUrl: [],
                    backup_url: [],
                    bandwidth: i.bandwidth,
                    baseUrl: i.base_url,
                    base_url: i.base_url,
                    codecid: i.codecid,
                    codecs: "mp4a.40.2",
                    frameRate: "",
                    frame_rate: "",
                    height: 0,
                    id: i.id,
                    md5: i.md5,
                    mimeType: "audio/mp4",
                    mime_type: "audio/mp4",
                    sar: "",
                    segment_base: { initialization: "0-919", index_range: "920-4539" },
                    size: i.size,
                    startWithSAP: 0,
                    start_with_sap: 0,
                    width: 0
                })
            })
            ogv.video = [];
            ogv.stream_list.forEach((i) => {
                if (i.dash_video && i.dash_video.base_url) {
                    ogv.video.push({
                        SegmentBase: { Initialization: "0-991", indexRange: "992-4599" },
                        backupUrl: [],
                        backup_url: [],
                        bandwidth: i.dash_video.bandwidth,
                        baseUrl: i.dash_video.base_url,
                        base_url: i.dash_video.base_url,
                        codecid: i.dash_video.codecid,
                        codecs: "avc1.64001F",
                        frameRate: "25",
                        frame_rate: "25",
                        height: 15 * i.stream_info.quality,
                        id: i.stream_info.quality,
                        md5: "",
                        mimeType: "video/mp4",
                        mime_type: "video/mp4",
                        sar: "1:1",
                        segment_base: { initialization: "0-991", index_range: "992-4599" },
                        size: i.dash_video.size,
                        startWithSAP: 1,
                        start_with_sap: 1,
                        width: 75 * i.stream_info.quality / 4
                    })
                }
            })
            return {
                "accept_description": ["高清 720P", "清晰 480P", "流畅 360P"],
                "accept_format": "flv720,flv480,mp4",
                "accept_quality": [64, 32, 16],
                "bp": 0,
                "code": 0,
                "dash": {
                    "audio": ogv.audio,
                    "dolby": {
                        "audio": [],
                        "type": "NONE"
                    },
                    "duration": Math.ceil(ogv.timelength / 1000),
                    "minBufferTime": 1.5,
                    "min_buffer_time": 1.5,
                    "video": ogv.video
                },
                "fnval": 80,
                "fnver": 0,
                "format": "flv480",
                "from": "local",
                "has_paid": false,
                "is_preview": 0,
                "message": "",
                "no_rexcode": 0,
                "quality": 32,
                "result": "suee",
                "seek_param": "start",
                "seek_type": "offset",
                "status": 2,
                "support_formats": [{
                    "description": "高清 720P",
                    "display_desc": "720P",
                    "format": "flv720",
                    "need_login": true,
                    "new_description": "720P 高清",
                    "quality": 64,
                    "superscript": ""
                }, {
                    "description": "清晰 480P",
                    "display_desc": "480P",
                    "format": "flv480",
                    "new_description": "480P 清晰",
                    "quality": 32,
                    "superscript": ""
                }, {
                    "description": "流畅 360P",
                    "display_desc": "360P",
                    "format": "mp4",
                    "new_description": "360P 流畅",
                    "quality": 16,
                    "superscript": ""
                }
                ],
                "timelength": ogv.timelength,
                "type": "DASH",
                "video_codecid": 7,
                "video_project": true
            }
=======
            catch (e) { toast.error("解除限制失败", e); e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
>>>>>>> ef2d7cf ( 记录跨域url及返回值)
=======
            catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("解除限制失败", ...e); }
>>>>>>> 760e38a (Update JavaScript module)
=======
            } catch (e) { e = Array.isArray(e) ? e : [e]; toast.error("解除限制失败", ...e); }
>>>>>>> 8e2de3c (remove bangumi bofqi style)
        }
<<<<<<< HEAD
>>>>>>> 65c15a5 (重构泰国番剧playurl)
=======
>>>>>>> 9f51f48 (reBuildPlayerurl)
        // 监听视频地址
=======
        /**
         * 监听playurl
         * @param {XMLHttpRequest} obj XMLHttpRequest对象
         */
>>>>>>> 6a3a64a (BigInt polyfill)
=======
        /**
         * 监听playurl
         * @param {*} obj XMLHttpRequest对象
         */
>>>>>>> 2f00fde (format with JsDoc)
        async playinfo(obj) {
            try {
                if (!obj.response) throw obj;
                BLOD.__playinfo__ = typeof obj.response == "object" ? obj.response : BLOD.jsonCheck(obj.response);
                // 移除下载面板
                if (document.getElementById("bili-old-download-table")) document.getElementById("bili-old-download-table").remove();
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("视频监听", ...e) }
        }
    }

    let xhrHook = new Xhrhook();
    // 分别hook WebSocket、worker、XMLHttpRequest.open
    // jQuery的jsonp非原生对象，延时5s捕获到再hook
    // XMLHttpRequest.send直接在XMLHttpRequest.open对应实例进行处理
    if (config.reset.livechat) xhrHook.webSocket();
    if (config.reset.danmuku && Worker) xhrHook.worker();
    xhrHook.open();

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    if (window.$ && window.$.ajaxSetup) xhrHook.jsonp();
})()
=======
=======
    // @ts-ignore
>>>>>>> 2f00fde (format with JsDoc)
=======
>>>>>>> 39d49de (remove eslint rules)
    if (window.$ && window.$.ajax) xhrHook.jsonp();
    else {
        let timer = setInterval(() => {
            if (window.$) {
                clearInterval(timer);
                xhrHook.jsonp();
            }
        }, 10);
        setTimeout(() => clearInterval(timer), 5000);
    }
<<<<<<< HEAD
})()
>>>>>>> 34dad0d (更新protobuf弹幕结构体)
=======
})()
>>>>>>> 640403b (尝试修复“字幕弹幕”显示效果)
