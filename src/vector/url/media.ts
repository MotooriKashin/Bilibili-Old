interface modules {
    /** media页面 */
    readonly "media.js": string;
}
namespace API {
    // 解除限制
    xhrhook("user/status", undefined, res => {
        try {
            const result = jsonCheck(res.response);
            result.result.area_limit = 0;
            result.result.ban_area_show = 0;
            res.responseType === "json" ? res.response = result : res.response = res.responseText = JSON.stringify(result);
        } catch (e) { }
    }, false)
}