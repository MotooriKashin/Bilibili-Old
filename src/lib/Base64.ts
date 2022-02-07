interface modules {
    /**
     * Base64编解码工具  
     * @see MDN_Web_Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
     */
    readonly "Base64.js": string;
}
class Base64 {
    /**
     * Base64编码
     * @param str 原始字符串
     * @returns 编码结果
     */
    static encode(str: string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(<any>('0x' + p1));
        }));
    }
    /**
     * Base64解码
     * @param str 原始字符串
     * @returns 解码结果
     */
    static decode(str: string) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
}
API.base64 = Base64;
declare namespace API {
    export let base64: typeof Base64;
}