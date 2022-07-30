/** URL接口的拓展，以支持省略协议头的链接（自动补全当前所在协议头） */
export class URLEs extends URL {
    constructor(url: string | URL, base?: string | URL) {
        if (!base && typeof url === "string" && !/^[a-z]+:/.test(url)) {
            // 处理省略协议头情况
            if ((url.includes("=") && !url.includes("?")) || !/^[A-Za-z0-9]/.test(url)) {
                base = location.origin;
            } else {
                const str = url.startsWith("//") ? "" : "//";
                url = location.protocol + str + url;
            }
        }
        super(url, base);
    }
}
/**
 * 查询参数对象转URL
 * @param url 基链URL
 * @param obj 查询参数对象，将覆盖基链URL已有参数
 */
export function objUrl(url: string, obj: Record<string, string | number>) {
    const res = new URLEs(url);
    Object.entries(obj).forEach(d => {
        if (d[1] || d[1] === "") {
            res.searchParams.set(d[0], <string>d[1])
        }
    });
    return res.toJSON();
}
/**
 * 提取URL参数对象
 * @param url 原始URL
 */
export function urlObj(url: string) {
    const res = new URLEs(url);
    const result: Record<string, string | number> = {};
    res.searchParams.forEach((v, k) => { result[k] = v });
    return result;
}