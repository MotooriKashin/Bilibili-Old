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
            console.debug('import module "xhr.js"');
        }
        false(url) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.withCredentials = true;
            xhr.send(null);
            return xhr.responseText;
        }
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
        GM(url) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (xhr) => resolve(xhr.responseText),
                    onerror: (xhr) => {
                        toast.error("XMLHttpRequest 错误！", "method：GET", "url：" + url, xhr.statusText || "net::ERR_CONNECTION_TIMED_OUT");
                        reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                    }
                });
            })
        }
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
        function makeExports(type){
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