import { xhrhook } from "../../runtime/hook/xhr";
import { toast } from "../../runtime/toast/toast";
import json from "./mid.json";

/** 修复被禁mid空间 */
export function midInfo(mid: number) {
    json.data.mid = mid;
    switch (Number(mid)) {
        case 11783021: json.data.name = "哔哩哔哩番剧出差";
            json.data.official.desc = "哔哩哔哩番剧出差 官方帐号";
            break;
        case 1988098633: json.data.name = "b站_戲劇咖";
            json.data.official.desc = "b站_戲劇咖 官方帐号";
            break;
        case 2042149112: json.data.name = "b站_綜藝咖";
            json.data.official.desc = "b站_綜藝咖 官方帐号";
            break;
    }
    xhrhook("api.bilibili.com/x/space/acc/info", undefined, obj => {
        if (obj.responseText && obj.responseText.includes("-404")) {
            obj.response = obj.responseText = JSON.stringify(json);
            toast.warning("该用户被404，已使用缓存数据恢复访问！")
        }
    }, false);
}