// @see MDN_Web_Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
/** Base64编解码工具。 */
export const base64 = new (class {
    /**
     * Base64编码
     * @param str 原始字符串
     * @returns 编码结果
     */
    encode(str: string) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode(<any>('0x' + p1));
        }));
    }
    /**
     * Base64解码
     * @param str 原始字符串
     * @returns 解码结果
     */
    decode(str: string) {
        return decodeURIComponent(atob(str).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }
    /**
     * Base64编码
     * @param buffer Uint8Array
     * @returns 编码结果
     */
    encodeFromUint8Array(buffer: Uint8Array) {
        return btoa(String.fromCharCode(...buffer));
    }
    /**
     * Base64编码
     * @param str 
     * @returns 
     */
    decodeToUint8Array(str: string) {
        return new Uint8Array(atob(str).split('').map(d => d.charCodeAt(0)));
    }
})()
