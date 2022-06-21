import { chromeCookies, cookiesArr2Obj } from "../include/cookie";
import { debug } from "../runtime/debug";
import { showAlert } from "../runtime/element/alert";
import { timeFormat } from "../runtime/format/time";
import { urlObj } from "../runtime/format/url";
import { urlsign } from "../runtime/lib/sign";
import { storage } from "../runtime/storage";
import { toast } from "../runtime/toast/toast";

export class AccessKey {
    /** 设置栈 */
    setting: Record<string, any> = {};
    constructor() {
        location.hash = "accessKey";
        chromeCookies("bilibili.com").then(d => {
            const uid = cookiesArr2Obj(d).DedeUserID;
            if (!uid) {
                toast.warning("请先到B站网页端登录！");
            } else {
                this.setting = storage.ss.getItem("setting");
                let arr: any = [];
                if (this.setting.accessKey.key) {
                    arr = [
                        {
                            name: "刷新授权",
                            callback: () => { this.get() }
                        },
                        {
                            name: "撤销授权",
                            callback: () => { this.remove() }
                        },
                        {
                            name: "取消操作",
                            callback: () => { }
                        }
                    ];
                } else {
                    arr = [
                        {
                            name: "立即授权",
                            callback: () => { this.get() }
                        },
                        {
                            name: "取消操作",
                            callback: () => { }
                        }
                    ];
                }
                showAlert('【账户授权】表示您同意本扩展能以网页端以外的鉴权向B站官方服务器证明您的身份，以执行一些本来网页端无权进行的操作。如果【解除限制】中自定义了第三方解析服务器，请仔细斟酌第三方的可信度，<strong>如无必要，切莫授权！</strong>。', "账户授权", arr)
            }
        })
    }
    /** 获取账户授权 */
    async get() {
        const msg = this.setting.accessKey.key ? toast.custom(0, "warning", "您正在更新账户授权！") : toast.custom(0, "info", "您正在进行账户授权操作！");
        try {
            // @see indefined {@link https://github.com/ipcjs/bilibili-helper/issues/632#issuecomment-642570675}
            let data: any = await fetch(urlsign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", undefined, 3), {
                credentials: "include"
            }).then(d => d.json());
            const xhr = new XMLHttpRequest();
            xhr.open("GET", data.data.confirm_uri);
            xhr.withCredentials = true;
            xhr.addEventListener("load", async () => {
                const data = urlObj(xhr.responseURL);
                this.setting.accessKey.key = data.access_key;
                this.setting.accessKey.date = timeFormat(new Date().getTime(), true);
                if (msg) {
                    msg.type = "success";
                    msg.data = ["账户授权成功~", "3秒后自动刷新页面！"];
                    msg.delay = 3;
                }
                chrome.storage.local.set(this.setting);
                setTimeout(() => location.reload(), 3e3);
            })
            xhr.addEventListener("error", e => {
                if (msg) {
                    msg.type = "success";
                    msg.data = ["账户授权出错 ಥ_ಥ", e];
                    msg.delay = 3;
                }
            })
            xhr.send();
        } catch (e) {
            if (msg) {
                msg.type = "error";
                msg.data = ["账户授权出错 ಥ_ಥ", e];
                msg.delay = 3;
            }
            debug.error("账户授权", e);
            chrome.storage.local.set(this.setting);
        }
    }
    /** 撤销账户授权 */
    async remove() {
        if (!this.setting.accessKey.key) return;
        const msg = toast.custom(0, "info", "您正在撤销账户授权！");
        this.setting.accessKey.key = "";
        this.setting.accessKey.date = "";
        if (msg) {
            msg.type = "success";
            msg.data = ["撤销授权成功~", "3秒后自动刷新页面！"];
            msg.delay = 3;
        }
        chrome.storage.local.set(this.setting);
        setTimeout(() => location.reload(), 3e3);
    }
}