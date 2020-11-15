// ==UserScript==
// @name         Bilibili 旧版界面
// @namespace    MotooriKashin
// @version      1.0.0
// @description  Bilibili 播放页的模块化版本，可能不支持版本太低的浏览器。
// @author       MotooriKashin, wly5556
// @supportURL   https://github.com/MotooriKashin/Bilibili-Old/issues
// @match        *://*.bilibili.com/*
// @connect      bilibili.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/protobufjs@6.10.1/dist/protobuf.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @resource     av https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/av.html
// @resource     watchlater https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/watchlater.html
// @resource     bangumi https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/bangumi.html
// @resource     cinema https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/cinema.html
// @resource     playlist https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/playlist.html
// @resource     playlistdetail https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/playlistdetail.html
// @resource     index https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/index.html
// @resource     ranking https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/ranking.html
// @resource     css https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/ui.css
// @resource     crc https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/crc.js
// @resource     md5 https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/md5.js
// @resource     config https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/config.json
// @resource     playlistjson https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/playlist.json
// @resource     sort https://raw.githubusercontent.com/MotooriKashin/Bilibili-Old/master/src/sort.json
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-start
// @license      MIT License
// ==/UserScript==

(function () {
    'use strict';
    const config = JSON.parse(GM_getResourceText("config"));
    const root = window.protobuf.Root.fromJSON(JSON.parse('{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}'));
    const protoSeg = root.lookupType('bilibili.DmSegMobileReply');
    const protoView = root.lookupType('bilibili.DmWebViewReply');

    let aid, cid, bvid;

    // 暴露接口
    const BLOD = unsafeWindow.BLOD = {
        xmlhttpRequest: GM_xmlhttpRequest,
        setValue: GM_setValue,
        getValue: GM_getValue,
        getResourceText: GM_getResourceText,
        getResourceURL: GM_getResourceURL,
        deleteValue: GM_deleteValue,
        aid: aid,
        cid: cid,
        bvid: bvid,
        hash: [],
        ids: [],
        bloburl: {}
    }
    const xhrHook = {
        init: () => {
            // 分别hook WebSocket、worker、XMLHttpRequest.open、XMLHttpRequest.send
            // jQuery的jsonp非原生对象，由Object.defineProperty捕捉到再hook
            // XMLHttpRequest.open主修复旧版各种失效接口只能常开
            if (config.reset.livechat) xhrHook.webSocket();
            if (config.reset.danmuku && Worker) xhrHook.worker();
            xhrHook.open();
            if (config.reset.xhrhook) xhrHook.send();
        },
        webSocket: () => {
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
                        "room_id": "video://" + aid + "/" + cid,
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
                                        // 记录实时弹幕哈希值
                                        BLOD.hash.push(v[0].split(",")[7]);
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
        },
        worker: () => {
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
                        Segments.sort(function (a, b) {
                            return a.progress - b.progress;
                        });
                        // 下载功能开启时，把分段弹幕转换到xml
                        if (config.reset.dlother) {
                            toXml(Segments, cid).then(function (result) {
                                // 备份弹幕
                                BLOD.xml = result;
                            });
                        }
                        // 将弹幕转换为旧格式
                        Segments = Segments.map(function (v) {
                            // 记录弹幕池哈希值
                            BLOD.hash.push(v.midHash);
                            return {
                                class: 0,
                                color: v.color,
                                date: v.ctime,
                                dmid: v.idStr,
                                mode: v.mode,
                                size: v.fontsize,
                                stime: v.progress / 1000,
                                text: v.content,
                                uid: v.midHash
                            };
                        });
                        parseTime = new Date() - parseTime;
                        list_so.onmessage({
                            data: {
                                code: 0,
                                danmakuArray: Segments,
                                loadTime: loadTime,
                                parseTime: parseTime,
                                sendTip: "",
                                state: 0,
                                textSide: "",
                                total: Segments.length.toString()
                            }
                        });
                    });
                } else {
                    workerPostMsg.call(this, aMessage, transferList);
                }
            }
        },
        open: () => {
            const open = XMLHttpRequest.prototype.open;
            xhrHook.segRequestOnlyOnce = true;
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                let _url = url, hook = [_url, ""];
                let obj = urlObj(url);
                // 替换视频心跳
                if (url.includes('api.bilibili.com/x/report/web/heartbeat') && config.reset.heartbeat) {
                    url = url.replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
                    debug.debug("XHR重定向", "替换视频心跳", [_url, url]);
                }
                // 显示历史视频
                if (url.includes('api.bilibili.com/x/web-interface/history/cursor') && url.includes("business") && config.reset.history) {
                    let max = obj.max || "", view_at = obj.view_at || "";
                    url = objUrl("//api.bilibili.com/x/web-interface/history/cursor", { max: max, view_at: view_at, type: "archive", ps: 20 });
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
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.season(this, hook) });
                    url = hook[1] = url.replace('bangumi.bilibili.com/view/web_api/season', 'api.bilibili.com/pgc/view/web/season');
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
                // 监听视频链接
                if (url.includes("/playurl?")) {
                    obj.fourk = obj.sign ? "" : 1;
                    obj.fnval = obj.fnval ? 80 : "";
                    url = objUrl(url.split("?")[0], obj);
                    cid = obj.cid || cid;
                    aid = obj.avid || aid;
                    BLOD.bvid = bvid = obj.bvid || abv(aid) || bvid;
                    BLOD.pgc = url.includes("pgc") ? true : false;
                    BLOD.vip = BLOD.big > 1 ? true : BLOD.vip;
                    if (BLOD.big > 1 || (BLOD.vip && BLOD.ids.indexOf(1 * cid) >= 0)) this.url = url;
                    if (BLOD.limit) this.url = url;
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.playinfo(this, url) });
                }
                // 修改弹幕链接
                if (url.includes("list.so")) {
                    // 这时pakku.js已经修改了xhr对象，需要另做处理
                    if (this.pakku_url && config.reset.danmuku) {
                        xhrHook.segRequestOnlyOnce = true;
                        let pid = aid;
                        // 更改pakku.js请求的url，使它过滤分段弹幕
                        this.pakku_url = url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + pid + "&segment_index=1";
                        this.responseType = "arraybuffer";
                        let xhr = this;
                        let cb = [];
                        for (let i in this.pakku_load_callback) {
                            cb[i] = this.pakku_load_callback[i];
                        }
                        for (let i in this.pakku_load_callback) {
                            // 将pakku.js返回的数据转换回xml
                            this.pakku_load_callback[i] = function () {
                                toXml(protoSeg.decode(new Uint8Array(xhr.response)).elems, pid).then(function (xml) {
                                    xhr.response = xhr.responseText = xml;
                                    cb[i].call(xhr);
                                });
                                // 备份弹幕
                                BLOD.xml = xhr.response;
                                BLOD.hash = [];
                                BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                            }
                        }
                    }
                    // 在历史弹幕面板切换回当天的弹幕时，播放器不通过web worker加载弹幕，而是直接请求list.so
                    // 可以直接记录弹幕数据
                    if (config.reset.dlother) {
                        this.addEventListener("load", function() {
                            BLOD.xml = this.response;
                            BLOD.hash = [];
                            BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                        });
                    }
                }
                //历史弹幕下载
                if (url.includes("history?type=") && config.reset.dlother) {
                    this.addEventListener("load", function() {
                        BLOD.xml = this.response;
                        BLOD.hash = [];
                        BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                    });
                }
                return open.call(this, method, url, ...rest);
            }
        },
        send: () => {
            const send = XMLHttpRequest.prototype.send;
            const addEventListener = XMLHttpRequest.prototype.addEventListener;
            XMLHttpRequest.prototype.send = async function (...arg) {
                // 新版弹幕兼容pakku.js
                // pakku.js休眠中，钩子捕捉到首次对seg.so发起请求时触发
                // (pakku.js正常运行时这个send()不会被调用)
                if (config.reset.danmuku && (this.pakku_url && this.pakku_url.includes("seg.so") && xhrHook.segRequestOnlyOnce)) {
                    xhrHook.segRequestOnlyOnce = false;
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
                        });
                        toXml(Segments, cid).then(function (toXml) {
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
                else if (this.url) {
                    try {
                        // 解除限制
                        Object.defineProperty(this, "response", { writable: true });
                        Object.defineProperty(this, "responseText", { writable: true });
                        Object.defineProperty(this, "readyState", { writable: true });
                        Object.defineProperty(this, "status", { writable: true });
                        this.readyState = 2;
                        this.status = 200;
                        this.abort();
                        let response, accesskey = "";
                        try {
                            if (BLOD.limit) {
                                // 区域限制 + APP限制的DASH似乎缺少码率信息，现默认启用flv以规避，platform用于伪装成APP
                                if (BLOD.uid && (BLOD.ids.indexOf(1 * cid) >= 0) && config.reset.accesskey) accesskey = GM_getValue("access_key") || "";
                                let obj = Object.assign(urlObj(this.url), BLOD.__INITIAL_STATE__.rightsInfo.watch_platform ? { access_key: accesskey, balh_ajax: 1, fnval: "", fnver: "", module: "pgc", platform: "android_i" } : { access_key: accesskey, balh_ajax: 1, module: "pgc" })
                                response = jsonCheck(await xhr.true(objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                response = { "code": 0, "message": "success", "result": response };
                            }
                        }
                        catch (e) { debug.msg("解除限制失败 ಥ_ಥ", e); response = { "code": -404, "message": e, "data": null }; }
                        this.response = this.responseText = JSON.stringify(response);
                        this.readyState = 4;
                        this.onreadystatechange();
                        if (response.code !== 0) throw response.message;
                        BLOD.__playinfo__ = response;
                        debug.log("解除限制", "aid=", aid, "cid=", cid);
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("解除限制", ...e) }
                }
                else {
                    send.call(this, ...arg);
                }
            }
            XMLHttpRequest.prototype.addEventListener = function (name, callback) {
                if (name == "load") {
                    this.callBack = this.callBack || [];
                    this.callBack.push(callback);
                }
                return addEventListener.call(this, name, callback);
            }
        },
        jsonp: () => {
            const ajax = unsafeWindow.$.ajax;
            unsafeWindow.$.ajax = function (obj, ...rest) {
                if (obj) {
                    if (obj.dataType == "jsonp") {
                        let _obj = JSON.parse(JSON.stringify(obj));
                        if (obj.url.includes("region") && obj.data.rid == 165) {
                            // 替换广告区rid为资讯区rid
                            obj.data.rid = 202;
                            debug.debug("JSONP重定向", "替换广告区", [_obj, obj]);
                        }
                        if (obj.url.includes("region") && obj.data.original == 1) {
                            // 替换原创排行为全部排行
                            obj.data.original = 0;
                            debug.debug("JSONP重定向", "修复原创排行", [_obj, obj]);
                        }
                        if (obj.url.includes('api.bilibili.com/x/web-interface/ranking/index')) {
                            // 修改置顶推荐
                            obj.url = obj.url.replace('ranking/index', 'index/top');
                            debug.debug("JSONP重定向", "修复置顶推荐", [_obj, obj]);
                        }
                    }
                }
                return ajax.call(this, obj, ...rest);
            }
        },
        biliIndexRec: (obj, hook = []) => {
            try {
                hook.push(jsonCheck(obj.responseText));
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
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("首页推荐", ...e) }
        },
        // 修复番剧季度信息
        season: (obj, hook = []) => {
            try {
                hook.push(jsonCheck(obj.responseText));
                let response = jsonCheck(obj.responseText);
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
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        },
        // 修复番剧追番信息
        stat: (obj, hook = []) => {
            try {
                hook.push(jsonCheck(obj.responseText));
                let response = jsonCheck(obj.responseText);
                response.result.favorites = response.result.follow;
                hook.push(response);
                debug.debug("XHR重定向", "番剧追番信息", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        },
        // 修改直播数据
        getRoomPlayInfo: (obj, hook = []) => {
            if (!config.reset.roomplay) return;
            try {
                hook.push(jsonCheck(obj.responseText));
                let response = jsonCheck(obj.responseText);
                if (response.data) {
                    response.data.live_status = 0;
                    response.data.live_time = -1;
                    response.data.playurl_info = null;
                }
                hook.push(response);
                debug.debug("XHR重定向", "拦截直播媒体", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("直播拦截", ...e) }
        },
        // 修改番剧推荐
        recommend: (obj, hook = []) => {
            try {
                hook.push(jsonCheck(obj.responseText));
                let response = jsonCheck(obj.responseText);
                if (response.result && response.result.season) response.result = response.result.season;
                hook.push(response);
                debug.debug("XHR重定向", "修改番剧推荐", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧推荐", ...e) }
        },
        // 生成播放信息
        carousel: (obj) => {
            if (!config.reset.carousel) return;
            try {
                let msg = randomArray([
                    ['https://www.bilibili.com/blackboard/activity-4KPC.html', '解锁超清4K画质'],
                    ['https://www.bilibili.com/blackboard/activity-4K120FPS-PC.html', '4K120FPS投稿全量开放'],
                    ['https://www.bilibili.com/blackboard/bilibili2009.html', '十年前的B站长啥样'],
                    ['https://www.bilibili.com/blackboard/html5playerhelp.html', 'HTML5播放器试用'],
                ], 2);
                let xmltext = '<msg><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2320" id="314825"><![CDATA[<a href="' + msg[0][0] + '" target="_blank"><font color="#FFFFFF">' + msg[0][1] + '</font></a>]]></item><item tooltip="" bgcolor="#000000" catalog="system" resourceid="2319" srcid="2321" id="314372"><![CDATA[<a href="' + msg[1][0] + '" target="_blank"><font color="#FFFFFF">' + msg[1][1] + '</font></a>]]></item></msg>';
                let parser = new DOMParser(),
                    responseXML = parser.parseFromString(xmltext, "text/xml");
                Object.defineProperty(obj, 'responseXML', { writable: true });
                obj.responseXML = responseXML;
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("播放通知", ...e) }
        },
        // 强制载入播放器
        status: (obj) => {
            try {
                let response = jsonCheck(obj.responseText);
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
        },
        // 监听视频地址
        playinfo: async (obj) => {
            try {
                if (!obj.response) throw obj;
                BLOD.__playinfo__ = typeof obj.response == "object" ? obj.response : jsonCheck(obj.response);
                // 移除下载面板
                if (document.getElementById("bili-old-download-table")) document.getElementById("bili-old-download-table").remove();
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("视频监听", ...e) }
        }
    }
    const download = BLOD.download = {
        // 创建播放器右键菜单
        init: async (node) => {
            if (!config.reset.download) return;
            let li = document.createElement("li");
            li.innerHTML = '<a class="context-menu-a js-action" href="javascript:void(0);">下载视频</a>';
            li.setAttribute("class", "context-line context-menu-function bili-old-download");
            node.firstChild.appendChild(li);
            li.firstChild.onclick = download.setTable;
        },
        // 配置下载数据
        setTable: async () => {
            debug.msg("正在获取视频链接", ">>>");
            let qua = { 125: "HDR", 120: "4K", 116: "1080P60", 112: "1080P+", 80: "1080P", 74: "720P60", 64: "720P", 48: "720P", 32: "480P", 16: "360P", 15: "360P" };
            let bps = { 30216: "64kbps", 30232: "128kbps", 30280: "320kbps" };
            let path = BLOD.__playinfo__ ? (BLOD.__playinfo__.data || (BLOD.__playinfo__.durl && BLOD.__playinfo__) || BLOD.__playinfo__.result) : "";
            if (!BLOD.mdf) {
                BLOD.mdf = {};
                BLOD.mdf.quee = BLOD.mdf.quee || ((path && path.durl) ? [await download.geturl()] : await Promise.all([download.geturl(), download.geturl("flv")]));
                download.quee(BLOD.mdf.quee, qua, bps);
                download.durl(path, qua);
                download.dash(path, qua, bps);
            }
            download.other();
            download.item();
        },
        // 创建下载面板
        item: () => {
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
            if (!BLOD.mdf.mp4 && !BLOD.mdf.flv && !BLOD.mdf.dash) throw (debug.msg("未找到任何视频链接 ಥ_ಥ"), BLOD.mdf);
            top = document.createElement("div");
            top.setAttribute("id", "bili-old-download-table");
            if (BLOD.mdf.mp4) download.addBox(top, BLOD.mdf.mp4, "mp4", "download-mp4");
            if (BLOD.mdf.dash) {
                if (BLOD.mdf.dash.avc) download.addBox(top, BLOD.mdf.dash.avc, "avc", "download-avc");
                if (BLOD.mdf.dash.hev) download.addBox(top, BLOD.mdf.dash.hev, "hev", "download-hev");
                if (BLOD.mdf.dash.aac) download.addBox(top, BLOD.mdf.dash.aac, "aac", "download-aac");
            }
            if (BLOD.mdf.flv) download.addBox(top, BLOD.mdf.flv, "flv", "download-flv");
            if (BLOD.mdf.xml) download.addBox(top, BLOD.mdf.xml, "其他", "download-xml", "360P");
            document.body.appendChild(top);
            debug.msg("右键另存为或右键IDM下载", "详见脚本简介", 3000);
            top.onmouseover = () => window.clearTimeout(timer);
            top.onmouseout = () => {
                timer = window.setTimeout(() => {
                    top.remove();
                    if (BLOD.bloburl.xml) {
                        window.URL.revokeObjectURL(BLOD.bloburl.xml);
                        BLOD.bloburl.xml = "";
                    }
                }, 1000)
            };
        },
        quee: (path, qua, bps) => {
            if (path[0] && path[0].durl) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push(["1080P", path[0].durl[0].url.replace("http:", ""), sizeFormat(path[0].durl[0].size), ".mp4"]);
                navigator.clipboard.writeText(path[0].durl[0].url);
            }
            if (path[1]) {
                path = path[1].data || (path[1].durl && path[1]) || path[1].result || {};
                BLOD.mdf.flvq = path.quality || (path.data ? path.data.quality : (path.result ? path.result.quality : ""));
                download.durl(path, qua);
                download.dash(path, qua, bps);
            }
        },
        dash: (path, qua, bps) => {
            if (!path.dash) return;
            BLOD.mdf.dash = BLOD.mdf.dash || {};
            if (path.dash.video) {
                for (let i = 0; i < path.dash.video.length; i++) {
                    if (path.dash.video[i].codecs.startsWith("avc")) {
                        BLOD.mdf.dash.avc = BLOD.mdf.dash.avc || [];
                        BLOD.mdf.dash.avc.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    } else {
                        BLOD.mdf.dash.hev = BLOD.mdf.dash.hev || [];
                        BLOD.mdf.dash.hev.push([qua[path.dash.video[i].id], path.dash.video[i].baseUrl.replace("http:", ""), sizeFormat(path.dash.video[i].bandwidth * path.dash.duration / 8), ".m4v"]);
                    }
                }
            }
            if (path.dash.audio) {
                for (let i = 0; i < path.dash.audio.length; i++) {
                    BLOD.mdf.dash.aac = BLOD.mdf.dash.aac || [];
                    BLOD.mdf.dash.aac.push([path.dash.audio[i].id, path.dash.audio[i].baseUrl.replace("http:", ""), sizeFormat(path.dash.audio[i].bandwidth * path.dash.duration / 8), ".m4a"]);
                }
                BLOD.mdf.dash.aac = bubbleSort(BLOD.mdf.dash.aac, true);
                for (let i = 0; i < BLOD.mdf.dash.aac.length; i++) if (BLOD.mdf.dash.aac[i][0] in bps) BLOD.mdf.dash.aac[i][0] = bps[BLOD.mdf.dash.aac[i][0]];
            }
        },
        durl: (path, qua) => {
            if (!path.durl) return;
            if (path.durl[0] && path.durl[0].url.includes("mp4?")) {
                BLOD.mdf.mp4 = BLOD.mdf.mp4 || [];
                BLOD.mdf.mp4.push([qua[path.quality], path.durl[0].url.replace("http:", ""), sizeFormat(path.durl[0].size), ".mp4"]);
            } else {
                BLOD.mdf.flv = [];
                for (let i = 0; i < path.durl.length; i++) BLOD.mdf.flv.push([qua[BLOD.mdf.flvq || path.quality], path.durl[i].url.replace("http:", ""), sizeFormat(path.durl[i].size), ".flv"]);
            }
        },
        other: () => {
            if (!config.reset.dlother) return;
            BLOD.mdf.xml = [];
            if (BLOD.xml) {
                let blob = new Blob([BLOD.xml]);
                BLOD.bloburl.xml = URL.createObjectURL(blob);
                BLOD.mdf.xml.push(["弹幕", BLOD.bloburl.xml, sizeFormat(blob.size), ".xml"]);
            } else {
                BLOD.mdf.xml.push(["弹幕", "//api.bilibili.com/x/v1/dm/list.so?oid=" + cid, "--------", ".xml"]);
            }
            if (BLOD.__INITIAL_STATE__) {
                BLOD.mdf.xml.push(["封面", (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.pic || BLOD.__INITIAL_STATE__.mediaInfo.cover).replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.bkg_cover.replace("http:", ""), "--------", ".jpg"]);
                if (BLOD.__INITIAL_STATE__.mediaInfo && BLOD.__INITIAL_STATE__.mediaInfo.specialCover) BLOD.mdf.xml.push(["海报", BLOD.__INITIAL_STATE__.mediaInfo.specialCover.replace("http:", ""), "--------"], ".jpg");
                if (BLOD.__INITIAL_STATE__.videoData && BLOD.__INITIAL_STATE__.videoData.subtitle && BLOD.__INITIAL_STATE__.videoData.subtitle.list) for (let i = 0; i < BLOD.__INITIAL_STATE__.videoData.subtitle.list.length; i++) BLOD.mdf.xml.push([BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].lan_doc, BLOD.__INITIAL_STATE__.videoData.subtitle.list[i].subtitle_url.replace("http:", ""), "--------", ".json"]);
            }
        },
        // 拉取视频链接
        geturl: async (...arg) => {
            let url = await download.playurl(...arg);
            try {
                if (!url) throw url;
                let data = await xhr.GM(url);
                return jsonCheck(data);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("下载拉取", ...e); }
        },
        // 配置视频链接
        playurl: async (type, qn) => {
            let obj = {}, sign = appkeySign();
            BLOD.md5 = BLOD.md5 || (await import(await GM_getResourceURL("md5"))).default;
            aid = aid || unsafeWindow.aid;
            cid = cid || unsafeWindow.cid;
            qn = qn || 120;
            type = type || "mp4";
            if (!cid) return;
            switch (type) {
                case 'dash': if (BLOD.pgc) return objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16 });
                    else return objUrl("https://api.bilibili.com/x/player/playurl", { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json', fnver: 0, fnval: 16 });
                    break;
                case 'flv': if (BLOD.pgc) return objUrl("https://api.bilibili.com/pgc/player/web/playurl", { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json' });
                    else return objUrl("https://api.bilibili.com/x/player/playurl", { avid: aid, cid: cid, qn: qn, fourk: 1, otype: 'json' });
                    break;
                case 'off': obj = { appkey: sign[0], cid: cid, otype: 'json', qn: qn, quality: qn, type: '' }
                    obj.sign = BLOD.md5(objUrl("", obj) + sign[1]);
                    return objUrl("https://interface.bilibili.com/v2/playurl", obj);
                    break;
                case 'mp4': obj = { appkey: sign[0], cid: cid, otype: 'json', platform: 'android_i', qn: 208 }
                    obj.sign = BLOD.md5(objUrl("", obj) + sign[1]);
                    if (BLOD.pgc) return objUrl("https://api.bilibili.com/pgc/player/web/playurl", obj);
                    return objUrl("https://app.bilibili.com/v2/playurlproj", obj);
                    break;
            }
        },
        addBox: (top, item, name, type, quatily) => {
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
                    + "av" + aid + d[3] +
                    '" href="' + d[1] +
                    '" target="_blank"><div class="download-quality ' + quatily +
                    '">' + d[0] + '</div><div class="download-size">' + d[2] + '</div></a>';
            })
        }
    }
    // 对象捕获
    const getVariable = (value) => {
        function read(arr) {
            switch (arr[0]) {
                case "aid": BLOD.aid = aid = arr[1];
                    break;
                case "cid": BLOD.cid = cid = arr[1];
                    break;
                case "__playinfo__": BLOD.__playinfo__ = BLOD.__playinfo__ || arr[1];
                    break;
            }
        }
        if (unsafeWindow.$ && unsafeWindow.$.ajax) xhrHook.jsonp();
        else {
            let timer = setInterval(() => {
                if (unsafeWindow.$) {
                    clearInterval(timer);
                    xhrHook.jsonp();
                }
            }, 10);
            setTimeout(() => clearInterval(timer), 5000);
        }
        Object.defineProperty(unsafeWindow, "aid", { set: (value) => { read(["aid", value]) }, get: () => { return aid }, configurable: true });
        Object.defineProperty(unsafeWindow, "cid", { set: (value) => { read(["cid", value]) }, get: () => { return cid }, configurable: true });
        Object.defineProperty(unsafeWindow, "__playinfo__", { set: (value) => { read(["__playinfo__", value]) }, get: () => { return BLOD.__playinfo__ }, configurable: true });
        Object.defineProperty(unsafeWindow, "__BILI_CONFIG__", { get: () => { return { "show_bv": false } }, configurable: true });
        if (BLOD.path[2] == "live.bilibili.com" && config.reset.roomplay) Object.defineProperty(unsafeWindow, "__NEPTUNE_IS_MY_WAIFU__", { get: () => { return undefined }, configurable: true });
    }
    // 时间格式化
    const timeFormat = BLOD.timeFormat = (time, type) => {
        let date = new Date(time);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return type ? Y + M + D + h + m + s : h + m + s;
    }
    // 格式化存储
    const sizeFormat = BLOD.sizeFormat = (size) => {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = (size / dex).toFixed(2);
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size + unit[i];
    }
    // 格式化进位
    const unitFormat = BLOD.unitFormat = (num) => {
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = (num / dex).toFixed(1);
                break;
            }
            dex = dex / 10000;
            i--;
        }
        return num + unit[i];
    }
    // 冒泡排序
    const bubbleSort = BLOD.bubbleSort = (arr) => {
        let temp = [];
        for (let i = 0; i < arr.length - 1; i++) {
            let bool = true;
            for (let j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    bool = false;
                }
            }
            if (bool) break;
        }
        return arr;
    }
    // 随机抽取
    const randomArray = BLOD.randomArray = (arr, num) => {
        let out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return out;
    }
    // av/BV互转
    // https://www.zhihu.com/question/381784377/answer/1099438784
    const abv = BLOD.abv = (str) => {
        let table = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
        let tr = {}, s = [11, 10, 3, 8, 4, 6], xor = 177451812, add = 8728348608;
        for (let i = 0; i < 58; i++) tr[table[i]] = i;
        if (!(1 * str)) {
            let r = 0;
            for (let i = 0; i < 6; i++) r += tr[str[s[i]]] * 58 ** i;
            return (r - add) ^ xor;
        } else {
            str = (str ^ xor) + add;
            let r = ['B', 'V', 1, '', '', 4, '', 1, '', 7, '', ''];
            for (let i = 0; i < 6; i++) r[s[i]] = table[parseInt(str / 58 ** i) % 58];
            return r.join("");
        }
    }
    // 加密密钥
    const appkeySign = BLOD.appkeySign = () => {
        let table = 'rbMCKn@KuamXWlPMoJGsKcbiJKUfkPF_8dABscJntvqhRSETg', str = '';
        for (let i = table.length - 1; i >= 0; i--) str = str + String.fromCharCode(table[i].charCodeAt() + 2);
        return str.split(':')
    }
    // 对象转链接
    const objUrl = BLOD.objUrl = (url, obj) => {
        if (obj) {
            let arr = [], i = 0;
            for (let key in obj) {
                if (obj[key] !== "" && obj[key] !== "undefined" && obj[key] !== null) {
                    arr[i] = key + "=" + obj[key];
                    i++;
                }
            }
            if (url) url = url + "?" + arr.join("&");
            else url = arr.join("&");
        }
        return url;
    }
    // 链接转对象
    const urlObj = BLOD.urlObj = (url) => {
        url = url.split('#')[0];
        url = url.split('?')[1] ? url.split('?')[1].split('&') : "";
        if (!url) return;
        let obj = {};
        for (let i = 0; i < url.length; i++) obj[url[i].split('=')[0]] = url[i].split('=')[1];
        return obj;
    }
    // cookie对象
    const getCookies = BLOD.getCookies = () => {
        let cookies = document.cookie.split('; ');
        let obj = cookies.reduce((pre, next) => {
            let key = next.split('=')[0];
            let val = next.split('=')[1];
            pre[key] = val;
            return pre;
        }, {});
        return obj;
    }
    // proto => xml
    const toXml = BLOD.toXml = (danmaku, cid) => {
        return new Promise(function (resolve) {
            danmaku.sort(function (a, b) {
                return a.progress - b.progress;
            });
            let dom = (new DOMParser()).parseFromString('<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source></i>', "text/xml");
            let root = dom.childNodes[0];
            let d, attr, dmk;
            for (let i in danmaku) {
                dmk = danmaku[i];
                d = dom.createElement("d");
                attr = [dmk.progress / 1000, dmk.mode, dmk.fontsize, dmk.color, dmk.ctime, 0, dmk.midHash, dmk.idStr];
                d.setAttribute("p", attr.join(","));
                d.appendChild(dom.createTextNode(dmk.content));
                root.appendChild(d);
            }
            resolve(new XMLSerializer().serializeToString(dom));
        });
    }
    const getSegDanmaku = BLOD.getSegDanmaku = (onload) => {
        let protoSegments = [];
        getSegConfig().then(getAllSeg);
        function getSegConfig() {
            return new Promise(function (resolve) {
                let xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function () {
                    let res = protoView.decode(new Uint8Array(xhr.response));
                    resolve(res);
                });
                xhr.open("get", "https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=" + cid + "&pid=" + aid);
                xhr.responseType = "arraybuffer";
                xhr.send();
            });
        }
        // 获得所有分段
        function getAllSeg(config) {
            let total = config.dmSge.total;
            let allrequset = [];
            let reqUrl = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + cid + "&pid=" + aid;
            function pushReq(url, index) {
                allrequset.push(new Promise(function (resolve) {
                    let xhr = new XMLHttpRequest();
                    xhr.addEventListener("load", function () {
                        // api的segment_index从1开始
                        // 这个数组中从0开始存储分段数据
                        protoSegments[index - 1] = xhr.response;
                        resolve();
                    });
                    xhr.open("get", url);
                    xhr.responseType = "arraybuffer";
                    xhr.send();
                }));
            }
            for (let index = 1; index <= total; index++) {
                pushReq(reqUrl + "&segment_index=" + index, index);
            }
            // BAS弹幕
            if (config.specialDms.length > 0) {
                for (let index = 1; index <= config.specialDms.length; index++) {
                    // 下发的是http链接，但会被chrome的安全措施拦掉，于是替换成https
                    pushReq(config.specialDms[index - 1].replace("http", "https"), total + index);
                }
            }
            // 完成所有的网络请求大概要300ms
            return Promise.all(allrequset).then(function () { onload(protoSegments); });
        }
    }
    // 添加样式
    const addCss = BLOD.addCss = async (css) => {
        let style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.appendChild(document.createTextNode(css));
        setTimeout(() => {
            if (document.head) document.head.appendChild(style)
        });
    }
    // json校验
    const jsonCheck = BLOD.jsonCheck = (data, toast) => {
        data = JSON.parse(data);
        if ("code" in data && data.code !== 0) {
            let msg = data.msg || data.message || "";
            if (toast) debug.msg("xhr错误：", data.code + " " + msg);
            throw [data.code, msg, data]
        }
        return data;
    }
    // 节点垂直偏移
    const getTotalTop = BLOD.getTotalTop = (node) => {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = node.offsetParent;
        }
        while (node);
        return sum;
    }
    // 重写页面
    const write = BLOD.write = (html) => {
        document.open();
        document.write(html);
        document.close();
    }
    // 原生脚本替换
    const oldScript = (str) => {
        str = str.replace("//static.hdslb.com/js/video.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/video.min.js");
        str = str.replace("//static.hdslb.com/phoenix/dist/js/comment.min.js", "//cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old/src/comment.min.js");
        return str;
    }
    // 滚动到播放器
    const bofqiToView = BLOD.bofqiToView = () => {
        let bofqi = document.querySelector("#__bofqi") || document.querySelector(".bangumi_player") || document.querySelector("#bofqi") || "";
        bofqi ? bofqi.scrollIntoView({ behavior: 'smooth', block: 'center' }) : "";
    }
    // 移除预览提示框
    const removePreview = async (node) => {
        try {
            if (!config.reset.preview) return;
            let hint = document.getElementsByClassName("video-float-hint-text")[0];
            // 倒计时长度，单位：秒
            let i = 10;
            let sec = document.createElement("span");
            sec.setAttribute("class", "video-float-hint-btn second-cut");
            hint.parentNode.appendChild(sec);
            function cut() {
                sec.innerText = i - 1 + "s";
                if (i == 0) {
                    node.remove();
                    return;
                }
                i = i - 1;
                window.setTimeout(cut, 1000);
            }
            new cut();
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("付费预览", ...e) }
    }
    // 替换顶栏底栏
    const resetSction = async () => {
        if (!config.reset.grobalboard) return;
        if (!unsafeWindow.$) {
            let jq = document.createElement("script");
            jq.setAttribute("type", "text/javascript");
            jq.setAttribute("src", "//static.hdslb.com/js/jquery.min.js");
            document.body.insertBefore(jq, document.body.firstChild);
        }
        document.getElementById("internationalHeader").setAttribute("style", "visibility:hidden;");
        let newh = document.createElement("div");
        let script = document.createElement("script");
        let foot = document.getElementsByClassName("international-footer");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "//s1.hdslb.com/bfs/seed/jinkela/header/header.js");
        if (document.getElementsByClassName("mini-type")[0]) {
            if (location.href.includes("blackboard/topic_list") || location.href.includes("blackboard/x/act_list")) newh.setAttribute("class", "z-top-container has-menu");
            else newh.setAttribute("class", "z-top-container");
        }
        else newh.setAttribute("class", "z-top-container has-menu");
        document.body.insertBefore(newh, document.body.firstChild);
        document.body.insertBefore(script, document.body.firstChild);
        if (foot[0]) {
            let div = document.createElement("div");
            div.setAttribute("class", "footer bili-footer report-wrap-module");
            div.setAttribute("id", "home_footer");
            foot[0].replaceWith(div);
            let script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", "//static.hdslb.com/common/js/footer.js");
            document.body.appendChild(script);
        }
        window.setTimeout(() => { resetNodes() }, 3000);
    }
    // 切P刷新数据
    const switchVideo = async () => {
        if (config.reset.download) { BLOD.xml = ""; BLOD.mdf = ""; BLOD.hash = []; };
        if (config.reset.selectdanmu && document.getElementsByClassName("bilibili-player-filter-btn")[1]) document.getElementsByClassName("bilibili-player-filter-btn")[1].click();
        if (config.reset.midcrc && !config.reset.danmuku && !BLOD.hash[0]) xhr.true(objUrl("https://api.bilibili.com/x/v1/dm/list.so", { oid: cid }));
        setTimeout(() => {
            if (config.reset.viewbofqi) bofqiToView();
            if (config.reset.widescreen && document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-widescreen.icon-24wideoff")) {
                document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").click();
            }
            if (config.reset.danmakuoff && !document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off")) {
                if (document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku")) {
                    document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-danmaku").click();
                }
            }
        });
    }
    // 修复失效视频
    const fixVideoLost = {
        // 收藏里的失效视频
        favlist: async (msg, data) => {
            debug.log(1);
            // src判定是否为频道并取消重复处理
            if (!config.reset.lostvideo || BLOD.src) return;
            // 获取av号或者将bv转为av
            let title, cover, aid = msg.target.getAttribute("data-aid");
            if (!(1 * aid)) aid = abv(aid);
            if (BLOD.ids.indexOf(aid) != -1) return;
            // 记录已经处理过的视频aid
            BLOD.ids.push(aid);
            try {
                // 尝试读取来自jijidown的数据
                data = await xhr.GM("https://www.jijidown.com/video/av" + aid);
                data.match('window._INIT')[0];
                title = data.match(/\<title\>.+?\-哔哩哔哩唧唧/)[0].replace(/<title>/, "").replace(/-哔哩哔哩唧唧/, "");
                cover = data.match(/\"img\":\ \".+?\",/)[0].match(/http.+?\",/)[0].replace(/",/, "");
                // 判断封面是否有效
                cover.match('hdslb')[0];
            } catch (e) {
                try {
                    // 尝试读取来自biliplus数据
                    data = await xhr.GM("https://www.biliplus.com/video/av" + aid);
                    data.match(/\<title\>.+?\ \-\ AV/)[0];
                    title = data.match(/\<title\>.+?\ \-\ AV/)[0].replace(/<title>/, "").replace(/ - AV/, "");
                    cover = data.match(/\<img style=\"display:none\"\ src=\".+?\"\ alt/)[0].replace(/<img style="display:none" src="/, "").replace(/" alt/, "");
                } catch (e) {
                    // 无有效数据只能把标题改为av号
                    title = "av" + aid;
                }
            }
            debug.log("失效视频", "av" + aid);
            if (cover) msg.target.children[0].children[0].setAttribute("src", cover + "@380w_240h_100Q_1c.webp");
            msg.target.children[0].children[0].setAttribute("alt", title);
            msg.target.children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
            msg.target.children[1].setAttribute("title", title);
            msg.target.children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
            msg.target.children[1].text = title;
            msg.target.setAttribute("class", "small-item");
            msg.target.children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
            msg.target.children[0].setAttribute("target", "_blank");
            msg.target.children[0].setAttribute("class", "cover cover-normal");
        },
        // 频道里的失效视频
        channel: async (link) => {
            if (!config.reset.lostvideo || BLOD.src == window.src) return;
            window.src = BLOD.src;
            try {
                let data, obj = urlObj(link),
                    cid = obj.cid,
                    mid = obj.mid,
                    pn = obj.pn;
                let small_item = document.getElementsByClassName("small-item");
                if (small_item[0]) for (let i = 0; i < small_item.length; i++) if (small_item[i].getElementsByClassName("title")[0].title == "已失效视频") break;
                data = await xhr.true(objUrl("https://api.bilibili.com/x/space/channel/video", { "mid": mid, "cid": cid, "pn": pn, "ps": 30, "order": 0 }));
                data = jsonCheck(data).data;
                for (let i = 0; i < small_item.length; i++) {
                    let aid = small_item[i].getAttribute("data-aid") * 1;
                    let title = data.list.archives[i].title || "av" + aid;
                    if (small_item[i].children[1].title == "已失效视频") {
                        small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                        if (aid) {
                            // 修复失效视频av号
                            debug.log("失效视频", "av" + aid);
                            small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                            small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                        }
                        else {
                            // 修复失效视频bv号
                            aid = small_item[i].getAttribute("data-aid");
                            debug.log("失效视频", aid);
                            small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/" + aid);
                            small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/" + aid);
                        }
                        small_item[i].children[0].setAttribute("target", "_blank");
                        small_item[i].children[0].setAttribute("class", "cover cover-normal");
                        small_item[i].children[0].children[0].setAttribute("alt", title);
                        small_item[i].children[0].children[0].setAttribute("src", data.list.archives[i].pic.replace("http", "https") + "@380w_240h_100Q_1c.webp");
                        small_item[i].children[1].setAttribute("target", "_blank");
                        small_item[i].children[1].setAttribute("title", title);
                        small_item[i].children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                        small_item[i].children[1].text = title;
                    }
                }
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("失效视频·频道", ...e) }
        },
        // 空间首页展示的失效视频
        home: async (msg) => {
            if (!config.reset.lostvideo) return;
            let channel_item = document.getElementsByClassName("channel-item");
            if (channel_item[0]) {
                let small_item = document.getElementsByClassName("small-item");
                if (small_item[0]) {
                    for (let i = 0; i < small_item.length; i++) {
                        if (small_item[i].getAttribute("class") == "small-item disabled") {
                            small_item[i].setAttribute("class", "small-item fakeDanmu-item");
                            let aid = small_item[i].getAttribute("data-aid") * 1;
                            if (aid) {
                                // 修改失效视频av链接
                                debug.log("失效视频", "av" + aid);
                                small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                                small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/av" + aid);
                            }
                            else {
                                // 修改失效视频bv链接
                                aid = small_item[i].getAttribute("data-aid");
                                debug.log("失效视频", aid);
                                small_item[i].children[1].setAttribute("href", "//www.bilibili.com/video/" + aid);
                                small_item[i].children[0].setAttribute("href", "//www.bilibili.com/video/" + aid);
                            }
                            small_item[i].children[0].setAttribute("target", "_blank");
                            small_item[i].children[0].setAttribute("class", "cover cover-normal");
                            small_item[i].children[1].setAttribute("target", "_blank");
                            small_item[i].children[1].setAttribute("title", small_item[i].children[0].children[0].alt);
                            small_item[i].children[1].setAttribute("style", "text-decoration : line-through;color : #ff0000;");
                            small_item[i].children[1].text = small_item[i].children[0].children[0].alt;
                        }
                    }
                }
            }
            // 固定失效视频数据防止被页面改回去
            if (msg.relatedNode.text == '已失效视频') msg.relatedNode.text = msg.relatedNode.getAttribute("title");
            if (msg.target.className == "small-item disabled") msg.target.className = "small-item";
        }
    }
    // 番剧分集数据
    const setBangumi = {
        init: async (data) => {
            if (!config.reset.episodedata) return;
            // 判断是否有分集数据
            if (data.epList[1] && (data.epList[0].aid != data.epList[1].aid)) {
                aid = data.epInfo.aid;
                let timer = window.setInterval(() => {
                    if (document.getElementsByClassName("info-sec-av")[0]) {
                        setBangumi.episodeData("first");
                        window.clearInterval(timer);
                    }
                }, 1000);
                // 延时取消操作，10s还未载入完成将不再处理
                window.setTimeout(() => window.clearInterval(timer), 10000);
            }
        },
        // 分集数据处理
        episodeData: async (data, msg) => {
            try {
                let views = document.getElementsByClassName("view-count")[0].getElementsByTagName("span")[0];
                let danmakus = document.getElementsByClassName("danmu-count")[0].getElementsByTagName("span")[0];
                if (data == "first") {
                    // 判断是否是首次处理
                    if (views.innerText == "-" && danmakus.innerText == "-") {
                        window.setTimeout(() => { setBangumi.episodeData("first") }, 100);
                        return;
                    }
                    // 备份总播放数和弹幕数
                    views.setAttribute("title", "总播放数 " + views.innerText);
                    danmakus.setAttribute("title", "总弹幕数 " + danmakus.innerText);
                    debug.debug("总播放数", views.innerText, " 总弹幕数", danmakus.innerText);
                    data = await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": aid }));
                }
                if (!data) {
                    aid = msg.relatedNode.innerText.match(/[0-9]+/)[0];
                    data = await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/archive/stat", { "aid": aid }));
                }
                data = jsonCheck(data).data;
                let view = data.view;
                let danmaku = data.danmaku;
                view = unitFormat(view);
                danmaku = unitFormat(danmaku);
                views.innerText = view;
                danmakus.innerText = danmaku;
                debug.debug("播放", view + " 弹幕", danmaku);
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分集数据", ...e) }
        },
    }
    // 修复主页分区
    const fixnews = async (node, move) => {
        try {
            let rank = config.reset.grobalboard ? document.getElementsByClassName("rank-tab")[0] : "";
            if (node.id == "bili_ad") {
                let sight = node.getElementsByTagName("a");
                node = node.getElementsByClassName("name");
                if (node[0]) node[0].text = "资讯";
                for (let i = 0; i < sight.length; i++) if (sight[i].href.includes("www.bilibili.com/v/ad/ad/")) sight[i].href = "https://www.bilibili.com/v/information/";
                let rcon = document.createElement("div");
                rcon.setAttribute("class", "r-con");
                rcon.innerHTML = '<div class="r-con"><header style="margin-bottom: 14px"><h3 style="font-size: 18px;font-weight: 400;">资讯分区正式上线啦！</h3></header><div class="carousel-module"><div class="panel"><a href="https://www.bilibili.com/v/information" target="_blank"><img src="//i0.hdslb.com/bfs/archive/0747d26dbbc3bbf087d47cff49e598a326b0030c.jpg@320w_330h_1c.webp" width="260" height="280"/></a></div></div></div>';
                document.getElementById("ranking_ad").replaceWith(rcon);
            }
            if (node.className == "report-wrap-module elevator-module") for (let item of node.children[1].children) if (item.innerHTML == "广告") item.innerHTML = "资讯";
            if (node.id == "bili-header-m") {
                node = node.getElementsByClassName('nav-name');
                if (node[0]) {
                    for (let i = 0; i < node.length; i++) {
                        if (node[i].textContent == "科技") {
                            move = node[i].parentNode.parentNode.children[1].lastChild.cloneNode(true);
                            move.firstChild.href = move.firstChild.href.replace("technology", "life");
                            node[i].parentNode.parentNode.children[1].lastChild.remove();
                        }
                        if (node[i].textContent == "广告") {
                            node[i].textContent = "资讯";
                            node[i].parentNode.href = "//www.bilibili.com/v/information/";
                        }
                        if (node[i].textContent == "生活") {
                            let sight = node[i].parentNode.parentNode.children[1];
                            sight.insertBefore(move, sight.lastChild)
                        }
                        if (node[i].textContent == "娱乐") node[i].parentNode.parentNode.children[1].lastChild.remove();
                    }
                }
            }
            if (rank && rank.children[5]) {
                rank.children[5].innerText == "知识" ? rank.children[5].innerText = "科技" : "";
                rank.children[6].innerText == "知识" ? rank.children[6].innerText = "科技" : "";
            }
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区·版面", ...e) }
    }
    // 修复评论楼层
    const setReplyFloor = {
        init: async (link) => {
            BLOD.src = "";
            if (!config.reset.replyfloor) return;
            try {
                let mode, data, obj = urlObj(link),
                    oid = obj.oid,
                    sort = obj.sort,
                    pn = obj.pn,
                    root = obj.root,
                    type = obj.type;
                // sort与mode对应转化，sort == 1时暂时处理不了直接退出
                // 热门：sort=2 mode=3 时间：sort=0 mode=2  回复：sort=1 默认(热门+时间)： mode=1
                if (sort == 0) mode = 1;
                if (sort == 1) throw ["暂无法处理按回复排列的评论", obj];
                if (sort == 2) mode = 3;
                let list_item = document.getElementsByClassName("reply-wrap");
                let main_floor = document.getElementsByTagName("li");
                // 展开楼中楼的楼层号
                if (root) {
                    // 前两页直接获取
                    if (pn < 2) data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/reply/cursor", { "oid": oid, "root": root, "type": type }));
                    else {
                        // 3页以上先获取当页首条评论rpid
                        let dialog;
                        if (list_item[0]) { for (let i = 0; i < list_item.length; i++) { if (list_item[i].getAttribute("data-id") == root) { list_item = list_item[i].getElementsByClassName("reply-wrap"); if (list_item[0]) for (let j = 0; j < list_item.length; j++)if (!list_item[j].getElementsByClassName("floor")[0]) { dialog = list_item[j].getAttribute("data-id"); break; } break; } } }
                        else if (main_floor[0]) { for (let i = 0; i < main_floor.length; i++) { if (main_floor[i].getAttribute("id") && main_floor[i].getAttribute("id").includes(root)) { main_floor = main_floor[i].getElementsByTagName("li"); if (main_floor[0]) for (let j = 0; j < main_floor.length; j++)if (main_floor[j].id && main_floor[j].id.includes("l_id") && !main_floor[j].getElementsByClassName("floor-num")[0]) { dialog = main_floor[j].getAttribute("id").split('_')[2]; break; } break; } } }
                        // 根据当页首条评论rpid获取min_id
                        data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/dialog/cursor", { "oid": oid, "root": root, "type": type, "dialog": dialog, "size": 20 }));
                        let min_id = jsonCheck(data).data.replies;
                        if (min_id) { for (let i = 0; i < min_id.length; i++) if (min_id[i].rpid == dialog) { min_id = min_id[i].floor; break; } }
                        else { debug.msg("当前页楼中楼层获取失败 ಥ_ಥ"); return; }
                        // 根据min_id获取当页数据
                        data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/reply/cursor", { "oid": oid, "root": root, "type": type, "min_id": min_id }));
                    }
                }
                else {
                    if (sort == 2) data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/main", { "oid": oid, "next": pn, "type": type, "mode": mode }));
                    else if (pn == 1) data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/main", { "oid": oid, "type": type, "mode": mode }));
                    else {
                        // 时间排序的楼层号需要相对前页判定
                        pn = pn - 1;
                        data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply", { "type": type, "sort": sort, "oid": oid, "pn": pn }));
                        data = jsonCheck(data).data;
                        let i = data.replies.length - 1;
                        oid = data.replies[0].oid;
                        let root = data.replies[i].rpid;
                        data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/reply/cursor", { "oid": oid, "root": root, "type": type }));
                        data = jsonCheck(data).data;
                        oid = data.root.oid;
                        let next = data.root.floor;
                        data = await xhr.true(objUrl("https://api.bilibili.com/x/v2/reply/main", { "oid": oid, "next": next, "type": type, "mode": mode }));
                    }
                }
                data = jsonCheck(data).data;
                setReplyFloor.fix(setReplyFloor.floor(data));
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("评论楼层", ...e) }
        },
        // 纪录楼层对照表
        floor: (data) => {
            let floor = {}, top = data.top, hots = data.hots, replies = data.replies, froot = data.root;
            if (hots && hots[0]) {
                for (let i = 0; i < hots.length; i++) {
                    floor[hots[i].rpid] = hots[i].floor;
                    if (hots[i].replies) for (let j = 0; j < hots[i].replies.length; j++) floor[hots[i].replies[j].rpid] = hots[i].replies[j].floor;
                }
            }
            if (replies && replies[0]) {
                for (let i = 0; i < replies.length; i++) {
                    floor[replies[i].rpid] = replies[i].floor;
                    if (replies[i].replies) for (let j = 0; j < replies[i].replies.length; j++) floor[replies[i].replies[j].rpid] = replies[i].replies[j].floor;
                }
            }
            if (top) {
                for (let key in top) {
                    if (top[key]) {
                        floor[top[key].rpid] = top[key].floor;
                        if (top[key].replies) for (let i = 0; i < top[key].replies.length; i++) floor[top[key].replies[i].rpid] = top[key].replies[i].floor;
                    }
                }
            }
            if (froot && froot.replies) for (let i = 0; i < froot.replies.length; i++) floor[froot.replies[i].rpid] = froot.replies[i].floor;
            return floor;
        },
        // 修复楼层号
        fix: (floor) => {
            let list_item = document.getElementsByClassName("reply-wrap");
            let main_floor = document.getElementsByTagName("li");
            // 旧版评论直接写入楼层号
            if (main_floor[0]) {
                for (let i = 0; i < main_floor.length; i++) {
                    if (main_floor[i].id && main_floor[i].id.includes("l_id")) {
                        let rpid = main_floor[i].getAttribute("id").split('_')[2];
                        if (rpid in floor) {
                            try {
                                main_floor[i].getElementsByClassName("floor-num")[0].innerText = "#" + floor[rpid];
                            }
                            catch (e) {
                                let node = main_floor[i].getElementsByClassName("floor-date")[0].parentNode;
                                let span = document.createElement("span");
                                span.setAttribute("class", "floor-num");
                                span.setAttribute("style", "float : left;color : #aaa;padding-right : 10px;");
                                span.innerText = "#" + floor[rpid];
                                node.insertBefore(span, node.firstChild);
                            }
                        }
                    }
                }
            }
            // 新版评论需另外创建楼层号
            if (list_item[0]) {
                for (let i = 0; i < list_item.length; i++) {
                    let rpid = list_item[i].getAttribute("data-id");
                    if (rpid in floor) {
                        let node = list_item[i].getElementsByClassName("info")[0];
                        let span = document.createElement("span");
                        span.setAttribute("class", "floor");
                        span.innerText = "#" + floor[rpid];
                        node.insertBefore(span, node.firstChild);
                    }
                }
            }
        }
    }
    // 修复评论跳转
    const fixVideoSeek = (node) => {
        if (document.querySelector("#bofqi")) {
            node.querySelectorAll("a.video-seek").forEach(function (v) {
                v.addEventListener("click", function (e) {
                    bofqiToView();
                    unsafeWindow.player.seek(Number(e.target.attributes[2].nodeValue));
                })
            })
        }
    }
    // 跳过充电鸣谢
    const electricPanelJump = async (node) => {
        try {
            if (!config.reset.electric) return;
            config.reset.electric = 0;
            setTimeout(() => { node.click() }, 1);
            setTimeout(() => { config.reset.electric = 1 }, 5000);
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("充电鸣谢", ...e) }
    }
    // 修复主页排行
    const fixrank = async (node) => {
        // 这些分区排行榜已全部采用类似番剧排行的模式，故采用相似的节点覆盖
        let sort = {
            bili_movie: ["ranking_movie", 2, "https://www.bilibili.com/ranking/cinema/23/0/3"],
            bili_teleplay: ["ranking_teleplay", 5, "https://www.bilibili.com/ranking/cinema/11/0/3"],
            bili_documentary: ["ranking_documentary", 3, "https://www.bilibili.com/ranking/cinema/177/0/3"]
        }
        sort = sort[node.id];
        if (!sort) return;
        let section = node.getElementsByClassName("sec-rank report-wrap-module zone-rank")[0];
        section.innerHTML = '<header class="rank-head"><h3>排行</h3></header><div class="rank-list-wrap"><ul class="bangumi-rank-list rank-list"></ul></div><a href="' + sort[2] + '" target="_blank" class="more-link">查看更多<i class="icon icon-arrow-r"></i></a>';
        try {
            let data = await xhr.true(objUrl("https://api.bilibili.com/pgc/season/rank/web/list", { season_type: sort[1], day: 3 }));
            data = jsonCheck(data).data;
            node = node.getElementsByClassName("bangumi-rank-list rank-list")[0];
            for (let i = 0; i < 8; i++) {
                let li = document.createElement("li"),
                    cl = i < 3 ? "rank-item highlight" : "rank-item",
                    fw;
                li.setAttribute("class", cl);
                li.innerHTML = '<i class="ri-num">' + (i + 1) + '</i><a href="' + data.list[i].url + '" target="_blank" title="' + data.list[i].title + ' 播放:' + data.list[i].stat.view + '" class="ri-info-wrap"><p class="ri-title">' + data.list[i].title + '</p><span class="ri-total">' + data.list[i].new_ep.index_show + '</span></a>';
                li.onmouseover = () => {
                    fw = document.createElement("div");
                    fw.setAttribute("class", "bangumi-info-module");
                    fw.setAttribute("style", 'left: ' + li.getBoundingClientRect().left + 'px; top: ' + (getTotalTop(li) - 150) + 'px;');
                    fw.innerHTML = '<div class="v-preview clearfix"><div class="lazy-img cover"><img alt="' + data.list[i].title + '" src="' + data.list[i].cover + '" /></div><div><p class="title">' + data.list[i].title + '</p><p class="desc">' + data.list[i].new_ep.index_show + '</p></div></div><div class="v-data"><span class="play"><i class="icon"></i>' + unitFormat(data.list[i].stat.view) + '</span><span class="danmu"><i class="icon"></i>' + unitFormat(data.list[i].stat.danmaku) + '</span><span class="fav"><i class="icon"></i>' + unitFormat(data.list[i].stat.follow) + '</span></div>';
                    document.body.appendChild(fw);
                }
                li.onmouseout = () => fw.remove();
                node.appendChild(li);
            }
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区排行", ...e) }
    }
    // 弹幕反查
    const danmkuHashId = async (node) => {
        if (!config.reset.midcrc) return;
        BLOD.midcrc = BLOD.midcrc || (await import(await GM_getResourceURL("crc"))).default;
        let index = 1 * node.getAttribute("dmno");
        node.addEventListener("contextmenu", () => {
            setTimeout(async (data) => {
                try {
                    let descipline = document.createElement("li");
                    let onwer = document.createElement("li");
                    let mid = BLOD.midcrc(BLOD.hash[index]);
                    node = document.getElementsByClassName("bili-old-hash");
                    if (node[0]) for (let i = 0; i < node.length; i++) node[i].remove();
                    if (document.getElementsByClassName("bilibili-player-icon bilibili-player-icon-arrow-down")[0]) return;
                    if (document.getElementsByClassName("bilibili-player-icon bilibili-player-icon-arrow-up")[0]) return;
                    descipline.setAttribute("class", "context-line context-menu-descipline bili-old-hash");
                    descipline.innerHTML = '<a class="context-menu-a" href="javascript:void(0);"></a>';
                    onwer.setAttribute("class", "context-line context-menu-function bili-old-hash");
                    onwer.innerHTML = '<a class="context-menu-a js-action" title="" href="//space.bilibili.com/' + mid + '">hash: ' + BLOD.hash[index] + " mid: " + mid + '</a>';
                    node = document.getElementsByClassName("bilibili-player-context-menu-container white")[0];
                    node.firstChild.insertBefore(descipline, node.firstChild.firstChild);
                    onwer = node.firstChild.insertBefore(onwer, node.firstChild.firstChild);
                    data = jsonCheck(await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/card", { mid: mid })));
                    onwer.innerHTML = '<div style="min-height:0px;z-index:-5;" class="bb-comment"><div style="padding-top:10px;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin-left: 15px;" class="reply-face"><img src="' +
                        data.data.card.face + '@52w_52h.webp" alt=""></div><div class="reply-con"><div class="user"><a style="display:initial;padding: 0px;" data-usercard-mid="' +
                        mid + '" href="//space.bilibili.com/' +
                        mid + '" target="_blank" class="' +
                        (data.data.card.vip.vipType > 1 ? "name vip-red-name" : "name") + '">' + data.data.card.name + '</a> ' +
                        data.data.card.sex + '<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l' +
                        data.data.card.level_info.current_level + '"></i></a></div></div></div></div></div></div></div>';
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("弹幕反查", ...e) }
            })
        })
    }
    // 移除节点
    const resetNodes = async (ext) => {
        let remove = (node, type, hidden, index) => {
            index ? index : index = 0;
            switch (type) {
                case "id": node = document.getElementById(node); break;
                case "class": node = document.getElementsByClassName(node)[index] ? document.getElementsByClassName(node)[index] : ""; break;
                case "tag": node = document.getElementsByTagName(node)[index] ? document.getElementsByTagName(node)[index] : ""; break;
            }
            if (!node || node.getAttribute("hidden")) return;
            // 一般能移除的就移除，否则隐藏
            debug.debug("移除节点", node);
            hidden ? node.setAttribute("hidden", "hidden") : node.remove();
        }
        // 隐藏联系客服
        remove("contact-help", "class", true);
        // 移除新版提示
        remove("new-entry", "class");
        if (BLOD.path.name == "index") remove("ver", "class");
        remove("trynew-btn", "class");
        if (config.reset.panel) remove("bilibili-player-ending-panel", "class");
        // 移除app下载浮动框
        remove("fixed_app_download", "id");
        remove("app-download", "class");
        // 移除直播水印
        remove("bilibili-live-player-video-logo", "class");
        // 移除失效顶栏
        remove("bili-header-m report-wrap-module", "class", false, 1);
        // 移除主页昨日榜
        if (BLOD.path.name == "index") remove("rec-btn prev", "class");
        // 移除主页七日榜
        if (BLOD.path.name == "index") remove("rec-btn next", "class");
        // 移除双重视频下载右键菜单
        if (document.getElementsByClassName("bili-old-download")[1]) document.getElementsByClassName("bili-old-download")[0].remove();
        // 使顶栏透明
        if (config.reset.headblur) {
            let blur = document.getElementsByClassName("blur-bg");
            if (blur[0]) blur[0].removeAttribute("style");
        }
    }
    // 构造媒体页
    const setMediaList = {
        init: async (data) => {
            if (!BLOD.ml) return;
            if (data) {
                // 以传参data决定处理类型
                try {
                    // 获取首个视频av并跳转
                    data = await xhr.true(objUrl("https://api.bilibili.com/x/v1/medialist/detail", { "media_id": BLOD.ml, "pn": 1, "ps": 1 }));
                    data = jsonCheck(data).data;
                    location.replace("https://www.bilibili.com/video/av" + data.medias[0].id);
                }
                catch (e) {
                    // 跳转失败，清理残余
                    GM_setValue("medialist", 0);
                    debug.error(e);
                }
            }
            else {
                try {
                    let avs = [], value = [], promises = [];
                    // 获取收藏列表，这里获取只能获取到aid
                    data = await xhr.true(objUrl("https://api.bilibili.com/x/v1/medialist/resource/ids4Player", { "media_id": BLOD.ml }));
                    data = jsonCheck(data).data;
                    for (let i = 0; i < data.medias.length; i++) {
                        BLOD.ids[i] = data.medias[i].id;
                        avs[i] = "av" + data.medias[i].id;
                    }
                    // 同时获取所有aid对应的数据，使用Promise.all对齐，该api会直接忽略失效视频
                    while (avs.length) {
                        let i = avs.length > 20 ? 20 : avs.length;
                        value = avs.splice(0, i);
                        promises.push(xhr.true(objUrl("https://api.bilibili.com/x/article/cards", { "ids": value.join("%2C") })));
                    }
                    value = [];
                    data = await Promise.all(promises);
                    // 格式化数据并排序
                    for (let i = 0; i < data.length; i++) {
                        data[i] = jsonCheck(data[i]);
                        for (let key in data[i].data) avs.push(data[i].data[key]);
                    }
                    for (let i = 0; i < BLOD.ids.length; i++) {
                        for (let j = 0; j < avs.length; j++) {
                            if (avs[j].aid == BLOD.ids[i]) {
                                value.push(avs[j]);
                                break;
                            }
                        }

                    }
                    BLOD.ids = value;
                    let timer = window.setInterval(() => {
                        if (unsafeWindow.BilibiliPlayer) {
                            clearInterval(timer);
                            // 将视频列表重构为稍后再看列表
                            for (let i = 0; i < BLOD.ids.length; i++) {
                                BLOD.ids[i].progress = 0;
                                BLOD.ids[i].add_at = BLOD.ids[i].ctime;
                                BLOD.ids[i].pages = [];
                                BLOD.ids[i].pages[0] = {};
                                BLOD.ids[i].pages[0].cid = BLOD.ids[i].cid;
                                BLOD.ids[i].pages[0].dimension = BLOD.ids[i].dimension;
                                BLOD.ids[i].pages[0].duration = BLOD.ids[i].duration;
                                BLOD.ids[i].pages[0].from = "vupload";
                                BLOD.ids[i].pages[0].page = 1;
                                BLOD.ids[i].pages[0].part = BLOD.ids[i].title;
                                BLOD.ids[i].pages[0].vid = "";
                                BLOD.ids[i].pages[0].weblink = "";
                            }
                            let toview = { "code": 0, "message": "0", "ttl": 1, "data": { "count": BLOD.ids.length, "list": BLOD.ids } };
                            // 保存初始aid，以便判断是否切p
                            BLOD.oid = BLOD.ids[0].aid;
                            debug.debug("收藏列表", toview);
                            // 构造初始化参数并重新初始化播放器
                            BLOD.obj = { "aid": BLOD.ids[0].aid, "cid": BLOD.ids[0].cid, "watchlater": encodeURIComponent(JSON.stringify(toview)) }; // 重构初始化播放器参数
                            unsafeWindow.BilibiliPlayer(BLOD.obj);
                            let bpui = document.getElementsByClassName("bpui-button-text");
                            let t = setInterval(() => {
                                // 更新列表名称
                                if (bpui[1]) {
                                    clearInterval(t);
                                    bpui[1].firstChild.innerText = "收藏列表";
                                }
                            }, 100);
                        }
                    }, 100);
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("收藏模拟", ...e) }
            }
        },
        // aid变化监听
        fixvar: async () => {
            if (!aid) aid = unsafeWindow.aid ? unsafeWindow.aid : aid;
            if (BLOD.oid) {
                if (BLOD.oid != unsafeWindow.aid) {
                    // 收藏播放切p判断
                    aid = unsafeWindow.aid ? unsafeWindow.aid : aid;
                    BLOD.oid = unsafeWindow.aid;
                    setMediaList.restore();
                }
            }
        },
        // 收藏播放更新
        restore: async () => {
            let data;
            history.replaceState(null, null, "https://www.bilibili.com/video/av" + aid + location.search + location.hash);
            for (let i = 0; i < BLOD.ids.length; i++) if (BLOD.ids[i].aid == aid) data = BLOD.ids[i];
            let video_info = document.getElementById("viewbox_report");
            let up_info = document.getElementById("v_upinfo")
            let arc_toolbar_report = document.getElementById("arc_toolbar_report");
            document.title = data.title;
            video_info.innerHTML = '<h1 title="' + data.title + '"><!----><span>' + data.title + '</span></h1>' +
                '<div class="tm-info tminfo"><span class="crumb"><a href="//www.bilibili.com">主页</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/">动画</a> &gt;</span> <span class="crumb"><a href="//www.bilibili.com/v/douga/mad/">MAD·AMV</a></span><time>' + timeFormat(data.pubdate * 1000, true) + '</time><a class="btn-appeal">稿件投诉</a></div>' +
                '<div class="number"><span title="总播放数' + data.stat.view + '" class="v play">' + unitFormat(data.stat.view) + '</span><span title="总弹幕数' + data.stat.danmaku + '" class="v dm">' + unitFormat(data.stat.danmaku) + '</span><span title="本日日排行数据过期后，再纳入本稿件的历史排行数据进行对比得出" class="v rank">最高全站日排行' + data.stat.like + '名</span><span class="line"></span><span class="u like" style="margin-right : 5px;" title="点赞人数' + data.stat.his_rank + '"><i class="l-icon-move" style="width : 22px;height : 22px;background-position : -660px -2068px;"></i><b class="l-icon-moved" style="width : 22px;height : 22px;background-position : -725px -2068px;display : none;"></b> 点赞 ' + unitFormat(data.stat.like) + '</span><span report-id="coinbtn1" title="投硬币枚数' + data.stat.coin + '" class="u coin"><i class="c-icon-move"></i><b class="c-icon-moved" style="background-position: -2340px -60px; display: none;"></b> 硬币 ' + unitFormat(data.stat.coin) + '</span> <span report-id="collect1" title="收藏人数' + data.stat.favorite + '" class="u fav"><i class="f-icon-move" style="background-position: 0px 0px;"></i><b class="f-icon-moved" style="background-position: -1740px -60px; display: none;"></b> 收藏 ' + unitFormat(data.stat.favorite) + '</span></div>';
            up_info.innerHTML = '<div class="u-face fl"><!----><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="head" class="a"><img src="' + data.owner.face + '@68w_68h.webp" width="68" height="68" class="up-face" /><!----><!----><i title="企业/团体认证" class="auth o-auth"></i></a></div>' +
                '<div class="info"><div class="user clearfix"><a href="//space.bilibili.com/' + data.owner.mid + '" target="_blank" report-id="name" class="name is-vip">' + data.owner.name + '</a><a href="//message.bilibili.com/#whisper/mid' + data.owner.mid + '" target="_blank" report-id="message" class="message icon">发消息</a></div><div class="sign static"><span>up主简介</span><!----></div><div class="number clearfix"><span title="投稿数--">投稿：--</span><span title="粉丝数--">粉丝：--</span></div><div class="btn followe"><a report-id="follow1" class="bi-btn b-gz"><span class="gz">+ 关注</span><span class="ygz">已关注</span><span class="qxgz">取消关注</span></a><a report-id="charge" class="bi-btn b-cd elecrank-btn"><span class="cd">充电</span><span class="wtcd">为TA充电</span></a></div></div>';
            arc_toolbar_report.children[0].children[0].title = "分享人数" + data.stat.share;
            arc_toolbar_report.children[0].children[0].innerHTML = '<span class="t">分享</span><span class="num">' + unitFormat(data.stat.share) + '</span><i class="icon"></i>';
            arc_toolbar_report.children[2].title = "收藏人数" + data.stat.favorite;
            arc_toolbar_report.children[2].innerHTML = '<div class="btn-item"><i class="icon-move f-icon-moved" style="display: none;"></i><b class="icon-move f-icon-move"></b><span class="t">收藏</span><span class="num">' + unitFormat(data.stat.favorite) + '</span></div>';
            arc_toolbar_report.children[3].title = "投硬币枚数" + data.stat.coin;
            arc_toolbar_report.children[3].innerHTML = '<div class="btn-item"><i class="icon-move c-icon-moved" style="display: none;"></i><b class="icon-move c-icon-move"></b><span class="t">硬币</span><span class="num">' + unitFormat(data.stat.coin) + '</span></div>';
            document.getElementById("v_tag").children[0].setAttribute("hidden", "hidden");
            document.getElementById("v_desc").children[1].innerText = data.desc;
            new unsafeWindow.bbComment(".comment", unsafeWindow.aid, 1, unsafeWindow.UserStatus.userInfo, "");
            data.stat.like ? video_info.children[2].children[2].setAttribute("style", "display: inline-block;") : video_info.children[2].children[2].setAttribute("style", "display: none;");
            let bpui = document.getElementsByClassName("bpui-button-text");
            let t = setInterval(() => {
                // 更新列表名称
                if (bpui[1]) {
                    clearInterval(t);
                    bpui[1].firstChild.innerText = "收藏列表";
                }
            }, 100);
        },
    }
    // BV超链接转化
    const avdesc = async () => {
        if (!config.rewrite.av || !aid || BLOD.path[3] != 'video') return;
        let desc = document.getElementsByClassName("info");
        if (desc[1] && desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i)) {
            let paster = desc[1].outerHTML.match(/BV[A-Za-z0-9]+/i);
            for (let i = 0; i < paster.length; i++) {
                let newer = "av" + abv(paster[i]);
                newer = '<a target="_blank" href="//www.bilibili.com/video/' + newer + '">' + newer + '</a>';
                desc[1].innerHTML = desc[1].outerHTML.replace(paster[i], newer);
            }
        }
    }
    // 修复分区对照
    const fixSort = {
        // av
        video: async () => {
            let sort = JSON.parse(GM_getResourceText("sort"));
            let timer = window.setInterval(() => {
                let tminfo = document.getElementsByClassName("tm-info");
                if (tminfo[0]) {
                    window.clearInterval(timer);
                    if (!(BLOD.tid in sort)) return;
                    let nodes = tminfo[0].childNodes;
                    // 创建分区信息节点并写入tid对应的分区数据
                    nodes[1].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].replaceWith(nodes[0].cloneNode(true));
                    nodes[2].childNodes[1].remove();
                    nodes[1].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                    nodes[1].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                    nodes[2].childNodes[0].href = sort[BLOD.tid][2];
                    nodes[2].childNodes[0].innerText = sort[BLOD.tid][1];
                }
            }, 1000);
        },
        // 稍后再看
        watchlater: async (data) => {
            let sort = JSON.parse(GM_getResourceText("sort"));
            let timer = window.setInterval(async () => {
                let tminfo = document.getElementsByClassName("tm-info");
                // 判断是否是少后再看页面
                if (tminfo[0] && aid) {
                    window.clearInterval(timer);
                    let child = tminfo[0].childNodes;
                    if (child[2].nodeType === 8) {
                        try {
                            // 通过链接获取tid
                            data = await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": aid }));
                            BLOD.tid = jsonCheck(data).data.tid;
                            if (!(BLOD.tid in sort)) return;
                            // 创建分区信息节点并写入tid对应的分区数据
                            child[2].replaceWith(child[0].cloneNode(true));
                            child[4].replaceWith(child[0].cloneNode(true));
                            child[4].childNodes[1].remove();
                            child[2].childNodes[0].href = sort[sort[BLOD.tid][0]][2];
                            child[2].childNodes[0].innerText = sort[sort[BLOD.tid][0]][1];
                            child[4].childNodes[0].href = sort[BLOD.tid][2];
                            child[4].childNodes[0].innerText = sort[BLOD.tid][1];
                        }
                        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("分区·稍后再看", ...e) }
                    }
                }
            }, 1000);
        },
    }
    // 点赞功能
    const setLike = async (data) => {
        if (!config.reset.like) return;
        let timer = window.setInterval(async () => {
            let coin = document.getElementsByClassName("bilibili-player-video-subtitle")[0];
            let number = document.getElementsByClassName("number")[0];
            let node = document.getElementsByClassName("coin")[0];
            // 判断页面渲染进度
            if (coin && node) {
                window.clearInterval(timer);
                let span = document.createElement("span");
                let move = document.createElement("i");
                let moved = document.createElement("b");
                let text = document.createTextNode("点赞 --");
                let arg = text;
                // 创建点赞数据相关节点并初始化
                span.setAttribute("class", "u like");
                span.setAttribute("style", "margin-right : 5px;");
                span.appendChild(move);
                span.appendChild(moved);
                span.appendChild(text);
                move.setAttribute("class", "l-icon-move");
                move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                moved.setAttribute("class", "l-icon-moved");
                moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                try {
                    move.onclick = async () => {
                        // 没有点赞过绑定点赞点击事件
                        if (!BLOD.uid) {
                            // 没有登录绑定快捷登录
                            document.getElementsByClassName("c-icon-move")[0].click();
                            return;
                        }
                        // 构造并请求点赞表单
                        let msg = "aid=" + aid + "&like=1&csrf=" + getCookies().bili_jct;
                        data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", "application/x-www-form-urlencoded", msg);
                        data = jsonCheck(data).ttl;
                        // 点亮点赞图标并修改显示数据
                        debug.msg("点赞成功！");
                        document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                        document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                        if (arg.nodeValue.match("万")) return;
                        let number = 1 * arg.nodeValue.match(/[0-9]+/) + 1;
                        text = document.createTextNode(" 点赞 " + number)
                        arg.replaceWith(text);
                        arg = text;
                    }
                    moved.onclick = async () => {
                        // 点赞过绑定取消点赞点击事件
                        // 构造并请求取消点赞表单
                        let msg = "aid=" + aid + "&like=2&csrf=" + getCookies().bili_jct;
                        data = await xhr.post("https://api.bilibili.com/x/web-interface/archive/like", "application/x-www-form-urlencoded", msg);
                        data = jsonCheck(data).ttl;
                        // 熄灭点赞图标并修改显示数据
                        debug.msg("点赞撤回！");
                        document.getElementsByClassName("l-icon-move")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;");
                        document.getElementsByClassName("l-icon-moved")[0].setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;display : none;");
                        if (arg.nodeValue.match("万")) return;
                        let number = 1 * arg.nodeValue.match(/[0-9]+/) - 1;
                        text = document.createTextNode(" 点赞 " + number)
                        arg.replaceWith(text);
                        arg = text;
                    }
                    number.insertBefore(span, node);
                    // 获取点赞数据
                    data = await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/view", { "aid": aid }));
                    data = jsonCheck(data).data.stat.like;
                    document.getElementsByClassName("like")[0].setAttribute("title", "点赞人数" + data);
                    text = document.createTextNode(" 点赞 " + unitFormat(data));
                    arg.replaceWith(text);
                    arg = text;
                    if (!BLOD.uid) return;
                    data = jsonCheck(await xhr.true(objUrl("https://api.bilibili.com/x/web-interface/archive/has/like", { "aid": aid }))).data;
                    if (data == 1) {
                        // 点赞过点亮图标
                        move.setAttribute("style", "width : 22px;height : 22px;background-position : -660px -2068px;display : none;");
                        moved.setAttribute("style", "width : 22px;height : 22px;background-position : -725px -2068px;");
                    }
                }
                catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("点赞功能", ...e) }
            }
        }, 100);
    }
    // 主页在线数据
    const setOnline = async () => {
        let timer = window.setInterval(async () => {
            let online = document.getElementsByClassName("online")[0];
            if (online) {
                // 判断主页载入进程
                window.clearInterval(timer);
                let loop = async () => {
                    try {
                        let data = await xhr.true("https://api.bilibili.com/x/web-interface/online");
                        data = jsonCheck(data).data;
                        let all_count = data.all_count;
                        let web_online = data.web_online;
                        let play_online = data.play_online;
                        let online = document.getElementsByClassName("online")[0];
                        if (online.tagName == "DIV") online = online.getElementsByTagName("a")[0];
                        else {
                            // 旧版主页需额外创建节点
                            let parent = online.parentNode;
                            online.remove();
                            let div = document.createElement("div");
                            let a = document.createElement("a");
                            div.setAttribute("class", "online");
                            parent.insertBefore(div, parent.firstChild);
                            a.setAttribute("href", "//www.bilibili.com/video/online.html");
                            a.setAttribute("target", "_blank");
                            div.appendChild(a);
                            online = a;
                        }
                        online.setAttribute("title", "在线观看：" + play_online);
                        online.text = web_online ? "在线人数：" + web_online : "在线列表";
                        if (!online.parentNode.getElementsByTagName("em")[0]) {
                            let em = document.createElement("em");
                            let count = document.createElement("a");
                            online.parentNode.insertBefore(em, online.nextSibling);
                            count.setAttribute("href", "//www.bilibili.com/newlist.html");
                            count.setAttribute("target", "_blank");
                            online.parentNode.insertBefore(count, em.nextSibling);
                            count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                        }
                        else {
                            let count = online.parentNode.getElementsByTagName("a")[1];
                            count.text = all_count ? "最新投稿：" + all_count : "最新投稿";
                        }
                        if (!all_count || !web_online || !play_online) return;
                        // 60s刷新一次
                        window.setTimeout(() => loop(), 60000);
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("在线数据", ...e) }
                }
                loop();
            }
        }, 1000);
    }
    // 空间注册时间
    const setJoinTime = async () => {
        if (!BLOD.mid && !config.reset.jointime) return;
        let data = await xhr.GM(objUrl("https://account.bilibili.com/api/member/getCardByMid", { "mid": BLOD.mid }));
        try {
            data = jsonCheck(data);
            // 格式化时间戳，不是13位，主动补位
            let jointime = timeFormat(data.card.regtime * 1000, 1);
            let birthdate = data.card.birthday;
            debug.log("注册时间", data.card.name, jointime);
            document.addEventListener("DOMNodeInserted", (msg) => {
                let birthday = document.getElementsByClassName("birthday");
                if (birthday[0]) {
                    if (document.getElementsByClassName("jointime")[0]) return;
                    else {
                        let div = document.createElement("div");
                        let icon = document.createElement("span");
                        let text = document.createElement("span");
                        let style = document.createElement("style");
                        div.setAttribute("class", "item jointime");
                        birthday[0].parentNode.appendChild(div);
                        icon.setAttribute("class", "icon");
                        div.appendChild(icon);
                        text.setAttribute("class", "text");
                        text.innerText = jointime;
                        div.appendChild(text);
                        style.setAttribute("type", "text/css");
                        document.head.appendChild(style);
                        style.appendChild(document.createTextNode(".user .info .meta .row {height : 88px;white-space : normal;}.user .info .jointime .icon {background-position : -209px -84px;}.user .info .jointime .text {color : #00a1d6;}}"));
                    }
                }
            });
        }
        catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("注册时间", ...e) }
    }
    // 会员授权
    const accesskey = async () => {
        if (window.self != window.top) return;
        if (!config.reset.accesskey) {//
            if (GM_getValue("access_key")) {
                GM_deleteValue("access_key");
                GM_deleteValue("access_date");
                let page = document.createElement("iframe");
                page.setAttribute("style", "display: none;");
                page.setAttribute("src", objUrl("https://www.biliplus.com/login?act=logout"));
                document.body.appendChild(page);
                setTimeout(() => { page.remove() }, 3000);
                debug.log("取消会员授权");
            }
            return;
        }
        if (!GM_getValue("access_key") || (Date.now() - GM_getValue("access_date") > 2160000)) {
            try {
                if (!BLOD.uid) {
                    debug.log("请先登录，才能授权会员");
                    return;
                }
                let data = jsonCheck(await BLOD.xhr.GM("https://passport.bilibili.com/login/app/third?appkey=27eb53fc9058f8c3&api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png&sign=04224646d1fea004e79606d3b038c84a"));
                data = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: data.data.confirm_uri,
                        onload: (xhr) => resolve(xhr.finalUrl),
                        onerror: (xhr) => reject(xhr.statusText || data.data.confirm_uri + " net::ERR_CONNECTION_TIMED_OUT"),
                    });
                })
                data = urlObj(data);
                let page = document.createElement("iframe");
                page.setAttribute("style", "display: none;");
                page.setAttribute("src", objUrl("https://www.biliplus.com/login", data));
                document.body.appendChild(page);
                setTimeout(() => { page.remove() }, 3000);
                GM_setValue("access_key", data.access_key);
                GM_setValue("access_date", Date.now());
                debug.log("会员授权成功！");
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("登录鉴权", ...e) }
        }
    }
    // 播放器通知
    const message = (...msg) => {
        let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
        if (!node) {
            debug.log(...msg);
            return;
        }
        let item = document.createElement("div");
        node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
        item.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-msg");
        item.innerHTML = '<div class="bilibili-player-video-toast-item-text"><span class="video-float-hint-text"></span><span class="video-float-hint-btn hint-red"></span></div>';
        item.children[0].children[0].innerHTML = msg[0] || "";
        item.children[0].children[1].innerHTML = msg[1] || "";
        setTimeout(() => item.remove(), 3000);
    }
    // 通知封装
    const debug = BLOD.debug = {
        log: (...msg) => console.log("[" + timeFormat(new Date()) + "]", ...msg),
        error: (...msg) => console.error("[" + timeFormat(new Date()) + "]", ...msg),
        warn: (...msg) => console.warn("[" + timeFormat(new Date()) + "]", ...msg),
        debug: (...msg) => console.debug("[" + timeFormat(new Date()) + "]", ...msg),
        msg: (...msg) => message(...msg)
    }
    const xhr = BLOD.xhr = {
        // 同步方法
        'false': (url) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            return xhr.responseText;
        },
        // 异步方法
        'true': (url) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                xhr.send();
            });
        },
        // 跨域方法
        GM: (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (xhr) => resolve(xhr.responseText),
                    onerror: (xhr) => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT"),
                });
            })
        },
        // 表单方法
        post: (url, header, data) => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                header = header ? header : "application/x-www-form-urlencoded";
                xhr.open('post', url, true);
                xhr.setRequestHeader("Content-type", header);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                xhr.send(data);
            });
        }
    }
    const iniState = BLOD.iniState = {
        av: (data) => {
            data = BLOD.jsonCheck(data).data;
            aid = aid || data.View.aid;
            cid = cid || data.View.cid;
            let dat = { aid: -1, comment: { count: 0, list: [] }, error: {}, isClient: false, p: "", player: "", playurl: {}, related: [], tags: [], upData: {}, videoData: {} };
            dat.aid = data.View.aid;
            dat.related = data.Related;
            dat.tags = data.Tags;
            dat.upData = data.Card.card;
            dat.upData.archiveCount = data.Card.archive_count;
            dat.videoData = data.View;
            dat.videoData.embedPlayer = 'EmbedPlayer("player", "//static.hdslb.com/play.swf", "cid=' + cid + '&aid=' + aid + '&pre_ad=")';
            return dat;
        },
        bangumi: (data, epId) => {
            let ep = 0, ini = {}, pug = {}, mode;
            let dat = { "ver": {}, "loginInfo": {}, "canReview": false, "userShortReview": {}, "userLongReview": {}, "userScore": 0, "userCoined": false, "isPlayerTrigger": false, "area": 0, "app": false, "mediaRating": {}, "recomList": [], "playerRecomList": [], "paster": {}, "payPack": {}, "payMent": {}, "activity": {}, "spending": 0, "sponsorTotal": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorWeek": { "code": 0, "result": { "ep_bp": 0, "users": 0, "mine": {}, "list": [] } }, "sponsorTotalCount": 0, "miniOn": true, "seasonFollowed": false, "epStat": {}, "ssStat": {} };
            if (data.startsWith("{")) {
                // DOCUMENT被404的备用数据源，无法获取播放进度信息，以ss进入默认选择第一p
                data = BLOD.jsonCheck(data).result;
                dat.special = data.bkg_cover ? true : false;
                if (epId) { dat.epId = 1 * epId; ep = 1; } else dat.epId = ""
                dat.ssId = data.season_id;
                dat.mdId = data.media_id;
                dat.mediaInfo = {};
                dat.mediaInfo.actors = data.actors || "";
                dat.mediaInfo.alias = data.alias;
                dat.mediaInfo.areas = data.areas || [];
                dat.mediaInfo.bkg_cover = data.bkg_cover;
                dat.mediaInfo.cover = data.cover;
                dat.mediaInfo.evaluate = data.evaluate;
                dat.mediaInfo.is_paster_ads = data.is_paster_ads || 0;
                dat.mediaInfo.jp_title = data.jp_title;
                dat.mediaInfo.link = data.link;
                dat.mediaInfo.media_id = data.media_id;
                dat.mediaInfo.mode = data.mode;
                dat.mediaInfo.paster_text = "";
                dat.mediaInfo.season_id = data.season_id;
                dat.mediaInfo.season_status = data.status;
                dat.mediaInfo.season_title = data.season_title;
                dat.mediaInfo.season_type = data.type;
                dat.mediaInfo.square_cover = data.square_cover;
                dat.mediaInfo.staff = data.staff || "";
                dat.mediaInfo.stat = data.state;
                dat.mediaInfo.style = data.style || [];
                dat.mediaInfo.title = data.title;
                dat.mediaInfo.total_ep = data.total;
                dat.mediaRating = data.rating;
                dat.epList = data.episodes;
                if (ep == 0) dat.epId = (data.episodes[0] && data.episodes[0].id) || "";
                for (let i = 0; i < dat.epList.length; i++) {
                    dat.epList[i].ep_id = dat.epList[i].id;
                    dat.epList[i].episode_status = dat.epList[i].status;
                    dat.epList[i].index = dat.epList[i].title;
                    dat.epList[i].index_title = dat.epList[i].long_title;
                    if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                    if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) BLOD.ids.push(dat.epList[i].cid);
                }
                dat.newestEp = data.new_ep;
                dat.seasonList = data.seasons;
                dat.rightsInfo = data.rights;
                dat.pubInfo = data.publish;
                dat.upInfo = data.up_info || {};
            }
            else {
                // 正常DOCUMENT数据源，up组主数据可能无效，将指向uid=2(站长)
                ini = JSON.parse(data.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, ""));
                pug = JSON.parse(data.match(/PGC_USERSTATE__=.+?<\/script>/)[0].replace(/PGC_USERSTATE__=/, "").replace(/<\/script>/, ""));
                dat.special = ini.mediaInfo.specialCover ? true : false;
                mode = dat.special ? 1 : 2;
                if (epId) { dat.epId = 1 * epId; ep = 1; }
                else { dat.epId = ""; if (pug.hasOwnProperty("progress")) { dat.epId = pug.progress.last_ep_id; ep = 1; } }
                dat.ssId = ini.mediaInfo.ssId;
                dat.mdId = ini.mediaInfo.id;
                dat.mediaInfo = {};
                dat.mediaInfo.actors = "";
                dat.mediaInfo.alias = ini.mediaInfo.alias;
                dat.mediaInfo.areas = [];
                dat.mediaInfo.bkg_cover = ini.mediaInfo.specialCover;
                dat.mediaInfo.cover = ini.mediaInfo.cover;
                dat.mediaInfo.evaluate = ini.mediaInfo.evaluate;
                dat.mediaInfo.is_paster_ads = 0;
                dat.mediaInfo.jp_title = ini.mediaInfo.jpTitle;
                dat.mediaInfo.link = "https://www.bilibili.com/bangumi/media/md" + dat.mdId;
                dat.mediaInfo.media_id = dat.mdId;
                dat.mediaInfo.mode = mode;
                dat.mediaInfo.paster_text = "";
                dat.mediaInfo.season_id = ini.mediaInfo.ssId;
                dat.mediaInfo.season_status = ini.mediaInfo.status;
                dat.mediaInfo.season_title = ini.mediaInfo.title;
                dat.mediaInfo.season_type = ini.mediaInfo.ssType;
                dat.mediaInfo.square_cover = ini.mediaInfo.squareCover;
                dat.mediaInfo.staff = "";
                dat.mediaInfo.stat = ini.mediaInfo.stat;
                dat.mediaInfo.style = [];
                dat.mediaInfo.title = ini.mediaInfo.title;
                dat.mediaInfo.total_ep = ini.epList.length;
                dat.mediaRating = ini.mediaInfo.rating;
                dat.epList = [];
                for (let i = 0; i < ini.sections.length; i++) ini.epList.push(...ini.sections[i].epList);
                if (ep == 0) dat.epId = (ini.epList[0] && ini.epList[0].id) || "";
                for (let i = 0; i < ini.epList.length; i++) {
                    dat.epList[i] = {};
                    dat.epList[i].aid = ini.epList[i].aid;
                    dat.epList[i].cid = ini.epList[i].cid;
                    dat.epList[i].badge = ini.epList[i].badge;
                    dat.epList[i].badge_type = ini.epList[i].badgeType;
                    dat.epList[i].cover = ini.epList[i].cover;
                    dat.epList[i].duration = -1;
                    dat.epList[i].ep_id = ini.epList[i].id;
                    dat.epList[i].episode_status = ini.epList[i].epStatus;
                    dat.epList[i].from = ini.epList[i].from;
                    dat.epList[i].index = ini.epList[i].title;
                    dat.epList[i].index_title = ini.epList[i].longTitle;
                    dat.epList[i].mid = ini.mediaInfo.upInfo.mid;
                    dat.epList[i].page = 1;
                    dat.epList[i].pub_real_time = ini.epList[i].releaseDate || ini.mediaInfo.pub.time;
                    dat.epList[i].section_id = -1;
                    dat.epList[i].section_type = 0;
                    dat.epList[i].vid = ini.epList[i].vid;
                    if (dat.epList[i].ep_id == dat.epId) dat.epInfo = dat.epList[i];
                    if (dat.epList[i].badge == "会员" || dat.epList[i].badge_type) BLOD.ids.push(dat.epList[i].cid);
                }
                dat.newestEp = ini.mediaInfo.newestEp;
                dat.seasonList = [];
                for (let i = 0; i < ini.ssList.length; i++) {
                    dat.seasonList[i] = {};
                    dat.seasonList[i].badge = ini.ssList[i].badge;
                    dat.seasonList[i].badge_type = ini.ssList[i].badgeType;
                    dat.seasonList[i].cover = ini.ssList[i].cover;
                    dat.seasonList[i].media_id = -1;
                    dat.seasonList[i].new_ep = {
                        cover: ini.ssList[i].epCover,
                        id: -1,
                        index_show: ini.ssList[i].desc
                    };
                    dat.seasonList[i].season_id = ini.ssList[i].id;
                    dat.seasonList[i].season_title = ini.ssList[i].title;
                    dat.seasonList[i].season_type = ini.ssList[i].type;
                    dat.seasonList[i].stat = {
                        danmaku: 0,
                        follow: 0,
                        view: 0
                    };
                    dat.seasonList[i].title = ini.ssList[i].title;
                }
                dat.newestEp.isNew = dat.newestEp.isNew ? 1 : 0;
                dat.rightsInfo = {};
                dat.rightsInfo.allow_bp = ini.mediaInfo.rights.allowBp ? 1 : 0;
                dat.rightsInfo.allow_download = 1;
                dat.rightsInfo.allow_review = ini.mediaInfo.rights.allowReview ? 1 : 0;
                dat.rightsInfo.copyright = "bilibili";
                dat.rightsInfo.is_preview = ini.mediaInfo.rights.isPreview ? 1 : 0;
                dat.rightsInfo.watch_platform = ini.mediaInfo.rights.appOnly ? 1 : 0;
                dat.pubInfo = {};
                dat.pubInfo.is_finish = ini.mediaInfo.pub.isFinish ? 1 : 0;
                dat.pubInfo.is_started = ini.mediaInfo.pub.isStart ? 1 : 0;
                dat.pubInfo.pub_time = ini.mediaInfo.pub.time;
                dat.pubInfo.pub_time_show = ini.mediaInfo.pub.timeShow;
                dat.pubInfo.weekday = -1;
                dat.upInfo = {};
                dat.upInfo.avatar = ini.mediaInfo.upInfo.avatar;
                dat.upInfo.follower = "--";
                dat.upInfo.is_vip = ini.mediaInfo.upInfo.isAnnualVip ? 1 : 0;
                dat.upInfo.mid = ini.mediaInfo.upInfo.mid;
                dat.upInfo.pendant = {
                    image: ini.mediaInfo.upInfo.pendantImage,
                    name: ini.mediaInfo.upInfo.pendantName,
                    pid: ini.mediaInfo.upInfo.pendantId
                };
                dat.upInfo.uname = ini.mediaInfo.upInfo.name;
                dat.upInfo.verify_type = 6;
                if (dat.upInfo.mid < 1) dat.upInfo = { avatar: "//i0.hdslb.com/bfs/face/ef0457addb24141e15dfac6fbf45293ccf1e32ab.jpg", follower: 897603, is_vip: 1, mid: 2, pendant: { image: "", name: "", pid: 0 }, uname: "碧诗", verify_type: 2 }
            }
            dat.seasonStat = { "views": 0, "danmakus": 0, "coins": 0, "favorites": 0 };
            dat.userStat = { "loaded": true, "error": false, "follow": 0, "pay": 0, "payPackPaid": 0, "sponsor": 0 };
            dat.userStat.watchProgress = pug.progress;
            dat.userStat.vipInfo = pug.vip_info;
            if (pug.dialog || pug.pay == 1) {
                dat.payMent = { "price": "0.0", "promotion": "", "tip": "大会员专享观看特权哦~" };
                if (pug.dialog) {
                    dat.payMent.vip_promotion = pug.dialog.title;
                    if (pug.dialog.btn_left) dat.payMent.price = pug.dialog.btn_left.title.match(/[0-9]+/)[0];
                }
            }
            if (dat.epInfo.index >= 0) { dat.special = false; dat.mediaInfo.bkg_cover = ""; }
            return dat;
        },
        index: (data) => {
            let dat = {};
            let ini = JSON.parse(data);
            dat.recommendData = [];
            for (let i = 0; i < ini.recommendList.length; i++) {
                dat.recommendData[i] = {};
                dat.recommendData[i].aid = ini.recommendList[i].aid;
                dat.recommendData[i].typename = ini.recommendList[i].tname;
                dat.recommendData[i].title = ini.recommendList[i].title;
                dat.recommendData[i].subtitle = "";
                dat.recommendData[i].play = ini.recommendList[i].stat.view;
                dat.recommendData[i].review = ini.recommendList[i].stat.reply;
                dat.recommendData[i].video_review = "";
                dat.recommendData[i].favorites = ini.recommendList[i].stat.favorite;
                dat.recommendData[i].mid = ini.recommendList[i].owner.mid;
                dat.recommendData[i].author = ini.recommendList[i].owner.name;
                dat.recommendData[i].create = ini.recommendList[i].pubdate;
                dat.recommendData[i].pic = ini.recommendList[i].pic;
                dat.recommendData[i].coins = ini.recommendList[i].stat.coin;
                dat.recommendData[i].duration = ini.recommendList[i].duration;
                dat.recommendData[i].badgepay = false;
                dat.recommendData[i].rights = ini.recommendList[i].rights;
            }
            dat.locsData = ini.locsData;
            dat.locsData[23] = ini.locsData[3197];
            if (config.reset.adloc) for (let key in dat.locsData) if (dat.locsData[key]) for (let i = dat.locsData[key].length - 1; i >= 0; i--) if (dat.locsData[key][i].is_ad) { debug.debug("移除广告", key, dat.locsData[key][i]); dat.locsData[key].splice(i, 1); }
            if (dat.locsData[31][0] && dat.locsData[31][0].id == 0) dat.locsData[31] = [{ "id": 36585, "contract_id": "", "pos_num": 1, "name": "小黑屋弹幕举报", "pic": "https://i0.hdslb.com/bfs/archive/0aa2f32c56cb65b6d453192a3015b65e62537b9a.jpg", "litpic": "", "url": "https://www.bilibili.com/blackboard/activity-dmjbfj.html", "style": 0, "agency": "", "label": "", "intro": "", "creative_type": 0, "request_id": "1546354354629q172a23a61a62q626", "src_id": 32, "area": 0, "is_ad_loc": true, "ad_cb": "", "title": "", "server_type": 0, "cm_mark": 0, "stime": 1520478000, "mid": "14629218" }];
            return dat;
        }
    }
    const ui = {
        init: async (timer) => {
            if (window.self != window.top) return;
            let face = document.createElement("div");
            let attribute = {
                "class": "bili-old ui-face",
                "id": "ui-face",
                "style": "right : -54px;"
            }
            for (let key in attribute) face.setAttribute(key, attribute[key]);
            face.onmouseover = () => face.setAttribute("style", "right : 0px;box-shadow : rgba(0, 85, 255, 0.098) 0px 0px 20px 0px;border : 1px solid rgb(233, 234, 236);");
            face.onmouseout = () => face.setAttribute("style", "right : -54px;");
            face.onclick = () => {
                let check = document.getElementsByClassName("ui-table")[0];
                if (!check) ui.table(); else if (check.getAttribute("hidden")) check.removeAttribute("hidden");
            }
            face.innerHTML = "<i></i><span>设置</span>";
            (timer = () => {
                setTimeout(() => { document.body ? document.body.appendChild(face) : timer() }, 100);
            })();
        },
        table: async (timer) => {
            let table = document.createElement("div");
            table.setAttribute("class", "bili-old ui-table");
            table.setAttribute("id", "ui-table");
            table.innerHTML = '<span style="color : rgb(0,0,0);font-size : 14px;">BilibiliOld 设置</span><span style="color : blue;float : right;font-size : 12px;">恢复默认</span>';
            document.body.appendChild(table);
            table.children[1].onclick = () => {
                for (let key in BLOD.defaultConfig.rewrite) if (key in config.rewrite) config.rewrite[key] = BLOD.defaultConfig.rewrite[key][0];
                for (let key in BLOD.defaultConfig.reset) if (key in config.reset) config.reset[key] = BLOD.defaultConfig.reset[key][0];
                BLOD.setValue("config", config);
                accesskey();
                table.remove();
            }
            for (let key in config.rewrite) ui.setTable(table, BLOD.defaultConfig.rewrite[key], config.rewrite[key], key);
            for (let key in config.reset) ui.setTable(table, BLOD.defaultConfig.reset[key], config.reset[key], key);
            table.onmouseover = () => window.clearTimeout(timer);
            table.onmouseout = () => {
                timer = window.setTimeout(() => {
                    table.setAttribute("hidden", "hidden");
                    BLOD.setValue("config", config);
                }, 500);
            }
        },
        setTable: async (table, name, check, key) => {
            let setTable = document.createElement("div");
            setTable.setAttribute("style", "padding : 4px 4px 0px 4px;clear : both;");
            setTable.innerHTML = '<span style="float : left;display : inline-block;color : rgb(0,0,0);font-size : 14px;"></span><input type="checkbox" class="checke">';
            setTable.onmouseover = () => {
                let toast = document.createElement("div");
                toast.setAttribute("class", "bili-old ui-state");
                toast.setAttribute("id", "ui-state");
                toast.innerHTML = name[2];
                document.body.appendChild(toast);
            }
            setTable.onmouseout = () => document.getElementById("ui-state") ? document.getElementById("ui-state").remove() : "";
            setTable.children[0].innerText = name[1];
            setTable.children[1].onclick = () => {
                if (setTable.children[1].checked) {
                    if (key in config.rewrite) config.rewrite[key] = 1;
                    else config.reset[key] = 1;
                    if (!config.reset.xhrhook && key != "xhrhook" && BLOD.defaultConfig.reset[key][1].includes("xhrhook")) {
                        debug.msg("启用失败！xhrhook已关闭！", BLOD.defaultConfig.reset[key][0]);
                    }
                }
                else {
                    if (key in config.rewrite) config.rewrite[key] = 0;
                    else config.reset[key] = 0;
                    if (key == "xhrhook") debug.msg("xhrhook已关闭，部分功能无法生效！");
                }
                if (key == "accesskey") accesskey();
            }
            if (check) setTable.children[1].checked = true;
            table.appendChild(setTable);
        }
    }
    const rewrite = BLOD.rewrite = {
        av: () => {
            BLOD.path.name = "av";
            BLOD.ml = BLOD.getValue("medialist");
            BLOD.deleteValue("medialist");
            if (config.reset.bvid2av && BLOD.path[4].toLowerCase().startsWith('bv')) {
                aid = BLOD.abv(BLOD.path[4]);
                history.replaceState(null, null, "https://www.bilibili.com/video/av" + aid + location.search + location.hash);
            }
            try {
                if (!config.rewrite.av) throw ["未启用旧版av页", location.href];
                aid = aid || BLOD.path[4].match(/[0-9]+/)[0];
                let page = xhr.false(BLOD.objUrl("https://api.bilibili.com/x/web-interface/view/detail", { aid: aid }));
                BLOD.__INITIAL_STATE__ = BLOD.iniState.av(page);
                if (!BLOD.__INITIAL_STATE__) throw "av/BV号可能无效！";
                if (BLOD.__INITIAL_STATE__.videoData.redirect_url) throw ["番剧重定向：", BLOD.__INITIAL_STATE__.videoData.redirect_url];
                if (BLOD.__INITIAL_STATE__.videoData.stein_guide_cid) throw ["忽略互动视频：", "av" + aid];
                aid = BLOD.__INITIAL_STATE__.aid ? BLOD.__INITIAL_STATE__.aid : aid;
                BLOD.tid = BLOD.__INITIAL_STATE__.videoData.tid ? BLOD.__INITIAL_STATE__.videoData.tid : BLOD.tid;
                unsafeWindow.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(oldScript(BLOD.getResourceText("av")));
                document.title = BLOD.__INITIAL_STATE__.videoData.title + "_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili";
                fixSort.video();
                setLike();
                setMediaList.init();
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·av/BV", ...e) }
        },
        watchlater: () => {
            try {
                if (!config.rewrite.watchlater) throw ["未启用旧版稍后再看", location.href];
                if (!BLOD.uid) throw ["未登录", "无法启用旧版稍后再看"];
                BLOD.path.name = "watchlater";
                BLOD.write(oldScript(BLOD.getResourceText("watchlater")));
                setLike();
                fixSort.watchlater();
                if (BLOD.path[5]) {
                    aid = BLOD.path[5].match(/[0-9]+/) ? BLOD.path[5].match(/[0-9]+/)[0] : aid;
                    if (BLOD.path[5].toLowerCase().startsWith('bv')) {
                        aid = BLOD.abv(BLOD.path[5]);
                        BLOD.path[5] = "av" + aid;
                        history.replaceState(null, null, BLOD.path.join("/"));
                    }
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·稍后再看", ...e) }
        },
        bangumi: () => {
            try {
                if (!config.rewrite.bangumi) throw ["未启用旧版Bangumi", location.href];
                BLOD.path.name = "bangumi";
                BLOD.pgc = true;
                let page = xhr.false(location.href);
                BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ?
                    JSON.parse(page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "")) : "";
                if (!BLOD.__INITIAL_STATE__) {
                    if (BLOD.path[5].startsWith('ss')) {
                        page = xhr.false(BLOD.objUrl("https://api.bilibili.com/pgc/view/web/season", { season_id: location.href.match(/[0-9]+/)[0] }));
                    } else if (BLOD.path[5].startsWith('ep')) {
                        page = xhr.false(BLOD.objUrl("https://api.bilibili.com/pgc/view/web/season", { ep_id: location.href.match(/[0-9]+/)[0] }));
                    }
                }
                let id = BLOD.path[5].startsWith('ep') ? location.href.match(/[0-9]+/)[0] : "";
                BLOD.__INITIAL_STATE__ = BLOD.iniState.bangumi(page, id);
                if (BLOD.__INITIAL_STATE__ && BLOD.__INITIAL_STATE__.epInfo && BLOD.__INITIAL_STATE__.epInfo.badge === "互动") throw ["忽略互动视频：", location.href];
                unsafeWindow.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                if (page.match('"specialCover":""') || !BLOD.__INITIAL_STATE__.special) BLOD.write(oldScript(BLOD.getResourceText("bangumi")));
                else BLOD.write(oldScript(BLOD.getResourceText("cinema")));
                document.title = page.match(/<title.*?>.+?<\/title>/) ?
                    page.match(/<title.*?>.+?<\/title>/)[0].replace(/<title.*?>/, "").replace(/<\/title>/, "") : BLOD.__INITIAL_STATE__.mediaInfo.title;
                if (BLOD.__INITIAL_STATE__) setBangumi.init(BLOD.__INITIAL_STATE__);

            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·Bangumi", ...e) }
        },
        blackboard: () => {
            if (BLOD.path[4].startsWith('html5player')) {
                if (BLOD.path[4].includes("3521416") && BLOD.path[4].includes("6041635")) {
                    location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html", { "aid": 3521416, "cid": 192446449 }));
                }
            }
            try {
                if (!config.rewrite.frame) throw ["未启用旧版嵌入播放器", location.href];
                BLOD.path.name = "blackboard";
                if (BLOD.path[4].startsWith('newplayer')) {
                    let obj = BLOD.urlObj(location.href),
                        season_type = obj.season_type || "",
                        player_type = obj.player_type || "";
                    aid = 1 * obj.aid || (obj.aid ? BLOD.abv(obj.aid) : undefined) || (obj.bvid ? BLOD.abv(obj.bvid) : undefined);
                    cid = obj.cid || "";
                    try {
                        cid = cid || BLOD.jsonCheck(xhr.false(
                            BLOD.objUrl("https://api.bilibili.com/x/player/pagelist", { "aid": aid }))).data[0].cid
                    }
                    catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
                    location.replace(BLOD.objUrl("https://www.bilibili.com/blackboard/html5player.html",
                                                 { "aid": aid, "cid": cid, "season_type": season_type, "player_type": player_type, "as_wide": 1, }));
                    debug.log("嵌入播放器", "aid=", aid, " cid=", cid);
                }
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·嵌入", ...e) }
        },
        playlist: () => {
            BLOD.path.name = "playlist";
            if (BLOD.path[4] == "video") {
                BLOD.write(oldScript(BLOD.getResourceText("playlist")));
            }
            if (BLOD.path[4] == "detail") {
                BLOD.__INITIAL_STATE__ = { mid: "", pid: "", plinfoData: {}, pllistData: {} }
                try {
                    let page = BLOD.jsonCheck(
                        xhr.false(BLOD.objUrl("https://api.bilibili.com/x/playlist/video/toview", { pid: BLOD.path[5].match(/[0-9]+/)[0] }))).data;
                    BLOD.__INITIAL_STATE__.mid = page.mid;
                    BLOD.__INITIAL_STATE__.pid = page.pid;
                    BLOD.__INITIAL_STATE__.plinfoData = { attr: page.attr, count: page.count, cover: page.cover, ctime: page.ctime, description: page.description, favored: page.favored, id: page.id, is_favorite: page.is_favorite, mid: page.mid, mtime: page.mtime, owner: page.owner, pid: page.pid, stat: page.stat, state: page.state, type: page.type, };
                    BLOD.__INITIAL_STATE__.pllistData = page.list;
                }
                catch (e) {
                    e = Array.isArray(e) ? e : [e]; debug.error("播单", ...e);
                    BLOD.__INITIAL_STATE__ = JSON.parse(BLOD.getResourceText("playlistjson"));
                }
                unsafeWindow.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                BLOD.write(oldScript(BLOD.getResourceText("playlistdetail")));
            }
        },
        medialist: () => {
            if (BLOD.path[5].startsWith("ml")) {
                BLOD.ml = 1 * BLOD.path[5].match(/[0-9]+/)[0];
                // 保存收藏号并调用av跳转
                if (!config.rewrite.medialist) return;
                BLOD.path.name = "medialist";
                GM_setValue("medialist", BLOD.ml);
                setMediaList.init(BLOD.ml);
            }
            // 新版稍后再看跳转到旧版稍后再看
            if (BLOD.path[5].startsWith("watchlater") && config.rewrite.watchlater) location.replace("https://www.bilibili.com/watchlater/#/");
        },
        s: () => {
            if (!config.reset.static) return;
            BLOD.path.name = "s";
            location.replace(location.href.replace("s/video", "video"));
        },
        space: () => {
            BLOD.mid = BLOD.path[3] ? 1 * BLOD.path[3] : BLOD.mid;
            setJoinTime();
        },
        index: () => {
            try {
                if (!config.rewrite.home) throw ["未启用旧版主页", location.href];
                BLOD.path.name = "index";
                if (!window.__INITIAL_STATE__) {
                    let page = xhr.false(location.href);
                    BLOD.__INITIAL_STATE__ = page.includes("__INITIAL_STATE__=") ? page.match(/INITIAL_STATE__=.+?\;\(function/)[0].replace(/INITIAL_STATE__=/, "").replace(/;\(function/, "") : "";
                }
                else BLOD.__INITIAL_STATE__ = JSON.stringify(window.__INITIAL_STATE__);
                unsafeWindow.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__ = BLOD.iniState.index(BLOD.__INITIAL_STATE__);
                BLOD.write(BLOD.getResourceText("index"));
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·主页", ...e) }
            setOnline();
        },
        rank: (page) => {
            try {
                if (!config.rewrite.rank) throw ["未启用排行", location.href];
                BLOD.path.name = "rank";
                let refer = document.referrer.split("/");
                if (refer && refer[4] && refer[4] == "all") page = jsonCheck(xhr.false(objUrl("https://api.bilibili.com/x/web-interface/ranking", { rid: refer[5], day: 3, type: 1, arc_type: 0 })));
                else page = jsonCheck(xhr.false(objUrl("https://api.bilibili.com/x/web-interface/ranking", { rid: 0, day: 3, type: 1, arc_type: 0 })));
                BLOD.__INITIAL_STATE__ = { loading: false, rankRouteParams: { arc_type: 0, day: 3, rankTab: "all", rid: 1 * refer[5] || 0, season_type: 1 }, showTypes: true, times: [{ name: "日排行", value: 1 }, { name: "三日排行", value: 3 }, { name: "周排行", value: 7 }, { name: "月排行", value: 30 }], typeList: [{ name: "全部投稿", value: 0 }, { name: "近期投稿", value: 1 }] };
                BLOD.__INITIAL_STATE__.channels = [{ name: "全站", tid: 0 }, { name: "动画", tid: 1 }, { name: "国创相关", tid: 168 }, { name: "音乐", tid: 3 }, { name: "舞蹈", tid: 129 }, { name: "游戏", tid: 4 }, { name: "科技", tid: 36 }, { name: "数码", tid: 188 }, { name: "生活", tid: 160 }, { name: "美食", tid: 211 }, { name: "鬼畜", tid: 119 }, { name: "时尚", tid: 155 }, { name: "娱乐", tid: 5 }, { name: "影视", tid: 181 }];
                BLOD.__INITIAL_STATE__.rankList = page.data.list;
                BLOD.__INITIAL_STATE__.note = page.data.note;
                unsafeWindow.__INITIAL_STATE__ = BLOD.__INITIAL_STATE__;
                write(BLOD.getResourceText("ranking"));
            }
            catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("框架·排行", ...e) }
        }
    }

    // 初始化配置数据
    let localConfig = BLOD.getValue("config");
    let configSort = ["rewrite", "reset"];
    BLOD.defaultConfig = JSON.parse(JSON.stringify(config));
    for (let key in config) if (configSort.indexOf(key) < 0) delete config[key];
    if (localConfig) {
        configSort.forEach(x => {
            for (let key in localConfig[x]) if (key in config[x]) config[x][key] = localConfig[x][key];
        })
    } else {
        configSort.forEach(x => {
            for (let key in config[x]) config[x][key] = config[x][key][0];
        })
        BLOD.setValue("config", config);
    }
    BLOD.uid = BLOD.getCookies().DedeUserID;
    BLOD.path = document.location.href.split('/');
    getVariable();
    if (BLOD.uid) {
        let offset = BLOD.getCookies()["bp_video_offset_" + BLOD.uid];
        if (offset) document.cookie = "bp_t_offset_" + BLOD.uid + "=" + offset + "; domain=bilibili.com; expires=Aug, 18 Dec 2038 18:00:00 GMT; BLOD.path=/";
    }
    let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
    if (bilibili_player_settings) {
        bilibili_player_settings = JSON.parse(bilibili_player_settings);
        if (bilibili_player_settings.video_status.autopart !== "") BLOD.setValue("bilibili_player_settings", bilibili_player_settings);
        else if (GM_getValue("bilibili_player_settings")) localStorage.setItem("bilibili_player_settings", JSON.stringify(BLOD.getValue("bilibili_player_settings")));
    } else if (BLOD.path[2] == 'www.bilibili.com' && BLOD.getValue("bilibili_player_settings")) {
        localStorage.setItem("bilibili_player_settings", JSON.stringify(BLOD.getValue("bilibili_player_settings")));
    }
    // 页面分离
    if (BLOD.path[3]) {
        if (BLOD.path[3] == 'video' && (BLOD.path[4].toLowerCase().startsWith('av') || BLOD.path[4].toLowerCase().startsWith('bv'))) BLOD.rewrite.av();
        if (BLOD.path[3] == 'watchlater') BLOD.rewrite.watchlater();
        if (BLOD.path[3] == 'bangumi' && BLOD.path[4] == 'play') BLOD.rewrite.bangumi();
        if (BLOD.path[3] == 'blackboard' && BLOD.path[4]) BLOD.rewrite.blackboard();
        if (BLOD.path[3] == 'playlist' && BLOD.path[5].startsWith('pl')) BLOD.rewrite.playlist();
        if (BLOD.path[3] == 'medialist' && BLOD.path[4] == 'play') BLOD.rewrite.medialist();
        if (BLOD.path[3] == 's' && (BLOD.path[5].toLowerCase().startsWith('av') || BLOD.path[5].toLowerCase().startsWith('bv'))) BLOD.rewrite.s();
        if (BLOD.path[2] == 'space.bilibili.com') BLOD.rewrite.space();
        if (BLOD.path[2] == 'www.bilibili.com' && (BLOD.path[3].startsWith('\?') || BLOD.path[3].startsWith('\#') || BLOD.path[3].startsWith('index.'))) BLOD.rewrite.index();
        if (BLOD.path[3] == 'v' && BLOD.path[4] == "popular") BLOD.rewrite.rank();
    } else {
        if (BLOD.path[2] == 'www.bilibili.com') BLOD.rewrite.index();
        if (BLOD.path[2] == 'live.bilibili.com') BLOD.path.name = "live";
    }

    addCss(BLOD.getResourceText("css"));
    xhrHook.init();
    ui.init();
    document.addEventListener("DOMNodeInserted", (msg) => {
        // 去除预览提示框
        if (/bilibili-player-video-toast-pay/.test(msg.target.className)) removePreview(msg.target);
        // 版面替换
        if (msg.target.id == "internationalHeader") resetSction();
        if (msg.target.id == "bili-header-m") if (document.getElementById("internationalHeader")) document.getElementById("internationalHeader").remove();
        // 切p监听
        if (/bilibili-player-video-btn-start/.test(msg.target.className)) switchVideo();
        // 创建播放器右键下载菜单
        if (/bilibili-player-context-menu-container black/.test(msg.target.className)) download.init(msg.target);
        // 捕获评论链接
        if (msg.target.src && msg.target.src.startsWith('https://api.bilibili.com/x/v2/reply') && msg.target.src.includes("oid")) BLOD.src = msg.target.src;
        // 捕获频道视频链接
        if (msg.target.src && msg.target.src.includes("//api.bilibili.com/x/space/channel/video?")) BLOD.src = msg.target.src;
        // 修复失效频道视频
        if (msg.relatedNode.getAttribute("class") == "row video-list clearfix") fixVideoLost.channel(BLOD.src);
        // 修复失效收藏视频
        if (msg.target.className == "small-item disabled") fixVideoLost.favlist(msg);
        // 刷新番剧分集数据
        if (msg.relatedNode.className == "info-sec-av") setBangumi.episodeData("", msg);
        // 失效分区转换
        if (msg.target.id == "bili_ad" || msg.target.className == "report-wrap-module elevator-module" || msg.target.id == "bili-header-m" || msg.target.className == "no-data loading") fixnews(msg.target);
        // 修复评论楼层&修复评论空降坐标
        if (BLOD.src && (/l_id/.test(msg.target.id) || /reply-wrap/.test(msg.target.className))) { setReplyFloor.init(BLOD.src); fixVideoSeek(msg.target.parentNode); }
        // 跳过充电鸣谢
        if (/bilibili-player-electric-panel-jump/.test(msg.relatedNode.className)) electricPanelJump(msg.relatedNode);
        // 修复分区排行
        if (msg.target.id == "bili_movie" || msg.target.id == "bili_teleplay" || msg.target.id == "bili_documentary") fixrank(msg.target);
        // 弹幕哈希反查
        if (/danmaku-info-row/.test(msg.target.className)) danmkuHashId(msg.target);
        // 其他节点监听
        resetNodes();
        // 收藏页切p监听
        setMediaList.fixvar();
        // 修复空间主页失效视频
        fixVideoLost.home(msg);
        // bv号转超链接
        avdesc();
    });
})();
