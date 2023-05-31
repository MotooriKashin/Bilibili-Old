export class Curl {
    constructor(
        private userAgent?: string,
        private referer?: string,
        private dir?: string,
    ) { }
    /** 命令行 */
    cmdlet(data: ICurlData) {
        const arr = ['curl', '-C', '-', `"${data.url}"`];
        data.out && arr.push('-o', `"${data.out}"`);
        (data.userAgent || this.userAgent) && arr.push('--user-agent', `"${data.userAgent || this.userAgent}"`);
        (data.referer || this.referer) && arr.push('--referer', `"${data.referer || this.referer}"`);
        (data.dir || this.dir) && arr.push('--output-dir', `"${data.dir || this.dir}"`);
        data.header && Object.entries(data.header).forEach(d => arr.push('-H', `"${d[0]}: ${d[1]}"`));
        return navigator.clipboard.writeText(arr.join(' '))
    }
}
interface ICurlData {
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
    /** 附加的HTTP请求头组 */
    header?: Record<string, string>;
}