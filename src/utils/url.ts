import { bv2avAll } from "./abv";

/**
 * 不安全链接转化
 * 
 * @param url 原始url
 * @param protocol 不省略协议
 * @example
 * https('http://www.bilibili.com') // 返回 //www.bilibili.com
 * https('http://www.bilibili.com',true) // 返回 https://www.bilibili.com
 */
export function https(url: string, protocol = false) {
    return url.replace(/https?:/g, protocol ? 'https:' : '');
}

/**
 * 将字符串中的url转为超链接
 * 
 * @param text 原始字符串
 * @returns 转换结果
 */
export function string2SuperLink(text: string) {
    const COMBINED_REGEX = /((?:https?|ftp|file):\/\/[-a-z0-9+&@#/%?=~_|!:,.;]+[-a-z0-9+&@#\/%=~_|])|(av\d+)|(cv\d+)|(sm\d+)|(ss\d+)|(ep\d+)/gi;
    const fragment = document.createDocumentFragment();
    if (!text) return fragment;
    text = bv2avAll(text);
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    // 重置正则匹配索引
    COMBINED_REGEX.lastIndex = 0;
    while ((match = COMBINED_REGEX.exec(text)) !== null) {
        const matchStr = match[0];
        const matchIndex = match.index;
        // 追加匹配项之前的普通纯文本（安全转义）
        if (matchIndex > lastIndex) {
            fragment.append(document.createTextNode(text.slice(lastIndex, matchIndex)));
        }
        // 判断具体命中了哪种模式
        const [isUrl, isAv, isCv, isSm, isSs, isEp] = [match[1] !== undefined, match[2] !== undefined, match[3] !== undefined, match[4] !== undefined, match[5] !== undefined, match[5] !== undefined];

        const a = document.createElement('a')
        a.target = '_blank';
        if (isUrl) {
            a.href = matchStr;
        } else if (isAv) {
            a.href = `//www.bilibili.com/video/${matchStr}`;
        } else if (isCv) {
            a.href = `//www.bilibili.com/read/${matchStr}`;
        } else if (isSm) {
            a.href = `//www.nicovideo.jp/watch/${matchStr}`;
        } else if (isSs || isEp) {
            a.href = `//www.bilibili.com/bangumi/play/${matchStr}`;
        }
        a.text = matchStr;
        fragment.append(a.cloneNode(true));

        lastIndex = COMBINED_REGEX.lastIndex;
    }

    // 2. 补充剩余的普通文本
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    return fragment;
}