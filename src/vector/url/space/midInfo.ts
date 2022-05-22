interface modules {
    /** 限制访问账号 */
    readonly "midInfo.js": string;
    /** 备份的uid信息，可能需要偶尔更新一下？ */
    readonly "mid.json": Record<string, any>;
}
namespace API {
    const response = getModule("mid.json");
    response.data.mid = mid;
    switch (Number(mid)) {
        case 11783021: response.data.name = "哔哩哔哩番剧出差";
            response.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
            break;
        case 1988098633: response.data.name = "b站_戲劇咖";
            response.data.official.desc = "b站_戲劇咖 官方帐号";
            break;
        case 2042149112: response.data.name = "b站_綜藝咖";
            response.data.official.desc = "b站_綜藝咖 官方帐号";
            break;
    }
    xhrhook("api.bilibili.com/x/space/acc/info", undefined, obj => {
        if (obj.responseText && obj.responseText.includes("-404")) {
            obj.response = obj.responseText = JSON.stringify(response);
            toast.warning("该用户被404，已使用缓存数据恢复访问！")
        }
    }, false);
}