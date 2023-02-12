import { Base64 } from "../../utils/base64";
import { saveAs } from "../../utils/file";
import { getMetux } from "../../utils/mutex";

export class Ef2 {
    constructor(
        private userAgent?: string,
        private referer?: string,
        private dir?: string,
        private delay = false,
        private silence = false
    ) { }
    /** 拉起IDM */
    sendLinkToIDM(data: EF2Data) {
        this.rebuildData(data);
        const ef2str = Ef2.encode(data);
        const a = document.createElement("a");
        a.href = ef2str;
        a.click();
        return ef2str;
    }
    /** 生成ef2文件 */
    file(data: EF2Data, fileName?: string) {
        this.rebuildData(data);
        return Ef2.file([data], fileName);
    }
    /** 补全数据 */
    private rebuildData(data: EF2Data) {
        this.userAgent && !data.userAgent && (data.userAgent = this.userAgent);
        this.referer && !data.referer && (data.referer = this.referer);
        this.dir && !data.dir && (data.dir = this.dir);
        this.delay && !data.delay && (data.delay = this.delay);
        this.silence && !data.silence && (data.silence = this.silence);
    }
    /** 生成ef2文件 */
    static file(data: EF2Data[], fileName?: string) {
        const result: string[] = [];
        data.forEach(d => {
            // 原生关键词排在占位
            const arr = ['<', '', '', '', ''];
            Object.entries(d).forEach(d => {
                switch (<keyof EF2Data>d[0]) {
                    case 'cookie':
                        arr[4] = `cookie: ${d[1]}`;
                        break;
                    case 'delay':
                        break;
                    case 'dir':
                        d[1] = d[1].replace(/\//, "\\"); // 目录反斜杠可能误输入为了正斜杠
                        (<string>d[1]).endsWith('\\') && (d[1] = d[1].slice(0, -1)); // 目录最后的反斜杠可能导致引号被转义
                        arr.push(`filepath: ${d[1]}`);
                        break;
                    case 'out':
                        arr.push(`filename: ${d[1]}`);
                        break;
                    case 'password':
                        arr.push(`password: ${d[1]}`);
                        break;
                    case 'body':
                        arr.push(`postdata: ${d[1]}`);
                        break;
                    case 'referer':
                        arr[2] = `referer: ${d[1]}`;
                        break;
                    case 'silence':
                        break;
                    case 'url':
                        d[1].startsWith("//") && (d[1] = 'https:' + d[1]);
                        arr[1] = d[1];
                        break;
                    case 'userAgent':
                        arr[3] = `User-Agent: ${d[1]}`;
                        break;
                    case 'userName':
                        arr.push(`username: ${d[1]}`);
                        break;
                    default:
                        break;
                }
            });
            arr.push('>');
            arr.forEach(d => {
                d && result.push(d);
            });
        });
        result.push('');
        saveAs(result.join('\r\n'), fileName || `${data[0].out || getMetux()}.ef2`)
    }
    /** 生成ef2协议 */
    static encode(data: EF2Data) {
        const arr: string[] = [];
        Object.entries(data).forEach(d => {
            (typeof d[1] === 'string' && (d[1].startsWith('"'))) || (d[1] = `"${d[1]}"`);
            switch (<keyof EF2Data>d[0]) {
                case 'cookie':
                    arr.push('-c', d[1]);
                    break;
                case 'delay':
                    arr.push('-q');
                    break;
                case 'dir':
                    d[1] = d[1].replace(/\//, "\\"); // 目录反斜杠可能误输入为了正斜杠
                    (<string>d[1]).endsWith('\\') && (d[1] = d[1].slice(0, -1)); // 目录最后的反斜杠可能导致引号被转义
                    arr.push('-o', d[1]);
                    break;
                case 'out':
                    arr.push('-s', d[1]);
                    break;
                case 'password':
                    arr.push('-P', d[1]);
                    break;
                case 'body':
                    arr.push('-d', d[1]);
                    break;
                case 'referer':
                    arr.push('-r', d[1]);
                    break;
                case 'silence':
                    arr.push('-f');
                    break;
                case 'url':
                    d[1].startsWith("//") && (d[1] = 'https:' + d[1]);
                    arr.push('-u', d[1]);
                    break;
                case 'userAgent':
                    arr.push('-a', d[1]);
                    break;
                case 'userName':
                    arr.push('-U', d[1]);
                    break;
                default:
                    break;
            }
        });
        return `ef2://${Base64.encode(arr.join(' '))}`;
    }
    /** 解码ef2协议 */
    static decode(ef2str: string) {
        ef2str = ef2str.replace("ef2://", "");
        ef2str = Base64.decode(ef2str);
        const arr = ef2str.split(' ');
        const data: Partial<EF2Data> = {};
        for (let i = 0; i < arr.length; i++) {
            if (/-\w/.test(arr[i])) {
                switch (arr[i]) {
                    case '-c':
                        data.cookie = arr[i + 1];
                        i++;
                        break;
                    case '-q':
                        data.delay = true;
                        break;
                    case '-o':
                        data.dir = arr[i + 1];
                        i++;
                        break;
                    case '-s':
                        data.out = arr[i + 1];
                        i++;
                        break;
                    case '-P':
                        data.password = arr[i + 1];
                        i++;
                        break;
                    case '-d':
                        data.body = arr[i + 1];
                        i++;
                        break;
                    case '-r':
                        data.referer = arr[i + 1];
                        i++;
                        break;
                    case '-f':
                        data.silence = true;
                        break;
                    case '-u':
                        data.url = arr[i + 1];
                        i++;
                        break;
                    case '-a':
                        data.userAgent = arr[i + 1];
                        i++;
                        break;
                    case '-U':
                        data.userName = arr[i + 1];
                        i++;
                        break;
                    default:
                        break;
                }
            }
        }
        return data;
    }
}
interface EF2Data {
    /** URL */
    url: string;
    /** 文件名（含拓展名） */
    out?: string;
    /** user-agent */
    userAgent?: string;
    /** referer */
    referer?: string;
    /** 文件保存目录 */
    dir?: string;
    /** cookies */
    cookie?: string;
    /** 用于send的参数并改用POST方法下载 */
    body?: string;
    /** 用于http身份校验的账户，与password配对 */
    userName?: string;
    /** 用于http身份校验的密钥，与userName配对 */
    password?: string;
    /** 禁用IDM下载前的询问弹窗，其中可以选择修改文件名及保存目录等信息 */
    silence?: true;
    /** 把下载链接添加到下载列表但是不立即开始下载，需要下载时再手动到IDM里开始 */
    delay?: true;
}