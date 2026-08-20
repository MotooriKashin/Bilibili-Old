/** 获取播放流 */
export async function nav(
    update_baseline: bigint | string = '',
    offset: bigint | string = '',
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/nav');
    const searchParams = new URLSearchParams(<any>{ update_baseline, offset });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: INav; }>>response.json();
}

interface INav {
    has_more: boolean;
    offset: string;
    update_baseline: string;
    items: {
        id_str: string;
        jump_url: string;
        title: string;
        cover: string;
        author: {
            mid: string;
            name: string;
        };
    }[];
}