interface modules {
    /** 修复旧版播放器实时弹幕 */
    readonly "webSocket.js": string;
}
namespace API {
    const protobufJSON = '{"nested":{"bilibili":{"nested":{"broadcast":{"nested":{"v1":{"nested":{"AuthReq":{"fields":{"guid":{"type":"string","id":1},"connId":{"type":"string","id":2},"lastMsgId":{"type":"int64","id":3}}},"AuthResp":{"fields":{}},"HeartbeatReq":{"fields":{}},"HeartbeatResp":{"fields":{}},"TargetPath":{"fields":{"targetPaths":{"rule":"repeated","type":"string","id":1}}},"MessageAckReq":{"fields":{"ackId":{"type":"int64","id":1},"ackOrigin":{"type":"string","id":2},"targetPath":{"type":"string","id":3}}},"Subscribe":{"fields":{"type":{"type":"string","id":1},"targetPaths":{"rule":"repeated","type":"string","id":2}}},"Status":{"fields":{"code":{"type":"int32","id":1},"message":{"type":"string","id":2},"details":{"rule":"repeated","type":"google.protobuf.Any","id":3}}},"FrameOption":{"fields":{"messageId":{"type":"int64","id":1},"sequence":{"type":"int64","id":2},"isAck":{"type":"bool","id":3},"status":{"type":"Status","id":4},"ackOrigin":{"type":"string","id":5}}},"BroadcastFrame":{"fields":{"options":{"type":"FrameOption","id":1},"targetPath":{"type":"string","id":2},"body":{"type":"google.protobuf.Any","id":3}}},"RoomJoinEvent":{"fields":{}},"RoomLeaveEvent":{"fields":{}},"RoomOnlineEvent":{"fields":{"online":{"type":"int32","id":1},"allOnline":{"type":"int32","id":2}}},"RoomMessageEvent":{"fields":{"targetPath":{"type":"string","id":1},"body":{"type":"google.protobuf.Any","id":2}}},"RoomErrorEvent":{"fields":{"status":{"type":"Status","id":1}}},"RoomReq":{"oneofs":{"event":{"oneof":["join","leave","online","msg"]}},"fields":{"id":{"type":"string","id":1},"join":{"type":"RoomJoinEvent","id":2},"leave":{"type":"RoomLeaveEvent","id":3},"online":{"type":"RoomOnlineEvent","id":4},"msg":{"type":"RoomMessageEvent","id":5}}},"RoomResp":{"oneofs":{"event":{"oneof":["join","leave","online","msg","err"]}},"fields":{"id":{"type":"string","id":1},"join":{"type":"RoomJoinEvent","id":2},"leave":{"type":"RoomLeaveEvent","id":3},"online":{"type":"RoomOnlineEvent","id":4},"msg":{"type":"RoomMessageEvent","id":5},"err":{"type":"RoomErrorEvent","id":6}}}}}}}}},"google":{"nested":{"protobuf":{"nested":{"Any":{"fields":{"type_url":{"type":"string","id":1},"value":{"type":"bytes","id":2}}},"Empty":{"fields":{}}}}}}}}';
    const danmakuJSON = '{"nested":{"bilibili":{"nested":{"broadcast":{"nested":{"message":{"nested":{"main":{"nested":{"DanmakuElem":{"fields":{"id":{"type":"int64","id":1},"progress":{"type":"int32","id":2},"mode":{"type":"int32","id":3},"fontsize":{"type":"int32","id":4},"color":{"type":"uint32","id":5},"midHash":{"type":"string","id":6},"content":{"type":"string","id":7},"ctime":{"type":"int64","id":8},"action":{"type":"string","id":9},"pool":{"type":"int32","id":10},"idStr":{"type":"string","id":11}}},"DanmukuEvent":{"fields":{"elems":{"rule":"repeated","type":"DanmakuElem","id":1}}}}}}}}}}}}}';
    (<any>window).protobuf || new Function(GM.getResourceText("protobuf.js"))();
    const root = (<any>window).protobuf.Root.fromJSON(JSON.parse(protobufJSON));
    const danmakuElem = (<any>window).protobuf.Root.fromJSON(JSON.parse(danmakuJSON)).lookupType("bilibili.broadcast.message.main.DanmukuEvent");
    let sequence = 1;
    const message = {
        msgType: root.lookupType("BroadcastFrame"),
        targetPathType: root.lookupType("TargetPath"),
        beatReqType: root.lookupType("HeartbeatReq"),
        ackReqType: root.lookupType("MessageAckReq"),
        anyType: root.lookupType("google.protobuf.Any"),
        roomRequest: root.lookupType("RoomReq"),
        roomResp: root.lookupType("RoomResp"),
        roomEvents: {
            join: root.lookupType("RoomJoinEvent"),
            leave: root.lookupType("RoomLeaveEvent"),
            online: root.lookupType("RoomOnlineEvent")
        }
    }
    const targetPath = {
        "AUTH": "/bilibili.broadcast.v1.Broadcast/Auth",
        "HEARTBEAT": "/bilibili.broadcast.v1.Broadcast/Heartbeat",
        "SUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Subscribe",
        "UNSUBSCRIBE": "/bilibili.broadcast.v1.Broadcast/Unsubscribe",
        "MSG_ACK": "/bilibili.broadcast.v1.Broadcast/MessageAck",
        "ENTER": "/bilibili.broadcast.v1.BroadcastRoom/Enter",
        "ROOMREQ": "/bilibili.broadcast.v1.RoomReq",
        "ROOMRES": "/bilibili.broadcast.v1.RoomResp",
        "AUTHREQ": "/bilibili.broadcast.v1.AuthReq",
        "TARGETPATH": "/bilibili.broadcast.v1.TargetPath",
        "HEARTBEATRES": "/bilibili.broadcast.v1.HeartbeatResp",
        "MSG_ACK_REQ": "/bilibili.broadcast.v1.MessageAckReq"
    }
    const utils = {
        encodeAny: function (body: any, encoder: any, url: string) {
            return url = "type.googleapis.com" + url,
                message.anyType.create({
                    type_url: url,
                    value: encoder.encode(body).finish()
                })
        },
        toBuffer: function (body: any, encoder: any) {
            if (encoder.verify(body))
                return "";
            let t = encoder.create(body);
            return encoder.encode(t).finish();
        },
        toMsg: function (body: any, decoder: any) {
            let t;
            try {
                t = decoder.toObject(decoder.decode(new Uint8Array(body)))
            } catch (i) {
                debug.error(i)
            }
            return t;
        }
    }

