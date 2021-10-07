/**
 * 本模块hook了WebSocket以修复旧版播放器的实时弹幕  
 * 告知：本模块由js强行any为ts版本，可能需要进一步优化
 */
(function () {
    try {
        let decoder = new TextDecoder();
        let encoder = new TextEncoder();
        let liveChatOld: any; // 对旧播放器建立的ws对象的引用
        let liveChat: any;
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
                liveChatOld.convertToArrayBuffer = function (body: any, option: any) {
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
        function mergeArrayBuffer(headerBuf: any, bodyBuf: any) {
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
                    "room_id": "video://" + API.aid + "/" + API.cid,
                    "platform": "web",
                    "accepts": [1000, 1015]
                };
                return this.send(this.convertToArrayBuffer(body, 7));
            }

            liveChat.onmessage = function (i: any) {
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
                                t.body.forEach(function (v: any) {
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
            liveChat.convertToArrayBuffer = function (body: any, option: any) {
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
            liveChat.convertToObject = function (i: any) {
                var e = new DataView(i), t: any = {};
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
                    for (var a = Pl.WS_PACKAGE_OFFSET, r = t.packetLen, n: any = "", l = ""; a < i.byteLength; a += r) {
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
            liveChat.parseDanmaku = function (i: any, e: any, t: any, a: any) {
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
    } catch (e) { toast.error("webSocket.js", e) }
})();