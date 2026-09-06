import { fetch } from "../../../main/widget/fetch";

/** 获取BiliPlus缓存的CID页面信息 */
export async function view_all(
    av: number | bigint,
    init?: RequestInit,
) {
    const response = await fetch(`https://www.biliplus.com/all/video/av${av}/`, { credentials: 'include', ...init });
    const text = /\/api\/view_all\?.+?\',cloudmoe/.exec(await response.text());
    if (!text) throw new Error('未能提取到 cid 链接');
    const response2 = await fetch(`https://www.biliplus.com${text[0].slice(0, -10)}`, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IViewAll }>>response2.json();
}

export interface IViewAll {
    info: {
        author: string;
        coins: number;
        create: string;
        description: string;
        favorites: number;
        keywords?: string;
        mid: number;
        pic: string;
        play: number;
        title: string;
        video_review: number;
    };
    parts: {
        cid: number;
        page: number;
        part: string;
    }[];
}