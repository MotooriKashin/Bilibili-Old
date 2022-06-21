import { debug } from "../debug";
import { pushDownload } from "../download/download";
import { integerFormat } from "../format/integer";
import { timeFormat } from "../format/time";
import { unitFormat } from "../format/unit";
import { objUrl } from "../format/url";
import { setting } from "../setting";
import { storage } from "../storage";
import { toast } from "../toast/toast";
import { jsonCheck } from "../unit";
import { uid } from "../variable/uid";
import { xhr } from "../xhr";
import { danmaku, danmakuNew } from "./danmaku";

class AllDanmaku {
    pubdate: any; // 视频发布时间
    today: any; // 当天
    time: any; // 备份
    arrP: any; // 备份
    danmaku: any[] = [];
    arrT: any; // 临时变量
    timeT: any; // 临时变量
    float: ReturnType<typeof toast>; // 通知组件
    note: ReturnType<typeof toast>; // 通知组件
    constructor() {
        this.note = toast.custom(0, "info", "冷却延时请尽量调大，以免短时间内大量请求被临时封端口！");
        this.float = toast.custom(0, "info", "正在尝试获取全部弹幕请耐心等待。。。");
        xhr({
            url: `https://api.bilibili.com/x/web-interface/view?aid=${(<any>window).aid}`,
            responseType: "json",
            credentials: true
        }, true).then(d => {
            this.pubdate = d.data.pubdate;
            this.pubdate = timeFormat(this.pubdate * 1000, true).split(" ")[0]; // 视频上传日期
            this.today = timeFormat(undefined, true).split(" ")[0]; // 当天日期
            this.time = this.today;
            this.arrP = this.pubdate.split("-");
            this.danmaku = [];
            if (this.pubdate) {
                this.arrT = this.time.split("-");
                this.check();
            } else {
                return Promise.reject("获取视频上传日期数据失败，已停止~");
            }
        }).catch(e => {
            this.floatChange("error", ["获取全弹幕失败，已停止~"], 3);
            this.noteChange("error", ["ಥ_ಥ"], 3);
            debug.error("全弹幕装填", e);
        })
        this.pubdate = new Date(2009, 0);
    }
    floatChange(type: "" | "success" | "error" | "info" | "warning", data: string[], delay?: number) {
        if (this.float) {
            this.float.type = type;
            this.float.data = data;
            (delay !== undefined) && (this.float.delay = delay);
        }
        switch (type) {
            case "error": debug.error(...data);
                break;
            case "success": debug.log(...data);
                break;
            case "info": debug.log(...data);
                break;
            case "warning": debug.warn(...data);
                break;
        }
    }
    noteChange(type: "" | "success" | "error" | "info" | "warning", data: string[], delay?: number) {
        if (this.note) {
            this.note.type = type;
            data.forEach(d => {
                if ((<any>this).note.data.length >= 20) this.note?.data.shift();
                this.note?.data.push(d);
            });
            (delay !== undefined) && (this.note.delay = delay);
        }
        switch (type) {
            case "error": debug.error(...data);
                break;
            case "success": debug.log(...data);
                break;
            case "info": debug.log(...data);
                break;
            case "warning": debug.warn(...data);
                break;
        }
    }
    async init() {
        try {
            // 获取当日日期
            this.arrT = this.time.split("-");
            // 如果年份小于投稿日，说明获取成功
            if (this.arrT[0] < this.arrP[0]) return this.done(1);
            // 年份相等但月份小于投稿日说明获取成功
            if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
            // 年月都相等，但日期小于投稿日说明获取成功
            if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
            // 日期未早于投稿日，正常请求日期数据
            this.noteChange("info", ["正在获取 " + this.time + " 日的弹幕。。。"]);
            let Dm = <danmakuNew[]>await danmaku.getHistoryDanmaku(this.time);
            danmaku.sortDmById(Dm, "idStr");
            Dm.reverse();
            // 取最早一条弹幕的时间
            this.time = timeFormat(Dm[Dm.length - 1].ctime * 1000, true).split(" ")[0];
            this.danmaku = this.danmaku.concat(Dm);
            this.floatChange("success", ["数据返回！已获取弹幕数：" + unitFormat(this.danmaku.length)]);
            this.arrT = this.time.split("-");
            // 如果当天不是投稿日，转入日期检查
            if (this.pubdate != this.today) return this.check();
            // 否则结束弹幕获取，当前弹幕就是能获取到的全弹幕
            this.done(1);
        } catch (e) {
            debug.error("全弹幕装填", e);
            // 弹幕获取出错，载入已获取的弹幕
            if (this.danmaku[0]) {
                this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
                this.done();
            } else {
                this.floatChange("error", ["弹幕获取出错！", "已退出！"], 3);
                this.noteChange("error", ["ಥ_ಥ"], 3);
            }
        }
    }
    /**
     * 按月份判断有弹幕时间
     * @returns 调用获取日期弹幕或者循环月份判断
     */
    async check() {
        try {
            // 如果年份小于投稿日，说明获取成功
            if (this.arrT[0] < this.arrP[0]) return this.done(1);
            // 年份相等但月份小于投稿日说明获取成功
            if (this.arrT[0] == this.arrP[0] && this.arrT[1] < this.arrP[1]) return this.done(1);
            // 年月都相等，但日期小于投稿日说明获取成功
            if (this.arrT[0] == this.arrP[0] && this.arrT[1] == this.arrP[1] && this.arrT[2] < this.arrP[2]) return this.done(1);
            // 日期未早于投稿日，正常请求月份数据
            let data = await xhr({
                url: objUrl("https://api.bilibili.com/x/v2/dm/history/index", {
                    type: <any>1,
                    oid: (<any>window).cid,
                    month: this.arrT.slice(0, 2).join("-")
                }),
                credentials: true
            })
            data = jsonCheck(data).data;
            if (data && data[0]) {
                // 当月有弹幕，进入日期判断
                for (let i = data.length - 1; i >= 0; i--) {
                    let date = data[i].split("-");
                    if (date[2] < this.arrT[2]) {
                        // 当日在已获取弹幕之前，记录并跳出循环
                        this.timeT = data[i];
                        break;
                    }
                }
                if (this.timeT) {
                    // 延时转入日期请求
                    this.time = this.timeT;
                    this.timeT = undefined;
                    this.noteChange("info", [`技能冷却中。。。请稍待 ${setting.allDanmaku} 秒钟`]);
                    return setTimeout(() => this.init(), setting.allDanmaku * 1000);
                } else {
                    // 当月有弹幕但都不在已请求日之前，月份 -1 重载
                    if (this.arrT[1] > 1) {
                        this.arrT[1]--;
                        this.arrT[1] = integerFormat(this.arrT[1], 2);
                    }
                    else this.arrT = [this.arrT[0] - 1, 12, 31];
                    this.noteChange("info", [`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${setting.allDanmaku} 秒钟`]);
                    return setTimeout(() => this.check(), setting.allDanmaku * 1000);
                }
            } else {
                // 当月无弹幕直接月份 -1 重载，月份等于 1 则取上年最后一天
                if (this.arrT[1] > 1) {
                    this.arrT[1]--;
                    if (this.arrT[1] < 10) this.arrT[1] = integerFormat(this.arrT[1], 2);
                } else this.arrT = [this.arrT[0] - 1, 12, 31];
                this.noteChange("info", [`获取前一个月数据 ${this.arrT.slice(0, 2).join("-")} 请稍待 ${setting.allDanmaku} 秒钟`]);
                return setTimeout(() => this.check(), setting.allDanmaku * 1000);
            }
        } catch (e) {
            e = Array.isArray(e) ? e : [e];
            debug.error("全弹幕装填", e);
            // 弹幕获取出错，载入已获取的弹幕
            if (this.danmaku[0]) {
                this.floatChange("warning", ["弹幕获取出错！", "保留并载入已获取的弹幕"]);
                this.done();
            } else {
                this.floatChange("error", ["弹幕获取出错！", "已退出！"]);
                this.noteChange("error", ["ಥ_ಥ"], 3);
            }
        }
    }
    /**
     * 载入弹幕
     * @param boolean 判断获取成功还是失败，成功请传入真值。
     */
    async done(boolean?: any) {
        try {
            // 历史弹幕里不包含代码弹幕必须额外处理
            this.noteChange("info", ["正在获取BAS/代码弹幕专包。。。"]);
            this.danmaku = this.danmaku.concat(await danmaku.specialDms());
        } catch (e) { }
        let Dm = danmaku.danmakuFormat(this.danmaku);
        if (boolean) {
            this.floatChange("success", ["全弹幕获取成功，正在装填。。。", "总弹幕量：" + unitFormat(this.danmaku.length), "同时推送至下载面板，可右键保存 π_π"], 3);
        }
        this.noteChange("info", ["执行结束~"], 3);
        (<any>window).player?.setDanmaku(Dm);
        setting.downloadOther && pushDownload({
            group: "弹幕",
            data: Dm,
            up: "全弹幕",
            down: `N/A`,
            callback: () => danmaku.saveDanmaku(Dm, `[全弹幕]${storage.ss.getItem("title") || (<any>window).cid}`)
        });
    }
}
/** 全弹幕装填 */
export function allDanmaku() {
    if (!uid) return toast.warning("请登录后使用 ಥ_ಥ")
    if (!(<any>window).player) return toast.warning("请在播放页面使用本功能 →_→");
    if (!(<any>window).player.setDanmaku) return toast.warning("内部组件丢失！", "请检查【托管原生脚本】功能是否开启！");
    new AllDanmaku()
}