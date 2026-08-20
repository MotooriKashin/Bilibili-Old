import { fetch } from "../../../main/widget/fetch";

/** 获取BiliPlus缓存的页面信息 */
export async function view(
    id: number | bigint,
    init?: RequestInit,
) {
    const url = new URL('https://www.biliplus.com/api/view');
    const searchParams = new URLSearchParams(<any>{ id });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<IView>>response.json();
}
export interface IView {
    code: number;
    message: string;
    lastupdatets: number;
    title: string;
    description: string;
    pic: string;
    tid: number;
    created: number;
    author: string;
    mid: number;
    play: number;
    coins: number;
    video_review: number;
    favorites: number;
    tag: string;
    list: {
        page: number;
        cid: number;
        part: string;
    }[];
    v2_app_api?: {
        ctime: number;
        desc: string;
        owner: {
            mid: number;
            name: string;
        };
        pic: string;
        stat: {
            view: number;
            danmaku: number;
            favorite: number;
            coin: number;
        };
        tag: { tag_name: string }[];
        tid: number;
        title: string;
    };
}