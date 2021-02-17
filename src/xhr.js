/*
 * @module "xhr.js"
 * @description xhr封装，以xhr对象挂载在BLOD下
 * @method xhr/xhr.true [异步请求] || xhr.false [同步请求] || xhr.GM [跨域请求] || xhr.post [表单请求]
 */
(function () {
    const BLOD = window.BLOD;
    const toast = BLOD.toast;

    class Xhr {
        constructor() {
            BLOD.GMxhrLog = [];
            console.debug('import module "xhr.js"');
        }
<<<<<<< HEAD
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
        true(url) {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('get', url, true);
                xhr.withCredentials = true;
                xhr.onload = () => resolve(xhr.responseText);
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
                    toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                    reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                }
                xhr.send();
            });
        }
<<<<<<< HEAD
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
                    headers: headers,
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
<<<<<<< HEAD
        post(url, header, data) {
=======
        /**
         * post方法
         * @param {string} url 链接url
         * @param {object} [headers] 设定请求头，注意有些属性是不可修改的
         * @param {*} [data] 所需提交的数据，post方法专属
         * @param {boolean} [credentials] 设定是否携带cookies，默认为 true
         */
        post(url, headers = { "Content-type": "application/x-www-form-urlencoded" }, data, credentials = true) {
>>>>>>> 8699635 (完善xhr封装)
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open('post', url, true);
                for (let key in headers) if (key && headers[key]) xhr.setRequestHeader(key, headers[key]);
                xhr.withCredentials = credentials;
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
        function makeExports(type) {
            return function (...msg) {
                return xhr[type](...msg);
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