namespace API {
    export class AccessKey {
        /** 参数缓存 */
        static data = GM.GM_getValue("third_login");
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
                    GM.GM_xmlHttpRequest({
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
        }
    }
}