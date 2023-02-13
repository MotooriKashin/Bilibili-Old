import html from '../html/playlist-detail.html';
import { Page } from "./page";
import toview from '../json/toview.json';
import { webpackHook } from "../utils/hook/webpack";
import { urlCleaner } from '../core/url';
import { toast } from '../core/toast';

export class PagePlaylistDetail extends Page {
    constructor() {
        super(html);
        this.__INITIAL_STATE__();
        this.updateDom();
        this.ancientHeader();
    }
    /** 移除上古顶栏 */
    protected ancientHeader() {
        webpackHook(499, 446, () => `()=>{}`);
    }
    private __INITIAL_STATE__() {
        urlCleaner.updateLocation('https://www.bilibili.com/playlist/detail/pl769');
        (<any>window).__INITIAL_STATE__ = {
            mid: toview.mid, pid: toview.pid, plinfoData: {
                attr: toview.attr,
                count: toview.count,
                cover: toview.cover,
                ctime: toview.ctime,
                description: toview.description,
                favored: toview.favored,
                id: toview.id,
                is_favorite: toview.is_favorite,
                mid: toview.mid,
                mtime: toview.mtime,
                owner: toview.owner,
                pid: toview.pid,
                stat: toview.stat,
                state: toview.state,
                type: toview.type
            }, pllistData: toview.list
        };
        window.addEventListener('load', () => {
            toast.warning('播单详情页面已不存在，这里显示的是缓存的播单 769 的数据。');
        }, { once: true });
    }
}