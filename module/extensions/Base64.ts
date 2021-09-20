/**
 * 本模块负责提供Base64<=>字符串的互转函数
 * 本模块核心代码直接来源如下
 * @see MDN Web Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
 */
(function () {
    try {
        class Base64 {
            static encode(str: string) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode(<any>('0x' + p1));
                }));
            }
            static decode(str: string) {
                return decodeURIComponent(atob(str).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
        }
        API.Base64 = {
            encode: (str: string) => Base64.encode(str),
            decode: (str: string) => Base64.decode(str)
        }
    } catch (e) { API.trace(e, "base64.js", true) }
})();
declare namespace API {
    /**
     * Base64编解码工具
     */
    let Base64: {
        /**
         * 编码：字符串 => Base64
         * @param str 字符串
         * @returns Base64
         */
        encode(str: string): string;
        /**
         * 解码：Base64 => 字符串
         * @param str 
         */
        decode(str: string): string;
    }
}