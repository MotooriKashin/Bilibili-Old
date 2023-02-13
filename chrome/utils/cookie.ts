/**
 * 提权获取cookies
 * @param url 匹配域名
 */
export async function getCookie(url = "") {
    return await chrome.cookies.getAll({ domain: url });
}