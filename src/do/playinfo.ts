interface modules {
    /** 视频源修复及记录 */
    readonly "playinfo.js": string;
}
namespace API {
    xhrhook("/playurl?", args => {
        args[1].includes("84956560bc028eb7") && (args[1] = urlsign(args[1], {}, 8)); // 修复失效的appid
        args[1].includes("pgc") && (pgc = true); // ogv视频
    }, async obj => {
        try {
            __playinfo__ = obj.responseType === "json" ? obj.response : jsonCheck(obj.response);
        } catch (e) { }
    }, false)
}
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