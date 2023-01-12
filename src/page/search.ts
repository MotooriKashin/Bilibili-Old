import { BLOD } from "../bilibili-old";
import html from '../html/search.html';
import { propertyHook } from "../utils/hook/method";
import { poll } from "../utils/poll";
import { Page } from "./page";

export class PageSearch extends Page {
    constructor(protected BLOD: BLOD) {
        super(html);
        this.location();
        this.initState();
        this.updateDom();
    }
    /** 修正URL */
    protected location() {
        // 搜索首页不应含有任何路径
        poll(() => location.href.endsWith('/all'), () => {
            this.BLOD.urlCleaner.updateLocation(location.origin);
        }, 10, 30);
    }
    /** 新版__INITIAL_STATE__可能损坏页面 */
    protected initState() {
        propertyHook(window, "__INITIAL_STATE__", undefined);
    }
}