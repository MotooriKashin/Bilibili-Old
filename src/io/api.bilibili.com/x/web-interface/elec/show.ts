/** 获取充电信息 */
export async function show(
    mid: number,
    aid: bigint,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/web-interface/elec/show');
    const searchParams = new URLSearchParams(<any>{ mid, aid });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IShow; }>>response.json();
}

export interface IShow {
    total_count: number;
    list?: {
        avatar: string;
        mid: number;
        uname: string;
    }[];
}