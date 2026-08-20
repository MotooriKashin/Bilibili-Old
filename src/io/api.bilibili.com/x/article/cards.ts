/** 获取卡片信息 */
export async function cards(
    param: ICardsIn,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/article/cards');
    const searchParams = new URLSearchParams(<any>{
        ids: Object.entries(param).map(([key, value]) => (Array.isArray(value) ? value : [value]).map(v => key + v).join(',')).join(',')
    });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: Record<string, ICardAv | ICardBangumi> }>>response.json();
}

interface ICardsIn {
    /** av页获取不了分P信息 */
    av?: number | bigint | number[] | bigint[],
    /** Bangumi基本没法用，因为获取不了 ep 信息 */
    ss?: number | bigint | number[] | bigint[],
    /** Bangumi基本没法用，因为获取不了 ep 信息 */
    ep?: number | bigint | number[] | bigint[],
};

export interface ICardAv {
    cid: number;
    copyright: number;
    ctime: number;
    desc: string;
    duration: number;
    owner: {
        face: string;
        mid: number;
        name: string;
    };
    pic: string;
    pubdate: number;
    rights: { no_reprint: number; };
    stat: {
        coin: number;
        danmaku: number;
        favorite: number;
        his_rank: number;
        like: number;
        share: number;
        view: number;
    };
    tid: number;
    title: string;
}

export interface ICardBangumi {
    cover: string;
    follow_count: number;
    play_count: number;
    rating: {
        count: number;
        score: number;
    };
    season_id: number;
    season_type: number;
    title: string;
}