    let encoder = new TextEncoder();
    let liveChatOld: any; // 对旧播放器建立的ws对象的引用
    let liveChat: any;
    // 为了获取ws对象的引用,hook WebSocket.send
    let wsHookRunOnce = true;
    const wssend = WebSocket.prototype.send;

    WebSocket.prototype.send = function (...arg) {
        if (wsHookRunOnce && this.url == 'wss://broadcast.chat.bilibili.com:4095/sub') {
            liveChatOld = this;
            // convertToArrayBuffer 编码一个旧播放器接受的数据包
            liveChatOld.convertToArrayBuffer = function (body: any, option: any) {
                let header = [{ "name": "Header Length", "key": "headerLen", "qg": 2, "offset": 4, "value": 16 }, { "name": "Protocol Version", "key": "ver", "qg": 2, "offset": 6, "value": 1 }, { "name": "Operation", "key": "op", "qg": 4, "offset": 8, "value": option }, { "name": "Sequence Id", "key": "seq", "qg": 4, "offset": 12, "value": 1 }];
                let headerBuf = new ArrayBuffer(16);
                let viewer = new DataView(headerBuf, 0);
                let bodyBuf = encoder.encode(JSON.stringify(body));
                viewer.setInt32(0, 16 + bodyBuf.byteLength);
                header.forEach(function (b) {
                    4 === b.qg ? viewer.setInt32(b.offset, b.value) : 2 === b.qg && viewer.setInt16(b.offset, b.value)
                })
                function mergeArrayBuffer(headerBuf: any, bodyBuf: any) {
                    headerBuf = new Uint8Array(headerBuf);
                    bodyBuf = new Uint8Array(bodyBuf);
                    var d = new Uint8Array(headerBuf.byteLength + bodyBuf.byteLength);
                    d.set(headerBuf, 0);
                    d.set(bodyBuf, headerBuf.byteLength);
                    return d.buffer;
                }
                return mergeArrayBuffer(headerBuf, bodyBuf);
            }
            // 切p和掉线之后需要重新启动hook,获得新的引用
            let onclose = liveChatOld.onclose;
            liveChatOld.onclose = function () {
                wsHookRunOnce = true;
                clearTimeout(liveChat.beatTimer);
                liveChat.close();
                onclose.call(this);
            }
            wsHookRunOnce = false;
            initLiveChat();
        }
        wssend.call(this, ...arg);
    }

