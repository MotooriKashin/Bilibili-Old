/**
 * 本模块负责提供Base64<=>字符串的互转函数
 * 本模块核心代码直接来源如下
 * @see MDN Web Docs {@link https://developer.mozilla.org/en-US/docs/Glossary/Base64}
 */
(function () {
    try {
        class Base64 {
            static encode(str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode(('0x' + p1));
                }));
            }
            static decode(str) {
                return decodeURIComponent(atob(str).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            }
        }
        API.Base64 = {
            encode: (str) => Base64.encode(str),
            decode: (str) => Base64.decode(str)
        };
    }
    catch (e) {
        API.trace(e, "base64.js", true);
    }
})();
