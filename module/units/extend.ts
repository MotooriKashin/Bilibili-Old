/**
 * 本模块负责拓展一些小工具，这些工具不便写在主模块中
 */
try {
    function getCookies() {
        return document.cookie.split('; ').reduce((s: { [name: string]: string }, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[key] = val;
            return s;
        }, {});
    }
    API.getCookies = () => getCookies();
    async function loginExit(referer?: string) {
        if (!API.uid) return toast.warning("本就未登录，无法退出登录！");
        toast.warning("正在退出登录...");
        let data = API.jsonCheck(await xhr({
            url: "https://passport.bilibili.com/login/exit/v2",
            data: `biliCSRF=${API.getCookies().bili_jct}&gourl=${encodeURIComponent(location.href)}`,
            method: "POST",
        }))
        if (data.status) {
            toast.success("退出登录！");
            if (referer) return location.replace(referer);
            setTimeout(() => location.reload(), 1000);
        }
    }
    API.loginExit = (referer?: string) => loginExit(referer);
    function jsonCheck(data: String | JSON) {
        let result: { [name: string]: unknown } = typeof data === "string" ? JSON.parse(data) : data;
        if ("code" in result && result.code !== 0) {
            let msg = result.msg || result.message || "";
            throw [result.code, msg];
        }
        return result;
    }
    API.jsonCheck = (data: String | JSON) => jsonCheck(data);
    function restorePlayerSetting() {
        let bilibili_player_settings = localStorage.getItem("bilibili_player_settings");
        let settings_copy = GM.getValue<{ [name: string]: any }>("bilibili_player_settings", {});
        if (bilibili_player_settings) {
            let settings = <{ [name: string]: any }>JSON.parse(bilibili_player_settings);
            if (settings?.video_status?.autopart !== "") GM.setValue<{ [name: string]: any }>("bilibili_player_settings", settings);
            else if (settings_copy) localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        } else if (settings_copy) {
            localStorage.setItem("bilibili_player_settings", JSON.stringify(settings_copy));
        }
    }
    API.restorePlayerSetting = () => restorePlayerSetting();
    function biliQuickLogin() {
        (<any>window).biliQuickLogin ? (<any>window).biliQuickLogin() : (<any>window).$ ? (<any>window).$.getScript("//static.hdslb.com/account/bili_quick_login.js", () => (<any>window).biliQuickLogin()) : false;
    }
    API.biliQuickLogin = () => biliQuickLogin();
    function getTotalTop(node: HTMLElement) {
        var sum = 0;
        do {
            sum += node.offsetTop;
            node = <HTMLElement>node.offsetParent;
        }
        while (node);
        return sum;
    }
    API.getTotalTop = (node: HTMLElement) => getTotalTop(node);
    async function saveAs(content: BufferSource | Blob | string, fileName: string, contentType: string = "text/plain") {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    API.saveAs = (content: BufferSource | Blob | string, fileName: string, contentType?: string) => saveAs(content, fileName, contentType);
    function readAs(file: File, type: "ArrayBuffer" | "DataURL" | "string" = "string", encoding?: string) {
        return new Promise((resolve: (value: ArrayBuffer | string) => void, reject) => {
            const reader = new FileReader();
            switch (type) {
                case "ArrayBuffer": reader.readAsArrayBuffer(file);
                    break;
                case "DataURL": reader.readAsDataURL(file);
                    break;
                case "string": reader.readAsText(file, encoding || 'utf-8');
                    break;
            }
            reader.onload = () => resolve(reader.result);
            reader.onerror = e => reject(e);
        })
    }
    (<any>API.readAs) = (file: File, type?: "ArrayBuffer" | "DataURL" | "string", encoding?: string) => readAs(file, type, encoding);
} catch (e) { API.trace(e, "extend.js", true) }
declare namespace API {
    /**
     * 获取当前用户cookies
     */
    function getCookies(): { [name: string]: string };
    /**
     * 代理退出登录功能
     * @param referer 退出后跳转的页面URL
     */
    function loginExit(referer?: string): Promise<void>;
    /**
     * 检查B站json接口返回值并格式化为json  
     * 对于code异常将直接抛出错误！
     * @param data 返回值字符串或者json
     */
    function jsonCheck(data: String | JSON): { [name: string]: any };
    /**
     * 修复被新版播放器数据破坏的旧版播放器设置数据
     */
    function restorePlayerSetting(): void;
    /**
     * B站快捷登录
     */
    function biliQuickLogin(): void;
    /**
     * 计算节点绝对高度，相对于文档
     * @param node 文档垂直偏移：/px
     */
    function getTotalTop(node: HTMLElement): number;
    /**
     * 保存为本地文件
     * @param content 文档内容，JSON请先转化为字符串类型
     * @param fileName 保存为文件名，需包含拓展名
     * @param contentType 文档内容的MIME类型，默认为text/plain
     */
    function saveAs(content: BufferSource | Blob | string, fileName: string, contentType?: string): Promise<void>;
    /**
     * 读取本地文件
     * @param file 本地文件File，来自type="file"的input标签，`input.files`中的元素
     * @param type 将file以特定的格式编码，默认为string，即字符串形式
     * @param encoding 字符串的编码格式，默认为utf-8，仅在type="string"时有意义
     * @returns Promise托管的文件内容
     */
    function readAs(file: File): Promise<string>;
    function readAs(file: File, type: "DataURL"): Promise<string>;
    function readAs(file: File, type: "string", encoding?: string): Promise<string>;
    function readAs(file: File, type: "ArrayBuffer"): Promise<ArrayBuffer>;
}