/*
 * @module "xhrhook.js"
 * @description xhr hook模块
 */
(function () {
    const BLOD = window.BLOD;
    const config = BLOD.config;
    const debug = BLOD.debug;

    const root = window.protobuf.Root.fromJSON(JSON.parse('{"nested":{"bilibili":{"nested":{"DmWebViewReply":{"fields":{"state":{"type":"int32","id":1},"text":{"type":"string","id":2},"textSide":{"type":"string","id":3},"dmSge":{"type":"DmSegConfig","id":4},"flag":{"type":"DanmakuFlagConfig","id":5},"specialDms":{"rule":"repeated","type":"string","id":6},"checkBox":{"type":"bool","id":7},"count":{"type":"int64","id":8},"commandDms":{"rule":"repeated","type":"CommandDm","id":9},"dmSetting":{"type":"DanmuWebPlayerConfig","id":10}}},"CommandDm":{"fields":{"id":{"type":"int64","id":1},"oid":{"type":"int64","id":2},"mid":{"type":"int64","id":3},"command":{"type":"string","id":4},"content":{"type":"string","id":5},"progress":{"type":"int32","id":6},"ctime":{"type":"string","id":7},"mtime":{"type":"string","id":8},"extra":{"type":"string","id":9},"idStr":{"type":"string","id":10}}},"DmSegConfig":{"fields":{"pageSize":{"type":"int64","id":1},"total":{"type":"int64","id":2}}},"DanmakuFlagConfig":{"fields":{"recFlag":{"type":"int32","id":1},"recText":{"type":"string","id":2},"recSwitch":{"type":"int32","id":3}}},"DmSegMobileReply":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}},"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"weight":{"type":"int32","id":9},"action":{"type":"string","id":10},"pool":{"type":"int32","id":11},"idStr":{"type":"string","id":12}}},"DanmuWebPlayerConfig":{"fields":{"dmSwitch":{"type":"bool","id":1},"aiSwitch":{"type":"bool","id":2},"aiLevel":{"type":"int32","id":3},"blocktop":{"type":"bool","id":4},"blockscroll":{"type":"bool","id":5},"blockbottom":{"type":"bool","id":6},"blockcolor":{"type":"bool","id":7},"blockspecial":{"type":"bool","id":8},"preventshade":{"type":"bool","id":9},"dmask":{"type":"bool","id":10},"opacity":{"type":"float","id":11},"dmarea":{"type":"int32","id":12},"speedplus":{"type":"float","id":13},"fontsize":{"type":"float","id":14},"screensync":{"type":"bool","id":15},"speedsync":{"type":"bool","id":16},"fontfamily":{"type":"string","id":17},"bold":{"type":"bool","id":18},"fontborder":{"type":"int32","id":19},"drawType":{"type":"string","id":20}}}}}}}'));
    const protoSeg = root.lookupType('bilibili.DmSegMobileReply');
    const protoView = root.lookupType('bilibili.DmWebViewReply');

    // hook setTimeout过滤旧版播放器强制初始化错误
    // @url https://github.com/indefined/UserScripts/issues/39#issuecomment-745279894
    class HookTimeOut {
        constructor() {
            this.hook = setTimeout;
            window.setTimeout = (...args) => {
                if (args[1] && args[1] == 1500 && args[0] && args[0].toString() == "function(){f.cz()}") {
                    debug.log("过滤拦截播放器强制初始化", ...args);
                    return Number.MIN_VALUE;
                }
                return this.hook.call(window, ...args);
            }

        }
        relese() {
            window.setTimeout = this.hook;
        }
    }
    // proto => xml
    const toXml = BLOD.toXml = (danmaku) => {
        return new Promise(function (resolve) {
            danmaku.sort(function (a, b) {
                return a.progress - b.progress;
            });
            let attr = [], xml = '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + BLOD.cid + '</chatid><mission>0</mission><maxlimit>99999</maxlimit><state>0</state><real_name>0</real_name><source>e-r</source>'
            attr[5] = 0;
            for (let i = 0; i < danmaku.length; i++) {
                attr[0] = danmaku[i].progress / 1000;
                attr[1] = danmaku[i].mode;
                attr[2] = danmaku[i].fontsize;
                attr[3] = danmaku[i].color;
                attr[4] = danmaku[i].ctime;
                attr[6] = danmaku[i].midHash;
                attr[7] = danmaku[i].idStr;
                xml += '<d p="' + attr.join(",") + '">' + danmaku[i].content.replace(/[<">'&]/g, (a) => { return { '<': '&lt;', '"': '&quot;', '>': '&gt;', "'": '&#39;', '&': '&amp;' }[a] }) + '</d>';
            }
            xml += "</i>";
            resolve(xml);
        });
    }

    const getSegDanmaku = (onload) => {
        let protoSegments = [];
        getSegConfig().then(getAllSeg);
        function getSegConfig() {
            return new Promise(function (resolve) {
                let xhr = new XMLHttpRequest();
                xhr.addEventListener("load", function () {
                    let res = protoView.decode(new Uint8Array(xhr.response));
                    resolve(res);
                });
                xhr.open("get", "https://api.bilibili.com/x/v2/dm/web/view?type=1&oid=" + BLOD.cid + "&pid=" + BLOD.aid);
                xhr.responseType = "arraybuffer";
                xhr.send();
            });
        }
        // 获得所有分段
        function getAllSeg(config) {
            let total = config.dmSge.total;
            let allrequset = [];
            let reqUrl = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + BLOD.cid + "&pid=" + BLOD.aid;
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
                        Segments.sort(function (a, b) {
                            return a.progress - b.progress;
                        });
                        // 将弹幕转换为旧格式
                        let danmaku = Segments.map(function (v) {
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
                                danmakuArray: danmaku,
                                loadTime: loadTime,
                                parseTime: parseTime,
                                sendTip: "",
                                state: 0,
                                textSide: "",
                                total: Segments.length.toString()
                            }
                        });
                        toXml(Segments).then(function (result) {
                            // 备份弹幕
                            BLOD.xml = result;
                        });
                    });
                } else {
                    workerPostMsg.call(this, aMessage, transferList);
                }
            }
        }
        open() {
            const open = XMLHttpRequest.prototype.open;
            this.segRequestOnlyOnce = true;
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                let _url = url, hook = [_url, ""];
                let obj = BLOD.urlObj(url);
                // 替换视频心跳
                if (url.includes('api.bilibili.com/x/report/web/heartbeat') && config.reset.heartbeat) {
                    url = url.replace('api.bilibili.com/x/report/web/heartbeat', 'api.bilibili.com/x/click-interface/web/heartbeat');
                    debug.debug("XHR重定向", "替换视频心跳", [_url, url]);
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
                // 监听视频链接
                if (url.includes("/playurl?")) {
                    obj.fourk = obj.sign ? null : 1;
                    obj.fnval = obj.fnval ? 80 : null;
                    BLOD.cid = obj.cid || BLOD.cid;
                    BLOD.aid = obj.avid || BLOD.aid || null;
                    BLOD.bvid = obj.bvid || (BLOD.aid && BLOD.abv(BLOD.aid)) || BLOD.bvid || null;
                    if (config.reset.novideo && !obj.sign) obj = Object.assign(obj, { aid: 1, cid: 1, ep_id: 1 });
                    url = BLOD.objUrl(url.split("?")[0], obj);
                    url = url.includes("84956560bc028eb7") ? BLOD.urlSign(url, 0, 8) : url;
                    BLOD.pgc = url.includes("pgc") ? true : false;
                    BLOD.vip = BLOD.big > 1 ? true : BLOD.vip;
                    if (BLOD.big > 1 || (BLOD.vip && BLOD.ids.indexOf(1 * BLOD.cid) >= 0)) this.url = url;
                    if (BLOD.limit) this.url = url;
                    this.addEventListener('readystatechange', () => { if (this.readyState === 4) xhrHook.playinfo(this, url) });
                }
                // 修改弹幕链接
                if (url.includes("list.so")) {
                    // 这时pakku.js已经修改了xhr对象，需要另做处理
                    if (this.pakku_url && config.reset.danmuku) {
                        this.segRequestOnlyOnce = true;
                        let pid = BLOD.aid;
                        // 更改pakku.js请求的url，使它过滤分段弹幕
                        this.pakku_url = url = "https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid=" + BLOD.cid + "&pid=" + pid + "&segment_index=1";
                        this.responseType = "arraybuffer";
                        let xhr = this;
                        let cb = [];
                        for (let i in this.pakku_load_callback) {
                            cb[i] = this.pakku_load_callback[i];
                        }
                        for (let i in this.pakku_load_callback) {
                            // 将pakku.js返回的数据转换回xml
                            this.pakku_load_callback[i] = function () {
                                toXml(protoSeg.decode(new Uint8Array(xhr.response)).elems).then(function (xml) {
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
                    this.addEventListener("load", function () {
                        BLOD.xml = this.response;
                        BLOD.hash = [];
                        BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                    });
                }
                // 历史弹幕下载
                if (url.includes("history?type=")) {
                    this.addEventListener("load", function () {
                        BLOD.xml = this.response;
                        BLOD.hash = [];
                        BLOD.xml.match(/d p=".+?"/g).forEach((v) => { BLOD.hash.push(v.split(",")[6]) });
                    });
                }
                return open.call(this, method, url, ...rest);
            }
        }
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
                else if (this.url) {
                    let hookTimeOut = new HookTimeOut();
                    (async () => {
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
                                    try {
                                        response = BLOD.jsonCheck(await BLOD.xhr.true(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                    } catch (e) {
                                        e = Array.isArray(e) ? e : [e];
                                        debug.error("pgc模式出错", ...e)
                                        obj.module = "bangumi";
                                        response = BLOD.jsonCheck(await BLOD.xhr.GM(BLOD.objUrl("https://www.biliplus.com/BPplayurl.php", obj)));
                                    }
                                    response = { "code": 0, "message": "success", "result": response };
                                }
                            }
                            catch (e) { debug.msg("解除限制失败 ಥ_ಥ", ...e); response = { "code": -404, "message": e, "data": null }; }
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
                    })();
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
        }
        jsonp() {
            window.$.ajaxSetup({
                beforeSend: function (xhr) {
                    // 拦截日志上传
                    if (this.url.includes("data.bilibili.com/log/web")) xhr.abort();
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
                    if (config.reset.replyfloor && this.url.includes('api.bilibili.com/x/v2/reply') && this.url.includes('oid')) {
                        this.url = this.url + '&mobi_app=android';
                        let jsonpCallback = this.jsonpCallback;
                        let call = window[jsonpCallback];
                        if (call) {
                            window[jsonpCallback] = function (v) {
                                if (v && v.data && v.data.replies && v.data.mode === 1) v.data.mode = 3;
                                if (v && v.data && v.data.upper && v.data.upper.top && v.data.upper.top.replies) BLOD.topReply = v.data.upper.top.replies;
                                if (BLOD.topReply && v.data && v.data.upper && v.data.upper.top && !v.data.upper.top.replies) v.data.upper.top.replies = BLOD.topReply;
                                BLOD.reset.setReplyFloor.init(v)
                                return call.call(this, v);
                            }
                        }
                    }
                }
            })
        }
        // 首页正在直播
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
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("首页推荐", ...e) }
        }
        // 修复番剧季度信息
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
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧季度信息", ...e) }
        }
        // 修复番剧追番信息
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
        // 修改直播数据
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
                debug.debug("XHR重定向", "拦截直播媒体", hook);
                Object.defineProperty(obj, 'response', { writable: true });
                Object.defineProperty(obj, 'responseText', { writable: true });
                obj.response = obj.responseText = JSON.stringify(response);
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("直播拦截", ...e) }
        }
        // 修改番剧推荐
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
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("番剧推荐", ...e) }
        }
        // 生成播放信息
        carousel(obj) {
            if (!config.reset.carousel) return;
            try {
                let msg = BLOD.randomArray([
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
        }
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
        // 监听视频地址
        playinfo(obj, url) {
            try {
                if (!obj.response) throw obj;
                BLOD.__playinfo__ = typeof obj.response == "object" ? obj.response : BLOD.jsonCheck(obj.response);
                // 未登录dash视频启用1080P
                let qn = BLOD.urlObj(url).qn;
                if (qn === 0 || qn > 32) {
                    if (BLOD.__playinfo__.data && BLOD.__playinfo__.data.dash && BLOD.__playinfo__.data.accept_quality && BLOD.__playinfo__.data.accept_quality[0] >= 80) {
                        BLOD.__playinfo__.data.quality = 80;
                        Object.defineProperty(obj, 'response', { writable: true });
                        Object.defineProperty(obj, 'responseText', { writable: true });
                        obj.response = BLOD.__playinfo__;
                        obj.responseText = JSON.stringify(BLOD.__playinfo__);
                    }
                }
                // 移除下载面板
                if (document.getElementById("bili-old-download-table")) document.getElementById("bili-old-download-table").remove();
            } catch (e) { e = Array.isArray(e) ? e : [e]; debug.error("视频监听", ...e) }
        }
    }

    let xhrHook = new Xhrhook();
    // 分别hook WebSocket、worker、XMLHttpRequest.open、XMLHttpRequest.send
    // jQuery的jsonp非原生对象，延时5s捕获到再hook
    // XMLHttpRequest.open主修复旧版各种失效接口只能常开
    if (config.reset.livechat) xhrHook.webSocket();
    if (config.reset.danmuku && Worker) xhrHook.worker();
    xhrHook.open();
    if (config.reset.xhrhook) xhrHook.send();

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
})()