/**
 * 本模块负责处理并记录playinfo信息
 */
(function () {
    API.xhrhook(["/playurl?"], function (args) {
        let obj: any = API.urlObj(args[1]);
        !obj.sign && (obj.fourk = 1, obj.fnval = obj.fnval ? 80 : null); // 4k支持
        args[1] = API.objUrl(args[1].split("?")[0], obj); // 还原URL
        args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8)); // 过滤无效key
        args[1].includes("pgc") && (API.pgc = true);
        this.addEventListener("readystatechange", async () => record.call(this));
    })
    function record(this: XMLHttpRequest) {
        try {
            if (this.readyState === 4) {
                if (!this.response) throw this;
                API.__playinfo__ = typeof this.response == "object" ? this.response : API.jsonCheck(this.response);
            }
        } catch (e) { API.trace(e, "playinfoRecord.js") }
    }
})();
declare namespace API {
    /**
     * __playinfo__
     */
    let __playinfo__: any;
    /**
     * bangumi视频标记
     */
    let pgc: boolean;
}