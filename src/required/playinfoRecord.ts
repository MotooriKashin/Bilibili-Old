/**
 * 本模块负责处理并记录playinfo信息
 */
(function () {
    API.xhrhook(["/playurl?"], function (args) {
        const obj = API.urlObj(args[1]);
        !obj.sign && obj.fnval && (obj.fnval = <any>API.fnval);
        obj.avid && Number(obj.bvid) && (API.aid = <any>obj.avid);
        obj.bvid && !API.aid && (API.aid = <number>API.abv(obj.bvid));
        obj.cid && Number(obj.cid) && (API.cid = <any>obj.cid);
        args[1] = API.objUrl(args[1], obj);
        args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8));
        args[1].includes("pgc") && (API.pgc = true);
        this.addEventListener("readystatechange", async () => record.call(this));
    })
    function record(this: XMLHttpRequest) {
        try {
            if (this.readyState === 4) {
                if (!this.response) throw this;
                API.__playinfo__ = typeof this.response == "object" ? this.response : API.jsonCheck(this.response);
            }
        } catch (e) { debug.error("playinfoRecord.js", e) }
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