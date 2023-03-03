/**
 * 不安全链接转化
 * @param url 原始url
 * @param protocol 不省略协议
 * @example
 * https('http://www.bilibili.com') // 返回 //www.bilibili.com
 * https('http://www.bilibili.com',true) // 返回 https://www.bilibili.com
 */
export function https(url: string, protocol = false) {
    return url.replace('http://', protocol ? 'https://' : '//');
}