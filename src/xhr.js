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
         * @param {string} url 
         */
        false(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            return xhr.responseText;
        }
        /**
         * 异步链接
         * @param {string} url 
         */
        true(url) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => {
                    toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                }
                xhr.send();
            });
        }
        /**
         * 跨域链接
         * @param {string} url 
         */
        GM(url) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (xhr) => {
                        BLOD.GMxhrLog.push([BLOD.timeFormat(new Date()), url, (String(xhr.responseText).startsWith("{") ? JSON.parse(xhr.responseText) : xhr.responseText)]);
                        resolve(xhr.responseText);
                    },
                    onerror: (xhr) => {
                        toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                        reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                    }
                });
            })
        }
        /**
         * post方法
         * @param {string} url 
         * @param {*} header 
         * @param {*} data 
         */
        post(url, header, data) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                header = header || "application/x-www-form-urlencoded";
                xhr.open('post', url, true);
                xhr.setRequestHeader("Content-type", header);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => {
                    toast.error("XMLHttpRequest 错误！", "method：POST", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
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