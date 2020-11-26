/*
 * module "xhr.js"
 */
(function () {
    const BLOD = window.BLOD;

    class Xhr {
        constructor() {
            console.log('import module "xhr.js"');
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
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
                xhr.send();
            });
        }
        GM(url) {
            return new Promise((resolve, reject) => {
                BLOD.xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: (xhr) => resolve(xhr.responseText),
                    onerror: (xhr) => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT"),
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
                xhr.onerror = () => reject(xhr.statusText || url + " net::ERR_CONNECTION_TIMED_OUT");
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