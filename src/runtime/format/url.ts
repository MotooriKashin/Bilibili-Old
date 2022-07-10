export class UrlFormat {
    /** 去除参数和锚的基链接 */
    base: string = "";
    /** 查询参数转化的对象 */
    searchParams = new Proxy(<Record<string, string>>{}, {
        get: (t, p: string) => t[p] ? decodeURIComponent(t[p]) : t[p], set: (t, p: string, v) => {
            t[p] = v ? encodeURIComponent(v) : v;
            return true
        }
    });
    /** 锚 */
    hash: string = "";
    /** 锚中的参数 */
    hashParams = new Proxy(<Record<string, string>>{}, {
        get: (t, p: string) => t[p] ? decodeURIComponent(t[p]) : t[p], set: (t, p: string, v) => {
            t[p] = v ? encodeURIComponent(v) : v;
            return true
        }
    });
    /** 所有参数（包括锚中的参数）。 */
    params() {
        return new Proxy(<Record<string, string | number>>{ ...this.searchParams, ...this.hashParams }, {
            set: (t, p: string, v) => {
                t[p] = v;
                (Reflect.has(this.hashParams, p) ? this.hashParams : this.searchParams)[p] = v ? encodeURIComponent(v) : v;
                return true;
            },
            deleteProperty: (t, p: string) => {
                delete t[p];
                delete (Reflect.has(this.hashParams, p) ? this.hashParams : this.searchParams)[p];
                return true;
            }
        });
    }
    /**
     * 格式化URL
     * @param url URL字符串
     */
    constructor(url: string) {
        try {
            // 原生URL处理函数要求太严格，无法处理自定义链接
            url = new URL(url).href;
        } catch (e) { }
        const one = url.split("#"); // 分离锚
        const two = one[0].split("?"); // 分离参数
        this.base = two[0]; // 分离基链接
        one.shift();
        two.shift();
        // 参数转对象
        if (two[0]) {
            two[0].split("&").forEach(d => {
                const arr = d.split("=");
                arr[0] && (this.searchParams[<string>arr.shift()] = arr.join("="));
            });
        }
        // 锚处理
        if (one[0]) {
            const three = one[0].split("?");
            this.hash = three[0];
            three.shift();
            // 锚参数转对象
            if (three[0]) {
                three[0].split("&").forEach(d => {
                    const arr = d.split("=");
                    arr[0] && (this.searchParams[<string>arr.shift()] = arr.join("="));
                });
            }
        }
    }
    /** 拼合链接 */
    toJSON() {
        const base: string[] = []; // 基栈
        this.base && base.push(this.base); // 基链接
        // 参数
        const searchParams = Object.entries(this.searchParams).reduce((s, d) => {
            d[1] !== null && d[1] !== undefined && s.push(d.join("="));
            return s;
        }, <string[]>[]).join("&");
        searchParams && base.push(searchParams);
        const searchParam = base.join("?"); // 含参基链
        const hash: string[] = []; // 锚栈
        this.hash && hash.push(this.hash);
        const hashParams = Object.entries(this.hashParams).reduce((s, d) => {
            d[1] !== null && d[1] !== undefined && s.push(d.join("="));
            return s;
        }, <string[]>[]).join("&");
        hashParams && hash.push(hashParams);
        const hashParam = hash.join("?"); // 含参锚
        const result: string[] = []; // 结果栈
        searchParam && result.push(searchParam);
        hashParam && result.push(hashParam);
        return result.join("#");
    }
}
/**
 * 添加URL参数
 * @param url 原始URL，可带参数
 * @param obj 追加的参数，可覆盖原有参数
 * @returns 最终URL
 * @example
 * objUrl("https://www.example.com/?a=1", {a: 2, b: ""}) // https://www.example.com/?a=2&b=
 */
export function objUrl(url: string = "", obj: Record<string, string | number> = {}) {
    const result = new UrlFormat(url);
    Object.assign(result.searchParams, obj);
    return result.toJSON();
}
/**
 * 提取URL参数
 * @param url 原始URL
 * @returns 参数对象
 * @example
 * urlObj("https://www.example.com/?a=2&b=") // {a: 2, b: ""}
 */
export function urlObj(url: string = "") {
    return new UrlFormat(url).params();
}