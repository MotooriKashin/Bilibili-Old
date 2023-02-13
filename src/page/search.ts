import { urlCleaner } from '../core/url';
import { user } from '../core/user';
import html from '../html/search.html';
import { ApiSearch } from "../io/api-search";
import { addCss } from "../utils/element";
import { urlObj } from "../utils/format/url";
import { propertyHook } from "../utils/hook/method";
import { jsonpHook } from "../utils/hook/node";
import { poll } from "../utils/poll";
import { Page } from "./page";

export class PageSearch extends Page {
    constructor() {
        super(html);
        this.location();
        this.initState();
        this.updateDom();
        this.style();
        this.gat();
    }
    /** 修正URL */
    protected location() {
        // 搜索首页不应含有任何路径
        poll(() => location.href.endsWith('/all'), () => {
            urlCleaner.updateLocation(location.origin);
        }, 10, 30);
    }
    /** 新版__INITIAL_STATE__可能损坏页面 */
    protected initState() {
        propertyHook(window, "__INITIAL_STATE__", undefined);
    }
    protected style() {
        addCss(`
.home-wrap .home-form .home-suggest .hotlist {
    display: flex;
    flex-direction: column;
    width: auto;
}
.home-wrap .home-form .home-suggest .hotlist .item {
    width: auto;
}`);
    }
    /** 获取港澳台搜索数据 */
    protected gat() {
        if (user.userStatus!.searchAllArea) {
            jsonpHook.async('x/web-interface/search/all/v2?', undefined, async url => {
                const data = await new ApiSearch(decodeURIComponent(<string>urlObj(url).keyword)).getData();
                return ApiSearch.toSearchV2(data);
            }, false);
        }
    }
}