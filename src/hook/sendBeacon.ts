/**
 * 本模块负责拦截B站日志上报  
 */
(function () {
    try {
        let sendBeacon = Navigator.prototype.sendBeacon;
        Navigator.prototype.sendBeacon = function (url: string, data?: BodyInit | null) {
            if (url.includes("data.bilibili.com")) return true;
            else return sendBeacon.call(this, url, data);
        }
        // xhrhook的部分
        API.xhrhook(["data.bilibili.com"], function (args) { this.send = () => true });
        API.xhrhook(["data.bilivideo.com"], function (args) { this.send = () => true });
    } catch (e) { toast.error("sendBeacon.js", e) }
})();