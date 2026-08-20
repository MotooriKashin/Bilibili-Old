/** 获取稍后再看 */
export async function web(
    ps = 6,
    init?: RequestInit,
) {
    const url = new URL('https://api.bilibili.com/x/v2/history/toview/web');
    const searchParams = new URLSearchParams(<any>{ ps });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; message: string; data: IWeb; }>>response.json();
}

interface IWeb {
    list: {
        aid: number;
        title: string;
    }[];
}