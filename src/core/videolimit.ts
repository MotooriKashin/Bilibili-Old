import { apiBiliplusPlayurl } from "../io/api-biliplus-playurl";
import { ApiGlobalOgvPlayurl } from "../io/api-global-ogv-playurl";
import { apiPlayurl, IPlayurlDash } from "../io/api-playurl";
import { fnval } from "../io/fnval";
import { uid } from "../utils/conf/uid";
import { objUrl, urlObj } from "../utils/format/url";
import { xhrHook, XMLHttpRequestOpenParams } from "../utils/hook/xhr";
import { BLOD } from "./bilibili-old";
import { networkMock } from "./network-mock";
import { toast, Toast } from "./toast";
import { user } from "./user";

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
class VideoLimit {
    /** 数据备份 */
    protected Backup: Record<string, any> = {};
    /** 通知组件 */
    protected toast?: Toast;
    /** 监听中 */
    protected listening = false;
    /** 播放数据备份 */
    __playinfo__: any;
    constructor() {
        // 处理非限制视频请求
        xhrHook('/playurl?', args => {
            const param = urlObj(args[1]);
            if (!uid && user.userStatus!.show1080p && user.userStatus!.accessKey.token) {
                param.appkey = "27eb53fc9058f8c3";
                param.access_key = user.userStatus!.accessKey.token; // 不登录高画质
            }
            param.fnval && (param.fnval = fnval); // 画质提升
            args[1] = objUrl(args[1], param);
            return !(BLOD.limit || BLOD.th)
        }, res => {
            try {
                const result = res.responseType === 'json' ? JSON.stringify(res) : res.responseText!;
                if (user.userStatus!.uposReplace.nor !== '不替换') {
                    const nstr = this.uposReplace(result, <'ks3（金山）'>user.userStatus!.uposReplace.nor);
                    toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${user.userStatus!.uposReplace.nor}`, `UPOS：${UPOS[<'ks3（金山）'>user.userStatus!.uposReplace.nor]}`);
                    if (res.responseType === 'json') {
                        res.response = JSON.parse(nstr);
                    } else {
                        res.response = res.responseText = nstr;
                    }
                }
            } catch (e) { }
        }, false);
    }
    /** 开始监听 */
    enable() {
        if (this.listening) return;
        // 处理限制视频请求
        const disable = xhrHook.async('/playurl?', args => {
            const obj = urlObj(args[1]);
            this.updateVaribale(obj);
            return Boolean(BLOD.limit || BLOD.th)
        }, async (args) => {
            const response = BLOD.th ? await this._th(args) : await this._gat(args);
            return { response, responseType: 'json', responseText: JSON.stringify(response) }
        }, false);
        this.disable = () => {
            disable();
            this.listening = false;
        }
        this.listening = true;
    }
    /** 处理泰区 */
    protected async _th(args: XMLHttpRequestOpenParams) {
        this.toast || (this.toast = toast.list());
        this.toast.data = ['泰区限制视频 >>>'];
        const obj = urlObj(args[1]);
        this.toast.push(`> aid：${BLOD.aid}`, `> cid：${BLOD.cid}`);
        obj.access_key = user.userStatus!.accessKey.token;
        if (!this.Backup[args[1]]) {
            try {
                networkMock();
                this.toast.push(`> 代理服务器：${user.userStatus!.videoLimit.th}`);
                this.Backup[args[1]] = { code: 0, message: "success", result: await this.th(obj) };
                this.toast.push('> 获取代理数据成功！');
                this.toast.type = 'success';
            } catch (e) {
                this.toast.push('> 代理出错！', <any>e);
                !obj.access_key && this.toast.push('> 代理服务器要求【账户授权】才能进一步操作！');
                this.toast.type = 'error';
                this.toast.delay = 4;
                return { code: -404, message: e, data: null };
            }
        }
        this.toast.delay = 4;
        delete this.toast;
        return this.__playinfo__ = this.Backup[args[1]];
    }
    /** 处理港澳台 */
    protected async _gat(args: XMLHttpRequestOpenParams) {
        this.toast || (this.toast = toast.list());
        this.toast.data = ['港澳台限制视频 >>>'];
        const obj = urlObj(args[1]);
        this.toast.push(`> aid：${BLOD.aid}`, `> cid：${BLOD.cid}`);
        obj.access_key = user.userStatus!.accessKey.token;
        if (!this.Backup[args[1]]) {
            try {
                if (user.userStatus!.videoLimit.server === '内置') {
                    obj.module = 'bangumi';
                    const upInfo = (<any>window).__INITIAL_STATE__?.upInfo;
                    if (upInfo) {
                        (upInfo.mid == 1988098633 || upInfo.mid == 2042149112) && (obj.module = 'movie');
                    }
                    this.toast.push(`> 代理服务器：内置`, `> 类型：${obj.module}`);
                    const res = await apiBiliplusPlayurl(<any>obj);
                    this.Backup[args[1]] = { code: 0, message: "success", result: res };
                } else {
                    // networkMock();
                    const res = await this.gat(obj);
                    this.Backup[args[1]] = { code: 0, message: "success", result: res };
                }
                if (user.userStatus!.uposReplace.gat !== "不替换") {
                    this.Backup[args[1]] = JSON.parse(this.uposReplace(JSON.stringify(this.Backup[args[1]]), <'ks3（金山）'>user.userStatus!.uposReplace.gat));
                    toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${user.userStatus!.uposReplace.gat}`, `UPOS：${UPOS[<'ks3（金山）'>user.userStatus!.uposReplace.gat]}`);
                };
                this.toast.push('> 获取代理数据成功！');
                this.toast.type = 'success';
            } catch (e) {
                this.toast.push('> 代理出错！', <any>e);
                !obj.access_key && this.toast.push('> 代理服务器要求【账户授权】才能进一步操作！');
                this.toast.type = 'error';
                this.toast.delay = 4;
                return { code: -404, message: e, data: null };
            }
        }
        this.toast.delay = 4;
        delete this.toast;
        return this.__playinfo__ = this.Backup[args[1]];
    }
    /** 停止监听 */
    disable() {
        this.listening = false;
    }
    /** 更新全局变量 */
    protected updateVaribale(obj: Record<string, string | number>) {
        obj.seasonId && (BLOD.ssid = <number>obj.seasonId);
        obj.episodeId && (BLOD.epid = <number>obj.episodeId);
        obj.ep_id && (BLOD.epid = <number>obj.ep_id);
        obj.aid && (BLOD.aid = Number(obj.aid)) && (BLOD.aid = <number>obj.aid);
        obj.avid && (BLOD.aid = Number(obj.avid)) && (BLOD.aid = <number>obj.avid);
        obj.cid && (BLOD.cid = Number(obj.cid)) && (BLOD.cid = <number>obj.cid);
    }
    /** 访问泰区代理 */
    protected async th(obj: Record<string, string | number>) {
        const d = await new ApiGlobalOgvPlayurl(<any>obj, user.userStatus!.videoLimit.th).toPlayurl();
        toast.warning("已替换UPOS服务器，卡加载时请到设置中更换服务器或者禁用！", `CDN：${user.userStatus!.uposReplace.th}`, `UPOS：${UPOS[<'ks3（金山）'>user.userStatus!.uposReplace.th]}`);
        return JSON.parse(this.uposReplace(JSON.stringify(d), <'ks3（金山）'>user.userStatus!.uposReplace.th));
    }
    /** 代理服务器序号 */
    protected area = 0;
    /** 访问港澳台代理 */
    protected async gat(obj: Record<string, string | number>): Promise<IPlayurlDash> {
        this.toast || (this.toast = toast.list());
        if (!user.userStatus!.videoLimit[<'tw'>AREA[this.area]]) throw new Error(`无有效代理服务器：${AREA[this.area]}`);
        const server = user.userStatus!.videoLimit[<'tw'>AREA[this.area]];
        obj.area = AREA[this.area];
        this.toast.push(`> 代理服务器：${server}`);
        try {
            // return await new ApiAppPgcPlayurl(<any>obj, server).getData();
            return <IPlayurlDash>await apiPlayurl(<any>obj, true, true, server);
        } catch (e) {
            this.toast.push('> 代理服务器返回异常！', e);
            if (this.toast) {
                this.toast.type = 'warning';
            }
            this.area++;
            if (this.area > 2)
                throw new Error('代理服务器不可用！');
            return await this.gat(obj);
        }
    }
    /** 用于过滤upos提示 */
    protected upos = false;
    /** 用于取消过滤upos提示 */
    protected timer?: number;
    /**
     * 替换upos服务器
     * @param str playurl或包含视频URL的字符串
     * @param uposName 替换的代理服务器名 keyof typeof {@link UPOS}
     */
    protected uposReplace(str: string, uposName: keyof typeof UPOS | "不替换") {
        if (uposName === "不替换") return str;
        this.upos = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.upos = false, 1e3);
        return str.replace(/:\\?\/\\?\/[^\/]+\\?\//g, () => `://${UPOS[uposName]}/`);
    }
}
/** 播放限制组件 */
export const videoLimit = new VideoLimit();