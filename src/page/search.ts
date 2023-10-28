import { urlCleaner } from '../core/url';
import { user } from '../core/user';
import html from '../html/search.html';
import { ApiSearch, IApiSearchAndroid } from "../io/api-search";
import { addCss } from "../utils/element";
import { urlObj } from "../utils/format/url";
import { propertyHook } from "../utils/hook/method";
import { jsonpHook } from "../utils/hook/node";
import { xhrHook } from '../utils/hook/xhr';
import { poll } from "../utils/poll";
import { timeout } from '../utils/timer';
import { Page } from "./page";

export class PageSearch extends Page {
    constructor() {
        super(html);
        this.location();
        this.initState();
        this.hotword();
        this.style();
        this.gat();
        this.rqt();
        this.updateDom();
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
            const record: Record<string, IApiSearchAndroid> = {};
            // 默认搜索
            jsonpHook('x/web-interface/search/all/v2?', undefined, (res, url) => {
                const keyword = decodeURIComponent(<string>urlObj(url).keyword);
                (keyword in record ? timeout(record[keyword]) : new ApiSearch(keyword).getData())
                    .then(data => {
                        record[keyword] = data;
                        const vue = document.querySelector<any>("#all-list > div.flow-loader")?.__vue__;
                        if (vue && data?.result?.media_bangumi.length) {
                            vue.source.result.forEach((d: any) => {
                                switch (d.result_type) {
                                    case "media_bangumi": {
                                        const arr: any[] = [].concat(d.data);
                                        const names: any[] = arr.map((d: any) => d.season_id);
                                        data.result.media_bangumi.forEach(d => {
                                            (<any>d).season_type_name = '番剧';
                                            names.includes(d.season_id) || arr.push(d);
                                        });
                                        d.data = JSON.parse(JSON.stringify(arr));
                                        break;
                                    }
                                    default:
                                        break;
                                }
                            })
                        }
                    })
                return res;
            }, false);
            // 番剧分页
            jsonpHook(['x/web-interface/search/type?', 'search_type=media_bangumi'], undefined, (res, url) => {
                const keyword = decodeURIComponent(<string>urlObj(url).keyword);
                const data = record[keyword];
                if (data?.result?.media_bangumi.length && res?.data?.result?.length) {
                    const arr: any[] = [].concat(res.data.result);
                    const names: any[] = arr.map((d: any) => d.season_id);
                    data.result.media_bangumi.forEach(d => {
                        (<any>d).season_type_name = '番剧';
                        names.includes(d.season_id) || arr.push(d);
                    });
                    res.data.result = arr;
                }
                return res;
            }, false);
        }
    }
    /** 修复搜索数据 */
    protected rqt() {
        jsonpHook('/search/all', undefined, res => {
            res.data?.result?.forEach((d: any) => {
                d.data || (d.data = []); // 各分类就算无结果也必须是数组
            });
        }, false);
    }

    protected hotword() {
        xhrHook('main/hotword?', undefined, res => {
            res.responseType = 'json';
        }, false);
    }
}