namespace API {
    export class AccessKey {
        /** 参数缓存 */
        static data = GM.getValue("third_login");
        /** 临时禁用操作 */
        static disable = false;
        /** 获取账户授权 */
        static async get() {
            if (!uid) return (toast.warning("请先登录！"), biliQuickLogin());
            const msg = config.accessKey.key ? toast.custom(0, "warning", "您正在更新账户授权！") : toast.custom(0, "info", "您正在进行账户授权操作！");
            try {
                let data = await xhr.GM({ // @see indefined {@link https://github.com/ipcjs/bilibili-helper/issues/632#issuecomment-642570675}
                    url: urlsign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", undefined, 3),
                    responseType: "json"
                })
                data = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: data.data.confirm_uri,
                        onload: (xhr) => resolve(xhr.finalUrl), // 重定向后的url才是目标
                        onerror: (xhr) => reject(xhr),
                    });
                })
                this.data = data = urlObj(data);
                config.accessKey.key = data.access_key;
                config.accessKey.date = timeFormat(new Date().getTime(), true);
                const key = getSetting<"button">("accessKey.action");
                key.label = "撤销授权";
                key.button = "撤销";
                if (msg) {
                    msg.type = "success";
                    msg.data = ["账户授权成功~"];
                    msg.delay = 3;
                }
            } catch (e) {
                if (msg) {
                    msg.type = "error";
                    msg.data = ["账户授权出错 ಥ_ಥ", e];
                    msg.delay = 3;
                }
                debug.error("账户授权", e);
            }
        }
        /** 撤销账户授权 */
        static async remove() {
            if (!config.accessKey.key) return;
            const msg = toast.custom(0, "info", "您正在撤销账户授权！");
            config.accessKey.key = "";
            config.accessKey.date = "";
            const key = getSetting<"button">("accessKey.action");
            key.label = "授权操作";
            key.button = "授权";
            if (msg) {
                msg.type = "success";
                msg.data = ["撤销授权成功~"];
                msg.delay = 3;
            }
            if (config.accessKey.biliplus) config.accessKey.biliplus = false;
        }
        /** 登录biliplus */
        static async login() {
            if (!config.accessKey.key) {
                toast.warning("您必须先进行账户授权操作才能使用本功能！");
                this.disable = true;
                return config.accessKey.biliplus = false;
            }
            const msg = toast.custom(0, "info", "您正常授权Biliplus登录~");
            const iframe = document.createElement("iframe");
            iframe.setAttribute("style", "width: 0px;height: 0px;");
            iframe.src = objUrl("https://www.biliplus.com/login", <any>AccessKey.data);
            iframe.onload = () => {
                iframe.remove();
                if (msg) {
                    msg.type = "success";
                    msg.data = ["成功授权Biliplus登录~"];
                    msg.delay = 3;
                }
            }
            iframe.onerror = ev => {
                iframe.remove();
                if (msg) {
                    msg.type = "error";
                    msg.data = ["授权Biliplus登录失败~"];
                    msg.delay = 3;
                }
                debug.error("授权Biliplus登录", ev);
                alert("是否重试？", "授权Biliplus登录", [
                    {
                        name: "是",
                        callback: () => { this.login() }
                    },
                    {
                        name: "否",
                        callback: () => { }
                    }
                ]);
            }
            document.body.appendChild(iframe);
        }
        /** 撤销biliplus登录 */
        static async checkout() {
            if (this.disable) {
                return this.disable = false;
            }
            const msg = toast.custom(0, "info", "您正常撤销Biliplus登录~");
            const iframe = document.createElement("iframe");
            iframe.setAttribute("style", "width: 0px;height: 0px;");
            iframe.src = "https://www.biliplus.com/login?act=logout";
            iframe.onload = () => {
                iframe.remove();
                if (msg) {
                    msg.type = "success";
                    msg.data = ["成功撤销Biliplus登录~", "Token也一并失效，如需恢复，请重新授权！"];
                    msg.delay = 3;
                }
                this.remove();
            }
            iframe.onerror = ev => {
                iframe.remove();
                if (msg) {
                    msg.type = "error";
                    msg.data = ["撤销Biliplus登录失败~"];
                    msg.delay = 3;
                }
                debug.error("撤销Biliplus登录", ev);
                alert("是否重试？", "撤销Biliplus登录", [
                    {
                        name: "是",
                        callback: () => { this.checkout() }
                    },
                    {
                        name: "否",
                        callback: () => { }
                    }
                ]);
            }
            document.body.appendChild(iframe);
        }
    }
}