interface modules {
    /**
     * 
     */
    readonly "accesskey.js": string;
}
class Accesskey {
    access_key = GM.getValue("access_key", "");
    access_date = GM.getValue("access_date", 0);
    box: HTMLDivElement;
    enable: HTMLDivElement;
    disable: HTMLDivElement;
    foot: HTMLElement;
    num = 0;
    /**
     * 创建移动端鉴权获取面板
     */
    constructor() {
        this.box = API.element.popupbox({ maxWidth: "360px", maxHeight: "300px" });
        API.addElement("div", { style: 'text-align: center;font-size: 16px;font-weight: bold;margin-bottom: 10px;' }, this.box, `<span>账户授权<span>`);
        API.addElement("div", { style: 'margin-bottom: 10px;' }, this.box, `<div>授权代理服务器使用您的账户权限，以在限制视频等操作中继承您的大会员权益。
            <strong>这意味着第三方拥有您的账户访问权限，请充分考虑其中干系后谨慎操作！</strong>
            如果只是为了解除视频限制，以“游客”身份也一样可以获取到最高1080P的视频源，而且一般不会有大会员专享限制。
            </br>※ 鉴权有效期一般在一个月左右，若是失效需要手动重新授权，脚本不会代为检查。</div>`);
        this.box.appendChild(API.element.hr());
        const body = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;margin-bottom: 10px;" }, this.box);
        this.enable = body.appendChild(API.element.button(() => { this.access() }, "开始授权", 3));
        this.disable = body.appendChild(API.element.button(() => { this.abort() }, "取消授权", 10));
        this.box.appendChild(API.element.hr());
        this.foot = API.addElement("div", { style: "display: flex;align-items: center;justify-content: space-around;" }, this.box);
        this.flesh();
    }
    /**
     * 重新获取鉴权按钮
     */
    flesh() {
        if (this.access_key) {
            const temp = API.element.button(() => { this.access() }, "重新授权", 3);
            this.enable.replaceWith(temp);
            this.disable.style.display = "block";
            this.enable = temp;
            this.foot.innerHTML = `<div>授权状态：已授权</div><div>授权日期：${Format.timeFormat(this.access_date, true)}</div>`;
        } else {
            const temp = API.element.button(() => { this.access() }, "开始授权", 3);
            this.enable.replaceWith(temp);
            this.enable = temp;
            this.disable.style.display = "none";
            this.foot.innerHTML = `<div>授权状态：未授权</div><div> </div>`;
        }
    }
    /**
     * 请求移动端鉴权
     */
    async access() {
        if (!API.uid) return (toast.warning("请先登录！"), API.biliQuickLogin());
        toast("您正在进行账户授权操作，请稍候~")
        let data = await xhr.GM({
            url: API.urlsign("https://passport.bilibili.com/login/app/third?api=https%3A%2F%2Fwww.mcbbs.net%2Ftemplate%2Fmcbbs%2Fimage%2Fspecial_photo_bg.png", undefined, 3),
            responseType: "json"
        })
        data = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: data.data.confirm_uri,
                onload: (xhr) => resolve(xhr.finalUrl),
                onerror: (xhr) => reject(xhr),
            });
        })
        data = Format.urlObj(data);
        await new Promise((resolve: (value: void) => void, reject) => { this.pluslogin(data, resolve, reject) });
        this.access_key = data.access_key;
        this.access_date = new Date().getTime();
        GM.setValue("access_key", this.access_key);
        GM.setValue("access_date", this.access_date);
        toast.success("账户授权成功！")
        this.flesh();
    }
    /**
     * 取消移动端鉴权并清除一切数据
     */
    async abort() {
        toast("正在取消账户授权，请稍候~");
        this.access_key = "";
        this.access_date = 0;
        GM.deleteValue("access_key");
        GM.deleteValue("access_date");
        await new Promise((resolve: (value: void) => void) => {
            const iframe = document.createElement("iframe");
            iframe.setAttribute("style", "width: 0px;height: 0px;");
            iframe.src = "https://www.biliplus.com/login?act=logout";
            iframe.onload = () => {
                iframe.remove();
                resolve();
            }
            iframe.onerror = () => {
                iframe.remove();
                resolve();
            }
            document.body.appendChild(iframe);
        })
        toast.success("已取消账户授权并销毁痕迹！")
        this.flesh();
    }
    /**
     * 登录到biliplus，用于解除视频限制
     */
    pluslogin(data: any, resolve: (value: void) => void, reject: (reason?: any) => void) {
        this.num++;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("style", "width: 0px;height: 0px;");
        iframe.src = Format.objUrl("https://www.biliplus.com/login", data);
        iframe.onload = () => {
            iframe.remove();
            resolve();
        }
        iframe.onerror = ev => {
            if (this.num < 4) {
                toast.error("授权出错！将在3秒后重试~", <any>ev);
                setTimeout(() => this.pluslogin(data, resolve, reject), 3e3);
            } else {
                toast.error("重试终止！请参考控制台报错信息~");
                reject(ev);
            }
        }
        document.body.appendChild(iframe);
    }
}
new Accesskey();