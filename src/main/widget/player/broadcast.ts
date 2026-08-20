import type { Player } from "./index.js";
import { Any, AuthReq, BroadcastFrame, HeartbeatReq, MessageAckReq, RoomReq, RoomResp, TargetPath } from "../../../proto/broadcast.js";
import { DmSegMobileReply } from "../../../proto/DmSegMobileReply.js";
import { debug, error } from "../../../utils/debug.js";

export class Broadcast {
    #webSocket = new WebSocket('wss://broadcast.chat.bilibili.com:7826/sub', 'proto');
    #abortController = new AbortController();
    #disposableStack = new DisposableStack();
    #sequence = 0n;
    #authed = false;
    #heartbeat?: number;
    #cid = 0n;
    set cid(v: bigint) {
        this.#cid = v;
        this.#disposableStack.disposed || this.#disposableStack.dispose();
        this.#disposableStack = new DisposableStack();
        this.join();
    }
    #online?: number;
    constructor(private player: Player) {
        this.#webSocket.binaryType = 'arraybuffer';
        this.#webSocket.when('open').subscribe({ next: this.open }, { signal: this.#abortController.signal });
        this.#webSocket.when('message').subscribe({ next: this.message }, { signal: this.#abortController.signal });
        this.#webSocket.when('close').subscribe({ next: this.close }, { signal: this.#abortController.signal });
        this.#webSocket.when('error').subscribe({ next: this.error }, { signal: this.#abortController.signal });
    }
    private open = async () => {
        // 连接后必须第一时间鉴权
        this.send(PATH.AUTH, { typeUrl: PATH.AUTHREQ, value: AuthReq.encode({ guid: crypto.randomUUID() }).finish() });
    }
    private close = () => {
        this.#authed = false;
        this.#abortController.abort();
        clearInterval(this.#heartbeat);
    }
    private error = (e: Event) => {
        (<DOMException><unknown>e).name === 'AbortError' || error('[Broadcast]', e);
        this.#authed = false;
        this.#abortController.abort();
        clearInterval(this.#heartbeat);
    }
    private send(
        targetPath: PATH,
        body: Any,
    ) {
        if (this.#webSocket.readyState !== WebSocket.OPEN) return;
        this.#webSocket.send(BroadcastFrame.encode({ options: { sequence: ++this.#sequence }, targetPath, body }).finish());
    }
    private message = ({ data }: MessageEvent<ArrayBuffer>) => {
        const { options, targetPath, body } = BroadcastFrame.decode(new Uint8Array(data));
        // 处理自动应答 (ACK)
        if (options?.isAck) {
            this.send(PATH.MSG_ACK, { typeUrl: PATH.MSG_ACK_REQ, value: MessageAckReq.encode({ ackId: options.messageId!, ackOrigin: options.ackOrigin!, targetPath }).finish() });
        }
        // 根据路径分发处理
        switch (<PATH>targetPath) {
            case PATH.AUTH: {
                this.#authed = true;
                // 订阅
                this.subscribe();
                // 开启心跳
                clearInterval(this.#heartbeat);
                this.#heartbeat = setInterval(() => {
                    this.send(PATH.HEARTBEAT, { typeUrl: PATH.HEARTBEATRES, value: HeartbeatReq.encode({}).finish() });
                }, 2e4);
                // 进入房间
                this.join();
                break;
            }
            case PATH.ENTER: {
                if (!body) return;
                const { typeUrl, value } = body;
                const { id, event } = RoomResp.decode(value);
                switch (event?.$case) {
                    case 'online': {
                        this.player.online = event.value.online;
                        break;
                    }
                    default: {
                        debug('[Broadcast]', typeUrl, id, event);
                        break;
                    }
                }
                break;
            }
            case PATH.DANMAKU: {
                if (!body) return;
                const { typeUrl, value } = body;
                const { elems } = DmSegMobileReply.decode(value);
                debug('[Broadcast]', typeUrl, elems);
                this.player.danmaku.add(<any>elems);
                break;
            }
            case PATH.HEARTBEAT: {
                // 心跳无需任何处理
                break;
            }
            case PATH.SUBSCRIBE:
            case PATH.UNSUBSCRIBE:
            case PATH.MSG_ACK: {
                debug('[Broadcast]', targetPath);
                break
            }
            default: {
                debug('[Broadcast]', targetPath, body);
                break;
            }
        }
    }
    private subscribe() {
        // 订阅弹幕
        this.send(PATH.SUBSCRIBE, { typeUrl: PATH.TARGETPATH, value: TargetPath.encode({ targetPaths: [PATH.DANMAKU] }).finish() });
    }
    private async join() {
        if (!this.player.aid || !this.#cid || !this.#authed) return;

        // Bangumi 页面的实时弹幕貌似直接不维护了，这里直接目前简单地只使用 aid 和 cid 吧。
        const id = (this.player.season_id && this.player.ep_id) ? `video://${this.player.aid}/${this.#cid}?sid=${this.player.season_id}&epid=${this.player.ep_id}` : `video://${this.player.aid}/${this.#cid}`;

        this.send(PATH.ENTER, { typeUrl: PATH.ROOMREQ, value: RoomReq.encode({ id, event: { $case: 'join', value: {} } }).finish() });
        // 轮询在线人数
        clearInterval(this.#online);
        this.#online = setInterval(() => {
            this.send(PATH.ENTER, { typeUrl: PATH.ROOMREQ, value: RoomReq.encode({ id, event: { $case: 'online', value: {} } }).finish() });
        }, 2e4);
        this.#disposableStack.defer(() => {
            this.send(PATH.ENTER, { typeUrl: PATH.ROOMREQ, value: RoomReq.encode({ id, event: { $case: 'leave', value: {} } }).finish() });
            clearInterval(this.#online);
        });
    }
}

// 业务target_path
enum PATH {
    /** 进行鉴权 */
    AUTH = "/bilibili.broadcast.v1.Broadcast/Auth",
    /** 进行鉴权响应 */
    AUTHREQ = "type.googleapis.com/bilibili.broadcast.v1.AuthReq",
    /** 心跳发送（如果有上行消息可不进行发心跳 */
    HEARTBEAT = "/bilibili.broadcast.v1.Broadcast/Heartbeat",
    /** 心跳，响应 */
    HEARTBEATRES = "type.googleapis.com/bilibili.broadcast.v1.HeartbeatResp",
    /** 订阅target_paths，可以订阅到对应的消息 */
    SUBSCRIBE = "/bilibili.broadcast.v1.Broadcast/Subscribe",
    /** 订阅target_paths，响应 */
    TARGETPATH = "type.googleapis.com/bilibili.broadcast.v1.TargetPath",
    /** 取消订阅target_paths */
    UNSUBSCRIBE = "/bilibili.broadcast.v1.Broadcast/Unsubscribe",
    /** 如果消息is_ack=true，sdk收到后进行ack */
    MSG_ACK = "/bilibili.broadcast.v1.Broadcast/MessageAck",
    /** ack 响应 */
    MSG_ACK_REQ = "type.googleapis.com/bilibili.broadcast.v1.MessageAckReq",
    /** 进入房间 */
    ENTER = "/bilibili.broadcast.v1.BroadcastRoom/Enter",
    /** 进入房间请求 */
    ROOMREQ = "type.googleapis.com/bilibili.broadcast.v1.RoomReq",
    /** 进入房间响应 */
    ROOMRES = "type.googleapis.com/bilibili.broadcast.v1.RoomResp",

    /** 弹幕 */
    DANMAKU = 'bilibili.broadcast.message.main.DanmukuEvent',
}