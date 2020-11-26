/*
 * module "debug.js"
 */
(function () {
    const BLOD = window.BLOD;

    class Debug {
        constructor() {
            console.log('import module "debug.js"');
        }
        log(...msg) {
            console.log("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        error(...msg){
            console.error("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        warn(...msg) {
            console.warn("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        debug(...msg) {
            console.debug("[" + BLOD.timeFormat(new Date()) + "]", ...msg);
        }
        msg(...msg) {
            let node = document.getElementsByClassName("bilibili-player-video-toast-bottom")[0];
            let time = 1 * msg[2] || 3000;
            if (!node) {
                this.log(...msg);
                return;
            }
            msg.forEach((d) => { d = typeof d == "object" ? "" : d });
            msg[2] = 1 * msg[2] ? "" : msg[2];
            let item = document.createElement("div");
            node.children[0] ? node.children[0].replaceWith(item) : node.appendChild(item);
            item.setAttribute("class", "bilibili-player-video-toast-item bilibili-player-video-toast-pay");
            item.innerHTML = '<div class="bilibili-player-video-toast-item-text"><span class="video-float-hint-text"></span><span class="video-float-hint-btn hint-red"></span><span class="video-float-hint-btn"></span></div>';
            msg[0] ? item.children[0].children[0].innerHTML = msg[0] : "";
            msg[1] ? item.children[0].children[1].innerHTML = msg[1] : "";
            msg[2] ? item.children[0].children[2].innerHTML = msg[2] : item.children[0].children[2].remove();
            setTimeout(() => item.remove(), time);
        }
    }

    const exports = () => {
        let debug = new Debug();
        function makeExports(type){
            return function (...msg) {
                return debug[type](...msg);
            }
        }
        let method = makeExports("log");
        method.log = makeExports("log");
        method.error = makeExports("error");
        method.warn = makeExports("warn");
        method.debug = makeExports("debug");
        method.msg = makeExports("msg");
        return method;
    }
    
    BLOD.debug = exports();

})()