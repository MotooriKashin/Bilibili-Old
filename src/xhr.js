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
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 同步链接
         * @param {string} url 
         */
>>>>>>> 2f00fde (format with JsDoc)
        false(url) {
=======
        /**
         * 同步链接
         * @param {string} url 链接url
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
        false(url, credentials = true) {
>>>>>>> 8699635 (完善xhr封装)
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = credentials;
            xhr.send(null);
            return xhr.responseText;
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 异步链接
         * @param {string} url 
         */
>>>>>>> 2f00fde (format with JsDoc)
        true(url) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
<<<<<<< HEAD
=======
        /**
         * 异步链接
         * @param {string} url 链接url
         * @param {string} [responseType] 设定服务器返回值
         * @param {object} [headers] 设定请求头键值对，注意有些属性是不可修改的
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
>>>>>>> 8699635 (完善xhr封装)
                xhr.onerror = () => {
                    toast.error("method：GET", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
=======
                xhr.onerror = () => {
                    toast.error("XMLHttpRequest 错误！", "method：GET url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
>>>>>>> 43b3ef7 (启用toast模块)
                }
                xhr.send();
            });
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * 跨域链接
         * @param {string} url 
         */
>>>>>>> 2f00fde (format with JsDoc)
        GM(url) {
=======
        /**
         * 跨域链接
         * @param {string} url 链接url
         * @param {object} [headers] 设定请求头：user-agent, referer, ...
         */
        GM(url, headers = {}) {
>>>>>>> 8699635 (完善xhr封装)
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
<<<<<<< HEAD
<<<<<<< HEAD
                    headers: headers,
                    onload: (xhr) => {
                        BLOD.GMxhrLog.push([BLOD.timeFormat(new Date()), url, (String(xhr.responseText).startsWith("{") ? JSON.parse(xhr.responseText) : xhr.responseText)]);
                        resolve(xhr.responseText);
                    },
                    onerror: (xhr) => {
                        toast.error("method：GET", "url：" + url, xhr.statusText || "");
                        reject(xhr.statusText || "xhr出错！");
=======
                    onload: (xhr) => resolve(xhr.responseText),
=======
                    onload: (xhr) => {
                        BLOD.GMxhrLog.push([BLOD.timeFormat(new Date()), url, (String(xhr.responseText).startsWith("{") ? JSON.parse(xhr.responseText) : xhr.responseText)]);
                        resolve(xhr.responseText);
                    },
>>>>>>> ef2d7cf ( 记录跨域url及返回值)
                    onerror: (xhr) => {
                        toast.error("XMLHttpRequest 错误！", "method：GET url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                        reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
>>>>>>> 43b3ef7 (启用toast模块)
                    }
                });
            })
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
        /**
         * post方法
         * @param {string} url 
         * @param {*} header 
         * @param {*} data 
         */
>>>>>>> 2f00fde (format with JsDoc)
        post(url, header, data) {
=======
        /**
         * post方法
         * @param {string} url 链接url
         * @param {object} [headers] 设定请求头，注意有些属性是不可修改的
         * @param {*} [data] 所需提交的数据，post方法专属
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
<<<<<<< HEAD
        post(url, headers = { "Content-type": "application/x-www-form-urlencoded" }, data, credentials = true) {
>>>>>>> 8699635 (完善xhr封装)
=======
        post(url, data, headers = { "Content-type": "application/x-www-form-urlencoded" }, credentials = true) {
>>>>>>> 1989337 (修复点赞功能)
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('post', url, true);
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
                xhr.onload = () => resolve(xhr.responseText);
                xhr.onerror = () => {
<<<<<<< HEAD
                    toast.error("method：POST", "url：" + url, xhr.statusText || "");
                    reject(xhr.statusText || "xhr出错！");
=======
                    toast.error("XMLHttpRequest 错误！", "method：POST url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
>>>>>>> 43b3ef7 (启用toast模块)
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