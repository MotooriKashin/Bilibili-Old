import { Base64 } from "../lib/base64";
import { setting } from "../setting";

export interface EF2Data {
    /** URL */
    url: string;
    /** 文件名（含拓展名） */
    out?: string;
    /** user-agent */
    userAgent?: string;
    /** referer */
    referer?: string;
    /** 文件保存目录 */
    directory?: string;
    /** cookies */
    cookies?: string;
    /** 用于send的参数并改用POST方法下载 */
    postDate?: string;
    /** 用于http身份校验的账户，与password配对 */
    userName?: string;
    /** 用于http身份校验的密钥，与userName配对 */
    password?: string;
    /** 禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息 */
    toastDisabled?: true;
    /** 把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始 */
    sendToList?: true;
}
class Ef2 {
    setting: Partial<EF2Data> = {};
    constructor() {
        if (!setting) return;
        setting.IDM.wait && (this.setting.sendToList = setting.IDM.wait);
        setting.IDM.silence && (this.setting.toastDisabled = setting.IDM.silence);
        setting.userAgent && (this.setting.userAgent = setting.userAgent);
        setting.referer && (this.setting.referer = setting.referer);
        setting.filepath && (this.setting.directory = setting.filepath);
    }
    /**
     * 发送下载数据到IDM
     * @param data 配置IDM
     */
    sendLinkToIDM(data: EF2Data) {
        data = { ...this.setting, ...data };
        const a = document.createElement("a");
        a.href = this.encode(data);
        a.click();
    }
    /**
     * 编码ef2协议
     * @param data 配置数据
     * @returns ef2协议
     */
    encode(data: EF2Data) {
        let result = "";
        Object.keys(data).forEach(d => {
            switch (<keyof EF2Data>d) {
                case "cookies": result += ` -c "${data.cookies}"`;
                    break;
                case "directory": data.directory = (<any>data).directory.replace(/\//, "\\"); // 目录反斜杠可能误输入为了正斜杠
                    data.directory && data.directory[data.directory.length - 1] == "\\" && (data.directory = data.directory.substr(0, data.directory.length - 1)); // 目录最后的反斜杠可能导致引号被转义 
                    result += ` -o "${data.directory}"`;
                    break;
                case "out": result += ` -s "${data.out}"`;
                    break;
                case "password": result += ` -P "${data.password}"`;
                    break;
                case "postDate": result += ` -d "${data.postDate}"`;
                    break;
                case "referer": result += ` -r "${data.referer}"`;
                    break;
                case "sendToList": result += ` -q`;
                    break;
                case "toastDisabled": result += ` -f`;
                    break;
                case "url": data.url.startsWith("//") && (data.url = "https:" + data.url); // 省略协议头时默认添加http/tls头
                    result += ` -u "${data.url}"`;
                    break;
                case "userAgent": result += ` -a "${data.userAgent}"`;
                    break;
                case "userName": result += ` -U "${data.userName}"`;
                    break;
            }
        })
        result && result.startsWith(" ") && (result = result.substr(1, result.length));
        return "ef2://" + Base64.encode(result);
    }
    /**
     * 解码ef2链接为
     * @param ef2ptl 
     * @returns ef2配置信息
     */
    decode(ef2ptl: string) {
        ef2ptl = ef2ptl.replace("ef2://", "");
        ef2ptl = Base64.decode(ef2ptl) + " ";
        const key = <RegExpMatchArray>ef2ptl.match(/-\w /g);
        const value = ef2ptl.split(/-\w /);
        value.shift();
        return <EF2Data>Array.from(key).reduce((s: Partial<EF2Data>, d, i) => {
            value[i] && value[i].endsWith(" ") && (value[i] = value[i].substr(0, value[i].length - 1));
            value[i] && value[i].endsWith("\"") && (value[i] = value[i].substr(1, value[i].length - 2));
            switch (d) {
                case "-c ": s.cookies = value[i];
                    break;
                case "-o ": s.directory = value[i];
                    break;
                case "-s ": s.out = value[i];
                    break;
                case "-P ": s.password = value[i];
                    break;
                case "-d ": s.postDate = value[i];
                    break;
                case "-r ": s.referer = value[i];
                    break;
                case "-q ": s.sendToList = true;
                    break;
                case "-f ": s.toastDisabled = true;
                    break;
                case "-u ": s.url = value[i];
                    break;
                case "-a ": s.userAgent = value[i];
                    break;
                case "-U ": s.userName = value[i];
                    break;
            }
            return s;
        }, {});
    }
}
/**
 * ef2工具
 */
export const ef2 = new Ef2();