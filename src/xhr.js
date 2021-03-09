/**
 * @module xhr
 * @description XMLHttpRequest封装
 * @author Motoori Kashin
 * @license MIT
 */
(function () {
    const BLOD = window.BLOD; /** @see main  */
    const toast = BLOD.toast; /** @see debug */

    class Xhr {
        constructor() {
            BLOD.GMxhrLog = [];
            console.debug('import module "xhr.js"');
        }
        /**
         * 同步链接
         * @param {string} url 链接url
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
        false(url, credentials = true) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = credentials;
            xhr.send(null);
            return xhr.responseText;
        }
        /**
         * 异步链接
         * @param {string} url 链接url
         * @param {string} [responseType] 设定服务器返回值
         * @param {{}} [headers] 设定请求头键值对，注意有些属性是不可修改的
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
        true(url, responseType = "text", headers = {}, credentials = true) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.responseType = responseType;
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
                xhr.onload = () => resolve(xhr.response);
                xhr.onerror = () => {
                    toast.error("method：GET", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
                }
                xhr.send();
            });
        }
        /**
         * 跨域链接
         * @param {string} url 链接url
         * @param {{}} [headers] 设定请求头：user-agent, referer, ...
         */
        GM(url, headers = {}) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: (xhr) => {
                        BLOD.GMxhrLog.push([BLOD.timeFormat(new Date()), url, (String(xhr.responseText).startsWith("{") ? JSON.parse(xhr.responseText) : xhr.responseText)]);
                        resolve(xhr.responseText);
                    },
                    onerror: (xhr) => {
                        toast.error("method：GET", "url：" + url, xhr.statusText || "");
                        reject(xhr.statusText || "xhr出错！");
                    }
                });
            })
        }
        /**
         * post方法
         * @param {string} url 链接url
         * @param {*} [data] 所需提交的数据，post方法专属
         * @param {{}} [headers] 设定请求头，注意有些属性是不可修改的
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
        post(url, data, headers = { "Content-type": "application/x-www-form-urlencoded" }, credentials = true) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('post', url, true);
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => {
                    toast.error("method：POST", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
                }
                xhr.send(data);
            });
        }
    }

    const exports = () => {
        let xhr = new Xhr();
        let makeExports = (type) => {
            return (...arg) => {
                return xhr[type](...arg);
            }
        }
        let method = makeExports("true");
        method.true = makeExports("true");
        method.false = makeExports("false");
        method.GM = makeExports("GM");
        method.post = makeExports("post");
        return method;
    }

    BLOD.xhr = exports();

})()