    // onopen() -> auth() -> onmessage() -> onAuthed() -> subscribeBase() -> roomBase() -> 开始接收实时弹幕
    function initLiveChat() {
        liveChat = new WebSocket("wss://broadcast.chat.bilibili.com:7826/sub?platform=web", "proto");
        liveChat.binaryType = "arraybuffer";
        liveChat.beatTimer = 0;
        liveChat.msgFlag = {};
        liveChat.socketKey = "video://" + API.aid + "/" + API.cid;
        API.pgc && (liveChat.socketKey += "?sid=" + __INITIAL_STATE__.ssId + "&epid=" + __INITIAL_STATE__.epId);

        liveChat.sendMsg = function (body: any, encoder: any) {
            void 0 === encoder && (encoder = message.msgType)
            this.send(utils.toBuffer(body, encoder));
        }

        liveChat.auth = function () {
            this.sendMsg({
                options: {
                    sequence: ++sequence
                },
                targetPath: targetPath.AUTH,
                body: utils.encodeAny(message.anyType.create({}), message.anyType, targetPath.AUTHREQ)
            });
        }

        liveChat.onAuthed = function (t: any) {
            this.authed = !0;
            this.subscribeBase(["bilibili.broadcast.message.main.DanmukuEvent"]);
            this.roomBase(liveChat.socketKey);
        }

        liveChat.subscribeBase = function (t: any, e: any) {
            if (void 0 === e && (e = !0),
                t && t.length) {
                var i = ++sequence;
                this.msgFlag[i] = t,
                    this.sendMsg({
                        options: {
                            sequence: i
                        },
                        targetPath: e ? targetPath.SUBSCRIBE : targetPath.UNSUBSCRIBE,
                        body: utils.encodeAny(message.targetPathType.create({
                            targetPaths: t
                        }), message.targetPathType, targetPath.TARGETPATH)
                    })
            }
        }

        liveChat.roomBase = function (t: any) {
            let event = {
                id: t,
                join: message.roomEvents.join.create({})
            }
            var i = ++sequence;
            this.msgFlag[i] = t,
                this.sendMsg({
                    options: {
                        sequence: i
                    },
                    targetPath: targetPath.ENTER,
                    body: utils.encodeAny(message.roomRequest.create(event), message.roomRequest, targetPath.ROOMREQ)
                })
        }

        liveChat.onRoomMsg = function (t: any) {
            var e, i;
            if (null === (e = t.body) || void 0 === e ? void 0 : e.value) {
                var o = utils.toMsg(t.body.value, message.roomResp);
                if (null === (i = o.msg) || void 0 === i ? void 0 : i.targetPath) {
                    var r = utils.toMsg(o.msg.body.value, danmakuElem);
                    r.elems.forEach(function (v: danmakuNew) {
                        liveChatOld.onmessage({
                            data: liveChatOld.convertToArrayBuffer({
                                cmd: 'DM',
                                info: [[v.progress / 1000, v.mode, v.fontsize, v.color, v.ctime, "", v.pool, v.midHash, v.idStr].join(","), v.content]
                            }, 5)
                        });

                    });
                }
            }
        }

        liveChat.heartBeat = function () {
            var i = this;
            this.beatTimer && clearTimeout(this.beatTimer);
            this.beatTimer = window.setTimeout((function () {
                if (i.readyState === 1) {
                    i.sendMsg({
                        options: {
                            sequence: ++sequence
                        },
                        targetPath: targetPath.HEARTBEAT,
                        body: utils.encodeAny(message.beatReqType.create({}), message.beatReqType, targetPath.HEARTBEATRES)
                    })
                    i.heartBeat();
                }
            }), 1e3 * 20);
        }

        liveChat.onopen = function () {
            this.auth();
        }

        liveChat.onclose = function () {
            if (liveChatOld.readyState === 1) {
                // 在番剧页面，每6分钟弹幕服务器（即使在用心跳包维持连接活跃的情况下）会主动断开连接，这时需要重连
                initLiveChat();
            } else {
                this.beatTimer && clearTimeout(this.beatTimer);
            }
        }

        liveChat.onmessage = function (i: any) {
            var t, a = utils.toMsg(i.data, message.msgType);
            if (this.heartBeat(), a) {
                if (null == a ? void 0 : a.targetPath)
                    switch (a.targetPath) {
                        case targetPath.AUTH:
                            this.onAuthed(a);
                            break;
                        case targetPath.SUBSCRIBE:
                            //this.onSubscribed(a);
                            break;
                        case targetPath.UNSUBSCRIBE:
                            //this.onUnSubscribed(a);
                            break;
                        case targetPath.HEARTBEAT:
                            //this.bsocket.emit(zd.B_HEARTBEAT, a);
                            break;
                        case targetPath.ENTER:
                            this.onRoomMsg(a);
                            break;
                        default:
                        //this.bsocket.emit(zd.B_MSG, a)
                    }
                delete this.msgFlag[null === (t = a.options) || void 0 === t ? void 0 : t.sequence]
            }
        }
    }
}