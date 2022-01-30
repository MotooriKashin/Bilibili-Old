/**
 * 本模块负责处理并记录playinfo信息
 */
(function () {
    API.xhrhook(["/playurl?"], function (args) {
        const obj = new URL(args[1]);
        if (!obj.searchParams.has("sign")) {
            obj.searchParams.set("fourk", "1");
            obj.searchParams.has("fnval") && obj.searchParams.set("fnval", String(API.fnval));
        }
        if (obj.searchParams.has("avid")) {
            Number(obj.searchParams.get("avid")) && (API.aid = Number(obj.searchParams.get("avid")));
        }
        if (obj.searchParams.has("bvid")) {
            !API.aid && (API.aid = <number>API.abv(obj.searchParams.get("bvid")));
        }
        if (obj.searchParams.has("cid")) {
            Number(obj.searchParams.get("cid")) && (API.cid = Number(obj.searchParams.get("cid")));
        }
        args[1] = obj.toJSON();
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