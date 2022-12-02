import { BLOD } from "../bilibili-old";
import { jsonCheck } from "../io/api";
import { xhrHook } from "../utils/hook/xhr";

export class PageDynamic {
    constructor(protected BLOD: BLOD) {
        this.BLOD.userLoadedCallback(status => {
            status.liveRecord || this.liveRecord();
        });
    }
    protected liveRecord() {
        xhrHook("api.bilibili.com/x/polymer/web-dynamic/v1/feed/all", undefined, r => {
            try {
                const response = jsonCheck(r.response);
                response.data.items = response.data.items.filter((d: any) => d.modules?.module_dynamic?.major?.archive?.badge?.text != "直播回放");
                r.responseType === "json" ? r.response = response : r.response = r.responseText = JSON.stringify(response);
            } catch (e) { }
        }, false);
    }
}