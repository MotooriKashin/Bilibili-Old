interface modules {
    /**
     * 视频源修复及记录
     */
    readonly "playinfo.js": string;
}
API.xhrhook("/playurl?", args => {
    const obj = Format.urlObj(args[1]);
    !obj.sign && obj.fnval && (obj.fnval = <any>API.fnval);
    obj.avid && Number(obj.bvid) && (API.aid = <any>obj.avid);
    obj.bvid && !API.aid && (API.aid = <number>API.abv(obj.bvid));
    obj.cid && Number(obj.cid) && (API.cid = <any>obj.cid);
    args[1] = Format.objUrl(args[1], obj);
    args[1].includes("84956560bc028eb7") && (args[1] = API.urlsign(args[1], {}, 8));
    args[1].includes("pgc") && (API.pgc = true);
}, async obj => {
    try {
        API.__playinfo__ = typeof obj.response == "object" ? obj.response : API.jsonCheck(obj.response);
    } catch (e) { }
}, false)
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