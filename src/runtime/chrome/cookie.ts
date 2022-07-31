
/**
 * 【后台脚本】获取cookies
 * @param str 域名匹配字符串
 */
export async function chromeCookies(str: string = "") {
    return await chrome.cookies.getAll({ domain: str });
}
/**
 * 【后台脚本】cookies序列转cookie键值对象
 * @param cookies 来自chromeAPI的cookies序列
 */
export function cookiesArr2Obj(cookies: chrome.cookies.Cookie[]) {
    return cookies.reduce((s, d) => {
        s[d.name] = d.value;
        return s;
    }, <Record<string, string>>{})
}