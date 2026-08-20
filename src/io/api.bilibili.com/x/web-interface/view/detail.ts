/** 获取页面详情 */
export async function detail(
    aid: number | bigint | string,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/web-interface/view/detail');
    const searchParams = new URLSearchParams(<any>{ aid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IDetail; }>>response.json();
}

export interface IDetail {
    View: {
        title: string;
        tid: number;
        pubdate: number;
        stat: {
            view: number;
            danmaku: number;
            his_rank: number;
            like: number;
            coin: number;
            favorite: number;
            share: number;
        };
        owner: {
            face: string;
            name: string;
            mid: number;
        };
        mission_id?: number;
        rights: {
            no_reprint: number;
        };
        desc: string;
        cid?: number;
        pages?: {
            cid: number;
            part: string;
            page: number;
        }[];
        copyright: number;
        redirect_url?: string;
    };
    Card: {
        card: {
            sign: string;
        };
        archive_count: number;
        follower: number;
    };
    Tags: ITag[];
    Related: IRelated[];
}

export interface ITag {
    tag_name: string;
    jump_url?: string;
}

export interface IRelated {
    aid: number;
    title: string;
    pic: string;
    duration: number;
    owner: { name: string };
    stat: { view: number; danmaku: number; };
}