import { BLOD } from "../bilibili-old";
import { apiBiliplusPlayurl } from "../io/api-biliplus-playurl";
import { ApiGlobalOgvPlayurl } from "../io/api-global-ogv-playurl";
import { ApiAppPgcPlayurl, IPlayurlDash } from "../io/api-playurl";
import { uid } from "../utils/conf/uid";
import { debug } from "../utils/debug";
import { urlObj } from "../utils/format/url";
import { xhrHook, XMLHttpRequestOpenParams } from "../utils/hook/xhr";
import { Toast } from "./toast";

export const UPOS = {
    "ks3（金山）": "upos-sz-mirrorks3.bilivideo.com",
    "ks3b（金山）": "upos-sz-mirrorks3b.bilivideo.com",
    "ks3c（金山）": "upos-sz-mirrorks3c.bilivideo.com",
    "ks32（金山）": "upos-sz-mirrorks32.bilivideo.com",
    "kodo（七牛）": "upos-sz-mirrorkodo.bilivideo.com",
    "kodob（七牛）": "upos-sz-mirrorkodob.bilivideo.com",
    "cos（腾讯）": "upos-sz-mirrorcos.bilivideo.com",
    "cosb（腾讯）": "upos-sz-mirrorcosb.bilivideo.com",
    "coso1（腾讯）": "upos-sz-mirrorcoso1.bilivideo.com",
    "coso2（腾讯）": "upos-sz-mirrorcoso2.bilivideo.com",
    "bos（腾讯）": "upos-sz-mirrorbos.bilivideo.com",
    "hw（华为）": "upos-sz-mirrorhw.bilivideo.com",
    "hwb（华为）": "upos-sz-mirrorhwb.bilivideo.com",
    "uphw（华为）": "upos-sz-upcdnhw.bilivideo.com",
    "js（华为）": "upos-tf-all-js.bilivideo.com",
    "hk（香港）": "cn-hk-eq-bcache-01.bilivideo.com",
    "akamai（海外）": "upos-hz-mirrorakam.akamaized.net",
};
enum AREA {
    tw,
    hk,
    cn
}
export class VideoLimit {
    /** 数据备份 */
    protected Backup: Record<number, any> = {};
    /** 通知组件 */
    protected toast?: Toast;
    /** 通知信息 */
    protected data: any[] = [];
    /** 监听中 */
    protected listening = false;
    /** 播放数据备份 */
    __playinfo__: any;
    constructor(protected BLOD: BLOD) { }
    /** 开始监听 */
    enable() {
        if (this.listening) return;
        // 处理限制视频请求
        const disable = xhrHook.async('/playurl?', args => {
            const obj = urlObj(args[1]);
            this.updateVaribale(obj);
            return Boolean(this.BLOD.limit || this.BLOD.th)
        }, async (args) => {
            const response = this.BLOD.th ? await this._th(args) : await this._gat(args);
            return { response, responseType: 'json', responseText: JSON.stringify(response) }
        }, false);
        // 处理非限制视频请求
        xhrHook('/playurl?', args => {
            if (!uid && this.BLOD.status.show1080p && this.BLOD.status.accessKey.token) {
                args[1] += `&access_key=${this.BLOD.status.accessKey.token}`
            }
            return !(this.BLOD.limit || this.BLOD.th)
        }, res => {
            try {
                const result = res.responseType === 'json' ? JSON.stringify(res) : res.responseText!;
                if (this.BLOD.status.uposReplace.nor !== '不替换') {
                    const nstr = VideoLimit.uposReplace(result, <'ks3（金山）'>this.BLOD.status.uposReplace.nor);
                    this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.nor}`, `UPOS：${UPOS[<'ks3（金山）'>this.BLOD.status.uposReplace.nor]}`);
                    if (res.responseType === 'json') {
                        res.response = JSON.parse(nstr);
                    } else {
                        res.response = res.responseText = nstr;
                    }
                }
            } catch (e) { }
        }, false);
        this.disable = () => {
            disable();
            this.listening = false;
        }
        this.listening = true;
    }
    /** 处理泰区 */
    protected async _th(args: XMLHttpRequestOpenParams) {
        this.data = ['泰区限制视频！'];
        this.toast = this.BLOD.toast.toast(0, 'info', ...this.data);
        const obj = urlObj(args[1]);
        this.data.push(`aid：${this.BLOD.aid}`, `cid：${this.BLOD.cid}`);
        this.toast.data = this.data;
        const epid = <number>obj.ep_id || <number>obj.episodeId || this.BLOD.epid;
        obj.access_key = this.BLOD.status.accessKey.token;
        if (!this.Backup[epid]) {
            try {
                this.BLOD.networkMock();
                this.data.push(`代理服务器：${this.BLOD.status.videoLimit.th}`);
                this.toast.data = this.data;
                this.Backup[epid] = { code: 0, message: "success", result: await this.th(obj) };
                this.data.push('获取代理数据成功！');
                this.toast.data = this.data;
                this.toast.type = 'success';
            } catch (e) {
                this.data.push('代理出错！', <any>e);
                !obj.access_key && this.data.push('代理服务器要求【账户授权】才能进一步操作！');
                this.toast.data = this.data;
                this.toast.type = 'error';
                debug.error(...this.data);
                this.toast.delay = 4;
                delete this.toast;
                this.data = [];
                return { code: -404, message: e, data: null };
            }
        }
        this.toast.delay = 4;
        delete this.toast;
        this.data = [];
        return this.__playinfo__ = this.Backup[epid];
    }
    /** 处理港澳台 */
    protected async _gat(args: XMLHttpRequestOpenParams) {
        this.data = ['港澳台限制视频！'];
        this.toast = this.BLOD.toast.toast(0, 'info', ...this.data);
        const obj = urlObj(args[1]);
        this.data.push(`aid：${this.BLOD.aid}`, `cid：${this.BLOD.cid}`);
        this.toast.data = this.data;
        const epid = <number>obj.ep_id || <number>obj.episodeId || this.BLOD.epid;
        obj.access_key = this.BLOD.status.accessKey.token;
        if (!this.Backup[epid]) {
            try {
                if (this.BLOD.status.videoLimit.server === '内置') {
                    obj.module = 'bangumi';
                    const upInfo = (<any>window).__INITIAL_STATE__?.upInfo;
                    if (upInfo) {
                        (upInfo.mid == 1988098633 || upInfo.mid == 2042149112) && (obj.module = 'movie');
                    }
                    this.data.push(`代理服务器：内置`, `类型：${obj.module}`);
                    this.toast.data = this.data;
                    const res = await new apiBiliplusPlayurl(<any>obj).getData();
                    this.Backup[epid] = { code: 0, message: "success", result: res };
                } else {
                    this.BLOD.networkMock();
                    const res = await this.gat(obj);
                    this.Backup[epid] = { code: 0, message: "success", result: res };
                }
                if (this.BLOD.status.uposReplace.gat !== "不替换") {
                    this.Backup[epid] = JSON.parse(VideoLimit.uposReplace(JSON.stringify(this.Backup[epid]), <'ks3（金山）'>this.BLOD.status.uposReplace.gat));
                    this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.gat}`, `UPOS：${UPOS[<'ks3（金山）'>this.BLOD.status.uposReplace.gat]}`);
                };
                this.data.push('获取代理数据成功！');
                this.toast.data = this.data;
                this.toast.type = 'success';
            } catch (e) {
                this.data.push('代理出错！', <any>e);
                !obj.access_key && this.data.push('代理服务器要求【账户授权】才能进一步操作！');
                this.toast.data = this.data;
                this.toast.type = 'error';
                debug.error(...this.data);
                this.toast.delay = 4;
                delete this.toast;
                this.data = [];
                return { code: -404, message: e, data: null };
            }
        }
        this.toast.delay = 4;
        delete this.toast;
        this.data = [];
        return this.__playinfo__ = this.Backup[epid];
    }
    /** 停止监听 */
    disable() {
        this.listening = false;
    }
    /** 更新全局变量 */
    protected updateVaribale(obj: Record<string, string | number>) {
        obj.seasonId && (this.BLOD.ssid = <number>obj.seasonId);
        obj.episodeId && (this.BLOD.epid = <number>obj.episodeId);
        obj.ep_id && (this.BLOD.epid = <number>obj.ep_id);
        obj.aid && (this.BLOD.aid = Number(obj.aid)) && (this.BLOD.aid = <number>obj.aid);
        obj.avid && (this.BLOD.aid = Number(obj.avid)) && (this.BLOD.aid = <number>obj.avid);
        obj.cid && (this.BLOD.cid = Number(obj.cid)) && (this.BLOD.cid = <number>obj.cid);
    }
    /** 访问泰区代理 */
    protected async th(obj: Record<string, string | number>) {
        const d = await new ApiGlobalOgvPlayurl(<any>obj, <'ks3（金山）'>this.BLOD.status.uposReplace.th, this.BLOD.status.videoLimit.th).toPlayurl();
        this.BLOD.toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${this.BLOD.status.uposReplace.th}`, `UPOS：${UPOS[<'ks3（金山）'>this.BLOD.status.uposReplace.th]}`);
        return d;
    }
    /** 代理服务器序号 */
    protected area = 0;
    /** 访问港澳台代理 */
    protected async gat(obj: Record<string, string | number>): Promise<IPlayurlDash> {
        if (!this.BLOD.status.videoLimit[<'tw'>AREA[this.area]]) throw new Error(`无有效代理服务器：${AREA[this.area]}`);
        const server = this.BLOD.status.videoLimit[<'tw'>AREA[this.area]];
        obj.area = AREA[this.area];
        this.data.push(`代理服务器：${server}`);
        this.toast && (this.toast.data = this.data);
        try {
            return await new ApiAppPgcPlayurl(<any>obj, server).getData();
        } catch (e) {
            this.data.push('代理服务器返回异常！', e);
            if (this.toast) {
                this.toast.data = this.data;
                this.toast.type = 'warning';
            }
            this.area++;
            if (this.area > 2)
                throw new Error('代理服务器不可用！');
            return await this.gat(obj);
        }
    }
    /** 用于过滤upos提示 */
    protected static upos = false;
    /** 用于取消过滤upos提示 */
    protected static timer?: number;
    /**
     * 替换upos服务器
     * @param str playurl或包含视频URL的字符串
     * @param uposName 替换的代理服务器名 keyof typeof {@link UPOS}
     */
    static uposReplace(str: string, uposName: keyof typeof UPOS | "不替换") {
        if (uposName === "不替换") return str;
        this.upos = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.upos = false, 1e3);
        return str.replace(/:\\?\/\\?\/[^\/]+\\?\//g, () => `://${UPOS[uposName]}/`);
    }
}