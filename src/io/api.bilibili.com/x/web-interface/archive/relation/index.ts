/** 获取是否点赞等数据 */
export async function relation(
    aid: bigint,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/web-interface/archive/relation');
    const searchParams = new URLSearchParams(<any>{ aid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IRelation; }>>response.json();
}

export interface IRelation {
    attention: boolean;
    coin: number;
    dislike: boolean;
    favorite: boolean;
    like: boolean;
    season_fav: boolean;
}