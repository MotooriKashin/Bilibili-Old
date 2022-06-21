
/**
 * 获取cookies **内容脚本中不可用**
 * @param str 域名匹配字符串
 */
export async function chromeCookies(str: string = "") {
    const cookies = await chrome.cookies.getAll({});
    return cookies.filter(d => d.domain.includes(str))
}
/**
 * cookies序列转cookie键值对象
 * @param cookies 来自chromeAPI的cookies序列
 */
export function cookiesArr2Obj(cookies: chrome.cookies.Cookie[]) {
    return cookies.reduce((s, d) => {
        s[d.name] = d.value;
        return s;
    }, <Record<string, string>>{})
}