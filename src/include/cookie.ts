interface modules {
    /** cookies库 */
    readonly "cookie.js": string;
}
namespace API {
    /**
     * 获取cookie对象
     * @returns 名称: 值
     */
    export function getCookies() {
        return document.cookie.split('; ').reduce((s, d) => {
            let key = d.split('=')[0];
            let val = d.split('=')[1];
            s[key] = unescape(val);
            return s;
        }, <Record<string, string>>{});
    }
    /**
     * 添加cookie
     * @param name 名称
     * @param value 值
     * @param days 有效期：/天
     */
    export function setCookie(name: string, value: string, days = 365) {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString() + '; path=/; domain=.bilibili.com';
    }
}